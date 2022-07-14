let BertaFramework = require("./Framework/mainFramework.js");
let path = require("path");

let fw = new BertaFramework.framework("/","/login","/home","databasev1");
fw.createServer({
  staticRoot: path.resolve(__dirname +  "/../Client-Side"),
  cookieMaxAge: 1000 * 60 * 60,
  hostDB: "localhost",
  brokerHost: "mqtt://localhost:1883",
  port: 8081,
})

//Request Guide\\
/*

fw.newRequest(settings,callback);

settings: 
  type of request = String: "get" - "post" - "put" - etc, // required
  request url = String: "/something/somethingElse", // required
  session check = boolean: true - false, // set false if you don't need a session
  session redirect = String: "/" - "/login", // can be undefined
  request name = String: "getSomething" - "Login", // required normally use the url name
  check utente from db = boolean: true - false, // can be omitted

callback:
  results: res, // required
  request: req, // required
  user data: utente, // undefined unless "check utente from db" == true

*/

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
  fw.utility.getModels(fw, (models) => {
    res.send(models);
  })
});

fw.newRequest(["get", "/home/getMachines", true, "/login", "getMachines",true],(res, req, utente) => {
  fw.utility.getMachines(fw,utente, (machines) => {
    res.send(machines);
  })
});

fw.newRequest(["get", "/home/getProfile", true, "/login", "getProfile",true],(res, req, utente) => {
  fw.utility.getProfile(fw, utente, (profile) => {
    res.send(profile);
  })
});

fw.newRequest(["get", "/home/getProfilePicture", true, "/login", "getProfilePicture",true],(res, req, utente) => {
  fw.utility.getProfilePicture(fw, utente, (image) => {
    if (image == 404) {res.send("image not found"); return;};

    res.sendFile(image);
  })
});

//Post requests\\

fw.newRequest(["post", "/register", false, false, "register"],(res, req) => {
	let body = req.body

  if (body.password != body.repeatPassword) {fw.redirect(res, "/login", "error", "repeatMissType"); return;}
  if (body.password.length < 8 ||body.password.length > 30) {fw.redirect(res, "/login", "error", "passwordLength"); return;}
  if (body.name.length > 30 || body.surname.length > 30) {fw.redirect(res, "/login", "error", "dataLength"); return;}
  if (!fw.utility.checkEmail(body.email)){fw.redirect(res, "/login", "error", "emailNotCorrect"); return;}
  if (!fw.utility.dayCheck(body.date)) {fw.redirect(res, "/login", "error", "dateIncorrect"); return;}

  fw.queryDB("selectUsersWhereEmail",[body.email], (results) => {
    if (results.length > 0) {
      fw.redirect(res, "/login", "error", "emailExists");
    } 
    else {
      fw.queryDB("generateUser",[body.email,body.password,body.name,body.surname,body.date,1], (results) => {
        fw.redirect(res, "/login");
      });
    }
  });
});

fw.newRequest(["post", "/log", false, false, "log"],(res, req) => {
	let body = req.body;

  if (!body.email || !body.password){fw.redirect(res, "/login", "error", "missingInputs"); return;}

  fw.queryDB("selectEmailPsw",[body.email,body.password], (results) => {
    fw.utility.checkLength(results,() => {
      let utente = results[0];

      req.session.name = utente.name;
      req.session.permission = utente.permission;
      req.session.secret = fw.utility.generateRandomKey();

      fw.queryDB("updateSession",[req.session.secret, body.email, body.password], () => {
        fw.redirect(res, "/home");
      });
    },() => {
      fw.redirect(res, "/login", "error", "wrongPassword");
    });
  });
});

