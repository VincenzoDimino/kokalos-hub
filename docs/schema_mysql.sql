CREATE DATABASE  IF NOT EXISTS `kokalos_hub_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `kokalos_hub_db`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: kokalos_hub_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_users`
--

DROP TABLE IF EXISTS `admin_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(30) NOT NULL,
  `username` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_3fgxk4ewgaxgtgvqwb1jjudj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_users`
--

LOCK TABLES `admin_users` WRITE;
/*!40000 ALTER TABLE `admin_users` DISABLE KEYS */;
INSERT INTO `admin_users` VALUES (1,'Direzione Cultura Comune di Sciacca','$2a$10$h.0yZsass9x0.4V0D8YnJely.fRHCgobINQsnevkxrt90QaHhRPrC','ADMIN','admin');
/*!40000 ALTER TABLE `admin_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `booking_code` varchar(20) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `number_of_tickets` int NOT NULL,
  `preferred_language` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `visitor_email` varchar(255) NOT NULL,
  `visitor_name` varchar(255) NOT NULL,
  `visitor_phone` varchar(255) DEFAULT NULL,
  `event_id` bigint NOT NULL,
  `visitor_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_q97166k18hklq6ls46osbrftx` (`booking_code`),
  KEY `FK1aslf8arrhyv0fu436hkobg54` (`event_id`),
  KEY `FKa1o595oxkkxfosx59ii4f48df` (`visitor_id`),
  CONSTRAINT `FK1aslf8arrhyv0fu436hkobg54` FOREIGN KEY (`event_id`) REFERENCES `cultural_events` (`id`),
  CONSTRAINT `FKa1o595oxkkxfosx59ii4f48df` FOREIGN KEY (`visitor_id`) REFERENCES `visitor_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'KKL-2026-8491','2026-11-11 15:53:18.078481',4,'EN','CONFIRMED','elena.rostova@example.com','Elena Rostova','+39 333 1234567',2,NULL),(2,'KKL-2026-3910','2026-11-12 15:53:18.078481',5,'IT','CONFIRMED','marco.bellini@example.it','Marco Bellini','+39 347 9876543',1,NULL),(3,'KKL-2026-5521','2026-11-13 10:53:18.078481',2,'DE','CONFIRMED','lukas.weber@example.de','Lukas Weber','+49 170 4455667',3,NULL),(4,'KKL-2026-8425','2026-11-13 16:13:40.141740',10,'IT','CANCELLED','vincenzodimino@yahoo.it','Vincenzo Dimino','',3,1),(5,'KKL-2026-7577','2026-11-13 16:13:50.191484',10,'IT','CONFIRMED','vincenzodimino@yahoo.it','Vincenzo Dimino','',4,1),(7,'KKL-2026-9558','2026-11-14 16:22:35.577811',3,'IT','CONFIRMED','salvatoredimino@hotmail.it','Salvatore Dimino','',6,2),(8,'KKL-2026-3464','2026-11-14 16:39:00.146165',2,'IT','CANCELLED','salvatoredimino@hotmail.it','Salvatore Dimino','',8,2),(9,'KKL-2026-4687','2026-11-14 23:05:06.430760',1,'IT','CONFIRMED','salvatoredimino@hotmail.it','Salvatore Dimino','',3,2),(10,'KKL-2026-7045','2026-11-14 23:05:25.268888',1,'IT','CANCELLED','salvatoredimino@hotmail.it','Salvatore Dimino','',8,2),(13,'KKL-2026-5789','2026-11-14 23:13:31.016361',1,'IT','CANCELLED','salvatoredimino@hotmail.it','Salvatore Dimino','',8,2),(19,'KKL-2026-2631','2026-11-15 01:14:26.010165',1,'IT','CONFIRMED','vincenzodimino@yahoo.it','Vincenzo Dimino','',6,1),(20,'KKL-2026-2156','2026-11-15 01:16:18.054127',1,'IT','CONFIRMED','vincenzodimino@yahoo.it','Vincenzo Dimino','',8,1),(21,'KKL-2026-3707','2026-11-15 01:20:04.481691',2,'IT','CONFIRMED','vincenzodimino@yahoo.it','Vincenzo Dimino','',7,1),(22,'KKL-2026-1748','2026-11-15 01:25:51.683856',1,'IT','CONFIRMED','vincenzodimino@yahoo.it','Vincenzo Dimino','',5,1),(23,'KKL-2026-8791','2026-11-15 01:28:19.303801',3,'IT','CONFIRMED','vincenzodimino@yahoo.it','Vincenzo Dimino','',1,1);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cultural_events`
--

DROP TABLE IF EXISTS `cultural_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cultural_events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `available_seats` int NOT NULL,
  `category` varchar(255) NOT NULL,
  `description_de` text,
  `description_en` text,
  `description_fr` text,
  `description_it` text,
  `event_date` datetime(6) NOT NULL,
  `featured` bit(1) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `location` varchar(255) NOT NULL,
  `max_capacity` int NOT NULL,
  `ticket_price` double NOT NULL,
  `title_de` varchar(255) DEFAULT NULL,
  `title_en` varchar(255) DEFAULT NULL,
  `title_fr` varchar(255) DEFAULT NULL,
  `title_it` varchar(255) NOT NULL,
  `event_end` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cultural_events`
--

LOCK TABLES `cultural_events` WRITE;
/*!40000 ALTER TABLE `cultural_events` DISABLE KEYS */;
INSERT INTO `cultural_events` VALUES (1,482,'CARNEVALE','Einer der ältesten und spektakulärsten Karnevals Italiens. Imposante Pappmaché-Wagen ziehen mit Musik und Tanz durch die Altstadt.','One of the oldest and most spectacular carnivals in Italy. Impressive papier-mâché floats crafted by Sciacca\'s master artisans parade through the historic center with music, dance, and satire.','L\'un des carnavals les plus anciens et spectaculaires d\'Italie. D\'imposants chars en papier mâché réalisés par les maîtres artisans défilent dans le centre historique.','Uno dei carnevali più antichi e spettacolari d\'Italia. Imponenti carri in cartapesta realizzati dai maestri artigiani saccensi sfilano nel centro storico tra musica, danza e satira.','2026-11-25 15:30:00.000000',_binary '','https://www.carnevalesciacca.it/wp-content/uploads/2025/12/BURATTINO-CARNEVALE-2024-e1764778529543.jpg','Centro Storico / Via Allende, Sciacca',500,10,'Karneval von Sciacca - Umzug der allegorischen Wagen','Sciacca Carnival - Allegorical Floats Parade','Carnaval de Sciacca - Défilé des Chars Allégoriques','Carnevale di Sciacca - Sfilata dei Carri Allegorici','2026-11-30 18:48:00.000000'),(2,22,'CERAMICA','Eine Erlebnisreise im Herzen von Sciacca zwischen antiker Majolika, historischen Öfen und Keramikmeistern.','An experiential journey in the heart of Sciacca among ancient majolica, historic kilns, and master ceramicists passing down a thousand-year-old art.','Un parcours expérientiel au cœur de Sciacca entre majoliques anciennes, fours historiques et maîtres céramistes.','Un percorso esperienziale nel cuore di Sciacca tra maioliche antiche, forni storici e maestri ceramisti che tramandano un\'arte millenaria.','2026-11-18 09:00:00.000000',_binary '','https://www.siciliaonpress.com/wp/wp-content/uploads/2023/08/ceramica-sciacca.jpg','Quartiere San Michele & Corso Vittorio Emanuele, Sciacca',30,15,'Freilichtmuseum der 5 Sinne: Tour durch die Keramikwerkstätten','5 Senses Diffused Museum: Ceramic Workshops Tour','Musée Diffus des 5 Sens : Visite des Ateliers de Céramique','Museo Diffuso dei 5 Sensi: Tour delle Botteghe della Ceramica','2026-11-21 18:47:00.000000'),(3,37,'MUSEO','Entdecken Sie das berühmte Freilichtmuseum der sizilianischen Art Brut: Tausende aus Lavastein und Olivenstämmen gemeißelte Köpfe.','Explore the famous open-air museum of Sicilian Art Brut: thousands of heads sculpted in lava stone and olive tree trunks immersed in nature.','Explorez le célèbre musée à ciel ouvert de l\'Art Brut sicilien : des milliers de têtes sculptées dans la pierre volcanique et les oliviers.','Esplora il celebre museo a cielo aperto dell\'Art Brut siciliana: migliaia di teste scolpite nella pietra lavica e nei tronchi d\'ulivo immersi nella natura.','2026-11-16 17:00:00.000000',_binary '','https://globaluserfiles.com/media/175792_376be81c5df034b9c4c4615aea8ed9ee2b921149.jpeg/v1/w_0,h_0/castello-incantato-md5s.jpeg','Via Filippo Bentivegna, Sciacca',45,8,'Das Verwunschene Schloss von Filippo Bentivegna - Führung bei Sonnenuntergang','Filippo Bentivegna\'s Enchanted Castle - Sunset Guided Tour','Le Château Enchanté de Filippo Bentivegna - Visite au Coucher du Soleil','Il Castello Incantato di Filippo Bentivegna - Visita Guidata al Tramonto','2026-11-17 19:00:00.000000'),(4,9,'TERME','Auf den Spuren des sikanischen Königs Kokalos und des Dädalus zwischen den uralten Thermal-Dampfgrotten am Monte Kronio.','Discovering the myth of Sican king Kokalos and Daedalus\'s ingenuity among the ancient thermal vapor caves and the Sanctuary on Mount Kronio.','À la découverte du mythe du roi sicane Kokalos et du génie de Dédale parmi les très anciennes étuves thermales du Mont Kronio.','Alla scoperta del mito del re sicano Kokalos e dell\'ingegno di Dedalo tra le antichissime stufe vaporose termali e il Santuario sul Monte Kronio.','2026-11-21 08:30:00.000000',_binary '\0','https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1d/df/23/95/nelle-viscere-del-monte.jpg?w=1400&h=800&s=1','Riserva Naturale Monte Kronio, Sciacca',25,12,'Dampfgrotten von San Calogero und Monte Kronio - Kulturwanderung','San Calogero Vapor Caves & Mount Kronio - Cultural Trekking','Grottes Vapeureuses de San Calogero et Mont Kronio - Randonnée Culturelle','Grotte Vaporose di San Calogero e Monte Kronio - Trekking Culturale','2026-11-21 18:48:00.000000'),(5,174,'TEATRO','Sinfonie- und Theateraufführung in der beeindruckenden Architektur des Teatro Samonà mit Blick auf das Meer.','Symphonic and theatrical performance in the evocative contemporary architecture of Teatro Samonà overlooking the Sea.','Spectacle symphonique et théâtral dans l\'architecture contemporaine du Théâtre Samonà face à la mer.','Spettacolo sinfonico e teatrale nella suggestiva architettura contemporanea del Teatro Samonà affacciato sul mare.','2026-11-28 20:00:00.000000',_binary '\0','https://www.alfonsodirosa.it/wp-content/uploads/2026/05/DSC00446.jpg','Via Agatocle, Teatro Samonà, Sciacca',200,20,'Nacht im Volkstheater Samonà: Mediterrane Musik und Mythos','Night at Samonà Popular Theater: Mediterranean Music & Myth','Nuit au Théâtre Populaire Samonà : Musique et Mythe Méditerranéen','Notte al Teatro Popolare Samonà: Musica e Mito Mediterraneo','2026-11-29 18:48:00.000000'),(6,40,'GASTRONOMIA','Geführte Verkostung der rosa Garnelen von Sciacca, g.g.A.-Olivenöl und traditionellem Klostergebäck.','Guided tasting of Sciacca pink shrimp, PGI extra virgin olive oil, and traditional convent pastries.','Dégustation guidée de la crevette rose de Sciacca, d\'huile d\'olive IGP et de pâtisseries conventuelles.','Degustazione guidata del gambero rosa di Sciacca, olio extravergine IGP e dolci della tradizione conventuale.','2026-11-23 18:30:00.000000',_binary '','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkRdR-u4tAlzKuLY1qwZoebvnB2OWiiRzi-_O8n6f7rqDbIisegfIqPTGO&s=10','Molo Levante - Porto di Sciacca',60,25,'Azzurro Food & Sikanischer Geschmack: Verkostung am Fischerhafen','Azzurro Food & Sican Taste: Fishing Harbor Tasting','Azzurro Food & Goût Sicane : Dégustation au Port de Pêche','Azzurro Food & Gusto Sicano: Degustazione al Porto Pescareccio','2026-11-29 18:48:00.000000'),(7,998,'GASTRONOMIA','Ein Fest, bei dem Sie typische Fischspezialitäten aus Sciacca genießen können.\nBesuchen Sie uns vom 25. bis 29. Juni im stimmungsvollen, historischen Viertel „Marina“.','A festival where you can enjoy traditional fish-based specialties from Sciacca.\nJoin us from June 25th to 29th in the charming historic \"Marina\" district.','Une fête où vous pourrez déguster les spécialités typiques à base de poisson de Sciacca.\nVenez nous retrouver du 25 au 29 juin dans le quartier historique pittoresque de la « Marina ».','Sagra che vi farà gustare i prodotti tipici del pescato di Sciacca.\nDal 25 al 29 giugno veniteci a trovare nel suggestivo e storico quartiere della Marina.','2027-06-25 08:30:00.000000',_binary '','https://www.vivasicilia.com/wp-content/uploads/2026/06/sagra_mare_sciacca_2027.jpg','Sciacca',1000,25,'Fest des Meeres','Seafood Festival','Fête de la Mer','Sagra del Mare','2027-06-27 17:49:00.000000'),(8,99,'TEATRO','Das Green Valley Pop Fest ist ein großes Musik- und Kulturereignis, das Pop- und Urban-Musik mit der Sensibilisierung für Umweltthemen und ökologische Nachhaltigkeit verbindet.\nIn dieser Ausgabe findet es in Sciacca statt – an dem stimmungsvollen Veranstaltungsort Piazza Angelo Scandaliato.','The Green Valley Pop Fest is a major music and cultural event that combines pop and urban music with awareness-raising on environmental and eco-sustainability issues.\nThis edition will take place in Sciacca, in the evocative setting of Piazza Angelo Scandaliato.','Le Green Valley Pop Fest est un événement musical et culturel d\'envergure qui allie musique pop et urbaine à une sensibilisation aux enjeux environnementaux et à l\'éco-durabilité.\nPour cette édition, il se tiendra à Sciacca, dans le cadre pittoresque de la Piazza Angelo Scandaliato.','Il Green Valley Pop Fest è un grande evento musicale e culturale che unisce la musica pop e urban alla sensibilizzazione sui temi ambientali e dell\'ecosostenibilità.\nIn questa edizione sarà a Sciacca nella suggestiva location di Piazza Angelo Scandaliato.','2027-07-24 15:00:00.000000',_binary '','https://www.visitbelice.it/wp-content/uploads/2023/07/green-valley-pop-fest.jpg','Sciacca',100,30,'Green Valley Pop Fest','Green Valley Pop Fest','Green Valley Pop Fest','Green Valley Pop Fest','2027-07-25 01:30:00.000000');
/*!40000 ALTER TABLE `cultural_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedbacks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `approved` bit(1) NOT NULL,
  `author_name` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `nationality` varchar(255) NOT NULL,
  `rating` int NOT NULL,
  `event_id` bigint DEFAULT NULL,
  `visitor_id` bigint DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK8k12qcp11iqfxngvl6rfqinwa` (`event_id`),
  KEY `FKlhet0pein6l8pn92e7jb24e7m` (`visitor_id`),
  CONSTRAINT `FK8k12qcp11iqfxngvl6rfqinwa` FOREIGN KEY (`event_id`) REFERENCES `cultural_events` (`id`),
  CONSTRAINT `FKlhet0pein6l8pn92e7jb24e7m` FOREIGN KEY (`visitor_id`) REFERENCES `visitor_users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedbacks`
--

LOCK TABLES `feedbacks` WRITE;
/*!40000 ALTER TABLE `feedbacks` DISABLE KEYS */;
INSERT INTO `feedbacks` VALUES (1,_binary '','Claire Dubois','Une expérience authentique au cœur de Sciacca ! Les maîtres céramistes sont passionnés et l\'accueil via Kokalos Hub est impeccable.','2026-11-10 15:53:18.087506','France',5,2,NULL,0),(2,_binary '','Giulia Ferretti','Il Castello Incantato al tramonto è pura magia. Prenotazione rapidissima e guida preparatissima.','2026-11-12 15:53:18.087506','Italia',5,3,NULL,0),(3,_binary '','Enzo Scibetta','Bellissima location incantata','2026-11-13 17:15:39.447279','Italia',5,3,NULL,0),(4,_binary '','Vincenzo Dimino','Bellissima esperienza, location suggestiva','2026-11-13 17:47:00.688581','Italia',4,4,1,0),(10,_binary '\0','Salvo','Carino','2026-11-14 23:43:46.366048','Italia',3,8,2,1),(11,_binary '\0','Vinz','asd','2026-11-14 23:48:44.375991','Italia',5,8,1,1),(12,_binary '\0','Vincenzo Dimino','Brutto evento','2026-11-15 00:20:33.513678','Italia',1,8,1,1),(13,_binary '\0','Vincenzo Dimino','Bellissimo evento','2026-11-15 00:21:40.172846','Italia',5,8,1,1),(14,_binary '','Joseph Joestar','I liked the food, interesting experience.','2026-11-15 01:15:44.414178','USA',4,6,1,0),(15,_binary '','Caroline Dumas','Un événement musical très divertissant, de la bonne musique et un beau cadre !','2026-11-15 01:18:52.728901','France',5,8,1,0),(16,_binary '','Olivier Benz','Frischen, lokal gefangenen Fisch zu essen, ist ein einzigartiges Erlebnis!','2026-11-15 01:25:00.286835','Germania',4,7,1,0),(17,_binary '','Anna Pepe','Esperienza musicale gradevole in una location memorabile.','2026-11-15 01:28:03.636316','Italia',4,5,1,0),(18,_binary '','Francesco Moro','Esperienza stupenda, musica, maschere e carri allegorici artisticamente memorabili.','2026-11-15 01:29:48.813801','Italia',5,1,1,0);
/*!40000 ALTER TABLE `feedbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visitor_users`
--

DROP TABLE IF EXISTS `visitor_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `visitor_users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `wallet_balance` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_3lr9y7ydv48dbk9u8upu2wtko` (`email`),
  UNIQUE KEY `UK_cd641ebfbgwpyvpeau6rq24ww` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visitor_users`
--

LOCK TABLES `visitor_users` WRITE;
/*!40000 ALTER TABLE `visitor_users` DISABLE KEYS */;
INSERT INTO `visitor_users` VALUES (1,'vincenzodimino@yahoo.it','Vincenzo Dimino','$2a$10$QnJ1SLJTmLyXcjHEk994/ec4YHOPB0Bi05A6RLxJK9uidZGQaCRaK','vinz86',295),(2,'salvatoredimino@hotmail.it','Salvatore Dimino','$2a$10$xJfkAQj8UVK7eABJkNUuIu/K2bRaxsWMzCmy9ViJ73HluOXzB5N1q','Salvo89',637);
/*!40000 ALTER TABLE `visitor_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-17 16:43:03
