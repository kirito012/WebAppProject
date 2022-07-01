let express = require("express");
let bodyParser = require("body-parser");
let session = require("express-session");
let path = require("path");

module.exports.sessionCheck = (res, req, callback) => {
  if (req.session) {
    if (!req.session.secret) {
      module.exports.Redirect(res, "/", "missingSession");
      return;
    } else {
      callback();
    }
  }
}

module.exports.Redirect = function (res, url, error) {
    if (error) {
      res.redirect(url + "?error=" + error);
    } else {
      res.redirect(url);
    }
  };

module.exports.sendStatic = (req, res, filepath, session) => {
  if (session){
    res.sendFile(path.join(__dirname + "/../../Client-Side/template/" + filepath));
  }
  else{
    module.exports.sessionCheck(res, req, () => {
        res.sendFile(path.join(__dirname + "/../../Client-Side/template/" + filepath));
    });
  }
};

module.exports.logout = (req, res) => {
    if (req.session) {
      req.session.secret = undefined;
      module.exports.Redirect(res, "/");
    }
}

module.exports.connectApp = (port) => {
  let app = express();
  let jsonParser = bodyParser.json();
  let urlencodedParser = bodyParser.urlencoded({ extended: false });

  app.use(jsonParser);
  app.use(urlencodedParser);
  app.use(express.static(path.join(__dirname + "/../../Client-Side")));

  app.use(
    session({
      secret: "secret",
      resave: true,
      saveUninitialized: true,
      cookie: { maxAge: 1000 * 60 * 60 },
    })
  );

  app.listen(port, () => {
    console.log(`Web app listening on port ${port}`);
  });

  return app;
};
