let express = require("express");
let bodyParser = require("body-parser");
let session = require("express-session");
let path = require("path");

let data = {};

module.exports.newApp = data.newApp = (settings) => {
  let app = express();
  let jsonParser = bodyParser.json();
  let urlencodedParser = bodyParser.urlencoded({ extended: false });

  app.use(jsonParser);
  app.use(urlencodedParser);
  app.use(express.static(settings[0] || settings.staticRoot));

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
		res.sendFile(path.resolve(file));
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
