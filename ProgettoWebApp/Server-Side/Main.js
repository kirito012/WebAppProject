let express = require("express");
let bodyParser = require("body-parser");
let session = require('express-session');
let path = require('path');
let mysql = require("mysql");
let mqtt = require("mqtt");
let Functions = require("./Modules/FunctionModule");

let connectUrl = "mqtt://localhost:1883"
let app = express()
let jsonParser = bodyParser.json()
let urlencodedParser = bodyParser.urlencoded({ extended: false })
let port = 8081
let usersTopics = {};

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Olivetti1",
  database: "utenti",
  multipleStatements: true
});

const client = mqtt.connect(connectUrl, {
  clientId: Functions.generateRandomKey(),
  clean: true,
  connectTimeout: 4000,
  username: 'User1',
  password: 'Olivetti',
  reconnectPeriod: 1000,
})

function connectToNewTopic(model,id,topics,user){
  usersTopics[user] = {model: model, id: id, data: {},subbedTopics: topics};

  usersTopics[user].subbedTopics.forEach((element) =>{
    let topic = `${model}/${id}/${element}`;

    client.subscribe([topic], () => {
      console.log(`${user} subscribed to topic '${topic}'`);
    })
  })
}

function disconnectFromTopic(user){
  let model = usersTopics[user].model;
  let id = usersTopics[user].id;

  usersTopics[user].subbedTopics.forEach((element) =>{
    let topic = `${model}/${id}/${element}`;

    client.unsubscribe([topic], () => {
      console.log(`${user} subscribed to topic '${topic}'`);
    })
    
  })

  usersTopics[user] = {};
}

app.use(jsonParser);
app.use(urlencodedParser);
app.use(express.static("../Client-Side"));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60},
}));

app.get("/", (req, res) => {
  if (req.session){
    if (req.session.secret){
      Functions.Redirect(res,"/home");
      return;
    }
  }

  res.sendFile(path.join(__dirname+"/../Client-Side/template/index.html"));
})

app.get("/home", (req, res) => {
  if (req.session){
    if (!req.session.secret){
      Functions.Redirect(res,"/","missingSession");
      return;
    }
  }

  res.sendFile(path.join(__dirname+"/../Client-Side/template/home.html"));
})

app.post("/register", (req, res) => {
  let email = req.body.email;
	let password = req.body.password;
  let repeatPassword = req.body.repeatPassword;
  let name = req.body.name;
  let surname = req.body.surname;
  let date = req.body.date;

  if (password == repeatPassword){
    if (password.length < 8){Functions.Redirect(res,"/","passwordLength"); return;}
    if (!Functions.DayCheck(date)){Functions.Redirect(res,"/","dateIncorrect"); return;}

    con.query('SELECT * FROM utenti WHERE email = ?', [email], function(error, results, fields) {
      if (error) throw error;
      if (results.length > 0){
        Functions.Redirect(res,"/","emailExists");
      }
      else{
        let qr = 'INSERT INTO utenti (email, password, name, surname, birthday, permission) VALUES ("' + email + '", "' + password + '", "' + name + '", "' + surname + '", "' + date + '", ' + '1);'

        con.query(qr, function(error, results, fields) {
          if (error) throw error;
          Functions.Redirect(res,"/");
        })
      }
    })
  }
  else{
    Functions.Redirect(res,"/","repeatMissType");
  }
})

app.post("/login", (req, res) => {
  let email = req.body.email;
	let password = req.body.password;

  if (email && password) {
    con.query('SELECT * FROM utenti WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
      if (error) throw error;
      if (results.length > 0){
        let utente = results[0];

        req.session.name = utente.name;
        req.session.permission = utente.permission;
        req.session.secret = Functions.generateRandomKey();

        con.query('UPDATE utenti.utenti SET lastsession = ? WHERE email = ? AND password = ?', [req.session.secret,email, password], function(error, results, fields) {
          if (error) throw error;
        })
        Functions.Redirect(res,"/home");
      } 
      else{
        Functions.Redirect(res,"/","wrongPassword");
      }
    })
  }
  else{
    Functions.Redirect(res,"/","missingInputs");
  }
})

