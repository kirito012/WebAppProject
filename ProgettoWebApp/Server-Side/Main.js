let BertaFramework = require("./Framework/mainFramework.js");
let path = require("path");

let fw = new BertaFramework.framework("/","/login","/home","databasev1");

fw.onConnect(() => {
  fw.queryDB("selectAllCorrispondenze",[], (stuff) => {
    fw.utility.forEach(stuff,(data) => {
      fw.mqtt.newMatricola(data.id,data.name,data.parentid,data.parentName, (matricolaVariable) => {
        fw.utility.getTopics(fw,"fiscal","warning", (topicList) => {
          fw.utility.forEach(topicList,(element) => {
            fw.queryDB("Select id FROM utenti;",[], (utenti) => {
              fw.utility.forEach(utenti, (utente) => {
								let splitted = element.topicstring.split("/");
								splitted[1] = data.model;
								splitted[2] = data.id;
								splitted = splitted.join("/");

                fw.mqtt.connectToNewTopic(utente.id,element.name,splitted);
              });
            });
          });
        });
        fw.utility.getTopics(fw,"fiscal","alarm", (topicList) => {
          fw.utility.forEach(topicList,(element) => {
            fw.queryDB("Select id FROM utenti;",[], (utenti) => {
              fw.utility.forEach(utenti, (utente) => {
								let splitted = element.topicstring.split("/");
								splitted[1] = data.model;
								splitted[2] = data.id;
								splitted = splitted.join("/");

                fw.mqtt.connectToNewTopic(utente.id,element.name,splitted);
              });
            });
          });
        });
     });
    });
  });
}, () => {
  fw.createServer({
    staticRoot: path.resolve(__dirname +  "/../Client-Side"),
    cookieMaxAge: 1000 * 60 * 60,
    hostDB: "localhost",
    brokerHost: "mqtt://localhost:1883",
    port: 8081,
  });
});

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
  fw.mqtt.getMachineData(utente.id, (data) => {
    res.send(data);
  });
});

fw.newRequest(["get", "/home/getModels", true, "/login", "getModels"],(res, req) => {
  fw.utility.getModels(fw, (models) => {
    res.send(models);
  });
});

fw.newRequest(["get", "/home/getMachines", true, "/login", "getMachines",true],(res, req, utente) => {
  fw.utility.getMachines(fw,utente, (machines) => {
    res.send(machines);
  });
});

fw.newRequest(["get", "/home/getProfile", true, "/login", "getProfile",true],(res, req, utente) => {
  fw.utility.getProfile(fw, utente, (profile) => {
    res.send(profile);
  });
});

fw.newRequest(["get", "/home/getTopics", true, "/login", "getTopics",false],(res, req) => {
  fw.utility.getTopics(fw, "fiscal", "action", (topicList) => {
    res.send(topicList);
  });
});

fw.newRequest(["get", "/home/getProfilePicture", true, "/login", "getProfilePicture",true],(res, req, utente) => {
  fw.utility.getProfilePicture(fw, utente, (image) => {
    if (image == 404) {res.send("image not found"); return;};

    res.sendFile(image);
  });
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

  if (!body.email || !body.name || !body.surname || !body.birthday){res.send({error: "missingInputs"}); return;}
  if (body.name.length > 30 || body.surname.length > 30) {res.send({error: "dataLength"}); return;}
  if (!fw.utility.checkEmail(body.email)){res.send({error: "emailNotCorrect"}); return;}
  if (!fw.utility.dayCheck(body.birthday)) {res.send({error: "dateIncorrect"});return;}

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
    });
  });
});

fw.newRequest(["post", "/addMachine", true, "/login", "addMachine", true],(res, req, utente) => {
	let body = req.body;
	let modelId = 0;
  
  fw.queryDB("selectModelliName",[body.search],(models) => {
    fw.utility.checkLength(models,() => {
      modelId = models[0].idmodelli;

      if (body.name.length > 20){res.send({error: "machineNameExceed"}); return;};

      fw.queryDB("generateSelectMatricola",[body.id,utente.id,body.name,body.id,utente.id], (matricola) => {
        fw.queryDB("generateCorrispondeza",[matricola[1][0].id, utente.id, modelId],() => {
          fw.utility.getMachines(fw,utente, (machines) => {
            res.send(machines);
          });
        });
      });
    }, () => {
      res.send({error: "machineMissing"});
    });
  });
});

