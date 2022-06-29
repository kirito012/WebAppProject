let express = require("express");
let bodyParser = require("body-parser");
let session = require('express-session');
let path = require('path');
let mysql = require("mysql");
let Functions = require("./Modules/FunctionModule");

let app = express()
let jsonParser = bodyParser.json()
let urlencodedParser = bodyParser.urlencoded({ extended: false })
let port = 8081

let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Olivetti1",
  database: "utenti"
});

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
          let JsonData = [];
          let querydata = [];

          let qr = 'SELECT * FROM macchine.matricole WHERE NOT JSON_SEARCH(attachedusers,"all","'+ utente.id +'") IS NULL';
          con.query(qr, function(error, resultsf, fields){
            if (error) throw error;
            resultsf.forEach((device, index) => {
              let model = device.model;
              let machines = [];

              let resultArray = JSON.parse(JSON.parse(JSON.stringify(device.attachedusers)));

              for (let key in resultArray){
                if (parseInt(resultArray[key]) == utente.id){
                  machines.push(key);
                }
              }

              querydata.push({
                model: model,
                machines: machines
              })

            });

            querydata.forEach((element, i) => {
              con.query('SELECT * FROM utenti.macchine WHERE uniqueid in (?)', [element.machines], function(error, results, fields) {
                if (error) throw error;
                if(results.length > 0){
                  results.forEach(machine => {
                    JsonData.push({
                      model: element.model,
                      uniqueid: machine.uniqueid,
                      customname: machine.customname,
                    });
                  });
                  if (i == querydata.length -1){
                    res.send(JsonData);
                  }
                }
              })
            });
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

          con.query('SELECT * FROM macchine.modelli WHERE name = ?', [model], function(error, resultsm, fields) {
            if (error) throw error;
            if (!resultsm[0]){
              Functions.Redirect(res,"/home","machinemissing");
              return;
            }
          })

          let qr = 'INSERT INTO utenti.macchine (uniqueid, parent, customname) VALUES ("' + id + '", "' + utente.id + '", "' + customname + '");'
          con.query(qr, function(error, resultsl, fields) {
            if (error) throw error;

            con.query('SELECT * FROM macchine.matricole WHERE model = ?', [model], function(error, resultsm, fields) {
              if (!resultsm[0]){
                let baseJson = {};
                baseJson[id] = results[0].id.toString();

                let newqr = "INSERT INTO macchine.matricole (model,attachedusers) VALUES('"+ model  +"','" + JSON.stringify(baseJson) + "')";
                con.query(newqr, function(error, results, fields) {if (error) throw error;})
              }
              else{
                let newJson = JSON.parse(resultsm[0].attachedusers);
                newJson[id] = results[0].id.toString();

                con.query('UPDATE macchine.matricole SET attachedusers = ? WHERE model = ?', [JSON.stringify(newJson),model], function(error, results, fields) {if (error) throw error;})
              }
              return res.status(204).send();
            })
          })
        }
      })
    }
  }
})



con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
 
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 