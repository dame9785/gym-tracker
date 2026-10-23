-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: gymtracker
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
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('1418a29c-5fa2-4cbc-ad39-de1f20283a5a','721369ffa10256c2fb0b5f51b3a91fe014781926801a00a5da229da43475ded3','2026-09-02 12:36:50.986','20260901101530_add_user_to_exercise',NULL,NULL,'2026-09-02 12:36:50.924',1),('1eb8e20a-91f3-4560-a489-588dddb0523e','a5dcd158b395d7a2725c2984f2f7bd54d75945dcaf9b675bfaaed011d17cfbc4','2026-09-02 12:36:50.920','20260830093748_beskrivning_av_andringen',NULL,NULL,'2026-09-02 12:36:50.856',1),('1ecf58bc-eb06-4abe-8835-63bbe3e71416','916d09c0c895cc46fb612e0182d079422669a5cbe9bd440b8dfbae21555718dd','2026-09-02 12:36:49.516','20260727084215_fixed_reations',NULL,NULL,'2026-09-02 12:36:49.019',1),('201a1564-c316-44bd-93cc-3cd5d465d133','0a7245e636507b68eb2f95dadee4e1db8941f0b9b3e810e23b64e725c4ce77a1','2026-09-02 12:36:46.983','20260720075304_add_user_fields',NULL,NULL,'2026-09-02 12:36:46.925',1),('25cdf440-1aaf-4ab2-a266-2ce8840925d2','081c8fc6f922a6916f48b7e80a3911298514fcb9ba5089771d1fba4fd0b3e30b','2026-09-02 12:36:48.864','20260724071611_added_status_on_workout_schedule_moodel',NULL,NULL,'2026-09-02 12:36:48.797',1),('2f0eb312-3801-4aba-8b9f-f5b564c917a8','4671206c12117f6aa35ca33c77da9e219d7f75e0a372ecf1fd09ae39d6a2aa8a','2026-09-02 12:36:51.245','20260901103331_add_user_id_to_exercise',NULL,NULL,'2026-09-02 12:36:50.989',1),('3c31e1c4-8170-4de4-bdf0-795744e44bdb','b3bbe301a3cf2b2de02d2fea831851b718190b02327cedf4d0fcf6125fa5685e','2026-09-02 12:36:46.732','20260707061722_optional_profile_fields',NULL,NULL,'2026-09-02 12:36:46.671',1),('437dc328-2d3e-4620-803a-1009973c56d8','19ddc0c06bece2412257aa4eb322017b5c18f3db890f94feef98b7eb1ec16ff6','2026-09-02 12:36:49.877','20260729105730_cascade',NULL,NULL,'2026-09-02 12:36:49.691',1),('4f93efb7-231e-474d-802f-7af71f08a035','27da571d69b7be37f5fdb5af168444c5e1c6017bc40dfd87914def1e0a5ed517','2026-09-02 12:36:50.851','20260828065131_add_nutrition_goal',NULL,NULL,'2026-09-02 12:36:50.771',1),('56fb913e-0ffb-4fdb-9e80-bbd100643985','e4e1a6a7778765dff52b9369d452e71dff158236a56c0899ec8fd4f8df15cc37','2026-09-02 12:36:47.227','20260720083235_add_user_fields',NULL,NULL,'2026-09-02 12:36:47.159',1),('585d540a-03b6-4f36-aab2-b397894bdac8','1286c4bc722a7b20b1e6d03e0083964ccd4ccb1ecbe4321dd2848dd3bc335fce','2026-09-02 12:36:50.064','20260823084228_add_estimated_minutes_to_workout',NULL,NULL,'2026-09-02 12:36:49.942',1),('5f416fbc-2e3d-464c-95ce-b8f515ae0201','08fb5174cbc50a328eeed5933fd940fa0bfc0cc5377d00be37cb47bf2993dbec','2026-09-02 12:36:47.102','20260720082158_add_body_lenght_fields',NULL,NULL,'2026-09-02 12:36:47.050',1),('5fac85d8-6fe7-4ef3-858f-f4b5a61add2b','7a61dfb8ba27f8b943094b9bf0e8a8fbb0bc6ad9b44a359bff209782ad45368c','2026-09-02 12:36:49.662','20260728074353_add_weight_log',NULL,NULL,'2026-09-02 12:36:49.577',1),('6c0e2550-4950-4943-8cb6-a68f7c4555a7','33680884335a00a52e081feebf65c864c74b241f029918ff6868c6356f1e236d','2026-09-02 12:36:49.015','20260725064416_removed_status_from_schedelue',NULL,NULL,'2026-09-02 12:36:48.867',1),('70b4b088-ac10-4529-9015-ebc0d698f3a6','bc080638d03b6fa36c2529a52640f6677a2832d31a5ea64eaa790f0e068dd969','2026-09-02 12:36:50.372','20260827105714_add_nutrition_to_calorie_log',NULL,NULL,'2026-09-02 12:36:50.227',1),('731e31bf-6164-403b-9ced-416fda032853','7b8803eb560a681d971a906a5819f00d991badfc81c63b5ab362618031c6b2dd','2026-09-02 12:36:47.156','20260720083129_add_user_fields',NULL,NULL,'2026-09-02 12:36:47.104',1),('78e64247-89d2-42a7-b805-b87814b9726e','dc58820f34b327cd8e831e363a37748b7f0a20976bd4f6298cbf6fd8c82350ff','2026-09-02 12:36:50.768','20260828064930_add_nutrition_goals',NULL,NULL,'2026-09-02 12:36:50.686',1),('79b79dd1-db67-4b8c-ad2e-81119a29510d','644ef8ba2e9972d493f879b53cf62fec8540e5184c3104512604845876e2315b','2026-09-02 12:36:50.225','20260827094310_add_calorie_goal',NULL,NULL,'2026-09-02 12:36:50.175',1),('7dc07999-f6d1-48cb-b724-442544c6713d','4a6266317341a2dcaa4025d48cfb744878baa52a2a2339532164e20031dbbbdb','2026-09-02 12:36:47.047','20260720081452_add_goal_date',NULL,NULL,'2026-09-02 12:36:46.986',1),('9875e3fe-a73a-4284-8e78-96b5f7d73bfc','4679f8d86c40d0c175aee9a7793632a2049a2c366aaf18bef6cb05918582c243','2026-09-02 12:36:49.575','20260727091751_remove_time',NULL,NULL,'2026-09-02 12:36:49.519',1),('9ac1be45-2f10-4e94-bb0e-cfccafd9d2f7','4ca01458eacfc5226af180b3a18ce861f8001de497a651a1203f54f6187ed757','2026-09-02 12:36:47.950','20260722100422_added_workout_model',NULL,NULL,'2026-09-02 12:36:47.460',1),('a896e5a4-0f3d-46d7-ac24-10a35203e0b0','8939766277b2e541ab8a64b511c93b031e5f701dfe95db49cf0bffb3a3ae4aee','2026-09-02 12:36:50.624','20260827124643_add_meals_and_foods',NULL,NULL,'2026-09-02 12:36:50.376',1),('ac062957-1426-49db-ac48-ebc1806b78af','49f526b559a7df41a1fb696c3182ad02bc7247774814e614d2aaf792a4dfa863','2026-09-02 12:36:46.434','20260706152825_init',NULL,NULL,'2026-09-02 12:36:46.399',1),('b2dcaf3b-9f96-44ff-93a2-fa989c3dcce6','c8528cf27077ab73d27b2785830ebe39ec58cfcfc91de1ed94253afe83784123','2026-09-02 12:36:47.458','20260720092510_removed_lenght',NULL,NULL,'2026-09-02 12:36:47.393',1),('b97fc299-f511-4523-a6fc-213e9771c843','33396c226a3af01bc0ade95203dd4252a90e2cb8a264757d3407417fe8c59346','2026-09-02 12:36:47.390','20260720092348_removed_desc_on_user_model',NULL,NULL,'2026-09-02 12:36:47.311',1),('ba23c7e9-21c7-4a63-9a01-10f8003a1848','e37b3ccbfba6d843e79eabb7dc7f1a4009d1ca227197e501c8c6c064cdd648fc','2026-09-02 12:36:47.309','20260720092244_add_bfr_fields',NULL,NULL,'2026-09-02 12:36:47.230',1),('c1fded37-7a41-4d57-b3e5-f59e45c5dc67','b6c2d9ea1ff463e84c660a5e7084f9ce71da02feb9d206a6a13d1b53fdcc7340','2026-09-02 12:36:50.172','20260827081741_add_calorie_logs',NULL,NULL,'2026-09-02 12:36:50.068',1),('dabc0484-2121-46c8-a281-e954ef294710','770b813afde5ea2c37267e4a299a7fec99d72f0e532a7f1b13cae1dcb78164b6','2026-09-02 12:36:50.683','20260828061746_make_meal_type_required',NULL,NULL,'2026-09-02 12:36:50.627',1),('dcdf7d6b-88a9-44f0-b7b9-a5c1fb0a2fce','0f85a43b71cace63971efa22ac13070060f977d613a146423eb988d5a0f53f7b','2026-09-02 12:36:49.940','20260808034344_updated_body_lenght_to_height',NULL,NULL,'2026-09-02 12:36:49.879',1),('df126b09-fa1b-4f1d-ab4d-f265d2ed5c62','d64269b6aa55321d8e710fec29be6d1ef56966dd899c3cf2f22cd457ae8441af','2026-09-02 12:36:48.740','20260723151935_add_workout_session',NULL,NULL,'2026-09-02 12:36:48.188',1),('df378829-e68d-42da-afb3-6a970914bb2c','13f9fe4a61b0fc681211a01a17f6549533b7287415fdd5940f32e5326f8d5b34','2026-09-02 12:36:51.352','20260901122202_ditt_migrationsnamn',NULL,NULL,'2026-09-02 12:36:51.247',1),('e27169ab-4fd0-48d2-b473-77d96b244ea2','5ea4fb0a2614a6696f0b7a59fdf31644fc1b26682e7c16c8a502c5b53f8eaca4','2026-09-02 12:36:49.688','20260728074715_added_index_to_weightlogdbm',NULL,NULL,'2026-09-02 12:36:49.665',1),('e90dc113-cf5c-4e9b-85e5-b91286b6c6f5','f2684490b699cc86af379e3fb4b797f70c38b7d3b9aa749352022fc28417f8cf','2026-09-02 12:36:48.794','20260723153404_add_actual_values_to_workout_session_set',NULL,NULL,'2026-09-02 12:36:48.743',1),('eeca8981-6955-4596-b0c5-fe632157d0eb','0670cedabae60f9816290efa1a1d133c5059a079bfafaa2204e485ce5a20df70','2026-09-02 12:36:46.923','20260709101253_add_goal_type',NULL,NULL,'2026-09-02 12:36:46.734',1),('fa8efb52-a331-43a6-a0fa-c17eeecedd9d','ccc0bf3f8d8cb8d02cbd5a37ab6df9ad0492fa8a5df7ff153de067c65538b9b3','2026-09-02 12:36:51.532','20260902123623',NULL,NULL,'2026-09-02 12:36:51.355',1),('fabd0af2-b395-431a-b50f-90b6c3605896','810795847f2bdf16d30ea50d3c3ba667531a94e33c87596e17f27fc359cbd405','2026-09-02 12:36:48.184','20260723101249_add_workout_schedule',NULL,NULL,'2026-09-02 12:36:47.953',1),('fb8e2187-2d9e-44db-a11b-3bbab760b153','97070ef5406adc7987a2427c523a984d3dc61dfcfd4eacbedddd7358c0ed136d','2026-10-21 08:48:55.041','20261021084854_add_image_path_to_exercise',NULL,NULL,'2026-10-21 08:48:55.008',1),('fcfaff48-8700-490d-b2ef-da5eaea73fdc','01641db3dbe26981a9c12a79007935381ac3c3b61a2b8d2f35156982a2b38fbc','2026-09-02 12:36:46.668','20260707060335_update_user',NULL,NULL,'2026-09-02 12:36:46.436',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calorielog`
--

DROP TABLE IF EXISTS `calorielog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calorielog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `calories` int NOT NULL DEFAULT '0',
  `carbs` int NOT NULL DEFAULT '0',
  `fat` int NOT NULL DEFAULT '0',
  `loggedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `protein` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `CalorieLog_userId_idx` (`userId`),
  CONSTRAINT `CalorieLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calorielog`
--

LOCK TABLES `calorielog` WRITE;
/*!40000 ALTER TABLE `calorielog` DISABLE KEYS */;
/*!40000 ALTER TABLE `calorielog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exercise`
--

DROP TABLE IF EXISTS `exercise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercise` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `muscleGroup` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `equipment` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `userId` int NOT NULL,
  `imagePath` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Exercise_userId_fkey` (`userId`),
  CONSTRAINT `Exercise_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercise`
--

LOCK TABLES `exercise` WRITE;
/*!40000 ALTER TABLE `exercise` DISABLE KEYS */;
INSERT INTO `exercise` VALUES (1,'Squat','Quads / Glutes','Kettlebell',1,'/exercises/squat.jpg'),(2,'Push-ups','Chest / Triceps','Bodyweight',1,'/exercises/push-ups.jpg'),(3,'Kettlebell Row','Back / Biceps','Kettlebell',1,'/exercises/kettlebell-row.jpg'),(4,'Kettlebell Shoulder Press','Shoulders / Triceps','Kettlebell',1,'/exercises/kettlebell-shoulder-press.jpg'),(5,'Plank','Core / Abs','Bodyweight',1,'/exercises/plank.jpg'),(6,'Dead bug','Core (abs)','Bodyweight',1,'/exercises/dead-bug.jpg'),(7,'Glute bridge','Glutes (buttocks)','Bodyweight',1,'/exercises/glute-bridge.jpg'),(8,'Kettlebell lateral raise','Shoulders (deltoids)','Kettlebell',1,'/exercises/kettlebell-lateral-raise.jpg');
/*!40000 ALTER TABLE `exercise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food`
--

DROP TABLE IF EXISTS `food`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `caloriesPer100g` double NOT NULL,
  `proteinPer100g` double NOT NULL,
  `carbsPer100g` double NOT NULL,
  `fatPer100g` double NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Food_userId_fkey` (`userId`),
  CONSTRAINT `Food_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food`
--

LOCK TABLES `food` WRITE;
/*!40000 ALTER TABLE `food` DISABLE KEYS */;
INSERT INTO `food` VALUES (1,'AXA Havregryn',367,13,58,6.8,'2026-09-02 12:52:30.612','2026-09-02 13:32:24.384',1),(2,'Eldorado Honungspuffar',388,8.6,82,1.8,'2026-09-02 13:44:41.806','2026-09-02 13:44:41.806',1),(3,'Garant Laktosfri Lättmjölkdryck blå',30,3.3,2.9,0.5,'2026-09-02 13:45:11.708','2026-09-02 13:45:11.708',1),(4,'Garant Laktosfri Lätt Mjölkdryck Grön',30,3.3,2.9,0.5,'2026-09-02 13:45:44.295','2026-09-02 13:45:44.295',1),(5,'Quornbitar Ovo-vegetariska',97,14,4.2,1.6,'2026-09-02 13:51:48.260','2026-09-02 13:51:48.260',1),(6,'Eldorado Honungspuffar',388,8.6,82,1.8,'2026-09-02 13:54:35.024','2026-09-02 13:54:35.024',2),(7,'Quornbitar Ovo-vegetariska',97,14,4.2,1.6,'2026-09-02 13:55:00.433','2026-09-02 13:55:00.433',2),(8,'Garant Laktosfri Lätt Mjölkdryck Blå',28,3.4,2.4,0.5,'2026-09-02 13:55:36.081','2026-09-02 16:25:39.637',2),(9,'Kungsörnen Snabbmakaroner',350,12,70,2,'2026-09-02 14:15:04.221','2026-09-02 14:15:04.221',2),(10,'Skogaholmslimpa',280,7.3,51,3.8,'2026-09-03 11:58:52.531','2026-09-03 11:58:52.531',2),(11,'Skogaholmslimpa',280,7.3,51,3.8,'2026-09-03 12:08:19.017','2026-09-03 12:08:19.017',1);
/*!40000 ALTER TABLE `food` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goal`
--

DROP TABLE IF EXISTS `goal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goal` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `calories` int DEFAULT NULL,
  `protein` int DEFAULT NULL,
  `carbs` int DEFAULT NULL,
  `fat` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Goal_userId_key` (`userId`),
  CONSTRAINT `Goal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goal`
--

LOCK TABLES `goal` WRITE;
/*!40000 ALTER TABLE `goal` DISABLE KEYS */;
/*!40000 ALTER TABLE `goal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `meal`
--

DROP TABLE IF EXISTS `meal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meal` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mealType` enum('BREAKFAST','LUNCH','DINNER','SNACK') COLLATE utf8mb4_unicode_ci NOT NULL,
  `loggedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Meal_userId_idx` (`userId`),
  CONSTRAINT `Meal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meal`
--

LOCK TABLES `meal` WRITE;
/*!40000 ALTER TABLE `meal` DISABLE KEYS */;
INSERT INTO `meal` VALUES (1,1,'LUNCH','LUNCH','2026-09-02 13:18:03.891','2026-09-02 13:18:03.891','2026-09-02 13:18:03.891'),(2,1,'BREAKFAST','BREAKFAST','2026-09-02 13:32:34.878','2026-09-02 13:32:34.878','2026-09-02 13:32:34.878'),(3,1,'BREAKFAST','BREAKFAST','2026-09-02 13:45:52.893','2026-09-02 13:45:52.893','2026-09-02 13:45:52.893'),(4,1,'BREAKFAST','BREAKFAST','2026-09-02 13:46:02.323','2026-09-02 13:46:02.323','2026-09-02 13:46:02.323'),(5,2,'BREAKFAST','BREAKFAST','2026-09-02 14:05:52.839','2026-09-02 14:05:52.839','2026-09-02 14:05:52.839'),(6,2,'LUNCH','LUNCH','2026-09-02 14:06:08.117','2026-09-02 14:06:08.117','2026-09-02 14:06:08.117'),(7,2,'DINNER','DINNER','2026-09-02 16:24:39.750','2026-09-02 16:24:39.750','2026-09-02 16:24:39.750'),(8,2,'LUNCH','LUNCH','2026-09-03 11:59:40.907','2026-09-03 11:59:40.907','2026-09-03 11:59:40.907'),(9,2,'BREAKFAST','BREAKFAST','2026-09-03 12:00:02.292','2026-09-03 12:00:02.292','2026-09-03 12:00:02.292'),(10,1,'BREAKFAST','BREAKFAST','2026-09-03 12:07:31.656','2026-09-03 12:07:31.656','2026-09-03 12:07:31.656'),(11,1,'BREAKFAST','BREAKFAST','2026-09-07 08:40:59.266','2026-09-07 08:40:59.266','2026-09-07 08:40:59.266');
/*!40000 ALTER TABLE `meal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mealitem`
--

DROP TABLE IF EXISTS `mealitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mealitem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mealId` int NOT NULL,
  `foodId` int NOT NULL,
  `grams` double NOT NULL,
  `calories` double NOT NULL,
  `protein` double NOT NULL,
  `carbs` double NOT NULL,
  `fat` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `MealItem_mealId_idx` (`mealId`),
  KEY `MealItem_foodId_idx` (`foodId`),
  CONSTRAINT `MealItem_foodId_fkey` FOREIGN KEY (`foodId`) REFERENCES `food` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `MealItem_mealId_fkey` FOREIGN KEY (`mealId`) REFERENCES `meal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mealitem`
--

LOCK TABLES `mealitem` WRITE;
/*!40000 ALTER TABLE `mealitem` DISABLE KEYS */;
INSERT INTO `mealitem` VALUES (2,2,1,100,367,13,58,6.8),(3,3,2,200,776,17.2,164,3.6),(4,4,4,200,60,6.6,5.8,1),(5,1,5,100,97,14,4.2,1.6),(6,2,6,200,776,17.2,164,3.6),(7,2,6,200,776,17.2,164,3.6),(8,2,6,200,776,17.2,164,3.6),(9,2,6,200,776,17.2,164,3.6),(10,2,6,200,776,17.2,164,3.6),(11,2,6,200,776,17.2,164,3.6),(12,2,8,200,56,6.8,4.8,1),(13,2,8,200,56,6.8,4.8,1),(14,2,8,200,56,6.8,4.8,1),(15,2,6,200,776,17.2,164,3.6),(19,6,7,100,97,14,4.2,1.6),(20,5,6,200,776,17.2,164,3.6),(21,6,9,100,350,12,70,2),(22,7,6,200,776,17.2,164,3.6),(24,7,8,200,56,6.8,4.8,1),(26,9,10,70,196,5.109999999999999,35.7,2.66),(27,9,6,300,1164,25.8,246,5.4),(28,9,8,200,56,6.8,4.8,1),(29,10,2,200,776,17.2,164,3.6),(30,10,4,200,60,6.6,5.8,1),(31,10,11,70,196,5.109999999999999,35.7,2.66),(32,10,4,200,60,6.6,5.8,1),(33,11,2,200,776,17.2,164,3.6),(34,11,4,200,60,6.6,5.8,1),(35,11,4,50,15,1.65,1.45,0.25);
/*!40000 ALTER TABLE `mealitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `birthDate` date NOT NULL,
  `bodyWeight` decimal(5,2) NOT NULL,
  `firstName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` enum('MALE','FEMALE','OTHER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedAt` datetime(3) NOT NULL,
  `goalWeight` decimal(5,2) NOT NULL,
  `phoneNumber` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `goalDate` date NOT NULL,
  `height` decimal(5,2) NOT NULL,
  `goalType` enum('WEIGHT_LOSS','MUSCLE_GAIN','MAINTENANCE') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  UNIQUE KEY `User_username_key` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Djanar97','soderbergdavid97@gmail.com','2026-09-02 12:52:01.579','1997-09-26',72.60,'David','MALE','Söderberg','$2b$10$e5vHxXvluToKktE1.dh9kea3qS6Nn6WV79PJDd.UfC.vJFBufhkse','2026-10-20 11:29:16.035',80.00,'0766539127','2026-10-01',174.00,'MUSCLE_GAIN'),(2,'MegRitzh','megritzh@gmail.com','2026-09-02 13:53:13.345','1985-07-31',94.30,'Megan','FEMALE','Lundbäck','$2b$10$HCCD0.R3UoscNM4FNCFCH.rhj34kPpFvX9x55iVrIXuimznuR1mGy','2026-10-20 09:37:48.182',80.00,'+46766539127','2026-10-01',175.00,'WEIGHT_LOSS');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weightlog`
--

DROP TABLE IF EXISTS `weightlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weightlog` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `weight` decimal(5,2) NOT NULL,
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `loggedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `WeightLog_userId_loggedAt_idx` (`userId`,`loggedAt`),
  CONSTRAINT `WeightLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weightlog`
--

LOCK TABLES `weightlog` WRITE;
/*!40000 ALTER TABLE `weightlog` DISABLE KEYS */;
INSERT INTO `weightlog` VALUES (1,1,74.00,'Lunch','2026-09-04 11:24:45.847'),(2,1,74.70,'Lunch','2026-09-08 09:32:31.968'),(3,1,72.60,'Lunch','2026-10-13 10:35:05.961'),(4,1,70.80,'Morgon','2026-10-16 09:02:01.582'),(5,2,101.00,'Lunch','2026-10-17 09:56:41.232'),(6,1,72.50,'Lunch','2026-10-19 10:56:17.876'),(7,2,94.30,'Lunch','2026-10-20 09:37:48.186'),(8,1,72.60,'Lunch','2026-10-20 11:29:16.084');
/*!40000 ALTER TABLE `weightlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workout`
--

DROP TABLE IF EXISTS `workout`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workout` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `estimatedMinutes` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Workout_userId_idx` (`userId`),
  CONSTRAINT `Workout_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workout`
--

LOCK TABLES `workout` WRITE;
/*!40000 ALTER TABLE `workout` DISABLE KEYS */;
INSERT INTO `workout` VALUES (5,1,'Helkropp A','Fokus: Bröst, rygg, ben och mage','2026-10-16 08:51:21.351','2026-10-16 08:51:21.351',NULL),(6,1,'Helkropp B','Fokus: Rygg, ben, axlar och bå','2026-10-16 08:55:23.400','2026-10-16 08:55:23.400',NULL),(8,1,'Helkropp C','Fokus: Repetera tekniken och avsluta veckan stabilt','2026-10-16 08:59:29.035','2026-10-16 08:59:29.035',NULL),(9,1,'Test workout','Testing','2026-10-19 11:29:12.769','2026-10-20 09:25:47.559',NULL),(12,1,'Test 4','test 4','2026-10-20 09:54:05.243','2026-10-20 09:54:05.243',NULL);
/*!40000 ALTER TABLE `workout` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workoutexercise`
--

DROP TABLE IF EXISTS `workoutexercise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workoutexercise` (
  `id` int NOT NULL AUTO_INCREMENT,
  `workoutId` int NOT NULL,
  `exerciseId` int NOT NULL,
  `sets` int NOT NULL,
  `reps` int DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `order` int NOT NULL,
  `note` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seconds` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `WorkoutExercise_exerciseId_idx` (`exerciseId`),
  KEY `WorkoutExercise_workoutId_idx` (`workoutId`),
  CONSTRAINT `WorkoutExercise_exerciseId_fkey` FOREIGN KEY (`exerciseId`) REFERENCES `exercise` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `WorkoutExercise_workoutId_fkey` FOREIGN KEY (`workoutId`) REFERENCES `workout` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workoutexercise`
--

LOCK TABLES `workoutexercise` WRITE;
/*!40000 ALTER TABLE `workoutexercise` DISABLE KEYS */;
INSERT INTO `workoutexercise` VALUES (21,5,1,2,10,0,1,'',0),(22,5,2,2,5,0,2,'',0),(23,5,3,2,10,12.5,3,'',0),(24,5,4,2,8,2.5,4,'',0),(25,5,5,2,0,0,5,'',20),(26,5,6,2,6,0,6,'',0),(27,6,1,2,10,12.5,1,'',0),(28,6,2,2,5,0,2,'',0),(29,6,3,2,10,12.5,3,'',0),(30,6,7,2,12,0,4,'',0),(31,6,6,2,6,0,5,'',0),(34,8,1,2,10,12.5,1,'',0),(35,8,2,2,8,0,2,'',0),(36,8,3,2,10,12.5,3,'',0),(37,8,4,2,8,2.5,4,'',0),(38,8,7,2,12,0,5,'',0),(39,8,5,2,0,0,6,'',25),(75,9,8,34,34,34,1,'',10),(76,9,7,324,34,34,2,'',15),(80,12,1,3,5,3,1,'',23);
/*!40000 ALTER TABLE `workoutexercise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workoutschedule`
--

DROP TABLE IF EXISTS `workoutschedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workoutschedule` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `workoutId` int NOT NULL,
  `date` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `WorkoutSchedule_userId_idx` (`userId`),
  KEY `WorkoutSchedule_workoutId_idx` (`workoutId`),
  CONSTRAINT `WorkoutSchedule_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `WorkoutSchedule_workoutId_fkey` FOREIGN KEY (`workoutId`) REFERENCES `workout` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workoutschedule`
--

LOCK TABLES `workoutschedule` WRITE;
/*!40000 ALTER TABLE `workoutschedule` DISABLE KEYS */;
INSERT INTO `workoutschedule` VALUES (5,1,5,'2026-10-19 00:00:00.000','2026-10-16 08:51:47.193'),(6,1,6,'2026-10-21 00:00:00.000','2026-10-16 08:55:36.582'),(7,1,8,'2026-10-23 00:00:00.000','2026-10-16 08:59:37.093');
/*!40000 ALTER TABLE `workoutschedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workoutsession`
--

DROP TABLE IF EXISTS `workoutsession`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workoutsession` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `workoutId` int NOT NULL,
  `startedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `finishedAt` datetime(3) DEFAULT NULL,
  `status` enum('ACTIVE','COMPLETED','NOTCOMPLETED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`id`),
  KEY `WorkoutSession_userId_idx` (`userId`),
  KEY `WorkoutSession_workoutId_idx` (`workoutId`),
  CONSTRAINT `WorkoutSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `WorkoutSession_workoutId_fkey` FOREIGN KEY (`workoutId`) REFERENCES `workout` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workoutsession`
--

LOCK TABLES `workoutsession` WRITE;
/*!40000 ALTER TABLE `workoutsession` DISABLE KEYS */;
INSERT INTO `workoutsession` VALUES (3,1,5,'2026-10-19 10:04:51.123','2026-10-19 10:21:56.920','COMPLETED'),(4,1,6,'2026-10-21 11:05:14.353','2026-10-21 11:22:13.666','COMPLETED');
/*!40000 ALTER TABLE `workoutsession` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workoutsessionexercise`
--

DROP TABLE IF EXISTS `workoutsessionexercise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workoutsessionexercise` (
  `id` int NOT NULL AUTO_INCREMENT,
  `workoutSessionId` int NOT NULL,
  `workoutExerciseId` int NOT NULL,
  `order` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `WorkoutSessionExercise_workoutSessionId_idx` (`workoutSessionId`),
  KEY `WorkoutSessionExercise_workoutExerciseId_idx` (`workoutExerciseId`),
  CONSTRAINT `WorkoutSessionExercise_workoutExerciseId_fkey` FOREIGN KEY (`workoutExerciseId`) REFERENCES `workoutexercise` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `WorkoutSessionExercise_workoutSessionId_fkey` FOREIGN KEY (`workoutSessionId`) REFERENCES `workoutsession` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workoutsessionexercise`
--

LOCK TABLES `workoutsessionexercise` WRITE;
/*!40000 ALTER TABLE `workoutsessionexercise` DISABLE KEYS */;
INSERT INTO `workoutsessionexercise` VALUES (11,3,21,1),(12,3,22,2),(13,3,23,3),(14,3,24,4),(15,3,25,5),(16,3,26,6),(17,4,27,1),(18,4,28,2),(19,4,29,3),(20,4,30,4),(21,4,31,5);
/*!40000 ALTER TABLE `workoutsessionexercise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workoutsessionset`
--

DROP TABLE IF EXISTS `workoutsessionset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workoutsessionset` (
  `id` int NOT NULL AUTO_INCREMENT,
  `workoutSessionExerciseId` int NOT NULL,
  `setNumber` int NOT NULL,
  `targetReps` int NOT NULL,
  `targetWeight` double DEFAULT NULL,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  `completedAt` datetime(3) DEFAULT NULL,
  `actualReps` int DEFAULT NULL,
  `actualWeight` double DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `WorkoutSessionSet_workoutSessionExerciseId_idx` (`workoutSessionExerciseId`),
  CONSTRAINT `WorkoutSessionSet_workoutSessionExerciseId_fkey` FOREIGN KEY (`workoutSessionExerciseId`) REFERENCES `workoutsessionexercise` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workoutsessionset`
--

LOCK TABLES `workoutsessionset` WRITE;
/*!40000 ALTER TABLE `workoutsessionset` DISABLE KEYS */;
INSERT INTO `workoutsessionset` VALUES (21,11,1,10,0,1,NULL,10,0),(22,11,2,10,0,1,NULL,10,0),(23,12,1,5,0,1,NULL,10,0),(24,12,2,5,0,1,NULL,5,0),(25,13,1,10,12.5,1,NULL,10,12.5),(26,13,2,10,12.5,1,NULL,10,12.5),(27,14,1,8,2.5,1,NULL,10,2.5),(28,14,2,8,2.5,1,NULL,10,2.5),(29,15,1,0,0,1,NULL,0,0),(30,15,2,0,0,1,NULL,0,0),(31,16,1,6,0,1,NULL,6,0),(32,16,2,6,0,1,NULL,6,0),(33,17,1,10,12.5,1,NULL,10,12.5),(34,17,2,10,12.5,1,NULL,10,12.5),(35,18,1,5,0,1,NULL,10,0),(36,18,2,5,0,1,NULL,10,0),(37,19,1,10,12.5,1,NULL,10,12.5),(38,19,2,10,12.5,1,NULL,10,12.5),(39,20,1,12,0,1,NULL,12,0),(40,20,2,12,0,1,NULL,12,0),(41,21,1,6,0,1,NULL,6,0),(42,21,2,6,0,1,NULL,6,0);
/*!40000 ALTER TABLE `workoutsessionset` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-23 11:21:22
