CREATE DATABASE `databasev1`;

CREATE TABLE `corrispondenze` (
  `matricola_id` int NOT NULL,
  `utente_id` int NOT NULL,
  `modello_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `matricole` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uniqueid` varchar(45) DEFAULT NULL,
  `parent` int DEFAULT NULL,
  `customname` varchar(45) DEFAULT NULL,
  `location` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `modelli` (
  `idmodelli` int NOT NULL DEFAULT '0',
  `name` varchar(45) DEFAULT NULL,
  `version` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `databasev1`.`modelli`
(`idmodelli`,
`name`,
`version`)
VALUES
('1', 'form100', '1.0.0'),
('2', 'form200', '1.0.0'),
('3', 'form200plus', '1.0.0'),
('4', 'Nettun@3000 RT', '1.0.0'),
('5', 'form500', '1.0.0'),
('6', 'Nettun@7000plus RT', '1.0.0'),
('7', 'formPOS 50', '1.0.0'),
('8', 'formPOS 600', '1.0.0'),
('9', 'formPOS 800', '1.0.0');

CREATE TABLE `savedtopic` (
  `id` int NOT NULL AUTO_INCREMENT,
  `matricola_id` int DEFAULT NULL,
  `utente_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `topics` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `topicstring` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `utenti` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(45) DEFAULT NULL,
  `password` blob,
  `name` varchar(45) DEFAULT NULL,
  `surname` varchar(45) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `permission` int DEFAULT NULL,
  `lastsession` varchar(128) DEFAULT NULL,
  `selectedmatricolaid` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
