let BertaFramework = require("./BertaFramework/mainFramework.js");

let fw = new BertaFramework.framework("/","/login","/home","databasev1");
fw.createServer({
  staticRoot: "./../Client-Side",
  cookieMaxAge: 1000 * 60 * 60,
  hostDB: "localhost",
  brokerHost: "localhost:1883",
  port: 8081,
})

//Get requests\\

fw.newRequest(["get", "/home/getData", true, "/login", "getData", true],(res, req, utente) => {
  if (fw.mqtt.usersTopics[utente.name]) {
    res.send(fw.mqtt.usersTopics[utente.name]);
  } 
	else {
    res.send({});
  }
});

fw.newRequest(["get", "/home/getModels", true, "/login", "getModels"],(res, req) => {
  let jsonData = [];

  fw.database.query("SELECT * FROM modelli;",[],(results) => {
    fw.utility.forEach(results, (model,i) => {
      jsonData[i] = model.name;
    }, () => {
      res.send(jsonData);
    });
  });
});

fw.newRequest(["get", "/home/getMachines", true, "/login", "getMachines",true],(res, req, utente) => {
  fw.database.query("selectCorrispondenze",[utente.id], (corrispondenze) => {
    let jsonData = [];

    fw.utility.forEach(corrispondenze,(corrispondenza) => {
      jsonData.push(JSON.parse(JSON.stringify(corrispondenza)));
		}, () => {
			res.send(jsonData);
		});
  });
});

//Post requests\\

fw.newRequest(["post", "/register", false, false, "register"],(res, req) => {
	let body = req.body

  if (body.password != body.repeatPassword) {fw.server.Redirect(res, "/", "error", "repeatMissType"); return;}
  if (body.password.length < 8 ||body.password.length > 30) {fw.server.Redirect(res, "/", "error", "passwordLength"); return;}
  if (!fw.utility.checkEmail(body.email)){fw.server.Redirect(res, "/", "error", "emailNotCorrect"); return;}
  if (!fw.utility.dayCheck(body.date)) {fw.server.Redirect(res, "/", "error", "dateIncorrect"); return;}

  fw.database.query("selectUsersWhereEmail",[body.email], (results) => {
    if (results.length > 0) {
      fw.server.Redirect(res, "/", "error", "emailExists");
    } 
    else {
      fw.database.query("generateUser",[body.email,body.password,body.name,body.surname,body.date,1], (results) => {
        fw.server.Redirect(res, "/");
      });
    }
  });
});

fw.newRequest(["post", "/log", false, false, "log"],(res, req) => {
	let body = req.body;

  if (!body.email || !body.password){fw.server.Redirect(res, "/", "error", "missingInputs"); return;}

  fw.database.query("selectEmailPsw",[body.email,body.password], (results) => {
    fw.utility.checkLength(results,() => {
      let utente = results[0];

      req.session.name = utente.name;
      req.session.permission = utente.permission;
      req.session.secret = fw.utility.generateRandomKey();

      fw.database.query("updateSession",[req.session.secret, body.email, body.password], () => {
        fw.server.Redirect(res, "/home");
      });
    },() => {
      fw.server.Redirect(res, "/", "error", "wrongPassword");
    });
  });
});

fw.newRequest(["post", "/subscribe", true, "/login", "subscribe", true],(res, req, utente) => {
	let body = req.body;
	let user = utente.name;

	if (fw.mqtt.usersTopics[user]) {
		fw.mqtt.disconnectFromTopic(user);
	}

	fw.utility.checkLength(body.topics,() => {
		fw.database.query("selectMatricolaId",[req.session.secret,user,body.id],(resultid) => {
			fw.utility.checkLength(resultid, () => {
				let id = resultid[0].matricola_id

				if (id) {
					fw.database.query("updateSelectedMatricola",[id,req.session.secret,user], () => {
						fw.mqtt.connectToNewTopic(body.model, body.id, body.topics, user);
						res.send(fw.mqtt.usersTopics[user]);
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
});

fw.newRequest(["post", "/addMachine", true, "/login", "addMachine", true],(res, req, utente) => {
	let body = req.body;
	let modelId = 0;

  fw.database.query("selectModelliName",[body.search],(models) => {
    fw.utility.checkLength(models,() => {
      modelId = models[0].idmodelli;

      fw.database.query("generateSelectMatricola",[body.id,utente.id,body.name,body.id], (matricola) => {
        fw.database.query("generateCorrispondeza",[matricola[1][0].id, utente.id, modelId],() => {
          res.send("getMachines");
        })
      })
    }, () => {
      fw.server.Redirect(res, "/home", "error", "machinemissing");
    });
  })
});

fw.newRequest(["post", "/removeMachine", true, "/login", "removeMachine", true],(res, req, utente) => {
	let body = req.body;
  let user = utente.name;

  fw.database.query("selectDeleteCorrispondenza",[body.id], () => {
    fw.database.query("selectDeleteMatricolaParent",[body.id,req.session.secret,req.session.name,body.id],(results) => {
      if (fw.mqtt.usersTopics[user] && fw.mqtt.usersTopics[user].id == body.id) {
        fw.mqtt.disconnectFromTopic(user);
      }
      res.send("getMachines");
    });
  });
});