fw.newRequest(["post", "/removeMachine", true, "/login", "removeMachine", true],(res, req, utente) => {
	let body = req.body;

  if (body.oldTopics){
    fw.utility.forEach(body.oldTopics,(element) => {
      fw.mqtt.disconnectFromTopic(utente.id,element.name.replaceAll(" ","_"));
    });
  }

  fw.queryDB("selectCorrispondenzaMatricola", [body.id,utente.id],(idToKeep) => {
    fw.utility.checkLength(idToKeep, () => {
      fw.queryDB("selectDeleteAllPersonalTopic",[body.id,utente.id],(results) => {
        fw.queryDB("selectDeleteMatricolaParent",[body.id,utente.id],(results) => {
          fw.queryDB("selectDeleteCorrispondenza",[idToKeep[0].matricola_id,utente.id], (results) => {
            fw.utility.getMachines(fw,utente, (machines) => {
              res.send(machines);
            });
          });
        });
      });
    }, () => {
      res.status(204).send({});
    });
  });
});

fw.newRequest(["post", "/uploadpfp", true, "/login", "uploadpfp", true],(res, req, utente) => {
  let files = req.files;

  if (files){
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
          });
        }
      });
    }
    else {
      res.status(204).send({});
    }
  }
  else {
    res.status(204).send({});
  }
});

fw.newRequest(["post", "/tableData", true, "/login", "tableData", true],(res, req, utente) => {
  let body = req.body;
  let timeElapsed = new Date(new Date().getTime() - (body.timeChoosen));
  let maxTime = new Date(new Date().getTime() - (48 * 60 * 60 * 1000));
  let limit = body.limit || 1000000;

  if (timeElapsed >=  maxTime) {
    fw.utility.formatTime(timeElapsed, (newTime) => {
      fw.queryDB("selectValueFromTimestamp",[body.topic,body.topic,body.id,newTime,limit],(results) => {
        fw.utility.splitArray(results[1],body.columns || 1000000,body.page,(pageData) => {
          fw.utility.forEach(pageData,(element) => {
            element.id = body.id;
            element.topic = body.topic;

            fw.utility.formatCleanTime(new Date(element.timestamp), (formattedTime) => {
              element.formattedDate = formattedTime;
            });
          }, () => {
            res.send({pageData: pageData,pagesNumber: Math.floor(results[1].length / body.columns)});
          });
        });  
      });
    });
  }
});

fw.newRequest(["post", "/updateTopic", true, "/login", "updateTopic", true],(res, req, utente) => {
  let body = req.body;
  let topicName = body.topic.replaceAll(" ", "_");

  if (body.scope) {
    fw.queryDB("generateTopicString",[topicName,"action","fiscal",topicName,"action","fiscal",body.id,body.model,utente.id,topicName], (status) => {
      fw.utility.getMachinePureTopics(fw, body, utente, (nameList) => {
        fw.utility.forEach(nameList,(element) => {
          fw.mqtt.connectToNewTopic(utente.id,element.name,element.topicstring);
        })
        res.send(nameList);

        fw.utility.getTopics(fw,"fiscal","warning", (topicList) => {
          fw.utility.forEach(topicList,(element) => {
            fw.mqtt.connectToNewTopic(utente.id,element.name,element.topicstring);
          })
        });
        fw.utility.getTopics(fw,"fiscal","alarm", (topicList) => {
          fw.utility.forEach(topicList,(element) => {
            fw.mqtt.connectToNewTopic(utente.id,element.name,element.topicstring);
          })
        });
      });
    });
  }
  else {
    fw.queryDB("selectDeletePersonalTopic",[topicName,body.id,utente.id], (status) => {
      fw.utility.getMachinePureTopics(fw, body, utente, (nameList) => {
        res.send(nameList);
      });
    });
  }
});