app.post("/logout", (req, res) => {
  if(req.session){
    req.session.secret = undefined;
    Functions.Redirect(res,"/");
  }
})

app.post("/home/subscribe", (req,res) => {
  if (req.session){
    if (!req.session.secret){
      Functions.Redirect(res,"/","missingSession");
    }
    else{
      let model = req.body.model;
      let id = req.body.id;
      let topics = req.body.topics
      let user = req.session.name;

      if (usersTopics[user] && usersTopics[user].length > 0){
        disconnectFromTopic(user);
      }

      connectToNewTopic(model,id,topics,user);
    }
  }
})

app.get("/home/getModels", (req,res) => {
  if (req.session){
    if (!req.session.secret){
      Functions.Redirect(res,"/","missingSession");
    }
    else{
      let lightTable = [];

      con.query('SELECT * FROM macchine.modelli',function(error, results, fields) {
        results.forEach((element, i) => {
          lightTable[i] = element.name;
        });

        res.send(lightTable);
      })
    }
  }
})

app.get("/home/getMachines", (req,res) => {
  if (req.session){
    if (!req.session.secret){
      Functions.Redirect(res,"/","missingSession");
    }
    else{
      con.query('SELECT * FROM utenti WHERE lastsession = ? AND name = ?', [req.session.secret, req.session.name], function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0){
          let utente = results[0];

          let query = `SELECT utenti.matricole.customname,  utenti.utenti.name as parentName, macchine.modelli.name as model, utenti.matricole.uniqueid
          FROM macchine.corrispondenze JOIN utenti.matricole on corrispondenze.matricola_id = utenti.matricole.id
                         JOIN utenti.utenti on corrispondenze.utente_id = utenti.utenti.id
                                       JOIN macchine.modelli on corrispondenze.modello_id = macchine.modelli.idmodelli
          WHERE corrispondenze.utente_id = ?;`
          
          con.query(query, [utente.id], function(error, Data, fields) {
            if (error) throw error;

            let newJson = [];

            Data.forEach((element) => {
              newJson.push(JSON.parse(JSON.stringify(element)));
            })
            res.send(newJson);
          })
        }
      })
    }
  }
})

app.post("/addMachine", (req,res) => {
  if (req.session){
    if (!req.session.secret){
      Functions.Redirect(res,"/","missingSession");
    }
    else{
      let model = req.body.search;
      let id = req.body.badgeNumber;
      let customname = req.body.name;

      con.query('SELECT * FROM utenti WHERE lastsession = ? AND name = ?', [req.session.secret, req.session.name], function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0){
          let utente = results[0];

          let modelId = 0

          con.query('SELECT * FROM macchine.modelli WHERE name = ?', [model], function(error, resultsm, fields) {
            if (error) throw error;
            if (!resultsm[0]){
              Functions.Redirect(res,"/home","machinemissing");
              return;
            }
            modelId = resultsm[0].idmodelli;
          })

          let qr = 'INSERT INTO utenti.matricole (uniqueid, parent, customname) VALUES ("' + id + '", "' + utente.id + '", "' + customname + '"); SELECT * FROM utenti.matricole WHERE uniqueid = "' + id + '";'
          con.query(qr, function(error, resultsl, fields) {
            if (error) throw error;
            con.query('INSERT INTO macchine.corrispondenze VALUES(?, ?, ?)',[resultsl[1][0].id,utente.id,modelId], function(error, resultsl, fields) {
              if (error) throw error;
              res.status(204).send({});
            });
          })
        }
      })
    }
  }
})

client.on('connect', () => {
  console.log('Connected to the broker!');
});

client.on('message', (topic, payload) => {
  console.log('Received Message:', topic, payload.toString())
})

con.connect(function(err) {
  if (err) throw err;
  console.log("Started server!");
});
 
app.listen(port, () => {
  console.log(`Web app listening on port ${port}`)
});