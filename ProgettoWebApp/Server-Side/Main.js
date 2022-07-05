let utility = require("./Modules/utility");
let mqtt = require("./Modules/mqtt");
let server = require("./Modules/server")
let database = require("./Modules/database");

let client = mqtt.Connect("mqtt://localhost:1883");
let con = database.connectDatabase("localhost","databasev1");
let app = server.connectApp(8081);

//Get requests\\

app.get("/", (req, res) => {
  server.sendStatic(req,res,"login.html",true);
});

app.get("/home", (req, res) => {
  server.sendStatic(req,res,"home.html");
});

app.get("/home/personal", (req, res) => {
  server.sendStatic(req,res,"personal.html");
});

app.get("/home/getData", (req,res) => {
  server.sessionCheck(res,req, () => {
    let user = req.session.name;

    if (mqtt.usersTopics[user]) {
      res.send(mqtt.usersTopics[user]);
    }
    else{
      res.send({});
    }
  });
});

app.get("/home/getModels", (req, res) => {
  server.sessionCheck(res, req, () =>{
    let jsonData = [];

    database.query("SELECT * FROM modelli;",[],(results) => {

      utility.forEach(results, (model,i) => {
        jsonData[i] = model.name;
      }, () => {
        res.send(jsonData);
      });
    });
  });
});

app.get("/home/getMachines", (req, res) => {
  server.sessionCheck(res, req, () => {
    database.query("selectSessionName", [req.session.secret, req.session.name], (results) => {
      utility.checkLength(results,() => {
        let utente = results[0];

        database.query("selectCorrispondenze",[utente.id], (corrispondenze) => {
          let jsonData = [];

          utility.forEach(corrispondenze,(corrispondenza) => {
            jsonData.push(JSON.parse(JSON.stringify(corrispondenza)));
          }, () => {
            res.send(jsonData);
          });
        });
      },() => {
        server.Redirect(res, "/", "sessionNotValid");
      });
    });
  });
});

//Post requests\\

app.post("/register", (req, res) => {
  let body = req.body

  if (body.password != body.repeatPassword) {server.Redirect(res, "/", "repeatMissType"); return;}
  if (body.password.length < 8 ||body.password.length > 30) {server.Redirect(res, "/", "passwordLength"); return;}
  if (!utility.checkEmail(body.email)){server.Redirect(res, "/", "emailNotCorrect"); return;}
  if (!utility.dayCheck(body.date)) {server.Redirect(res, "/", "dateIncorrect"); return;}

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
    utility.checkLength(results,() => {
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

app.post("/subscribe", (req, res) => {
  server.sessionCheck(res, req, () =>{
    let body = req.body;
    let user = req.session.name;

    if (mqtt.usersTopics[user]) {
      mqtt.disconnectFromTopic(user);
    }

    utility.checkLength(body.topics,() => {
      database.query("selectMatricolaId",[req.session.secret,user,body.id],(resultid) => {
        utility.checkLength(resultid, () => {
          let id = resultid[0].matricola_id

          if (id) {
            database.query("updateSelectedMatricola",[id,req.session.secret,user], () => {
              mqtt.connectToNewTopic(body.model, body.id, body.topics, user);
              res.send(mqtt.usersTopics[user]);
            });
          }
          else{
            console.log(resultid);
          }
        }, () => {
          console.log("id not found");
          console.log(resultid);
        });
      });
    },() => {
      console.log("body doesn't exitst")
      res.send({});
    })
  })
});

app.post("/addMachine", (req, res) => {
  server.sessionCheck(res, req, () => {
    let body = req.body;

    database.query("selectSessionName", [req.session.secret, req.session.name], (results) => {
      utility.checkLength(results,() => {
        let utente = results[0];
        let modelId = 0;

        database.query("selectModelliName",[body.search],(models) => {
          utility.checkLength(models,() => {
            modelId = models[0].idmodelli;

            database.query("generateSelectMatricola",[body.id,utente.id,body.name,body.id], (matricola) => {
              database.query("generateCorrispondeza",[matricola[1][0].id, utente.id, modelId],() => {
                res.send("getMachines");
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
    let user = req.session.name;

    database.query("selectDeleteCorrispondenza",[body.id], () => {
      database.query("selectDeleteMatricolaParent",[body.id,req.session.secret,req.session.name,body.id],(results) => {
        if (mqtt.usersTopics[user] && mqtt.usersTopics[user].id == body.id) {
          mqtt.disconnectFromTopic(user);
        }
        res.send("getMachines");
      });
    });
  });
});