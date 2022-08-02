let serverPath = "./components/server.js";
let databasePath = "./components/database.js";
let utilityPath = "./components/utility.js";
let mqttPath = "./components/mqtt.js";

let templates = __dirname + "/../../Client-Side/template";
let index = templates + "/index.html";
let login = templates + "/login.html";
let home = templates + "/homePage.html";

class framework {
  constructor(indexRoot, loginRoot, homeRoot,nameDB) {
    this.server = require(serverPath);
    this.database = require(databasePath);
		this.utility = require(utilityPath);
		this.mqtt = require(mqttPath);

		this.app = {};
		this.connectionDB = {};
		this.mqttClient = {}
    this.requests = {};

    this.indexRoot = indexRoot;
    this.loginRoot = loginRoot;
    this.homeRoot = homeRoot;
		this.nameDB = nameDB;
  }

  createServer = (settings, databaseCallback) => {
    this.app = this.server.newApp([settings.staticRoot, settings.cookieMaxAge]);
    this.connectionDB = this.database.connectToDB(settings.hostDB, this.nameDB);

    this.server.startApp(this.app, settings.port, () => {
      this.database.onConnect(this.connectionDB, databaseCallback);
		  //this.mqttClient = this.mqtt.connectToBroker(settings.brokerHost);

      this.newStatic({
        link: this.indexRoot,
        requireSession: false,
        file: index,
      });

      this.newStatic({
        link: this.loginRoot,
        redirectTo: this.homeRoot,
        requireSession: false,
        file: login,
      });

      this.newStatic({
        link: this.homeRoot,
        redirectTo: this.loginRoot,
        requireSession: true,
        file: home,
      });

      this.newRequest(["post", "/logout", false, false, "logout"], (res, req) => {
        this.server.logout(res, req, this.loginRoot);
      });
    });
  };

  newStatic = (settings) => {
    this.server.newStatic(
      this.app,
      settings.link,
      settings.redirectTo,
      settings.requireSession,
      settings.file,
    );
  };

  newRequest = (settings, callback) => {
    this.requests[settings.name || settings[4]] = this.server.newRequest(this.app, settings, (res, req) => {
        if (settings.checkUserDB || settings[5]) {
          this.database.query(this.connectionDB ,"selectSessionName", [req.session.secret, req.session.name], (results) => {
            this.utility.checkLength(results,() => {
							callback(res, req, results[0]);
						}); 
        	});
        } 
				else {
          callback(res, req);
        }
      });
  };

  newWsConnection = (settings, callback) => {
    this.server.newWsConnection(this.app, settings[0], callback);
  }

  newWsHandler = (ws,callback) => {
    let wshand = new this.server.socketHandler(this,ws);

    callback(wshand);
  }

  queryDB = (qr, params, callback) => {
    this.database.query(this.connectionDB, qr, params, callback);
  };

  redirect = (res, url, variable , message) => {
    this.server.redirect(res, url, variable , message);
  };

  saveFile = (res,file,directory,newName,callback) => {
    this.server.saveFile(res,file,directory,newName,callback);
  }

}

module.exports.framework = framework;