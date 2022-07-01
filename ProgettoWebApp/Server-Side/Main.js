let utility = require("./Modules/utility");
let mqtt = require("./Modules/mqtt");
let server = require("./Modules/server")
let database = require("./Modules/database")

let client = mqtt.Connect("mqtt://localhost:1883");
let con = database.connectDatabase("localhost","databasev1");
let app = server.connectApp();

app.get("/", (req, res) => {
  server.sendStatic(req,res,"index.html",true);
});

app.get("/home", (req, res) => {
  server.sendStatic(req,res,"home.html");
});

app.post("/register", (req, res) => {
  let body = req.body

  if (body.password != body.repeatPassword) {server.Redirect(res, "/", "repeatMissType"); return;}
  if (body.password.length < 8) {server.Redirect(res, "/", "passwordLength"); return;}
  if (!utility.DayCheck(body.date)) {server.Redirect(res, "/", "dateIncorrect"); return;}

  database.query("selectUsersWhereEmail",[body.email], (results) => {
    if (results.length > 0) {
      server.Redirect(res, "/", "emailExists");
    } 
    else {
      database.query("generateUser",[body.email,body.password,body.name,body.surname,body.date,1], (results) => {
        server.Redirect(res, "/");
      });
    }
  });
});

app.post("/login", (req, res) => {
  let body = req.body;

  if (!body.email || !body.password){server.Redirect(res, "/", "missingInputs"); return;}

  database.query("selectEmailPsw",[body.email,body.password], (results) => {
    utility.checklength(results,() => {
      let utente = results[0];

      req.session.name = utente.name;
      req.session.permission = utente.permission;
      req.session.secret = utility.generateRandomKey();

      database.query("updateSession",[req.session.secret, body.email, body.password], () => {
        server.Redirect(res, "/home");
      });
    },() => {
      server.Redirect(res, "/", "wrongPassword");
    });
  });
});

app.post("/logout", server.logout);

app.post("/home/subscribe", (req, res) => {
  server.sessionCheck(res, req, () =>{
    let model = req.body.model;
    let id = req.body.id;
    let topics = req.body.topics;
    let user = req.session.name;

    if (mqtt.usersTopics[user]) {
      mqtt.disconnectFromTopic(user);
    }

    mqtt.connectToNewTopic(model, id, topics, user);

    res.send("Subbed succesfully");
  })
});

app.get("/home/getModels", (req, res) => {
  server.sessionCheck(res, req, () =>{
    let jsonData = [];

    database.query("SELECT * FROM modelli",[],(results) => {
      results.forEach((model, i) => {
        jsonData[i] = model.name;
      });

      res.send(jsonData);
    });
  });
});

app.get("/home/getMachines", (req, res) => {
  server.sessionCheck(res, req, () => {
    database.query("selectSessionName", [req.session.secret, req.session.name], (results) => {
      utility.checklength(results,() => {
        let utente = results[0];

        database.query("selectCorrispondenze",[utente.id], (corrispondenze) => {
          let jsonData = [];

          corrispondenze.forEach((corrispondenza) => {
            jsonData.push(JSON.parse(JSON.stringify(corrispondenza)));
          });

          res.send(jsonData);
        });
      },() => {
        server.Redirect(res, "/", "dataNotFound");
      });
    });
  });
});

app.post("/addMachine", (req, res) => {
  server.sessionCheck(res, req, () => {
    let body = req.body;

    database.query("selectSessionName", [req.session.secret, req.session.name], (results) => {
      utility.checklength(results,() => {
        let utente = results[0];
        let modelId = 0;

        database.query("selectModelliName",[body.search],(models) => {
          utility.checklength(models,() => {
            modelId = models[0].idmodelli;

            database.query("generateSelectMatricola",[body.badgeNumber,utente.id,body.name,body.badgeNumber], (matricola) => {
              database.query("generateCorrispondeza",[matricola[1][0].id, utente.id, modelId],() => {
                res.status(204).send({});
              })
            })
          }, () => {
            server.Redirect(res, "/home", "machinemissing");
          });
        })
      });
    });
  });
});

app.post("/removeMachine", (req, res) => {
  server.sessionCheck(res, req, () => {
    let body = req.body;

    database.query("selectDeleteMatricolaParent",[body.badgeNumber,req.session.secret,req.session.name],(results) => {
      utility.checklength(results,() => {
        res.status(204).send({});
      },() => {
        server.Redirect(res,"/home","machineNotFound");
      });
    });
  });
});