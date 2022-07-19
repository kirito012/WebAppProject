let mysql = require("mysql");

let queryPreset = {
  selectUsersWhereEmail: "SELECT * FROM utenti WHERE email = ?;",
  generateUser:
    "INSERT INTO utenti (email, password, name, surname, birthday, permission) VALUES (?,?,?,?,?,?);",
  generateCorrispondeza: "INSERT INTO corrispondenze (matricola_id, utente_id, modello_id) VALUES(?, ?, ?);",
  generateProfilePicture: "INSERT INTO profilepictures (utente_id, pictureroot) VALUES (?, ?)",
  generateSelectMatricola:
    "INSERT INTO matricole (uniqueid, parent, customname) VALUES (?,?,?); SELECT * FROM matricole WHERE uniqueid=? ;",
  generateTopicString: `INSERT INTO
  savedtopics (name, topicstring, corrispondenza)
  SELECT
    SUBSTRING_INDEX(
      (
          REPLACE(
            REPLACE(
            (
              SELECT
                topicstring
              FROM
                topics
              WHERE
                topics.name = ?
                and topics.actiontype = ?
                and topics.boardtype = ?
            ),
            "ID",
            matricole.uniqueid
          ),
            "MODEL",
            rtrim(modelli.name)
          )
        ),
      '/',
      -1
    ) name,
    (
      SELECT
        (
          REPLACE(
            REPLACE(
            (
              SELECT
                topicstring
              FROM
                topics
              WHERE
                topics.name = ?
                and topics.actiontype = ?
                and topics.boardtype = ?
            ),
            "ID",
            matricole.uniqueid
          ),
            "MODEL",
            rtrim(modelli.name)
          )
        )
    ),
    corrispondenze.key
  FROM
    corrispondenze
    JOIN matricole on corrispondenze.matricola_id = matricole.id
    JOIN modelli on corrispondenze.modello_id = modelli.idmodelli
    JOIN utenti on corrispondenze.utente_id = utenti.id
  WHERE
    matricole.uniqueid = ?
    and modelli.name = ?
    and utenti.id = ?
    and NOT EXISTS (
      SELECT 1 
      FROM savedtopics 
      WHERE 
      savedtopics.name = ?
      and savedtopics.corrispondenza = corrispondenze.key
    );
  `,
  selectEmailPsw: "SELECT * FROM utenti WHERE email = ? AND password = ?;",
  selectSessionName: "SELECT * FROM utenti WHERE lastsession = ? AND name = ?;",
  selectModelliName: "SELECT * FROM modelli WHERE name = ?;",
  selectProfilePictureRoot: "SELECT pictureroot FROM profilepictures WHERE utente_id = ?",
  selectTopicsName: `select name, actiontype, boardtype from topics where boardtype = ? and actiontype = ?`,
  selectMachineTopics: `SELECT savedtopics.name,savedtopics.topicstring FROM corrispondenze
    JOIN matricole on corrispondenze.matricola_id = matricole.id
    JOIN modelli on corrispondenze.modello_id = modelli.idmodelli
    JOIN utenti on corrispondenze.utente_id = utenti.id
    JOIN savedtopics on corrispondenze.key = savedtopics.corrispondenza
  WHERE
	  matricole.uniqueid = ?
    and modelli.name = ?
    and utenti.id = ?`,
  selectMatricolaId: `SELECT * FROM corrispondenze
    JOIN matricole on corrispondenze.matricola_id = matricole.id
    JOIN utenti on corrispondenze.utente_id = utenti.id
    WHERE utenti.lastsession = ? AND utenti.name = ? AND matricole.uniqueid = ?;`,
  selectCorrispondenzaMatricola: `SELECT corrispondenze.matricola_id FROM corrispondenze
    JOIN matricole on corrispondenze.matricola_id = matricole.id
    JOIN utenti on corrispondenze.utente_id = utenti.id
    WHERE matricole.uniqueid = ? and utenti.id = ?;`,
  selectCorrispondenze: `SELECT matricole.customname,  utenti.name as parentName, modelli.name as model, matricole.uniqueid FROM corrispondenze 
    JOIN matricole on corrispondenze.matricola_id = matricole.id
    JOIN utenti on corrispondenze.utente_id = utenti.id
    JOIN modelli on corrispondenze.modello_id = modelli.idmodelli
    WHERE corrispondenze.utente_id = ?;`,
  selectSavedTopics: `SELECT savedtopics.name, savedtopics.topicstring FROM corrispondenze 
    JOIN matricole on corrispondenze.matricola_id = matricole.id
    JOIN  utenti on corrispondenze.utente_id = utenti.id
    JOIN savedtopics on corrispondenze.key = savedtopics.corrispondenza
    WHERE corrispondenze.utente_id = ? and matricole.uniqueid = ?;`,
  updateSession:
    "UPDATE utenti SET lastsession = ? WHERE email = ? AND password = ?;",
  updateSelectedMatricola: "UPDATE utenti SET selectedmatricolaid = ? WHERE lastsession = ? AND name = ?;",
  selectDeleteCorrispondenza: `DELETE corrispondenze FROM corrispondenze
    JOIN utenti on corrispondenze.utente_id = utenti.id
    WHERE corrispondenze.matricola_id = ? and utenti.id = ?;`,
  selectDeleteMatricolaParent: `DELETE matricole FROM corrispondenze
    JOIN matricole on corrispondenze.matricola_id = matricole.id
    JOIN utenti on corrispondenze.utente_id = utenti.id
    WHERE matricole.uniqueid = ? and utenti.id = ?`,
  selectDeleteAllPersonalTopic: `DELETE savedtopics FROM corrispondenze 
    JOIN savedtopics on corrispondenze.key = savedtopics.corrispondenza
    JOIN matricole on corrispondenze.matricola_id = matricole.id
    JOIN utenti on corrispondenze.utente_id = utenti.id
    WHERE matricole.uniqueid = ? and utenti.id = ?`,
  selectDeletePersonalTopic: `DELETE savedtopics FROM corrispondenze 
	  JOIN savedtopics on corrispondenze.key = savedtopics.corrispondenza
    JOIN matricole on corrispondenze.matricola_id = matricole.id
    JOIN utenti on corrispondenze.utente_id = utenti.id
    WHERE savedtopics.name = ? and matricole.uniqueid = ? and utenti.id = ?`,
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