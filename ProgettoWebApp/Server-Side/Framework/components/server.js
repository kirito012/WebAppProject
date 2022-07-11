let express = require("express");
let bodyParser = require("body-parser");
let session = require("express-session");
let fileUpload = require("express-fileupload");
let device = require('express-device');
let cors = require("cors");
let fs = require("fs");
let path = require("path");

let data = {};

module.exports.newApp = data.newApp = (settings) => {
  let app = express();
  let jsonParser = bodyParser.json();
  let urlencodedParser = bodyParser.urlencoded({ extended: false });

  app.use(jsonParser);
  app.use(urlencodedParser);
	app.use(device.capture());
  app.use(cors());
  app.use(express.static(settings[0] || settings.staticRoot));

  app.use(fileUpload({
    createParentPath: true,
		limits: { 
			fileSize: 8 * 1024 * 1024 * 1024
	},
	}));

  app.use(
    session({
      secret: "secret",
      resave: true,
      saveUninitialized: true,
      cookie: { maxAge: settings[1] ||settings.cookieMaxAge },
    })
  );

  return app;
};

module.exports.startApp = data.startApp = (app,port,callback) => {
	app.listen(port, () => {
		if (!callback){
			console.log(`Web app listening on port ${port}`);
		}
		else{
			callback();
		}
  });

	return true;
};

module.exports.newRequest = data.newRequest = (app,settings,callback) => {
	app[settings[0]](settings[1], (req,res) => {
		if (settings[2]){
			data.sessionCheck(res,req,settings[3],() => {
				callback(res,req);
			});
		}
		else{
			if (settings[3]){
				data.sessionCheck(res,req,false,() => {
					data.redirect(res, settings[3]);
				},() => {
					callback(res,req);
				});
			}
			else{
				callback(res,req);
			}
		}
	});
};

module.exports.newStatic = data.newStatic = (app,link,redirectTo,requireSession,file) => {
	data.newRequest(app,["get",link,requireSession,redirectTo],(res,req) => {
		console.log(req.device.type.toLowerCase());
		if (req.device.type.toLowerCase() == "phone") {
			let fileString = file.split('.html')[0] + "Mobile.html";
			if (fs.existsSync(fileString)) {
				res.sendFile(path.resolve(fileString));
			}
			else{
				res.sendFile(path.resolve(file));
			}
		}
		else{
			res.sendFile(path.resolve(file));
		}
	});
};

module.exports.logout = data.logout = (res, req, loginRoot) => {
    if (req.session) {
      req.session.secret = undefined;
      data.redirect(res, loginRoot);
    }
};

module.exports.redirect = data.redirect = (res, url, variable , message) => {
	if (variable && message) {
		res.redirect(url + "? " + variable + "=" + message);
	} else {
		res.redirect(url);
	}
};

module.exports.sessionCheck = data.sessionCheck =  (res, req, loginRoot, callback,errorCallback) => {
  if (req.session) {
    if (!req.session.secret) {
      if (errorCallback) {
        errorCallback();
        return;
      }
      data.redirect(res, loginRoot,"error" , "missingSession");
      return;
    } else {
      callback();
    }
  }
};

module.exports.saveFile = data.saveFile = (res,file,directory,newName,callback) => {
	let String = path.join(__dirname + "/../../" , directory , newName + ".png").toString()

	file.mv(String,(err) => {
		if (err) {
			return res.status(500).send(err);
		}
		callback();
	});
}