fw.newRequest(["post", "/changeUserData", true, "/login", "changeUserData",true],(res, req, utente) => {
  let body = req.body;

  console.log(body);

  if (!body.email || !body.name || !body.surname || !body.birthday){fw.redirect(res, "/home", "error", "missingInputs"); return;}
  if (body.name.length > 30 || body.surname.length > 30) {fw.redirect(res, "/home", "error", "dataLenght"); return;}
  if (!fw.utility.checkEmail(body.email)){fw.redirect(res, "/home", "error", "emailNotCorrect"); return;}
  if (!fw.utility.dayCheck(body.birthday)) {fw.redirect(res, "/home", "error", "dateIncorrect"); return;}

  let startQuery = "UPDATE utenti SET ";
  let middleQuery = "";
  let endQuery = "WHERE lastsession = ? AND password = ?";

  fw.utility.forEach(body, (element, key) => {
    if (element != utente[key]){
      middleQuery = middleQuery + key+ " = " + "'" + element + "'" + ", ";
    }
  }, () => {
    middleQuery = middleQuery.substring(0, middleQuery.length - 2);
    middleQuery = middleQuery + " ";
    fw.queryDB(startQuery + middleQuery + endQuery,[utente.lastsession,utente.password], (result) => {
      req.session.name = body.name;

      let profile = body;
      profile.Birthday = utente.birthday;
      profile.birthday = fw.utility.formatDate(utente.birthday);

      res.send(profile);
      console.log(profile);
    })
  });
});

fw.newRequest(["post", "/subscribe", true, "/login", "subscribe", true],(res, req, utente) => {
	let body = req.body;
	let user = utente.name;

	if (fw.mqtt.usersTopics[user]) {
		fw.mqtt.disconnectFromTopic(user);
	}

	fw.utility.checkLength(body.topics,() => {
		fw.queryDB("selectMatricolaId",[req.session.secret,user,body.id],(resultid) => {
			fw.utility.checkLength(resultid, () => {
				let id = resultid[0].matricola_id

				if (id) {
					fw.queryDB("updateSelectedMatricola",[id,req.session.secret,user], () => {
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
  
  fw.queryDB("selectModelliName",[body.search],(models) => {
    fw.utility.checkLength(models,() => {
      modelId = models[0].idmodelli;

      if (body.name.length > 20){fw.redirect(res, "/home", "error", "machineNameExceed"); return;};

      fw.queryDB("generateSelectMatricola",[body.id,utente.id,body.name,body.id], (matricola) => {
        fw.queryDB("generateCorrispondeza",[matricola[1][0].id, utente.id, modelId],() => {
          fw.utility.getMachines(fw,utente, (machines) => {
            res.send(machines);
          });
        })
      })
    }, () => {
      fw.redirect(res, "/home", "error", "machinemissing");
    });
  })
});

fw.newRequest(["post", "/removeMachine", true, "/login", "removeMachine", true],(res, req, utente) => {
	let body = req.body;
  let user = utente.name;

  fw.queryDB("selectDeleteCorrispondenza",[body.id], () => {
    fw.queryDB("selectDeleteMatricolaParent",[body.id,req.session.secret,req.session.name,body.id],(results) => {
      if (fw.mqtt.usersTopics[user] && fw.mqtt.usersTopics[user].id == body.id) {
        fw.mqtt.disconnectFromTopic(user);
      }
      fw.utility.getMachines(fw,utente, (machines) => {
        res.send(machines);
      });
    });
  });
});

fw.newRequest(["post", "/uploadpfp", true, "/login", "uploadpfp", true],(res, req, utente) => {
  let files = req.files;

  if (files.profilepicture) {
    fw.queryDB("selectProfilePictureRoot",[utente.id], (results) => {
      let root = results[0];

      if (root){
        fw.saveFile(res, files.profilepicture, "ProfilePictures", root.pictureroot.toString(), () => {
          res.status(204).send({});
        });
      }
      else{
        let key = fw.utility.generateRandomKey(15);

        fw.queryDB("generateProfilePicture",[utente.id,key], (status) => {
          fw.saveFile(res, files.profilepicture, "ProfilePictures", key.toString(), () => {
            res.status(204).send({});
          });
        })
      }
    });
  }

});