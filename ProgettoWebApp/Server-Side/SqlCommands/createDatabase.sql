-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema databasev1
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema databasev1
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `databasev1` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
-- -----------------------------------------------------
-- Schema datas
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema datas
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `datas` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `databasev1` ;

-- -----------------------------------------------------
-- Table `databasev1`.`corrispondenze`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `databasev1`.`corrispondenze` (
  `matricola_id` INT NOT NULL,
  `utente_id` INT NOT NULL,
  `modello_id` INT NOT NULL,
  `key` INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`key`))
ENGINE = InnoDB
AUTO_INCREMENT = 73
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `databasev1`.`matricole`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `databasev1`.`matricole` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `uniqueid` VARCHAR(45) NULL DEFAULT NULL,
  `parent` INT NULL DEFAULT NULL,
  `customname` VARCHAR(45) NULL DEFAULT NULL,
  `location` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 161
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `databasev1`.`modelli`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `databasev1`.`modelli` (
  `idmodelli` INT NOT NULL DEFAULT '0',
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `version` VARCHAR(45) NULL DEFAULT NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `databasev1`.`profilepictures`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `databasev1`.`profilepictures` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `utente_id` INT NULL DEFAULT NULL,
  `pictureroot` VARCHAR(96) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `databasev1`.`profilepictures` (`id` ASC) VISIBLE;

CREATE UNIQUE INDEX `idutente_UNIQUE` ON `databasev1`.`profilepictures` (`utente_id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `databasev1`.`savedtopics`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `databasev1`.`savedtopics` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(90) NOT NULL,
  `topicstring` VARCHAR(90) NOT NULL,
  `corrispondenza` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 132
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `databasev1`.`topics`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `databasev1`.`topics` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(90) NULL DEFAULT NULL,
  `topicstring` VARCHAR(90) NULL DEFAULT NULL,
  `actiontype` VARCHAR(45) NULL DEFAULT NULL,
  `boardtype` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 67
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `databasev1`.`utenti`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `databasev1`.`utenti` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NULL DEFAULT NULL,
  `password` BLOB NULL DEFAULT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `surname` VARCHAR(45) NULL DEFAULT NULL,
  `birthday` DATE NULL DEFAULT NULL,
  `permission` INT NULL DEFAULT NULL,
  `lastsession` VARCHAR(128) NULL DEFAULT NULL,
  `selectedmatricolaid` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 17
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `databasev1`.`utenti` (`id` ASC) VISIBLE;

CREATE UNIQUE INDEX `email_UNIQUE` ON `databasev1`.`utenti` (`email` ASC) VISIBLE;

CREATE UNIQUE INDEX `email_index` ON `databasev1`.`utenti` (`email` ASC) VISIBLE;

USE `datas` ;

-- -----------------------------------------------------
-- Table `datas`.`app_crash`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`app_crash` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`app_crash` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`board_temperature`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`board_temperature` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2384
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`board_temperature` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`board_temperature_alarm`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`board_temperature_alarm` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`board_temperature_alarm` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`clock_error`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`clock_error` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`clock_error` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`clock_error_recovery_fisc`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`clock_error_recovery_fisc` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`clock_error_recovery_fisc` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`cpu_overload_alarm`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`cpu_overload_alarm` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`cpu_overload_alarm` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`cpu_usage_average`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`cpu_usage_average` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 24475
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`cpu_usage_average` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`customer_dislay_error`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`customer_dislay_error` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`customer_dislay_error` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`cutter_error`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`cutter_error` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`cutter_error` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`display_line_1`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`display_line_1` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 510
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`display_line_1` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`fiscal_crash`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`fiscal_crash` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`fiscal_crash` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`fiscal_eprom_error`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`fiscal_eprom_error` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`fiscal_eprom_error` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`fiscal_eprom_read_error`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`fiscal_eprom_read_error` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`fiscal_eprom_read_error` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`fiscal_eprom_write_error`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`fiscal_eprom_write_error` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`fiscal_eprom_write_error` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`fiscal_force_powerdown`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`fiscal_force_powerdown` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`fiscal_force_powerdown` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`free_journal_alarm`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`free_journal_alarm` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`free_journal_alarm` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`free_memory`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`free_memory` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 13347
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`free_memory` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`free_memory_alarm`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`free_memory_alarm` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`free_memory_alarm` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`free_storage`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`free_storage` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2391
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`free_storage` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`free_storage_alarm`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`free_storage_alarm` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`free_storage_alarm` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`heartbeat`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`heartbeat` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 69350
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`heartbeat` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`init_app`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`init_app` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`init_app` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`journal_not_recognized`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`journal_not_recognized` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`journal_not_recognized` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`journal_not_usable`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`journal_not_usable` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`journal_not_usable` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`line`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`line` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 460
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`line` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`location`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`location` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 541
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`location` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`paper_cut_number`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`paper_cut_number` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 94
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`paper_cut_number` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`printer_error`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`printer_error` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`printer_error` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`recovery_fisc`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`recovery_fisc` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`recovery_fisc` (`id` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `datas`.`reset_app`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `datas`.`reset_app` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `value` VARCHAR(45) NOT NULL,
  `timestamp` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `matricola_id` VARCHAR(45) NOT NULL,
  `topicname` VARCHAR(45) NOT NULL,
  `topicstring` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `id_UNIQUE` ON `datas`.`reset_app` (`id` ASC) VISIBLE;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
