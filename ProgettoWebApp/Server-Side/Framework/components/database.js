let mysql = require("mysql");

let queryPreset = {
  selectUsersWhereEmail: "SELECT * FROM utenti WHERE email = ?;",
  generateUser:
    "INSERT INTO utenti (email, password, name, surname, birthday, permission) VALUES (?,?,?,?,?,?);",
  generateCorrispondeza: "INSERT INTO corrispondenze VALUES(?, ?, ?);",
  generateProfilePicture: "INSERT INTO profilepictures (utente_id, pictureroot) VALUES (?, ?)",
  generateSelectMatricola:
    "INSERT INTO matricole (uniqueid, parent, customname) VALUES (?,?,?); SELECT * FROM matricole WHERE uniqueid=? ;",
  selectEmailPsw: "SELECT * FROM utenti WHERE email = ? AND password = ?;",
  selectSessionName: "SELECT * FROM utenti WHERE lastsession = ? AND name = ?;",
  selectModelliName: "SELECT * FROM modelli WHERE name = ?;",
  selectProfilePictureRoot: "SELECT pictureroot FROM profilepictures WHERE utente_id = ?",
  selectMatricolaId: `SELECT * FROM corrispondenze
  JOIN matricole on corrispondenze.matricola_id = matricole.id
  JOIN utenti on corrispondenze.utente_id = utenti.id
  WHERE utenti.lastsession = ? AND utenti.name = ? AND matricole.uniqueid = ?;`,
  selectCorrispondenze: `SELECT matricole.customname,  utenti.name as parentName, modelli.name as model, matricole.uniqueid
    FROM corrispondenze JOIN matricole on corrispondenze.matricola_id = matricole.id
                                 JOIN utenti on corrispondenze.utente_id = utenti.id
                                 JOIN modelli on corrispondenze.modello_id = modelli.idmodelli
    WHERE corrispondenze.utente_id = ?;`,
  updateSession:
    "UPDATE utenti SET lastsession = ? WHERE email = ? AND password = ?;",
  updateSelectedMatricola: "UPDATE utenti SET selectedmatricolaid = ? WHERE lastsession = ? AND name = ?;",
  selectDeleteCorrispondenza: `DELETE corrispondenze FROM corrispondenze 
  JOIN matricole on corrispondenze.matricola_id = matricole.id
  WHERE matricole.uniqueid = ?;`,
  selectDeleteMatricolaParent: `DELETE FROM matricole WHERE uniqueid = ? AND EXISTS(
    SELECT * FROM utenti WHERE lastsession = ? AND name = ?) LIMIT 1;`,
};

module.exports.query = (con, qr, params, callback) => {
  let query = queryPreset[qr];

  if (!query) {
    query = qr;
  }

  con.query(query, params, (error, results, fields) => {
    if (error) throw error;
    callback(results);
  });
};

module.exports.connectToDB = (host, db) => {
  con = mysql.createConnection({
    host: host,
    user: "root",
    password: "Olivetti1",
    database: db,
    multipleStatements: true,
  });

  return con;
};

module.exports.onConnect = (con,callback) => {
  con.connect(function (err) {
    if (err) throw err;
    if (!callback){
      console.log("Started Database!");
    }
    else{
      callback();
    }
  });
}