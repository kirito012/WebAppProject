let express = require("express");
let bodyParser = require("body-parser");
let session = require('express-session');
let path = require('path');
let mysql = require("mysql");
let crypto = require('crypto');

function generateRandomKey(){
  return crypto.randomBytes(48).toString('hex');
}

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
      res.redirect("/home");
    }
  }
})

app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname+"/../Client-Side/template/home.html"));

  if (req.session){
    if (!req.session.secret){
      res.redirect("/")
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
    console.log("entered");
    con.query('SELECT * FROM utenti WHERE email = ?', [email], function(error, results, fields) {
      if (error) throw error;
      if (results.length > 0){
        console.log("Already found");
        res.redirect("/");
      }
      else{
        let qr = 'INSERT INTO utenti (email, password, name, surname, birthday, permission) VALUES ("' + email + '", "' + password + '", "' + name + '", "' + surname + '", "' + date + '", ' + '1);'

        console.log(qr);

        con.query(qr, function(error, results, fields) {
          if (error) throw error;
          res.redirect("/");
        })
      }
    })
  }
  else{
    console.log("not entered");
  }
})

app.post("/login", (req, res) => {
  let email = req.body.email;
	let password = req.body.password;

  if (email && password) {
    con.query('SELECT * FROM utenti WHERE email = ? AND password = ?', [email, password], function(error, results, fields) {
      if (error) throw error;
      if (results.length > 0){
        req.session.secret = generateRandomKey();
        res.redirect("/home");
      } 
      else{
        res.redirect("/");
      }
    })
  }
  else{
    res.redirect("/");
  }
})

app.post("/logout", (req, res) => {
  if(req.session){
    req.session.secret = undefined;
    res.redirect("/");
  }
})

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 