fw.newRequest(["post", "/getMachineTopics", true, "/login", "getMachineTopics",true],(res, req, utente) => {
  let body = req.body;

  fw.utility.getMachineTopics(fw, body, utente, (nameList) => {
    res.send(nameList);
  })
});

fw.newRequest(["post", "/sendInfo", true, "/login", "sendInfo",true],(res, req, utente) => {
  let body = req.body;

  fw.mqtt.newMatricola(body.id,body.model,utente.id,utente.name);

  if (body.oldTopics){
    fw.utility.forEach(body.oldTopics,(element) => {
      fw.mqtt.disconnectFromTopic(utente.id,element.name.replaceAll(" ","_"),element.topicstring);
    });
  }

  fw.utility.forEach(body.topics,(element) => {
    fw.mqtt.connectToNewTopic(utente.id,element.name.replaceAll(" ","_"),element.topicstring);
  });

  res.status(204).send({});
});

fw.newRequest(["post", "/getWarnings", true, "/login", "getWarnings",true],(res, req,utente) => {
  let body = req.body;

	fw.utility.getWarnings(fw, "fiscal", "warning", body.matricola_id, (data) => {
		fw.utility.getWarnings(fw, "fiscal", "alarm", body.matricola_id, (data2) => {
			res.send(data.concat(data2));
		});
	});
});

fw.newRequest(["post", "/deleteWarnings", true, "/login", "deleteWarnings",true],(res, req,utente) => {
  let body = req.body;

  fw.queryDB("deleteWarning",[body.name,body.timestamp,body.matricola_id, body.errorId], (results) => {
    if (results) {
      fw.utility.getWarnings(fw, "fiscal", "warning", body.matricola_id, (data) => {
        fw.utility.getWarnings(fw, "fiscal", "alarm", body.matricola_id, (data2) => {
					res.send(data.concat(data2));
					fw.mqtt.getTopicString(body.name, utente.id, (topicString) => {
						fw.mqtt.publishToTopic("/warning/" + topicString, "", false, true);
						fw.mqtt.publishToTopic("/alarm/" + topicString, "", false, true);
					});
        });
      });
    }
    else{
      res.send({error: "deleteWarningError"});
    }
  });
});

// Socket connection \\

fw.newWsConnection(["/socketData"], (ws,req) => {
	fw.newWsHandler(ws,(wsHandler) => {

		ws.on("message", (msg) => {
			let parsed = JSON.parse(msg);

			if (parsed.action == "start"){
				wsHandler.actionHandler("start",{utente_id: parsed.utente_id},() => {
					//console.log("start");
				});
			}
      if (parsed.action == "set"){
				wsHandler.actionHandler("set",{utente_id: parsed.utente_id,objective: parsed.objective,msg: parsed.msg,response: parsed.responseTopic},() => {
					//console.log("set");
				});
			}
      else if (parsed.action == "get"){
				wsHandler.actionHandler("get",{utente_id: parsed.utente_id,objective: parsed.objective,msg: parsed.msg,response: parsed.responseTopic},() => {
					//console.log("get");
				});
			}
			else if (parsed.action == "stop"){
				wsHandler.actionHandler("stop",{},() => {
					//console.log("stop");
				});
			}
			else if (parsed.action == "close"){
				wsHandler.actionHandler("close",{},() => {
					delete wsHandler;
					//console.log("close");
				});
			}
		});
	});
});

//Database record update\\

fw.mqtt.getClient((mqttClient) => {
  mqttClient.on("message", (topic,payload) => {
    fw.mqtt.getMqttVariables(topic, (topicName,matricola_id) => {
      fw.queryDB("createTableInsertTopic",[topicName,topicName,payload.toString(),matricola_id,topicName,topic], (result) => {
        //console.log("Updated Data");
      });
    });
  });
});