let express = require("express");
let bodyParser = require("body-parser");
let app = express()
let jsonParser = bodyParser.json()
let urlencodedParser = bodyParser.urlencoded({ extended: false })
let port = 8081

app.use(jsonParser);
app.use(urlencodedParser);
app.use(express.static("../Client-Side"));

app.get("/", (req, res) => {
  res.send("index.html");
})

app.get("/home", (req, res) => {
  res.send("home.html");
})

app.post("/login", (req, res) => {
  let email = req.body.email;
	let password = req.body.password;
  
  res.redirect("/home");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 