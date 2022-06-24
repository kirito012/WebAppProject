let express = require("express")
let app = express()
let port = 8081

app.use(express.static("../Client-Side"));

app.get("/", (req, res) => {
  res.send("")
})

app.post("/login", (req, res) => {
  let email = req.body.email;
	let password = req.body.password;

  console.log(email);
  console.log(password);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
}) 