let mysql = require("mysql");

let con;

let queryPreset = {
  selectUsersWhereEmail: "SELECT * FROM utenti WHERE email = ?;",
  generateUser:
    "INSERT INTO utenti (email, password, name, surname, birthday, permission) VALUES (?,?,?,?,?,?);",
  generateCorrispondeza: "INSERT INTO corrispondenze VALUES(?, ?, ?);",
  generateSelectMatricola:
    "INSERT INTO matricole (uniqueid, parent, customname) VALUES (?,?,?); SELECT * FROM matricole WHERE uniqueid=? ;",
  selectEmailPsw: "SELECT * FROM utenti WHERE email = ? AND password = ?;",
  selectSessionName: "SELECT * FROM utenti WHERE lastsession = ? AND name = ?;",
  selectModelliName: "SELECT * FROM modelli WHERE name = ?;",
  selectCorrispondenze: `SELECT matricole.customname,  utenti.name as parentName, modelli.name as model, matricole.uniqueid
    FROM corrispondenze JOIN matricole on corrispondenze.matricola_id = matricole.id
                                 JOIN utenti on corrispondenze.utente_id = utenti.id
                                 JOIN modelli on corrispondenze.modello_id = modelli.idmodelli
    WHERE corrispondenze.utente_id = ?;`,
  updateSession:
    "UPDATE utenti SET lastsession = ? WHERE email = ? AND password = ?;",
  selectDeleteMatricolaParent: `DELETE FROM matricole WHERE uniqueid = ? AND EXISTS(
    SELECT * FROM utenti WHERE lastsession = ? AND name = ?) LIMIT 1;`,
};

module.exports.query = (qr, params, callback) => {
  let query = queryPreset[qr];

  if (!query) {
    query = qr;
  }
  con.query(query, params, (error, results, fields) => {
    if (error) throw error;
    callback(results);
  });
};

module.exports.connectDatabase = (host, db) => {
  con = mysql.createConnection({
    host: host,
    user: "root",
    password: "Olivetti1",
    database: db,
    multipleStatements: true,
  });

  con.connect(function (err) {
    if (err) throw err;
    console.log("Started Database!");
  });

  return con;
};
