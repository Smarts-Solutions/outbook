-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 27, 2025 at 01:20 PM
-- Server version: 5.7.36
-- PHP Version: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `outbook`
--

-- --------------------------------------------------------

--
-- Table structure for table `checklists`
--

DROP TABLE IF EXISTS `checklists`;
CREATE TABLE IF NOT EXISTS `checklists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `is_all_customer` longtext,
  `service_id` int(11) NOT NULL,
  `job_type_id` int(11) NOT NULL,
  `client_type_id` varchar(10) NOT NULL,
  `check_list_name` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `service_id` (`service_id`),
  KEY `job_type_id` (`job_type_id`),
  KEY `client_type_id` (`client_type_id`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `checklists`
--

INSERT INTO `checklists` (`id`, `customer_id`, `is_all_customer`, `service_id`, `job_type_id`, `client_type_id`, `check_list_name`, `status`, `created_at`, `updated_at`) VALUES
(2, 16, NULL, 1, 3, '1,2,3,4', 'cust_c2', '1', '2024-10-15 08:31:39', '2024-10-15 08:31:39'),
(3, 16, NULL, 1, 3, '1', 'Checklist (5)', '1', '2024-10-15 08:35:25', '2024-10-15 08:35:25'),
(18, 52, NULL, 2, 2, '1', 'Checklist (9) (1)', '1', '2024-12-11 08:30:56', '2024-12-11 08:30:56'),
(11, 30, NULL, 3, 1, '1,2,3,4', 'SC', '1', '2024-11-25 12:46:01', '2024-11-25 12:46:01'),
(12, 0, '[30, 22, 31, 34, 35, 36, 37, 38, 41, 53, 54, 57, 58, 72]', 3, 1, '1,2,3,4', 'DDD', '1', '2024-11-25 12:46:46', '2025-01-11 07:24:47'),
(14, 0, '[53, 54, 57, 58, 72]', 3, 5, '1,2,3,4', 'GG', '1', '2024-12-11 06:42:02', '2025-01-11 07:24:47'),
(17, 51, NULL, 5, 9, '2', 'Checklist (9) (1)', '1', '2024-12-11 08:29:11', '2024-12-11 08:29:11'),
(13, 0, '[30, 22, 31, 34, 35, 36, 37, 38, 41, 53, 54, 57, 58, 72]', 3, 5, '1,2,3,4', 'SSSSS', '1', '2024-11-28 12:10:59', '2025-01-11 07:24:47');

-- --------------------------------------------------------

--
-- Table structure for table `checklist_tasks`
--

DROP TABLE IF EXISTS `checklist_tasks`;
CREATE TABLE IF NOT EXISTS `checklist_tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `checklist_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `task_name` varchar(100) NOT NULL,
  `budgeted_hour` varchar(100) DEFAULT NULL COMMENT 'Budgeted hours for the task',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `checklist_id` (`checklist_id`,`task_id`),
  KEY `task_id` (`task_id`)
) ENGINE=MyISAM AUTO_INCREMENT=43 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `checklist_tasks`
--

INSERT INTO `checklist_tasks` (`id`, `checklist_id`, `task_id`, `task_name`, `budgeted_hour`, `created_at`, `updated_at`) VALUES
(42, 18, 25, 'TSK3', '22:22', '2024-12-11 08:30:56', '2024-12-11 08:30:56'),
(41, 18, 24, 'TSK2', '22:22', '2024-12-11 08:30:56', '2024-12-11 08:30:56'),
(3, 2, 3, 'A', '45:59:00', '2024-10-15 08:31:39', '2024-10-15 08:31:39'),
(4, 2, 4, 'B', '52:59:00', '2024-10-15 08:31:39', '2024-10-15 08:31:39'),
(5, 3, 5, 'ABC', '11:22:00', '2024-10-15 08:35:25', '2024-10-15 08:35:25'),
(39, 17, 22, 'TSK3', '22:22', '2024-12-11 08:29:11', '2024-12-11 08:29:11'),
(40, 18, 23, 'TSK1', '22:22', '2024-12-11 08:30:56', '2024-12-11 08:30:56'),
(38, 17, 21, 'TSK2', '22:22', '2024-12-11 08:29:11', '2024-12-11 08:29:11'),
(37, 17, 20, 'TSK1', '22:22', '2024-12-11 08:29:11', '2024-12-11 08:29:11'),
(34, 14, 16, 'ss', '12:12', '2024-12-11 06:42:02', '2024-12-11 06:42:02'),
(27, 11, 2, 'B', '22:02', '2024-11-25 12:46:01', '2024-11-25 12:46:01'),
(28, 11, 1, 'A', '22:02', '2024-11-25 12:46:01', '2024-11-25 12:46:01'),
(29, 12, 2, 'B', '22:22', '2024-11-25 12:46:46', '2024-11-25 12:46:46'),
(30, 12, 1, 'A', '22:22', '2024-11-25 12:46:46', '2024-11-25 12:46:46'),
(31, 13, 16, 'ss', '22:22', '2024-11-28 12:10:59', '2024-11-28 12:10:59'),
(32, 13, 17, 'DD', '22:22', '2024-11-28 12:10:59', '2024-11-28 12:10:59'),
(33, 14, 17, 'DD', '12:12', '2024-12-11 06:42:02', '2024-12-11 06:42:02');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
CREATE TABLE IF NOT EXISTS `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_type` enum('1','2','3','4','5','6','7') NOT NULL DEFAULT '1' COMMENT '1: SoleTrader, 2: Company , 3:Partnership , 4 : Individual , 5 = Charity Incorporated Organisation , 6 = Unincorporated Association,\r\n7 = Trust',
  `customer_id` int(11) NOT NULL,
  `staff_created_id` int(11) NOT NULL,
  `client_industry_id` int(11) DEFAULT '0',
  `trading_name` varchar(255) NOT NULL,
  `client_code` varchar(100) NOT NULL,
  `trading_address` longtext,
  `service_address` longtext,
  `vat_registered` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: No, 1: Yes',
  `vat_number` varchar(20) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `notes` longtext,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trading_name` (`trading_name`),
  UNIQUE KEY `client_code` (`client_code`),
  KEY `customer_id` (`customer_id`),
  KEY `client_industry_id` (`client_industry_id`)
) ENGINE=MyISAM AUTO_INCREMENT=86 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `client_type`, `customer_id`, `staff_created_id`, `client_industry_id`, `trading_name`, `client_code`, `trading_address`, `service_address`, `vat_registered`, `vat_number`, `website`, `notes`, `status`, `created_at`, `updated_at`) VALUES
(1, '1', 1, 2, 0, 'SFF', '00001', 'gdgfdefdf', NULL, '0', '', '', NULL, '1', '2024-09-24 11:09:40', '2024-11-23 09:40:26'),
(2, '4', 1, 2, 0, 'adad2222', '00002', NULL, NULL, '1', NULL, NULL, NULL, '1', '2024-09-24 11:15:06', '2024-11-23 09:40:26'),
(3, '1', 1, 2, 0, 'FGKG', '00003', 'fdebvd', NULL, '0', '', '', NULL, '1', '2024-09-25 13:20:32', '2024-11-23 09:40:26'),
(6, '2', 1, 2, 0, 'ASDGFdf', '00006', '129 Passeig De Gràcia, Barcelona, Barcelona, Spain, 08008', NULL, '0', '', '', NULL, '1', '2024-10-01 10:37:01', '2024-11-23 09:40:26'),
(7, '3', 1, 2, 0, 'SADA', '00007', 'ADACAC', NULL, '0', '', '', NULL, '1', '2024-10-01 10:51:49', '2024-11-23 09:40:26'),
(5, '2', 1, 2, 0, 'ASDGF', '00005', '129 Passeig De Gràcia, Barcelona, Barcelona, Spain, 08008', NULL, '0', '', '', NULL, '1', '2024-10-01 10:33:24', '2024-11-23 09:40:26'),
(8, '1', 2, 2, 0, 'DDD', '00008', 'ddd', NULL, '0', '', '', NULL, '1', '2024-10-09 10:23:18', '2024-11-23 09:40:26'),
(9, '1', 13, 2, 3, 'ADXadcasf', '00009', 'dsfvsfv', NULL, '0', '', '', NULL, '1', '2024-10-11 09:40:04', '2024-11-23 09:40:26'),
(10, '1', 13, 2, 3, 'DDDDDDD', '000010', 'fsfsfa', NULL, '0', '', '', NULL, '1', '2024-10-11 09:40:26', '2024-11-23 09:40:26'),
(11, '1', 2, 2, 0, 'RFGGGG', '000011', 'DFsf', NULL, '0', '', '', NULL, '1', '2024-10-11 10:34:35', '2024-11-23 09:40:26'),
(12, '1', 16, 2, 0, 'dddd', '000012', 'dd', NULL, '0', '', '', NULL, '1', '2024-10-14 15:32:28', '2024-11-23 09:40:26'),
(13, '1', 5, 2, 0, 'ER', '000013', 'e', NULL, '0', '', '', NULL, '1', '2024-10-15 05:49:26', '2024-11-23 09:40:26'),
(14, '1', 18, 2, 0, 'SSSSS', '000014', 'ss', NULL, '0', '', '', NULL, '1', '2024-10-22 10:38:19', '2024-11-23 09:40:26'),
(15, '1', 21, 2, 0, 'EEEEE', '000015', 'dd', NULL, '0', '', '', NULL, '1', '2024-10-24 06:47:19', '2024-11-23 09:40:26'),
(16, '1', 17, 2, 0, 'rrrrrr', '000016', 'rrrr', NULL, '0', '', '', NULL, '1', '2024-10-24 06:51:05', '2024-11-23 09:40:26'),
(17, '1', 22, 2, 0, 'QQQ', '000017', 'ss', NULL, '0', '', '', NULL, '1', '2024-10-24 07:29:49', '2024-11-23 09:40:26'),
(18, '3', 23, 2, 3, 'BBBB', '000018', 'dddd', NULL, '0', '', '', NULL, '1', '2024-11-18 12:25:50', '2024-11-23 09:40:26'),
(19, '1', 1, 12, 1, 'SHKAHAHAAHAH', '000019', 'ss', NULL, '0', '', '', NULL, '1', '2024-11-23 09:27:21', '2024-11-23 09:40:35'),
(20, '1', 1, 12, 0, 'DDDDD', '000020', 'ddd', NULL, '0', '', '', NULL, '1', '2024-11-23 09:49:43', '2024-11-23 09:49:43'),
(21, '1', 23, 2, 0, 'sadcss', '000021', 'sfcsfscfs', NULL, '0', '', '', NULL, '1', '2024-11-23 09:50:10', '2024-11-23 09:50:10'),
(22, '1', 2, 11, 0, 'S11', '000022', 'ddd', NULL, '0', '', '', NULL, '1', '2024-11-23 10:18:04', '2024-11-23 10:18:04'),
(23, '1', 2, 11, 0, 'sss22', '000023', 'ss', NULL, '0', '', '', NULL, '1', '2024-11-23 10:27:37', '2024-11-23 10:27:37'),
(24, '1', 28, 2, 0, 'SSSS', '000024', 's', NULL, '0', '', '', NULL, '1', '2024-11-23 10:33:29', '2024-11-23 10:33:29'),
(25, '4', 28, 2, 0, 'DSA', '000025', NULL, NULL, '1', NULL, NULL, NULL, '1', '2024-11-23 10:35:42', '2024-11-23 10:35:42'),
(26, '1', 28, 2, 0, 'ERE', '000026', '4255d', NULL, '0', '', '', NULL, '1', '2024-11-23 10:57:55', '2024-11-23 10:57:55'),
(27, '1', 29, 2, 0, 'ttt', '000027', 't', NULL, '0', '', '', NULL, '1', '2024-11-23 11:16:10', '2024-11-23 11:16:10'),
(28, '1', 1, 12, 0, 'ssssss', '000028', 'sss', NULL, '0', '', '', NULL, '1', '2024-11-23 11:51:03', '2024-11-23 11:51:03'),
(29, '1', 30, 11, 0, 'RRR', '000029', 'dd', NULL, '0', '', '', NULL, '1', '2024-11-23 12:11:01', '2024-11-23 12:11:01'),
(30, '1', 30, 2, 0, 'RRRSSS', '000030', 'ss', NULL, '0', '', '', NULL, '1', '2024-11-23 12:22:35', '2024-11-23 12:22:35'),
(31, '3', 30, 2, 0, 'ssssssssssssss', '000031', 'ss', NULL, '0', '', '', NULL, '1', '2024-11-23 13:04:17', '2024-11-23 13:04:17'),
(32, '4', 30, 2, 0, 'GGGGGGGGGG', '000032', NULL, NULL, '1', NULL, NULL, NULL, '1', '2024-11-23 13:04:53', '2024-11-23 13:04:53'),
(33, '1', 30, 10, 0, 'ERT', '000033', 'dddd', NULL, '0', '', '', NULL, '1', '2024-11-26 05:21:45', '2024-11-26 05:21:45'),
(34, '1', 31, 2, 0, 'testtt1', '000034', 'ss', NULL, '0', '', '', NULL, '1', '2024-11-26 05:46:10', '2024-11-26 05:46:10'),
(35, '1', 31, 10, 0, 'testt2', '000035', 'dd', NULL, '0', '', '', NULL, '1', '2024-11-26 05:46:36', '2024-11-26 05:46:36'),
(36, '1', 32, 2, 0, 'ABC1', '000036', 'sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss', NULL, '0', '', '', NULL, '1', '2024-11-26 07:03:50', '2024-11-26 07:03:50'),
(37, '1', 32, 5, 0, 'ABC2', '000037', 'ss', NULL, '0', '', '', NULL, '1', '2024-11-26 07:04:58', '2024-11-26 07:04:58'),
(38, '1', 33, 10, 0, 'MANGAE_CLIENT_1', '000038', 'sadasd', NULL, '0', '', '', NULL, '1', '2024-11-26 07:19:54', '2024-11-26 07:19:54'),
(39, '2', 33, 10, 0, 'A & I INC', '000039', 'Vistra Corporate Services Centre, Wickhams Cay Ii, Road Town, Tortola, Virgin Islands, British, VG1110', NULL, '0', '', '', NULL, '1', '2024-11-26 07:21:33', '2024-11-26 07:21:33'),
(40, '1', 34, 13, 0, 'CLIE5', '000040', 'ssss', NULL, '0', '', '', NULL, '1', '2024-11-27 05:42:38', '2024-11-27 05:42:38'),
(41, '1', 34, 13, 0, 'CLIE2', '000041', 'sss', NULL, '0', '', 'ff', NULL, '1', '2024-11-27 09:02:22', '2024-11-27 09:02:22'),
(42, '1', 35, 13, 0, 'CLI6', '000042', '4255', NULL, '0', '', '', NULL, '1', '2024-11-27 09:05:34', '2024-11-27 09:05:34'),
(43, '1', 32, 13, 0, 'WWW22', '000043', '4255', NULL, '0', '', '', NULL, '1', '2024-11-27 09:06:04', '2024-11-27 09:06:04'),
(44, '1', 35, 13, 0, 'CLI7', '000044', '4255', NULL, '0', '', '', NULL, '1', '2024-11-27 09:30:45', '2024-11-27 09:30:45'),
(45, '1', 32, 6, 0, 'CLIE99', '000045', 'SSSSSSSSSSSSSSSSSSSSS', NULL, '0', '', '', NULL, '1', '2024-11-27 09:54:03', '2024-11-27 09:54:03'),
(46, '1', 35, 6, 0, 'CLI25', '000046', 's', NULL, '0', '', '', NULL, '1', '2024-11-27 09:54:56', '2024-11-27 09:54:56'),
(47, '1', 35, 10, 0, 'CLIE-11', '000047', 'ss', NULL, '0', '', '', NULL, '1', '2024-11-28 06:16:37', '2024-11-28 06:16:37'),
(48, '1', 35, 5, 0, 'CLIE-22', '000048', 'dd', NULL, '0', '', '', NULL, '1', '2024-11-28 06:19:02', '2024-11-28 06:19:02'),
(49, '1', 36, 5, 0, 'CLIE-1251', '000049', 's', NULL, '0', '', '', NULL, '1', '2024-11-28 06:22:44', '2024-11-28 06:22:44'),
(50, '1', 36, 6, 0, 'CLIE-1262', '000050', 'aa', NULL, '0', '', '', NULL, '1', '2024-11-28 06:32:57', '2024-11-28 06:32:57'),
(51, '1', 37, 2, 0, 'CLIE-SSS', '000051', 'ss', NULL, '0', '', '', NULL, '1', '2024-11-28 10:23:42', '2024-11-28 10:23:42'),
(52, '1', 38, 2, 0, 'CLIE-9', '000052', 'u', NULL, '0', '', '', NULL, '1', '2024-11-28 12:01:14', '2024-11-28 12:01:14'),
(53, '1', 33, 19, 0, 'HHHH', '000053', 'ss', NULL, '0', '', '', NULL, '1', '2024-12-05 10:19:37', '2024-12-05 10:19:37'),
(54, '1', 33, 19, 0, 'RRRRRRR', '000054', 'dd', NULL, '0', '', '', NULL, '1', '2024-12-05 10:22:25', '2024-12-05 10:22:25'),
(55, '1', 41, 19, 0, 'ZZZZZZ', '000055', 's', NULL, '0', '', '', NULL, '1', '2024-12-05 10:22:48', '2024-12-05 10:22:48'),
(56, '2', 49, 2, 0, 'A  +  A LTD', '000056', '46 Brookbank Close, Cheltenham, England, GL50 3NB', NULL, '0', '', '', NULL, '1', '2024-12-10 12:57:35', '2024-12-10 12:57:35'),
(57, '2', 49, 2, 0, 'A  +  A LTD1', '000057', '46 Brookbank Close, Cheltenham, England, GL50 3NB', NULL, '0', '', '', NULL, '1', '2024-12-10 13:10:17', '2024-12-10 13:10:17'),
(58, '2', 50, 2, 0, 'E LIMITED', '000058', '30 St George\'s Road, Harrogate, North Yorkshire, HG2 9BS', NULL, '0', '', '', NULL, '1', '2024-12-10 13:16:00', '2024-12-10 13:16:00'),
(59, '2', 50, 2, 0, 'F LIMITED', '000059', '1  The Crescent, King Street, Leicester, United Kingdom, LE1 6RX', NULL, '0', '', '', NULL, '1', '2024-12-10 13:24:25', '2024-12-10 13:24:25'),
(60, '3', 52, 2, 0, 'SS555', '000060', 'ss55', NULL, '0', '', '', NULL, '1', '2024-12-11 08:32:49', '2024-12-11 08:32:49'),
(61, '1', 52, 2, 0, 'SS99', '000061', 's', NULL, '0', '', '', NULL, '1', '2024-12-11 08:33:27', '2024-12-11 08:33:27'),
(62, '1', 53, 22, 0, 'CC', '000062', 'ss', NULL, '0', '', '', NULL, '1', '2024-12-12 05:45:06', '2024-12-12 05:45:06'),
(63, '1', 55, 10, 0, 'GFGF', '000063', 's', NULL, '0', '', '', NULL, '1', '2024-12-17 05:42:08', '2024-12-17 05:42:08'),
(64, '1', 56, 5, 0, 'HHHHH', '000064', 'd', NULL, '0', '', '', NULL, '1', '2024-12-17 05:47:23', '2024-12-17 05:47:23'),
(65, '1', 57, 10, 0, 'JJJ-CLIENT', '000065', 'f', NULL, '0', '', '', NULL, '1', '2024-12-17 05:57:49', '2024-12-17 05:57:49'),
(66, '1', 58, 10, 0, 'R1-CLIENT', '000066', 'f', NULL, '0', '', '', NULL, '1', '2024-12-18 05:20:49', '2024-12-18 05:20:49'),
(67, '1', 51, 2, 0, 'H-LIMMMMMM', '000067', 'd', NULL, '0', '', '', NULL, '1', '2024-12-24 10:42:29', '2024-12-24 10:42:29'),
(68, '1', 57, 9, 0, 'JJJ-CLIENTS', '000068', 'd', NULL, '0', '', '', NULL, '1', '2024-12-24 11:19:42', '2024-12-24 11:19:42'),
(69, '2', 62, 2, 0, 'H LIMITED', '000069', '25 Flitwick Road, Ampthill, Bedford, England, MK45 2NS', NULL, '0', '', '', NULL, '1', '2024-12-26 06:35:11', '2024-12-26 06:35:11'),
(70, '2', 62, 2, 0, 'H LIMITED_000070', '000070', '25 Flitwick Road, Ampthill, Bedford, England, MK45 2NS', NULL, '0', '', '', NULL, '1', '2024-12-26 06:41:21', '2024-12-26 06:41:21'),
(71, '2', 62, 2, 0, 'H LIMITED_000071', '000071', '25 Flitwick Road, Ampthill, Bedford, England, MK45 2NS', NULL, '0', '', '', NULL, '1', '2024-12-26 06:41:50', '2024-12-26 06:41:50'),
(72, '1', 62, 2, 0, 'hh', '000072', 'h', NULL, '0', '', '', NULL, '1', '2024-12-26 06:42:01', '2024-12-26 06:42:01'),
(73, '2', 67, 2, 0, 'D LIMITED_000073', '000073', 'VISIT HTTP://WWW.BUY-THIS-COMPANY-NAME.CO.UK, 25 South Road, Saffron Walden, Essex, CB11 3DG', NULL, '0', '', '', ' work is aimed at describing the key features of HRM as a separate activity in the framework of the modern business environment. The goals are to determine the importance of this practice in relation to today’s organizations, describe the merits of this activity for enterprises and employees themselves, as well as classify the key issues that HRM specialists face in their everyday work. As sources for substantiating specific theories and assumptions, rele', '1', '2024-12-26 10:36:24', '2024-12-26 10:36:24'),
(74, '3', 67, 2, 0, 'dgdgdffgb', '000074', 'dfgd', NULL, '0', '', '', 'yyyyyyyyyyyyyyyyyyyyyyyyyyy123', '1', '2024-12-26 11:08:13', '2024-12-26 11:10:44'),
(75, '1', 67, 2, 0, 'fffffff', '000075', 'ffffff', NULL, '0', '', '', '', '1', '2024-12-26 11:15:27', '2024-12-26 11:15:27'),
(76, '1', 68, 23, 0, 'GGG', '000076', 'f', NULL, '0', '', '', '', '1', '2024-12-26 12:28:56', '2024-12-26 12:28:56'),
(77, '1', 71, 2, 0, 'TTCLIENT', '000077', 's', NULL, '0', '', '', '', '1', '2025-01-03 09:24:40', '2025-01-03 09:24:40'),
(78, '2', 71, 2, 0, 'F LIMITED_000078', '000078', '1  The Crescent, King Street, Leicester, United Kingdom, LE1 6RX', NULL, '0', '', '', '', '1', '2025-01-08 12:37:07', '2025-01-08 12:37:07'),
(79, '1', 72, 2, 3, 'fffff', '000079', 'fff', NULL, '0', '', '', '', '1', '2025-01-11 07:27:54', '2025-01-11 07:27:54'),
(80, '2', 72, 2, 0, 'F LIMITED_000080', '000080', '1  The Crescent, King Street, Leicester, United Kingdom, LE1 6RX', NULL, '0', '', '', '', '1', '2025-01-11 09:33:09', '2025-01-11 09:33:09'),
(81, '2', 72, 2, 0, 'E LIMITED_000081', '000081', '30 St George\'s Road, Harrogate, North Yorkshire, HG2 9BS', NULL, '0', '', '', '', '1', '2025-01-11 09:50:31', '2025-01-11 09:50:31'),
(82, '2', 72, 2, 0, 'G LIMITED_000082', '000082', 'Carradine House, 237 Regents Park Road, London, N3 3LF', NULL, '0', '', '', '', '1', '2025-01-11 09:52:33', '2025-01-11 09:52:33'),
(83, '5', 73, 2, 0, 'Charity', '000083', 'ss', '', '0', '', '', '', '1', '2025-01-27 09:06:20', '2025-01-27 09:06:20'),
(84, '6', 73, 2, 0, 'Accosian 1 ', '000084', 'assss', NULL, '0', '', '', '', '1', '2025-01-27 09:33:50', '2025-01-27 09:33:50'),
(85, '7', 73, 2, 0, 'TRUS 1', '000085', 'ff', NULL, '0', '', '', 'jjjjjjjjjjjjjjjjjjjjj', '1', '2025-01-27 09:55:26', '2025-01-27 09:55:26');

-- --------------------------------------------------------

--
-- Table structure for table `client_company_information`
--

DROP TABLE IF EXISTS `client_company_information`;
CREATE TABLE IF NOT EXISTS `client_company_information` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `company_name` varchar(100) NOT NULL,
  `entity_type` varchar(255) NOT NULL,
  `company_status` varchar(100) NOT NULL COMMENT '0: deactive, 1: active',
  `company_number` varchar(50) DEFAULT NULL,
  `registered_office_address` longtext NOT NULL,
  `incorporation_date` date NOT NULL,
  `incorporation_in` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `client_company_information`
--

INSERT INTO `client_company_information` (`id`, `client_id`, `company_name`, `entity_type`, `company_status`, `company_number`, `registered_office_address`, `incorporation_date`, `incorporation_in`, `created_at`, `updated_at`) VALUES
(1, 5, 'AGÈNCIA PER A LA COMPETITIVITAT DE L\'EMPRESA ACCIÓ', 'registered-overseas-entity', 'registered', 'OE03065', '129 Passeig De Gràcia, Barcelona, Barcelona, Spain, 08008', '2023-08-01', '1', '2024-10-01 10:33:24', '2025-01-11 09:47:48'),
(2, 6, 'AGÈNCIA PER A LA COMPETITIVITAT DE L\'EMPRESA ACCIÓ', 'registered-overseas-entity', 'registered', 'OE03065955', '129 Passeig De Gràcia, Barcelona, Barcelona, Spain, 08008', '2023-07-31', '1', '2024-10-01 10:37:01', '2025-01-11 09:47:48'),
(3, 39, 'A & I INC', 'registered-overseas-entity', 'registered', 'OE008143', 'Vistra Corporate Services Centre, Wickhams Cay Ii, Road Town, Tortola, Virgin Islands, British, VG1110', '2022-12-15', '1', '2024-11-26 07:21:33', '2025-01-11 09:47:48'),
(4, 56, 'A  +  A LTD', 'ltd', 'active', '12756497', '46 Brookbank Close, Cheltenham, England, GL50 3NB', '2020-07-20', '1', '2024-12-10 12:57:35', '2025-01-11 09:47:48'),
(5, 57, 'A  +  A LTD', 'ltd', 'active', '12756497', '46 Brookbank Close, Cheltenham, England, GL50 3NB', '2020-07-20', '1', '2024-12-10 13:10:17', '2025-01-11 09:47:48'),
(6, 58, 'E LIMITED', 'ltd', 'active', '03506237', '30 St George\'s Road, Harrogate, North Yorkshire, HG2 9BS', '1998-02-05', '1', '2024-12-10 13:16:00', '2025-01-11 09:47:48'),
(7, 59, 'F LIMITED', 'ltd', 'dissolved', '06016470', '1  The Crescent, King Street, Leicester, United Kingdom, LE1 6RX', '2006-11-30', '1', '2024-12-10 13:24:25', '2025-01-11 09:47:48'),
(8, 69, 'H LIMITED', 'ltd', 'active', '02277126', '25 Flitwick Road, Ampthill, Bedford, England, MK45 2NS', '1988-07-14', '1', '2024-12-26 06:35:11', '2025-01-11 09:47:48'),
(9, 70, 'H LIMITED', 'ltd', 'active', '02277126', '25 Flitwick Road, Ampthill, Bedford, England, MK45 2NS', '1988-07-14', '1', '2024-12-26 06:41:21', '2025-01-11 09:47:48'),
(10, 71, 'H LIMITED', 'ltd', 'active', '02277126', '25 Flitwick Road, Ampthill, Bedford, England, MK45 2NS', '1988-07-14', '1', '2024-12-26 06:41:50', '2025-01-11 09:47:48'),
(11, 73, 'D LIMITED', 'ltd', 'active', '05202396', 'VISIT HTTP://WWW.BUY-THIS-COMPANY-NAME.CO.UK, 25 South Road, Saffron Walden, Essex, CB11 3DG', '2004-08-10', '1', '2024-12-26 10:36:24', '2025-01-11 09:47:48'),
(12, 78, 'F LIMITED', 'ltd', 'dissolved', '06016470', '1  The Crescent, King Street, Leicester, United Kingdom, LE1 6RX', '2006-12-01', '1', '2025-01-08 12:37:07', '2025-01-11 09:47:48'),
(13, 80, 'F LIMITED', 'ltd', 'dissolved', '06016470', '1  The Crescent, King Street, Leicester, United Kingdom, LE1 6RX', '2006-11-30', '1', '2025-01-11 09:33:09', '2025-01-11 09:44:31'),
(14, 81, 'E LIMITED', 'ltd', 'active', '03506237', '30 St George\'s Road, Harrogate, North Yorkshire, HG2 9BS', '1998-02-04', '1', '2025-01-11 09:50:31', '2025-01-11 09:57:16'),
(15, 82, 'G LIMITED', 'ltd', 'active', '03700068', 'Carradine House, 237 Regents Park Road, London, N3 3LF', '1999-01-15', '4', '2025-01-11 09:52:33', '2025-01-11 09:56:32');

-- --------------------------------------------------------

--
-- Table structure for table `client_contact_details`
--

DROP TABLE IF EXISTS `client_contact_details`;
CREATE TABLE IF NOT EXISTS `client_contact_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `role` int(11) NOT NULL DEFAULT '0',
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `alternate_email` varchar(100) DEFAULT NULL,
  `phone_code` varchar(6) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `alternate_phone_code` varchar(6) DEFAULT NULL,
  `alternate_phone` varchar(20) DEFAULT NULL,
  `residential_address` text,
  `authorised_signatory_status` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: off, 1: on',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  KEY `role` (`role`)
) ENGINE=MyISAM AUTO_INCREMENT=96 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `client_contact_details`
--

INSERT INTO `client_contact_details` (`id`, `client_id`, `role`, `first_name`, `last_name`, `email`, `alternate_email`, `phone_code`, `phone`, `alternate_phone_code`, `alternate_phone`, `residential_address`, `authorised_signatory_status`, `created_at`, `updated_at`) VALUES
(1, 1, 0, 'dg', 'gdgdg', 's@gmail.com', NULL, '+44', '2777777777', NULL, NULL, '', '1', '2024-09-24 11:09:40', '2024-10-01 10:30:01'),
(2, 2, 0, 'adad', 'adad', 's@gmail.com', NULL, '+44', '2777777777', NULL, NULL, '', '1', '2024-09-24 11:15:06', '2024-09-24 11:15:23'),
(3, 3, 0, 'gerg', 'geg', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'dvdv', '1', '2024-09-25 13:20:32', '2024-09-25 13:20:32'),
(4, 5, 0, 'Atyhr', 'ADADAD', '', NULL, '+44', '', NULL, NULL, NULL, '1', '2024-10-01 10:33:24', '2024-10-01 10:48:34'),
(5, 6, 0, 'ADadadggg55', 'asdagg', '', NULL, '+44', '', NULL, NULL, NULL, '1', '2024-10-01 10:37:01', '2024-10-01 10:46:47'),
(6, 6, 0, 'tyjykyk', 'ykyky', '', NULL, '', '+44', NULL, NULL, NULL, '1', '2024-10-01 10:47:48', '2024-10-01 10:47:48'),
(7, 5, 0, 'hh', 'gjfgn', '', NULL, '', '+44', NULL, NULL, NULL, '1', '2024-10-01 10:48:34', '2024-10-01 10:48:34'),
(8, 7, 0, 'DFSGmm', 'vdvdvd', '', '', '+44', '', '+44', '', NULL, '0', '2024-10-01 10:51:49', '2024-10-01 11:30:52'),
(9, 7, 0, 'dvdbmm', 'dbdb', '', '', '+44', '', '+44', '', NULL, '0', '2024-10-01 10:51:49', '2024-10-01 11:30:52'),
(11, 7, 0, 'CPPhm', 'BPP', '', '', '+44', '', '+44', '', NULL, '1', '2024-10-01 11:00:59', '2024-10-01 11:30:52'),
(12, 8, 0, 'ddddd', 'ddd', 's@gmail.com', NULL, '+44', '', NULL, NULL, '', '0', '2024-10-09 10:23:18', '2024-10-09 10:23:18'),
(13, 9, 0, 'sdafvsfv', 'sdfvsdfv', 's@gmail.com', NULL, '+44', '', NULL, NULL, '', '0', '2024-10-11 09:40:04', '2024-10-11 09:40:04'),
(14, 10, 0, 'asfasfasf', 'sfasfcascf', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'sfcsfc', '0', '2024-10-11 09:40:26', '2024-10-11 09:40:26'),
(15, 11, 0, 'adass', 'ssfcsf', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'sfsfv', '0', '2024-10-11 10:34:35', '2024-10-11 10:34:35'),
(16, 12, 0, 'ddd', 'ddd', '', NULL, '+44', '', NULL, NULL, '', '0', '2024-10-14 15:32:28', '2024-10-14 15:32:28'),
(17, 13, 0, 'ee', 'ee', '', NULL, '+44', '', NULL, NULL, '', '0', '2024-10-15 05:49:26', '2024-10-15 05:49:26'),
(18, 14, 0, 'sss', 'ss', '', NULL, '+44', '', NULL, NULL, '', '0', '2024-10-22 10:38:19', '2024-10-22 10:38:19'),
(19, 15, 0, 'dd', 'dd', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'dd', '0', '2024-10-24 06:47:19', '2024-10-24 06:47:19'),
(20, 16, 0, 'rrr', 'rr', '', NULL, '+44', '', NULL, NULL, '', '0', '2024-10-24 06:51:05', '2024-10-24 06:51:05'),
(21, 17, 0, 'ss', 'ss', '', NULL, '+44', '', NULL, NULL, '', '0', '2024-10-24 07:29:49', '2024-10-24 07:29:49'),
(22, 18, 6, 'ddd', 'ddd', 's@gmail.com', '', '+44', '2777777777', '+44', '4555555555', NULL, '0', '2024-11-18 12:25:50', '2024-11-18 12:25:50'),
(23, 18, 6, 'ADDD', 'dd', 's@gmail.com', '', '+44', '2777777777', '+44', '222222222', NULL, '0', '2024-11-18 12:25:50', '2024-11-18 12:25:50'),
(24, 19, 0, 'ssss', 'sss', 's@gmail.com', NULL, '+44', '2777777777', NULL, NULL, 'sssss', '0', '2024-11-23 09:27:21', '2024-11-23 09:27:21'),
(25, 20, 0, 'dddd', 'ddd', '', NULL, '+44', '', NULL, NULL, '', '0', '2024-11-23 09:49:43', '2024-11-23 09:49:43'),
(26, 21, 0, 'scfss', 'css', '', NULL, '+44', '', NULL, NULL, '', '0', '2024-11-23 09:50:10', '2024-11-23 09:50:10'),
(27, 22, 0, 'dd', 'dd', '', NULL, '+44', '', NULL, NULL, '', '0', '2024-11-23 10:18:04', '2024-11-23 10:18:04'),
(28, 23, 0, 'sss', 'ss', '', NULL, '+44', '', NULL, NULL, '', '0', '2024-11-23 10:27:37', '2024-11-23 10:27:37'),
(29, 24, 0, 'ss', 'ss', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'rrr', '0', '2024-11-23 10:33:29', '2024-11-23 10:33:29'),
(30, 25, 0, 's', 's', 's@gmail.com', NULL, '+44', '2777777777', NULL, NULL, 'ss', '0', '2024-11-23 10:35:42', '2024-11-23 10:35:42'),
(31, 26, 0, 'd', 'd', 's@gmail.com', NULL, '+44', '2777777777', NULL, NULL, 'ss', '0', '2024-11-23 10:57:55', '2024-11-23 10:57:55'),
(32, 27, 0, 'tt', 'tt', 's@gmail.com', NULL, '+44', '2777777777', NULL, NULL, 't', '0', '2024-11-23 11:16:10', '2024-11-23 11:16:10'),
(33, 28, 0, 'ss', 'ss', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'ss', '0', '2024-11-23 11:51:03', '2024-11-23 11:51:03'),
(34, 29, 0, 'd', 'ddd', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'd', '0', '2024-11-23 12:11:01', '2024-11-23 12:11:01'),
(35, 30, 0, 's', 's', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'ss', '0', '2024-11-23 12:22:35', '2024-11-23 12:22:35'),
(36, 31, 0, 'sss', 'sss', '', 'sf@pnpuniverse.com', '+44', '', '+44', '', NULL, '0', '2024-11-23 13:04:17', '2024-11-23 13:04:17'),
(37, 31, 0, 'ss', 'ss', '', 'sf@pnpuniverse.com', '+44', '', '+44', '', NULL, '0', '2024-11-23 13:04:17', '2024-11-23 13:04:17'),
(38, 32, 0, 'gg', 'dd', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'gg', '0', '2024-11-23 13:04:53', '2024-11-23 13:04:53'),
(39, 33, 0, 'dd', 'dd', '', NULL, '+44', '', NULL, NULL, '', '0', '2024-11-26 05:21:45', '2024-11-26 05:21:45'),
(40, 34, 0, 'ss', 'ss', 'ss@gmail.com', NULL, '+44', '', NULL, NULL, 's', '0', '2024-11-26 05:46:10', '2024-11-26 05:46:10'),
(41, 35, 0, 'ddd', 'dd', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'dd', '0', '2024-11-26 05:46:36', '2024-11-26 05:46:36'),
(42, 36, 0, 'ss', 'ss', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'ss', '0', '2024-11-26 07:03:50', '2024-11-26 07:03:50'),
(43, 37, 0, 'ss', 'ss', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'sss', '0', '2024-11-26 07:04:58', '2024-11-26 07:04:58'),
(44, 38, 0, 'sfsf', 'sfs', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'sfs', '0', '2024-11-26 07:19:54', '2024-11-26 07:19:54'),
(45, 39, 0, 'aa', 'aa', 's@gmail.com', NULL, '+44', '', NULL, NULL, NULL, '0', '2024-11-26 07:21:33', '2024-11-26 07:21:33'),
(46, 40, 0, 'sss', 'ss', 's@gmail.com', NULL, '+44', '', NULL, NULL, 's', '0', '2024-11-27 05:42:38', '2024-11-27 05:42:38'),
(47, 41, 0, 'ff', 'ff', 'superadmin@gmail.com', NULL, '+44', '', NULL, NULL, 'ss', '0', '2024-11-27 09:02:22', '2024-11-27 09:02:22'),
(48, 42, 0, 'ss', 'dd', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'dd', '0', '2024-11-27 09:05:34', '2024-11-27 09:05:34'),
(49, 43, 0, 'ss', 'dd', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'dd', '0', '2024-11-27 09:06:04', '2024-11-27 09:06:04'),
(50, 44, 0, 'ss', 'dd', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'wsfvdv', '0', '2024-11-27 09:30:45', '2024-11-27 09:30:45'),
(51, 45, 0, 'ss', 'sss', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'ss', '0', '2024-11-27 09:54:03', '2024-11-27 09:54:03'),
(52, 46, 0, 'ss', 'sss', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'ss', '0', '2024-11-27 09:54:57', '2024-11-27 09:54:57'),
(53, 47, 0, 'ss', 'ss', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'ss', '0', '2024-11-28 06:16:37', '2024-11-28 06:16:37'),
(54, 48, 0, 'ddd', 'dd', 's@gmail.com', NULL, '+44', '', NULL, NULL, '', '0', '2024-11-28 06:19:02', '2024-11-28 06:19:02'),
(55, 49, 0, 's', 's', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'ss', '0', '2024-11-28 06:22:44', '2024-11-28 06:22:44'),
(56, 50, 0, 'a', 'a', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'a', '0', '2024-11-28 06:32:57', '2024-11-28 06:32:57'),
(57, 51, 0, 'ss', 's', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'ss', '0', '2024-11-28 10:23:42', '2024-11-28 10:23:42'),
(58, 52, 0, 'u', 'u', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'u', '0', '2024-11-28 12:01:14', '2024-11-28 12:01:14'),
(59, 53, 0, 's', 's', 's@gmail.com', NULL, '+44', '', NULL, NULL, 's', '0', '2024-12-05 10:19:37', '2024-12-05 10:19:37'),
(60, 54, 0, 'd', 'd', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'd', '0', '2024-12-05 10:22:25', '2024-12-05 10:22:25'),
(61, 55, 0, 's', 's', 's@gmail.com', NULL, '+44', '', NULL, NULL, 's', '0', '2024-12-05 10:22:48', '2024-12-05 10:22:48'),
(62, 56, 0, 'Alan Ho Yuen', 'LAI', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2024-12-10 12:57:35', '2024-12-10 12:57:35'),
(63, 57, 0, 'Alan Ho Yuen', 'LAI', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2024-12-10 13:10:17', '2024-12-10 13:10:17'),
(64, 58, 0, 'Amanda Jane', 'MALONE', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2024-12-10 13:16:00', '2024-12-10 13:16:00'),
(65, 59, 0, 'WILD ANGEL LIMITED', 'dd', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2024-12-10 13:24:25', '2024-12-10 13:24:25'),
(66, 60, 0, 'ss', 'ss', 's@gmail.com', '', '+44', '', '+44', '', NULL, '0', '2024-12-11 08:32:49', '2024-12-11 08:32:49'),
(67, 60, 0, 's', 's', 's@gmail.com', '', '+44', '', '+44', '', NULL, '0', '2024-12-11 08:32:49', '2024-12-11 08:32:49'),
(68, 61, 0, 's', 's', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'sss', '0', '2024-12-11 08:33:27', '2024-12-11 08:33:27'),
(69, 62, 0, 's', 's', '', NULL, '+44', '', NULL, NULL, '', '0', '2024-12-12 05:45:06', '2024-12-12 05:45:06'),
(70, 63, 0, 's', 's', 's@gmail.com', NULL, '+44', '', NULL, NULL, '', '0', '2024-12-17 05:42:08', '2024-12-17 05:42:08'),
(71, 64, 0, 'd', 'd', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'd', '0', '2024-12-17 05:47:23', '2024-12-17 05:47:23'),
(72, 65, 0, 'c', 'c', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'c', '0', '2024-12-17 05:57:49', '2024-12-17 05:57:49'),
(73, 66, 0, 'z', 'z', 's@gmail.com', NULL, '+44', '123456789', NULL, NULL, 'z', '0', '2024-12-18 05:20:49', '2024-12-18 05:23:52'),
(74, 67, 0, 'd', 'd', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'd', '0', '2024-12-24 10:42:29', '2024-12-24 10:42:29'),
(75, 68, 0, 'd', 'd', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'd', '0', '2024-12-24 11:19:42', '2024-12-24 11:19:42'),
(76, 69, 0, 'Adam Oliver', 'HARRISON', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2024-12-26 06:35:11', '2024-12-26 06:35:11'),
(77, 70, 0, 'Adam Oliver', 'HARRISON', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2024-12-26 06:41:21', '2024-12-26 06:41:21'),
(78, 71, 0, 'Adam Oliver', 'HARRISON', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2024-12-26 06:41:50', '2024-12-26 06:41:50'),
(79, 72, 0, 'h', 'h', '', NULL, '+44', '', NULL, NULL, '', '0', '2024-12-26 06:42:01', '2024-12-26 06:42:01'),
(80, 73, 0, 'Virginia Olive', 'CLARK', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2024-12-26 10:36:24', '2024-12-26 10:36:24'),
(81, 74, 0, 'g', 'g', 's@gmail.com', '', '+44', '', '+44', '', NULL, '0', '2024-12-26 11:08:13', '2024-12-26 11:08:13'),
(82, 74, 0, 'g', 'g', 's@gmail.com', '', '+44', '', '+44', '', NULL, '0', '2024-12-26 11:08:13', '2024-12-26 11:08:13'),
(83, 75, 0, 'fff', 'fffff', '', NULL, '+44', '', NULL, NULL, '', '0', '2024-12-26 11:15:27', '2024-12-26 11:15:27'),
(84, 76, 0, 'f', 'f', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'f', '0', '2024-12-26 12:28:56', '2024-12-26 12:28:56'),
(85, 77, 0, 's', 's', 's@gmail.com', NULL, '+44', '', NULL, NULL, 's', '0', '2025-01-03 09:24:40', '2025-01-03 09:24:40'),
(86, 78, 0, 'WILD ANGEL LIMITED', 'dd', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-01-08 12:37:07', '2025-01-08 12:37:07'),
(87, 79, 0, 'ff', 'ff', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'ff', '0', '2025-01-11 07:27:54', '2025-01-11 07:27:54'),
(88, 80, 0, 'WILD ANGEL LIMITED', 's', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-01-11 09:33:09', '2025-01-11 09:33:09'),
(89, 81, 0, 'Amanda Jane', 'MALONE', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-01-11 09:50:31', '2025-01-11 09:50:31'),
(90, 82, 0, 'Emma Rachel', 'MORGAN', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-01-11 09:52:33', '2025-01-11 09:52:33'),
(91, 83, 0, 'sssss', 'ssss', '', '', '+44', '', '+44', '', NULL, '0', '2025-01-27 09:06:20', '2025-01-27 09:06:20'),
(92, 84, 0, 'ggggg', 'gggggg', '', '', '+44', '', '+44', '', NULL, '0', '2025-01-27 09:33:50', '2025-01-27 09:33:50'),
(93, 84, 0, 'rrr', 'rrr', '', '', '+44', '', '+44', '', NULL, '0', '2025-01-27 09:33:50', '2025-01-27 09:33:50'),
(94, 85, 0, 'ffffffffffffffffffffghjgfjngfngfn', 'gfnfgnfgnfgn', '', '', '+44', '', '+44', '', NULL, '0', '2025-01-27 09:55:26', '2025-01-27 09:55:26'),
(95, 85, 0, 'fhbfbfdbfd', 'bnfdnfdnf', '', '', '+44', '', '+44', '', NULL, '0', '2025-01-27 09:55:26', '2025-01-27 09:55:26');

-- --------------------------------------------------------

--
-- Table structure for table `client_documents`
--

DROP TABLE IF EXISTS `client_documents`;
CREATE TABLE IF NOT EXISTS `client_documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_type` text NOT NULL,
  `file_size` int(11) NOT NULL,
  `web_url` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `client_documents`
--

INSERT INTO `client_documents` (`id`, `client_id`, `file_name`, `original_name`, `file_type`, `file_size`, `web_url`, `created_at`, `updated_at`) VALUES
(10, 77, '1721716908342-001.png', '001.png', 'image/png', 112121, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST71_CLIENT77/001.png', '2025-01-04 09:33:34', '2025-01-04 09:33:34'),
(11, 77, '1721719818558-002.png', '002.png', 'image/png', 436901, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST71_CLIENT77/002.png', '2025-01-04 09:33:55', '2025-01-04 09:33:55'),
(13, 77, '1729316168785-Activity.PNG', 'Activity.PNG', 'image/png', 54446, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST71_CLIENT77/Activity.PNG', '2025-01-07 09:21:22', '2025-01-07 09:21:22'),
(14, 77, '1736241401239-Checklist (9) (2).xlsx', 'Checklist (9) (2).xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 14585, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/_layouts/15/Doc.aspx?sourcedoc=%7BFCEB6435-8C4D-416D-858C-9F51A1D7D722%7D&file=Checklist%20(9)%20(2).xlsx&action=default&mobileredirect=true', '2025-01-07 09:23:21', '2025-01-07 09:23:21'),
(15, 77, '1734938615704-TimeSheetData.csv', 'TimeSheetData.csv', 'text/csv', 263, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/_layouts/15/Doc.aspx?sourcedoc=%7B34313502-AB39-4DF9-B018-90B795C4AF25%7D&file=TimeSheetData.csv&action=default&mobileredirect=true', '2025-01-07 10:12:49', '2025-01-07 10:12:49'),
(16, 77, '1736245496062-test_sample_message.eml', 'test_sample_message.eml', 'message/rfc822', 9051, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST71_CLIENT77/test_sample_message.eml', '2025-01-07 10:25:20', '2025-01-07 10:25:20');

-- --------------------------------------------------------

--
-- Table structure for table `client_industry_types`
--

DROP TABLE IF EXISTS `client_industry_types`;
CREATE TABLE IF NOT EXISTS `client_industry_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `business_type` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `business_type` (`business_type`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `client_industry_types`
--

INSERT INTO `client_industry_types` (`id`, `business_type`, `status`, `created_at`, `updated_at`) VALUES
(1, 'LTD', '1', '2024-06-28 13:22:23', '2024-07-26 10:54:08'),
(3, 'LTD 1', '1', '2024-08-05 07:24:55', '2024-09-25 10:24:24');

-- --------------------------------------------------------

--
-- Table structure for table `client_job_task`
--

DROP TABLE IF EXISTS `client_job_task`;
CREATE TABLE IF NOT EXISTS `client_job_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `task_status` int(11) DEFAULT NULL,
  `time` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `job_id` (`job_id`,`client_id`,`task_id`),
  KEY `client_id` (`client_id`),
  KEY `task_id` (`task_id`)
) ENGINE=MyISAM AUTO_INCREMENT=29 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `client_job_task`
--

INSERT INTO `client_job_task` (`id`, `job_id`, `client_id`, `task_id`, `task_status`, `time`, `created_at`, `updated_at`) VALUES
(1, 18, 12, 4, NULL, NULL, '2024-10-15 11:48:39', '2024-10-15 11:48:39'),
(2, 18, 12, 3, NULL, NULL, '2024-10-15 11:48:39', '2024-10-15 11:48:39'),
(3, 19, 12, 5, NULL, NULL, '2024-10-15 11:53:49', '2024-10-15 11:53:49'),
(4, 19, 12, 6, NULL, NULL, '2024-10-15 11:53:49', '2024-10-15 11:53:49'),
(5, 20, 12, 5, NULL, '11:22:00', '2024-10-15 11:04:57', '2024-10-15 11:04:57'),
(6, 20, 12, 3, NULL, '45:59:00', '2024-10-15 11:04:57', '2024-10-15 11:04:57'),
(7, 20, 12, 7, NULL, NULL, '2024-10-15 11:04:57', '2024-10-15 11:04:57'),
(8, 21, 12, 8, NULL, NULL, '2024-10-15 11:05:56', '2024-10-15 11:05:56'),
(9, 23, 12, 10, NULL, '55:55:00', '2024-10-15 11:09:19', '2024-10-15 11:09:19'),
(11, 23, 12, 5, NULL, '11:22:00', '2024-10-15 11:37:30', '2024-10-15 11:37:30'),
(12, 23, 12, 3, NULL, '45:59:00', '2024-10-15 11:37:30', '2024-10-15 11:37:30'),
(13, 22, 12, 4, NULL, '52:59:00', '2024-10-15 11:39:52', '2024-10-15 11:39:52'),
(14, 22, 12, 3, NULL, '45:59:00', '2024-10-15 11:39:52', '2024-10-15 11:39:52'),
(15, 21, 12, 3, NULL, '45:59:00', '2024-10-15 11:40:55', '2024-10-15 11:40:55'),
(16, 25, 15, 2, NULL, '25:23:00', '2024-10-24 07:19:17', '2024-10-24 07:19:17'),
(17, 25, 15, 1, NULL, '22:22:00', '2024-10-24 07:19:17', '2024-10-24 07:19:17'),
(18, 27, 17, 1, NULL, '22:22:00', '2024-11-15 05:43:54', '2024-11-15 05:43:54'),
(19, 27, 17, 2, NULL, '25:23:00', '2024-11-15 05:43:54', '2024-11-15 05:43:54'),
(20, 28, 10, 9, NULL, '55:55', '2024-11-19 12:13:23', '2024-11-19 12:13:23'),
(21, 35, 32, 1, NULL, '22:02', '2024-11-25 12:47:38', '2024-11-25 12:47:38'),
(22, 35, 32, 2, NULL, '22:02', '2024-11-25 12:47:38', '2024-11-25 12:47:38'),
(23, 66, 62, 17, NULL, '12:12', '2024-12-12 05:45:24', '2024-12-12 05:45:24'),
(24, 74, 66, 17, NULL, '12:12', '2024-12-18 05:21:45', '2024-12-18 05:21:45'),
(25, 74, 66, 16, NULL, '12:12', '2024-12-18 05:21:45', '2024-12-18 05:21:45'),
(26, 83, 76, 23, NULL, '22:22', '2024-12-26 12:29:11', '2024-12-26 12:29:11'),
(28, 85, 77, 5, NULL, '11:22:00', '2025-01-16 13:16:41', '2025-01-16 13:16:41');

-- --------------------------------------------------------

--
-- Table structure for table `client_trustee_contact_details`
--

DROP TABLE IF EXISTS `client_trustee_contact_details`;
CREATE TABLE IF NOT EXISTS `client_trustee_contact_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `role` int(11) NOT NULL DEFAULT '0',
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `alternate_email` varchar(100) DEFAULT NULL,
  `phone_code` varchar(6) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `alternate_phone_code` varchar(6) DEFAULT NULL,
  `alternate_phone` varchar(20) DEFAULT NULL,
  `residential_address` text,
  `authorised_signatory_status` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: off, 1: on',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  KEY `role` (`role`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `client_trustee_contact_details`
--

INSERT INTO `client_trustee_contact_details` (`id`, `client_id`, `role`, `first_name`, `last_name`, `email`, `alternate_email`, `phone_code`, `phone`, `alternate_phone_code`, `alternate_phone`, `residential_address`, `authorised_signatory_status`, `created_at`, `updated_at`) VALUES
(1, 83, 0, 'ss11', 'ss2', '', '', '+44', '', '+44', '', NULL, '0', '2025-01-27 09:06:20', '2025-01-27 09:06:20'),
(2, 83, 0, 'ss2', 'ss3', '', '', '+44', '', '+44', '', NULL, '0', '2025-01-27 09:06:20', '2025-01-27 09:06:20'),
(3, 85, 0, 'fhfdbnfdn', 'fndf', '', '', '+44', '', '+44', '', NULL, '0', '2025-01-27 09:55:26', '2025-01-27 09:55:26'),
(4, 85, 0, 'hfgnfdnfd', 'hnfdnfdnfdn', '', '', '+44', '', '+44', '', NULL, '0', '2025-01-27 09:55:26', '2025-01-27 09:55:26');

-- --------------------------------------------------------

--
-- Table structure for table `client_types`
--

DROP TABLE IF EXISTS `client_types`;
CREATE TABLE IF NOT EXISTS `client_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type` (`type`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `client_types`
--

INSERT INTO `client_types` (`id`, `type`, `status`, `created_at`, `updated_at`) VALUES
(1, 'SoleTrader', '1', '2024-06-27 10:48:40', '2024-06-27 10:48:40'),
(2, 'Company', '1', '2024-06-27 10:48:40', '2024-06-27 10:48:40'),
(3, 'Partnership', '1', '2024-06-27 10:48:40', '2024-06-27 10:48:40'),
(4, 'Individual', '1', '2024-06-27 10:48:40', '2024-06-27 10:48:40'),
(5, 'Charity Incorporated Organisation', '1', '2025-01-23 10:13:34', '2025-01-23 10:13:34'),
(6, 'Unincorporated Association', '1', '2025-01-23 10:13:34', '2025-01-23 10:13:34'),
(7, 'Trust', '1', '2025-01-23 10:13:34', '2025-01-23 10:13:34');

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

DROP TABLE IF EXISTS `countries`;
CREATE TABLE IF NOT EXISTS `countries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `code` varchar(10) NOT NULL,
  `currency` varchar(50) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `code` (`code`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `name`, `code`, `currency`, `status`, `created_at`, `updated_at`) VALUES
(1, 'United Kingdom', '+44', 'Dollar', '1', '2024-06-29 06:07:35', '2024-07-26 10:54:55'),
(3, 'India', '+91', 'Rupee', '1', '2024-07-26 10:55:34', '2024-07-26 10:55:34');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
CREATE TABLE IF NOT EXISTS `customers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_type` enum('1','2','3') NOT NULL DEFAULT '1' COMMENT '1: SoleTrader, 2: Company , 3:Partnership',
  `staff_id` int(11) NOT NULL,
  `account_manager_id` int(11) NOT NULL COMMENT 'Only staff members who are account managers',
  `trading_name` varchar(255) NOT NULL,
  `customer_code` varchar(100) NOT NULL,
  `trading_address` longtext,
  `vat_registered` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: yes',
  `vat_number` varchar(20) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `customerJoiningDate` date DEFAULT NULL,
  `customerSource` int(11) DEFAULT NULL,
  `customerSubSource` int(11) DEFAULT NULL,
  `form_process` enum('0','1','2','3','4') NOT NULL DEFAULT '0' COMMENT '0: Pending All, 1: Customer Information Complete ,2: Services Complete ,3:Engagement Model Complete ,4:Paper Work Complete',
  `notes` longtext,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trading_name` (`trading_name`),
  UNIQUE KEY `customer_code` (`customer_code`),
  KEY `staff_id` (`staff_id`),
  KEY `account_manager_id` (`account_manager_id`)
) ENGINE=MyISAM AUTO_INCREMENT=74 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `customer_type`, `staff_id`, `account_manager_id`, `trading_name`, `customer_code`, `trading_address`, `vat_registered`, `vat_number`, `website`, `customerJoiningDate`, `customerSource`, `customerSubSource`, `form_process`, `notes`, `status`, `created_at`, `updated_at`) VALUES
(1, '1', 2, 7, 'CUSTOMER1', '00001', '4255', '0', '42421', '', '2024-09-25', 7, 11, '4', NULL, '1', '2024-09-24 10:54:23', '2024-10-02 08:06:36'),
(2, '2', 2, 5, 'A LIMITED', '00002', '38 Springfield Road, Gillingham, Kent, England, ME7 1YJ', '0', '', '', '2024-09-24', 5, 7, '4', NULL, '1', '2024-09-24 11:16:22', '2024-10-05 11:21:23'),
(3, '1', 2, 5, 'SQADADX', '00003', 'adcas', '0', '', '', '2024-10-11', 7, 11, '4', NULL, '1', '2024-09-25 12:38:05', '2024-10-11 11:42:30'),
(4, '1', 2, 8, 'SGDD', '00004', '', '0', '', '', NULL, NULL, NULL, '2', NULL, '1', '2024-09-27 10:02:29', '2024-09-27 10:02:34'),
(5, '1', 2, 8, 'sfsfsfs', '00005', 'sfgsdgfsf', '0', '', '', '2024-10-15', 7, 11, '4', NULL, '1', '2024-09-27 10:05:32', '2024-10-15 05:48:56'),
(6, '1', 2, 7, 'DWFF', '00006', 'DSD', '0', '', '', NULL, NULL, NULL, '2', NULL, '0', '2024-09-27 10:06:39', '2024-10-05 10:05:52'),
(7, '1', 2, 8, 'ddd', '00007', 'dd55', '0', '', '', '2024-10-19', 7, 11, '4', NULL, '1', '2024-10-10 09:28:23', '2024-10-19 04:57:54'),
(8, '3', 2, 8, 'sssss', '00008', 'ssss', '0', '', '', NULL, NULL, NULL, '1', NULL, '1', '2024-10-10 09:32:39', '2024-10-10 09:32:39'),
(9, '3', 2, 7, 'scfszss', '00009', 'svfsvsv', '0', '', '', NULL, NULL, NULL, '1', NULL, '1', '2024-10-10 09:38:36', '2024-10-10 09:38:36'),
(10, '3', 2, 7, 'scfszssfdd', '000010', 'svfsvsv', '0', '', '', NULL, NULL, NULL, '1', NULL, '1', '2024-10-10 09:39:00', '2024-10-10 09:39:00'),
(11, '3', 2, 7, 'adasfcs', '000011', 'sfcscfs', '0', '', '', NULL, NULL, NULL, '1', NULL, '1', '2024-10-10 09:40:04', '2024-10-10 09:40:04'),
(12, '3', 2, 7, 'sdgdsgxdfhn', '000012', '', '0', '', '', '2024-10-11', 7, 11, '4', NULL, '1', '2024-10-10 10:07:24', '2024-10-11 11:43:22'),
(13, '1', 6, 7, 'grsgr', '000013', 'rhrhrh', '0', '', '', '2024-10-11', 4, 5, '4', NULL, '1', '2024-10-11 09:33:27', '2024-10-11 09:34:00'),
(14, '1', 2, 11, 'AERT', '000014', 'AS', '0', '', '', '2024-10-14', 7, 11, '4', NULL, '1', '2024-10-14 08:47:03', '2024-10-14 08:47:29'),
(15, '1', 4, 11, 'HKJ', '000015', 'dd', '0', '', '', '2024-10-14', 7, 10, '4', NULL, '1', '2024-10-14 08:53:40', '2024-10-14 08:54:13'),
(16, '1', 15, 5, 'WWW', '000016', 'dddd', '0', '', '', '2024-10-14', 7, 11, '4', NULL, '1', '2024-10-14 09:03:33', '2024-10-14 09:04:03'),
(17, '1', 2, 7, 'DDDD', '000017', 'ddd', '0', '', '', '2024-10-19', 7, 11, '4', NULL, '1', '2024-10-19 12:33:44', '2024-10-19 12:34:18'),
(18, '1', 2, 8, 'CUSTOMER1a', '000018', '4255', '0', '', '', '2024-10-22', 7, 11, '4', NULL, '1', '2024-10-22 10:26:50', '2024-10-22 10:37:31'),
(19, '1', 2, 8, 'CUSTOMER15', '000019', '4255', '0', '', '', NULL, NULL, NULL, '1', NULL, '1', '2024-10-24 04:59:36', '2024-10-24 04:59:36'),
(20, '1', 2, 8, 'sfsfs', '000020', 'sfsdff', '0', '', '', '2024-11-20', 7, 11, '4', NULL, '1', '2024-10-24 05:06:43', '2024-11-19 12:30:16'),
(21, '1', 2, 7, 'SDHKH', '000021', 'ddd', '0', '', '', '2024-10-24', 7, 11, '4', NULL, '1', '2024-10-24 06:46:34', '2024-10-24 06:46:57'),
(22, '1', 2, 5, 'QQQQ', '000022', 'dd', '0', '', '', '2024-10-24', 7, 11, '4', NULL, '1', '2024-10-24 07:28:48', '2024-11-26 05:24:38'),
(23, '3', 2, 7, 'FFFFF', '000023', 'eeeeee', '0', '', '', '2024-11-18', 3, 2, '4', NULL, '1', '2024-11-18 12:22:10', '2024-11-18 12:24:52'),
(24, '1', 2, 7, 'rrrrrrrrr', '000024', '4255', '0', '', '', '2024-11-19', 7, 11, '2', NULL, '1', '2024-11-19 05:18:40', '2024-11-19 05:18:58'),
(25, '1', 6, 11, 'sss', '000025', 'ss', '0', '', '', '2024-11-19', 7, 11, '4', NULL, '1', '2024-11-19 12:38:02', '2024-11-23 10:10:39'),
(26, '1', 2, 8, 'uuu', '000026', 'uu', '0', '', '', '2024-11-20', 5, 7, '4', NULL, '1', '2024-11-20 06:28:39', '2024-11-23 06:24:46'),
(27, '1', 2, 5, 'RRR', '000027', 'rr', '0', '', '', '2024-11-20', 7, 11, '4', NULL, '1', '2024-11-20 09:04:52', '2024-11-23 06:23:47'),
(28, '1', 2, 11, '444dddd', '000028', 'dd', '0', '', '', '2024-11-23', 10, 14, '4', NULL, '1', '2024-11-23 10:30:53', '2024-11-23 10:31:12'),
(29, '1', 2, 7, 'EEEE', '000029', 'eEEe', '0', '', '', '2024-11-23', 10, 14, '4', NULL, '1', '2024-11-23 11:15:20', '2024-11-23 12:05:44'),
(30, '1', 2, 10, 'HHHHH', '000030', 'ff', '0', '', '', '2024-11-23', 3, 2, '4', NULL, '1', '2024-11-23 12:07:05', '2024-11-26 04:50:45'),
(31, '1', 2, 10, 'TEST5', '000031', 'dddd', '0', '', '', '2024-11-26', 10, 14, '4', NULL, '1', '2024-11-26 05:44:43', '2024-11-26 05:45:02'),
(32, '2', 2, 5, 'DHILLON PROPERTY AND ASSET INVESTMENTS (UK) LTD', '000032', '128 City Road, London, United Kingdom, EC1V 2NX', '0', '', '', '2024-11-26', 10, 14, '4', NULL, '1', '2024-11-26 07:03:10', '2024-11-26 07:03:22'),
(33, '1', 19, 10, 'MANGE_1', '000033', 'SSSSSSSSSSSSSSSSSSSSS', '0', '', '', '2024-11-26', 10, 14, '4', NULL, '1', '2024-11-26 07:17:36', '2024-11-26 07:17:50'),
(34, '1', 13, 7, 'CUST5', '000034', 'ERERE', '0', '', '', '2024-11-27', 10, 14, '4', NULL, '1', '2024-11-27 05:42:03', '2024-11-27 05:42:15'),
(35, '1', 13, 10, 'CUST6', '000035', 'gg', '0', '', '', '2024-11-27', 10, 14, '4', NULL, '1', '2024-11-27 09:04:24', '2024-11-27 09:04:37'),
(36, '1', 6, 5, 'CUST-125', '000036', 's', '0', '', '', '2024-11-28', 10, 14, '4', NULL, '1', '2024-11-28 06:21:53', '2024-11-28 06:22:11'),
(37, '1', 2, 7, 'CUST-26', '000037', 'dd', '0', '', '', '2024-11-28', 6, 9, '4', NULL, '1', '2024-11-28 09:15:54', '2024-11-28 09:16:10'),
(38, '1', 2, 5, 'CUS- 65', '000038', 's', '0', '', '', '2024-11-28', 10, 14, '4', NULL, '1', '2024-11-28 11:59:05', '2024-11-28 12:00:45'),
(39, '1', 2, 10, 'SSSSSs', '000039', 'sss', '0', '', '', '2024-12-04', 7, 11, '4', NULL, '1', '2024-12-04 12:06:07', '2024-12-04 12:06:53'),
(40, '1', 2, 8, 'PPPPP', '000040', 'bhvh', '0', '', '', '2024-12-12', 10, 14, '4', NULL, '1', '2024-12-04 12:07:33', '2024-12-04 12:07:57'),
(41, '1', 19, 5, 'SFSF', '000041', 'SSSDSS', '0', '', '', '2024-12-05', 6, 9, '4', NULL, '1', '2024-12-05 10:18:52', '2024-12-05 10:19:06'),
(42, '1', 2, 10, 'EEEE1', '000042', 'e', '0', '', '', NULL, NULL, NULL, '1', NULL, '1', '2024-12-10 08:23:15', '2024-12-10 08:23:15'),
(43, '1', 2, 8, 'EEEEEEE', '000043', 'c', '0', '', '', NULL, NULL, NULL, '1', NULL, '1', '2024-12-10 08:29:23', '2024-12-10 08:29:23'),
(44, '2', 2, 8, 'BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED', '000044', 'Devonshire House, Off Ax, 582 Honeypot Lane, Stanmore, United Kingdom, England, HA7 1JS', '0', '', '', NULL, NULL, NULL, '1', NULL, '1', '2024-12-10 09:00:41', '2024-12-10 09:00:41'),
(45, '2', 2, 8, 'BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED1', '000045', 'Devonshire House, Off Ax, 582 Honeypot Lane, Stanmore, United Kingdom, England, HA7 1JS', '0', '', '', NULL, NULL, NULL, '1', NULL, '1', '2024-12-10 09:03:26', '2024-12-10 09:03:26'),
(46, '2', 2, 8, 'BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED11', '000046', 'Devonshire House, Off Ax, 582 Honeypot Lane, Stanmore, United Kingdom, England, HA7 1JS', '0', '', '', NULL, NULL, NULL, '1', NULL, '1', '2024-12-10 09:04:08', '2024-12-10 09:04:08'),
(47, '2', 2, 8, 'BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED111', '000047', 'Devonshire House, Off Ax, 582 Honeypot Lane, Stanmore, United Kingdom, England, HA7 1JS', '0', '', '', NULL, NULL, NULL, '1', NULL, '1', '2024-12-10 09:05:12', '2024-12-10 09:05:12'),
(48, '2', 2, 8, 'BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED1111', '000048', 'Devonshire House, Off Ax, 582 Honeypot Lane, Stanmore, United Kingdom, England, HA7 1JS', '0', '', '', NULL, NULL, NULL, '1', NULL, '1', '2024-12-10 09:06:51', '2024-12-10 09:06:51'),
(49, '2', 2, 10, 'A  +  A LTD', '000049', '46 Brookbank Close, Cheltenham, England, GL50 3NB', '0', '', '', '2024-12-13', 10, 14, '4', NULL, '1', '2024-12-10 11:28:24', '2024-12-10 11:54:32'),
(50, '2', 2, 10, 'B LTD.', '000050', '7  Craigfoot Walk, Kirkcaldy, Fife, KY1 1GA', '0', '', '', '2024-12-10', 7, 11, '4', NULL, '1', '2024-12-10 13:13:53', '2024-12-10 13:15:20'),
(51, '2', 2, 11, 'H LIMITED', '000051', '25 Flitwick Road, Ampthill, Bedford, England, MK45 2NS', '0', '', '', '2024-12-11', 10, 14, '4', NULL, '1', '2024-12-11 06:38:43', '2024-12-11 07:19:58'),
(52, '1', 2, 10, 'SSS11', '000052', 'SSS', '0', '', '', '2024-12-11', 10, 14, '4', NULL, '1', '2024-12-11 08:30:42', '2024-12-11 09:04:02'),
(53, '1', 22, 11, 'SSSSSS1', '000053', '', '0', '', '', '2024-12-12', 10, 14, '4', NULL, '1', '2024-12-12 05:43:26', '2024-12-12 05:43:40'),
(54, '1', 10, 7, 'SSSSSSSSS', '000054', 'ss', '0', '', '', '2024-12-14', 10, 14, '4', NULL, '1', '2024-12-14 07:25:58', '2024-12-14 07:26:12'),
(55, '2', 19, 10, 'F LIMITED', '000055', '1  The Crescent, King Street, Leicester, United Kingdom, LE1 6RX', '0', '', '', '2024-12-17', 10, 14, '4', NULL, '1', '2024-12-17 05:27:26', '2024-12-17 05:28:05'),
(56, '1', 10, 5, 'GGGGG', '000056', 'f', '0', '', '', '2024-12-17', 7, 11, '4', NULL, '1', '2024-12-17 05:45:42', '2024-12-17 05:45:55'),
(57, '1', 6, 10, 'JJJJJ', '000057', 's', '0', '', '', '2024-12-17', 7, 11, '4', NULL, '1', '2024-12-17 05:56:34', '2024-12-17 05:56:48'),
(58, '1', 7, 10, 'R1', '000058', 's', '0', '', '', '2024-12-18', 10, 14, '4', NULL, '1', '2024-12-18 05:19:19', '2024-12-18 05:19:32'),
(59, '1', 2, 11, 'KILLLL', '000059', 'ff', '0', '', '', '2024-12-20', 10, 14, '4', NULL, '1', '2024-12-20 06:51:39', '2024-12-20 06:51:59'),
(60, '1', 2, 11, 'abcc', '000060', '', '0', '', '', '2024-12-26', 10, 14, '4', NULL, '1', '2024-12-26 06:32:26', '2024-12-26 06:32:39'),
(61, '2', 2, 11, 'H LIMITED_000061', '000061', '25 Flitwick Road, Ampthill, Bedford, England, MK45 2NS', '0', '', '', '2024-12-26', 7, 11, '4', NULL, '1', '2024-12-26 06:33:13', '2024-12-26 06:33:24'),
(62, '2', 2, 10, 'H LIMITED_000062', '000062', '25 Flitwick Road, Ampthill, Bedford, England, MK45 2NS', '0', '', '', '2024-12-26', 10, 14, '4', NULL, '1', '2024-12-26 06:34:06', '2024-12-26 06:34:21'),
(63, '1', 2, 22, 'ggg', '000063', 'ggg', '0', '', '', NULL, NULL, NULL, '1', NULL, '1', '2024-12-26 09:24:18', '2024-12-26 09:24:18'),
(64, '1', 2, 22, 'ddddd', '000064', 'd', '0', '', '', NULL, NULL, NULL, '1', 'professional employees are able to solve a wide range of useful and valuable tasks, which is a priority for most enterprises, and both individual and teamwork is essential in the context of all operations.', '1', '2024-12-26 09:28:59', '2024-12-26 09:54:02'),
(65, '2', 2, 11, 'H E CORNISH (INVESTMENTS C I) LIMITED_000065', '000065', 'Restormel Le Petit Val, Alderney, Alderney, Alderney, GY9 3UX', '0', '', '', '2024-12-31', 10, 14, '1', 'ggggggggggggggggggggggggggggggggggggggggggggggggggggggg', '1', '2024-12-26 09:56:24', '2024-12-31 09:33:54'),
(66, '3', 2, 11, 'rrrrrrr', '000066', '5', '0', '', '', '2025-01-17', 10, 13, '4', 'ggggggggggggg', '1', '2024-12-26 09:58:44', '2025-01-01 10:14:32'),
(67, '2', 2, 11, 'F LIMITED_000067', '000067', '1  The Crescent, King Street, Leicester, United Kingdom, LE1 6RX', '0', '', '', '2024-12-31', 10, 14, '4', 'HRM is the field of activity that directly affects the success of business organizations in view of the importance of hiring and retaining professional and talented employees, as well as coordinating and distributing the workforce in accordance with firms’ current needs and market interests.', '1', '2024-12-26 10:01:44', '2024-12-26 10:09:06'),
(68, '1', 23, 8, 'DEEEE', '000068', 'aa', '0', '', '', '2024-12-26', 10, 14, '4', 'abccccc', '1', '2024-12-26 12:10:00', '2024-12-26 12:10:11'),
(69, '1', 2, 22, 'SDSD', '000069', '', '0', '', '', '2025-01-03', 10, 14, '4', '', '1', '2025-01-03 05:54:07', '2025-01-03 05:54:43'),
(70, '1', 2, 22, 'PDDD', '000070', '', '0', '', '', '2025-01-03', 10, 14, '4', '', '1', '2025-01-03 07:09:35', '2025-01-03 07:10:00'),
(71, '1', 2, 22, 'TTTTT', '000071', '', '0', '', '', '2025-01-03', 10, 14, '4', '', '1', '2025-01-03 07:10:29', '2025-01-03 07:10:41'),
(72, '2', 2, 10, 'A LIMITED_000072', '000072', '38 Springfield Road, Gillingham, Kent, England, ME7 1YJ', '0', '', '', '2025-01-11', 10, 14, '4', '', '1', '2025-01-11 07:24:16', '2025-01-16 13:13:31'),
(73, '1', 2, 22, 'o', '000073', '', '0', '', '', NULL, NULL, NULL, '1', '', '1', '2025-01-24 07:08:13', '2025-01-24 07:08:13');

-- --------------------------------------------------------

--
-- Table structure for table `customer_company_information`
--

DROP TABLE IF EXISTS `customer_company_information`;
CREATE TABLE IF NOT EXISTS `customer_company_information` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `company_name` varchar(100) NOT NULL,
  `entity_type` varchar(50) NOT NULL,
  `company_status` varchar(50) NOT NULL,
  `company_number` varchar(50) NOT NULL,
  `registered_office_address` longtext NOT NULL,
  `incorporation_date` date NOT NULL,
  `incorporation_in` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_company_information`
--

INSERT INTO `customer_company_information` (`id`, `customer_id`, `company_name`, `entity_type`, `company_status`, `company_number`, `registered_office_address`, `incorporation_date`, `incorporation_in`, `created_at`, `updated_at`) VALUES
(1, 2, 'A LIMITED', 'ltd', 'active', '117902154', '38 Springfield Road, Gillingham, Kent, England, ME7 1YJ', '2019-01-15', '1', '2024-09-24 11:16:22', '2024-09-26 07:29:47'),
(2, 32, 'DHILLON PROPERTY AND ASSET INVESTMENTS (UK) LTD', 'ltd', 'active', '14597048', '128 City Road, London, United Kingdom, EC1V 2NX', '2023-01-17', '4', '2024-11-26 07:03:10', '2024-11-26 07:03:10'),
(3, 44, 'BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED', 'ltd', 'active', '08429427', 'Devonshire House, Off Ax, 582 Honeypot Lane, Stanmore, United Kingdom, England, HA7 1JS', '2013-03-05', '4', '2024-12-10 09:00:41', '2024-12-10 09:00:41'),
(4, 45, 'BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED', 'ltd', 'active', '08429427', 'Devonshire House, Off Ax, 582 Honeypot Lane, Stanmore, United Kingdom, England, HA7 1JS', '2013-03-05', '4', '2024-12-10 09:03:26', '2024-12-10 09:03:26'),
(5, 46, 'BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED', 'ltd', 'active', '08429427', 'Devonshire House, Off Ax, 582 Honeypot Lane, Stanmore, United Kingdom, England, HA7 1JS', '2013-03-05', '4', '2024-12-10 09:04:08', '2024-12-10 09:04:08'),
(6, 47, 'BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED', 'ltd', 'active', '08429427', 'Devonshire House, Off Ax, 582 Honeypot Lane, Stanmore, United Kingdom, England, HA7 1JS', '2013-03-05', '4', '2024-12-10 09:05:12', '2024-12-10 09:05:12'),
(7, 48, 'BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED', 'ltd', 'active', '08429427', 'Devonshire House, Off Ax, 582 Honeypot Lane, Stanmore, United Kingdom, England, HA7 1JS', '2013-03-05', '4', '2024-12-10 09:06:51', '2024-12-10 09:06:51'),
(8, 49, 'A  +  A LTD', 'ltd', 'active', '12756497', '46 Brookbank Close, Cheltenham, England, GL50 3NB', '2020-07-20', '4', '2024-12-10 11:28:24', '2024-12-10 11:50:19'),
(9, 50, 'B LTD.', 'ltd', 'dissolved', 'SC170717', '7  Craigfoot Walk, Kirkcaldy, Fife, KY1 1GA', '1996-12-18', '4', '2024-12-10 13:13:53', '2024-12-10 13:14:27'),
(10, 51, 'H LIMITED', 'ltd', 'active', '02277126', '25 Flitwick Road, Ampthill, Bedford, England, MK45 2NS', '1988-07-14', '4', '2024-12-11 06:38:43', '2024-12-11 06:38:43'),
(11, 55, 'F LIMITED', 'ltd', 'dissolved', '06016470', '1  The Crescent, King Street, Leicester, United Kingdom, LE1 6RX', '2006-12-01', '4', '2024-12-17 05:27:26', '2024-12-17 05:27:26'),
(12, 61, 'H LIMITED', 'ltd', 'active', '02277126', '25 Flitwick Road, Ampthill, Bedford, England, MK45 2NS', '1988-07-14', '4', '2024-12-26 06:33:13', '2024-12-26 06:33:13'),
(13, 62, 'H LIMITED', 'ltd', 'active', '02277126', '25 Flitwick Road, Ampthill, Bedford, England, MK45 2NS', '1988-07-14', '4', '2024-12-26 06:34:06', '2024-12-26 06:34:06'),
(14, 65, 'H E CORNISH (INVESTMENTS C I) LIMITED', 'registered-overseas-entity', 'registered', 'OE018210', 'Restormel Le Petit Val, Alderney, Alderney, Alderney, GY9 3UX', '2023-01-26', '4', '2024-12-26 09:56:24', '2024-12-26 09:56:24'),
(15, 67, 'F LIMITED', 'ltd', 'dissolved', '06016470', '1  The Crescent, King Street, Leicester, United Kingdom, LE1 6RX', '2006-12-01', '1', '2024-12-26 10:01:44', '2024-12-26 10:01:44'),
(16, 72, 'A LIMITED', 'ltd', 'active', '11790215', '38 Springfield Road, Gillingham, Kent, England, ME7 1YJ', '2019-01-28', '4', '2025-01-11 07:24:17', '2025-01-11 07:24:17');

-- --------------------------------------------------------

--
-- Table structure for table `customer_contact_details`
--

DROP TABLE IF EXISTS `customer_contact_details`;
CREATE TABLE IF NOT EXISTS `customer_contact_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `contact_person_role_id` int(11) DEFAULT '0',
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `alternate_email` varchar(100) DEFAULT NULL,
  `phone_code` varchar(10) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `alternate_phone` varchar(20) DEFAULT NULL,
  `residential_address` text,
  `authorised_signatory_status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: off, 1: on',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`),
  KEY `contact_person_role_id` (`contact_person_role_id`)
) ENGINE=MyISAM AUTO_INCREMENT=80 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_contact_details`
--

INSERT INTO `customer_contact_details` (`id`, `customer_id`, `contact_person_role_id`, `first_name`, `last_name`, `email`, `alternate_email`, `phone_code`, `phone`, `alternate_phone`, `residential_address`, `authorised_signatory_status`, `created_at`, `updated_at`) VALUES
(1, 1, 0, 'ADDD', 'SSSS', 's@gmail.com', NULL, '+44', '', NULL, 'wsfvdv', '1', '2024-09-24 10:54:23', '2024-09-24 10:54:23'),
(2, 2, NULL, 'asadahf', 'dadad', 's@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2024-09-24 11:16:22', '2024-09-26 07:14:24'),
(3, 2, NULL, 'adada', 'adad', 's@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2024-09-24 11:16:22', '2024-09-26 07:14:24'),
(4, 3, 0, 'adcasdcsacsa', 'cscscsc', 's@gmail.com', NULL, '+44', '', NULL, 'scsc', '1', '2024-09-25 12:38:05', '2024-09-25 12:38:05'),
(5, 2, NULL, 'sf45', 'sfs', 's@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2024-09-26 07:16:02', '2024-09-26 07:28:15'),
(8, 4, 0, 'SSS', 'SSS', 's@gmail.com', NULL, '+44', '', NULL, 'DAD', '1', '2024-09-27 10:02:29', '2024-09-27 10:02:29'),
(7, 2, NULL, 'fg', 'hfh', 's@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2024-09-26 07:29:47', '2024-10-07 08:32:39'),
(9, 5, 0, 'fvdvd', 'dvdv', 's@gmail.com', NULL, '+44', '', NULL, 'dvddv', '1', '2024-09-27 10:05:32', '2024-09-27 10:05:32'),
(10, 6, 0, 'asfsaf', 'sfsf', 's@gmail.com', NULL, '+44', '', NULL, 'sfsdf', '1', '2024-09-27 10:06:39', '2024-09-27 10:06:39'),
(11, 7, 0, 'ddd', 'dd', 'dddd@gmail.com', NULL, '+44', '', NULL, 'dd', '1', '2024-10-10 09:28:23', '2024-10-10 09:28:23'),
(12, 10, 6, 'dvdvdv', 'dvdv', 's@gmail.com', NULL, '+44', '', NULL, NULL, '0', '2024-10-10 09:39:00', '2024-10-10 09:39:00'),
(13, 10, 6, 'dvdv', 'dvdv', 's@gmail.com', NULL, '+44', '', NULL, NULL, '0', '2024-10-10 09:39:00', '2024-10-10 09:39:00'),
(14, 11, NULL, 'scfs', 'scs', 's@gmail.com', NULL, '+44', '', NULL, NULL, '0', '2024-10-10 09:40:04', '2024-10-14 04:55:08'),
(15, 11, NULL, 'scsc', 'scs', 's@gmail.com', NULL, '+44', '', NULL, NULL, '0', '2024-10-10 09:40:04', '2024-10-14 04:55:08'),
(16, 12, NULL, 'dfdgd', 'gdgvdsgd', 's@gmail.com', NULL, '+44', '', NULL, NULL, '0', '2024-10-10 10:07:24', '2024-10-11 11:42:51'),
(17, 12, NULL, 'dgd', 'dgdgb', 's@gmail.com', NULL, '+44', '', NULL, NULL, '0', '2024-10-10 10:07:24', '2024-10-11 11:42:51'),
(18, 13, 0, 'rhrh', 'rthrth', 's@gmail.com', NULL, '+44', '', NULL, 'sss', '1', '2024-10-11 09:33:27', '2024-10-11 09:33:27'),
(19, 14, 0, 'SSSS', 'ssss', 's@gmail.com', NULL, '+44', '', NULL, 'ssss', '1', '2024-10-14 08:47:03', '2024-10-14 08:47:03'),
(20, 15, 0, 'ddd', 'ddd', 's@gmail.com', NULL, '+44', '', NULL, 'dd', '1', '2024-10-14 08:53:40', '2024-10-14 08:53:40'),
(21, 16, 0, 'dd', 'dd', 's@gmail.com', NULL, '+44', '', NULL, 'dd', '1', '2024-10-14 09:03:33', '2024-10-14 09:03:33'),
(22, 12, 0, 'ddd', 'dd', 's@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2024-10-14 10:03:41', '2024-10-14 10:03:41'),
(23, 17, 0, 'ddd', 'dd', 'dddd@gmail.com', NULL, '+44', '', NULL, 'dd', '1', '2024-10-19 12:33:44', '2024-10-19 12:33:44'),
(24, 18, 0, 'ddd', 'a', 's@gmail.com', NULL, '+44', '', NULL, 'a', '1', '2024-10-22 10:26:50', '2024-10-22 10:26:50'),
(25, 19, 0, 'dd', 'ddd', 's@gmail.com', NULL, '+44', '', NULL, 'dd', '1', '2024-10-24 04:59:36', '2024-10-24 04:59:36'),
(26, 20, 0, 'sfsf', 'sfsf', 's@gmail.comsf', NULL, '+44', '', NULL, 'sfsf', '1', '2024-10-24 05:06:43', '2024-10-24 05:06:43'),
(27, 21, 0, 'ddddd', 'ddd', 's@gmail.com', NULL, '+44', '', NULL, 'dd', '1', '2024-10-24 06:46:34', '2024-10-24 06:46:34'),
(28, 22, 0, 'ddd', 'dd', 'dddd@gmail.com', NULL, '+44', '', NULL, 'dd', '1', '2024-10-24 07:28:48', '2024-10-24 07:28:48'),
(29, 23, 6, 'eee', 'eee', 's@gmail.com', NULL, '+44', '987456555', NULL, NULL, '0', '2024-11-18 12:22:10', '2024-11-18 12:22:10'),
(30, 23, 6, 'eeeee', 'eee', 's@gmail.com', NULL, '+44', '987456555', NULL, NULL, '0', '2024-11-18 12:22:10', '2024-11-18 12:22:10'),
(31, 24, 0, 'rrr', 'rr', 's@gmail.com', NULL, '+44', '2777777777', NULL, 'wsfvdv', '1', '2024-11-19 05:18:40', '2024-11-19 05:18:40'),
(32, 25, 0, 'ss', 'ss', 's@gmail.com', NULL, '+44', '2777777777', NULL, 'ss', '1', '2024-11-19 12:38:02', '2024-11-19 12:38:02'),
(33, 26, 0, 'uuu', 'uu', 's@gmail.com', NULL, '+44', '2777777777', NULL, 'uu', '1', '2024-11-20 06:28:39', '2024-11-20 06:28:39'),
(34, 27, 0, 'rr', 'rr', 's@gmail.com', NULL, '+44', '', NULL, 'rrr', '1', '2024-11-20 09:04:52', '2024-11-20 09:04:52'),
(35, 28, 0, 'ss', 'ss', 's@gmail.com', NULL, '+44', '', NULL, 's', '1', '2024-11-23 10:30:53', '2024-11-23 10:30:53'),
(36, 29, 0, 'ee', 'ee', 's@gmail.com', NULL, '+44', '', NULL, 'eee', '1', '2024-11-23 11:15:20', '2024-11-23 11:15:20'),
(37, 30, 0, 'ff', 'ff', 's@gmail.com', NULL, '+44', '', NULL, 'd', '1', '2024-11-23 12:07:05', '2024-11-23 12:07:05'),
(38, 31, 0, 'dd', 'dd', 's@gmail.com', NULL, '+44', '', NULL, 'd', '1', '2024-11-26 05:44:43', '2024-11-26 05:44:43'),
(39, 32, NULL, 'dd', 'dd', 's@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2024-11-26 07:03:10', '2024-11-28 06:13:48'),
(40, 33, 0, 'ss', 'sss', 's@gmail.com', NULL, '+44', '', NULL, 'ss', '1', '2024-11-26 07:17:36', '2024-11-26 07:17:36'),
(41, 34, 0, 'dd', 'ddd', 's@gmail.com', NULL, '+44', '', NULL, 'ss', '1', '2024-11-27 05:42:03', '2024-11-27 05:42:03'),
(42, 35, 0, 'gg', 'dd', 's@gmail.com', NULL, '+44', '', NULL, 'ff', '1', '2024-11-27 09:04:24', '2024-11-27 09:04:24'),
(43, 36, 0, 's', 's', 's@gmail.com', NULL, '+44', '', NULL, 's', '1', '2024-11-28 06:21:53', '2024-11-28 06:21:53'),
(44, 37, 0, 'dd', 'dd', 's@gmail.com', NULL, '+44', '', NULL, 'dd', '1', '2024-11-28 09:15:54', '2024-11-28 09:15:54'),
(45, 38, 0, 'dd', 'dd', 's@gmail.com', NULL, '+44', '', NULL, 'dd', '1', '2024-11-28 11:59:05', '2024-11-28 11:59:05'),
(46, 39, 0, 'sss', 'ss', 'ss@gmail.com', NULL, '+44', '', NULL, 'ss', '1', '2024-12-04 12:06:07', '2024-12-04 12:06:07'),
(47, 40, 0, 'hh', 'hh', 's@gmail.com', NULL, '+44', '', NULL, 'ss', '1', '2024-12-04 12:07:33', '2024-12-04 12:07:33'),
(48, 41, 0, 's', 's', 's@gmail.com', NULL, '+44', '', NULL, 's', '1', '2024-12-05 10:18:52', '2024-12-05 10:18:52'),
(49, 42, 0, 'e', 'e', 's@gmail.com', NULL, '+44', '', NULL, 'e', '1', '2024-12-10 08:23:15', '2024-12-10 08:23:15'),
(50, 43, 0, 'c', 'c', 's@gmail.com', NULL, '+44', '', NULL, 'dd', '1', '2024-12-10 08:29:23', '2024-12-10 08:29:23'),
(51, 48, NULL, 'a', 'a', 'axd@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2024-12-10 09:06:51', '2024-12-10 09:07:06'),
(52, 48, NULL, 'sss', 'sss', 's@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2024-12-10 09:11:31', '2024-12-10 09:11:46'),
(53, 49, NULL, 'Alan Ho Yuen', 'LAI', 's@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2024-12-10 11:28:24', '2024-12-10 11:50:19'),
(55, 50, NULL, 'Anne', 'FRASER', 's@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2024-12-10 13:13:53', '2024-12-10 13:14:27'),
(56, 51, NULL, 'Adam Oliver', 'HARRISON', 's@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2024-12-11 06:38:43', '2024-12-11 06:42:12'),
(57, 52, 0, 'dd', 'dd', 's@gmail.com', NULL, '+44', '', NULL, 'ss', '1', '2024-12-11 08:30:42', '2024-12-11 08:30:42'),
(58, 53, 0, 'a', 'a', 's@gmail.com', NULL, '+44', '', NULL, 'a', '1', '2024-12-12 05:43:26', '2024-12-12 05:43:26'),
(59, 54, 0, 'ss', 's', 's@gmail.com', NULL, '+44', '', NULL, 'ss', '1', '2024-12-14 07:25:58', '2024-12-14 07:25:58'),
(60, 55, 0, 'WILD ANGEL LIMITED', 's', 's@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2024-12-17 05:27:26', '2024-12-17 05:27:26'),
(61, 56, 0, 'f', 'f', 's@gmail.com', NULL, '+44', '', NULL, 'f', '1', '2024-12-17 05:45:42', '2024-12-17 05:45:42'),
(62, 57, 0, 's', 's', 's@gmail.com', NULL, '+44', '', NULL, 's', '1', '2024-12-17 05:56:34', '2024-12-17 05:56:34'),
(63, 58, 0, 's', 's', 's@gmail.com', NULL, '+44', '', NULL, 's', '1', '2024-12-18 05:19:19', '2024-12-18 05:19:19'),
(64, 59, 0, 's', 's', 's@gmail.com', NULL, '+44', '', NULL, 'f', '1', '2024-12-20 06:51:39', '2024-12-20 06:51:39'),
(65, 60, 0, 's', 's', 'shk@gmail.com', NULL, '+44', '', NULL, 's', '1', '2024-12-26 06:32:26', '2024-12-26 06:32:26'),
(66, 61, 0, 'Adam Oliver', 'HARRISON', 's@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2024-12-26 06:33:13', '2024-12-26 06:33:13'),
(67, 62, NULL, 'Adam Oliver', 'HARRISON', 's@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2024-12-26 06:34:06', '2024-12-26 08:48:11'),
(68, 63, 0, 'g', 'g', 's@gmail.com', NULL, '+44', '', NULL, 'g', '1', '2024-12-26 09:24:18', '2024-12-26 09:24:18'),
(69, 64, 0, 'd', 'd', 's@gmail.com', NULL, '+44', '', NULL, 'd', '1', '2024-12-26 09:28:59', '2024-12-26 09:28:59'),
(70, 65, NULL, 'sa', 's', 's@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2024-12-26 09:56:24', '2024-12-31 09:33:41'),
(71, 66, NULL, 's', 's', 's@gmail.com', NULL, '+44', '', NULL, NULL, '0', '2024-12-26 09:58:44', '2024-12-26 10:00:50'),
(72, 66, NULL, 's', 's', 's@gmail.com', NULL, '+44', '', NULL, NULL, '0', '2024-12-26 09:58:44', '2024-12-26 10:00:50'),
(73, 67, NULL, 'WILD ANGEL LIMITED', 'aa', 's@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2024-12-26 10:01:44', '2024-12-26 10:08:50'),
(74, 68, 0, 'a', 'a', 's@gmail.com', NULL, '+44', '', NULL, 's', '1', '2024-12-26 12:10:00', '2024-12-26 12:10:00'),
(75, 69, 0, 's', 's', 's@gmail.com', NULL, '+44', '', NULL, 'w', '1', '2025-01-03 05:54:07', '2025-01-03 05:54:07'),
(76, 70, 0, 'd', 'd', 's@gmail.com', NULL, '+44', '', NULL, 'd', '1', '2025-01-03 07:09:35', '2025-01-03 07:09:35'),
(77, 71, 0, 'f', 'f', 's@gmail.com', NULL, '+44', '', NULL, 'f', '1', '2025-01-03 07:10:29', '2025-01-03 07:10:29'),
(78, 72, NULL, 'Ammar Ashraf', 'SAND', 's@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-01-11 07:24:17', '2025-01-14 05:02:43'),
(79, 73, 0, 'oo', 'o', 's@gmail.com', NULL, '+44', '', NULL, 'o', '1', '2025-01-24 07:08:13', '2025-01-24 07:08:13');

-- --------------------------------------------------------

--
-- Table structure for table `customer_contact_person_role`
--

DROP TABLE IF EXISTS `customer_contact_person_role`;
CREATE TABLE IF NOT EXISTS `customer_contact_person_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_contact_person_role`
--

INSERT INTO `customer_contact_person_role` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(6, 'role 1', '1', '2024-09-25 09:03:19', '2024-09-25 09:03:19');

-- --------------------------------------------------------

--
-- Table structure for table `customer_documents`
--

DROP TABLE IF EXISTS `customer_documents`;
CREATE TABLE IF NOT EXISTS `customer_documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `file_size` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `customer_engagement_adhoc_hourly`
--

DROP TABLE IF EXISTS `customer_engagement_adhoc_hourly`;
CREATE TABLE IF NOT EXISTS `customer_engagement_adhoc_hourly` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_engagement_model_id` int(11) NOT NULL,
  `adhoc_accountants` decimal(10,2) NOT NULL,
  `adhoc_bookkeepers` decimal(10,2) NOT NULL,
  `adhoc_payroll_experts` decimal(10,2) NOT NULL,
  `adhoc_tax_experts` decimal(10,2) NOT NULL,
  `adhoc_admin_staff` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_engagement_model_id` (`customer_engagement_model_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_engagement_adhoc_hourly`
--

INSERT INTO `customer_engagement_adhoc_hourly` (`id`, `customer_engagement_model_id`, `adhoc_accountants`, `adhoc_bookkeepers`, `adhoc_payroll_experts`, `adhoc_tax_experts`, `adhoc_admin_staff`, `created_at`, `updated_at`) VALUES
(4, 1, '11.00', '11.00', '1.00', '1.00', '1.00', '2024-09-26 11:20:25', '2024-09-26 11:20:25'),
(5, 28, '11.00', '0.00', '0.00', '0.00', '0.00', '2024-11-28 06:04:24', '2024-11-28 06:04:24'),
(6, 25, '11.00', '0.00', '0.00', '0.00', '0.00', '2024-11-28 06:14:07', '2024-11-28 06:14:07');

-- --------------------------------------------------------

--
-- Table structure for table `customer_engagement_customised_pricing`
--

DROP TABLE IF EXISTS `customer_engagement_customised_pricing`;
CREATE TABLE IF NOT EXISTS `customer_engagement_customised_pricing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_engagement_model_id` int(11) NOT NULL,
  `minimum_number_of_jobs` int(11) NOT NULL,
  `job_type_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `cost_per_job` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_engagement_model_id` (`customer_engagement_model_id`),
  KEY `job_type_id` (`job_type_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_engagement_customised_pricing`
--

INSERT INTO `customer_engagement_customised_pricing` (`id`, `customer_engagement_model_id`, `minimum_number_of_jobs`, `job_type_id`, `service_id`, `cost_per_job`, `created_at`, `updated_at`) VALUES
(3, 28, 1, NULL, 5, '111.00', '2024-11-28 06:04:24', '2024-11-28 06:04:24'),
(4, 25, 1, NULL, 5, '111.00', '2024-11-28 06:14:07', '2024-11-28 06:14:07');

-- --------------------------------------------------------

--
-- Table structure for table `customer_engagement_fte`
--

DROP TABLE IF EXISTS `customer_engagement_fte`;
CREATE TABLE IF NOT EXISTS `customer_engagement_fte` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_engagement_model_id` int(11) NOT NULL,
  `number_of_accountants` int(11) NOT NULL,
  `fee_per_accountant` decimal(10,2) DEFAULT NULL,
  `number_of_bookkeepers` int(11) NOT NULL,
  `fee_per_bookkeeper` decimal(10,2) NOT NULL,
  `number_of_payroll_experts` int(11) NOT NULL,
  `fee_per_payroll_expert` decimal(10,2) NOT NULL,
  `number_of_tax_experts` int(11) NOT NULL,
  `fee_per_tax_expert` decimal(10,2) NOT NULL,
  `number_of_admin_staff` int(11) NOT NULL,
  `fee_per_admin_staff` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_engagement_model_id` (`customer_engagement_model_id`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_engagement_fte`
--

INSERT INTO `customer_engagement_fte` (`id`, `customer_engagement_model_id`, `number_of_accountants`, `fee_per_accountant`, `number_of_bookkeepers`, `fee_per_bookkeeper`, `number_of_payroll_experts`, `fee_per_payroll_expert`, `number_of_tax_experts`, `fee_per_tax_expert`, `number_of_admin_staff`, `fee_per_admin_staff`, `created_at`, `updated_at`) VALUES
(4, 15, 11, '11.00', 11, '11.00', 11, '11.00', 11, '11.00', 11, '11.00', '2024-11-18 12:24:49', '2024-11-18 12:24:49'),
(5, 17, 11, '11.00', 11, '11.00', 11, '11.00', 11, '11.00', 11, '11.00', '2024-11-19 12:30:15', '2024-11-19 12:30:15'),
(6, 20, 0, '11.00', 0, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', '2024-11-20 09:05:12', '2024-11-20 09:05:12'),
(7, 19, 11, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', '2024-11-23 06:24:44', '2024-11-23 06:24:44'),
(8, 21, 11, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', '2024-11-23 10:31:10', '2024-11-23 10:31:10'),
(9, 24, 11, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', '2024-11-26 05:45:00', '2024-11-26 05:45:00'),
(10, 26, 11, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', '2024-11-26 07:17:49', '2024-11-26 07:17:49'),
(11, 28, 11, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', '2024-11-28 06:04:24', '2024-11-28 06:04:24'),
(12, 25, 11, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', '2024-11-28 06:14:07', '2024-11-28 06:14:07'),
(13, 29, 11, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', '2024-11-28 06:22:11', '2024-11-28 06:22:11'),
(14, 30, 11, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', '2024-11-28 09:16:09', '2024-11-28 09:16:09'),
(15, 31, 11, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', '2024-11-28 12:00:43', '2024-11-28 12:00:43'),
(16, 34, 12, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', '2024-12-05 10:19:05', '2024-12-05 10:19:05'),
(17, 44, 1, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', '2024-12-18 05:19:30', '2024-12-18 05:19:30'),
(18, 45, 1, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', '2024-12-20 06:51:58', '2024-12-20 06:51:58'),
(19, 52, 53, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', 0, '0.00', '2025-01-01 09:59:37', '2025-01-01 09:59:37');

-- --------------------------------------------------------

--
-- Table structure for table `customer_engagement_model`
--

DROP TABLE IF EXISTS `customer_engagement_model`;
CREATE TABLE IF NOT EXISTS `customer_engagement_model` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `fte_dedicated_staffing` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: off, 1: on',
  `percentage_model` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: off, 1: on',
  `adhoc_payg_hourly` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: off, 1: on',
  `customised_pricing` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: off, 1: on',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`)
) ENGINE=MyISAM AUTO_INCREMENT=57 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_engagement_model`
--

INSERT INTO `customer_engagement_model` (`id`, `customer_id`, `fte_dedicated_staffing`, `percentage_model`, `adhoc_payg_hourly`, `customised_pricing`, `created_at`, `updated_at`) VALUES
(1, 1, '0', '1', '1', '0', '2024-09-24 10:55:06', '2024-09-26 11:20:25'),
(2, 2, '0', '1', '0', '0', '2024-09-24 11:17:15', '2024-09-24 11:17:15'),
(3, 13, '0', '1', '0', '0', '2024-10-11 09:33:56', '2024-10-11 09:33:56'),
(4, 3, '0', '1', '0', '0', '2024-10-11 11:42:28', '2024-10-11 11:42:28'),
(5, 12, '0', '1', '0', '0', '2024-10-11 11:43:19', '2024-10-11 11:43:19'),
(6, 14, '0', '1', '0', '0', '2024-10-14 08:47:28', '2024-10-14 08:47:28'),
(7, 15, '0', '1', '0', '0', '2024-10-14 08:54:12', '2024-10-14 08:54:12'),
(8, 16, '0', '1', '0', '0', '2024-10-14 09:04:01', '2024-10-14 09:04:01'),
(9, 5, '0', '1', '0', '0', '2024-10-15 05:48:55', '2024-10-15 05:48:55'),
(10, 7, '0', '1', '0', '0', '2024-10-19 04:57:52', '2024-10-19 04:57:52'),
(11, 17, '0', '1', '0', '0', '2024-10-19 12:34:03', '2024-10-19 12:34:03'),
(12, 18, '0', '1', '0', '0', '2024-10-22 10:37:30', '2024-10-22 10:37:30'),
(13, 21, '0', '1', '0', '0', '2024-10-24 06:46:56', '2024-10-24 06:46:56'),
(14, 22, '0', '1', '0', '0', '2024-10-24 07:29:18', '2024-10-24 07:29:18'),
(15, 23, '1', '0', '0', '0', '2024-11-18 12:24:34', '2024-11-18 12:24:49'),
(16, 24, '0', '0', '0', '0', '2024-11-19 05:18:58', '2024-11-19 05:18:58'),
(17, 20, '1', '0', '0', '0', '2024-11-19 12:30:15', '2024-11-19 12:30:15'),
(18, 25, '0', '1', '0', '0', '2024-11-19 12:38:14', '2024-11-19 12:38:20'),
(19, 26, '1', '0', '0', '0', '2024-11-20 06:29:07', '2024-11-23 06:24:44'),
(20, 27, '1', '0', '0', '0', '2024-11-20 09:05:12', '2024-11-20 09:05:12'),
(21, 28, '1', '0', '0', '0', '2024-11-23 10:31:10', '2024-11-23 10:31:10'),
(22, 29, '0', '1', '0', '0', '2024-11-23 11:15:48', '2024-11-23 11:15:48'),
(23, 30, '0', '1', '0', '0', '2024-11-23 12:07:16', '2024-11-23 12:07:16'),
(24, 31, '1', '0', '0', '0', '2024-11-26 05:45:00', '2024-11-26 05:45:00'),
(25, 32, '1', '1', '1', '1', '2024-11-26 07:03:20', '2024-11-28 06:14:07'),
(26, 33, '1', '0', '0', '0', '2024-11-26 07:17:49', '2024-11-26 07:17:49'),
(27, 34, '0', '1', '0', '0', '2024-11-27 05:42:13', '2024-11-27 05:42:13'),
(28, 35, '1', '1', '1', '1', '2024-11-27 09:04:36', '2024-11-28 06:04:24'),
(29, 36, '1', '0', '0', '0', '2024-11-28 06:22:11', '2024-11-28 06:22:11'),
(30, 37, '1', '0', '0', '0', '2024-11-28 09:16:09', '2024-11-28 09:16:09'),
(31, 38, '1', '0', '0', '0', '2024-11-28 12:00:43', '2024-11-28 12:00:43'),
(32, 39, '0', '1', '0', '0', '2024-12-04 12:06:51', '2024-12-04 12:06:51'),
(33, 40, '0', '1', '0', '0', '2024-12-04 12:07:55', '2024-12-04 12:07:55'),
(34, 41, '1', '0', '0', '0', '2024-12-05 10:19:05', '2024-12-05 10:19:05'),
(35, 49, '0', '1', '0', '0', '2024-12-10 11:54:31', '2024-12-10 11:54:31'),
(36, 50, '0', '1', '0', '0', '2024-12-10 13:15:19', '2024-12-10 13:15:19'),
(37, 51, '0', '1', '0', '0', '2024-12-11 07:19:57', '2024-12-11 07:19:57'),
(38, 52, '0', '1', '0', '0', '2024-12-11 08:31:55', '2024-12-11 08:31:55'),
(39, 53, '0', '1', '0', '0', '2024-12-12 05:43:38', '2024-12-12 05:43:38'),
(40, 54, '0', '1', '0', '0', '2024-12-14 07:26:11', '2024-12-14 07:26:11'),
(41, 55, '0', '1', '0', '0', '2024-12-17 05:28:02', '2024-12-17 05:28:02'),
(42, 56, '0', '1', '0', '0', '2024-12-17 05:45:54', '2024-12-17 05:45:54'),
(43, 57, '0', '1', '0', '0', '2024-12-17 05:56:46', '2024-12-17 05:56:46'),
(44, 58, '1', '0', '0', '0', '2024-12-18 05:19:30', '2024-12-18 05:19:30'),
(45, 59, '1', '0', '0', '0', '2024-12-20 06:51:58', '2024-12-20 06:51:58'),
(46, 60, '0', '1', '0', '0', '2024-12-26 06:32:38', '2024-12-26 06:32:38'),
(47, 61, '0', '1', '0', '0', '2024-12-26 06:33:23', '2024-12-26 06:33:23'),
(48, 62, '0', '1', '0', '0', '2024-12-26 06:34:20', '2024-12-26 06:34:20'),
(49, 67, '0', '1', '0', '0', '2024-12-26 10:09:04', '2024-12-26 10:09:04'),
(50, 68, '0', '1', '0', '0', '2024-12-26 12:10:10', '2024-12-26 12:10:10'),
(51, 65, '0', '1', '0', '0', '2024-12-31 09:33:54', '2024-12-31 09:33:54'),
(52, 66, '1', '0', '0', '0', '2025-01-01 09:59:37', '2025-01-01 09:59:37'),
(53, 69, '0', '1', '0', '0', '2025-01-03 05:54:17', '2025-01-03 05:54:17'),
(54, 70, '0', '1', '0', '0', '2025-01-03 07:09:47', '2025-01-03 07:09:47'),
(55, 71, '0', '1', '0', '0', '2025-01-03 07:10:40', '2025-01-03 07:10:40'),
(56, 72, '0', '1', '0', '0', '2025-01-11 07:25:32', '2025-01-11 07:25:32');

-- --------------------------------------------------------

--
-- Table structure for table `customer_engagement_percentage`
--

DROP TABLE IF EXISTS `customer_engagement_percentage`;
CREATE TABLE IF NOT EXISTS `customer_engagement_percentage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_engagement_model_id` int(11) NOT NULL,
  `total_outsourcing` decimal(15,2) NOT NULL,
  `accountants` decimal(10,2) NOT NULL,
  `bookkeepers` decimal(10,2) NOT NULL,
  `payroll_experts` decimal(10,2) NOT NULL,
  `tax_experts` decimal(10,2) NOT NULL,
  `admin_staff` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_engagement_model_id` (`customer_engagement_model_id`)
) ENGINE=MyISAM AUTO_INCREMENT=42 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_engagement_percentage`
--

INSERT INTO `customer_engagement_percentage` (`id`, `customer_engagement_model_id`, `total_outsourcing`, `accountants`, `bookkeepers`, `payroll_experts`, `tax_experts`, `admin_staff`, `created_at`, `updated_at`) VALUES
(1, 1, '1.00', '11.00', '11.00', '11.00', '11.00', '11.00', '2024-09-24 10:55:06', '2024-09-26 11:20:25'),
(2, 2, '55.00', '5.00', '5.00', '55.00', '55.00', '55.00', '2024-09-24 11:17:15', '2024-09-26 10:41:52'),
(3, 3, '5.00', '55.00', '55.00', '55.00', '55.00', '55.00', '2024-10-11 09:33:56', '2024-10-11 09:33:56'),
(4, 4, '55.00', '55.00', '55.00', '55.00', '55.00', '55.00', '2024-10-11 11:42:28', '2024-10-11 11:42:28'),
(5, 5, '55.00', '55.00', '55.00', '5.00', '5.00', '5.00', '2024-10-11 11:43:19', '2024-10-11 11:43:19'),
(6, 6, '55.00', '55.00', '55.00', '55.00', '55.00', '55.00', '2024-10-14 08:47:28', '2024-10-14 08:47:28'),
(7, 7, '55.00', '55.00', '55.00', '55.00', '55.00', '55.00', '2024-10-14 08:54:12', '2024-10-14 08:54:12'),
(8, 8, '55.00', '55.00', '55.00', '55.00', '55.00', '55.00', '2024-10-14 09:04:01', '2024-10-14 09:04:01'),
(9, 9, '55.00', '55.00', '55.00', '55.00', '55.00', '55.00', '2024-10-15 05:48:55', '2024-10-15 05:48:55'),
(10, 10, '55.00', '55.00', '55.00', '55.00', '55.00', '55.00', '2024-10-19 04:57:52', '2024-10-19 04:57:52'),
(11, 11, '55.00', '55.00', '55.00', '55.00', '55.00', '55.00', '2024-10-19 12:34:03', '2024-10-19 12:34:03'),
(12, 12, '55.00', '55.00', '55.00', '55.00', '55.00', '55.00', '2024-10-22 10:37:30', '2024-10-22 10:37:30'),
(13, 13, '55.00', '55.00', '55.00', '55.00', '55.00', '55.00', '2024-10-24 06:46:56', '2024-10-24 06:46:56'),
(14, 14, '55.00', '55.00', '55.00', '55.00', '55.00', '55.00', '2024-10-24 07:29:18', '2024-10-24 07:29:18'),
(15, 18, '11.00', '11.00', '11.00', '11.00', '11.00', '11.00', '2024-11-19 12:38:20', '2024-11-19 12:38:20'),
(16, 22, '1.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-11-23 11:15:48', '2024-11-23 11:15:48'),
(17, 23, '1.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-11-23 12:07:16', '2024-11-23 12:07:16'),
(18, 25, '11.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-11-26 07:03:20', '2024-11-26 07:03:20'),
(19, 27, '1.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-11-27 05:42:13', '2024-11-27 05:42:13'),
(20, 28, '11.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-11-27 09:04:36', '2024-11-27 09:04:36'),
(21, 32, '11.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-12-04 12:06:51', '2024-12-04 12:06:51'),
(22, 33, '11.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-12-04 12:07:55', '2024-12-04 12:07:55'),
(23, 35, '25.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-12-10 11:54:31', '2024-12-10 11:54:31'),
(24, 36, '5.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-12-10 13:15:19', '2024-12-10 13:15:19'),
(25, 37, '1.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-12-11 07:19:57', '2024-12-11 07:19:57'),
(26, 38, '1.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-12-11 08:31:55', '2024-12-11 08:31:55'),
(27, 39, '0.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-12-12 05:43:38', '2024-12-12 06:05:24'),
(28, 40, '1.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-12-14 07:26:11', '2024-12-14 07:26:11'),
(29, 41, '1.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-12-17 05:28:02', '2024-12-17 05:28:02'),
(30, 42, '1.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-12-17 05:45:54', '2024-12-17 05:45:54'),
(31, 43, '1.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-12-17 05:56:46', '2024-12-17 05:56:46'),
(32, 46, '6.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-12-26 06:32:38', '2024-12-26 06:32:38'),
(33, 47, '3.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-12-26 06:33:23', '2024-12-26 06:33:23'),
(34, 48, '3.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-12-26 06:34:20', '2024-12-26 06:34:20'),
(35, 49, '1.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-12-26 10:09:04', '2024-12-26 10:09:04'),
(36, 50, '1.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-12-26 12:10:10', '2024-12-26 12:10:10'),
(37, 51, '1.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2024-12-31 09:33:54', '2024-12-31 09:33:54'),
(38, 53, '1.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2025-01-03 05:54:17', '2025-01-03 05:54:17'),
(39, 54, '1.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2025-01-03 07:09:47', '2025-01-03 07:09:47'),
(40, 55, '1.00', '0.00', '0.00', '0.00', '0.00', '0.00', '2025-01-03 07:10:40', '2025-01-03 07:10:40'),
(41, 56, '4.00', '4.00', '4.00', '4.00', '4.00', '4.00', '2025-01-11 07:25:32', '2025-01-11 07:25:32');

-- --------------------------------------------------------

--
-- Table structure for table `customer_paper_work`
--

DROP TABLE IF EXISTS `customer_paper_work`;
CREATE TABLE IF NOT EXISTS `customer_paper_work` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_type` text NOT NULL,
  `file_size` int(11) NOT NULL,
  `web_url` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_id` (`customer_id`)
) ENGINE=MyISAM AUTO_INCREMENT=36 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_paper_work`
--

INSERT INTO `customer_paper_work` (`id`, `customer_id`, `file_name`, `original_name`, `file_type`, `file_size`, `web_url`, `created_at`, `updated_at`) VALUES
(15, 66, '1721716908342-001.png', '001.png', 'image/png', 112121, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/rrrrrrr/001.png', '2025-01-02 13:13:21', '2025-01-02 13:13:21'),
(25, 69, '1721716908342-001.png', '001.png', 'image/png', 112121, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/SDSD/001.png', '2025-01-03 06:43:26', '2025-01-03 06:43:26'),
(19, 69, '1729316168785-Activity.PNG', 'Activity.PNG', 'image/png', 54446, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/SDSD/Activity.PNG', '2025-01-03 05:54:43', '2025-01-03 05:54:43'),
(26, 70, '1721716908342-001.png', '001.png', 'image/png', 112121, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/PDDD/001.png', '2025-01-03 07:10:00', '2025-01-03 07:10:00'),
(27, 70, '1729316168785-Activity.PNG', 'Activity.PNG', 'image/png', 54446, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/PDDD/Activity.PNG', '2025-01-03 07:10:00', '2025-01-03 07:10:00'),
(32, 71, '1721719818558-002.png', '002.png', 'image/png', 436901, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST71/002.png', '2025-01-04 09:37:04', '2025-01-04 09:37:04'),
(35, 71, '1735643710445-dummy (1).pdf', 'dummy (1).pdf', 'application/pdf', 13264, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST71/dummy%20(1).pdf', '2025-01-07 06:46:38', '2025-01-07 06:46:38');

-- --------------------------------------------------------

--
-- Table structure for table `customer_services`
--

DROP TABLE IF EXISTS `customer_services`;
CREATE TABLE IF NOT EXISTS `customer_services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_id` (`customer_id`,`service_id`),
  KEY `service_id` (`service_id`)
) ENGINE=MyISAM AUTO_INCREMENT=121 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_services`
--

INSERT INTO `customer_services` (`id`, `customer_id`, `service_id`, `status`, `created_at`, `updated_at`) VALUES
(45, 1, 3, '1', '2024-10-15 05:33:00', '2024-10-15 05:33:00'),
(2, 2, 2, '1', '2024-09-24 11:16:26', '2024-09-24 11:16:26'),
(3, 2, 1, '1', '2024-09-26 08:28:45', '2024-09-26 08:28:45'),
(4, 2, 3, '1', '2024-09-26 08:50:22', '2024-09-26 08:50:22'),
(5, 4, 1, '1', '2024-09-27 10:02:34', '2024-09-27 10:02:34'),
(6, 5, 1, '1', '2024-09-27 10:05:42', '2024-09-27 10:05:42'),
(7, 6, 2, '1', '2024-09-27 10:06:43', '2024-09-27 10:06:43'),
(46, 15, 2, '1', '2024-10-15 05:33:20', '2024-10-15 05:33:20'),
(9, 3, 3, '1', '2024-10-11 11:41:57', '2024-10-11 11:41:57'),
(10, 12, 1, '1', '2024-10-11 11:43:04', '2024-10-11 11:43:04'),
(11, 14, 2, '1', '2024-10-14 08:47:10', '2024-10-14 08:47:10'),
(51, 18, 3, '1', '2024-10-22 10:37:08', '2024-10-22 10:37:08'),
(50, 17, 3, '1', '2024-10-19 12:33:47', '2024-10-19 12:33:47'),
(44, 13, 1, '1', '2024-10-15 05:32:03', '2024-10-15 05:32:03'),
(47, 1, 2, '1', '2024-10-15 05:33:29', '2024-10-15 05:33:29'),
(48, 15, 3, '1', '2024-10-15 05:33:39', '2024-10-15 05:33:39'),
(29, 1, 1, '1', '2024-10-14 15:00:52', '2024-10-14 15:00:52'),
(49, 7, 3, '1', '2024-10-19 04:57:32', '2024-10-19 04:57:32'),
(40, 15, 1, '1', '2024-10-15 05:07:02', '2024-10-15 05:07:02'),
(41, 16, 1, '1', '2024-10-15 05:07:19', '2024-10-15 05:07:19'),
(52, 20, 3, '1', '2024-10-24 05:06:52', '2024-10-24 05:06:52'),
(55, 22, 3, '1', '2024-10-24 07:29:01', '2024-10-24 07:29:01'),
(54, 21, 1, '1', '2024-10-24 07:20:44', '2024-10-24 07:20:44'),
(56, 22, 1, '1', '2024-10-24 07:29:01', '2024-10-24 07:29:01'),
(57, 21, 2, '1', '2024-11-18 12:10:15', '2024-11-18 12:10:15'),
(58, 23, 2, '1', '2024-11-18 12:24:19', '2024-11-18 12:24:19'),
(59, 23, 1, '1', '2024-11-19 04:49:42', '2024-11-19 04:49:42'),
(60, 24, 2, '1', '2024-11-19 05:18:43', '2024-11-19 05:18:43'),
(61, 25, 2, '1', '2024-11-19 12:38:05', '2024-11-19 12:38:05'),
(62, 26, 1, '1', '2024-11-20 06:28:42', '2024-11-20 06:28:42'),
(63, 27, 2, '1', '2024-11-20 09:04:55', '2024-11-20 09:04:55'),
(64, 27, 1, '1', '2024-11-20 09:04:55', '2024-11-20 09:04:55'),
(65, 27, 5, '1', '2024-11-23 10:29:26', '2024-11-23 10:29:26'),
(66, 28, 5, '1', '2024-11-23 10:31:01', '2024-11-23 10:31:01'),
(67, 29, 5, '1', '2024-11-23 11:15:24', '2024-11-23 11:15:24'),
(68, 29, 3, '1', '2024-11-23 11:15:24', '2024-11-23 11:15:24'),
(71, 31, 3, '1', '2024-11-26 05:44:52', '2024-11-26 05:44:52'),
(70, 30, 3, '1', '2024-11-23 12:07:08', '2024-11-23 12:07:08'),
(72, 32, 2, '1', '2024-11-26 07:03:13', '2024-11-26 07:03:13'),
(73, 33, 2, '1', '2024-11-26 07:17:39', '2024-11-26 07:17:39'),
(74, 34, 3, '1', '2024-11-27 05:42:06', '2024-11-27 05:42:06'),
(75, 34, 5, '1', '2024-11-27 05:42:06', '2024-11-27 05:42:06'),
(76, 35, 3, '1', '2024-11-27 09:04:27', '2024-11-27 09:04:27'),
(77, 35, 2, '1', '2024-11-27 09:04:27', '2024-11-27 09:04:27'),
(79, 36, 3, '1', '2024-11-28 09:14:02', '2024-11-28 09:14:02'),
(80, 36, 2, '1', '2024-11-28 09:14:13', '2024-11-28 09:14:13'),
(82, 37, 5, '1', '2024-11-28 09:23:46', '2024-11-28 09:23:46'),
(89, 37, 1, '1', '2024-11-28 11:51:14', '2024-11-28 11:51:14'),
(90, 37, 3, '1', '2024-11-28 11:54:50', '2024-11-28 11:54:50'),
(91, 38, 2, '1', '2024-11-28 12:00:35', '2024-11-28 12:00:35'),
(92, 38, 3, '1', '2024-11-28 12:11:37', '2024-11-28 12:11:37'),
(95, 40, 2, '1', '2024-12-04 12:07:42', '2024-12-04 12:07:42'),
(94, 39, 2, '1', '2024-12-04 12:06:22', '2024-12-04 12:06:22'),
(96, 41, 3, '1', '2024-12-05 10:18:56', '2024-12-05 10:18:56'),
(97, 48, 2, '1', '2024-12-10 09:11:36', '2024-12-10 09:11:36'),
(98, 49, 2, '1', '2024-12-10 11:50:28', '2024-12-10 11:50:28'),
(99, 50, 1, '1', '2024-12-10 13:13:55', '2024-12-10 13:13:55'),
(100, 51, 5, '1', '2024-12-11 07:19:46', '2024-12-11 07:19:46'),
(101, 52, 2, '1', '2024-12-11 08:30:56', '2024-12-11 08:30:56'),
(102, 53, 3, '1', '2024-12-12 05:43:30', '2024-12-12 05:43:30'),
(103, 54, 3, '1', '2024-12-14 07:26:01', '2024-12-14 07:26:01'),
(104, 55, 5, '1', '2024-12-17 05:27:30', '2024-12-17 05:27:30'),
(105, 56, 5, '1', '2024-12-17 05:45:45', '2024-12-17 05:45:45'),
(106, 57, 3, '1', '2024-12-17 05:56:36', '2024-12-17 05:56:36'),
(107, 58, 3, '1', '2024-12-18 05:19:21', '2024-12-18 05:19:21'),
(108, 59, 1, '1', '2024-12-20 06:51:47', '2024-12-20 06:51:47'),
(109, 60, 1, '1', '2024-12-26 06:32:28', '2024-12-26 06:32:28'),
(110, 61, 1, '1', '2024-12-26 06:33:16', '2024-12-26 06:33:16'),
(111, 62, 1, '1', '2024-12-26 06:34:09', '2024-12-26 06:34:09'),
(112, 67, 1, '1', '2024-12-26 10:08:53', '2024-12-26 10:08:53'),
(113, 68, 1, '1', '2024-12-26 12:10:03', '2024-12-26 12:10:03'),
(114, 68, 2, '1', '2024-12-26 12:10:03', '2024-12-26 12:10:03'),
(115, 65, 1, '1', '2024-12-31 09:33:45', '2024-12-31 09:33:45'),
(116, 66, 1, '1', '2025-01-01 09:59:22', '2025-01-01 09:59:22'),
(117, 69, 1, '1', '2025-01-03 05:54:09', '2025-01-03 05:54:09'),
(118, 70, 1, '1', '2025-01-03 07:09:38', '2025-01-03 07:09:38'),
(119, 71, 1, '1', '2025-01-03 07:10:32', '2025-01-03 07:10:32'),
(120, 72, 3, '1', '2025-01-11 07:24:47', '2025-01-11 07:24:47');

-- --------------------------------------------------------

--
-- Table structure for table `customer_service_account_managers`
--

DROP TABLE IF EXISTS `customer_service_account_managers`;
CREATE TABLE IF NOT EXISTS `customer_service_account_managers` (
  `customer_service_id` int(11) NOT NULL,
  `account_manager_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `customer_service_id` (`customer_service_id`,`account_manager_id`),
  KEY `account_manager_id` (`account_manager_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_service_account_managers`
--

INSERT INTO `customer_service_account_managers` (`customer_service_id`, `account_manager_id`, `created_at`, `updated_at`) VALUES
(45, 7, '2024-10-15 05:33:29', '2024-10-15 05:33:29'),
(4, 11, '2024-11-23 10:20:45', '2024-11-23 10:20:45'),
(2, 5, '2024-11-23 10:20:45', '2024-11-23 10:20:45'),
(3, 5, '2024-11-23 10:20:45', '2024-11-23 10:20:45'),
(3, 11, '2024-11-23 10:20:45', '2024-11-23 10:20:45'),
(5, 8, '2024-10-05 07:29:43', '2024-10-05 07:29:43'),
(4, 5, '2024-11-23 10:20:45', '2024-11-23 10:20:45'),
(6, 8, '2024-10-15 05:48:33', '2024-10-15 05:48:33'),
(7, 7, '2024-10-07 08:32:31', '2024-10-07 08:32:31'),
(46, 11, '2024-10-15 05:33:39', '2024-10-15 05:33:39'),
(9, 5, '2024-10-11 11:41:57', '2024-10-11 11:41:57'),
(10, 7, '2024-10-11 11:43:32', '2024-10-11 11:43:32'),
(11, 11, '2024-10-14 14:11:56', '2024-10-14 14:11:56'),
(51, 8, '2024-10-22 10:37:08', '2024-10-22 10:37:08'),
(50, 7, '2024-11-15 12:51:27', '2024-11-15 12:51:27'),
(44, 7, '2024-10-15 05:32:03', '2024-10-15 05:32:03'),
(49, 8, '2024-10-19 04:57:32', '2024-10-19 04:57:32'),
(47, 7, '2024-10-15 05:33:29', '2024-10-15 05:33:29'),
(48, 11, '2024-10-15 05:33:39', '2024-10-15 05:33:39'),
(29, 7, '2024-10-15 05:33:29', '2024-10-15 05:33:29'),
(40, 11, '2024-10-15 05:33:39', '2024-10-15 05:33:39'),
(41, 5, '2024-10-15 08:42:57', '2024-10-15 08:42:57'),
(52, 8, '2024-11-19 12:29:47', '2024-11-19 12:29:47'),
(55, 5, '2024-11-26 05:25:14', '2024-11-26 05:25:14'),
(54, 7, '2024-11-23 07:22:11', '2024-11-23 07:22:11'),
(56, 5, '2024-11-26 05:25:14', '2024-11-26 05:25:14'),
(57, 7, '2024-11-23 07:22:11', '2024-11-23 07:22:11'),
(58, 7, '2024-11-23 10:09:08', '2024-11-23 10:09:08'),
(59, 7, '2024-11-23 10:09:08', '2024-11-23 10:09:08'),
(60, 7, '2024-11-19 05:18:43', '2024-11-19 05:18:43'),
(61, 7, '2024-11-19 12:38:05', '2024-11-19 12:38:05'),
(62, 8, '2024-11-25 07:04:38', '2024-11-25 07:04:38'),
(63, 7, '2024-11-23 10:30:08', '2024-11-23 10:30:08'),
(64, 7, '2024-11-23 10:30:08', '2024-11-23 10:30:08'),
(63, 5, '2024-11-23 10:30:08', '2024-11-23 10:30:08'),
(64, 5, '2024-11-23 10:30:08', '2024-11-23 10:30:08'),
(62, 5, '2024-11-25 07:04:38', '2024-11-25 07:04:38'),
(65, 5, '2024-11-23 10:30:08', '2024-11-23 10:30:08'),
(66, 11, '2024-11-23 10:31:01', '2024-11-23 10:31:01'),
(67, 11, '2024-11-23 12:05:51', '2024-11-23 12:05:51'),
(68, 11, '2024-11-23 12:05:51', '2024-11-23 12:05:51'),
(67, 7, '2024-11-23 12:05:51', '2024-11-23 12:05:51'),
(68, 7, '2024-11-23 12:05:51', '2024-11-23 12:05:51'),
(70, 10, '2024-11-26 04:51:00', '2024-11-26 04:51:00'),
(70, 5, '2024-11-26 04:51:00', '2024-11-26 04:51:00'),
(72, 5, '2024-11-28 06:13:50', '2024-11-28 06:13:50'),
(71, 10, '2024-11-26 05:44:52', '2024-11-26 05:44:52'),
(73, 10, '2024-11-26 07:17:39', '2024-11-26 07:17:39'),
(74, 7, '2024-11-27 05:42:06', '2024-11-27 05:42:06'),
(75, 7, '2024-11-27 05:42:06', '2024-11-27 05:42:06'),
(76, 10, '2024-11-28 06:17:19', '2024-11-28 06:17:19'),
(77, 10, '2024-11-28 06:17:19', '2024-11-28 06:17:19'),
(76, 5, '2024-11-28 06:17:19', '2024-11-28 06:17:19'),
(79, 7, '2024-11-28 09:27:47', '2024-11-28 09:27:47'),
(79, 5, '2024-11-28 09:27:47', '2024-11-28 09:27:47'),
(80, 5, '2024-11-28 09:27:47', '2024-11-28 09:27:47'),
(80, 10, '2024-11-28 09:27:47', '2024-11-28 09:27:47'),
(91, 5, '2024-11-28 12:11:37', '2024-11-28 12:11:37'),
(89, 7, '2024-11-28 12:12:22', '2024-11-28 12:12:22'),
(90, 7, '2024-11-28 12:12:22', '2024-11-28 12:12:22'),
(82, 7, '2024-11-28 12:12:22', '2024-11-28 12:12:22'),
(92, 5, '2024-11-28 12:11:37', '2024-11-28 12:11:37'),
(95, 8, '2024-12-04 12:07:42', '2024-12-04 12:07:42'),
(94, 10, '2024-12-04 12:06:35', '2024-12-04 12:06:35'),
(96, 5, '2024-12-05 10:18:56', '2024-12-05 10:18:56'),
(97, 8, '2024-12-10 09:12:21', '2024-12-10 09:12:21'),
(98, 10, '2024-12-10 11:54:09', '2024-12-10 11:54:09'),
(97, 5, '2024-12-10 09:12:21', '2024-12-10 09:12:21'),
(99, 10, '2024-12-10 13:15:07', '2024-12-10 13:15:07'),
(100, 11, '2024-12-11 08:29:38', '2024-12-11 08:29:38'),
(101, 10, '2024-12-11 08:31:46', '2024-12-11 08:31:46'),
(102, 11, '2024-12-12 06:05:20', '2024-12-12 06:05:20'),
(103, 7, '2024-12-14 07:26:01', '2024-12-14 07:26:01'),
(104, 10, '2024-12-17 05:27:30', '2024-12-17 05:27:30'),
(105, 5, '2024-12-17 05:45:45', '2024-12-17 05:45:45'),
(106, 10, '2024-12-17 05:56:36', '2024-12-17 05:56:36'),
(107, 10, '2024-12-20 06:50:46', '2024-12-20 06:50:46'),
(107, 5, '2024-12-20 06:50:46', '2024-12-20 06:50:46'),
(108, 11, '2025-01-01 06:16:08', '2025-01-01 06:16:08'),
(108, 10, '2025-01-01 06:16:08', '2025-01-01 06:16:08'),
(109, 11, '2024-12-26 06:32:28', '2024-12-26 06:32:28'),
(110, 11, '2024-12-26 06:33:16', '2024-12-26 06:33:16'),
(111, 10, '2024-12-26 08:48:12', '2024-12-26 08:48:12'),
(112, 11, '2025-01-02 08:38:34', '2025-01-02 08:38:34'),
(113, 8, '2025-01-07 05:59:39', '2025-01-07 05:59:39'),
(114, 8, '2025-01-07 05:59:39', '2025-01-07 05:59:39'),
(115, 11, '2024-12-31 09:33:45', '2024-12-31 09:33:45'),
(116, 11, '2025-01-02 13:13:07', '2025-01-02 13:13:07'),
(117, 22, '2025-01-03 07:04:13', '2025-01-03 07:04:13'),
(118, 22, '2025-01-03 07:09:38', '2025-01-03 07:09:38'),
(119, 22, '2025-01-07 08:30:05', '2025-01-07 08:30:05'),
(120, 10, '2025-01-14 05:02:43', '2025-01-14 05:02:43');

-- --------------------------------------------------------

--
-- Table structure for table `customer_service_task`
--

DROP TABLE IF EXISTS `customer_service_task`;
CREATE TABLE IF NOT EXISTS `customer_service_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_id` (`customer_id`,`service_id`,`task_id`),
  KEY `service_id` (`service_id`),
  KEY `task_id` (`task_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `customer_source`
--

DROP TABLE IF EXISTS `customer_source`;
CREATE TABLE IF NOT EXISTS `customer_source` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_source`
--

INSERT INTO `customer_source` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'cust', '1', '2024-09-10 08:58:59', '2024-09-10 09:01:48'),
(4, 'abc', '1', '2024-09-13 10:47:01', '2024-09-13 10:47:01'),
(3, 'cust2', '1', '2024-09-10 08:59:21', '2024-09-10 08:59:21'),
(5, 'social media', '1', '2024-09-13 10:51:17', '2024-09-13 10:51:17'),
(6, 'okk', '1', '2024-09-13 10:54:06', '2024-09-13 10:54:06'),
(7, 'ayz', '1', '2024-09-13 11:05:11', '2024-09-13 11:05:11'),
(9, 'DDD', '1', '2024-09-25 11:46:40', '2024-09-25 11:46:40'),
(10, 'AAAAA', '1', '2024-11-23 07:21:40', '2024-11-23 07:21:40');

-- --------------------------------------------------------

--
-- Table structure for table `customer_sub_source`
--

DROP TABLE IF EXISTS `customer_sub_source`;
CREATE TABLE IF NOT EXISTS `customer_sub_source` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_source_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_source_id` (`customer_source_id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_sub_source`
--

INSERT INTO `customer_sub_source` (`id`, `customer_source_id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'subSorce', '1', '2024-09-10 09:41:21', '2024-09-10 09:41:21'),
(2, 3, 'SSSSS', '1', '2024-09-13 10:39:48', '2024-09-13 10:39:48'),
(3, 4, 'a', '1', '2024-09-13 10:47:12', '2024-09-13 10:47:12'),
(4, 4, 'b', '1', '2024-09-13 10:47:15', '2024-09-13 10:47:15'),
(5, 4, 'c', '1', '2024-09-13 10:47:19', '2024-09-13 10:47:19'),
(6, 5, 'facebook', '1', '2024-09-13 10:51:46', '2024-09-13 10:51:46'),
(7, 5, 'twitter', '1', '2024-09-13 10:52:01', '2024-09-13 10:52:01'),
(8, 6, 'o', '1', '2024-09-13 10:54:14', '2024-09-13 10:54:14'),
(9, 6, 'k', '1', '2024-09-13 10:54:18', '2024-09-13 10:54:18'),
(10, 7, 'x', '1', '2024-09-13 11:05:25', '2024-09-13 11:05:25'),
(11, 7, 'y', '1', '2024-09-13 11:05:29', '2024-09-13 11:05:29'),
(13, 10, 'f', '1', '2024-11-23 07:22:00', '2024-11-23 07:22:00'),
(14, 10, 'ff', '1', '2024-11-23 07:22:04', '2024-11-23 07:22:04'),
(15, 9, 'f', '1', '2025-01-08 07:27:15', '2025-01-08 07:27:15');

-- --------------------------------------------------------

--
-- Stand-in structure for view `dashboard_data_view`
-- (See below for the actual view)
--
DROP VIEW IF EXISTS `dashboard_data_view`;
CREATE TABLE IF NOT EXISTS `dashboard_data_view` (
`customer_id` int(11)
,`customer_type` enum('1','2','3')
,`staff_id` int(11)
,`account_manager_id` int(11)
,`a_account_manager_id` int(11)
,`allocated_to` int(11)
,`reviewer` int(11)
,`job_id` int(11)
,`status_type` int(11)
,`client_id` int(11)
,`client_created_at` timestamp
,`job_created_at` timestamp
,`customer_created_at` timestamp
);

-- --------------------------------------------------------

--
-- Table structure for table `drafts`
--

DROP TABLE IF EXISTS `drafts`;
CREATE TABLE IF NOT EXISTS `drafts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` int(11) NOT NULL,
  `draft_sent_on` date DEFAULT NULL,
  `draft_title` varchar(100) DEFAULT NULL,
  `final_draft_sent_on` date DEFAULT NULL,
  `feedback_received` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: Yes',
  `updated_amendment` enum('1','2','3','4') NOT NULL DEFAULT '1' COMMENT '1:Amendment, 2: Update ,2: Both ,2: None',
  `feedback` text,
  `was_it_complete` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: Yes',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `job_id` (`job_id`)
) ENGINE=MyISAM AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `drafts`
--

INSERT INTO `drafts` (`id`, `job_id`, `draft_sent_on`, `draft_title`, `final_draft_sent_on`, `feedback_received`, `updated_amendment`, `feedback`, `was_it_complete`, `created_at`, `updated_at`) VALUES
(1, 5, '2024-10-01', 'D_00001', '2024-10-01', '0', '1', NULL, '1', '2024-10-01 07:21:46', '2024-10-01 07:21:46'),
(2, 5, '2024-10-01', 'D_00002', NULL, '0', '1', NULL, '1', '2024-10-01 07:22:09', '2024-10-01 12:28:46'),
(3, 5, '2024-10-01', 'D_00003', NULL, '0', '1', NULL, '1', '2024-10-01 12:17:10', '2024-10-01 12:28:36'),
(4, 5, '2024-10-01', 'D_00004', '2024-10-02', '0', '1', NULL, '1', '2024-10-01 12:32:53', '2024-10-02 07:30:14'),
(5, 5, '2024-10-01', 'D_00005', '2024-10-02', '0', '1', NULL, '1', '2024-10-01 12:32:57', '2024-10-02 07:30:08'),
(6, 5, '2024-10-01', 'D_00006', '2024-10-01', '0', '1', NULL, '1', '2024-10-01 12:33:43', '2024-10-01 12:33:43'),
(7, 5, '2024-10-01', 'D_00007', '2024-10-01', '0', '1', NULL, '1', '2024-10-01 12:35:46', '2024-10-01 12:35:46'),
(8, 5, '2024-10-01', 'D_00008', '2024-10-01', '0', '1', NULL, '1', '2024-10-01 12:35:50', '2024-10-01 12:35:50'),
(9, 5, '2024-10-01', 'D_00009', '2024-10-01', '0', '1', NULL, '1', '2024-10-01 12:36:28', '2024-10-01 12:36:28'),
(10, 5, '2024-10-01', 'D_000010', '2024-10-01', '0', '1', NULL, '1', '2024-10-01 12:37:01', '2024-10-01 12:37:01'),
(11, 6, '2024-10-21', 'D_00001', '2024-11-14', '0', '1', NULL, '1', '2024-10-21 09:37:49', '2024-11-14 06:06:31'),
(12, 26, '2024-11-04', 'D_00001', NULL, '0', '1', NULL, '0', '2024-11-04 06:40:00', '2024-11-04 06:40:00'),
(13, 26, '2024-11-04', 'D_00002', NULL, '0', '1', NULL, '0', '2024-11-04 06:40:14', '2024-11-04 06:40:14'),
(14, 5, '2024-11-12', 'D_000011', '2024-11-14', '0', '1', NULL, '1', '2024-11-12 11:49:00', '2024-11-14 08:43:35'),
(15, 6, '2024-11-12', 'D_00002', '2024-11-14', '0', '1', NULL, '1', '2024-11-12 12:02:13', '2024-11-14 06:07:21'),
(16, 6, '2024-11-12', 'D_00003', '2024-11-14', '0', '1', NULL, '1', '2024-11-12 12:12:44', '2024-11-14 06:07:32'),
(17, 4, '2024-11-14', 'D_00001', '2024-11-14', '0', '1', NULL, '1', '2024-11-14 09:12:51', '2024-11-14 09:12:51'),
(18, 28, '2024-11-19', 'D_00001', '2024-11-19', '0', '1', NULL, '1', '2024-11-19 12:27:15', '2024-11-19 12:27:15'),
(19, 31, '2024-11-23', 'D_00001', '2024-11-23', '0', '1', NULL, '1', '2024-11-23 10:49:56', '2024-11-23 10:50:25'),
(20, 5, '2024-11-25', 'D_000012', '2024-11-25', '0', '1', NULL, '1', '2024-11-25 06:27:24', '2024-11-25 06:34:29'),
(21, 5, '2024-11-25', 'D_000013', '2024-11-25', '0', '1', NULL, '1', '2024-11-25 06:28:03', '2024-11-25 06:28:03'),
(22, 5, '2024-11-25', 'D_000014', NULL, '0', '1', NULL, '0', '2024-11-25 06:34:43', '2024-11-25 06:34:43'),
(23, 5, '2024-11-25', 'D_000015', '2024-11-25', '0', '1', NULL, '1', '2024-11-25 06:34:54', '2024-11-25 06:34:54'),
(24, 40, '2024-11-27', 'D_00001', '2024-11-27', '0', '1', NULL, '1', '2024-11-27 10:01:06', '2024-11-27 10:04:27'),
(25, 40, '2024-11-27', 'D_00002', '2024-11-27', '0', '1', NULL, '1', '2024-11-27 10:02:50', '2024-11-27 10:03:56'),
(26, 40, '2024-11-27', 'D_00003', '2024-11-27', '0', '1', NULL, '1', '2024-11-27 10:04:52', '2024-11-27 10:06:15'),
(27, 40, '2024-11-27', 'D_00004', NULL, '0', '1', NULL, '0', '2024-11-27 10:06:39', '2024-11-27 10:06:39');

-- --------------------------------------------------------

--
-- Table structure for table `incorporation_in`
--

DROP TABLE IF EXISTS `incorporation_in`;
CREATE TABLE IF NOT EXISTS `incorporation_in` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `incorporation_in`
--

INSERT INTO `incorporation_in` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'ENGLAND AND WALES', '1', '2024-09-02 07:00:20', '2024-09-14 05:31:31'),
(4, 'ENG VS HALES', '1', '2024-09-25 11:46:03', '2024-09-25 12:11:32');

-- --------------------------------------------------------

--
-- Table structure for table `internal`
--

DROP TABLE IF EXISTS `internal`;
CREATE TABLE IF NOT EXISTS `internal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `internal`
--

INSERT INTO `internal` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'abc', '1', '2024-10-05 12:12:35', '2024-10-05 12:12:35'),
(2, 'xyz', '1', '2024-10-05 12:12:44', '2024-10-05 12:12:44'),
(7, 'ddddd', '1', '2024-11-18 10:15:46', '2024-11-18 10:15:46'),
(6, 'SSS', '1', '2024-10-14 07:13:59', '2024-10-14 07:13:59'),
(10, 'FFFF1', '1', '2024-11-26 05:26:00', '2024-11-26 05:27:21');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `staff_created_id` int(11) DEFAULT NULL,
  `job_id` varchar(100) NOT NULL,
  `account_manager_id` int(11) NOT NULL COMMENT 'Only staff members who are account managers',
  `customer_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `client_job_code` varchar(50) DEFAULT NULL,
  `customer_contact_details_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `job_type_id` int(11) NOT NULL,
  `budgeted_hours` varchar(100) DEFAULT NULL,
  `reviewer` int(11) DEFAULT NULL,
  `allocated_to` int(11) DEFAULT NULL,
  `allocated_on` date DEFAULT NULL,
  `date_received_on` date DEFAULT NULL,
  `year_end` varchar(7) DEFAULT NULL,
  `total_preparation_time` varchar(100) DEFAULT NULL,
  `review_time` varchar(100) DEFAULT NULL,
  `feedback_incorporation_time` varchar(100) DEFAULT NULL,
  `total_time` varchar(100) DEFAULT NULL,
  `engagement_model` varchar(255) DEFAULT NULL,
  `expected_delivery_date` date DEFAULT NULL,
  `due_on` date DEFAULT NULL,
  `submission_deadline` date DEFAULT NULL,
  `customer_deadline_date` date DEFAULT NULL,
  `sla_deadline_date` date DEFAULT NULL,
  `internal_deadline_date` date DEFAULT NULL,
  `filing_Companies_required` enum('0','1') DEFAULT '1' COMMENT '0: No, 1: Yes',
  `filing_Companies_date` date DEFAULT NULL,
  `filing_hmrc_required` enum('0','1') DEFAULT '1' COMMENT '0: No, 1: Yes',
  `filing_hmrc_date` date DEFAULT NULL,
  `opening_balance_required` enum('0','1') DEFAULT '1' COMMENT '0: No, 1: Yes',
  `opening_balance_date` date DEFAULT NULL,
  `number_of_transaction` decimal(10,2) DEFAULT NULL,
  `number_of_balance_items` int(11) DEFAULT NULL,
  `turnover` decimal(15,2) DEFAULT NULL,
  `number_of_employees` int(11) DEFAULT NULL,
  `vat_reconciliation` enum('0','1') DEFAULT '1' COMMENT '0: No, 1: Yes',
  `bookkeeping` enum('0','1') DEFAULT '1' COMMENT '0: No, 1: Yes',
  `processing_type` enum('0','1','2') DEFAULT '1' COMMENT '1: Manual, 2: Software',
  `invoiced` enum('0','1') DEFAULT '1' COMMENT '0: No, 1: Yes',
  `currency` int(11) DEFAULT '0',
  `invoice_value` decimal(15,2) DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `invoice_hours` varchar(100) DEFAULT NULL,
  `invoice_remark` text,
  `status_type` int(11) DEFAULT NULL,
  `total_hours` varchar(100) DEFAULT NULL,
  `total_hours_status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `notes` longtext,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `job_id` (`job_id`),
  KEY `account_manager_id` (`account_manager_id`),
  KEY `reviewer` (`reviewer`),
  KEY `allocated_to` (`allocated_to`),
  KEY `customer_id` (`customer_id`),
  KEY `client_id` (`client_id`),
  KEY `customer_contact_details_id` (`customer_contact_details_id`),
  KEY `service_id` (`service_id`),
  KEY `job_type_id` (`job_type_id`),
  KEY `currency` (`currency`)
) ENGINE=MyISAM AUTO_INCREMENT=86 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `staff_created_id`, `job_id`, `account_manager_id`, `customer_id`, `client_id`, `client_job_code`, `customer_contact_details_id`, `service_id`, `job_type_id`, `budgeted_hours`, `reviewer`, `allocated_to`, `allocated_on`, `date_received_on`, `year_end`, `total_preparation_time`, `review_time`, `feedback_incorporation_time`, `total_time`, `engagement_model`, `expected_delivery_date`, `due_on`, `submission_deadline`, `customer_deadline_date`, `sla_deadline_date`, `internal_deadline_date`, `filing_Companies_required`, `filing_Companies_date`, `filing_hmrc_required`, `filing_hmrc_date`, `opening_balance_required`, `opening_balance_date`, `number_of_transaction`, `number_of_balance_items`, `turnover`, `number_of_employees`, `vat_reconciliation`, `bookkeeping`, `processing_type`, `invoiced`, `currency`, `invoice_value`, `invoice_date`, `invoice_hours`, `invoice_remark`, `status_type`, `total_hours`, `total_hours_status`, `notes`, `created_at`, `updated_at`) VALUES
(2, 2, '00002', 7, 1, 2, '', 1, 3, 5, '00:00:00', 0, 0, '2024-09-24', '2024-09-24', '', '00:00:00', '00:00:00', '00:00:00', '20:30:00', '', NULL, '2024-11-03', NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00:00', '', 1, NULL, '1', NULL, '2024-09-24 11:21:06', '2024-11-14 12:19:21'),
(3, 2, '00003', 7, 1, 2, '', 1, 3, 1, '00:00:00', 0, 0, '2024-09-24', '2024-09-24', '', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '', NULL, '2024-12-02', NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00:00', '', 1, NULL, '1', NULL, '2024-09-24 11:21:40', '2024-11-04 09:37:55'),
(4, 2, '00004', 7, 1, 2, '', 1, 3, 5, '00:00', 9, 0, '2024-09-24', '2024-09-24', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 5, NULL, '1', NULL, '2024-09-24 11:22:07', '2024-12-17 11:44:16'),
(5, 2, '00005', 7, 1, 1, '', 1, 3, 1, '11:22', 12, 4, '2024-09-24', '2024-09-24', '', '00:00', '00:00', '00:00', '00:00', 'percentage_model', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 2, NULL, '1', NULL, '2024-09-02 11:22:29', '2024-11-25 07:00:30'),
(6, 2, '00006', 7, 1, 1, '', 1, 3, 1, '00:00', 14, 6, '2024-09-27', '2024-09-26', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 6, NULL, '1', NULL, '2024-09-26 04:55:17', '2024-11-14 06:07:32'),
(10, 11, '00007', 5, 2, 8, '', 2, 2, 2, '00:00:00', 9, 0, '2024-10-09', '2024-10-09', '', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00:00', '', 5, NULL, '1', NULL, '2024-10-09 10:23:55', '2024-10-11 10:32:36'),
(11, 2, '00008', 5, 16, 12, '', 21, 1, 3, '99:58:00', 0, 0, '2024-10-15', '2024-10-15', '', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00:00', '', 1, NULL, '1', NULL, '2024-10-15 11:28:19', '2024-10-15 11:28:19'),
(12, 2, '00009', 5, 16, 12, '', 21, 1, 3, '00:00:00', 0, 0, '2024-10-15', '2024-10-15', '', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00:00', '', 1, NULL, '1', NULL, '2024-10-15 11:29:28', '2024-10-15 11:29:28'),
(13, 2, '000010', 5, 16, 12, '', 21, 1, 3, '57:21:00', 0, 0, '2024-10-15', '2024-10-15', '', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00:00', '', 1, NULL, '1', NULL, '2024-10-15 11:29:43', '2024-10-15 11:29:43'),
(14, 2, '000011', 5, 16, 12, '', 21, 1, 3, '57:21:00', 0, 0, '2024-10-15', '2024-10-15', '', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00:00', '', 1, NULL, '1', NULL, '2024-10-15 11:38:52', '2024-10-15 11:38:52'),
(15, 2, '000012', 5, 16, 12, '', 21, 1, 3, '57:21:00', 0, 0, '2024-10-15', '2024-10-15', '', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00:00', '', 1, NULL, '1', NULL, '2024-10-15 11:40:06', '2024-10-15 11:40:06'),
(16, 2, '000013', 5, 16, 12, '', 21, 1, 3, '98:58:00', 0, 0, '2024-10-15', '2024-10-15', '', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00:00', '', 1, NULL, '1', NULL, '2024-10-15 11:41:59', '2024-10-15 11:41:59'),
(17, 2, '000014', 5, 16, 12, '', 21, 1, 3, '98:58:00', 0, 0, '2024-10-15', '2024-10-15', '', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00:00', '', 1, NULL, '1', NULL, '2024-10-15 11:46:40', '2024-10-15 11:46:40'),
(18, 2, '000015', 5, 16, 12, '', 21, 1, 3, '98:58:00', 0, 0, '2024-10-15', '2024-10-15', '', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00:00', '', 1, NULL, '1', NULL, '2024-10-15 11:48:39', '2024-10-15 11:48:39'),
(19, 2, '000016', 5, 16, 12, '', 21, 1, 3, '56:06:00', 0, 0, '2024-10-15', '2024-10-15', '', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00:00', '', 1, NULL, '1', NULL, '2024-10-15 11:53:49', '2024-11-15 05:23:27'),
(20, 2, '000017', 5, 16, 12, '', 21, 1, 3, '79:43:00', 0, 0, '2024-10-15', '2024-10-15', '', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00:00', '', 1, NULL, '1', NULL, '2024-10-15 11:04:57', '2024-10-15 11:04:57'),
(21, 2, '000018', 5, 16, 12, '', 21, 1, 3, '22:22:00', 0, 0, '2024-10-15', '2024-10-15', '', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00:00', '', 1, NULL, '1', NULL, '2024-10-15 11:05:56', '2024-10-15 11:05:56'),
(22, 2, '000019', 5, 16, 12, '', 21, 1, 3, '02:02:00', 0, 0, '2024-10-15', '2024-10-15', '', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00:00', '', 1, NULL, '1', NULL, '2024-10-15 11:08:39', '2024-10-15 11:08:39'),
(23, 2, '000020', 5, 16, 12, '', 21, 1, 3, '55:55:00', 0, 0, '2024-10-15', '2024-10-15', '', '00:00:00', '00:00:00', '00:00:00', '00:00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00:00', '', 1, NULL, '1', NULL, '2024-10-15 11:09:19', '2024-10-15 11:09:19'),
(24, 2, '000021', 5, 2, 8, '', 2, 3, 1, '00:00', 9, 0, '2024-10-24', '2024-10-24', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 5, NULL, '1', NULL, '2024-10-24 06:41:22', '2024-12-17 11:44:36'),
(25, 2, '000022', 7, 21, 15, '', 27, 3, 1, '47:45', 0, 0, '2024-10-24', '2024-10-24', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 1, NULL, '1', NULL, '2024-10-24 07:19:17', '2024-10-24 07:19:17'),
(26, 2, '000023', 7, 21, 15, '', 27, 1, 3, '00:00', 0, 0, '2024-11-04', '2024-11-04', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 1, NULL, '1', NULL, '2024-11-04 06:08:43', '2024-11-15 05:21:50'),
(27, 2, '000024', 10, 22, 17, '', 28, 3, 1, '47:45', 9, 0, '2024-11-15', '2024-11-15', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 5, NULL, '1', NULL, '2024-11-15 05:43:54', '2024-12-17 11:46:34'),
(28, 2, '000025', 7, 13, 10, '', 18, 1, 3, '55:55', 9, 6, '2024-11-19', '2024-11-19', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 5, NULL, '1', NULL, '2024-11-19 12:13:23', '2024-12-17 11:45:14'),
(29, 2, '000026', 7, 1, 1, '', 1, 3, 5, '00:00', 0, 0, '2024-11-23', '2024-11-23', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, NULL, NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 1, NULL, '1', NULL, '2024-11-23 05:45:05', '2024-11-23 05:45:05'),
(30, 2, '000027', 7, 1, 1, '', 1, 2, 2, '00:00', 9, 0, '2024-11-23', '2024-11-23', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-11-23', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 12, NULL, '1', NULL, '2024-11-23 05:49:42', '2024-12-17 11:43:24'),
(31, 2, '000028', 11, 28, 24, '', 35, 5, 9, '00:00', 0, 0, '2024-11-23', '2024-11-23', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-11-23', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 6, NULL, '1', NULL, '2024-11-23 10:49:26', '2024-11-23 10:50:25'),
(32, 2, '000029', 11, 28, 24, '', 35, 5, 9, '00:00', 9, 0, '2024-11-23', '2024-11-23', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-11-23', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 5, NULL, '1', NULL, '2024-11-23 10:52:20', '2024-12-17 11:47:06'),
(33, 2, '000030', 7, 1, 20, '', 1, 3, 5, '00:00', 12, 0, '2024-11-23', '2024-11-23', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-11-23', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 5, NULL, '1', NULL, '2024-11-23 11:04:35', '2024-11-23 11:05:05'),
(34, 2, '000031', 11, 29, 27, '', 36, 5, 9, '00:00', 9, 0, '2024-11-23', '2024-11-23', '', '00:00', '00:00', '00:00', '00:00', 'percentage_model', NULL, NULL, NULL, NULL, '2024-11-23', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 5, NULL, '1', NULL, '2024-11-23 11:16:37', '2024-12-17 11:47:23'),
(35, 2, '000032', 11, 30, 32, '', 37, 3, 1, '44:04', 9, 0, '2024-11-25', '2024-11-25', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-11-25', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 5, NULL, '1', NULL, '2024-11-25 12:47:38', '2024-12-17 11:47:39'),
(36, 10, '000033', 10, 31, 35, '', 38, 3, 5, '00:00', 9, 6, '2024-11-26', '2024-11-26', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-11-26', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 5, NULL, '1', NULL, '2024-11-26 05:50:21', '2024-11-26 06:52:16'),
(37, 5, '000034', 5, 32, 36, '', 39, 2, 2, '00:00', 13, 0, '2024-11-26', '2024-11-26', '', '00:00', '00:00', '00:00', '00:00', 'percentage_model', NULL, NULL, NULL, NULL, '2024-11-26', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 16, NULL, '1', NULL, '2024-11-26 07:05:44', '2024-11-27 12:52:03'),
(38, 5, '000035', 5, 32, 37, '', 39, 2, 2, '00:00', 9, 6, '2024-11-26', '2024-11-26', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-11-26', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 5, NULL, '1', NULL, '2024-11-26 07:10:33', '2024-12-17 11:48:00'),
(39, 10, '000036', 10, 33, 38, '', 40, 2, 2, '00:00', 9, 0, '2024-11-26', '2024-11-26', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2024-11-26', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, NULL, NULL, '00:00', NULL, 5, NULL, '1', NULL, '2024-11-26 07:21:04', '2024-11-27 12:42:50'),
(40, 13, '000037', 7, 34, 40, '', 41, 5, 9, '00:00', 0, 0, '2024-11-27', '2024-11-27', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-11-27', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 6, NULL, '1', NULL, '2024-11-27 05:42:53', '2024-11-27 10:06:15'),
(41, 2, '000038', 10, 35, 44, '', 42, 2, 2, '00:00', 13, 6, '2024-11-27', '2024-11-27', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-11-27', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 5, NULL, '1', NULL, '2024-11-27 09:49:01', '2024-11-27 09:54:31'),
(42, 2, '000039', 10, 35, 44, '', 42, 3, 5, '00:00', 0, 0, '2024-11-27', '2024-11-27', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-11-27', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 1, NULL, '1', NULL, '2024-11-27 09:50:38', '2024-11-27 09:50:38'),
(43, 13, '000040', 10, 35, 44, '', 42, 3, 5, '00:00', 0, 0, '2024-11-27', '2024-11-27', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-11-27', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 15, NULL, '1', NULL, '2024-11-27 09:52:15', '2024-11-27 11:49:54'),
(44, 2, '000041', 10, 35, 44, '', 42, 3, 5, '00:00', 0, 0, '2024-11-27', '2024-11-27', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-11-27', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 16, NULL, '1', NULL, '2024-11-27 11:52:28', '2024-11-27 12:33:37'),
(45, 2, '000042', 5, 32, 36, '', 39, 2, 2, '00:00', 14, 0, '2024-11-27', '2024-11-27', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-11-27', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 5, NULL, '1', NULL, '2024-11-27 12:52:40', '2024-11-27 12:53:08'),
(49, 2, '000043', 5, 32, 36, '', 39, 2, 2, '00:00', 13, 6, '2024-11-27', '2024-11-27', '', '00:00', '00:00', '00:00', '00:00', 'adhoc_payg_hourly', NULL, NULL, NULL, NULL, '2024-11-27', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, NULL, NULL, '00:00', NULL, 12, NULL, '1', NULL, '2024-11-27 13:09:57', '2024-11-28 06:14:53'),
(51, 5, '000044', 5, 36, 49, '', 43, 3, 1, '00:00', 0, 0, '2024-11-28', '2024-11-28', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2024-11-28', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, NULL, NULL, '00:00', NULL, 1, NULL, '1', NULL, '2024-11-28 06:26:38', '2024-11-28 07:07:40'),
(52, 10, '000045', 5, 36, 49, '', 43, 3, 5, '00:00', 0, 0, '2024-11-28', '2024-11-28', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2024-11-28', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, NULL, NULL, '00:00', NULL, 1, NULL, '1', NULL, '2024-11-28 06:32:06', '2024-11-28 07:02:54'),
(53, 6, '000046', 5, 36, 50, '', 43, 3, 5, '00:00', 0, 0, '2024-11-28', '2024-11-28', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-11-28', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, NULL, NULL, '00:00', NULL, 1, NULL, '1', NULL, '2024-11-28 06:33:26', '2024-11-28 07:00:57'),
(54, 2, '000047', 5, 36, 49, '', 43, 3, 5, '00:00', 0, 0, '2024-11-28', '2024-11-28', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2024-11-28', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, NULL, NULL, '00:00', NULL, 1, NULL, '1', NULL, '2024-11-28 07:08:38', '2024-11-28 07:08:48'),
(55, 2, '000048', 5, 36, 49, '', 43, 3, 5, '00:00', 0, 0, '2024-11-28', '2024-11-28', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2024-11-28', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, NULL, NULL, '00:00', NULL, 1, NULL, '1', NULL, '2024-11-28 07:10:04', '2024-11-28 07:10:14'),
(56, 2, '000049', 5, 36, 49, '', 43, 3, 5, '00:00', 0, 0, '2024-11-28', '2024-11-28', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2024-11-28', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, NULL, NULL, '00:00', NULL, 1, NULL, '1', NULL, '2024-11-28 07:12:18', '2024-11-28 07:12:25'),
(57, 2, '000050', 5, 36, 49, '', 43, 3, 5, '00:00', 0, 0, '2024-11-28', '2024-11-28', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2024-11-28', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, NULL, NULL, '00:00', NULL, 1, NULL, '1', NULL, '2024-11-28 07:13:25', '2024-11-28 07:13:34'),
(58, 2, '000051', 5, 36, 49, '', 43, 3, 5, '00:00', 0, 0, '2024-11-28', '2024-11-28', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2024-11-28', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, NULL, NULL, '00:00', NULL, 1, NULL, '1', NULL, '2024-11-28 07:15:28', '2024-11-28 07:15:43'),
(59, 2, '000052', 5, 36, 49, '', 43, 3, 5, '00:00', 0, 0, '2024-11-28', '2024-11-28', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2024-11-28', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, NULL, NULL, '00:00', NULL, 1, NULL, '1', NULL, '2024-11-28 07:32:06', '2024-11-28 07:32:21'),
(60, 2, '000053', 5, 36, 49, '', 43, 3, 5, '00:00', 0, 0, '2024-11-28', '2024-11-28', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2024-11-28', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 1, NULL, '1', NULL, '2024-11-28 07:34:03', '2024-11-28 07:34:11'),
(61, 2, '000054', 5, 36, 49, 'DDDadadsfff', 43, 3, 5, '00:00', 12, 6, '2024-11-28', '2024-11-28', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-11-28', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 8, NULL, '1', NULL, '2024-11-28 08:17:33', '2024-11-28 08:48:01'),
(62, 2, '000055', 7, 37, 51, '', 44, 5, 9, '00:00', 0, 0, '2024-11-28', '2024-11-28', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-11-28', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 1, NULL, '1', NULL, '2024-11-28 10:23:58', '2024-11-28 10:23:58'),
(63, 2, '000056', 7, 37, 51, '', 44, 5, 9, '00:00', 0, 0, '2024-11-28', '2024-11-28', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-11-28', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 1, NULL, '1', NULL, '2024-11-28 10:52:54', '2024-11-28 10:52:54'),
(64, 2, '000057', 7, 37, 51, '', 44, 5, 9, '00:00', 0, 0, '2024-11-28', '2024-11-28', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-11-28', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 1, NULL, '1', NULL, '2024-11-28 11:39:49', '2024-11-28 11:39:49'),
(65, 2, '000058', 7, 37, 51, '', 44, 1, 3, '00:00', 0, 0, '2024-11-28', '2024-11-28', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-11-28', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 2, NULL, '1', NULL, '2024-11-28 11:51:37', '2024-11-29 10:41:40'),
(66, 22, '000059', 11, 53, 62, '', 58, 3, 5, '12:12', 9, 0, '2024-12-12', '2024-12-12', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-12-12', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 5, NULL, '1', NULL, '2024-12-12 05:45:24', '2024-12-25 08:46:54'),
(67, 10, '000060', 10, 55, 63, '', 60, 5, 9, '00:00', 12, 6, '2024-12-17', '2024-12-17', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-12-17', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 5, NULL, '1', NULL, '2024-12-17 05:44:14', '2024-12-17 11:40:25'),
(68, 2, '000061', 10, 57, 65, '', 62, 3, 5, '00:00', 0, 6, '2024-12-17', '2024-12-17', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-12-17', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 3, NULL, '1', NULL, '2024-12-17 10:49:06', '2024-12-17 10:49:06'),
(69, 2, '000062', 10, 57, 65, '', 62, 3, 1, '00:00', 0, 6, '2024-12-17', '2024-12-17', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-12-17', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 3, NULL, '1', NULL, '2024-12-17 10:49:19', '2024-12-17 10:49:19'),
(70, 2, '000063', 10, 57, 65, '', 62, 3, 5, '00:00', 9, 6, '2024-12-17', '2024-12-17', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-12-17', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 5, NULL, '1', NULL, '2024-12-17 10:49:33', '2024-12-17 11:39:54'),
(71, 2, '000064', 10, 52, 60, '', 57, 2, 2, '00:00', 12, 6, '2024-12-17', '2024-12-17', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-12-17', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 5, NULL, '1', NULL, '2024-12-17 10:52:16', '2024-12-17 11:40:44'),
(72, 2, '000065', 10, 50, 59, '', 55, 1, 3, '00:00', 12, 6, '2024-12-17', '2024-12-17', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-12-17', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 5, NULL, '1', NULL, '2024-12-17 10:52:48', '2024-12-17 11:41:08'),
(73, 2, '000066', 7, 23, 18, '', 30, 1, 3, '00:00', 9, 0, '2024-12-17', '2024-12-17', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-12-17', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 5, NULL, '1', NULL, '2024-12-17 11:45:50', '2024-12-17 11:45:50'),
(74, 10, '000067', 10, 58, 66, '', 63, 3, 5, '24:24', 0, 0, '2024-12-18', '2024-12-18', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-12-18', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 1, NULL, '1', NULL, '2024-12-18 05:21:45', '2024-12-18 05:21:45'),
(75, 7, '000068', 10, 58, 66, '', 63, 3, 1, '00:00', 0, 0, '2024-12-18', '2024-12-18', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-12-18', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 1, NULL, '1', NULL, '2024-12-18 05:22:46', '2024-12-18 05:22:46'),
(76, 2, '000069', 5, 56, 64, '', 61, 5, 9, '00:00', 0, 0, '2024-12-25', '2024-12-25', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-12-25', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 1, NULL, '1', NULL, '2024-12-25 06:26:58', '2024-12-25 06:26:58'),
(77, 2, '000070', 10, 57, 68, '', 62, 3, 5, '00:00', 0, 0, '2024-12-25', '2024-12-25', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-12-25', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 1, NULL, '1', NULL, '2024-12-25 06:28:12', '2024-12-25 06:28:12'),
(78, 2, '000071', 10, 57, 68, '', 62, 3, 5, '00:00', 0, 0, '2024-12-25', '2024-12-25', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-12-25', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 1, NULL, '1', NULL, '2024-12-25 07:24:39', '2024-12-25 07:24:39'),
(79, 2, '000072', 10, 62, 72, '', 67, 1, 3, '00:00', 0, 0, '2024-12-26', '2024-12-26', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-12-26', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 2, NULL, '1', NULL, '2024-12-26 06:47:39', '2024-12-26 06:55:05'),
(80, 2, '000073', 11, 67, 75, '', 73, 1, 3, '00:00', 0, 0, '2024-12-26', '2024-12-26', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-12-26', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 1, NULL, '1', 'fgtggggg', '2024-12-26 11:22:48', '2024-12-26 11:22:48'),
(81, 2, '000074', 11, 67, 75, '', 73, 1, 3, '00:00', 0, 0, '2024-12-26', '2024-12-26', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-12-26', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 1, NULL, '1', 'ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd', '2024-12-26 11:23:17', '2024-12-26 11:35:50'),
(83, 23, '000076', 8, 68, 76, '', 74, 2, 2, '44:44', 0, 0, '2024-12-26', '2024-12-26', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-12-26', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 4, NULL, '1', 'linguistics, political science, etc. While writing a paper of 2000 to 2100 words, you will need to demonstrate an in-depth knowledge of the topic and the ability to structure your thoughts well.', '2024-12-26 12:29:11', '2024-12-27 12:16:21'),
(84, 2, '000077', 22, 71, 77, '', 77, 1, 3, '00:00', 0, 0, '2025-01-03', '2025-01-03', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2025-01-03', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 2, NULL, '1', '', '2025-01-03 09:56:16', '2025-01-04 05:22:23'),
(82, 2, '000075', 11, 67, 75, '', 73, 1, 3, '00:00', 0, 0, '2024-12-26', '2024-12-26', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2024-12-26', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 1, NULL, '1', '', '2024-12-26 11:23:30', '2024-12-26 11:23:30'),
(85, 2, '000078', 22, 71, 77, '', 77, 1, 3, '11:22', 0, 0, '2025-01-16', '2025-01-16', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2025-01-16', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 1, NULL, '1', '', '2025-01-16 13:16:41', '2025-01-16 13:16:41');

-- --------------------------------------------------------

--
-- Table structure for table `job_documents`
--

DROP TABLE IF EXISTS `job_documents`;
CREATE TABLE IF NOT EXISTS `job_documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_type` text NOT NULL,
  `file_size` int(11) NOT NULL,
  `web_url` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `job_id` (`job_id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `job_documents`
--

INSERT INTO `job_documents` (`id`, `job_id`, `file_name`, `original_name`, `file_type`, `file_size`, `web_url`, `created_at`, `updated_at`) VALUES
(4, 84, '1721716908342-001.png', '001.png', 'image/png', 112121, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST71_CLIENT77_JOB84/001.png', '2025-01-04 11:38:27', '2025-01-04 11:38:27'),
(5, 84, '1729316168785-Activity.PNG', 'Activity.PNG', 'image/png', 54446, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST71_CLIENT77_JOB84/Activity.PNG', '2025-01-04 11:38:27', '2025-01-04 11:38:27'),
(6, 84, '1721719818558-002.png', '002.png', 'image/png', 436901, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST71_CLIENT77_JOB84/002.png', '2025-01-04 11:40:28', '2025-01-04 11:40:28'),
(7, 84, '1735643710445-dummy (1).pdf', 'dummy (1).pdf', 'application/pdf', 13264, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST71_CLIENT77_JOB84/dummy%20(1).pdf', '2025-01-04 12:02:34', '2025-01-04 12:02:34');

-- --------------------------------------------------------

--
-- Table structure for table `job_types`
--

DROP TABLE IF EXISTS `job_types`;
CREATE TABLE IF NOT EXISTS `job_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `service_id` int(11) NOT NULL,
  `type` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `service_id` (`service_id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `job_types`
--

INSERT INTO `job_types` (`id`, `service_id`, `type`, `status`, `created_at`, `updated_at`) VALUES
(1, 3, 'VAT1', '1', '2024-08-30 09:46:30', '2024-08-30 09:46:30'),
(2, 2, 'VAT2', '1', '2024-08-30 09:46:46', '2024-08-30 09:46:46'),
(3, 1, 'VAT3', '1', '2024-08-30 09:47:05', '2024-08-30 09:47:05'),
(5, 3, 'Vat5', '1', '2024-08-30 12:55:25', '2024-08-30 12:55:25'),
(9, 5, 'as', '1', '2024-11-23 10:23:42', '2024-11-23 10:23:42'),
(8, 6, 'A', '1', '2024-10-14 12:15:23', '2024-10-14 12:26:30'),
(10, 1, 'a', '1', '2025-01-08 07:27:40', '2025-01-08 07:27:40'),
(11, 2, 'a', '1', '2025-01-08 07:27:54', '2025-01-08 07:27:54');

-- --------------------------------------------------------

--
-- Table structure for table `master_status`
--

DROP TABLE IF EXISTS `master_status`;
CREATE TABLE IF NOT EXISTS `master_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `status_type_id` int(11) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `status_type_id` (`status_type_id`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `master_status`
--

INSERT INTO `master_status` (`id`, `name`, `status_type_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'To Be Started - Not Yet Allocated Internally', 1, '1', '2024-08-27 11:42:24', '2024-09-10 11:26:30'),
(2, 'WIP – Missing Paperwork', 1, '1', '2024-08-27 11:53:06', '2024-09-10 11:26:08'),
(3, 'WIP – Processing', 1, '1', '2024-08-27 11:53:06', '2024-09-10 11:26:11'),
(4, 'WIP – In Queries', 1, '1', '2024-08-27 11:53:06', '2024-11-11 12:45:02'),
(5, 'WIP – To Be Reviewed', 1, '1', '2024-08-27 11:53:06', '2024-09-10 11:26:15'),
(6, 'Complete', 2, '1', '2024-09-24 13:07:54', '2024-11-11 12:44:38'),
(7, 'No Longer Active', 3, '1', '2024-11-10 22:47:22', '2024-11-10 22:47:22'),
(8, 'Duplicate', 3, '1', '2024-11-10 22:48:56', '2024-11-10 22:48:56'),
(9, 'Awaiting Paperwork/Accounts/VAT', 7, '1', '2024-11-10 22:49:22', '2024-11-10 22:49:22'),
(10, 'Client Not Responding', 7, '1', '2024-11-10 22:49:41', '2024-11-10 22:49:41'),
(11, 'Waiting for Credentials', 7, '1', '2024-11-10 22:49:57', '2024-11-10 22:49:57'),
(12, 'Bookkeeping Not Completed', 7, '1', '2024-11-10 22:50:12', '2024-11-10 22:50:12'),
(13, 'To Be Reviewed', 1, '1', '2024-11-10 22:51:55', '2024-11-10 22:51:55'),
(14, 'Customer Reviewed & To be Updated', 1, '1', '2024-11-10 22:52:10', '2024-11-10 22:52:10'),
(15, 'Customer Processing', 1, '1', '2024-11-10 22:52:24', '2024-11-10 22:52:24'),
(16, 'Draft Sent', 2, '1', '2024-11-10 22:52:52', '2024-11-10 22:52:52'),
(17, 'Update Sent', 2, '1', '2024-11-10 22:53:06', '2024-11-10 22:53:06'),
(18, 'Filed with Companies House and HMRC', 2, '1', '2024-11-10 22:53:20', '2024-11-10 22:53:20'),
(19, 'Filed with Companies House', 2, '1', '2024-11-10 22:53:35', '2024-11-10 22:53:35'),
(20, 'Filed with HMRC', 2, '1', '2024-11-10 22:53:48', '2024-11-10 22:53:48');

-- --------------------------------------------------------

--
-- Table structure for table `missing_logs`
--

DROP TABLE IF EXISTS `missing_logs`;
CREATE TABLE IF NOT EXISTS `missing_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` int(11) NOT NULL,
  `missing_log` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: Yes',
  `missing_paperwork` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: Yes',
  `missing_log_sent_on` date DEFAULT NULL,
  `missing_log_prepared_date` date DEFAULT NULL,
  `missing_log_title` varchar(100) DEFAULT NULL,
  `missing_log_reviewed_by` int(11) DEFAULT NULL,
  `missing_log_reviewed_date` date DEFAULT NULL,
  `missing_paperwork_received_on` date DEFAULT NULL,
  `last_chaser` date DEFAULT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: Incomplete, 1: Complete',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `job_id` (`job_id`),
  KEY `missing_log_reviewed_by` (`missing_log_reviewed_by`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `missing_logs`
--

INSERT INTO `missing_logs` (`id`, `job_id`, `missing_log`, `missing_paperwork`, `missing_log_sent_on`, `missing_log_prepared_date`, `missing_log_title`, `missing_log_reviewed_by`, `missing_log_reviewed_date`, `missing_paperwork_received_on`, `last_chaser`, `status`, `created_at`, `updated_at`) VALUES
(1, 5, '0', '0', '2024-10-01', NULL, 'M_00001', 2, NULL, NULL, NULL, '1', '2024-10-01 07:19:00', '2024-10-01 07:20:47'),
(2, 5, '0', '0', '2024-10-01', NULL, 'M_00002', 2, NULL, NULL, NULL, '1', '2024-10-01 07:20:40', '2024-10-01 07:21:33'),
(5, 5, '0', '0', '2024-11-12', NULL, 'M_00003', 2, NULL, NULL, NULL, '1', '2024-11-12 11:51:23', '2024-11-14 08:43:27'),
(6, 32, '0', '0', '2024-11-23', NULL, 'M_00001', 2, NULL, NULL, NULL, '0', '2024-11-23 10:52:36', '2024-11-23 10:52:36'),
(7, 5, '0', '0', '2024-11-25', NULL, 'M_00004', 12, NULL, NULL, NULL, '0', '2024-11-25 06:36:36', '2024-11-25 06:36:36'),
(8, 5, '0', '0', '2024-11-25', '2024-11-19', 'M_00005', 12, NULL, NULL, NULL, '1', '2024-11-25 06:54:17', '2024-11-25 06:54:44'),
(9, 5, '0', '0', '2024-11-25', NULL, 'M_00006', 12, NULL, NULL, NULL, '1', '2024-11-25 06:54:54', '2024-11-25 06:54:54'),
(10, 5, '0', '0', '2024-11-25', NULL, 'M_00007', 2, NULL, NULL, NULL, '0', '2024-11-25 10:29:46', '2024-11-25 10:29:46'),
(11, 40, '0', '0', '2024-11-27', NULL, 'M_00001', 2, NULL, NULL, NULL, '1', '2024-11-27 10:03:08', '2024-11-27 10:03:36'),
(12, 65, '0', '0', '2024-11-29', NULL, 'M_00001', 2, NULL, NULL, NULL, '0', '2024-11-29 10:41:40', '2024-11-29 10:41:40'),
(13, 79, '0', '0', '2024-12-26', NULL, 'M_00001', 2, NULL, NULL, NULL, '0', '2024-12-26 06:55:05', '2024-12-26 06:55:05'),
(14, 79, '0', '0', '2024-12-26', NULL, 'M_00002', 2, NULL, NULL, '2024-12-27', '0', '2024-12-26 07:06:12', '2024-12-26 07:17:44'),
(15, 84, '0', '0', '2025-01-04', NULL, 'M_00001', 2, '2025-01-04', NULL, '2025-01-04', '0', '2025-01-04 05:22:23', '2025-01-04 05:27:32'),
(16, 84, '0', '0', '2025-01-04', NULL, 'M_00002', 2, '2025-01-04', NULL, '2025-01-04', '0', '2025-01-04 05:27:10', '2025-01-04 05:27:10');

-- --------------------------------------------------------

--
-- Table structure for table `missing_logs_documents`
--

DROP TABLE IF EXISTS `missing_logs_documents`;
CREATE TABLE IF NOT EXISTS `missing_logs_documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `missing_log_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `file_size` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `missing_log_id` (`missing_log_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE IF NOT EXISTS `permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `permission_name` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=285 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `permission_name`, `type`, `created_at`, `updated_at`) VALUES
(1, 'customer', 'insert', '2024-07-09 06:59:27', '2024-07-09 06:59:27'),
(2, 'customer', 'update', '2024-07-09 06:59:27', '2024-07-09 06:59:27'),
(3, 'customer', 'delete', '2024-07-09 06:59:27', '2024-07-09 06:59:27'),
(4, 'customer', 'view', '2024-07-09 06:59:27', '2024-07-09 06:59:27'),
(5, 'status', 'insert', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(6, 'status', 'update', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(7, 'status', 'delete', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(8, 'status', 'view', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(9, 'staff', 'insert', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(10, 'staff', 'update', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(11, 'staff', 'delete', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(12, 'staff', 'view', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(13, 'client', 'insert', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(14, 'client', 'update', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(15, 'client', 'delete', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(16, 'client', 'view', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(17, 'job', 'insert', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(18, 'job', 'update', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(19, 'job', 'delete', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(20, 'job', 'view', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(21, 'setting', 'insert', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(22, 'setting', 'update', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(23, 'setting', 'delete', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(24, 'setting', 'view', '2024-07-09 01:29:27', '2024-07-09 01:29:27'),
(25, 'report', 'insert', '2024-07-09 01:29:27', '2024-09-12 12:03:35'),
(26, 'report', 'update', '2024-07-09 01:29:27', '2024-09-12 12:03:46'),
(27, 'report', 'delete', '2024-07-09 01:29:27', '2024-09-12 12:03:52'),
(28, 'report', 'view', '2024-07-09 01:29:27', '2024-09-12 12:03:58'),
(29, 'timesheet', 'insert', '2024-07-09 01:29:27', '2024-09-24 07:03:59'),
(30, 'timesheet', 'update', '2024-07-09 01:29:27', '2024-09-24 07:05:21'),
(31, 'timesheet', 'delete', '2024-07-09 01:29:27', '2024-09-24 07:05:28'),
(32, 'timesheet', 'view', '2024-07-09 01:29:27', '2024-09-24 07:05:32');

-- --------------------------------------------------------

--
-- Table structure for table `queries`
--

DROP TABLE IF EXISTS `queries`;
CREATE TABLE IF NOT EXISTS `queries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id` int(11) NOT NULL,
  `queries_remaining` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: Yes',
  `query_title` varchar(100) DEFAULT NULL,
  `reviewed_by` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: Yes',
  `missing_queries_prepared_date` date DEFAULT NULL,
  `query_sent_date` date DEFAULT NULL,
  `response_received` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: Yes',
  `response` varchar(255) DEFAULT NULL,
  `final_query_response_received_date` date DEFAULT NULL,
  `last_chaser` date DEFAULT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: Incomplete, 1: Complete',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `job_id` (`job_id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `queries`
--

INSERT INTO `queries` (`id`, `job_id`, `queries_remaining`, `query_title`, `reviewed_by`, `missing_queries_prepared_date`, `query_sent_date`, `response_received`, `response`, `final_query_response_received_date`, `last_chaser`, `status`, `created_at`, `updated_at`) VALUES
(1, 6, '0', 'Q_00001', '0', NULL, '2024-10-21', '0', NULL, NULL, NULL, '1', '2024-10-21 09:32:45', '2024-11-14 06:06:20'),
(2, 31, '0', 'Q_00001', '0', NULL, '2024-11-23', '0', NULL, NULL, NULL, '1', '2024-11-23 10:49:41', '2024-11-23 10:50:17'),
(3, 5, '0', 'Q_00001', '0', NULL, '2024-11-25', '0', NULL, NULL, NULL, '1', '2024-11-25 06:37:32', '2024-11-25 06:41:59'),
(4, 5, '0', 'Q_00002', '0', NULL, '2024-11-25', '0', NULL, NULL, NULL, '1', '2024-11-25 06:41:03', '2024-11-25 06:41:17'),
(5, 5, '0', 'Q_00003', '0', NULL, '2024-11-25', '0', NULL, NULL, NULL, '1', '2024-11-25 06:41:47', '2024-11-25 06:41:47'),
(6, 5, '0', 'Q_00004', '0', NULL, '2024-11-25', '1', NULL, '2024-11-20', NULL, '1', '2024-11-25 06:43:34', '2024-11-25 06:44:49'),
(7, 5, '0', 'Q_00005', '0', NULL, '2024-11-25', '0', NULL, NULL, NULL, '1', '2024-11-25 06:45:35', '2024-11-25 06:45:39'),
(8, 40, '0', 'Q_00001', '0', NULL, '2024-11-27', '0', NULL, NULL, NULL, '1', '2024-11-27 10:01:00', '2024-11-27 10:03:49'),
(9, 40, '0', 'Q_00002', '0', NULL, '2024-11-27', '0', NULL, NULL, NULL, '1', '2024-11-27 10:02:30', '2024-11-27 10:03:43'),
(10, 40, '0', 'Q_00003', '0', NULL, '2024-11-27', '0', NULL, NULL, NULL, '1', '2024-11-27 10:05:53', '2024-11-27 10:06:08'),
(11, 83, '0', 'Q_00001', '0', NULL, '2024-12-27', '0', NULL, NULL, '2024-12-29', '0', '2024-12-27 12:05:17', '2024-12-27 12:06:43');

-- --------------------------------------------------------

--
-- Table structure for table `queries_documents`
--

DROP TABLE IF EXISTS `queries_documents`;
CREATE TABLE IF NOT EXISTS `queries_documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `query_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `file_size` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `query_id` (`query_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(100) NOT NULL,
  `role` varchar(100) NOT NULL,
  `hourminute` varchar(100) DEFAULT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `role`, `hourminute`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'SUPERADMIN', NULL, '1', '2024-06-28 11:59:13', '2024-06-28 11:59:13'),
(2, 'Admin', 'ADMIN', '125:59', '1', '2024-06-28 11:59:22', '2024-10-19 12:27:52'),
(3, 'Processor', 'PROCESSOR', '232:59', '1', '2024-06-28 12:05:34', '2024-10-19 12:27:25'),
(4, 'Manager', 'MANAGER', '2:5', '1', '2024-09-07 09:17:08', '2024-11-26 09:08:09'),
(5, 'Leadership', 'LEADERSHIP', NULL, '1', '2024-09-07 09:17:08', '2024-09-07 09:17:08'),
(6, 'Reviewer', 'REVIEWER', NULL, '1', '2024-09-07 09:17:38', '2024-09-07 09:17:38'),
(8, 'Management', 'MANAGEMENT', NULL, '1', '2024-10-14 09:00:37', '2024-10-14 09:00:37');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `role_id` (`role_id`,`permission_id`),
  KEY `permission_id` (`permission_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`, `created_at`, `updated_at`) VALUES
(3, 4, '2024-11-19 08:29:27', '2024-11-19 08:29:27'),
(13, 24, '2024-07-30 06:31:43', '2024-07-30 08:37:46'),
(13, 12, '2024-07-26 05:10:20', '2024-07-30 08:37:46'),
(13, 4, '2024-07-12 10:37:55', '2024-07-30 08:37:46'),
(4, 4, '2024-09-12 12:13:22', '2024-10-18 09:30:14'),
(6, 4, '2024-09-12 09:39:12', '2024-11-06 12:48:17'),
(3, 20, '2024-09-07 06:06:08', '2024-11-19 06:24:35'),
(3, 16, '2024-09-07 06:06:08', '2024-11-19 06:24:35'),
(3, 25, '2024-09-24 08:27:25', '2024-11-19 06:24:35'),
(3, 29, '2024-09-24 08:27:25', '2024-11-19 06:24:35'),
(3, 31, '2024-09-24 08:27:25', '2024-11-19 06:24:35'),
(3, 30, '2024-09-24 08:27:25', '2024-11-19 06:24:35'),
(3, 32, '2024-09-24 08:27:25', '2024-11-19 06:24:35'),
(4, 30, '2024-09-24 08:27:55', '2024-10-18 09:30:14'),
(4, 31, '2024-09-24 08:27:55', '2024-10-18 09:30:14'),
(6, 29, '2024-09-24 08:33:18', '2024-11-06 12:48:17'),
(6, 30, '2024-09-24 08:33:18', '2024-11-06 12:48:17'),
(6, 31, '2024-09-24 08:33:18', '2024-11-06 12:48:17'),
(6, 32, '2024-09-24 08:33:18', '2024-11-06 12:48:17'),
(4, 29, '2024-09-24 08:33:30', '2024-10-18 09:30:14'),
(4, 32, '2024-09-24 08:33:30', '2024-10-18 09:30:14'),
(4, 16, '2024-10-07 08:30:15', '2024-10-18 09:30:14'),
(8, 20, '2024-11-23 08:32:01', '2024-11-23 08:32:01'),
(6, 28, '2024-11-06 12:48:17', '2024-11-06 12:48:17'),
(4, 20, '2024-10-09 10:22:48', '2024-10-18 09:30:14'),
(8, 31, '2024-10-14 09:00:37', '2024-10-14 09:02:43'),
(8, 30, '2024-10-14 09:00:37', '2024-10-14 09:02:43'),
(8, 29, '2024-10-14 09:00:37', '2024-10-14 09:02:43'),
(3, 1, '2024-10-14 08:53:05', '2024-11-19 06:24:35'),
(6, 20, '2024-10-11 10:33:46', '2024-11-06 12:48:17'),
(6, 16, '2024-10-11 10:33:46', '2024-11-06 12:48:17'),
(8, 32, '2024-10-14 09:00:37', '2024-10-14 09:02:43'),
(8, 4, '2024-10-14 09:02:43', '2024-10-14 09:02:43'),
(8, 1, '2024-10-14 09:02:43', '2024-10-14 09:02:43'),
(8, 18, '2024-11-23 08:32:01', '2024-11-23 08:32:01'),
(5, 4, '2024-11-19 06:57:58', '2024-11-19 06:57:58'),
(4, 1, '2024-11-19 06:58:59', '2024-11-19 06:58:59'),
(8, 5, '2024-11-19 07:03:58', '2024-11-19 07:03:58'),
(3, 5, '2024-11-19 08:30:49', '2024-11-19 08:30:49'),
(5, 16, '2024-11-19 08:47:31', '2024-11-19 08:47:31'),
(6, 22, '2024-11-25 12:00:46', '2024-11-25 12:00:46'),
(6, 13, '2024-12-25 05:38:01', '2024-12-25 05:38:01'),
(4, 13, '2024-11-23 10:17:45', '2024-11-23 10:17:45'),
(4, 28, '2024-11-23 11:18:11', '2024-11-23 11:18:11'),
(6, 21, '2024-11-25 12:00:46', '2024-11-25 12:00:46'),
(6, 23, '2024-11-25 12:00:46', '2024-11-25 12:00:46'),
(6, 24, '2024-11-25 12:00:46', '2024-11-25 12:00:46'),
(4, 17, '2024-11-26 05:47:11', '2024-11-26 05:47:11'),
(4, 18, '2024-11-26 05:47:11', '2024-11-26 05:47:11'),
(4, 19, '2024-11-26 05:47:11', '2024-11-26 05:47:11'),
(8, 2, '2024-11-26 07:18:22', '2024-11-26 07:18:22'),
(8, 3, '2024-11-26 07:18:22', '2024-11-26 07:18:22'),
(8, 13, '2024-11-26 07:18:22', '2024-11-26 07:18:22'),
(8, 14, '2024-11-26 07:18:22', '2024-11-26 07:18:22'),
(8, 15, '2024-11-26 07:18:22', '2024-11-26 07:18:22'),
(8, 16, '2024-11-26 07:18:22', '2024-11-26 07:18:22'),
(8, 17, '2024-11-26 07:18:22', '2024-11-26 07:18:22'),
(3, 17, '2024-11-26 08:46:00', '2024-11-26 08:46:00'),
(6, 17, '2024-11-26 08:46:00', '2024-11-26 08:46:00'),
(6, 18, '2024-11-26 08:46:00', '2024-11-26 08:46:00'),
(6, 1, '2024-11-27 05:41:29', '2024-11-27 05:41:29'),
(6, 2, '2024-11-27 05:41:29', '2024-11-27 05:41:29'),
(3, 13, '2024-11-27 09:53:42', '2024-11-27 09:53:42'),
(3, 2, '2024-11-28 06:30:30', '2024-11-28 06:30:30'),
(4, 14, '2024-12-18 05:23:30', '2024-12-18 05:23:30');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'YE Accounts/Stat Accounts	', '1', '2024-06-29 06:35:22', '2024-07-26 10:53:04'),
(2, 'Corporation Tax Return	', '1', '2024-06-29 06:35:26', '2024-07-26 10:53:18'),
(3, 'VAT Return	', '1', '2024-06-29 06:35:30', '2024-07-26 10:53:30'),
(5, 'Payroll', '1', '2024-07-04 11:29:45', '2024-11-23 10:23:20'),
(6, 'Onboarding/Setup	', '0', '2024-07-26 10:53:46', '2024-09-25 09:36:10');

-- --------------------------------------------------------

--
-- Table structure for table `sharepoint_token`
--

DROP TABLE IF EXISTS `sharepoint_token`;
CREATE TABLE IF NOT EXISTS `sharepoint_token` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `access_token` longtext,
  `refresh_token` longtext,
  `client_id` text,
  `client_secret` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sharepoint_token`
--

INSERT INTO `sharepoint_token` (`id`, `access_token`, `refresh_token`, `client_id`, `client_secret`, `created_at`, `updated_at`) VALUES
(1, 'eyJ0eXAiOiJKV1QiLCJub25jZSI6Ik5CZE5XNEV5TTZlcEI4YWxlVmR2eWFwU0RFNUt0a2tDTDlPSTQ1OG4tYUEiLCJhbGciOiJSUzI1NiIsIng1dCI6InoxcnNZSEhKOS04bWdndDRIc1p1OEJLa0JQdyIsImtpZCI6InoxcnNZSEhKOS04bWdndDRIc1p1OEJLa0JQdyJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8zMzJkY2Q4OS1jZDM3LTQwYTAtYmJhMi1hMmI5MWFiZDQzNGEvIiwiaWF0IjoxNzM1NzMxMTg3LCJuYmYiOjE3MzU3MzExODcsImV4cCI6MTczNTczNjI5MSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhZQUFBQVF5dVlLWmh2VlYzcVpDWFJhRHplQWZpQnMwcjRqcEhlT3lkU242enpXaUJROXhPMmhSd0QzbTdqNUprRTNFZ3QiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6Ik91dGJvb2tBcHAiLCJhcHBpZCI6IjkxODU4NTdmLTczNjUtNGQzNS1iMDBhLTVhMzFkY2RkNThkMiIsImFwcGlkYWNyIjoiMSIsImZhbWlseV9uYW1lIjoiQmhhZ2F0IiwiZ2l2ZW5fbmFtZSI6Ik5pa2l0YSIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjEwMy4xMDMuMjEzLjIxNyIsIm5hbWUiOiJOaWtpdGEgQmhhZ2F0Iiwib2lkIjoiNDI2MWM4MTMtMjViNC00ZjM1LWJmNmItNGE5NzVjZjBhMDU3IiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDA0MUFFRkI5QTQiLCJyaCI6IjEuQVhrQWljMHRNemZOb0VDN29xSzVHcjFEU2dNQUFBQUFBQUFBd0FBQUFBQUFBQUFNQVNSNUFBLiIsInNjcCI6Ik15RmlsZXMuUmVhZCBNeUZpbGVzLldyaXRlIFNpdGVzLlJlYWRXcml0ZS5BbGwgVXNlci5SZWFkIHByb2ZpbGUgb3BlbmlkIGVtYWlsIiwic2lkIjoiZTg3M2Y2OWYtYTE5NS00N2EwLTljYWUtYjc3MDc1MDQ5NzlhIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiLUFhU09zbnd2T0hmZkhzZmJjbmgwenBKNUtZckhxQ0RiaFluN0hMZmctayIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJFVSIsInRpZCI6IjMzMmRjZDg5LWNkMzctNDBhMC1iYmEyLWEyYjkxYWJkNDM0YSIsInVuaXF1ZV9uYW1lIjoiTmlraXRhLkJoYWdhdEBvdXRib29rcy5jb20iLCJ1cG4iOiJOaWtpdGEuQmhhZ2F0QG91dGJvb2tzLmNvbSIsInV0aSI6InplNFA3T3NYQkVhdzBsa1JOSGhQQVEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImNmMWMzOGU1LTM2MjEtNDAwNC1hN2NiLTg3OTYyNGRjZWQ3YyIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfaWRyZWwiOiIxIDE0IiwieG1zX3N0Ijp7InN1YiI6IjRidjJCemlEWUxUNThPVzV6UF91N2Zqc3RkLWFxVEYzamFuZHdDbF9WdkUifSwieG1zX3RjZHQiOjE2MDM0NTY2MDJ9.X8g-2_Kro89Ui4QJfI3cB_WTeRy3OBicxv6rzIqDyFe2f8oPQsrQv_oYBIvFmrGsnaqNBxMACE0oG2oY9WSShwCC3_b7uju_hjGQOXSifmShSWzAIRczdrrB57HXA6txxyCl9YGDoiwc7WVv1wckQ9cz5TupsISLHl83gPsAsg6SFGGJA6N6V5PNBHXVQCUKRFYS4hwUR0HyRDhSdVqYInAiML0QAcNw8kuZ0Tu0i8Jot3iPKMf-ablFuduBFvAurvCbl4ovj-qlE7Lvul6qtrB1xOBDfa6twjpKnFkBWEGnONMd39jqthCSzh-xzA1Qp8Sn5WCFtczuMyK1spUY6w', '1.AXkAic0tMzfNoEC7oqK5Gr1DSn-FhZFlczVNsApaMdzdWNIMASR5AA.AgABAwEAAADW6jl31mB3T7ugrWTT8pFeAwDs_wUA9P8j5F-GZwVFOh_by_NPXfxUEByMvJcplAKWNhsPQtT40epQO-lc2g1x_FflTMS94BxphBD7OSKaLes4Iyx5IjdwcpAxXB1ZZos6FvTEMe8zQ8rEVnwawlow-mIjikU01Dw7bfxMH2PdnoU-mgSszjmGfSCZfRhQpqEd0SqPznBomn7CEuHDGWqfzh-h3eqAy9mK-YtzjWSQoPceC3-ohC6gNctmAf-WxI0QyERB8xCi1oRd0U3u5by1UQtqWqo80L5T8t8iqOAhV8n6brsSmt-ZlB28bY-HQYeQ6R8G8K0US_3rWtKIBTF5ZDljnzsu_SYjb_zO9NNj8B9-L-aIRz4truIfgvhVVXParWf6MjICTJ2Tq8wKa5nZcgo6UFnS0J-u8ixeRZkjSo8Uz__Oh3pXfkeZvoRrlWITUuMkJDJt-wHvq_Y5Eq0GxMWEWBoQZDTRm5T2ZgXCSImwnePGmerSpLfODswuph2akuhs9ub7Va_feoDRZDahnmh6FCqOX98mjEBUC4k3yiZYI_ZbhZnURL_A7z_kPBcX02Hmr5-n5jVHhZHFJbFzW53DMZ3Fcxd6k8WCOKjWatwXwpeAFmpqnGBUedZL8W0D95Dny7z_qk94eemwpu_aZQl5sETFYpAJ1XU9c-HzEAzK02ppsoLBTHNV76PQ0H-Yhetvt2vF6mHcj6NpYaGM5BM3RTvq-SmXp7vdkb5Rps4Sj4jv9YdhI1Mg0odiz8pPuLbBAHyMppB4mznvsus', '9185857f-7365-4d35-b00a-5a31dcdd58d2', 'aCE8Q~nIMereO8MzR6cDsf4QUjJIGLhuBMlcPc-t', '2025-01-01 06:43:05', '2025-01-07 06:42:40');

-- --------------------------------------------------------

--
-- Table structure for table `staffs`
--

DROP TABLE IF EXISTS `staffs`;
CREATE TABLE IF NOT EXISTS `staffs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_code` varchar(10) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `hourminute` varchar(100) DEFAULT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `login_auth_token` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `staffs`
--

INSERT INTO `staffs` (`id`, `role_id`, `first_name`, `last_name`, `email`, `phone_code`, `phone`, `password`, `hourminute`, `status`, `created_by`, `created_at`, `updated_at`, `login_auth_token`) VALUES
(1, 1, 'System Super', 'Super Admin', 'superadmin@gmail.com', NULL, '1234567891', '$2a$10$j07X1j33uRnImSqWD108IO9w15nAsQxsb7bb5wQsugxrwZ62msJbS', '152:00', '1', 2, '2024-06-28 12:02:41', '2024-10-19 04:51:50', ''),
(2, 2, 'Amit', 'Amit', 'amit@outbooks.com', NULL, '5777777777', '$2a$10$SIJMFK5k/woLfwqfEJGMruiO6.f5oZwnCBb5S9zhmoPR/MiVI5c6K', '300:85', '1', 2, '2024-07-08 07:25:41', '2025-01-27 05:30:57', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTczNzk1NTg1NywiZXhwIjoxNzM3OTkxODU3fQ.8jnfnCjC3NYV3N4JMqXV37ZqpF1FcsCX-WoRCzCAG2s'),
(3, 2, 'Ajit', 'Ajit', 'ajit@outbooks.com', NULL, '5777777777', '$2a$10$UGh8LOFOP9Kwtha4kypOcuJL.YZYwwyRsSrzaYsRvMiBiwMomGvdW', '659:00', '1', 2, '2024-07-08 07:25:41', '2024-10-19 04:51:50', ''),
(8, 4, 'acoountman', 'acoountman', 'acoountman@gmail.com', NULL, '9999999999', '$2a$10$abrYqdRDzY07Yu8vORWA3eUvE3K9FnQKR.nqePvVfqN9k2TAvtKjK', NULL, '1', 2, '2024-07-26 08:46:29', '2024-10-19 04:51:50', ''),
(4, 3, 'staff', 'staff', 'staff@gmail.com', NULL, '1777777777', '$2a$10$FETqQjI42Df/K7GU.fum5erlyaa3LQnmQZ3CwLEQFp1CfurCVdAfi', '00:00', '1', 2, '2024-07-19 06:37:13', '2024-12-11 09:10:10', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTczMzkwODIxMCwiZXhwIjoxNzMzOTQ0MjEwfQ.iO1TEXpTDNAi4VX9Xz-VDZy7LyOrDYgorbY3_5pc2rc'),
(7, 4, 'acoount', 'acoount', 'acoount@gmail.com', NULL, '1777777777', '$2a$10$CoAMpwxr5Tx04j6.ywgdYu3ns1l3dpyU2UcXCvcxiEyE00EI4atRy', NULL, '1', 2, '2024-07-26 08:43:27', '2024-12-19 07:18:26', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTczNDU5MjcwNiwiZXhwIjoxNzM0NjI4NzA2fQ.JZSFMeZx06gICeRetBFAY9nVuC2sYgVnqe8Qq55e7DI'),
(5, 4, 'staff manager', 'staff manager', 'manager@gmail.com', NULL, '2777777777', '$2a$10$2q5nkq8dmkEcp9KKm3OD8uLx/eKTlNkVPghc.JrxnHuwZKlxx7A1e', '00:00', '1', 2, '2024-07-19 06:38:54', '2024-12-24 10:52:19', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTczNTAzNzUzOSwiZXhwIjoxNzM1MDczNTM5fQ.P-1UFo2bJjCPhZCYVsy7_2kHCiwVnh_okYSJ_0ar4fc'),
(6, 3, 'Nikita ', 'bhagat', 'nikitabhagat.wpress@gmail.com', NULL, '5777777777', '$2a$10$hZQV8T6L43QGp4UdLPSg6uIbRjn0EMmH.mNwhkXarfZZcuZiGQY6e', NULL, '1', 2, '2024-07-23 10:49:54', '2024-12-24 10:52:57', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTczNTAzNzU3NywiZXhwIjoxNzM1MDczNTc3fQ.DxczUpOFcO7F4TzFKPRhzQxO3PMLhvaJvOl_vCYkK1M'),
(9, 6, 'shk', 'hu', 'shk@gmail.com', NULL, '2777777777', '$2a$10$pQglX9nzdX2dvIfXMonuzehw80FpkoJAbebLlwXGFSkZS3wrX0Blm', NULL, '1', 2, '2024-08-12 10:16:58', '2024-12-25 08:47:27', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTczNTExNjQ0NywiZXhwIjoxNzM1MTUyNDQ3fQ.IE-SH30CFOPCC5rYiqmehinGLRdGmZ87518rdhsqjus'),
(10, 4, 'MAN1', 'HHH', 'manager123@gmail.com', NULL, '2777777777', '$2a$10$WPF17rTpySsZZGC0j5DkL.qugfrxlSQeS501lc2y1QdJG3yXpPk7u', '00:00', '1', 2, '2024-08-30 15:38:39', '2024-12-18 05:20:05', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJpYXQiOjE3MzQ0OTkyMDUsImV4cCI6MTczNDUzNTIwNX0.MAkDMR2W2u8ElgkHM8XWCdJgzrNXrYHWL9vx_Fpnip0'),
(11, 4, 'sss', 'sss', 'manager321@gmail.com', NULL, '2777777777', '$2a$10$fAHBQSPBkevIqYs56JHe6u406HYDg5.qR1Iyj9Y/3azC8p911zfBO', NULL, '1', 2, '2024-08-30 15:42:49', '2024-12-17 05:22:39', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExLCJpYXQiOjE3MzQ0MTI5NTksImV4cCI6MTczNDQ0ODk1OX0.gudiwYqEC-myB2f4tDMlnBRVdy1g8etjv2woteY3iwo'),
(12, 6, 'SSSSFGGG', 'DDFSFSF', 'd@gmail.com', NULL, '2777777777', '$2a$10$YLRIgHsYJitN0F.uj5TaMuKL/WHoodK.omh.OlfOYkCrEtd9rlyHm', NULL, '1', 2, '2024-09-24 12:27:05', '2024-12-17 11:29:25', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJpYXQiOjE3MzQ0MzQ5NjUsImV4cCI6MTczNDQ3MDk2NX0.T4J2E0ChZPzeS2AinKD7CnRcBxFJO_Bh7YUew7Lc_Kw'),
(13, 6, 'ADADADAD', 'WDFWFDWD', 'dddd@gmail.com', NULL, '1777777777', '$2a$10$IL1VLs6U4La8m4duHyskyOdhd3BajI.IiEEpPjN9DVBPTQg1fbOMa', '00:00', '0', 2, '2024-09-25 06:40:45', '2024-11-29 10:28:38', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEzLCJpYXQiOjE3MzI3MDQ3ODMsImV4cCI6MTczMjc0MDc4M30.mBP7xzXtG2Z8JwD7tKqZ7_8BqKWWkq_sricTH-l0mWg'),
(14, 6, 'dascfascsac', 'ascs', 'ddddd@outbooks.com', NULL, '2777777777', '$2a$10$6Aj2UC5FgZIS5Xz01HaV2.3wOpwIAVKZyQRX2lkyzvT0G71IVdtmu', NULL, '1', 2, '2024-09-25 06:44:20', '2024-10-19 04:51:50', ''),
(15, 8, 'mmm', 'hhh', 'm1@gmail.com', NULL, '2777777777', '$2a$10$S.FjUmFEDx9IXCSMFrUq/utYyaht64BhoyvdW/uOmiYXU5Zlif95y', '00:00', '0', 2, '2024-10-14 09:01:44', '2024-11-29 05:57:54', ''),
(16, 8, 'SA', 'ss', 'su@gmail.com', NULL, '2777777777', '$2a$10$ekMKJcAGvIiNIUrg0E3W5uZdoQsDrZUaZyw/p4XLb9/nS7WCJS3OK', NULL, '1', 2, '2024-10-15 08:48:32', '2024-10-19 04:51:50', ''),
(17, 8, 'am', 'ddddddd', 'am@gmail.com', NULL, '2777777777', '$2a$10$lHTJ1oq6ESX/pzbzZZtkCuq5AEco8HaPoEtx2ajUt96gq6GezvWPu', NULL, '1', 2, '2024-10-15 08:50:42', '2024-10-19 04:51:50', ''),
(18, 8, 'aj', 'ssss', 'shakirpnp@gmail.com', NULL, '2777777777', '$2a$10$lQDJwmTJHLByytnG0SaIcOskd3II2HWFL5nYzNK29G3JV3G6nUwmW', '252:22', '1', 2, '2024-10-15 08:51:45', '2024-11-26 04:49:42', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE4LCJpYXQiOjE3Mjk4NTk3NzEsImV4cCI6MTcyOTg5NTc3MX0.rR7-mr7eEFRiRbJmuCftHkYKCbMvroZ2u7vq43ZYIb8'),
(19, 8, 'MANAGE', 'MENT', 's@gmail.com', '+44', NULL, '$2a$10$UVUudz4lLxSF.uJcDGXaduY8EgyPLRMHqzO/lhZVl1BcNnju5P6Ua', '25:22', '1', 2, '2024-11-26 07:16:00', '2024-12-17 11:54:47', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE5LCJpYXQiOjE3MzQ0MzY0ODcsImV4cCI6MTczNDQ3MjQ4N30.ehUGsFTpn4mqar7hDD6Rf-CbnVEhWBnbN9ixA6aMj5E'),
(20, 3, 'SSS_FF', 'ss', 's1@gmail.com', '+44', '', '$2a$10$3JPRW9DUe1S23inz6dW8TuBnpTdMAxl6auGF/pFKZfc6QTx.B1NKa', '232:59', '1', 2, '2024-11-28 13:31:30', '2024-11-28 13:31:30', NULL),
(21, 3, 'New', 'Staff', 'sssssss@gmail.com', '+44', '', '$2a$10$lNvVe6vzqMr/eJfTbAFmZer81v9nQZHPUgxKbYkSNwcEnMBQWJGk.', '232:59', '1', 2, '2024-12-11 09:11:12', '2024-12-11 09:11:28', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIxLCJpYXQiOjE3MzM5MDgyODgsImV4cCI6MTczMzk0NDI4OH0.OeIPsdJWOaEfqMJU35Q7q3YxzA5-kk6gDD5JV4I91X4'),
(22, 4, 'DDDDD', 'ss', 'stry@gmail.com', '+44', '', '$2a$10$D1t7Ba6GCJCrQmECpOh/DeB//qiWFp/wPKqVXDkDASBw1Nlxqjw92', '2:5', '1', 2, '2024-12-12 05:05:08', '2024-12-27 09:24:38', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIyLCJpYXQiOjE3MzUyOTE0NzgsImV4cCI6MTczNTMyNzQ3OH0.H1fEYPKUKoGX3P58LCGUqOG7gZw9qvUYj3c4rEG8kas'),
(23, 8, 'SMN', 'sss', 'ssaadad@gmail.com', '+44', '', '$2a$10$sG1ulgYGXUmtaLfF/VhGSeMbGdig9NCEiH/oS2hv/0a1vczdd65jy', NULL, '1', 2, '2024-12-26 12:08:29', '2024-12-26 12:09:08', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIzLCJpYXQiOjE3MzUyMTQ5NDgsImV4cCI6MTczNTI1MDk0OH0.H79lEKAF3oo1dpU_jiUe7PNOx5YMPfTBaTy9YEkrQ2k');

-- --------------------------------------------------------

--
-- Table structure for table `staff_competencies`
--

DROP TABLE IF EXISTS `staff_competencies`;
CREATE TABLE IF NOT EXISTS `staff_competencies` (
  `staff_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `staff_id` (`staff_id`,`service_id`),
  KEY `service_id` (`service_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `staff_competencies`
--

INSERT INTO `staff_competencies` (`staff_id`, `service_id`, `created_at`, `updated_at`) VALUES
(2, 1, '2024-07-10 06:38:07', '2024-07-11 12:16:51'),
(3, 1, '2024-07-12 09:53:41', '2024-07-12 09:53:46'),
(2, 2, '2024-07-10 06:41:14', '2024-07-11 12:16:51'),
(2, 5, '2024-07-10 06:56:38', '2024-07-11 12:16:51');

-- --------------------------------------------------------

--
-- Table structure for table `staff_logs`
--

DROP TABLE IF EXISTS `staff_logs`;
CREATE TABLE IF NOT EXISTS `staff_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `staff_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `module_name` varchar(100) NOT NULL,
  `module_id` int(11) NOT NULL DEFAULT '0',
  `log_message` text NOT NULL,
  `log_message_all` text,
  `permission_type` varchar(50) NOT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `staff_id` (`staff_id`)
) ENGINE=MyISAM AUTO_INCREMENT=1196 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `staff_logs`
--

INSERT INTO `staff_logs` (`id`, `staff_id`, `date`, `module_name`, `module_id`, `log_message`, `log_message_all`, `permission_type`, `ip`, `created_at`, `updated_at`) VALUES
(1, 2, '2024-10-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-01 09:29:16', '2024-10-01 09:29:16'),
(2, 2, '2024-10-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-01 09:29:19', '2024-10-01 09:29:19'),
(3, 2, '2024-10-01', 'client', 1, 'edited sole trader Officer information. client code :', 'Admin Amit Amit edited sole trader Officer information. client code : cli_CUS_SFF_00001', 'updated', '122.168.114.106', '2024-10-01 10:30:01', '2024-10-01 10:30:01'),
(4, 2, '2024-10-01', 'client', 2, 'edited individual information. client code :', 'Admin Amit Amit edited individual information. client code : cli_CUS_ada_00002', 'updated', '122.168.114.106', '2024-10-01 10:30:48', '2024-10-01 10:30:48'),
(5, 2, '2024-10-01', 'client', 4, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_CUS_AGÈ_00004', 'created', '122.168.114.106', '2024-10-01 10:31:30', '2024-10-01 10:31:30'),
(6, 2, '2024-10-01', 'client', 5, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_CUS_ASD_00005', 'created', '122.168.114.106', '2024-10-01 10:33:24', '2024-10-01 10:33:24'),
(7, 2, '2024-10-01', 'client', 6, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_CUS_ASD_00006', 'created', '122.168.114.106', '2024-10-01 10:37:01', '2024-10-01 10:37:01'),
(8, 2, '2024-10-01', 'client', 6, 'company edited Officer information. client code :', 'Admin Amit Amit company edited Officer information. client code : cli_CUS_ASD_00006', 'updated', '122.168.114.106', '2024-10-01 10:46:12', '2024-10-01 10:46:12'),
(9, 2, '2024-10-01', 'client', 5, 'company edited information and edited Officer information. client code :', 'Admin Amit Amit company edited information and edited Officer information. client code : cli_CUS_ASD_00005', 'updated', '122.168.114.106', '2024-10-01 10:48:34', '2024-10-01 10:48:34'),
(10, 2, '2024-10-01', 'client', 7, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_CUS_SAD_00007', 'created', '122.168.114.106', '2024-10-01 10:51:49', '2024-10-01 10:51:49'),
(11, 2, '2024-10-01', 'client', 7, 'partnership edited Officer information. client code :', 'Admin Amit Amit partnership edited Officer information. client code : cli_CUS_SAD_00007', 'updated', '122.168.114.106', '2024-10-01 10:59:04', '2024-10-01 10:59:04'),
(12, 2, '2024-10-01', 'client', 7, 'partnership edited Officer information. client code :', 'Admin Amit Amit partnership edited Officer information. client code : cli_CUS_SAD_00007', 'updated', '122.168.114.106', '2024-10-01 11:30:52', '2024-10-01 11:30:52'),
(13, 2, '2024-10-01', 'job', 5, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_SFF_00005', 'created', '122.168.114.106', '2024-10-01 12:17:10', '2024-10-01 12:17:10'),
(14, 2, '2024-10-01', 'job', 5, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_SFF_00005', 'created', '122.168.114.106', '2024-10-01 12:32:53', '2024-10-01 12:32:53'),
(15, 2, '2024-10-01', 'job', 5, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_SFF_00005', 'created', '122.168.114.106', '2024-10-01 12:32:57', '2024-10-01 12:32:57'),
(16, 2, '2024-10-01', 'job', 5, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_SFF_00005', 'created', '122.168.114.106', '2024-10-01 12:33:43', '2024-10-01 12:33:43'),
(17, 2, '2024-10-01', 'job', 5, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_SFF_00005', 'created', '122.168.114.106', '2024-10-01 12:35:46', '2024-10-01 12:35:46'),
(18, 2, '2024-10-01', 'job', 5, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_SFF_00005', 'created', '122.168.114.106', '2024-10-01 12:35:50', '2024-10-01 12:35:50'),
(19, 2, '2024-10-01', 'job', 5, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_SFF_00005', 'created', '122.168.114.106', '2024-10-01 12:36:28', '2024-10-01 12:36:28'),
(20, 2, '2024-10-01', 'job', 5, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_SFF_00005', 'created', '122.168.114.106', '2024-10-01 12:37:01', '2024-10-01 12:37:01'),
(21, 2, '2024-10-02', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-02 04:57:21', '2024-10-02 04:57:21'),
(22, 2, '2024-10-02', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-02 05:29:28', '2024-10-02 05:29:28'),
(23, 2, '2024-10-02', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-02 05:29:31', '2024-10-02 05:29:31'),
(24, 2, '2024-10-02', 'job', 5, 'completed the draft job code:', 'Admin Amit Amit completed the draft job code: CUS_SFF_00005', 'updated', '122.168.114.106', '2024-10-02 07:30:08', '2024-10-02 07:30:08'),
(25, 2, '2024-10-02', 'job', 5, 'completed the draft job code:', 'Admin Amit Amit completed the draft job code: CUS_SFF_00005', 'updated', '122.168.114.106', '2024-10-02 07:30:14', '2024-10-02 07:30:14'),
(26, 2, '2024-10-02', 'customer', 1, 'edited sole trader information. customer code :', 'Admin Amit Amit edited sole trader information. customer code : cust_CUS_00001(CUSTOMER1)', 'updated', '122.168.114.106', '2024-10-02 08:06:36', '2024-10-02 08:06:36'),
(27, 2, '2024-10-02', 'client', 1, 'edited sole trader information. client code :', 'Admin Amit Amit edited sole trader information. client code : cli_CUS_SFF_00001(SFF)', 'updated', '122.168.114.106', '2024-10-02 08:08:08', '2024-10-02 08:08:08'),
(28, 2, '2024-10-05', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-05 05:27:01', '2024-10-05 05:27:01'),
(29, 2, '2024-10-05', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-05 05:27:03', '2024-10-05 05:27:03'),
(30, 2, '2024-10-05', 'task', 0, 'created task FSDDDD,', 'Admin Amit Amit created task FSDDDD, ', 'created', '122.168.114.106', '2024-10-05 05:31:34', '2024-10-05 05:31:34'),
(31, 2, '2024-10-05', 'customer', 6, 'changes the status Deactivate customer code :', 'Admin Amit Amit changes the status Deactivate customer code : cust_DWF_00006(DWFF)', 'updated', '122.168.114.106', '2024-10-05 10:05:52', '2024-10-05 10:05:52'),
(32, 2, '2024-10-05', 'customer', 2, 'changes the status Deactivate customer code :', 'Admin Amit Amit changes the status Deactivate customer code : cust_A L_00002(A LIMITED)', 'updated', '122.168.114.106', '2024-10-05 10:11:23', '2024-10-05 10:11:23'),
(33, 2, '2024-10-05', 'customer', 2, 'changes the status Activate customer code :', 'Admin Amit Amit changes the status Activate customer code : cust_A L_00002(A LIMITED)', 'updated', '122.168.114.106', '2024-10-05 10:11:30', '2024-10-05 10:11:30'),
(34, 2, '2024-10-05', 'customer', 2, 'changes the status Deactivate customer code :', 'Admin Amit Amit changes the status Deactivate customer code : cust_A L_00002(A LIMITED)', 'updated', '122.168.114.106', '2024-10-05 10:17:30', '2024-10-05 10:17:30'),
(35, 2, '2024-10-05', 'customer', 2, 'changes the status Activate customer code :', 'Admin Amit Amit changes the status Activate customer code : cust_A L_00002(A LIMITED)', 'updated', '122.168.114.106', '2024-10-05 11:21:23', '2024-10-05 11:21:23'),
(36, 2, '2024-10-07', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-07 04:50:19', '2024-10-07 04:50:19'),
(37, 11, '2024-10-07', '-', 0, ' Logged In', 'Manager sss sss  Logged In ', '-', '122.168.114.106', '2024-10-07 08:29:02', '2024-10-07 08:29:02'),
(38, 2, '2024-10-07', 'customer', 2, 'edited the company information customer code :', 'Admin Amit Amit edited the company information customer code : cust_A L_00002(A LIMITED)', 'updated', '122.168.114.106', '2024-10-07 08:32:39', '2024-10-07 08:32:39'),
(39, 2, '2024-10-07', 'task', 0, 'created task DD,', 'Admin Amit Amit created task DD, ', 'created', '122.168.114.106', '2024-10-07 11:56:16', '2024-10-07 11:56:16'),
(40, 2, '2024-10-08', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-08 06:29:05', '2024-10-08 06:29:05'),
(41, 5, '2024-10-08', '-', 0, ' Logged In', 'Manager staff manager staff manager  Logged In ', '-', '122.168.114.106', '2024-10-08 08:23:30', '2024-10-08 08:23:30'),
(42, 2, '2024-10-08', 'checklist', 3, 'created checklist ADSSSS', 'Admin Amit Amit created checklist ADSSSS ', 'created', '122.168.114.106', '2024-10-08 10:50:49', '2024-10-08 10:50:49'),
(43, 2, '2024-10-08', 'job', 5, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_SFF_00005', 'updated', '122.168.114.106', '2024-10-08 11:04:43', '2024-10-08 11:04:43'),
(44, 2, '2024-10-09', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-09 05:02:20', '2024-10-09 05:02:20'),
(45, 2, '2024-10-09', 'customer contact person role', 7, 'created customer contact person role role 2', 'Admin Amit Amit created customer contact person role role 2 ', 'created', '122.168.114.106', '2024-10-09 05:04:41', '2024-10-09 05:04:41'),
(46, 2, '2024-10-09', 'customer contact person role', 7, 'edited customer contact person role role 3', 'Admin Amit Amit edited customer contact person role role 3 ', 'updated', '122.168.114.106', '2024-10-09 05:04:48', '2024-10-09 05:04:48'),
(47, 2, '2024-10-09', 'customer contact person role', 7, 'deleted customer contact person role role 3', 'Admin Amit Amit deleted customer contact person role role 3 ', 'deleted', '122.168.114.106', '2024-10-09 05:04:52', '2024-10-09 05:04:52'),
(48, 2, '2024-10-09', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-09 05:19:42', '2024-10-09 05:19:42'),
(49, 2, '2024-10-09', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-09 05:19:44', '2024-10-09 05:19:44'),
(50, 2, '2024-10-09', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-09 05:20:28', '2024-10-09 05:20:28'),
(51, 2, '2024-10-09', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-09 05:20:29', '2024-10-09 05:20:29'),
(52, 11, '2024-10-09', '-', 0, ' Logged In', 'Manager sss sss  Logged In ', '-', '122.168.114.106', '2024-10-09 10:15:31', '2024-10-09 10:15:31'),
(53, 11, '2024-10-09', 'client', 8, 'created client profile. client code :', 'Manager sss sss created client profile. client code : cli_A L_DDD_00008(DDD)', 'created', '122.168.114.106', '2024-10-09 10:23:18', '2024-10-09 10:23:18'),
(54, 11, '2024-10-09', 'job', 10, 'created job code:', 'Manager sss sss created job code: A L_DDD_00007', 'created', '122.168.114.106', '2024-10-09 10:23:55', '2024-10-09 10:23:55'),
(55, 2, '2024-10-10', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-10 04:46:03', '2024-10-10 04:46:03'),
(56, 2, '2024-10-10', 'customer', 7, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_ddd_00007(ddd)', 'created', '122.168.114.106', '2024-10-10 09:28:23', '2024-10-10 09:28:23'),
(57, 2, '2024-10-10', 'customer', 8, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_sss_00008(sssss)', 'created', '122.168.114.106', '2024-10-10 09:32:39', '2024-10-10 09:32:39'),
(58, 2, '2024-10-10', 'customer', 9, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_scf_00009(scfszss)', 'created', '122.168.114.106', '2024-10-10 09:38:36', '2024-10-10 09:38:36'),
(59, 2, '2024-10-10', 'customer', 10, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_scf_000010(scfszssfdd)', 'created', '122.168.114.106', '2024-10-10 09:39:00', '2024-10-10 09:39:00'),
(60, 2, '2024-10-10', 'customer', 11, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_ada_000011(adasfcs)', 'created', '122.168.114.106', '2024-10-10 09:40:04', '2024-10-10 09:40:04'),
(61, 2, '2024-10-10', 'customer', 12, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_sdg_000012(sdgdsgxdfhn)', 'created', '122.168.114.106', '2024-10-10 10:07:24', '2024-10-10 10:07:24'),
(62, 2, '2024-10-11', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-11 04:42:34', '2024-10-11 04:42:34'),
(63, 2, '2024-10-11', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-11 04:38:15', '2024-10-11 04:38:15'),
(64, 6, '2024-10-11', '-', 0, ' Logged In', 'Processor Nikita  bhagat  Logged In ', '-', NULL, '2024-10-11 07:12:49', '2024-10-11 07:12:49'),
(65, 6, '2024-10-11', 'customer', 13, 'created customer profile. customer code :', 'Processor Nikita  bhagat created customer profile. customer code : cust_grs_000013(grsgr)', 'created', '122.168.114.106', '2024-10-11 09:33:27', '2024-10-11 09:33:27'),
(66, 6, '2024-10-11', 'client', 9, 'created client profile. client code :', 'Processor Nikita  bhagat created client profile. client code : cli_grs_ADX_00009(ADXadcasf)', 'created', '122.168.114.106', '2024-10-11 09:40:04', '2024-10-11 09:40:04'),
(67, 6, '2024-10-11', 'client', 10, 'created client profile. client code :', 'Processor Nikita  bhagat created client profile. client code : cli_grs_DDD_000010(DDDDDDD)', 'created', '122.168.114.106', '2024-10-11 09:40:26', '2024-10-11 09:40:26'),
(68, 6, '2024-10-11', '-', 0, ' Logged Out', 'Processor Nikita  bhagat  Logged Out ', '-', '122.168.114.106', '2024-10-11 10:30:23', '2024-10-11 10:30:23'),
(69, 2, '2024-10-11', 'job', 10, 'edited the job information and has assigned the job to the reviewer, shk hu job code:', 'Admin Amit Amit edited the job information and has assigned the job to the reviewer, shk hu job code: A L_DDD_00007', 'updated', '122.168.114.106', '2024-10-11 10:32:36', '2024-10-11 10:32:36'),
(70, 9, '2024-10-11', '-', 0, ' Logged In', 'Reviewer shk hu  Logged In ', '-', '122.168.114.106', '2024-10-11 10:33:00', '2024-10-11 10:33:00'),
(71, 2, '2024-10-11', 'client', 11, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_A L_RFG_000011(RFGGGG)', 'created', '122.168.114.106', '2024-10-11 10:34:35', '2024-10-11 10:34:35'),
(72, 9, '2024-10-11', '-', 0, ' Logged Out', 'Reviewer shk hu  Logged Out ', '-', '122.168.114.106', '2024-10-11 10:57:08', '2024-10-11 10:57:08'),
(73, 2, '2024-10-11', 'customer', 3, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_SQA_00003(SQADADX)', 'updated', '122.168.114.106', '2024-10-11 11:41:57', '2024-10-11 11:41:57'),
(74, 2, '2024-10-11', 'customer', 3, 'added Percentage Model (engagement model) customer code :', 'Admin Amit Amit added Percentage Model (engagement model) customer code : cust_SQA_00003(SQADADX)', 'updated', '122.168.114.106', '2024-10-11 11:42:28', '2024-10-11 11:42:28'),
(75, 2, '2024-10-11', 'customer', 12, 'edited the partnership information customer code :', 'Admin Amit Amit edited the partnership information customer code : cust_sdg_000012(sdgdsgxdfhn)', 'updated', '122.168.114.106', '2024-10-11 11:42:51', '2024-10-11 11:42:51'),
(76, 2, '2024-10-11', 'customer', 12, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_sdg_000012(sdgdsgxdfhn)', 'updated', '122.168.114.106', '2024-10-11 11:43:04', '2024-10-11 11:43:04'),
(77, 2, '2024-10-11', 'customer', 12, 'added Percentage Model (engagement model) customer code :', 'Admin Amit Amit added Percentage Model (engagement model) customer code : cust_sdg_000012(sdgdsgxdfhn)', 'updated', '122.168.114.106', '2024-10-11 11:43:19', '2024-10-11 11:43:19'),
(78, 2, '2024-10-14', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-14 04:54:09', '2024-10-14 04:54:10'),
(79, 2, '2024-10-14', 'checklist', 4, 'created checklist GGGG', 'Admin Amit Amit created checklist GGGG ', 'created', '122.168.114.106', '2024-10-14 04:54:32', '2024-10-14 04:54:32'),
(80, 2, '2024-10-14', 'customer', 11, 'edited the partnership information customer code :', 'Admin Amit Amit edited the partnership information customer code : cust_ada_000011(adasfcs)', 'updated', '122.168.114.106', '2024-10-14 04:55:08', '2024-10-14 04:55:08'),
(81, 2, '2024-10-14', 'checklist', 5, 'created checklist SSSS', 'Admin Amit Amit created checklist SSSS ', 'created', '122.168.114.106', '2024-10-14 05:21:17', '2024-10-14 05:21:17'),
(82, 2, '2024-10-14', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-14 05:33:11', '2024-10-14 05:33:11'),
(83, 2, '2024-10-14', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-14 05:35:11', '2024-10-14 05:35:11'),
(84, 2, '2024-10-14', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-14 05:53:47', '2024-10-14 05:53:47'),
(85, 6, '2024-10-14', '-', 0, ' Logged In With Microsoft', 'Processor Nikita  bhagat  Logged In With Microsoft ', '-', '122.168.114.106', '2024-10-14 05:53:51', '2024-10-14 05:53:51'),
(86, 6, '2024-10-14', '-', 0, ' Logged Out', 'Processor Nikita  bhagat  Logged Out ', '-', '122.168.114.106', '2024-10-14 05:54:39', '2024-10-14 05:54:39'),
(87, 6, '2024-10-14', '-', 0, ' Logged In With Microsoft', 'Processor Nikita  bhagat  Logged In With Microsoft ', '-', '122.168.114.106', '2024-10-14 06:00:31', '2024-10-14 06:00:31'),
(88, 6, '2024-10-14', '-', 0, ' Logged Out', 'Processor Nikita  bhagat  Logged Out ', '-', '122.168.114.106', '2024-10-14 06:01:22', '2024-10-14 06:01:22'),
(89, 2, '2024-10-14', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-14 06:14:57', '2024-10-14 06:14:57'),
(90, 2, '2024-10-14', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-14 06:40:41', '2024-10-14 06:40:41'),
(91, 2, '2024-10-14', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-14 06:40:44', '2024-10-14 06:40:44'),
(92, 6, '2024-10-14', '-', 0, ' Logged In With Microsoft', 'Processor Nikita  bhagat  Logged In With Microsoft ', '-', NULL, '2024-10-14 06:41:43', '2024-10-14 06:41:43'),
(93, 6, '2024-10-14', '-', 0, ' Logged Out', 'Processor Nikita  bhagat  Logged Out ', '-', '122.168.114.106', '2024-10-14 06:42:48', '2024-10-14 06:42:48'),
(94, 1, '2024-10-14', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2024-10-14 06:43:12', '2024-10-14 06:43:12'),
(95, 1, '2024-10-14', 'Internal', 4, 'created Internal DSDA', 'Super Admin System Super Super Admin created Internal DSDA ', 'created', '122.168.114.106', '2024-10-14 06:56:12', '2024-10-14 06:56:12'),
(96, 1, '2024-10-14', 'Internal', 4, 'Deleted Internal DSDA', 'Super Admin System Super Super Admin Deleted Internal DSDA ', 'deleted', '122.168.114.106', '2024-10-14 07:01:00', '2024-10-14 07:01:00'),
(97, 1, '2024-10-14', 'Internal', 5, 'created Internal SSS', 'Super Admin System Super Super Admin created Internal SSS ', 'created', '122.168.114.106', '2024-10-14 07:06:37', '2024-10-14 07:06:37'),
(98, 1, '2024-10-14', 'Internal', 5, 'changes the internal status Deactivate SSS', 'Super Admin System Super Super Admin changes the internal status Deactivate SSS ', 'updated', '122.168.114.106', '2024-10-14 07:07:32', '2024-10-14 07:07:32'),
(99, 1, '2024-10-14', 'Internal', 5, 'edited internal SSS1', 'Super Admin System Super Super Admin edited internal SSS1 ', 'updated', '122.168.114.106', '2024-10-14 07:07:56', '2024-10-14 07:07:56'),
(100, 1, '2024-10-14', 'Internal', 5, 'Deleted Internal SSS1', 'Super Admin System Super Super Admin Deleted Internal SSS1 ', 'deleted', '122.168.114.106', '2024-10-14 07:08:32', '2024-10-14 07:08:32'),
(101, 1, '2024-10-14', 'Internal', 6, 'created Internal SSS', 'Super Admin System Super Super Admin created Internal SSS ', 'created', '122.168.114.106', '2024-10-14 07:13:59', '2024-10-14 07:13:59'),
(102, 1, '2024-10-14', 'Sub Internal', 6, 'created Sub Internal S1', 'Super Admin System Super Super Admin created Sub Internal S1 ', 'created', '122.168.114.106', '2024-10-14 07:14:13', '2024-10-14 07:14:13'),
(103, 1, '2024-10-14', 'Sub Internal', 7, 'created Sub Internal S2', 'Super Admin System Super Super Admin created Sub Internal S2 ', 'created', '122.168.114.106', '2024-10-14 07:14:27', '2024-10-14 07:14:27'),
(104, 1, '2024-10-14', 'Sub Internal', 6, 'changes the Sub Internal status Deactivate S1', 'Super Admin System Super Super Admin changes the Sub Internal status Deactivate S1 ', 'updated', '122.168.114.106', '2024-10-14 07:14:40', '2024-10-14 07:14:40'),
(105, 1, '2024-10-14', 'Sub Internal', 6, 'changes the Sub Internal status Activate S1', 'Super Admin System Super Super Admin changes the Sub Internal status Activate S1 ', 'updated', '122.168.114.106', '2024-10-14 07:14:51', '2024-10-14 07:14:51'),
(106, 1, '2024-10-14', 'Sub Internal', 6, 'edited Sub Internal S111', 'Super Admin System Super Super Admin edited Sub Internal S111 ', 'updated', '122.168.114.106', '2024-10-14 07:15:00', '2024-10-14 07:15:00'),
(107, 1, '2024-10-14', 'Sub Internal', 6, 'edited Sub Internal S1', 'Super Admin System Super Super Admin edited Sub Internal S1 ', 'updated', '122.168.114.106', '2024-10-14 07:15:12', '2024-10-14 07:15:12'),
(108, 1, '2024-10-14', 'Sub Internal', 7, 'deleted Sub Internal S2', 'Super Admin System Super Super Admin deleted Sub Internal S2 ', 'deleted', '122.168.114.106', '2024-10-14 07:15:20', '2024-10-14 07:15:20'),
(109, 2, '2024-10-14', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-14 07:27:59', '2024-10-14 07:27:59'),
(110, 9, '2024-10-14', '-', 0, ' Logged In', 'Reviewer shk hu  Logged In ', '-', '122.168.114.106', '2024-10-14 07:28:24', '2024-10-14 07:28:24'),
(111, 9, '2024-10-14', '-', 0, ' Logged Out', 'Reviewer shk hu  Logged Out ', '-', '122.168.114.106', '2024-10-14 07:31:49', '2024-10-14 07:31:49'),
(112, 2, '2024-10-14', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-14 07:31:51', '2024-10-14 07:31:51'),
(113, 2, '2024-10-14', 'customer', 14, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_AER_000014(AERT)', 'created', '122.168.114.106', '2024-10-14 08:47:03', '2024-10-14 08:47:03'),
(114, 1, '2024-10-14', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2024-10-14 08:48:02', '2024-10-14 08:48:02'),
(115, 11, '2024-10-14', '-', 0, ' Logged In', 'Manager sss sss  Logged In ', '-', '122.168.114.106', '2024-10-14 08:48:08', '2024-10-14 08:48:08'),
(116, 2, '2024-10-14', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-14 08:50:40', '2024-10-14 08:50:40'),
(117, 4, '2024-10-14', '-', 0, ' Logged In', 'Processor staff staff  Logged In ', '-', '122.168.114.106', '2024-10-14 08:51:54', '2024-10-14 08:51:54'),
(118, 11, '2024-10-14', '-', 0, ' Logged Out', 'Manager sss sss  Logged Out ', '-', '122.168.114.106', '2024-10-14 08:52:04', '2024-10-14 08:52:04'),
(119, 2, '2024-10-14', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-14 08:52:11', '2024-10-14 08:52:11'),
(120, 4, '2024-10-14', 'customer', 15, 'created customer profile. customer code :', 'Processor staff staff created customer profile. customer code : cust_HKJ_000015(HKJ)', 'created', '122.168.114.106', '2024-10-14 08:53:40', '2024-10-14 08:53:40'),
(121, 2, '2024-10-14', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-14 08:54:22', '2024-10-14 08:54:22'),
(122, 11, '2024-10-14', '-', 0, ' Logged In', 'Manager sss sss  Logged In ', '-', '122.168.114.106', '2024-10-14 08:54:38', '2024-10-14 08:54:38'),
(123, 11, '2024-10-14', '-', 0, ' Logged Out', 'Manager sss sss  Logged Out ', '-', '122.168.114.106', '2024-10-14 08:55:41', '2024-10-14 08:55:41'),
(124, 2, '2024-10-14', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-14 08:55:45', '2024-10-14 08:55:45'),
(125, 2, '2024-10-14', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-14 08:57:13', '2024-10-14 08:57:13'),
(126, 11, '2024-10-14', '-', 0, ' Logged In', 'Manager sss sss  Logged In ', '-', '122.168.114.106', '2024-10-14 08:58:06', '2024-10-14 08:58:06'),
(127, 4, '2024-10-14', '-', 0, ' Logged Out', 'Processor staff staff  Logged Out ', '-', '122.168.114.106', '2024-10-14 09:00:19', '2024-10-14 09:00:19'),
(128, 2, '2024-10-14', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-14 09:00:23', '2024-10-14 09:00:23'),
(129, 2, '2024-10-14', 'role', 8, 'created role Management', 'Admin Amit Amit created role Management ', 'created', '122.168.114.106', '2024-10-14 09:00:37', '2024-10-14 09:00:37'),
(130, 2, '2024-10-14', 'staff', 15, 'created staff mmm hhh', 'Admin Amit Amit created staff mmm hhh ', 'created', '122.168.114.106', '2024-10-14 09:01:44', '2024-10-14 09:01:44'),
(131, 2, '2024-10-14', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-14 09:02:18', '2024-10-14 09:02:18'),
(132, 15, '2024-10-14', '-', 0, ' Logged In', 'Management mmm hhh  Logged In ', '-', '122.168.114.106', '2024-10-14 09:02:22', '2024-10-14 09:02:22'),
(133, 11, '2024-10-14', '-', 0, ' Logged Out', 'Manager sss sss  Logged Out ', '-', '122.168.114.106', '2024-10-14 09:02:29', '2024-10-14 09:02:29'),
(134, 2, '2024-10-14', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-14 09:02:33', '2024-10-14 09:02:33'),
(135, 15, '2024-10-14', 'customer', 16, 'created customer profile. customer code :', 'Management mmm hhh created customer profile. customer code : cust_WWW_000016(WWW)', 'created', '122.168.114.106', '2024-10-14 09:03:33', '2024-10-14 09:03:33'),
(136, 2, '2024-10-14', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-14 09:04:39', '2024-10-14 09:04:39'),
(137, 5, '2024-10-14', '-', 0, ' Logged In', 'Manager staff manager staff manager  Logged In ', '-', '122.168.114.106', '2024-10-14 09:04:45', '2024-10-14 09:04:45'),
(138, 15, '2024-10-14', '-', 0, ' Logged Out', 'Management mmm hhh  Logged Out ', '-', '122.168.114.106', '2024-10-14 09:33:56', '2024-10-14 09:33:56'),
(139, 2, '2024-10-14', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-14 09:34:01', '2024-10-14 09:34:01'),
(140, 2, '2024-10-14', 'customer', 12, 'added additional Partner to the partnership information customer code :', 'Admin Amit Amit added additional Partner to the partnership information customer code : cust_sdg_000012(sdgdsgxdfhn)', 'updated', '122.168.114.106', '2024-10-14 10:03:41', '2024-10-14 10:03:41'),
(141, 2, '2024-10-14', 'customer', 16, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_WWW_000016(WWW)', 'updated', '122.168.114.106', '2024-10-14 10:50:46', '2024-10-14 10:50:46'),
(142, 2, '2024-10-14', 'checklist', 6, 'created checklist abc', 'Admin Amit Amit created checklist abc ', 'created', '122.168.114.106', '2024-10-14 11:38:06', '2024-10-14 11:38:06'),
(143, 2, '2024-10-14', 'checklist', 7, 'created checklist DDDDE', 'Admin Amit Amit created checklist DDDDE ', 'created', '122.168.114.106', '2024-10-14 11:38:33', '2024-10-14 11:38:33'),
(144, 2, '2024-10-14', 'job types', 8, 'created job types A', 'Admin Amit Amit created job types A ', 'created', '122.168.114.106', '2024-10-14 12:15:23', '2024-10-14 12:15:23'),
(145, 2, '2024-10-14', 'job types', 8, 'edited job types A1', 'Admin Amit Amit edited job types A1 ', 'updated', '122.168.114.106', '2024-10-14 12:26:23', '2024-10-14 12:26:23'),
(146, 2, '2024-10-14', 'job types', 8, 'edited job types A', 'Admin Amit Amit edited job types A ', 'updated', '122.168.114.106', '2024-10-14 12:26:30', '2024-10-14 12:26:30'),
(147, 2, '2024-10-14', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-14 12:31:23', '2024-10-14 12:31:23'),
(148, 2, '2024-10-14', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-14 12:31:26', '2024-10-14 12:31:26'),
(149, 2, '2024-10-14', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-14 12:33:02', '2024-10-14 12:33:02'),
(150, 2, '2024-10-14', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-14 12:35:28', '2024-10-14 12:35:28'),
(151, 2, '2024-10-14', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-14 12:35:36', '2024-10-14 12:35:36'),
(152, 2, '2024-10-14', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-14 12:36:03', '2024-10-14 12:36:03'),
(153, 2, '2024-10-14', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-14 12:36:04', '2024-10-14 12:36:04'),
(154, 2, '2024-10-14', 'customer', 13, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_grs_000013(grsgr)', 'updated', '122.168.114.106', '2024-10-14 14:15:39', '2024-10-14 14:15:39'),
(155, 2, '2024-10-14', 'customer', 13, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_grs_000013(grsgr)', 'updated', '122.168.114.106', '2024-10-14 14:16:07', '2024-10-14 14:16:07'),
(156, 2, '2024-10-14', 'customer', 1, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_00001(CUSTOMER1)', 'updated', '122.168.114.106', '2024-10-14 14:16:32', '2024-10-14 14:16:32'),
(157, 2, '2024-10-14', 'customer', 1, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_CUS_00001(CUSTOMER1)', 'updated', '122.168.114.106', '2024-10-14 14:16:59', '2024-10-14 14:16:59'),
(158, 2, '2024-10-14', 'customer', 13, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_grs_000013(grsgr)', 'updated', '122.168.114.106', '2024-10-14 14:19:35', '2024-10-14 14:19:35'),
(159, 2, '2024-10-14', 'customer', 13, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_grs_000013(grsgr)', 'updated', '122.168.114.106', '2024-10-14 14:19:49', '2024-10-14 14:19:49'),
(160, 2, '2024-10-14', 'customer', 13, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_grs_000013(grsgr)', 'updated', '122.168.114.106', '2024-10-14 14:20:56', '2024-10-14 14:20:56'),
(161, 2, '2024-10-14', 'customer', 1, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_00001(CUSTOMER1)', 'updated', '122.168.114.106', '2024-10-14 14:21:14', '2024-10-14 14:21:14'),
(162, 2, '2024-10-14', 'customer', 13, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_grs_000013(grsgr)', 'updated', '122.168.114.106', '2024-10-14 14:21:26', '2024-10-14 14:21:26'),
(163, 2, '2024-10-14', 'customer', 13, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_grs_000013(grsgr)', 'updated', '122.168.114.106', '2024-10-14 14:23:45', '2024-10-14 14:23:45'),
(164, 2, '2024-10-14', 'customer', 1, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_CUS_00001(CUSTOMER1)', 'updated', '122.168.114.106', '2024-10-14 14:23:55', '2024-10-14 14:23:55'),
(165, 2, '2024-10-14', 'customer', 1, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_00001(CUSTOMER1)', 'updated', '122.168.114.106', '2024-10-14 14:40:35', '2024-10-14 14:40:35'),
(166, 2, '2024-10-14', 'customer', 1, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_CUS_00001(CUSTOMER1)', 'updated', '122.168.114.106', '2024-10-14 14:42:27', '2024-10-14 14:42:27'),
(167, 2, '2024-10-14', 'customer', 1, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_00001(CUSTOMER1)', 'updated', '122.168.114.106', '2024-10-14 14:45:03', '2024-10-14 14:45:03'),
(168, 2, '2024-10-14', 'customer', 1, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_CUS_00001(CUSTOMER1)', 'updated', '122.168.114.106', '2024-10-14 14:48:43', '2024-10-14 14:48:43'),
(169, 2, '2024-10-14', 'customer', 1, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_00001(CUSTOMER1)', 'updated', '122.168.114.106', '2024-10-14 14:49:46', '2024-10-14 14:49:46'),
(170, 2, '2024-10-14', 'customer', 1, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_CUS_00001(CUSTOMER1)', 'updated', '122.168.114.106', '2024-10-14 14:50:03', '2024-10-14 14:50:03'),
(171, 2, '2024-10-14', 'customer', 1, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_CUS_00001(CUSTOMER1)', 'updated', '122.168.114.106', '2024-10-14 14:53:50', '2024-10-14 14:53:50'),
(172, 2, '2024-10-14', 'customer', 1, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_CUS_00001(CUSTOMER1)', 'updated', '122.168.114.106', '2024-10-14 14:59:49', '2024-10-14 14:59:49'),
(173, 2, '2024-10-14', 'customer', 1, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_00001(CUSTOMER1)', 'updated', '122.168.114.106', '2024-10-14 15:00:16', '2024-10-14 15:00:16'),
(174, 2, '2024-10-14', 'customer', 13, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_grs_000013(grsgr)', 'updated', '122.168.114.106', '2024-10-14 15:00:23', '2024-10-14 15:00:23'),
(175, 2, '2024-10-14', 'customer', 1, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_CUS_00001(CUSTOMER1)', 'updated', '122.168.114.106', '2024-10-14 15:00:32', '2024-10-14 15:00:32'),
(176, 2, '2024-10-14', 'customer', 13, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_grs_000013(grsgr)', 'updated', '122.168.114.106', '2024-10-14 15:00:41', '2024-10-14 15:00:41'),
(177, 2, '2024-10-14', 'customer', 1, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_00001(CUSTOMER1)', 'updated', '122.168.114.106', '2024-10-14 15:00:52', '2024-10-14 15:00:52'),
(178, 2, '2024-10-14', 'customer', 13, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_grs_000013(grsgr)', 'updated', '122.168.114.106', '2024-10-14 15:01:08', '2024-10-14 15:01:08'),
(179, 2, '2024-10-14', 'customer', 13, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_grs_000013(grsgr)', 'updated', '122.168.114.106', '2024-10-14 15:03:45', '2024-10-14 15:03:46'),
(180, 2, '2024-10-14', 'customer', 16, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_WWW_000016(WWW)', 'updated', '122.168.114.106', '2024-10-14 15:08:35', '2024-10-14 15:08:35'),
(181, 2, '2024-10-14', 'customer', 16, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_WWW_000016(WWW)', 'updated', '122.168.114.106', '2024-10-14 15:08:53', '2024-10-14 15:08:53'),
(182, 2, '2024-10-14', 'client', 12, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_WWW_ddd_000012(dddd)', 'created', '122.168.114.106', '2024-10-14 15:32:28', '2024-10-14 15:32:28'),
(183, 2, '2024-10-15', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-15 04:49:52', '2024-10-15 04:49:52'),
(184, 2, '2024-10-15', 'customer', 16, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_WWW_000016(WWW)', 'updated', '122.168.114.106', '2024-10-15 04:50:31', '2024-10-15 04:50:31'),
(185, 2, '2024-10-15', 'customer', 16, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_WWW_000016(WWW)', 'updated', '122.168.114.106', '2024-10-15 04:54:58', '2024-10-15 04:54:58'),
(186, 2, '2024-10-15', 'customer', 16, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_WWW_000016(WWW)', 'updated', '122.168.114.106', '2024-10-15 04:55:51', '2024-10-15 04:55:51'),
(187, 2, '2024-10-15', 'customer', 16, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_WWW_000016(WWW)', 'updated', '122.168.114.106', '2024-10-15 04:56:01', '2024-10-15 04:56:01'),
(188, 2, '2024-10-15', 'customer', 15, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_HKJ_000015(HKJ)', 'updated', '122.168.114.106', '2024-10-15 04:56:20', '2024-10-15 04:56:20'),
(189, 2, '2024-10-15', 'customer', 15, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_HKJ_000015(HKJ)', 'updated', '122.168.114.106', '2024-10-15 04:56:46', '2024-10-15 04:56:46'),
(190, 2, '2024-10-15', 'customer', 15, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_HKJ_000015(HKJ)', 'updated', '122.168.114.106', '2024-10-15 04:57:05', '2024-10-15 04:57:05'),
(191, 2, '2024-10-15', 'customer', 16, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_WWW_000016(WWW)', 'updated', '122.168.114.106', '2024-10-15 04:59:00', '2024-10-15 04:59:00'),
(192, 2, '2024-10-15', 'customer', 16, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_WWW_000016(WWW)', 'updated', '122.168.114.106', '2024-10-15 05:06:11', '2024-10-15 05:06:11'),
(193, 2, '2024-10-15', 'customer', 16, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_WWW_000016(WWW)', 'updated', '122.168.114.106', '2024-10-15 05:06:51', '2024-10-15 05:06:51'),
(194, 2, '2024-10-15', 'customer', 15, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_HKJ_000015(HKJ)', 'updated', '122.168.114.106', '2024-10-15 05:07:02', '2024-10-15 05:07:02'),
(195, 2, '2024-10-15', 'customer', 16, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_WWW_000016(WWW)', 'updated', '122.168.114.106', '2024-10-15 05:07:19', '2024-10-15 05:07:19'),
(196, 2, '2024-10-15', 'customer', 16, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_WWW_000016(WWW)', 'updated', '122.168.114.106', '2024-10-15 05:30:41', '2024-10-15 05:30:41'),
(197, 2, '2024-10-15', 'customer', 16, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_WWW_000016(WWW)', 'updated', '122.168.114.106', '2024-10-15 05:30:55', '2024-10-15 05:30:55'),
(198, 2, '2024-10-15', 'customer', 15, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_HKJ_000015(HKJ)', 'updated', '122.168.114.106', '2024-10-15 05:31:25', '2024-10-15 05:31:25'),
(199, 2, '2024-10-15', 'customer', 13, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_grs_000013(grsgr)', 'updated', '122.168.114.106', '2024-10-15 05:32:03', '2024-10-15 05:32:03'),
(200, 2, '2024-10-15', 'customer', 1, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_CUS_00001(CUSTOMER1)', 'updated', '122.168.114.106', '2024-10-15 05:32:26', '2024-10-15 05:32:26'),
(201, 2, '2024-10-15', 'customer', 1, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_00001(CUSTOMER1)', 'updated', '122.168.114.106', '2024-10-15 05:33:00', '2024-10-15 05:33:00'),
(202, 2, '2024-10-15', 'customer', 15, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_HKJ_000015(HKJ)', 'updated', '122.168.114.106', '2024-10-15 05:33:20', '2024-10-15 05:33:20'),
(203, 2, '2024-10-15', 'customer', 1, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_00001(CUSTOMER1)', 'updated', '122.168.114.106', '2024-10-15 05:33:29', '2024-10-15 05:33:29'),
(204, 2, '2024-10-15', 'customer', 15, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_HKJ_000015(HKJ)', 'updated', '122.168.114.106', '2024-10-15 05:33:39', '2024-10-15 05:33:39'),
(205, 2, '2024-10-15', 'checklist', 8, 'created checklist FGH', 'Admin Amit Amit created checklist FGH ', 'created', '122.168.114.106', '2024-10-15 05:44:23', '2024-10-15 05:44:23'),
(206, 2, '2024-10-15', 'checklist', 9, 'created checklist RRR', 'Admin Amit Amit created checklist RRR ', 'created', '122.168.114.106', '2024-10-15 05:46:07', '2024-10-15 05:46:07'),
(207, 2, '2024-10-15', 'customer', 5, 'added Percentage Model (engagement model) customer code :', 'Admin Amit Amit added Percentage Model (engagement model) customer code : cust_sfs_00005(sfsfsfs)', 'updated', '122.168.114.106', '2024-10-15 05:48:55', '2024-10-15 05:48:55'),
(208, 2, '2024-10-15', 'client', 13, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_sfs_ER_000013(ER)', 'created', '122.168.114.106', '2024-10-15 05:49:26', '2024-10-15 05:49:26'),
(209, 2, '2024-10-15', 'checklist', 1, 'created checklist Checklist 1', 'Admin Amit Amit created checklist Checklist 1 ', 'created', '122.168.114.106', '2024-10-15 08:22:45', '2024-10-15 08:22:45'),
(210, 2, '2024-10-15', 'checklist', 2, 'created checklist cust_c2', 'Admin Amit Amit created checklist cust_c2 ', 'created', '122.168.114.106', '2024-10-15 08:31:39', '2024-10-15 08:31:39'),
(211, 2, '2024-10-15', 'checklist', 4, 'created checklist RRR', 'Admin Amit Amit created checklist RRR ', 'created', '122.168.114.106', '2024-10-15 08:42:18', '2024-10-15 08:42:18'),
(212, 2, '2024-10-15', 'staff', 16, 'created staff SA ss', 'Admin Amit Amit created staff SA ss ', 'created', '122.168.114.106', '2024-10-15 08:48:32', '2024-10-15 08:48:32'),
(213, 2, '2024-10-15', 'staff', 17, 'created staff am ddddddd', 'Admin Amit Amit created staff am ddddddd ', 'created', '122.168.114.106', '2024-10-15 08:50:42', '2024-10-15 08:50:42'),
(214, 2, '2024-10-15', 'staff', 18, 'created staff aj ssss', 'Admin Amit Amit created staff aj ssss ', 'created', '122.168.114.106', '2024-10-15 08:51:45', '2024-10-15 08:51:45'),
(215, 2, '2024-10-15', 'job', 11, 'created job code:', 'Admin Amit Amit created job code: WWW_ddd_00008', 'created', '122.168.114.106', '2024-10-15 11:28:19', '2024-10-15 11:28:19'),
(216, 2, '2024-10-15', 'job', 12, 'created job code:', 'Admin Amit Amit created job code: WWW_ddd_00009', 'created', '122.168.114.106', '2024-10-15 11:29:28', '2024-10-15 11:29:28'),
(217, 2, '2024-10-15', 'job', 13, 'created job code:', 'Admin Amit Amit created job code: WWW_ddd_000010', 'created', '122.168.114.106', '2024-10-15 11:29:43', '2024-10-15 11:29:43'),
(218, 2, '2024-10-15', 'job', 14, 'created job code:', 'Admin Amit Amit created job code: WWW_ddd_000011', 'created', '122.168.114.106', '2024-10-15 11:38:52', '2024-10-15 11:38:52'),
(219, 2, '2024-10-15', 'job', 15, 'created job code:', 'Admin Amit Amit created job code: WWW_ddd_000012', 'created', '122.168.114.106', '2024-10-15 11:40:06', '2024-10-15 11:40:06'),
(220, 2, '2024-10-15', 'job', 16, 'created job code:', 'Admin Amit Amit created job code: WWW_ddd_000013', 'created', '122.168.114.106', '2024-10-15 11:41:59', '2024-10-15 11:41:59'),
(221, 2, '2024-10-15', 'job', 17, 'created job code:', 'Admin Amit Amit created job code: WWW_ddd_000014', 'created', '122.168.114.106', '2024-10-15 11:46:40', '2024-10-15 11:46:40'),
(222, 2, '2024-10-15', 'job', 18, 'created job code:', 'Admin Amit Amit created job code: WWW_ddd_000015', 'created', '122.168.114.106', '2024-10-15 11:48:39', '2024-10-15 11:48:39'),
(223, 2, '2024-10-15', 'job', 19, 'created job code:', 'Admin Amit Amit created job code: WWW_ddd_000016', 'created', '122.168.114.106', '2024-10-15 11:53:49', '2024-10-15 11:53:49'),
(224, 2, '2024-10-15', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-15 11:01:26', '2024-10-15 11:01:27'),
(225, 2, '2024-10-15', 'job', 20, 'created job code:', 'Admin Amit Amit created job code: WWW_ddd_000017', 'created', '122.168.114.106', '2024-10-15 11:04:57', '2024-10-15 11:04:57'),
(226, 2, '2024-10-15', 'job', 21, 'created job code:', 'Admin Amit Amit created job code: WWW_ddd_000018', 'created', '122.168.114.106', '2024-10-15 11:05:56', '2024-10-15 11:05:56'),
(227, 2, '2024-10-15', 'job', 22, 'created job code:', 'Admin Amit Amit created job code: WWW_ddd_000019', 'created', '122.168.114.106', '2024-10-15 11:08:39', '2024-10-15 11:08:39'),
(228, 2, '2024-10-15', 'job', 23, 'created job code:', 'Admin Amit Amit created job code: WWW_ddd_000020', 'created', '122.168.114.106', '2024-10-15 11:09:19', '2024-10-15 11:09:19'),
(229, 2, '2024-10-17', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-17 04:58:42', '2024-10-17 04:58:42'),
(230, 2, '2024-10-17', 'staff', 2, 'edited staff Amit Amit', 'Admin Amit Amit edited staff Amit Amit ', 'updated', '122.168.114.106', '2024-10-17 09:06:15', '2024-10-17 09:06:15'),
(231, 2, '2024-10-17', 'staff', 2, 'edited staff Amit Amit', 'Admin Amit Amit edited staff Amit Amit ', 'updated', '122.168.114.106', '2024-10-17 09:08:20', '2024-10-17 09:08:20');
INSERT INTO `staff_logs` (`id`, `staff_id`, `date`, `module_name`, `module_id`, `log_message`, `log_message_all`, `permission_type`, `ip`, `created_at`, `updated_at`) VALUES
(232, 2, '2024-10-17', 'staff', 2, 'edited staff Amit Amit', 'Admin Amit Amit edited staff Amit Amit ', 'updated', '122.168.114.106', '2024-10-17 09:14:23', '2024-10-17 09:14:23'),
(233, 2, '2024-10-17', 'staff', 1, 'edited staff System Super Super Admin', 'Admin Amit Amit edited staff System Super Super Admin ', 'updated', '122.168.114.106', '2024-10-17 10:23:27', '2024-10-17 10:23:27'),
(234, 2, '2024-10-17', 'staff', 3, 'edited staff Ajit Ajit', 'Admin Amit Amit edited staff Ajit Ajit ', 'updated', '122.168.114.106', '2024-10-17 10:24:26', '2024-10-17 10:24:26'),
(235, 2, '2024-10-18', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-10-18 04:40:08', '2024-10-18 04:40:08'),
(236, 11, '2024-10-18', '-', 0, ' Logged In', 'Manager sss sss  Logged In ', '-', NULL, '2024-10-18 07:15:52', '2024-10-18 07:15:52'),
(237, 2, '2024-10-18', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-18 11:12:31', '2024-10-18 11:12:31'),
(238, 2, '2024-10-18', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-18 11:12:42', '2024-10-18 11:12:42'),
(239, 2, '2024-10-19', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-10-19 04:55:03', '2024-10-19 04:55:03'),
(240, 2, '2024-10-19', 'customer', 7, 'edited sole trader information. customer code :', 'Admin Amit Amit edited sole trader information. customer code : cust_ddd_00007(ddd)', 'updated', NULL, '2024-10-19 04:57:24', '2024-10-19 04:57:24'),
(241, 2, '2024-10-19', 'customer', 7, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_ddd_00007(ddd)', 'updated', NULL, '2024-10-19 04:57:32', '2024-10-19 04:57:32'),
(242, 2, '2024-10-19', 'customer', 7, 'added Percentage Model (engagement model) customer code :', 'Admin Amit Amit added Percentage Model (engagement model) customer code : cust_ddd_00007(ddd)', 'updated', NULL, '2024-10-19 04:57:52', '2024-10-19 04:57:52'),
(243, 2, '2024-10-19', 'staff', 18, 'edited staff aj ssss', 'Admin Amit Amit edited staff aj ssss ', 'updated', '122.168.114.106', '2024-10-19 12:26:07', '2024-10-19 12:26:07'),
(244, 2, '2024-10-19', 'role', 3, 'edited role Processor', 'Admin Amit Amit edited role Processor ', 'updated', '122.168.114.106', '2024-10-19 12:27:07', '2024-10-19 12:27:07'),
(245, 2, '2024-10-19', 'role', 3, 'edited role Processor', 'Admin Amit Amit edited role Processor ', 'updated', '122.168.114.106', '2024-10-19 12:27:25', '2024-10-19 12:27:25'),
(246, 2, '2024-10-19', 'role', 2, 'edited role Admin', 'Admin Amit Amit edited role Admin ', 'updated', '122.168.114.106', '2024-10-19 12:27:52', '2024-10-19 12:27:52'),
(247, 2, '2024-10-19', 'customer', 17, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_DDD_000017(DDDD)', 'created', '122.168.114.106', '2024-10-19 12:33:44', '2024-10-19 12:33:44'),
(248, 2, '2024-10-21', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-10-21 05:29:44', '2024-10-21 05:29:44'),
(249, 2, '2024-10-21', 'job', 6, 'sent the queries for job code:', 'Admin Amit Amit sent the queries for job code: CUS_SFF_00006', 'created', '103.103.213.217', '2024-10-21 09:32:45', '2024-10-21 09:32:45'),
(250, 2, '2024-10-21', 'job', 6, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_SFF_00006', 'created', '103.103.213.217', '2024-10-21 09:37:49', '2024-10-21 09:37:49'),
(251, 2, '2024-10-22', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-10-22 10:18:32', '2024-10-22 10:18:32'),
(252, 2, '2024-10-22', 'customer', 18, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_CUS_000018(CUSTOMER1a)', 'created', '103.103.213.217', '2024-10-22 10:26:50', '2024-10-22 10:26:50'),
(253, 2, '2024-10-22', 'checklist', 5, 'created checklist abc55', 'Admin Amit Amit created checklist abc55 ', 'created', '103.103.213.217', '2024-10-22 10:30:32', '2024-10-22 10:30:32'),
(254, 2, '2024-10-22', 'customer', 18, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_000018(CUSTOMER1a)', 'updated', '103.103.213.217', '2024-10-22 10:37:08', '2024-10-22 10:37:08'),
(255, 2, '2024-10-22', 'customer', 18, 'added Percentage Model (engagement model) customer code :', 'Admin Amit Amit added Percentage Model (engagement model) customer code : cust_CUS_000018(CUSTOMER1a)', 'updated', '103.103.213.217', '2024-10-22 10:37:30', '2024-10-22 10:37:30'),
(256, 2, '2024-10-22', 'client', 14, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_CUS_SSS_000014(SSSSS)', 'created', '103.103.213.217', '2024-10-22 10:38:19', '2024-10-22 10:38:19'),
(257, 2, '2024-10-23', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-10-23 12:06:06', '2024-10-23 12:06:06'),
(258, 9, '2024-10-23', '-', 0, ' Logged In', 'Reviewer shk hu  Logged In ', '-', '122.168.114.106', '2024-10-23 12:23:44', '2024-10-23 12:23:44'),
(259, 2, '2024-10-24', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-24 04:56:01', '2024-10-24 04:56:01'),
(260, 9, '2024-10-24', '-', 0, ' Logged In', 'Reviewer shk hu  Logged In ', '-', NULL, '2024-10-24 04:56:34', '2024-10-24 04:56:34'),
(261, 2, '2024-10-24', 'customer', 19, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_CUS_000019(CUSTOMER15)', 'created', '122.168.114.106', '2024-10-24 04:59:36', '2024-10-24 04:59:36'),
(262, 2, '2024-10-24', 'customer', 20, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_sfs_000020(sfsfs)', 'created', NULL, '2024-10-24 05:06:43', '2024-10-24 05:06:43'),
(263, 2, '2024-10-24', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-24 05:09:05', '2024-10-24 05:09:05'),
(264, 2, '2024-10-24', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-24 05:09:07', '2024-10-24 05:09:07'),
(265, 9, '2024-10-24', '-', 0, ' Logged Out', 'Reviewer shk hu  Logged Out ', '-', NULL, '2024-10-24 05:30:05', '2024-10-24 05:30:05'),
(266, 9, '2024-10-24', '-', 0, ' Logged In', 'Reviewer shk hu  Logged In ', '-', NULL, '2024-10-24 05:30:33', '2024-10-24 05:30:33'),
(267, 9, '2024-10-24', '-', 0, ' Logged Out', 'Reviewer shk hu  Logged Out ', '-', NULL, '2024-10-24 05:32:30', '2024-10-24 05:32:30'),
(268, 9, '2024-10-24', '-', 0, ' Logged In', 'Reviewer shk hu  Logged In ', '-', '122.168.114.106', '2024-10-24 05:36:10', '2024-10-24 05:36:10'),
(269, 9, '2024-10-24', '-', 0, ' Logged Out', 'Reviewer shk hu  Logged Out ', '-', '122.168.114.106', '2024-10-24 05:37:52', '2024-10-24 05:37:52'),
(270, 9, '2024-10-24', '-', 0, ' Logged In', 'Reviewer shk hu  Logged In ', '-', '122.168.114.106', '2024-10-24 05:38:00', '2024-10-24 05:38:00'),
(271, 2, '2024-10-24', 'job', 24, 'created job code:', 'Admin Amit Amit created job code: A L_DDD_000021', 'created', NULL, '2024-10-24 06:41:22', '2024-10-24 06:41:22'),
(272, 2, '2024-10-24', 'customer', 21, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_SDH_000021(SDHKH)', 'created', '122.168.114.106', '2024-10-24 06:46:34', '2024-10-24 06:46:34'),
(273, 2, '2024-10-24', 'client', 15, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_SDH_EEE_000015(EEEEE)', 'created', '122.168.114.106', '2024-10-24 06:47:19', '2024-10-24 06:47:19'),
(274, 2, '2024-10-24', 'client', 16, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_DDD_rrr_000016(rrrrrr)', 'created', NULL, '2024-10-24 06:51:05', '2024-10-24 06:51:05'),
(275, 2, '2024-10-24', 'job', 25, 'created job code:', 'Admin Amit Amit created job code: SDH_EEE_000022', 'created', '122.168.114.106', '2024-10-24 07:19:17', '2024-10-24 07:19:17'),
(276, 2, '2024-10-24', 'customer', 21, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_SDH_000021(SDHKH)', 'updated', '122.168.114.106', '2024-10-24 07:20:44', '2024-10-24 07:20:44'),
(277, 2, '2024-10-24', 'customer', 22, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_QQQ_000022(QQQQ)', 'created', '122.168.114.106', '2024-10-24 07:28:48', '2024-10-24 07:28:48'),
(278, 2, '2024-10-24', 'client', 17, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_QQQ_QQQ_000017(QQQ)', 'created', '122.168.114.106', '2024-10-24 07:29:49', '2024-10-24 07:29:49'),
(279, 18, '2024-10-25', '-', 0, ' Logged In With Microsoft', 'Management aj ssss  Logged In With Microsoft ', '-', '122.168.114.106', '2024-10-25 05:04:32', '2024-10-25 05:04:32'),
(280, 18, '2024-10-25', '-', 0, ' Logged Out', 'Management aj ssss  Logged Out ', '-', '122.168.114.106', '2024-10-25 05:04:45', '2024-10-25 05:04:45'),
(281, 18, '2024-10-25', '-', 0, ' Logged In With Microsoft', 'Management aj ssss  Logged In With Microsoft ', '-', '122.168.114.106', '2024-10-25 05:08:06', '2024-10-25 05:08:06'),
(282, 6, '2024-10-25', '-', 0, ' Logged In With Microsoft', 'Processor Nikita  bhagat  Logged In With Microsoft ', '-', NULL, '2024-10-25 05:09:46', '2024-10-25 05:09:46'),
(283, 6, '2024-10-25', '-', 0, ' Logged In With Microsoft', 'Processor Nikita  bhagat  Logged In With Microsoft ', '-', '122.168.114.106', '2024-10-25 05:10:54', '2024-10-25 05:10:54'),
(284, 9, '2024-10-25', '-', 0, ' Logged In', 'Reviewer shk hu  Logged In ', '-', '122.168.114.106', '2024-10-25 05:43:57', '2024-10-25 05:43:57'),
(285, 2, '2024-10-25', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-25 08:52:27', '2024-10-25 08:52:27'),
(286, 9, '2024-10-25', '-', 0, ' Logged Out', 'Reviewer shk hu  Logged Out ', '-', '122.168.114.106', '2024-10-25 09:14:04', '2024-10-25 09:14:04'),
(287, 18, '2024-10-25', '-', 0, ' Logged In With Microsoft', 'Management aj ssss  Logged In With Microsoft ', '-', '122.168.114.106', '2024-10-25 12:00:26', '2024-10-25 12:00:26'),
(288, 18, '2024-10-25', '-', 0, ' Logged In With Microsoft', 'Management aj ssss  Logged In With Microsoft ', '-', NULL, '2024-10-25 12:04:56', '2024-10-25 12:04:56'),
(289, 18, '2024-10-25', '-', 0, ' Logged In With Microsoft', 'Management aj ssss  Logged In With Microsoft ', '-', '122.168.114.106', '2024-10-25 12:08:37', '2024-10-25 12:08:37'),
(290, 18, '2024-10-25', '-', 0, ' Logged In With Microsoft', 'Management aj ssss  Logged In With Microsoft ', '-', NULL, '2024-10-25 12:21:17', '2024-10-25 12:21:17'),
(291, 18, '2024-10-25', '-', 0, ' Logged In With Microsoft', 'Management aj ssss  Logged In With Microsoft ', '-', '122.168.114.106', '2024-10-25 12:35:52', '2024-10-25 12:35:52'),
(292, 18, '2024-10-25', '-', 0, ' Logged Out', 'Management aj ssss  Logged Out ', '-', '122.168.114.106', '2024-10-25 12:36:00', '2024-10-25 12:36:00'),
(293, 18, '2024-10-25', '-', 0, ' Logged In With Microsoft', 'Management aj ssss  Logged In With Microsoft ', '-', NULL, '2024-10-25 12:36:11', '2024-10-25 12:36:11'),
(294, 2, '2024-10-26', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-10-26 09:29:54', '2024-10-26 09:29:54'),
(295, 2, '2024-10-28', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-10-28 05:07:02', '2024-10-28 05:07:02'),
(296, 2, '2024-10-29', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-10-29 08:34:34', '2024-10-29 08:34:35'),
(297, 2, '2024-10-29', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-29 10:46:10', '2024-10-29 10:46:10'),
(298, 2, '2024-10-30', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-10-30 13:19:10', '2024-10-30 13:19:10'),
(299, 2, '2024-10-30', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-10-30 13:19:14', '2024-10-30 13:19:14'),
(300, 2, '2024-11-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-04 04:41:43', '2024-11-04 04:41:43'),
(301, 2, '2024-11-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-11-04 06:05:51', '2024-11-04 06:05:51'),
(302, 2, '2024-11-04', 'job', 26, 'created job code:', 'Admin Amit Amit created job code: SDH_EEE_000023', 'created', NULL, '2024-11-04 06:08:43', '2024-11-04 06:08:43'),
(303, 2, '2024-11-04', 'job', 26, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: SDH_EEE_000023', 'created', '122.168.114.106', '2024-11-04 06:40:00', '2024-11-04 06:40:00'),
(304, 2, '2024-11-04', 'job', 26, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: SDH_EEE_000023', 'created', '122.168.114.106', '2024-11-04 06:40:14', '2024-11-04 06:40:14'),
(305, 6, '2024-11-05', '-', 0, ' Logged In With Microsoft', 'Processor Nikita  bhagat  Logged In With Microsoft ', '-', '122.168.114.106', '2024-11-05 05:37:08', '2024-11-05 05:37:08'),
(306, 6, '2024-11-05', '-', 0, ' Logged In With Microsoft', 'Processor Nikita  bhagat  Logged In With Microsoft ', '-', NULL, '2024-11-05 12:35:26', '2024-11-05 12:35:26'),
(307, 2, '2024-11-06', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-06 06:11:04', '2024-11-06 06:11:04'),
(308, 2, '2024-11-06', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-11-06 12:44:39', '2024-11-06 12:44:39'),
(309, 2, '2024-11-06', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-06 12:44:44', '2024-11-06 12:44:44'),
(310, 9, '2024-11-06', '-', 0, ' Logged In', 'Reviewer shk hu  Logged In ', '-', '122.168.114.106', '2024-11-06 12:47:09', '2024-11-06 12:47:09'),
(311, 9, '2024-11-06', '-', 0, ' Logged Out', 'Reviewer shk hu  Logged Out ', '-', '122.168.114.106', '2024-11-06 12:47:12', '2024-11-06 12:47:12'),
(312, 9, '2024-11-06', '-', 0, ' Logged In', 'Reviewer shk hu  Logged In ', '-', '122.168.114.106', '2024-11-06 12:47:19', '2024-11-06 12:47:19'),
(313, 2, '2024-11-07', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-11-07 05:42:55', '2024-11-07 05:42:55'),
(314, 2, '2024-11-08', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-08 10:27:54', '2024-11-08 10:27:54'),
(315, 2, '2024-11-09', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-11-09 09:17:07', '2024-11-09 09:17:07'),
(316, 2, '2024-11-09', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-11-09 11:31:14', '2024-11-09 11:31:14'),
(317, 2, '2024-11-09', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-09 11:32:13', '2024-11-09 11:32:13'),
(318, 2, '2024-11-11', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-11 10:20:26', '2024-11-11 10:20:26'),
(319, 2, '2024-11-11', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-11-11 11:01:14', '2024-11-11 11:01:14'),
(320, 2, '2024-11-11', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', NULL, '2024-11-11 11:02:07', '2024-11-11 11:02:07'),
(321, 2, '2024-11-11', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-11-11 11:02:11', '2024-11-11 11:02:11'),
(322, 2, '2024-11-11', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', NULL, '2024-11-11 11:02:46', '2024-11-11 11:02:46'),
(323, 2, '2024-11-11', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-11 11:03:36', '2024-11-11 11:03:36'),
(324, 2, '2024-11-11', 'job', 6, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_SFF_VAT1_00006', 'updated', '122.168.114.106', '2024-11-11 11:06:06', '2024-11-11 11:06:06'),
(325, 2, '2024-11-11', 'staff', 18, 'edited staff aj ssss', 'Admin Amit Amit edited staff aj ssss ', 'updated', '122.168.114.106', '2024-11-11 11:53:55', '2024-11-11 11:53:55'),
(326, 2, '2024-11-12', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-12 07:02:38', '2024-11-12 07:02:38'),
(327, 2, '2024-11-12', 'job', 5, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_SFF_VAT1_00005', 'created', '122.168.114.106', '2024-11-12 11:49:00', '2024-11-12 11:49:00'),
(328, 2, '2024-11-12', 'job', 5, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_SFF_VAT1_00005', 'created', '122.168.114.106', '2024-11-12 11:51:23', '2024-11-12 11:51:23'),
(329, 2, '2024-11-12', 'job', 6, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_SFF_VAT1_00006', 'created', '122.168.114.106', '2024-11-12 12:02:13', '2024-11-12 12:02:13'),
(330, 2, '2024-11-12', 'job', 6, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_SFF_VAT1_00006', 'created', '122.168.114.106', '2024-11-12 12:12:44', '2024-11-12 12:12:44'),
(331, 2, '2024-11-12', 'role', 4, 'edited role Manager', 'Admin Amit Amit edited role Manager ', 'updated', '122.168.114.106', '2024-11-12 12:15:47', '2024-11-12 12:15:47'),
(332, 2, '2024-11-12', 'role', 4, 'edited role Manager', 'Admin Amit Amit edited role Manager ', 'updated', '122.168.114.106', '2024-11-12 12:25:17', '2024-11-12 12:25:17'),
(333, 2, '2024-11-12', 'role', 4, 'edited role Manager', 'Admin Amit Amit edited role Manager ', 'updated', '122.168.114.106', '2024-11-12 12:27:59', '2024-11-12 12:27:59'),
(334, 2, '2024-11-13', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-13 12:51:09', '2024-11-13 12:51:09'),
(335, 2, '2024-11-14', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-14 04:43:49', '2024-11-14 04:43:49'),
(336, 2, '2024-11-14', 'job', 6, 'completed the draft job code:', 'Admin Amit Amit completed the draft job code: CUS_SFF_VAT1_00006', 'updated', '122.168.114.106', '2024-11-14 06:06:31', '2024-11-14 06:06:31'),
(337, 2, '2024-11-14', 'job', 6, 'completed the draft job code:', 'Admin Amit Amit completed the draft job code: CUS_SFF_VAT1_00006', 'updated', '122.168.114.106', '2024-11-14 06:07:21', '2024-11-14 06:07:21'),
(338, 2, '2024-11-14', 'job', 6, 'completed the draft job code:', 'Admin Amit Amit completed the draft job code: CUS_SFF_VAT1_00006', 'updated', '122.168.114.106', '2024-11-14 06:07:32', '2024-11-14 06:07:32'),
(339, 2, '2024-11-14', 'job', 5, 'completed the missing logs job code:', 'Admin Amit Amit completed the missing logs job code: CUS_SFF_VAT1_00005', 'updated', '122.168.114.106', '2024-11-14 08:43:27', '2024-11-14 08:43:27'),
(340, 2, '2024-11-14', 'job', 5, 'completed the draft job code:', 'Admin Amit Amit completed the draft job code: CUS_SFF_VAT1_00005', 'updated', '122.168.114.106', '2024-11-14 08:43:35', '2024-11-14 08:43:35'),
(341, 2, '2024-11-14', 'job', 4, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_ada_Vat5_00004', 'created', '122.168.114.106', '2024-11-14 09:12:51', '2024-11-14 09:12:51'),
(342, 2, '2024-11-15', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-15 04:44:03', '2024-11-15 04:44:03'),
(343, 2, '2024-11-15', 'job', 27, 'created job code:', 'Admin Amit Amit created job code: QQQ_QQQ_VAT1_000024', 'created', '122.168.114.106', '2024-11-15 05:43:54', '2024-11-15 05:43:54'),
(344, 2, '2024-11-16', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-16 07:15:14', '2024-11-16 07:15:14'),
(345, 2, '2024-11-18', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-18 04:50:55', '2024-11-18 04:50:55'),
(346, 2, '2024-11-18', 'customer contact person role', 8, 'created customer contact person role role 2', 'Admin Amit Amit created customer contact person role role 2 ', 'created', '122.168.114.106', '2024-11-18 09:25:36', '2024-11-18 09:25:36'),
(347, 2, '2024-11-18', 'customer contact person role', 8, 'deleted customer contact person role role 2', 'Admin Amit Amit deleted customer contact person role role 2 ', 'deleted', '122.168.114.106', '2024-11-18 09:25:42', '2024-11-18 09:25:42'),
(348, 2, '2024-11-18', 'Sub Internal', 9, 'changes the Sub Internal status Deactivate aa', 'Admin Amit Amit changes the Sub Internal status Deactivate aa ', 'updated', '122.168.114.106', '2024-11-18 10:16:30', '2024-11-18 10:16:31'),
(349, 2, '2024-11-18', 'Internal', 8, 'created Internal Job/Project in fff', 'Admin Amit Amit created Internal Job/Project in fff ', 'created', '122.168.114.106', '2024-11-18 10:22:17', '2024-11-18 10:22:17'),
(350, 2, '2024-11-18', 'Internal', 8, 'edited Internal Job/Project ff', 'Admin Amit Amit edited Internal Job/Project ff ', 'updated', '122.168.114.106', '2024-11-18 10:22:36', '2024-11-18 10:22:36'),
(351, 2, '2024-11-18', 'Internal', 8, 'Deleted Internal Job/Project ff', 'Admin Amit Amit Deleted Internal Job/Project ff ', 'deleted', '122.168.114.106', '2024-11-18 10:22:48', '2024-11-18 10:22:48'),
(352, 2, '2024-11-18', 'Internal', 12, 'created Internal Task in jjjjj', 'Admin Amit Amit created Internal Task in jjjjj ', 'created', '122.168.114.106', '2024-11-18 10:26:31', '2024-11-18 10:26:31'),
(353, 2, '2024-11-18', 'Sub Internal', 12, 'edited Internal Task jjjjjppp', 'Admin Amit Amit edited Internal Task jjjjjppp ', 'updated', '122.168.114.106', '2024-11-18 10:26:41', '2024-11-18 10:26:41'),
(354, 2, '2024-11-18', 'Sub Internal', 12, 'deleted Internal Task jjjjjppp', 'Admin Amit Amit deleted Internal Task jjjjjppp ', 'deleted', '122.168.114.106', '2024-11-18 10:26:50', '2024-11-18 10:26:50'),
(355, 2, '2024-11-18', 'Internal', 9, 'created Internal Job/Project in ttttt', 'Admin Amit Amit created Internal Job/Project in ttttt ', 'created', '122.168.114.106', '2024-11-18 12:06:28', '2024-11-18 12:06:28'),
(356, 2, '2024-11-18', 'Internal', 9, 'edited Internal Job/Project tttgdgdghb', 'Admin Amit Amit edited Internal Job/Project tttgdgdghb ', 'updated', '122.168.114.106', '2024-11-18 12:07:08', '2024-11-18 12:07:08'),
(357, 2, '2024-11-18', 'Internal', 9, 'Deleted Internal Job/Project tttgdgdghb', 'Admin Amit Amit Deleted Internal Job/Project tttgdgdghb ', 'deleted', '122.168.114.106', '2024-11-18 12:07:32', '2024-11-18 12:07:32'),
(358, 2, '2024-11-18', 'customer', 21, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_SDH_000021(SDHKH)', 'updated', '122.168.114.106', '2024-11-18 12:10:15', '2024-11-18 12:10:15'),
(359, 2, '2024-11-18', 'checklist', 6, 'created checklist WQW', 'Admin Amit Amit created checklist WQW ', 'created', '122.168.114.106', '2024-11-18 12:20:45', '2024-11-18 12:20:45'),
(360, 2, '2024-11-18', 'customer', 23, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_FFF_000023(FFFFF)', 'created', '122.168.114.106', '2024-11-18 12:22:10', '2024-11-18 12:22:10'),
(361, 2, '2024-11-18', 'client', 18, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_FFF_BBB_000018(BBBB)', 'created', '122.168.114.106', '2024-11-18 12:25:50', '2024-11-18 12:25:50'),
(362, 2, '2024-11-18', 'job types', 7, 'deleted job types ABS', 'Admin Amit Amit deleted job types ABS ', 'deleted', '122.168.114.106', '2024-11-18 13:27:35', '2024-11-18 13:27:35'),
(363, 2, '2024-11-19', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-19 04:39:44', '2024-11-19 04:39:44'),
(364, 2, '2024-11-19', 'customer', 23, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_FFF_000023(FFFFF)', 'updated', '122.168.114.106', '2024-11-19 04:49:42', '2024-11-19 04:49:42'),
(365, 2, '2024-11-19', 'checklist', 7, 'created checklist RRRRR', 'Admin Amit Amit created checklist RRRRR ', 'created', '122.168.114.106', '2024-11-19 04:59:30', '2024-11-19 04:59:30'),
(366, 2, '2024-11-19', 'customer', 24, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_rrr_000024(rrrrrrrrr)', 'created', '122.168.114.106', '2024-11-19 05:18:40', '2024-11-19 05:18:40'),
(367, 2, '2024-11-19', 'permission', 3, ' updated the access for PROCESSOR. Access Changes Add Permission (status-update) Delete Permission (customer-update, status-insert)', 'Admin Amit Amit  updated the access for PROCESSOR. Access Changes Add Permission (status-update) Delete Permission (customer-update, status-insert) ', 'updated', '122.168.114.106', '2024-11-19 08:28:52', '2024-11-19 08:28:52'),
(368, 2, '2024-11-19', 'permission', 3, ' updated the access for PROCESSOR. Access Changes  Delete Permission (status-update)', 'Admin Amit Amit  updated the access for PROCESSOR. Access Changes  Delete Permission (status-update) ', 'updated', '122.168.114.106', '2024-11-19 08:29:11', '2024-11-19 08:29:11'),
(369, 2, '2024-11-19', 'permission', 3, ' updated the access for PROCESSOR. Access Changes Add Permission (customer-view) ', 'Admin Amit Amit  updated the access for PROCESSOR. Access Changes Add Permission (customer-view)  ', 'updated', '122.168.114.106', '2024-11-19 08:29:27', '2024-11-19 08:29:27'),
(370, 2, '2024-11-19', 'permission', 3, ' updated the access for PROCESSOR. Access Changes Add Permission (customer-update, status-insert, status-update) ', 'Admin Amit Amit  updated the access for PROCESSOR. Access Changes Add Permission (customer-update, status-insert, status-update)  ', 'updated', '122.168.114.106', '2024-11-19 08:30:49', '2024-11-19 08:30:49'),
(371, 2, '2024-11-19', 'permission', 5, ' updated the access for LEADERSHIP. Access Changes Add Permission (client-view) Delete Permission (status-view)', 'Admin Amit Amit  updated the access for LEADERSHIP. Access Changes Add Permission (client-view) Delete Permission (status-view) ', 'updated', '122.168.114.106', '2024-11-19 08:47:31', '2024-11-19 08:47:31'),
(372, 6, '2024-11-19', '-', 0, ' Logged In', 'Processor Nikita  bhagat  Logged In ', '-', NULL, '2024-11-19 10:51:14', '2024-11-19 10:51:14'),
(373, 2, '2024-11-19', 'job', 28, 'created job code:', 'Admin Amit Amit created job code: grs_DDD_VAT3_000025', 'created', '122.168.114.106', '2024-11-19 12:13:23', '2024-11-19 12:13:23'),
(374, 2, '2024-11-19', 'job', 28, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: grs_DDD_VAT3_000025', 'created', '122.168.114.106', '2024-11-19 12:27:15', '2024-11-19 12:27:15'),
(375, 2, '2024-11-19', 'customer', 20, 'added FTE/Dedicated Staffing (engagement model) customer code :', 'Admin Amit Amit added FTE/Dedicated Staffing (engagement model) customer code : cust_sfs_000020(sfsfs)', 'updated', '122.168.114.106', '2024-11-19 12:30:15', '2024-11-19 12:30:15'),
(376, 6, '2024-11-19', 'customer', 25, 'created customer profile. customer code :', 'Processor Nikita  bhagat created customer profile. customer code : cust_sss_000025(sss)', 'created', '122.168.114.106', '2024-11-19 12:38:02', '2024-11-19 12:38:02'),
(377, 2, '2024-11-19', 'permission', 3, ' updated the access for PROCESSOR. Access Changes  Delete Permission (customer-update, status-update)', 'Admin Amit Amit  updated the access for PROCESSOR. Access Changes  Delete Permission (customer-update, status-update) ', 'updated', '122.168.114.106', '2024-11-19 13:23:06', '2024-11-19 13:23:06'),
(378, 2, '2024-11-20', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-20 05:17:30', '2024-11-20 05:17:30'),
(379, 2, '2024-11-20', 'customer', 26, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_uuu_000026(uuu)', 'created', '122.168.114.106', '2024-11-20 06:28:39', '2024-11-20 06:28:39'),
(380, 2, '2024-11-20', 'customer', 27, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_RRR_000027(RRR)', 'created', '122.168.114.106', '2024-11-20 09:04:52', '2024-11-20 09:04:52'),
(381, 2, '2024-11-23', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-23 05:41:26', '2024-11-23 05:41:26'),
(382, 2, '2024-11-23', 'job', 29, 'created job code:', 'Admin Amit Amit created job code: CUS_SFF_Vat5_000026', 'created', '122.168.114.106', '2024-11-23 05:45:05', '2024-11-23 05:45:05'),
(383, 2, '2024-11-23', 'job', 30, 'created job code:', 'Admin Amit Amit created job code: CUS_SFF_VAT2_000027', 'created', '122.168.114.106', '2024-11-23 05:49:42', '2024-11-23 05:49:42'),
(384, 5, '2024-11-23', '-', 0, ' Logged In', 'Manager staff manager staff manager  Logged In ', '-', NULL, '2024-11-23 06:23:15', '2024-11-23 06:23:15'),
(385, 2, '2024-11-23', 'customer', 27, 'edited sole trader information. customer code :', 'Admin Amit Amit edited sole trader information. customer code : cust_RRR_000027(RRR)', 'updated', '122.168.114.106', '2024-11-23 06:23:47', '2024-11-23 06:23:47'),
(386, 2, '2024-11-23', 'customer', 27, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_RRR_000027(RRR)', 'updated', '122.168.114.106', '2024-11-23 06:23:49', '2024-11-23 06:23:49'),
(387, 2, '2024-11-23', 'customer', 26, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_uuu_000026(uuu)', 'updated', '122.168.114.106', '2024-11-23 06:24:37', '2024-11-23 06:24:37'),
(388, 2, '2024-11-23', 'customer', 26, 'added FTE/Dedicated Staffing (engagement model) customer code :', 'Admin Amit Amit added FTE/Dedicated Staffing (engagement model) customer code : cust_uuu_000026(uuu)', 'updated', '122.168.114.106', '2024-11-23 06:24:44', '2024-11-23 06:24:44'),
(389, 5, '2024-11-23', '-', 0, ' Logged Out', 'Manager staff manager staff manager  Logged Out ', '-', '122.168.114.106', '2024-11-23 06:26:03', '2024-11-23 06:26:03'),
(390, 2, '2024-11-23', 'staff', 5, 'changes the staff status Deactivate staff manager staff manager', 'Admin Amit Amit changes the staff status Deactivate staff manager staff manager ', 'updated', '122.168.114.106', '2024-11-23 06:26:27', '2024-11-23 06:26:27'),
(391, 2, '2024-11-23', 'staff', 5, 'changes the staff status Activate staff manager staff manager', 'Admin Amit Amit changes the staff status Activate staff manager staff manager ', 'updated', '122.168.114.106', '2024-11-23 06:27:19', '2024-11-23 06:27:19'),
(392, 2, '2024-11-23', 'customer source', 10, 'created customer source AAAAA', 'Admin Amit Amit created customer source AAAAA ', 'created', '122.168.114.106', '2024-11-23 07:21:40', '2024-11-23 07:21:40'),
(393, 2, '2024-11-23', 'customer sub source', 13, 'created customer sub source f', 'Admin Amit Amit created customer sub source f ', 'created', '122.168.114.106', '2024-11-23 07:22:00', '2024-11-23 07:22:00'),
(394, 2, '2024-11-23', 'customer sub source', 14, 'created customer sub source ff', 'Admin Amit Amit created customer sub source ff ', 'created', '122.168.114.106', '2024-11-23 07:22:04', '2024-11-23 07:22:04'),
(395, 5, '2024-11-23', '-', 0, ' Logged In', 'Manager staff manager staff manager  Logged In ', '-', '122.168.114.106', '2024-11-23 08:29:00', '2024-11-23 08:29:00'),
(396, 5, '2024-11-23', '-', 0, ' Logged Out', 'Manager staff manager staff manager  Logged Out ', '-', '122.168.114.106', '2024-11-23 08:29:07', '2024-11-23 08:29:07'),
(397, 12, '2024-11-23', '-', 0, ' Logged In', 'Reviewer SSSSFGGG DDFSFSF  Logged In ', '-', '122.168.114.106', '2024-11-23 08:30:19', '2024-11-23 08:30:19'),
(398, 2, '2024-11-23', 'job', 30, 'edited the job information and has assigned the job to the reviewer, SSSSFGGG DDFSFSF job code:', 'Admin Amit Amit edited the job information and has assigned the job to the reviewer, SSSSFGGG DDFSFSF job code: CUS_SFF_VAT2_000027', 'updated', '122.168.114.106', '2024-11-23 08:31:09', '2024-11-23 08:31:09'),
(399, 2, '2024-11-23', 'permission', 8, ' updated the access for MANAGEMENT. Access Changes Add Permission (job-update, job-view) ', 'Admin Amit Amit  updated the access for MANAGEMENT. Access Changes Add Permission (job-update, job-view)  ', 'updated', '122.168.114.106', '2024-11-23 08:32:01', '2024-11-23 08:32:01'),
(400, 2, '2024-11-23', 'permission', 6, ' updated the access for REVIEWER. Access Changes Add Permission (job-update) ', 'Admin Amit Amit  updated the access for REVIEWER. Access Changes Add Permission (job-update)  ', 'updated', '122.168.114.106', '2024-11-23 08:32:30', '2024-11-23 08:32:30'),
(401, 2, '2024-11-23', 'permission', 6, ' updated the access for REVIEWER. Access Changes Add Permission (client-insert) ', 'Admin Amit Amit  updated the access for REVIEWER. Access Changes Add Permission (client-insert)  ', 'updated', '122.168.114.106', '2024-11-23 09:26:51', '2024-11-23 09:26:51'),
(402, 12, '2024-11-23', 'client', 19, 'created client profile. client code :', 'Reviewer SSSSFGGG DDFSFSF created client profile. client code : cli_CUS_SHK_000019(SHKAHAHAAHAH)', 'created', '122.168.114.106', '2024-11-23 09:27:21', '2024-11-23 09:27:21'),
(403, 12, '2024-11-23', 'client', 20, 'created client profile. client code :', 'Reviewer SSSSFGGG DDFSFSF created client profile. client code : cli_CUS_DDD_000020(DDDDD)', 'created', '122.168.114.106', '2024-11-23 09:49:43', '2024-11-23 09:49:43'),
(404, 2, '2024-11-23', 'client', 21, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_FFF_sad_000021(sadcss)', 'created', '122.168.114.106', '2024-11-23 09:50:10', '2024-11-23 09:50:10'),
(405, 12, '2024-11-23', '-', 0, ' Logged Out', 'Reviewer SSSSFGGG DDFSFSF  Logged Out ', '-', '122.168.114.106', '2024-11-23 10:08:25', '2024-11-23 10:08:25'),
(406, 11, '2024-11-23', '-', 0, ' Logged In', 'Manager sss sss  Logged In ', '-', '122.168.114.106', '2024-11-23 10:08:41', '2024-11-23 10:08:41'),
(407, 2, '2024-11-23', 'customer', 25, 'edited sole trader information. customer code :', 'Admin Amit Amit edited sole trader information. customer code : cust_sss_000025(sss)', 'updated', '122.168.114.106', '2024-11-23 10:09:34', '2024-11-23 10:09:34'),
(408, 2, '2024-11-23', 'customer', 25, 'edited sole trader information. customer code :', 'Admin Amit Amit edited sole trader information. customer code : cust_sss_000025(sss)', 'updated', '122.168.114.106', '2024-11-23 10:10:00', '2024-11-23 10:10:00'),
(409, 2, '2024-11-23', 'customer', 25, 'edited sole trader information. customer code :', 'Admin Amit Amit edited sole trader information. customer code : cust_sss_000025(sss)', 'updated', '122.168.114.106', '2024-11-23 10:10:39', '2024-11-23 10:10:39'),
(410, 2, '2024-11-23', 'permission', 4, ' updated the access for MANAGER. Access Changes Add Permission (client-insert) ', 'Admin Amit Amit  updated the access for MANAGER. Access Changes Add Permission (client-insert)  ', 'updated', '122.168.114.106', '2024-11-23 10:17:45', '2024-11-23 10:17:45'),
(411, 11, '2024-11-23', 'client', 22, 'created client profile. client code :', 'Manager sss sss created client profile. client code : cli_A L_S11_000022(S11)', 'created', '122.168.114.106', '2024-11-23 10:18:04', '2024-11-23 10:18:04'),
(412, 2, '2024-11-23', 'services', 5, 'changes the services status Activate Payroll', 'Admin Amit Amit changes the services status Activate Payroll ', 'updated', '122.168.114.106', '2024-11-23 10:23:20', '2024-11-23 10:23:20'),
(413, 2, '2024-11-23', 'job types', 9, 'created job types as', 'Admin Amit Amit created job types as ', 'created', '122.168.114.106', '2024-11-23 10:23:42', '2024-11-23 10:23:42'),
(414, 2, '2024-11-23', 'task', 0, 'created task a,b,c,', 'Admin Amit Amit created task a,b,c, ', 'created', '122.168.114.106', '2024-11-23 10:24:06', '2024-11-23 10:24:06'),
(415, 2, '2024-11-23', 'checklist', 8, 'created checklist WWW', 'Admin Amit Amit created checklist WWW ', 'created', '122.168.114.106', '2024-11-23 10:25:38', '2024-11-23 10:25:38'),
(416, 11, '2024-11-23', 'client', 23, 'created client profile. client code :', 'Manager sss sss created client profile. client code : cli_A L_sss_000023(sss22)', 'created', '122.168.114.106', '2024-11-23 10:27:37', '2024-11-23 10:27:37'),
(417, 2, '2024-11-23', 'customer', 27, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_RRR_000027(RRR)', 'updated', '122.168.114.106', '2024-11-23 10:29:26', '2024-11-23 10:29:26'),
(418, 2, '2024-11-23', 'customer', 28, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_444_000028(444dddd)', 'created', '122.168.114.106', '2024-11-23 10:30:53', '2024-11-23 10:30:53'),
(419, 2, '2024-11-23', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-11-23 10:32:19', '2024-11-23 10:32:19'),
(420, 2, '2024-11-23', 'client', 24, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_444_SSS_000024(SSSS)', 'created', '122.168.114.106', '2024-11-23 10:33:29', '2024-11-23 10:33:29'),
(421, 2, '2024-11-23', 'client', 25, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_444_DSA_000025(DSA)', 'created', '122.168.114.106', '2024-11-23 10:35:42', '2024-11-23 10:35:42'),
(422, 2, '2024-11-23', 'job', 5, 'edited the job information and has assigned the job to the processor, staff staff job code:', 'Admin Amit Amit edited the job information and has assigned the job to the processor, staff staff job code: CUS_SFF_VAT1_00005', 'updated', '122.168.114.106', '2024-11-23 10:45:29', '2024-11-23 10:45:29'),
(423, 2, '2024-11-23', 'job', 31, 'created job code:', 'Admin Amit Amit created job code: 444_SSS_as_000028', 'created', '122.168.114.106', '2024-11-23 10:49:26', '2024-11-23 10:49:26'),
(424, 2, '2024-11-23', 'job', 31, 'sent the queries for job code:', 'Admin Amit Amit sent the queries for job code: 444_SSS_as_000028', 'created', '122.168.114.106', '2024-11-23 10:49:41', '2024-11-23 10:49:41'),
(425, 2, '2024-11-23', 'job', 31, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: 444_SSS_as_000028', 'created', '122.168.114.106', '2024-11-23 10:49:56', '2024-11-23 10:49:56'),
(426, 2, '2024-11-23', 'job', 31, 'completed the draft job code:', 'Admin Amit Amit completed the draft job code: 444_SSS_as_000028', 'updated', '122.168.114.106', '2024-11-23 10:50:25', '2024-11-23 10:50:25'),
(427, 2, '2024-11-23', 'job', 32, 'created job code:', 'Admin Amit Amit created job code: 444_SSS_as_000029', 'created', '122.168.114.106', '2024-11-23 10:52:20', '2024-11-23 10:52:20'),
(428, 2, '2024-11-23', 'job', 32, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: 444_SSS_as_000029', 'created', '122.168.114.106', '2024-11-23 10:52:36', '2024-11-23 10:52:36'),
(429, 2, '2024-11-23', 'client', 26, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_444_ERE_000026(ERE)', 'created', '122.168.114.106', '2024-11-23 10:57:55', '2024-11-23 10:57:55'),
(430, 11, '2024-11-23', '-', 0, ' Logged Out', 'Manager sss sss  Logged Out ', '-', '122.168.114.106', '2024-11-23 11:03:16', '2024-11-23 11:03:16'),
(431, 12, '2024-11-23', '-', 0, ' Logged In', 'Reviewer SSSSFGGG DDFSFSF  Logged In ', '-', '122.168.114.106', '2024-11-23 11:03:37', '2024-11-23 11:03:37'),
(432, 2, '2024-11-23', 'job', 33, 'created job code:', 'Admin Amit Amit created job code: CUS_DDD_Vat5_000030', 'created', '122.168.114.106', '2024-11-23 11:04:35', '2024-11-23 11:04:35'),
(433, 2, '2024-11-23', 'job', 33, 'edited the job information and has assigned the job to the reviewer, SSSSFGGG DDFSFSF job code:', 'Admin Amit Amit edited the job information and has assigned the job to the reviewer, SSSSFGGG DDFSFSF job code: CUS_DDD_Vat5_000030', 'updated', '122.168.114.106', '2024-11-23 11:05:05', '2024-11-23 11:05:05'),
(434, 2, '2024-11-23', 'customer', 29, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_EEE_000029(EEEE)', 'created', '122.168.114.106', '2024-11-23 11:15:20', '2024-11-23 11:15:20'),
(435, 2, '2024-11-23', 'client', 27, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_EEE_ttt_000027(ttt)', 'created', '122.168.114.106', '2024-11-23 11:16:10', '2024-11-23 11:16:10'),
(436, 2, '2024-11-23', 'job', 34, 'created job code:', 'Admin Amit Amit created job code: EEE_ttt_as_000031', 'created', '122.168.114.106', '2024-11-23 11:16:37', '2024-11-23 11:16:37'),
(437, 2, '2024-11-23', 'permission', 4, ' updated the access for MANAGER. Access Changes Add Permission (report-view) Remove Permission (report-insert)', 'Admin Amit Amit  updated the access for MANAGER. Access Changes Add Permission (report-view) Remove Permission (report-insert) ', 'updated', '122.168.114.106', '2024-11-23 11:18:11', '2024-11-23 11:18:11'),
(438, 12, '2024-11-23', '-', 0, ' Logged Out', 'Reviewer SSSSFGGG DDFSFSF  Logged Out ', '-', '122.168.114.106', '2024-11-23 11:18:16', '2024-11-23 11:18:16'),
(439, 10, '2024-11-23', '-', 0, ' Logged In', 'Manager MAN1 HHH  Logged In ', '-', '122.168.114.106', '2024-11-23 11:18:55', '2024-11-23 11:18:55'),
(440, 10, '2024-11-23', '-', 0, ' Logged Out', 'Manager MAN1 HHH  Logged Out ', '-', '122.168.114.106', '2024-11-23 11:29:27', '2024-11-23 11:29:27'),
(441, 12, '2024-11-23', '-', 0, ' Logged In', 'Reviewer SSSSFGGG DDFSFSF  Logged In ', '-', '122.168.114.106', '2024-11-23 11:29:48', '2024-11-23 11:29:48'),
(442, 2, '2024-11-23', 'job', 34, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: EEE_ttt_as_000031', 'updated', '122.168.114.106', '2024-11-23 11:38:26', '2024-11-23 11:38:26'),
(443, 12, '2024-11-23', 'client', 28, 'created client profile. client code :', 'Reviewer SSSSFGGG DDFSFSF created client profile. client code : cli_CUS_sss_000028(ssssss)', 'created', '122.168.114.106', '2024-11-23 11:51:03', '2024-11-23 11:51:03'),
(444, 2, '2024-11-23', 'job', 5, 'edited the job information and changed the job to the reviewer, SSSSFGGG DDFSFSF job code:', 'Admin Amit Amit edited the job information and changed the job to the reviewer, SSSSFGGG DDFSFSF job code: CUS_SFF_VAT1_00005', 'updated', '122.168.114.106', '2024-11-23 11:51:59', '2024-11-23 11:51:59'),
(445, 2, '2024-11-23', 'job', 5, 'edited the job information and changed the job to the reviewer, ADADADAD WDFWFDWD job code:', 'Admin Amit Amit edited the job information and changed the job to the reviewer, ADADADAD WDFWFDWD job code: CUS_SFF_VAT1_00005', 'updated', '122.168.114.106', '2024-11-23 11:53:11', '2024-11-23 11:53:11'),
(446, 2, '2024-11-23', 'job', 30, 'edited the job information and changed the job to the reviewer, ADADADAD WDFWFDWD job code:', 'Admin Amit Amit edited the job information and changed the job to the reviewer, ADADADAD WDFWFDWD job code: CUS_SFF_VAT2_000027', 'updated', '122.168.114.106', '2024-11-23 11:53:54', '2024-11-23 11:53:54'),
(447, 2, '2024-11-23', 'job', 30, 'edited the job information and changed the job to the reviewer, SSSSFGGG DDFSFSF job code:', 'Admin Amit Amit edited the job information and changed the job to the reviewer, SSSSFGGG DDFSFSF job code: CUS_SFF_VAT2_000027', 'updated', '122.168.114.106', '2024-11-23 11:54:32', '2024-11-23 11:54:32'),
(448, 2, '2024-11-23', 'job', 5, 'edited the job information and changed the job to the reviewer, SSSSFGGG DDFSFSF job code:', 'Admin Amit Amit edited the job information and changed the job to the reviewer, SSSSFGGG DDFSFSF job code: CUS_SFF_VAT1_00005', 'updated', '122.168.114.106', '2024-11-23 11:55:05', '2024-11-23 11:55:05'),
(449, 12, '2024-11-23', '-', 0, ' Logged Out', 'Reviewer SSSSFGGG DDFSFSF  Logged Out ', '-', '122.168.114.106', '2024-11-23 12:04:55', '2024-11-23 12:04:55'),
(450, 11, '2024-11-23', '-', 0, ' Logged In', 'Manager sss sss  Logged In ', '-', '122.168.114.106', '2024-11-23 12:05:25', '2024-11-23 12:05:25'),
(451, 2, '2024-11-23', 'customer', 29, 'edited sole trader information. customer code :', 'Admin Amit Amit edited sole trader information. customer code : cust_EEE_000029(EEEE)', 'updated', '122.168.114.106', '2024-11-23 12:05:44', '2024-11-23 12:05:44'),
(452, 2, '2024-11-23', 'customer', 29, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_EEE_000029(EEEE)', 'updated', '122.168.114.106', '2024-11-23 12:05:51', '2024-11-23 12:05:51'),
(453, 2, '2024-11-23', 'customer', 30, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_HHH_000030(HHHHH)', 'created', '122.168.114.106', '2024-11-23 12:07:05', '2024-11-23 12:07:05'),
(454, 11, '2024-11-23', 'client', 29, 'created client profile. client code :', 'Manager sss sss created client profile. client code : cli_HHH_RRR_000029(RRR)', 'created', '122.168.114.106', '2024-11-23 12:11:01', '2024-11-23 12:11:01'),
(455, 2, '2024-11-23', 'client', 30, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_HHH_RRR_000030(RRRSSS)', 'created', '122.168.114.106', '2024-11-23 12:22:35', '2024-11-23 12:22:35'),
(456, 2, '2024-11-23', 'client', 31, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_HHH_sss_000031(ssssssssssssss)', 'created', '122.168.114.106', '2024-11-23 13:04:17', '2024-11-23 13:04:17'),
(457, 2, '2024-11-23', 'client', 32, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_HHH_GGG_000032(GGGGGGGGGG)', 'created', '122.168.114.106', '2024-11-23 13:04:53', '2024-11-23 13:04:53'),
(458, 2, '2024-11-25', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-25 06:05:48', '2024-11-25 06:05:48'),
(459, 12, '2024-11-25', '-', 0, ' Logged In', 'Reviewer SSSSFGGG DDFSFSF  Logged In ', '-', NULL, '2024-11-25 06:12:57', '2024-11-25 06:12:57'),
(460, 12, '2024-11-25', 'job', 5, 'edited the job information and edited the job invoice data job code:', 'Reviewer SSSSFGGG DDFSFSF edited the job information and edited the job invoice data job code: CUS_SFF_VAT1_00005', 'updated', NULL, '2024-11-25 06:13:26', '2024-11-25 06:13:26'),
(461, 2, '2024-11-25', 'job', 5, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_SFF_VAT1_00005', 'updated', '122.168.114.106', '2024-11-25 06:14:05', '2024-11-25 06:14:05'),
(462, 2, '2024-11-25', 'permission', 6, ' updated the access for REVIEWER. Access Changes Add Permission (job-insert) ', 'Admin Amit Amit  updated the access for REVIEWER. Access Changes Add Permission (job-insert)  ', 'updated', '122.168.114.106', '2024-11-25 06:27:03', '2024-11-25 06:27:03'),
(463, 12, '2024-11-25', 'job', 5, 'sent the draft for job code:', 'Reviewer SSSSFGGG DDFSFSF sent the draft for job code: CUS_SFF_VAT1_00005', 'created', '122.168.114.106', '2024-11-25 06:27:24', '2024-11-25 06:27:24'),
(464, 12, '2024-11-25', 'job', 5, 'sent the draft for job code:', 'Reviewer SSSSFGGG DDFSFSF sent the draft for job code: CUS_SFF_VAT1_00005', 'created', '122.168.114.106', '2024-11-25 06:28:03', '2024-11-25 06:28:03'),
(465, 12, '2024-11-25', 'job', 5, 'completed the draft job code:', 'Reviewer SSSSFGGG DDFSFSF completed the draft job code: CUS_SFF_VAT1_00005', 'updated', '122.168.114.106', '2024-11-25 06:34:29', '2024-11-25 06:34:29'),
(466, 12, '2024-11-25', 'job', 5, 'sent the draft for job code:', 'Reviewer SSSSFGGG DDFSFSF sent the draft for job code: CUS_SFF_VAT1_00005', 'created', '122.168.114.106', '2024-11-25 06:34:43', '2024-11-25 06:34:43'),
(467, 12, '2024-11-25', 'job', 5, 'completed the draft for job code:', 'Reviewer SSSSFGGG DDFSFSF completed the draft for job code: CUS_SFF_VAT1_00005', 'created', '122.168.114.106', '2024-11-25 06:34:54', '2024-11-25 06:34:54'),
(468, 12, '2024-11-25', 'job', 5, 'sent the missing logs for job code:', 'Reviewer SSSSFGGG DDFSFSF sent the missing logs for job code: CUS_SFF_VAT1_00005', 'created', '122.168.114.106', '2024-11-25 06:36:36', '2024-11-25 06:36:36'),
(469, 12, '2024-11-25', 'job', 5, 'sent the queries for job code:', 'Reviewer SSSSFGGG DDFSFSF sent the queries for job code: CUS_SFF_VAT1_00005', 'created', '122.168.114.106', '2024-11-25 06:37:32', '2024-11-25 06:37:32'),
(470, 12, '2024-11-25', 'job', 5, 'sent the queries for job code:', 'Reviewer SSSSFGGG DDFSFSF sent the queries for job code: CUS_SFF_VAT1_00005', 'created', '122.168.114.106', '2024-11-25 06:41:03', '2024-11-25 06:41:03'),
(471, 12, '2024-11-25', 'job', 5, 'Sent and completed the queries for the job code:', 'Reviewer SSSSFGGG DDFSFSF Sent and completed the queries for the job code: CUS_SFF_VAT1_00005', 'created', '122.168.114.106', '2024-11-25 06:41:47', '2024-11-25 06:41:47'),
(472, 12, '2024-11-25', 'job', 5, 'sent the queries for job code:', 'Reviewer SSSSFGGG DDFSFSF sent the queries for job code: CUS_SFF_VAT1_00005', 'created', '122.168.114.106', '2024-11-25 06:43:34', '2024-11-25 06:43:34'),
(473, 12, '2024-11-25', 'job', 5, 'edited the queries job code:', 'Reviewer SSSSFGGG DDFSFSF edited the queries job code: CUS_SFF_VAT1_00005', 'updated', '122.168.114.106', '2024-11-25 06:44:25', '2024-11-25 06:44:25');
INSERT INTO `staff_logs` (`id`, `staff_id`, `date`, `module_name`, `module_id`, `log_message`, `log_message_all`, `permission_type`, `ip`, `created_at`, `updated_at`) VALUES
(474, 12, '2024-11-25', 'job', 5, 'sent the queries for job code:', 'Reviewer SSSSFGGG DDFSFSF sent the queries for job code: CUS_SFF_VAT1_00005', 'created', '122.168.114.106', '2024-11-25 06:45:35', '2024-11-25 06:45:35'),
(475, 12, '2024-11-25', 'job', 5, 'completed the queries job code:', 'Reviewer SSSSFGGG DDFSFSF completed the queries job code: CUS_SFF_VAT1_00005', 'updated', '122.168.114.106', '2024-11-25 06:45:39', '2024-11-25 06:45:39'),
(476, 12, '2024-11-25', 'job', 5, 'sent the missing logs for job code:', 'Reviewer SSSSFGGG DDFSFSF sent the missing logs for job code: CUS_SFF_VAT1_00005', 'created', '122.168.114.106', '2024-11-25 06:54:17', '2024-11-25 06:54:17'),
(477, 12, '2024-11-25', 'job', 5, 'edited the missing logs job code:', 'Reviewer SSSSFGGG DDFSFSF edited the missing logs job code: CUS_SFF_VAT1_00005', 'updated', '122.168.114.106', '2024-11-25 06:54:31', '2024-11-25 06:54:31'),
(478, 12, '2024-11-25', 'job', 5, 'completed the missing logs job code:', 'Reviewer SSSSFGGG DDFSFSF completed the missing logs job code: CUS_SFF_VAT1_00005', 'updated', '122.168.114.106', '2024-11-25 06:54:44', '2024-11-25 06:54:44'),
(479, 12, '2024-11-25', 'job', 5, 'Sent and completed the missing logs for job code:', 'Reviewer SSSSFGGG DDFSFSF Sent and completed the missing logs for job code: CUS_SFF_VAT1_00005', 'created', '122.168.114.106', '2024-11-25 06:54:54', '2024-11-25 06:54:54'),
(480, 2, '2024-11-25', 'permission', 6, ' updated the access for REVIEWER. Access Changes  Remove Permission (job-update, job-insert)', 'Admin Amit Amit  updated the access for REVIEWER. Access Changes  Remove Permission (job-update, job-insert) ', 'updated', '122.168.114.106', '2024-11-25 06:58:09', '2024-11-25 06:58:09'),
(481, 2, '2024-11-25', 'job', 5, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_SFF_VAT1_00005', 'updated', '122.168.114.106', '2024-11-25 07:00:30', '2024-11-25 07:00:30'),
(482, 2, '2024-11-25', 'job', 5, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_SFF_VAT1_00005', 'created', '122.168.114.106', '2024-11-25 10:29:46', '2024-11-25 10:29:46'),
(483, 2, '2024-11-25', 'checklist', 7, 'deleted checklist RRRRR', 'Admin Amit Amit deleted checklist RRRRR ', 'deleted', '122.168.114.106', '2024-11-25 10:32:29', '2024-11-25 10:32:29'),
(484, 2, '2024-11-25', 'checklist', 9, 'created checklist ERE', 'Admin Amit Amit created checklist ERE ', 'created', '122.168.114.106', '2024-11-25 10:50:08', '2024-11-25 10:50:08'),
(485, 2, '2024-11-25', 'permission', 6, ' updated the access for REVIEWER. Access Changes Add Permission (setting-insert, setting-update, setting-delete, setting-view) ', 'Admin Amit Amit  updated the access for REVIEWER. Access Changes Add Permission (setting-insert, setting-update, setting-delete, setting-view)  ', 'updated', '122.168.114.106', '2024-11-25 12:00:46', '2024-11-25 12:00:46'),
(486, 12, '2024-11-25', 'checklist', 10, 'created checklist DDDDE', 'Reviewer SSSSFGGG DDFSFSF created checklist DDDDE ', 'created', '122.168.114.106', '2024-11-25 12:11:01', '2024-11-25 12:11:01'),
(487, 2, '2024-11-25', 'checklist', 9, 'edited checklist ERE', 'Admin Amit Amit edited checklist ERE ', 'updated', '122.168.114.106', '2024-11-25 12:13:26', '2024-11-25 12:13:26'),
(488, 12, '2024-11-25', 'checklist', 1, 'deleted checklist Checklist 1', 'Reviewer SSSSFGGG DDFSFSF deleted checklist Checklist 1 ', 'deleted', '122.168.114.106', '2024-11-25 12:21:31', '2024-11-25 12:21:31'),
(489, 2, '2024-11-25', 'checklist', 4, 'deleted checklist RRR', 'Admin Amit Amit deleted checklist RRR ', 'deleted', '122.168.114.106', '2024-11-25 12:42:20', '2024-11-25 12:42:20'),
(490, 2, '2024-11-25', 'checklist', 5, 'deleted checklist abc55', 'Admin Amit Amit deleted checklist abc55 ', 'deleted', '122.168.114.106', '2024-11-25 12:42:23', '2024-11-25 12:42:23'),
(491, 2, '2024-11-25', 'checklist', 6, 'deleted checklist WQW', 'Admin Amit Amit deleted checklist WQW ', 'deleted', '122.168.114.106', '2024-11-25 12:42:25', '2024-11-25 12:42:25'),
(492, 2, '2024-11-25', 'checklist', 8, 'deleted checklist WWW', 'Admin Amit Amit deleted checklist WWW ', 'deleted', '122.168.114.106', '2024-11-25 12:42:27', '2024-11-25 12:42:27'),
(493, 2, '2024-11-25', 'checklist', 10, 'deleted checklist DDDDE', 'Admin Amit Amit deleted checklist DDDDE ', 'deleted', '122.168.114.106', '2024-11-25 12:42:31', '2024-11-25 12:42:31'),
(494, 2, '2024-11-25', 'checklist', 9, 'deleted checklist ERE', 'Admin Amit Amit deleted checklist ERE ', 'deleted', '122.168.114.106', '2024-11-25 12:44:28', '2024-11-25 12:44:28'),
(495, 2, '2024-11-25', 'checklist', 11, 'created checklist SC', 'Admin Amit Amit created checklist SC ', 'created', '122.168.114.106', '2024-11-25 12:46:01', '2024-11-25 12:46:01'),
(496, 2, '2024-11-25', 'checklist', 12, 'created checklist DDD', 'Admin Amit Amit created checklist DDD ', 'created', '122.168.114.106', '2024-11-25 12:46:46', '2024-11-25 12:46:46'),
(497, 2, '2024-11-25', 'customer', 30, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_HHH_000030(HHHHH)', 'updated', '122.168.114.106', '2024-11-25 12:47:09', '2024-11-25 12:47:09'),
(498, 2, '2024-11-25', 'job', 35, 'created job code:', 'Admin Amit Amit created job code: HHH_GGG_VAT1_000032', 'created', '122.168.114.106', '2024-11-25 12:47:38', '2024-11-25 12:47:38'),
(499, 2, '2024-11-26', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-26 04:43:05', '2024-11-26 04:43:05'),
(500, 10, '2024-11-26', '-', 0, ' Logged In', 'Manager MAN1 HHH  Logged In ', '-', NULL, '2024-11-26 04:50:28', '2024-11-26 04:50:28'),
(501, 2, '2024-11-26', 'customer', 30, 'edited sole trader information. customer code :', 'Admin Amit Amit edited sole trader information. customer code : cust_HHH_000030(HHHHH)', 'updated', '122.168.114.106', '2024-11-26 04:50:45', '2024-11-26 04:50:45'),
(502, 2, '2024-11-26', 'customer', 30, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_HHH_000030(HHHHH)', 'updated', '122.168.114.106', '2024-11-26 04:51:00', '2024-11-26 04:51:00'),
(503, 10, '2024-11-26', 'client', 33, 'created client profile. client code :', 'Manager MAN1 HHH created client profile. client code : cli_HHH_ERT_000033(ERT)', 'created', '122.168.114.106', '2024-11-26 05:21:45', '2024-11-26 05:21:45'),
(504, 2, '2024-11-26', 'customer', 22, 'edited sole trader information. customer code :', 'Admin Amit Amit edited sole trader information. customer code : cust_QQQ_000022(QQQQ)', 'updated', '122.168.114.106', '2024-11-26 05:24:38', '2024-11-26 05:24:38'),
(505, 2, '2024-11-26', 'customer', 22, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_QQQ_000022(QQQQ)', 'updated', '122.168.114.106', '2024-11-26 05:24:39', '2024-11-26 05:24:39'),
(506, 2, '2024-11-26', 'customer', 22, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_QQQ_000022(QQQQ)', 'updated', '122.168.114.106', '2024-11-26 05:25:14', '2024-11-26 05:25:14'),
(507, 2, '2024-11-26', 'Internal', 10, 'created Internal Job/Project FFFF', 'Admin Amit Amit created Internal Job/Project FFFF ', 'created', '122.168.114.106', '2024-11-26 05:26:00', '2024-11-26 05:26:00'),
(508, 2, '2024-11-26', 'Internal', 13, 'created Internal Task DDDDD', 'Admin Amit Amit created Internal Task DDDDD ', 'created', '122.168.114.106', '2024-11-26 05:26:07', '2024-11-26 05:26:07'),
(509, 2, '2024-11-26', 'Internal', 10, 'edited Internal Job/Project FFFF1', 'Admin Amit Amit edited Internal Job/Project FFFF1 ', 'updated', '122.168.114.106', '2024-11-26 05:27:21', '2024-11-26 05:27:21'),
(510, 2, '2024-11-26', 'Sub Internal', 13, 'edited Internal Task DDDDD1', 'Admin Amit Amit edited Internal Task DDDDD1 ', 'updated', '122.168.114.106', '2024-11-26 05:29:33', '2024-11-26 05:29:33'),
(511, 2, '2024-11-26', 'Sub Internal', 13, 'edited Internal Task DDDDD11111', 'Admin Amit Amit edited Internal Task DDDDD11111 ', 'updated', '122.168.114.106', '2024-11-26 05:43:39', '2024-11-26 05:43:39'),
(512, 10, '2024-11-26', '-', 0, ' Logged Out', 'Manager MAN1 HHH  Logged Out ', '-', '122.168.114.106', '2024-11-26 05:43:59', '2024-11-26 05:43:59'),
(513, 2, '2024-11-26', 'customer', 31, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_TES_000031(TEST5)', 'created', '122.168.114.106', '2024-11-26 05:44:43', '2024-11-26 05:44:43'),
(514, 10, '2024-11-26', '-', 0, ' Logged In', 'Manager MAN1 HHH  Logged In ', '-', '122.168.114.106', '2024-11-26 05:45:24', '2024-11-26 05:45:24'),
(515, 2, '2024-11-26', 'client', 34, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_TES_tes_000034(testtt1)', 'created', '122.168.114.106', '2024-11-26 05:46:10', '2024-11-26 05:46:10'),
(516, 10, '2024-11-26', 'client', 35, 'created client profile. client code :', 'Manager MAN1 HHH created client profile. client code : cli_TES_tes_000035(testt2)', 'created', '122.168.114.106', '2024-11-26 05:46:36', '2024-11-26 05:46:36'),
(517, 2, '2024-11-26', 'permission', 4, ' updated the access for MANAGER. Access Changes Add Permission (job-insert, job-update, job-delete) ', 'Admin Amit Amit  updated the access for MANAGER. Access Changes Add Permission (job-insert, job-update, job-delete)  ', 'updated', '122.168.114.106', '2024-11-26 05:47:11', '2024-11-26 05:47:11'),
(518, 10, '2024-11-26', 'job', 36, 'created job code:', 'Manager MAN1 HHH created job code: TES_tes_Vat5_000033', 'created', '122.168.114.106', '2024-11-26 05:50:21', '2024-11-26 05:50:21'),
(519, 10, '2024-11-26', '-', 0, ' Logged Out', 'Manager MAN1 HHH  Logged Out ', '-', '122.168.114.106', '2024-11-26 05:54:14', '2024-11-26 05:54:14'),
(520, 9, '2024-11-26', '-', 0, ' Logged In', 'Reviewer shk hu  Logged In ', '-', '122.168.114.106', '2024-11-26 05:54:19', '2024-11-26 05:54:19'),
(521, 2, '2024-11-26', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-11-26 05:57:13', '2024-11-26 05:57:13'),
(522, 10, '2024-11-26', '-', 0, ' Logged In', 'Manager MAN1 HHH  Logged In ', '-', '122.168.114.106', '2024-11-26 05:57:19', '2024-11-26 05:57:19'),
(523, 10, '2024-11-26', 'job', 36, 'edited the job information, edited the job invoice data and changed the job to the reviewer, dascfascsac ascs job code:', 'Manager MAN1 HHH edited the job information, edited the job invoice data and changed the job to the reviewer, dascfascsac ascs job code: TES_tes_Vat5_000033', 'updated', '122.168.114.106', '2024-11-26 06:47:49', '2024-11-26 06:47:49'),
(524, 10, '2024-11-26', 'job', 36, 'edited the job information and changed the job to the reviewer, shk hu job code:', 'Manager MAN1 HHH edited the job information and changed the job to the reviewer, shk hu job code: TES_tes_Vat5_000033', 'updated', '122.168.114.106', '2024-11-26 06:48:21', '2024-11-26 06:48:21'),
(525, 10, '2024-11-26', '-', 0, ' Logged Out', 'Manager MAN1 HHH  Logged Out ', '-', '122.168.114.106', '2024-11-26 06:48:36', '2024-11-26 06:48:36'),
(526, 2, '2024-11-26', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-26 06:48:46', '2024-11-26 06:48:46'),
(527, 2, '2024-11-26', 'permission', 6, ' updated the access for REVIEWER. Access Changes Add Permission (job-insert, job-update, job-delete) ', 'Admin Amit Amit  updated the access for REVIEWER. Access Changes Add Permission (job-insert, job-update, job-delete)  ', 'updated', '122.168.114.106', '2024-11-26 06:48:56', '2024-11-26 06:48:56'),
(528, 2, '2024-11-26', 'permission', 6, ' updated the access for REVIEWER. Access Changes  Remove Permission (job-insert, job-update, job-delete)', 'Admin Amit Amit  updated the access for REVIEWER. Access Changes  Remove Permission (job-insert, job-update, job-delete) ', 'updated', '122.168.114.106', '2024-11-26 06:51:26', '2024-11-26 06:51:26'),
(529, 2, '2024-11-26', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-11-26 06:51:54', '2024-11-26 06:51:54'),
(530, 10, '2024-11-26', '-', 0, ' Logged In', 'Manager MAN1 HHH  Logged In ', '-', '122.168.114.106', '2024-11-26 06:51:59', '2024-11-26 06:51:59'),
(531, 10, '2024-11-26', 'job', 36, 'edited the job information and has assigned the job to the processor, Nikita  bhagat job code:', 'Manager MAN1 HHH edited the job information and has assigned the job to the processor, Nikita  bhagat job code: TES_tes_Vat5_000033', 'updated', '122.168.114.106', '2024-11-26 06:52:16', '2024-11-26 06:52:16'),
(532, 9, '2024-11-26', '-', 0, ' Logged Out', 'Reviewer shk hu  Logged Out ', '-', '122.168.114.106', '2024-11-26 06:52:22', '2024-11-26 06:52:22'),
(533, 6, '2024-11-26', '-', 0, ' Logged In', 'Processor Nikita  bhagat  Logged In ', '-', '122.168.114.106', '2024-11-26 06:52:41', '2024-11-26 06:52:41'),
(534, 10, '2024-11-26', '-', 0, ' Logged Out', 'Manager MAN1 HHH  Logged Out ', '-', '122.168.114.106', '2024-11-26 06:59:46', '2024-11-26 06:59:46'),
(535, 2, '2024-11-26', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-26 07:01:51', '2024-11-26 07:01:51'),
(536, 2, '2024-11-26', 'customer', 32, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_DHI_000032(DHILLON PROPERTY AND ASSET INVESTMENTS (UK) LTD)', 'created', '122.168.114.106', '2024-11-26 07:03:10', '2024-11-26 07:03:10'),
(537, 2, '2024-11-26', 'client', 36, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_DHI_ABC_000036(ABC1)', 'created', '122.168.114.106', '2024-11-26 07:03:50', '2024-11-26 07:03:50'),
(538, 6, '2024-11-26', '-', 0, ' Logged Out', 'Processor Nikita  bhagat  Logged Out ', '-', '122.168.114.106', '2024-11-26 07:04:17', '2024-11-26 07:04:17'),
(539, 5, '2024-11-26', '-', 0, ' Logged In', 'Manager staff manager staff manager  Logged In ', '-', '122.168.114.106', '2024-11-26 07:04:33', '2024-11-26 07:04:33'),
(540, 5, '2024-11-26', 'client', 37, 'created client profile. client code :', 'Manager staff manager staff manager created client profile. client code : cli_DHI_ABC_000037(ABC2)', 'created', '122.168.114.106', '2024-11-26 07:04:58', '2024-11-26 07:04:58'),
(541, 5, '2024-11-26', 'job', 37, 'created job code:', 'Manager staff manager staff manager created job code: DHI_ABC_VAT2_000034', 'created', '122.168.114.106', '2024-11-26 07:05:44', '2024-11-26 07:05:44'),
(542, 12, '2024-11-26', '-', 0, ' Logged In', 'Reviewer SSSSFGGG DDFSFSF  Logged In ', '-', NULL, '2024-11-26 07:07:10', '2024-11-26 07:07:10'),
(543, 12, '2024-11-26', '-', 0, ' Logged Out', 'Reviewer SSSSFGGG DDFSFSF  Logged Out ', '-', '122.168.114.106', '2024-11-26 07:07:56', '2024-11-26 07:07:56'),
(544, 13, '2024-11-26', '-', 0, ' Logged In', 'Reviewer ADADADAD WDFWFDWD  Logged In ', '-', '122.168.114.106', '2024-11-26 07:08:01', '2024-11-26 07:08:01'),
(545, 5, '2024-11-26', 'job', 37, 'edited the job information, edited the job invoice data and changed the job to the reviewer, dascfascsac ascs job code:', 'Manager staff manager staff manager edited the job information, edited the job invoice data and changed the job to the reviewer, dascfascsac ascs job code: DHI_ABC_VAT2_000034', 'updated', '122.168.114.106', '2024-11-26 07:08:37', '2024-11-26 07:08:37'),
(546, 5, '2024-11-26', 'job', 37, 'edited the job information and changed the job to the reviewer, ADADADAD WDFWFDWD job code:', 'Manager staff manager staff manager edited the job information and changed the job to the reviewer, ADADADAD WDFWFDWD job code: DHI_ABC_VAT2_000034', 'updated', '122.168.114.106', '2024-11-26 07:08:54', '2024-11-26 07:08:54'),
(547, 2, '2024-11-26', 'permission', 6, ' updated the access for REVIEWER. Access Changes Add Permission (job-insert, job-update, job-delete) ', 'Admin Amit Amit  updated the access for REVIEWER. Access Changes Add Permission (job-insert, job-update, job-delete)  ', 'updated', '122.168.114.106', '2024-11-26 07:09:17', '2024-11-26 07:09:17'),
(548, 2, '2024-11-26', 'permission', 6, ' updated the access for REVIEWER. Access Changes  Remove Permission (job-insert, job-update, job-delete)', 'Admin Amit Amit  updated the access for REVIEWER. Access Changes  Remove Permission (job-insert, job-update, job-delete) ', 'updated', '122.168.114.106', '2024-11-26 07:09:52', '2024-11-26 07:09:52'),
(549, 5, '2024-11-26', 'job', 38, 'created job code:', 'Manager staff manager staff manager created job code: DHI_ABC_VAT2_000035', 'created', '122.168.114.106', '2024-11-26 07:10:33', '2024-11-26 07:10:33'),
(550, 5, '2024-11-26', 'job', 38, 'edited the job information, edited the job invoice data and changed the job to the reviewer, ADADADAD WDFWFDWD job code:', 'Manager staff manager staff manager edited the job information, edited the job invoice data and changed the job to the reviewer, ADADADAD WDFWFDWD job code: DHI_ABC_VAT2_000035', 'updated', '122.168.114.106', '2024-11-26 07:11:32', '2024-11-26 07:11:32'),
(551, 5, '2024-11-26', 'job', 38, 'edited the job information and changed the job to the reviewer, dascfascsac ascs job code:', 'Manager staff manager staff manager edited the job information and changed the job to the reviewer, dascfascsac ascs job code: DHI_ABC_VAT2_000035', 'updated', '122.168.114.106', '2024-11-26 07:11:53', '2024-11-26 07:11:53'),
(552, 5, '2024-11-26', 'job', 38, 'edited the job information and has assigned the job to the processor, Nikita  bhagat job code:', 'Manager staff manager staff manager edited the job information and has assigned the job to the processor, Nikita  bhagat job code: DHI_ABC_VAT2_000035', 'updated', '122.168.114.106', '2024-11-26 07:12:57', '2024-11-26 07:12:57'),
(553, 13, '2024-11-26', '-', 0, ' Logged Out', 'Reviewer ADADADAD WDFWFDWD  Logged Out ', '-', '122.168.114.106', '2024-11-26 07:13:13', '2024-11-26 07:13:13'),
(554, 6, '2024-11-26', '-', 0, ' Logged In', 'Processor Nikita  bhagat  Logged In ', '-', '122.168.114.106', '2024-11-26 07:13:19', '2024-11-26 07:13:19'),
(555, 6, '2024-11-26', '-', 0, ' Logged Out', 'Processor Nikita  bhagat  Logged Out ', '-', '122.168.114.106', '2024-11-26 07:14:25', '2024-11-26 07:14:25'),
(556, 2, '2024-11-26', 'staff', 19, 'created staff MANAGE MENT', 'Admin Amit Amit created staff MANAGE MENT ', 'created', '122.168.114.106', '2024-11-26 07:16:00', '2024-11-26 07:16:00'),
(557, 19, '2024-11-26', '-', 0, ' Logged In', 'Management MANAGE MENT  Logged In ', '-', '122.168.114.106', '2024-11-26 07:16:18', '2024-11-26 07:16:18'),
(558, 19, '2024-11-26', 'customer', 33, 'created customer profile. customer code :', 'Management MANAGE MENT created customer profile. customer code : cust_MAN_000033(MANGE_1)', 'created', '122.168.114.106', '2024-11-26 07:17:36', '2024-11-26 07:17:36'),
(559, 2, '2024-11-26', 'permission', 8, ' updated the access for MANAGEMENT. Access Changes Add Permission (customer-update, customer-delete, client-insert, client-update, client-delete, client-view, job-insert) ', 'Admin Amit Amit  updated the access for MANAGEMENT. Access Changes Add Permission (customer-update, customer-delete, client-insert, client-update, client-delete, client-view, job-insert)  ', 'updated', '122.168.114.106', '2024-11-26 07:18:22', '2024-11-26 07:18:22'),
(560, 5, '2024-11-26', '-', 0, ' Logged Out', 'Manager staff manager staff manager  Logged Out ', '-', '122.168.114.106', '2024-11-26 07:19:08', '2024-11-26 07:19:08'),
(561, 10, '2024-11-26', '-', 0, ' Logged In', 'Manager MAN1 HHH  Logged In ', '-', '122.168.114.106', '2024-11-26 07:19:14', '2024-11-26 07:19:14'),
(562, 10, '2024-11-26', 'client', 38, 'created client profile. client code :', 'Manager MAN1 HHH created client profile. client code : cli_MAN_MAN_000038(MANGAE_CLIENT_1)', 'created', '122.168.114.106', '2024-11-26 07:19:54', '2024-11-26 07:19:54'),
(563, 10, '2024-11-26', 'job', 39, 'created job code:', 'Manager MAN1 HHH created job code: MAN_MAN_VAT2_000036', 'created', '122.168.114.106', '2024-11-26 07:21:04', '2024-11-26 07:21:04'),
(564, 10, '2024-11-26', 'client', 39, 'created client profile. client code :', 'Manager MAN1 HHH created client profile. client code : cli_MAN_A &_000039(A & I INC)', 'created', '122.168.114.106', '2024-11-26 07:21:33', '2024-11-26 07:21:33'),
(565, 10, '2024-11-26', 'job', 39, 'edited the job information, edited the job invoice data and has assigned the job to the reviewer, shk hu job code:', 'Manager MAN1 HHH edited the job information, edited the job invoice data and has assigned the job to the reviewer, shk hu job code: MAN_MAN_VAT2_000036', 'updated', '122.168.114.106', '2024-11-26 07:23:28', '2024-11-26 07:23:28'),
(566, 10, '2024-11-26', '-', 0, ' Logged Out', 'Manager MAN1 HHH  Logged Out ', '-', '122.168.114.106', '2024-11-26 07:24:02', '2024-11-26 07:24:02'),
(567, 9, '2024-11-26', '-', 0, ' Logged In', 'Reviewer shk hu  Logged In ', '-', '122.168.114.106', '2024-11-26 07:24:06', '2024-11-26 07:24:06'),
(568, 19, '2024-11-26', '-', 0, ' Logged Out', 'Management MANAGE MENT  Logged Out ', '-', '122.168.114.106', '2024-11-26 07:26:28', '2024-11-26 07:26:28'),
(569, 9, '2024-11-26', '-', 0, ' Logged Out', 'Reviewer shk hu  Logged Out ', '-', '122.168.114.106', '2024-11-26 07:26:32', '2024-11-26 07:26:32'),
(570, 2, '2024-11-26', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2024-11-26 07:27:05', '2024-11-26 07:27:05'),
(571, 5, '2024-11-26', '-', 0, ' Logged In', 'Manager staff manager staff manager  Logged In ', '-', '122.168.114.106', '2024-11-26 07:27:10', '2024-11-26 07:27:10'),
(572, 5, '2024-11-26', '-', 0, ' Logged In', 'Manager staff manager staff manager  Logged In ', '-', '122.168.114.106', '2024-11-26 07:28:19', '2024-11-26 07:28:19'),
(573, 5, '2024-11-26', '-', 0, ' Logged Out', 'Manager staff manager staff manager  Logged Out ', '-', '122.168.114.106', '2024-11-26 07:28:24', '2024-11-26 07:28:24'),
(574, 2, '2024-11-26', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-11-26 07:28:31', '2024-11-26 07:28:31'),
(575, 13, '2024-11-26', '-', 0, ' Logged In', 'Reviewer ADADADAD WDFWFDWD  Logged In ', '-', '122.168.114.106', '2024-11-26 07:29:21', '2024-11-26 07:29:21'),
(576, 5, '2024-11-26', 'job', 38, 'edited the job information and changed the job to the reviewer, ADADADAD WDFWFDWD job code:', 'Manager staff manager staff manager edited the job information and changed the job to the reviewer, ADADADAD WDFWFDWD job code: DHI_ABC_VAT2_000035', 'updated', '122.168.114.106', '2024-11-26 08:30:48', '2024-11-26 08:30:48'),
(577, 5, '2024-11-26', 'job', 38, 'edited the job information and changed the job to the reviewer, dascfascsac ascs job code:', 'Manager staff manager staff manager edited the job information and changed the job to the reviewer, dascfascsac ascs job code: DHI_ABC_VAT2_000035', 'updated', '122.168.114.106', '2024-11-26 08:31:09', '2024-11-26 08:31:09'),
(578, 5, '2024-11-26', 'job', 38, 'edited the job information and changed the job to the reviewer, ADADADAD WDFWFDWD job code:', 'Manager staff manager staff manager edited the job information and changed the job to the reviewer, ADADADAD WDFWFDWD job code: DHI_ABC_VAT2_000035', 'updated', '122.168.114.106', '2024-11-26 08:32:47', '2024-11-26 08:32:47'),
(579, 2, '2024-11-26', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2024-11-26 08:43:55', '2024-11-26 08:43:55'),
(580, 2, '2024-11-26', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-11-26 08:43:57', '2024-11-26 08:43:57'),
(581, 19, '2024-11-26', '-', 0, ' Logged In', 'Management MANAGE MENT  Logged In ', '-', NULL, '2024-11-26 08:44:40', '2024-11-26 08:44:40'),
(582, 13, '2024-11-26', '-', 0, ' Logged Out', 'Reviewer ADADADAD WDFWFDWD  Logged Out ', '-', '122.168.114.106', '2024-11-26 08:45:07', '2024-11-26 08:45:07'),
(583, 9, '2024-11-26', '-', 0, ' Logged In', 'Reviewer shk hu  Logged In ', '-', '122.168.114.106', '2024-11-26 08:45:38', '2024-11-26 08:45:38'),
(584, 2, '2024-11-26', 'permission', 6, ' updated the access for REVIEWER. Access Changes Add Permission (job-insert, job-insert, job-update) ', 'Admin Amit Amit  updated the access for REVIEWER. Access Changes Add Permission (job-insert, job-insert, job-update)  ', 'updated', '103.103.213.217', '2024-11-26 08:46:00', '2024-11-26 08:46:00'),
(585, 2, '2024-11-26', 'staff', 19, 'changes the staff status Deactivate MANAGE MENT', 'Admin Amit Amit changes the staff status Deactivate MANAGE MENT ', 'updated', '103.103.213.217', '2024-11-26 09:01:52', '2024-11-26 09:01:52'),
(586, 2, '2024-11-26', 'staff', 19, 'changes the staff status Activate MANAGE MENT', 'Admin Amit Amit changes the staff status Activate MANAGE MENT ', 'updated', '103.103.213.217', '2024-11-26 09:02:14', '2024-11-26 09:02:14'),
(587, 2, '2024-11-26', 'staff', 19, 'changes the staff status Deactivate MANAGE MENT', 'Admin Amit Amit changes the staff status Deactivate MANAGE MENT ', 'updated', '103.103.213.217', '2024-11-26 09:02:27', '2024-11-26 09:02:27'),
(588, 2, '2024-11-26', 'staff', 19, 'changes the staff status Activate MANAGE MENT', 'Admin Amit Amit changes the staff status Activate MANAGE MENT ', 'updated', '103.103.213.217', '2024-11-26 09:02:36', '2024-11-26 09:02:36'),
(589, 2, '2024-11-26', 'staff', 19, 'edited staff MANAGE MENT', 'Admin Amit Amit edited staff MANAGE MENT ', 'updated', '103.103.213.217', '2024-11-26 09:04:36', '2024-11-26 09:04:36'),
(590, 2, '2024-11-26', 'staff', 19, 'edited staff MANAGE MENT', 'Admin Amit Amit edited staff MANAGE MENT ', 'updated', '103.103.213.217', '2024-11-26 09:06:34', '2024-11-26 09:06:34'),
(591, 2, '2024-11-26', 'staff', 19, 'changes the staff status Deactivate MANAGE MENT', 'Admin Amit Amit changes the staff status Deactivate MANAGE MENT ', 'updated', '103.103.213.217', '2024-11-26 09:06:44', '2024-11-26 09:06:44'),
(592, 2, '2024-11-26', 'staff', 19, 'changes the staff status Activate MANAGE MENT', 'Admin Amit Amit changes the staff status Activate MANAGE MENT ', 'updated', '103.103.213.217', '2024-11-26 09:06:52', '2024-11-26 09:06:52'),
(593, 2, '2024-11-26', 'staff', 19, 'edited staff MANAGE MENT', 'Admin Amit Amit edited staff MANAGE MENT ', 'updated', '103.103.213.217', '2024-11-26 09:07:03', '2024-11-26 09:07:03'),
(594, 2, '2024-11-26', 'staff', 19, 'edited staff MANAGE MENT', 'Admin Amit Amit edited staff MANAGE MENT ', 'updated', '103.103.213.217', '2024-11-26 09:07:12', '2024-11-26 09:07:12'),
(595, 2, '2024-11-26', 'staff', 19, 'edited staff MANAGE MENT', 'Admin Amit Amit edited staff MANAGE MENT ', 'updated', '103.103.213.217', '2024-11-26 09:07:49', '2024-11-26 09:07:49'),
(596, 2, '2024-11-26', 'role', 4, 'edited role Manager', 'Admin Amit Amit edited role Manager ', 'updated', '103.103.213.217', '2024-11-26 09:08:09', '2024-11-26 09:08:09'),
(597, 2, '2024-11-26', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2024-11-25, Hours : 01:00 ,Job code:abc, Task name:c, Task type:Internal,  Date: 2024-11-25, Hours : 02:00 ,Job code:abc, Task name:c and Task type:Internal,  Date: 2024-11-25, Hours : 03:00 ,Job code:abc, Task name:c', 'Admin Amit Amit created a timesheet entry. Task type:Internal,  Date: 2024-11-25, Hours : 01:00 ,Job code:abc, Task name:c, Task type:Internal,  Date: 2024-11-25, Hours : 02:00 ,Job code:abc, Task name:c and Task type:Internal,  Date: 2024-11-25, Hours : 03:00 ,Job code:abc, Task name:c ', 'updated', '0.0.0.0', '2024-11-26 13:34:16', '2024-11-26 13:34:16'),
(598, 2, '2024-11-26', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  ,Job code:abc, Task name:c, Task type:Internal,  ,Job code:abc, Task name:c, Task type:Internal,  Date: 2024-11-25, Hours : 017:00 ,Job code:MAN_MAN_VAT2_000036, Task name:ssss and deleted a timesheet entry. Task type:Internal ,Job code:abc, Task name:c', 'Admin Amit Amit submitted a timesheet entry. Task type:Internal,  ,Job code:abc, Task name:c, Task type:Internal,  ,Job code:abc, Task name:c, Task type:Internal,  Date: 2024-11-25, Hours : 017:00 ,Job code:MAN_MAN_VAT2_000036, Task name:ssss and deleted a timesheet entry. Task type:Internal ,Job code:abc, Task name:c ', 'updated', '0.0.0.0', '2024-11-26 13:34:37', '2024-11-26 13:34:37'),
(599, 2, '2024-11-27', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-11-27 04:45:11', '2024-11-27 04:45:11'),
(600, 13, '2024-11-27', '-', 0, ' Logged In', 'Reviewer ADADADAD WDFWFDWD  Logged In ', '-', NULL, '2024-11-27 05:39:13', '2024-11-27 05:39:13'),
(601, 2, '2024-11-27', 'permission', 6, ' updated the access for REVIEWER. Access Changes Add Permission (customer-insert, customer-update) ', 'Admin Amit Amit  updated the access for REVIEWER. Access Changes Add Permission (customer-insert, customer-update)  ', 'updated', '103.103.213.217', '2024-11-27 05:41:29', '2024-11-27 05:41:29'),
(602, 13, '2024-11-27', 'customer', 34, 'created customer profile. customer code :', 'Reviewer ADADADAD WDFWFDWD created customer profile. customer code : cust_CUS_000034(CUST5)', 'created', '103.103.213.217', '2024-11-27 05:42:03', '2024-11-27 05:42:03'),
(603, 13, '2024-11-27', 'client', 40, 'created client profile. client code :', 'Reviewer ADADADAD WDFWFDWD created client profile. client code : cli_CUS_CLI_000040(CLIE5)', 'created', '103.103.213.217', '2024-11-27 05:42:38', '2024-11-27 05:42:38'),
(604, 13, '2024-11-27', 'job', 40, 'created job code:', 'Reviewer ADADADAD WDFWFDWD created job code: CUS_CLI_as_000037', 'created', '103.103.213.217', '2024-11-27 05:42:53', '2024-11-27 05:42:53'),
(605, 13, '2024-11-27', 'client', 41, 'created client profile. client code :', 'Reviewer ADADADAD WDFWFDWD created client profile. client code : cli_CUS_CLI_000041(CLIE2)', 'created', '103.103.213.217', '2024-11-27 09:02:22', '2024-11-27 09:02:22'),
(606, 13, '2024-11-27', 'customer', 35, 'created customer profile. customer code :', 'Reviewer ADADADAD WDFWFDWD created customer profile. customer code : cust_CUS_000035(CUST6)', 'created', '103.103.213.217', '2024-11-27 09:04:24', '2024-11-27 09:04:24'),
(607, 13, '2024-11-27', 'client', 42, 'created client profile. client code :', 'Reviewer ADADADAD WDFWFDWD created client profile. client code : cli_CUS_CLI_000042(CLI6)', 'created', '103.103.213.217', '2024-11-27 09:05:34', '2024-11-27 09:05:34'),
(608, 13, '2024-11-27', 'client', 43, 'created client profile. client code :', 'Reviewer ADADADAD WDFWFDWD created client profile. client code : cli_DHI_WWW_000043(WWW22)', 'created', '103.103.213.217', '2024-11-27 09:06:04', '2024-11-27 09:06:04'),
(609, 13, '2024-11-27', 'client', 44, 'created client profile. client code :', 'Reviewer ADADADAD WDFWFDWD created client profile. client code : cli_CUS_CLI_000044(CLI7)', 'created', '103.103.213.217', '2024-11-27 09:30:45', '2024-11-27 09:30:45'),
(610, 2, '2024-11-27', 'job', 41, 'created job code:', 'Admin Amit Amit created job code: CUS_CLI_VAT2_000038', 'created', '103.103.213.217', '2024-11-27 09:49:01', '2024-11-27 09:49:01'),
(611, 2, '2024-11-27', 'job', 41, 'edited the job information, edited the job invoice data and has assigned the job to the reviewer, ADADADAD WDFWFDWD job code:', 'Admin Amit Amit edited the job information, edited the job invoice data and has assigned the job to the reviewer, ADADADAD WDFWFDWD job code: CUS_CLI_VAT2_000038', 'updated', '103.103.213.217', '2024-11-27 09:50:09', '2024-11-27 09:50:09'),
(612, 2, '2024-11-27', 'job', 42, 'created job code:', 'Admin Amit Amit created job code: CUS_CLI_Vat5_000039', 'created', '103.103.213.217', '2024-11-27 09:50:38', '2024-11-27 09:50:38'),
(613, 13, '2024-11-27', 'job', 43, 'created job code:', 'Reviewer ADADADAD WDFWFDWD created job code: CUS_CLI_Vat5_000040', 'created', '103.103.213.217', '2024-11-27 09:52:15', '2024-11-27 09:52:15'),
(614, 6, '2024-11-27', '-', 0, ' Logged In', 'Processor Nikita  bhagat  Logged In ', '-', '103.103.213.217', '2024-11-27 09:53:18', '2024-11-27 09:53:18'),
(615, 2, '2024-11-27', 'permission', 3, ' updated the access for PROCESSOR. Access Changes Add Permission (client-insert) ', 'Admin Amit Amit  updated the access for PROCESSOR. Access Changes Add Permission (client-insert)  ', 'updated', '103.103.213.217', '2024-11-27 09:53:42', '2024-11-27 09:53:42'),
(616, 6, '2024-11-27', 'client', 45, 'created client profile. client code :', 'Processor Nikita  bhagat created client profile. client code : cli_DHI_CLI_000045(CLIE99)', 'created', '103.103.213.217', '2024-11-27 09:54:03', '2024-11-27 09:54:03'),
(617, 13, '2024-11-27', 'job', 41, 'edited the job information and has assigned the job to the processor, Nikita  bhagat job code:', 'Reviewer ADADADAD WDFWFDWD edited the job information and has assigned the job to the processor, Nikita  bhagat job code: CUS_CLI_VAT2_000038', 'updated', '103.103.213.217', '2024-11-27 09:54:31', '2024-11-27 09:54:31'),
(618, 6, '2024-11-27', 'client', 46, 'created client profile. client code :', 'Processor Nikita  bhagat created client profile. client code : cli_CUS_CLI_000046(CLI25)', 'created', '103.103.213.217', '2024-11-27 09:54:57', '2024-11-27 09:54:57'),
(619, 2, '2024-11-27', 'job', 40, 'sent the queries for job code:', 'Admin Amit Amit sent the queries for job code: CUS_CLI_as_000037', 'created', '103.103.213.217', '2024-11-27 10:01:00', '2024-11-27 10:01:00'),
(620, 2, '2024-11-27', 'job', 40, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_CLI_as_000037', 'created', '103.103.213.217', '2024-11-27 10:01:06', '2024-11-27 10:01:06'),
(621, 2, '2024-11-27', 'job', 40, 'sent the queries for job code:', 'Admin Amit Amit sent the queries for job code: CUS_CLI_as_000037', 'created', '103.103.213.217', '2024-11-27 10:02:30', '2024-11-27 10:02:30'),
(622, 2, '2024-11-27', 'job', 40, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_CLI_as_000037', 'created', '103.103.213.217', '2024-11-27 10:02:50', '2024-11-27 10:02:50'),
(623, 2, '2024-11-27', 'job', 40, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_CLI_as_000037', 'created', '103.103.213.217', '2024-11-27 10:03:08', '2024-11-27 10:03:08'),
(624, 2, '2024-11-27', 'job', 40, 'completed the missing logs job code:', 'Admin Amit Amit completed the missing logs job code: CUS_CLI_as_000037', 'updated', '103.103.213.217', '2024-11-27 10:03:36', '2024-11-27 10:03:36'),
(625, 2, '2024-11-27', 'job', 40, 'completed the queries job code:', 'Admin Amit Amit completed the queries job code: CUS_CLI_as_000037', 'updated', '103.103.213.217', '2024-11-27 10:03:43', '2024-11-27 10:03:43'),
(626, 2, '2024-11-27', 'job', 40, 'completed the queries job code:', 'Admin Amit Amit completed the queries job code: CUS_CLI_as_000037', 'updated', '103.103.213.217', '2024-11-27 10:03:49', '2024-11-27 10:03:49'),
(627, 2, '2024-11-27', 'job', 40, 'completed the draft job code:', 'Admin Amit Amit completed the draft job code: CUS_CLI_as_000037', 'updated', '103.103.213.217', '2024-11-27 10:03:56', '2024-11-27 10:03:56'),
(628, 2, '2024-11-27', 'job', 40, 'completed the draft job code:', 'Admin Amit Amit completed the draft job code: CUS_CLI_as_000037', 'updated', '103.103.213.217', '2024-11-27 10:04:27', '2024-11-27 10:04:27'),
(629, 2, '2024-11-27', 'job', 40, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_CLI_as_000037', 'created', '103.103.213.217', '2024-11-27 10:04:52', '2024-11-27 10:04:52'),
(630, 2, '2024-11-27', 'job', 40, 'sent the queries for job code:', 'Admin Amit Amit sent the queries for job code: CUS_CLI_as_000037', 'created', '103.103.213.217', '2024-11-27 10:05:53', '2024-11-27 10:05:53'),
(631, 2, '2024-11-27', 'job', 40, 'completed the queries job code:', 'Admin Amit Amit completed the queries job code: CUS_CLI_as_000037', 'updated', '103.103.213.217', '2024-11-27 10:06:08', '2024-11-27 10:06:08'),
(632, 2, '2024-11-27', 'job', 40, 'completed the draft job code:', 'Admin Amit Amit completed the draft job code: CUS_CLI_as_000037', 'updated', '103.103.213.217', '2024-11-27 10:06:15', '2024-11-27 10:06:15'),
(633, 2, '2024-11-27', 'job', 40, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_CLI_as_000037', 'created', '103.103.213.217', '2024-11-27 10:06:39', '2024-11-27 10:06:39'),
(634, 13, '2024-11-27', '-', 0, ' Logged Out', 'Reviewer ADADADAD WDFWFDWD  Logged Out ', '-', '103.103.213.217', '2024-11-27 10:18:53', '2024-11-27 10:18:53'),
(635, 13, '2024-11-27', '-', 0, ' Logged In', 'Reviewer ADADADAD WDFWFDWD  Logged In ', '-', '103.103.213.217', '2024-11-27 10:53:03', '2024-11-27 10:53:03'),
(636, 2, '2024-11-27', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2024-11-25, Hours : 01:00 ,Job code:abc, Task name:c', 'Admin Amit Amit created a timesheet entry. Task type:Internal,  Date: 2024-11-25, Hours : 01:00 ,Job code:abc, Task name:c ', 'updated', '0.0.0.0', '2024-11-27 11:23:20', '2024-11-27 11:23:20'),
(637, 2, '2024-11-27', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2024-11-25, Hours : 01:00 ,Job code:CUS_CLI_Vat5_000040, Task name:ss', 'Admin Amit Amit created a timesheet entry. Task type:Internal,  Date: 2024-11-25, Hours : 01:00 ,Job code:CUS_CLI_Vat5_000040, Task name:ss ', 'updated', '0.0.0.0', '2024-11-27 11:23:44', '2024-11-27 11:23:44'),
(638, 2, '2024-11-27', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2024-11-25, Hours : 01:00 ,Job code:CUS_CLI_VAT2_000038, Task name:ssss', 'Admin Amit Amit created a timesheet entry. Task type:External,  Date: 2024-11-25, Hours : 01:00 ,Job code:CUS_CLI_VAT2_000038, Task name:ssss ', 'updated', '0.0.0.0', '2024-11-27 11:25:27', '2024-11-27 11:25:27'),
(639, 2, '2024-11-27', 'job', 44, 'created job code:', 'Admin Amit Amit created job code: CUS_CLI_Vat5_000041', 'created', '103.103.213.217', '2024-11-27 11:52:28', '2024-11-27 11:52:28'),
(640, 2, '2024-11-27', 'job', 44, 'updated the job status from Customer Processing to Draft Sent. job code:', 'Admin Amit Amit updated the job status from Customer Processing to Draft Sent. job code: CUS_CLI_Vat5_000041', 'updated', '103.103.213.217', '2024-11-27 12:33:37', '2024-11-27 12:33:37'),
(641, 2, '2024-11-27', 'job', 37, 'updated the job status from WIP – To Be Reviewed to Draft Sent. job code:', 'Admin Amit Amit updated the job status from WIP – To Be Reviewed to Draft Sent. job code: DHI_ABC_VAT2_000034', 'updated', '103.103.213.217', '2024-11-27 12:34:14', '2024-11-27 12:34:14'),
(642, 2, '2024-11-27', 'job', 39, 'edited the job information and edited the job invoice data job code:', 'Admin Amit Amit edited the job information and edited the job invoice data job code: MAN_MAN_VAT2_000036', 'updated', '103.103.213.217', '2024-11-27 12:42:50', '2024-11-27 12:42:50'),
(643, 2, '2024-11-27', 'job', 37, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: DHI_ABC_VAT2_000034', 'updated', '103.103.213.217', '2024-11-27 12:51:11', '2024-11-27 12:51:11'),
(644, 2, '2024-11-27', 'job', 37, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: DHI_ABC_VAT2_000034', 'updated', '103.103.213.217', '2024-11-27 12:52:03', '2024-11-27 12:52:03'),
(645, 2, '2024-11-27', 'job', 45, 'created job code:', 'Admin Amit Amit created job code: DHI_ABC_VAT2_000042', 'created', '103.103.213.217', '2024-11-27 12:52:40', '2024-11-27 12:52:40'),
(646, 2, '2024-11-27', 'job', 45, 'edited the job information, edited the job invoice data and has assigned the job to the reviewer, dascfascsac ascs job code:', 'Admin Amit Amit edited the job information, edited the job invoice data and has assigned the job to the reviewer, dascfascsac ascs job code: DHI_ABC_VAT2_000042', 'updated', '103.103.213.217', '2024-11-27 12:53:08', '2024-11-27 12:53:08'),
(647, 2, '2024-11-27', 'job', 46, 'created job code:', 'Admin Amit Amit created job code: DHI_ABC_VAT2_000043', 'created', '103.103.213.217', '2024-11-27 12:55:07', '2024-11-27 12:55:07'),
(648, 2, '2024-11-27', 'job', 46, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 12:55:28', '2024-11-27 12:55:28'),
(649, 2, '2024-11-27', 'job', 46, 'updated the job status from To Be Started - Not Yet Allocated Internally to Duplicate. job code:', 'Admin Amit Amit updated the job status from To Be Started - Not Yet Allocated Internally to Duplicate. job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 12:57:25', '2024-11-27 12:57:25'),
(650, 2, '2024-11-27', 'job', 46, 'edited the job information and has assigned the job to the reviewer, ADADADAD WDFWFDWD job code:', 'Admin Amit Amit edited the job information and has assigned the job to the reviewer, ADADADAD WDFWFDWD job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 12:57:43', '2024-11-27 12:57:43'),
(651, 2, '2024-11-27', 'job', 46, 'edited the job information and has assigned the job to the processor, Nikita  bhagat job code:', 'Admin Amit Amit edited the job information and has assigned the job to the processor, Nikita  bhagat job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 12:58:56', '2024-11-27 12:58:56'),
(652, 2, '2024-11-27', 'job', 46, 'deletes job code:', 'Admin Amit Amit deletes job code: DHI_ABC_VAT2_000043', 'deleted', '103.103.213.217', '2024-11-27 13:00:46', '2024-11-27 13:00:46'),
(653, 2, '2024-11-27', 'job', 47, 'created job code:', 'Admin Amit Amit created job code: DHI_ABC_VAT2_000043', 'created', '103.103.213.217', '2024-11-27 13:00:57', '2024-11-27 13:00:57'),
(654, 2, '2024-11-27', 'job', 47, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 13:02:12', '2024-11-27 13:02:12'),
(655, 2, '2024-11-27', 'job', 47, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 13:03:59', '2024-11-27 13:03:59'),
(656, 2, '2024-11-27', 'job', 47, 'updated the job status from To Be Started - Not Yet Allocated Internally to Duplicate. job code:', 'Admin Amit Amit updated the job status from To Be Started - Not Yet Allocated Internally to Duplicate. job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 13:04:17', '2024-11-27 13:04:17'),
(657, 2, '2024-11-27', 'job', 47, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 13:04:25', '2024-11-27 13:04:25'),
(658, 2, '2024-11-27', 'job', 47, 'edited the job information and has assigned the job to the reviewer, ADADADAD WDFWFDWD job code:', 'Admin Amit Amit edited the job information and has assigned the job to the reviewer, ADADADAD WDFWFDWD job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 13:07:39', '2024-11-27 13:07:39'),
(659, 2, '2024-11-27', 'job', 47, 'deletes job code:', 'Admin Amit Amit deletes job code: DHI_ABC_VAT2_000043', 'deleted', '103.103.213.217', '2024-11-27 13:08:31', '2024-11-27 13:08:31'),
(660, 2, '2024-11-27', 'job', 48, 'created job code:', 'Admin Amit Amit created job code: DHI_ABC_VAT2_000043', 'created', '103.103.213.217', '2024-11-27 13:08:43', '2024-11-27 13:08:43'),
(661, 2, '2024-11-27', 'job', 48, 'updated the job status from To Be Started - Not Yet Allocated Internally to Duplicate. job code:', 'Admin Amit Amit updated the job status from To Be Started - Not Yet Allocated Internally to Duplicate. job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 13:08:51', '2024-11-27 13:08:51'),
(662, 2, '2024-11-27', 'job', 48, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 13:08:57', '2024-11-27 13:08:57'),
(663, 2, '2024-11-27', 'job', 48, 'deletes job code:', 'Admin Amit Amit deletes job code: DHI_ABC_VAT2_000043', 'deleted', '103.103.213.217', '2024-11-27 13:09:45', '2024-11-27 13:09:45'),
(664, 2, '2024-11-27', 'job', 49, 'created job code:', 'Admin Amit Amit created job code: DHI_ABC_VAT2_000043', 'created', '103.103.213.217', '2024-11-27 13:09:57', '2024-11-27 13:09:57'),
(665, 2, '2024-11-27', 'job', 49, 'updated the job status from To Be Started - Not Yet Allocated Internally to Duplicate. job code:', 'Admin Amit Amit updated the job status from To Be Started - Not Yet Allocated Internally to Duplicate. job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 13:10:01', '2024-11-27 13:10:01'),
(666, 2, '2024-11-27', 'job', 49, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 13:10:09', '2024-11-27 13:10:09'),
(667, 2, '2024-11-27', 'job', 49, 'edited the job information and has assigned the job to the reviewer, ADADADAD WDFWFDWD job code:', 'Admin Amit Amit edited the job information and has assigned the job to the reviewer, ADADADAD WDFWFDWD job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 13:10:32', '2024-11-27 13:10:32'),
(668, 2, '2024-11-27', 'job', 49, 'updated the job status from WIP – To Be Reviewed to Waiting for Credentials. job code:', 'Admin Amit Amit updated the job status from WIP – To Be Reviewed to Waiting for Credentials. job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 13:10:49', '2024-11-27 13:10:49'),
(669, 2, '2024-11-27', 'job', 49, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 13:10:57', '2024-11-27 13:10:57'),
(670, 2, '2024-11-27', 'job', 49, 'edited the job information and has assigned the job to the processor, Nikita  bhagat job code:', 'Admin Amit Amit edited the job information and has assigned the job to the processor, Nikita  bhagat job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 13:11:24', '2024-11-27 13:11:24'),
(671, 2, '2024-11-27', 'job', 49, 'edited the job information and changed the job to the reviewer, shk hu job code:', 'Admin Amit Amit edited the job information and changed the job to the reviewer, shk hu job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 13:11:41', '2024-11-27 13:11:41'),
(672, 2, '2024-11-27', 'job', 49, 'edited the job information and changed the job to the processor, staff staff job code:', 'Admin Amit Amit edited the job information and changed the job to the processor, staff staff job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 13:11:54', '2024-11-27 13:11:54'),
(673, 2, '2024-11-27', 'job', 49, 'edited the job information, changed the job to the reviewer, ADADADAD WDFWFDWD and changed the job to the processor, Nikita  bhagat job code:', 'Admin Amit Amit edited the job information, changed the job to the reviewer, ADADADAD WDFWFDWD and changed the job to the processor, Nikita  bhagat job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 13:12:07', '2024-11-27 13:12:07'),
(674, 2, '2024-11-27', 'job', 49, 'updated the job status from WIP – To Be Reviewed to Bookkeeping Not Completed. job code:', 'Admin Amit Amit updated the job status from WIP – To Be Reviewed to Bookkeeping Not Completed. job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 13:12:15', '2024-11-27 13:12:15'),
(675, 2, '2024-11-27', 'job', 49, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-27 13:12:23', '2024-11-27 13:12:23'),
(676, 2, '2024-11-28', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-11-28 05:09:58', '2024-11-28 05:09:58'),
(677, 2, '2024-11-28', 'customer', 35, 'added FTE/Dedicated Staffing, added Adhoc/PAYG/Hourly and added Customised Pricing (engagement model) customer code :', 'Admin Amit Amit added FTE/Dedicated Staffing, added Adhoc/PAYG/Hourly and added Customised Pricing (engagement model) customer code : cust_CUS_000035(CUST6)', 'updated', '103.103.213.217', '2024-11-28 06:04:24', '2024-11-28 06:04:24'),
(678, 2, '2024-11-28', 'job', 50, 'created job code:', 'Admin Amit Amit created job code: CUS_CLI_VAT2_000044', 'created', '103.103.213.217', '2024-11-28 06:04:50', '2024-11-28 06:04:50'),
(679, 2, '2024-11-28', 'job', 50, 'edited the job information and edited the job invoice data job code:', 'Admin Amit Amit edited the job information and edited the job invoice data job code: CUS_CLI_VAT2_000044', 'updated', '103.103.213.217', '2024-11-28 06:05:40', '2024-11-28 06:05:40'),
(680, 2, '2024-11-28', 'job', 50, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_CLI_VAT2_000044', 'updated', '103.103.213.217', '2024-11-28 06:05:51', '2024-11-28 06:05:51'),
(681, 2, '2024-11-28', 'job', 50, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_CLI_VAT2_000044', 'updated', '103.103.213.217', '2024-11-28 06:07:36', '2024-11-28 06:07:36'),
(682, 2, '2024-11-28', 'job', 50, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_CLI_VAT2_000044', 'updated', '103.103.213.217', '2024-11-28 06:09:03', '2024-11-28 06:09:03'),
(683, 2, '2024-11-28', 'job', 50, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_CLI_VAT2_000044', 'updated', '103.103.213.217', '2024-11-28 06:09:25', '2024-11-28 06:09:25');
INSERT INTO `staff_logs` (`id`, `staff_id`, `date`, `module_name`, `module_id`, `log_message`, `log_message_all`, `permission_type`, `ip`, `created_at`, `updated_at`) VALUES
(684, 2, '2024-11-28', 'job', 50, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_CLI_VAT2_000044', 'updated', '103.103.213.217', '2024-11-28 06:09:45', '2024-11-28 06:09:45'),
(685, 2, '2024-11-28', 'job', 50, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_CLI_VAT2_000044', 'updated', '103.103.213.217', '2024-11-28 06:12:57', '2024-11-28 06:12:57'),
(686, 2, '2024-11-28', 'job', 50, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_CLI_VAT2_000044', 'updated', '103.103.213.217', '2024-11-28 06:13:08', '2024-11-28 06:13:08'),
(687, 2, '2024-11-28', 'job', 50, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_CLI_VAT2_000044', 'updated', '103.103.213.217', '2024-11-28 06:13:18', '2024-11-28 06:13:18'),
(688, 2, '2024-11-28', 'job', 50, 'deletes job code:', 'Admin Amit Amit deletes job code: CUS_CLI_VAT2_000044', 'deleted', '103.103.213.217', '2024-11-28 06:13:23', '2024-11-28 06:13:23'),
(689, 2, '2024-11-28', 'customer', 32, 'edited the company information customer code :', 'Admin Amit Amit edited the company information customer code : cust_DHI_000032(DHILLON PROPERTY AND ASSET INVESTMENTS (UK) LTD)', 'updated', '103.103.213.217', '2024-11-28 06:13:48', '2024-11-28 06:13:48'),
(690, 2, '2024-11-28', 'customer', 32, 'added FTE/Dedicated Staffing, added Adhoc/PAYG/Hourly and added Customised Pricing (engagement model) customer code :', 'Admin Amit Amit added FTE/Dedicated Staffing, added Adhoc/PAYG/Hourly and added Customised Pricing (engagement model) customer code : cust_DHI_000032(DHILLON PROPERTY AND ASSET INVESTMENTS (UK) LTD)', 'updated', '103.103.213.217', '2024-11-28 06:14:07', '2024-11-28 06:14:07'),
(691, 2, '2024-11-28', 'job', 49, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-28 06:14:35', '2024-11-28 06:14:35'),
(692, 2, '2024-11-28', 'job', 49, 'edited the job information and edited the job invoice data job code:', 'Admin Amit Amit edited the job information and edited the job invoice data job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-28 06:14:46', '2024-11-28 06:14:46'),
(693, 2, '2024-11-28', 'job', 49, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: DHI_ABC_VAT2_000043', 'updated', '103.103.213.217', '2024-11-28 06:14:53', '2024-11-28 06:14:53'),
(694, 10, '2024-11-28', '-', 0, ' Logged In', 'Manager MAN1 HHH  Logged In ', '-', NULL, '2024-11-28 06:16:01', '2024-11-28 06:16:01'),
(695, 10, '2024-11-28', 'client', 47, 'created client profile. client code :', 'Manager MAN1 HHH created client profile. client code : cli_CUS_CLI_000047(CLIE-11)', 'created', NULL, '2024-11-28 06:16:37', '2024-11-28 06:16:37'),
(696, 2, '2024-11-28', 'customer', 35, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_CUS_000035(CUST6)', 'updated', '103.103.213.217', '2024-11-28 06:17:19', '2024-11-28 06:17:19'),
(697, 5, '2024-11-28', '-', 0, ' Logged In', 'Manager staff manager staff manager  Logged In ', '-', '103.103.213.217', '2024-11-28 06:18:42', '2024-11-28 06:18:42'),
(698, 5, '2024-11-28', 'client', 48, 'created client profile. client code :', 'Manager staff manager staff manager created client profile. client code : cli_CUS_CLI_000048(CLIE-22)', 'created', '103.103.213.217', '2024-11-28 06:19:02', '2024-11-28 06:19:02'),
(699, 10, '2024-11-28', '-', 0, ' Logged Out', 'Manager MAN1 HHH  Logged Out ', '-', NULL, '2024-11-28 06:21:00', '2024-11-28 06:21:00'),
(700, 6, '2024-11-28', '-', 0, ' Logged In', 'Processor Nikita  bhagat  Logged In ', '-', NULL, '2024-11-28 06:21:20', '2024-11-28 06:21:20'),
(701, 6, '2024-11-28', 'customer', 36, 'created customer profile. customer code :', 'Processor Nikita  bhagat created customer profile. customer code : cust_CUS_000036(CUST-125)', 'created', NULL, '2024-11-28 06:21:53', '2024-11-28 06:21:53'),
(702, 5, '2024-11-28', 'client', 49, 'created client profile. client code :', 'Manager staff manager staff manager created client profile. client code : cli_CUS_CLI_000049(CLIE-1251)', 'created', '103.103.213.217', '2024-11-28 06:22:44', '2024-11-28 06:22:44'),
(703, 5, '2024-11-28', 'job', 51, 'created job code:', 'Manager staff manager staff manager created job code: CUS_CLI_VAT1_000044', 'created', '103.103.213.217', '2024-11-28 06:26:38', '2024-11-28 06:26:38'),
(704, 5, '2024-11-28', '-', 0, ' Logged Out', 'Manager staff manager staff manager  Logged Out ', '-', '103.103.213.217', '2024-11-28 06:28:08', '2024-11-28 06:28:08'),
(705, 2, '2024-11-28', 'permission', 3, ' updated the access for PROCESSOR. Access Changes Add Permission (customer-update) ', 'Admin Amit Amit  updated the access for PROCESSOR. Access Changes Add Permission (customer-update)  ', 'updated', '103.103.213.217', '2024-11-28 06:30:30', '2024-11-28 06:30:30'),
(706, 10, '2024-11-28', '-', 0, ' Logged In', 'Manager MAN1 HHH  Logged In ', '-', '103.103.213.217', '2024-11-28 06:31:08', '2024-11-28 06:31:08'),
(707, 10, '2024-11-28', 'job', 52, 'created job code:', 'Manager MAN1 HHH created job code: CUS_CLI_Vat5_000045', 'created', '103.103.213.217', '2024-11-28 06:32:06', '2024-11-28 06:32:06'),
(708, 6, '2024-11-28', 'client', 50, 'created client profile. client code :', 'Processor Nikita  bhagat created client profile. client code : cli_CUS_CLI_000050(CLIE-1262)', 'created', '103.103.213.217', '2024-11-28 06:32:57', '2024-11-28 06:32:57'),
(709, 6, '2024-11-28', 'job', 53, 'created job code:', 'Processor Nikita  bhagat created job code: CUS_CLI_Vat5_000046', 'created', '103.103.213.217', '2024-11-28 06:33:26', '2024-11-28 06:33:26'),
(710, 2, '2024-11-28', 'job', 53, 'edited the job information and edited the job invoice data job code:', 'Admin Amit Amit edited the job information and edited the job invoice data job code: CUS_CLI_Vat5_000046', 'updated', '103.103.213.217', '2024-11-28 06:59:26', '2024-11-28 06:59:26'),
(711, 2, '2024-11-28', 'job', 53, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_CLI_Vat5_000046', 'updated', '103.103.213.217', '2024-11-28 07:00:57', '2024-11-28 07:00:57'),
(712, 2, '2024-11-28', 'job', 52, 'edited the job information and edited the job invoice data job code:', 'Admin Amit Amit edited the job information and edited the job invoice data job code: CUS_CLI_Vat5_000045', 'updated', '103.103.213.217', '2024-11-28 07:02:54', '2024-11-28 07:02:54'),
(713, 2, '2024-11-28', 'job', 51, 'edited the job information and edited the job invoice data job code:', 'Admin Amit Amit edited the job information and edited the job invoice data job code: CUS_CLI_VAT1_000044', 'updated', '103.103.213.217', '2024-11-28 07:07:40', '2024-11-28 07:07:40'),
(714, 2, '2024-11-28', 'job', 54, 'created job code:', 'Admin Amit Amit created job code: CUS_CLI_Vat5_000047', 'created', '103.103.213.217', '2024-11-28 07:08:38', '2024-11-28 07:08:38'),
(715, 2, '2024-11-28', 'job', 54, 'edited the job information and edited the job invoice data job code:', 'Admin Amit Amit edited the job information and edited the job invoice data job code: CUS_CLI_Vat5_000047', 'updated', '103.103.213.217', '2024-11-28 07:08:48', '2024-11-28 07:08:48'),
(716, 2, '2024-11-28', 'job', 55, 'created job code:', 'Admin Amit Amit created job code: CUS_CLI_Vat5_000048', 'created', '103.103.213.217', '2024-11-28 07:10:04', '2024-11-28 07:10:04'),
(717, 2, '2024-11-28', 'job', 55, 'edited the job information and edited the job invoice data job code:', 'Admin Amit Amit edited the job information and edited the job invoice data job code: CUS_CLI_Vat5_000048', 'updated', '103.103.213.217', '2024-11-28 07:10:14', '2024-11-28 07:10:14'),
(718, 2, '2024-11-28', 'job', 56, 'created job code:', 'Admin Amit Amit created job code: CUS_CLI_Vat5_000049', 'created', '103.103.213.217', '2024-11-28 07:12:18', '2024-11-28 07:12:18'),
(719, 2, '2024-11-28', 'job', 56, 'edited the job information and edited the job invoice data job code:', 'Admin Amit Amit edited the job information and edited the job invoice data job code: CUS_CLI_Vat5_000049', 'updated', '103.103.213.217', '2024-11-28 07:12:25', '2024-11-28 07:12:25'),
(720, 2, '2024-11-28', 'job', 57, 'created job code:', 'Admin Amit Amit created job code: CUS_CLI_Vat5_000050', 'created', '103.103.213.217', '2024-11-28 07:13:25', '2024-11-28 07:13:25'),
(721, 2, '2024-11-28', 'job', 57, 'edited the job information and edited the job invoice data job code:', 'Admin Amit Amit edited the job information and edited the job invoice data job code: CUS_CLI_Vat5_000050', 'updated', '103.103.213.217', '2024-11-28 07:13:34', '2024-11-28 07:13:34'),
(722, 2, '2024-11-28', 'job', 58, 'created job code:', 'Admin Amit Amit created job code: CUS_CLI_Vat5_000051', 'created', '103.103.213.217', '2024-11-28 07:15:28', '2024-11-28 07:15:28'),
(723, 2, '2024-11-28', 'job', 58, 'edited the job information and edited the job invoice data job code:', 'Admin Amit Amit edited the job information and edited the job invoice data job code: CUS_CLI_Vat5_000051', 'updated', '103.103.213.217', '2024-11-28 07:15:43', '2024-11-28 07:15:43'),
(724, 2, '2024-11-28', 'job', 59, 'created job code:', 'Admin Amit Amit created job code: CUS_CLI_Vat5_000052', 'created', '103.103.213.217', '2024-11-28 07:32:06', '2024-11-28 07:32:06'),
(725, 2, '2024-11-28', 'job', 59, 'edited the job information and edited the job invoice data job code:', 'Admin Amit Amit edited the job information and edited the job invoice data job code: CUS_CLI_Vat5_000052', 'updated', '103.103.213.217', '2024-11-28 07:32:21', '2024-11-28 07:32:21'),
(726, 2, '2024-11-28', 'job', 60, 'created job code:', 'Admin Amit Amit created job code: CUS_CLI_Vat5_000053', 'created', '103.103.213.217', '2024-11-28 07:34:03', '2024-11-28 07:34:03'),
(727, 2, '2024-11-28', 'job', 60, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_CLI_Vat5_000053', 'updated', '103.103.213.217', '2024-11-28 07:34:11', '2024-11-28 07:34:11'),
(728, 2, '2024-11-28', 'job', 61, 'created job code:', 'Admin Amit Amit created job code: CUS_CLI_Vat5_000054', 'created', '103.103.213.217', '2024-11-28 08:17:33', '2024-11-28 08:17:33'),
(729, 2, '2024-11-28', 'job', 61, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_CLI_Vat5_000054', 'updated', '103.103.213.217', '2024-11-28 08:18:05', '2024-11-28 08:18:05'),
(730, 2, '2024-11-28', 'job', 61, 'edited the job information and has assigned the job to the reviewer, ADADADAD WDFWFDWD job code:', 'Admin Amit Amit edited the job information and has assigned the job to the reviewer, ADADADAD WDFWFDWD job code: CUS_CLI_Vat5_000054', 'updated', '103.103.213.217', '2024-11-28 08:39:32', '2024-11-28 08:39:32'),
(731, 2, '2024-11-28', 'job', 61, 'edited the job information and has assigned the job to the processor, Nikita  bhagat job code:', 'Admin Amit Amit edited the job information and has assigned the job to the processor, Nikita  bhagat job code: CUS_CLI_Vat5_000054', 'updated', '103.103.213.217', '2024-11-28 08:39:40', '2024-11-28 08:39:40'),
(732, 2, '2024-11-28', 'job', 61, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_CLI_Vat5_000054', 'updated', '103.103.213.217', '2024-11-28 08:39:51', '2024-11-28 08:39:51'),
(733, 2, '2024-11-28', 'job', 61, 'edited the job information and changed the job to the processor, staff staff job code:', 'Admin Amit Amit edited the job information and changed the job to the processor, staff staff job code: CUS_CLI_Vat5_000054', 'updated', '103.103.213.217', '2024-11-28 08:40:58', '2024-11-28 08:40:58'),
(734, 2, '2024-11-28', 'job', 61, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_CLI_Vat5_000054', 'updated', '103.103.213.217', '2024-11-28 08:41:12', '2024-11-28 08:41:12'),
(735, 2, '2024-11-28', 'job', 61, 'edited the job information and changed the job to the processor, Nikita  bhagat job code:', 'Admin Amit Amit edited the job information and changed the job to the processor, Nikita  bhagat job code: CUS_CLI_Vat5_000054', 'updated', '103.103.213.217', '2024-11-28 08:43:48', '2024-11-28 08:43:48'),
(736, 2, '2024-11-28', 'job', 61, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_CLI_Vat5_000054', 'updated', '103.103.213.217', '2024-11-28 08:44:08', '2024-11-28 08:44:08'),
(737, 2, '2024-11-28', 'job', 61, 'edited the job information and changed the job to the processor, staff staff job code:', 'Admin Amit Amit edited the job information and changed the job to the processor, staff staff job code: CUS_CLI_Vat5_000054', 'updated', '103.103.213.217', '2024-11-28 08:46:19', '2024-11-28 08:46:19'),
(738, 2, '2024-11-28', 'job', 61, 'edited the job information and changed the job to the processor, Nikita  bhagat job code:', 'Admin Amit Amit edited the job information and changed the job to the processor, Nikita  bhagat job code: CUS_CLI_Vat5_000054', 'updated', '103.103.213.217', '2024-11-28 08:47:27', '2024-11-28 08:47:27'),
(739, 2, '2024-11-28', 'job', 61, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_CLI_Vat5_000054', 'updated', '103.103.213.217', '2024-11-28 08:47:38', '2024-11-28 08:47:38'),
(740, 2, '2024-11-28', 'job', 61, 'edited the job information and changed the job to the reviewer, SSSSFGGG DDFSFSF job code:', 'Admin Amit Amit edited the job information and changed the job to the reviewer, SSSSFGGG DDFSFSF job code: CUS_CLI_Vat5_000054', 'updated', '103.103.213.217', '2024-11-28 08:47:45', '2024-11-28 08:47:45'),
(741, 2, '2024-11-28', 'job', 61, 'updated the job status from WIP – To Be Reviewed to Duplicate. job code:', 'Admin Amit Amit updated the job status from WIP – To Be Reviewed to Duplicate. job code: CUS_CLI_Vat5_000054', 'updated', '103.103.213.217', '2024-11-28 08:47:52', '2024-11-28 08:47:52'),
(742, 2, '2024-11-28', 'job', 61, 'edited the job information job code:', 'Admin Amit Amit edited the job information job code: CUS_CLI_Vat5_000054', 'updated', '103.103.213.217', '2024-11-28 08:48:01', '2024-11-28 08:48:01'),
(743, 2, '2024-11-28', 'customer', 36, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_CUS_000036(CUST-125)', 'updated', '103.103.213.217', '2024-11-28 09:12:42', '2024-11-28 09:12:42'),
(744, 2, '2024-11-28', 'customer', 36, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_000036(CUST-125)', 'updated', '103.103.213.217', '2024-11-28 09:14:02', '2024-11-28 09:14:02'),
(745, 2, '2024-11-28', 'customer', 36, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_000036(CUST-125)', 'updated', '103.103.213.217', '2024-11-28 09:14:13', '2024-11-28 09:14:13'),
(746, 2, '2024-11-28', 'customer', 37, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_CUS_000037(CUST-26)', 'created', '103.103.213.217', '2024-11-28 09:15:54', '2024-11-28 09:15:54'),
(747, 2, '2024-11-28', 'customer', 37, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_CUS_000037(CUST-26)', 'updated', '103.103.213.217', '2024-11-28 09:23:34', '2024-11-28 09:23:34'),
(748, 2, '2024-11-28', 'customer', 37, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_000037(CUST-26)', 'updated', '103.103.213.217', '2024-11-28 09:23:46', '2024-11-28 09:23:46'),
(749, 2, '2024-11-28', 'customer', 37, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_000037(CUST-26)', 'updated', '103.103.213.217', '2024-11-28 10:02:09', '2024-11-28 10:02:09'),
(750, 2, '2024-11-28', 'client', 51, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_CUS_CLI_000051(CLIE-SSS)', 'created', '103.103.213.217', '2024-11-28 10:23:42', '2024-11-28 10:23:42'),
(751, 2, '2024-11-28', 'job', 62, 'created job code:', 'Admin Amit Amit created job code: CUS_CLI_as_000055', 'created', '103.103.213.217', '2024-11-28 10:23:58', '2024-11-28 10:23:58'),
(752, 2, '2024-11-28', 'customer', 37, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_000037(CUST-26)', 'updated', '103.103.213.217', '2024-11-28 10:24:24', '2024-11-28 10:24:24'),
(753, 2, '2024-11-28', 'customer', 37, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_000037(CUST-26)', 'updated', '103.103.213.217', '2024-11-28 10:28:17', '2024-11-28 10:28:17'),
(754, 2, '2024-11-28', 'customer', 37, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_CUS_000037(CUST-26)', 'updated', '103.103.213.217', '2024-11-28 10:33:54', '2024-11-28 10:33:54'),
(755, 2, '2024-11-28', 'job', 63, 'created job code:', 'Admin Amit Amit created job code: CUS_CLI_as_000056', 'created', '103.103.213.217', '2024-11-28 10:52:54', '2024-11-28 10:52:54'),
(756, 2, '2024-11-28', 'customer', 37, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_CUS_000037(CUST-26)', 'updated', '103.103.213.217', '2024-11-28 11:29:50', '2024-11-28 11:29:50'),
(757, 2, '2024-11-28', 'customer', 37, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_000037(CUST-26)', 'updated', '103.103.213.217', '2024-11-28 11:33:19', '2024-11-28 11:33:19'),
(758, 2, '2024-11-28', 'customer', 37, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_CUS_000037(CUST-26)', 'updated', '103.103.213.217', '2024-11-28 11:33:50', '2024-11-28 11:33:50'),
(759, 2, '2024-11-28', 'customer', 37, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_000037(CUST-26)', 'updated', '103.103.213.217', '2024-11-28 11:36:54', '2024-11-28 11:36:54'),
(760, 2, '2024-11-28', 'job', 64, 'created job code:', 'Admin Amit Amit created job code: CUS_CLI_as_000057', 'created', '103.103.213.217', '2024-11-28 11:39:49', '2024-11-28 11:39:49'),
(761, 2, '2024-11-28', 'customer', 37, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_CUS_000037(CUST-26)', 'updated', '103.103.213.217', '2024-11-28 11:45:50', '2024-11-28 11:45:50'),
(762, 2, '2024-11-28', 'customer', 37, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_CUS_000037(CUST-26)', 'updated', '103.103.213.217', '2024-11-28 11:45:53', '2024-11-28 11:45:53'),
(763, 2, '2024-11-28', 'customer', 37, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_000037(CUST-26)', 'updated', '103.103.213.217', '2024-11-28 11:47:36', '2024-11-28 11:47:36'),
(764, 2, '2024-11-28', 'customer', 37, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_CUS_000037(CUST-26)', 'updated', '103.103.213.217', '2024-11-28 11:47:49', '2024-11-28 11:47:49'),
(765, 2, '2024-11-28', 'customer', 37, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_000037(CUST-26)', 'updated', '103.103.213.217', '2024-11-28 11:51:14', '2024-11-28 11:51:14'),
(766, 2, '2024-11-28', 'job', 65, 'created job code:', 'Admin Amit Amit created job code: CUS_CLI_VAT3_000058', 'created', '103.103.213.217', '2024-11-28 11:51:37', '2024-11-28 11:51:37'),
(767, 2, '2024-11-28', 'customer', 37, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_CUS_000037(CUST-26)', 'updated', '103.103.213.217', '2024-11-28 11:51:55', '2024-11-28 11:51:55'),
(768, 2, '2024-11-28', 'customer', 37, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_000037(CUST-26)', 'updated', '103.103.213.217', '2024-11-28 11:54:50', '2024-11-28 11:54:50'),
(769, 2, '2024-11-28', 'customer', 38, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_CUS_000038(CUS- 65)', 'created', '103.103.213.217', '2024-11-28 11:59:05', '2024-11-28 11:59:05'),
(770, 2, '2024-11-28', 'client', 52, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_CUS_CLI_000052(CLIE-9)', 'created', '103.103.213.217', '2024-11-28 12:01:14', '2024-11-28 12:01:14'),
(771, 2, '2024-11-28', 'checklist', 13, 'created checklist SSSSS', 'Admin Amit Amit created checklist SSSSS ', 'created', '103.103.213.217', '2024-11-28 12:10:59', '2024-11-28 12:10:59'),
(772, 2, '2024-11-28', 'customer', 38, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_000038(CUS- 65)', 'updated', '103.103.213.217', '2024-11-28 12:11:37', '2024-11-28 12:11:37'),
(773, 2, '2024-11-28', 'staff', 20, 'created staff SSS_FF ss', 'Admin Amit Amit created staff SSS_FF ss ', 'created', '103.103.213.217', '2024-11-28 13:31:30', '2024-11-28 13:31:30'),
(774, 6, '2024-11-28', '-', 0, ' Logged Out', 'Processor Nikita  bhagat  Logged Out ', '-', '103.103.213.217', '2024-11-28 13:51:48', '2024-11-28 13:51:48'),
(775, 2, '2024-11-29', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-11-29 05:57:37', '2024-11-29 05:57:37'),
(776, 2, '2024-11-29', 'staff', 15, 'changes the staff status Deactivate mmm hhh', 'Admin Amit Amit changes the staff status Deactivate mmm hhh ', 'updated', '103.103.213.217', '2024-11-29 05:57:54', '2024-11-29 05:57:54'),
(777, 2, '2024-11-29', 'staff', 13, 'changes the staff status Deactivate ADADADAD WDFWFDWD', 'Admin Amit Amit changes the staff status Deactivate ADADADAD WDFWFDWD ', 'updated', '103.103.213.217', '2024-11-29 10:28:38', '2024-11-29 10:28:38'),
(778, 2, '2024-11-29', 'staff', 10, 'changes the staff status Deactivate MAN1 HHH', 'Admin Amit Amit changes the staff status Deactivate MAN1 HHH ', 'updated', '103.103.213.217', '2024-11-29 10:36:58', '2024-11-29 10:36:58'),
(779, 2, '2024-11-29', 'staff', 10, 'changes the staff status Activate MAN1 HHH', 'Admin Amit Amit changes the staff status Activate MAN1 HHH ', 'updated', '103.103.213.217', '2024-11-29 10:38:21', '2024-11-29 10:38:21'),
(780, 2, '2024-11-29', 'job', 65, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_CLI_VAT3_000058', 'created', '103.103.213.217', '2024-11-29 10:41:40', '2024-11-29 10:41:40'),
(781, 2, '2024-11-29', 'staff', 10, 'changes the staff status Deactivate MAN1 HHH', 'Admin Amit Amit changes the staff status Deactivate MAN1 HHH ', 'updated', '103.103.213.217', '2024-11-29 10:42:56', '2024-11-29 10:42:56'),
(782, 2, '2024-11-29', 'staff', 10, 'changes the staff status Activate MAN1 HHH', 'Admin Amit Amit changes the staff status Activate MAN1 HHH ', 'updated', '103.103.213.217', '2024-11-29 10:43:21', '2024-11-29 10:43:21'),
(783, 2, '2024-12-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-12-04 05:04:43', '2024-12-04 05:04:43'),
(784, 2, '2024-12-04', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2024-12-04 12:03:20', '2024-12-04 12:03:20'),
(785, 2, '2024-12-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-12-04 12:04:43', '2024-12-04 12:04:43'),
(786, 2, '2024-12-04', 'customer', 39, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_SSS_000039(SSSSSs)', 'created', '103.103.213.217', '2024-12-04 12:06:07', '2024-12-04 12:06:07'),
(787, 2, '2024-12-04', 'customer', 39, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_SSS_000039(SSSSSs)', 'updated', '103.103.213.217', '2024-12-04 12:06:22', '2024-12-04 12:06:22'),
(788, 2, '2024-12-04', 'customer', 39, 'added Percentage Model (engagement model) customer code :', 'Admin Amit Amit added Percentage Model (engagement model) customer code : cust_SSS_000039(SSSSSs)', 'updated', '103.103.213.217', '2024-12-04 12:06:51', '2024-12-04 12:06:51'),
(789, 2, '2024-12-04', 'customer', 40, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_PPP_000040(PPPPP)', 'created', '103.103.213.217', '2024-12-04 12:07:33', '2024-12-04 12:07:33'),
(790, 2, '2024-12-04', 'customer', 40, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_PPP_000040(PPPPP)', 'updated', '103.103.213.217', '2024-12-04 12:07:42', '2024-12-04 12:07:42'),
(791, 2, '2024-12-04', 'customer', 40, 'added Percentage Model (engagement model) customer code :', 'Admin Amit Amit added Percentage Model (engagement model) customer code : cust_PPP_000040(PPPPP)', 'updated', '103.103.213.217', '2024-12-04 12:07:55', '2024-12-04 12:07:55'),
(792, 2, '2024-12-05', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-12-05 05:43:54', '2024-12-05 05:43:54'),
(793, 19, '2024-12-05', '-', 0, ' Logged In', 'Management MANAGE MENT  Logged In ', '-', NULL, '2024-12-05 10:18:20', '2024-12-05 10:18:20'),
(794, 19, '2024-12-05', 'customer', 41, 'created customer profile. customer code :', 'Management MANAGE MENT created customer profile. customer code : cust_SFS_000041(SFSF)', 'created', NULL, '2024-12-05 10:18:52', '2024-12-05 10:18:52'),
(795, 19, '2024-12-05', 'client', 53, 'created client profile. client code :', 'Management MANAGE MENT created client profile. client code : cli_MAN_HHH_000053(HHHH)', 'created', NULL, '2024-12-05 10:19:37', '2024-12-05 10:19:37'),
(796, 19, '2024-12-05', 'client', 54, 'created client profile. client code :', 'Management MANAGE MENT created client profile. client code : cli_MAN_RRR_000054(RRRRRRR)', 'created', NULL, '2024-12-05 10:22:25', '2024-12-05 10:22:25'),
(797, 19, '2024-12-05', 'client', 55, 'created client profile. client code :', 'Management MANAGE MENT created client profile. client code : cli_SFS_ZZZ_000055(ZZZZZZ)', 'created', NULL, '2024-12-05 10:22:48', '2024-12-05 10:22:48'),
(798, 19, '2024-12-05', '-', 0, ' Logged Out', 'Management MANAGE MENT  Logged Out ', '-', '103.103.213.217', '2024-12-05 11:20:48', '2024-12-05 11:20:48'),
(799, 11, '2024-12-05', '-', 0, ' Logged In', 'Manager sss sss  Logged In ', '-', '103.103.213.217', '2024-12-05 11:21:20', '2024-12-05 11:21:20'),
(800, 11, '2024-12-05', '-', 0, ' Logged Out', 'Manager sss sss  Logged Out ', '-', '103.103.213.217', '2024-12-05 12:48:04', '2024-12-05 12:48:04'),
(801, 19, '2024-12-05', '-', 0, ' Logged In', 'Management MANAGE MENT  Logged In ', '-', '103.103.213.217', '2024-12-05 12:48:25', '2024-12-05 12:48:25'),
(802, 2, '2024-12-06', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-12-06 05:47:35', '2024-12-06 05:47:35'),
(803, 2, '2024-12-06', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2024-12-06 11:55:30', '2024-12-06 11:55:30'),
(804, 2, '2024-12-06', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-12-06 11:55:35', '2024-12-06 11:55:35'),
(805, 2, '2024-12-06', 'role', 9, 'created role SELF', 'Admin Amit Amit created role SELF ', 'created', '103.103.213.217', '2024-12-06 13:06:57', '2024-12-06 13:06:57'),
(806, 2, '2024-12-06', 'permission', 9, ' updated the access for SELF. Access Changes  Remove Permission (timesheet-insert, timesheet-update, timesheet-delete, timesheet-view)', 'Admin Amit Amit  updated the access for SELF. Access Changes  Remove Permission (timesheet-insert, timesheet-update, timesheet-delete, timesheet-view) ', 'updated', '103.103.213.217', '2024-12-06 13:07:09', '2024-12-06 13:07:09'),
(807, 2, '2024-12-09', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-12-09 05:40:35', '2024-12-09 05:40:36'),
(808, 2, '2024-12-10', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-12-10 07:29:26', '2024-12-10 07:29:28'),
(809, 2, '2024-12-10', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-12-10 07:29:26', '2024-12-10 07:29:28'),
(810, 2, '2024-12-10', 'customer', 42, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_EEE_000042(EEEE1)', 'created', '103.103.213.217', '2024-12-10 08:23:15', '2024-12-10 08:23:15'),
(811, 2, '2024-12-10', 'customer', 43, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_EEE_000043(EEEEEEE)', 'created', '103.103.213.217', '2024-12-10 08:29:23', '2024-12-10 08:29:23'),
(812, 2, '2024-12-10', 'customer', 44, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_BON_000044(BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED)', 'created', '103.103.213.217', '2024-12-10 09:00:41', '2024-12-10 09:00:41'),
(813, 2, '2024-12-10', 'customer', 45, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_BON_000045(BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED1)', 'created', '103.103.213.217', '2024-12-10 09:03:26', '2024-12-10 09:03:26'),
(814, 2, '2024-12-10', 'customer', 46, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_BON_000046(BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED11)', 'created', '103.103.213.217', '2024-12-10 09:04:08', '2024-12-10 09:04:08'),
(815, 2, '2024-12-10', 'customer', 47, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_BON_000047(BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED111)', 'created', '103.103.213.217', '2024-12-10 09:05:12', '2024-12-10 09:05:12'),
(816, 2, '2024-12-10', 'customer', 48, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_BON_000048(BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED1111)', 'created', '103.103.213.217', '2024-12-10 09:06:51', '2024-12-10 09:06:51'),
(817, 2, '2024-12-10', 'customer', 48, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_BON_000048(BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED1111)', 'updated', '103.103.213.217', '2024-12-10 09:11:36', '2024-12-10 09:11:36'),
(818, 2, '2024-12-10', 'customer', 48, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_BON_000048(BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED1111)', 'updated', '103.103.213.217', '2024-12-10 09:11:57', '2024-12-10 09:11:57'),
(819, 2, '2024-12-10', 'customer', 48, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_BON_000048(BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED1111)', 'updated', '103.103.213.217', '2024-12-10 09:12:05', '2024-12-10 09:12:05'),
(820, 2, '2024-12-10', 'customer', 48, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_BON_000048(BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED1111)', 'updated', '103.103.213.217', '2024-12-10 09:12:16', '2024-12-10 09:12:16'),
(821, 2, '2024-12-10', 'customer', 48, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_BON_000048(BONDI UK INVESTMENTS AND DEVELOPMENT LIMITED1111)', 'updated', '103.103.213.217', '2024-12-10 09:12:21', '2024-12-10 09:12:21'),
(822, 2, '2024-12-10', 'customer', 49, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_A A_000049(A A ABBEY ROOFING & BUILDING CONTRACTORS LTD)', 'created', '103.103.213.217', '2024-12-10 11:28:24', '2024-12-10 11:28:24'),
(823, 2, '2024-12-10', 'customer', 49, 'edited the company information customer code :', 'Admin Amit Amit edited the company information customer code : cust_A  _000049(A  +  A LTD)', 'updated', '103.103.213.217', '2024-12-10 11:50:19', '2024-12-10 11:50:19'),
(824, 2, '2024-12-10', 'customer', 49, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_A  _000049(A  +  A LTD)', 'updated', '103.103.213.217', '2024-12-10 11:50:28', '2024-12-10 11:50:28'),
(825, 2, '2024-12-10', 'customer', 49, 'added Percentage Model (engagement model) customer code :', 'Admin Amit Amit added Percentage Model (engagement model) customer code : cust_A  _000049(A  +  A LTD)', 'updated', '103.103.213.217', '2024-12-10 11:54:31', '2024-12-10 11:54:31'),
(826, 2, '2024-12-10', 'client', 56, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_A  _A  _000056(A  +  A LTD)', 'created', '103.103.213.217', '2024-12-10 12:57:35', '2024-12-10 12:57:35'),
(827, 2, '2024-12-10', 'client', 57, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_A  _A  _000057(A  +  A LTD1)', 'created', '103.103.213.217', '2024-12-10 13:10:17', '2024-12-10 13:10:17'),
(828, 2, '2024-12-10', 'customer', 50, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_A L_000050(A LIMITED555)', 'created', '103.103.213.217', '2024-12-10 13:13:53', '2024-12-10 13:13:53'),
(829, 2, '2024-12-10', 'customer', 50, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_A L_000050(A LIMITED555)', 'updated', '103.103.213.217', '2024-12-10 13:13:55', '2024-12-10 13:13:55'),
(830, 2, '2024-12-10', 'customer', 50, 'edited the company information customer code :', 'Admin Amit Amit edited the company information customer code : cust_B L_000050(B LTD.)', 'updated', '103.103.213.217', '2024-12-10 13:14:27', '2024-12-10 13:14:28'),
(831, 2, '2024-12-10', 'customer', 50, 'added Percentage Model (engagement model) customer code :', 'Admin Amit Amit added Percentage Model (engagement model) customer code : cust_B L_000050(B LTD.)', 'updated', '103.103.213.217', '2024-12-10 13:15:19', '2024-12-10 13:15:19'),
(832, 2, '2024-12-10', 'client', 58, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_B L_E L_000058(E LIMITED)', 'created', '103.103.213.217', '2024-12-10 13:16:00', '2024-12-10 13:16:00'),
(833, 2, '2024-12-10', 'client', 58, 'company edited information. client code :', 'Admin Amit Amit company edited information. client code : cli_B L_E L_000058(E LIMITED)', 'updated', '103.103.213.217', '2024-12-10 13:23:40', '2024-12-10 13:23:40'),
(834, 2, '2024-12-10', 'client', 59, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_B L_F L_000059(F LIMITED)', 'created', '103.103.213.217', '2024-12-10 13:24:25', '2024-12-10 13:24:25'),
(835, 2, '2024-12-10', 'client', 59, 'company edited information. client code :', 'Admin Amit Amit company edited information. client code : cli_B L_F L_000059(F LIMITED)', 'updated', '103.103.213.217', '2024-12-10 13:24:35', '2024-12-10 13:24:35'),
(836, 2, '2024-12-11', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-12-11 05:11:24', '2024-12-11 05:11:24'),
(837, 2, '2024-12-11', 'customer', 51, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_H L_000051(H LIMITED)', 'created', '103.103.213.217', '2024-12-11 06:38:43', '2024-12-11 06:38:43'),
(838, 2, '2024-12-11', 'checklist', 14, 'created checklist GG', 'Admin Amit Amit created checklist GG ', 'created', '103.103.213.217', '2024-12-11 06:42:02', '2024-12-11 06:42:02'),
(839, 2, '2024-12-11', 'customer', 51, 'edited the company information customer code :', 'Admin Amit Amit edited the company information customer code : cust_H L_000051(H LIMITED)', 'updated', '103.103.213.217', '2024-12-11 06:42:12', '2024-12-11 06:42:12'),
(840, 2, '2024-12-11', 'customer', 51, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_H L_000051(H LIMITED)', 'updated', '103.103.213.217', '2024-12-11 07:19:46', '2024-12-11 07:19:46'),
(841, 2, '2024-12-11', 'customer', 51, 'added Percentage Model (engagement model) customer code :', 'Admin Amit Amit added Percentage Model (engagement model) customer code : cust_H L_000051(H LIMITED)', 'updated', '103.103.213.217', '2024-12-11 07:19:57', '2024-12-11 07:19:57'),
(842, 2, '2024-12-11', 'customer', 52, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_SSS_000052(SSS11)', 'created', '103.103.213.217', '2024-12-11 08:30:42', '2024-12-11 08:30:42'),
(843, 2, '2024-12-11', 'customer', 52, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_SSS_000052(SSS11)', 'updated', '103.103.213.217', '2024-12-11 08:30:56', '2024-12-11 08:30:56'),
(844, 2, '2024-12-11', 'client', 60, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_SSS_SS5_000060(SS555)', 'created', '103.103.213.217', '2024-12-11 08:32:49', '2024-12-11 08:32:49'),
(845, 2, '2024-12-11', 'client', 61, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_SSS_SS9_000061(SS99)', 'created', '103.103.213.217', '2024-12-11 08:33:27', '2024-12-11 08:33:27'),
(846, 4, '2024-12-11', '-', 0, ' Logged In', 'Processor staff staff  Logged In ', '-', NULL, '2024-12-11 08:58:55', '2024-12-11 08:58:55'),
(847, 2, '2024-12-11', 'staff', 4, 'edited staff staff staff', 'Admin Amit Amit edited staff staff staff ', 'updated', '103.103.213.217', '2024-12-11 08:59:35', '2024-12-11 08:59:35'),
(848, 4, '2024-12-11', '-', 0, ' Logged Out', 'Manager staff staff  Logged Out ', '-', NULL, '2024-12-11 08:59:41', '2024-12-11 08:59:41'),
(849, 4, '2024-12-11', '-', 0, ' Logged In', 'Manager staff staff  Logged In ', '-', NULL, '2024-12-11 08:59:51', '2024-12-11 08:59:51'),
(850, 2, '2024-12-11', 'customer', 52, 'changes the status Deactivate customer code :', 'Admin Amit Amit changes the status Deactivate customer code : cust_SSS_000052(SSS11)', 'updated', '103.103.213.217', '2024-12-11 09:03:38', '2024-12-11 09:03:38'),
(851, 2, '2024-12-11', 'customer', 52, 'changes the status Activate customer code :', 'Admin Amit Amit changes the status Activate customer code : cust_SSS_000052(SSS11)', 'updated', '103.103.213.217', '2024-12-11 09:04:02', '2024-12-11 09:04:02'),
(852, 4, '2024-12-11', '-', 0, ' Logged Out', 'Manager staff staff  Logged Out ', '-', '103.103.213.217', '2024-12-11 09:09:30', '2024-12-11 09:09:30'),
(853, 2, '2024-12-11', 'staff', 4, 'edited staff staff staff', 'Admin Amit Amit edited staff staff staff ', 'updated', '103.103.213.217', '2024-12-11 09:09:50', '2024-12-11 09:09:50'),
(854, 4, '2024-12-11', '-', 0, ' Logged In', 'Processor staff staff  Logged In ', '-', '103.103.213.217', '2024-12-11 09:10:10', '2024-12-11 09:10:10'),
(855, 2, '2024-12-11', 'staff', 21, 'created staff New Staff', 'Admin Amit Amit created staff New Staff ', 'created', '103.103.213.217', '2024-12-11 09:11:12', '2024-12-11 09:11:12'),
(856, 4, '2024-12-11', '-', 0, ' Logged Out', 'Processor staff staff  Logged Out ', '-', '103.103.213.217', '2024-12-11 09:11:21', '2024-12-11 09:11:21'),
(857, 21, '2024-12-11', '-', 0, ' Logged In', 'Processor New Staff  Logged In ', '-', '103.103.213.217', '2024-12-11 09:11:28', '2024-12-11 09:11:28'),
(858, 2, '2024-12-12', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-12-12 05:04:24', '2024-12-12 05:04:24'),
(859, 2, '2024-12-12', 'staff', 22, 'created staff DDDDD ss', 'Admin Amit Amit created staff DDDDD ss ', 'created', '103.103.213.217', '2024-12-12 05:05:08', '2024-12-12 05:05:08'),
(860, 22, '2024-12-12', '-', 0, ' Logged In', 'Manager DDDDD ss  Logged In ', '-', NULL, '2024-12-12 05:05:38', '2024-12-12 05:05:38'),
(861, 22, '2024-12-12', 'customer', 53, 'created customer profile. customer code :', 'Manager DDDDD ss created customer profile. customer code : cust_SSS_000053(SSSSSS1)', 'created', '103.103.213.217', '2024-12-12 05:43:26', '2024-12-12 05:43:26'),
(862, 22, '2024-12-12', 'customer', 53, ' edited the service details and added an additional service while editing the customer code :', 'Manager DDDDD ss  edited the service details and added an additional service while editing the customer code : cust_SSS_000053(SSSSSS1)', 'updated', '103.103.213.217', '2024-12-12 05:43:30', '2024-12-12 05:43:30'),
(863, 22, '2024-12-12', 'client', 62, 'created client profile. client code :', 'Manager DDDDD ss created client profile. client code : cli_SSS_CC_000062(CC)', 'created', '103.103.213.217', '2024-12-12 05:45:06', '2024-12-12 05:45:06'),
(864, 22, '2024-12-12', 'job', 66, 'created job code:', 'Manager DDDDD ss created job code: SSS_CC_Vat5_000059', 'created', '103.103.213.217', '2024-12-12 05:45:24', '2024-12-12 05:45:24'),
(865, 2, '2024-12-12', 'customer', 53, 'edited Percentage Model (engagement model) customer code :', 'Admin Amit Amit edited Percentage Model (engagement model) customer code : cust_SSS_000053(SSSSSS1)', 'updated', '103.103.213.217', '2024-12-12 06:05:24', '2024-12-12 06:05:24'),
(866, 2, '2024-12-13', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-12-13 09:10:03', '2024-12-13 09:10:03'),
(867, 10, '2024-12-13', '-', 0, ' Logged In', 'Manager MAN1 HHH  Logged In ', '-', NULL, '2024-12-13 09:11:09', '2024-12-13 09:11:09'),
(868, 2, '2024-12-14', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-12-14 05:17:58', '2024-12-14 05:17:58'),
(869, 10, '2024-12-14', '-', 0, ' Logged In', 'Manager MAN1 HHH  Logged In ', '-', NULL, '2024-12-14 06:51:26', '2024-12-14 06:51:26'),
(870, 10, '2024-12-14', 'customer', 54, 'created customer profile. customer code :', 'Manager MAN1 HHH created customer profile. customer code : cust_SSS_000054(SSSSSSSSS)', 'created', '103.103.213.217', '2024-12-14 07:25:58', '2024-12-14 07:25:58'),
(871, 10, '2024-12-14', 'customer', 54, ' edited the service details and added an additional service while editing the customer code :', 'Manager MAN1 HHH  edited the service details and added an additional service while editing the customer code : cust_SSS_000054(SSSSSSSSS)', 'updated', '103.103.213.217', '2024-12-14 07:26:01', '2024-12-14 07:26:01'),
(872, 2, '2024-12-16', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-12-16 05:52:28', '2024-12-16 05:52:28'),
(873, 2, '2024-12-17', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-12-17 04:59:45', '2024-12-17 04:59:45'),
(874, 11, '2024-12-17', '-', 0, ' Logged In', 'Manager sss sss  Logged In ', '-', NULL, '2024-12-17 05:22:39', '2024-12-17 05:22:39'),
(875, 11, '2024-12-17', '-', 0, ' Logged Out', 'Manager sss sss  Logged Out ', '-', '103.103.213.217', '2024-12-17 05:24:56', '2024-12-17 05:24:56'),
(876, 19, '2024-12-17', '-', 0, ' Logged In', 'Management MANAGE MENT  Logged In ', '-', '103.103.213.217', '2024-12-17 05:25:56', '2024-12-17 05:25:56'),
(877, 19, '2024-12-17', 'customer', 55, 'created customer profile. customer code :', 'Management MANAGE MENT created customer profile. customer code : cust_F L_000055(F LIMITED)', 'created', '103.103.213.217', '2024-12-17 05:27:26', '2024-12-17 05:27:26'),
(878, 19, '2024-12-17', 'customer', 55, ' edited the service details and added an additional service while editing the customer code :', 'Management MANAGE MENT  edited the service details and added an additional service while editing the customer code : cust_F L_000055(F LIMITED)', 'updated', '103.103.213.217', '2024-12-17 05:27:30', '2024-12-17 05:27:30'),
(879, 10, '2024-12-17', '-', 0, ' Logged In', 'Manager MAN1 HHH  Logged In ', '-', '103.103.213.217', '2024-12-17 05:29:19', '2024-12-17 05:29:19'),
(880, 10, '2024-12-17', 'client', 63, 'created client profile. client code :', 'Manager MAN1 HHH created client profile. client code : cli_F L_GFG_000063(GFGF)', 'created', '103.103.213.217', '2024-12-17 05:42:08', '2024-12-17 05:42:08'),
(881, 10, '2024-12-17', 'job', 67, 'created job code:', 'Manager MAN1 HHH created job code: F L_GFG_as_000060', 'created', '103.103.213.217', '2024-12-17 05:44:14', '2024-12-17 05:44:14'),
(882, 10, '2024-12-17', 'customer', 56, 'created customer profile. customer code :', 'Manager MAN1 HHH created customer profile. customer code : cust_GGG_000056(GGGGG)', 'created', '103.103.213.217', '2024-12-17 05:45:42', '2024-12-17 05:45:42'),
(883, 10, '2024-12-17', 'customer', 56, ' edited the service details and added an additional service while editing the customer code :', 'Manager MAN1 HHH  edited the service details and added an additional service while editing the customer code : cust_GGG_000056(GGGGG)', 'updated', '103.103.213.217', '2024-12-17 05:45:45', '2024-12-17 05:45:45'),
(884, 19, '2024-12-17', '-', 0, ' Logged Out', 'Management MANAGE MENT  Logged Out ', '-', '103.103.213.217', '2024-12-17 05:46:25', '2024-12-17 05:46:25'),
(885, 5, '2024-12-17', '-', 0, ' Logged In', 'Manager staff manager staff manager  Logged In ', '-', '103.103.213.217', '2024-12-17 05:46:33', '2024-12-17 05:46:33'),
(886, 5, '2024-12-17', 'client', 64, 'created client profile. client code :', 'Manager staff manager staff manager created client profile. client code : cli_GGG_HHH_000064(HHHHH)', 'created', '103.103.213.217', '2024-12-17 05:47:23', '2024-12-17 05:47:23'),
(887, 5, '2024-12-17', '-', 0, ' Logged Out', 'Manager staff manager staff manager  Logged Out ', '-', '103.103.213.217', '2024-12-17 05:55:12', '2024-12-17 05:55:12'),
(888, 6, '2024-12-17', '-', 0, ' Logged In', 'Processor Nikita  bhagat  Logged In ', '-', '103.103.213.217', '2024-12-17 05:55:56', '2024-12-17 05:55:56'),
(889, 6, '2024-12-17', 'customer', 57, 'created customer profile. customer code :', 'Processor Nikita  bhagat created customer profile. customer code : cust_JJJ_000057(JJJJJ)', 'created', '103.103.213.217', '2024-12-17 05:56:34', '2024-12-17 05:56:34'),
(890, 6, '2024-12-17', 'customer', 57, ' edited the service details and added an additional service while editing the customer code :', 'Processor Nikita  bhagat  edited the service details and added an additional service while editing the customer code : cust_JJJ_000057(JJJJJ)', 'updated', '103.103.213.217', '2024-12-17 05:56:36', '2024-12-17 05:56:36'),
(891, 10, '2024-12-17', 'client', 65, 'created client profile. client code :', 'Manager MAN1 HHH created client profile. client code : cli_JJJ_JJJ_000065(JJJ-CLIENT)', 'created', '103.103.213.217', '2024-12-17 05:57:49', '2024-12-17 05:57:49'),
(892, 2, '2024-12-17', 'job', 68, 'created job code:', 'Admin Amit Amit created job code: JJJ_JJJ_Vat5_000061', 'created', '103.103.213.217', '2024-12-17 10:49:06', '2024-12-17 10:49:06'),
(893, 2, '2024-12-17', 'job', 69, 'created job code:', 'Admin Amit Amit created job code: JJJ_JJJ_VAT1_000062', 'created', '103.103.213.217', '2024-12-17 10:49:19', '2024-12-17 10:49:19'),
(894, 2, '2024-12-17', 'job', 70, 'created job code:', 'Admin Amit Amit created job code: JJJ_JJJ_Vat5_000063', 'created', '103.103.213.217', '2024-12-17 10:49:33', '2024-12-17 10:49:33');
INSERT INTO `staff_logs` (`id`, `staff_id`, `date`, `module_name`, `module_id`, `log_message`, `log_message_all`, `permission_type`, `ip`, `created_at`, `updated_at`) VALUES
(895, 2, '2024-12-17', 'job', 67, 'edited the job information and has assigned the job to the processor, Nikita  bhagat job code:', 'Admin Amit Amit edited the job information and has assigned the job to the processor, Nikita  bhagat job code: F L_GFG_as_000060', 'updated', '103.103.213.217', '2024-12-17 10:51:38', '2024-12-17 10:51:38'),
(896, 2, '2024-12-17', 'job', 71, 'created job code:', 'Admin Amit Amit created job code: SSS_SS5_VAT2_000064', 'created', '103.103.213.217', '2024-12-17 10:52:16', '2024-12-17 10:52:16'),
(897, 2, '2024-12-17', 'job', 72, 'created job code:', 'Admin Amit Amit created job code: B L_F L_VAT3_000065', 'created', '103.103.213.217', '2024-12-17 10:52:48', '2024-12-17 10:52:48'),
(898, 10, '2024-12-17', '-', 0, ' Logged Out', 'Manager MAN1 HHH  Logged Out ', '-', '122.168.114.106', '2024-12-17 11:27:58', '2024-12-17 11:27:58'),
(899, 12, '2024-12-17', '-', 0, ' Logged In', 'Reviewer SSSSFGGG DDFSFSF  Logged In ', '-', '122.168.114.106', '2024-12-17 11:29:25', '2024-12-17 11:29:25'),
(900, 12, '2024-12-17', '-', 0, ' Logged Out', 'Reviewer SSSSFGGG DDFSFSF  Logged Out ', '-', '122.168.114.106', '2024-12-17 11:29:42', '2024-12-17 11:29:42'),
(901, 9, '2024-12-17', '-', 0, ' Logged In', 'Reviewer shk hu  Logged In ', '-', '122.168.114.106', '2024-12-17 11:30:07', '2024-12-17 11:30:07'),
(902, 9, '2024-12-17', '-', 0, ' Logged Out', 'Reviewer shk hu  Logged Out ', '-', '122.168.114.106', '2024-12-17 11:31:33', '2024-12-17 11:31:33'),
(903, 9, '2024-12-17', '-', 0, ' Logged In', 'Reviewer shk hu  Logged In ', '-', '122.168.114.106', '2024-12-17 11:31:54', '2024-12-17 11:31:54'),
(904, 2, '2024-12-17', 'job', 70, 'edited the job information and has assigned the job to the reviewer, shk hu job code:', 'Admin Amit Amit edited the job information and has assigned the job to the reviewer, shk hu job code: JJJ_JJJ_Vat5_000063', 'updated', '103.103.213.217', '2024-12-17 11:39:54', '2024-12-17 11:39:54'),
(905, 2, '2024-12-17', 'job', 67, 'edited the job information and has assigned the job to the reviewer, SSSSFGGG DDFSFSF job code:', 'Admin Amit Amit edited the job information and has assigned the job to the reviewer, SSSSFGGG DDFSFSF job code: F L_GFG_as_000060', 'updated', '103.103.213.217', '2024-12-17 11:40:25', '2024-12-17 11:40:25'),
(906, 2, '2024-12-17', 'job', 71, 'edited the job information and has assigned the job to the reviewer, SSSSFGGG DDFSFSF job code:', 'Admin Amit Amit edited the job information and has assigned the job to the reviewer, SSSSFGGG DDFSFSF job code: SSS_SS5_VAT2_000064', 'updated', '103.103.213.217', '2024-12-17 11:40:44', '2024-12-17 11:40:44'),
(907, 2, '2024-12-17', 'job', 72, 'edited the job information and has assigned the job to the reviewer, SSSSFGGG DDFSFSF job code:', 'Admin Amit Amit edited the job information and has assigned the job to the reviewer, SSSSFGGG DDFSFSF job code: B L_F L_VAT3_000065', 'updated', '103.103.213.217', '2024-12-17 11:41:08', '2024-12-17 11:41:08'),
(908, 2, '2024-12-17', 'job', 66, 'edited the job information and has assigned the job to the reviewer, SSSSFGGG DDFSFSF job code:', 'Admin Amit Amit edited the job information and has assigned the job to the reviewer, SSSSFGGG DDFSFSF job code: SSS_CC_Vat5_000059', 'updated', '103.103.213.217', '2024-12-17 11:41:44', '2024-12-17 11:41:44'),
(909, 2, '2024-12-17', 'job', 30, 'edited the job information and changed the job to the reviewer, shk hu job code:', 'Admin Amit Amit edited the job information and changed the job to the reviewer, shk hu job code: CUS_SFF_VAT2_000027', 'updated', '103.103.213.217', '2024-12-17 11:43:24', '2024-12-17 11:43:24'),
(910, 2, '2024-12-17', 'job', 4, 'edited the job information and has assigned the job to the reviewer, shk hu job code:', 'Admin Amit Amit edited the job information and has assigned the job to the reviewer, shk hu job code: CUS_ada_Vat5_00004', 'updated', '103.103.213.217', '2024-12-17 11:44:16', '2024-12-17 11:44:16'),
(911, 2, '2024-12-17', 'job', 24, 'edited the job information and has assigned the job to the reviewer, shk hu job code:', 'Admin Amit Amit edited the job information and has assigned the job to the reviewer, shk hu job code: A L_DDD_VAT1_000021', 'updated', '103.103.213.217', '2024-12-17 11:44:36', '2024-12-17 11:44:36'),
(912, 2, '2024-12-17', 'job', 28, 'edited the job information and has assigned the job to the reviewer, shk hu job code:', 'Admin Amit Amit edited the job information and has assigned the job to the reviewer, shk hu job code: grs_DDD_VAT3_000025', 'updated', '103.103.213.217', '2024-12-17 11:45:14', '2024-12-17 11:45:14'),
(913, 2, '2024-12-17', 'job', 73, 'created job code:', 'Admin Amit Amit created job code: FFF_BBB_VAT3_000066', 'created', '103.103.213.217', '2024-12-17 11:45:50', '2024-12-17 11:45:50'),
(914, 2, '2024-12-17', 'job', 27, 'edited the job information and has assigned the job to the reviewer, shk hu job code:', 'Admin Amit Amit edited the job information and has assigned the job to the reviewer, shk hu job code: QQQ_QQQ_VAT1_000024', 'updated', '103.103.213.217', '2024-12-17 11:46:34', '2024-12-17 11:46:34'),
(915, 2, '2024-12-17', 'job', 32, 'edited the job information and has assigned the job to the reviewer, shk hu job code:', 'Admin Amit Amit edited the job information and has assigned the job to the reviewer, shk hu job code: 444_SSS_as_000029', 'updated', '103.103.213.217', '2024-12-17 11:47:06', '2024-12-17 11:47:06'),
(916, 2, '2024-12-17', 'job', 34, 'edited the job information and has assigned the job to the reviewer, shk hu job code:', 'Admin Amit Amit edited the job information and has assigned the job to the reviewer, shk hu job code: EEE_ttt_as_000031', 'updated', '103.103.213.217', '2024-12-17 11:47:23', '2024-12-17 11:47:23'),
(917, 2, '2024-12-17', 'job', 35, 'edited the job information and has assigned the job to the reviewer, shk hu job code:', 'Admin Amit Amit edited the job information and has assigned the job to the reviewer, shk hu job code: HHH_GGG_VAT1_000032', 'updated', '103.103.213.217', '2024-12-17 11:47:39', '2024-12-17 11:47:39'),
(918, 2, '2024-12-17', 'job', 38, 'edited the job information and changed the job to the reviewer, shk hu job code:', 'Admin Amit Amit edited the job information and changed the job to the reviewer, shk hu job code: DHI_ABC_VAT2_000035', 'updated', '103.103.213.217', '2024-12-17 11:48:00', '2024-12-17 11:48:00'),
(919, 9, '2024-12-17', '-', 0, ' Logged Out', 'Reviewer shk hu  Logged Out ', '-', '122.168.114.106', '2024-12-17 11:54:33', '2024-12-17 11:54:33'),
(920, 19, '2024-12-17', '-', 0, ' Logged In', 'Management MANAGE MENT  Logged In ', '-', '122.168.114.106', '2024-12-17 11:54:47', '2024-12-17 11:54:47'),
(921, 2, '2024-12-18', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-12-18 05:15:54', '2024-12-18 05:15:55'),
(922, 7, '2024-12-18', '-', 0, ' Logged In', 'Manager acoount acoount  Logged In ', '-', NULL, '2024-12-18 05:18:24', '2024-12-18 05:18:24'),
(923, 7, '2024-12-18', 'customer', 58, 'created customer profile. customer code :', 'Manager acoount acoount created customer profile. customer code : cust_R1_000058(R1)', 'created', NULL, '2024-12-18 05:19:19', '2024-12-18 05:19:19'),
(924, 7, '2024-12-18', 'customer', 58, ' edited the service details and added an additional service while editing the customer code :', 'Manager acoount acoount  edited the service details and added an additional service while editing the customer code : cust_R1_000058(R1)', 'updated', NULL, '2024-12-18 05:19:21', '2024-12-18 05:19:21'),
(925, 10, '2024-12-18', '-', 0, ' Logged In', 'Manager MAN1 HHH  Logged In ', '-', '122.168.114.106', '2024-12-18 05:20:05', '2024-12-18 05:20:05'),
(926, 10, '2024-12-18', 'client', 66, 'created client profile. client code :', 'Manager MAN1 HHH created client profile. client code : cli_R1_R1-_000066(R1-CLIENT)', 'created', '122.168.114.106', '2024-12-18 05:20:49', '2024-12-18 05:20:49'),
(927, 10, '2024-12-18', 'job', 74, 'created job code:', 'Manager MAN1 HHH created job code: R1_R1-_Vat5_000067', 'created', '122.168.114.106', '2024-12-18 05:21:45', '2024-12-18 05:21:45'),
(928, 7, '2024-12-18', 'job', 75, 'created job code:', 'Manager acoount acoount created job code: R1_R1-_VAT1_000068', 'created', NULL, '2024-12-18 05:22:46', '2024-12-18 05:22:46'),
(929, 2, '2024-12-18', 'permission', 4, ' updated the access for MANAGER. Access Changes Add Permission (client-update) ', 'Admin Amit Amit  updated the access for MANAGER. Access Changes Add Permission (client-update)  ', 'updated', '122.168.114.106', '2024-12-18 05:23:30', '2024-12-18 05:23:30'),
(930, 10, '2024-12-18', 'client', 66, 'edited sole trader Officer information. client code :', 'Manager MAN1 HHH edited sole trader Officer information. client code : cli_R1_R1-_000066(R1-CLIENT)', 'updated', '122.168.114.106', '2024-12-18 05:23:52', '2024-12-18 05:23:52'),
(931, 7, '2024-12-18', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2024-12-16, Hours : 01:00 ,Job code:abc, Task name:b', 'Manager acoount acoount created a timesheet entry. Task type:Internal,  Date: 2024-12-16, Hours : 01:00 ,Job code:abc, Task name:b ', 'updated', '0.0.0.0', '2024-12-18 08:22:17', '2024-12-18 08:22:17'),
(932, 2, '2024-12-18', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2024-12-09, Hours : 01:00 ,Job code:abc, Task name:c', 'Admin Amit Amit submitted a timesheet entry. Task type:Internal,  Date: 2024-12-09, Hours : 01:00 ,Job code:abc, Task name:c ', 'updated', '0.0.0.0', '2024-12-18 09:34:24', '2024-12-18 09:34:24'),
(933, 2, '2024-12-18', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2024-12-18, Hours : 01:00 ,Job code:abc, Task name:c', 'Admin Amit Amit created a timesheet entry. Task type:Internal,  Date: 2024-12-18, Hours : 01:00 ,Job code:abc, Task name:c ', 'updated', '0.0.0.0', '2024-12-18 10:22:38', '2024-12-18 10:22:39'),
(934, 2, '2024-12-18', 'timesheet', 0, 'edited a timesheet entry. Task type:Internal,  Date: 2024-12-16, Updated hours : 05:00 ,Job code:abc, Task name:c', 'Admin Amit Amit edited a timesheet entry. Task type:Internal,  Date: 2024-12-16, Updated hours : 05:00 ,Job code:abc, Task name:c ', 'updated', '0.0.0.0', '2024-12-18 10:31:45', '2024-12-18 10:31:45'),
(935, 2, '2024-12-18', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2024-12-03, Hours : 02:00 ,Job code:abc, Task name:c', 'Admin Amit Amit created a timesheet entry. Task type:Internal,  Date: 2024-12-03, Hours : 02:00 ,Job code:abc, Task name:c ', 'updated', '0.0.0.0', '2024-12-18 10:34:11', '2024-12-18 10:34:11'),
(936, 2, '2024-12-19', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-12-19 04:48:22', '2024-12-19 04:48:22'),
(937, 7, '2024-12-19', '-', 0, ' Logged In', 'Manager acoount acoount  Logged In ', '-', NULL, '2024-12-19 07:18:26', '2024-12-19 07:18:26'),
(938, 7, '2024-12-19', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2024-12-03, Hours : 02:00 ,Job code:abc, Task name:c', 'Manager acoount acoount created a timesheet entry. Task type:Internal,  Date: 2024-12-03, Hours : 02:00 ,Job code:abc, Task name:c ', 'updated', '0.0.0.0', '2024-12-19 07:19:12', '2024-12-19 07:19:12'),
(939, 2, '2024-12-20', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-12-20 06:10:59', '2024-12-20 06:10:59'),
(940, 2, '2024-12-20', 'customer', 58, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_R1_000058(R1)', 'updated', '122.168.114.106', '2024-12-20 06:50:46', '2024-12-20 06:50:46'),
(941, 2, '2024-12-20', 'customer', 59, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_KIL_000059(KILLLL)', 'created', '122.168.114.106', '2024-12-20 06:51:39', '2024-12-20 06:51:39'),
(942, 2, '2024-12-20', 'customer', 59, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_KIL_000059(KILLLL)', 'updated', '122.168.114.106', '2024-12-20 06:51:47', '2024-12-20 06:51:47'),
(943, 2, '2024-12-23', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2024-12-23 05:01:23', '2024-12-23 05:01:23'),
(944, 2, '2024-12-23', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2024-12-23, Hours : 00:00 ,Job code:abc, Task name:c', 'Admin Amit Amit created a timesheet entry. Task type:Internal,  Date: 2024-12-23, Hours : 00:00 ,Job code:abc, Task name:c ', 'updated', '0.0.0.0', '2024-12-23 05:34:26', '2024-12-23 05:34:26'),
(945, 2, '2024-12-23', 'timesheet', 0, 'edited a timesheet entry. Task type:Internal,  Date: 2024-12-25, Updated hours : 04:00 ,Job code:abc, Task name:c', 'Admin Amit Amit edited a timesheet entry. Task type:Internal,  Date: 2024-12-25, Updated hours : 04:00 ,Job code:abc, Task name:c ', 'updated', '0.0.0.0', '2024-12-23 05:35:07', '2024-12-23 05:35:07'),
(946, 2, '2024-12-23', 'timesheet', 0, 'deleted a timesheet entry. Task type:Internal ,Job code:abc, Task name:c', 'Admin Amit Amit deleted a timesheet entry. Task type:Internal ,Job code:abc, Task name:c ', 'updated', '0.0.0.0', '2024-12-23 06:18:57', '2024-12-23 06:18:57'),
(947, 2, '2024-12-23', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2024-12-24, Hours : 02:00 ,Job code:CUS_SFF_Vat5_000026, Task name:ss', 'Admin Amit Amit created a timesheet entry. Task type:External,  Date: 2024-12-24, Hours : 02:00 ,Job code:CUS_SFF_Vat5_000026, Task name:ss ', 'updated', '0.0.0.0', '2024-12-23 06:53:01', '2024-12-23 06:53:01'),
(948, 2, '2024-12-23', 'timesheet', 0, 'deleted a timesheet entry. Task type:External ,Job code:CUS_SFF_Vat5_000026, Task name:ss', 'Admin Amit Amit deleted a timesheet entry. Task type:External ,Job code:CUS_SFF_Vat5_000026, Task name:ss ', 'updated', '0.0.0.0', '2024-12-23 06:53:16', '2024-12-23 06:53:16'),
(949, 22, '2024-12-23', '-', 0, ' Logged In', 'Manager DDDDD ss  Logged In ', '-', NULL, '2024-12-23 07:09:58', '2024-12-23 07:09:58'),
(950, 22, '2024-12-23', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2024-10-28, Hours : 01:00 ,Job code:abc, Task name:c', 'Manager DDDDD ss created a timesheet entry. Task type:Internal,  Date: 2024-10-28, Hours : 01:00 ,Job code:abc, Task name:c ', 'updated', '0.0.0.0', '2024-12-23 07:10:25', '2024-12-23 07:10:25'),
(951, 22, '2024-12-23', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2024-12-25, Hours : 05:00 ,Job code:abc, Task name:c', 'Manager DDDDD ss created a timesheet entry. Task type:Internal,  Date: 2024-12-25, Hours : 05:00 ,Job code:abc, Task name:c ', 'updated', '0.0.0.0', '2024-12-23 07:10:50', '2024-12-23 07:10:50'),
(952, 2, '2024-12-23', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2024-12-23, Hours : 01:00 ,Job code:abc, Task name:c', 'Admin Amit Amit created a timesheet entry. Task type:Internal,  Date: 2024-12-23, Hours : 01:00 ,Job code:abc, Task name:c ', 'updated', '0.0.0.0', '2024-12-23 07:17:52', '2024-12-23 07:17:52'),
(953, 2, '2024-12-23', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2024-12-23, Hours : 02:00 ,Job code:CUS_SFF_VAT1_00006, Task name:A', 'Admin Amit Amit created a timesheet entry. Task type:External,  Date: 2024-12-23, Hours : 02:00 ,Job code:CUS_SFF_VAT1_00006, Task name:A ', 'updated', '0.0.0.0', '2024-12-23 07:21:38', '2024-12-23 07:21:38'),
(954, 22, '2024-12-23', '-', 0, ' Logged In', 'Manager DDDDD ss  Logged In ', '-', NULL, '2024-12-23 12:24:36', '2024-12-23 12:24:36'),
(955, 2, '2024-12-24', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-12-24 05:07:41', '2024-12-24 05:07:41'),
(956, 2, '2024-12-24', 'client', 67, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_H L_H-L_000067(H-LIMMMMMM)', 'created', '103.103.213.217', '2024-12-24 10:42:29', '2024-12-24 10:42:29'),
(957, 22, '2024-12-24', '-', 0, ' Logged In', 'Manager DDDDD ss  Logged In ', '-', NULL, '2024-12-24 10:44:24', '2024-12-24 10:44:24'),
(958, 22, '2024-12-24', '-', 0, ' Logged Out', 'Manager DDDDD ss  Logged Out ', '-', '103.103.213.217', '2024-12-24 10:52:14', '2024-12-24 10:52:14'),
(959, 5, '2024-12-24', '-', 0, ' Logged In', 'Manager staff manager staff manager  Logged In ', '-', '103.103.213.217', '2024-12-24 10:52:19', '2024-12-24 10:52:19'),
(960, 5, '2024-12-24', '-', 0, ' Logged Out', 'Manager staff manager staff manager  Logged Out ', '-', '103.103.213.217', '2024-12-24 10:52:52', '2024-12-24 10:52:52'),
(961, 6, '2024-12-24', '-', 0, ' Logged In', 'Processor Nikita  bhagat  Logged In ', '-', '103.103.213.217', '2024-12-24 10:52:57', '2024-12-24 10:52:57'),
(962, 6, '2024-12-24', '-', 0, ' Logged Out', 'Processor Nikita  bhagat  Logged Out ', '-', '103.103.213.217', '2024-12-24 10:53:35', '2024-12-24 10:53:35'),
(963, 9, '2024-12-24', '-', 0, ' Logged In', 'Reviewer shk hu  Logged In ', '-', '103.103.213.217', '2024-12-24 10:53:48', '2024-12-24 10:53:48'),
(964, 9, '2024-12-24', 'client', 68, 'created client profile. client code :', 'Reviewer shk hu created client profile. client code : cli_JJJ_JJJ_000068(JJJ-CLIENTS)', 'created', '103.103.213.217', '2024-12-24 11:19:42', '2024-12-24 11:19:42'),
(965, 2, '2024-12-25', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-12-25 04:51:34', '2024-12-25 04:51:34'),
(966, 9, '2024-12-25', '-', 0, ' Logged In', 'Reviewer shk hu  Logged In ', '-', NULL, '2024-12-25 05:13:11', '2024-12-25 05:13:11'),
(967, 2, '2024-12-25', 'permission', 6, ' updated the access for REVIEWER. Access Changes  Remove Permission (client-insert)', 'Admin Amit Amit  updated the access for REVIEWER. Access Changes  Remove Permission (client-insert) ', 'updated', '103.103.213.217', '2024-12-25 05:37:42', '2024-12-25 05:37:42'),
(968, 2, '2024-12-25', 'permission', 6, ' updated the access for REVIEWER. Access Changes Add Permission (client-insert) ', 'Admin Amit Amit  updated the access for REVIEWER. Access Changes Add Permission (client-insert)  ', 'updated', '103.103.213.217', '2024-12-25 05:38:01', '2024-12-25 05:38:01'),
(969, 2, '2024-12-25', 'job', 76, 'created job code:', 'Admin Amit Amit created job code: GGG_HHH_as_000069', 'created', '103.103.213.217', '2024-12-25 06:26:58', '2024-12-25 06:26:58'),
(970, 2, '2024-12-25', 'job', 77, 'created job code:', 'Admin Amit Amit created job code: JJJ_JJJ_Vat5_000070', 'created', '103.103.213.217', '2024-12-25 06:28:12', '2024-12-25 06:28:12'),
(971, 2, '2024-12-25', 'job', 78, 'created job code:', 'Admin Amit Amit created job code: JJJ_JJJ_Vat5_000071', 'created', '103.103.213.217', '2024-12-25 07:24:39', '2024-12-25 07:24:39'),
(972, 2, '2024-12-25', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  ,Job code:abc, Task name:c and Task type:External,  ,Job code:CUS_SFF_VAT1_00006, Task name:A', 'Admin Amit Amit submitted a timesheet entry. Task type:Internal,  ,Job code:abc, Task name:c and Task type:External,  ,Job code:CUS_SFF_VAT1_00006, Task name:A ', 'updated', '0.0.0.0', '2024-12-25 08:25:26', '2024-12-25 08:25:26'),
(973, 2, '2024-12-25', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2024-12-16, Hours : 01:00 ,Job code:JJJ_JJJ_Vat5_000071, Task name:DD', 'Admin Amit Amit created a timesheet entry. Task type:External,  Date: 2024-12-16, Hours : 01:00 ,Job code:JJJ_JJJ_Vat5_000071, Task name:DD ', 'updated', '0.0.0.0', '2024-12-25 08:34:45', '2024-12-25 08:34:45'),
(974, 9, '2024-12-25', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2024-12-23, Hours : 01:00 ,Job code:JJJ_JJJ_VAT1_000062, Task name:A', 'Reviewer shk hu created a timesheet entry. Task type:External,  Date: 2024-12-23, Hours : 01:00 ,Job code:JJJ_JJJ_VAT1_000062, Task name:A ', 'updated', '0.0.0.0', '2024-12-25 08:36:09', '2024-12-25 08:36:09'),
(975, 9, '2024-12-25', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2024-12-23, Hours : 02:00 ,Job code:JJJ_JJJ_VAT1_000062, Task name:A', 'Reviewer shk hu created a timesheet entry. Task type:External,  Date: 2024-12-23, Hours : 02:00 ,Job code:JJJ_JJJ_VAT1_000062, Task name:A ', 'updated', '0.0.0.0', '2024-12-25 08:44:03', '2024-12-25 08:44:03'),
(976, 9, '2024-12-25', '-', 0, ' Logged Out', 'Reviewer shk hu  Logged Out ', '-', '103.103.213.217', '2024-12-25 08:45:32', '2024-12-25 08:45:32'),
(977, 22, '2024-12-25', '-', 0, ' Logged In', 'Manager DDDDD ss  Logged In ', '-', '103.103.213.217', '2024-12-25 08:45:44', '2024-12-25 08:45:44'),
(978, 22, '2024-12-25', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2024-12-23, Hours : 01:00 ,Job code:SSS_CC_Vat5_000059, Task name:DD', 'Manager DDDDD ss created a timesheet entry. Task type:External,  Date: 2024-12-23, Hours : 01:00 ,Job code:SSS_CC_Vat5_000059, Task name:DD ', 'updated', '0.0.0.0', '2024-12-25 08:46:09', '2024-12-25 08:46:09'),
(979, 22, '2024-12-25', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2024-12-24, Hours : 2:00 ,Job code:SSS_CC_Vat5_000059, Task name:DD', 'Manager DDDDD ss created a timesheet entry. Task type:External,  Date: 2024-12-24, Hours : 2:00 ,Job code:SSS_CC_Vat5_000059, Task name:DD ', 'updated', '0.0.0.0', '2024-12-25 08:46:28', '2024-12-25 08:46:28'),
(980, 22, '2024-12-25', 'job', 66, 'edited the job information and changed the job to the reviewer, shk hu job code:', 'Manager DDDDD ss edited the job information and changed the job to the reviewer, shk hu job code: SSS_CC_Vat5_000059', 'updated', '103.103.213.217', '2024-12-25 08:46:54', '2024-12-25 08:46:54'),
(981, 9, '2024-12-25', '-', 0, ' Logged In', 'Reviewer shk hu  Logged In ', '-', '122.168.114.106', '2024-12-25 08:47:27', '2024-12-25 08:47:27'),
(982, 2, '2024-12-26', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-12-26 06:16:32', '2024-12-26 06:16:32'),
(983, 2, '2024-12-26', 'customer', 60, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_abc_000060(abcc)', 'created', '103.103.213.217', '2024-12-26 06:32:26', '2024-12-26 06:32:26'),
(984, 2, '2024-12-26', 'customer', 60, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_abc_000060(abcc)', 'updated', '103.103.213.217', '2024-12-26 06:32:28', '2024-12-26 06:32:28'),
(985, 2, '2024-12-26', 'customer', 61, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_H L_000061(H LIMITED_000061)', 'created', '103.103.213.217', '2024-12-26 06:33:13', '2024-12-26 06:33:13'),
(986, 2, '2024-12-26', 'customer', 61, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_H L_000061(H LIMITED_000061)', 'updated', '103.103.213.217', '2024-12-26 06:33:16', '2024-12-26 06:33:16'),
(987, 2, '2024-12-26', 'customer', 62, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_H L_000062(H LIMITED_000062)', 'created', '103.103.213.217', '2024-12-26 06:34:06', '2024-12-26 06:34:06'),
(988, 2, '2024-12-26', 'customer', 62, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_H L_000062(H LIMITED_000062)', 'updated', '103.103.213.217', '2024-12-26 06:34:09', '2024-12-26 06:34:09'),
(989, 2, '2024-12-26', 'client', 69, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_H L_H L_000069(H LIMITED)', 'created', '103.103.213.217', '2024-12-26 06:35:11', '2024-12-26 06:35:11'),
(990, 2, '2024-12-26', 'client', 70, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_H L_H L_000070(H LIMITED_000070)', 'created', '103.103.213.217', '2024-12-26 06:41:21', '2024-12-26 06:41:21'),
(991, 2, '2024-12-26', 'client', 71, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_H L_H L_000071(H LIMITED_000071)', 'created', '103.103.213.217', '2024-12-26 06:41:50', '2024-12-26 06:41:50'),
(992, 2, '2024-12-26', 'client', 72, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_H L_hh_000072(hh)', 'created', '103.103.213.217', '2024-12-26 06:42:01', '2024-12-26 06:42:01'),
(993, 2, '2024-12-26', 'job', 79, 'created job code:', 'Admin Amit Amit created job code: H L_hh_VAT3_000072', 'created', '103.103.213.217', '2024-12-26 06:47:39', '2024-12-26 06:47:39'),
(994, 2, '2024-12-26', 'job', 79, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: H L_hh_VAT3_000072', 'created', '103.103.213.217', '2024-12-26 06:55:05', '2024-12-26 06:55:05'),
(995, 2, '2024-12-26', 'job', 79, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: H L_hh_VAT3_000072', 'created', '103.103.213.217', '2024-12-26 07:06:12', '2024-12-26 07:06:12'),
(996, 2, '2024-12-26', 'job', 79, 'edited the missing logs job code:', 'Admin Amit Amit edited the missing logs job code: H L_hh_VAT3_000072', 'updated', '103.103.213.217', '2024-12-26 07:17:44', '2024-12-26 07:17:44'),
(997, 2, '2024-12-26', 'customer', 62, 'edited the company information customer code :', 'Admin Amit Amit edited the company information customer code : cust_H L_000062(H LIMITED_000062)', 'updated', '103.103.213.217', '2024-12-26 08:48:11', '2024-12-26 08:48:11'),
(998, 2, '2024-12-26', 'customer', 63, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_ggg_000063(ggg)', 'created', '103.103.213.217', '2024-12-26 09:24:18', '2024-12-26 09:24:18'),
(999, 2, '2024-12-26', 'customer', 64, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_ddd_000064(ddddd)', 'created', '103.103.213.217', '2024-12-26 09:28:59', '2024-12-26 09:28:59'),
(1000, 2, '2024-12-26', 'customer', 64, 'edited sole trader information. customer code :', 'Admin Amit Amit edited sole trader information. customer code : cust_ddd_000064(ddddd)', 'updated', '103.103.213.217', '2024-12-26 09:53:36', '2024-12-26 09:53:36'),
(1001, 2, '2024-12-26', 'customer', 64, 'edited sole trader information. customer code :', 'Admin Amit Amit edited sole trader information. customer code : cust_ddd_000064(ddddd)', 'updated', '103.103.213.217', '2024-12-26 09:54:02', '2024-12-26 09:54:02'),
(1002, 2, '2024-12-26', 'customer', 65, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_H E_000065(H E CORNISH (INVESTMENTS C I) LIMITED_000065)', 'created', '103.103.213.217', '2024-12-26 09:56:24', '2024-12-26 09:56:24'),
(1003, 2, '2024-12-26', 'customer', 66, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_rrr_000066(rrrrrrr)', 'created', '103.103.213.217', '2024-12-26 09:58:44', '2024-12-26 09:58:44'),
(1004, 2, '2024-12-26', 'customer', 66, 'edited the partnership information customer code :', 'Admin Amit Amit edited the partnership information customer code : cust_rrr_000066(rrrrrrr)', 'updated', '103.103.213.217', '2024-12-26 10:00:50', '2024-12-26 10:00:50'),
(1005, 2, '2024-12-26', 'customer', 67, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_F L_000067(F LIMITED_000067)', 'created', '103.103.213.217', '2024-12-26 10:01:44', '2024-12-26 10:01:44'),
(1006, 2, '2024-12-26', 'customer', 67, 'edited the company information customer code :', 'Admin Amit Amit edited the company information customer code : cust_F L_000067(F LIMITED_000067)', 'updated', '103.103.213.217', '2024-12-26 10:08:50', '2024-12-26 10:08:50'),
(1007, 2, '2024-12-26', 'customer', 67, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_F L_000067(F LIMITED_000067)', 'updated', '103.103.213.217', '2024-12-26 10:08:53', '2024-12-26 10:08:53'),
(1008, 2, '2024-12-26', 'customer', 67, 'added Percentage Model (engagement model) customer code :', 'Admin Amit Amit added Percentage Model (engagement model) customer code : cust_F L_000067(F LIMITED_000067)', 'updated', '103.103.213.217', '2024-12-26 10:09:04', '2024-12-26 10:09:04'),
(1009, 2, '2024-12-26', 'client', 73, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_F L_D L_000073(D LIMITED_000073)', 'created', '103.103.213.217', '2024-12-26 10:36:24', '2024-12-26 10:36:24'),
(1010, 2, '2024-12-26', 'client', 74, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_F L_dgd_000074(dgdgdffgb)', 'created', '103.103.213.217', '2024-12-26 11:08:13', '2024-12-26 11:08:13'),
(1011, 2, '2024-12-26', 'client', 74, 'edited partnership information. client code :', 'Admin Amit Amit edited partnership information. client code : cli_F L_dgd_000074(dgdgdffgb)', 'updated', '103.103.213.217', '2024-12-26 11:10:37', '2024-12-26 11:10:37'),
(1012, 2, '2024-12-26', 'client', 74, 'edited partnership information. client code :', 'Admin Amit Amit edited partnership information. client code : cli_F L_dgd_000074(dgdgdffgb)', 'updated', '103.103.213.217', '2024-12-26 11:10:44', '2024-12-26 11:10:44'),
(1013, 2, '2024-12-26', 'client', 75, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_F L_fff_000075(fffffff)', 'created', '103.103.213.217', '2024-12-26 11:15:27', '2024-12-26 11:15:27'),
(1014, 2, '2024-12-26', 'job', 80, 'created job code:', 'Admin Amit Amit created job code: F L_fff_VAT3_000073', 'created', '103.103.213.217', '2024-12-26 11:22:48', '2024-12-26 11:22:48'),
(1015, 2, '2024-12-26', 'job', 81, 'created job code:', 'Admin Amit Amit created job code: F L_fff_VAT3_000074', 'created', '103.103.213.217', '2024-12-26 11:23:17', '2024-12-26 11:23:17'),
(1016, 2, '2024-12-26', 'job', 82, 'created job code:', 'Admin Amit Amit created job code: F L_fff_VAT3_000075', 'created', '103.103.213.217', '2024-12-26 11:23:30', '2024-12-26 11:23:30'),
(1017, 2, '2024-12-26', 'staff', 23, 'created staff SMN sss', 'Admin Amit Amit created staff SMN sss ', 'created', '103.103.213.217', '2024-12-26 12:08:29', '2024-12-26 12:08:29'),
(1018, 23, '2024-12-26', '-', 0, ' Logged In', 'Management SMN sss  Logged In ', '-', NULL, '2024-12-26 12:09:08', '2024-12-26 12:09:08'),
(1019, 23, '2024-12-26', 'customer', 68, 'created customer profile. customer code :', 'Management SMN sss created customer profile. customer code : cust_DEE_000068(DEEEE)', 'created', NULL, '2024-12-26 12:10:00', '2024-12-26 12:10:00'),
(1020, 23, '2024-12-26', 'customer', 68, ' edited the service details and added an additional service while editing the customer code :', 'Management SMN sss  edited the service details and added an additional service while editing the customer code : cust_DEE_000068(DEEEE)', 'updated', NULL, '2024-12-26 12:10:03', '2024-12-26 12:10:03'),
(1021, 23, '2024-12-26', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2024-12-16, Hours : 01:00 ,Job code:abc, Task name:c', 'Management SMN sss submitted a timesheet entry. Task type:Internal,  Date: 2024-12-16, Hours : 01:00 ,Job code:abc, Task name:c ', 'updated', '0.0.0.0', '2024-12-26 12:23:04', '2024-12-26 12:23:04'),
(1022, 23, '2024-12-26', 'client', 76, 'created client profile. client code :', 'Management SMN sss created client profile. client code : cli_DEE_GGG_000076(GGG)', 'created', NULL, '2024-12-26 12:28:56', '2024-12-26 12:28:56'),
(1023, 23, '2024-12-26', 'job', 83, 'created job code:', 'Management SMN sss created job code: DEE_GGG_VAT2_000076', 'created', NULL, '2024-12-26 12:29:11', '2024-12-26 12:29:11'),
(1024, 23, '2024-12-26', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2024-12-09, Hours : 01:00 Date: 2024-12-10, Hours : 02:00 ,Job code:DEE_GGG_VAT2_000076, Task name:TSK1 and Task type:External,  Date: 2024-12-09, Hours : 03:00 ,Job code:DEE_GGG_VAT2_000076, Task name:TSK3', 'Management SMN sss created a timesheet entry. Task type:External,  Date: 2024-12-09, Hours : 01:00 Date: 2024-12-10, Hours : 02:00 ,Job code:DEE_GGG_VAT2_000076, Task name:TSK1 and Task type:External,  Date: 2024-12-09, Hours : 03:00 ,Job code:DEE_GGG_VAT2_000076, Task name:TSK3 ', 'updated', '0.0.0.0', '2024-12-26 12:29:41', '2024-12-26 12:29:41'),
(1025, 23, '2024-12-26', 'timesheet', 0, 'submitted a timesheet entry. Task type:External,  ,Job code:DEE_GGG_VAT2_000076, Task name:TSK1 and Task type:External,  ,Job code:DEE_GGG_VAT2_000076, Task name:TSK3', 'Management SMN sss submitted a timesheet entry. Task type:External,  ,Job code:DEE_GGG_VAT2_000076, Task name:TSK1 and Task type:External,  ,Job code:DEE_GGG_VAT2_000076, Task name:TSK3 ', 'updated', '0.0.0.0', '2024-12-26 12:29:48', '2024-12-26 12:29:48'),
(1026, 23, '2024-12-26', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  ,Job code:abc, Task name:c', 'Management SMN sss submitted a timesheet entry. Task type:Internal,  ,Job code:abc, Task name:c ', 'updated', '0.0.0.0', '2024-12-26 12:33:34', '2024-12-26 12:33:34'),
(1027, 23, '2024-12-26', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2024-12-09, Hours : 01:00 ,Job code:abc, Task name:c and Task type:External,  Date: 2024-12-09, Hours : 02:00 ,Job code:DEE_GGG_VAT2_000076, Task name:TSK3', 'Management SMN sss submitted a timesheet entry. Task type:Internal,  Date: 2024-12-09, Hours : 01:00 ,Job code:abc, Task name:c and Task type:External,  Date: 2024-12-09, Hours : 02:00 ,Job code:DEE_GGG_VAT2_000076, Task name:TSK3 ', 'updated', '0.0.0.0', '2024-12-26 12:38:01', '2024-12-26 12:38:01'),
(1028, 23, '2024-12-26', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  ,Job code:abc, Task name:c and Task type:External,  ,Job code:DEE_GGG_VAT2_000076, Task name:TSK3', 'Management SMN sss submitted a timesheet entry. Task type:Internal,  ,Job code:abc, Task name:c and Task type:External,  ,Job code:DEE_GGG_VAT2_000076, Task name:TSK3 ', 'updated', '0.0.0.0', '2024-12-26 12:38:06', '2024-12-26 12:38:06'),
(1029, 2, '2024-12-27', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-12-27 09:15:49', '2024-12-27 09:15:49'),
(1030, 2, '2024-12-27', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-12-27 09:24:12', '2024-12-27 09:24:12'),
(1031, 2, '2024-12-27', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', NULL, '2024-12-27 09:24:31', '2024-12-27 09:24:31'),
(1032, 22, '2024-12-27', '-', 0, ' Logged In', 'Manager DDDDD ss  Logged In ', '-', NULL, '2024-12-27 09:24:38', '2024-12-27 09:24:38'),
(1033, 2, '2024-12-27', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-12-27 09:27:44', '2024-12-27 09:27:44'),
(1034, 22, '2024-12-27', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2024-12-16, Hours : 01:00 ,Job code:abc, Task name:c', 'Manager DDDDD ss created a timesheet entry. Task type:Internal,  Date: 2024-12-16, Hours : 01:00 ,Job code:abc, Task name:c ', 'updated', '0.0.0.0', '2024-12-27 09:29:02', '2024-12-27 09:29:02'),
(1035, 22, '2024-12-27', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  ,Job code:abc, Task name:c', 'Manager DDDDD ss submitted a timesheet entry. Task type:Internal,  ,Job code:abc, Task name:c ', 'updated', '0.0.0.0', '2024-12-27 09:29:17', '2024-12-27 09:29:17'),
(1036, 2, '2024-12-27', 'job', 83, 'sent the queries for job code:', 'Admin Amit Amit sent the queries for job code: DEE_GGG_VAT2_000076', 'created', '103.103.213.217', '2024-12-27 12:05:17', '2024-12-27 12:05:17'),
(1037, 2, '2024-12-27', 'job', 83, 'edited the queries job code:', 'Admin Amit Amit edited the queries job code: DEE_GGG_VAT2_000076', 'updated', '103.103.213.217', '2024-12-27 12:06:43', '2024-12-27 12:06:43'),
(1038, 2, '2024-12-28', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-12-28 06:31:28', '2024-12-28 06:31:28'),
(1039, 2, '2024-12-30', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-12-30 12:38:13', '2024-12-30 12:38:13'),
(1040, 2, '2024-12-30', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2024-12-30 12:44:23', '2024-12-30 12:44:23'),
(1041, 2, '2024-12-30', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2024-12-30 12:48:09', '2024-12-30 12:48:09'),
(1042, 2, '2024-12-31', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2024-12-31 05:48:09', '2024-12-31 05:48:09'),
(1043, 2, '2024-12-31', 'customer', 65, 'edited the company information customer code :', 'Admin Amit Amit edited the company information customer code : cust_H E_000065(H E CORNISH (INVESTMENTS C I) LIMITED_000065)', 'updated', '103.103.213.217', '2024-12-31 09:33:41', '2024-12-31 09:33:41'),
(1044, 2, '2024-12-31', 'customer', 65, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_H E_000065(H E CORNISH (INVESTMENTS C I) LIMITED_000065)', 'updated', '103.103.213.217', '2024-12-31 09:33:45', '2024-12-31 09:33:45'),
(1045, 2, '2024-12-31', 'customer', 65, 'added Percentage Model (engagement model) customer code :', 'Admin Amit Amit added Percentage Model (engagement model) customer code : cust_H E_000065(H E CORNISH (INVESTMENTS C I) LIMITED_000065)', 'updated', '103.103.213.217', '2024-12-31 09:33:54', '2024-12-31 09:33:54'),
(1046, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 05:57:29', '2025-01-01 05:57:29'),
(1047, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2025-01-01 06:05:08', '2025-01-01 06:05:08'),
(1048, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 06:25:04', '2025-01-01 06:25:04'),
(1049, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 06:25:12', '2025-01-01 06:25:12'),
(1050, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 06:34:36', '2025-01-01 06:34:36'),
(1051, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 06:34:37', '2025-01-01 06:34:37'),
(1052, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 06:34:56', '2025-01-01 06:34:56'),
(1053, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 06:34:57', '2025-01-01 06:34:57'),
(1054, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 06:36:57', '2025-01-01 06:36:57'),
(1055, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 06:36:58', '2025-01-01 06:36:58'),
(1056, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 06:38:46', '2025-01-01 06:38:46'),
(1057, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 06:39:05', '2025-01-01 06:39:05'),
(1058, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 06:39:06', '2025-01-01 06:39:06'),
(1059, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 06:39:25', '2025-01-01 06:39:25'),
(1060, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 06:39:26', '2025-01-01 06:39:26'),
(1061, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 06:39:44', '2025-01-01 06:39:44'),
(1062, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 06:39:45', '2025-01-01 06:39:45'),
(1063, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 06:41:32', '2025-01-01 06:41:32'),
(1064, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 06:41:33', '2025-01-01 06:41:33'),
(1065, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 06:42:23', '2025-01-01 06:42:23'),
(1066, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 06:42:24', '2025-01-01 06:42:24'),
(1067, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 06:43:11', '2025-01-01 06:43:11'),
(1068, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 06:43:13', '2025-01-01 06:43:13'),
(1069, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 06:43:26', '2025-01-01 06:43:26'),
(1070, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 06:43:28', '2025-01-01 06:43:28'),
(1071, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 06:53:16', '2025-01-01 06:53:16'),
(1072, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 06:53:18', '2025-01-01 06:53:18'),
(1073, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 06:53:56', '2025-01-01 06:53:56'),
(1074, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 06:53:57', '2025-01-01 06:53:57'),
(1075, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 06:57:10', '2025-01-01 06:57:10'),
(1076, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:00:42', '2025-01-01 07:00:42'),
(1077, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 07:00:57', '2025-01-01 07:00:57'),
(1078, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:00:58', '2025-01-01 07:00:58'),
(1079, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 07:01:45', '2025-01-01 07:01:45'),
(1080, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:01:46', '2025-01-01 07:01:46'),
(1081, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 07:02:07', '2025-01-01 07:02:07'),
(1082, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:02:08', '2025-01-01 07:02:08'),
(1083, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 07:02:44', '2025-01-01 07:02:44'),
(1084, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:02:45', '2025-01-01 07:02:45'),
(1085, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 07:04:15', '2025-01-01 07:04:15'),
(1086, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:04:16', '2025-01-01 07:04:16'),
(1087, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 07:04:56', '2025-01-01 07:04:56'),
(1088, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:04:57', '2025-01-01 07:04:57'),
(1089, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 07:05:29', '2025-01-01 07:05:29'),
(1090, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:05:30', '2025-01-01 07:05:30'),
(1091, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 07:05:50', '2025-01-01 07:05:50'),
(1092, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:05:51', '2025-01-01 07:05:51'),
(1093, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 07:07:31', '2025-01-01 07:07:31'),
(1094, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:07:33', '2025-01-01 07:07:33'),
(1095, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 07:10:58', '2025-01-01 07:10:58'),
(1096, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:11:00', '2025-01-01 07:11:00'),
(1097, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 07:21:32', '2025-01-01 07:21:32'),
(1098, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:21:35', '2025-01-01 07:21:35'),
(1099, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 07:22:48', '2025-01-01 07:22:48'),
(1100, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:22:50', '2025-01-01 07:22:50'),
(1101, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 07:24:12', '2025-01-01 07:24:12'),
(1102, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:24:14', '2025-01-01 07:24:14'),
(1103, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 07:24:44', '2025-01-01 07:24:44'),
(1104, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:24:46', '2025-01-01 07:24:46'),
(1105, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 07:26:58', '2025-01-01 07:26:58'),
(1106, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:27:00', '2025-01-01 07:27:00'),
(1107, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 07:27:40', '2025-01-01 07:27:40'),
(1108, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:27:42', '2025-01-01 07:27:42'),
(1109, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 07:30:28', '2025-01-01 07:30:28'),
(1110, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:30:31', '2025-01-01 07:30:31'),
(1111, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 07:32:04', '2025-01-01 07:32:04'),
(1112, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:32:06', '2025-01-01 07:32:06'),
(1113, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 07:32:58', '2025-01-01 07:32:58'),
(1114, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 07:33:01', '2025-01-01 07:33:01'),
(1115, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 08:26:37', '2025-01-01 08:26:37'),
(1116, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 08:26:40', '2025-01-01 08:26:40'),
(1117, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 08:26:58', '2025-01-01 08:26:58'),
(1118, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 08:26:59', '2025-01-01 08:26:59'),
(1119, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 08:29:29', '2025-01-01 08:29:29'),
(1120, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 08:29:32', '2025-01-01 08:29:32'),
(1121, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 08:56:39', '2025-01-01 08:56:39'),
(1122, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 08:56:46', '2025-01-01 08:56:46'),
(1123, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 08:57:32', '2025-01-01 08:57:32'),
(1124, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 08:57:47', '2025-01-01 08:57:47');
INSERT INTO `staff_logs` (`id`, `staff_id`, `date`, `module_name`, `module_id`, `log_message`, `log_message_all`, `permission_type`, `ip`, `created_at`, `updated_at`) VALUES
(1125, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 08:58:12', '2025-01-01 08:58:12'),
(1126, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 08:58:25', '2025-01-01 08:58:25'),
(1127, 2, '2025-01-01', 'customer', 68, 'edited the service details customer code :', 'Admin Amit Amit edited the service details customer code : cust_DEE_000068(DEEEE)', 'updated', '103.103.213.217', '2025-01-01 09:33:51', '2025-01-01 09:33:51'),
(1128, 2, '2025-01-01', 'customer', 66, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_rrr_000066(rrrrrrr)', 'updated', '103.103.213.217', '2025-01-01 09:59:22', '2025-01-01 09:59:22'),
(1129, 2, '2025-01-01', 'customer', 66, 'added FTE/Dedicated Staffing (engagement model) customer code :', 'Admin Amit Amit added FTE/Dedicated Staffing (engagement model) customer code : cust_rrr_000066(rrrrrrr)', 'updated', '103.103.213.217', '2025-01-01 09:59:37', '2025-01-01 09:59:37'),
(1130, 2, '2025-01-01', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '103.103.213.217', '2025-01-01 11:39:01', '2025-01-01 11:39:01'),
(1131, 2, '2025-01-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-01 11:39:02', '2025-01-01 11:39:02'),
(1132, 2, '2025-01-02', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-02 05:31:44', '2025-01-02 05:31:44'),
(1133, 2, '2025-01-03', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-03 05:04:45', '2025-01-03 05:04:45'),
(1134, 2, '2025-01-03', 'customer', 69, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_SDS_000069(SDSD)', 'created', '103.103.213.217', '2025-01-03 05:54:07', '2025-01-03 05:54:07'),
(1135, 2, '2025-01-03', 'customer', 69, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_SDS_000069(SDSD)', 'updated', '103.103.213.217', '2025-01-03 05:54:09', '2025-01-03 05:54:09'),
(1136, 2, '2025-01-03', 'customer', 70, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_PDD_000070(PDDD)', 'created', '103.103.213.217', '2025-01-03 07:09:35', '2025-01-03 07:09:35'),
(1137, 2, '2025-01-03', 'customer', 70, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_PDD_000070(PDDD)', 'updated', '103.103.213.217', '2025-01-03 07:09:38', '2025-01-03 07:09:38'),
(1138, 2, '2025-01-03', 'customer', 71, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_TTT_000071(TTTTT)', 'created', '103.103.213.217', '2025-01-03 07:10:29', '2025-01-03 07:10:29'),
(1139, 2, '2025-01-03', 'customer', 71, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_TTT_000071(TTTTT)', 'updated', '103.103.213.217', '2025-01-03 07:10:32', '2025-01-03 07:10:32'),
(1140, 2, '2025-01-03', 'client', 77, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_TTT_TTC_000077(TTCLIENT)', 'created', '103.103.213.217', '2025-01-03 09:24:40', '2025-01-03 09:24:40'),
(1141, 2, '2025-01-03', 'job', 84, 'created job code:', 'Admin Amit Amit created job code: TTT_TTC_VAT3_000077', 'created', '103.103.213.217', '2025-01-03 09:56:16', '2025-01-03 09:56:16'),
(1142, 2, '2025-01-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-01-04 05:17:05', '2025-01-04 05:17:05'),
(1143, 2, '2025-01-04', 'job', 84, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: TTT_TTC_VAT3_000077', 'created', '103.103.213.217', '2025-01-04 05:22:23', '2025-01-04 05:22:23'),
(1144, 2, '2025-01-04', 'job', 84, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: TTT_TTC_VAT3_000077', 'created', '103.103.213.217', '2025-01-04 05:27:10', '2025-01-04 05:27:10'),
(1145, 2, '2025-01-04', 'job', 84, 'edited the missing logs job code:', 'Admin Amit Amit edited the missing logs job code: TTT_TTC_VAT3_000077', 'updated', '103.103.213.217', '2025-01-04 05:27:32', '2025-01-04 05:27:32'),
(1146, 2, '2025-01-06', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-01-06 06:10:06', '2025-01-06 06:10:06'),
(1147, 2, '2025-01-07', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-01-07 05:30:11', '2025-01-07 05:30:11'),
(1148, 2, '2025-01-07', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-01-07 05:59:24', '2025-01-07 05:59:24'),
(1149, 2, '2025-01-07', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-01-07 05:59:27', '2025-01-07 05:59:27'),
(1150, 2, '2025-01-07', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-01-07 07:19:15', '2025-01-07 07:19:15'),
(1151, 2, '2025-01-07', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-01-07 07:19:20', '2025-01-07 07:19:20'),
(1152, 2, '2025-01-07', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-01-07 09:55:12', '2025-01-07 09:55:12'),
(1153, 2, '2025-01-08', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-01-08 06:08:52', '2025-01-08 06:08:52'),
(1154, 2, '2025-01-08', 'Internal', 14, 'created Internal Task a', 'Admin Amit Amit created Internal Task a ', 'created', '122.168.114.106', '2025-01-08 07:08:34', '2025-01-08 07:08:34'),
(1155, 2, '2025-01-08', 'customer sub source', 15, 'created customer sub source f', 'Admin Amit Amit created customer sub source f ', 'created', '122.168.114.106', '2025-01-08 07:27:15', '2025-01-08 07:27:15'),
(1156, 2, '2025-01-08', 'job types', 10, 'created job types a', 'Admin Amit Amit created job types a ', 'created', '122.168.114.106', '2025-01-08 07:27:40', '2025-01-08 07:27:40'),
(1157, 2, '2025-01-08', 'job types', 11, 'created job types a', 'Admin Amit Amit created job types a ', 'created', '122.168.114.106', '2025-01-08 07:27:54', '2025-01-08 07:27:54'),
(1158, 2, '2025-01-08', 'client', 78, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_TTT_F L_000078(F LIMITED_000078)', 'created', '122.168.114.106', '2025-01-08 12:37:07', '2025-01-08 12:37:07'),
(1159, 2, '2025-01-09', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2025-01-09 09:53:27', '2025-01-09 09:53:27'),
(1160, 2, '2025-01-10', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-01-10 04:47:59', '2025-01-10 04:47:59'),
(1161, 2, '2025-01-11', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-01-11 07:12:45', '2025-01-11 07:12:45'),
(1162, 2, '2025-01-11', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-01-11 07:12:54', '2025-01-11 07:12:54'),
(1163, 2, '2025-01-11', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-01-11 07:13:16', '2025-01-11 07:13:16'),
(1164, 2, '2025-01-11', 'customer', 72, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_A L_000072(A LIMITED_000072)', 'created', '122.168.114.106', '2025-01-11 07:24:16', '2025-01-11 07:24:17'),
(1165, 2, '2025-01-11', 'customer', 72, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_A L_000072(A LIMITED_000072)', 'updated', '122.168.114.106', '2025-01-11 07:24:47', '2025-01-11 07:24:47'),
(1166, 2, '2025-01-11', 'client', 79, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_A L_fff_000079(fffff)', 'created', '122.168.114.106', '2025-01-11 07:27:54', '2025-01-11 07:27:54'),
(1167, 2, '2025-01-11', 'client', 80, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_A L_F L_000080(F LIMITED_000080)', 'created', '122.168.114.106', '2025-01-11 09:33:09', '2025-01-11 09:33:09'),
(1168, 2, '2025-01-11', 'client', 80, 'company edited information. client code :', 'Admin Amit Amit company edited information. client code : cli_A L_F L_000080(F LIMITED_000080)', 'updated', '122.168.114.106', '2025-01-11 09:44:31', '2025-01-11 09:44:31'),
(1169, 2, '2025-01-11', 'client', 81, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_A L_E L_000081(E LIMITED_000081)', 'created', '122.168.114.106', '2025-01-11 09:50:31', '2025-01-11 09:50:31'),
(1170, 2, '2025-01-11', 'client', 82, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_A L_G L_000082(G LIMITED_000082)', 'created', '122.168.114.106', '2025-01-11 09:52:33', '2025-01-11 09:52:33'),
(1171, 2, '2025-01-11', 'client', 82, 'company edited information. client code :', 'Admin Amit Amit company edited information. client code : cli_A L_G L_000082(G LIMITED_000082)', 'updated', '122.168.114.106', '2025-01-11 09:52:53', '2025-01-11 09:52:53'),
(1172, 2, '2025-01-11', 'client', 82, 'company edited information. client code :', 'Admin Amit Amit company edited information. client code : cli_A L_G L_000082(G LIMITED_000082)', 'updated', '122.168.114.106', '2025-01-11 09:54:50', '2025-01-11 09:54:50'),
(1173, 2, '2025-01-11', 'client', 82, 'company edited information. client code :', 'Admin Amit Amit company edited information. client code : cli_A L_G L_000082(G LIMITED_000082)', 'updated', '122.168.114.106', '2025-01-11 09:54:56', '2025-01-11 09:54:56'),
(1174, 2, '2025-01-11', 'client', 82, 'company edited information. client code :', 'Admin Amit Amit company edited information. client code : cli_A L_G L_000082(G LIMITED_000082)', 'updated', '122.168.114.106', '2025-01-11 09:55:35', '2025-01-11 09:55:35'),
(1175, 2, '2025-01-11', 'client', 82, 'company edited information. client code :', 'Admin Amit Amit company edited information. client code : cli_A L_G L_000082(G LIMITED_000082)', 'updated', '122.168.114.106', '2025-01-11 09:55:50', '2025-01-11 09:55:50'),
(1176, 2, '2025-01-11', 'client', 82, 'company edited information. client code :', 'Admin Amit Amit company edited information. client code : cli_A L_G L_000082(G LIMITED_000082)', 'updated', '122.168.114.106', '2025-01-11 09:56:13', '2025-01-11 09:56:13'),
(1177, 2, '2025-01-11', 'client', 82, 'company edited information. client code :', 'Admin Amit Amit company edited information. client code : cli_A L_G L_000082(G LIMITED_000082)', 'updated', '122.168.114.106', '2025-01-11 09:56:32', '2025-01-11 09:56:32'),
(1178, 2, '2025-01-11', 'client', 81, 'company edited information. client code :', 'Admin Amit Amit company edited information. client code : cli_A L_E L_000081(E LIMITED_000081)', 'updated', '122.168.114.106', '2025-01-11 09:57:05', '2025-01-11 09:57:05'),
(1179, 2, '2025-01-11', 'client', 81, 'company edited information. client code :', 'Admin Amit Amit company edited information. client code : cli_A L_E L_000081(E LIMITED_000081)', 'updated', '122.168.114.106', '2025-01-11 09:57:16', '2025-01-11 09:57:16'),
(1180, 2, '2025-01-13', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-01-13 06:21:50', '2025-01-13 06:21:50'),
(1181, 2, '2025-01-14', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-01-14 05:02:34', '2025-01-14 05:02:34'),
(1182, 2, '2025-01-14', 'customer', 72, 'edited the company information customer code :', 'Admin Amit Amit edited the company information customer code : cust_A L_000072(A LIMITED_000072)', 'updated', '122.168.114.106', '2025-01-14 05:02:43', '2025-01-14 05:02:43'),
(1183, 2, '2025-01-15', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-01-15 10:21:04', '2025-01-15 10:21:05'),
(1184, 2, '2025-01-16', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-01-16 06:18:33', '2025-01-16 06:18:33'),
(1185, 2, '2025-01-16', 'customer', 72, 'changes the status Deactivate customer code :', 'Admin Amit Amit changes the status Deactivate customer code : cust_A L_000072(A LIMITED_000072)', 'updated', '122.168.114.106', '2025-01-16 13:13:17', '2025-01-16 13:13:17'),
(1186, 2, '2025-01-16', 'customer', 72, 'changes the status Activate customer code :', 'Admin Amit Amit changes the status Activate customer code : cust_A L_000072(A LIMITED_000072)', 'updated', '122.168.114.106', '2025-01-16 13:13:31', '2025-01-16 13:13:31'),
(1187, 2, '2025-01-16', 'job', 85, 'created job code:', 'Admin Amit Amit created job code: TTT_TTC_VAT3_000078', 'created', '122.168.114.106', '2025-01-16 13:16:41', '2025-01-16 13:16:41'),
(1188, 2, '2025-01-23', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-01-23 09:49:27', '2025-01-23 09:49:27'),
(1189, 2, '2025-01-24', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-01-24 05:44:59', '2025-01-24 05:44:59'),
(1190, 2, '2025-01-24', 'customer', 73, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_o_000073(o)', 'created', '122.168.114.106', '2025-01-24 07:08:13', '2025-01-24 07:08:13'),
(1191, 2, '2025-01-25', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-01-25 05:58:20', '2025-01-25 05:58:20'),
(1192, 2, '2025-01-27', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-01-27 05:30:57', '2025-01-27 05:30:57'),
(1193, 2, '2025-01-27', 'client', 83, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_o_Cha_000083(Charity)', 'created', '122.168.114.106', '2025-01-27 09:06:20', '2025-01-27 09:06:20'),
(1194, 2, '2025-01-27', 'client', 84, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_o_Acc_000084(Accosian 1 )', 'created', '122.168.114.106', '2025-01-27 09:33:50', '2025-01-27 09:33:50'),
(1195, 2, '2025-01-27', 'client', 85, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_o_TRU_000085(TRUS 1)', 'created', '122.168.114.106', '2025-01-27 09:55:26', '2025-01-27 09:55:26');

-- --------------------------------------------------------

--
-- Table structure for table `statuses`
--

DROP TABLE IF EXISTS `statuses`;
CREATE TABLE IF NOT EXISTS `statuses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `master_status_id` int(11) NOT NULL,
  `status_name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `master_status_id` (`master_status_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `status_types`
--

DROP TABLE IF EXISTS `status_types`;
CREATE TABLE IF NOT EXISTS `status_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type` (`type`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `status_types`
--

INSERT INTO `status_types` (`id`, `type`, `status`, `created_at`, `updated_at`) VALUES
(1, 'pending', '1', '2024-06-28 12:52:45', '2024-06-28 12:52:45'),
(2, 'completed', '1', '2024-06-28 12:53:10', '2024-06-28 12:53:10'),
(3, 'rejected', '1', '2024-06-28 12:53:26', '2024-09-10 11:25:24'),
(7, 'Hold', '1', '2024-07-11 13:18:01', '2024-08-22 09:27:04');

-- --------------------------------------------------------

--
-- Table structure for table `sub_internal`
--

DROP TABLE IF EXISTS `sub_internal`;
CREATE TABLE IF NOT EXISTS `sub_internal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `internal_id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name_copy` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `internal_id` (`internal_id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sub_internal`
--

INSERT INTO `sub_internal` (`id`, `internal_id`, `name`, `status`, `created_at`, `updated_at`, `name_copy`) VALUES
(1, 1, 'a', '1', '2024-10-05 12:13:02', '2024-10-05 12:13:02', NULL),
(2, 1, 'b', '1', '2024-10-05 12:13:07', '2024-10-05 12:13:07', NULL),
(3, 1, 'c', '1', '2024-10-05 12:13:12', '2024-10-05 12:13:12', NULL),
(4, 2, 'x', '1', '2024-10-05 12:13:23', '2024-10-05 12:13:23', NULL),
(5, 2, 'y', '1', '2024-10-05 12:13:28', '2024-10-05 12:13:28', NULL),
(6, 6, 'S1', '1', '2024-10-14 07:14:13', '2024-10-14 07:15:12', NULL),
(8, 6, 'SS', '1', '2024-10-22 10:21:51', '2024-10-22 10:21:51', NULL),
(9, 7, 'aa', '0', '2024-11-18 10:16:18', '2024-11-18 10:16:30', NULL),
(10, 7, 'bb', '1', '2024-11-18 10:16:38', '2024-11-18 10:16:38', NULL),
(11, 7, 'mmmm', '1', '2024-11-18 10:25:47', '2024-11-18 10:25:47', NULL),
(13, 10, 'DDDDD11111', '1', '2024-11-26 05:26:07', '2024-11-26 05:43:39', NULL),
(14, 10, 'a', '1', '2025-01-08 07:08:34', '2025-01-08 07:08:34', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
CREATE TABLE IF NOT EXISTS `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `service_id` int(11) NOT NULL,
  `job_type_id` int(11) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`,`service_id`,`job_type_id`),
  KEY `service_id` (`service_id`),
  KEY `job_type_id` (`job_type_id`)
) ENGINE=MyISAM AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`id`, `name`, `service_id`, `job_type_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'A', 3, 1, '1', '2024-10-15 08:22:45', '2024-10-15 08:22:45'),
(2, 'B', 3, 1, '1', '2024-10-15 08:22:45', '2024-10-15 08:22:45'),
(3, 'A', 1, 3, '1', '2024-10-15 08:31:39', '2024-10-15 08:31:39'),
(4, 'B', 1, 3, '1', '2024-10-15 08:31:39', '2024-10-15 08:31:39'),
(5, 'ABC', 1, 3, '1', '2024-10-15 08:35:25', '2024-10-15 08:35:25'),
(6, 'DDDDDD', 1, 3, '1', '2024-10-15 11:53:49', '2024-10-15 11:53:49'),
(7, 'FGFFF', 1, 3, '1', '2024-10-15 11:04:57', '2024-10-15 11:04:57'),
(8, 'RTYH', 1, 3, '1', '2024-10-15 11:05:56', '2024-10-15 11:05:56'),
(9, 'FDSSDGV', 1, 3, '1', '2024-10-15 11:08:39', '2024-10-15 11:08:39'),
(10, 'dfgesgsegsg', 1, 3, '1', '2024-10-15 11:09:19', '2024-10-15 11:09:19'),
(11, 'ssss', 2, 2, '1', '2024-10-22 10:30:32', '2024-10-22 10:30:32'),
(12, 'bbb', 2, 2, '1', '2024-11-18 12:20:45', '2024-11-18 12:20:45'),
(13, 'a', 5, 9, '1', '2024-11-23 10:24:06', '2024-11-23 10:24:06'),
(14, 'b', 5, 9, '1', '2024-11-23 10:24:06', '2024-11-23 10:24:06'),
(15, 'c', 5, 9, '1', '2024-11-23 10:24:06', '2024-11-23 10:24:06'),
(16, 'ss', 3, 5, '1', '2024-11-25 10:50:08', '2024-11-25 10:50:08'),
(17, 'DD', 3, 5, '1', '2024-11-28 12:10:59', '2024-11-28 12:10:59'),
(20, 'TSK1', 5, 9, '1', '2024-12-11 08:29:11', '2024-12-11 08:29:11'),
(21, 'TSK2', 5, 9, '1', '2024-12-11 08:29:11', '2024-12-11 08:29:11'),
(22, 'TSK3', 5, 9, '1', '2024-12-11 08:29:11', '2024-12-11 08:29:11'),
(23, 'TSK1', 2, 2, '1', '2024-12-11 08:30:56', '2024-12-11 08:30:56'),
(24, 'TSK2', 2, 2, '1', '2024-12-11 08:30:56', '2024-12-11 08:30:56'),
(25, 'TSK3', 2, 2, '1', '2024-12-11 08:30:56', '2024-12-11 08:30:56');

-- --------------------------------------------------------

--
-- Table structure for table `task_timesheet`
--

DROP TABLE IF EXISTS `task_timesheet`;
CREATE TABLE IF NOT EXISTS `task_timesheet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `checklist_task_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `checklist_task_id` (`checklist_task_id`),
  KEY `job_id` (`job_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `timesheet`
--

DROP TABLE IF EXISTS `timesheet`;
CREATE TABLE IF NOT EXISTS `timesheet` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `staff_id` int(11) NOT NULL,
  `task_type` enum('1','2') NOT NULL DEFAULT '1' COMMENT '1: Internal, 2: External',
  `customer_id` int(11) NOT NULL DEFAULT '0',
  `client_id` int(11) NOT NULL DEFAULT '0',
  `job_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `monday_date` date DEFAULT NULL,
  `monday_hours` varchar(100) DEFAULT NULL,
  `tuesday_date` date DEFAULT NULL,
  `tuesday_hours` varchar(100) DEFAULT NULL,
  `wednesday_date` date DEFAULT NULL,
  `wednesday_hours` varchar(100) DEFAULT NULL,
  `thursday_date` date DEFAULT NULL,
  `thursday_hours` varchar(100) DEFAULT NULL,
  `friday_date` date DEFAULT NULL,
  `friday_hours` varchar(100) DEFAULT NULL,
  `saturday_date` date DEFAULT NULL,
  `saturday_hours` varchar(100) DEFAULT NULL,
  `sunday_date` date DEFAULT NULL,
  `sunday_hours` varchar(100) DEFAULT NULL,
  `remark` text,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `submit_status` enum('0','1') NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `staff_id` (`staff_id`),
  KEY `customer_id` (`customer_id`),
  KEY `client_id` (`client_id`),
  KEY `job_id` (`job_id`),
  KEY `task_id` (`task_id`)
) ENGINE=MyISAM AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `timesheet`
--

INSERT INTO `timesheet` (`id`, `staff_id`, `task_type`, `customer_id`, `client_id`, `job_id`, `task_id`, `monday_date`, `monday_hours`, `tuesday_date`, `tuesday_hours`, `wednesday_date`, `wednesday_hours`, `thursday_date`, `thursday_hours`, `friday_date`, `friday_hours`, `saturday_date`, `saturday_hours`, `sunday_date`, `sunday_hours`, `remark`, `status`, `submit_status`, `created_at`, `updated_at`) VALUES
(1, 2, '1', 0, 0, 1, 3, '2024-11-25', '01:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2024-11-27 11:23:20', '2024-11-27 11:23:20'),
(2, 2, '2', 35, 44, 75, 16, '2024-11-25', '01:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2024-11-27 11:23:44', '2024-12-20 07:01:06'),
(3, 2, '2', 35, 44, 41, 11, '2024-11-25', '01:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2024-11-27 11:25:27', '2024-11-27 11:25:27'),
(4, 7, '1', 0, 0, 1, 2, '2024-12-16', '01:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2024-12-18 08:22:17', '2024-12-18 08:22:17'),
(5, 2, '1', 0, 0, 1, 3, '2024-12-09', '01:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2024-12-18 09:34:24', '2024-12-18 09:34:24'),
(6, 2, '1', 0, 0, 1, 3, '2024-12-16', '05:00', NULL, NULL, '2024-12-18', '01:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2024-12-18 10:22:38', '2024-12-18 10:31:45'),
(7, 2, '1', 0, 0, 1, 3, NULL, NULL, '2024-12-03', '02:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2024-12-18 10:34:11', '2024-12-18 10:34:11'),
(8, 7, '1', 0, 0, 1, 3, NULL, NULL, '2024-12-03', '02:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2024-12-19 07:19:12', '2024-12-20 06:20:24'),
(11, 22, '1', 0, 0, 1, 3, '2024-10-28', '01:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2024-12-23 07:10:25', '2024-12-23 07:10:25'),
(12, 22, '1', 0, 0, 1, 3, NULL, NULL, NULL, NULL, '2024-12-25', '05:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2024-12-23 07:10:50', '2024-12-23 07:10:50'),
(13, 2, '1', 0, 0, 1, 3, '2024-12-23', '01:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2024-12-23 07:17:52', '2024-12-25 08:25:26'),
(14, 2, '2', 1, 1, 6, 1, '2024-12-23', '02:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2024-12-23 07:21:38', '2024-12-25 08:25:26'),
(15, 2, '2', 57, 68, 78, 17, '2024-12-16', '01:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2024-12-25 08:34:45', '2024-12-25 08:34:45'),
(16, 9, '2', 57, 65, 69, 1, '2024-12-23', '01:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2024-12-25 08:36:09', '2024-12-25 08:36:09'),
(17, 9, '2', 57, 65, 69, 1, '2024-12-23', '02:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2024-12-25 08:44:03', '2024-12-25 08:44:03'),
(18, 22, '2', 53, 62, 66, 17, '2024-12-23', '01:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2024-12-25 08:46:09', '2024-12-25 08:46:09'),
(19, 22, '2', 53, 62, 66, 17, NULL, NULL, '2024-12-24', '2:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2024-12-25 08:46:28', '2024-12-25 08:46:28'),
(20, 23, '1', 0, 0, 1, 3, '2024-12-16', '01:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2024-12-26 12:23:04', '2024-12-26 12:33:34'),
(24, 23, '2', 68, 76, 83, 25, '2024-12-09', '02:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2024-12-26 12:38:01', '2024-12-26 12:38:06'),
(23, 23, '1', 0, 0, 1, 3, '2024-12-09', '01:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2024-12-26 12:38:01', '2024-12-26 12:38:06'),
(25, 22, '1', 0, 0, 1, 3, '2024-12-16', '01:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2024-12-27 09:29:02', '2024-12-27 09:29:17');

-- --------------------------------------------------------

--
-- Structure for view `dashboard_data_view`
--
DROP TABLE IF EXISTS `dashboard_data_view`;

DROP VIEW IF EXISTS `dashboard_data_view`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `dashboard_data_view`  AS SELECT `customers`.`id` AS `customer_id`, `customers`.`customer_type` AS `customer_type`, `customers`.`staff_id` AS `staff_id`, `customers`.`account_manager_id` AS `account_manager_id`, `customer_service_account_managers`.`account_manager_id` AS `a_account_manager_id`, `jobs`.`allocated_to` AS `allocated_to`, `jobs`.`reviewer` AS `reviewer`, `jobs`.`id` AS `job_id`, `jobs`.`status_type` AS `status_type`, `clients`.`id` AS `client_id`, `clients`.`created_at` AS `client_created_at`, `jobs`.`created_at` AS `job_created_at`, `customers`.`created_at` AS `customer_created_at` FROM (((((((`customers` left join `clients` on((`clients`.`customer_id` = `customers`.`id`))) left join `jobs` on((`jobs`.`client_id` = `clients`.`id`))) join `staffs` `staff1` on((`customers`.`staff_id` = `staff1`.`id`))) join `staffs` `staff2` on((`customers`.`account_manager_id` = `staff2`.`id`))) left join `customer_services` on((`customer_services`.`customer_id` = `customers`.`id`))) left join `customer_service_account_managers` on((`customer_service_account_managers`.`customer_service_id` = `customer_services`.`id`))) left join `customer_company_information` on((`customers`.`id` = `customer_company_information`.`customer_id`))) ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
