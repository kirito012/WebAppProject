SELECT utenti.matricole.customname,  utenti.utenti.name as parentName, macchine.modelli.name as model, utenti.matricole.uniqueid
FROM macchine.corrispondenze JOIN utenti.matricole on corrispondenze.matricola_id = utenti.matricole.id
							 JOIN utenti.utenti on corrispondenze.utente_id = utenti.utenti.id
                             JOIN macchine.modelli on corrispondenze.modello_id = macchine.modelli.idmodelli
WHERE corrispondenze.utente_id = 1;

INSERT INTO macchine.corrispondenze values(31,13,2);

UPDATE macchine.corrispondenze set modello_id = 5 where modello_id = 0;