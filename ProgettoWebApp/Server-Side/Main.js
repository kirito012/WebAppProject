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
  res.sendFile(path.join(__dirname+"/../Client-Side/template/index.html"));

  if (req.session){
    if (req.session.secret){
      Functions.Redirect(res,"/home");
    }
  }
})

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname+"/../Client-Side/template/home.html"));

  if (req.session){
    if (!req.session.secret){
      Functions.Redirect(res,"/","missingSession");
    }
  }
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
        req.session.name = results[0].name;
        req.session.permission = results[0].permission;
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

app.post("/aggiungiMacchina", (req,res) => {
  if (req.session){
    if (!req.session.secret){
      Functions.Redirect(res,"/","missingSession");
    }
    else{
      let model = req.body.model;
      let id = req.body.id;
      let customname = req.body.customname;

      con.query('SELECT * FROM utenti WHERE lastsession = ? AND name = ?', [req.session.secret, req.session.name], function(error, results, fields) {
        if (error) throw error;
        if (results.length > 0){
          let qr = 'INSERT INTO macchine (model, uniqueid, parent, customname) VALUES ("' + model + '", "' + id + '", "' + results[0].id + '", "' + customname + '");'
          con.query(qr, function(error, results, fields) {
            if (error) throw error;
            Functions.Redirect(res,"/home");
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