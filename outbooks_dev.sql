-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 31, 2025 at 09:52 AM
-- Server version: 10.11.13-MariaDB-0ubuntu0.24.04.1
-- PHP Version: 8.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `outbooks`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `GetCustomersData` (IN `LineManageStaffId` VARCHAR(255), IN `searchTerm` VARCHAR(255), IN `limitVal` INT, IN `offsetVal` INT)   BEGIN
    SET @sql_main = CONCAT(
        "SELECT DISTINCT customers.id AS id,
                customers.customer_type,
                customers.staff_id,
                customers.account_manager_id,
                customers.trading_name,
                customers.trading_address,
                customers.vat_registered,
                customers.vat_number,
                customers.website,
                customers.form_process,
                customers.created_at,
                customers.updated_at,
                customers.status,
                staff2.first_name AS account_manager_firstname, 
                staff2.last_name AS account_manager_lastname,
                CONCAT('cust_', SUBSTRING(customers.trading_name, 1, 3), '_',
                       SUBSTRING(customers.customer_code, 1, 15)) AS customer_code,
                CASE
        WHEN EXISTS (SELECT 1 FROM clients WHERE clients.customer_id = customers.id) 
        THEN 1 ELSE 0
    END AS is_client
    
         FROM customers
         JOIN staffs AS staff2 ON customers.account_manager_id = staff2.id
         LEFT JOIN assigned_jobs_staff_view ON assigned_jobs_staff_view.customer_id = customers.id
         WHERE (customers.staff_id IN (", LineManageStaffId, ")
                OR assigned_jobs_staff_view.staff_id IN (", LineManageStaffId, "))"
    )$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetLastWeekMissingTimesheetReport` (IN `p_StaffUserId` INT)   BEGIN
    DECLARE v_role_name VARCHAR(50)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `GetLastWeekSubmitTimesheetReport` (IN `p_StaffUserId` INT)   BEGIN
    DECLARE v_role_name VARCHAR(50)$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Stand-in structure for view `assigned_jobs_staff_view`
-- (See below for the actual view)
--
CREATE TABLE `assigned_jobs_staff_view` (
`customer_id` int(11)
,`client_id` int(11)
,`job_id` int(11)
,`staff_id` int(11)
,`source` varchar(36)
,`service_id_assign` int(11)
);

-- --------------------------------------------------------

--
-- Table structure for table `checklists`
--

CREATE TABLE `checklists` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `is_all_customer` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`is_all_customer`)),
  `service_id` int(11) NOT NULL,
  `job_type_id` int(11) NOT NULL,
  `client_type_id` varchar(250) NOT NULL,
  `check_list_name` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `checklists`
--

INSERT INTO `checklists` (`id`, `customer_id`, `is_all_customer`, `service_id`, `job_type_id`, `client_type_id`, `check_list_name`, `status`, `created_at`, `updated_at`) VALUES
(1, 78, NULL, 5, 1, '2', 'Checklist (3)', '1', '2025-03-27 15:05:05', '2025-03-27 15:05:05'),
(2, 80, NULL, 10, 26, '2', 'Checklist (3)', '1', '2025-03-30 14:34:51', '2025-03-30 14:34:51'),
(3, 83, NULL, 9, 25, '2', 'Checklist', '1', '2025-04-07 14:23:07', '2025-04-07 14:23:07'),
(4, 94, NULL, 8, 4, '1,2,3,4', 'Checklist (3)', '1', '2025-07-10 11:37:55', '2025-07-10 11:48:00'),
(5, 94, NULL, 7, 5, '2', 'Checklist', '1', '2025-07-10 14:18:27', '2025-07-10 14:18:27'),
(6, 94, NULL, 6, 7, '1,2,3,4', 'New', '1', '2025-07-11 11:47:04', '2025-07-11 11:47:04'),
(7, 93, NULL, 2, 18, '1', 'Testing new', '1', '2025-07-12 10:34:40', '2025-07-12 10:34:40'),
(8, 95, NULL, 8, 3, '2', 'VAT Review', '1', '2025-07-12 13:41:26', '2025-07-12 13:41:26'),
(9, 95, NULL, 2, 18, '1,2,3,4', 'Checklist', '1', '2025-07-12 13:44:30', '2025-07-12 13:45:46'),
(10, 97, NULL, 7, 5, '1,2,3,4,5,6,7', 'company client', '1', '2025-07-12 14:43:30', '2025-07-17 09:53:53'),
(11, 97, NULL, 3, 14, '1,2,3,4,5,6,7', 'Checklist', '1', '2025-07-16 14:07:23', '2025-07-17 09:03:10'),
(12, 97, NULL, 7, 5, '1,2,3,4,5,6,7', 'Checklist1', '1', '2025-07-17 09:06:20', '2025-07-17 09:06:20'),
(13, 0, '[97, 98, 100, 101, 103, 105, 106, 107, 108, 109, 113]', 7, 5, '1,2,3,4,5,6,7', 'VAT Review', '1', '2025-07-22 15:25:47', '2025-09-22 15:12:27'),
(14, 0, '[97, 98, 101, 105, 107, 108, 110, 112, 113, 114]', 2, 20, '1,2,3,4,5,6,7', 'Testing new', '1', '2025-07-22 15:27:14', '2025-09-27 12:56:06'),
(15, 97, NULL, 2, 20, '1,2,3,4,5,6,7', 'Testing new', '1', '2025-07-22 15:30:33', '2025-07-22 15:30:33'),
(16, 100, NULL, 7, 5, '1,2,3,4,5,6,7', 'Bookkepping catchup', '1', '2025-08-01 14:03:11', '2025-08-01 14:03:11'),
(17, 107, NULL, 8, 2, '1,2,3,4,5,6,7', 'vat', '1', '2025-08-20 12:09:40', '2025-08-20 12:09:40'),
(18, 107, NULL, 7, 5, '1,2,3,4,5,6,7', 'company', '1', '2025-08-20 12:10:19', '2025-08-20 12:10:19'),
(19, 113, NULL, 33, 28, '2', 'Checklist', '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41');

-- --------------------------------------------------------

--
-- Table structure for table `checklist_tasks`
--

CREATE TABLE `checklist_tasks` (
  `id` int(11) NOT NULL,
  `checklist_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `task_name` varchar(100) NOT NULL,
  `budgeted_hour` varchar(100) DEFAULT NULL COMMENT 'Budgeted hours for the task',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `checklist_tasks`
--

INSERT INTO `checklist_tasks` (`id`, `checklist_id`, `task_id`, `task_name`, `budgeted_hour`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'ABC', '11:22', '2025-03-27 15:05:05', '2025-03-27 15:05:05'),
(2, 2, 8, 'ABC', '11:22', '2025-03-30 14:34:51', '2025-03-30 14:34:51'),
(3, 3, 17, 'Employment Income', '11:22', '2025-04-07 14:23:07', '2025-04-07 14:23:07'),
(4, 3, 18, 'Self-Employment Income', '10:30', '2025-04-07 14:23:08', '2025-04-07 14:23:08'),
(5, 3, 19, 'Property Income', '2:00', '2025-04-07 14:23:08', '2025-04-07 14:23:08'),
(6, 4, 22, 'ABC', '11:30', '2025-07-10 11:37:55', '2025-07-10 11:48:00'),
(7, 5, 23, 'Employment Income', '11:22', '2025-07-10 14:18:27', '2025-07-10 14:18:27'),
(8, 5, 24, 'Self-Employment Income', '10:30', '2025-07-10 14:18:27', '2025-07-10 14:18:27'),
(9, 5, 25, 'Property Income', '2:00', '2025-07-10 14:18:27', '2025-07-10 14:18:27'),
(10, 6, 9, 'Working paper - Jackie Format', '01:00', '2025-07-11 11:47:04', '2025-07-11 11:47:04'),
(11, 7, 26, 'Catchup meeting ', '11:11', '2025-07-12 10:34:40', '2025-07-12 10:34:40'),
(12, 8, 20, 'tet', '01:00', '2025-07-12 13:41:26', '2025-07-12 13:41:26'),
(13, 8, 16, 'test', '01:00', '2025-07-12 13:41:26', '2025-07-12 13:41:26'),
(14, 8, 5, 'Prepare, Review & File', '01:27', '2025-07-12 13:41:26', '2025-07-12 13:41:26'),
(15, 9, 27, 'Employment Income', '11:22', '2025-07-12 13:44:30', '2025-07-12 13:44:30'),
(16, 9, 28, 'Self-Employment Income', '10:30', '2025-07-12 13:44:30', '2025-07-12 13:44:30'),
(17, 9, 29, 'Property Income', '2:00', '2025-07-12 13:44:30', '2025-07-12 13:44:30'),
(18, 10, 25, 'Property Income', '01:01', '2025-07-12 14:43:30', '2025-07-12 14:43:30'),
(19, 10, 24, 'Self-Employment Income', '04:00', '2025-07-12 14:43:30', '2025-07-12 14:43:30'),
(20, 10, 23, 'Employment Income', '00:30', '2025-07-12 14:43:30', '2025-07-12 14:43:30'),
(21, 10, 15, 'tewst', '02:00', '2025-07-12 14:43:30', '2025-07-12 14:43:30'),
(22, 11, 30, 'Processing', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(23, 11, 31, 'Finalisation', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(24, 11, 32, 'Review and prepare AWP', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(25, 11, 33, 'Interim Processing', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(26, 11, 34, 'Ready for Lodgement', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(27, 11, 35, 'SMSF Year-End Compliance', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(28, 11, 36, 'Fund Wind-Up', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(29, 11, 37, 'Rollover In/Out', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(30, 11, 38, 'SMSF Audit Preparation', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(31, 11, 39, 'SMSF Setup', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(32, 11, 40, 'Pension Commencement', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(33, 11, 41, 'Contribution Processing', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(34, 11, 42, 'Lump Sum Payment Processing', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(35, 11, 43, 'Client Query Handling', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(36, 11, 44, 'Quarterly BAS', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(37, 11, 45, 'Book- Keeping', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(38, 11, 46, 'SMSF Year End Compliance', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(39, 11, 47, 'Audit Papers', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(40, 11, 48, 'Other Tasks', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(41, 11, 49, 'Query', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(42, 11, 50, 'Year End Compliance', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(43, 11, 51, 'Bank Reconciliation', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(44, 11, 52, 'Share Transactions Posting & Corporate Actions', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(45, 11, 53, 'Market Valuation Updates', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(46, 11, 54, 'Report Preparation (TBAR, Minutes, etc.)', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(47, 11, 55, 'BAS Preparation', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(48, 11, 56, 'Query & Resolution', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(49, 11, 57, 'BGL360 Fund Setup', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(50, 11, 58, 'Miscellaneous Tasks', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(51, 11, 59, 'Fund Review & Prepare Financials', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(52, 11, 60, 'Audit Workpapers Preparation & Respond Auditor', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(53, 11, 61, 'Prepare Initial Query', '1:00', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(54, 12, 25, 'Property Income', '01:00', '2025-07-17 09:06:20', '2025-07-17 09:06:20'),
(55, 12, 24, 'Self-Employment Income', '01:00', '2025-07-17 09:06:20', '2025-07-17 09:06:20'),
(56, 12, 23, 'Employment Income', '01:00', '2025-07-17 09:06:20', '2025-07-17 09:06:20'),
(58, 13, 25, 'Property Income', '01:00', '2025-07-22 15:25:47', '2025-07-22 15:25:47'),
(59, 13, 24, 'Self-Employment Income', '01:00', '2025-07-22 15:25:47', '2025-07-22 15:25:47'),
(60, 13, 23, 'Employment Income', '01:00', '2025-07-22 15:25:47', '2025-07-22 15:25:47'),
(61, 13, 15, 'tewst', '01:00', '2025-07-22 15:25:47', '2025-07-22 15:25:47'),
(62, 14, 62, 'Catchup meeting ', '01:00', '2025-07-22 15:27:14', '2025-07-22 15:27:14'),
(63, 15, 62, 'Catchup meeting ', '01:09', '2025-07-22 15:30:33', '2025-07-22 15:30:33'),
(64, 16, 63, 'tes', '12:02', '2025-08-01 14:03:11', '2025-08-01 14:03:11'),
(65, 16, 25, 'Property Income', '12:33', '2025-08-01 14:03:11', '2025-08-01 14:03:11'),
(66, 16, 24, 'Self-Employment Income', '04:04', '2025-08-01 14:03:11', '2025-08-01 14:03:11'),
(67, 16, 23, 'Employment Income', '04:03', '2025-08-01 14:03:11', '2025-08-01 14:03:11'),
(68, 16, 15, 'tewst', '03:40', '2025-08-01 14:03:11', '2025-08-01 14:03:11'),
(69, 17, 69, 'test', '01:01', '2025-08-20 12:09:40', '2025-08-20 12:09:40'),
(70, 17, 4, 'Review & FIle', '02:02', '2025-08-20 12:09:40', '2025-08-20 12:09:40'),
(71, 18, 70, 'A', '01:01', '2025-08-20 12:10:19', '2025-08-20 12:10:19'),
(72, 18, 64, 'test', '01:01', '2025-08-20 12:10:19', '2025-08-20 12:10:19'),
(73, 18, 63, 'tes', '01:01', '2025-08-20 12:10:19', '2025-08-20 12:10:19'),
(74, 18, 25, 'Property Income', '01:01', '2025-08-20 12:10:19', '2025-08-20 12:10:19'),
(75, 18, 24, 'Self-Employment Income', '01:01', '2025-08-20 12:10:19', '2025-08-20 12:10:19'),
(76, 18, 23, 'Employment Income', '01:01', '2025-08-20 12:10:19', '2025-08-20 12:10:19'),
(77, 18, 15, 'tewst', '01:01', '2025-08-20 12:10:19', '2025-08-20 12:10:19'),
(78, 19, 76, 'Processing', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(79, 19, 77, 'Finalisation', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(80, 19, 78, 'Review and prepare AWP', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(81, 19, 79, 'Interim Processing', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(82, 19, 80, 'Ready for Lodgement', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(83, 19, 81, 'SMSF Year-End Compliance', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(84, 19, 82, 'Fund Wind-Up', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(85, 19, 83, 'Rollover In/Out', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(86, 19, 84, 'SMSF Audit Preparation', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(87, 19, 85, 'SMSF Setup', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(88, 19, 86, 'Pension Commencement', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(89, 19, 87, 'Contribution Processing', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(90, 19, 88, 'Lump Sum Payment Processing', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(91, 19, 89, 'Client Query Handling', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(92, 19, 90, 'Quarterly BAS', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(93, 19, 91, 'Book- Keeping', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(94, 19, 92, 'SMSF Year End Compliance', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(95, 19, 93, 'Audit Papers', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(96, 19, 94, 'Other Tasks', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(97, 19, 95, 'Query', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(98, 19, 96, 'Year End Compliance', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(99, 19, 97, 'Bank Reconciliation', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(100, 19, 98, 'Share Transactions Posting & Corporate Actions', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(101, 19, 99, 'Market Valuation Updates', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(102, 19, 100, 'Report Preparation (TBAR, Minutes, etc.)', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(103, 19, 101, 'BAS Preparation', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(104, 19, 102, 'Query & Resolution', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(105, 19, 103, 'BGL360 Fund Setup', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(106, 19, 104, 'Miscellaneous Tasks', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(107, 19, 105, 'Fund Review & Prepare Financials', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(108, 19, 106, 'Audit Workpapers Preparation & Respond Auditor', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(109, 19, 107, 'Prepare Initial Query', '1:00', '2025-09-22 15:17:41', '2025-09-22 15:17:41');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int(11) NOT NULL,
  `client_type` enum('1','2','3','4','5','6','7') NOT NULL DEFAULT '1' COMMENT '1: SoleTrader, 2: Company , 3:Partnership , 4 : Individual , 5 = Charity Incorporated Organisation , 6 = Unincorporated Association,\r\n7 = Trust',
  `customer_id` int(11) NOT NULL,
  `staff_created_id` int(11) NOT NULL,
  `client_industry_id` int(11) DEFAULT 0,
  `trading_name` varchar(255) NOT NULL,
  `service_address` longtext DEFAULT NULL,
  `charity_commission_number` varchar(255) DEFAULT NULL,
  `client_code` varchar(100) NOT NULL,
  `trading_address` longtext DEFAULT NULL,
  `vat_registered` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: No, 1: Yes',
  `vat_number` varchar(20) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `notes` longtext DEFAULT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `client_type`, `customer_id`, `staff_created_id`, `client_industry_id`, `trading_name`, `service_address`, `charity_commission_number`, `client_code`, `trading_address`, `vat_registered`, `vat_number`, `website`, `notes`, `status`, `created_at`, `updated_at`) VALUES
(1, '2', 1, 1, 0, 'AGMAN COCOA LIMITED_00001', NULL, NULL, '00001', 'Chadwick Court, 15 Hatfields, London, England, SE1 8DJ', '0', '', '', '', '1', '2025-02-10 14:04:32', '2025-02-10 14:04:32'),
(2, '2', 2, 7, 10, 'The Londons Design Collaborative Limited_00002', NULL, NULL, '00002', 'Apartment 4 5 Osiers Road, London, England, SW18 1HE', '0', '', '', '', '1', '2025-03-17 10:07:47', '2025-03-17 10:07:47'),
(6, '2', 6, 46, 7, 'DONATAS TRANSPORT LTD_00003', NULL, NULL, '00003', '61 Waterworks Street, Immingham, England, DN40 1AT', '0', '', '', '', '1', '2025-03-17 10:35:36', '2025-03-17 10:35:36'),
(7, '2', 9, 10, 0, 'PINPOINT MANUFACTURING LIMITED_00004', NULL, NULL, '00004', 'Unit 3a Crofty Industrial Estate, Penclawdd, Swansea, South Wales, SA4 3RS', '1', '', '', '', '1', '2025-03-17 10:59:32', '2025-03-17 10:59:32'),
(8, '2', 12, 15, 10, 'GEO-SPEEDY LTD_00005', NULL, NULL, '00005', '15 Oswald Road, Peterborough, England, PE2 9RY', '0', '', '', '', '1', '2025-03-17 14:13:35', '2025-03-17 14:13:35'),
(9, '1', 21, 50, 1, 'AB ', NULL, NULL, '00006', 'XYZ', '0', '', '', '', '1', '2025-03-18 12:14:51', '2025-03-18 12:14:51'),
(10, '2', 53, 61, 2, 'BEAM CONSTRUCTION LIMITED_00007', NULL, NULL, '00007', 'Building 18, Gateway 1000 Whittle Way, Arlington Business Park, Stevenage, Hertfordshire, England, SG1 2FP', '0', '', '', '', '1', '2025-03-19 07:09:48', '2025-03-19 07:09:48'),
(11, '2', 53, 61, 10, 'ONE FINANCIAL PLANNING LTD. _00008', NULL, NULL, '00008', '1 West Regent Street, Glasgow, Scotland, G2 1RW', '0', '', '', '', '1', '2025-03-19 09:22:47', '2025-03-19 09:22:47'),
(12, '2', 53, 61, 5, 'LAW AND LEWIS OF CAMBRIDGE LIMITED_00009', NULL, NULL, '00009', 'Unit 4 Highgate Farm, Willingham, Cambridge, England, CB24 5EU', '0', '', '', '', '1', '2025-03-19 09:23:29', '2025-03-19 09:23:29'),
(13, '2', 53, 61, 0, 'GUNN TI LIMITED_000010', NULL, NULL, '000010', 'Building 18, Gateway 1000, Arlington Business Park, Whittle Way, Stevenage, England, SG1 2FP', '0', '', '', '', '1', '2025-03-19 09:23:56', '2025-03-19 09:23:56'),
(14, '2', 53, 61, 0, 'LEGACY MATTERS LTD_000011', NULL, NULL, '000011', '9 Highfield Road, Impington, Cambridge, England, CB24 9PF', '0', '', '', '', '1', '2025-03-19 09:25:45', '2025-03-19 09:25:45'),
(15, '2', 53, 61, 0, 'HITEAM LIMITED_000012', NULL, NULL, '000012', '9 Highfield Road, Impington, Cambridge, Cambridgeshire, CB24 9PF', '0', '', '', '', '1', '2025-03-19 09:26:30', '2025-03-19 09:26:30'),
(16, '2', 71, 60, 3, 'BP FLATS LTD_000013', NULL, NULL, '000013', '78 Junction Road, Poole, United Kingdom, BH16 5AB', '0', '', '', '', '1', '2025-03-19 15:10:22', '2025-03-19 15:10:22'),
(17, '2', 71, 60, 0, 'LITTLE BLACK BOOK MUSIC LIMITED_000014', NULL, NULL, '000014', 'C/O Astonia Associates Ltd The Business & Technology Centre, Bessemer Drive, Stevenage, Hertfordshire, United Kingdom, SG1 2DX', '0', '', '', '', '1', '2025-03-19 16:08:17', '2025-03-19 16:08:17'),
(19, '2', 73, 1, 0, 'H PARKVIEW LTD', NULL, NULL, '000015', 'Leeward Building #2 Marcy Building C/O Amicorp B.V.I. Limited, 2nd Floor, Purcell Estate,, Road Town, Tortola, Virgin Islands, British, P.O.BOX 2416', '0', '', '', '', '1', '2025-03-26 13:55:33', '2025-03-27 05:38:55'),
(20, '3', 73, 1, 0, 'ASSOCIAZIONE PER LA PROMOZIONE DELLA LINGUA ITALIANA - PLI MANCHESTER LTD', NULL, NULL, '000016', '5th Floor 111 Charterhouse Street, London, United Kingdom, EC1M 6AW', '0', '', '', '', '1', '2025-03-26 13:59:11', '2025-03-26 13:59:11'),
(21, '1', 73, 1, 0, 'Thames International Trading Group', NULL, NULL, '000017', '43 Aylesford Street, London, SW1V 3RY', '0', '', '', '', '1', '2025-03-26 13:59:24', '2025-03-26 13:59:24'),
(22, '4', 73, 1, 0, 'tet', NULL, NULL, '000018', NULL, '1', NULL, NULL, '', '1', '2025-03-26 13:59:35', '2025-03-26 13:59:35'),
(23, '5', 73, 1, 0, 'test', 'test', 'test', '000019', 'test', '0', '', '', '', '1', '2025-03-26 13:59:53', '2025-03-26 13:59:53'),
(24, '6', 73, 1, 0, 'teststest', NULL, NULL, '000020', 'false', '0', '', '', '', '1', '2025-03-26 14:00:14', '2025-03-26 14:00:14'),
(25, '7', 73, 1, 0, 'testtesttest', NULL, NULL, '000021', 'test', '0', '', '', '', '1', '2025-03-26 14:00:42', '2025-03-26 14:00:42'),
(26, '2', 76, 93, 0, 'KJ ACADEMY (NORTH WEST) C.I.C. _000022', NULL, NULL, '000022', '1 Wellington Road, Swinton, Manchester, England, M27 4BR', '0', '', '', '', '1', '2025-03-27 14:19:34', '2025-06-20 09:33:13'),
(27, '1', 76, 93, 9, '43 AYLESFORD STREET LIMITED', NULL, NULL, '000023', '34 Merchant Plaza, Liverpool, L1 0AX, UK', '0', '', '', '', '1', '2025-03-27 14:20:24', '2025-06-20 09:33:13'),
(28, '3', 76, 93, 0, 'MaxCharacterFieldValidationForTestingPurposeIncludingAlphanumericAndSpecialSymbolsLikeDashAndDot.Max', NULL, NULL, '000024', '5th Floor 111 Charterhouse Street, London, United Kingdom, EC1M 6AW', '0', '', '', '', '1', '2025-03-27 14:46:46', '2025-06-20 09:33:13'),
(29, '4', 76, 93, 0, 'Merchant’s Haven Ltd.', NULL, NULL, '000025', NULL, '1', NULL, NULL, '', '1', '2025-03-27 14:47:54', '2025-06-20 09:33:13'),
(30, '1', 76, 93, 8, 'Great Britain Trade Consortiumk', NULL, NULL, '000026', '43 Aylesford Street, London, SW1V 3RY', '0', '', '', '', '1', '2025-03-27 14:48:45', '2025-06-20 09:33:13'),
(31, '1', 79, 2, 7, 'ABCD Trading', NULL, NULL, '000027', 'Suite 18 Winsor & Newton Building, Whitefriars Avenue', '0', '', '', '', '1', '2025-03-29 13:52:16', '2025-03-29 13:52:16'),
(32, '6', 79, 1, 0, 'teststesttest', NULL, NULL, '000028', 'false', '0', '', '', '', '1', '2025-03-30 14:13:18', '2025-03-30 14:13:18'),
(33, '2', 78, 1, 0, 'B.S.N.V. LIMITED_000029', NULL, NULL, '000029', '29 Astley Avenue, Coventry, England, CV6 6EY', '0', '', '', '', '1', '2025-03-30 14:20:56', '2025-03-30 14:20:56'),
(34, '2', 78, 1, 0, 'IJ ACHARA CONSULTANCY LTD_000030', NULL, NULL, '000030', 'International House 36-38, Cornhill, London, England, EC3V 3NG', '0', '', '', '', '1', '2025-03-30 14:22:30', '2025-03-30 14:22:30'),
(35, '2', 77, 1, 0, 'MH LIMITED_000031', NULL, NULL, '000031', 'Suite 3 Middlesex House, Meadway Technology Prak, Rutherford Close, Stevenage Hertfordshire, SG1 2EF', '0', '', '', '', '1', '2025-03-30 14:29:41', '2025-03-30 14:29:41'),
(36, '2', 80, 1, 0, 'GF ABERNETHY ENERGY LTD_000032', NULL, NULL, '000032', '20 Wenlock Road, London, England, N1 7GU', '0', '', '', '', '1', '2025-03-30 14:35:32', '2025-03-30 14:35:32'),
(37, '2', 81, 7, 0, 'KMD PROPERTY INVESTMENTS LIMITED_000033', NULL, NULL, '000033', '85 Bridge Street, Worksop, Nottinghamshire, United Kingdom, S80 1DL', '0', '', '', '', '1', '2025-04-01 09:57:54', '2025-04-01 09:57:54'),
(38, '2', 71, 60, 10, 'U CAN PROPERTY LIMITED_000034', NULL, NULL, '000034', 'Stags Head 990 Whittingham Lane, Whittingham, Preston, England, PR3 2AU', '0', '', '', '', '1', '2025-04-01 12:16:15', '2025-04-01 12:16:15'),
(39, '4', 82, 34, 0, 'Pinnacle UK Trade', NULL, NULL, '000035', NULL, '1', NULL, NULL, '', '1', '2025-04-03 14:49:22', '2025-04-03 14:49:22'),
(40, '2', 83, 93, 2, 'GF MYBSTER ENERGY LTD_000036', NULL, NULL, '000036', '20 Wenlock Road, London, England, N1 7GU', '0', '', '', '', '1', '2025-04-07 14:24:05', '2025-06-20 09:33:13'),
(41, '2', 83, 55, 10, 'OI ALDRIDGE LTD_000037', NULL, NULL, '000037', 'Unit 3 22 Westgate, Grantham, United Kingdom, NG31 6LU', '0', '', '', '', '1', '2025-04-07 14:56:19', '2025-04-07 14:56:19'),
(42, '2', 31, 44, 10, 'FIELDS LUXURY LIMITED_000038', NULL, NULL, '000038', ' 2nd Floor Gadd House, Arcadia  Avenue, London, England, N3 2JU', '0', '', '', '', '1', '2025-04-11 05:57:21', '2025-04-11 05:57:21'),
(43, '1', 85, 93, 10, 'CLI-1-TEST', NULL, NULL, '000039', 's', '0', '', '', '', '1', '2025-04-17 06:13:46', '2025-06-20 09:33:13'),
(44, '2', 86, 93, 10, 'AGMAN COCOA LIMITED_000040', NULL, NULL, '000040', 'Chadwick Court, 15 Hatfields, London, England, SE1 8DJ', '0', '', '', '', '1', '2025-04-17 16:33:03', '2025-06-20 09:33:13'),
(45, '2', 87, 93, 10, 'ABERDEEN LIFE AND PENSIONS LIMITED_000041', NULL, NULL, '000041', '50 Lothian Road, Festival Square, Edinburgh, Scotland, EH3 9WJ', '0', '', '', '', '1', '2025-04-17 16:34:53', '2025-06-20 09:33:13'),
(46, '2', 88, 1, 10, 'RE & BC LTD_000042', NULL, NULL, '000042', '10 Hardwick Place, Gosforth, Newcastle Upon Tyne, United Kingdom, NE3 4SH', '0', '', '', '', '1', '2025-05-02 12:50:25', '2025-05-02 12:50:25'),
(47, '2', 90, 1, 10, 'MOVING DIALOGUES THERAPY LTD', NULL, NULL, '000043', '20 Couzens House Weatherley Close, London, United Kingdom, E3 4BG', '0', '', '', '', '1', '2025-05-26 10:13:19', '2025-05-26 10:13:19'),
(48, '1', 91, 1, 10, 'ss', NULL, NULL, '000044', 's', '0', '', '', '', '1', '2025-05-26 10:40:37', '2025-05-26 10:40:37'),
(49, '1', 90, 1, 10, 'ss', NULL, NULL, '000045', 'd', '0', '', '', '', '1', '2025-05-26 11:49:59', '2025-05-26 11:49:59'),
(50, '2', 91, 1, 10, 'MOVING DIALOGUES THERAPY LTD', NULL, NULL, '000046', '20 Couzens House Weatherley Close, London, United Kingdom, E3 4BG', '0', '', '', '', '1', '2025-05-26 12:56:17', '2025-05-26 12:56:17'),
(51, '3', 92, 1, 10, 'Northbridge Trading Group12', NULL, NULL, '000047', '5 Thorncliffe Road, Keighley, England, BD22 6BY', '0', '', '', '', '1', '2025-06-26 12:59:20', '2025-06-26 12:59:20'),
(52, '2', 94, 36, 10, 'BISHOPS DAL ENERGY STORAGE LIMITED', NULL, NULL, '000048', 'Beaufort Court, Egg Farm Lane, Kings Langley, Hertfordshire, United Kingdom, WD4 8LR', '0', '', '', '', '1', '2025-07-10 11:39:46', '2025-07-10 11:39:46'),
(53, '1', 94, 36, 10, 'Merchant’s Haven Ltd.', NULL, NULL, '000049', '34 Merchant Plaza, Liverpool, L1 0AX, UK', '0', '', '', '', '1', '2025-07-10 11:46:03', '2025-07-10 11:46:03'),
(54, '1', 93, 103, 10, 'Merchant’s Haven Ltd.', NULL, NULL, '000050', '12 Enterprise Drive, Newcastle, NE1 4EP, UK', '0', '', '', '', '1', '2025-07-12 10:33:54', '2025-07-12 10:33:54'),
(55, '2', 95, 104, 10, 'JOHN J RYAN (SEALING PRODUCTS) LIMITED', NULL, NULL, '000051', 'Dunboyne Industrial Estate, Dunboyne, Co. Meath, Ireland', '0', '', '', '', '1', '2025-07-12 13:40:27', '2025-07-12 13:40:27'),
(56, '2', 97, 104, 10, 'CORNISH EVERGLADES LIMITED', NULL, NULL, '000052', 'High Winds, Hewas Water, St Austell, Cornwall, PL26 7JF', '0', '', '', '', '1', '2025-07-12 14:40:15', '2025-07-12 14:40:15'),
(57, '7', 97, 1, 0, 'testtesttest', NULL, NULL, '000053', 'false', '0', '', '', '', '1', '2025-07-16 14:06:44', '2025-07-16 14:06:44'),
(58, '2', 89, 88, 10, 'R LIMITED', NULL, NULL, '000054', 'The Chrysalis Building, Bramley Road, London, W10 6SP', '0', '', '', '', '1', '2025-07-24 16:13:09', '2025-07-24 16:13:09'),
(59, '2', 98, 80, 10, 'AFROFRING ENTERTAINMENT LIMITED', NULL, NULL, '000055', '10 Salvesen Grove, Edinburgh, Scotland, EH4 5JP', '0', '', '', '', '1', '2025-07-24 16:23:15', '2025-07-24 16:23:15'),
(60, '3', 100, 52, 10, 'false', NULL, NULL, '000056', 'Apartment 6 17 Sankey Street, Warrington, England, WA1 1XG', '0', '', '', '', '1', '2025-08-01 14:02:11', '2025-08-01 14:02:11'),
(61, '2', 20, 52, 10, 'CLASSIC CARS (NW) LIMITED', NULL, NULL, '000057', 'Slate Farm Higher Lane, Haslingden, Rossendale, England, BB4 5UD', '0', '', '', '', '1', '2025-08-01 14:05:16', '2025-08-01 14:05:16'),
(62, '2', 101, 80, 10, 'R. MANCHESTER OPCO HOLDCO LIMITED', NULL, NULL, '000058', '22 Grenville Street, St Helier, Jersey, Jersey, JE4 8PX', '0', '', '', '', '1', '2025-08-01 15:00:29', '2025-08-01 15:00:29'),
(63, '2', 102, 60, 10, 'AGRIPPA ARCHITECTURAL SERVICES LTD', NULL, NULL, '000059', '9 Ardern Close, Bristol, England, BS9 2QT', '0', '', '', '', '1', '2025-08-05 13:45:00', '2025-08-05 13:45:00'),
(64, '2', 103, 48, 10, 'AMAN MARKET LTD', NULL, NULL, '000060', '406 Foleshill Road, Coventry, England, CV6 5AN', '0', '', '', '', '1', '2025-08-11 14:51:42', '2025-08-11 14:51:42'),
(65, '2', 104, 48, 10, 'D M HOLDINGS LTD', NULL, NULL, '000061', 'First Floor La Chasse Chambers, Ten La Chasse, St Helier, Jersey, JE2 4UE', '0', '', '', '', '1', '2025-08-11 15:22:03', '2025-08-11 15:22:03'),
(66, '5', 105, 48, 0, 'test', '', '234234', '000062', 'false', '0', '', '', '', '1', '2025-08-12 13:51:29', '2025-08-12 13:51:29'),
(67, '2', 105, 48, 10, 'DFDS A/S', NULL, NULL, '000063', 'Marmorvej, 18, København Ø, Denmark, 2100', '0', '', '', '', '1', '2025-08-12 13:57:57', '2025-08-12 13:57:57'),
(68, '2', 106, 48, 10, 'AGAXI LTD', NULL, NULL, '000064', '65 Linden Avenue, Swindon, England, SN2 1QN', '0', '', '', '', '1', '2025-08-13 14:59:01', '2025-08-13 14:59:01'),
(69, '1', 106, 48, 10, 'Thames International Trading Group', NULL, NULL, '000065', 'sdadadadadsad', '0', '', '', '', '1', '2025-08-13 15:23:50', '2025-08-13 15:23:50'),
(70, '4', 106, 48, 0, '43 AYLESFORD STREET LIMITED', NULL, NULL, '000066', NULL, '1', NULL, NULL, '', '1', '2025-08-13 15:33:47', '2025-08-13 15:33:47'),
(71, '5', 106, 48, 0, 'test', 'false', '234234', '000067', 'false', '0', '', '', '', '1', '2025-08-13 15:37:16', '2025-08-13 15:37:16'),
(72, '1', 107, 105, 10, 'test for sole trader', NULL, NULL, '000068', 'test', '0', '', '', '', '1', '2025-08-20 12:03:57', '2025-08-20 12:03:57'),
(73, '2', 108, 105, 10, 'H. CAMPBELL LLC', NULL, NULL, '000069', '71 Glenview Drive, San Francisco, United States, 94131', '0', '', '', '', '1', '2025-08-20 12:21:49', '2025-08-20 12:21:49'),
(74, '2', 108, 105, 10, 'R. HEATHROW M4 J4 OPCO LIMITED', NULL, NULL, '000070', '22 Grenville Street, St Helier, Jersey, JE4 8PX', '0', '', '', '', '1', '2025-08-20 12:49:36', '2025-08-20 12:49:36'),
(75, '2', 108, 105, 10, 'ABBOTT AND WILDE LIMITED', NULL, NULL, '000071', 'Jasmine Cottage Long Lane, Shepherdswell, Dover, England, CT15 7LX', '0', '', '', '', '1', '2025-08-20 12:53:16', '2025-08-20 12:53:16'),
(76, '2', 108, 105, 10, 'W FOURTEEN PROPERTY LIMITED', NULL, NULL, '000072', '4th Floor St Paul\'s Gate, 22-24 New Street, St Helier, Jersey, JE1 4TR', '0', '', '', '', '1', '2025-08-20 12:55:13', '2025-08-20 12:55:13'),
(77, '2', 107, 105, 10, 'B. & I. HOLDINGS LIMITED', NULL, NULL, '000073', '2nd Floor, Maison Trinity, Rue Du Pre, St. Peter Port, Guernsey, GY1 1LT', '0', '', '', '', '1', '2025-08-20 13:01:33', '2025-08-20 13:01:33'),
(78, '2', 107, 105, 10, 'HEAVEN RETAIL LIMITED', NULL, NULL, '000074', '9  Orme Close, Manchester, United Kingdom, M11 3JX', '0', '', '', '', '1', '2025-08-20 13:05:34', '2025-08-20 13:05:34'),
(79, '3', 109, 105, 10, 'test', NULL, NULL, '000075', 'test', '0', '', '', '', '1', '2025-08-20 13:14:08', '2025-08-20 13:14:08'),
(80, '2', 110, 111, 10, 'HEAVEN RETAIL LIMITED', NULL, NULL, '000076', '9  Orme Close, Manchester, United Kingdom, M11 3JX', '0', '', '', '', '1', '2025-08-23 13:04:10', '2025-08-23 13:04:10'),
(81, '2', 112, 113, 10, 'CUSTOM OF THE COUNTY LIMITED', NULL, NULL, '000077', '5 Vernon Street, London, W14 0RJ', '0', '', '', '', '1', '2025-09-04 14:13:44', '2025-09-04 14:13:44'),
(82, '2', 113, 1, 10, 'D M HOLDINGS LTD', NULL, NULL, '000078', 'First Floor La Chasse Chambers, Ten La Chasse, St Helier, Jersey, JE2 4UE', '0', '', '', '', '1', '2025-09-22 15:13:02', '2025-09-22 15:13:02'),
(83, '2', 114, 111, 10, 'DEVONSHIRE HOTELS & RESTAURANTS GROUP LIMITED', NULL, NULL, '000079', 'Estate Office, Edensor, Bakewell, England, DE45 1PJ', '0', '', '', '', '1', '2025-09-27 12:59:36', '2025-09-27 12:59:36'),
(84, '2', 116, 1, 10, 'H PARKVIEW LTD', NULL, NULL, '000080', 'Leeward Building #2 Marcy Building C/O Amicorp B.V.I. Limited, 2nd Floor, Purcell Estate,, Road Town, Tortola, Virgin Islands, British, P.O.BOX 2416', '0', '', '', '', '1', '2025-10-04 13:24:03', '2025-10-04 13:24:03');

-- --------------------------------------------------------

--
-- Table structure for table `client_company_information`
--

CREATE TABLE `client_company_information` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `company_name` varchar(100) NOT NULL,
  `entity_type` varchar(255) NOT NULL,
  `company_status` varchar(100) NOT NULL COMMENT '0: deactive, 1: active',
  `company_number` varchar(50) DEFAULT NULL,
  `registered_office_address` longtext NOT NULL,
  `incorporation_date` date NOT NULL,
  `incorporation_in` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `client_company_information`
--

INSERT INTO `client_company_information` (`id`, `client_id`, `company_name`, `entity_type`, `company_status`, `company_number`, `registered_office_address`, `incorporation_date`, `incorporation_in`, `created_at`, `updated_at`) VALUES
(1, 1, 'AGMAN COCOA LIMITED Test', 'ltd', 'active', '01287947', 'Chadwick Court, 15 Hatfields, London, England, SE1 8DJ', '1976-11-25', '5', '2025-02-10 14:04:32', '2025-02-10 14:04:32'),
(2, 6, 'DONATAS TRANSPORT LTD', 'ltd', 'active', '14434369', '61 Waterworks Street, Immingham, England, DN40 1AT', '2022-10-21', '5', '2025-03-17 10:35:36', '2025-03-17 10:35:36'),
(3, 7, 'PINPOINT MANUFACTURING LIMITED', 'ltd', 'active', '06847418', 'Unit 3a Crofty Industrial Estate, Penclawdd, Swansea, South Wales, SA4 3RS', '2009-03-16', '1', '2025-03-17 10:59:32', '2025-03-17 10:59:32'),
(4, 8, 'GEO-SPEEDY LTD', 'ltd', 'active', '14243152', '15 Oswald Road, Peterborough, England, PE2 9RY', '2022-07-19', '1', '2025-03-17 14:13:35', '2025-03-17 14:13:35'),
(5, 10, 'BEAM CONSTRUCTION LIMITED', 'ltd', 'active', '07665092', 'Building 18, Gateway 1000 Whittle Way, Arlington Business Park, Stevenage, Hertfordshire, England, SG1 2FP', '2011-06-10', '5', '2025-03-19 07:09:48', '2025-03-19 07:09:48'),
(6, 11, 'ONE FINANCIAL PLANNING LTD. ', 'ltd', 'active', 'SC249428', '1 West Regent Street, Glasgow, Scotland, G2 1RW', '2003-05-14', '5', '2025-03-19 09:22:47', '2025-03-19 09:22:47'),
(7, 12, 'LAW AND LEWIS OF CAMBRIDGE LIMITED', 'ltd', 'active', '08876630', 'Unit 4 Highgate Farm, Willingham, Cambridge, England, CB24 5EU', '2014-02-05', '4', '2025-03-19 09:23:29', '2025-03-19 09:23:29'),
(8, 13, 'GUNN TI LIMITED', 'ltd', 'active', '09705680', 'Building 18, Gateway 1000, Arlington Business Park, Whittle Way, Stevenage, England, SG1 2FP', '2015-07-28', '5', '2025-03-19 09:23:56', '2025-03-19 09:23:56'),
(9, 14, 'LEGACY MATTERS LTD', 'ltd', 'active', '12549373', '9 Highfield Road, Impington, Cambridge, England, CB24 9PF', '2020-04-07', '5', '2025-03-19 09:25:45', '2025-03-19 09:25:45'),
(10, 15, 'HITEAM LIMITED', 'ltd', 'active', '08989004', '9 Highfield Road, Impington, Cambridge, Cambridgeshire, CB24 9PF', '2014-04-09', '5', '2025-03-19 09:26:30', '2025-03-19 09:26:30'),
(11, 16, 'BP FLATS LTD', 'ltd', 'active', '11083667', '78 Junction Road, Poole, United Kingdom, BH16 5AB', '2017-11-27', '4', '2025-03-19 15:10:22', '2025-03-19 15:10:22'),
(12, 17, 'LITTLE BLACK BOOK MUSIC LIMITED', 'ltd', 'active', '14465241', 'C/O Astonia Associates Ltd The Business & Technology Centre, Bessemer Drive, Stevenage, Hertfordshire, United Kingdom, SG1 2DX', '2022-11-07', '4', '2025-03-19 16:08:17', '2025-03-19 16:08:17'),
(14, 19, 'H PARKVIEW LTD', 'registered-overseas-entity', 'registered', 'OE030063', 'Leeward Building #2 Marcy Building C/O Amicorp B.V.I. Limited, 2nd Floor, Purcell Estate,, Road Town, Tortola, Virgin Islands, British, P.O.BOX 2416', '2023-06-08', '9', '2025-03-26 13:55:33', '2025-03-27 05:38:55'),
(15, 26, 'KJ ACADEMY (NORTH WEST) C.I.C. ', 'private-limited-guarant-nsc', 'active', '16297920', '1 Wellington Road, Swinton, Manchester, England, M27 4BR', '2013-12-23', '6', '2025-03-27 14:19:34', '2025-03-27 14:20:00'),
(16, 33, 'B.S.N.V. LIMITED', 'ltd', 'active', '15651523', '29 Astley Avenue, Coventry, England, CV6 6EY', '2024-04-16', '7', '2025-03-30 14:20:56', '2025-03-30 14:20:56'),
(17, 34, 'IJ ACHARA CONSULTANCY LTD', 'ltd', 'active', '10974994', 'International House 36-38, Cornhill, London, England, EC3V 3NG', '2017-09-21', '2', '2025-03-30 14:22:30', '2025-03-30 14:22:30'),
(18, 35, 'MH LIMITED', 'ltd', 'active', '02521042', 'Suite 3 Middlesex House, Meadway Technology Prak, Rutherford Close, Stevenage Hertfordshire, SG1 2EF', '1990-07-11', '6', '2025-03-30 14:29:41', '2025-03-30 14:29:41'),
(19, 36, 'GF ABERNETHY ENERGY LTD', 'ltd', 'dissolved', '15362729', '20 Wenlock Road, London, England, N1 7GU', '2023-12-19', '2', '2025-03-30 14:35:32', '2025-03-30 14:35:32'),
(20, 37, 'KMD PROPERTY INVESTMENTS LIMITED', 'ltd', 'active', '09928155', '85 Bridge Street, Worksop, Nottinghamshire, United Kingdom, S80 1DL', '2015-12-23', '1', '2025-04-01 09:57:54', '2025-04-01 09:57:54'),
(21, 38, 'U CAN PROPERTY LIMITED', 'ltd', 'active', '12456071', 'Stags Head 990 Whittingham Lane, Whittingham, Preston, England, PR3 2AU', '2020-02-11', '4', '2025-04-01 12:16:15', '2025-04-01 12:16:15'),
(22, 40, 'GF MYBSTER ENERGY LTD', 'ltd', 'active', '15899619', '20 Wenlock Road, London, England, N1 7GU', '2024-08-15', '5', '2025-04-07 14:24:05', '2025-04-07 14:24:05'),
(23, 41, 'OI ALDRIDGE LTD', 'ltd', 'active', '13764793', 'Unit 3 22 Westgate, Grantham, United Kingdom, NG31 6LU', '2021-11-25', '5', '2025-04-07 14:56:19', '2025-04-07 14:56:19'),
(24, 42, 'FIELDS LUXURY LIMITED', 'ltd', 'active', '11322764', 'United Kingdom', '2018-04-23', '4', '2025-04-11 05:57:21', '2025-04-11 05:57:21'),
(25, 44, 'AGMAN COCOA LIMITED', 'ltd', 'active', '01287947', 'Chadwick Court, 15 Hatfields, London, England, SE1 8DJ', '1976-11-25', '9', '2025-04-17 16:33:03', '2025-04-17 16:33:03'),
(26, 45, 'ABERDEEN LIFE AND PENSIONS LIMITED', 'ltd', 'active', 'SC839505', '50 Lothian Road, Festival Square, Edinburgh, Scotland, EH3 9WJ', '2025-02-28', '9', '2025-04-17 16:34:53', '2025-04-17 16:34:53'),
(27, 46, 'RE & BC LTD', 'ltd', 'active', '12760462', '10 Hardwick Place, Gosforth, Newcastle Upon Tyne, United Kingdom, NE3 4SH', '2020-07-22', '9', '2025-05-02 12:50:25', '2025-05-02 12:50:25'),
(28, 47, 'MOVING DIALOGUES THERAPY LTD', 'ltd', 'active', '16211397', '20 Couzens House Weatherley Close, London, United Kingdom, E3 4BG', '2025-01-27', '9', '2025-05-26 10:13:19', '2025-05-26 10:13:19'),
(29, 50, 'MOVING DIALOGUES THERAPY LTD', 'ltd', 'active', '16211397', '20 Couzens House Weatherley Close, London, United Kingdom, E3 4BG', '2025-01-27', '9', '2025-05-26 12:56:17', '2025-05-26 12:56:17'),
(30, 52, 'BISHOPS DAL ENERGY STORAGE LIMITED', 'ltd', 'active', '15630057', 'Beaufort Court, Egg Farm Lane, Kings Langley, Hertfordshire, United Kingdom, WD4 8LR', '2024-04-09', '9', '2025-07-10 11:39:46', '2025-07-10 11:39:46'),
(31, 55, 'JOHN J RYAN (SEALING PRODUCTS) LIMITED', 'registered-overseas-entity', 'registered', 'OE031436', 'Dunboyne Industrial Estate, Dunboyne, Co. Meath, Ireland', '2023-11-03', '9', '2025-07-12 13:40:27', '2025-07-12 13:40:27'),
(32, 56, 'CORNISH EVERGLADES LIMITED', 'ltd', 'liquidation', '02302042', 'High Winds, Hewas Water, St Austell, Cornwall, PL26 7JF', '1988-10-04', '9', '2025-07-12 14:40:15', '2025-07-12 14:40:15'),
(33, 58, 'R LIMITED', 'ltd', 'dissolved', '02946208', 'The Chrysalis Building, Bramley Road, London, W10 6SP', '1994-07-07', '9', '2025-07-24 16:13:09', '2025-07-24 16:13:09'),
(34, 59, 'AFROFRING ENTERTAINMENT LIMITED', 'ltd', 'active', 'SC712681', '10 Salvesen Grove, Edinburgh, Scotland, EH4 5JP', '2021-10-20', '9', '2025-07-24 16:23:15', '2025-07-24 16:23:15'),
(35, 61, 'CLASSIC CARS (NW) LIMITED', 'ltd', 'active', '13067415', 'Slate Farm Higher Lane, Haslingden, Rossendale, England, BB4 5UD', '2020-12-07', '9', '2025-08-01 14:05:16', '2025-08-01 14:05:16'),
(36, 62, 'R. MANCHESTER OPCO HOLDCO LIMITED', 'oversea-company', 'active', 'FC038471', '22 Grenville Street, St Helier, Jersey, Jersey, JE4 8PX', '2019-04-09', '9', '2025-08-01 15:00:29', '2025-08-01 15:00:29'),
(37, 63, 'AGRIPPA ARCHITECTURAL SERVICES LTD', 'ltd', 'active', '12514836', '9 Ardern Close, Bristol, England, BS9 2QT', '2020-03-12', '9', '2025-08-05 13:45:00', '2025-08-05 13:45:00'),
(38, 64, 'AMAN MARKET LTD', 'ltd', 'active', '15749096', '406 Foleshill Road, Coventry, England, CV6 5AN', '2024-05-29', '9', '2025-08-11 14:51:42', '2025-08-11 14:51:42'),
(39, 65, 'D M HOLDINGS LTD', 'registered-overseas-entity', 'registered', 'OE025448', 'First Floor La Chasse Chambers, Ten La Chasse, St Helier, Jersey, JE2 4UE', '2023-02-10', '9', '2025-08-11 15:22:03', '2025-08-11 15:22:03'),
(40, 67, 'DFDS A/S', 'registered-overseas-entity', 'registered', 'OE032118', 'Marmorvej, 18, København Ø, Denmark, 2100', '2024-01-23', '9', '2025-08-12 13:57:57', '2025-08-12 13:57:57'),
(41, 68, 'AGAXI LTD', 'ltd', 'active', '15341879', '65 Linden Avenue, Swindon, England, SN2 1QN', '2023-12-11', '9', '2025-08-13 14:59:01', '2025-08-13 14:59:01'),
(42, 73, 'H. CAMPBELL LLC', 'registered-overseas-entity', 'registered', 'OE032611', '71 Glenview Drive, San Francisco, United States, 94131', '2024-04-26', '9', '2025-08-20 12:21:49', '2025-08-20 12:21:49'),
(43, 74, 'R. HEATHROW M4 J4 OPCO LIMITED', 'registered-overseas-entity', 'registered', 'OE006566', '22 Grenville Street, St Helier, Jersey, JE4 8PX', '2022-12-06', '9', '2025-08-20 12:49:36', '2025-08-20 12:49:36'),
(44, 75, 'ABBOTT AND WILDE LIMITED', 'ltd', 'active', '11445182', 'Jasmine Cottage Long Lane, Shepherdswell, Dover, England, CT15 7LX', '2018-07-03', '9', '2025-08-20 12:53:16', '2025-08-20 12:53:16'),
(45, 76, 'W FOURTEEN PROPERTY LIMITED', 'registered-overseas-entity', 'removed', 'OE028838', '4th Floor St Paul\'s Gate, 22-24 New Street, St Helier, Jersey, JE1 4TR', '2023-03-24', '9', '2025-08-20 12:55:13', '2025-08-20 12:55:13'),
(46, 77, 'B. & I. HOLDINGS LIMITED', 'registered-overseas-entity', 'registered', 'OE007720', '2nd Floor, Maison Trinity, Rue Du Pre, St. Peter Port, Guernsey, GY1 1LT', '2022-12-13', '9', '2025-08-20 13:01:33', '2025-08-20 13:01:33'),
(47, 78, 'HEAVEN RETAIL LIMITED', 'ltd', 'dissolved', '03562410', '9  Orme Close, Manchester, United Kingdom, M11 3JX', '1998-05-12', '9', '2025-08-20 13:05:34', '2025-08-20 13:05:34'),
(48, 80, 'HEAVEN RETAIL LIMITED', 'ltd', 'dissolved', '03562410', '9  Orme Close, Manchester, United Kingdom, M11 3JX', '1998-05-12', '9', '2025-08-23 13:04:10', '2025-08-23 13:04:10'),
(49, 81, 'CUSTOM OF THE COUNTY LIMITED', 'ltd', 'active', '16013876', '5 Vernon Street, London, W14 0RJ', '2024-10-11', '9', '2025-09-04 14:13:44', '2025-09-04 14:13:44'),
(50, 82, 'D M HOLDINGS LTD', 'registered-overseas-entity', 'registered', 'OE025448', 'First Floor La Chasse Chambers, Ten La Chasse, St Helier, Jersey, JE2 4UE', '2023-02-10', '9', '2025-09-22 15:13:02', '2025-09-22 15:13:02'),
(51, 83, 'DEVONSHIRE HOTELS & RESTAURANTS GROUP LIMITED', 'ltd', 'active', '01572796', 'Estate Office, Edensor, Bakewell, England, DE45 1PJ', '1981-07-07', '9', '2025-09-27 12:59:36', '2025-09-27 12:59:36'),
(52, 84, 'H PARKVIEW LTD', 'registered-overseas-entity', 'registered', 'OE030063', 'Leeward Building #2 Marcy Building C/O Amicorp B.V.I. Limited, 2nd Floor, Purcell Estate,, Road Town, Tortola, Virgin Islands, British, P.O.BOX 2416', '2023-06-08', '9', '2025-10-04 13:24:03', '2025-10-04 13:24:03');

-- --------------------------------------------------------

--
-- Table structure for table `client_contact_details`
--

CREATE TABLE `client_contact_details` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `role` int(11) NOT NULL DEFAULT 0,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `alternate_email` varchar(100) DEFAULT NULL,
  `phone_code` varchar(6) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `alternate_phone_code` varchar(6) DEFAULT NULL,
  `alternate_phone` varchar(20) DEFAULT NULL,
  `residential_address` text DEFAULT NULL,
  `authorised_signatory_status` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: off, 1: on',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `client_contact_details`
--

INSERT INTO `client_contact_details` (`id`, `client_id`, `role`, `first_name`, `last_name`, `email`, `alternate_email`, `phone_code`, `phone`, `alternate_phone_code`, `alternate_phone`, `residential_address`, `authorised_signatory_status`, `created_at`, `updated_at`) VALUES
(1, 1, 0, 'Gaynor Antigha', 'BASSEY', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-02-10 14:04:32', '2025-02-10 14:04:32'),
(2, 6, 0, 'Donatas', 'NORKEVICIUS', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-03-17 10:35:36', '2025-03-17 10:35:36'),
(3, 7, 0, 'Jacqueline Elizabeth', 'Phillips', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-03-17 10:59:32', '2025-03-17 10:59:32'),
(4, 8, 0, 'Georgian-Laurentiu', 'CAPRA', 'admin@fmaccounting.net', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-03-17 14:13:35', '2025-03-17 14:13:35'),
(5, 9, 0, 'AB', 'C', '', NULL, '+44', '', NULL, NULL, '', '0', '2025-03-18 12:14:51', '2025-03-18 12:14:51'),
(6, 10, 0, 'Peter Brandon', 'MASSINGHAM', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-03-19 07:09:48', '2025-03-19 07:09:48'),
(7, 11, 0, 'Lee Edward', 'BLACKMAN', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-03-19 09:22:47', '2025-03-19 09:22:47'),
(8, 12, 0, 'Mark Richard', 'LAW', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-03-19 09:23:29', '2025-03-19 09:23:29'),
(9, 13, 0, 'Georgina Elizabeth', 'CAMERON', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-03-19 09:23:56', '2025-03-19 09:23:56'),
(10, 14, 0, 'Mark Harold', 'LAYZELL', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-03-19 09:25:45', '2025-03-19 09:25:45'),
(11, 15, 0, 'Amanda Penelope', 'LAYZELL', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-03-19 09:26:30', '2025-03-19 09:26:30'),
(12, 16, 0, 'Bartosz', 'MACKIEWICZ', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-03-19 15:10:22', '2025-03-19 15:10:22'),
(13, 17, 0, 'Cecily Hania', 'MULLINS', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-03-19 16:08:17', '2025-03-19 16:08:17'),
(15, 19, 0, 'd', 'dd', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-03-26 13:55:33', '2025-03-27 05:38:55'),
(27, 26, 0, 'Kirby', 'JAMA', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-03-27 14:19:34', '2025-03-27 14:19:34'),
(16, 20, 0, 'test', 'test', '', '', '+44', '', '+44', '', NULL, '0', '2025-03-26 13:59:11', '2025-03-26 13:59:11'),
(17, 20, 0, 'test', 'test', '', '', '+44', '', '+44', '', NULL, '0', '2025-03-26 13:59:11', '2025-03-26 13:59:11'),
(18, 20, 0, 'test', 'test', '', '', '+44', '', '+44', '', NULL, '0', '2025-03-26 13:59:11', '2025-03-26 13:59:11'),
(19, 21, 0, 'Ritesh Patil', 'test', 'vikaspnpinfotech@gmail.com', NULL, '+44', '8745658925', NULL, NULL, '', '0', '2025-03-26 13:59:24', '2025-03-26 14:01:31'),
(20, 22, 0, 'set', 'test', 'vikaspnpinfotech@gmail.com', NULL, '+44', '8745658925', NULL, NULL, '', '0', '2025-03-26 13:59:35', '2025-03-26 14:01:43'),
(21, 23, 0, 'test', 'test', '', '', '+44', '', '+44', '', NULL, '0', '2025-03-26 13:59:53', '2025-03-26 13:59:53'),
(22, 24, 0, 'Vikas ', 'Patel', '', '', '+44', '', '+44', '', NULL, '0', '2025-03-26 14:00:14', '2025-03-26 14:00:14'),
(23, 24, 0, 'Ritesh ', 'test', '', '', '+44', '', '+44', '', NULL, '0', '2025-03-26 14:00:14', '2025-03-26 14:00:14'),
(24, 25, 0, 'Vikas ', 'Patel', '', '', '+44', '', '+44', '', NULL, '0', '2025-03-26 14:00:42', '2025-03-26 14:00:42'),
(26, 20, 0, 'Ankit1', 'Bhagat', '', '', '+44', '', '+44', '', NULL, '0', '2025-03-26 14:01:12', '2025-03-26 14:01:12'),
(28, 27, 0, 'vikas', 'Patel', 'vikaspnpinfotech@gmail.com', NULL, '+44', '07932337282', NULL, NULL, '4 St Giles Workshops Baileys Hill, Wimborne St. Giles, Wimborne, Dorset, England, BH21 5NE', '0', '2025-03-27 14:20:24', '2025-03-27 14:47:11'),
(29, 28, 0, 'Vikas', 'patel', '', '', '+44', '', '+44', '', NULL, '0', '2025-03-27 14:46:46', '2025-03-27 14:46:46'),
(30, 28, 0, 'Vikas ', 'patel', '', '', '+44', '', '+44', '', NULL, '0', '2025-03-27 14:46:46', '2025-03-27 14:46:46'),
(31, 29, 0, 'Vikas ', 'Patel', 'vikasptl17@gmail.com', NULL, '+44', '07932337282', NULL, NULL, '', '0', '2025-03-27 14:47:54', '2025-03-27 14:48:05'),
(32, 30, 0, 'Vikas', 'patel', 'vikaspnpinfotech@gmail.com', NULL, '+44', '8745658925', NULL, NULL, '', '0', '2025-03-27 14:48:45', '2025-03-27 14:49:02'),
(33, 31, 0, 'Amit', 'Agarwal', 'amit@outbooks.com', NULL, '+44', '03300578597', NULL, NULL, '', '0', '2025-03-29 13:52:16', '2025-03-29 13:52:16'),
(34, 32, 0, 'test', 'test', '', '', '+44', '', '+44', '', NULL, '0', '2025-03-30 14:13:18', '2025-03-30 14:13:18'),
(35, 33, 0, 'Bharath Kumar', 'MAHESH', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-03-30 14:20:56', '2025-03-30 14:20:56'),
(36, 34, 0, 'Ijeoma', 'ACHARA', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-03-30 14:22:30', '2025-03-30 14:22:30'),
(37, 35, 0, 'Bruce Mactavish', 'HEPBURN', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-03-30 14:29:41', '2025-03-30 14:29:41'),
(38, 36, 0, 'David', 'RING', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-03-30 14:35:32', '2025-03-30 14:35:32'),
(39, 37, 2, 'Daniel', 'Gibbs', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-04-01 09:57:54', '2025-04-01 09:57:54'),
(40, 38, 5, 'Martin', 'SANDERSON', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-04-01 12:16:15', '2025-04-01 12:16:15'),
(41, 39, 0, 'Vikas', 'Patel', '', NULL, '+44', '', NULL, NULL, '', '0', '2025-04-03 14:49:22', '2025-04-03 14:49:22'),
(42, 40, 4, 'Terence', 'FRANKA', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-04-07 14:24:05', '2025-04-07 14:24:05'),
(43, 41, 5, 'Clarita', 'SEVILLA', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-04-07 14:56:19', '2025-04-07 14:56:19'),
(44, 42, 5, 'James', 'Fields', 'james.fields@fieldsluxury.london', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-04-11 05:57:21', '2025-04-11 05:57:21'),
(45, 43, 0, 's', 's', '', NULL, '+44', '', NULL, NULL, 's', '0', '2025-04-17 06:13:46', '2025-04-17 06:13:46'),
(46, 44, 5, 'Gaynor Antigha', 'BASSEY', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-04-17 16:33:03', '2025-04-17 16:33:03'),
(47, 45, 5, 'BURNESS PAULL LLP', 'ew', 'vikas@gmail.com', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-04-17 16:34:53', '2025-04-17 16:34:53'),
(48, 46, 5, 'Alexander Ferdinand', 'WILLI', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-05-02 12:50:25', '2025-05-02 12:50:25'),
(49, 47, 5, 'Jayne', 'GRIMES', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-05-26 10:13:19', '2025-05-26 10:13:19'),
(50, 48, 0, 'ss', 's', '', NULL, '+44', '2777777777', NULL, NULL, '', '0', '2025-05-26 10:40:37', '2025-05-26 10:40:37'),
(51, 49, 0, 'd', 'd', '', NULL, '+44', '', NULL, NULL, '', '0', '2025-05-26 11:49:59', '2025-05-26 11:49:59'),
(52, 50, 5, 'Jayne', 'GRIMES', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-05-26 12:56:17', '2025-05-26 12:56:17'),
(53, 51, 5, 'test', 'patel', '', '', '+44', '', '+44', '', NULL, '0', '2025-06-26 12:59:20', '2025-06-26 12:59:20'),
(54, 51, 5, 'test', 'test', '', '', '+44', '', '+44', '', NULL, '0', '2025-06-26 12:59:20', '2025-06-26 12:59:20'),
(55, 52, 5, 'Dominic James', 'HEARTH', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-07-10 11:39:46', '2025-07-10 11:39:46'),
(56, 53, 0, 'test', 'patel', '', NULL, '+44', '', NULL, NULL, '', '0', '2025-07-10 11:46:03', '2025-07-10 11:46:03'),
(57, 54, 0, 'Vikas ', 'Patel', '', NULL, '+44', '', NULL, NULL, '', '0', '2025-07-12 10:33:54', '2025-07-12 10:33:54'),
(58, 55, 5, 'Mark David Scott', 'ANDREWS', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-07-12 13:40:27', '2025-07-12 13:40:27'),
(59, 56, 5, 'Colin Charles George', 'WATSON', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-07-12 14:40:15', '2025-07-12 14:40:15'),
(60, 57, 5, 'Vikas ', 'test', '', '', '+44', '', '+44', '', NULL, '0', '2025-07-16 14:06:45', '2025-07-16 14:06:45'),
(61, 58, 5, 'Simon', 'HARVEY', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-07-24 16:13:09', '2025-07-24 16:13:09'),
(62, 59, 5, 'Olasunkanmi Jide', 'OJO', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-07-24 16:23:15', '2025-07-24 16:23:15'),
(63, 60, 5, 'Vikas', 'test', '', '', '+44', '', '+44', '', NULL, '0', '2025-08-01 14:02:11', '2025-08-01 14:02:11'),
(64, 60, 5, 'vikas', 'Yadav', '', '', '+44', '', '+44', '', NULL, '0', '2025-08-01 14:02:11', '2025-08-01 14:02:11'),
(65, 61, 5, 'Kenneth John', 'TOMLINSON', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-08-01 14:05:16', '2025-08-01 14:05:16'),
(66, 62, 5, 'MOURANT SECRETARIES (JERSEY) LIMITED', 'ANDREWS', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-08-01 15:00:29', '2025-08-01 15:00:29'),
(67, 63, 5, 'Mark Francis', 'NEWMAN', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-08-05 13:45:00', '2025-08-05 13:45:00'),
(68, 64, 5, 'Bahram', 'QADRI', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-08-11 14:51:42', '2025-08-11 14:51:42'),
(69, 65, 5, 'Peremakumar', 'THURAISINGAM', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-08-11 15:22:03', '2025-08-11 15:22:03'),
(70, 66, 5, 'vikas', 'false', '', '', '+44', '', '+44', '', NULL, '0', '2025-08-12 13:51:29', '2025-08-12 13:51:29'),
(71, 67, 5, 'Minna', 'AILA', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-08-12 13:57:57', '2025-08-12 13:57:57'),
(72, 68, 5, 'Joshua Luke', 'PETERS', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-08-13 14:59:01', '2025-08-13 14:59:01'),
(73, 69, 0, 'Ritesh ', 'patel', '', NULL, '+44', '', NULL, NULL, '', '0', '2025-08-13 15:23:50', '2025-08-13 15:23:50'),
(74, 70, 0, 'Vikas ', 'test', '', NULL, '+44', '', NULL, NULL, '', '0', '2025-08-13 15:33:47', '2025-08-13 15:33:47'),
(75, 71, 5, 'Vikas', 'Yadav', '', '', '+44', '', '+44', '', NULL, '0', '2025-08-13 15:37:16', '2025-08-13 15:37:16'),
(76, 72, 0, 'test sole', 'sole', '', NULL, '+44', '', NULL, NULL, '', '0', '2025-08-20 12:03:57', '2025-08-20 12:03:57'),
(77, 73, 5, 'test', 'test', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-08-20 12:21:49', '2025-08-20 12:21:49'),
(78, 74, 5, 're', 're', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-08-20 12:49:36', '2025-08-20 12:49:36'),
(79, 75, 5, 're', 're', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-08-20 12:53:16', '2025-08-20 12:53:16'),
(80, 76, 5, 're', 're', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-08-20 12:55:13', '2025-08-20 12:55:13'),
(81, 77, 5, 'v', 'v', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-08-20 13:01:33', '2025-08-20 13:01:33'),
(82, 78, 5, 'v', 'v', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-08-20 13:05:34', '2025-08-20 13:05:34'),
(83, 79, 5, 'test', 'test', '', '', '+44', '', '+44', '', NULL, '0', '2025-08-20 13:14:08', '2025-08-20 13:14:08'),
(84, 79, 5, 'test', 'test', '', '', '+44', '', '+44', '', NULL, '0', '2025-08-20 13:14:08', '2025-08-20 13:14:08'),
(85, 80, 5, 'John', 'HENDERSON', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-08-23 13:04:10', '2025-08-23 13:04:10'),
(86, 81, 5, 'Paige', 'SELLWAY', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-09-04 14:13:44', '2025-09-04 14:13:44'),
(87, 82, 5, 'Peremakumar', 'ANDREWS', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-09-22 15:13:02', '2025-09-22 15:13:02'),
(88, 83, 5, 'Kathryn Elizabeth', 'FLEMING', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-09-27 12:59:36', '2025-09-27 12:59:36'),
(89, 84, 5, 'test', 'test', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-10-04 13:24:03', '2025-10-04 13:24:03');

-- --------------------------------------------------------

--
-- Table structure for table `client_documents`
--

CREATE TABLE `client_documents` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_type` text NOT NULL,
  `file_size` int(11) NOT NULL,
  `web_url` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `client_documents`
--

INSERT INTO `client_documents` (`id`, `client_id`, `file_name`, `original_name`, `file_type`, `file_size`, `web_url`, `created_at`, `updated_at`) VALUES
(1, 37, '1729316168785-Activity.PNG', 'Activity.PNG', 'image/png', 54446, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST81_CLIENT37/Activity.PNG', '2025-04-02 13:22:34', '2025-04-02 13:22:34'),
(2, 50, '1748521695714-TimeSheetData (7).csv', 'TimeSheetData (7).csv', 'text/csv', 223, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/_layouts/15/Doc.aspx?sourcedoc=%7B249A2C49-3D38-4C43-8318-FA3F8035AE3F%7D&file=TimeSheetData%20(7).csv&action=default&mobileredirect=true', '2025-05-29 13:42:56', '2025-05-29 13:42:56');

-- --------------------------------------------------------

--
-- Table structure for table `client_industry_types`
--

CREATE TABLE `client_industry_types` (
  `id` int(11) NOT NULL,
  `business_type` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `client_industry_types`
--

INSERT INTO `client_industry_types` (`id`, `business_type`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Restaurant/Hotel/Bar/Travel/Hospitality', '1', '2024-10-22 10:14:57', '2024-10-22 22:13:57'),
(2, 'Construction/Development', '1', '2024-10-22 22:14:12', '2024-10-22 22:14:12'),
(3, 'Rental (Property)', '1', '2024-10-22 22:14:27', '2024-10-22 22:14:43'),
(4, 'Home Services / Construction Trade', '1', '2024-10-22 22:15:01', '2024-10-22 22:15:01'),
(5, 'Professional/IT/Marketing/Lawyer/Advisory', '1', '2024-10-22 22:15:41', '2024-10-22 22:15:41'),
(6, 'E-commerce/Retailer/Trading', '1', '2024-10-22 22:15:58', '2024-10-22 22:15:58'),
(7, 'Manufacturing/Logistics', '1', '2024-10-22 22:16:51', '2024-10-22 22:16:51'),
(8, 'Holding Company', '1', '2024-10-22 22:17:00', '2024-10-22 22:17:00'),
(9, 'Software As A Service', '1', '2024-10-22 22:17:45', '2024-10-22 22:17:45'),
(10, 'Other', '1', '2024-10-22 22:17:53', '2024-10-22 22:17:53');

-- --------------------------------------------------------

--
-- Table structure for table `client_job_task`
--

CREATE TABLE `client_job_task` (
  `id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `checklist_id` int(11) DEFAULT NULL,
  `task_id` int(11) NOT NULL,
  `task_status` int(11) DEFAULT NULL,
  `time` time DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `client_job_task`
--

INSERT INTO `client_job_task` (`id`, `job_id`, `client_id`, `checklist_id`, `task_id`, `task_status`, `time`, `created_at`, `updated_at`) VALUES
(2, 4, 27, NULL, 7, NULL, '01:00:00', '2025-03-29 14:03:44', '2025-03-29 14:03:44'),
(3, 5, 33, NULL, 2, NULL, '11:22:00', '2025-03-30 14:23:38', '2025-03-30 14:23:38'),
(4, 6, 36, NULL, 8, NULL, '11:22:00', '2025-03-30 14:35:52', '2025-03-30 14:35:52'),
(5, 7, 7, NULL, 9, NULL, '08:30:00', '2025-03-31 06:13:45', '2025-03-31 06:13:45'),
(6, 8, 6, NULL, 10, NULL, '08:00:00', '2025-03-31 06:15:16', '2025-03-31 06:15:16'),
(7, 9, 16, NULL, 11, NULL, '20:00:00', '2025-03-31 06:51:23', '2025-03-31 06:51:23'),
(8, 10, 2, NULL, 12, NULL, '16:00:00', '2025-03-31 13:55:55', '2025-03-31 13:55:55'),
(9, 11, 37, NULL, 13, NULL, '10:00:00', '2025-04-01 09:59:55', '2025-04-01 09:59:55'),
(10, 12, 38, NULL, 14, NULL, '15:00:00', '2025-04-01 12:19:06', '2025-04-01 12:19:06'),
(11, 13, 39, NULL, 15, NULL, '10:00:00', '2025-04-03 14:50:05', '2025-04-03 14:50:05'),
(12, 14, 16, NULL, 16, NULL, '01:01:00', '2025-04-03 15:35:29', '2025-04-03 15:35:29'),
(15, 15, 40, NULL, 18, NULL, '10:30:00', '2025-04-07 14:25:01', '2025-04-07 14:25:01'),
(14, 15, 40, NULL, 18, NULL, '10:30:00', '2025-04-07 14:24:36', '2025-04-07 14:24:36'),
(16, 20, 50, NULL, 20, NULL, '01:00:00', '2025-06-10 16:05:39', '2025-06-10 16:05:39'),
(17, 21, 51, NULL, 21, NULL, '01:00:00', '2025-06-26 13:01:40', '2025-06-26 13:01:40'),
(18, 22, 52, NULL, 22, NULL, '11:22:00', '2025-07-10 11:40:46', '2025-07-10 11:40:46'),
(19, 23, 53, NULL, 22, NULL, '11:30:00', '2025-07-10 11:48:37', '2025-07-10 11:48:37'),
(20, 23, 53, NULL, 22, NULL, '11:30:00', '2025-07-10 11:48:50', '2025-07-10 11:48:50'),
(21, 23, 53, NULL, 22, NULL, '11:30:00', '2025-07-10 11:48:52', '2025-07-10 11:48:52'),
(22, 22, 52, NULL, 22, NULL, '11:22:00', '2025-07-10 11:49:19', '2025-07-10 11:49:19'),
(23, 24, 34, NULL, 2, NULL, '11:22:00', '2025-07-10 14:04:53', '2025-07-10 14:04:53'),
(24, 24, 34, NULL, 2, NULL, '11:22:00', '2025-07-10 14:07:21', '2025-07-10 14:07:21'),
(25, 25, 52, NULL, 25, NULL, '02:00:00', '2025-07-10 14:22:14', '2025-07-10 14:22:14'),
(26, 25, 52, NULL, 24, NULL, '10:30:00', '2025-07-10 14:22:14', '2025-07-10 14:22:14'),
(27, 25, 52, NULL, 23, NULL, '11:22:00', '2025-07-10 14:22:14', '2025-07-10 14:22:14'),
(28, 26, 55, NULL, 20, NULL, '01:00:00', '2025-07-12 13:43:25', '2025-07-12 13:43:25'),
(29, 26, 55, NULL, 5, NULL, '01:27:00', '2025-07-12 13:43:25', '2025-07-12 13:43:25'),
(30, 27, 55, NULL, 27, NULL, '11:22:00', '2025-07-12 13:46:36', '2025-07-12 13:46:36'),
(34, 27, 55, NULL, 27, NULL, '11:22:00', '2025-07-12 14:10:39', '2025-07-12 14:10:39'),
(33, 27, 55, NULL, 27, 3, '11:22:00', '2025-07-12 14:01:22', '2025-07-12 14:03:21'),
(35, 28, 56, NULL, 16, NULL, '01:00:00', '2025-07-12 14:40:54', '2025-07-12 14:40:54'),
(36, 28, 56, NULL, 20, NULL, '01:00:00', '2025-07-12 14:40:54', '2025-07-12 14:40:54'),
(37, 29, 56, NULL, 25, NULL, '01:01:00', '2025-07-23 14:00:45', '2025-07-23 14:00:45'),
(38, 29, 56, NULL, 15, NULL, '02:00:00', '2025-07-23 14:00:45', '2025-07-23 14:00:45'),
(39, 34, 59, NULL, 63, NULL, '01:00:00', '2025-07-24 16:23:59', '2025-07-24 16:23:59'),
(40, 35, 60, NULL, 25, NULL, '12:33:00', '2025-08-01 14:03:51', '2025-08-01 14:03:51'),
(41, 35, 60, NULL, 24, NULL, '04:04:00', '2025-08-01 14:03:51', '2025-08-01 14:03:51'),
(42, 37, 62, NULL, 64, NULL, '01:03:00', '2025-08-01 15:01:15', '2025-08-01 15:01:15'),
(43, 37, 62, NULL, 64, NULL, '01:03:00', '2025-08-01 15:02:05', '2025-08-01 15:02:05'),
(44, 40, 63, NULL, 65, NULL, '01:02:00', '2025-08-05 13:46:29', '2025-08-05 13:46:29'),
(45, 41, 63, NULL, 66, NULL, '01:01:00', '2025-08-05 13:51:04', '2025-08-05 13:51:04'),
(46, 43, 65, NULL, 67, NULL, '01:00:00', '2025-08-11 15:23:39', '2025-08-11 15:23:39'),
(47, 44, 66, NULL, 68, NULL, '01:00:00', '2025-08-12 13:52:39', '2025-08-12 13:52:39'),
(48, 45, 68, NULL, 69, NULL, '01:00:00', '2025-08-13 14:59:54', '2025-08-13 14:59:54'),
(49, 45, 68, NULL, 69, NULL, '01:00:00', '2025-08-13 15:04:21', '2025-08-13 15:04:21'),
(50, 49, 68, NULL, 70, NULL, '01:01:00', '2025-08-14 05:06:56', '2025-08-14 05:06:56'),
(53, 50, 72, NULL, 4, NULL, '02:02:00', '2025-08-20 12:14:50', '2025-08-20 12:14:50'),
(52, 50, 72, NULL, 4, NULL, '02:02:00', '2025-08-20 12:13:54', '2025-08-20 12:13:54'),
(54, 57, 77, NULL, 71, NULL, '01:01:00', '2025-08-20 13:02:21', '2025-08-20 13:02:21'),
(55, 59, 79, NULL, 72, NULL, '01:01:00', '2025-08-20 13:16:03', '2025-08-20 13:16:03'),
(56, 59, 79, NULL, 72, NULL, '01:01:00', '2025-08-20 13:23:29', '2025-08-20 13:23:29'),
(57, 59, 79, NULL, 72, NULL, '01:01:00', '2025-08-20 13:24:22', '2025-08-20 13:24:22'),
(58, 59, 79, NULL, 72, NULL, '01:01:00', '2025-08-20 13:29:26', '2025-08-20 13:29:26'),
(59, 59, 79, NULL, 72, NULL, '01:01:00', '2025-08-20 13:31:03', '2025-08-20 13:31:03'),
(60, 59, 79, NULL, 72, NULL, '01:01:00', '2025-08-20 13:32:11', '2025-08-20 13:32:11'),
(61, 59, 79, NULL, 72, NULL, '01:01:00', '2025-08-20 13:39:12', '2025-08-20 13:39:12'),
(62, 59, 79, NULL, 72, NULL, '01:01:00', '2025-08-20 13:39:50', '2025-08-20 13:39:50'),
(63, 59, 79, NULL, 72, NULL, '01:01:00', '2025-08-20 13:42:39', '2025-08-20 13:42:39'),
(64, 59, 79, NULL, 72, NULL, '01:01:00', '2025-08-20 13:43:17', '2025-08-20 13:43:17'),
(65, 59, 79, NULL, 72, NULL, '01:01:00', '2025-08-20 13:53:10', '2025-08-20 13:53:10'),
(66, 59, 79, NULL, 72, NULL, '01:01:00', '2025-08-20 13:54:52', '2025-08-20 13:54:52'),
(67, 59, 79, NULL, 72, NULL, '01:01:00', '2025-08-20 13:55:46', '2025-08-20 13:55:46'),
(68, 59, 79, NULL, 72, NULL, '01:01:00', '2025-08-20 13:57:31', '2025-08-20 13:57:31'),
(69, 59, 79, NULL, 72, NULL, '01:01:00', '2025-08-20 13:58:20', '2025-08-20 13:58:20'),
(70, 61, 80, NULL, 73, NULL, '01:01:00', '2025-08-23 13:05:47', '2025-08-23 13:05:47'),
(71, 62, 80, NULL, 74, NULL, '01:00:00', '2025-08-23 13:06:37', '2025-08-23 13:06:37'),
(72, 63, 81, NULL, 75, NULL, '01:00:00', '2025-09-04 14:14:15', '2025-09-04 14:14:15'),
(73, 66, 82, NULL, 77, NULL, '01:00:00', '2025-09-23 15:23:58', '2025-09-23 15:23:58'),
(74, 74, 83, NULL, 111, NULL, '03:20:00', '2025-10-04 11:34:40', '2025-10-04 11:34:57'),
(75, 75, 84, NULL, 113, NULL, '01:02:00', '2025-10-04 13:28:24', '2025-10-04 13:28:24'),
(76, 75, 84, NULL, 112, NULL, '01:02:00', '2025-10-04 13:28:24', '2025-10-04 13:28:24'),
(77, 76, 84, NULL, 112, NULL, '01:02:00', '2025-10-04 13:32:38', '2025-10-04 13:32:38'),
(78, 77, 84, NULL, 101, NULL, '01:00:00', '2025-10-06 10:45:10', '2025-10-06 10:45:10'),
(79, 77, 84, NULL, 102, NULL, '02:00:00', '2025-10-06 10:45:35', '2025-10-06 10:45:35'),
(80, 77, 84, NULL, 103, NULL, '04:00:00', '2025-10-06 10:45:35', '2025-10-06 10:45:35'),
(81, 78, 84, NULL, 107, NULL, '01:01:00', '2025-10-06 12:33:37', '2025-10-06 12:33:37'),
(82, 79, 84, NULL, 99, NULL, '01:00:00', '2025-10-09 07:17:51', '2025-10-09 07:17:51'),
(83, 80, 1, NULL, 74, NULL, '02:20:00', '2025-10-25 06:10:58', '2025-10-25 06:10:58'),
(84, 80, 1, NULL, 29, NULL, '03:30:00', '2025-10-25 06:10:58', '2025-10-25 06:10:58'),
(85, 81, 84, NULL, 107, NULL, '01:01:00', '2025-10-25 10:58:51', '2025-10-25 10:58:51'),
(86, 81, 84, NULL, 106, NULL, '00:30:00', '2025-10-25 10:58:51', '2025-10-25 10:58:51'),
(87, 56, 74, NULL, 68, NULL, '01:00:00', '2025-10-25 12:18:37', '2025-10-25 12:18:37'),
(88, 82, 75, NULL, 68, NULL, '01:00:00', '2025-10-25 13:19:47', '2025-10-25 13:19:47');

-- --------------------------------------------------------

--
-- Table structure for table `client_trustee_contact_details`
--

CREATE TABLE `client_trustee_contact_details` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `role` int(11) NOT NULL DEFAULT 0,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `alternate_email` varchar(100) DEFAULT NULL,
  `phone_code` varchar(6) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `alternate_phone_code` varchar(6) DEFAULT NULL,
  `alternate_phone` varchar(20) DEFAULT NULL,
  `residential_address` text DEFAULT NULL,
  `authorised_signatory_status` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: off, 1: on',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `client_trustee_contact_details`
--

INSERT INTO `client_trustee_contact_details` (`id`, `client_id`, `role`, `first_name`, `last_name`, `email`, `alternate_email`, `phone_code`, `phone`, `alternate_phone_code`, `alternate_phone`, `residential_address`, `authorised_signatory_status`, `created_at`, `updated_at`) VALUES
(1, 23, 0, 'test', 'test', '', '', '+44', '', '+44', '', NULL, '0', '2025-03-26 13:59:53', '2025-03-26 13:59:53'),
(2, 25, 0, 'Ritesh ', 'Yadav', '', '', '+44', '', '+44', '', NULL, '0', '2025-03-26 14:00:42', '2025-03-26 14:00:42'),
(4, 57, 5, 'null', 'null', '', '', '+44', '', '+44', '', NULL, '0', '2025-07-16 14:06:45', '2025-07-16 14:06:45'),
(5, 66, 5, 'vikas', 'null', '', '', '+44', '', '+44', '', NULL, '0', '2025-08-12 13:51:29', '2025-08-12 13:51:29'),
(6, 71, 5, 'test', 'Yadav', '', '', '+44', '', '+44', '', NULL, '0', '2025-08-13 15:37:16', '2025-08-13 15:37:16');

-- --------------------------------------------------------

--
-- Table structure for table `client_types`
--

CREATE TABLE `client_types` (
  `id` int(11) NOT NULL,
  `type` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `client_types`
--

INSERT INTO `client_types` (`id`, `type`, `status`, `created_at`, `updated_at`) VALUES
(1, 'SoleTrader', '1', '2024-06-27 10:48:40', '2024-06-27 10:48:40'),
(2, 'Company', '1', '2024-06-27 10:48:40', '2024-06-27 10:48:40'),
(3, 'Partnership', '1', '2024-06-27 10:48:40', '2024-06-27 10:48:40'),
(4, 'Individual', '1', '2024-06-27 10:48:40', '2024-06-27 10:48:40'),
(5, 'Charity Incorporated Organisation', '1', '2025-01-23 10:12:13', '2025-01-23 10:12:13'),
(6, 'Charity Unincorporated Association', '1', '2025-01-23 10:12:13', '2025-03-30 11:41:56'),
(7, 'Trust', '1', '2025-01-23 10:12:13', '2025-01-23 10:12:13');

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `code` varchar(10) NOT NULL,
  `currency` varchar(50) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `name`, `code`, `currency`, `status`, `created_at`, `updated_at`) VALUES
(1, 'United Kingdom', '+44', 'GBP', '1', '2024-06-29 06:07:35', '2024-11-09 09:23:08'),
(2, 'Ireland', '+353', 'EUR', '1', '2024-11-09 09:23:42', '2024-11-09 09:23:42'),
(3, 'Australia', '+63', 'AUD', '1', '2024-11-09 09:23:56', '2024-11-09 09:23:56'),
(5, 'India', '+91', 'INR', '1', '2025-01-04 17:54:09', '2025-01-04 17:54:09');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `customer_type` enum('1','2','3') NOT NULL DEFAULT '1' COMMENT '1: SoleTrader, 2: Company , 3:Partnership',
  `staff_id` int(11) NOT NULL,
  `account_manager_id` int(11) NOT NULL COMMENT 'Only staff members who are account managers',
  `trading_name` varchar(255) NOT NULL,
  `customer_code` varchar(100) NOT NULL,
  `trading_address` longtext DEFAULT NULL,
  `vat_registered` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: yes',
  `vat_number` varchar(20) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `customerJoiningDate` date DEFAULT NULL,
  `customerSource` int(11) DEFAULT NULL,
  `customerSubSource` int(11) DEFAULT NULL,
  `form_process` enum('0','1','2','3','4') NOT NULL DEFAULT '0' COMMENT '0: Pending All, 1: Customer Information Complete ,2: Services Complete ,3:Engagement Model Complete ,4:Paper Work Complete',
  `notes` longtext DEFAULT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `customer_type`, `staff_id`, `account_manager_id`, `trading_name`, `customer_code`, `trading_address`, `vat_registered`, `vat_number`, `website`, `customerJoiningDate`, `customerSource`, `customerSubSource`, `form_process`, `notes`, `status`, `created_at`, `updated_at`) VALUES
(1, '2', 1, 30, 'BISHOPS DAL ENERGY STORAGE LIMITED_00001', '00001', 'Beaufort Court, Egg Farm Lane, Kings Langley, Hertfordshire, United Kingdom, WD4 8LR', '0', '', '', '2025-02-10', 7, 10, '4', '', '1', '2025-02-10 14:03:38', '2025-04-07 14:57:23'),
(2, '2', 7, 10, 'TAG ACCOUNTANTS GROUP LIMITED (Copia)_00002', '00002', '8 Pendeford Place, Pendeford Business Park, Wolverhampton, West Midlands, United Kingdom, WV9 5HD', '0', '', '', '2025-03-17', 13, 4, '4', '', '1', '2025-03-17 09:40:24', '2025-09-25 14:24:09'),
(9, '2', 10, 10, 'GOWER ACCOUNTANCY & TAX ADVISORY SERVICES LTD_00007', '00007', 'Unit 47a Crofty Industrial Estate, Penclawdd, Swansea, Wales, SA4 3RS', '0', '', '', '2005-01-17', 13, 14, '4', '', '1', '2025-03-17 10:53:29', '2025-03-17 10:56:04'),
(12, '2', 15, 15, 'FM ACCOUNTING LTD', '00008', '1 Blenheim Court, Suite 22, Peppercorn Close, Peterborough, England, PE1 2DU', '0', '', '', '2020-07-01', 13, 4, '4', '', '1', '2025-03-17 14:07:00', '2025-03-17 14:11:10'),
(13, '2', 55, 11, '321ACCOUNTS LTD', '00009', '152 Coles Green Road, London, NW2 7HD', '0', '', '', '2023-10-10', 1, 1, '4', '', '1', '2025-03-18 08:48:46', '2025-03-18 15:20:48'),
(6, '2', 46, 47, 'LD ACCOUNTING AND BUSINESS SERVICES LTD_00006', '00006', '9 Whitebeam Close, Kempston, Bedford, England, MK42 7RN', '0', '', '', '2024-01-08', 13, 4, '4', '', '1', '2025-03-17 10:31:21', '2025-03-17 10:33:52'),
(23, '2', 55, 15, 'BLENHEIM PARTNERS LIMITED_000014', '000014', 'Cedar Court 221 Hagley Road, Hayley Green, Halesowen, West Midlands, B63 1ED', '0', '', '', '2023-08-01', 1, 2, '4', '', '1', '2025-03-18 11:51:48', '2025-03-18 11:55:47'),
(22, '2', 55, 10, 'BERKO WEALTH LTD. _000013', '000013', '38 Nye Bevan Estate, London, United Kingdom, E5 0AG', '0', '', '', '2019-11-12', 1, 2, '4', '', '1', '2025-03-18 11:12:27', '2025-09-25 14:24:09'),
(21, '2', 50, 50, 'Clear Group_000012', '000012', 'Limestone House, 20 Drogheda Street, Balbriggan, Dublin, Ireland', '1', '', '', '2025-03-18', 12, 5, '4', '', '1', '2025-03-18 11:00:03', '2025-03-18 11:26:13'),
(20, '2', 55, 52, 'AXADA LTD_000011', '000011', '483 Green Lanes, London, United Kingdom, N13 4BS', '0', '', '', '2019-06-25', 1, 3, '4', '', '1', '2025-03-18 10:51:29', '2025-03-20 09:42:13'),
(19, '2', 55, 39, 'BAANX GROUP LTD_000010', '000010', '96 Pavilion Office, Kensington High Street, London, United Kingdom, W8 4SG', '0', '', '', '2024-03-22', 1, 3, '4', '', '1', '2025-03-18 10:32:23', '2025-03-18 10:42:40'),
(24, '2', 55, 46, 'BPC PARTNERS LIMITED_000015', '000015', '3 Royal Crescent, Cheltenham, Gloucestershire, United Kingdom, GL50 3DA', '0', '', '', '2022-08-16', 1, 1, '4', '', '1', '2025-03-18 12:08:22', '2025-03-18 12:12:23'),
(25, '2', 55, 14, 'CAMERON PARTNERSHIP LIMITED_000016', '000016', 'Suite 37 Chessington Business Centre, Cox Lane, Chessington, Surrey, KT9 1SD', '0', '', '', '2022-08-10', 13, 4, '4', '', '1', '2025-03-18 12:32:54', '2025-03-18 12:40:56'),
(31, '2', 55, 10, 'FIELDS LUXURY LIMITED', '000022', ' 2nd Floor Gadd House, Arcadia  Avenue, London, England, N3 2JU', '0', '', '', '2022-04-19', 1, 2, '4', '', '1', '2025-03-18 14:23:03', '2025-09-25 14:24:09'),
(72, '2', 8, 8, 'STRATOM CONSULTING LIMITED_000053', '000053', '85 Great Portland Street, First Floor, London, England, W1W 7LT', '0', '', '', '2025-01-10', 13, 4, '4', '', '1', '2025-03-20 07:07:40', '2025-03-20 07:08:45'),
(42, '2', 59, 59, 'MY TAX HELPER LTD', '000024', 'Office 10, 7 Throwley Way, Sutton, England, SM1 4AF', '0', '', 'https://mytaxhelper.co.uk/', '2025-03-19', 13, 4, '4', '', '1', '2025-03-19 03:22:10', '2025-03-19 03:39:23'),
(43, '2', 59, 59, 'ROBERT LEWIS, REDBOND, RUGGIERI & CO LIMITED_000025', '000025', 'Building 18, Gateway 1000 Whittle Way, Arlington Business Park, Stevenage, Hertfordshire, England, SG1 2FP', '0', '', '', NULL, NULL, NULL, '1', '', '1', '2025-03-19 03:41:12', '2025-03-19 03:41:12'),
(74, '2', 1, 30, 'FDSFGDSTXDGES LIMITED_000055', '000055', '2381, NI709505 - COMPANIES HOUSE DEFAULT ADDRESS, Belfast, BT1 9DY', '0', '', '', '2025-03-26', 12, 5, '4', '', '1', '2025-03-26 14:09:44', '2025-04-07 14:57:23'),
(75, '2', 1, 30, 'BIRMINGHAM CONNECTION LTD', '000056', '18 Manor House Lane, Birmingham, England, B26 1PG', '0', '', '', '2025-03-26', 8, 16, '4', '', '1', '2025-03-26 14:11:05', '2025-04-07 14:57:23'),
(76, '2', 93, 30, 'ASKL LTD', '000057', 'Flat 2 13 Thornhill Road, Croydon, England, CR0 2XZ', '1', '99999999', 'www.test.com', '2025-03-27', 8, 14, '4', '', '1', '2025-03-27 14:15:50', '2025-06-20 09:33:13'),
(77, '1', 93, 30, '43 AYLESFORD STREET LIMITED', '000058', '34 Merchant Plaza, Liverpool, L1 0AX, UK', '0', '', '', '2025-03-27', 7, 9, '4', '', '1', '2025-03-27 14:18:25', '2025-06-20 09:33:13'),
(78, '2', 36, 10, 'MEDICAL SICKNESS ANNUITY AND LIFE ASSURANCE SOCIETY LIMITED(THE)_000059', '000059', 'Colmore Circus Queensway, Birmingham, B4 6AR', '0', '', '', '2025-03-27', 12, 5, '4', '', '1', '2025-03-27 15:04:41', '2025-09-25 14:24:09'),
(79, '2', 34, 53, 'M LIMITED_000060', '000060', '99  Holly Avenue, Jesmond, Newcastle Upon Tyne, NE2 2QB', '0', '', '', '2025-03-27', 4, 6, '4', '', '1', '2025-03-27 15:43:41', '2025-07-10 14:49:59'),
(71, '2', 60, 60, 'ASTONIA ASSOCIATES LIMITED_000052', '000052', 'Business & Technology Centre, Bessemer Drive, Stevenage, Herts, England, SG1 2DX', '1', '284730387', '', '2024-03-01', 13, 4, '4', '', '1', '2025-03-19 15:03:31', '2025-03-19 15:06:07'),
(60, '2', 61, 61, 'FRYNANCE LIMITED_000041', '000041', 'Derek Ashton Court (Office 3), 77 Mottram Road, Stalybridge, England, SK15 2QP', '0', '', '', '2025-03-19', 13, 4, '4', '', '1', '2025-03-19 07:05:42', '2025-03-19 07:06:58'),
(73, '2', 1, 30, 'ANDREWS BUILDING SERVICES CONSULTING ENGINEERS LTD', '000054', 'Lightyear Building Suite 23 9 Marchburn Drive, Glasgow Airport Business Park, Paisley, Scotland, PA3 2SJ', '0', '', '', '2025-03-26', 13, 4, '4', '', '1', '2025-03-26 13:53:59', '2025-04-07 14:57:23'),
(53, '2', 61, 61, 'RLA (CAMBS) LTD', '000034', 'Building 18, Gateway 1000 Whittle Way, Arlington Business Park, Stevenage, Hertfordshire, England, SG1 2FP', '1', '', '', '2021-12-20', 13, 4, '4', '', '1', '2025-03-19 06:59:24', '2025-03-19 07:07:36'),
(80, '2', 1, 112, 'ANTICUS RECRUITMENT LTD_000061', '000061', '24a Market Street, Disley, Stockport, England, SK12 2AA', '0', '', '', '2025-03-30', 7, 10, '4', '', '1', '2025-03-30 14:34:09', '2025-09-25 14:25:01'),
(81, '2', 7, 10, 'OPTIMISE ACCOUNTANTS LIMITED_000062', '000062', 'Office 15 Bramley House 2a, Bramley Road, Long Eaton, Nottinghamshire, United Kingdom, NG10 3SX', '0', '', '', '2025-04-01', 13, 4, '4', '', '1', '2025-04-01 09:51:02', '2025-09-25 14:24:09'),
(82, '2', 34, 30, 'ADVANCED HOUSING ENGINEERING UA LTD_000063', '000063', 'Suite A-82 James Carter Rd, Mildenhall, Bury St. Edmunds, England, IP28 7DE', '0', '', '', '2025-04-03', 1, 3, '4', '', '1', '2025-04-03 14:46:21', '2025-04-07 14:57:23'),
(83, '2', 93, 30, 'ABBEY COURT FLATS MANAGEMENT COMPANY LIMITED_000064', '000064', 'Silver Carn, St. Marys, Isles Of Scilly, TR21 0NW', '0', '', '', '2025-04-07', 13, 4, '4', '', '1', '2025-04-07 14:22:41', '2025-06-20 09:33:13'),
(84, '1', 93, 99, 'CUST-TEST1', '000065', 'axc', '0', '', '', '2025-04-17', 13, 4, '4', '', '1', '2025-04-17 06:12:36', '2025-06-20 09:33:13'),
(85, '2', 93, 99, 'F TRADING COMPANY LIMITED_000066', '000066', 'Mandar House, 3rd Floor P.O Box 2196, Johnsons Ghut, Tortola, Virgin Islands, British', '0', '', '', '2025-04-17', 13, 4, '4', '', '1', '2025-04-17 06:13:12', '2025-06-20 09:33:13'),
(86, '2', 93, 30, 'AGMAN COCOA LIMITED_000067', '000067', 'Chadwick Court, 15 Hatfields, London, England, SE1 8DJ', '0', '', '', '2025-04-17', 13, 4, '4', '', '1', '2025-04-17 16:32:38', '2025-06-20 09:33:13'),
(87, '2', 93, 100, 'THE AFRICA DIALOGUES LTD_000068', '000068', '7 Bell Yard, London, England, WC2A 2JR', '0', '', '', '2025-04-17', 13, 4, '4', '', '1', '2025-04-17 16:34:21', '2025-06-20 09:33:13'),
(88, '2', 1, 88, 'AVIGNON CAPITAL FINANCIAL SERVICES LIMITED_000069', '000069', '73 Cornhill, London, United Kingdom, EC3V 3QQ', '0', '', '', '2025-05-02', 13, 4, '4', '', '1', '2025-05-02 12:48:51', '2025-05-02 12:49:01'),
(89, '2', 1, 88, 'F A B AUDIO VISUAL LIMITED', '000070', '85 Great Portland Street, First Floor, London, England, W1W 7LT', '0', '', '', '2025-05-23', 13, 4, '4', '', '1', '2025-05-23 07:03:27', '2025-05-23 07:03:36'),
(90, '2', 1, 60, 'THE AFRICA DIALOGUES LTD', '000071', '7 Bell Yard, London, England, WC2A 2JR', '0', '', '', '2025-05-26', 13, 4, '4', '', '1', '2025-05-26 10:11:29', '2025-05-26 10:11:49'),
(91, '2', 1, 61, 'THE GLOBAL DIALOGUES TRUST', '000072', '43  Herbert Gardens, London, NW10 3BX', '0', '', '', '2025-05-26', 8, 16, '4', '', '1', '2025-05-26 10:14:54', '2025-07-10 14:49:22'),
(92, '2', 1, 10, 'GE ACCOUNTANCY LTD', '000073', '4 Braithwaite, Shevington, Wigan, Lancashire, United Kingdom, WN6 8BP', '0', '', '', '2025-06-26', 12, 5, '4', '', '1', '2025-06-26 12:56:55', '2025-09-25 14:24:09'),
(93, '2', 1, 53, 'H. CAMPBELL LLC', '000074', '71 Glenview Drive, San Francisco, United States, 94131', '0', '', '', '2025-06-26', 13, 4, '4', '', '1', '2025-06-26 13:27:07', '2025-07-12 14:19:44'),
(94, '2', 36, 30, 'ATOMIC 42 LTD', '000075', 'Bankside 300 Peachman Way, Broadland Business Park, Norwich, Norfolk, United Kingdom, NR7 0LB', '0', '', '', '2025-07-10', 13, 4, '4', '', '1', '2025-07-10 11:36:40', '2025-07-10 14:16:32'),
(95, '1', 104, 53, '43 AYLESFORD STREET LIMITED test', '000076', '43 Aylesford Street, London, SW1V 3RY', '0', '', '', '2025-07-12', 12, 5, '4', '', '1', '2025-07-12 13:39:12', '2025-07-14 15:32:50'),
(96, '2', 103, 10, 'D01 PARKVIEW HOLDING LIMITED', '000077', 'Vistra Corporate Services Centre Wickhams Cay Ii, Road Town, Tortola, Vg1110, Virgin Islands, British', '0', '', '', '2025-07-12', 12, 5, '4', '', '1', '2025-07-12 14:17:51', '2025-09-25 14:24:09'),
(97, '3', 104, 53, 'Northbridge Trading Group12', '000078', '5 Thorncliffe Road, Keighley, England, BD22 6BY', '0', '', '', '2025-07-12', 13, 4, '4', '', '1', '2025-07-12 14:22:21', '2025-07-12 14:23:37'),
(98, '2', 80, 80, 'GG AEGON LTD', '000079', '9 Lanark Square, London, England, E14 9RE', '0', '', '', '2025-07-24', 12, 5, '4', '', '1', '2025-07-24 16:22:35', '2025-07-24 16:22:56'),
(99, '2', 1, 88, 'R ERWIN DESIGN ENGINEERING LTD', '000080', '36 Moss Road, Drumbo, Lisburn, Northern Ireland, BT27 5JT', '0', '', '', '2025-07-31', 13, 4, '4', '', '1', '2025-07-31 15:35:06', '2025-07-31 16:09:22'),
(100, '2', 52, 52, 'J & E PROPERTIES LIMITED', '000081', '12 Mount Havelock, Douglas, Isle Of Man, IM1 2QG', '0', '', '', '2025-08-01', 13, 4, '4', '', '1', '2025-08-01 14:01:24', '2025-08-01 14:01:45'),
(101, '2', 80, 80, 'AA EXPRESS LOGISTICS LTD', '000082', 'Unit 38b, The Enterprise Centre, Cranborne Road, Potters Bar, England, EN6 3DQ', '0', '', '', '2025-08-01', 13, 4, '4', '', '1', '2025-08-01 14:59:32', '2025-08-01 14:59:52'),
(102, '2', 60, 60, 'PARKVIEW ASSET MANAGEMENT BOLSOVER HEAD LTD', '000083', '35 Ballards Lane, London, United Kingdom, N3 1XW', '0', '', '', '2025-08-05', 13, 4, '4', '', '1', '2025-08-05 13:43:40', '2025-08-05 13:43:59'),
(103, '2', 48, 48, 'H PARKVIEW LTD', '000084', 'Leeward Building #2 Marcy Building C/O Amicorp B.V.I. Limited, 2nd Floor, Purcell Estate,, Road Town, Tortola, Virgin Islands, British, P.O.BOX 2416', '0', '', '', '2025-08-11', 13, 4, '4', '', '1', '2025-08-11 14:51:05', '2025-08-11 14:51:23'),
(104, '1', 48, 48, 'test for issues', '000085', 'Suite 202, Sunrise Business Tower, 45 Meadow Lane, Central Business District, Springfield, SP12 3AB, United Kingdomsfsdfffffffffffffffffffffffffffffffffffffffffffffffffffffffffdfddfdfdfdfdfdfdfdfdfere', '0', '', '', '2025-08-11', 13, 4, '4', '', '1', '2025-08-11 15:21:21', '2025-08-11 15:21:40'),
(105, '2', 48, 48, 'O A BAMGBOSE LTD', '000086', '151 Mosedale Road, Middleton, England, M24 5GW', '0', '', '', '2025-08-12', 9, 13, '4', '', '1', '2025-08-12 13:50:27', '2025-08-12 13:50:53'),
(106, '2', 48, 48, 'THE BEAR ( DEVON ) LTD', '000087', 'Unit 4 Anchor Buildings Battle Road, Heathfield Industrial Estate, Newton Abbot, England, TQ12 6RY', '0', '', '', '2025-08-13', 13, 4, '4', '', '1', '2025-08-13 14:58:21', '2025-08-13 14:58:36'),
(107, '1', 108, 10, 'Pinnacle UK Trade test account manager', '000088', 'Suite 202, Sunrise Business Tower, 45 Meadow Lane, Central Business District, Springfield, SP12 3AB, United Kingdomsfsdfffffffffffffffffffffffffffffffffffffffffffffffffffffffffdfddfdfdfdfdfdfdfdfdfere', '0', '', '', '2025-08-20', 13, 4, '4', '', '1', '2025-08-20 11:59:43', '2025-10-06 12:35:29'),
(108, '2', 105, 10, 'BRADFORD AUTO CARE LIMITED', '000089', '360 Killinghall Road, Bradford, England, BD2 4SE', '0', '', '', '2025-08-20', 12, 5, '4', '', '1', '2025-08-20 12:18:21', '2025-10-06 12:35:29'),
(109, '3', 105, 10, 'test multiple', '000090', 'teste', '0', '', '', '2025-08-20', 13, 4, '4', '', '1', '2025-08-20 13:13:05', '2025-09-25 14:24:09'),
(110, '2', 111, 111, 'D M HOLDINGS LTD', '000091', 'First Floor La Chasse Chambers, Ten La Chasse, St Helier, Jersey, JE2 4UE', '0', '', '', '2025-08-23', 8, 14, '4', '', '1', '2025-08-23 13:01:21', '2025-08-23 13:01:43'),
(112, '2', 113, 10, 'AARONS EXPRESS STORE LTD', '000092', '4 Dunkeld Close, Gateshead, Tyne And Wear, United Kingdom, NE10 8WH', '0', '', '', '2025-09-04', 13, 4, '4', '', '1', '2025-09-04 14:13:08', '2025-09-25 14:24:09'),
(113, '2', 1, 10, 'F LIMITED', '000093', '1  The Crescent, King Street, Leicester, United Kingdom, LE1 6RX', '0', '', '', '2025-09-22', 13, 4, '4', '', '1', '2025-09-22 15:12:00', '2025-09-25 14:24:09'),
(114, '2', 111, 111, 'CLARKES OF BOWLEY LIMITED', '000094', '25 St Thomas Street, Winchester, Hampshire, United Kingdom, SO23 9HJ', '0', '', '', '2025-09-27', 12, 5, '4', '', '1', '2025-09-27 12:55:03', '2025-09-29 08:25:46'),
(115, '2', 1, 112, 'D10S HOLDING LTD', '000095', 'Townend House, 8 Springwell Court, Leeds, West Yorkshire, England, LS12 1AL', '0', '', '', '2025-09-30', 8, 16, '4', 'Access', '1', '2025-09-29 06:14:53', '2025-09-29 06:45:41'),
(116, '2', 1, 112, 'LA MANO DE D10S LTD', '000096', '3 Main Street, Willoughby Waterleys, Leicester, England, LE8 6UF', '0', '', '', '2025-09-30', 12, 5, '4', '', '1', '2025-09-29 06:46:39', '2025-10-25 13:50:23');

-- --------------------------------------------------------

--
-- Table structure for table `customer_company_information`
--

CREATE TABLE `customer_company_information` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `company_name` varchar(100) NOT NULL,
  `entity_type` varchar(50) NOT NULL,
  `company_status` varchar(50) NOT NULL,
  `company_number` varchar(50) NOT NULL,
  `registered_office_address` longtext NOT NULL,
  `incorporation_date` date NOT NULL,
  `incorporation_in` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `customer_company_information`
--

INSERT INTO `customer_company_information` (`id`, `customer_id`, `company_name`, `entity_type`, `company_status`, `company_number`, `registered_office_address`, `incorporation_date`, `incorporation_in`, `created_at`, `updated_at`) VALUES
(1, 1, 'BISHOPS DAL ENERGY STORAGE LIMITED', 'ltd', 'active', '15630057', 'Beaufort Court, Egg Farm Lane, Kings Langley, Hertfordshire, United Kingdom, WD4 8LR', '2024-04-09', '5', '2025-02-10 14:03:38', '2025-02-10 14:03:38'),
(2, 2, 'TAG ACCOUNTANTS GROUP LIMITED (Copia)', 'ltd', 'active', '14428565', '8 Pendeford Place, Pendeford Business Park, Wolverhampton, West Midlands, United Kingdom, WV9 5HD', '2022-10-19', '1', '2025-03-17 09:40:24', '2025-03-17 09:40:24'),
(3, 6, 'LD ACCOUNTING AND BUSINESS SERVICES LTD', 'ltd', 'active', '15231683', '9 Whitebeam Close, Kempston, Bedford, England, MK42 7RN', '2023-10-24', '5', '2025-03-17 10:31:21', '2025-03-17 10:31:21'),
(5, 9, 'GOWER ACCOUNTANCY & TAX ADVISORY SERVICES LTD', 'ltd', 'active', '11423222', 'Unit 47a Crofty Industrial Estate, Penclawdd, Swansea, Wales, SA4 3RS', '2018-06-19', '1', '2025-03-17 10:53:29', '2025-03-17 10:53:29'),
(6, 12, 'FM ACCOUNTING LTD', 'ltd', 'active', '10034895', '1 Blenheim Court, Suite 22, Peppercorn Close, Peterborough, England, PE1 2DU', '2016-03-01', '1', '2025-03-17 14:07:00', '2025-03-17 14:10:03'),
(7, 13, '321ACCOUNTS LTD', 'ltd', 'active', '09037847', '152 Coles Green Road, London, NW2 7HD', '2014-05-13', '1', '2025-03-18 08:48:46', '2025-03-18 08:48:46'),
(9, 19, 'BAANX GROUP LTD', 'ltd', 'active', '11155938', '96 Pavilion Office, Kensington High Street, London, United Kingdom, W8 4SG', '2018-01-17', '4', '2025-03-18 10:32:23', '2025-03-18 10:32:23'),
(10, 20, 'AXADA LTD', 'ltd', 'active', '10373235', '483 Green Lanes, London, United Kingdom, N13 4BS', '2016-09-13', '1', '2025-03-18 10:51:29', '2025-03-18 10:51:29'),
(11, 21, 'CG Accounts Payroll Tax Ltd', 'Limited by shares', 'Normal', '670742', 'Limestone House, 20 Drogheda Street, Balbriggan, Dublin, Ireland', '0021-05-01', '9', '2025-03-18 11:00:03', '2025-03-31 08:45:37'),
(12, 22, 'BERKO WEALTH LTD. ', 'ltd', 'active', '09817850', '38 Nye Bevan Estate, London, United Kingdom, E5 0AG', '2015-10-09', '4', '2025-03-18 11:12:27', '2025-03-18 11:12:27'),
(13, 23, 'BLENHEIM PARTNERS LIMITED', 'ltd', 'active', '07902527', 'Cedar Court 221 Hagley Road, Hayley Green, Halesowen, West Midlands, B63 1ED', '2012-01-09', '9', '2025-03-18 11:51:48', '2025-03-18 11:51:48'),
(14, 24, 'BPC PARTNERS LIMITED', 'ltd', 'active', '04277490', '3 Royal Crescent, Cheltenham, Gloucestershire, United Kingdom, GL50 3DA', '2001-08-28', '4', '2025-03-18 12:08:22', '2025-03-18 12:08:22'),
(15, 25, 'CAMERON PARTNERSHIP LIMITED', 'ltd', 'active', '06392394', 'Suite 37 Chessington Business Centre, Cox Lane, Chessington, Surrey, KT9 1SD', '2007-10-08', '4', '2025-03-18 12:32:54', '2025-03-18 12:32:54'),
(17, 31, 'FIELDS LUXURY LIMITED', 'ltd', 'active', '11322764', ' 2nd Floor Gadd House, Arcadia  Avenue, London, England, N3 2JU', '2018-04-23', '4', '2025-03-18 14:23:03', '2025-03-18 14:23:03'),
(19, 42, 'MY TAX HELPER LTD', 'ltd', 'active', '12459185', 'Office 10, 7 Throwley Way, Sutton, England, SM1 4AF', '2020-02-12', '4', '2025-03-19 03:22:10', '2025-03-19 03:34:36'),
(20, 53, 'RLA (CAMBS) LTD', 'ltd', 'active', '11858690', 'Building 18, Gateway 1000 Whittle Way, Arlington Business Park, Stevenage, Hertfordshire, England, SG1 2FP', '2019-03-04', '5', '2025-03-19 06:59:24', '2025-03-19 07:07:36'),
(21, 60, 'FRYNANCE LIMITED', 'ltd', 'active', '08811740', 'Derek Ashton Court (Office 3), 77 Mottram Road, Stalybridge, England, SK15 2QP', '2013-12-12', '5', '2025-03-19 07:05:42', '2025-03-19 07:05:42'),
(22, 71, 'ASTONIA ASSOCIATES LIMITED', 'ltd', 'active', '09820942', 'Business & Technology Centre, Bessemer Drive, Stevenage, Herts, England, SG1 2DX', '2015-10-12', '4', '2025-03-19 15:03:31', '2025-03-19 15:03:31'),
(23, 72, 'STRATOM CONSULTING LIMITED', 'ltd', 'active', '11947402', '85 Great Portland Street, First Floor, London, England, W1W 7LT', '2019-04-15', '5', '2025-03-20 07:07:40', '2025-03-20 07:07:40'),
(24, 73, 'ANDREWS BUILDING SERVICES CONSULTING ENGINEERS LTD', 'ltd', 'active', 'SC568608', 'Lightyear Building Suite 23 9 Marchburn Drive, Glasgow Airport Business Park, Paisley, Scotland, PA3 2SJ', '2005-05-05', '7', '2025-03-26 13:53:59', '2025-03-26 13:56:13'),
(25, 74, 'FDSFGDSTXDGES LIMITED', 'ltd', 'dissolved', 'NI709505', '2381, NI709505 - COMPANIES HOUSE DEFAULT ADDRESS, Belfast, BT1 9DY', '2005-02-02', '6', '2025-03-26 14:09:44', '2025-03-26 14:09:44'),
(26, 75, 'BIRMINGHAM CONNECTION LTD', 'ltd', 'active', '13680551', '18 Manor House Lane, Birmingham, England, B26 1PG', '2021-10-14', '7', '2025-03-26 14:11:05', '2025-03-26 14:11:23'),
(27, 76, 'ASKL LTD', 'ltd', 'active', '15319684', 'Flat 2 13 Thornhill Road, Croydon, England, CR0 2XZ', '2023-11-30', '9', '2025-03-27 14:15:50', '2025-03-27 14:17:19'),
(28, 78, 'MEDICAL SICKNESS ANNUITY AND LIFE ASSURANCE SOCIETY LIMITED(THE)', 'private-limited-guarant-nsc', 'active', '00167697', 'Colmore Circus Queensway, Birmingham, B4 6AR', '1920-05-25', '5', '2025-03-27 15:04:41', '2025-03-27 15:04:41'),
(29, 79, 'M LIMITED', 'ltd', 'dissolved', '04519627', '99  Holly Avenue, Jesmond, Newcastle Upon Tyne, NE2 2QB', '2002-08-27', '6', '2025-03-27 15:43:41', '2025-03-27 15:43:41'),
(30, 80, 'ANTICUS RECRUITMENT LTD', 'ltd', 'active', '10533303', '24a Market Street, Disley, Stockport, England, SK12 2AA', '2016-12-20', '6', '2025-03-30 14:34:09', '2025-03-30 14:34:09'),
(31, 81, 'OPTIMISE ACCOUNTANTS LIMITED', 'ltd', 'active', '04856185', 'Office 15 Bramley House 2a, Bramley Road, Long Eaton, Nottinghamshire, United Kingdom, NG10 3SX', '2003-08-05', '1', '2025-04-01 09:51:02', '2025-04-01 09:51:02'),
(32, 82, 'ADVANCED HOUSING ENGINEERING UA LTD', 'ltd', 'dissolved', '12321497', 'Suite A-82 James Carter Rd, Mildenhall, Bury St. Edmunds, England, IP28 7DE', '2019-11-19', '4', '2025-04-03 14:46:21', '2025-04-03 14:46:21'),
(33, 83, 'ABBEY COURT FLATS MANAGEMENT COMPANY LIMITED', 'ltd', 'active', '04665252', 'Silver Carn, St. Marys, Isles Of Scilly, TR21 0NW', '2003-02-13', '4', '2025-04-07 14:22:41', '2025-04-07 14:22:41'),
(34, 85, 'F TRADING COMPANY LIMITED', 'registered-overseas-entity', 'registered', 'OE026505', 'Mandar House, 3rd Floor P.O Box 2196, Johnsons Ghut, Tortola, Virgin Islands, British', '2023-02-15', '9', '2025-04-17 06:13:12', '2025-04-17 06:13:12'),
(35, 86, 'AGMAN COCOA LIMITED', 'ltd', 'active', '01287947', 'Chadwick Court, 15 Hatfields, London, England, SE1 8DJ', '1976-11-25', '9', '2025-04-17 16:32:38', '2025-04-17 16:32:38'),
(36, 87, 'THE AFRICA DIALOGUES LTD', 'ltd', 'active', '13383865', '7 Bell Yard, London, England, WC2A 2JR', '2021-05-10', '9', '2025-04-17 16:34:21', '2025-04-17 16:34:21'),
(37, 88, 'AVIGNON CAPITAL FINANCIAL SERVICES LIMITED', 'ltd', 'active', '11341092', '73 Cornhill, London, United Kingdom, EC3V 3QQ', '2018-05-02', '9', '2025-05-02 12:48:51', '2025-05-02 12:48:51'),
(38, 89, 'F A B AUDIO VISUAL LIMITED', 'ltd', 'active', '04388526', '85 Great Portland Street, First Floor, London, England, W1W 7LT', '2002-03-06', '9', '2025-05-23 07:03:27', '2025-05-23 07:03:27'),
(39, 90, 'THE AFRICA DIALOGUES LTD', 'ltd', 'active', '13383865', '7 Bell Yard, London, England, WC2A 2JR', '2021-05-10', '9', '2025-05-26 10:11:29', '2025-05-26 10:11:29'),
(40, 91, 'THE GLOBAL DIALOGUES TRUST', 'private-limited-guarant-nsc-limited-exemption', 'dissolved', '03597767', '43  Herbert Gardens, London, NW10 3BX', '1998-07-14', '9', '2025-05-26 10:14:54', '2025-05-26 10:14:54'),
(41, 92, 'GE ACCOUNTANCY LTD', 'ltd', 'active', '12012240', '4 Braithwaite, Shevington, Wigan, Lancashire, United Kingdom, WN6 8BP', '2019-05-22', '9', '2025-06-26 12:56:55', '2025-06-26 12:56:55'),
(42, 93, 'H. CAMPBELL LLC', 'registered-overseas-entity', 'registered', 'OE032611', '71 Glenview Drive, San Francisco, United States, 94131', '2024-04-26', '9', '2025-06-26 13:27:07', '2025-06-26 13:27:07'),
(43, 94, 'ATOMIC 42 LTD', 'ltd', 'active', '14183305', 'Bankside 300 Peachman Way, Broadland Business Park, Norwich, Norfolk, United Kingdom, NR7 0LB', '2022-06-20', '9', '2025-07-10 11:36:40', '2025-07-10 11:36:40'),
(44, 96, 'D01 PARKVIEW HOLDING LIMITED', 'registered-overseas-entity', 'registered', 'OE014696', 'Vistra Corporate Services Centre Wickhams Cay Ii, Road Town, Tortola, Vg1110, Virgin Islands, British', '2023-01-19', '9', '2025-07-12 14:17:51', '2025-07-12 14:17:51'),
(45, 98, 'GG AEGON LTD', 'ltd', 'active', '06483135', '9 Lanark Square, London, England, E14 9RE', '2008-01-24', '9', '2025-07-24 16:22:35', '2025-07-24 16:22:35'),
(46, 99, 'R ERWIN DESIGN ENGINEERING LTD', 'ltd', 'dissolved', 'NI662617', '36 Moss Road, Drumbo, Lisburn, Northern Ireland, BT27 5JT', '2019-06-28', '9', '2025-07-31 15:35:06', '2025-07-31 15:35:06'),
(47, 100, 'J & E PROPERTIES LIMITED', 'registered-overseas-entity', 'registered', 'OE032626', '12 Mount Havelock, Douglas, Isle Of Man, IM1 2QG', '2024-04-30', '9', '2025-08-01 14:01:24', '2025-08-01 14:01:24'),
(48, 101, 'AA EXPRESS LOGISTICS LTD', 'ltd', 'active', '14692922', 'Unit 38b, The Enterprise Centre, Cranborne Road, Potters Bar, England, EN6 3DQ', '2023-02-27', '9', '2025-08-01 14:59:32', '2025-08-01 14:59:32'),
(49, 102, 'PARKVIEW ASSET MANAGEMENT BOLSOVER HEAD LTD', 'ltd', 'active', '12542890', '35 Ballards Lane, London, United Kingdom, N3 1XW', '2020-04-01', '9', '2025-08-05 13:43:40', '2025-08-05 13:43:40'),
(50, 103, 'H PARKVIEW LTD', 'registered-overseas-entity', 'registered', 'OE030063', 'Leeward Building #2 Marcy Building C/O Amicorp B.V.I. Limited, 2nd Floor, Purcell Estate,, Road Town, Tortola, Virgin Islands, British, P.O.BOX 2416', '2023-06-08', '9', '2025-08-11 14:51:05', '2025-08-11 14:51:05'),
(51, 105, 'O A BAMGBOSE LTD', 'ltd', 'active', '10092053', '151 Mosedale Road, Middleton, England, M24 5GW', '2016-03-31', '9', '2025-08-12 13:50:27', '2025-08-12 13:50:27'),
(52, 106, 'THE BEAR ( DEVON ) LTD', 'ltd', 'active', '15788919', 'Unit 4 Anchor Buildings Battle Road, Heathfield Industrial Estate, Newton Abbot, England, TQ12 6RY', '2024-06-19', '9', '2025-08-13 14:58:21', '2025-08-13 14:58:21'),
(53, 108, 'BRADFORD AUTO CARE LIMITED', 'ltd', 'active', '14942819', '360 Killinghall Road, Bradford, England, BD2 4SE', '2023-06-19', '9', '2025-08-20 12:18:21', '2025-08-20 12:18:21'),
(54, 110, 'D M HOLDINGS LTD', 'registered-overseas-entity', 'registered', 'OE025448', 'First Floor La Chasse Chambers, Ten La Chasse, St Helier, Jersey, JE2 4UE', '2023-02-10', '9', '2025-08-23 13:01:21', '2025-08-23 13:01:21'),
(56, 112, 'AARONS EXPRESS STORE LTD', 'ltd', 'active', '12928609', '4 Dunkeld Close, Gateshead, Tyne And Wear, United Kingdom, NE10 8WH', '2020-10-05', '9', '2025-09-04 14:13:08', '2025-09-04 14:13:08'),
(57, 113, 'F LIMITED', 'ltd', 'dissolved', '06016470', '1  The Crescent, King Street, Leicester, United Kingdom, LE1 6RX', '2006-12-01', '9', '2025-09-22 15:12:00', '2025-09-22 15:12:00'),
(58, 114, 'CLARKES OF BOWLEY LIMITED', 'ltd', 'active', '10044173', '25 St Thomas Street, Winchester, Hampshire, United Kingdom, SO23 9HJ', '2016-03-04', '9', '2025-09-27 12:55:03', '2025-09-27 12:55:03'),
(59, 115, 'D10S HOLDING LTD', 'ltd', 'active', '15654234', 'Townend House, 8 Springwell Court, Leeds, West Yorkshire, England, LS12 1AL', '2024-04-17', '9', '2025-09-29 06:14:53', '2025-09-29 06:14:53'),
(60, 116, 'LA MANO DE D10S LTD', 'ltd', 'active', '14253734', '3 Main Street, Willoughby Waterleys, Leicester, England, LE8 6UF', '2022-07-25', '9', '2025-09-29 06:46:39', '2025-09-29 06:46:39');

-- --------------------------------------------------------

--
-- Table structure for table `customer_contact_details`
--

CREATE TABLE `customer_contact_details` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `contact_person_role_id` int(11) DEFAULT 0,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `alternate_email` varchar(100) DEFAULT NULL,
  `phone_code` varchar(10) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `alternate_phone` varchar(20) DEFAULT NULL,
  `residential_address` text DEFAULT NULL,
  `authorised_signatory_status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: off, 1: on',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `customer_contact_details`
--

INSERT INTO `customer_contact_details` (`id`, `customer_id`, `contact_person_role_id`, `first_name`, `last_name`, `email`, `alternate_email`, `phone_code`, `phone`, `alternate_phone`, `residential_address`, `authorised_signatory_status`, `created_at`, `updated_at`) VALUES
(1, 1, 0, 'Dominic James', 'HEARTH', 'vikas@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-02-10 14:03:38', '2025-02-10 14:03:38'),
(2, 2, NULL, 'Andrew ', 'Coulson', 'andrew@myfinanceteam.co.uk', NULL, '+44', '', NULL, NULL, '1', '2025-03-17 09:40:24', '2025-03-17 10:15:24'),
(3, 6, 0, 'Larisa', 'DURBALA', 'ldservice1304@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-03-17 10:31:21', '2025-03-17 10:31:21'),
(5, 9, 0, 'Jacqueline Elizabeth', 'PHILLIPS', 'jackie@goweraccountancywales.com', NULL, '+44', '', NULL, NULL, '1', '2025-03-17 10:53:29', '2025-03-17 10:53:29'),
(6, 12, NULL, 'Ciprian', 'COJOCARU', 'admin@fmaccounting.net', NULL, '+44', '', NULL, NULL, '1', '2025-03-17 14:07:00', '2025-03-17 14:10:03'),
(7, 13, NULL, 'Robert Sydney', 'JACOBS', 'bobbyj@accounts321.co.uk', NULL, '+44', '7949531907', NULL, NULL, '1', '2025-03-18 08:48:46', '2025-03-18 08:59:18'),
(9, 19, NULL, 'Mark ', 'Evans', 'aidan.connolly@baanx.com', NULL, '+44', '07919516038', NULL, NULL, '1', '2025-03-18 10:32:23', '2025-03-18 15:30:47'),
(10, 20, NULL, 'Britta', 'KAYNE', 'bkayne@axada.co.uk', NULL, '+44', '', NULL, NULL, '1', '2025-03-18 10:51:29', '2025-03-18 15:45:45'),
(11, 21, 2, 'Tom', 'Watson', 'tom.watson@cleargroup.ie', NULL, '+353', '', NULL, NULL, '1', '2025-03-18 11:00:03', '2025-03-31 08:45:37'),
(12, 22, NULL, 'Henry', 'BUTLER', 'henry@berkowealth.co.uk', NULL, '+44', '447553604473', NULL, NULL, '1', '2025-03-18 11:12:27', '2025-03-18 15:50:52'),
(13, 23, NULL, 'Neil ', 'Rampage', 'neil.ramage@blenheimpartners.co.uk', NULL, '+44', '121585444', NULL, NULL, '1', '2025-03-18 11:51:48', '2025-03-20 09:21:40'),
(14, 24, NULL, 'Michael Arnold Geoffrey', 'BULL', 'james.ebdon@bpcpartners.co.uk', NULL, '+44', '', NULL, NULL, '1', '2025-03-18 12:08:22', '2025-03-19 09:10:54'),
(15, 25, NULL, 'Colin', 'CAMERON', 'colin@cameronpartnership.co.uk', NULL, '+44', '', NULL, NULL, '1', '2025-03-18 12:32:54', '2025-03-18 12:40:48'),
(17, 31, NULL, 'James', 'FIELDS', 'james.fields@fieldsluxury.london', NULL, '+44', '', NULL, NULL, '1', '2025-03-18 14:23:03', '2025-03-18 14:28:40'),
(19, 42, NULL, 'Saberus', 'TAJAH', 'saberus@mytaxhelper.co.uk', NULL, '+44', '0208064029', NULL, NULL, '1', '2025-03-19 03:22:10', '2025-03-19 03:34:36'),
(20, 53, NULL, 'Adam Benjamin', 'FERNANDES', 'Adam@adamfernandes.co.uk', NULL, '+44', '07842525670', NULL, NULL, '1', '2025-03-19 06:59:24', '2025-03-19 07:07:36'),
(21, 60, 0, 'Andrew Peter', 'FRY', 'andrew.fry@frynance.com', NULL, '+44', '', NULL, NULL, '1', '2025-03-19 07:05:42', '2025-03-19 07:05:42'),
(22, 71, 0, 'Paul', 'WELLER', 'paul@astonia-associates.co.uk', NULL, '+44', '', NULL, NULL, '1', '2025-03-19 15:03:31', '2025-03-19 15:03:31'),
(23, 72, NULL, 'Mohammed Nabeel Arshad', 'JASRAI', 'nabeel@stratom.co.uk', NULL, '+44', '', NULL, NULL, '1', '2025-03-20 07:07:40', '2025-03-26 10:01:15'),
(24, 73, NULL, 'Mark David Scott', 'ANDREWS', 'vikas@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-03-26 13:53:59', '2025-03-26 13:54:33'),
(25, 73, 0, 'vikas', 'patel', 'vikas@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-03-26 14:03:51', '2025-03-26 14:03:51'),
(26, 74, 0, 'Zhihong', 'LIU', 'vikas@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-03-26 14:09:44', '2025-03-26 14:09:44'),
(27, 75, NULL, 'Sutchin', 'GOSRANI', 'jennifer@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-03-26 14:11:05', '2025-03-26 14:11:23'),
(28, 76, NULL, 'Martin', 'GINA', 'jennifer@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-03-27 14:15:50', '2025-03-27 14:17:19'),
(29, 76, NULL, 'vikas', 'patel', 'vikas@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-03-27 14:15:50', '2025-03-27 14:17:19'),
(30, 77, 0, 'Vikas', 'patel', 'vikaspnpinfotech@gmail.com', NULL, '+44', '', NULL, '12 Enterprise Drive, Newcastle, NE1 4EP, UK', '1', '2025-03-27 14:18:25', '2025-03-27 14:18:25'),
(31, 78, NULL, 'Selena Jane', 'PRITCHARD', 'jennifer@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-03-27 15:04:41', '2025-07-10 14:42:04'),
(32, 79, NULL, 'Suzanne Elizabeth', 'SPEAK', 'vikas@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-03-27 15:43:41', '2025-03-28 11:20:24'),
(33, 80, NULL, 'Lucy', 'BREWER', 'jennifer@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-03-30 14:34:09', '2025-09-25 14:25:01'),
(34, 81, 3, 'Louise', 'MISIEWICZ', 'louise@optimiseaccountants.co.uk', NULL, '+44', '', NULL, NULL, '1', '2025-04-01 09:51:02', '2025-04-01 09:51:02'),
(35, 82, 1, 'Tiago', 'BARROSO', 'jennifer@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-04-03 14:46:21', '2025-04-03 14:46:21'),
(36, 83, 5, 'Kenneth Nicholas', 'CHRISTOPHER', 'vikas@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-04-07 14:22:41', '2025-04-07 14:22:41'),
(37, 84, 0, 'a', 'a', 's@gmail.com', NULL, '+44', '', NULL, 'a', '1', '2025-04-17 06:12:36', '2025-04-17 06:12:36'),
(38, 85, 5, 's', 's', 's@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-04-17 06:13:12', '2025-04-17 06:13:12'),
(39, 86, 5, 'Gaynor Antigha', 'BASSEY', 'jennifer@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-04-17 16:32:38', '2025-04-17 16:32:38'),
(40, 87, 5, 'Nima', 'ELMI', 'jennifer@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-04-17 16:34:21', '2025-04-17 16:34:21'),
(41, 88, 5, 'Douglas Reginald', 'BURTON-CANTLEY', 'jennifer@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-05-02 12:48:51', '2025-05-02 12:48:51'),
(42, 89, 5, 'Phillip John', 'WARRIS', 's@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-05-23 07:03:27', '2025-05-23 07:03:27'),
(43, 90, 5, 'Nima', 'ELMI', 'Admin@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-05-26 10:11:29', '2025-05-26 10:11:29'),
(44, 91, 5, 'Ian Michael', 'WINSKELL', 'Admin@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-05-26 10:14:54', '2025-05-26 10:14:54'),
(45, 92, 5, 'Jacqueline Emma', 'GLOVER', 'neil.ramage@b2s22.uk', NULL, '+44', '', NULL, NULL, '1', '2025-06-26 12:56:55', '2025-06-26 12:56:55'),
(46, 93, 5, 'Lucy', 'BOSTOCK', 'henry@berkowealth.co.uk', NULL, '+44', '223748327472', NULL, NULL, '1', '2025-06-26 13:27:07', '2025-06-26 13:27:07'),
(47, 94, 5, 'Trevor', 'GILL', 'henry@berkowealth.co.uk', NULL, '+44', '', NULL, NULL, '1', '2025-07-10 11:36:40', '2025-07-10 11:36:40'),
(48, 95, 0, 'vikas', 'Yadav', 'vikasptl17@gmail.com', NULL, '+44', '', NULL, 'sesewe', '1', '2025-07-12 13:39:12', '2025-07-12 13:39:12'),
(49, 96, 5, '-', '-', 'vi@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-07-12 14:17:51', '2025-07-12 14:17:51'),
(50, 97, 5, 'Vikas', 'patel', 'vikaspnpinfotech@gmail.com', NULL, '+44', '', NULL, NULL, '0', '2025-07-12 14:22:21', '2025-07-12 14:22:21'),
(51, 97, 5, 'Vikas ', 'Patel', 'vikasptl17@gmail.com', NULL, '+44', '', NULL, NULL, '0', '2025-07-12 14:22:21', '2025-07-12 14:22:21'),
(52, 98, 5, 'George', 'GEORGIOU', 'jennifer@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-07-24 16:22:35', '2025-07-24 16:22:35'),
(53, 99, 5, 'Robert Charles', 'ERWIN', 'vikas@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-07-31 15:35:06', '2025-07-31 15:35:06'),
(54, 100, 5, 'Vikas', 'BOSTOCK', 'henry@berkowealth.co.uk', NULL, '+44', '', NULL, NULL, '1', '2025-08-01 14:01:24', '2025-08-01 14:01:24'),
(55, 101, 5, 'Muhammed', 'ISMAIL', 'jennifer@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-08-01 14:59:32', '2025-08-01 14:59:32'),
(56, 102, 5, 'Imran Osman', 'KHATRI', 'jennifer@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-08-05 13:43:40', '2025-08-05 13:43:40'),
(57, 103, 5, 'Lucy', 'BOSTOCK', 'visionaccounting@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-08-11 14:51:05', '2025-08-11 14:51:05'),
(58, 104, 0, 'Vikas', 'Patel', 'vikaspnpinfotech@gmail.com', NULL, '+44', '', NULL, 'false', '1', '2025-08-11 15:21:21', '2025-08-11 15:21:21'),
(59, 105, 5, 'Olufemi', 'BAMGBOSE', 'henry@berkowealth.co.uk', NULL, '+44', '', NULL, NULL, '1', '2025-08-12 13:50:27', '2025-08-12 13:50:27'),
(60, 106, 5, 'Denis Anthony', 'BOITOULT', 'henry@berkowealth.co.uk', NULL, '+44', '', NULL, NULL, '1', '2025-08-13 14:58:21', '2025-08-13 14:58:21'),
(61, 107, 0, 'null', 'null', 'vikaspnpinfotech@gmail.com', NULL, '+44', '', NULL, '4 St Giles Workshops Baileys Hill, Wimborne St. Giles, Wimborne, Dorset, England, BH21 5NE', '1', '2025-08-20 11:59:43', '2025-08-20 11:59:43'),
(62, 108, 5, 'Chaudhry', 'MOHIUDDIN', 'gf@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-08-20 12:18:21', '2025-08-20 12:18:21'),
(63, 109, 5, 'tws', 'test', 'tes@gmail.com', NULL, '+44', '', NULL, NULL, '0', '2025-08-20 13:13:05', '2025-08-20 13:13:05'),
(64, 109, 5, 'test', 'test', 'tes@gmail.com', NULL, '+44', '', NULL, NULL, '0', '2025-08-20 13:13:05', '2025-08-20 13:13:05'),
(65, 110, 5, 'Lucy', 'BOSTOCK', 'vikas@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-08-23 13:01:21', '2025-08-23 13:01:21'),
(67, 112, 5, 'Sejal', 'SAKARIA', 'jennifer@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-09-04 14:13:08', '2025-09-04 14:13:08'),
(68, 113, 5, 'WILD ANGEL LIMITED', 'BOSTOCK', 'jennifer@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-09-22 15:12:00', '2025-09-22 15:12:00'),
(69, 114, 5, 'MARTIN AND COMPANY (COMPANY SECRETARIES) LIMITED', 'BOSTOCK', 'Admin@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-09-27 12:55:03', '2025-09-27 12:55:03'),
(70, 115, 4, 'Massimo', 'AMOROSO', 'email@email.com', NULL, '+44', '999999996', NULL, NULL, '1', '2025-09-29 06:14:53', '2025-09-29 06:14:53'),
(71, 116, 5, 'Elizabeth Joy', 'ADAMSON', 'email@email.com', NULL, '+44', '', NULL, NULL, '1', '2025-09-29 06:46:39', '2025-09-29 06:46:39');

-- --------------------------------------------------------

--
-- Table structure for table `customer_contact_person_role`
--

CREATE TABLE `customer_contact_person_role` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `customer_contact_person_role`
--

INSERT INTO `customer_contact_person_role` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Accountant', '1', '2025-03-28 11:21:23', '2025-03-28 11:21:23'),
(2, 'Client Manager', '1', '2025-03-28 11:21:35', '2025-03-28 11:21:35'),
(3, 'Partner', '1', '2025-03-28 11:21:43', '2025-03-28 11:21:43'),
(4, 'Bookkeeper', '1', '2025-03-28 11:21:53', '2025-03-28 11:22:12'),
(5, 'Other', '1', '2025-03-28 11:22:20', '2025-03-28 11:22:20');

-- --------------------------------------------------------

--
-- Table structure for table `customer_documents`
--

CREATE TABLE `customer_documents` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_type` varchar(50) NOT NULL,
  `file_size` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer_engagement_adhoc_hourly`
--

CREATE TABLE `customer_engagement_adhoc_hourly` (
  `id` int(11) NOT NULL,
  `customer_engagement_model_id` int(11) NOT NULL,
  `adhoc_accountants` decimal(10,2) DEFAULT NULL,
  `adhoc_bookkeepers` decimal(10,2) DEFAULT NULL,
  `adhoc_payroll_experts` decimal(10,2) DEFAULT NULL,
  `adhoc_tax_experts` decimal(10,2) DEFAULT NULL,
  `adhoc_admin_staff` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `customer_engagement_adhoc_hourly`
--

INSERT INTO `customer_engagement_adhoc_hourly` (`id`, `customer_engagement_model_id`, `adhoc_accountants`, `adhoc_bookkeepers`, `adhoc_payroll_experts`, `adhoc_tax_experts`, `adhoc_admin_staff`, `created_at`, `updated_at`) VALUES
(1, 2, 16.00, 11.00, NULL, NULL, NULL, '2025-03-17 09:41:09', '2025-03-17 09:41:09'),
(2, 3, 16.00, 11.00, NULL, 16.00, 16.00, '2025-03-17 10:33:29', '2025-03-17 10:33:29'),
(3, 4, 16.00, NULL, NULL, NULL, NULL, '2025-03-17 10:55:46', '2025-03-17 10:55:46'),
(4, 6, NULL, 11.00, NULL, NULL, NULL, '2025-03-18 09:17:19', '2025-03-18 09:17:19'),
(5, 8, 15.00, 8.00, NULL, NULL, NULL, '2025-03-18 11:03:48', '2025-03-20 09:42:13'),
(6, 9, 19.00, NULL, NULL, NULL, NULL, '2025-03-18 11:25:53', '2025-03-18 11:25:53'),
(7, 10, 15.00, 8.00, 15.00, NULL, NULL, '2025-03-18 11:29:51', '2025-03-20 09:35:19'),
(8, 11, NULL, NULL, 16.00, NULL, 16.00, '2025-03-18 11:55:46', '2025-03-18 11:55:46'),
(9, 13, 16.00, 11.00, NULL, NULL, NULL, '2025-03-18 12:39:33', '2025-03-18 12:39:33'),
(10, 17, 16.00, NULL, NULL, NULL, NULL, '2025-03-19 07:06:56', '2025-03-19 07:06:56'),
(11, 19, 16.00, NULL, NULL, NULL, NULL, '2025-03-20 07:08:41', '2025-03-20 07:08:41'),
(12, 23, 21.00, NULL, NULL, NULL, NULL, '2025-03-27 14:16:20', '2025-03-27 14:16:20'),
(13, 41, 10.00, NULL, NULL, NULL, NULL, '2025-07-10 14:19:14', '2025-07-10 14:19:14'),
(14, 42, 10.00, NULL, NULL, NULL, NULL, '2025-07-12 13:39:54', '2025-07-12 13:39:54');

-- --------------------------------------------------------

--
-- Table structure for table `customer_engagement_customised_pricing`
--

CREATE TABLE `customer_engagement_customised_pricing` (
  `id` int(11) NOT NULL,
  `customer_engagement_model_id` int(11) NOT NULL,
  `minimum_number_of_jobs` int(11) DEFAULT NULL,
  `job_type_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `cost_per_job` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `customer_engagement_customised_pricing`
--

INSERT INTO `customer_engagement_customised_pricing` (`id`, `customer_engagement_model_id`, `minimum_number_of_jobs`, `job_type_id`, `service_id`, `cost_per_job`, `created_at`, `updated_at`) VALUES
(1, 24, 12, NULL, 7, 30.00, '2025-03-27 14:18:52', '2025-03-27 14:18:52'),
(2, 28, 10, NULL, 1, 140.00, '2025-04-01 09:56:08', '2025-04-01 09:56:08'),
(3, 28, 10, NULL, 4, 55.00, '2025-04-01 09:56:08', '2025-04-01 09:56:08');

-- --------------------------------------------------------

--
-- Table structure for table `customer_engagement_fte`
--

CREATE TABLE `customer_engagement_fte` (
  `id` int(11) NOT NULL,
  `customer_engagement_model_id` int(11) NOT NULL,
  `number_of_accountants` int(11) DEFAULT NULL,
  `fee_per_accountant` decimal(10,2) DEFAULT NULL,
  `number_of_bookkeepers` int(11) DEFAULT NULL,
  `fee_per_bookkeeper` decimal(10,2) DEFAULT NULL,
  `number_of_payroll_experts` int(11) DEFAULT NULL,
  `fee_per_payroll_expert` decimal(10,2) DEFAULT NULL,
  `number_of_tax_experts` int(11) DEFAULT NULL,
  `fee_per_tax_expert` decimal(10,2) DEFAULT NULL,
  `number_of_admin_staff` int(11) DEFAULT NULL,
  `fee_per_admin_staff` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `customer_engagement_fte`
--

INSERT INTO `customer_engagement_fte` (`id`, `customer_engagement_model_id`, `number_of_accountants`, `fee_per_accountant`, `number_of_bookkeepers`, `fee_per_bookkeeper`, `number_of_payroll_experts`, `fee_per_payroll_expert`, `number_of_tax_experts`, `fee_per_tax_expert`, `number_of_admin_staff`, `fee_per_admin_staff`, `created_at`, `updated_at`) VALUES
(1, 1, 12, 0.00, 0, 0.00, 0, 0.00, 0, 0.00, 0, 0.00, '2025-02-10 14:03:57', '2025-02-10 14:03:57'),
(2, 7, NULL, NULL, NULL, NULL, 1, 100.00, NULL, NULL, NULL, NULL, '2025-03-18 10:42:37', '2025-03-20 09:44:52'),
(3, 12, 1, 1600.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-18 12:12:22', '2025-03-18 12:12:22'),
(4, 14, 1, 1600.00, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1120.00, '2025-03-18 14:32:06', '2025-03-18 14:32:06'),
(5, 15, NULL, 1800.00, NULL, NULL, NULL, 300.00, NULL, NULL, NULL, NULL, '2025-03-19 03:26:26', '2025-03-19 03:39:20'),
(6, 16, 3, 1600.00, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-19 07:03:01', '2025-03-19 07:03:01'),
(7, 20, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-26 13:54:13', '2025-03-26 13:54:13'),
(8, 21, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-26 14:10:00', '2025-03-26 14:10:00'),
(9, 23, 21, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-27 14:16:20', '2025-03-27 14:16:20'),
(10, 25, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-27 15:05:13', '2025-03-27 15:05:13'),
(11, 26, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-27 15:43:55', '2025-03-27 15:43:55'),
(12, 27, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-30 14:35:06', '2025-03-30 14:35:06'),
(13, 29, 32, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-03 14:46:40', '2025-04-03 14:46:40'),
(14, 30, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-07 14:23:14', '2025-04-07 14:23:14'),
(15, 31, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-17 06:12:45', '2025-04-17 06:12:45'),
(16, 33, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-17 16:32:46', '2025-04-17 16:32:46'),
(17, 34, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-17 16:34:29', '2025-04-17 16:34:29'),
(18, 35, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-02 12:49:00', '2025-05-02 12:49:00'),
(19, 36, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-23 07:03:34', '2025-05-23 07:03:34'),
(20, 37, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-26 10:11:46', '2025-05-26 10:11:46'),
(21, 39, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-26 12:57:26', '2025-06-26 12:57:26'),
(22, 40, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-26 13:27:22', '2025-06-26 13:27:22'),
(24, 43, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-12 14:18:15', '2025-07-12 14:18:15'),
(25, 44, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-12 14:22:38', '2025-07-12 14:22:38'),
(26, 45, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-24 16:22:55', '2025-07-24 16:22:55'),
(27, 46, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-31 15:50:14', '2025-07-31 15:50:14'),
(28, 47, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-01 14:01:43', '2025-08-01 14:01:43'),
(29, 48, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-01 14:59:49', '2025-08-01 14:59:49'),
(30, 49, 34, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-05 13:43:57', '2025-08-05 13:43:57'),
(31, 50, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-11 14:51:19', '2025-08-11 14:51:19'),
(32, 51, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-11 15:21:38', '2025-08-11 15:21:38'),
(33, 52, 32, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-12 13:50:51', '2025-08-12 13:50:51'),
(34, 53, 32, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 14:58:34', '2025-08-13 14:58:34'),
(35, 54, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-20 12:00:08', '2025-08-20 12:00:08'),
(36, 55, 34, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-20 12:19:00', '2025-08-20 12:19:00'),
(37, 56, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 5, NULL, '2025-08-20 13:13:28', '2025-08-20 13:13:28'),
(38, 57, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-23 13:01:41', '2025-08-23 13:01:41'),
(39, 58, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-04 14:13:23', '2025-09-04 14:13:23'),
(40, 59, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 15:12:37', '2025-09-22 15:12:37'),
(41, 60, 12, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-27 12:57:29', '2025-09-27 12:57:29');

-- --------------------------------------------------------

--
-- Table structure for table `customer_engagement_model`
--

CREATE TABLE `customer_engagement_model` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `fte_dedicated_staffing` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: off, 1: on',
  `percentage_model` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: off, 1: on',
  `adhoc_payg_hourly` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: off, 1: on',
  `customised_pricing` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: off, 1: on',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `customer_engagement_model`
--

INSERT INTO `customer_engagement_model` (`id`, `customer_id`, `fte_dedicated_staffing`, `percentage_model`, `adhoc_payg_hourly`, `customised_pricing`, `created_at`, `updated_at`) VALUES
(1, 1, '1', '0', '0', '0', '2025-02-10 14:03:57', '2025-02-10 14:03:57'),
(2, 2, '0', '1', '1', '0', '2025-03-17 09:41:09', '2025-03-17 09:41:09'),
(3, 6, '0', '0', '1', '0', '2025-03-17 10:33:29', '2025-03-17 10:33:29'),
(4, 9, '0', '0', '1', '0', '2025-03-17 10:55:46', '2025-03-17 10:55:46'),
(5, 12, '0', '1', '0', '0', '2025-03-17 14:11:00', '2025-03-17 14:11:00'),
(6, 13, '0', '0', '1', '0', '2025-03-18 09:17:19', '2025-03-18 09:17:19'),
(7, 19, '1', '0', '0', '0', '2025-03-18 10:42:37', '2025-03-18 10:42:37'),
(8, 20, '0', '0', '1', '0', '2025-03-18 11:03:48', '2025-03-18 11:03:48'),
(9, 21, '0', '0', '1', '0', '2025-03-18 11:25:53', '2025-03-18 11:25:53'),
(10, 22, '0', '0', '1', '0', '2025-03-18 11:29:51', '2025-03-18 11:29:51'),
(11, 23, '0', '0', '1', '0', '2025-03-18 11:55:46', '2025-03-18 11:55:46'),
(12, 24, '1', '0', '0', '0', '2025-03-18 12:12:22', '2025-03-18 12:12:22'),
(13, 25, '0', '0', '1', '0', '2025-03-18 12:39:33', '2025-03-18 12:39:33'),
(14, 31, '1', '0', '0', '0', '2025-03-18 14:32:06', '2025-03-18 14:32:06'),
(15, 42, '1', '0', '0', '0', '2025-03-19 03:26:26', '2025-03-19 03:26:26'),
(16, 53, '1', '0', '0', '0', '2025-03-19 07:03:01', '2025-03-19 07:03:01'),
(17, 60, '0', '0', '1', '0', '2025-03-19 07:06:56', '2025-03-19 07:06:56'),
(18, 71, '0', '1', '0', '0', '2025-03-19 15:05:57', '2025-03-19 15:05:57'),
(19, 72, '0', '0', '1', '0', '2025-03-20 07:08:41', '2025-03-20 07:08:41'),
(20, 73, '1', '0', '0', '0', '2025-03-26 13:54:13', '2025-03-26 13:54:13'),
(21, 74, '1', '0', '0', '0', '2025-03-26 14:10:00', '2025-03-26 14:10:00'),
(22, 75, '0', '1', '0', '0', '2025-03-26 14:11:48', '2025-03-26 14:11:48'),
(23, 76, '1', '1', '1', '0', '2025-03-27 14:16:20', '2025-03-27 14:16:20'),
(24, 77, '0', '0', '0', '1', '2025-03-27 14:18:52', '2025-03-27 14:18:52'),
(25, 78, '1', '0', '0', '0', '2025-03-27 15:05:13', '2025-03-27 15:05:13'),
(26, 79, '1', '0', '0', '0', '2025-03-27 15:43:55', '2025-03-27 15:43:55'),
(27, 80, '1', '0', '0', '0', '2025-03-30 14:35:06', '2025-03-30 14:35:06'),
(28, 81, '0', '0', '0', '1', '2025-04-01 09:56:08', '2025-04-01 09:56:08'),
(29, 82, '1', '0', '0', '0', '2025-04-03 14:46:40', '2025-04-03 14:46:40'),
(30, 83, '1', '0', '0', '0', '2025-04-07 14:23:14', '2025-04-07 14:23:14'),
(31, 84, '1', '0', '0', '0', '2025-04-17 06:12:45', '2025-04-17 06:12:45'),
(32, 85, '0', '1', '0', '0', '2025-04-17 06:13:20', '2025-04-17 06:13:20'),
(33, 86, '1', '0', '0', '0', '2025-04-17 16:32:46', '2025-04-17 16:32:46'),
(34, 87, '1', '0', '0', '0', '2025-04-17 16:34:29', '2025-04-17 16:34:29'),
(35, 88, '1', '0', '0', '0', '2025-05-02 12:49:00', '2025-05-02 12:49:00'),
(36, 89, '1', '0', '0', '0', '2025-05-23 07:03:34', '2025-05-23 07:03:34'),
(37, 90, '1', '0', '0', '0', '2025-05-26 10:11:46', '2025-05-26 10:11:46'),
(38, 91, '0', '1', '0', '0', '2025-05-26 10:15:13', '2025-05-26 10:15:13'),
(39, 92, '1', '0', '0', '0', '2025-06-26 12:57:26', '2025-06-26 12:57:26'),
(40, 93, '1', '0', '0', '0', '2025-06-26 13:27:22', '2025-06-26 13:27:22'),
(41, 94, '0', '1', '1', '0', '2025-07-10 11:38:03', '2025-07-10 14:19:15'),
(42, 95, '0', '1', '1', '0', '2025-07-12 13:39:54', '2025-07-12 13:39:54'),
(43, 96, '1', '0', '0', '0', '2025-07-12 14:18:15', '2025-07-12 14:18:15'),
(44, 97, '1', '0', '0', '0', '2025-07-12 14:22:38', '2025-07-12 14:22:38'),
(45, 98, '1', '0', '0', '0', '2025-07-24 16:22:55', '2025-07-24 16:22:55'),
(46, 99, '1', '0', '0', '0', '2025-07-31 15:50:14', '2025-07-31 15:50:14'),
(47, 100, '1', '0', '0', '0', '2025-08-01 14:01:43', '2025-08-01 14:01:43'),
(48, 101, '1', '0', '0', '0', '2025-08-01 14:59:49', '2025-08-01 14:59:49'),
(49, 102, '1', '0', '0', '0', '2025-08-05 13:43:57', '2025-08-05 13:43:57'),
(50, 103, '1', '0', '0', '0', '2025-08-11 14:51:19', '2025-08-11 14:51:19'),
(51, 104, '1', '0', '0', '0', '2025-08-11 15:21:38', '2025-08-11 15:21:38'),
(52, 105, '1', '0', '0', '0', '2025-08-12 13:50:51', '2025-08-12 13:50:51'),
(53, 106, '1', '0', '0', '0', '2025-08-13 14:58:34', '2025-08-13 14:58:34'),
(54, 107, '1', '0', '0', '0', '2025-08-20 12:00:08', '2025-08-20 12:00:08'),
(55, 108, '1', '0', '0', '0', '2025-08-20 12:19:00', '2025-08-20 12:19:00'),
(56, 109, '1', '1', '0', '0', '2025-08-20 13:13:28', '2025-08-20 13:13:28'),
(57, 110, '1', '0', '0', '0', '2025-08-23 13:01:41', '2025-08-23 13:01:41'),
(58, 112, '1', '0', '0', '0', '2025-09-04 14:13:23', '2025-09-04 14:13:23'),
(59, 113, '1', '0', '0', '0', '2025-09-22 15:12:37', '2025-09-22 15:12:37'),
(60, 114, '1', '0', '0', '0', '2025-09-27 12:57:29', '2025-09-27 12:57:29'),
(61, 115, '0', '1', '0', '0', '2025-09-29 06:45:30', '2025-09-29 06:45:30'),
(62, 116, '0', '1', '0', '0', '2025-09-29 06:49:01', '2025-09-29 06:49:01');

-- --------------------------------------------------------

--
-- Table structure for table `customer_engagement_percentage`
--

CREATE TABLE `customer_engagement_percentage` (
  `id` int(11) NOT NULL,
  `customer_engagement_model_id` int(11) NOT NULL,
  `total_outsourcing` decimal(15,2) DEFAULT NULL,
  `accountants` decimal(10,2) DEFAULT NULL,
  `bookkeepers` decimal(10,2) DEFAULT NULL,
  `payroll_experts` decimal(10,2) DEFAULT NULL,
  `tax_experts` decimal(10,2) DEFAULT NULL,
  `admin_staff` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `customer_engagement_percentage`
--

INSERT INTO `customer_engagement_percentage` (`id`, `customer_engagement_model_id`, `total_outsourcing`, `accountants`, `bookkeepers`, `payroll_experts`, `tax_experts`, `admin_staff`, `created_at`, `updated_at`) VALUES
(1, 2, 20.00, 20.00, 20.00, NULL, NULL, NULL, '2025-03-17 09:41:09', '2025-03-17 09:41:09'),
(2, 5, 27.50, NULL, 27.50, 27.50, 27.50, NULL, '2025-03-17 14:11:00', '2025-03-17 14:11:00'),
(3, 18, NULL, 25.00, NULL, NULL, NULL, NULL, '2025-03-19 15:05:57', '2025-03-19 15:05:57'),
(4, 22, 12.00, 21.00, 21.00, NULL, NULL, NULL, '2025-03-26 14:11:48', '2025-03-26 14:11:48'),
(5, 23, 12.00, 21.00, NULL, NULL, NULL, NULL, '2025-03-27 14:16:20', '2025-03-27 14:16:20'),
(6, 32, 1.00, NULL, NULL, NULL, NULL, NULL, '2025-04-17 06:13:20', '2025-04-17 06:13:20'),
(7, 38, 11.00, NULL, NULL, NULL, NULL, NULL, '2025-05-26 10:15:13', '2025-05-26 10:15:13'),
(8, 41, 21.00, NULL, NULL, NULL, NULL, NULL, '2025-07-10 14:19:14', '2025-07-10 14:19:14'),
(9, 42, 2.00, 32.00, NULL, NULL, NULL, NULL, '2025-07-12 13:39:54', '2025-07-12 13:39:54'),
(10, 56, 4.00, NULL, NULL, NULL, NULL, NULL, '2025-08-20 13:13:28', '2025-08-20 13:13:28'),
(11, 61, 89.00, 99.00, 8.00, 70.00, 8.00, 89.00, '2025-09-29 06:45:30', '2025-09-29 06:45:30'),
(12, 62, 89.00, NULL, NULL, NULL, NULL, NULL, '2025-09-29 06:49:01', '2025-09-29 06:49:01');

-- --------------------------------------------------------

--
-- Table structure for table `customer_paper_work`
--

CREATE TABLE `customer_paper_work` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_type` text NOT NULL,
  `file_size` int(11) NOT NULL,
  `web_url` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `customer_paper_work`
--

INSERT INTO `customer_paper_work` (`id`, `customer_id`, `file_name`, `original_name`, `file_type`, `file_size`, `web_url`, `created_at`, `updated_at`) VALUES
(1, 82, '1742918187902-gr2kuwc2.png', 'gr2kuwc2.png', 'image/png', 12370, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST82/gr2kuwc2.png', '2025-04-03 14:46:53', '2025-04-03 14:46:53'),
(2, 83, '1739200005920-Customer Contact Person Role Data.xlsx', 'Customer Contact Person Role Data.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 16169, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/_layouts/15/Doc.aspx?sourcedoc=%7B93BD72EB-16D6-46B4-A8D5-12897F231DAD%7D&file=Customer%20Contact%20Person%20Role%20Data.xlsx&action=default&mobileredirect=true', '2025-04-07 14:23:35', '2025-04-07 14:23:35');

-- --------------------------------------------------------

--
-- Table structure for table `customer_services`
--

CREATE TABLE `customer_services` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `customer_services`
--

INSERT INTO `customer_services` (`id`, `customer_id`, `service_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 2, '1', '2025-02-10 14:03:46', '2025-02-10 14:03:46'),
(2, 2, 8, '1', '2025-03-17 09:40:33', '2025-03-17 09:40:33'),
(3, 2, 6, '1', '2025-03-17 09:40:33', '2025-03-17 09:40:33'),
(4, 2, 2, '1', '2025-03-17 09:40:33', '2025-03-17 09:40:33'),
(5, 2, 1, '1', '2025-03-17 09:40:33', '2025-03-17 09:40:33'),
(6, 6, 1, '1', '2025-03-17 10:32:04', '2025-03-17 10:32:04'),
(8, 9, 6, '1', '2025-03-17 10:53:46', '2025-03-17 10:53:46'),
(9, 12, 1, '1', '2025-03-17 14:07:40', '2025-03-17 14:07:40'),
(10, 12, 2, '1', '2025-03-17 14:07:40', '2025-03-17 14:07:40'),
(11, 12, 3, '1', '2025-03-17 14:07:40', '2025-03-17 14:07:40'),
(12, 12, 4, '1', '2025-03-17 14:07:40', '2025-03-17 14:07:40'),
(13, 13, 2, '1', '2025-03-18 08:55:27', '2025-03-18 08:55:27'),
(14, 19, 3, '1', '2025-03-18 10:33:47', '2025-03-18 10:33:47'),
(15, 20, 2, '1', '2025-03-18 11:02:08', '2025-03-18 11:02:08'),
(16, 20, 1, '1', '2025-03-18 11:02:08', '2025-03-18 11:02:08'),
(17, 21, 1, '1', '2025-03-18 11:04:09', '2025-03-18 11:04:09'),
(18, 22, 2, '1', '2025-03-18 11:22:12', '2025-03-18 11:22:12'),
(19, 22, 1, '1', '2025-03-18 11:22:12', '2025-03-18 11:22:12'),
(21, 23, 3, '1', '2025-03-18 11:51:56', '2025-03-18 11:51:56'),
(22, 23, 5, '1', '2025-03-18 11:51:56', '2025-03-18 11:51:56'),
(23, 24, 1, '1', '2025-03-18 12:08:39', '2025-03-18 12:08:39'),
(24, 25, 2, '1', '2025-03-18 12:33:23', '2025-03-18 12:33:23'),
(25, 31, 5, '1', '2025-03-18 14:26:35', '2025-03-18 14:26:35'),
(26, 31, 2, '1', '2025-03-18 14:28:55', '2025-03-18 14:28:55'),
(28, 22, 3, '1', '2025-03-18 15:52:35', '2025-03-18 15:52:35'),
(29, 42, 8, '1', '2025-03-19 03:22:34', '2025-03-19 03:22:34'),
(33, 42, 3, '1', '2025-03-19 03:36:43', '2025-03-19 03:36:43'),
(31, 42, 2, '1', '2025-03-19 03:22:34', '2025-03-19 03:22:34'),
(32, 42, 1, '1', '2025-03-19 03:22:34', '2025-03-19 03:22:34'),
(34, 53, 6, '1', '2025-03-19 07:01:22', '2025-03-19 07:01:22'),
(35, 53, 1, '1', '2025-03-19 07:01:22', '2025-03-19 07:01:22'),
(36, 53, 2, '1', '2025-03-19 07:01:22', '2025-03-19 07:01:22'),
(37, 60, 1, '1', '2025-03-19 07:05:51', '2025-03-19 07:05:51'),
(38, 71, 1, '1', '2025-03-19 15:04:27', '2025-03-19 15:04:27'),
(39, 71, 2, '1', '2025-03-19 15:04:27', '2025-03-19 15:04:27'),
(40, 71, 8, '1', '2025-03-19 15:04:27', '2025-03-19 15:04:27'),
(41, 72, 1, '1', '2025-03-20 07:07:53', '2025-03-20 07:07:53'),
(42, 73, 5, '1', '2025-03-26 13:54:05', '2025-03-26 13:54:05'),
(43, 73, 4, '1', '2025-03-26 13:54:05', '2025-03-26 13:54:05'),
(44, 74, 5, '1', '2025-03-26 14:09:53', '2025-03-26 14:09:53'),
(45, 75, 4, '1', '2025-03-26 14:11:26', '2025-03-26 14:11:26'),
(46, 75, 3, '1', '2025-03-26 14:11:26', '2025-03-26 14:11:26'),
(47, 76, 5, '1', '2025-03-27 14:16:05', '2025-03-27 14:16:05'),
(48, 77, 5, '1', '2025-03-27 14:18:41', '2025-03-27 14:18:41'),
(49, 77, 4, '1', '2025-03-27 14:18:41', '2025-03-27 14:18:41'),
(50, 77, 3, '1', '2025-03-27 14:18:41', '2025-03-27 14:18:41'),
(51, 78, 4, '1', '2025-03-27 15:05:05', '2025-03-27 15:05:05'),
(52, 78, 5, '1', '2025-03-27 15:05:05', '2025-03-27 15:05:05'),
(53, 79, 5, '1', '2025-03-27 15:43:46', '2025-03-27 15:43:46'),
(54, 79, 4, '1', '2025-03-27 15:43:46', '2025-03-27 15:43:46'),
(55, 80, 10, '1', '2025-03-30 14:34:51', '2025-03-30 14:34:51'),
(56, 81, 1, '1', '2025-04-01 09:54:03', '2025-04-01 09:54:03'),
(57, 81, 4, '1', '2025-04-01 09:54:03', '2025-04-01 09:54:03'),
(58, 82, 4, '1', '2025-04-03 14:46:30', '2025-04-03 14:46:30'),
(59, 82, 5, '1', '2025-04-03 14:46:30', '2025-04-03 14:46:30'),
(60, 82, 7, '1', '2025-04-03 14:46:30', '2025-04-03 14:46:30'),
(61, 82, 6, '1', '2025-04-03 14:46:30', '2025-04-03 14:46:30'),
(149, 113, 30, '1', '2025-09-22 15:12:27', '2025-09-22 15:12:27'),
(63, 83, 10, '1', '2025-04-07 14:23:07', '2025-04-07 14:23:07'),
(64, 84, 2, '1', '2025-04-17 06:12:40', '2025-04-17 06:12:40'),
(65, 84, 1, '1', '2025-04-17 06:12:40', '2025-04-17 06:12:40'),
(66, 85, 2, '1', '2025-04-17 06:13:15', '2025-04-17 06:13:15'),
(67, 85, 3, '1', '2025-04-17 06:13:15', '2025-04-17 06:13:15'),
(68, 86, 3, '1', '2025-04-17 16:32:42', '2025-04-17 16:32:42'),
(69, 86, 2, '1', '2025-04-17 16:32:42', '2025-04-17 16:32:42'),
(70, 87, 4, '1', '2025-04-17 16:34:25', '2025-04-17 16:34:25'),
(71, 87, 3, '1', '2025-04-17 16:34:25', '2025-04-17 16:34:25'),
(72, 87, 2, '1', '2025-04-17 16:34:25', '2025-04-17 16:34:25'),
(73, 88, 2, '1', '2025-05-02 12:48:55', '2025-05-02 12:48:55'),
(74, 88, 3, '1', '2025-05-02 12:48:55', '2025-05-02 12:48:55'),
(75, 89, 1, '1', '2025-05-23 07:03:29', '2025-05-23 07:03:29'),
(148, 113, 31, '1', '2025-09-22 15:12:27', '2025-09-22 15:12:27'),
(77, 90, 8, '1', '2025-05-26 10:11:33', '2025-05-26 10:11:33'),
(147, 113, 32, '1', '2025-09-22 15:12:27', '2025-09-22 15:12:27'),
(79, 91, 8, '1', '2025-05-26 10:15:00', '2025-05-26 10:15:00'),
(80, 90, 2, '1', '2025-06-06 15:08:03', '2025-06-06 15:08:03'),
(81, 91, 7, '1', '2025-06-09 14:22:35', '2025-06-09 14:22:35'),
(82, 92, 2, '1', '2025-06-26 12:57:14', '2025-06-26 12:57:14'),
(83, 92, 1, '1', '2025-06-26 12:57:14', '2025-06-26 12:57:14'),
(84, 93, 2, '1', '2025-06-26 13:27:14', '2025-06-26 13:27:14'),
(85, 93, 1, '1', '2025-06-26 13:27:14', '2025-06-26 13:27:14'),
(86, 94, 8, '1', '2025-07-10 11:37:55', '2025-07-10 11:37:55'),
(87, 94, 7, '1', '2025-07-10 11:37:55', '2025-07-10 11:37:55'),
(88, 94, 6, '1', '2025-07-10 11:37:55', '2025-07-10 11:37:55'),
(89, 95, 8, '1', '2025-07-12 13:39:32', '2025-07-12 13:39:32'),
(90, 95, 7, '1', '2025-07-12 13:39:32', '2025-07-12 13:39:32'),
(91, 95, 2, '1', '2025-07-12 13:39:32', '2025-07-12 13:39:32'),
(92, 96, 2, '1', '2025-07-12 14:18:02', '2025-07-12 14:18:02'),
(93, 96, 3, '1', '2025-07-12 14:18:02', '2025-07-12 14:18:02'),
(94, 96, 8, '1', '2025-07-12 14:18:02', '2025-07-12 14:18:02'),
(95, 96, 7, '1', '2025-07-12 14:18:02', '2025-07-12 14:18:02'),
(96, 97, 7, '1', '2025-07-12 14:22:29', '2025-07-12 14:22:29'),
(97, 97, 8, '1', '2025-07-12 14:22:29', '2025-07-12 14:22:29'),
(98, 97, 3, '1', '2025-07-12 14:22:29', '2025-07-12 14:22:29'),
(99, 97, 2, '1', '2025-07-12 14:22:29', '2025-07-12 14:22:29'),
(100, 98, 2, '1', '2025-07-24 16:22:43', '2025-07-24 16:22:43'),
(101, 98, 7, '1', '2025-07-24 16:22:43', '2025-07-24 16:22:43'),
(102, 99, 8, '1', '2025-07-31 15:45:30', '2025-07-31 15:45:30'),
(103, 100, 7, '1', '2025-08-01 14:01:37', '2025-08-01 14:01:37'),
(104, 100, 8, '1', '2025-08-01 14:01:37', '2025-08-01 14:01:37'),
(105, 101, 7, '1', '2025-08-01 14:59:42', '2025-08-01 14:59:42'),
(106, 101, 2, '1', '2025-08-01 14:59:42', '2025-08-01 14:59:42'),
(107, 101, 1, '1', '2025-08-01 14:59:42', '2025-08-01 14:59:42'),
(108, 102, 4, '1', '2025-08-05 13:43:48', '2025-08-05 13:43:48'),
(109, 102, 5, '1', '2025-08-05 13:43:48', '2025-08-05 13:43:48'),
(110, 102, 6, '1', '2025-08-05 13:43:48', '2025-08-05 13:43:48'),
(111, 103, 4, '1', '2025-08-11 14:51:12', '2025-08-11 14:51:12'),
(112, 103, 7, '1', '2025-08-11 14:51:12', '2025-08-11 14:51:12'),
(113, 103, 5, '1', '2025-08-11 14:51:12', '2025-08-11 14:51:12'),
(114, 104, 6, '1', '2025-08-11 15:21:28', '2025-08-11 15:21:28'),
(115, 104, 5, '1', '2025-08-11 15:21:28', '2025-08-11 15:21:28'),
(116, 104, 4, '1', '2025-08-11 15:21:28', '2025-08-11 15:21:28'),
(117, 105, 8, '1', '2025-08-12 13:50:36', '2025-08-12 13:50:36'),
(118, 105, 7, '1', '2025-08-12 13:50:36', '2025-08-12 13:50:36'),
(119, 105, 6, '1', '2025-08-12 13:50:36', '2025-08-12 13:50:36'),
(120, 106, 8, '1', '2025-08-13 14:58:27', '2025-08-13 14:58:27'),
(121, 106, 7, '1', '2025-08-13 14:58:27', '2025-08-13 14:58:27'),
(122, 105, 2, '1', '2025-08-18 13:06:17', '2025-08-18 13:06:17'),
(123, 105, 3, '1', '2025-08-18 13:06:17', '2025-08-18 13:06:17'),
(124, 105, 4, '1', '2025-08-18 13:06:17', '2025-08-18 13:06:17'),
(125, 105, 1, '1', '2025-08-18 13:06:17', '2025-08-18 13:06:17'),
(126, 105, 5, '1', '2025-08-18 13:06:17', '2025-08-18 13:06:17'),
(127, 107, 8, '1', '2025-08-20 11:59:59', '2025-08-20 11:59:59'),
(128, 107, 2, '1', '2025-08-20 11:59:59', '2025-08-20 11:59:59'),
(129, 107, 1, '1', '2025-08-20 11:59:59', '2025-08-20 11:59:59'),
(130, 107, 3, '1', '2025-08-20 11:59:59', '2025-08-20 11:59:59'),
(131, 107, 4, '1', '2025-08-20 11:59:59', '2025-08-20 11:59:59'),
(132, 107, 5, '1', '2025-08-20 11:59:59', '2025-08-20 11:59:59'),
(133, 107, 6, '1', '2025-08-20 11:59:59', '2025-08-20 11:59:59'),
(134, 107, 7, '1', '2025-08-20 11:59:59', '2025-08-20 11:59:59'),
(146, 113, 33, '1', '2025-09-22 15:12:27', '2025-09-22 15:12:27'),
(136, 108, 8, '1', '2025-08-20 12:18:46', '2025-08-20 12:18:46'),
(137, 108, 7, '1', '2025-08-20 12:18:46', '2025-08-20 12:18:46'),
(138, 108, 2, '1', '2025-08-20 12:18:46', '2025-08-20 12:18:46'),
(139, 109, 8, '1', '2025-08-20 13:13:14', '2025-08-20 13:13:14'),
(140, 109, 7, '1', '2025-08-20 13:13:14', '2025-08-20 13:13:14'),
(141, 109, 6, '1', '2025-08-20 13:13:14', '2025-08-20 13:13:14'),
(142, 110, 2, '1', '2025-08-23 13:01:27', '2025-08-23 13:01:27'),
(143, 110, 4, '1', '2025-08-23 13:01:27', '2025-08-23 13:01:27'),
(144, 112, 6, '1', '2025-09-04 14:13:15', '2025-09-04 14:13:15'),
(145, 112, 2, '1', '2025-09-04 14:13:15', '2025-09-04 14:13:15'),
(150, 113, 29, '1', '2025-09-22 15:12:27', '2025-09-22 15:12:27'),
(151, 113, 28, '1', '2025-09-22 15:12:27', '2025-09-22 15:12:27'),
(152, 113, 27, '1', '2025-09-22 15:12:27', '2025-09-22 15:12:27'),
(153, 113, 26, '1', '2025-09-22 15:12:27', '2025-09-22 15:12:27'),
(154, 113, 8, '1', '2025-09-22 15:12:27', '2025-09-22 15:12:27'),
(155, 113, 7, '1', '2025-09-22 15:12:27', '2025-09-22 15:12:27'),
(156, 113, 6, '1', '2025-09-22 15:12:27', '2025-09-22 15:12:27'),
(157, 113, 5, '1', '2025-09-22 15:12:27', '2025-09-22 15:12:27'),
(158, 113, 4, '1', '2025-09-22 15:12:27', '2025-09-22 15:12:27'),
(159, 113, 3, '1', '2025-09-22 15:12:27', '2025-09-22 15:12:27'),
(160, 113, 2, '1', '2025-09-22 15:12:27', '2025-09-22 15:12:27'),
(161, 113, 1, '1', '2025-09-22 15:12:27', '2025-09-22 15:12:27'),
(162, 114, 32, '1', '2025-09-27 12:56:06', '2025-09-27 12:56:06'),
(163, 114, 2, '1', '2025-09-27 12:56:06', '2025-09-27 12:56:06'),
(164, 115, 6, '1', '2025-09-29 06:32:51', '2025-09-29 06:32:51'),
(165, 116, 3, '1', '2025-09-29 06:46:49', '2025-09-29 06:46:49'),
(166, 116, 33, '1', '2025-10-04 13:23:31', '2025-10-04 13:23:31');

-- --------------------------------------------------------

--
-- Table structure for table `customer_service_account_managers`
--

CREATE TABLE `customer_service_account_managers` (
  `customer_service_id` int(11) NOT NULL,
  `account_manager_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `customer_service_account_managers`
--

INSERT INTO `customer_service_account_managers` (`customer_service_id`, `account_manager_id`, `created_at`, `updated_at`) VALUES
(1, 30, '2025-02-10 14:03:46', '2025-04-07 14:57:23'),
(2, 10, '2025-03-17 09:40:33', '2025-09-25 14:24:09'),
(3, 10, '2025-03-17 09:40:33', '2025-09-25 14:24:09'),
(4, 10, '2025-03-17 09:40:33', '2025-09-25 14:24:09'),
(5, 10, '2025-03-17 09:40:33', '2025-09-25 14:24:09'),
(6, 47, '2025-03-17 10:32:04', '2025-03-17 10:32:04'),
(8, 10, '2025-03-17 10:53:46', '2025-03-17 10:53:46'),
(9, 15, '2025-03-17 14:10:06', '2025-03-17 14:10:06'),
(10, 15, '2025-03-17 14:10:06', '2025-03-17 14:10:06'),
(11, 15, '2025-03-17 14:10:06', '2025-03-17 14:10:06'),
(12, 15, '2025-03-17 14:10:06', '2025-03-17 14:10:06'),
(13, 11, '2025-03-20 09:45:50', '2025-03-20 09:45:50'),
(14, 39, '2025-03-20 09:42:52', '2025-03-20 09:42:52'),
(15, 52, '2025-03-20 09:39:10', '2025-03-20 09:39:10'),
(16, 52, '2025-03-20 09:39:10', '2025-03-20 09:39:10'),
(17, 50, '2025-03-31 08:46:26', '2025-03-31 08:46:26'),
(18, 10, '2025-03-20 09:28:50', '2025-09-25 14:24:09'),
(19, 10, '2025-03-20 09:28:50', '2025-09-25 14:24:09'),
(21, 15, '2025-03-20 09:23:55', '2025-03-20 09:23:55'),
(22, 15, '2025-03-20 09:23:55', '2025-03-20 09:23:55'),
(23, 46, '2025-03-20 09:17:20', '2025-03-20 09:17:20'),
(24, 14, '2025-03-20 09:10:58', '2025-03-20 09:10:58'),
(25, 10, '2025-03-20 09:13:55', '2025-09-25 14:24:09'),
(26, 10, '2025-03-20 09:13:55', '2025-09-25 14:24:09'),
(28, 10, '2025-03-20 09:28:50', '2025-09-25 14:24:09'),
(29, 59, '2025-03-19 04:09:11', '2025-03-19 04:09:11'),
(33, 59, '2025-03-19 04:09:11', '2025-03-19 04:09:11'),
(31, 59, '2025-03-19 04:09:11', '2025-03-19 04:09:11'),
(32, 59, '2025-03-19 04:09:11', '2025-03-19 04:09:11'),
(34, 61, '2025-03-19 07:07:37', '2025-03-19 07:07:37'),
(35, 61, '2025-03-19 07:07:37', '2025-03-19 07:07:37'),
(36, 61, '2025-03-19 07:07:37', '2025-03-19 07:07:37'),
(37, 61, '2025-03-19 07:05:51', '2025-03-19 07:05:51'),
(38, 60, '2025-03-19 15:04:27', '2025-03-19 15:04:27'),
(39, 14, '2025-03-19 15:04:27', '2025-03-19 15:04:27'),
(39, 60, '2025-03-19 15:04:27', '2025-03-19 15:04:27'),
(40, 14, '2025-03-19 15:04:27', '2025-03-19 15:04:27'),
(40, 60, '2025-03-19 15:04:27', '2025-03-19 15:04:27'),
(41, 8, '2025-03-20 07:07:53', '2025-03-20 07:07:53'),
(42, 30, '2025-03-26 14:03:52', '2025-04-07 14:57:23'),
(43, 30, '2025-03-26 14:03:52', '2025-04-07 14:57:23'),
(44, 61, '2025-03-26 14:09:53', '2025-03-26 14:09:53'),
(44, 30, '2025-03-26 14:09:53', '2025-04-07 14:57:23'),
(45, 30, '2025-03-26 14:11:26', '2025-04-07 14:57:23'),
(46, 30, '2025-03-26 14:11:26', '2025-04-07 14:57:23'),
(47, 30, '2025-03-27 14:17:21', '2025-03-27 14:17:21'),
(47, 10, '2025-03-27 14:17:21', '2025-09-25 14:24:09'),
(48, 30, '2025-03-27 14:18:41', '2025-03-27 14:18:41'),
(49, 30, '2025-03-27 14:18:41', '2025-03-27 14:18:41'),
(50, 10, '2025-03-27 14:18:41', '2025-09-25 14:24:09'),
(50, 30, '2025-03-27 14:18:41', '2025-03-27 14:18:41'),
(51, 10, '2025-07-10 14:42:06', '2025-09-25 14:24:09'),
(52, 10, '2025-07-10 14:42:06', '2025-09-25 14:24:09'),
(53, 30, '2025-07-10 14:50:01', '2025-07-10 14:50:01'),
(54, 30, '2025-07-10 14:50:01', '2025-07-10 14:50:01'),
(55, 112, '2025-09-25 14:25:03', '2025-09-25 14:25:03'),
(56, 10, '2025-04-01 09:54:03', '2025-09-25 14:24:09'),
(57, 10, '2025-04-01 09:54:03', '2025-09-25 14:24:09'),
(58, 10, '2025-04-03 14:48:45', '2025-09-25 14:24:09'),
(59, 10, '2025-04-03 14:48:45', '2025-09-25 14:24:09'),
(60, 10, '2025-04-03 14:48:45', '2025-09-25 14:24:09'),
(61, 10, '2025-04-03 14:48:45', '2025-09-25 14:24:09'),
(62, 10, '2025-04-07 14:23:07', '2025-09-25 14:24:09'),
(63, 10, '2025-04-07 14:23:07', '2025-09-25 14:24:09'),
(64, 99, '2025-04-17 06:12:40', '2025-04-17 06:12:40'),
(65, 99, '2025-04-17 06:12:40', '2025-04-17 06:12:40'),
(66, 99, '2025-04-17 06:13:15', '2025-04-17 06:13:15'),
(67, 99, '2025-04-17 06:13:15', '2025-04-17 06:13:15'),
(68, 30, '2025-04-17 16:32:42', '2025-04-17 16:32:42'),
(69, 30, '2025-04-17 16:32:42', '2025-04-17 16:32:42'),
(70, 100, '2025-04-17 16:34:25', '2025-04-17 16:34:25'),
(71, 100, '2025-04-17 16:34:25', '2025-04-17 16:34:25'),
(72, 100, '2025-04-17 16:34:25', '2025-04-17 16:34:25'),
(73, 88, '2025-05-02 12:48:55', '2025-05-02 12:48:55'),
(74, 88, '2025-05-02 12:48:55', '2025-05-02 12:48:55'),
(75, 88, '2025-05-23 07:03:29', '2025-05-23 07:03:29'),
(76, 60, '2025-06-10 16:04:28', '2025-06-10 16:04:28'),
(77, 60, '2025-06-10 16:04:28', '2025-06-10 16:04:28'),
(78, 53, '2025-07-10 14:49:24', '2025-07-10 14:49:24'),
(79, 60, '2025-07-10 14:49:24', '2025-07-10 14:49:24'),
(80, 60, '2025-06-10 16:04:28', '2025-06-10 16:04:28'),
(80, 10, '2025-06-10 16:04:28', '2025-09-25 14:24:09'),
(79, 53, '2025-07-10 14:49:24', '2025-07-10 14:49:24'),
(81, 53, '2025-07-10 14:49:24', '2025-07-10 14:49:24'),
(81, 61, '2025-07-10 14:49:24', '2025-07-10 14:49:24'),
(80, 61, '2025-06-10 16:04:28', '2025-06-10 16:04:28'),
(82, 10, '2025-06-26 12:57:14', '2025-09-25 14:24:09'),
(83, 10, '2025-06-26 12:57:14', '2025-09-25 14:24:09'),
(84, 10, '2025-07-12 14:19:47', '2025-09-25 14:24:09'),
(85, 10, '2025-07-12 14:19:47', '2025-09-25 14:24:09'),
(86, 30, '2025-07-10 14:44:00', '2025-07-10 14:44:00'),
(87, 30, '2025-07-10 14:44:00', '2025-07-10 14:44:00'),
(88, 30, '2025-07-10 14:44:00', '2025-07-10 14:44:00'),
(53, 53, '2025-07-10 14:50:01', '2025-07-10 14:50:01'),
(79, 61, '2025-07-10 14:49:24', '2025-07-10 14:49:24'),
(78, 61, '2025-07-10 14:49:24', '2025-07-10 14:49:24'),
(54, 53, '2025-07-10 14:50:01', '2025-07-10 14:50:01'),
(89, 53, '2025-07-14 15:32:52', '2025-07-14 15:32:52'),
(90, 53, '2025-07-14 15:32:52', '2025-07-14 15:32:52'),
(100, 80, '2025-07-24 16:22:43', '2025-07-24 16:22:43'),
(92, 53, '2025-07-12 14:35:02', '2025-07-12 14:35:02'),
(93, 53, '2025-07-12 14:35:02', '2025-07-12 14:35:02'),
(94, 53, '2025-07-12 14:35:02', '2025-07-12 14:35:02'),
(95, 53, '2025-07-12 14:35:02', '2025-07-12 14:35:02'),
(84, 53, '2025-07-12 14:19:47', '2025-07-12 14:19:47'),
(85, 53, '2025-07-12 14:19:47', '2025-07-12 14:19:47'),
(94, 10, '2025-07-12 14:35:02', '2025-09-25 14:24:09'),
(93, 10, '2025-07-12 14:35:02', '2025-09-25 14:24:09'),
(92, 10, '2025-07-12 14:35:02', '2025-09-25 14:24:09'),
(96, 53, '2025-07-22 15:29:43', '2025-07-22 15:29:43'),
(97, 53, '2025-07-22 15:29:43', '2025-07-22 15:29:43'),
(98, 53, '2025-07-22 15:29:43', '2025-07-22 15:29:43'),
(99, 53, '2025-07-22 15:29:43', '2025-07-22 15:29:43'),
(102, 88, '2025-07-31 15:45:30', '2025-07-31 15:45:30'),
(101, 80, '2025-07-24 16:22:43', '2025-07-24 16:22:43'),
(91, 53, '2025-07-14 15:32:52', '2025-07-14 15:32:52'),
(95, 10, '2025-07-12 14:35:02', '2025-09-25 14:24:09'),
(103, 52, '2025-08-01 14:01:37', '2025-08-01 14:01:37'),
(104, 52, '2025-08-01 14:01:37', '2025-08-01 14:01:37'),
(105, 80, '2025-08-01 14:59:42', '2025-08-01 14:59:42'),
(106, 80, '2025-08-01 14:59:42', '2025-08-01 14:59:42'),
(107, 80, '2025-08-01 14:59:42', '2025-08-01 14:59:42'),
(108, 60, '2025-08-05 13:43:48', '2025-08-05 13:43:48'),
(109, 60, '2025-08-05 13:43:48', '2025-08-05 13:43:48'),
(110, 60, '2025-08-05 13:43:48', '2025-08-05 13:43:48'),
(111, 48, '2025-08-11 14:51:12', '2025-08-11 14:51:12'),
(112, 48, '2025-08-11 14:51:12', '2025-08-11 14:51:12'),
(113, 48, '2025-08-11 14:51:12', '2025-08-11 14:51:12'),
(114, 48, '2025-08-11 15:21:28', '2025-08-11 15:21:28'),
(115, 48, '2025-08-11 15:21:28', '2025-08-11 15:21:28'),
(116, 48, '2025-08-11 15:21:28', '2025-08-11 15:21:28'),
(117, 48, '2025-08-18 13:06:17', '2025-08-18 13:06:17'),
(118, 48, '2025-08-18 13:06:17', '2025-08-18 13:06:17'),
(119, 48, '2025-08-18 13:06:17', '2025-08-18 13:06:17'),
(120, 48, '2025-08-13 14:58:27', '2025-08-13 14:58:27'),
(121, 48, '2025-08-13 14:58:27', '2025-08-13 14:58:27'),
(122, 48, '2025-08-18 13:06:17', '2025-08-18 13:06:17'),
(123, 48, '2025-08-18 13:06:17', '2025-08-18 13:06:17'),
(124, 48, '2025-08-18 13:06:17', '2025-08-18 13:06:17'),
(125, 48, '2025-08-18 13:06:17', '2025-08-18 13:06:17'),
(126, 48, '2025-08-18 13:06:17', '2025-08-18 13:06:17'),
(127, 10, '2025-08-20 11:59:59', '2025-10-06 12:35:29'),
(128, 10, '2025-08-20 11:59:59', '2025-10-06 12:35:29'),
(129, 10, '2025-08-20 11:59:59', '2025-10-06 12:35:29'),
(130, 10, '2025-08-20 11:59:59', '2025-10-06 12:35:29'),
(131, 10, '2025-08-20 11:59:59', '2025-10-06 12:35:29'),
(132, 10, '2025-08-20 11:59:59', '2025-10-06 12:35:29'),
(133, 10, '2025-08-20 11:59:59', '2025-10-06 12:35:29'),
(134, 10, '2025-08-20 11:59:59', '2025-10-06 12:35:29'),
(135, 10, '2025-08-20 12:00:00', '2025-10-06 12:35:29'),
(136, 10, '2025-08-23 12:58:51', '2025-10-06 12:35:29'),
(137, 10, '2025-08-23 12:58:51', '2025-10-06 12:35:29'),
(137, 40, '2025-08-23 12:58:51', '2025-08-23 12:58:51'),
(138, 10, '2025-08-23 12:58:51', '2025-10-06 12:35:29'),
(139, 10, '2025-08-20 13:13:14', '2025-09-25 14:24:09'),
(140, 10, '2025-08-20 13:13:14', '2025-09-25 14:24:09'),
(141, 10, '2025-08-20 13:13:14', '2025-09-25 14:24:09'),
(138, 112, '2025-08-23 12:58:51', '2025-08-23 12:58:51'),
(142, 111, '2025-08-23 13:03:22', '2025-08-23 13:03:22'),
(143, 111, '2025-08-23 13:03:22', '2025-08-23 13:03:22'),
(142, 112, '2025-08-23 13:03:22', '2025-08-23 13:03:22'),
(144, 10, '2025-09-04 14:13:15', '2025-09-25 14:24:09'),
(145, 10, '2025-09-04 14:13:15', '2025-09-25 14:24:09'),
(146, 10, '2025-09-22 15:17:56', '2025-09-25 14:24:09'),
(147, 10, '2025-09-22 15:17:56', '2025-09-25 14:24:09'),
(148, 10, '2025-09-22 15:17:56', '2025-09-25 14:24:09'),
(149, 10, '2025-09-22 15:17:56', '2025-09-25 14:24:09'),
(150, 10, '2025-09-22 15:17:56', '2025-09-25 14:24:09'),
(151, 10, '2025-09-22 15:17:56', '2025-09-25 14:24:09'),
(152, 10, '2025-09-22 15:17:56', '2025-09-25 14:24:09'),
(153, 10, '2025-09-22 15:17:56', '2025-09-25 14:24:09'),
(154, 10, '2025-09-22 15:17:56', '2025-09-25 14:24:09'),
(155, 10, '2025-09-22 15:17:56', '2025-09-25 14:24:09'),
(156, 10, '2025-09-22 15:17:56', '2025-09-25 14:24:09'),
(157, 10, '2025-09-22 15:17:56', '2025-09-25 14:24:09'),
(158, 10, '2025-09-22 15:17:56', '2025-09-25 14:24:09'),
(159, 10, '2025-09-22 15:17:56', '2025-09-25 14:24:09'),
(160, 10, '2025-09-22 15:17:56', '2025-09-25 14:24:09'),
(161, 10, '2025-09-22 15:17:56', '2025-09-25 14:24:09'),
(162, 111, '2025-09-27 12:58:00', '2025-09-27 12:58:00'),
(163, 111, '2025-09-27 12:58:00', '2025-09-27 12:58:00'),
(163, 80, '2025-09-27 12:58:00', '2025-09-27 12:58:00'),
(164, 112, '2025-09-29 06:33:20', '2025-09-29 06:33:20'),
(164, 88, '2025-09-29 06:33:20', '2025-09-29 06:33:20'),
(165, 112, '2025-10-04 13:23:31', '2025-10-04 13:23:31'),
(165, 10, '2025-10-04 13:23:31', '2025-10-06 12:35:29'),
(166, 112, '2025-10-04 13:23:31', '2025-10-04 13:23:31');

-- --------------------------------------------------------

--
-- Table structure for table `customer_service_task`
--

CREATE TABLE `customer_service_task` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customer_source`
--

CREATE TABLE `customer_source` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `customer_source`
--

INSERT INTO `customer_source` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Digital - Social Media', '1', '2024-10-22 10:15:32', '2024-10-22 22:21:18'),
(2, 'Digital - SEO (Non Organic)', '1', '2024-10-22 22:21:37', '2024-10-22 22:21:37'),
(3, 'Digital - SEO (Organic)', '1', '2024-10-22 22:21:54', '2024-10-22 22:21:54'),
(4, 'Digital - PPC', '1', '2024-10-22 22:22:08', '2024-10-22 22:22:08'),
(5, 'Digital - Email', '1', '2024-10-22 22:22:18', '2024-10-22 22:22:18'),
(6, 'Digital - Newsletter', '1', '2024-10-22 22:22:32', '2024-10-22 22:22:32'),
(7, 'Event', '1', '2024-10-22 22:23:06', '2024-10-22 22:23:06'),
(8, 'Referral', '1', '2024-10-22 22:23:13', '2024-10-22 22:23:13'),
(9, 'Partner', '1', '2024-10-22 22:23:22', '2024-10-22 22:23:22'),
(10, 'Data Subscription', '1', '2024-10-22 22:23:31', '2024-10-22 22:23:31'),
(11, 'Affiliate', '1', '2024-10-22 22:23:40', '2024-10-22 22:23:40'),
(12, 'Phone/Calling', '1', '2024-10-22 22:23:54', '2024-10-22 22:23:54'),
(13, 'Other', '1', '2024-10-22 22:24:00', '2024-10-22 22:24:00');

-- --------------------------------------------------------

--
-- Table structure for table `customer_sub_source`
--

CREATE TABLE `customer_sub_source` (
  `id` int(11) NOT NULL,
  `customer_source_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `customer_sub_source`
--

INSERT INTO `customer_sub_source` (`id`, `customer_source_id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'x', '1', '2024-10-22 10:15:39', '2024-10-22 10:15:39'),
(2, 1, 'y', '1', '2024-10-22 10:15:44', '2024-10-22 10:15:44'),
(3, 1, 'z', '1', '2024-10-22 10:15:49', '2024-10-22 10:15:49'),
(4, 13, 'Other', '1', '2024-10-22 22:24:15', '2024-10-22 22:24:15'),
(5, 12, 'Cold Calling', '1', '2024-10-22 22:24:46', '2024-10-22 22:24:46'),
(6, 4, 'Google', '1', '2024-10-22 22:27:32', '2024-10-22 22:27:32'),
(7, 4, 'Bing', '1', '2024-10-22 22:27:38', '2024-10-22 22:27:38'),
(8, 7, 'Accountex London', '1', '2024-10-22 22:27:59', '2024-10-22 22:27:59'),
(9, 7, 'Accountex Manchester/North', '1', '2024-10-22 22:28:16', '2024-10-22 22:28:16'),
(10, 7, 'Digital Accountancy Show', '1', '2024-10-22 22:28:27', '2024-10-22 22:28:27'),
(11, 7, 'TAG Conference', '1', '2024-10-22 22:28:40', '2024-10-22 22:28:40'),
(12, 9, 'Nomi', '1', '2024-10-22 22:29:47', '2024-10-22 22:29:47'),
(13, 9, 'Your Books', '1', '2024-10-22 22:30:01', '2024-10-22 22:30:01'),
(14, 8, 'DNS', '1', '2024-11-09 08:49:46', '2024-11-09 08:49:46'),
(16, 8, 'Ash Hall (Engager App)', '1', '2025-01-07 14:00:25', '2025-01-07 14:00:25');

-- --------------------------------------------------------

--
-- Stand-in structure for view `dashboard_data_view`
-- (See below for the actual view)
--
CREATE TABLE `dashboard_data_view` (
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
,`sp_customer_id` int(11)
);

-- --------------------------------------------------------

--
-- Table structure for table `drafts`
--

CREATE TABLE `drafts` (
  `id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `draft_sent_on` date DEFAULT NULL,
  `draft_title` varchar(100) DEFAULT NULL,
  `final_draft_sent_on` date DEFAULT NULL,
  `feedback_received` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: Yes',
  `updated_amendment` enum('1','2','3','4') NOT NULL DEFAULT '1' COMMENT '1:Amendment, 2: Update ,2: Both ,2: None',
  `feedback` text DEFAULT NULL,
  `was_it_complete` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: No, 1: Yes',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `drafts`
--

INSERT INTO `drafts` (`id`, `job_id`, `draft_sent_on`, `draft_title`, `final_draft_sent_on`, `feedback_received`, `updated_amendment`, `feedback`, `was_it_complete`, `created_at`, `updated_at`) VALUES
(1, 7, '2025-03-19', 'D_00001', NULL, '0', '1', NULL, '0', '2025-03-31 06:19:09', '2025-03-31 06:19:09'),
(2, 22, '2025-07-10', 'D_00001', '2025-07-10', '1', '4', 'test', '1', '2025-07-10 13:58:24', '2025-07-10 13:58:24'),
(3, 22, '2025-07-10', 'D_00002', '2025-07-10', '1', '1', 'test', '1', '2025-07-10 13:58:53', '2025-07-10 13:58:53'),
(4, 24, '2025-07-10', 'D_00001', '2025-07-10', '1', '4', 'test', '1', '2025-07-10 14:06:21', '2025-07-10 14:06:21'),
(5, 27, '2025-07-12', 'D_00001', '2025-10-25', '1', '4', 'test', '1', '2025-07-12 14:11:39', '2025-10-25 13:40:17'),
(6, 79, '2025-10-24', 'D_00001', NULL, '0', '1', NULL, '0', '2025-10-24 09:45:54', '2025-10-24 09:45:54'),
(7, 81, '2025-10-25', 'D_00001', '2025-10-25', '1', '1', '454', '1', '2025-10-25 11:04:49', '2025-10-25 11:04:49'),
(8, 56, '2025-10-25', 'D_00001', '2025-10-25', '1', '1', 'tet', '1', '2025-10-25 12:19:40', '2025-10-25 12:20:05'),
(9, 37, '2025-10-25', 'D_00001', NULL, '1', '1', 'test', '0', '2025-10-25 13:41:55', '2025-10-25 13:41:55'),
(10, 27, '2025-10-27', 'D_00002', NULL, '1', '2', 'ihjhihihghg', '0', '2025-10-27 06:12:21', '2025-10-27 06:12:21'),
(11, 37, '2025-10-27', 'D_00002', '2025-10-27', '1', '4', 'Test', '1', '2025-10-27 06:42:04', '2025-10-27 06:42:45');

-- --------------------------------------------------------

--
-- Table structure for table `incorporation_in`
--

CREATE TABLE `incorporation_in` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `incorporation_in`
--

INSERT INTO `incorporation_in` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'England & Wales', '1', '2024-10-22 10:15:10', '2024-10-22 22:18:12'),
(2, 'Scotland', '1', '2024-10-22 22:18:20', '2024-10-22 22:18:20'),
(3, 'Northern Ireland', '1', '2024-10-22 22:18:28', '2024-10-22 22:18:28'),
(4, 'United Kingdom', '1', '2024-10-22 22:18:38', '2024-10-22 22:18:38'),
(5, 'England', '1', '2024-10-22 22:18:45', '2024-10-22 22:18:45'),
(6, 'Wales', '1', '2024-10-22 22:18:52', '2024-10-22 22:18:52'),
(7, 'Great Britain', '1', '2024-10-22 22:19:05', '2024-10-22 22:19:05'),
(9, 'Ireland', '1', '2025-03-18 10:37:45', '2025-03-18 10:37:45');

-- --------------------------------------------------------

--
-- Table structure for table `internal`
--

CREATE TABLE `internal` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `internal`
--

INSERT INTO `internal` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Training', '1', '2024-10-22 10:17:13', '2024-10-22 22:32:43'),
(2, 'National Holiday', '1', '2024-10-22 22:32:58', '2024-10-22 22:32:58'),
(3, 'Leave', '1', '2024-10-22 22:33:10', '2024-10-22 22:33:10'),
(4, 'IT Support', '1', '2024-10-22 22:35:32', '2024-10-22 22:35:32'),
(5, 'Marketing', '1', '2024-11-09 08:36:31', '2025-01-04 17:57:32'),
(10, 'Test', '1', '2025-10-10 16:17:53', '2025-10-10 16:17:53');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int(11) NOT NULL,
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
  `currency` int(11) DEFAULT 0,
  `invoice_value` decimal(15,2) DEFAULT NULL,
  `invoice_date` date DEFAULT NULL,
  `invoice_hours` varchar(100) DEFAULT NULL,
  `invoice_remark` text DEFAULT NULL,
  `status_type` int(11) DEFAULT NULL,
  `total_hours` varchar(100) DEFAULT NULL,
  `total_hours_status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `notes` longtext DEFAULT NULL,
  `Turnover_Period_id_0` varchar(255) DEFAULT NULL,
  `Turnover_Currency_id_0` varchar(255) DEFAULT NULL,
  `Turnover_id_0` int(11) DEFAULT NULL,
  `VAT_Registered_id_0` varchar(255) DEFAULT NULL,
  `VAT_Frequency_id_0` varchar(255) DEFAULT NULL,
  `Who_Did_The_Bookkeeping_id_1` varchar(255) DEFAULT NULL,
  `PAYE_Registered_id_1` varchar(255) DEFAULT NULL,
  `Number_of_Trial_Balance_Items_id_1` varchar(255) DEFAULT NULL,
  `Year_Ending_id_1` date DEFAULT NULL,
  `Bookkeeping_Frequency_id_2` varchar(255) DEFAULT NULL,
  `Day_Date_id_2` date DEFAULT NULL,
  `Week_Year_id_2` varchar(100) DEFAULT NULL,
  `Week_Month_id_2` varchar(100) DEFAULT NULL,
  `Week_id_2` varchar(100) DEFAULT NULL,
  `Fortnight_Year_id_2` varchar(100) DEFAULT NULL,
  `Fortnight_Month_id_2` varchar(100) DEFAULT NULL,
  `Fortnight_id_2` varchar(100) DEFAULT NULL,
  `Month_Year_id_2` varchar(100) DEFAULT NULL,
  `Month_id_2` varchar(100) DEFAULT NULL,
  `Quarter_Year_id_2` varchar(100) DEFAULT NULL,
  `Quarter_id_2` varchar(100) DEFAULT NULL,
  `Year_id_2` varchar(100) DEFAULT NULL,
  `Other_FromDate_id_2` date DEFAULT NULL,
  `Other_ToDate_id_2` date DEFAULT NULL,
  `Number_of_Total_Transactions_id_2` int(11) DEFAULT NULL,
  `Number_of_Bank_Transactions_id_2` int(11) DEFAULT NULL,
  `Number_of_Purchase_Invoices_id_2` int(11) DEFAULT NULL,
  `Number_of_Sales_Invoices_id_2` int(11) DEFAULT NULL,
  `Number_of_Petty_Cash_Transactions_id_2` int(11) DEFAULT NULL,
  `Number_of_Journal_Entries_id_2` int(11) DEFAULT NULL,
  `Number_of_Other_Transactions_id_2` int(11) DEFAULT NULL,
  `Transactions_Posting_id_2` varchar(255) DEFAULT NULL,
  `Quality_of_Paperwork_id_2` varchar(255) DEFAULT NULL,
  `Number_of_Integration_Software_Platforms_id_2` varchar(255) DEFAULT NULL,
  `CIS_id_2` varchar(255) DEFAULT NULL,
  `Posting_Payroll_Journals_id_2` varchar(255) DEFAULT NULL,
  `Department_Tracking_id_2` varchar(255) DEFAULT NULL,
  `Sales_Reconciliation_Required_id_2` varchar(255) DEFAULT NULL,
  `Factoring_Account_id_2` varchar(255) DEFAULT NULL,
  `Payment_Methods_id_2` varchar(255) DEFAULT NULL,
  `Payroll_Frequency_id_3` varchar(255) DEFAULT NULL,
  `Payroll_Week_Year_id_3` varchar(100) DEFAULT NULL,
  `Payroll_Week_Month_id_3` varchar(100) DEFAULT NULL,
  `Payroll_Week_id_3` varchar(100) DEFAULT NULL,
  `Payroll_Fortnight_Year_id_3` varchar(100) DEFAULT NULL,
  `Payroll_Fortnight_Month_id_3` varchar(100) DEFAULT NULL,
  `Payroll_Fortnight_id_3` varchar(100) DEFAULT NULL,
  `Payroll_Month_Year_id_3` varchar(100) DEFAULT NULL,
  `Payroll_Month_id_3` varchar(100) DEFAULT NULL,
  `Payroll_Quarter_Year_id_3` varchar(100) DEFAULT NULL,
  `Payroll_Quarter_id_3` varchar(100) DEFAULT NULL,
  `Payroll_Year_id_3` varchar(100) DEFAULT NULL,
  `Type_of_Payslip_id_3` varchar(255) DEFAULT NULL,
  `Percentage_of_Variable_Payslips_id_3` varchar(255) DEFAULT NULL,
  `Is_CIS_Required_id_3` varchar(255) DEFAULT NULL,
  `CIS_Frequency_id_3` varchar(255) DEFAULT NULL,
  `Number_of_Sub_contractors_id_3` int(11) DEFAULT NULL,
  `Whose_Tax_Return_is_it_id_4` varchar(255) DEFAULT NULL,
  `Number_of_Income_Sources_id_4` varchar(255) DEFAULT NULL,
  `If_Landlord_Number_of_Properties_id_4` varchar(255) DEFAULT NULL,
  `If_Sole_Trader_Who_is_doing_Bookkeeping_id_4` varchar(255) DEFAULT NULL,
  `Tax_Year_id_4` varchar(100) DEFAULT NULL,
  `Management_Accounts_Frequency_id_6` varchar(255) DEFAULT NULL,
  `Management_Accounts_FromDate_id_6` date DEFAULT NULL,
  `Management_Accounts_ToDate_id_6` date DEFAULT NULL,
  `Year_id_33` varchar(100) DEFAULT NULL,
  `Period_id_32` varchar(100) DEFAULT NULL,
  `Day_Date_id_32` date DEFAULT NULL,
  `Week_Year_id_32` varchar(100) DEFAULT NULL,
  `Week_Month_id_32` varchar(100) DEFAULT NULL,
  `Week_id_32` varchar(100) DEFAULT NULL,
  `Fortnight_Year_id_32` varchar(100) DEFAULT NULL,
  `Fortnight_Month_id_32` varchar(100) DEFAULT NULL,
  `Fortnight_id_32` varchar(100) DEFAULT NULL,
  `Month_Year_id_32` varchar(100) DEFAULT NULL,
  `Month_id_32` varchar(100) DEFAULT NULL,
  `Quarter_Year_id_32` varchar(100) DEFAULT NULL,
  `Quarter_id_32` varchar(100) DEFAULT NULL,
  `Year_id_32` varchar(100) DEFAULT NULL,
  `Other_FromDate_id_32` date DEFAULT NULL,
  `Other_ToDate_id_32` date DEFAULT NULL,
  `Payroll_Frequency_id_31` varchar(100) DEFAULT NULL,
  `Payroll_Week_Year_id_31` varchar(100) DEFAULT NULL,
  `Payroll_Week_Month_id_31` varchar(100) DEFAULT NULL,
  `Payroll_Week_id_31` varchar(100) DEFAULT NULL,
  `Payroll_Fortnight_Year_id_31` varchar(100) DEFAULT NULL,
  `Payroll_Fortnight_Month_id_31` varchar(100) DEFAULT NULL,
  `Payroll_Fortnight_id_31` varchar(100) DEFAULT NULL,
  `Payroll_Month_Year_id_31` varchar(100) DEFAULT NULL,
  `Payroll_Month_id_31` varchar(100) DEFAULT NULL,
  `Payroll_Quarter_Year_id_31` varchar(100) DEFAULT NULL,
  `Payroll_Quarter_id_31` varchar(100) DEFAULT NULL,
  `Payroll_Year_id_31` varchar(100) DEFAULT NULL,
  `Audit_Year_Ending_id_27` date DEFAULT NULL,
  `Filing_Frequency_id_8` varchar(100) DEFAULT NULL,
  `Period_Ending_Date_id_8` date DEFAULT NULL,
  `Filing_Date_id_8` date DEFAULT NULL,
  `Year_id_28` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `staff_created_id`, `job_id`, `account_manager_id`, `customer_id`, `client_id`, `client_job_code`, `customer_contact_details_id`, `service_id`, `job_type_id`, `budgeted_hours`, `reviewer`, `allocated_to`, `allocated_on`, `date_received_on`, `year_end`, `total_preparation_time`, `review_time`, `feedback_incorporation_time`, `total_time`, `engagement_model`, `expected_delivery_date`, `due_on`, `submission_deadline`, `customer_deadline_date`, `sla_deadline_date`, `internal_deadline_date`, `filing_Companies_required`, `filing_Companies_date`, `filing_hmrc_required`, `filing_hmrc_date`, `opening_balance_required`, `opening_balance_date`, `number_of_transaction`, `number_of_balance_items`, `turnover`, `number_of_employees`, `vat_reconciliation`, `bookkeeping`, `processing_type`, `invoiced`, `currency`, `invoice_value`, `invoice_date`, `invoice_hours`, `invoice_remark`, `status_type`, `total_hours`, `total_hours_status`, `notes`, `Turnover_Period_id_0`, `Turnover_Currency_id_0`, `Turnover_id_0`, `VAT_Registered_id_0`, `VAT_Frequency_id_0`, `Who_Did_The_Bookkeeping_id_1`, `PAYE_Registered_id_1`, `Number_of_Trial_Balance_Items_id_1`, `Year_Ending_id_1`, `Bookkeeping_Frequency_id_2`, `Day_Date_id_2`, `Week_Year_id_2`, `Week_Month_id_2`, `Week_id_2`, `Fortnight_Year_id_2`, `Fortnight_Month_id_2`, `Fortnight_id_2`, `Month_Year_id_2`, `Month_id_2`, `Quarter_Year_id_2`, `Quarter_id_2`, `Year_id_2`, `Other_FromDate_id_2`, `Other_ToDate_id_2`, `Number_of_Total_Transactions_id_2`, `Number_of_Bank_Transactions_id_2`, `Number_of_Purchase_Invoices_id_2`, `Number_of_Sales_Invoices_id_2`, `Number_of_Petty_Cash_Transactions_id_2`, `Number_of_Journal_Entries_id_2`, `Number_of_Other_Transactions_id_2`, `Transactions_Posting_id_2`, `Quality_of_Paperwork_id_2`, `Number_of_Integration_Software_Platforms_id_2`, `CIS_id_2`, `Posting_Payroll_Journals_id_2`, `Department_Tracking_id_2`, `Sales_Reconciliation_Required_id_2`, `Factoring_Account_id_2`, `Payment_Methods_id_2`, `Payroll_Frequency_id_3`, `Payroll_Week_Year_id_3`, `Payroll_Week_Month_id_3`, `Payroll_Week_id_3`, `Payroll_Fortnight_Year_id_3`, `Payroll_Fortnight_Month_id_3`, `Payroll_Fortnight_id_3`, `Payroll_Month_Year_id_3`, `Payroll_Month_id_3`, `Payroll_Quarter_Year_id_3`, `Payroll_Quarter_id_3`, `Payroll_Year_id_3`, `Type_of_Payslip_id_3`, `Percentage_of_Variable_Payslips_id_3`, `Is_CIS_Required_id_3`, `CIS_Frequency_id_3`, `Number_of_Sub_contractors_id_3`, `Whose_Tax_Return_is_it_id_4`, `Number_of_Income_Sources_id_4`, `If_Landlord_Number_of_Properties_id_4`, `If_Sole_Trader_Who_is_doing_Bookkeeping_id_4`, `Tax_Year_id_4`, `Management_Accounts_Frequency_id_6`, `Management_Accounts_FromDate_id_6`, `Management_Accounts_ToDate_id_6`, `Year_id_33`, `Period_id_32`, `Day_Date_id_32`, `Week_Year_id_32`, `Week_Month_id_32`, `Week_id_32`, `Fortnight_Year_id_32`, `Fortnight_Month_id_32`, `Fortnight_id_32`, `Month_Year_id_32`, `Month_id_32`, `Quarter_Year_id_32`, `Quarter_id_32`, `Year_id_32`, `Other_FromDate_id_32`, `Other_ToDate_id_32`, `Payroll_Frequency_id_31`, `Payroll_Week_Year_id_31`, `Payroll_Week_Month_id_31`, `Payroll_Week_id_31`, `Payroll_Fortnight_Year_id_31`, `Payroll_Fortnight_Month_id_31`, `Payroll_Fortnight_id_31`, `Payroll_Month_Year_id_31`, `Payroll_Month_id_31`, `Payroll_Quarter_Year_id_31`, `Payroll_Quarter_id_31`, `Payroll_Year_id_31`, `Audit_Year_Ending_id_27`, `Filing_Frequency_id_8`, `Period_Ending_Date_id_8`, `Filing_Date_id_8`, `Year_id_28`, `created_at`, `updated_at`) VALUES
(5, 1, '00005', 10, 78, 33, '', 31, 5, 9, '11:22', 0, 0, '2025-03-30', '2025-03-30', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2025-03-31', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-30 14:23:38', '2025-09-25 14:24:09'),
(4, 93, '00004', 30, 76, 27, '', 28, 5, 9, '01:00', 0, 0, '2025-03-29', '2025-03-29', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2025-03-30', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-29 14:03:44', '2025-06-20 09:33:13'),
(3, 2, '00003', 30, 79, 31, '', 32, 4, 12, '00:00', 68, 83, '2025-03-28', '2025-03-29', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-04-03', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-29 13:53:48', '2025-03-29 13:53:48'),
(6, 1, '00006', 93, 80, 36, '', 33, 10, 26, '11:22', 0, 0, '2025-03-30', '2025-03-30', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2025-03-31', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-30 14:35:52', '2025-06-20 09:33:13'),
(7, 10, '00007', 10, 9, 7, 'PIN108', 5, 6, 7, '08:30', 23, 49, '2025-03-17', '2025-03-16', '', '06:30', '01:30', '00:30', '08:30', 'adhoc_payg_hourly', '2025-03-19', NULL, NULL, '2025-03-19', '2025-04-19', '2025-03-19', '0', NULL, '0', NULL, '1', '2025-03-17', 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 21, '06:30', '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-31 06:13:45', '2025-03-31 06:36:29'),
(8, 47, '00008', 47, 6, 6, '', 3, 1, 21, '08:00', 68, 58, '2025-03-31', '2025-03-31', '', '12:00', '00:00', '00:00', '12:00', 'adhoc_payg_hourly', NULL, NULL, NULL, NULL, '2025-04-01', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Client', '1 to 5', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-31 06:15:16', '2025-03-31 06:15:16'),
(9, 60, '00009', 60, 71, 16, 'Astonia1', 22, 1, 22, '20:00', 0, 90, '2025-03-25', '2025-03-25', '', '00:00', '00:00', '00:00', '00:00', 'percentage_model', NULL, NULL, NULL, NULL, '2025-04-28', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 7, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Client', 'No', '51 to 75', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-31 06:51:23', '2025-04-01 12:23:07'),
(10, 7, '000010', 10, 2, 2, 'TMF001', 2, 1, 22, '16:00', 0, 20, '2025-03-18', '2025-03-18', '', '16:00', '00:00', '00:00', '16:00', 'percentage_model', '2025-03-25', NULL, NULL, NULL, '2025-04-28', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 3, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Customer', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-31 13:55:55', '2025-09-25 14:24:09'),
(11, 7, '000011', 10, 81, 37, '', 34, 1, 22, '10:00', 0, 84, '2025-04-01', '2025-04-01', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2025-04-29', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 3, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-01 09:59:55', '2025-09-25 14:24:09'),
(12, 60, '000012', 60, 71, 38, 'Astonia2', 22, 1, 22, '15:00', 0, 91, '2025-03-25', '2025-03-25', '', '16:00', '01:00', '01:00', '18:00', 'percentage_model', '2025-04-01', NULL, NULL, NULL, '2025-04-29', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 3, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Client', 'No', '51 to 75', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-01 12:19:06', '2025-04-01 12:19:06'),
(13, 34, '000013', 10, 82, 39, '', 35, 7, 5, '10:00', 0, 0, '2025-04-03', '2025-04-03', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-04-04', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 4, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-03 14:50:05', '2025-09-25 14:24:09'),
(14, 93, '000014', 60, 71, 16, '', 22, 8, 3, '01:01', 0, 0, '2025-04-03', '2025-04-03', '', '00:00', '00:00', '00:00', '00:00', 'percentage_model', NULL, NULL, NULL, NULL, '2025-04-04', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-03 15:35:29', '2025-06-20 09:33:13'),
(15, 93, '000015', 10, 83, 40, '', 36, 9, 25, '12:30', 0, 0, '2025-04-07', '2025-04-07', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-04-08', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 1, NULL, '1', NULL, 'Quarterly', 'GBP', 10000, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-07 14:24:36', '2025-09-25 14:24:09'),
(16, 93, '000016', 93, 85, 43, '', 38, 3, 14, '00:00', 0, 0, '2025-04-17', '2025-04-17', '', '00:00', '00:00', '00:00', '00:00', 'percentage_model', NULL, NULL, NULL, NULL, '2025-04-18', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-17 06:14:06', '2025-06-20 09:33:13'),
(17, 93, '000017', 30, 86, 44, '', 39, 3, 14, '00:00', 20, 65, '2025-04-17', '2025-04-17', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-04-18', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-17 16:33:22', '2025-06-20 09:33:13'),
(18, 93, '000018', 93, 87, 45, '', 40, 4, 12, '00:00', 20, 92, '2025-04-17', '2025-04-17', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-04-18', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 5, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-17 16:35:07', '2025-06-20 09:33:13'),
(19, 1, '000019', 88, 88, 46, '', 41, 3, 14, '00:00', 0, 0, '2025-05-02', '2025-05-02', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-05-03', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-05-02 12:50:40', '2025-05-02 12:50:40'),
(20, 61, '000020', 53, 91, 50, '', 44, 8, 3, '01:00', 0, 0, '2025-06-10', '2025-06-10', '', '00:00', '00:00', '00:00', '00:00', 'percentage_model', NULL, NULL, NULL, NULL, '2025-06-20', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-10 16:05:39', '2025-06-10 16:05:39'),
(21, 1, '000021', 10, 92, 51, '', 45, 2, 19, '01:00', 0, 0, '2025-06-26', '2025-06-26', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-06-27', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-26 13:01:40', '2025-09-25 14:24:09'),
(22, 36, '000022', 10, 94, 52, '', 47, 8, 4, '00:22', 68, 83, '2025-07-10', '2025-07-10', '', '00:30', '00:30', '00:30', '01:30', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-07-11', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 6, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-10 11:40:46', '2025-09-25 14:24:09'),
(23, 36, '000023', 10, 94, 53, '', 47, 8, 4, '11:30', 0, 81, '2025-07-10', '2025-07-10', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-07-11', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 8, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-10 11:48:37', '2025-09-25 14:24:09'),
(24, 36, '000024', 30, 78, 34, '', 31, 5, 9, '11:22', 23, 0, '2025-07-10', '2025-07-10', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-07-08', NULL, '1', NULL, '0', NULL, '1', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 6, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-10 14:04:53', '2025-07-10 14:07:21'),
(25, 30, '000025', 30, 94, 52, '', 47, 7, 5, '23:52', 0, 76, '2025-07-10', '2025-07-10', '', '00:00', '00:00', '00:00', '00:00', 'adhoc_payg_hourly', NULL, NULL, NULL, NULL, '2025-07-11', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 7, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-10 14:22:14', '2025-07-10 14:22:29'),
(26, 104, '000026', 10, 95, 55, 'ASPIRE_001', 48, 8, 3, '02:27', 0, 0, '2025-07-12', '2025-07-12', '', '00:00', '00:00', '00:00', '00:00', 'percentage_model', NULL, NULL, NULL, NULL, '2025-07-22', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-12 13:43:25', '2025-09-25 14:24:09'),
(27, 104, '000027', 10, 95, 55, '', 48, 2, 18, '23:52', 68, 102, '2025-07-12', '2025-07-12', '', '00:00', '00:00', '00:00', '00:00', 'percentage_model', NULL, NULL, NULL, NULL, '2025-10-26', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 21, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-12 13:46:36', '2025-10-27 06:12:21'),
(28, 104, '000028', 53, 97, 56, '', 50, 8, 3, '02:00', 0, 0, '2025-07-12', '2025-07-12', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-07-13', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-12 14:40:54', '2025-07-12 14:40:54'),
(29, 53, '000029', 53, 97, 56, '', 50, 7, 5, '03:01', 10, 10, '2025-07-23', '2025-07-23', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-07-24', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-23 14:00:45', '2025-09-25 14:24:09'),
(30, 53, '000030', 61, 91, 50, '', 44, 7, 5, '00:00', 10, 10, '2025-07-23', '2025-07-23', '', '00:00', '00:00', '00:00', '00:00', 'percentage_model', NULL, NULL, NULL, NULL, '2025-07-24', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-23 14:15:25', '2025-09-25 14:24:09'),
(31, 53, '000031', 53, 79, 31, '', 32, 5, 9, '00:00', 53, 53, '2025-07-23', '2025-07-23', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-07-24', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-23 14:16:37', '2025-07-23 14:16:37'),
(32, 103, '000032', 53, 93, 54, '', 46, 2, 20, '00:00', 10, 10, '2025-07-23', '2025-07-23', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-07-24', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-23 14:18:25', '2025-09-25 14:24:09'),
(33, 88, '000033', 88, 89, 58, '', 42, 1, 24, '00:00', 68, 88, '2025-07-24', '2025-07-24', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-07-25', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 5, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-24 16:13:43', '2025-07-24 16:19:41'),
(34, 80, '000034', 80, 98, 59, '', 52, 7, 5, '01:00', 88, 102, '2025-07-24', '2025-07-24', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-07-25', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-24 16:23:59', '2025-07-24 16:23:59'),
(35, 52, '000035', 52, 100, 60, '', 54, 7, 5, '16:37', 52, 52, '2025-08-01', '2025-08-01', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-02', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-01 14:03:51', '2025-08-01 14:03:51'),
(36, 52, '000036', 52, 20, 61, '', 10, 2, 19, '02:03', 61, 61, '2025-08-01', '2025-08-01', '', '00:00', '00:00', '00:00', '00:00', 'adhoc_payg_hourly', NULL, NULL, NULL, NULL, '2025-08-02', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 3, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-01 14:08:04', '2025-08-01 14:12:46'),
(37, 80, '000037', 80, 101, 62, '', 55, 7, 5, '01:03', 80, 80, '2025-08-01', '2025-08-01', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-02', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 6, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-01 15:01:15', '2025-10-27 06:42:45'),
(38, 80, '000038', 80, 101, 62, '', 55, 7, 5, '01:00', 88, 61, '2025-08-01', '2025-08-01', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-02', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 2, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-01 15:11:41', '2025-08-02 14:39:00'),
(39, 1, '000039', 80, 101, 62, '', 55, 7, 5, '00:00', 0, 0, '2025-08-05', '2025-08-05', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-06', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-05 13:31:59', '2025-08-05 13:31:59'),
(40, 60, '000040', 60, 102, 63, '', 56, 6, 7, '01:02', 0, 0, '2025-08-05', '2025-08-05', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-06', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-05 13:46:29', '2025-08-05 13:46:29'),
(41, 1, '000041', 60, 102, 63, '', 56, 6, 6, '01:01', 0, 0, '2025-08-05', '2025-08-05', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-06', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-05 13:51:04', '2025-08-05 13:51:04'),
(42, 48, '000042', 48, 103, 64, '', 57, 7, 5, '01:00', 14, 75, '2025-08-11', '2025-08-11', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-12', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-11 14:53:16', '2025-08-11 14:53:16'),
(43, 48, '000043', 48, 104, 65, '', 58, 6, 8, '01:00', 8, 10, '2025-08-11', '2025-08-11', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-12', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-11 15:23:39', '2025-09-25 14:24:09'),
(44, 48, '000044', 48, 105, 66, '', 59, 8, 4, '01:00', 51, 30, '2025-08-12', '2025-08-12', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-13', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-12 13:52:39', '2025-08-12 13:52:39'),
(45, 48, '000045', 48, 106, 68, '', 60, 8, 2, '01:00', 47, 42, '2025-08-13', '2025-08-13', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-14', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 15, NULL, '1', NULL, 'Quarterly', 'INR', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 14:59:54', '2025-08-13 15:04:34'),
(46, 48, '000046', 48, 106, 69, '', 60, 8, 2, '01:00', 20, 76, '2025-08-13', '2025-08-13', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-14', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 15:25:04', '2025-08-13 15:25:04'),
(47, 48, '000047', 48, 106, 70, '', 60, 8, 2, '01:00', 48, 48, '2025-08-13', '2025-08-13', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-14', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 15:34:34', '2025-08-13 15:34:34');
INSERT INTO `jobs` (`id`, `staff_created_id`, `job_id`, `account_manager_id`, `customer_id`, `client_id`, `client_job_code`, `customer_contact_details_id`, `service_id`, `job_type_id`, `budgeted_hours`, `reviewer`, `allocated_to`, `allocated_on`, `date_received_on`, `year_end`, `total_preparation_time`, `review_time`, `feedback_incorporation_time`, `total_time`, `engagement_model`, `expected_delivery_date`, `due_on`, `submission_deadline`, `customer_deadline_date`, `sla_deadline_date`, `internal_deadline_date`, `filing_Companies_required`, `filing_Companies_date`, `filing_hmrc_required`, `filing_hmrc_date`, `opening_balance_required`, `opening_balance_date`, `number_of_transaction`, `number_of_balance_items`, `turnover`, `number_of_employees`, `vat_reconciliation`, `bookkeeping`, `processing_type`, `invoiced`, `currency`, `invoice_value`, `invoice_date`, `invoice_hours`, `invoice_remark`, `status_type`, `total_hours`, `total_hours_status`, `notes`, `Turnover_Period_id_0`, `Turnover_Currency_id_0`, `Turnover_id_0`, `VAT_Registered_id_0`, `VAT_Frequency_id_0`, `Who_Did_The_Bookkeeping_id_1`, `PAYE_Registered_id_1`, `Number_of_Trial_Balance_Items_id_1`, `Year_Ending_id_1`, `Bookkeeping_Frequency_id_2`, `Day_Date_id_2`, `Week_Year_id_2`, `Week_Month_id_2`, `Week_id_2`, `Fortnight_Year_id_2`, `Fortnight_Month_id_2`, `Fortnight_id_2`, `Month_Year_id_2`, `Month_id_2`, `Quarter_Year_id_2`, `Quarter_id_2`, `Year_id_2`, `Other_FromDate_id_2`, `Other_ToDate_id_2`, `Number_of_Total_Transactions_id_2`, `Number_of_Bank_Transactions_id_2`, `Number_of_Purchase_Invoices_id_2`, `Number_of_Sales_Invoices_id_2`, `Number_of_Petty_Cash_Transactions_id_2`, `Number_of_Journal_Entries_id_2`, `Number_of_Other_Transactions_id_2`, `Transactions_Posting_id_2`, `Quality_of_Paperwork_id_2`, `Number_of_Integration_Software_Platforms_id_2`, `CIS_id_2`, `Posting_Payroll_Journals_id_2`, `Department_Tracking_id_2`, `Sales_Reconciliation_Required_id_2`, `Factoring_Account_id_2`, `Payment_Methods_id_2`, `Payroll_Frequency_id_3`, `Payroll_Week_Year_id_3`, `Payroll_Week_Month_id_3`, `Payroll_Week_id_3`, `Payroll_Fortnight_Year_id_3`, `Payroll_Fortnight_Month_id_3`, `Payroll_Fortnight_id_3`, `Payroll_Month_Year_id_3`, `Payroll_Month_id_3`, `Payroll_Quarter_Year_id_3`, `Payroll_Quarter_id_3`, `Payroll_Year_id_3`, `Type_of_Payslip_id_3`, `Percentage_of_Variable_Payslips_id_3`, `Is_CIS_Required_id_3`, `CIS_Frequency_id_3`, `Number_of_Sub_contractors_id_3`, `Whose_Tax_Return_is_it_id_4`, `Number_of_Income_Sources_id_4`, `If_Landlord_Number_of_Properties_id_4`, `If_Sole_Trader_Who_is_doing_Bookkeeping_id_4`, `Tax_Year_id_4`, `Management_Accounts_Frequency_id_6`, `Management_Accounts_FromDate_id_6`, `Management_Accounts_ToDate_id_6`, `Year_id_33`, `Period_id_32`, `Day_Date_id_32`, `Week_Year_id_32`, `Week_Month_id_32`, `Week_id_32`, `Fortnight_Year_id_32`, `Fortnight_Month_id_32`, `Fortnight_id_32`, `Month_Year_id_32`, `Month_id_32`, `Quarter_Year_id_32`, `Quarter_id_32`, `Year_id_32`, `Other_FromDate_id_32`, `Other_ToDate_id_32`, `Payroll_Frequency_id_31`, `Payroll_Week_Year_id_31`, `Payroll_Week_Month_id_31`, `Payroll_Week_id_31`, `Payroll_Fortnight_Year_id_31`, `Payroll_Fortnight_Month_id_31`, `Payroll_Fortnight_id_31`, `Payroll_Month_Year_id_31`, `Payroll_Month_id_31`, `Payroll_Quarter_Year_id_31`, `Payroll_Quarter_id_31`, `Payroll_Year_id_31`, `Audit_Year_Ending_id_27`, `Filing_Frequency_id_8`, `Period_Ending_Date_id_8`, `Filing_Date_id_8`, `Year_id_28`, `created_at`, `updated_at`) VALUES
(48, 48, '000048', 48, 106, 71, '', 60, 8, 2, '01:00', 40, 40, '2025-08-13', '2025-08-13', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-14', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-13 15:38:11', '2025-08-13 15:38:11'),
(49, 48, '000049', 48, 106, 68, '', 60, 7, 5, '01:01', 0, 0, '2025-08-14', '2025-08-14', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-15', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-14 05:06:56', '2025-08-14 05:06:56'),
(50, 105, '000050', 10, 107, 72, '', 61, 8, 2, '01:01', 107, 106, '2025-08-20', '2025-08-20', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-30', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 5, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-20 12:05:42', '2025-10-06 12:35:29'),
(51, 105, '000051', 10, 108, 73, '', 62, 7, 5, '01:01', 10, 10, '2025-08-20', '2025-08-20', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-21', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-20 12:22:57', '2025-10-06 12:35:29'),
(52, 105, '000052', 10, 108, 73, '', 62, 8, 2, '01:01', 107, 106, '2025-08-20', '2025-08-20', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-21', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-20 12:24:27', '2025-10-06 12:35:29'),
(53, 105, '000053', 10, 108, 73, '', 62, 8, 2, '01:01', 111, 112, '2025-08-20', '2025-08-20', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-30', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-20 12:39:26', '2025-10-06 12:35:29'),
(54, 105, '000054', 10, 108, 74, '', 62, 8, 3, '01:02', 10, 10, '2025-08-20', '2025-08-20', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-21', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-20 12:50:15', '2025-10-06 12:35:29'),
(55, 105, '000055', 10, 108, 74, '', 62, 8, 3, '01:02', 10, 10, '2025-08-20', '2025-08-20', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-21', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-20 12:53:45', '2025-10-06 12:35:29'),
(56, 105, '000056', 10, 108, 74, 'rerer', 62, 8, 4, '01:00', 10, 10, '2025-08-20', '2025-10-25', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-21', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 6, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-20 12:55:46', '2025-10-25 12:20:05'),
(57, 105, '000057', 10, 107, 77, '', 61, 9, 25, '01:01', 10, 10, '2025-08-20', '2025-08-20', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-21', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-20 13:02:21', '2025-10-06 12:35:29'),
(58, 105, '000058', 10, 107, 77, '', 61, 9, 25, '01:01', 10, 10, '2025-08-20', '2025-08-20', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-21', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-20 13:05:57', '2025-10-06 12:35:29'),
(59, 105, '000059', 10, 109, 79, '', 63, 7, 5, '01:01', 107, 10, '2025-08-20', '2025-08-20', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-21', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 5, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-20 13:16:03', '2025-10-06 12:35:29'),
(60, 105, '000060', 10, 109, 79, '', 63, 6, 8, '01:01', 0, 0, '2025-08-20', '2025-08-20', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-21', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 1, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-20 13:59:51', '2025-09-25 14:24:09'),
(61, 111, '000061', 111, 110, 80, '', 65, 4, 10, '01:01', 0, 0, '2025-08-23', '2025-08-23', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-24', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-23 13:05:47', '2025-08-23 13:05:47'),
(62, 111, '000062', 111, 110, 80, '', 65, 2, 18, '01:00', 0, 0, '2025-08-23', '2025-08-23', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-08-24', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-08-23 13:06:37', '2025-08-23 13:06:37'),
(63, 113, '000063', 10, 112, 81, '', 67, 6, 7, '01:00', 0, 0, '2025-09-04', '2025-09-04', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-09-05', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-04 14:14:14', '2025-09-25 14:24:09'),
(64, 1, '000064', 10, 112, 81, '', 67, 6, 7, '00:00', 0, 0, '2025-09-19', '2025-09-19', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-09-20', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-19 11:12:40', '2025-09-25 14:24:09'),
(65, 1, '000065', 10, 113, 82, '', 68, 33, 28, '00:00', 0, 0, '2025-09-22', '2025-09-22', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-09-23', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '2020', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-22 15:19:25', '2025-09-25 14:24:09'),
(66, 1, '000066', 10, 113, 82, '', 68, 33, 28, '01:00', 0, 0, '2025-09-23', '2025-09-23', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-09-24', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, '2022', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-23 15:23:58', '2025-09-25 14:24:09'),
(67, 1, '000067', 10, 113, 82, '', 68, 32, 29, '00:00', 0, 0, '2025-09-23', '2025-09-23', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-09-24', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 1, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, NULL, 'Quarter', NULL, '2024', 'March', 'Week 2', NULL, NULL, NULL, NULL, NULL, '2024', 'Q2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-23 15:24:43', '2025-09-25 14:24:09'),
(68, 1, '000068', 10, 113, 82, '', 68, 31, 30, '00:00', 0, 0, '2025-09-23', '2025-09-23', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-09-24', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Fortnightly', NULL, NULL, NULL, '2024', 'March', '2nd Half', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-23 15:25:51', '2025-09-25 14:24:09'),
(69, 1, '000069', 10, 113, 82, '', 68, 28, 31, '00:00', 0, 0, '2025-09-23', '2025-09-23', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-09-24', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2021', '2025-09-23 15:27:44', '2025-09-25 14:24:09'),
(70, 1, '000070', 10, 113, 82, '', 68, 27, 34, '00:00', 0, 0, '2025-09-23', '2025-09-23', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-09-24', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 1, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1999-02-21', NULL, NULL, NULL, NULL, '2025-09-23 15:28:41', '2025-09-25 14:24:09'),
(71, 1, '000071', 10, 113, 82, '', 68, 32, 29, '00:00', 0, 0, '2025-09-24', '2025-09-24', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-09-25', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, NULL, 'Day', '2025-02-15', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-24 05:03:36', '2025-09-25 14:24:09'),
(73, 111, '000072', 111, 114, 83, '', 69, 32, 29, '00:00', 0, 0, '2025-09-27', '2025-09-27', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-09-28', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 8, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-09-27 13:03:06', '2025-09-27 13:03:33'),
(74, 1, '000073', 111, 114, 83, '', 69, 32, 29, '03:20', 0, 0, '2025-10-04', '2025-10-04', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-10-05', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 1, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-04 11:34:40', '2025-10-04 11:34:57'),
(75, 1, '000074', 112, 116, 84, '', 71, 33, 28, '02:04', 0, 0, '2025-10-04', '2025-10-04', '', '00:00', '00:00', '00:00', '00:00', 'percentage_model', NULL, NULL, NULL, NULL, '2025-10-05', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 1, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-04 13:28:24', '2025-10-04 13:29:25'),
(76, 112, '000075', 112, 116, 84, '', 71, 33, 28, '01:02', 0, 0, '2025-10-04', '2025-10-04', '', '00:00', '00:00', '00:00', '00:00', 'percentage_model', NULL, NULL, NULL, NULL, '2025-10-05', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-04 13:32:38', '2025-10-04 13:32:38'),
(77, 1, '000076', 112, 116, 84, '', 71, 33, 28, '07:00', 0, 0, '2025-10-06', '2025-10-06', '', '00:00', '00:00', '00:00', '00:00', 'percentage_model', NULL, NULL, NULL, NULL, '2025-10-11', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 7, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-06 10:45:10', '2025-10-25 13:50:47'),
(78, 1, '000077', 112, 116, 84, '', 71, 33, 28, '01:01', 0, 0, '2025-10-06', '2025-10-06', '', '00:00', '00:00', '00:00', '00:00', 'percentage_model', NULL, NULL, NULL, NULL, '2025-10-07', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 7, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-06 12:33:37', '2025-10-25 13:50:38'),
(79, 1, '000078', 112, 116, 84, '', 71, 33, 28, '01:00', 0, 0, '2025-10-09', '2025-10-08', '', '00:00', '00:00', '00:00', '00:00', 'percentage_model', NULL, NULL, NULL, NULL, '2025-10-10', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 7, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-09 07:17:51', '2025-10-24 09:45:54'),
(80, 1, '000079', 30, 1, 1, '', 1, 2, 18, '05:50', 112, 102, '2025-10-25', '2025-10-25', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-10-26', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-25 06:10:58', '2025-10-25 06:10:58'),
(81, 1, '000080', 112, 116, 84, '', 71, 33, 28, '01:31', 0, 0, '2025-10-25', '2025-10-25', '', '00:00', '00:00', '00:00', '00:00', 'percentage_model', NULL, NULL, NULL, NULL, '2025-10-26', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', NULL, 6, NULL, '1', NULL, 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-25 10:58:51', '2025-10-25 11:04:49'),
(82, 1, '000081', 10, 108, 75, '', 62, 8, 4, '01:00', 0, 0, '2025-10-25', '2025-10-25', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-10-26', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', NULL, 'Quarterly', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Monthly', NULL, NULL, NULL, '2025-10-25 13:19:47', '2025-10-25 13:19:47');

-- --------------------------------------------------------

--
-- Table structure for table `job_allowed_staffs`
--

CREATE TABLE `job_allowed_staffs` (
  `id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job_allowed_staffs`
--

INSERT INTO `job_allowed_staffs` (`id`, `job_id`, `staff_id`, `created_at`, `updated_at`) VALUES
(1, 39, 8, '2025-08-05 13:31:59', '2025-08-05 13:31:59'),
(2, 39, 9, '2025-08-05 13:31:59', '2025-08-05 13:31:59'),
(3, 39, 6, '2025-08-05 13:31:59', '2025-08-05 13:31:59'),
(4, 40, 4, '2025-08-05 13:46:29', '2025-08-05 13:46:29'),
(5, 40, 93, '2025-08-05 13:46:29', '2025-08-05 13:46:29'),
(6, 40, 91, '2025-08-05 13:46:29', '2025-08-05 13:46:29'),
(7, 41, 93, '2025-08-05 13:51:04', '2025-08-05 13:51:04'),
(8, 41, 60, '2025-08-05 13:51:04', '2025-08-05 13:51:04'),
(9, 41, 102, '2025-08-05 13:51:04', '2025-08-05 13:51:04'),
(10, 42, 46, '2025-08-11 14:53:16', '2025-08-11 14:53:16'),
(11, 42, 47, '2025-08-11 14:53:16', '2025-08-11 14:53:16'),
(93, 59, 113, '2025-08-20 13:58:20', '2025-08-20 13:58:20'),
(94, 59, 111, '2025-08-20 13:58:20', '2025-08-20 13:58:20'),
(95, 59, 110, '2025-08-20 13:58:20', '2025-08-20 13:58:20'),
(96, 59, 109, '2025-08-20 13:58:20', '2025-08-20 13:58:20'),
(97, 59, 106, '2025-08-20 13:58:20', '2025-08-20 13:58:20');

-- --------------------------------------------------------

--
-- Table structure for table `job_documents`
--

CREATE TABLE `job_documents` (
  `id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_type` text NOT NULL,
  `file_size` int(11) NOT NULL,
  `web_url` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_types`
--

CREATE TABLE `job_types` (
  `id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `type` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `job_types`
--

INSERT INTO `job_types` (`id`, `service_id`, `type`, `status`, `created_at`, `updated_at`) VALUES
(1, 5, 'test', '1', '2025-03-26 13:57:51', '2025-03-26 13:57:51'),
(2, 8, 'VAT Review', '1', '2025-03-29 13:38:40', '2025-03-29 13:38:40'),
(3, 8, 'VAT Preparation', '1', '2025-03-29 13:38:55', '2025-03-29 13:38:55'),
(4, 8, 'VAT Submission', '1', '2025-03-29 13:39:17', '2025-03-29 13:39:17'),
(5, 7, 'Prepare and File Confirmation Statement', '1', '2025-03-29 13:41:52', '2025-03-29 13:41:52'),
(6, 6, 'Basic P&L', '1', '2025-03-29 13:42:07', '2025-03-29 13:42:07'),
(7, 6, 'Detailed Management Accounts', '1', '2025-03-29 13:42:20', '2025-03-29 13:42:20'),
(8, 6, 'Full Management Accounts with Report', '1', '2025-03-29 13:42:40', '2025-03-29 13:42:40'),
(9, 5, 'Support', '1', '2025-03-29 13:43:04', '2025-03-29 13:43:04'),
(10, 4, 'PTR for Individuals & Directors', '1', '2025-03-29 13:43:40', '2025-03-29 13:43:40'),
(11, 4, 'PTR for Landlords', '1', '2025-03-29 13:43:52', '2025-03-29 13:43:52'),
(12, 4, 'PTR for Sole Traders', '1', '2025-03-29 13:44:16', '2025-03-29 13:44:16'),
(13, 4, 'PTR for Parterships', '1', '2025-03-29 13:44:27', '2025-03-29 13:44:27'),
(14, 3, 'Payroll', '1', '2025-03-29 13:44:46', '2025-03-29 13:44:46'),
(15, 2, 'Bookkeeping including VAT Return', '1', '2025-03-29 13:45:49', '2025-03-29 13:46:38'),
(16, 2, 'Only Bank Reco', '1', '2025-03-29 13:45:57', '2025-03-29 13:45:57'),
(17, 2, 'Bookkeeping including VAT Return & VAT Reco', '1', '2025-03-29 13:46:19', '2025-03-29 13:47:12'),
(18, 2, 'Bookkeeping excluding VAT', '1', '2025-03-29 13:46:47', '2025-03-29 13:46:47'),
(19, 2, 'Bookkeeping including VAT Reco and PAYE Reco', '1', '2025-03-29 13:47:28', '2025-03-29 13:47:28'),
(20, 2, 'Bookkeeping including VAT Reco, PAYE Reco and FAR', '1', '2025-03-29 13:47:50', '2025-03-29 13:47:50'),
(21, 1, 'Working Papers Preparation Only', '1', '2025-03-29 13:48:21', '2025-03-29 13:48:21'),
(22, 1, 'Working Papers and Draft Accounts', '1', '2025-03-29 13:48:40', '2025-03-29 13:48:40'),
(23, 1, 'Working Papers, Draft Accounts and Filing', '1', '2025-03-29 13:49:03', '2025-03-29 13:49:03'),
(24, 1, 'Working Papers, Draft Accounts, Filing and OB Adjustments', '1', '2025-03-29 13:49:32', '2025-03-29 13:49:32'),
(25, 9, 'Demo', '1', '2025-03-30 11:48:08', '2025-03-30 11:48:08'),
(26, 10, 'Vikas test', '1', '2025-03-30 14:33:31', '2025-03-30 14:33:31'),
(27, 11, 'Capital Gain', '1', '2025-05-02 12:53:02', '2025-05-02 12:53:02'),
(28, 33, 'test', '1', '2025-09-22 15:13:42', '2025-09-22 15:13:42'),
(29, 32, 'test', '1', '2025-09-22 15:13:55', '2025-09-22 15:13:55'),
(30, 31, 'test', '1', '2025-09-22 15:14:07', '2025-09-22 15:14:07'),
(31, 30, 'test', '1', '2025-09-22 15:14:19', '2025-09-22 15:14:19'),
(32, 29, 'test', '1', '2025-09-22 15:14:36', '2025-09-22 15:14:36'),
(33, 28, 'test', '1', '2025-09-22 15:14:47', '2025-09-22 15:14:47'),
(34, 27, 'test', '1', '2025-09-22 15:14:58', '2025-09-22 15:14:58'),
(35, 26, 'test', '1', '2025-09-22 15:15:11', '2025-09-22 15:15:11');

-- --------------------------------------------------------

--
-- Table structure for table `line_managers`
--

CREATE TABLE `line_managers` (
  `id` int(11) NOT NULL,
  `staff_by` int(11) NOT NULL,
  `staff_to` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `line_managers`
--

INSERT INTO `line_managers` (`id`, `staff_by`, `staff_to`, `created_at`, `updated_at`) VALUES
(53, 97, 17, '2025-04-11 17:08:15', '2025-04-11 17:08:15'),
(6, 49, 10, '2025-03-17 10:44:02', '2025-03-17 10:44:02'),
(7, 50, 14, '2025-03-17 13:26:37', '2025-03-17 13:26:37'),
(8, 51, 12, '2025-03-17 13:27:27', '2025-03-17 13:27:27'),
(11, 54, 15, '2025-03-17 13:38:59', '2025-03-17 13:38:59'),
(14, 57, 9, '2025-03-18 09:12:30', '2025-03-18 09:12:30'),
(15, 58, 46, '2025-03-18 09:20:42', '2025-03-18 09:20:42'),
(16, 59, 12, '2025-03-18 09:41:54', '2025-03-18 09:41:54'),
(19, 62, 50, '2025-03-18 11:30:02', '2025-03-18 11:30:02'),
(20, 63, 53, '2025-03-18 14:31:56', '2025-03-18 14:31:56'),
(21, 64, 53, '2025-03-18 14:32:47', '2025-03-18 14:32:47'),
(22, 65, 53, '2025-03-18 14:38:50', '2025-03-18 14:38:50'),
(23, 66, 53, '2025-03-18 14:39:14', '2025-03-18 14:39:14'),
(24, 67, 53, '2025-03-18 14:39:39', '2025-03-18 14:39:39'),
(26, 69, 59, '2025-03-19 03:47:53', '2025-03-19 03:47:53'),
(27, 70, 59, '2025-03-19 03:48:22', '2025-03-19 03:48:22'),
(28, 71, 59, '2025-03-19 03:48:50', '2025-03-19 03:48:50'),
(29, 72, 59, '2025-03-19 03:49:31', '2025-03-19 03:49:31'),
(30, 73, 59, '2025-03-19 03:51:27', '2025-03-19 03:51:27'),
(31, 74, 59, '2025-03-19 03:53:17', '2025-03-19 03:53:17'),
(34, 77, 59, '2025-03-19 03:55:20', '2025-03-19 03:55:20'),
(36, 79, 59, '2025-03-19 03:56:42', '2025-03-19 03:56:42'),
(38, 81, 59, '2025-03-19 03:58:05', '2025-03-19 03:58:05'),
(39, 82, 61, '2025-03-19 06:43:53', '2025-03-19 06:43:53'),
(40, 83, 61, '2025-03-19 06:44:48', '2025-03-19 06:44:48'),
(41, 84, 51, '2025-03-19 06:45:35', '2025-03-19 06:45:35'),
(42, 85, 51, '2025-03-19 06:47:00', '2025-03-19 06:47:00'),
(43, 86, 61, '2025-03-19 07:11:39', '2025-03-19 07:11:39'),
(44, 87, 61, '2025-03-19 07:12:31', '2025-03-19 07:12:31'),
(46, 89, 52, '2025-03-19 10:17:40', '2025-03-19 10:17:40'),
(47, 90, 60, '2025-03-19 15:11:44', '2025-03-19 15:11:44'),
(48, 91, 60, '2025-03-19 15:12:34', '2025-03-19 15:12:34'),
(49, 92, 20, '2025-03-20 07:14:00', '2025-03-20 07:14:00');

-- --------------------------------------------------------

--
-- Table structure for table `master_status`
--

CREATE TABLE `master_status` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `status_type_id` int(11) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `is_disable` enum('0','1') NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `master_status`
--

INSERT INTO `master_status` (`id`, `name`, `status_type_id`, `status`, `is_disable`, `created_at`, `updated_at`) VALUES
(1, 'To Be Started - Not Yet Allocated Internally', 5, '1', '1', '2024-08-27 11:42:24', '2025-05-02 11:52:43'),
(2, 'On Hold – Missing Paperwork', 4, '1', '1', '2024-08-27 11:53:06', '2025-05-02 11:55:06'),
(3, 'WIP – Processing', 1, '1', '1', '2024-08-27 11:53:06', '2025-02-06 13:17:17'),
(4, 'WIP – In Queries', 1, '1', '1', '2024-08-27 11:53:06', '2025-02-06 13:17:20'),
(5, 'WIP – To Be Reviewed', 1, '1', '1', '2024-08-27 11:53:06', '2025-02-06 13:17:23'),
(6, 'Completed - Opening Balances Adjusted', 2, '1', '1', '2024-09-24 13:07:54', '2025-05-02 11:57:57'),
(7, 'Completed - Draft Sent', 2, '1', '1', '2024-11-10 22:47:22', '2025-05-02 11:56:32'),
(8, 'Not Progressing - Duplicate', 3, '1', '0', '2024-11-10 22:48:56', '2025-05-02 11:56:24'),
(9, 'Awaiting Paperwork/Accounts/VAT', 7, '1', '0', '2024-11-10 22:49:22', '2024-11-10 22:49:22'),
(10, 'Client Not Responding', 7, '1', '0', '2024-11-10 22:49:41', '2024-11-10 22:49:41'),
(11, 'Waiting for Credentials', 7, '1', '0', '2024-11-10 22:49:57', '2024-11-10 22:49:57'),
(12, 'Bookkeeping Not Completed', 7, '1', '0', '2024-11-10 22:50:12', '2024-11-10 22:50:12'),
(13, 'WIP - To Be Reviewed', 1, '1', '0', '2024-11-10 22:51:55', '2025-05-02 11:54:25'),
(15, 'WIP - Customer Processing', 1, '1', '0', '2024-11-10 22:52:24', '2025-05-02 11:54:15'),
(17, 'Completed - Update Sent', 2, '1', '0', '2024-11-10 22:53:06', '2025-05-02 11:55:58'),
(18, 'Completed - Filed with Companies House and HMRC', 2, '1', '0', '2024-11-10 22:53:20', '2025-05-02 11:55:49'),
(19, 'Completed - Filed with Companies House', 2, '1', '0', '2024-11-10 22:53:35', '2025-05-02 11:55:40'),
(20, 'Completed - Filed with HMRC', 2, '1', '0', '2024-11-10 22:53:48', '2025-05-02 11:55:31'),
(21, 'WIP - Customer Reviewed & To be Updated', 1, '1', '1', '2025-02-01 12:10:19', '2025-02-06 13:17:37'),
(22, 'On Hold - Last Quarter VAT Not Done', 4, '1', '0', '2025-05-02 11:58:56', '2025-05-02 11:58:56'),
(23, 'Not Progessing - Client Not Active Anymore', 3, '1', '0', '2025-05-02 11:59:15', '2025-05-02 11:59:15');

-- --------------------------------------------------------

--
-- Table structure for table `missing_logs`
--

CREATE TABLE `missing_logs` (
  `id` int(11) NOT NULL,
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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `missing_logs`
--

INSERT INTO `missing_logs` (`id`, `job_id`, `missing_log`, `missing_paperwork`, `missing_log_sent_on`, `missing_log_prepared_date`, `missing_log_title`, `missing_log_reviewed_by`, `missing_log_reviewed_date`, `missing_paperwork_received_on`, `last_chaser`, `status`, `created_at`, `updated_at`) VALUES
(1, 7, '1', '0', '2025-03-17', '2025-03-17', 'M_00001', 10, '2025-03-17', NULL, '2025-03-17', '1', '2025-03-31 06:18:36', '2025-03-31 06:18:36'),
(2, 13, '1', '0', '2025-04-03', '2025-03-31', 'M_00001', 34, NULL, NULL, '2025-04-03', '0', '2025-04-03 14:51:49', '2025-04-03 14:51:49'),
(3, 24, '1', '0', '2025-07-10', '2025-07-10', 'M_00001', 36, '2025-07-08', NULL, '2025-07-10', '1', '2025-07-10 14:05:20', '2025-07-10 14:05:48'),
(4, 27, '1', '0', '2025-07-12', '2025-07-12', 'M_00001', 102, '2025-07-12', NULL, '2025-07-12', '1', '2025-07-12 14:04:10', '2025-07-12 14:04:39'),
(5, 38, '1', '0', '2025-08-02', NULL, 'M_00001', 1, NULL, NULL, '2025-08-02', '0', '2025-08-02 14:39:00', '2025-08-02 14:39:00'),
(6, 27, '1', '0', '2025-10-25', '2025-10-25', 'M_00002', 1, '2025-10-25', NULL, '2025-10-25', '1', '2025-10-25 13:36:56', '2025-10-25 13:40:02');

-- --------------------------------------------------------

--
-- Table structure for table `missing_logs_documents`
--

CREATE TABLE `missing_logs_documents` (
  `id` int(11) NOT NULL,
  `missing_log_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_type` text NOT NULL,
  `file_size` int(11) NOT NULL,
  `web_url` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `missing_logs_documents`
--

INSERT INTO `missing_logs_documents` (`id`, `missing_log_id`, `file_name`, `original_name`, `file_type`, `file_size`, `web_url`, `created_at`, `updated_at`) VALUES
(1, 2, '1743691908967-Clipboard - December 3, 2024 6_04 PM.png', 'Clipboard - December 3, 2024 6_04 PM.png', 'image/png', 240236, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST82_CLIENT39_JOB13/CUST82_CLIENT39_JOB13_MISSING_LOG_2/Clipboard%20-%20December%203,%202024%206_04%20PM.png', '2025-04-03 14:51:49', '2025-04-03 14:51:55'),
(2, 4, '1752329050383-TimeSheetData (24).csv', 'TimeSheetData (24).csv', 'application/vnd.ms-excel', 2929, NULL, '2025-07-12 14:04:10', '2025-07-12 14:04:10');

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` int(11) NOT NULL,
  `permission_name` varchar(100) NOT NULL,
  `type` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

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
(32, 'timesheet', 'view', '2024-07-09 01:29:27', '2024-09-24 07:05:32'),
(33, 'all_customers', 'view', '2025-04-05 12:20:42', '2025-04-05 12:20:42'),
(34, 'all_clients', 'view', '2025-04-05 12:20:42', '2025-04-05 12:20:42'),
(35, 'all_jobs', 'view', '2025-04-05 12:20:42', '2025-04-05 12:20:42');

-- --------------------------------------------------------

--
-- Table structure for table `queries`
--

CREATE TABLE `queries` (
  `id` int(11) NOT NULL,
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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `queries`
--

INSERT INTO `queries` (`id`, `job_id`, `queries_remaining`, `query_title`, `reviewed_by`, `missing_queries_prepared_date`, `query_sent_date`, `response_received`, `response`, `final_query_response_received_date`, `last_chaser`, `status`, `created_at`, `updated_at`) VALUES
(1, 13, '0', 'Q_00001', '0', NULL, '2025-04-03', '0', NULL, NULL, '2025-04-03', '0', '2025-04-03 15:00:38', '2025-04-03 15:00:38'),
(2, 27, '1', 'Q_00001', '1', NULL, '2025-10-25', '0', NULL, '2025-10-29', '2025-10-25', '1', '2025-10-25 13:37:52', '2025-10-25 13:38:34');

-- --------------------------------------------------------

--
-- Table structure for table `queries_documents`
--

CREATE TABLE `queries_documents` (
  `id` int(11) NOT NULL,
  `query_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_type` text NOT NULL,
  `file_size` int(11) NOT NULL,
  `web_url` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `queries_documents`
--

INSERT INTO `queries_documents` (`id`, `query_id`, `file_name`, `original_name`, `file_type`, `file_size`, `web_url`, `created_at`, `updated_at`) VALUES
(1, 1, '1743692437807-Clipboard - December 3, 2024 6_04 PM.png', 'Clipboard - December 3, 2024 6_04 PM.png', 'image/png', 240236, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST82_CLIENT39_JOB13/CUST82_CLIENT39_JOB13_QUERY_LOG_1/Clipboard%20-%20December%203,%202024%206_04%20PM.png', '2025-04-03 15:00:38', '2025-04-03 15:00:42');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `role_name` varchar(100) NOT NULL,
  `role` varchar(100) NOT NULL,
  `hourminute` varchar(100) DEFAULT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `is_disable` enum('0','1') NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `role`, `hourminute`, `status`, `is_disable`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'SUPERADMIN', '42:50', '1', '1', '2024-06-28 11:59:13', '2025-06-05 05:07:22'),
(2, 'Admin', 'ADMIN', '42:50', '1', '1', '2024-06-28 11:59:22', '2025-06-05 05:07:22'),
(3, 'Processor', 'PROCESSOR', '42:50', '1', '1', '2024-06-28 12:05:34', '2025-06-05 05:07:22'),
(4, 'Account Manager', 'MANAGER', '42:50', '1', '1', '2024-09-07 09:17:08', '2025-06-05 05:07:22'),
(5, 'Leadership', 'LEADERSHIP', '42:50', '1', '1', '2024-09-07 09:17:08', '2025-06-05 05:07:22'),
(6, 'Reviewer', 'REVIEWER', '42:50', '1', '1', '2024-09-07 09:17:38', '2025-06-05 05:07:22'),
(8, 'Management', 'MANAGEMENT', '42:50', '1', '1', '2024-10-14 09:00:37', '2025-09-23 06:39:23'),
(9, 'Support', 'SUPPORT', '42:50', '1', '0', '2024-10-22 22:03:17', '2025-06-05 05:07:22');

-- --------------------------------------------------------

--
-- Table structure for table `role_permissions`
--

CREATE TABLE `role_permissions` (
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`, `created_at`, `updated_at`) VALUES
(3, 4, '2024-08-30 15:37:56', '2024-11-08 15:33:51'),
(13, 24, '2024-07-30 06:31:43', '2024-07-30 08:37:46'),
(13, 12, '2024-07-26 05:10:20', '2024-07-30 08:37:46'),
(13, 4, '2024-07-12 10:37:55', '2024-07-30 08:37:46'),
(4, 19, '2025-07-12 13:58:42', '2025-07-12 13:58:42'),
(6, 4, '2024-09-12 09:39:12', '2024-11-08 15:33:51'),
(3, 20, '2024-09-07 06:06:08', '2024-11-08 15:33:51'),
(3, 16, '2024-09-07 06:06:08', '2024-11-08 15:33:51'),
(3, 25, '2024-09-24 08:27:25', '2024-11-08 15:33:51'),
(3, 29, '2024-09-24 08:27:25', '2024-11-08 15:33:51'),
(3, 31, '2024-09-24 08:27:25', '2024-11-08 15:33:51'),
(3, 30, '2024-09-24 08:27:25', '2024-11-08 15:33:51'),
(3, 32, '2024-09-24 08:27:25', '2024-11-08 15:33:51'),
(4, 30, '2024-09-24 08:27:55', '2024-11-08 15:32:06'),
(4, 31, '2024-09-24 08:27:55', '2024-11-08 15:32:06'),
(6, 29, '2024-09-24 08:33:18', '2024-11-08 15:33:51'),
(6, 30, '2024-09-24 08:33:18', '2024-11-08 15:33:51'),
(6, 31, '2024-09-24 08:33:18', '2024-11-08 15:33:51'),
(6, 32, '2024-09-24 08:33:18', '2024-11-08 15:33:51'),
(4, 29, '2024-09-24 08:33:30', '2024-11-08 15:32:06'),
(4, 32, '2024-09-24 08:33:30', '2024-11-08 15:32:06'),
(4, 13, '2025-07-12 13:58:42', '2025-07-12 13:58:42'),
(4, 15, '2025-07-12 13:58:42', '2025-07-12 13:58:42'),
(8, 31, '2024-10-14 09:00:37', '2024-11-08 15:32:41'),
(8, 30, '2024-10-14 09:00:37', '2024-11-08 15:32:41'),
(8, 29, '2024-10-14 09:00:37', '2024-11-08 15:32:41'),
(3, 13, '2024-11-08 15:33:51', '2024-11-08 15:33:51'),
(6, 20, '2024-10-11 10:33:46', '2024-11-08 15:33:51'),
(6, 16, '2024-10-11 10:33:46', '2024-11-08 15:33:51'),
(8, 32, '2024-10-14 09:00:37', '2024-11-08 15:32:41'),
(8, 4, '2024-10-14 09:02:43', '2024-11-08 15:32:41'),
(8, 1, '2024-10-14 09:02:43', '2024-11-08 15:32:41'),
(8, 13, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 14, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 15, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 16, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 17, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 18, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 19, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 20, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 21, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 22, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 23, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 24, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 9, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 11, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 12, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 10, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 5, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 6, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 7, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 8, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 2, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(8, 3, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(2, 35, '2025-08-20 12:07:49', '2025-08-20 12:07:49'),
(9, 29, '2024-10-22 22:03:17', '2024-11-08 15:33:09'),
(9, 30, '2024-10-22 22:03:17', '2024-11-08 15:33:09'),
(9, 31, '2024-10-22 22:03:17', '2024-11-08 15:33:09'),
(9, 32, '2025-03-30 15:50:06', '2025-03-30 15:50:06'),
(4, 1, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 2, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 20, '2025-07-12 13:58:42', '2025-07-12 13:58:42'),
(4, 3, '2025-07-12 13:58:42', '2025-07-12 13:58:42'),
(4, 4, '2025-07-12 13:58:42', '2025-07-12 13:58:42'),
(4, 6, '2025-07-12 13:58:42', '2025-07-12 13:58:42'),
(4, 5, '2025-07-12 13:58:42', '2025-07-12 13:58:42'),
(4, 7, '2025-07-12 13:58:42', '2025-07-12 13:58:42'),
(4, 8, '2025-07-12 13:58:42', '2025-07-12 13:58:42'),
(4, 17, '2025-07-12 13:58:42', '2025-07-12 13:58:42'),
(4, 18, '2025-07-12 13:58:42', '2025-07-12 13:58:42'),
(4, 14, '2025-07-12 13:58:42', '2025-07-12 13:58:42'),
(4, 16, '2025-07-12 13:58:42', '2025-07-12 13:58:42'),
(4, 12, '2025-07-12 13:58:42', '2025-07-12 13:58:42'),
(4, 21, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 22, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 23, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 24, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 25, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 26, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 27, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 28, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(8, 25, '2024-11-08 15:32:41', '2024-11-08 15:32:41'),
(9, 4, '2024-11-08 15:33:09', '2024-11-08 15:33:09'),
(9, 8, '2024-11-08 15:33:09', '2024-11-08 15:33:09'),
(9, 12, '2024-11-08 15:33:09', '2024-11-08 15:33:09'),
(9, 16, '2024-11-08 15:33:09', '2024-11-08 15:33:09'),
(9, 9, '2024-11-08 15:33:09', '2024-11-08 15:33:09'),
(9, 10, '2024-11-08 15:33:09', '2024-11-08 15:33:09'),
(9, 11, '2024-11-08 15:33:09', '2024-11-08 15:33:09'),
(9, 20, '2024-11-08 15:33:09', '2024-11-08 15:33:09'),
(9, 24, '2024-11-08 15:33:09', '2024-11-08 15:33:09'),
(9, 28, '2024-11-08 15:33:09', '2024-11-08 15:33:09'),
(6, 19, '2024-11-08 15:33:28', '2024-11-08 15:33:51'),
(6, 18, '2024-11-08 15:33:28', '2024-11-08 15:33:51'),
(6, 17, '2024-11-08 15:33:28', '2024-11-08 15:33:51'),
(6, 13, '2024-11-08 15:33:28', '2024-11-08 15:33:51'),
(6, 14, '2024-11-08 15:33:28', '2024-11-08 15:33:51'),
(6, 15, '2024-11-08 15:33:28', '2024-11-08 15:33:51'),
(3, 15, '2024-11-08 15:33:51', '2024-11-08 15:33:51'),
(3, 14, '2024-11-08 15:33:51', '2024-11-08 15:33:51'),
(3, 17, '2024-11-08 15:33:51', '2024-11-08 15:33:51'),
(3, 18, '2024-11-08 15:33:51', '2024-11-08 15:33:51'),
(3, 19, '2024-11-08 15:33:51', '2024-11-08 15:33:51'),
(9, 1, '2025-01-07 13:16:09', '2025-01-07 13:16:09'),
(9, 2, '2025-01-07 13:16:09', '2025-01-07 13:16:09'),
(9, 3, '2025-01-07 13:16:09', '2025-01-07 13:16:09'),
(9, 13, '2025-01-07 13:16:09', '2025-01-07 13:16:09'),
(9, 14, '2025-01-07 13:16:09', '2025-01-07 13:16:09'),
(9, 15, '2025-01-07 13:16:09', '2025-01-07 13:16:09'),
(9, 17, '2025-01-07 13:16:09', '2025-01-07 13:16:09'),
(9, 18, '2025-01-07 13:16:09', '2025-01-07 13:16:09'),
(9, 19, '2025-01-07 13:16:09', '2025-01-07 13:16:09'),
(9, 21, '2025-01-07 13:16:09', '2025-01-07 13:16:09'),
(9, 22, '2025-01-07 13:16:09', '2025-01-07 13:16:09'),
(9, 23, '2025-01-07 13:16:09', '2025-01-07 13:16:09'),
(9, 27, '2025-01-07 13:16:09', '2025-01-07 13:16:09'),
(9, 25, '2025-01-07 13:16:09', '2025-01-07 13:16:09'),
(9, 26, '2025-01-07 13:16:09', '2025-01-07 13:16:09'),
(9, 5, '2025-01-07 13:16:09', '2025-01-07 13:16:09'),
(9, 6, '2025-01-07 13:16:09', '2025-01-07 13:16:09'),
(9, 7, '2025-01-07 13:16:09', '2025-01-07 13:16:09'),
(2, 5, '2025-04-03 15:32:27', '2025-04-03 15:32:27'),
(2, 6, '2025-04-03 15:32:27', '2025-04-03 15:32:27'),
(2, 7, '2025-04-03 15:32:27', '2025-04-03 15:32:27'),
(2, 32, '2025-04-07 14:15:45', '2025-04-07 14:15:45'),
(2, 24, '2025-04-07 14:15:45', '2025-04-07 14:15:45'),
(2, 2, '2025-04-07 14:21:44', '2025-04-07 14:21:44'),
(2, 3, '2025-04-07 14:14:59', '2025-04-07 14:14:59'),
(2, 9, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 10, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 11, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 20, '2025-04-07 14:15:45', '2025-04-07 14:15:45'),
(2, 15, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 12, '2025-04-07 14:15:45', '2025-04-07 14:15:45'),
(2, 19, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 4, '2025-04-07 14:15:45', '2025-04-07 14:15:45'),
(2, 21, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 22, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 23, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 8, '2025-04-07 14:15:45', '2025-04-07 14:15:45'),
(2, 29, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 30, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 31, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 16, '2025-04-07 14:15:45', '2025-04-07 14:15:45'),
(2, 25, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 26, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 27, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 28, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 34, '2025-04-07 14:20:55', '2025-04-07 14:20:55'),
(2, 33, '2025-04-07 14:18:13', '2025-04-07 14:18:13'),
(2, 1, '2025-04-07 14:21:44', '2025-04-07 14:21:44'),
(2, 13, '2025-04-07 14:21:44', '2025-04-07 14:21:44'),
(2, 14, '2025-04-07 14:21:44', '2025-04-07 14:21:44'),
(2, 17, '2025-04-07 14:21:44', '2025-04-07 14:21:44'),
(2, 18, '2025-04-07 14:21:44', '2025-04-07 14:21:44'),
(10, 29, '2025-05-02 12:52:25', '2025-05-02 12:52:25'),
(10, 30, '2025-05-02 12:52:25', '2025-05-02 12:52:25'),
(10, 31, '2025-05-02 12:52:25', '2025-05-02 12:52:25'),
(10, 32, '2025-05-02 12:52:25', '2025-05-02 12:52:25'),
(11, 29, '2025-06-04 05:41:56', '2025-06-04 05:41:56'),
(11, 30, '2025-06-04 05:41:56', '2025-06-04 05:41:56'),
(11, 31, '2025-06-04 05:41:56', '2025-06-04 05:41:56'),
(11, 32, '2025-06-04 05:41:56', '2025-06-04 05:41:56');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `is_disable` enum('0','1') NOT NULL COMMENT '0: deactive, 1: active',
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `name`, `is_disable`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Accounts Production', '1', '1', '2025-01-28 03:38:45', '2025-01-28 03:40:47'),
(2, 'Bookkeeping', '1', '1', '2025-01-28 03:39:00', '2025-01-28 03:40:43'),
(3, 'Payroll', '1', '1', '2025-01-28 03:39:18', '2025-01-28 11:20:06'),
(4, 'Personal Tax Return', '1', '1', '2025-01-28 03:39:26', '2025-01-28 11:20:27'),
(5, 'Admin Support', '1', '1', '2025-01-28 03:39:08', '2025-01-28 11:20:21'),
(6, 'Management Accounts', '1', '1', '2025-01-28 03:39:40', '2025-01-28 03:40:11'),
(7, 'Company Secretarial', '1', '1', '2025-01-28 03:39:46', '2025-01-28 03:39:54'),
(8, 'VAT Returns', '1', '1', '2025-01-28 09:23:31', '2025-02-01 06:57:36'),
(27, 'Audit ', '1', '1', '2025-06-24 14:01:13', '2025-09-17 05:51:20'),
(32, 'Aus - Bookkeeping', '1', '1', '2025-07-18 10:16:20', '2025-09-17 05:50:35'),
(30, 'Aus - Admin Support', '1', '1', '2025-07-18 10:15:52', '2025-09-17 05:52:22'),
(31, 'Aus - Payroll', '1', '1', '2025-07-18 10:16:07', '2025-09-17 05:50:42'),
(26, 'Reporting', '1', '1', '2025-06-18 14:50:13', '2025-09-17 05:51:42'),
(28, 'Aus - SMSF', '1', '1', '2025-07-18 09:32:05', '2025-09-17 05:51:12'),
(29, 'Aus - Company Secretarial (ASIC)', '1', '1', '2025-07-18 10:15:20', '2025-09-17 05:52:18'),
(33, 'Aus - Compliance ', '1', '1', '2025-07-18 10:16:29', '2025-09-17 05:50:26');

-- --------------------------------------------------------

--
-- Table structure for table `sharepoint_token`
--

CREATE TABLE `sharepoint_token` (
  `id` int(11) NOT NULL,
  `access_token` longtext DEFAULT NULL,
  `refresh_token` longtext DEFAULT NULL,
  `client_id` text DEFAULT NULL,
  `client_secret` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `sharepoint_token`
--

INSERT INTO `sharepoint_token` (`id`, `access_token`, `refresh_token`, `client_id`, `client_secret`, `created_at`, `updated_at`) VALUES
(1, 'eyJ0eXAiOiJKV1QiLCJub25jZSI6Ik5CZE5XNEV5TTZlcEI4YWxlVmR2eWFwU0RFNUt0a2tDTDlPSTQ1OG4tYUEiLCJhbGciOiJSUzI1NiIsIng1dCI6InoxcnNZSEhKOS04bWdndDRIc1p1OEJLa0JQdyIsImtpZCI6InoxcnNZSEhKOS04bWdndDRIc1p1OEJLa0JQdyJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8zMzJkY2Q4OS1jZDM3LTQwYTAtYmJhMi1hMmI5MWFiZDQzNGEvIiwiaWF0IjoxNzM1NzMxMTg3LCJuYmYiOjE3MzU3MzExODcsImV4cCI6MTczNTczNjI5MSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhZQUFBQVF5dVlLWmh2VlYzcVpDWFJhRHplQWZpQnMwcjRqcEhlT3lkU242enpXaUJROXhPMmhSd0QzbTdqNUprRTNFZ3QiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6Ik91dGJvb2tBcHAiLCJhcHBpZCI6IjkxODU4NTdmLTczNjUtNGQzNS1iMDBhLTVhMzFkY2RkNThkMiIsImFwcGlkYWNyIjoiMSIsImZhbWlseV9uYW1lIjoiQmhhZ2F0IiwiZ2l2ZW5fbmFtZSI6Ik5pa2l0YSIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjEwMy4xMDMuMjEzLjIxNyIsIm5hbWUiOiJOaWtpdGEgQmhhZ2F0Iiwib2lkIjoiNDI2MWM4MTMtMjViNC00ZjM1LWJmNmItNGE5NzVjZjBhMDU3IiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDA0MUFFRkI5QTQiLCJyaCI6IjEuQVhrQWljMHRNemZOb0VDN29xSzVHcjFEU2dNQUFBQUFBQUFBd0FBQUFBQUFBQUFNQVNSNUFBLiIsInNjcCI6Ik15RmlsZXMuUmVhZCBNeUZpbGVzLldyaXRlIFNpdGVzLlJlYWRXcml0ZS5BbGwgVXNlci5SZWFkIHByb2ZpbGUgb3BlbmlkIGVtYWlsIiwic2lkIjoiZTg3M2Y2OWYtYTE5NS00N2EwLTljYWUtYjc3MDc1MDQ5NzlhIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiLUFhU09zbnd2T0hmZkhzZmJjbmgwenBKNUtZckhxQ0RiaFluN0hMZmctayIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJFVSIsInRpZCI6IjMzMmRjZDg5LWNkMzctNDBhMC1iYmEyLWEyYjkxYWJkNDM0YSIsInVuaXF1ZV9uYW1lIjoiTmlraXRhLkJoYWdhdEBvdXRib29rcy5jb20iLCJ1cG4iOiJOaWtpdGEuQmhhZ2F0QG91dGJvb2tzLmNvbSIsInV0aSI6InplNFA3T3NYQkVhdzBsa1JOSGhQQVEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImNmMWMzOGU1LTM2MjEtNDAwNC1hN2NiLTg3OTYyNGRjZWQ3YyIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfaWRyZWwiOiIxIDE0IiwieG1zX3N0Ijp7InN1YiI6IjRidjJCemlEWUxUNThPVzV6UF91N2Zqc3RkLWFxVEYzamFuZHdDbF9WdkUifSwieG1zX3RjZHQiOjE2MDM0NTY2MDJ9.X8g-2_Kro89Ui4QJfI3cB_WTeRy3OBicxv6rzIqDyFe2f8oPQsrQv_oYBIvFmrGsnaqNBxMACE0oG2oY9WSShwCC3_b7uju_hjGQOXSifmShSWzAIRczdrrB57HXA6txxyCl9YGDoiwc7WVv1wckQ9cz5TupsISLHl83gPsAsg6SFGGJA6N6V5PNBHXVQCUKRFYS4hwUR0HyRDhSdVqYInAiML0QAcNw8kuZ0Tu0i8Jot3iPKMf-ablFuduBFvAurvCbl4ovj-qlE7Lvul6qtrB1xOBDfa6twjpKnFkBWEGnONMd39jqthCSzh-xzA1Qp8Sn5WCFtczuMyK1spUY6w', '1.AXkAic0tMzfNoEC7oqK5Gr1DSn-FhZFlczVNsApaMdzdWNIMASR5AA.AgABAwEAAABVrSpeuWamRam2jAF1XRQEAwDs_wUA9P-ImAq-al0Pv8qPtr24oU8OC0RVtMptaC6RWDPE0h0Q3O1l40oQP4gbdE6kxC_YpjBQKzklOY5-hmhZMWtnZk7Dgt1yZAlZG--izlK5TtBMW3TRg54nTdd99IvEhYpVZVjn6VS_c0TxMgqbuEds3mBbRCQy5IVwwRdqWkYnix4ryMPFZWcOvcTpxeahHNXvSjORokPsRROeq8muUnl2Xxs-47Ycltaik0v6Yy6yCIBNGMoxyFF3PpMbbniAvnW-_vfPRSjfLxUwBT7jLqUDYuZMh30ffK7MB7ftMfzWwEi4cc_xpiUjz6e_Wuc6aFSh37wgb7DZauGp-AFsqXOD-OzoQ1ns4awvqAQ_yGJVsrcNWS_8p_aXOr4XeuILfY-hXiwAGtt4_6SuSzzXAOGdWoaCNce6XfIgW2auB0qazKy3UxDd1aq6xxoHunEPZlxpgMHkhC7I1lA6rZZFGV9yz_mkildQxWwu4PiKNLyRNw7vq6-6zeJqnBznzQqAjxlnHoKHvXAEI62f9CkUN4SH1RuDoIU7pUJw3g0xL7yvd07wUtgTldw8dI_Vsa6ihStoTaAu9WMDVt-Ym86vLd5qLBfWqPD9GLX96vic_oodTWt-Ock8_0JuQKisPpc0sQCifCtyNP_bS3H69ARR8c9h12zaLOj4UUmHgbDgfM887pTnVQknR_9FoB22ZCzIYFvvDzKu0p9Eq9iUhDUcROSf7G7Xaw6l52pHKXdyTZat-rZw0g9TGuwFUsA0XFT-z3I1zcGvB1lOVfMr1pwA-FhekoZImJ7L1-hluVnwVI95DzbTZzFYG890', '9185857f-7365-4d35-b00a-5a31dcdd58d2', 'aCE8Q~nIMereO8MzR6cDsf4QUjJIGLhuBMlcPc-t', '2025-01-01 06:43:05', '2025-04-02 11:58:21');

-- --------------------------------------------------------

--
-- Table structure for table `staffs`
--

CREATE TABLE `staffs` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_code` int(10) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `hourminute` varchar(100) DEFAULT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `is_disable` enum('0','1') NOT NULL DEFAULT '0',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `login_auth_token` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `staffs`
--

INSERT INTO `staffs` (`id`, `role_id`, `first_name`, `last_name`, `email`, `phone_code`, `phone`, `password`, `hourminute`, `status`, `is_disable`, `created_by`, `created_at`, `updated_at`, `login_auth_token`) VALUES
(1, 1, 'System Super', 'Super Admin', 'superadmin@gmail.com', NULL, '1234567891', '$2a$10$ekMKJcAGvIiNIUrg0E3W5uZdoQsDrZUaZyw/p4XLb9/nS7WCJS3OK', '42:50', '1', '1', 0, '2024-06-28 12:02:41', '2025-10-29 10:49:23', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc2MTczNDk2MywiZXhwIjoxNzYxNzcwOTYzfQ.nmYajILxEHvQLn_A0yQNuQ6tfn74mjLvZKs8Hy2ghlQ'),
(2, 1, 'Amit', 'Agarwal', 'amit@outbooks.com', 44, '5777777777', '$2a$10$ekMKJcAGvIiNIUrg0E3W5uZdoQsDrZUaZyw/p4XLb9/nS7WCJS3OK', '42:50', '1', '1', 1, '2024-07-08 07:25:41', '2025-10-25 12:04:06', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc2MTM5Mzg0NiwiZXhwIjoxNzYxNDI5ODQ2fQ.XALlSwWR-n2fGewqvNgBuUUK70OFMe2BXYNLT2AWHWU'),
(3, 1, 'Ajeet', 'Ajeet', 'Ajeet@outbooks.com', NULL, '5777777777', '$2a$10$lQDJwmTJHLByytnG0SaIcOskd3II2HWFL5nYzNK29G3JV3G6nUwmW', NULL, '1', '1', 1, '2024-07-08 07:25:41', '2025-02-06 13:11:05', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcyODk4MjQ0NiwiZXhwIjoxNzI5MDE4NDQ2fQ.1U5gl6v26iwHHcMR42HQLLv9kJGsY366R77O9hD3t4Q'),
(4, 1, 'Vikas', 'Patel', 'vikaspnpinfotech@gmail.com', NULL, '9993034106', '$2a$10$T0UWcmLDhl.kFAfLvPDbUuCGEdstSD1taXGjUao1sE.kEgIYnN6pC', NULL, '1', '0', 1, '2024-10-14 15:42:25', '2025-08-12 04:50:11', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTczNDM1OTQ4MCwiZXhwIjoxNzM0Mzk1NDgwfQ.9iJaadEqnur_xO2QGZo2e3MehQ3Nvjlfppj5Sy5b3NE'),
(5, 4, 'shk', 'hu', 'accountmanager@gmail.com', NULL, '2777777777', '$2a$10$NSS0.c3FvdBSfGG2u624U.l.JyHEhy1eS5VjX/YYXkd5dwB/MwVF.', NULL, '1', '0', 2, '2024-10-22 10:12:19', '2025-08-20 13:07:14', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc1NTY5NTIzNCwiZXhwIjoxNzU1NzMxMjM0fQ.TMPgWtGR2WDV_Qcz2Cp9byNueVex88q1u1xcf3tz3ik'),
(6, 3, 'proce', 'pro', 'pro@gmail.com', NULL, '2777777777', '$2a$10$ScoANvWK5A2b7a3xogO0LubYkjJOWE3mB1AnbSkNAMY4/XDr4HBcq', NULL, '1', '0', 2, '2024-10-22 11:33:47', '2024-10-23 12:17:27', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTcyOTY4NTg0NywiZXhwIjoxNzI5NzIxODQ3fQ.8zXVqW0vX-6Fl16exT24YAmP0UrPBnlEipskEFwOuOc'),
(7, 2, 'Abhishek', 'Singh', 'abhishek.singh@outbooks.com', NULL, '07932337282', '$2a$10$zwRlpDZOHRM35YVOcft5bO8tPl63/UiFfotKWm/TMeeDDebYRYhHS', '00:00', '1', '0', 1, '2024-10-22 22:37:14', '2025-09-25 14:24:09', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTc0MzUwMDA3MCwiZXhwIjoxNzQzNTM2MDcwfQ.75pxvP_r7YYblI2_Tf-ZLM1-4tNrbjxvVn-cMUHpZfI'),
(8, 4, 'Lavesh', 'Premani', 'lavesh.premani@outbooks.com', NULL, '07932337282', '$2a$10$iGCpnOIuu.ipfP61Z8umM.RkJYpuzIqjT/1vT3cZRrRP8HCqtprmq', '00:00', '1', '0', 1, '2024-10-22 22:38:10', '2025-03-20 07:05:21', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTc0MjQ1NDMyMSwiZXhwIjoxNzQyNDkwMzIxfQ.6fyHeGn9Mc1gT--wiUQ0ET742o4LTlxF6WVQHCJgbmE'),
(9, 2, 'Hitixa', 'Raja', 'hitixa.raja@outbooks.com', NULL, '07932337282', '$2a$10$MUGz4gdRWJw60IjPAxnMau4wgwKMS1fv1qUMw3sxVFd4QqLjdd562', '00:00', '1', '0', 1, '2024-10-22 22:38:39', '2025-09-25 14:23:02', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc1ODgxMDE4MiwiZXhwIjoxNzU4ODQ2MTgyfQ.vEXpTohj_UP-ngmQJ5z1_S8BZXvrNkTHEqxPaNhT0iY'),
(10, 4, 'Abhishek', 'Mangal', 'abhishek.mangal1@outbooks.com', NULL, '07932337282', '$2a$10$OgpM32lciSVidkqg0WHf1uLVYk35jdMfEYZVSYaWhqIR6D05SALJW', '00:00', '1', '0', 1, '2024-10-22 22:39:06', '2025-10-28 00:15:41', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJpYXQiOjE3NjE2MTA1NDEsImV4cCI6MTc2MTY0NjU0MX0.kWUu527QvM3cVcUTsZYOOS2sucQmzDQmtkAh3xXrnj4'),
(11, 4, 'Ankit', 'Gupta', 'ankit.gupta@outbooks.com', NULL, '07932337282', '$2a$10$SIJMFK5k/woLfwqfEJGMruiO6.f5oZwnCBb5S9zhmoPR/MiVI5c6K', '00:00', '1', '0', 1, '2024-10-22 22:39:35', '2025-03-17 09:28:43', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExLCJpYXQiOjE3NDIyMDM3MjIsImV4cCI6MTc0MjIzOTcyMn0.WV-qU2Z3AcqVc6Gt57tCdhZw7NgKjx8hnUMOc4XwK8g'),
(12, 8, 'Ravinder', 'Singh', 'ravinder.singh@outbooks.com', NULL, '07932337282', '$2a$10$lLu6RcHvfrCQBhQ58tzT0OWBKZ.oqfhuRZRqG1H5D8AHUKU5NJ06e', NULL, '1', '0', 1, '2024-10-22 22:40:45', '2025-03-19 09:00:19', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJpYXQiOjE3NDIzNzQ4MTksImV4cCI6MTc0MjQxMDgxOX0.5FtmU4R50L47RrOBSSlwp9giCvveYj_lRDIt3wnVQls'),
(13, 8, 'Rohit', 'Roy', 'Rohit.Roy@outbooks.com', NULL, '07932337282', '$2a$10$tHPF.uDiTuq9ioPBJS5Fv.8Vdc0QtpUFDmMCNSwGz22WsV.lRcMTi', NULL, '1', '0', 1, '2024-10-22 22:41:43', '2025-02-18 10:22:37', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEzLCJpYXQiOjE3Mzk4NzQxNTcsImV4cCI6MTczOTkxMDE1N30.3vRGofWFF7M_OSQ-WKPjT4F-EI8iZKnD_2W_WlCaDUs'),
(14, 4, 'Sonu', 'Kumar', 'sonu.kumar@outbooks.com', NULL, '07932337282', '$2a$10$6K5PDgAMGW0HY3mQw.cmWe2D7GtfYLb.snby0OuOhd4mIZFWDqZUa', '00:00', '1', '0', 1, '2024-10-22 22:42:45', '2025-03-21 07:56:55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE3NDI1NDM4MTUsImV4cCI6MTc0MjU3OTgxNX0.EDjdN4Ko9hvT8rUR7A-i5OS_rhlnc0xHSrtDDIPfvGY'),
(15, 4, 'Amit', 'Singh', 'amit.singh@outbooks.com', NULL, '07932337282', '$2a$10$MibNCLM1WlsiiwsCcLdgiuxG0mLMJSGeVoIlSsXLgx.DbcuMhovvO', '00:00', '1', '0', 1, '2024-10-22 22:43:20', '2025-03-26 09:13:06', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE1LCJpYXQiOjE3NDI5ODAzODYsImV4cCI6MTc0MzAxNjM4Nn0.Dro7pSRIZCOOp0L_Q7Q8oBAp4sBuKu_LKOTdUvuv-_g'),
(16, 8, 'Mohit', 'Aneja', 'Mohit.Aneja@outbooks.com', NULL, '07932337282', '$2a$10$MxZgw1b5TORjQdfTAvNNSO4.AMSemelSfjcW2Cn31ldwWxHcr9qRq', NULL, '1', '0', 1, '2024-10-22 22:57:18', '2024-10-22 22:57:18', NULL),
(17, 9, 'Nidhi', 'Agarwal', 'Nidhi.Agarwal@outbooks.com', NULL, '7932337282', '$2a$10$hLKMdVm7R4SQIyq00G805uApx3XinS3UZJ76xVGLIXcJwwiCGzYEi', '00:00', '1', '0', 1, '2024-10-23 21:07:27', '2025-10-25 12:02:59', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE3LCJpYXQiOjE3MzA4ODg3NTcsImV4cCI6MTczMDkyNDc1N30.2ql5FppgPrHHdQmVg51JNYo6R7wgdYPAhewZQTWgEIM'),
(18, 8, 'nikita', 'bhagat', 'nikitabhagat.wpress@gmail.com', 44, '', '$2a$10$EkNpwjP6u9sWzraz8k5nDekMZ4fmniL3dk/BGXQ4cqPaj6T6.0ZWW', NULL, '1', '0', 2, '2024-10-24 08:41:16', '2025-05-02 11:30:27', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE4LCJpYXQiOjE3NDYxODU0MjcsImV4cCI6MTc0NjIyMTQyN30.apnCt2DBEg0nol17ZZsTLNHhRcMXwZY8GiPom3aPtR0'),
(19, 1, 'Dheeraj', 'Prakash', 'Dheeraj.Prakash@outbooks.com', NULL, '5777777777', '$2a$10$lQDJwmTJHLByytnG0SaIcOskd3II2HWFL5nYzNK29G3JV3G6nUwmW', NULL, '1', '0', 1, '2024-07-08 07:25:41', '2024-11-11 10:28:05', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcyODk4MjQ0NiwiZXhwIjoxNzI5MDE4NDQ2fQ.1U5gl6v26iwHHcMR42HQLLv9kJGsY366R77O9hD3t4Q'),
(20, 6, 'Pradeep', 'Soni', 'pradeep.soni@outbooks.com', 91, '7976410483', '$2a$10$7QO7cYoGVE95pElfejr3QOH7f.FtNWAnuoxlDARhjfjqBIYxmLkS6', '42:50', '1', '0', 7, '2024-11-18 09:19:20', '2025-08-21 15:17:47', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJpYXQiOjE3NTU3ODk0NjcsImV4cCI6MTc1NTgyNTQ2N30.sLo0pGt1JfiEVn-jNY9e7xJSmPSGZmaBc-HvGcsmAoo'),
(22, 3, 'Vanshika ', 'Aggarwal', 'vanshika.agrawal1@outbooks.com', 91, '0', '$2a$10$RkGUue.CTUCQ0ZQ1IK/NtuzshjeYXcFsJBwCADGcjlEMStq3Z1nAe', '42:50', '1', '0', 11, '2024-11-18 13:09:02', '2025-06-05 05:06:11', NULL),
(23, 6, 'Dheeraj', 'Prajapati', 'Dheeraj.prajapati@outbooks.com', 91, '9873170113', '$2a$10$8IeSzdzfkNxEDN1e9TULAe8yLYvIMbiUDF0bA6nuScLRsu4Kdmlge', '42:50', '1', '0', 15, '2024-11-18 15:51:58', '2025-06-05 05:06:11', NULL),
(24, 3, 'Khushi', 'Kaneriya', 'Khushi.kaneriya@outbooks.com', 91, '9873170113', '$2a$10$gzCtxy15ZaB2ndBT0krEO.xbUi47U4q6Zr2G.ho006gNzECuZWLB2', '42:50', '1', '0', 15, '2024-11-18 16:51:51', '2025-06-05 05:06:11', NULL),
(25, 3, 'Kanav', 'Jaglan', 'kanav.jaglan@outbooks.com', 91, '1111111111', '$2a$10$7J3iPmC3p06PwnzJc4h9Me8.InLOFsyAB0A5QFv.fcFONoRpj/cRW', '42:50', '1', '0', 8, '2024-11-19 16:10:40', '2025-06-05 05:06:11', NULL),
(26, 3, 'Kamal', 'Jatav', 'kamal.jatav@outbooks.com', 91, '9910705144', '$2a$10$vVCWCgn723owgZ9jhDs0nOFkHug1UKs0w8FrY1sbJ2f/1j7933eUW', '42:50', '1', '0', 14, '2024-11-19 17:23:10', '2025-08-20 11:11:06', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI2LCJpYXQiOjE3NTU2ODgyNjYsImV4cCI6MTc1NTcyNDI2Nn0.WCEy9Ed60ETbY10Mb28mB34aE8euTJ0p0ClFaGAckOE'),
(27, 3, 'Kripa Shankar', 'Saxena', 'kripashankar.saxena@outbooks.com', 91, '9654282850', '$2a$10$nUVJwGkKWL4VJtBlP8.xX.GcCGHYLCF2AfE7a1barCyLx2zFA2EJy', '42:50', '1', '0', 10, '2024-11-20 07:57:49', '2025-06-05 05:06:11', NULL),
(28, 6, 'Test ', 'User', 'testuserv@outbooks.com', 91, '9999999999', '$2a$10$AYusp1mOCJR9xHzekwmdsO0Co3qfR4jUunus5L7GyvVrAztP3PGZ6', '42:50', '0', '0', 1, '2024-11-23 12:55:16', '2025-06-05 05:06:11', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI4LCJpYXQiOjE3MzI1NDA4MzYsImV4cCI6MTczMjU3NjgzNn0.PtWeCY6CO_pSlCXwyGWH03hmEb_mPHWwJ9td-N5b13w'),
(29, 8, 'Narayan', 'Yadav', 'Narayan.Yadav@outbooks.com', 44, '9999555588', '$2a$10$./mTsSZ9/I5ovVC9gaXlL.aKT/ltQ65NxKG7DjpK.3Qb6PtqL.XUW', '42:50', '1', '0', 1, '2024-11-25 14:09:49', '2025-06-05 05:06:11', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI5LCJpYXQiOjE3MzYxNDI4MDYsImV4cCI6MTczNjE3ODgwNn0.Fz6osPgpqRe9zJcvWCpQNbHEbUTVpsWMnVgD8v12URo'),
(30, 4, 'Vikas', 'test', 'vikasptl17@gmail.com', 44, '7932337282', '$2a$10$jV8Z4eeffChWZ019d.maXOMeqzr8O.2haYXuSHbLI/Y4IhdnaoGN.', '45:30', '1', '0', 1, '2024-11-25 17:39:41', '2025-08-12 13:53:59', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMwLCJpYXQiOjE3NTUwMDY4MzksImV4cCI6MTc1NTA0MjgzOX0.w2oClJDa4tg81uJl_nhksa04gdjN3-7X9Vl8fWyPjho'),
(31, 3, 'Kshitiz', 'Kumar', 'kshitiz.kumar@outbooks.com', 91, '123567890', '$2a$10$0FMW1r6UqXrjLsru78PJ.e/tm9kruE6peFbbaG26437cg5vl3IN9C', '42:50', '1', '0', 10, '2024-11-28 07:34:34', '2025-06-05 05:06:11', NULL),
(32, 3, 'Ankur', 'Shukla', 'ankur.shukla@outbooks.com', 91, '', '$2a$10$95cc.xs.DQQEccuLVHiJfOx9zr4Ilcn7MhkSSBNtf7MoZ30deNP/u', '42:50', '1', '0', 14, '2024-11-28 12:38:23', '2025-06-05 05:06:11', NULL),
(33, 9, 'Test Nidhi', 'IGNORE2345678', 'nidhis2e@gmail.com', 44, NULL, '$2a$10$NBDpsvOtN7OnkrfjAIYVdu.20NMjtrKwlpkmlXIFR/KDgfZ9H2PtK', '42:50', '1', '0', 1, '2024-12-02 13:34:54', '2025-06-05 05:06:11', NULL),
(34, 6, 'vikas for', 'test', 'vikasfortest@gmail.com', 44, '7777788888', '$2a$10$XSSRlO1fTLBfH6fbDY5yoemSUOb441QEQfkJ34OupJyBtFLVOg5Hi', '42:50', '1', '0', 1, '2024-12-04 14:52:48', '2025-09-25 14:18:19', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM0LCJpYXQiOjE3NTg1NTM1NzEsImV4cCI6MTc1ODU4OTU3MX0.BbnQ6pdY_05MMTTwe-s1AIYrRhfd7UGFrooR0-n7tQg'),
(97, 2, 'Amit', 'Agarwal', 'amit@outbooks.co.uk', 44, '7932337282', '$2a$10$7zSSNTHffUx4JzNEEWOSzuQhW94t.6S1d0JuOHjp5EhtkBCvGd6pi', '42:50', '1', '0', 2, '2025-04-11 17:08:15', '2025-06-05 05:06:11', NULL),
(36, 8, 'vikas for', 'testing', 'vikastesting@gmail.com', 44, '7898342323', '$2a$10$o.wdCSasiJsvKbpD0FGmwekh3MMTXUMd/ZYQm1EkBu9auZ2BZMFKe', '42:50', '1', '0', 1, '2024-12-04 15:11:12', '2025-07-14 05:50:05', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM2LCJpYXQiOjE3NTI0NzIyMDUsImV4cCI6MTc1MjUwODIwNX0.ZCEyIueRyvS62JfXlmBoapOFWx5uU_pUf6ZVhIjvoxo'),
(37, 4, 'Sabiha', 'Ansari', 'sabiha.ansari@outbooks.com', 91, '123456789', '$2a$10$LyZgTnI6e/UevPlH7UevceeGZMWWAleFWZmzGMiTI/6gmwR1xogFy', '42:50', '1', '0', 1, '2024-12-23 15:13:02', '2025-06-05 05:06:11', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM3LCJpYXQiOjE3MzUwNDgwNTQsImV4cCI6MTczNTA4NDA1NH0.VLvZHLctFHxpAcMmtxjS1Z3afDncCkP9IU35RNeQWqU'),
(38, 4, 'Rajesh', 'Bhardwaj', 'rajesh.bhardwaj@outbooks.com', 91, '123456789', '$2a$10$GfUQvke5dT0uFAKTwyuw6.5HsgceD1Qvk0EaOBqa2HY3XKv2Ru6/.', '42:50', '1', '0', 1, '2024-12-23 15:14:01', '2025-06-05 05:06:11', NULL),
(39, 4, 'Gaurav', 'Mehra', 'gaurav.mehra@outbooks.com', 91, '123456789', '$2a$10$Pu2wWTVxfkxfHWNR/pqV3eIBVkRHLBL5gFKZhcRMu/FMZ4ndIek/a', '42:50', '1', '0', 1, '2024-12-23 15:14:56', '2025-06-05 05:06:11', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM5LCJpYXQiOjE3MzUwNTQzNjUsImV4cCI6MTczNTA5MDM2NX0.DZHk3XuxI2uPnlys7gAbrVMOJlO5_Pfu13JHsHIZd04'),
(40, 4, 'Sandhya', 'Bhardwaj', 'sandhya.bhardwaj@outbooks.com', 91, '123456789', '$2a$10$WwnZIxcf0QmqFhsJmTrv7.vZTuIW1A/oGArXJ7ZR635qu.PFwBhUO', '42:50', '1', '0', 1, '2024-12-23 15:15:58', '2025-08-23 13:11:07', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQwLCJpYXQiOjE3NTU5NTQ2NjcsImV4cCI6MTc1NTk5MDY2N30.qmig2vc0moQiQDGKeTdwCyUW3KIpfuS0Xvd2WWwUEaw'),
(41, 9, 'Hemant', 'Mehta', 'hemant.mehta@outbooks.com', 44, '123456789', '$2a$10$lraWt9bQjnxJi0SrTpGOKua8CHkBCTRAn64qjeF9Jkx9JQowXDOwS', '42:50', '1', '0', 1, '2025-01-07 12:18:49', '2025-06-05 05:06:11', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQxLCJpYXQiOjE3NDQwMzU5OTQsImV4cCI6MTc0NDA3MTk5NH0.4Fkux0-CSbPdHp6ORNX-JC4brCIQdvc1zfqU9g9zAao'),
(42, 4, 'Mauli', 'Mehta', 'mauli.mehta@outbooks.com', 44, '123456789', '$2a$10$UIwIu4t6qjBZaBjG2wq0WOW.uPupr12oZy71987ncW.2Zu4iLBBDe', '42:50', '1', '0', 1, '2025-01-07 12:19:33', '2025-08-21 15:15:33', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJpYXQiOjE3NTU3ODkzMzMsImV4cCI6MTc1NTgyNTMzM30.tV1qIAqUlhAFaaahGfALDvuKmXxVUgRN74klv-ogSUw'),
(43, 4, 'Himanshu', 'Khattar', 'himanshu.khattar@outbooks.com', 44, '123456789', '$2a$10$ZtSYHVcnJnRY.m6DzbB6IOno2L7ex9BWVSgPKdmWOW/s73Y4q4Mqm', '42:50', '1', '0', 1, '2025-01-07 12:20:25', '2025-06-05 05:06:11', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQzLCJpYXQiOjE3MzYzMjYyODAsImV4cCI6MTczNjM2MjI4MH0.gzweMp_p8ij_fq3DwYliYmn0TttxFk6ZxstQWiiYEVg'),
(44, 8, 'Sachin', 'Daga', 'Sachin.Daga@outbooks.com', 44, NULL, '$2a$10$ImL1QsIjNX/TkutJw05Ez.T5chg1VTmQWWWEHZNCAxcR1Bp/FFpKK', '42:50', '1', '0', 2, '2025-03-17 09:29:50', '2025-06-05 05:06:11', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ0LCJpYXQiOjE3NDQ4MDIwNzMsImV4cCI6MTc0NDgzODA3M30.ZX1r0gibYdmlyeqzYTS-e6nKVqYpsN59Ri1lGRubRD0'),
(45, 8, 'Anushree', 'R', 'Anushree@outbooks.com', 44, NULL, '$2a$10$H9ktdY0qOwkiB6BcrvX6deIvAEynU.tuy1gzx3Wbwelco.Z8x.IQ2', '42:50', '1', '0', 44, '2025-03-17 09:30:33', '2025-06-11 15:17:23', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ1LCJpYXQiOjE3NDk2NTUwNDMsImV4cCI6MTc0OTY5MTA0M30.Lvl7x50XIgJYo8IE8oJgrVejUNS4ikyjQoFk6MZRBNk'),
(46, 4, 'Lalita', 'Pal', 'Lalita.pal@outbooks.com', 44, '', '$2a$10$B4Ikc23apssEe.wDYe91uO1EBDShzYCqvAI08e02j2DiEF7A8b7Re', '42:50', '1', '0', 12, '2025-03-17 09:49:12', '2025-08-11 15:33:19', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ2LCJpYXQiOjE3NTQ5MjYzOTksImV4cCI6MTc1NDk2MjM5OX0.i_0m3fN7nE8z1GQoRuvbA9BcqC3SlGRIDUcLYmv6WzU'),
(47, 4, 'Tushar', 'Sharma', 'tushar.sharma@outbooks.com', 44, '', '$2a$10$9gQs./ST7Sk9ArAol2Jsx.Atowthuj99p/nVPbv5hiWX6ktbTjAJa', '42:50', '1', '0', 46, '2025-03-17 10:27:49', '2025-08-21 15:13:42', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ3LCJpYXQiOjE3NTU3ODkyMjIsImV4cCI6MTc1NTgyNTIyMn0.oJS-o9pDY0LkvIkVdn3oApCSW1gCmZUh0LeCZQLaTl4'),
(48, 4, 'Anand', 'Vyas', 'anand.vyas@outbooks.com', 44, '', '$2a$10$NKL8m9TECcKdlBNG01Woluqq44LMsfsz72FBsXw0/WHmfap7si4BG', '42:50', '1', '0', 46, '2025-03-17 10:28:39', '2025-08-14 05:02:13', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ4LCJpYXQiOjE3NTUxNDc3MzMsImV4cCI6MTc1NTE4MzczM30.t7cs0odT9z9p9EMiFPZwP7qMJFV_YmIzsURgIaZwIfk'),
(49, 3, 'Utsav', 'Taneja', 'utsav.taneja@outbooks.com', 44, '', '$2a$10$lZvdmiu0nCQFwPfRGPVnTecFxWhIfGGJyQ2Q3q6kp41L1hcz0tceW', '42:50', '1', '0', 10, '2025-03-17 10:44:02', '2025-06-05 05:06:11', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ5LCJpYXQiOjE3NDM0MDI4NTYsImV4cCI6MTc0MzQzODg1Nn0.IKB1M7H7adu7HnneqrjSlMs-4namE3PPoi7aXTcAI_k'),
(50, 4, 'Deepak', 'Singh', 'Deepak.Singh@outbooks.com', 44, '123456789', '$2a$10$8tuLGADI2WfsjKIygB5k/.xcGNxLuJvDsIm4AfOyZfmf9uB29uz.C', '42:50', '1', '0', 2, '2025-03-17 13:26:37', '2025-06-05 05:06:11', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUwLCJpYXQiOjE3NDM0MTA0MDgsImV4cCI6MTc0MzQ0NjQwOH0.3fSvT0nLI27I-2N-VCFt32fUJUueVsHqCaBDGODJV7A'),
(51, 4, 'Nishtha', 'Jain', 'Nishtha.Jain.@Outbooks.com', 44, '123456789', '$2a$10$E7SYXZgebo8TVsUYxl/7QO2TneItgW8cx0taZxK5Scd/4lUNZmE5G', '42:50', '1', '0', 2, '2025-03-17 13:27:27', '2025-06-05 05:06:11', NULL),
(52, 4, 'Robin', 'Bhaik', 'Robin.Bhaik@outbooks.com', 44, '123456789', '$2a$10$SRB/Xs8nAKEJ63IIWlTPiO.f7.eZ7RJfEgx5ZnvggG/r9hCBdctcq', '42:50', '1', '0', 2, '2025-03-17 13:28:31', '2025-08-01 14:00:54', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUyLCJpYXQiOjE3NTQwNTY4NTQsImV4cCI6MTc1NDA5Mjg1NH0.-4os9_XeVQE4l87ax2qLf11jqOxUrVI6JRQdy_FBW3s'),
(53, 4, 'Vivek', 'Singh', 'Vivek.Singh@outbooks.com', 44, '123456789', '$2a$10$1dxzRTRNsZogLZrEFUD3lue0ve1LNoAa2oz.yO2aWk.kzXLB/zgZa', '42:50', '1', '0', 1, '2025-03-17 13:29:13', '2025-08-25 12:47:06', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUzLCJpYXQiOjE3NTYxMjYwMjYsImV4cCI6MTc1NjE2MjAyNn0.CJja3cNou3OQZMtDbT5nkL8YB6PyBohCqpeF9ZV5L5A'),
(54, 3, 'Mohammad', 'Kashif', 'Mohammad.kasif@outbooks.com', 44, '', '$2a$10$7P5Gb9zIBwag7xNhJfF0B.2ysDFlrS5ZnB.6URzvKePWHzz2WXmIK', '42:50', '1', '0', 15, '2025-03-17 13:38:59', '2025-06-05 05:06:11', NULL),
(55, 8, 'Elakkya', 'Vikas', 'elakkaya.vikas@outbooks.com', 44, '123456789', '$2a$10$HoUNnhAdrSSfAAcqRdbQT.EpFK1vlcSlCLtlfiR1p7woozBl4g8P2', '42:50', '1', '0', 55, '2025-03-17 13:51:40', '2025-08-02 08:39:31', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJpYXQiOjE3NTQxMjM5NzEsImV4cCI6MTc1NDE1OTk3MX0.ow8nwPTVQqcm1PJ9BZQfqj6nRwuKxmDcO1HfARu8p-0'),
(56, 9, 'Kamlesh', 'Kumar', 'kamlesh.kumar@outbooks.com', 44, '123456789', '$2a$10$8nReVzxuoxJKY2qYvoG4PuE30t/lYsviMH50cU1OTrP3YwYnACUCy', '42:50', '1', '0', 2, '2025-03-17 13:58:22', '2025-06-05 05:06:11', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU2LCJpYXQiOjE3NDQ4MDM4NTIsImV4cCI6MTc0NDgzOTg1Mn0.WshQjLsxc54FKkKYdtOOnMLTBOOv408jSgbqowamMwY'),
(57, 3, 'Bharti', 'Setia', 'bharti.setia@outbooks.com', 44, '', '$2a$10$NpnY9i/qsIHqIupwmje7ROl0ODrteoudtfPKbY5qTFBziNB4G.bxy', '42:50', '1', '0', 9, '2025-03-18 09:12:30', '2025-06-05 05:06:11', NULL),
(58, 3, 'Sachin', 'Singh', 'Sachin.Singh1@outbooks.com', 44, '', '$2a$10$ET/BpPyD85MnsEgbeQNBieP5x8FG6QAb1hXUXq1YdXEKdfnoTu9qS', '42:50', '1', '0', 47, '2025-03-18 09:20:42', '2025-06-05 05:06:11', NULL),
(59, 4, 'Vikash ', 'Jaimini', 'vikash.jaimini@outbooks.com', 44, '', '$2a$10$Zq26klcKEaqL5dHXO8j4TeBTGoFMx7aP1J7kKzSHlj5AqvcNWGIVK', '42:50', '1', '0', 12, '2025-03-18 09:41:54', '2025-06-05 05:06:11', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU5LCJpYXQiOjE3NDM1ODU3MDksImV4cCI6MTc0MzYyMTcwOX0.3SNc_GTw0LGLVBCtocsvrDIUlOQ1Q5az65EzsqxZdXA'),
(60, 4, 'Mohit', 'Kumar', 'mohit.kumar@outbooks.com', 44, '', '$2a$10$9I.BpZL9JFtKnUGn3IQz5e8SKYMBGeR15P6LtXIL2VyDx3pxZRze2', '42:50', '1', '0', 12, '2025-03-18 09:51:32', '2025-08-05 13:42:54', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYwLCJpYXQiOjE3NTQ0MDEzNzQsImV4cCI6MTc1NDQzNzM3NH0.ZsQ0U6sw3UV4XxqWK9eajKjAopt1H3mWckQip1JZgQ8'),
(61, 4, 'Nishtha', 'Jain', 'nishtha.jain@outbooks.com', 44, '', '$2a$10$PQ./6R37r9SaVeLl7I.Iweub.5/BRcMv/JWIj/8vHpxMdeMtkZiLO', '42:50', '1', '0', 12, '2025-03-18 09:57:38', '2025-08-01 14:10:41', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYxLCJpYXQiOjE3NTQwNTc0NDEsImV4cCI6MTc1NDA5MzQ0MX0.f5eQ0QQ4SaHUruEOxM_dTGwimCAza_Zr6zg8iup-hmw'),
(62, 3, 'Sridhar', 'Kumar Thakur', 'Sridhar.Thakur@outbooks.com', 91, NULL, '$2a$10$1U2BAlAiUukCyQH/9o2lje1HJYKDRndYrsdiyamK7b9aiUjfmxVS.', '42:50', '1', '0', 50, '2025-03-18 11:30:02', '2025-06-05 05:06:11', NULL),
(63, 3, 'Satish', 'Khemchandani', 'Satish.Khemchandani@outbooks.com', 44, '', '$2a$10$GMp/6euZ.x3Czfy61AKXLOyGpfjB8tSAOzL09pMvKS7jGO9aSY52i', '42:50', '1', '0', 53, '2025-03-18 14:31:56', '2025-06-05 05:06:11', NULL),
(64, 3, 'Narayan ', 'Singh', 'narayan.singh@outbooks.com', 44, '', '$2a$10$Vk.UCZkbGkUufyhOcMUUdelatJGWdfOS06Zt0STmVFna/QZIX1y0q', '42:50', '1', '0', 53, '2025-03-18 14:32:47', '2025-06-05 05:06:11', NULL),
(65, 3, 'Ayushi', 'Jaiswal', 'Ayushi.Jaiswal@outbooks.com', 44, '', '$2a$10$EwHd8.TdgZjUt09rGH6N9ePxMZmQyfZ8aIoCMr3iUYgCgNzsYkE/.', '42:50', '1', '0', 53, '2025-03-18 14:38:50', '2025-06-05 05:06:11', NULL),
(66, 3, 'Moumita', 'Guha', 'Moumita.Guha@outbooks.com', 44, '', '$2a$10$emJnzX0hEDIolfaL1KKBIeddMg6gxiXL99kWNOZ35qXXymKdj6XSy', '42:50', '1', '0', 53, '2025-03-18 14:39:14', '2025-06-05 05:06:11', NULL),
(67, 3, 'Priya', 'Jangir', 'Priya.Jangir@outbooks.com', 44, '', '$2a$10$TjuutCpx2uWncbNMcIWuDe5t9p20CtH0OduLq.cOmjdaIDGnBK.Zm', '42:50', '1', '0', 53, '2025-03-18 14:39:39', '2025-06-05 05:06:11', NULL),
(68, 6, 'Vivek', 'Jangid', 'vivek.jangid@outbooks.com', 44, '', '$2a$10$1KxHx0etEJk6NFTSJfBR6u0tjI7TqaZK8rqQoIyK2Kk3m.UUUCVVK', '42:50', '1', '0', 59, '2025-03-19 03:47:06', '2025-07-25 06:11:25', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjY4LCJpYXQiOjE3NTM0MjM4ODUsImV4cCI6MTc1MzQ1OTg4NX0.V-FJj_Hw3fJoDofi_ZmQicq-yF8VGLp6mfc4oygdL3M'),
(69, 3, 'Priya', 'Gupta', 'Priya.gupta@outbooks.com', 44, '', '$2a$10$25ciE6bbf1qYlwFppogNcurUBnn3wm3khS9hL6d5O.hl4XbvPWkMW', '42:50', '1', '0', 59, '2025-03-19 03:47:53', '2025-06-05 05:06:11', NULL),
(70, 3, 'Varun', 'Singh', 'varun.singh@outbooks.com', 44, '', '$2a$10$dQnoDwZJREuDcU.uRIeZUuUpd0uTOQ/7FeYV/o11.n3Or9SMkbuom', '42:50', '1', '0', 59, '2025-03-19 03:48:22', '2025-06-05 05:06:11', NULL),
(71, 3, 'manisha', 'Jain', 'manisha.jain@outbooks.com', 44, '', '$2a$10$4eNMWBRPOXu5dgNf2UGCV.4.mE7QoBN6LiXyqqcer1gcV2ycChexO', '42:50', '1', '0', 59, '2025-03-19 03:48:50', '2025-06-05 05:06:11', NULL),
(72, 3, 'Pankaj', 'Choudhary', 'pankaj.choudhary@outbooks.com', 44, '', '$2a$10$o3c6Sr8dzDkwd66IdsUf4uGJGqL8cu7b5CA14V/OJv1tujyOpo4Ki', '42:50', '1', '0', 59, '2025-03-19 03:49:31', '2025-06-05 05:06:11', NULL),
(73, 3, 'khushboo', 'somvanshi', 'khushboo.somvanshi@outbooks.com', 44, '', '$2a$10$YzSS6xw7OD/AXkZjQVKs..Fr.nDu9wReRzFGxOdEj9nHEwVrZRmTq', '42:50', '1', '0', 59, '2025-03-19 03:51:27', '2025-06-05 05:06:11', NULL),
(74, 3, 'Saumya', 'Agrawal', 'saumya.agrawal@outbooks.com', 44, '', '$2a$10$o5CyuAEOlcrsOgqvqtR81.mHSeg8Tofvj5Chf0AB6XWpRmI2xRZPW', '42:50', '1', '0', 59, '2025-03-19 03:53:17', '2025-06-05 05:06:11', NULL),
(75, 3, 'satyam', 'kumar', 'satyam.kumar@outbooks.com', 44, '', '$2a$10$NkUFG.F0gbjdvnVbSD7izeJY9BcQlrSH/OC.TacebhgmJtMe.HWQW', '42:50', '1', '0', 59, '2025-03-19 03:53:58', '2025-08-11 14:57:10', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjc1LCJpYXQiOjE3NTQ5MjQyMzAsImV4cCI6MTc1NDk2MDIzMH0.hOCxx2yljOVCwc2j7RIV0YVTnkbd9sV5Cqma52JvuiY'),
(76, 3, 'Harun Saifi  ', 'Mohammad ', 'Harun.Saifi@outbooks.com', 44, '', '$2a$10$Uy5tiBLdACQ3LzkzFTb3Zu0dhrXwAR3sL1aKkVRPzijZEMExgs9xW', '42:50', '1', '0', 59, '2025-03-19 03:54:48', '2025-08-21 15:16:28', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjc2LCJpYXQiOjE3NTU3ODkzODgsImV4cCI6MTc1NTgyNTM4OH0.kITYT_jK2_hjNRnY9abX8xjCGGOAssuP_zerBClEynI'),
(77, 3, 'Talib', 'Mohd ', 'Mohd.Talib@outbooks.com', 44, '', '$2a$10$z8ma5YVxl7YNPhCV6536Qerq7C1jpP/55ELnIQqkt8A8WJTrNEfbi', '42:50', '1', '0', 59, '2025-03-19 03:55:20', '2025-06-05 05:06:11', NULL),
(78, 3, 'Shreya', 'Gupta', 'shreya.gupta@outbooks.com', 44, '', '$2a$10$Oc4DyjySYdzE3/MWa7emnOeTonz2cAHwg/qd8DBSBDkExh7LTYg1.', '42:50', '1', '0', 59, '2025-03-19 03:55:51', '2025-06-05 05:06:11', NULL),
(79, 3, 'Aiswarya', 'VC', 'aiswarya.vc@outbooks.com', 44, '', '$2a$10$ApyPoSDs40H5dd1AGgIwl.EmsW6plU9.PxhsAHW8VA.P75zpvuQyG', '42:50', '1', '0', 59, '2025-03-19 03:56:42', '2025-06-05 05:06:11', NULL),
(80, 4, 'Bhakti', 'Kalambate', 'Bhakti.Kalambate@outbooks.com', 44, NULL, '$2a$10$6ILWvho6vi.68TsudeSIie7XQyT4Nj7eUlQESJZP3MYAzCOMjgKQC', '42:50', '1', '0', 59, '2025-03-19 03:57:27', '2025-08-01 14:58:58', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgwLCJpYXQiOjE3NTQwNjAzMzgsImV4cCI6MTc1NDA5NjMzOH0.WB-0mAxyODs8X3LP6znFu-ia-dUDt2XOc3leTlMu6wQ'),
(81, 3, 'Shruti', 'Manwani', 'shruti.manwai@outbooks.com', 44, '', '$2a$10$ey/4usW9jH1lW09sEAxt0OY1qRJimBtTUzNEPJtCTxCJ6dZ3888BG', '42:50', '1', '0', 59, '2025-03-19 03:58:05', '2025-06-05 05:06:11', NULL),
(82, 3, 'Diksha', 'Garg', 'diksha.garg@outbooks.com', 91, '9983273805', '$2a$10$pQonz7vUC9tzSACj7iC1aeZYk7vCKN.D0mYw5fHdZXrPQkdC4Jw/S', '42:50', '1', '0', 61, '2025-03-19 06:43:53', '2025-06-05 05:06:11', NULL),
(83, 3, 'Sunny ', 'Thoriya', 'sunny.thoriya@outbooks.com', 91, '8758950063', '$2a$10$JLJ9pf3cEKw5w65fboevjepuPe4KR1HeXtPKBNh29oJAMcWA3ZIqa', '42:50', '1', '0', 61, '2025-03-19 06:44:48', '2025-06-05 05:06:11', NULL),
(84, 3, 'Kanika ', 'Gosian', 'kanika.gosain@outbooks.com', 91, '8860448775', '$2a$10$JTBKF4SYWWujJMxfuJFjRugbuvdAcdfZcVbr.qfkp2AglmkeAqrBG', '42:50', '1', '0', 61, '2025-03-19 06:45:35', '2025-06-05 05:06:11', NULL),
(85, 3, 'Vipasha', 'Santuka', 'vipasha.santuka@outbooks.com', 91, '9827664496', '$2a$10$rA9RTALeFfhSdPRCNPVar.jPo2iJ8qT9GLvfL7x.j5Tu7RwuMrylq', '42:50', '1', '0', 61, '2025-03-19 06:47:00', '2025-06-05 05:06:11', NULL),
(86, 3, 'Mudit', 'Yadav', 'mudit.yadav@outbooks.com', 44, '', '$2a$10$/OEY/pThkLaEXEUXNShaX.WkQUZKQKjHK9bSLMYdPvKjzarWaaS2.', '42:50', '1', '0', 61, '2025-03-19 07:11:39', '2025-06-05 05:06:11', NULL),
(87, 3, 'Shalini', 'Gudivada', 'shalini.gudivada@outbooks.com', 44, '', '$2a$10$Y6qog7QZYXXozakmmuC5YucbJh4rTyf2hhq.aQUMLAMW5XQOZSeQi', '42:50', '1', '0', 61, '2025-03-19 07:12:31', '2025-06-05 05:06:11', NULL),
(88, 4, 'Darshita', 'Trivedi', 'darshita.trivedi@outbooks.com', 44, '', '$2a$10$7jK2pBsSbNflq3xjzdGU/OGZyOKgfVqlb/ohRxTL2VLr4u2QPa61u', '42:50', '1', '0', 12, '2025-03-19 09:01:57', '2025-08-20 11:26:09', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjg4LCJpYXQiOjE3NTU2ODkxNjksImV4cCI6MTc1NTcyNTE2OX0.FzLx1CBQThFmzNmO4kfI6Yj_RUSEDCGKvOYcJ1sC_to'),
(89, 3, 'Gaurav', 'Kumar', 'gaurav.kumar@outbooks.com', 91, '9650521233', '$2a$10$0VSl76kEaPyhGhfCwdZ6oeQcEBPpN.1URg6Vb.PfFgwGlxY2DjbDu', '42:50', '1', '0', 52, '2025-03-19 10:17:40', '2025-06-05 05:06:11', NULL),
(90, 3, 'Kanishka', 'Chhabra', 'Kanishka.Chhabra@outbooks.com', 44, '', '$2a$10$xdh4jrXeZP9fLx6AUQyW6eY3aB2RSgrTpKODmMDved7O./pw0xKe2', '42:50', '1', '0', 60, '2025-03-19 15:11:44', '2025-06-05 05:06:11', NULL),
(91, 3, 'Gaurav', 'Prajapat', 'Gaurav.Prajapat@outbooks.com', 44, '', '$2a$10$TVY/CbLRMAxaRW4XglvmIueite8OjxySeEZRQVxrvajqyepcx.6C.', '42:50', '1', '0', 60, '2025-03-19 15:12:34', '2025-06-05 05:06:11', NULL),
(102, 3, 'Vikas', 'Yadav', 'ruchi@gmail.com', 44, NULL, '$2a$10$ApXY3b55DKqxpd.4qhUslO6.UmrSWHSGex.x/vZT/5FvZIQ9sVcoq', '42:50', '1', '0', 1, '2025-06-24 14:10:14', '2025-08-05 13:49:12', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwMiwiaWF0IjoxNzU0NDAxNzUyLCJleHAiOjE3NTQ0Mzc3NTJ9.POTNmnR_Vh0zvknAlwfG_IO--Q-4wcwNsOVCcF9Qjro'),
(93, 3, 'Talib', 'Khan', 'talib.khan@outbooks.com', 44, '', '$2a$10$oJuG.3l0/BrFH4QV0RpSAOwVPEdTEErBw1VqqLTc2e0nlX2qnSRce', '42:50', '1', '0', 14, '2025-03-21 07:59:14', '2025-08-05 13:47:42', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjkzLCJpYXQiOjE3NTQ0MDE2NjIsImV4cCI6MTc1NDQzNzY2Mn0.PoEb8sCDD4DDIlhm74zuLnmj_Emii_GoL3wphzQeYTc'),
(103, 2, 'Shakir test', 'test', 'shakirtest@gmail.com', 44, NULL, '$2a$10$2n1MUX.FboTf3vES4KYgf.QR7uOpKKud/X3z9ZgZZXqi43q4M027.', '42:50', '1', '0', 1, '2025-06-26 13:22:44', '2025-09-25 14:18:48', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwMywiaWF0IjoxNzUzMzc0MjUzLCJleHAiOjE3NTM0MTAyNTN9.UTZ_1Z2K8G2iSaOLBhoTLqKJHsx-8fKD4zuM5W6l1pc'),
(104, 8, 'New staff', 'test', 'newtestdev@gmail.com', 44, NULL, '$2a$10$P2lhlu4BIjuqa3vz2WaXPOWhfcZT.kJspv/Ir4lnas/T8Ru3H3oL2', '42:50', '1', '0', 1, '2025-07-12 13:37:24', '2025-08-18 12:41:05', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwNCwiaWF0IjoxNzU1NTIwODY1LCJleHAiOjE3NTU1NTY4NjV9.sRRulfAQPsz5zUawBvoW8vhrT_k0YsK8kWD2otKUmHU'),
(105, 5, 'Staff account ', 'manager', 'staffaccountmanager@gmail.com', 44, '', '$2a$10$jTW931j7K2mlinqz/0LfmuLBMc4/P2RWfJ.ZaOcJEofXMtH4SJmg.', '42:50', '1', '0', 1, '2025-08-20 11:52:18', '2025-10-06 12:35:29', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwNSwiaWF0IjoxNzU1Nzg5MTQ0LCJleHAiOjE3NTU4MjUxNDR9.h_CHO3Huiw3z5uTXdro9cAXUJtziZFdXzgV5RK-3qdI'),
(106, 3, 'Staff ', 'Processor', 'staffprocessor@gmail.com', 44, '', '$2a$10$DQh/tEgUFlYNOgw9LBgZi.q1ljx7Zau.r5OZgluz/dhjkeLHcfOZu', '42:50', '1', '0', 1, '2025-08-20 11:53:03', '2025-08-20 13:47:08', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwNiwiaWF0IjoxNzU1Njk3NjI4LCJleHAiOjE3NTU3MzM2Mjh9.VKp1xWvhpzETLn-m463z3_eOd-hMjeKv3bVANe522zI'),
(107, 6, 'Staff ', 'Reviewer', 'staffreviewer@gmail.com', 44, '', '$2a$10$sTHCB9OadlyxgllOrpWf.OanpEcAcQFaCoh4nPD0SnO9f3WNmMZby', '42:50', '1', '0', 1, '2025-08-20 11:53:39', '2025-08-20 13:56:24', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwNywiaWF0IjoxNzU1Njk4MTg0LCJleHAiOjE3NTU3MzQxODR9.uF2E6t--5G2bGYUiJqYkMX4qnt0ZutMEcVE6h9WXiq0'),
(108, 2, 'Staff', 'admin', 'staffadmin@gmail.com', 44, '', '$2a$10$F1DsQoC9r6ikcoj7waXrEetwmAQ8SyC9d8V5YWg241v0haQ/mkMPm', '42:50', '1', '0', 1, '2025-08-20 11:54:08', '2025-08-20 11:56:00', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwOCwiaWF0IjoxNzU1NjkwOTYwLCJleHAiOjE3NTU3MjY5NjB9.gIyfXyVpzEi-GHZSnjnLKqpzRbDYmsmgkdzFAinhB70'),
(109, 8, 'Staff', 'management', 'staffmanagement@gmail.com', 44, '', '$2a$10$Jcc2w9eGGGfx2SNESpCxzeFAFHLUQIOUyxRxpakCWQZmZtAhyk1XS', '42:50', '1', '0', 1, '2025-08-20 11:54:52', '2025-08-20 13:41:07', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwOSwiaWF0IjoxNzU1Njk3MjY3LCJleHAiOjE3NTU3MzMyNjd9.XBVyODNVrLBiQUNMH_P87rIsCfNVjMyYYox024Bi2NM'),
(110, 9, 'staff', 'Support', 'staffsupport@gmail.com', 44, '', '$2a$10$K7heIPSct.ZZed9WBhlU5.YmmqxOLMTeDu2VOpWX877UtqGJsUTDG', '42:50', '1', '0', 1, '2025-08-20 11:55:27', '2025-08-20 13:38:09', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExMCwiaWF0IjoxNzU1Njk3MDg5LCJleHAiOjE3NTU3MzMwODl9.87i3uuLrjKezAq87u4qjijHGfMHO5XyqIjcsTSB-UJI'),
(111, 4, 'staff acount manager', 'multiple1', 'staffaccountmanagerm1@gmail.com', 44, NULL, '$2a$10$BLoA9yI5nhA3f55OG3VyU.Uh6SIfZXSyflYD8f.T8dnX9dXPqT89.', '42:50', '1', '0', 1, '2025-08-20 12:36:10', '2025-09-27 12:50:56', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExMSwiaWF0IjoxNzU4OTc3NDU2LCJleHAiOjE3NTkwMTM0NTZ9.r5LAA7h5kIQbdFjz4tFrNAtetNovrM4Q4L_lrfBmhS8'),
(112, 4, 'staff acount manager', 'multiple2', 'staffaccountmanagerm2@gmail.com', 44, NULL, '$2a$10$qoJHlSLK8Mg5uTOz4RH6IeE52XQxHxQNgxmdVX82RcEQVxL5XN9oG', '42:50', '1', '0', 1, '2025-08-20 12:36:44', '2025-10-04 13:32:08', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExMiwiaWF0IjoxNzU5NTg0NzI4LCJleHAiOjE3NTk2MjA3Mjh9.PRUoMqv00vHZt4ntbcCnQiFkRUyesIA8dv7oc404UGE'),
(113, 5, 'staff acount manager', 'multiple3', 'staffaccountmanagerm3@gmail.com', 44, NULL, '$2a$10$N2Y46YnVrQVn4a37BNHoeOxCJBdLKTGIFuLD9xxv7DUbtq15vOHNq', '42:50', '1', '0', 1, '2025-08-20 12:37:13', '2025-09-12 14:03:41', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExMywiaWF0IjoxNzU3MzM4NTU3LCJleHAiOjE3NTczNzQ1NTd9.ASc8fRrowvQfVL8W_EeHKfkEKtGI0OGy1k4jTmOuo1Y');

-- --------------------------------------------------------

--
-- Table structure for table `staff_competencies`
--

CREATE TABLE `staff_competencies` (
  `staff_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `staff_competencies`
--

INSERT INTO `staff_competencies` (`staff_id`, `service_id`, `created_at`, `updated_at`) VALUES
(50, 1, '2025-03-18 08:06:22', '2025-03-18 08:06:22'),
(50, 2, '2025-03-18 08:06:22', '2025-03-18 08:06:22'),
(50, 3, '2025-03-18 08:06:22', '2025-03-18 08:06:22'),
(50, 4, '2025-03-18 08:06:22', '2025-03-18 08:06:22'),
(50, 5, '2025-03-18 08:06:22', '2025-03-18 08:06:22'),
(50, 6, '2025-03-18 08:06:22', '2025-03-18 08:06:22'),
(50, 7, '2025-03-18 08:06:22', '2025-03-18 08:06:22'),
(50, 8, '2025-03-18 08:06:22', '2025-03-18 08:06:22'),
(58, 1, '2025-03-18 09:21:44', '2025-03-18 09:21:44');

-- --------------------------------------------------------

--
-- Table structure for table `staff_logs`
--

CREATE TABLE `staff_logs` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `module_name` varchar(100) NOT NULL,
  `module_id` int(11) NOT NULL DEFAULT 0,
  `log_message` text NOT NULL,
  `log_message_all` text DEFAULT NULL,
  `permission_type` varchar(50) NOT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `staff_logs`
--

INSERT INTO `staff_logs` (`id`, `staff_id`, `date`, `module_name`, `module_id`, `log_message`, `log_message_all`, `permission_type`, `ip`, `created_at`, `updated_at`) VALUES
(1, 36, '2025-01-30', '-', 0, ' Logged In', 'Management vikas for testing  Logged In ', '-', '122.168.114.106', '2025-01-30 13:23:32', '2025-01-30 13:23:32'),
(2, 1, '2025-02-10', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-02-10 13:34:57', '2025-02-10 13:34:57'),
(3, 2, '2025-02-10', '-', 0, ' Logged In', 'Super Admin Amit Agarwal  Logged In ', '-', '122.168.114.106', '2025-02-10 13:59:10', '2025-02-10 13:59:10'),
(4, 1, '2025-02-10', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-02-10 14:02:37', '2025-02-10 14:02:37'),
(5, 1, '2025-02-10', 'customer', 1, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_BIS_00001(BISHOPS DAL ENERGY STORAGE LIMITED_00001)', 'created', '171.79.39.52', '2025-02-10 14:03:38', '2025-02-10 14:03:38'),
(6, 1, '2025-02-10', 'customer', 1, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_BIS_00001(BISHOPS DAL ENERGY STORAGE LIMITED_00001)', 'updated', '171.79.39.52', '2025-02-10 14:03:46', '2025-02-10 14:03:46'),
(7, 1, '2025-02-10', 'client', 1, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_BIS_AGM_00001(AGMAN COCOA LIMITED_00001)', 'created', '171.79.39.52', '2025-02-10 14:04:32', '2025-02-10 14:04:32'),
(8, 1, '2025-02-10', 'master status', 7, 'edited master status Complete - Draft Sent', 'Super Admin System Super Super Admin edited master status Complete - Draft Sent ', 'updated', '171.79.39.52', '2025-02-10 14:06:21', '2025-02-10 14:06:21'),
(9, 1, '2025-02-11', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-02-11 06:36:06', '2025-02-11 06:36:06'),
(10, 1, '2025-02-11', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-02-11 06:36:07', '2025-02-11 06:36:07'),
(11, 13, '2025-02-18', '-', 0, ' Logged In With Microsoft', 'Management Rohit Roy  Logged In With Microsoft ', '-', NULL, '2025-02-18 10:22:37', '2025-02-18 10:22:37'),
(12, 1, '2025-02-18', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-02-18 13:31:20', '2025-02-18 13:31:20'),
(13, 12, '2025-02-24', '-', 0, ' Logged In', 'Management Ravinder Singh  Logged In ', '-', '103.100.4.194', '2025-02-24 13:58:57', '2025-02-24 13:58:57'),
(14, 12, '2025-03-13', '-', 0, ' Logged In', 'Management Ravinder Singh  Logged In ', '-', '43.248.153.199', '2025-03-13 15:50:01', '2025-03-13 15:50:01'),
(15, 1, '2025-03-17', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-03-17 09:28:17', '2025-03-17 09:28:27'),
(16, 1, '2025-03-17', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-03-17 09:28:27', '2025-03-17 09:28:27'),
(17, 1, '2025-03-17', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-03-17 09:28:27', '2025-03-17 09:28:42'),
(18, 1, '2025-03-17', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-03-17 09:28:42', '2025-03-17 09:28:43'),
(19, 11, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Account Manager Ankit Gupta  Logged In With Microsoft ', '-', NULL, '2025-03-17 09:28:42', '2025-03-17 09:28:43'),
(20, 2, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Super Admin Amit Agarwal  Logged In With Microsoft ', '-', NULL, '2025-03-17 09:28:42', '2025-03-17 09:28:43'),
(21, 1, '2025-03-17', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-03-17 09:28:42', '2025-03-17 09:28:43'),
(22, 1, '2025-03-17', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-03-17 09:28:43', '2025-03-17 09:28:43'),
(23, 1, '2025-03-17', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-03-17 09:28:43', '2025-03-17 09:28:43'),
(24, 1, '2025-03-17', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-03-17 09:28:43', '2025-03-17 09:28:43'),
(25, 7, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Account Manager Abhishek Singh  Logged In With Microsoft ', '-', '122.176.134.210', '2025-03-17 09:29:36', '2025-03-17 09:29:36'),
(26, 1, '2025-03-17', 'staff', 44, 'created staff Sachin Daga', 'Super Admin System Super Super Admin created staff Sachin Daga ', 'created', NULL, '2025-03-17 09:29:50', '2025-03-17 09:29:50'),
(27, 10, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Account Manager Abhishek Mangal  Logged In With Microsoft ', '-', '103.208.68.241', '2025-03-17 09:30:23', '2025-03-17 09:30:23'),
(28, 1, '2025-03-17', 'staff', 45, 'created staff Anushree R', 'Super Admin System Super Super Admin created staff Anushree R ', 'created', '81.105.113.91', '2025-03-17 09:30:33', '2025-03-17 09:30:33'),
(29, 15, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Account Manager Amit Singh  Logged In With Microsoft ', '-', NULL, '2025-03-17 09:30:38', '2025-03-17 09:30:38'),
(30, 7, '2025-03-17', 'customer', 2, 'created customer profile. customer code :', 'Account Manager Abhishek Singh created customer profile. customer code : cust_TAG_00002(TAG ACCOUNTANTS GROUP LIMITED (Copia)_00002)', 'created', '122.176.134.210', '2025-03-17 09:40:24', '2025-03-17 09:40:24'),
(31, 7, '2025-03-17', 'customer', 2, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Abhishek Singh  edited the service details and added an additional service while editing the customer code : cust_TAG_00002(TAG ACCOUNTANTS GROUP LIMITED (Copia)_00002)', 'updated', '122.176.134.210', '2025-03-17 09:40:33', '2025-03-17 09:40:33'),
(32, 12, '2025-03-17', '-', 0, ' Logged In', 'Management Ravinder Singh  Logged In ', '-', NULL, '2025-03-17 09:41:16', '2025-03-17 09:41:16'),
(33, 12, '2025-03-17', '-', 0, ' Logged In', 'Management Ravinder Singh  Logged In ', '-', NULL, '2025-03-17 09:43:31', '2025-03-17 09:43:31'),
(34, 12, '2025-03-17', '-', 0, ' Logged In', 'Management Ravinder Singh  Logged In ', '-', '43.248.153.91', '2025-03-17 09:44:04', '2025-03-17 09:44:04'),
(35, 12, '2025-03-17', '-', 0, ' Logged In', 'Management Ravinder Singh  Logged In ', '-', '43.248.153.91', '2025-03-17 09:44:05', '2025-03-17 09:44:05'),
(36, 12, '2025-03-17', '-', 0, ' Logged Out', 'Management Ravinder Singh  Logged Out ', '-', NULL, '2025-03-17 09:48:26', '2025-03-17 09:48:26'),
(37, 12, '2025-03-17', 'staff', 46, 'created staff Lalita Pal', 'Management Ravinder Singh created staff Lalita Pal ', 'created', '43.248.153.91', '2025-03-17 09:49:12', '2025-03-17 09:49:12'),
(38, 12, '2025-03-17', '-', 0, ' Logged In', 'Management Ravinder Singh  Logged In ', '-', NULL, '2025-03-17 09:49:19', '2025-03-17 09:49:19'),
(39, 12, '2025-03-17', '-', 0, ' Logged Out', 'Management Ravinder Singh  Logged Out ', '-', NULL, '2025-03-17 09:49:42', '2025-03-17 09:49:42'),
(40, 12, '2025-03-17', '-', 0, ' Logged In', 'Management Ravinder Singh  Logged In ', '-', NULL, '2025-03-17 09:50:14', '2025-03-17 09:50:14'),
(41, 12, '2025-03-17', '-', 0, ' Logged Out', 'Management Ravinder Singh  Logged Out ', '-', NULL, '2025-03-17 09:51:14', '2025-03-17 09:51:14'),
(42, 12, '2025-03-17', '-', 0, ' Logged Out', 'Management Ravinder Singh  Logged Out ', '-', '103.100.4.210', '2025-03-17 09:51:14', '2025-03-17 09:51:14'),
(43, 12, '2025-03-17', '-', 0, ' Logged In', 'Management Ravinder Singh  Logged In ', '-', NULL, '2025-03-17 09:52:10', '2025-03-17 09:52:10'),
(44, 12, '2025-03-17', '-', 0, ' Logged In', 'Management Ravinder Singh  Logged In ', '-', NULL, '2025-03-17 09:52:19', '2025-03-17 09:52:19'),
(45, 9, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Account Manager Hitixa Raja  Logged In With Microsoft ', '-', NULL, '2025-03-17 09:53:22', '2025-03-17 09:53:22'),
(46, 12, '2025-03-17', '-', 0, ' Logged Out', 'Management Ravinder Singh  Logged Out ', '-', NULL, '2025-03-17 09:54:00', '2025-03-17 09:54:00'),
(47, 7, '2025-03-17', 'client', 2, 'created client profile. client code :', 'Account Manager Abhishek Singh created client profile. client code : cli_TAG_The_00002(The Londons Design Collaborative Limited_00002)', 'created', '122.176.134.210', '2025-03-17 10:07:47', '2025-03-17 10:07:47'),
(48, 7, '2025-03-17', 'client', 3, 'created client profile. client code :', 'Account Manager Abhishek Singh created client profile. client code : cli_TAG_The_00003(The Londons Design Collaborative Limited_00003)', 'created', '122.176.134.210', '2025-03-17 10:08:07', '2025-03-17 10:08:07'),
(49, 7, '2025-03-17', 'client', 4, 'created client profile. client code :', 'Account Manager Abhishek Singh created client profile. client code : cli_TAG_The_00004(The Londons Design Collaborative Limited_00004)', 'created', '122.176.134.210', '2025-03-17 10:08:14', '2025-03-17 10:08:14'),
(50, 7, '2025-03-17', 'client', 5, 'created client profile. client code :', 'Account Manager Abhishek Singh created client profile. client code : cli_TAG_The_00005(The Londons Design Collaborative Limited_00005)', 'created', '122.176.134.210', '2025-03-17 10:08:22', '2025-03-17 10:08:22'),
(51, 7, '2025-03-17', 'client', 5, 'deleted client profile. client code :', 'Account Manager Abhishek Singh deleted client profile. client code : cli_TAG_The_00005(The Londons Design Collaborative Limited_00005)', 'deleted', '122.176.134.210', '2025-03-17 10:09:05', '2025-03-17 10:09:05'),
(52, 7, '2025-03-17', 'client', 4, 'deleted client profile. client code :', 'Account Manager Abhishek Singh deleted client profile. client code : cli_TAG_The_00004(The Londons Design Collaborative Limited_00004)', 'deleted', '122.176.134.210', '2025-03-17 10:09:08', '2025-03-17 10:09:08'),
(53, 7, '2025-03-17', 'client', 3, 'deleted client profile. client code :', 'Account Manager Abhishek Singh deleted client profile. client code : cli_TAG_The_00003(The Londons Design Collaborative Limited_00003)', 'deleted', '122.176.134.210', '2025-03-17 10:09:11', '2025-03-17 10:09:11'),
(54, 1, '2025-03-17', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '81.105.113.91', '2025-03-17 10:11:48', '2025-03-17 10:11:48'),
(55, 7, '2025-03-17', 'customer', 2, 'edited the company information customer code :', 'Account Manager Abhishek Singh edited the company information customer code : cust_TAG_00002(TAG ACCOUNTANTS GROUP LIMITED (Copia)_00002)', 'updated', '122.176.134.210', '2025-03-17 10:15:24', '2025-03-17 10:15:24'),
(56, 12, '2025-03-17', '-', 0, ' Logged Out', 'Management Ravinder Singh  Logged Out ', '-', '103.100.4.210', '2025-03-17 10:17:14', '2025-03-17 10:17:14'),
(57, 46, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Account Manager Lalita Pal  Logged In With Microsoft ', '-', '103.100.4.210', '2025-03-17 10:17:20', '2025-03-17 10:17:20'),
(58, 46, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Account Manager Lalita Pal  Logged In With Microsoft ', '-', NULL, '2025-03-17 10:23:24', '2025-03-17 10:23:24'),
(59, 46, '2025-03-17', 'staff', 47, 'created staff Tushar Sharma', 'Account Manager Lalita Pal created staff Tushar Sharma ', 'created', NULL, '2025-03-17 10:27:49', '2025-03-17 10:27:49'),
(60, 10, '2025-03-17', 'customer', 3, 'created customer profile. customer code :', 'Account Manager Abhishek Mangal created customer profile. customer code : cust_Gow_00003(Gower Accountancy_00003)', 'created', '103.208.68.241', '2025-03-17 10:28:05', '2025-03-17 10:28:05'),
(61, 10, '2025-03-17', 'customer', 4, 'created customer profile. customer code :', 'Account Manager Abhishek Mangal created customer profile. customer code : cust_Gow_00004(Gower Accountancy_00004)', 'created', '103.208.68.241', '2025-03-17 10:28:29', '2025-03-17 10:28:29'),
(62, 46, '2025-03-17', 'staff', 48, 'created staff Anand Vyas', 'Account Manager Lalita Pal created staff Anand Vyas ', 'created', '152.58.125.136', '2025-03-17 10:28:39', '2025-03-17 10:28:39'),
(63, 10, '2025-03-17', 'customer', 5, 'created customer profile. customer code :', 'Account Manager Abhishek Mangal created customer profile. customer code : cust_Gow_00005(Gower Accountancy_00005)', 'created', '103.208.68.241', '2025-03-17 10:30:44', '2025-03-17 10:30:44'),
(64, 12, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Management Ravinder Singh  Logged In With Microsoft ', '-', NULL, '2025-03-17 10:30:58', '2025-03-17 10:30:58'),
(65, 46, '2025-03-17', 'customer', 6, 'created customer profile. customer code :', 'Account Manager Lalita Pal created customer profile. customer code : cust_LD _00006(LD ACCOUNTING AND BUSINESS SERVICES LTD_00006)', 'created', '152.58.125.136', '2025-03-17 10:31:21', '2025-03-17 10:31:21'),
(66, 46, '2025-03-17', 'customer', 6, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Lalita Pal  edited the service details and added an additional service while editing the customer code : cust_LD _00006(LD ACCOUNTING AND BUSINESS SERVICES LTD_00006)', 'updated', '152.58.125.136', '2025-03-17 10:32:04', '2025-03-17 10:32:04'),
(67, 10, '2025-03-17', 'customer', 7, 'created customer profile. customer code :', 'Account Manager Abhishek Mangal created customer profile. customer code : cust_Gow_00007(Gower Accountancy_00007)', 'created', '103.208.68.241', '2025-03-17 10:34:21', '2025-03-17 10:34:21'),
(68, 10, '2025-03-17', 'customer', 7, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Abhishek Mangal  edited the service details and added an additional service while editing the customer code : cust_Gow_00007(Gower Accountancy_00007)', 'updated', '103.208.68.241', '2025-03-17 10:35:12', '2025-03-17 10:35:12'),
(69, 46, '2025-03-17', 'client', 6, 'created client profile. client code :', 'Account Manager Lalita Pal created client profile. client code : cli_LD _DON_00003(DONATAS TRANSPORT LTD_00003)', 'created', '152.58.125.136', '2025-03-17 10:35:36', '2025-03-17 10:35:36'),
(70, 10, '2025-03-17', 'client', 7, 'deleted customer. customer code :', NULL, 'deleted', '103.208.68.241', '2025-03-17 10:38:30', '2025-03-17 10:38:30'),
(71, 10, '2025-03-17', 'client', 5, 'deleted customer. customer code :', NULL, 'deleted', '103.208.68.241', '2025-03-17 10:38:35', '2025-03-17 10:38:35'),
(72, 10, '2025-03-17', 'client', 4, 'deleted customer. customer code :', NULL, 'deleted', '103.208.68.241', '2025-03-17 10:38:39', '2025-03-17 10:38:39'),
(73, 10, '2025-03-17', 'client', 3, 'deleted customer. customer code :', NULL, 'deleted', '103.208.68.241', '2025-03-17 10:40:23', '2025-03-17 10:40:23'),
(74, 10, '2025-03-17', 'customer', 8, 'created customer profile. customer code :', 'Account Manager Abhishek Mangal created customer profile. customer code : cust_Gow_00007(Gower Accountancy_00007)', 'created', '103.208.68.241', '2025-03-17 10:41:21', '2025-03-17 10:41:21'),
(75, 10, '2025-03-17', 'staff', 49, 'created staff Utsav Taneja', 'Account Manager Abhishek Mangal created staff Utsav Taneja ', 'created', '103.208.68.241', '2025-03-17 10:44:02', '2025-03-17 10:44:02'),
(76, 46, '2025-03-17', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2025-03-17, Hours : 5:00 ,Job code:Training, Task name:Accounts Production', 'Account Manager Lalita Pal created a timesheet entry. Task type:Internal,  Date: 2025-03-17, Hours : 5:00 ,Job code:Training, Task name:Accounts Production ', 'updated', '0.0.0.0', '2025-03-17 10:46:59', '2025-03-17 10:46:59'),
(77, 10, '2025-03-17', 'client', 8, 'deleted customer. customer code :', NULL, 'deleted', '103.208.68.241', '2025-03-17 10:52:36', '2025-03-17 10:52:36'),
(78, 10, '2025-03-17', 'customer', 9, 'created customer profile. customer code :', 'Account Manager Abhishek Mangal created customer profile. customer code : cust_GOW_00007(GOWER ACCOUNTANCY & TAX ADVISORY SERVICES LTD_00007)', 'created', '103.208.68.241', '2025-03-17 10:53:29', '2025-03-17 10:53:29'),
(79, 10, '2025-03-17', 'customer', 9, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Abhishek Mangal  edited the service details and added an additional service while editing the customer code : cust_GOW_00007(GOWER ACCOUNTANCY & TAX ADVISORY SERVICES LTD_00007)', 'updated', '103.208.68.241', '2025-03-17 10:53:46', '2025-03-17 10:53:46'),
(80, 10, '2025-03-17', 'client', 7, 'created client profile. client code :', 'Account Manager Abhishek Mangal created client profile. client code : cli_GOW_PIN_00004(PINPOINT MANUFACTURING LIMITED_00004)', 'created', '103.208.68.241', '2025-03-17 10:59:32', '2025-03-17 10:59:32'),
(81, 9, '2025-03-17', '-', 0, ' Logged Out', 'Account Manager Hitixa Raja  Logged Out ', '-', '175.100.134.78', '2025-03-17 11:38:35', '2025-03-17 11:38:35'),
(82, 9, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Account Manager Hitixa Raja  Logged In With Microsoft ', '-', '175.100.134.78', '2025-03-17 11:40:05', '2025-03-17 11:40:05'),
(83, 9, '2025-03-17', '-', 0, ' Logged Out', 'Account Manager Hitixa Raja  Logged Out ', '-', '175.100.134.78', '2025-03-17 11:40:32', '2025-03-17 11:40:32'),
(84, 9, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Account Manager Hitixa Raja  Logged In With Microsoft ', '-', '175.100.134.78', '2025-03-17 11:40:50', '2025-03-17 11:40:50'),
(85, 44, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Support Sachin Daga  Logged In With Microsoft ', '-', NULL, '2025-03-17 11:56:41', '2025-03-17 11:56:41'),
(86, 44, '2025-03-17', '-', 0, ' Logged Out', 'Support Sachin Daga  Logged Out ', '-', NULL, '2025-03-17 11:57:49', '2025-03-17 11:57:49'),
(87, 44, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Support Sachin Daga  Logged In With Microsoft ', '-', NULL, '2025-03-17 11:57:58', '2025-03-17 11:57:58'),
(88, 44, '2025-03-17', '-', 0, ' Logged Out', 'Support Sachin Daga  Logged Out ', '-', NULL, '2025-03-17 12:07:00', '2025-03-17 12:07:00'),
(89, 44, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Support Sachin Daga  Logged In With Microsoft ', '-', '49.36.238.53', '2025-03-17 12:46:47', '2025-03-17 12:46:47'),
(90, 45, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Support Anushree R  Logged In With Microsoft ', '-', '106.219.165.86', '2025-03-17 13:00:58', '2025-03-17 13:00:58'),
(91, 46, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Account Manager Lalita Pal  Logged In With Microsoft ', '-', '103.100.4.210', '2025-03-17 13:07:26', '2025-03-17 13:07:26'),
(92, 44, '2025-03-17', '-', 0, ' Logged Out', 'Support Sachin Daga  Logged Out ', '-', '49.36.238.53', '2025-03-17 13:09:21', '2025-03-17 13:09:21'),
(93, 44, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Support Sachin Daga  Logged In With Microsoft ', '-', '49.36.238.53', '2025-03-17 13:09:33', '2025-03-17 13:09:33'),
(94, 2, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Super Admin Amit Agarwal  Logged In With Microsoft ', '-', '81.105.113.91', '2025-03-17 13:24:05', '2025-03-17 13:24:05'),
(95, 2, '2025-03-17', 'staff', 50, 'created staff Deepak Singh', 'Super Admin Amit Agarwal created staff Deepak Singh ', 'created', '81.105.113.91', '2025-03-17 13:26:37', '2025-03-17 13:26:37'),
(96, 45, '2025-03-17', 'customer', 10, 'created customer profile. customer code :', 'Support Anushree R created customer profile. customer code : cust_DTB_00008(DTBC Ltd_00008)', 'created', '106.219.165.86', '2025-03-17 13:27:25', '2025-03-17 13:27:25'),
(97, 2, '2025-03-17', 'staff', 51, 'created staff Nishtha Jain', 'Super Admin Amit Agarwal created staff Nishtha Jain ', 'created', '81.105.113.91', '2025-03-17 13:27:27', '2025-03-17 13:27:27'),
(98, 45, '2025-03-17', 'customer', 11, 'created customer profile. customer code :', 'Support Anushree R created customer profile. customer code : cust_DTB_00009(DTBC Ltd_00009)', 'created', '106.219.165.86', '2025-03-17 13:27:34', '2025-03-17 13:27:34'),
(99, 2, '2025-03-17', 'staff', 52, 'created staff Robin Bhaik', 'Super Admin Amit Agarwal created staff Robin Bhaik ', 'created', '81.105.113.91', '2025-03-17 13:28:31', '2025-03-17 13:28:31'),
(100, 44, '2025-03-17', '-', 0, ' Logged Out', 'Support Sachin Daga  Logged Out ', '-', '49.36.238.53', '2025-03-17 13:28:36', '2025-03-17 13:28:36'),
(101, 2, '2025-03-17', 'staff', 53, 'created staff Vivek Singh', 'Super Admin Amit Agarwal created staff Vivek Singh ', 'created', '81.105.113.91', '2025-03-17 13:29:13', '2025-03-17 13:29:13'),
(102, 44, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Support Sachin Daga  Logged In With Microsoft ', '-', '49.36.238.53', '2025-03-17 13:29:27', '2025-03-17 13:29:27'),
(103, 2, '2025-03-17', '-', 0, ' Logged Out', 'Super Admin Amit Agarwal  Logged Out ', '-', '81.105.113.91', '2025-03-17 13:34:31', '2025-03-17 13:34:31'),
(104, 2, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Super Admin Amit Agarwal  Logged In With Microsoft ', '-', '81.105.113.91', '2025-03-17 13:34:40', '2025-03-17 13:34:40'),
(105, 2, '2025-03-17', 'staff', 44, 'edited staff Sachin Daga', 'Super Admin Amit Agarwal edited staff Sachin Daga ', 'updated', '81.105.113.91', '2025-03-17 13:36:26', '2025-03-17 13:36:26'),
(106, 2, '2025-03-17', 'staff', 45, 'edited staff Anushree R', 'Super Admin Amit Agarwal edited staff Anushree R ', 'updated', '81.105.113.91', '2025-03-17 13:36:43', '2025-03-17 13:36:43'),
(107, 45, '2025-03-17', 'client', 11, 'deleted customer. customer code :', NULL, 'deleted', '106.219.165.86', '2025-03-17 13:36:49', '2025-03-17 13:36:49'),
(108, 45, '2025-03-17', 'client', 10, 'deleted customer. customer code :', NULL, 'deleted', '106.219.165.86', '2025-03-17 13:36:52', '2025-03-17 13:36:52'),
(109, 44, '2025-03-17', '-', 0, ' Logged Out', 'Management Sachin Daga  Logged Out ', '-', '49.36.238.53', '2025-03-17 13:37:07', '2025-03-17 13:37:07'),
(110, 44, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Management Sachin Daga  Logged In With Microsoft ', '-', '49.36.238.53', '2025-03-17 13:37:16', '2025-03-17 13:37:16'),
(111, 15, '2025-03-17', 'staff', 54, 'created staff Mohammad Kashif', 'Account Manager Amit Singh created staff Mohammad Kashif ', 'created', NULL, '2025-03-17 13:38:59', '2025-03-17 13:38:59'),
(112, 52, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Account Manager Robin Bhaik  Logged In With Microsoft ', '-', NULL, '2025-03-17 13:49:14', '2025-03-17 13:49:14'),
(113, 2, '2025-03-17', 'staff', 55, 'created staff Elakkya Vikas', 'Super Admin Amit Agarwal created staff Elakkya Vikas ', 'created', '81.105.113.91', '2025-03-17 13:51:40', '2025-03-17 13:51:40'),
(114, 44, '2025-03-17', 'staff', 45, 'edited staff Anushree R', 'Management Sachin Daga edited staff Anushree R ', 'updated', '49.36.238.53', '2025-03-17 13:55:01', '2025-03-17 13:55:01'),
(115, 2, '2025-03-17', 'staff', 56, 'created staff Kamlesh Kumar', 'Super Admin Amit Agarwal created staff Kamlesh Kumar ', 'created', '81.105.113.91', '2025-03-17 13:58:22', '2025-03-17 13:58:22'),
(116, 56, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Support Kamlesh Kumar  Logged In With Microsoft ', '-', NULL, '2025-03-17 14:00:35', '2025-03-17 14:00:36'),
(117, 15, '2025-03-17', 'customer', 12, 'created customer profile. customer code :', 'Account Manager Amit Singh created customer profile. customer code : cust_GEO_00008(GEO-SPEEDY LTD_00008)', 'created', '160.202.38.146', '2025-03-17 14:07:00', '2025-03-17 14:07:00'),
(118, 15, '2025-03-17', 'customer', 12, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Amit Singh  edited the service details and added an additional service while editing the customer code : cust_GEO_00008(GEO-SPEEDY LTD_00008)', 'updated', '160.202.38.146', '2025-03-17 14:07:40', '2025-03-17 14:07:40'),
(119, 55, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Support Elakkya Vikas  Logged In With Microsoft ', '-', NULL, '2025-03-17 14:13:04', '2025-03-17 14:13:04'),
(120, 15, '2025-03-17', 'client', 8, 'created client profile. client code :', 'Account Manager Amit Singh created client profile. client code : cli_FM _GEO_00005(GEO-SPEEDY LTD_00005)', 'created', '160.202.38.146', '2025-03-17 14:13:35', '2025-03-17 14:13:35'),
(121, 44, '2025-03-17', '-', 0, ' Logged Out', 'Management Sachin Daga  Logged Out ', '-', '49.36.238.53', '2025-03-17 14:14:17', '2025-03-17 14:14:17'),
(122, 44, '2025-03-17', '-', 0, ' Logged In With Microsoft', 'Management Sachin Daga  Logged In With Microsoft ', '-', '49.36.238.53', '2025-03-17 14:24:03', '2025-03-17 14:24:03'),
(123, 15, '2025-03-17', '-', 0, ' Logged Out', 'Account Manager Amit Singh  Logged Out ', '-', '160.202.38.146', '2025-03-17 14:28:12', '2025-03-17 14:28:12'),
(124, 44, '2025-03-17', '-', 0, ' Logged Out', 'Management Sachin Daga  Logged Out ', '-', '49.36.238.53', '2025-03-17 14:35:49', '2025-03-17 14:35:49'),
(125, 55, '2025-03-18', '-', 0, ' Logged In With Microsoft', 'Support Elakkya Vikas  Logged In With Microsoft ', '-', '49.37.171.160', '2025-03-18 07:01:31', '2025-03-18 07:01:31'),
(126, 14, '2025-03-18', '-', 0, ' Logged In With Microsoft', 'Account Manager Sonu Kumar  Logged In With Microsoft ', '-', NULL, '2025-03-18 08:05:51', '2025-03-18 08:05:51'),
(127, 26, '2025-03-18', '-', 0, ' Logged In With Microsoft', 'Processor Kamal Jatav  Logged In With Microsoft ', '-', NULL, '2025-03-18 08:09:06', '2025-03-18 08:09:06'),
(128, 50, '2025-03-18', '-', 0, ' Logged In With Microsoft', 'Account Manager Deepak Singh  Logged In With Microsoft ', '-', '205.254.171.53', '2025-03-18 08:10:44', '2025-03-18 08:10:44'),
(129, 55, '2025-03-18', 'customer', 13, 'created customer profile. customer code :', 'Support Elakkya Vikas created customer profile. customer code : cust_321_00009(321ACCOUNTS LTD_00009)', 'created', '49.37.171.160', '2025-03-18 08:48:46', '2025-03-18 08:48:46'),
(130, 55, '2025-03-18', 'customer', 13, ' edited the service details and added an additional service while editing the customer code :', 'Support Elakkya Vikas  edited the service details and added an additional service while editing the customer code : cust_321_00009(321ACCOUNTS LTD_00009)', 'updated', '49.37.171.160', '2025-03-18 08:55:27', '2025-03-18 08:55:27'),
(131, 45, '2025-03-18', '-', 0, ' Logged In With Microsoft', 'Management Anushree R  Logged In With Microsoft ', '-', '106.219.165.86', '2025-03-18 09:04:33', '2025-03-18 09:04:33'),
(132, 9, '2025-03-18', '-', 0, ' Logged In With Microsoft', 'Account Manager Hitixa Raja  Logged In With Microsoft ', '-', '175.100.132.195', '2025-03-18 09:05:42', '2025-03-18 09:05:42'),
(133, 52, '2025-03-18', '-', 0, ' Logged In With Microsoft', 'Account Manager Robin Bhaik  Logged In With Microsoft ', '-', '103.134.253.205', '2025-03-18 09:08:20', '2025-03-18 09:08:20'),
(134, 50, '2025-03-18', '-', 0, ' Logged In With Microsoft', 'Account Manager Deepak Singh  Logged In With Microsoft ', '-', '205.254.171.53', '2025-03-18 09:08:21', '2025-03-18 09:08:21'),
(135, 47, '2025-03-18', '-', 0, ' Logged In With Microsoft', 'Account Manager Tushar Sharma  Logged In With Microsoft ', '-', '152.58.125.136', '2025-03-18 09:12:24', '2025-03-18 09:12:24'),
(136, 9, '2025-03-18', 'staff', 57, 'created staff Bharti Setia', 'Account Manager Hitixa Raja created staff Bharti Setia ', 'created', '175.100.132.195', '2025-03-18 09:12:30', '2025-03-18 09:12:30'),
(137, 47, '2025-03-18', 'staff', 58, 'created staff Sachin Singh', 'Account Manager Tushar Sharma created staff Sachin Singh ', 'created', '152.58.125.136', '2025-03-18 09:20:42', '2025-03-18 09:20:42'),
(138, 46, '2025-03-18', '-', 0, ' Logged In With Microsoft', 'Account Manager Lalita Pal  Logged In With Microsoft ', '-', '103.100.4.210', '2025-03-18 09:25:00', '2025-03-18 09:25:00'),
(139, 47, '2025-03-18', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2025-03-17, Hours : 8:05 ,Job code:Training, Task name:Onboarding', 'Account Manager Tushar Sharma created a timesheet entry. Task type:Internal,  Date: 2025-03-17, Hours : 8:05 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-03-18 09:26:54', '2025-03-18 09:26:54'),
(140, 47, '2025-03-18', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2025-03-17, Hours : 1:00 ,Job code:Training, Task name:Accounts Production and deleted a timesheet entry. Task type:Internal ,Job code:Training, Task name:Onboarding', 'Account Manager Tushar Sharma created a timesheet entry. Task type:Internal,  Date: 2025-03-17, Hours : 1:00 ,Job code:Training, Task name:Accounts Production and deleted a timesheet entry. Task type:Internal ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-03-18 09:27:41', '2025-03-18 09:27:41'),
(141, 12, '2025-03-18', '-', 0, ' Logged In With Microsoft', 'Management Ravinder Singh  Logged In With Microsoft ', '-', '103.201.141.90', '2025-03-18 09:40:51', '2025-03-18 09:40:51'),
(142, 12, '2025-03-18', 'staff', 59, 'created staff Vikash  Jaimini', 'Management Ravinder Singh created staff Vikash  Jaimini ', 'created', '103.201.141.90', '2025-03-18 09:41:54', '2025-03-18 09:41:54'),
(143, 59, '2025-03-18', '-', 0, ' Logged In With Microsoft', 'Account Manager Vikash  Jaimini  Logged In With Microsoft ', '-', '49.36.240.82', '2025-03-18 09:42:05', '2025-03-18 09:42:05'),
(144, 55, '2025-03-18', 'customer', 14, 'created customer profile. customer code :', 'Support Elakkya Vikas created customer profile. customer code : cust_ACC_000010(ACCOUNTLETS LIMITED_000010)', 'created', '49.37.171.160', '2025-03-18 09:51:04', '2025-03-18 09:51:04'),
(145, 12, '2025-03-18', 'staff', 60, 'created staff Mohit Kumar', 'Management Ravinder Singh created staff Mohit Kumar ', 'created', '223.237.17.235', '2025-03-18 09:51:32', '2025-03-18 09:51:32'),
(146, 12, '2025-03-18', 'staff', 61, 'created staff Nishtha Jain', 'Management Ravinder Singh created staff Nishtha Jain ', 'created', '223.237.17.235', '2025-03-18 09:57:38', '2025-03-18 09:57:38'),
(147, 61, '2025-03-18', '-', 0, ' Logged In With Microsoft', 'Account Manager Nishtha Jain  Logged In With Microsoft ', '-', '223.181.34.186', '2025-03-18 09:58:03', '2025-03-18 09:58:03'),
(148, 55, '2025-03-18', 'customer', 15, 'created customer profile. customer code :', 'Support Elakkya Vikas created customer profile. customer code : cust_ALD_000011(ALDERTON ACCOUNTANCY LTD_000011)', 'created', '49.37.171.160', '2025-03-18 10:09:47', '2025-03-18 10:09:47'),
(149, 55, '2025-03-18', 'customer', 16, 'created customer profile. customer code :', 'Support Elakkya Vikas created customer profile. customer code : cust_ALD_000012(ALDERTON ACCOUNTANCY LTD_000012)', 'created', '49.37.171.160', '2025-03-18 10:09:50', '2025-03-18 10:09:50'),
(150, 55, '2025-03-18', 'customer', 17, 'created customer profile. customer code :', 'Support Elakkya Vikas created customer profile. customer code : cust_ALD_000013(ALDERTON ACCOUNTANCY LTD_000013)', 'created', '49.37.171.160', '2025-03-18 10:10:08', '2025-03-18 10:10:08'),
(151, 55, '2025-03-18', 'customer', 18, 'created customer profile. customer code :', 'Support Elakkya Vikas created customer profile. customer code : cust_ALD_000014(ALDERTON ACCOUNTANCY LTD_000014)', 'created', '49.37.171.160', '2025-03-18 10:10:17', '2025-03-18 10:10:17'),
(152, 55, '2025-03-18', 'client', 14, 'deleted customer. customer code :', NULL, 'deleted', '49.37.171.160', '2025-03-18 10:10:26', '2025-03-18 10:10:26'),
(153, 55, '2025-03-18', 'client', 15, 'deleted customer. customer code :', NULL, 'deleted', '49.37.171.160', '2025-03-18 10:10:29', '2025-03-18 10:10:29'),
(154, 55, '2025-03-18', 'client', 16, 'deleted customer. customer code :', NULL, 'deleted', '49.37.171.160', '2025-03-18 10:10:31', '2025-03-18 10:10:31'),
(155, 55, '2025-03-18', 'client', 17, 'deleted customer. customer code :', NULL, 'deleted', '49.37.171.160', '2025-03-18 10:10:34', '2025-03-18 10:10:34'),
(156, 55, '2025-03-18', 'client', 18, 'deleted customer. customer code :', NULL, 'deleted', '49.37.171.160', '2025-03-18 10:11:47', '2025-03-18 10:11:47'),
(157, 55, '2025-03-18', '-', 0, ' Logged Out', 'Support Elakkya Vikas  Logged Out ', '-', '49.37.171.160', '2025-03-18 10:28:47', '2025-03-18 10:28:47'),
(158, 55, '2025-03-18', '-', 0, ' Logged In With Microsoft', 'Support Elakkya Vikas  Logged In With Microsoft ', '-', '49.37.171.160', '2025-03-18 10:28:54', '2025-03-18 10:28:54'),
(159, 55, '2025-03-18', 'customer', 19, 'created customer profile. customer code :', 'Support Elakkya Vikas created customer profile. customer code : cust_BAA_000010(BAANX GROUP LTD_000010)', 'created', '49.37.171.160', '2025-03-18 10:32:23', '2025-03-18 10:32:23'),
(160, 55, '2025-03-18', 'customer', 19, ' edited the service details and added an additional service while editing the customer code :', 'Support Elakkya Vikas  edited the service details and added an additional service while editing the customer code : cust_BAA_000010(BAANX GROUP LTD_000010)', 'updated', '49.37.171.160', '2025-03-18 10:33:47', '2025-03-18 10:33:47'),
(161, 50, '2025-03-18', 'incorporation in', 9, 'created incorporation in Ireland', 'Account Manager Deepak Singh created incorporation in Ireland ', 'created', '205.254.171.53', '2025-03-18 10:37:45', '2025-03-18 10:37:45'),
(162, 55, '2025-03-18', 'customer', 20, 'created customer profile. customer code :', 'Support Elakkya Vikas created customer profile. customer code : cust_AXA_000011(AXADA LTD_000011)', 'created', '49.37.171.160', '2025-03-18 10:51:29', '2025-03-18 10:51:29'),
(163, 50, '2025-03-18', 'customer', 21, 'created customer profile. customer code :', 'Account Manager Deepak Singh created customer profile. customer code : cust_Cle_000012(Clear Group_000012)', 'created', '205.254.171.53', '2025-03-18 11:00:03', '2025-03-18 11:00:03'),
(164, 55, '2025-03-18', 'customer', 20, ' edited the service details and added an additional service while editing the customer code :', 'Support Elakkya Vikas  edited the service details and added an additional service while editing the customer code : cust_AXA_000011(AXADA LTD_000011)', 'updated', '49.37.171.160', '2025-03-18 11:02:08', '2025-03-18 11:02:08'),
(165, 50, '2025-03-18', 'customer', 21, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Deepak Singh  edited the service details and added an additional service while editing the customer code : cust_Cle_000012(Clear Group_000012)', 'updated', '205.254.171.53', '2025-03-18 11:04:09', '2025-03-18 11:04:09'),
(166, 55, '2025-03-18', 'customer', 22, 'created customer profile. customer code :', 'Support Elakkya Vikas created customer profile. customer code : cust_BER_000013(BERKO WEALTH LTD. _000013)', 'created', '49.37.171.160', '2025-03-18 11:12:27', '2025-03-18 11:12:27'),
(167, 55, '2025-03-18', 'customer', 22, ' edited the service details and added an additional service while editing the customer code :', 'Support Elakkya Vikas  edited the service details and added an additional service while editing the customer code : cust_BER_000013(BERKO WEALTH LTD. _000013)', 'updated', '49.37.171.160', '2025-03-18 11:22:12', '2025-03-18 11:22:12'),
(168, 55, '2025-03-18', 'customer', 22, 'edited the service details customer code :', 'Support Elakkya Vikas edited the service details customer code : cust_BER_000013(BERKO WEALTH LTD. _000013)', 'updated', '49.37.171.160', '2025-03-18 11:22:38', '2025-03-18 11:22:38'),
(169, 50, '2025-03-18', 'staff', 62, 'created staff Sridhar Kumar Thakur', 'Account Manager Deepak Singh created staff Sridhar Kumar Thakur ', 'created', '205.254.171.53', '2025-03-18 11:30:02', '2025-03-18 11:30:02'),
(170, 50, '2025-03-18', 'staff', 62, 'edited staff Sridhar Kumar Thakur', 'Account Manager Deepak Singh edited staff Sridhar Kumar Thakur ', 'updated', '117.98.26.6', '2025-03-18 11:30:26', '2025-03-18 11:30:26'),
(171, 55, '2025-03-18', 'customer', 23, 'created customer profile. customer code :', 'Support Elakkya Vikas created customer profile. customer code : cust_BLE_000014(BLENHEIM PARTNERS LIMITED_000014)', 'created', '49.37.171.160', '2025-03-18 11:51:48', '2025-03-18 11:51:48'),
(172, 55, '2025-03-18', 'customer', 23, ' edited the service details and added an additional service while editing the customer code :', 'Support Elakkya Vikas  edited the service details and added an additional service while editing the customer code : cust_BLE_000014(BLENHEIM PARTNERS LIMITED_000014)', 'updated', '49.37.171.160', '2025-03-18 11:51:56', '2025-03-18 11:51:56'),
(173, 55, '2025-03-18', 'customer', 24, 'created customer profile. customer code :', 'Support Elakkya Vikas created customer profile. customer code : cust_BPC_000015(BPC PARTNERS LIMITED_000015)', 'created', '49.37.171.160', '2025-03-18 12:08:22', '2025-03-18 12:08:22'),
(174, 55, '2025-03-18', 'customer', 24, ' edited the service details and added an additional service while editing the customer code :', 'Support Elakkya Vikas  edited the service details and added an additional service while editing the customer code : cust_BPC_000015(BPC PARTNERS LIMITED_000015)', 'updated', '49.37.171.160', '2025-03-18 12:08:39', '2025-03-18 12:08:39'),
(175, 53, '2025-03-18', '-', 0, ' Logged In With Microsoft', 'Account Manager Vivek Singh  Logged In With Microsoft ', '-', NULL, '2025-03-18 12:12:19', '2025-03-18 12:12:19'),
(176, 50, '2025-03-18', 'client', 9, 'created client profile. client code :', 'Account Manager Deepak Singh created client profile. client code : cli_Cle_AB _00006(AB )', 'created', '205.254.171.71', '2025-03-18 12:14:51', '2025-03-18 12:14:51'),
(177, 55, '2025-03-18', 'customer', 25, 'created customer profile. customer code :', 'Support Elakkya Vikas created customer profile. customer code : cust_CAM_000016(CAMERON PARTNERSHIP LIMITED_000016)', 'created', '49.37.171.160', '2025-03-18 12:32:54', '2025-03-18 12:32:54'),
(178, 55, '2025-03-18', 'customer', 25, ' edited the service details and added an additional service while editing the customer code :', 'Support Elakkya Vikas  edited the service details and added an additional service while editing the customer code : cust_CAM_000016(CAMERON PARTNERSHIP LIMITED_000016)', 'updated', '49.37.171.160', '2025-03-18 12:33:23', '2025-03-18 12:33:23'),
(179, 55, '2025-03-18', 'customer', 25, 'edited the company information customer code :', 'Support Elakkya Vikas edited the company information customer code : cust_CAM_000016(CAMERON PARTNERSHIP LIMITED_000016)', 'updated', '49.37.171.160', '2025-03-18 12:40:48', '2025-03-18 12:40:48'),
(180, 55, '2025-03-18', 'customer', 26, 'created customer profile. customer code :', 'Support Elakkya Vikas created customer profile. customer code : cust_CRO_000017(CROSS HEALTHCARE LIMITED_000017)', 'created', '49.37.171.160', '2025-03-18 12:48:05', '2025-03-18 12:48:05'),
(181, 60, '2025-03-18', '-', 0, ' Logged In With Microsoft', 'Account Manager Mohit Kumar  Logged In With Microsoft ', '-', '103.95.164.71', '2025-03-18 12:53:30', '2025-03-18 12:53:30'),
(182, 60, '2025-03-18', 'customer', 27, 'created customer profile. customer code :', 'Account Manager Mohit Kumar created customer profile. customer code : cust_BP _000018(BP FLATS LTD_000018)', 'created', '103.95.164.71', '2025-03-18 13:05:57', '2025-03-18 13:05:57'),
(183, 60, '2025-03-18', 'customer', 28, 'created customer profile. customer code :', 'Account Manager Mohit Kumar created customer profile. customer code : cust_BP _000019(BP FLATS LTD_000019)', 'created', '103.95.164.71', '2025-03-18 13:06:01', '2025-03-18 13:06:01'),
(184, 60, '2025-03-18', 'customer', 29, 'created customer profile. customer code :', 'Account Manager Mohit Kumar created customer profile. customer code : cust_BP _000020(BP FLATS LTD_000020)', 'created', '103.95.164.71', '2025-03-18 13:06:06', '2025-03-18 13:06:06'),
(185, 60, '2025-03-18', 'customer', 30, 'created customer profile. customer code :', 'Account Manager Mohit Kumar created customer profile. customer code : cust_BP _000021(BP FLATS LTD_000021)', 'created', '103.95.164.71', '2025-03-18 13:07:09', '2025-03-18 13:07:09'),
(186, 56, '2025-03-18', '-', 0, ' Logged In With Microsoft', 'Support Kamlesh Kumar  Logged In With Microsoft ', '-', '183.83.157.9', '2025-03-18 13:50:40', '2025-03-18 13:50:40'),
(187, 55, '2025-03-18', 'client', 26, 'deleted customer. customer code :', NULL, 'deleted', '49.37.171.160', '2025-03-18 14:08:03', '2025-03-18 14:08:03'),
(188, 55, '2025-03-18', 'customer', 31, 'created customer profile. customer code :', 'Support Elakkya Vikas created customer profile. customer code : cust_FIE_000022(FIELDS LUXURY LIMITED_000022)', 'created', '49.37.171.160', '2025-03-18 14:23:03', '2025-03-18 14:23:03'),
(189, 55, '2025-03-18', 'customer', 31, ' edited the service details and added an additional service while editing the customer code :', 'Support Elakkya Vikas  edited the service details and added an additional service while editing the customer code : cust_FIE_000022(FIELDS LUXURY LIMITED_000022)', 'updated', '49.37.171.160', '2025-03-18 14:26:35', '2025-03-18 14:26:35'),
(190, 55, '2025-03-18', 'customer', 31, 'edited the company information customer code :', 'Support Elakkya Vikas edited the company information customer code : cust_FIE_000022(FIELDS LUXURY LIMITED)', 'updated', '49.37.171.160', '2025-03-18 14:28:40', '2025-03-18 14:28:40'),
(191, 55, '2025-03-18', 'customer', 31, ' edited the service details and added an additional service while editing the customer code :', 'Support Elakkya Vikas  edited the service details and added an additional service while editing the customer code : cust_FIE_000022(FIELDS LUXURY LIMITED)', 'updated', '49.37.171.160', '2025-03-18 14:28:55', '2025-03-18 14:28:55'),
(192, 53, '2025-03-18', 'staff', 63, 'created staff Satish Khemchandani', 'Account Manager Vivek Singh created staff Satish Khemchandani ', 'created', NULL, '2025-03-18 14:31:56', '2025-03-18 14:31:56'),
(193, 55, '2025-03-18', 'customer', 31, 'added FTE/Dedicated Staffing (engagement model) customer code :', 'Support Elakkya Vikas added FTE/Dedicated Staffing (engagement model) customer code : cust_FIE_000022(FIELDS LUXURY LIMITED)', 'updated', '49.37.171.160', '2025-03-18 14:32:06', '2025-03-18 14:32:06'),
(194, 53, '2025-03-18', 'staff', 64, 'created staff Narayan  Singh', 'Account Manager Vivek Singh created staff Narayan  Singh ', 'created', '103.55.90.20', '2025-03-18 14:32:47', '2025-03-18 14:32:47'),
(195, 55, '2025-03-18', 'customer', 32, 'created customer profile. customer code :', 'Support Elakkya Vikas created customer profile. customer code : cust_HUB_000023(HUBU ACCOUNTANTS LIMITED_000023)', 'created', '49.37.171.160', '2025-03-18 14:38:41', '2025-03-18 14:38:41'),
(196, 55, '2025-03-18', 'customer', 32, ' edited the service details and added an additional service while editing the customer code :', 'Support Elakkya Vikas  edited the service details and added an additional service while editing the customer code : cust_HUB_000023(HUBU ACCOUNTANTS LIMITED_000023)', 'updated', '49.37.171.160', '2025-03-18 14:38:50', '2025-03-18 14:38:50'),
(197, 53, '2025-03-18', 'staff', 65, 'created staff Ayushi Jaiswal', 'Account Manager Vivek Singh created staff Ayushi Jaiswal ', 'created', '103.55.90.20', '2025-03-18 14:38:50', '2025-03-18 14:38:50'),
(198, 53, '2025-03-18', 'staff', 66, 'created staff Moumita Guha', 'Account Manager Vivek Singh created staff Moumita Guha ', 'created', '103.55.90.20', '2025-03-18 14:39:14', '2025-03-18 14:39:14'),
(199, 53, '2025-03-18', 'staff', 67, 'created staff Priya Jangir', 'Account Manager Vivek Singh created staff Priya Jangir ', 'created', '103.55.90.20', '2025-03-18 14:39:39', '2025-03-18 14:39:39'),
(200, 55, '2025-03-18', 'client', 32, 'deleted customer. customer code :', NULL, 'deleted', '49.37.171.160', '2025-03-18 15:04:57', '2025-03-18 15:04:57'),
(201, 55, '2025-03-18', 'customer', 13, 'edited the company information customer code :', 'Support Elakkya Vikas edited the company information customer code : cust_321_00009(321ACCOUNTS LTD)', 'updated', '49.37.171.160', '2025-03-18 15:11:52', '2025-03-18 15:11:52'),
(202, 55, '2025-03-18', 'customer', 19, 'edited the company information customer code :', 'Support Elakkya Vikas edited the company information customer code : cust_BAA_000010(BAANX GROUP LTD_000010)', 'updated', '49.37.171.160', '2025-03-18 15:30:47', '2025-03-18 15:30:47'),
(203, 8, '2025-03-18', '-', 0, ' Logged In With Microsoft', 'Account Manager Lavesh Premani  Logged In With Microsoft ', '-', '49.36.238.16', '2025-03-18 15:35:56', '2025-03-18 15:35:56'),
(204, 60, '2025-03-18', 'customer', 33, 'created customer profile. customer code :', 'Account Manager Mohit Kumar created customer profile. customer code : cust_BP _000023(BP FLATS LTD_000023)', 'created', '103.95.164.71', '2025-03-18 15:39:28', '2025-03-18 15:39:28'),
(205, 55, '2025-03-18', 'customer', 20, 'edited the company information customer code :', 'Support Elakkya Vikas edited the company information customer code : cust_AXA_000011(AXADA LTD_000011)', 'updated', '49.37.171.160', '2025-03-18 15:45:45', '2025-03-18 15:45:45'),
(206, 60, '2025-03-18', 'client', 33, 'deleted customer. customer code :', NULL, 'deleted', '103.95.164.71', '2025-03-18 15:47:19', '2025-03-18 15:47:19'),
(207, 60, '2025-03-18', 'client', 30, 'deleted customer. customer code :', NULL, 'deleted', '103.95.164.71', '2025-03-18 15:47:25', '2025-03-18 15:47:25'),
(208, 60, '2025-03-18', 'client', 29, 'deleted customer. customer code :', NULL, 'deleted', '103.95.164.71', '2025-03-18 15:47:44', '2025-03-18 15:47:44'),
(209, 60, '2025-03-18', 'client', 28, 'deleted customer. customer code :', NULL, 'deleted', '103.95.164.71', '2025-03-18 15:47:47', '2025-03-18 15:47:47'),
(210, 60, '2025-03-18', 'client', 27, 'deleted customer. customer code :', NULL, 'deleted', '103.95.164.71', '2025-03-18 15:47:50', '2025-03-18 15:47:50'),
(211, 55, '2025-03-18', 'customer', 22, 'edited the company information customer code :', 'Support Elakkya Vikas edited the company information customer code : cust_BER_000013(BERKO WEALTH LTD. _000013)', 'updated', '49.37.171.160', '2025-03-18 15:50:52', '2025-03-18 15:50:52'),
(212, 55, '2025-03-18', 'customer', 22, ' edited the service details and added an additional service while editing the customer code :', 'Support Elakkya Vikas  edited the service details and added an additional service while editing the customer code : cust_BER_000013(BERKO WEALTH LTD. _000013)', 'updated', '49.37.171.160', '2025-03-18 15:52:35', '2025-03-18 15:52:35'),
(213, 55, '2025-03-18', 'customer', 22, 'edited Adhoc/PAYG/Hourly (engagement model) customer code :', 'Support Elakkya Vikas edited Adhoc/PAYG/Hourly (engagement model) customer code : cust_BER_000013(BERKO WEALTH LTD. _000013)', 'updated', '49.37.171.160', '2025-03-18 15:53:41', '2025-03-18 15:53:41'),
(214, 60, '2025-03-18', 'customer', 34, 'created customer profile. customer code :', 'Account Manager Mohit Kumar created customer profile. customer code : cust_AST_000023(ASTONIA ASSOCIATES LIMITED_000023)', 'created', '103.95.164.71', '2025-03-18 15:55:26', '2025-03-18 15:55:26'),
(215, 60, '2025-03-18', 'customer', 35, 'created customer profile. customer code :', 'Account Manager Mohit Kumar created customer profile. customer code : cust_AST_000024(ASTONIA ASSOCIATES LIMITED_000024)', 'created', '103.95.164.71', '2025-03-18 15:55:33', '2025-03-18 15:55:33'),
(216, 60, '2025-03-18', 'customer', 36, 'created customer profile. customer code :', 'Account Manager Mohit Kumar created customer profile. customer code : cust_AST_000025(ASTONIA ASSOCIATES LIMITED_000025)', 'created', '103.95.164.71', '2025-03-18 15:55:50', '2025-03-18 15:55:50'),
(217, 60, '2025-03-18', 'customer', 37, 'created customer profile. customer code :', 'Account Manager Mohit Kumar created customer profile. customer code : cust_AST_000026(ASTONIA ASSOCIATES LIMITED_000026)', 'created', '103.95.164.71', '2025-03-18 15:55:55', '2025-03-18 15:55:55'),
(218, 60, '2025-03-18', 'customer', 38, 'created customer profile. customer code :', 'Account Manager Mohit Kumar created customer profile. customer code : cust_AST_000027(ASTONIA ASSOCIATES LIMITED_000027)', 'created', '103.95.164.71', '2025-03-18 15:56:00', '2025-03-18 15:56:00'),
(219, 60, '2025-03-18', 'customer', 39, 'created customer profile. customer code :', 'Account Manager Mohit Kumar created customer profile. customer code : cust_AST_000028(ASTONIA ASSOCIATES LIMITED_000028)', 'created', '103.95.164.71', '2025-03-18 15:56:06', '2025-03-18 15:56:06'),
(220, 60, '2025-03-18', 'customer', 40, 'created customer profile. customer code :', 'Account Manager Mohit Kumar created customer profile. customer code : cust_AST_000029(ASTONIA ASSOCIATES LIMITED_000029)', 'created', '103.95.164.71', '2025-03-18 15:56:10', '2025-03-18 15:56:10'),
(221, 60, '2025-03-18', 'customer', 41, 'created customer profile. customer code :', 'Account Manager Mohit Kumar created customer profile. customer code : cust_AST_000030(ASTONIA ASSOCIATES LIMITED_000030)', 'created', '103.95.164.71', '2025-03-18 15:56:16', '2025-03-18 15:56:16'),
(222, 60, '2025-03-18', 'client', 41, 'deleted customer. customer code :', NULL, 'deleted', '103.95.164.71', '2025-03-18 15:57:06', '2025-03-18 15:57:06'),
(223, 60, '2025-03-18', 'client', 41, 'deleted customer. customer code :', NULL, 'deleted', '103.95.164.71', '2025-03-18 15:57:06', '2025-03-18 15:57:06'),
(224, 60, '2025-03-18', 'client', 40, 'deleted customer. customer code :', NULL, 'deleted', '103.95.164.71', '2025-03-18 15:57:10', '2025-03-18 15:57:10'),
(225, 60, '2025-03-18', 'client', 39, 'deleted customer. customer code :', NULL, 'deleted', '103.95.164.71', '2025-03-18 15:57:13', '2025-03-18 15:57:13');
INSERT INTO `staff_logs` (`id`, `staff_id`, `date`, `module_name`, `module_id`, `log_message`, `log_message_all`, `permission_type`, `ip`, `created_at`, `updated_at`) VALUES
(226, 60, '2025-03-18', 'client', 38, 'deleted customer. customer code :', NULL, 'deleted', '103.95.164.71', '2025-03-18 15:57:15', '2025-03-18 15:57:15'),
(227, 60, '2025-03-18', 'client', 37, 'deleted customer. customer code :', NULL, 'deleted', '103.95.164.71', '2025-03-18 15:57:21', '2025-03-18 15:57:21'),
(228, 60, '2025-03-18', 'client', 36, 'deleted customer. customer code :', NULL, 'deleted', '103.95.164.71', '2025-03-18 15:57:24', '2025-03-18 15:57:24'),
(229, 60, '2025-03-18', 'client', 35, 'deleted customer. customer code :', NULL, 'deleted', '103.95.164.71', '2025-03-18 15:57:27', '2025-03-18 15:57:27'),
(230, 2, '2025-03-18', '-', 0, ' Logged In With Microsoft', 'Super Admin Amit Agarwal  Logged In With Microsoft ', '-', '81.105.113.91', '2025-03-18 17:41:03', '2025-03-18 17:41:03'),
(231, 59, '2025-03-19', '-', 0, ' Logged In With Microsoft', 'Account Manager Vikash  Jaimini  Logged In With Microsoft ', '-', '49.36.240.82', '2025-03-19 03:11:51', '2025-03-19 03:11:51'),
(232, 59, '2025-03-19', 'customer', 42, 'created customer profile. customer code :', 'Account Manager Vikash  Jaimini created customer profile. customer code : cust_ROB_000024(ROBERT LEWIS, REDBOND, RUGGIERI & CO LIMITED_000024)', 'created', '49.36.240.82', '2025-03-19 03:22:10', '2025-03-19 03:22:10'),
(233, 59, '2025-03-19', 'customer', 42, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Vikash  Jaimini  edited the service details and added an additional service while editing the customer code : cust_ROB_000024(ROBERT LEWIS, REDBOND, RUGGIERI & CO LIMITED_000024)', 'updated', '49.36.240.82', '2025-03-19 03:22:34', '2025-03-19 03:22:34'),
(234, 59, '2025-03-19', 'customer', 42, 'edited the service details customer code :', 'Account Manager Vikash  Jaimini edited the service details customer code : cust_MY _000024(MY TAX HELPER LTD)', 'updated', '49.36.240.82', '2025-03-19 03:35:18', '2025-03-19 03:35:18'),
(235, 59, '2025-03-19', 'customer', 42, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Vikash  Jaimini  edited the service details and added an additional service while editing the customer code : cust_MY _000024(MY TAX HELPER LTD)', 'updated', '49.36.240.82', '2025-03-19 03:36:43', '2025-03-19 03:36:43'),
(236, 59, '2025-03-19', 'customer', 43, 'created customer profile. customer code :', 'Account Manager Vikash  Jaimini created customer profile. customer code : cust_ROB_000025(ROBERT LEWIS, REDBOND, RUGGIERI & CO LIMITED_000025)', 'created', '49.36.240.82', '2025-03-19 03:41:12', '2025-03-19 03:41:12'),
(237, 59, '2025-03-19', 'customer', 44, 'created customer profile. customer code :', 'Account Manager Vikash  Jaimini created customer profile. customer code : cust_ROB_000026(ROBERT LEWIS, REDBOND, RUGGIERI & CO LIMITED_000026)', 'created', '49.36.240.82', '2025-03-19 03:41:21', '2025-03-19 03:41:21'),
(238, 59, '2025-03-19', 'client', 44, 'deleted customer. customer code :', NULL, 'deleted', '49.36.240.82', '2025-03-19 03:42:00', '2025-03-19 03:42:00'),
(239, 59, '2025-03-19', 'staff', 68, 'created staff Vivek Jangid', 'Account Manager Vikash  Jaimini created staff Vivek Jangid ', 'created', '49.36.240.82', '2025-03-19 03:47:06', '2025-03-19 03:47:06'),
(240, 59, '2025-03-19', 'staff', 69, 'created staff Priya Gupta', 'Account Manager Vikash  Jaimini created staff Priya Gupta ', 'created', '49.36.241.178', '2025-03-19 03:47:53', '2025-03-19 03:47:53'),
(241, 59, '2025-03-19', 'staff', 70, 'created staff Varun Singh', 'Account Manager Vikash  Jaimini created staff Varun Singh ', 'created', '49.36.241.178', '2025-03-19 03:48:22', '2025-03-19 03:48:22'),
(242, 59, '2025-03-19', 'staff', 71, 'created staff manisha Jain', 'Account Manager Vikash  Jaimini created staff manisha Jain ', 'created', '49.36.241.178', '2025-03-19 03:48:50', '2025-03-19 03:48:50'),
(243, 59, '2025-03-19', 'staff', 72, 'created staff Pankaj Choudhary', 'Account Manager Vikash  Jaimini created staff Pankaj Choudhary ', 'created', '49.36.241.178', '2025-03-19 03:49:31', '2025-03-19 03:49:31'),
(244, 68, '2025-03-19', '-', 0, ' Logged In With Microsoft', 'Reviewer Vivek Jangid  Logged In With Microsoft ', '-', NULL, '2025-03-19 03:50:32', '2025-03-19 03:50:32'),
(245, 59, '2025-03-19', 'staff', 73, 'created staff khushboo somvanshi', 'Account Manager Vikash  Jaimini created staff khushboo somvanshi ', 'created', '49.36.241.178', '2025-03-19 03:51:27', '2025-03-19 03:51:27'),
(246, 68, '2025-03-19', '-', 0, ' Logged Out', 'Reviewer Vivek Jangid  Logged Out ', '-', NULL, '2025-03-19 03:51:54', '2025-03-19 03:51:54'),
(247, 59, '2025-03-19', 'staff', 74, 'created staff Saumya Agrawal', 'Account Manager Vikash  Jaimini created staff Saumya Agrawal ', 'created', '49.36.241.178', '2025-03-19 03:53:17', '2025-03-19 03:53:17'),
(248, 59, '2025-03-19', 'staff', 75, 'created staff satyam kumar', 'Account Manager Vikash  Jaimini created staff satyam kumar ', 'created', '49.36.241.178', '2025-03-19 03:53:58', '2025-03-19 03:53:58'),
(249, 59, '2025-03-19', 'staff', 76, 'created staff Harun Saifi   Mohammad ', 'Account Manager Vikash  Jaimini created staff Harun Saifi   Mohammad  ', 'created', '49.36.241.178', '2025-03-19 03:54:48', '2025-03-19 03:54:48'),
(250, 59, '2025-03-19', 'staff', 77, 'created staff Talib Mohd ', 'Account Manager Vikash  Jaimini created staff Talib Mohd  ', 'created', '49.36.241.178', '2025-03-19 03:55:20', '2025-03-19 03:55:20'),
(251, 59, '2025-03-19', 'staff', 78, 'created staff Shreya Gupta', 'Account Manager Vikash  Jaimini created staff Shreya Gupta ', 'created', '49.36.241.178', '2025-03-19 03:55:51', '2025-03-19 03:55:51'),
(252, 59, '2025-03-19', 'staff', 79, 'created staff Aiswarya VC', 'Account Manager Vikash  Jaimini created staff Aiswarya VC ', 'created', '49.36.241.178', '2025-03-19 03:56:42', '2025-03-19 03:56:42'),
(253, 59, '2025-03-19', 'staff', 80, 'created staff Bhakti Kalambate', 'Account Manager Vikash  Jaimini created staff Bhakti Kalambate ', 'created', '49.36.241.178', '2025-03-19 03:57:27', '2025-03-19 03:57:27'),
(254, 59, '2025-03-19', 'staff', 81, 'created staff Shruti Manwani', 'Account Manager Vikash  Jaimini created staff Shruti Manwani ', 'created', '49.36.241.178', '2025-03-19 03:58:05', '2025-03-19 03:58:05'),
(255, 59, '2025-03-19', 'staff', 80, 'edited staff Bhakti Kalambate', 'Account Manager Vikash  Jaimini edited staff Bhakti Kalambate ', 'updated', '49.36.241.178', '2025-03-19 03:58:31', '2025-03-19 03:58:31'),
(256, 61, '2025-03-19', '-', 0, ' Logged In With Microsoft', 'Account Manager Nishtha Jain  Logged In With Microsoft ', '-', '223.181.34.186', '2025-03-19 06:42:24', '2025-03-19 06:42:24'),
(257, 61, '2025-03-19', 'staff', 82, 'created staff Diksha Garg', 'Account Manager Nishtha Jain created staff Diksha Garg ', 'created', '223.181.34.186', '2025-03-19 06:43:53', '2025-03-19 06:43:53'),
(258, 61, '2025-03-19', 'staff', 83, 'created staff Sunny  Thoriya', 'Account Manager Nishtha Jain created staff Sunny  Thoriya ', 'created', '223.181.34.186', '2025-03-19 06:44:48', '2025-03-19 06:44:48'),
(259, 61, '2025-03-19', 'staff', 84, 'created staff Kanika  Gosian', 'Account Manager Nishtha Jain created staff Kanika  Gosian ', 'created', '223.181.34.186', '2025-03-19 06:45:35', '2025-03-19 06:45:35'),
(260, 61, '2025-03-19', 'staff', 85, 'created staff Vipasha Santuka', 'Account Manager Nishtha Jain created staff Vipasha Santuka ', 'created', '223.181.34.186', '2025-03-19 06:47:00', '2025-03-19 06:47:00'),
(261, 61, '2025-03-19', 'customer', 45, 'created customer profile. customer code :', 'Account Manager Nishtha Jain created customer profile. customer code : cust_RLA_000026(RLA (CAMBS) LTD_000026)', 'created', '223.181.34.186', '2025-03-19 06:53:30', '2025-03-19 06:53:30'),
(262, 61, '2025-03-19', 'customer', 46, 'created customer profile. customer code :', 'Account Manager Nishtha Jain created customer profile. customer code : cust_RLA_000027(RLA (CAMBS) LTD_000027)', 'created', '223.181.34.186', '2025-03-19 06:53:45', '2025-03-19 06:53:45'),
(263, 61, '2025-03-19', 'customer', 47, 'created customer profile. customer code :', 'Account Manager Nishtha Jain created customer profile. customer code : cust_RLA_000028(RLA (CAMBS) LTD_000028)', 'created', '223.181.34.186', '2025-03-19 06:53:52', '2025-03-19 06:53:52'),
(264, 61, '2025-03-19', 'customer', 48, 'created customer profile. customer code :', 'Account Manager Nishtha Jain created customer profile. customer code : cust_RLA_000029(RLA (CAMBS) LTD_000029)', 'created', '223.181.34.186', '2025-03-19 06:54:12', '2025-03-19 06:54:12'),
(265, 61, '2025-03-19', 'customer', 49, 'created customer profile. customer code :', 'Account Manager Nishtha Jain created customer profile. customer code : cust_RLA_000030(RLA (CAMBS) LTD_000030)', 'created', '223.181.34.186', '2025-03-19 06:54:14', '2025-03-19 06:54:14'),
(266, 61, '2025-03-19', 'customer', 50, 'created customer profile. customer code :', 'Account Manager Nishtha Jain created customer profile. customer code : cust_RLA_000031(RLA (CAMBS) LTD_000031)', 'created', '223.181.34.186', '2025-03-19 06:54:16', '2025-03-19 06:54:16'),
(267, 61, '2025-03-19', 'customer', 51, 'created customer profile. customer code :', 'Account Manager Nishtha Jain created customer profile. customer code : cust_RLA_000032(RLA (CAMBS) LTD_000032)', 'created', '223.181.34.186', '2025-03-19 06:54:22', '2025-03-19 06:54:22'),
(268, 61, '2025-03-19', 'customer', 52, 'created customer profile. customer code :', 'Account Manager Nishtha Jain created customer profile. customer code : cust_RLA_000033(RLA (CAMBS) LTD_000033)', 'created', '223.181.34.186', '2025-03-19 06:57:17', '2025-03-19 06:57:17'),
(269, 61, '2025-03-19', 'customer', 53, 'created customer profile. customer code :', 'Account Manager Nishtha Jain created customer profile. customer code : cust_RLA_000034(RLA (CAMBS) LTD_000034)', 'created', '223.181.34.186', '2025-03-19 06:59:24', '2025-03-19 06:59:24'),
(270, 61, '2025-03-19', 'customer', 53, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Nishtha Jain  edited the service details and added an additional service while editing the customer code : cust_RLA_000034(RLA (CAMBS) LTD_000034)', 'updated', '223.181.34.186', '2025-03-19 07:01:22', '2025-03-19 07:01:22'),
(271, 61, '2025-03-19', 'client', 52, 'deleted customer. customer code :', NULL, 'deleted', '223.181.34.186', '2025-03-19 07:03:33', '2025-03-19 07:03:33'),
(272, 61, '2025-03-19', 'client', 51, 'deleted customer. customer code :', NULL, 'deleted', '223.181.34.186', '2025-03-19 07:03:36', '2025-03-19 07:03:36'),
(273, 61, '2025-03-19', 'client', 50, 'deleted customer. customer code :', NULL, 'deleted', '223.181.34.186', '2025-03-19 07:03:40', '2025-03-19 07:03:40'),
(274, 61, '2025-03-19', 'client', 49, 'deleted customer. customer code :', NULL, 'deleted', '223.181.34.186', '2025-03-19 07:03:42', '2025-03-19 07:03:42'),
(275, 61, '2025-03-19', 'client', 48, 'deleted customer. customer code :', NULL, 'deleted', '223.181.34.186', '2025-03-19 07:03:44', '2025-03-19 07:03:44'),
(276, 61, '2025-03-19', 'client', 47, 'deleted customer. customer code :', NULL, 'deleted', '223.181.34.186', '2025-03-19 07:03:46', '2025-03-19 07:03:46'),
(277, 61, '2025-03-19', 'client', 46, 'deleted customer. customer code :', NULL, 'deleted', '223.181.34.186', '2025-03-19 07:03:48', '2025-03-19 07:03:48'),
(278, 61, '2025-03-19', 'client', 45, 'deleted customer. customer code :', NULL, 'deleted', '223.181.34.186', '2025-03-19 07:03:50', '2025-03-19 07:03:50'),
(279, 61, '2025-03-19', 'customer', 54, 'created customer profile. customer code :', 'Account Manager Nishtha Jain created customer profile. customer code : cust_Fry_000035(Frynance Ltd_000035)', 'created', '223.181.34.186', '2025-03-19 07:05:11', '2025-03-19 07:05:11'),
(280, 61, '2025-03-19', 'customer', 55, 'created customer profile. customer code :', 'Account Manager Nishtha Jain created customer profile. customer code : cust_Fry_000036(Frynance Ltd_000036)', 'created', '223.181.34.186', '2025-03-19 07:05:13', '2025-03-19 07:05:13'),
(281, 61, '2025-03-19', 'customer', 56, 'created customer profile. customer code :', 'Account Manager Nishtha Jain created customer profile. customer code : cust_Fry_000037(Frynance Ltd_000037)', 'created', '223.181.34.186', '2025-03-19 07:05:16', '2025-03-19 07:05:16'),
(282, 61, '2025-03-19', 'customer', 57, 'created customer profile. customer code :', 'Account Manager Nishtha Jain created customer profile. customer code : cust_Fry_000038(Frynance Ltd_000038)', 'created', '223.181.34.186', '2025-03-19 07:05:18', '2025-03-19 07:05:18'),
(283, 61, '2025-03-19', 'customer', 58, 'created customer profile. customer code :', 'Account Manager Nishtha Jain created customer profile. customer code : cust_Fry_000039(Frynance Ltd_000039)', 'created', '223.181.34.186', '2025-03-19 07:05:19', '2025-03-19 07:05:19'),
(284, 61, '2025-03-19', 'customer', 59, 'created customer profile. customer code :', 'Account Manager Nishtha Jain created customer profile. customer code : cust_Fry_000040(Frynance Ltd_000040)', 'created', '223.181.34.186', '2025-03-19 07:05:20', '2025-03-19 07:05:20'),
(285, 61, '2025-03-19', 'customer', 60, 'created customer profile. customer code :', 'Account Manager Nishtha Jain created customer profile. customer code : cust_FRY_000041(FRYNANCE LIMITED_000041)', 'created', '223.181.34.186', '2025-03-19 07:05:42', '2025-03-19 07:05:42'),
(286, 61, '2025-03-19', 'customer', 60, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Nishtha Jain  edited the service details and added an additional service while editing the customer code : cust_FRY_000041(FRYNANCE LIMITED_000041)', 'updated', '223.181.34.186', '2025-03-19 07:05:51', '2025-03-19 07:05:51'),
(287, 61, '2025-03-19', 'client', 59, 'deleted customer. customer code :', NULL, 'deleted', '223.181.34.186', '2025-03-19 07:07:05', '2025-03-19 07:07:05'),
(288, 61, '2025-03-19', 'client', 58, 'deleted customer. customer code :', NULL, 'deleted', '223.181.34.186', '2025-03-19 07:07:08', '2025-03-19 07:07:08'),
(289, 61, '2025-03-19', 'client', 57, 'deleted customer. customer code :', NULL, 'deleted', '223.181.34.186', '2025-03-19 07:07:09', '2025-03-19 07:07:09'),
(290, 61, '2025-03-19', 'client', 56, 'deleted customer. customer code :', NULL, 'deleted', '223.181.34.186', '2025-03-19 07:07:11', '2025-03-19 07:07:11'),
(291, 61, '2025-03-19', 'client', 55, 'deleted customer. customer code :', NULL, 'deleted', '223.181.34.186', '2025-03-19 07:07:13', '2025-03-19 07:07:13'),
(292, 61, '2025-03-19', 'client', 54, 'deleted customer. customer code :', NULL, 'deleted', '223.181.34.186', '2025-03-19 07:07:15', '2025-03-19 07:07:15'),
(293, 61, '2025-03-19', 'customer', 53, 'edited the company information customer code :', 'Account Manager Nishtha Jain edited the company information customer code : cust_RLA_000034(RLA (CAMBS) LTD)', 'updated', '223.181.34.186', '2025-03-19 07:07:36', '2025-03-19 07:07:36'),
(294, 61, '2025-03-19', 'client', 10, 'created client profile. client code :', 'Account Manager Nishtha Jain created client profile. client code : cli_RLA_BEA_00007(BEAM CONSTRUCTION LIMITED_00007)', 'created', '223.181.34.186', '2025-03-19 07:09:48', '2025-03-19 07:09:48'),
(295, 61, '2025-03-19', 'staff', 86, 'created staff Mudit Yadav', 'Account Manager Nishtha Jain created staff Mudit Yadav ', 'created', '223.181.34.186', '2025-03-19 07:11:39', '2025-03-19 07:11:39'),
(296, 61, '2025-03-19', 'staff', 87, 'created staff Shalini Gudivada', 'Account Manager Nishtha Jain created staff Shalini Gudivada ', 'created', '223.181.34.186', '2025-03-19 07:12:31', '2025-03-19 07:12:31'),
(297, 60, '2025-03-19', '-', 0, ' Logged In With Microsoft', 'Account Manager Mohit Kumar  Logged In With Microsoft ', '-', '103.95.164.71', '2025-03-19 08:36:30', '2025-03-19 08:36:30'),
(298, 52, '2025-03-19', '-', 0, ' Logged In With Microsoft', 'Account Manager Robin Bhaik  Logged In With Microsoft ', '-', '152.56.69.7', '2025-03-19 08:58:22', '2025-03-19 08:58:22'),
(299, 53, '2025-03-19', '-', 0, ' Logged In With Microsoft', 'Account Manager Vivek Singh  Logged In With Microsoft ', '-', '103.55.90.20', '2025-03-19 08:59:09', '2025-03-19 08:59:09'),
(300, 47, '2025-03-19', '-', 0, ' Logged In With Microsoft', 'Account Manager Tushar Sharma  Logged In With Microsoft ', '-', '152.58.125.6', '2025-03-19 08:59:32', '2025-03-19 08:59:32'),
(301, 12, '2025-03-19', '-', 0, ' Logged In With Microsoft', 'Management Ravinder Singh  Logged In With Microsoft ', '-', '223.237.17.235', '2025-03-19 09:00:12', '2025-03-19 09:00:12'),
(302, 12, '2025-03-19', '-', 0, ' Logged In With Microsoft', 'Management Ravinder Singh  Logged In With Microsoft ', '-', '223.237.17.235', '2025-03-19 09:00:19', '2025-03-19 09:00:19'),
(303, 15, '2025-03-19', '-', 0, ' Logged In With Microsoft', 'Account Manager Amit Singh  Logged In With Microsoft ', '-', '160.202.38.146', '2025-03-19 09:00:32', '2025-03-19 09:00:32'),
(304, 12, '2025-03-19', 'staff', 88, 'created staff Darshita Trivedi', 'Management Ravinder Singh created staff Darshita Trivedi ', 'created', '223.237.17.235', '2025-03-19 09:01:57', '2025-03-19 09:01:57'),
(305, 47, '2025-03-19', 'customer', 24, 'edited the company information customer code :', 'Account Manager Tushar Sharma edited the company information customer code : cust_BPC_000015(BPC PARTNERS LIMITED_000015)', 'updated', '152.58.125.6', '2025-03-19 09:10:54', '2025-03-19 09:10:54'),
(306, 50, '2025-03-19', '-', 0, ' Logged In With Microsoft', 'Account Manager Deepak Singh  Logged In With Microsoft ', '-', '205.254.171.71', '2025-03-19 09:19:55', '2025-03-19 09:19:55'),
(307, 61, '2025-03-19', 'client', 11, 'created client profile. client code :', 'Account Manager Nishtha Jain created client profile. client code : cli_RLA_ONE_00008(ONE FINANCIAL PLANNING LTD. _00008)', 'created', '223.181.34.186', '2025-03-19 09:22:47', '2025-03-19 09:22:47'),
(308, 61, '2025-03-19', 'client', 12, 'created client profile. client code :', 'Account Manager Nishtha Jain created client profile. client code : cli_RLA_LAW_00009(LAW AND LEWIS OF CAMBRIDGE LIMITED_00009)', 'created', '223.181.34.186', '2025-03-19 09:23:29', '2025-03-19 09:23:29'),
(309, 61, '2025-03-19', 'client', 13, 'created client profile. client code :', 'Account Manager Nishtha Jain created client profile. client code : cli_RLA_GUN_000010(GUNN TI LIMITED_000010)', 'created', '223.181.34.186', '2025-03-19 09:23:56', '2025-03-19 09:23:56'),
(310, 61, '2025-03-19', 'client', 14, 'created client profile. client code :', 'Account Manager Nishtha Jain created client profile. client code : cli_RLA_LEG_000011(LEGACY MATTERS LTD_000011)', 'created', '223.181.34.186', '2025-03-19 09:25:45', '2025-03-19 09:25:45'),
(311, 61, '2025-03-19', 'client', 15, 'created client profile. client code :', 'Account Manager Nishtha Jain created client profile. client code : cli_RLA_HIT_000012(HITEAM LIMITED_000012)', 'created', '223.181.34.186', '2025-03-19 09:26:30', '2025-03-19 09:26:30'),
(312, 52, '2025-03-19', 'staff', 89, 'created staff Gaurav Kumar', 'Account Manager Robin Bhaik created staff Gaurav Kumar ', 'created', '152.56.69.7', '2025-03-19 10:17:40', '2025-03-19 10:17:40'),
(313, 88, '2025-03-19', '-', 0, ' Logged In With Microsoft', 'Account Manager Darshita Trivedi  Logged In With Microsoft ', '-', '43.250.158.62', '2025-03-19 12:34:05', '2025-03-19 12:34:05'),
(314, 53, '2025-03-19', 'customer', 61, 'created customer profile. customer code :', 'Account Manager Vivek Singh created customer profile. customer code : cust_Nob_000042(Noblesse Care Group Ltd_000042)', 'created', '103.55.90.20', '2025-03-19 13:24:47', '2025-03-19 13:24:47'),
(315, 53, '2025-03-19', 'customer', 62, 'created customer profile. customer code :', 'Account Manager Vivek Singh created customer profile. customer code : cust_Nob_000043(Noblesse Care Group Ltd_000043)', 'created', '103.55.90.20', '2025-03-19 13:25:09', '2025-03-19 13:25:09'),
(316, 53, '2025-03-19', 'customer', 63, 'created customer profile. customer code :', 'Account Manager Vivek Singh created customer profile. customer code : cust_Nob_000044(Noblesse Care Group Ltd_000044)', 'created', '103.55.90.20', '2025-03-19 13:25:12', '2025-03-19 13:25:12'),
(317, 53, '2025-03-19', 'customer', 64, 'created customer profile. customer code :', 'Account Manager Vivek Singh created customer profile. customer code : cust_Nob_000045(Noblesse Care Group Ltd_000045)', 'created', '103.55.90.20', '2025-03-19 13:25:23', '2025-03-19 13:25:23'),
(318, 53, '2025-03-19', 'customer', 65, 'created customer profile. customer code :', 'Account Manager Vivek Singh created customer profile. customer code : cust_Nob_000046(Noblesse Care Group Ltd_000046)', 'created', '103.55.90.20', '2025-03-19 13:25:38', '2025-03-19 13:25:38'),
(319, 53, '2025-03-19', 'customer', 66, 'created customer profile. customer code :', 'Account Manager Vivek Singh created customer profile. customer code : cust_Nob_000047(Noblesse Care Group Ltd_000047)', 'created', '103.55.90.20', '2025-03-19 13:29:50', '2025-03-19 13:29:50'),
(320, 53, '2025-03-19', 'customer', 67, 'created customer profile. customer code :', 'Account Manager Vivek Singh created customer profile. customer code : cust_Nob_000048(Noblesse Care Group Ltd_000048)', 'created', '103.55.90.20', '2025-03-19 13:30:42', '2025-03-19 13:30:42'),
(321, 53, '2025-03-19', 'customer', 68, 'created customer profile. customer code :', 'Account Manager Vivek Singh created customer profile. customer code : cust_Nob_000049(Noblesse Care Group Ltd_000049)', 'created', '103.55.90.20', '2025-03-19 13:30:46', '2025-03-19 13:30:46'),
(322, 53, '2025-03-19', 'customer', 69, 'created customer profile. customer code :', 'Account Manager Vivek Singh created customer profile. customer code : cust_Nob_000050(Noblesse Care Group Ltd_000050)', 'created', '103.55.90.20', '2025-03-19 13:31:03', '2025-03-19 13:31:03'),
(323, 53, '2025-03-19', 'customer', 70, 'created customer profile. customer code :', 'Account Manager Vivek Singh created customer profile. customer code : cust_Nob_000051(Noblesse Care Group Ltd_000051)', 'created', '103.55.90.20', '2025-03-19 13:31:31', '2025-03-19 13:31:31'),
(324, 60, '2025-03-19', 'customer', 71, 'created customer profile. customer code :', 'Account Manager Mohit Kumar created customer profile. customer code : cust_AST_000052(ASTONIA ASSOCIATES LIMITED_000052)', 'created', '103.95.164.71', '2025-03-19 15:03:31', '2025-03-19 15:03:31'),
(325, 60, '2025-03-19', 'customer', 71, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Mohit Kumar  edited the service details and added an additional service while editing the customer code : cust_AST_000052(ASTONIA ASSOCIATES LIMITED_000052)', 'updated', '103.95.164.71', '2025-03-19 15:04:27', '2025-03-19 15:04:27'),
(326, 60, '2025-03-19', 'client', 34, 'deleted customer. customer code :', NULL, 'deleted', '103.95.164.71', '2025-03-19 15:06:14', '2025-03-19 15:06:14'),
(327, 60, '2025-03-19', 'client', 16, 'created client profile. client code :', 'Account Manager Mohit Kumar created client profile. client code : cli_AST_BP _000013(BP FLATS LTD_000013)', 'created', '103.95.164.71', '2025-03-19 15:10:22', '2025-03-19 15:10:22'),
(328, 60, '2025-03-19', 'staff', 90, 'created staff Kanishka Chhabra', 'Account Manager Mohit Kumar created staff Kanishka Chhabra ', 'created', '103.95.164.71', '2025-03-19 15:11:44', '2025-03-19 15:11:44'),
(329, 60, '2025-03-19', 'staff', 91, 'created staff Gaurav Prajapat', 'Account Manager Mohit Kumar created staff Gaurav Prajapat ', 'created', '103.95.164.71', '2025-03-19 15:12:34', '2025-03-19 15:12:34'),
(330, 15, '2025-03-19', '-', 0, ' Logged Out', 'Account Manager Amit Singh  Logged Out ', '-', '160.202.38.146', '2025-03-19 15:33:10', '2025-03-19 15:33:10'),
(331, 60, '2025-03-19', 'client', 17, 'created client profile. client code :', 'Account Manager Mohit Kumar created client profile. client code : cli_AST_LIT_000014(LITTLE BLACK BOOK MUSIC LIMITED_000014)', 'created', '103.95.164.71', '2025-03-19 16:08:17', '2025-03-19 16:08:17'),
(332, 60, '2025-03-20', '-', 0, ' Logged In With Microsoft', 'Account Manager Mohit Kumar  Logged In With Microsoft ', '-', '103.95.164.71', '2025-03-20 07:03:48', '2025-03-20 07:03:48'),
(333, 8, '2025-03-20', '-', 0, ' Logged In With Microsoft', 'Account Manager Lavesh Premani  Logged In With Microsoft ', '-', '49.36.238.16', '2025-03-20 07:05:21', '2025-03-20 07:05:21'),
(334, 8, '2025-03-20', 'customer', 72, 'created customer profile. customer code :', 'Account Manager Lavesh Premani created customer profile. customer code : cust_STR_000053(STRATOM CONSULTING LIMITED_000053)', 'created', '49.36.238.16', '2025-03-20 07:07:40', '2025-03-20 07:07:40'),
(335, 8, '2025-03-20', 'customer', 72, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Lavesh Premani  edited the service details and added an additional service while editing the customer code : cust_STR_000053(STRATOM CONSULTING LIMITED_000053)', 'updated', '49.36.238.16', '2025-03-20 07:07:53', '2025-03-20 07:07:53'),
(336, 8, '2025-03-20', 'client', 18, 'created client profile. client code :', 'Account Manager Lavesh Premani created client profile. client code : cli_STR_SAX_000015(SAXON ADVISORS LTD_000015)', 'created', '49.36.238.16', '2025-03-20 07:11:41', '2025-03-20 07:11:41'),
(337, 8, '2025-03-20', 'staff', 92, 'created staff Mohd. Irshad', 'Account Manager Lavesh Premani created staff Mohd. Irshad ', 'created', '49.36.238.16', '2025-03-20 07:14:00', '2025-03-20 07:14:00'),
(338, 44, '2025-03-20', '-', 0, ' Logged In With Microsoft', 'Management Sachin Daga  Logged In With Microsoft ', '-', '49.36.238.53', '2025-03-20 07:48:56', '2025-03-20 07:48:56'),
(339, 55, '2025-03-20', '-', 0, ' Logged In With Microsoft', 'Support Elakkya Vikas  Logged In With Microsoft ', '-', '49.37.171.160', '2025-03-20 07:51:47', '2025-03-20 07:51:47'),
(340, 56, '2025-03-20', '-', 0, ' Logged In With Microsoft', 'Support Kamlesh Kumar  Logged In With Microsoft ', '-', '183.83.157.9', '2025-03-20 07:56:55', '2025-03-20 07:56:55'),
(341, 45, '2025-03-20', '-', 0, ' Logged In With Microsoft', 'Management Anushree R  Logged In With Microsoft ', '-', '106.219.165.86', '2025-03-20 07:57:17', '2025-03-20 07:57:17'),
(342, 44, '2025-03-20', '-', 0, ' Logged Out', 'Management Sachin Daga  Logged Out ', '-', '49.36.238.53', '2025-03-20 08:05:55', '2025-03-20 08:05:55'),
(343, 44, '2025-03-20', '-', 0, ' Logged In With Microsoft', 'Management Sachin Daga  Logged In With Microsoft ', '-', '49.36.238.249', '2025-03-20 08:21:36', '2025-03-20 08:21:36'),
(344, 44, '2025-03-20', '-', 0, ' Logged Out', 'Management Sachin Daga  Logged Out ', '-', '49.36.238.249', '2025-03-20 08:22:05', '2025-03-20 08:22:05'),
(345, 44, '2025-03-20', '-', 0, ' Logged In With Microsoft', 'Management Sachin Daga  Logged In With Microsoft ', '-', '49.36.238.249', '2025-03-20 08:24:40', '2025-03-20 08:24:40'),
(346, 44, '2025-03-20', 'staff', 55, 'edited staff Elakkya Vikas', 'Management Sachin Daga edited staff Elakkya Vikas ', 'updated', '49.36.238.249', '2025-03-20 08:28:49', '2025-03-20 08:28:49'),
(347, 55, '2025-03-20', 'staff', 55, 'edited staff Elakkya Vikas', 'Management Elakkya Vikas edited staff Elakkya Vikas ', 'updated', '49.37.171.160', '2025-03-20 08:32:33', '2025-03-20 08:32:33'),
(348, 44, '2025-03-20', '-', 0, ' Logged Out', 'Management Sachin Daga  Logged Out ', '-', '49.36.238.249', '2025-03-20 08:56:04', '2025-03-20 08:56:04'),
(349, 55, '2025-03-20', 'customer', 23, 'edited the company information customer code :', 'Management Elakkya Vikas edited the company information customer code : cust_BLE_000014(BLENHEIM PARTNERS LIMITED_000014)', 'updated', '49.37.169.214', '2025-03-20 09:21:40', '2025-03-20 09:21:40'),
(350, 55, '2025-03-20', 'customer', 22, 'edited Adhoc/PAYG/Hourly (engagement model) customer code :', 'Management Elakkya Vikas edited Adhoc/PAYG/Hourly (engagement model) customer code : cust_BER_000013(BERKO WEALTH LTD. _000013)', 'updated', '49.37.169.214', '2025-03-20 09:35:19', '2025-03-20 09:35:19'),
(351, 55, '2025-03-20', 'customer', 20, 'edited Adhoc/PAYG/Hourly (engagement model) customer code :', 'Management Elakkya Vikas edited Adhoc/PAYG/Hourly (engagement model) customer code : cust_AXA_000011(AXADA LTD_000011)', 'updated', '49.37.169.214', '2025-03-20 09:42:13', '2025-03-20 09:42:13'),
(352, 44, '2025-03-20', '-', 0, ' Logged In With Microsoft', 'Management Sachin Daga  Logged In With Microsoft ', '-', '49.36.238.249', '2025-03-20 09:43:32', '2025-03-20 09:43:32'),
(353, 55, '2025-03-20', 'customer', 19, 'edited FTE/Dedicated Staffing (engagement model) customer code :', 'Management Elakkya Vikas edited FTE/Dedicated Staffing (engagement model) customer code : cust_BAA_000010(BAANX GROUP LTD_000010)', 'updated', '49.37.169.214', '2025-03-20 09:44:52', '2025-03-20 09:44:52'),
(354, 44, '2025-03-20', '-', 0, ' Logged Out', 'Management Sachin Daga  Logged Out ', '-', '49.36.238.249', '2025-03-20 09:58:09', '2025-03-20 09:58:10'),
(355, 1, '2025-03-20', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.39.52', '2025-03-20 14:37:16', '2025-03-20 14:37:16'),
(356, 44, '2025-03-21', '-', 0, ' Logged In With Microsoft', 'Management Sachin Daga  Logged In With Microsoft ', '-', '49.36.238.249', '2025-03-21 07:02:59', '2025-03-21 07:02:59'),
(357, 44, '2025-03-21', '-', 0, ' Logged Out', 'Management Sachin Daga  Logged Out ', '-', '49.36.238.249', '2025-03-21 07:03:09', '2025-03-21 07:03:09'),
(358, 14, '2025-03-21', '-', 0, ' Logged In With Microsoft', 'Account Manager Sonu Kumar  Logged In With Microsoft ', '-', '45.120.127.112', '2025-03-21 07:56:55', '2025-03-21 07:56:55'),
(359, 14, '2025-03-21', 'staff', 93, 'created staff Talib Khan', 'Account Manager Sonu Kumar created staff Talib Khan ', 'created', '45.120.127.112', '2025-03-21 07:59:14', '2025-03-21 07:59:14'),
(360, 60, '2025-03-21', '-', 0, ' Logged In With Microsoft', 'Account Manager Mohit Kumar  Logged In With Microsoft ', '-', '103.95.164.71', '2025-03-21 08:25:44', '2025-03-21 08:25:44'),
(361, 1, '2025-03-21', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-03-21 11:15:10', '2025-03-21 11:15:10'),
(362, 1, '2025-03-21', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-03-21 11:45:16', '2025-03-21 11:45:16'),
(363, 1, '2025-03-21', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.118.6', '2025-03-21 14:09:14', '2025-03-21 14:09:14'),
(364, 1, '2025-03-21', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '27.59.118.6', '2025-03-21 14:12:03', '2025-03-21 14:12:03'),
(365, 1, '2025-03-21', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.118.6', '2025-03-21 14:14:11', '2025-03-21 14:14:11'),
(366, 1, '2025-03-21', 'staff', 94, 'created staff Vikas Patel', 'Super Admin System Super Super Admin created staff Vikas Patel ', 'created', '27.59.118.6', '2025-03-21 14:15:02', '2025-03-21 14:15:02'),
(367, 1, '2025-03-21', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '27.59.127.240', '2025-03-21 14:15:12', '2025-03-21 14:15:12'),
(368, 1, '2025-03-21', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.127.240', '2025-03-21 14:20:12', '2025-03-21 14:20:12'),
(369, 44, '2025-03-24', '-', 0, ' Logged In With Microsoft', 'Management Sachin Daga  Logged In With Microsoft ', '-', '49.36.238.53', '2025-03-24 06:47:27', '2025-03-24 06:47:27'),
(370, 44, '2025-03-24', '-', 0, ' Logged Out', 'Management Sachin Daga  Logged Out ', '-', '49.36.238.53', '2025-03-24 06:48:18', '2025-03-24 06:48:18'),
(371, 53, '2025-03-24', '-', 0, ' Logged In With Microsoft', 'Account Manager Vivek Singh  Logged In With Microsoft ', '-', '103.55.90.20', '2025-03-24 08:58:49', '2025-03-24 08:58:49'),
(372, 44, '2025-03-25', '-', 0, ' Logged In With Microsoft', 'Management Sachin Daga  Logged In With Microsoft ', '-', '49.36.236.31', '2025-03-25 05:47:01', '2025-03-25 05:47:01'),
(373, 44, '2025-03-25', '-', 0, ' Logged Out', 'Management Sachin Daga  Logged Out ', '-', '49.36.236.31', '2025-03-25 05:47:07', '2025-03-25 05:47:07'),
(374, 60, '2025-03-25', '-', 0, ' Logged In With Microsoft', 'Account Manager Mohit Kumar  Logged In With Microsoft ', '-', '103.95.164.71', '2025-03-25 08:12:57', '2025-03-25 08:12:57'),
(375, 1, '2025-03-25', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.127.240', '2025-03-25 16:04:57', '2025-03-25 16:04:57'),
(376, 1, '2025-03-25', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '171.79.40.208', '2025-03-25 16:05:32', '2025-03-25 16:05:32'),
(377, 1, '2025-03-25', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.40.208', '2025-03-25 16:05:41', '2025-03-25 16:05:41'),
(378, 88, '2025-03-26', '-', 0, ' Logged In With Microsoft', 'Account Manager Darshita Trivedi  Logged In With Microsoft ', '-', '43.241.144.51', '2025-03-26 07:10:05', '2025-03-26 07:10:05'),
(379, 15, '2025-03-26', '-', 0, ' Logged In With Microsoft', 'Account Manager Amit Singh  Logged In With Microsoft ', '-', '160.202.38.146', '2025-03-26 09:13:06', '2025-03-26 09:13:06'),
(380, 1, '2025-03-26', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-03-26 09:33:11', '2025-03-26 09:33:11'),
(381, 1, '2025-03-26', 'client', 18, 'company edited information. client code :', 'Super Admin System Super Super Admin company edited information. client code : cli_STR_SAX_000015(SAXON ADVISORS LTD_000015)', 'updated', '103.103.213.217', '2025-03-26 09:39:32', '2025-03-26 09:39:32'),
(382, 1, '2025-03-26', 'customer', 72, 'edited the company information customer code :', 'Super Admin System Super Super Admin edited the company information customer code : cust_STR_000053(STRATOM CONSULTING LIMITED_000053)', 'updated', '103.103.213.217', '2025-03-26 10:01:22', '2025-03-26 10:01:22'),
(383, 1, '2025-03-26', 'client', 18, 'deleted client profile. client code :', 'Super Admin System Super Super Admin deleted client profile. client code : cli_STR_SAX_000015(SAXON ADVISORS LTD_000015)', 'deleted', '103.103.213.217', '2025-03-26 11:43:00', '2025-03-26 11:43:00'),
(384, 15, '2025-03-26', '-', 0, ' Logged Out', 'Account Manager Amit Singh  Logged Out ', '-', '160.202.38.221', '2025-03-26 12:25:39', '2025-03-26 12:25:39'),
(385, 1, '2025-03-26', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.40.208', '2025-03-26 13:46:46', '2025-03-26 13:46:46'),
(386, 1, '2025-03-26', 'customer', 73, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_CAP_000054(CAPITALIFE INVESTMENTS LIMITED_000054)', 'created', '171.79.45.75', '2025-03-26 13:53:59', '2025-03-26 13:53:59'),
(387, 1, '2025-03-26', 'customer', 73, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_CAP_000054(CAPITALIFE INVESTMENTS LIMITED_000054)', 'updated', '171.79.45.75', '2025-03-26 13:54:05', '2025-03-26 13:54:05'),
(388, 1, '2025-03-26', 'customer', 73, 'edited the company information customer code :', 'Super Admin System Super Super Admin edited the company information customer code : cust_AND_000054(ANDREWS BUILDING SERVICES CONSULTING ENGINEERS LTD)', 'updated', '171.79.45.75', '2025-03-26 13:54:33', '2025-03-26 13:54:33'),
(389, 1, '2025-03-26', 'client', 19, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_AND_EW _000015(EW ACCOUNTING SERVICES LTD32323_000015)', 'created', '171.79.45.75', '2025-03-26 13:55:33', '2025-03-26 13:55:33'),
(390, 1, '2025-03-26', 'customer', 73, 'edited the company information customer code :', 'Super Admin System Super Super Admin edited the company information customer code : cust_AND_000054(ANDREWS BUILDING SERVICES CONSULTING ENGINEERS LTD)', 'updated', '171.79.45.75', '2025-03-26 13:55:55', '2025-03-26 13:55:55'),
(391, 1, '2025-03-26', 'customer', 73, 'edited the company information customer code :', 'Super Admin System Super Super Admin edited the company information customer code : cust_AND_000054(ANDREWS BUILDING SERVICES CONSULTING ENGINEERS LTD)', 'updated', '171.79.45.75', '2025-03-26 13:56:18', '2025-03-26 13:56:18'),
(392, 1, '2025-03-26', 'client', 19, 'company edited information. client code :', 'Super Admin System Super Super Admin company edited information. client code : cli_AND_EW _000015(EW ACCOUNTING SERVICES LTD32323_000015)', 'updated', '171.79.45.75', '2025-03-26 13:56:41', '2025-03-26 13:56:41'),
(393, 1, '2025-03-26', 'client', 19, 'company edited information. client code :', 'Super Admin System Super Super Admin company edited information. client code : cli_AND_EW _000015(EW ACCOUNTING SERVICES LTD32323_000015)', 'updated', '171.79.45.75', '2025-03-26 13:56:49', '2025-03-26 13:56:49'),
(394, 1, '2025-03-26', 'job types', 1, 'created job types test', 'Super Admin System Super Super Admin created job types test ', 'created', '171.79.45.75', '2025-03-26 13:57:51', '2025-03-26 13:57:51'),
(395, 1, '2025-03-26', 'job', 1, 'created job code:', 'Super Admin System Super Super Admin created job code: AND_EW _test_00001', 'created', '171.79.45.75', '2025-03-26 13:58:12', '2025-03-26 13:58:12'),
(396, 1, '2025-03-26', 'client', 20, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_AND_ASS_000016(ASSOCIAZIONE PER LA PROMOZIONE DELLA LINGUA ITALIANA - PLI MANCHESTER LTD)', 'created', '171.79.45.75', '2025-03-26 13:59:11', '2025-03-26 13:59:11'),
(397, 1, '2025-03-26', 'client', 21, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_AND_Tha_000017(Thames International Trading Group)', 'created', '171.79.45.75', '2025-03-26 13:59:24', '2025-03-26 13:59:24'),
(398, 1, '2025-03-26', 'client', 22, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_AND_tet_000018(tet)', 'created', '171.79.45.75', '2025-03-26 13:59:35', '2025-03-26 13:59:35'),
(399, 1, '2025-03-26', 'client', 23, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_AND_tes_000019(test)', 'created', '171.79.45.75', '2025-03-26 13:59:53', '2025-03-26 13:59:53'),
(400, 1, '2025-03-26', 'client', 24, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_AND_tes_000020(teststest)', 'created', '171.79.45.75', '2025-03-26 14:00:14', '2025-03-26 14:00:14'),
(401, 1, '2025-03-26', 'client', 25, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_AND_tes_000021(testtesttest)', 'created', '171.79.45.75', '2025-03-26 14:00:42', '2025-03-26 14:00:42'),
(402, 1, '2025-03-26', 'client', 19, 'company edited information. client code :', 'Super Admin System Super Super Admin company edited information. client code : cli_AND_EW _000015(EW ACCOUNTING SERVICES LTD32323_000015)', 'updated', '171.79.45.75', '2025-03-26 14:00:54', '2025-03-26 14:00:54'),
(403, 1, '2025-03-26', 'client', 21, 'edited sole trader Officer information. client code :', 'Super Admin System Super Super Admin edited sole trader Officer information. client code : cli_AND_Tha_000017(Thames International Trading Group)', 'updated', '171.79.45.75', '2025-03-26 14:01:31', '2025-03-26 14:01:31'),
(404, 1, '2025-03-26', 'client', 22, 'edited individual Officer information. client code :', 'Super Admin System Super Super Admin edited individual Officer information. client code : cli_AND_tet_000018(tet)', 'updated', '171.79.45.75', '2025-03-26 14:01:43', '2025-03-26 14:01:43'),
(405, 1, '2025-03-26', 'client', 25, 'removed Trust Officer information. client code :', 'Super Admin System Super Super Admin removed Trust Officer information. client code : cli_AND_tes_000021(testtesttest)', 'updated', '171.79.45.75', '2025-03-26 14:02:18', '2025-03-26 14:02:18'),
(406, 1, '2025-03-26', 'client', 25, 'removed Trust Officer information. client code :', 'Super Admin System Super Super Admin removed Trust Officer information. client code : cli_AND_tes_000021(testtesttest)', 'updated', '171.79.45.75', '2025-03-26 14:02:18', '2025-03-26 14:02:18'),
(407, 1, '2025-03-26', 'customer', 73, 'added additional Officer to the company information customer code :', 'Super Admin System Super Super Admin added additional Officer to the company information customer code : cust_AND_000054(ANDREWS BUILDING SERVICES CONSULTING ENGINEERS LTD)', 'updated', '171.79.45.75', '2025-03-26 14:03:51', '2025-03-26 14:03:51'),
(408, 1, '2025-03-26', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-03-26 14:07:57', '2025-03-26 14:07:57'),
(409, 1, '2025-03-26', 'client', 64, 'deleted customer. customer code :', NULL, 'deleted', '171.79.45.75', '2025-03-26 14:08:52', '2025-03-26 14:08:52'),
(410, 1, '2025-03-26', 'client', 66, 'deleted customer. customer code :', NULL, 'deleted', '171.79.45.75', '2025-03-26 14:08:54', '2025-03-26 14:08:54'),
(411, 1, '2025-03-26', 'client', 67, 'deleted customer. customer code :', NULL, 'deleted', '171.79.45.75', '2025-03-26 14:08:56', '2025-03-26 14:08:56'),
(412, 1, '2025-03-26', 'client', 68, 'deleted customer. customer code :', NULL, 'deleted', '171.79.45.75', '2025-03-26 14:08:59', '2025-03-26 14:08:59'),
(413, 1, '2025-03-26', 'client', 69, 'deleted customer. customer code :', NULL, 'deleted', '171.79.45.75', '2025-03-26 14:09:01', '2025-03-26 14:09:01'),
(414, 1, '2025-03-26', 'client', 65, 'deleted customer. customer code :', NULL, 'deleted', '171.79.45.75', '2025-03-26 14:09:04', '2025-03-26 14:09:04'),
(415, 1, '2025-03-26', 'client', 63, 'deleted customer. customer code :', NULL, 'deleted', '171.79.45.75', '2025-03-26 14:09:06', '2025-03-26 14:09:06'),
(416, 1, '2025-03-26', 'client', 70, 'deleted customer. customer code :', NULL, 'deleted', '171.79.45.75', '2025-03-26 14:09:09', '2025-03-26 14:09:09'),
(417, 1, '2025-03-26', 'client', 62, 'deleted customer. customer code :', NULL, 'deleted', '171.79.45.75', '2025-03-26 14:09:12', '2025-03-26 14:09:12'),
(418, 1, '2025-03-26', 'client', 61, 'deleted customer. customer code :', NULL, 'deleted', '171.79.45.75', '2025-03-26 14:09:15', '2025-03-26 14:09:15'),
(419, 1, '2025-03-26', 'customer', 74, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_FDS_000055(FDSFGDSTXDGES LIMITED_000055)', 'created', '171.79.45.75', '2025-03-26 14:09:44', '2025-03-26 14:09:44'),
(420, 1, '2025-03-26', 'customer', 74, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_FDS_000055(FDSFGDSTXDGES LIMITED_000055)', 'updated', '171.79.45.75', '2025-03-26 14:09:53', '2025-03-26 14:09:53'),
(421, 1, '2025-03-26', 'customer', 75, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_A-A_000056(A-A JEWEL NORWICH OPCO S.À R.L. / B.V._000056)', 'created', '171.79.45.75', '2025-03-26 14:11:05', '2025-03-26 14:11:05'),
(422, 1, '2025-03-26', 'customer', 75, 'edited the company information customer code :', 'Super Admin System Super Super Admin edited the company information customer code : cust_BIR_000056(BIRMINGHAM CONNECTION LTD)', 'updated', '171.79.45.75', '2025-03-26 14:11:23', '2025-03-26 14:11:23'),
(423, 1, '2025-03-26', 'customer', 75, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_BIR_000056(BIRMINGHAM CONNECTION LTD)', 'updated', '171.79.45.75', '2025-03-26 14:11:26', '2025-03-26 14:11:26'),
(424, 1, '2025-03-26', 'customer', 75, 'added Percentage Model (engagement model) customer code :', 'Super Admin System Super Super Admin added Percentage Model (engagement model) customer code : cust_BIR_000056(BIRMINGHAM CONNECTION LTD)', 'updated', '171.79.45.75', '2025-03-26 14:11:48', '2025-03-26 14:11:48'),
(425, 60, '2025-03-26', '-', 0, ' Logged In With Microsoft', 'Account Manager Mohit Kumar  Logged In With Microsoft ', '-', '103.95.165.24', '2025-03-26 14:38:51', '2025-03-26 14:38:51'),
(426, 1, '2025-03-26', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '171.79.45.75', '2025-03-26 15:37:17', '2025-03-26 15:37:17'),
(427, 1, '2025-03-27', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '103.103.213.217', '2025-03-27 04:59:00', '2025-03-27 04:59:00'),
(428, 1, '2025-03-27', 'client', 19, 'company edited information and edited Officer information. client code :', 'Super Admin System Super Super Admin company edited information and edited Officer information. client code : cli_AND_J &_000015(J & L TURNER LIMITED)', 'updated', '103.103.213.217', '2025-03-27 05:01:07', '2025-03-27 05:01:07'),
(429, 1, '2025-03-27', 'client', 19, 'company edited information and edited Officer information. client code :', 'Super Admin System Super Super Admin company edited information and edited Officer information. client code : cli_AND_H. _000015(H. CAMPBELL LLC)', 'updated', '103.103.213.217', '2025-03-27 05:20:40', '2025-03-27 05:20:40'),
(430, 1, '2025-03-27', 'client', 19, 'company edited information. client code :', 'Super Admin System Super Super Admin company edited information. client code : cli_AND_L P_000015(L P H C LIMITED)', 'updated', '103.103.213.217', '2025-03-27 05:38:11', '2025-03-27 05:38:11'),
(431, 1, '2025-03-27', 'client', 19, 'company edited information and edited Officer information. client code :', 'Super Admin System Super Super Admin company edited information and edited Officer information. client code : cli_AND_H P_000015(H PARKVIEW LTD)', 'updated', '103.103.213.217', '2025-03-27 05:38:55', '2025-03-27 05:38:55'),
(432, 44, '2025-03-27', '-', 0, ' Logged In With Microsoft', 'Management Sachin Daga  Logged In With Microsoft ', '-', '49.36.238.197', '2025-03-27 06:32:07', '2025-03-27 06:32:07'),
(433, 44, '2025-03-27', '-', 0, ' Logged Out', 'Management Sachin Daga  Logged Out ', '-', '49.36.238.197', '2025-03-27 06:32:17', '2025-03-27 06:32:17'),
(434, 1, '2025-03-27', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.45.75', '2025-03-27 12:37:07', '2025-03-27 12:37:07'),
(435, 1, '2025-03-27', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '171.79.45.75', '2025-03-27 12:37:21', '2025-03-27 12:37:21'),
(436, 94, '2025-03-27', '-', 0, ' Logged In', 'Management Vikas Patel  Logged In ', '-', '171.79.45.75', '2025-03-27 12:37:33', '2025-03-27 12:37:33'),
(437, 94, '2025-03-27', '-', 0, ' Logged Out', 'Management Vikas Patel  Logged Out ', '-', '171.79.45.75', '2025-03-27 14:11:56', '2025-03-27 14:11:56'),
(438, 1, '2025-03-27', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.45.75', '2025-03-27 14:12:10', '2025-03-27 14:12:10'),
(439, 94, '2025-03-27', '-', 0, ' Logged In', 'Management Vikas Patel  Logged In ', '-', NULL, '2025-03-27 14:14:10', '2025-03-27 14:14:10'),
(440, 94, '2025-03-27', 'customer', 76, 'created customer profile. customer code :', 'Management Vikas Patel created customer profile. customer code : cust_COA_000057(COAST TO COAST MOTORCYCLES LIMITED_000057)', 'created', '27.59.116.217', '2025-03-27 14:15:50', '2025-03-27 14:15:50'),
(441, 94, '2025-03-27', 'customer', 76, ' edited the service details and added an additional service while editing the customer code :', 'Management Vikas Patel  edited the service details and added an additional service while editing the customer code : cust_COA_000057(COAST TO COAST MOTORCYCLES LIMITED_000057)', 'updated', '27.59.116.217', '2025-03-27 14:16:05', '2025-03-27 14:16:05'),
(442, 94, '2025-03-27', 'customer', 76, 'edited the company information customer code :', 'Management Vikas Patel edited the company information customer code : cust_ASK_000057(ASKL LTD)', 'updated', '27.59.116.217', '2025-03-27 14:17:19', '2025-03-27 14:17:19'),
(443, 94, '2025-03-27', 'customer', 77, 'created customer profile. customer code :', 'Management Vikas Patel created customer profile. customer code : cust_43 _000058(43 AYLESFORD STREET LIMITED)', 'created', '27.59.116.217', '2025-03-27 14:18:25', '2025-03-27 14:18:25'),
(444, 94, '2025-03-27', 'customer', 77, ' edited the service details and added an additional service while editing the customer code :', 'Management Vikas Patel  edited the service details and added an additional service while editing the customer code : cust_43 _000058(43 AYLESFORD STREET LIMITED)', 'updated', '27.59.116.217', '2025-03-27 14:18:41', '2025-03-27 14:18:41'),
(445, 94, '2025-03-27', 'client', 26, 'created client profile. client code :', 'Management Vikas Patel created client profile. client code : cli_ASK_KJ _000022(KJ ACADEMY (NORTH WEST) C.I.C. _000022)', 'created', '27.59.116.217', '2025-03-27 14:19:34', '2025-03-27 14:19:34');
INSERT INTO `staff_logs` (`id`, `staff_id`, `date`, `module_name`, `module_id`, `log_message`, `log_message_all`, `permission_type`, `ip`, `created_at`, `updated_at`) VALUES
(446, 94, '2025-03-27', 'client', 26, 'company edited information. client code :', 'Management Vikas Patel company edited information. client code : cli_ASK_KJ _000022(KJ ACADEMY (NORTH WEST) C.I.C. _000022)', 'updated', '27.59.116.217', '2025-03-27 14:20:00', '2025-03-27 14:20:00'),
(447, 94, '2025-03-27', 'client', 27, 'created client profile. client code :', 'Management Vikas Patel created client profile. client code : cli_ASK_43 _000023(43 AYLESFORD STREET LIMITED)', 'created', '27.59.116.217', '2025-03-27 14:20:24', '2025-03-27 14:20:24'),
(448, 94, '2025-03-27', 'client', 28, 'created client profile. client code :', 'Management Vikas Patel created client profile. client code : cli_ASK_Max_000024(MaxCharacterFieldValidationForTestingPurposeIncludingAlphanumericAndSpecialSymbolsLikeDashAndDot.Max)', 'created', '27.59.116.217', '2025-03-27 14:46:46', '2025-03-27 14:46:46'),
(449, 94, '2025-03-27', 'client', 27, 'edited sole trader information and Officer information. client code :', 'Management Vikas Patel edited sole trader information and Officer information. client code : cli_ASK_43 _000023(43 AYLESFORD STREET LIMITED)', 'updated', '27.59.116.217', '2025-03-27 14:47:11', '2025-03-27 14:47:11'),
(450, 94, '2025-03-27', 'client', 27, 'edited sole trader information. client code :', 'Management Vikas Patel edited sole trader information. client code : cli_ASK_43 _000023(43 AYLESFORD STREET LIMITED)', 'updated', '27.59.116.217', '2025-03-27 14:47:18', '2025-03-27 14:47:18'),
(451, 94, '2025-03-27', 'client', 27, 'edited sole trader information. client code :', 'Management Vikas Patel edited sole trader information. client code : cli_ASK_43 _000023(43 AYLESFORD STREET LIMITED)', 'updated', '27.59.116.217', '2025-03-27 14:47:29', '2025-03-27 14:47:29'),
(452, 94, '2025-03-27', 'client', 27, 'edited sole trader information. client code :', 'Management Vikas Patel edited sole trader information. client code : cli_ASK_43 _000023(43 AYLESFORD STREET LIMITED)', 'updated', '27.59.116.217', '2025-03-27 14:47:42', '2025-03-27 14:47:42'),
(453, 94, '2025-03-27', 'client', 29, 'created client profile. client code :', 'Management Vikas Patel created client profile. client code : cli_ASK_Mer_000025(Merchant’s Haven Ltd.)', 'created', '27.59.116.217', '2025-03-27 14:47:54', '2025-03-27 14:47:54'),
(454, 94, '2025-03-27', 'client', 29, 'edited individual Officer information. client code :', 'Management Vikas Patel edited individual Officer information. client code : cli_ASK_Mer_000025(Merchant’s Haven Ltd.)', 'updated', '27.59.116.217', '2025-03-27 14:48:05', '2025-03-27 14:48:05'),
(455, 94, '2025-03-27', 'client', 30, 'created client profile. client code :', 'Management Vikas Patel created client profile. client code : cli_ASK_Gre_000026(Great Britain Trade Consortium)', 'created', '27.59.116.217', '2025-03-27 14:48:45', '2025-03-27 14:48:45'),
(456, 94, '2025-03-27', 'client', 30, 'edited sole trader information and Officer information. client code :', 'Management Vikas Patel edited sole trader information and Officer information. client code : cli_ASK_Gre_000026(Great Britain Trade Consortiumk)', 'updated', '27.59.116.217', '2025-03-27 14:49:02', '2025-03-27 14:49:02'),
(457, 94, '2025-03-27', '-', 0, ' Logged Out', 'Management Vikas Patel  Logged Out ', '-', '27.59.116.217', '2025-03-27 14:50:26', '2025-03-27 14:50:26'),
(458, 94, '2025-03-27', '-', 0, ' Logged In', 'Management Vikas Patel  Logged In ', '-', '27.59.116.217', '2025-03-27 14:50:36', '2025-03-27 14:50:36'),
(459, 94, '2025-03-27', '-', 0, ' Logged Out', 'Management Vikas Patel  Logged Out ', '-', '27.59.116.217', '2025-03-27 14:55:37', '2025-03-27 14:55:37'),
(460, 34, '2025-03-27', '-', 0, ' Logged In', 'Account Manager vikas for test  Logged In ', '-', '27.59.116.217', '2025-03-27 14:55:57', '2025-03-27 14:55:57'),
(461, 34, '2025-03-27', '-', 0, ' Logged Out', 'Account Manager vikas for test  Logged Out ', '-', '27.59.116.217', '2025-03-27 14:57:26', '2025-03-27 14:57:26'),
(462, 94, '2025-03-27', '-', 0, ' Logged In', 'Management Vikas Patel  Logged In ', '-', '27.59.116.217', '2025-03-27 14:58:44', '2025-03-27 14:58:44'),
(463, 94, '2025-03-27', 'job', 2, 'created job code:', 'Management Vikas Patel created job code: ASK_43 _test_00002', 'created', '27.59.116.217', '2025-03-27 15:01:39', '2025-03-27 15:01:39'),
(464, 94, '2025-03-27', '-', 0, ' Logged Out', 'Management Vikas Patel  Logged Out ', '-', '27.59.116.217', '2025-03-27 15:03:51', '2025-03-27 15:03:51'),
(465, 36, '2025-03-27', '-', 0, ' Logged In', 'Management vikas for testing  Logged In ', '-', '27.59.116.217', '2025-03-27 15:03:58', '2025-03-27 15:03:58'),
(466, 36, '2025-03-27', 'customer', 78, 'created customer profile. customer code :', 'Management vikas for testing created customer profile. customer code : cust_MED_000059(MEDICAL SICKNESS ANNUITY AND LIFE ASSURANCE SOCIETY LIMITED(THE)_000059)', 'created', '27.59.116.217', '2025-03-27 15:04:41', '2025-03-27 15:04:41'),
(467, 36, '2025-03-27', 'customer', 78, ' edited the service details and added an additional service while editing the customer code :', 'Management vikas for testing  edited the service details and added an additional service while editing the customer code : cust_MED_000059(MEDICAL SICKNESS ANNUITY AND LIFE ASSURANCE SOCIETY LIMITED(THE)_000059)', 'updated', '27.59.116.217', '2025-03-27 15:05:05', '2025-03-27 15:05:05'),
(468, 36, '2025-03-27', '-', 0, ' Logged Out', 'Management vikas for testing  Logged Out ', '-', '27.59.116.217', '2025-03-27 15:07:30', '2025-03-27 15:07:30'),
(469, 55, '2025-03-27', '-', 0, ' Logged In', 'Management Elakkya Vikas  Logged In ', '-', '27.59.116.217', '2025-03-27 15:07:30', '2025-03-27 15:07:36'),
(470, 55, '2025-03-27', '-', 0, ' Logged In', 'Management Elakkya Vikas  Logged In ', '-', '27.59.116.217', '2025-03-27 15:07:37', '2025-03-27 15:07:37'),
(471, 55, '2025-03-27', '-', 0, ' Logged In', 'Management Elakkya Vikas  Logged In ', '-', '27.59.116.217', '2025-03-27 15:07:37', '2025-03-27 15:07:37'),
(472, 55, '2025-03-27', '-', 0, ' Logged In', 'Management Elakkya Vikas  Logged In ', '-', '27.59.116.217', '2025-03-27 15:07:37', '2025-03-27 15:07:37'),
(473, 55, '2025-03-27', '-', 0, ' Logged In', 'Management Elakkya Vikas  Logged In ', '-', '27.59.116.217', '2025-03-27 15:07:37', '2025-03-27 15:07:37'),
(474, 55, '2025-03-27', '-', 0, ' Logged Out', 'Management Elakkya Vikas  Logged Out ', '-', '27.59.116.217', '2025-03-27 15:08:18', '2025-03-27 15:08:18'),
(475, 44, '2025-03-27', '-', 0, ' Logged In', 'Management Sachin Daga  Logged In ', '-', '27.59.116.217', '2025-03-27 15:08:27', '2025-03-27 15:08:27'),
(476, 44, '2025-03-27', '-', 0, ' Logged Out', 'Management Sachin Daga  Logged Out ', '-', '27.59.116.217', '2025-03-27 15:10:10', '2025-03-27 15:10:10'),
(477, 45, '2025-03-27', '-', 0, ' Logged In', 'Management Anushree R  Logged In ', '-', '27.59.116.217', '2025-03-27 15:10:16', '2025-03-27 15:10:16'),
(478, 45, '2025-03-27', '-', 0, ' Logged Out', 'Management Anushree R  Logged Out ', '-', '27.59.116.217', '2025-03-27 15:13:04', '2025-03-27 15:13:04'),
(479, 1, '2025-03-27', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '171.79.45.75', '2025-03-27 15:13:54', '2025-03-27 15:13:54'),
(480, 1, '2025-03-27', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.45.75', '2025-03-27 15:16:40', '2025-03-27 15:16:40'),
(481, 34, '2025-03-27', '-', 0, ' Logged In', 'Account Manager vikas for test  Logged In ', '-', '27.59.116.217', '2025-03-27 15:17:19', '2025-03-27 15:17:19'),
(482, 34, '2025-03-27', '-', 0, ' Logged Out', 'Account Manager vikas for test  Logged Out ', '-', '27.59.116.217', '2025-03-27 15:20:56', '2025-03-27 15:20:56'),
(483, 35, '2025-03-27', '-', 0, ' Logged In', 'Processor vikas for test2  Logged In ', '-', '27.59.116.217', '2025-03-27 15:31:52', '2025-03-27 15:31:52'),
(484, 35, '2025-03-27', '-', 0, ' Logged Out', 'Processor vikas for test2  Logged Out ', '-', '27.59.116.217', '2025-03-27 15:33:32', '2025-03-27 15:33:32'),
(485, 61, '2025-03-27', '-', 0, ' Logged In', 'Account Manager Nishtha Jain  Logged In ', '-', '27.59.116.217', '2025-03-27 15:35:34', '2025-03-27 15:35:34'),
(486, 61, '2025-03-27', '-', 0, ' Logged Out', 'Account Manager Nishtha Jain  Logged Out ', '-', '27.59.116.217', '2025-03-27 15:42:05', '2025-03-27 15:42:05'),
(487, 34, '2025-03-27', '-', 0, ' Logged In', 'Account Manager vikas for test  Logged In ', '-', '27.59.116.217', '2025-03-27 15:42:27', '2025-03-27 15:42:27'),
(488, 34, '2025-03-27', 'customer', 79, 'created customer profile. customer code :', 'Account Manager vikas for test created customer profile. customer code : cust_M L_000060(M LIMITED_000060)', 'created', '27.59.116.217', '2025-03-27 15:43:41', '2025-03-27 15:43:41'),
(489, 34, '2025-03-27', 'customer', 79, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager vikas for test  edited the service details and added an additional service while editing the customer code : cust_M L_000060(M LIMITED_000060)', 'updated', '27.59.116.217', '2025-03-27 15:43:46', '2025-03-27 15:43:46'),
(490, 34, '2025-03-27', '-', 0, ' Logged Out', 'Account Manager vikas for test  Logged Out ', '-', '27.59.116.217', '2025-03-27 15:47:53', '2025-03-27 15:47:53'),
(491, 94, '2025-03-27', '-', 0, ' Logged In', 'Management Vikas Patel  Logged In ', '-', '27.59.116.217', '2025-03-27 15:48:04', '2025-03-27 15:48:04'),
(492, 1, '2025-03-28', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-03-28 05:58:41', '2025-03-28 05:58:41'),
(493, 1, '2025-03-28', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', NULL, '2025-03-28 05:59:31', '2025-03-28 05:59:31'),
(494, 94, '2025-03-28', '-', 0, ' Logged In', 'Management Vikas Patel  Logged In ', '-', NULL, '2025-03-28 05:59:44', '2025-03-28 05:59:44'),
(495, 1, '2025-03-28', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-03-28 06:03:55', '2025-03-28 06:03:55'),
(496, 94, '2025-03-28', '-', 0, ' Logged Out', 'Management Vikas Patel  Logged Out ', '-', '122.168.114.106', '2025-03-28 07:04:31', '2025-03-28 07:04:31'),
(497, 1, '2025-03-28', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.116.217', '2025-03-28 10:52:41', '2025-03-28 10:52:41'),
(498, 1, '2025-03-28', 'task', 0, 'created task account update,', 'Super Admin System Super Super Admin created task account update, ', 'created', '27.59.116.153', '2025-03-28 11:18:14', '2025-03-28 11:18:14'),
(499, 1, '2025-03-28', 'customer', 79, 'edited the company information customer code :', 'Super Admin System Super Super Admin edited the company information customer code : cust_M L_000060(M LIMITED_000060)', 'updated', '27.59.116.153', '2025-03-28 11:20:24', '2025-03-28 11:20:24'),
(500, 1, '2025-03-28', 'customer contact person role', 1, 'created customer contact person role Accountant', 'Super Admin System Super Super Admin created customer contact person role Accountant ', 'created', '27.59.116.153', '2025-03-28 11:21:23', '2025-03-28 11:21:23'),
(501, 1, '2025-03-28', 'customer contact person role', 2, 'created customer contact person role Client Manager', 'Super Admin System Super Super Admin created customer contact person role Client Manager ', 'created', '27.59.116.153', '2025-03-28 11:21:35', '2025-03-28 11:21:35'),
(502, 1, '2025-03-28', 'customer contact person role', 3, 'created customer contact person role Partner', 'Super Admin System Super Super Admin created customer contact person role Partner ', 'created', '27.59.116.153', '2025-03-28 11:21:43', '2025-03-28 11:21:43'),
(503, 1, '2025-03-28', 'customer contact person role', 4, 'created customer contact person role Bookkepper', 'Super Admin System Super Super Admin created customer contact person role Bookkepper ', 'created', '27.59.116.153', '2025-03-28 11:21:53', '2025-03-28 11:21:53'),
(504, 1, '2025-03-28', 'customer contact person role', 4, 'edited customer contact person role Bookkeeper', 'Super Admin System Super Super Admin edited customer contact person role Bookkeeper ', 'updated', '27.59.116.153', '2025-03-28 11:22:12', '2025-03-28 11:22:12'),
(505, 1, '2025-03-28', 'customer contact person role', 5, 'created customer contact person role Other', 'Super Admin System Super Super Admin created customer contact person role Other ', 'created', '27.59.116.153', '2025-03-28 11:22:20', '2025-03-28 11:22:20'),
(506, 34, '2025-03-28', '-', 0, ' Logged In', 'Account Manager vikas for test  Logged In ', '-', NULL, '2025-03-28 11:27:05', '2025-03-28 11:27:05'),
(507, 34, '2025-03-28', '-', 0, ' Logged Out', 'Account Manager vikas for test  Logged Out ', '-', NULL, '2025-03-28 11:27:20', '2025-03-28 11:27:20'),
(508, 41, '2025-03-28', '-', 0, ' Logged In', 'Support Hemant Mehta  Logged In ', '-', NULL, '2025-03-28 11:27:25', '2025-03-28 11:27:25'),
(509, 41, '2025-03-28', '-', 0, ' Logged Out', 'Support Hemant Mehta  Logged Out ', '-', NULL, '2025-03-28 11:27:52', '2025-03-28 11:27:52'),
(510, 55, '2025-03-28', '-', 0, ' Logged In', 'Management Elakkya Vikas  Logged In ', '-', NULL, '2025-03-28 11:27:59', '2025-03-28 11:27:59'),
(511, 44, '2025-03-29', '-', 0, ' Logged In With Microsoft', 'Management Sachin Daga  Logged In With Microsoft ', '-', '49.36.238.53', '2025-03-29 02:47:20', '2025-03-29 02:47:20'),
(512, 44, '2025-03-29', '-', 0, ' Logged Out', 'Management Sachin Daga  Logged Out ', '-', '49.36.238.53', '2025-03-29 02:47:33', '2025-03-29 02:47:33'),
(513, 1, '2025-03-29', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-03-29 12:21:45', '2025-03-29 12:21:45'),
(514, 2, '2025-03-29', '-', 0, ' Logged In With Microsoft', 'Super Admin Amit Agarwal  Logged In With Microsoft ', '-', NULL, '2025-03-29 13:38:19', '2025-03-29 13:38:19'),
(515, 2, '2025-03-29', 'job types', 2, 'created job types VAT Review', 'Super Admin Amit Agarwal created job types VAT Review ', 'created', NULL, '2025-03-29 13:38:40', '2025-03-29 13:38:40'),
(516, 2, '2025-03-29', 'job types', 3, 'created job types VAT Preparation', 'Super Admin Amit Agarwal created job types VAT Preparation ', 'created', NULL, '2025-03-29 13:38:55', '2025-03-29 13:38:55'),
(517, 2, '2025-03-29', 'job types', 4, 'created job types VAT Submission', 'Super Admin Amit Agarwal created job types VAT Submission ', 'created', NULL, '2025-03-29 13:39:17', '2025-03-29 13:39:17'),
(518, 2, '2025-03-29', 'task', 0, 'created task Review & FIle,', 'Super Admin Amit Agarwal created task Review & FIle, ', 'created', NULL, '2025-03-29 13:40:26', '2025-03-29 13:40:26'),
(519, 2, '2025-03-29', 'task', 0, 'created task Prepare, Review & File,', 'Super Admin Amit Agarwal created task Prepare, Review & File, ', 'created', NULL, '2025-03-29 13:40:40', '2025-03-29 13:40:40'),
(520, 2, '2025-03-29', 'task', 0, 'created task File,', 'Super Admin Amit Agarwal created task File, ', 'created', NULL, '2025-03-29 13:40:55', '2025-03-29 13:40:55'),
(521, 2, '2025-03-29', 'job types', 5, 'created job types Prepare and File Confirmation Statement', 'Super Admin Amit Agarwal created job types Prepare and File Confirmation Statement ', 'created', NULL, '2025-03-29 13:41:52', '2025-03-29 13:41:52'),
(522, 2, '2025-03-29', 'job types', 6, 'created job types Basic P&L', 'Super Admin Amit Agarwal created job types Basic P&L ', 'created', NULL, '2025-03-29 13:42:07', '2025-03-29 13:42:07'),
(523, 2, '2025-03-29', 'job types', 7, 'created job types Detailed Management Accounts', 'Super Admin Amit Agarwal created job types Detailed Management Accounts ', 'created', NULL, '2025-03-29 13:42:20', '2025-03-29 13:42:20'),
(524, 2, '2025-03-29', 'job types', 8, 'created job types Full Management Accounts with Report', 'Super Admin Amit Agarwal created job types Full Management Accounts with Report ', 'created', NULL, '2025-03-29 13:42:40', '2025-03-29 13:42:40'),
(525, 2, '2025-03-29', 'job types', 9, 'created job types Support', 'Super Admin Amit Agarwal created job types Support ', 'created', NULL, '2025-03-29 13:43:04', '2025-03-29 13:43:04'),
(526, 2, '2025-03-29', 'job types', 10, 'created job types PTR for Individuals & Directors', 'Super Admin Amit Agarwal created job types PTR for Individuals & Directors ', 'created', NULL, '2025-03-29 13:43:40', '2025-03-29 13:43:40'),
(527, 2, '2025-03-29', 'job types', 11, 'created job types PTR for Landlords', 'Super Admin Amit Agarwal created job types PTR for Landlords ', 'created', NULL, '2025-03-29 13:43:52', '2025-03-29 13:43:52'),
(528, 2, '2025-03-29', 'job types', 12, 'created job types PTR for Sole Traders', 'Super Admin Amit Agarwal created job types PTR for Sole Traders ', 'created', NULL, '2025-03-29 13:44:16', '2025-03-29 13:44:16'),
(529, 2, '2025-03-29', 'job types', 13, 'created job types PTR for Parterships', 'Super Admin Amit Agarwal created job types PTR for Parterships ', 'created', NULL, '2025-03-29 13:44:27', '2025-03-29 13:44:27'),
(530, 2, '2025-03-29', 'job types', 14, 'created job types Payroll', 'Super Admin Amit Agarwal created job types Payroll ', 'created', NULL, '2025-03-29 13:44:46', '2025-03-29 13:44:46'),
(531, 2, '2025-03-29', 'job types', 15, 'created job types Full Bookkeeping', 'Super Admin Amit Agarwal created job types Full Bookkeeping ', 'created', NULL, '2025-03-29 13:45:49', '2025-03-29 13:45:49'),
(532, 2, '2025-03-29', 'job types', 16, 'created job types Only Bank Reco', 'Super Admin Amit Agarwal created job types Only Bank Reco ', 'created', NULL, '2025-03-29 13:45:57', '2025-03-29 13:45:57'),
(533, 2, '2025-03-29', 'job types', 17, 'created job types Bookkeeping including VAT Reco', 'Super Admin Amit Agarwal created job types Bookkeeping including VAT Reco ', 'created', NULL, '2025-03-29 13:46:19', '2025-03-29 13:46:19'),
(534, 2, '2025-03-29', 'job types', 15, 'changes the job types status Deactivate Bookkeeping including VAT Return', 'Super Admin Amit Agarwal changes the job types status Deactivate Bookkeeping including VAT Return ', 'updated', NULL, '2025-03-29 13:46:38', '2025-03-29 13:46:38'),
(535, 2, '2025-03-29', 'job types', 18, 'created job types Bookkeeping excluding VAT', 'Super Admin Amit Agarwal created job types Bookkeeping excluding VAT ', 'created', NULL, '2025-03-29 13:46:47', '2025-03-29 13:46:47'),
(536, 2, '2025-03-29', 'job types', 17, 'changes the job types status Deactivate Bookkeeping including VAT Return & VAT Reco', 'Super Admin Amit Agarwal changes the job types status Deactivate Bookkeeping including VAT Return & VAT Reco ', 'updated', NULL, '2025-03-29 13:47:12', '2025-03-29 13:47:12'),
(537, 2, '2025-03-29', 'job types', 19, 'created job types Bookkeeping including VAT Reco and PAYE Reco', 'Super Admin Amit Agarwal created job types Bookkeeping including VAT Reco and PAYE Reco ', 'created', NULL, '2025-03-29 13:47:28', '2025-03-29 13:47:28'),
(538, 2, '2025-03-29', 'job types', 20, 'created job types Bookkeeping including VAT Reco, PAYE Reco and FAR', 'Super Admin Amit Agarwal created job types Bookkeeping including VAT Reco, PAYE Reco and FAR ', 'created', NULL, '2025-03-29 13:47:50', '2025-03-29 13:47:50'),
(539, 2, '2025-03-29', 'job types', 21, 'created job types Working Papers Preparation Only', 'Super Admin Amit Agarwal created job types Working Papers Preparation Only ', 'created', NULL, '2025-03-29 13:48:21', '2025-03-29 13:48:21'),
(540, 2, '2025-03-29', 'job types', 22, 'created job types Working Papers and Draft Accounts', 'Super Admin Amit Agarwal created job types Working Papers and Draft Accounts ', 'created', NULL, '2025-03-29 13:48:40', '2025-03-29 13:48:40'),
(541, 2, '2025-03-29', 'job types', 23, 'created job types Working Papers, Draft Accounts and Filing', 'Super Admin Amit Agarwal created job types Working Papers, Draft Accounts and Filing ', 'created', NULL, '2025-03-29 13:49:03', '2025-03-29 13:49:03'),
(542, 2, '2025-03-29', 'job types', 24, 'created job types Working Papers, Draft Accounts, Filing and OB Adjustments', 'Super Admin Amit Agarwal created job types Working Papers, Draft Accounts, Filing and OB Adjustments ', 'created', NULL, '2025-03-29 13:49:32', '2025-03-29 13:49:32'),
(543, 2, '2025-03-29', 'client', 31, 'created client profile. client code :', 'Super Admin Amit Agarwal created client profile. client code : cli_M L_ABC_000027(ABCD Trading)', 'created', NULL, '2025-03-29 13:52:16', '2025-03-29 13:52:16'),
(544, 2, '2025-03-29', 'job', 3, 'created job code:', 'Super Admin Amit Agarwal created job code: M L_ABC_PTR _00003', 'created', NULL, '2025-03-29 13:53:48', '2025-03-29 13:53:48'),
(545, 1, '2025-03-29', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.116.153', '2025-03-29 13:56:34', '2025-03-29 13:56:34'),
(546, 1, '2025-03-29', 'job', 1, 'deletes job code:', 'Super Admin System Super Super Admin deletes job code: AND_H P_test_00001', 'deleted', '27.59.116.153', '2025-03-29 13:58:04', '2025-03-29 13:58:04'),
(547, 1, '2025-03-29', 'staff', 94, 'edited staff Vikas Patel', 'Super Admin System Super Super Admin edited staff Vikas Patel ', 'updated', '27.59.116.153', '2025-03-29 13:58:44', '2025-03-29 13:58:44'),
(548, 94, '2025-03-29', '-', 0, ' Logged In', 'Admin Vikas Patel  Logged In ', '-', NULL, '2025-03-29 14:01:12', '2025-03-29 14:01:12'),
(549, 94, '2025-03-29', 'job', 2, 'deletes job code:', 'Admin Vikas Patel deletes job code: ASK_43 _test_00002', 'deleted', NULL, '2025-03-29 14:02:24', '2025-03-29 14:02:24'),
(550, 94, '2025-03-29', 'job', 4, 'created job code:', 'Admin Vikas Patel created job code: ASK_43 _Supp_00004', 'created', NULL, '2025-03-29 14:03:44', '2025-03-29 14:03:44'),
(551, 1, '2025-03-29', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (customer-insert, customer-update, customer-delete, customer-view, status-insert, status-update, status-delete, status-view, staff-insert, staff-update, staff-delete, staff-view, client-insert, client-update, client-delete, client-view, job-insert, job-update, job-delete, job-view, setting-insert, setting-update, setting-delete, setting-view, timesheet-insert, timesheet-update, timesheet-delete, timesheet-view, report-insert, report-update, report-delete, report-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (customer-insert, customer-update, customer-delete, customer-view, status-insert, status-update, status-delete, status-view, staff-insert, staff-update, staff-delete, staff-view, client-insert, client-update, client-delete, client-view, job-insert, job-update, job-delete, job-view, setting-insert, setting-update, setting-delete, setting-view, timesheet-insert, timesheet-update, timesheet-delete, timesheet-view, report-insert, report-update, report-delete, report-view)  ', 'updated', '171.79.37.91', '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(552, 94, '2025-03-29', 'staff', 95, 'created staff Dummy Test', 'Admin Vikas Patel created staff Dummy Test ', 'created', '171.79.37.91', '2025-03-29 14:59:52', '2025-03-29 14:59:52'),
(553, 94, '2025-03-29', '-', 0, ' Logged Out', 'Admin Vikas Patel  Logged Out ', '-', '171.79.37.91', '2025-03-29 15:00:45', '2025-03-29 15:00:45'),
(554, 95, '2025-03-29', '-', 0, ' Logged In', 'Admin Dummy Test  Logged In ', '-', '171.79.37.91', '2025-03-29 15:00:54', '2025-03-29 15:00:54'),
(555, 1, '2025-03-29', 'staff', 94, 'edited staff Vikas Patel', 'Super Admin System Super Super Admin edited staff Vikas Patel ', 'updated', '171.79.37.91', '2025-03-29 15:17:05', '2025-03-29 15:17:05'),
(556, 95, '2025-03-29', '-', 0, ' Logged Out', NULL, '-', '171.79.37.91', '2025-03-29 15:17:42', '2025-03-29 15:17:42'),
(557, 94, '2025-03-29', '-', 0, ' Logged In', 'Account Manager Vikas Patel  Logged In ', '-', '171.79.37.91', '2025-03-29 15:17:53', '2025-03-29 15:17:53'),
(558, 1, '2025-03-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-03-30 10:21:32', '2025-03-30 10:21:32'),
(559, 94, '2025-03-30', '-', 0, ' Logged In', 'Account Manager Vikas Patel  Logged In ', '-', NULL, '2025-03-30 10:29:56', '2025-03-30 10:29:56'),
(560, 94, '2025-03-30', '-', 0, ' Logged Out', 'Account Manager Vikas Patel  Logged Out ', '-', '103.185.243.119', '2025-03-30 10:32:30', '2025-03-30 10:32:30'),
(561, 94, '2025-03-30', '-', 0, ' Logged In', 'Account Manager Vikas Patel  Logged In ', '-', '103.185.243.119', '2025-03-30 10:32:43', '2025-03-30 10:32:43'),
(562, 1, '2025-03-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '103.185.243.189', '2025-03-30 11:46:37', '2025-03-30 11:46:37'),
(563, 1, '2025-03-30', 'services', 9, 'created services Demo', 'Super Admin System Super Super Admin created services Demo ', 'created', '103.185.243.189', '2025-03-30 11:48:08', '2025-03-30 11:48:08'),
(564, 1, '2025-03-30', 'job_types', 25, 'created job type Demo', 'Super Admin System Super Super Admin created job type Demo ', 'created', '103.185.243.189', '2025-03-30 11:48:08', '2025-03-30 11:48:08'),
(565, 1, '2025-03-30', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '110.227.55.53', '2025-03-30 11:50:31', '2025-03-30 11:50:31'),
(566, 1, '2025-03-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.55.53', '2025-03-30 11:50:34', '2025-03-30 11:50:34'),
(567, 1, '2025-03-30', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '110.227.55.53', '2025-03-30 11:51:07', '2025-03-30 11:51:07'),
(568, 1, '2025-03-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.55.53', '2025-03-30 11:52:09', '2025-03-30 11:52:09'),
(569, 1, '2025-03-30', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '110.227.55.53', '2025-03-30 11:52:42', '2025-03-30 11:52:42'),
(570, 1, '2025-03-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.55.53', '2025-03-30 11:53:00', '2025-03-30 11:53:00'),
(571, 1, '2025-03-30', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '110.227.55.53', '2025-03-30 11:53:36', '2025-03-30 11:53:36'),
(572, 1, '2025-03-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.55.53', '2025-03-30 11:53:54', '2025-03-30 11:53:54'),
(573, 1, '2025-03-30', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '110.227.55.53', '2025-03-30 11:54:45', '2025-03-30 11:54:45'),
(574, 1, '2025-03-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.55.53', '2025-03-30 11:54:49', '2025-03-30 11:54:49'),
(575, 1, '2025-03-30', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '110.227.55.53', '2025-03-30 11:55:23', '2025-03-30 11:55:24'),
(576, 1, '2025-03-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.55.53', '2025-03-30 11:55:45', '2025-03-30 11:55:45'),
(577, 1, '2025-03-30', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '110.227.55.53', '2025-03-30 11:56:54', '2025-03-30 11:56:54'),
(578, 1, '2025-03-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.55.53', '2025-03-30 11:57:12', '2025-03-30 11:57:12'),
(579, 1, '2025-03-30', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '110.227.55.53', '2025-03-30 11:57:36', '2025-03-30 11:57:36'),
(580, 1, '2025-03-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.55.53', '2025-03-30 11:57:49', '2025-03-30 11:57:49'),
(581, 1, '2025-03-30', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '110.227.55.53', '2025-03-30 12:01:58', '2025-03-30 12:01:58'),
(582, 1, '2025-03-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.55.53', '2025-03-30 12:02:33', '2025-03-30 12:02:33'),
(583, 1, '2025-03-30', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '110.227.55.53', '2025-03-30 12:04:23', '2025-03-30 12:04:23'),
(584, 1, '2025-03-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.55.53', '2025-03-30 12:04:28', '2025-03-30 12:04:28'),
(585, 1, '2025-03-30', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '110.227.55.53', '2025-03-30 12:13:19', '2025-03-30 12:13:19'),
(586, 1, '2025-03-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.55.53', '2025-03-30 12:14:26', '2025-03-30 12:14:26'),
(587, 1, '2025-03-30', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '110.227.55.53', '2025-03-30 12:14:54', '2025-03-30 12:14:54'),
(588, 1, '2025-03-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.55.53', '2025-03-30 12:31:12', '2025-03-30 12:31:12'),
(589, 1, '2025-03-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.39.91', '2025-03-30 14:05:32', '2025-03-30 14:05:32'),
(590, 1, '2025-03-30', 'client', 32, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_M L_tes_000028(teststesttest)', 'created', '110.227.59.250', '2025-03-30 14:13:18', '2025-03-30 14:13:18'),
(591, 1, '2025-03-30', 'client', 33, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_MED_B.S_000029(B.S.N.V. LIMITED_000029)', 'created', '110.227.59.250', '2025-03-30 14:20:56', '2025-03-30 14:20:56'),
(592, 1, '2025-03-30', 'client', 34, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_MED_IJ _000030(IJ ACHARA CONSULTANCY LTD_000030)', 'created', '110.227.59.250', '2025-03-30 14:22:30', '2025-03-30 14:22:30'),
(593, 1, '2025-03-30', 'job', 5, 'created job code:', 'Super Admin System Super Super Admin created job code: MED_B.S_Supp_00005', 'created', '110.227.59.250', '2025-03-30 14:23:38', '2025-03-30 14:23:38'),
(594, 1, '2025-03-30', 'client', 35, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_43 _MH _000031(MH LIMITED_000031)', 'created', '110.227.59.250', '2025-03-30 14:29:41', '2025-03-30 14:29:41'),
(595, 1, '2025-03-30', 'services', 10, 'created services Vikas test', 'Super Admin System Super Super Admin created services Vikas test ', 'created', '110.227.59.250', '2025-03-30 14:33:31', '2025-03-30 14:33:31'),
(596, 1, '2025-03-30', 'job_types', 26, 'created job type Vikas test', 'Super Admin System Super Super Admin created job type Vikas test ', 'created', '110.227.59.250', '2025-03-30 14:33:31', '2025-03-30 14:33:31'),
(597, 1, '2025-03-30', 'customer', 80, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_ANT_000061(ANTICUS RECRUITMENT LTD_000061)', 'created', '110.227.59.250', '2025-03-30 14:34:09', '2025-03-30 14:34:09'),
(598, 1, '2025-03-30', 'customer', 80, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_ANT_000061(ANTICUS RECRUITMENT LTD_000061)', 'updated', '110.227.59.250', '2025-03-30 14:34:51', '2025-03-30 14:34:51'),
(599, 1, '2025-03-30', 'client', 36, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_ANT_GF _000032(GF ABERNETHY ENERGY LTD_000032)', 'created', '110.227.59.250', '2025-03-30 14:35:32', '2025-03-30 14:35:32'),
(600, 1, '2025-03-30', 'job', 6, 'created job code:', 'Super Admin System Super Super Admin created job code: ANT_GF _Vika_00006', 'created', '110.227.59.250', '2025-03-30 14:35:52', '2025-03-30 14:35:52'),
(601, 1, '2025-03-30', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '110.227.51.250', '2025-03-30 14:42:53', '2025-03-30 14:42:53'),
(602, 1, '2025-03-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.51.250', '2025-03-30 14:43:08', '2025-03-30 14:43:08'),
(603, 1, '2025-03-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-03-30 15:35:27', '2025-03-30 15:35:27'),
(604, 1, '2025-03-30', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '103.185.243.189', '2025-03-30 15:49:26', '2025-03-30 15:49:26'),
(605, 1, '2025-03-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '103.185.243.189', '2025-03-30 15:49:28', '2025-03-30 15:49:28'),
(606, 1, '2025-03-30', 'permission', 9, ' updated the access for SUPPORT. Access Changes  Remove Permission (timesheet-view)', 'Super Admin System Super Super Admin  updated the access for SUPPORT. Access Changes  Remove Permission (timesheet-view) ', 'updated', '27.59.125.67', '2025-03-30 15:49:48', '2025-03-30 15:49:48'),
(607, 1, '2025-03-30', 'permission', 9, ' updated the access for SUPPORT. Access Changes Add Permission (timesheet-view) ', 'Super Admin System Super Super Admin  updated the access for SUPPORT. Access Changes Add Permission (timesheet-view)  ', 'updated', '27.59.125.67', '2025-03-30 15:50:09', '2025-03-30 15:50:09'),
(608, 47, '2025-03-31', '-', 0, ' Logged In With Microsoft', 'Account Manager Tushar Sharma  Logged In With Microsoft ', '-', '152.58.125.6', '2025-03-31 06:02:11', '2025-03-31 06:02:11'),
(609, 44, '2025-03-31', '-', 0, ' Logged In With Microsoft', 'Management Sachin Daga  Logged In With Microsoft ', '-', '49.36.238.53', '2025-03-31 06:02:24', '2025-03-31 06:02:24'),
(610, 44, '2025-03-31', '-', 0, ' Logged Out', 'Management Sachin Daga  Logged Out ', '-', '49.36.238.249', '2025-03-31 06:02:31', '2025-03-31 06:02:31'),
(611, 10, '2025-03-31', '-', 0, ' Logged In With Microsoft', 'Account Manager Abhishek Mangal  Logged In With Microsoft ', '-', '103.208.68.108', '2025-03-31 06:03:50', '2025-03-31 06:03:50'),
(612, 53, '2025-03-31', '-', 0, ' Logged In With Microsoft', 'Account Manager Vivek Singh  Logged In With Microsoft ', '-', '103.55.90.20', '2025-03-31 06:12:18', '2025-03-31 06:12:19'),
(613, 10, '2025-03-31', 'job', 7, 'created job code:', 'Account Manager Abhishek Mangal created job code: GOW_PIN_Deta_00007', 'created', '103.208.68.108', '2025-03-31 06:13:45', '2025-03-31 06:13:45'),
(614, 47, '2025-03-31', 'job', 8, 'created job code:', 'Account Manager Tushar Sharma created job code: LD _DON_Work_00008', 'created', '152.56.65.201', '2025-03-31 06:15:16', '2025-03-31 06:15:16'),
(615, 10, '2025-03-31', 'job', 7, 'Sent and completed the missing logs for job code:', 'Account Manager Abhishek Mangal Sent and completed the missing logs for job code: GOW_PIN_Deta_00007', 'created', '103.208.68.108', '2025-03-31 06:18:36', '2025-03-31 06:18:36'),
(616, 10, '2025-03-31', 'job', 7, 'sent the draft for job code:', 'Account Manager Abhishek Mangal sent the draft for job code: GOW_PIN_Deta_00007', 'created', '103.208.68.108', '2025-03-31 06:19:09', '2025-03-31 06:19:09'),
(617, 46, '2025-03-31', '-', 0, ' Logged In With Microsoft', 'Account Manager Lalita Pal  Logged In With Microsoft ', '-', '43.248.153.153', '2025-03-31 06:23:03', '2025-03-31 06:23:03'),
(618, 49, '2025-03-31', '-', 0, ' Logged In With Microsoft', 'Processor Utsav Taneja  Logged In With Microsoft ', '-', NULL, '2025-03-31 06:34:16', '2025-03-31 06:34:16'),
(619, 49, '2025-03-31', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2025-03-17, Hours : 6:05 ,Job code:GOW_PIN_Deta_00007, Task name:Working paper - Jackie Format and Task type:Internal,  Date: 2025-03-17, Hours : 1:05 ,Job code:Training, Task name:Accounts Production', 'Processor Utsav Taneja created a timesheet entry. Task type:External,  Date: 2025-03-17, Hours : 6:05 ,Job code:GOW_PIN_Deta_00007, Task name:Working paper - Jackie Format and Task type:Internal,  Date: 2025-03-17, Hours : 1:05 ,Job code:Training, Task name:Accounts Production ', 'updated', '0.0.0.0', '2025-03-31 06:38:35', '2025-03-31 06:38:35'),
(620, 49, '2025-03-31', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2025-03-17, Hours : 6:50 ,Job code:GOW_PIN_Deta_00007, Task name:Working paper - Jackie Format, Task type:Internal,  Date: 2025-03-17, Hours : 1:50 ,Job code:Training, Task name:Accounts Production, deleted a timesheet entry. Task type:Internal ,Job code:Training, Task name:Accounts Production and Task type:External ,Job code:GOW_PIN_Deta_00007, Task name:Working paper - Jackie Format', 'Processor Utsav Taneja created a timesheet entry. Task type:External,  Date: 2025-03-17, Hours : 6:50 ,Job code:GOW_PIN_Deta_00007, Task name:Working paper - Jackie Format, Task type:Internal,  Date: 2025-03-17, Hours : 1:50 ,Job code:Training, Task name:Accounts Production, deleted a timesheet entry. Task type:Internal ,Job code:Training, Task name:Accounts Production and Task type:External ,Job code:GOW_PIN_Deta_00007, Task name:Working paper - Jackie Format ', 'updated', '0.0.0.0', '2025-03-31 06:39:36', '2025-03-31 06:39:36'),
(621, 49, '2025-03-31', 'timesheet', 0, 'submitted a timesheet entry. Task type:External,  ,Job code:GOW_PIN_Deta_00007, Task name:Working paper - Jackie Format and Task type:Internal,  ,Job code:Training, Task name:Accounts Production', 'Processor Utsav Taneja submitted a timesheet entry. Task type:External,  ,Job code:GOW_PIN_Deta_00007, Task name:Working paper - Jackie Format and Task type:Internal,  ,Job code:Training, Task name:Accounts Production ', 'updated', '0.0.0.0', '2025-03-31 06:40:34', '2025-03-31 06:40:34'),
(622, 60, '2025-03-31', '-', 0, ' Logged In With Microsoft', 'Account Manager Mohit Kumar  Logged In With Microsoft ', '-', '103.95.165.24', '2025-03-31 06:43:22', '2025-03-31 06:43:22'),
(623, 60, '2025-03-31', 'job', 9, 'created job code:', 'Account Manager Mohit Kumar created job code: AST_BP _Work_00009', 'created', '103.95.165.24', '2025-03-31 06:51:23', '2025-03-31 06:51:23'),
(624, 50, '2025-03-31', '-', 0, ' Logged In With Microsoft', 'Account Manager Deepak Singh  Logged In With Microsoft ', '-', '205.254.171.71', '2025-03-31 08:40:08', '2025-03-31 08:40:08'),
(625, 50, '2025-03-31', 'customer', 21, 'edited the company information customer code :', 'Account Manager Deepak Singh edited the company information customer code : cust_Cle_000012(Clear Group_000012)', 'updated', '205.254.171.127', '2025-03-31 08:45:37', '2025-03-31 08:45:37'),
(626, 1, '2025-03-31', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-03-31 10:29:34', '2025-03-31 10:29:34'),
(627, 1, '2025-03-31', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-03-31 11:05:57', '2025-03-31 11:05:57'),
(628, 1, '2025-03-31', 'staff', 94, 'edited staff Vikas Patel', 'Super Admin System Super Super Admin edited staff Vikas Patel ', 'updated', '110.227.63.170', '2025-03-31 11:06:17', '2025-03-31 11:06:17'),
(629, 7, '2025-03-31', '-', 0, ' Logged In With Microsoft', 'Account Manager Abhishek Singh  Logged In With Microsoft ', '-', '122.176.134.210', '2025-03-31 13:51:59', '2025-03-31 13:51:59'),
(630, 7, '2025-03-31', 'job', 10, 'created job code:', 'Account Manager Abhishek Singh created job code: TAG_The_Work_000010', 'created', '122.176.134.210', '2025-03-31 13:55:55', '2025-03-31 13:55:55'),
(631, 2, '2025-03-31', '-', 0, ' Logged In With Microsoft', 'Super Admin Amit Agarwal  Logged In With Microsoft ', '-', '81.105.113.91', '2025-03-31 15:06:34', '2025-03-31 15:06:34'),
(632, 7, '2025-04-01', '-', 0, ' Logged In With Microsoft', 'Account Manager Abhishek Singh  Logged In With Microsoft ', '-', '122.176.134.210', '2025-04-01 09:34:30', '2025-04-01 09:34:30'),
(633, 7, '2025-04-01', 'customer', 81, 'created customer profile. customer code :', 'Account Manager Abhishek Singh created customer profile. customer code : cust_OPT_000062(OPTIMISE ACCOUNTANTS LIMITED_000062)', 'created', '122.176.134.210', '2025-04-01 09:51:02', '2025-04-01 09:51:02'),
(634, 7, '2025-04-01', 'staff', 20, 'edited staff Pradeep Soni', 'Account Manager Abhishek Singh edited staff Pradeep Soni ', 'updated', '122.176.134.210', '2025-04-01 09:52:20', '2025-04-01 09:52:20'),
(635, 7, '2025-04-01', 'customer', 81, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Abhishek Singh  edited the service details and added an additional service while editing the customer code : cust_OPT_000062(OPTIMISE ACCOUNTANTS LIMITED_000062)', 'updated', '122.176.134.210', '2025-04-01 09:54:03', '2025-04-01 09:54:03'),
(636, 7, '2025-04-01', 'client', 37, 'created client profile. client code :', 'Account Manager Abhishek Singh created client profile. client code : cli_OPT_KMD_000033(KMD PROPERTY INVESTMENTS LIMITED_000033)', 'created', '122.176.134.210', '2025-04-01 09:57:54', '2025-04-01 09:57:54'),
(637, 7, '2025-04-01', 'job', 11, 'created job code:', 'Account Manager Abhishek Singh created job code: OPT_KMD_Work_000011', 'created', '122.176.134.210', '2025-04-01 09:59:55', '2025-04-01 09:59:55'),
(638, 60, '2025-04-01', '-', 0, ' Logged In With Microsoft', 'Account Manager Mohit Kumar  Logged In With Microsoft ', '-', '103.95.165.24', '2025-04-01 12:02:33', '2025-04-01 12:02:33'),
(639, 60, '2025-04-01', 'client', 38, 'created client profile. client code :', 'Account Manager Mohit Kumar created client profile. client code : cli_AST_U C_000034(U CAN PROPERTY LIMITED_000034)', 'created', '103.95.165.24', '2025-04-01 12:16:15', '2025-04-01 12:16:15'),
(640, 60, '2025-04-01', 'job', 12, 'created job code:', 'Account Manager Mohit Kumar created job code: AST_U C_Work_000012', 'created', '103.95.165.24', '2025-04-01 12:19:06', '2025-04-01 12:19:06'),
(641, 60, '2025-04-01', 'timesheet', 0, 'submitted a timesheet entry. Task type:External,  Date: 2025-03-31, Hours : 10:00 ,Job code:AST_U C_Work_000012, Task name:U Can Property Limited ', 'Account Manager Mohit Kumar submitted a timesheet entry. Task type:External,  Date: 2025-03-31, Hours : 10:00 ,Job code:AST_U C_Work_000012, Task name:U Can Property Limited  ', 'updated', '0.0.0.0', '2025-04-01 12:20:12', '2025-04-01 12:20:12'),
(642, 60, '2025-04-01', 'job', 9, 'updated the job status from WIP – Processing to Complete - Draft Sent. job code:', 'Account Manager Mohit Kumar updated the job status from WIP – Processing to Complete - Draft Sent. job code: AST_BP _Work_00009', 'updated', '103.95.165.24', '2025-04-01 12:23:07', '2025-04-01 12:23:07'),
(643, 1, '2025-04-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-04-02 06:57:54', '2025-04-02 06:57:54'),
(644, 59, '2025-04-02', '-', 0, ' Logged In With Microsoft', 'Account Manager Vikash  Jaimini  Logged In With Microsoft ', '-', '49.36.241.178', '2025-04-02 09:21:49', '2025-04-02 09:21:49'),
(645, 1, '2025-04-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-04-02 11:59:02', '2025-04-02 11:59:02'),
(646, 1, '2025-04-02', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-04-02 11:59:12', '2025-04-02 11:59:12'),
(647, 1, '2025-04-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-04-02 12:45:33', '2025-04-02 12:45:33'),
(648, 1, '2025-04-02', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-04-02 13:21:55', '2025-04-02 13:21:55'),
(649, 1, '2025-04-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-04-02 13:22:17', '2025-04-02 13:22:17'),
(650, 1, '2025-04-02', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-04-02 13:22:48', '2025-04-02 13:22:48'),
(651, 1, '2025-04-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-04-02 13:25:26', '2025-04-02 13:25:26'),
(652, 5, '2025-04-02', '-', 0, ' Logged In', 'Account Manager shk hu  Logged In ', '-', NULL, '2025-04-02 13:28:34', '2025-04-02 13:28:34'),
(653, 5, '2025-04-02', '-', 0, ' Logged Out', 'Account Manager shk hu  Logged Out ', '-', '122.168.114.106', '2025-04-02 13:29:12', '2025-04-02 13:29:12'),
(654, 1, '2025-04-03', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-04-03 04:48:11', '2025-04-03 04:48:11'),
(655, 2, '2025-04-03', '-', 0, ' Logged Out', 'Super Admin Amit Agarwal  Logged Out ', '-', '81.105.113.91', '2025-04-03 08:58:32', '2025-04-03 08:58:32'),
(656, 2, '2025-04-03', '-', 0, ' Logged In With Microsoft', 'Super Admin Amit Agarwal  Logged In With Microsoft ', '-', NULL, '2025-04-03 09:26:39', '2025-04-03 09:26:39'),
(657, 1, '2025-04-03', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-04-03 13:03:05', '2025-04-03 13:03:05'),
(658, 2, '2025-04-03', '-', 0, ' Logged In With Microsoft', 'Super Admin Amit Agarwal  Logged In With Microsoft ', '-', '148.253.191.86', '2025-04-03 13:55:35', '2025-04-03 13:55:35'),
(659, 1, '2025-04-03', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.51.250', '2025-04-03 14:43:18', '2025-04-03 14:43:18'),
(660, 34, '2025-04-03', '-', 0, ' Logged In', 'Account Manager vikas for test  Logged In ', '-', NULL, '2025-04-03 14:45:10', '2025-04-03 14:45:10'),
(661, 34, '2025-04-03', 'customer', 82, 'created customer profile. customer code :', 'Account Manager vikas for test created customer profile. customer code : cust_ADV_000063(ADVANCED HOUSING ENGINEERING UA LTD_000063)', 'created', '110.227.57.210', '2025-04-03 14:46:21', '2025-04-03 14:46:21'),
(662, 34, '2025-04-03', 'customer', 82, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager vikas for test  edited the service details and added an additional service while editing the customer code : cust_ADV_000063(ADVANCED HOUSING ENGINEERING UA LTD_000063)', 'updated', '110.227.57.210', '2025-04-03 14:46:30', '2025-04-03 14:46:30'),
(663, 34, '2025-04-03', 'client', 39, 'created client profile. client code :', 'Account Manager vikas for test created client profile. client code : cli_ADV_Pin_000035(Pinnacle UK Trade)', 'created', '110.227.57.210', '2025-04-03 14:49:22', '2025-04-03 14:49:22'),
(664, 34, '2025-04-03', 'job', 13, 'created job code:', 'Account Manager vikas for test created job code: ADV_Pin_Prep_000013', 'created', '110.227.57.210', '2025-04-03 14:50:05', '2025-04-03 14:50:05'),
(665, 34, '2025-04-03', 'job', 13, 'sent the missing logs for job code:', 'Account Manager vikas for test sent the missing logs for job code: ADV_Pin_Prep_000013', 'created', '110.227.57.210', '2025-04-03 14:51:49', '2025-04-03 14:51:49'),
(666, 34, '2025-04-03', 'job', 13, 'sent the queries for job code:', 'Account Manager vikas for test sent the queries for job code: ADV_Pin_Prep_000013', 'created', '110.227.57.210', '2025-04-03 15:00:38', '2025-04-03 15:00:38'),
(667, 1, '2025-04-03', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (customer-insert, customer-update, customer-delete, customer-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (customer-insert, customer-update, customer-delete, customer-view) ', 'updated', '110.227.57.210', '2025-04-03 15:13:32', '2025-04-03 15:13:32'),
(668, 34, '2025-04-03', '-', 0, ' Logged Out', 'Account Manager vikas for test  Logged Out ', '-', '110.227.57.210', '2025-04-03 15:15:06', '2025-04-03 15:15:06'),
(669, 94, '2025-04-03', '-', 0, ' Logged In', 'Admin Vikas Patel  Logged In ', '-', '110.227.57.210', '2025-04-03 15:15:16', '2025-04-03 15:15:16'),
(670, 1, '2025-04-03', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (customer-delete, customer-update, customer-insert, customer-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (customer-delete, customer-update, customer-insert, customer-view) ', 'updated', '110.227.57.210', '2025-04-03 15:15:37', '2025-04-03 15:15:37'),
(671, 1, '2025-04-03', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (customer-insert, customer-update, customer-delete, customer-view) Remove Permission (status-insert, status-update, status-delete, status-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (customer-insert, customer-update, customer-delete, customer-view) Remove Permission (status-insert, status-update, status-delete, status-view) ', 'updated', '110.227.57.210', '2025-04-03 15:30:33', '2025-04-03 15:30:33'),
(672, 1, '2025-04-03', 'staff', 96, 'created staff New Vikas  test', 'Super Admin System Super Super Admin created staff New Vikas  test ', 'created', '110.227.57.210', '2025-04-03 15:31:05', '2025-04-03 15:31:05'),
(673, 94, '2025-04-03', '-', 0, ' Logged Out', 'Admin Vikas Patel  Logged Out ', '-', '110.227.57.210', '2025-04-03 15:31:29', '2025-04-03 15:31:29'),
(674, 96, '2025-04-03', '-', 0, ' Logged In', 'Admin New Vikas  test  Logged In ', '-', '110.227.57.210', '2025-04-03 15:31:42', '2025-04-03 15:31:42'),
(675, 96, '2025-04-03', '-', 0, ' Logged In', 'Admin New Vikas  test  Logged In ', '-', '110.227.57.210', '2025-04-03 15:31:42', '2025-04-03 15:31:42');
INSERT INTO `staff_logs` (`id`, `staff_id`, `date`, `module_name`, `module_id`, `log_message`, `log_message_all`, `permission_type`, `ip`, `created_at`, `updated_at`) VALUES
(676, 1, '2025-04-03', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (customer-insert, customer-update, customer-delete, customer-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (customer-insert, customer-update, customer-delete, customer-view) ', 'updated', '110.227.57.210', '2025-04-03 15:32:09', '2025-04-03 15:32:09'),
(677, 1, '2025-04-03', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (status-insert, status-update, status-delete, status-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (status-insert, status-update, status-delete, status-view)  ', 'updated', '110.227.57.210', '2025-04-03 15:32:27', '2025-04-03 15:32:27'),
(678, 96, '2025-04-03', 'job', 14, 'created job code:', 'Admin New Vikas  test created job code: AST_BP _VAT _000014', 'created', '110.227.57.210', '2025-04-03 15:35:29', '2025-04-03 15:35:29'),
(679, 1, '2025-04-04', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-04-04 05:15:40', '2025-04-04 05:15:40'),
(680, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (customer-insert, customer-update, customer-delete, customer-view) Remove Permission (status-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (customer-insert, customer-update, customer-delete, customer-view) Remove Permission (status-view) ', 'updated', '122.168.114.106', '2025-04-04 05:15:53', '2025-04-04 05:15:53'),
(681, 94, '2025-04-04', '-', 0, ' Logged In', 'Admin Vikas Patel  Logged In ', '-', NULL, '2025-04-04 05:16:54', '2025-04-04 05:16:54'),
(682, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (customer-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (customer-view) ', 'updated', '122.168.114.106', '2025-04-04 05:17:03', '2025-04-04 05:17:03'),
(683, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (staff-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (staff-view) ', 'updated', '122.168.114.106', '2025-04-04 05:17:33', '2025-04-04 05:17:33'),
(684, 94, '2025-04-04', '-', 0, ' Logged Out', 'Admin Vikas Patel  Logged Out ', '-', '122.168.114.106', '2025-04-04 05:18:58', '2025-04-04 05:18:58'),
(685, 1, '2025-04-04', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-04-04 05:19:09', '2025-04-04 05:19:09'),
(686, 1, '2025-04-05', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-04-05 12:22:23', '2025-04-05 12:22:23'),
(687, 1, '2025-04-05', 'permission', 6, ' updated the access for REVIEWER. Access Changes Add Permission (all_customers-view) ', 'Super Admin System Super Super Admin  updated the access for REVIEWER. Access Changes Add Permission (all_customers-view)  ', 'updated', '122.168.114.106', '2025-04-05 12:26:19', '2025-04-05 12:26:19'),
(688, 1, '2025-04-05', 'permission', 9, ' updated the access for SUPPORT. Access Changes  Remove Permission (all_customers-view)', 'Super Admin System Super Super Admin  updated the access for SUPPORT. Access Changes  Remove Permission (all_customers-view) ', 'updated', '122.168.114.106', '2025-04-05 12:26:45', '2025-04-05 12:26:45'),
(689, 1, '2025-04-07', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.57.210', '2025-04-07 14:08:15', '2025-04-07 14:08:15'),
(690, 96, '2025-04-07', '-', 0, ' Logged In', 'Admin New Vikas  test  Logged In ', '-', NULL, '2025-04-07 14:14:13', '2025-04-07 14:14:13'),
(691, 1, '2025-04-07', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (customer-view) Remove Permission (customer-delete, customer-update, customer-insert)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (customer-view) Remove Permission (customer-delete, customer-update, customer-insert) ', 'updated', '110.227.62.147', '2025-04-07 14:14:36', '2025-04-07 14:14:36'),
(692, 1, '2025-04-07', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (customer-delete, customer-update, customer-insert) Remove Permission (customer-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (customer-delete, customer-update, customer-insert) Remove Permission (customer-view) ', 'updated', '110.227.62.147', '2025-04-07 14:14:59', '2025-04-07 14:14:59'),
(693, 1, '2025-04-07', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (timesheet-view, client-view, job-view, setting-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (timesheet-view, client-view, job-view, setting-view) ', 'updated', '110.227.62.147', '2025-04-07 14:15:26', '2025-04-07 14:15:26'),
(694, 1, '2025-04-07', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (status-view, customer-view, staff-view, client-view, job-view, setting-view, timesheet-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (status-view, customer-view, staff-view, client-view, job-view, setting-view, timesheet-view)  ', 'updated', '110.227.62.147', '2025-04-07 14:15:45', '2025-04-07 14:15:45'),
(695, 1, '2025-04-07', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (all_customers-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (all_customers-view)  ', 'updated', '110.227.62.147', '2025-04-07 14:15:58', '2025-04-07 14:15:58'),
(696, 1, '2025-04-07', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (all_clients-view) Remove Permission (all_jobs-view, all_customers-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (all_clients-view) Remove Permission (all_jobs-view, all_customers-view) ', 'updated', '110.227.62.147', '2025-04-07 14:16:47', '2025-04-07 14:16:47'),
(697, 1, '2025-04-07', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (all_customers-view, all_jobs-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (all_customers-view, all_jobs-view)  ', 'updated', '110.227.62.147', '2025-04-07 14:18:13', '2025-04-07 14:18:13'),
(698, 1, '2025-04-07', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (customer-insert)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (customer-insert) ', 'updated', '110.227.62.147', '2025-04-07 14:18:36', '2025-04-07 14:18:36'),
(699, 1, '2025-04-07', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (customer-update)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (customer-update) ', 'updated', '110.227.62.147', '2025-04-07 14:18:47', '2025-04-07 14:18:47'),
(700, 1, '2025-04-07', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (client-update, client-insert)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (client-update, client-insert) ', 'updated', '110.227.62.147', '2025-04-07 14:19:04', '2025-04-07 14:19:04'),
(701, 1, '2025-04-07', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (job-insert, job-update)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (job-insert, job-update) ', 'updated', '110.227.62.147', '2025-04-07 14:19:22', '2025-04-07 14:19:22'),
(702, 1, '2025-04-07', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (all_clients-view, all_jobs-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (all_clients-view, all_jobs-view) ', 'updated', '110.227.62.147', '2025-04-07 14:20:23', '2025-04-07 14:20:23'),
(703, 1, '2025-04-07', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (all_jobs-view, all_clients-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (all_jobs-view, all_clients-view)  ', 'updated', '110.227.62.147', '2025-04-07 14:20:55', '2025-04-07 14:20:55'),
(704, 1, '2025-04-07', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (all_customers-view, all_clients-view, all_jobs-view) Remove Permission (all_jobs-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (all_customers-view, all_clients-view, all_jobs-view) Remove Permission (all_jobs-view) ', 'updated', '110.227.62.147', '2025-04-07 14:21:22', '2025-04-07 14:21:22'),
(705, 1, '2025-04-07', 'permission', 8, ' updated the access for MANAGEMENT. Access Changes Add Permission (all_customers-view, all_clients-view, all_jobs-view) ', 'Super Admin System Super Super Admin  updated the access for MANAGEMENT. Access Changes Add Permission (all_customers-view, all_clients-view, all_jobs-view)  ', 'updated', '110.227.62.147', '2025-04-07 14:21:31', '2025-04-07 14:21:31'),
(706, 1, '2025-04-07', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (customer-update, customer-insert, client-insert, client-update, job-insert, job-update, all_jobs-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (customer-update, customer-insert, client-insert, client-update, job-insert, job-update, all_jobs-view)  ', 'updated', '110.227.62.147', '2025-04-07 14:21:44', '2025-04-07 14:21:44'),
(707, 96, '2025-04-07', 'customer', 83, 'created customer profile. customer code :', 'Admin New Vikas  test created customer profile. customer code : cust_ABB_000064(ABBEY COURT FLATS MANAGEMENT COMPANY LIMITED_000064)', 'created', '110.227.62.147', '2025-04-07 14:22:41', '2025-04-07 14:22:41'),
(708, 96, '2025-04-07', 'customer', 83, ' edited the service details and added an additional service while editing the customer code :', 'Admin New Vikas  test  edited the service details and added an additional service while editing the customer code : cust_ABB_000064(ABBEY COURT FLATS MANAGEMENT COMPANY LIMITED_000064)', 'updated', '110.227.62.147', '2025-04-07 14:23:08', '2025-04-07 14:23:08'),
(709, 96, '2025-04-07', 'client', 40, 'created client profile. client code :', 'Admin New Vikas  test created client profile. client code : cli_ABB_GF _000036(GF MYBSTER ENERGY LTD_000036)', 'created', '110.227.62.147', '2025-04-07 14:24:05', '2025-04-07 14:24:05'),
(710, 96, '2025-04-07', 'job', 15, 'created job code:', 'Admin New Vikas  test created job code: ABB_GF _Demo_000015', 'created', '110.227.62.147', '2025-04-07 14:24:36', '2025-04-07 14:24:36'),
(711, 96, '2025-04-07', 'job', 15, 'updated the job status from To Be Started - Not Yet Allocated Internally to Draft Sent 1 . job code:', 'Admin New Vikas  test updated the job status from To Be Started - Not Yet Allocated Internally to Draft Sent 1 . job code: ABB_GF _Demo_000015', 'updated', '110.227.62.147', '2025-04-07 14:25:18', '2025-04-07 14:25:18'),
(712, 96, '2025-04-07', 'job', 15, 'updated the job status from Draft Sent 1  to Complete - Draft Sent. job code:', 'Admin New Vikas  test updated the job status from Draft Sent 1  to Complete - Draft Sent. job code: ABB_GF _Demo_000015', 'updated', '110.227.62.147', '2025-04-07 14:25:24', '2025-04-07 14:25:24'),
(713, 96, '2025-04-07', 'job', 15, 'updated the job status from Complete - Draft Sent to To Be Started - Not Yet Allocated Internally. job code:', 'Admin New Vikas  test updated the job status from Complete - Draft Sent to To Be Started - Not Yet Allocated Internally. job code: ABB_GF _Demo_000015', 'updated', '110.227.62.147', '2025-04-07 14:25:29', '2025-04-07 14:25:29'),
(714, 96, '2025-04-07', '-', 0, ' Logged Out', 'Admin New Vikas  test  Logged Out ', '-', '110.227.62.147', '2025-04-07 14:26:06', '2025-04-07 14:26:06'),
(715, 41, '2025-04-07', '-', 0, ' Logged In', 'Support Hemant Mehta  Logged In ', '-', '110.227.62.147', '2025-04-07 14:26:34', '2025-04-07 14:26:34'),
(716, 1, '2025-04-07', 'permission', 9, ' updated the access for SUPPORT. Access Changes  Remove Permission (all_clients-view, all_jobs-view, all_customers-view)', 'Super Admin System Super Super Admin  updated the access for SUPPORT. Access Changes  Remove Permission (all_clients-view, all_jobs-view, all_customers-view) ', 'updated', '110.227.62.147', '2025-04-07 14:26:53', '2025-04-07 14:26:53'),
(717, 1, '2025-04-07', 'permission', 9, ' updated the access for SUPPORT. Access Changes Add Permission (all_clients-view, all_customers-view, all_jobs-view) ', 'Super Admin System Super Super Admin  updated the access for SUPPORT. Access Changes Add Permission (all_clients-view, all_customers-view, all_jobs-view)  ', 'updated', '110.227.62.147', '2025-04-07 14:27:13', '2025-04-07 14:27:13'),
(718, 41, '2025-04-07', '-', 0, ' Logged Out', 'Support Hemant Mehta  Logged Out ', '-', '110.227.62.147', '2025-04-07 14:28:10', '2025-04-07 14:28:10'),
(719, 55, '2025-04-07', '-', 0, ' Logged In', 'Management Elakkya Vikas  Logged In ', '-', '110.227.62.147', '2025-04-07 14:28:17', '2025-04-07 14:28:17'),
(720, 1, '2025-04-07', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (all_jobs-view, all_jobs-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (all_jobs-view, all_jobs-view) ', 'updated', '110.227.62.147', '2025-04-07 14:55:21', '2025-04-07 14:55:21'),
(721, 55, '2025-04-07', 'client', 41, 'created client profile. client code :', 'Management Elakkya Vikas created client profile. client code : cli_ABB_OI _000037(OI ALDRIDGE LTD_000037)', 'created', '110.227.62.147', '2025-04-07 14:56:19', '2025-04-07 14:56:19'),
(722, 1, '2025-04-08', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-04-08 05:04:51', '2025-04-08 05:04:51'),
(723, 44, '2025-04-08', '-', 0, ' Logged In With Microsoft', 'Management Sachin Daga  Logged In With Microsoft ', '-', '49.36.238.249', '2025-04-08 11:02:43', '2025-04-08 11:02:43'),
(724, 44, '2025-04-08', '-', 0, ' Logged Out', 'Management Sachin Daga  Logged Out ', '-', '49.36.236.255', '2025-04-08 11:03:13', '2025-04-08 11:03:13'),
(725, 44, '2025-04-11', '-', 0, ' Logged In With Microsoft', 'Management Sachin Daga  Logged In With Microsoft ', '-', '49.36.236.255', '2025-04-11 05:47:09', '2025-04-11 05:47:09'),
(726, 44, '2025-04-11', 'client', 42, 'created client profile. client code :', 'Management Sachin Daga created client profile. client code : cli_FIE_FIE_000038(FIELDS LUXURY LIMITED_000038)', 'created', '49.36.236.91', '2025-04-11 05:57:21', '2025-04-11 05:57:21'),
(727, 44, '2025-04-11', '-', 0, ' Logged Out', 'Management Sachin Daga  Logged Out ', '-', '49.36.236.91', '2025-04-11 06:06:23', '2025-04-11 06:06:23'),
(728, 2, '2025-04-11', '-', 0, ' Logged In With Microsoft', 'Super Admin Amit Agarwal  Logged In With Microsoft ', '-', '148.253.191.86', '2025-04-11 17:03:25', '2025-04-11 17:03:25'),
(729, 2, '2025-04-11', 'staff', 97, 'created staff Amit Agarwal', 'Super Admin Amit Agarwal created staff Amit Agarwal ', 'created', '148.253.191.86', '2025-04-11 17:08:15', '2025-04-11 17:08:15'),
(730, 1, '2025-04-14', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-04-14 06:35:50', '2025-04-14 06:35:50'),
(731, 1, '2025-04-15', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.125.95', '2025-04-15 13:38:40', '2025-04-15 13:38:40'),
(732, 1, '2025-04-15', 'staff', 98, 'created staff Ap Pp', 'Super Admin System Super Super Admin created staff Ap Pp ', 'created', '27.60.13.44', '2025-04-15 13:44:06', '2025-04-15 13:44:06'),
(733, 44, '2025-04-16', '-', 0, ' Logged In With Microsoft', 'Management Sachin Daga  Logged In With Microsoft ', '-', '49.36.236.91', '2025-04-16 11:14:33', '2025-04-16 11:14:33'),
(734, 56, '2025-04-16', '-', 0, ' Logged In With Microsoft', 'Support Kamlesh Kumar  Logged In With Microsoft ', '-', '183.83.153.28', '2025-04-16 11:44:12', '2025-04-16 11:44:12'),
(735, 44, '2025-04-16', '-', 0, ' Logged Out', 'Management Sachin Daga  Logged Out ', '-', '49.36.238.13', '2025-04-16 14:10:44', '2025-04-16 14:10:44'),
(736, 1, '2025-04-17', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-04-17 06:08:23', '2025-04-17 06:08:23'),
(737, 1, '2025-04-17', 'staff', 99, 'created staff SS SS', 'Super Admin System Super Super Admin created staff SS SS ', 'created', '122.168.114.106', '2025-04-17 06:09:08', '2025-04-17 06:09:08'),
(738, 99, '2025-04-17', '-', 0, ' Logged In', 'Account Manager SS SS  Logged In ', '-', NULL, '2025-04-17 06:09:33', '2025-04-17 06:09:33'),
(739, 99, '2025-04-17', 'customer', 84, 'created customer profile. customer code :', 'Account Manager SS SS created customer profile. customer code : cust_CUS_000065(CUST-TEST1)', 'created', '122.168.114.106', '2025-04-17 06:12:36', '2025-04-17 06:12:36'),
(740, 99, '2025-04-17', 'customer', 84, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager SS SS  edited the service details and added an additional service while editing the customer code : cust_CUS_000065(CUST-TEST1)', 'updated', '122.168.114.106', '2025-04-17 06:12:40', '2025-04-17 06:12:40'),
(741, 99, '2025-04-17', 'customer', 85, 'created customer profile. customer code :', 'Account Manager SS SS created customer profile. customer code : cust_F T_000066(F TRADING COMPANY LIMITED_000066)', 'created', '122.168.114.106', '2025-04-17 06:13:12', '2025-04-17 06:13:12'),
(742, 99, '2025-04-17', 'customer', 85, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager SS SS  edited the service details and added an additional service while editing the customer code : cust_F T_000066(F TRADING COMPANY LIMITED_000066)', 'updated', '122.168.114.106', '2025-04-17 06:13:15', '2025-04-17 06:13:15'),
(743, 99, '2025-04-17', 'client', 43, 'created client profile. client code :', 'Account Manager SS SS created client profile. client code : cli_F T_CLI_000039(CLI-1-TEST)', 'created', '122.168.114.106', '2025-04-17 06:13:46', '2025-04-17 06:13:46'),
(744, 99, '2025-04-17', 'job', 16, 'created job code:', 'Account Manager SS SS created job code: F T_CLI_Payr_000016', 'created', '122.168.114.106', '2025-04-17 06:14:06', '2025-04-17 06:14:06'),
(745, 99, '2025-04-17', '-', 0, ' Logged Out', 'Management SS SS  Logged Out ', '-', '122.168.114.106', '2025-04-17 06:16:21', '2025-04-17 06:16:21'),
(746, 99, '2025-04-17', '-', 0, ' Logged In', 'Management SS SS  Logged In ', '-', '122.168.114.106', '2025-04-17 06:16:41', '2025-04-17 06:16:41'),
(747, 1, '2025-04-17', 'permission', 8, ' updated the access for MANAGEMENT. Access Changes  Remove Permission (all_clients-view, all_jobs-view, all_customers-view)', 'Super Admin System Super Super Admin  updated the access for MANAGEMENT. Access Changes  Remove Permission (all_clients-view, all_jobs-view, all_customers-view) ', 'updated', '122.168.114.106', '2025-04-17 06:17:17', '2025-04-17 06:17:17'),
(748, 1, '2025-04-17', 'permission', 8, ' updated the access for MANAGEMENT. Access Changes Add Permission (all_customers-view, all_clients-view, all_jobs-view) ', 'Super Admin System Super Super Admin  updated the access for MANAGEMENT. Access Changes Add Permission (all_customers-view, all_clients-view, all_jobs-view)  ', 'updated', '122.168.114.106', '2025-04-17 06:17:49', '2025-04-17 06:17:49'),
(749, 99, '2025-04-17', '-', 0, ' Logged Out', 'Support SS SS  Logged Out ', '-', '122.168.114.106', '2025-04-17 06:18:36', '2025-04-17 06:18:36'),
(750, 99, '2025-04-17', '-', 0, ' Logged In', 'Support SS SS  Logged In ', '-', '122.168.114.106', '2025-04-17 06:19:01', '2025-04-17 06:19:01'),
(751, 1, '2025-04-17', 'permission', 9, ' updated the access for SUPPORT. Access Changes  Remove Permission (all_clients-view, all_jobs-view, all_customers-view)', 'Super Admin System Super Super Admin  updated the access for SUPPORT. Access Changes  Remove Permission (all_clients-view, all_jobs-view, all_customers-view) ', 'updated', '122.168.114.106', '2025-04-17 06:19:17', '2025-04-17 06:19:17'),
(752, 1, '2025-04-17', 'permission', 9, ' updated the access for SUPPORT. Access Changes Add Permission (all_customers-view, all_clients-view, all_jobs-view) ', 'Super Admin System Super Super Admin  updated the access for SUPPORT. Access Changes Add Permission (all_customers-view, all_clients-view, all_jobs-view)  ', 'updated', '122.168.114.106', '2025-04-17 06:19:58', '2025-04-17 06:19:58'),
(753, 99, '2025-04-17', '-', 0, ' Logged Out', 'Support SS SS  Logged Out ', '-', '122.168.114.106', '2025-04-17 06:20:26', '2025-04-17 06:20:26'),
(754, 55, '2025-04-17', '-', 0, ' Logged In', 'Management Elakkya Vikas  Logged In ', '-', '122.168.114.106', '2025-04-17 06:20:45', '2025-04-17 06:20:45'),
(755, 1, '2025-04-17', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.54.147', '2025-04-17 15:00:53', '2025-04-17 15:00:53'),
(756, 1, '2025-04-17', 'staff', 100, 'created staff New  Test', 'Super Admin System Super Super Admin created staff New  Test ', 'created', '27.59.119.126', '2025-04-17 15:02:46', '2025-04-17 15:02:46'),
(757, 100, '2025-04-17', '-', 0, ' Logged In', 'Management New  Test  Logged In ', '-', NULL, '2025-04-17 16:31:55', '2025-04-17 16:31:55'),
(758, 1, '2025-04-17', 'permission', 8, ' updated the access for MANAGEMENT. Access Changes  Remove Permission (all_clients-view, all_jobs-view, all_customers-view)', 'Super Admin System Super Super Admin  updated the access for MANAGEMENT. Access Changes  Remove Permission (all_clients-view, all_jobs-view, all_customers-view) ', 'updated', '27.59.119.126', '2025-04-17 16:32:10', '2025-04-17 16:32:10'),
(759, 100, '2025-04-17', 'customer', 86, 'created customer profile. customer code :', 'Management New  Test created customer profile. customer code : cust_AGM_000067(AGMAN COCOA LIMITED_000067)', 'created', '171.79.44.16', '2025-04-17 16:32:38', '2025-04-17 16:32:38'),
(760, 100, '2025-04-17', 'customer', 86, ' edited the service details and added an additional service while editing the customer code :', 'Management New  Test  edited the service details and added an additional service while editing the customer code : cust_AGM_000067(AGMAN COCOA LIMITED_000067)', 'updated', '171.79.44.16', '2025-04-17 16:32:42', '2025-04-17 16:32:42'),
(761, 100, '2025-04-17', 'client', 44, 'created client profile. client code :', 'Management New  Test created client profile. client code : cli_AGM_AGM_000040(AGMAN COCOA LIMITED_000040)', 'created', '171.79.44.16', '2025-04-17 16:33:03', '2025-04-17 16:33:03'),
(762, 100, '2025-04-17', 'job', 17, 'created job code:', 'Management New  Test created job code: AGM_AGM_Payr_000017', 'created', '171.79.44.16', '2025-04-17 16:33:22', '2025-04-17 16:33:22'),
(763, 1, '2025-04-17', 'staff', 100, 'edited staff New  Test', 'Super Admin System Super Super Admin edited staff New  Test ', 'updated', '27.59.119.126', '2025-04-17 16:33:41', '2025-04-17 16:33:41'),
(764, 100, '2025-04-17', '-', 0, ' Logged Out', 'Account Manager New  Test  Logged Out ', '-', '171.79.44.16', '2025-04-17 16:33:52', '2025-04-17 16:33:52'),
(765, 100, '2025-04-17', '-', 0, ' Logged In', 'Account Manager New  Test  Logged In ', '-', '171.79.44.16', '2025-04-17 16:34:00', '2025-04-17 16:34:00'),
(766, 100, '2025-04-17', 'customer', 87, 'created customer profile. customer code :', 'Account Manager New  Test created customer profile. customer code : cust_THE_000068(THE AFRICA DIALOGUES LTD_000068)', 'created', '171.79.44.16', '2025-04-17 16:34:21', '2025-04-17 16:34:21'),
(767, 100, '2025-04-17', 'customer', 87, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager New  Test  edited the service details and added an additional service while editing the customer code : cust_THE_000068(THE AFRICA DIALOGUES LTD_000068)', 'updated', '171.79.44.16', '2025-04-17 16:34:25', '2025-04-17 16:34:25'),
(768, 100, '2025-04-17', 'client', 45, 'created client profile. client code :', 'Account Manager New  Test created client profile. client code : cli_THE_ABE_000041(ABERDEEN LIFE AND PENSIONS LIMITED_000041)', 'created', '171.79.44.16', '2025-04-17 16:34:53', '2025-04-17 16:34:53'),
(769, 100, '2025-04-17', 'job', 18, 'created job code:', 'Account Manager New  Test created job code: THE_ABE_PTR _000018', 'created', '171.79.44.16', '2025-04-17 16:35:07', '2025-04-17 16:35:07'),
(770, 1, '2025-04-17', 'staff', 100, 'edited staff New  Test', 'Super Admin System Super Super Admin edited staff New  Test ', 'updated', '171.79.44.16', '2025-04-17 16:35:21', '2025-04-17 16:35:21'),
(771, 100, '2025-04-17', '-', 0, ' Logged Out', 'Management New  Test  Logged Out ', '-', '171.79.44.16', '2025-04-17 16:35:25', '2025-04-17 16:35:25'),
(772, 100, '2025-04-17', '-', 0, ' Logged In', 'Management New  Test  Logged In ', '-', '171.79.44.16', '2025-04-17 16:35:35', '2025-04-17 16:35:35'),
(773, 100, '2025-04-17', 'staff', 100, 'edited staff New  Test', 'Support New  Test edited staff New  Test ', 'updated', '171.79.44.16', '2025-04-17 16:37:01', '2025-04-17 16:37:01'),
(774, 100, '2025-04-17', '-', 0, ' Logged Out', 'Support New  Test  Logged Out ', '-', '171.79.44.16', '2025-04-17 16:37:08', '2025-04-17 16:37:08'),
(775, 100, '2025-04-17', '-', 0, ' Logged In', 'Support New  Test  Logged In ', '-', '171.79.44.16', '2025-04-17 16:37:15', '2025-04-17 16:37:15'),
(776, 1, '2025-04-17', 'permission', 9, ' updated the access for SUPPORT. Access Changes  Remove Permission (all_clients-view, all_jobs-view, all_customers-view)', 'Super Admin System Super Super Admin  updated the access for SUPPORT. Access Changes  Remove Permission (all_clients-view, all_jobs-view, all_customers-view) ', 'updated', '171.79.44.16', '2025-04-17 16:37:34', '2025-04-17 16:37:34'),
(777, 1, '2025-04-18', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-04-18 07:02:58', '2025-04-18 07:02:58'),
(778, 1, '2025-04-26', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-04-26 06:00:53', '2025-04-26 06:00:53'),
(779, 1, '2025-04-26', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-04-26 06:03:15', '2025-04-26 06:03:15'),
(780, 1, '2025-05-01', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-05-01 18:07:36', '2025-05-01 18:07:36'),
(781, 1, '2025-05-01', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-05-01 18:07:36', '2025-05-01 18:07:36'),
(782, 1, '2025-05-01', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '152.59.24.17', '2025-05-01 18:07:55', '2025-05-01 18:07:55'),
(783, 1, '2025-05-01', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '152.58.27.109', '2025-05-01 18:11:03', '2025-05-01 18:11:03'),
(784, 1, '2025-05-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-05-02 02:39:08', '2025-05-02 02:39:08'),
(785, 1, '2025-05-02', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '49.43.7.89', '2025-05-02 05:24:50', '2025-05-02 05:24:50'),
(786, 1, '2025-05-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-05-02 11:29:09', '2025-05-02 11:29:09'),
(787, 1, '2025-05-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-05-02 11:29:46', '2025-05-02 11:29:46'),
(788, 1, '2025-05-02', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-05-02 11:29:55', '2025-05-02 11:29:55'),
(789, 18, '2025-05-02', '-', 0, ' Logged In With Microsoft', 'Management nikita bhagat  Logged In With Microsoft ', '-', '122.168.114.106', '2025-05-02 11:30:27', '2025-05-02 11:30:27'),
(790, 18, '2025-05-02', '-', 0, ' Logged Out', 'Management nikita bhagat  Logged Out ', '-', '122.168.114.106', '2025-05-02 11:30:42', '2025-05-02 11:30:42'),
(791, 1, '2025-05-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '49.43.7.89', '2025-05-02 11:34:18', '2025-05-02 11:34:18'),
(792, 2, '2025-05-02', '-', 0, ' Logged In With Microsoft', 'Super Admin Amit Agarwal  Logged In With Microsoft ', '-', NULL, '2025-05-02 11:47:18', '2025-05-02 11:47:18'),
(793, 2, '2025-05-02', 'master status', 1, 'edited master status To Be Started - Not Yet Allocated Internally', 'Super Admin Amit Agarwal edited master status To Be Started - Not Yet Allocated Internally ', 'updated', '194.72.71.146', '2025-05-02 11:52:43', '2025-05-02 11:52:43'),
(794, 2, '2025-05-02', 'master status', 15, 'edited master status WIP - Customer Processing', 'Super Admin Amit Agarwal edited master status WIP - Customer Processing ', 'updated', '194.72.71.146', '2025-05-02 11:54:15', '2025-05-02 11:54:15'),
(795, 2, '2025-05-02', 'master status', 13, 'edited master status WIP - To Be Reviewed', 'Super Admin Amit Agarwal edited master status WIP - To Be Reviewed ', 'updated', '194.72.71.146', '2025-05-02 11:54:25', '2025-05-02 11:54:25'),
(796, 2, '2025-05-02', 'master status', 7, 'edited master status Draft Sent', 'Super Admin Amit Agarwal edited master status Draft Sent ', 'updated', '194.72.71.146', '2025-05-02 11:54:44', '2025-05-02 11:54:44'),
(797, 2, '2025-05-02', 'master status', 2, 'edited master status On Hold – Missing Paperwork', 'Super Admin Amit Agarwal edited master status On Hold – Missing Paperwork ', 'updated', '194.72.71.146', '2025-05-02 11:55:06', '2025-05-02 11:55:06'),
(798, 2, '2025-05-02', 'master status', 20, 'edited master status Completed - Filed with HMRC', 'Super Admin Amit Agarwal edited master status Completed - Filed with HMRC ', 'updated', '194.72.71.146', '2025-05-02 11:55:31', '2025-05-02 11:55:31'),
(799, 2, '2025-05-02', 'master status', 19, 'edited master status Completed - Filed with Companies House', 'Super Admin Amit Agarwal edited master status Completed - Filed with Companies House ', 'updated', '194.72.71.146', '2025-05-02 11:55:40', '2025-05-02 11:55:40'),
(800, 2, '2025-05-02', 'master status', 18, 'edited master status Completed - Filed with Companies House and HMRC', 'Super Admin Amit Agarwal edited master status Completed - Filed with Companies House and HMRC ', 'updated', '194.72.71.146', '2025-05-02 11:55:49', '2025-05-02 11:55:49'),
(801, 2, '2025-05-02', 'master status', 17, 'edited master status Completed - Update Sent', 'Super Admin Amit Agarwal edited master status Completed - Update Sent ', 'updated', '194.72.71.146', '2025-05-02 11:55:58', '2025-05-02 11:55:58'),
(802, 2, '2025-05-02', 'master status', 8, 'edited master status Not Progressing - Duplicate', 'Super Admin Amit Agarwal edited master status Not Progressing - Duplicate ', 'updated', '194.72.71.146', '2025-05-02 11:56:24', '2025-05-02 11:56:24'),
(803, 2, '2025-05-02', 'master status', 7, 'edited master status Completed - Draft Sent', 'Super Admin Amit Agarwal edited master status Completed - Draft Sent ', 'updated', '194.72.71.146', '2025-05-02 11:56:32', '2025-05-02 11:56:32'),
(804, 2, '2025-05-02', 'master status', 6, 'edited master status Completed - Opening Balances Adjusted', 'Super Admin Amit Agarwal edited master status Completed - Opening Balances Adjusted ', 'updated', '194.72.71.146', '2025-05-02 11:57:57', '2025-05-02 11:57:57'),
(805, 2, '2025-05-02', 'master status', 22, 'created master status On Hold - Last Quarter VAT Not Done', 'Super Admin Amit Agarwal created master status On Hold - Last Quarter VAT Not Done ', 'created', '194.72.71.146', '2025-05-02 11:58:56', '2025-05-02 11:58:56'),
(806, 2, '2025-05-02', 'master status', 23, 'created master status Not Progessing - Client Not Active Anymore', 'Super Admin Amit Agarwal created master status Not Progessing - Client Not Active Anymore ', 'created', '194.72.71.146', '2025-05-02 11:59:15', '2025-05-02 11:59:15'),
(807, 1, '2025-05-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-05-02 12:18:17', '2025-05-02 12:18:17'),
(808, 1, '2025-05-02', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-05-02 12:18:32', '2025-05-02 12:18:32'),
(809, 1, '2025-05-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-05-02 12:18:43', '2025-05-02 12:18:43'),
(810, 1, '2025-05-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-05-02 12:48:06', '2025-05-02 12:48:06'),
(811, 1, '2025-05-02', 'customer', 88, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_AVI_000069(AVIGNON CAPITAL FINANCIAL SERVICES LIMITED_000069)', 'created', '171.79.47.67', '2025-05-02 12:48:51', '2025-05-02 12:48:51'),
(812, 1, '2025-05-02', 'customer', 88, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_AVI_000069(AVIGNON CAPITAL FINANCIAL SERVICES LIMITED_000069)', 'updated', '171.79.47.67', '2025-05-02 12:48:55', '2025-05-02 12:48:55'),
(813, 1, '2025-05-02', 'client', 46, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_AVI_RE _000042(RE & BC LTD_000042)', 'created', '171.79.47.67', '2025-05-02 12:50:25', '2025-05-02 12:50:25'),
(814, 1, '2025-05-02', 'job', 19, 'created job code:', 'Super Admin System Super Super Admin created job code: AVI_RE _Payr_000019', 'created', '171.79.47.67', '2025-05-02 12:50:40', '2025-05-02 12:50:40'),
(815, 1, '2025-05-02', 'master status', 24, 'created master status Complete - Draft Sent', 'Super Admin System Super Super Admin created master status Complete - Draft Sent ', 'created', '171.79.47.67', '2025-05-02 12:50:56', '2025-05-02 12:50:56'),
(816, 1, '2025-05-02', 'staff', 101, 'created staff Vikas  test', 'Super Admin System Super Super Admin created staff Vikas  test ', 'created', '171.79.47.67', '2025-05-02 12:51:43', '2025-05-02 12:51:43'),
(817, 1, '2025-05-02', 'role', 10, 'created role test2', 'Super Admin System Super Super Admin created role test2 ', 'created', '171.79.47.67', '2025-05-02 12:52:25', '2025-05-02 12:52:25'),
(818, 1, '2025-05-02', 'customer contact person role', 6, 'created customer contact person role Self Assessment ', 'Super Admin System Super Super Admin created customer contact person role Self Assessment  ', 'created', '171.79.47.67', '2025-05-02 12:52:39', '2025-05-02 12:52:39'),
(819, 1, '2025-05-02', 'customer contact person role', 6, 'deleted customer contact person role Self Assessment ', 'Super Admin System Super Super Admin deleted customer contact person role Self Assessment  ', 'deleted', '171.79.47.67', '2025-05-02 12:52:45', '2025-05-02 12:52:45'),
(820, 1, '2025-05-02', 'status types', 6, 'created status types WIP1', 'Super Admin System Super Super Admin created status types WIP1 ', 'created', '171.79.47.67', '2025-05-02 12:52:52', '2025-05-02 12:52:52'),
(821, 1, '2025-05-02', 'status types', 6, 'deleted status types WIP1', 'Super Admin System Super Super Admin deleted status types WIP1 ', 'deleted', '171.79.47.67', '2025-05-02 12:52:56', '2025-05-02 12:52:56'),
(822, 1, '2025-05-02', 'services', 11, 'created services Capital Gain', 'Super Admin System Super Super Admin created services Capital Gain ', 'created', '171.79.47.67', '2025-05-02 12:53:02', '2025-05-02 12:53:02'),
(823, 1, '2025-05-02', 'job_types', 27, 'created job type Capital Gain', 'Super Admin System Super Super Admin created job type Capital Gain ', 'created', '171.79.47.67', '2025-05-02 12:53:02', '2025-05-02 12:53:02'),
(824, 1, '2025-05-02', 'services', 11, 'deleted services Capital Gain', 'Super Admin System Super Super Admin deleted services Capital Gain ', 'deleted', '171.79.47.67', '2025-05-02 12:53:08', '2025-05-02 12:53:08'),
(825, 1, '2025-05-02', 'services', 10, 'deleted services Vikas test', 'Super Admin System Super Super Admin deleted services Vikas test ', 'deleted', '171.79.47.67', '2025-05-02 12:53:15', '2025-05-02 12:53:15'),
(826, 1, '2025-05-02', 'client industry types', 12, 'created client industry types PVT LTD', 'Super Admin System Super Super Admin created client industry types PVT LTD ', 'created', '171.79.47.67', '2025-05-02 12:53:21', '2025-05-02 12:53:21'),
(827, 1, '2025-05-02', 'client industry types', 12, 'deleted client industry types PVT LTD', 'Super Admin System Super Super Admin deleted client industry types PVT LTD ', 'deleted', '171.79.47.67', '2025-05-02 12:53:26', '2025-05-02 12:53:26'),
(828, 1, '2025-05-02', 'incorporation in', 10, 'created incorporation in \'UK', 'Super Admin System Super Super Admin created incorporation in \'UK ', 'created', '171.79.47.67', '2025-05-02 12:53:41', '2025-05-02 12:53:41'),
(829, 1, '2025-05-02', 'incorporation in', 10, 'deleted incorporation  \'UK', 'Super Admin System Super Super Admin deleted incorporation  \'UK ', 'deleted', '171.79.47.67', '2025-05-02 12:53:46', '2025-05-02 12:53:46'),
(830, 1, '2025-05-02', 'customer source', 15, 'created customer source Capital Gain', 'Super Admin System Super Super Admin created customer source Capital Gain ', 'created', '171.79.47.67', '2025-05-02 12:53:50', '2025-05-02 12:53:50'),
(831, 1, '2025-05-02', 'customer source', 15, 'deleted customer source Capital Gain', 'Super Admin System Super Super Admin deleted customer source Capital Gain ', 'deleted', '171.79.47.67', '2025-05-02 12:53:55', '2025-05-02 12:53:55'),
(832, 1, '2025-05-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-05-02 13:55:50', '2025-05-02 13:55:50'),
(833, 1, '2025-05-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '152.59.26.11', '2025-05-02 17:02:15', '2025-05-02 17:02:15'),
(834, 1, '2025-05-02', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '152.59.26.11', '2025-05-02 17:02:42', '2025-05-02 17:02:42'),
(835, 1, '2025-05-03', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-05-03 11:28:17', '2025-05-03 11:28:17'),
(836, 1, '2025-05-03', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.47.67', '2025-05-03 12:52:01', '2025-05-03 12:52:01'),
(837, 1, '2025-05-23', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '188.240.58.56', '2025-05-23 07:02:51', '2025-05-23 07:02:51'),
(838, 1, '2025-05-23', 'customer', 89, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_F A_000070(F A B AUDIO VISUAL LIMITED)', 'created', '188.240.58.56', '2025-05-23 07:03:27', '2025-05-23 07:03:27'),
(839, 1, '2025-05-23', 'customer', 89, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_F A_000070(F A B AUDIO VISUAL LIMITED)', 'updated', '188.240.58.56', '2025-05-23 07:03:29', '2025-05-23 07:03:29'),
(840, 1, '2025-05-23', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '188.240.58.56', '2025-05-23 07:06:55', '2025-05-23 07:06:55'),
(841, 1, '2025-05-26', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.41.67', '2025-05-26 10:10:04', '2025-05-26 10:10:04'),
(842, 1, '2025-05-26', 'customer', 90, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_THE_000071(THE AFRICA DIALOGUES LTD)', 'created', '27.60.7.212', '2025-05-26 10:11:29', '2025-05-26 10:11:29'),
(843, 1, '2025-05-26', 'customer', 90, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_THE_000071(THE AFRICA DIALOGUES LTD)', 'updated', '27.60.7.212', '2025-05-26 10:11:33', '2025-05-26 10:11:33'),
(844, 1, '2025-05-26', 'client', 47, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_THE_MOV_000043(MOVING DIALOGUES THERAPY LTD)', 'created', '27.60.7.212', '2025-05-26 10:13:19', '2025-05-26 10:13:19'),
(845, 1, '2025-05-26', 'customer', 91, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_THE_000072(THE GLOBAL DIALOGUES TRUST)', 'created', '27.60.7.212', '2025-05-26 10:14:54', '2025-05-26 10:14:54'),
(846, 1, '2025-05-26', 'customer', 91, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_THE_000072(THE GLOBAL DIALOGUES TRUST)', 'updated', '27.60.7.212', '2025-05-26 10:15:00', '2025-05-26 10:15:00'),
(847, 1, '2025-05-26', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '188.240.58.56', '2025-05-26 10:39:06', '2025-05-26 10:39:06'),
(848, 1, '2025-05-26', 'client', 48, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_THE_ss_000044(ss)', 'created', '188.240.58.56', '2025-05-26 10:40:37', '2025-05-26 10:40:37'),
(849, 1, '2025-05-26', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-05-26 10:45:50', '2025-05-26 10:45:50'),
(850, 1, '2025-05-26', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-05-26 10:49:46', '2025-05-26 10:49:46'),
(851, 1, '2025-05-26', 'client', 49, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_THE_ss_000045(ss)', 'created', '188.240.58.56', '2025-05-26 11:49:59', '2025-05-26 11:49:59'),
(852, 1, '2025-05-26', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-05-26 12:55:55', '2025-05-26 12:55:55'),
(853, 1, '2025-05-26', 'client', 50, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_THE_MOV_000046(MOVING DIALOGUES THERAPY LTD)', 'created', '27.60.7.41', '2025-05-26 12:56:17', '2025-05-26 12:56:17'),
(854, 1, '2025-05-27', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '188.240.58.56', '2025-05-27 11:10:04', '2025-05-27 11:10:04'),
(855, 1, '2025-05-28', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.42.242', '2025-05-28 14:22:08', '2025-05-28 14:22:08'),
(856, 100, '2025-05-28', '-', 0, ' Logged In', 'Support New  Test  Logged In ', '-', NULL, '2025-05-28 14:23:15', '2025-05-28 14:23:15'),
(857, 100, '2025-05-28', 'job', 18, 'edited the job information job code:', 'Support New  Test edited the job information job code: THE_ABE_PTR _000018', 'updated', '171.79.38.68', '2025-05-28 14:24:07', '2025-05-28 14:24:07'),
(858, 100, '2025-05-28', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2025-05-26, Hours : 7:45 ,Job code:Training, Task name:Onboarding', 'Support New  Test created a timesheet entry. Task type:Internal,  Date: 2025-05-26, Hours : 7:45 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-05-28 14:25:54', '2025-05-28 14:25:54'),
(859, 100, '2025-05-28', 'timesheet', 0, 'edited a timesheet entry. Task type:Internal,  Date: 2025-05-27, Updated hours : 8:30 ,Job code:Training, Task name:Onboarding', 'Support New  Test edited a timesheet entry. Task type:Internal,  Date: 2025-05-27, Updated hours : 8:30 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-05-28 14:27:38', '2025-05-28 14:27:38'),
(860, 1, '2025-05-29', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.38.68', '2025-05-29 12:26:24', '2025-05-29 12:26:24'),
(861, 100, '2025-05-29', '-', 0, ' Logged In', 'Support New  Test  Logged In ', '-', NULL, '2025-05-29 12:27:27', '2025-05-29 12:27:27'),
(862, 100, '2025-05-29', 'timesheet', 0, 'edited a timesheet entry. Task type:Internal,  Date: 2025-05-28, Updated hours : 7:45 Date: 2025-05-29, Updated hours : 8:30 ,Job code:Training, Task name:Onboarding', 'Support New  Test edited a timesheet entry. Task type:Internal,  Date: 2025-05-28, Updated hours : 7:45 Date: 2025-05-29, Updated hours : 8:30 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-05-29 12:27:48', '2025-05-29 12:27:48'),
(863, 1, '2025-05-29', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '27.59.126.157', '2025-05-29 13:37:47', '2025-05-29 13:37:47'),
(864, 1, '2025-05-29', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.126.157', '2025-05-29 13:37:49', '2025-05-29 13:37:49'),
(865, 1, '2025-05-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '188.240.58.56', '2025-05-30 05:57:03', '2025-05-30 05:57:03'),
(866, 1, '2025-06-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.124.157', '2025-06-02 12:02:17', '2025-06-02 12:02:17'),
(867, 1, '2025-06-03', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.60.12.252', '2025-06-03 14:50:36', '2025-06-03 14:50:36'),
(868, 100, '2025-06-03', '-', 0, ' Logged In', 'Support New  Test  Logged In ', '-', NULL, '2025-06-03 14:51:26', '2025-06-03 14:51:26'),
(869, 100, '2025-06-03', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2025-06-02, Hours : 1:00 ,Job code:Training, Task name:Onboarding', 'Support New  Test created a timesheet entry. Task type:Internal,  Date: 2025-06-02, Hours : 1:00 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-03 14:51:53', '2025-06-03 14:51:53'),
(870, 1, '2025-06-03', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '110.227.49.128', '2025-06-03 15:01:44', '2025-06-03 15:01:44'),
(871, 1, '2025-06-03', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.49.128', '2025-06-03 15:15:42', '2025-06-03 15:15:42'),
(872, 1, '2025-06-04', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-06-04 05:41:18', '2025-06-04 05:41:18'),
(873, 1, '2025-06-04', 'role', 11, 'created role DEMO', 'Super Admin System Super Super Admin created role DEMO ', 'created', '122.168.114.106', '2025-06-04 05:41:56', '2025-06-04 05:41:56'),
(874, 1, '2025-06-04', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.49.128', '2025-06-04 14:38:20', '2025-06-04 14:38:20'),
(875, 1, '2025-06-04', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2025-06-02, Hours : 3:00 ,Job code:Training, Task name:Onboarding', 'Super Admin System Super Super Admin submitted a timesheet entry. Task type:Internal,  Date: 2025-06-02, Hours : 3:00 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-04 14:39:13', '2025-06-04 14:39:13'),
(876, 1, '2025-06-04', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '27.59.118.110', '2025-06-04 14:40:01', '2025-06-04 14:40:01'),
(877, 36, '2025-06-04', '-', 0, ' Logged In', 'Management vikas for testing  Logged In ', '-', '27.59.118.110', '2025-06-04 14:40:16', '2025-06-04 14:40:16'),
(878, 36, '2025-06-04', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2025-06-02, Hours : 5:00 Date: 2025-06-03, Hours : 5:00 ,Job code:Training, Task name:Onboarding', 'Management vikas for testing created a timesheet entry. Task type:Internal,  Date: 2025-06-02, Hours : 5:00 Date: 2025-06-03, Hours : 5:00 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-04 14:40:53', '2025-06-04 14:40:53'),
(879, 36, '2025-06-04', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2025-06-04, Updated hours : 7:00 Date: 2025-06-05, Updated hours : 6:00 ,Job code:Training, Task name:Onboarding', 'Management vikas for testing submitted a timesheet entry. Task type:Internal,  Date: 2025-06-04, Updated hours : 7:00 Date: 2025-06-05, Updated hours : 6:00 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-04 14:41:05', '2025-06-04 14:41:05'),
(880, 1, '2025-06-05', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-06-05 10:23:49', '2025-06-05 10:23:49'),
(881, 1, '2025-06-05', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-06-05 10:43:45', '2025-06-05 10:43:45');
INSERT INTO `staff_logs` (`id`, `staff_id`, `date`, `module_name`, `module_id`, `log_message`, `log_message_all`, `permission_type`, `ip`, `created_at`, `updated_at`) VALUES
(882, 1, '2025-06-05', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2025-06-09, Hours : 3:00 ,Job code:Training, Task name:Onboarding', 'Super Admin System Super Super Admin submitted a timesheet entry. Task type:Internal,  Date: 2025-06-09, Hours : 3:00 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-05 11:14:40', '2025-06-05 11:14:40'),
(883, 1, '2025-06-05', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2025-06-09, Hours : 3:02 ,Job code:Training, Task name:Onboarding', 'Super Admin System Super Super Admin submitted a timesheet entry. Task type:Internal,  Date: 2025-06-09, Hours : 3:02 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-05 11:19:24', '2025-06-05 11:19:24'),
(884, 1, '2025-06-05', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2025-06-02, Hours : 3:02 ,Job code:Training, Task name:Onboarding', 'Super Admin System Super Super Admin created a timesheet entry. Task type:Internal,  Date: 2025-06-02, Hours : 3:02 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-05 11:20:08', '2025-06-05 11:20:08'),
(885, 1, '2025-06-05', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2025-06-02, Hours : 22:00 Date: 2025-06-03, Hours : 20:05 ,Job code:Training, Task name:Onboarding', 'Super Admin System Super Super Admin submitted a timesheet entry. Task type:Internal,  Date: 2025-06-02, Hours : 22:00 Date: 2025-06-03, Hours : 20:05 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-05 11:29:43', '2025-06-05 11:29:43'),
(886, 1, '2025-06-05', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-06-05 13:36:31', '2025-06-05 13:36:31'),
(887, 1, '2025-06-05', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.118.110', '2025-06-05 14:23:59', '2025-06-05 14:23:59'),
(888, 1, '2025-06-05', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2025-06-02, Hours : 12:00 Date: 2025-06-03, Hours : 12:00 Date: 2025-06-04, Hours : 12:00 Date: 2025-06-05, Hours : 12:00 Date: 2025-06-06, Hours : 2:00 Date: 2025-06-07, Hours : 2:00 ,Job code:Training, Task name:Onboarding and Task type:Internal,  Date: 2025-06-02, Hours : 2:00 Date: 2025-06-03, Hours : 3:00 Date: 2025-06-04, Hours : 4:00 Date: 2025-06-05, Hours : 2:00 Date: 2025-06-06, Hours : 2:00 Date: 2025-06-07, Hours : 2:00 ,Job code:Training, Task name:Onboarding', 'Super Admin System Super Super Admin created a timesheet entry. Task type:Internal,  Date: 2025-06-02, Hours : 12:00 Date: 2025-06-03, Hours : 12:00 Date: 2025-06-04, Hours : 12:00 Date: 2025-06-05, Hours : 12:00 Date: 2025-06-06, Hours : 2:00 Date: 2025-06-07, Hours : 2:00 ,Job code:Training, Task name:Onboarding and Task type:Internal,  Date: 2025-06-02, Hours : 2:00 Date: 2025-06-03, Hours : 3:00 Date: 2025-06-04, Hours : 4:00 Date: 2025-06-05, Hours : 2:00 Date: 2025-06-06, Hours : 2:00 Date: 2025-06-07, Hours : 2:00 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-05 14:24:51', '2025-06-05 14:24:51'),
(889, 1, '2025-06-05', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '27.59.125.186', '2025-06-05 14:33:54', '2025-06-05 14:33:54'),
(890, 1, '2025-06-05', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.125.186', '2025-06-05 14:33:59', '2025-06-05 14:33:59'),
(891, 1, '2025-06-05', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '27.59.125.186', '2025-06-05 14:34:41', '2025-06-05 14:34:41'),
(892, 34, '2025-06-05', '-', 0, ' Logged In', 'Account Manager vikas for test  Logged In ', '-', '27.59.125.186', '2025-06-05 14:34:51', '2025-06-05 14:34:51'),
(893, 1, '2025-06-05', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.49.128', '2025-06-05 14:35:44', '2025-06-05 14:35:44'),
(894, 34, '2025-06-05', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2025-06-02, Hours : 8:05 ,Job code:Training, Task name:Onboarding', 'Account Manager vikas for test submitted a timesheet entry. Task type:Internal,  Date: 2025-06-02, Hours : 8:05 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-05 14:36:19', '2025-06-05 14:36:19'),
(895, 34, '2025-06-05', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2025-05-26, Hours : 8:05 Date: 2025-05-27, Hours : 8:05 Date: 2025-05-28, Hours : 5:03 ,Job code:Training, Task name:Onboarding', 'Account Manager vikas for test created a timesheet entry. Task type:Internal,  Date: 2025-05-26, Hours : 8:05 Date: 2025-05-27, Hours : 8:05 Date: 2025-05-28, Hours : 5:03 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-05 14:37:02', '2025-06-05 14:37:02'),
(896, 34, '2025-06-05', 'timesheet', 0, 'edited a timesheet entry. Task type:Internal,  Date: 2025-05-26, Updated hours : 8:50 Date: 2025-05-27, Updated hours : 8:50 ,Job code:Training, Task name:Onboarding', 'Account Manager vikas for test edited a timesheet entry. Task type:Internal,  Date: 2025-05-26, Updated hours : 8:50 Date: 2025-05-27, Updated hours : 8:50 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-05 14:37:20', '2025-06-05 14:37:20'),
(897, 34, '2025-06-05', 'timesheet', 0, 'edited a timesheet entry. Task type:Internal,  Date: 2025-05-28, Updated hours : 5:30 ,Job code:Training, Task name:Onboarding', 'Account Manager vikas for test edited a timesheet entry. Task type:Internal,  Date: 2025-05-28, Updated hours : 5:30 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-05 14:37:29', '2025-06-05 14:37:29'),
(898, 34, '2025-06-05', 'timesheet', 0, 'edited a timesheet entry. Task type:Internal,  Date: 2025-05-27, Updated hours : :00 Date: 2025-05-28, Updated hours : :00 Date: 2025-05-29, Updated hours : :00 ,Job code:Training, Task name:Onboarding', 'Account Manager vikas for test edited a timesheet entry. Task type:Internal,  Date: 2025-05-27, Updated hours : :00 Date: 2025-05-28, Updated hours : :00 Date: 2025-05-29, Updated hours : :00 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-05 14:38:03', '2025-06-05 14:38:03'),
(899, 34, '2025-06-05', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2025-05-26, Hours : 5:00 Date: 2025-05-27, Hours : 4:00 Date: 2025-05-28, Hours : 5:00 Date: 2025-05-29, Hours : 4:00 Date: 2025-05-30, Hours : 4:00 Date: 2025-05-31, Hours : 4:00 ,Job code:Leave, Task name:Sick Leave', 'Account Manager vikas for test created a timesheet entry. Task type:Internal,  Date: 2025-05-26, Hours : 5:00 Date: 2025-05-27, Hours : 4:00 Date: 2025-05-28, Hours : 5:00 Date: 2025-05-29, Hours : 4:00 Date: 2025-05-30, Hours : 4:00 Date: 2025-05-31, Hours : 4:00 ,Job code:Leave, Task name:Sick Leave ', 'updated', '0.0.0.0', '2025-06-05 14:38:53', '2025-06-05 14:38:53'),
(900, 34, '2025-06-05', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2025-05-26, Hours : 4:00 ,Job code:National Holiday, Task name:Christmas ', 'Account Manager vikas for test created a timesheet entry. Task type:Internal,  Date: 2025-05-26, Hours : 4:00 ,Job code:National Holiday, Task name:Christmas  ', 'updated', '0.0.0.0', '2025-06-05 14:39:52', '2025-06-05 14:39:52'),
(901, 34, '2025-06-05', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  ,Job code:Training, Task name:Onboarding, Task type:Internal,  ,Job code:Leave, Task name:Sick Leave and Task type:Internal,  ,Job code:National Holiday, Task name:Christmas ', 'Account Manager vikas for test submitted a timesheet entry. Task type:Internal,  ,Job code:Training, Task name:Onboarding, Task type:Internal,  ,Job code:Leave, Task name:Sick Leave and Task type:Internal,  ,Job code:National Holiday, Task name:Christmas  ', 'updated', '0.0.0.0', '2025-06-05 14:39:56', '2025-06-05 14:39:56'),
(902, 34, '2025-06-05', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2025-05-19, Hours : 7:00 Date: 2025-05-20, Hours : 8:59 Date: 2025-05-21, Hours : 7:30 ,Job code:ADV_Pin_Prep_000013, Task name:tewst', 'Account Manager vikas for test created a timesheet entry. Task type:External,  Date: 2025-05-19, Hours : 7:00 Date: 2025-05-20, Hours : 8:59 Date: 2025-05-21, Hours : 7:30 ,Job code:ADV_Pin_Prep_000013, Task name:tewst ', 'updated', '0.0.0.0', '2025-06-05 15:02:32', '2025-06-05 15:02:32'),
(903, 34, '2025-06-05', 'timesheet', 0, 'submitted a timesheet entry. Task type:External,  ,Job code:ADV_Pin_Prep_000013, Task name:tewst', 'Account Manager vikas for test submitted a timesheet entry. Task type:External,  ,Job code:ADV_Pin_Prep_000013, Task name:tewst ', 'updated', '0.0.0.0', '2025-06-05 15:02:39', '2025-06-05 15:02:39'),
(904, 1, '2025-06-06', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.60.7.41', '2025-06-06 10:51:47', '2025-06-06 10:51:47'),
(905, 1, '2025-06-06', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '171.79.38.61', '2025-06-06 10:52:07', '2025-06-06 10:52:07'),
(906, 94, '2025-06-06', '-', 0, ' Logged In', 'Admin Vikas Patel  Logged In ', '-', '171.79.38.61', '2025-06-06 10:52:16', '2025-06-06 10:52:16'),
(907, 1, '2025-06-06', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-06-06 15:07:36', '2025-06-06 15:07:36'),
(908, 1, '2025-06-06', 'customer', 90, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_THE_000071(THE AFRICA DIALOGUES LTD)', 'updated', '171.79.43.62', '2025-06-06 15:08:03', '2025-06-06 15:08:03'),
(909, 1, '2025-06-06', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '171.79.43.62', '2025-06-06 15:08:26', '2025-06-06 15:08:26'),
(910, 34, '2025-06-06', '-', 0, ' Logged In', 'Account Manager vikas for test  Logged In ', '-', '171.79.43.62', '2025-06-06 15:08:36', '2025-06-06 15:08:36'),
(911, 1, '2025-06-09', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.125.186', '2025-06-09 14:21:15', '2025-06-09 14:21:15'),
(912, 1, '2025-06-09', 'customer', 91, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_THE_000072(THE GLOBAL DIALOGUES TRUST)', 'updated', '171.79.39.10', '2025-06-09 14:22:35', '2025-06-09 14:22:35'),
(913, 60, '2025-06-09', '-', 0, ' Logged In', 'Account Manager Mohit Kumar  Logged In ', '-', NULL, '2025-06-09 14:23:30', '2025-06-09 14:23:30'),
(914, 1, '2025-06-10', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-06-10 10:16:19', '2025-06-10 10:16:19'),
(915, 1, '2025-06-10', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.39.10', '2025-06-10 16:02:51', '2025-06-10 16:02:51'),
(916, 61, '2025-06-10', '-', 0, ' Logged In', 'Account Manager Nishtha Jain  Logged In ', '-', NULL, '2025-06-10 16:03:27', '2025-06-10 16:03:27'),
(917, 1, '2025-06-10', 'customer', 90, 'edited the service details customer code :', 'Super Admin System Super Super Admin edited the service details customer code : cust_THE_000071(THE AFRICA DIALOGUES LTD)', 'updated', '27.59.126.23', '2025-06-10 16:04:28', '2025-06-10 16:04:28'),
(918, 61, '2025-06-10', 'job', 20, 'created job code:', 'Account Manager Nishtha Jain created job code: THE_MOV_VAT _000020', 'created', '27.59.126.23', '2025-06-10 16:05:39', '2025-06-10 16:05:39'),
(919, 61, '2025-06-10', 'timesheet', 0, 'submitted a timesheet entry. Task type:External,  Date: 2025-06-09, Hours : 11:00 Date: 2025-06-10, Hours : 11:00 Date: 2025-06-11, Hours : 11:00 Date: 2025-06-12, Hours : 11:00 ,Job code:THE_MOV_VAT _000020, Task name:tet', 'Account Manager Nishtha Jain submitted a timesheet entry. Task type:External,  Date: 2025-06-09, Hours : 11:00 Date: 2025-06-10, Hours : 11:00 Date: 2025-06-11, Hours : 11:00 Date: 2025-06-12, Hours : 11:00 ,Job code:THE_MOV_VAT _000020, Task name:tet ', 'updated', '0.0.0.0', '2025-06-10 16:06:04', '2025-06-10 16:06:04'),
(920, 1, '2025-06-11', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-06-11 08:42:54', '2025-06-11 08:42:54'),
(921, 1, '2025-06-11', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2025-06-09, Hours : 6:00 ,Job code:Training, Task name:Onboarding and Task type:Internal,  Date: 2025-06-09, Hours : 8:00 ,Job code:Training, Task name:Onboarding', 'Super Admin System Super Super Admin created a timesheet entry. Task type:Internal,  Date: 2025-06-09, Hours : 6:00 ,Job code:Training, Task name:Onboarding and Task type:Internal,  Date: 2025-06-09, Hours : 8:00 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-11 09:00:47', '2025-06-11 09:00:47'),
(922, 1, '2025-06-11', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  ,Job code:Training, Task name:Onboarding and Task type:Internal,  ,Job code:Training, Task name:Onboarding', 'Super Admin System Super Super Admin submitted a timesheet entry. Task type:Internal,  ,Job code:Training, Task name:Onboarding and Task type:Internal,  ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-11 09:00:54', '2025-06-11 09:00:54'),
(923, 1, '2025-06-11', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2025-06-16, Hours : 5:00 Date: 2025-06-17, Hours : 6:00 Date: 2025-06-18, Hours : 9:00 ,Job code:Training, Task name:Onboarding', 'Super Admin System Super Super Admin submitted a timesheet entry. Task type:Internal,  Date: 2025-06-16, Hours : 5:00 Date: 2025-06-17, Hours : 6:00 Date: 2025-06-18, Hours : 9:00 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-11 09:01:54', '2025-06-11 09:01:54'),
(924, 1, '2025-06-11', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.126.23', '2025-06-11 15:15:07', '2025-06-11 15:15:07'),
(925, 1, '2025-06-11', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2025-05-26, Hours : 8:50 ,Job code:Training, Task name:Onboarding', 'Super Admin System Super Super Admin created a timesheet entry. Task type:Internal,  Date: 2025-05-26, Hours : 8:50 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-11 15:15:37', '2025-06-11 15:15:37'),
(926, 1, '2025-06-11', 'timesheet', 0, 'edited a timesheet entry. Task type:Internal,  Date: 2025-05-27, Updated hours : 8:05 ,Job code:Training, Task name:Onboarding', 'Super Admin System Super Super Admin edited a timesheet entry. Task type:Internal,  Date: 2025-05-27, Updated hours : 8:05 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-11 15:16:09', '2025-06-11 15:16:09'),
(927, 1, '2025-06-11', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2025-05-28, Updated hours : 8:00 ,Job code:Training, Task name:Onboarding', 'Super Admin System Super Super Admin submitted a timesheet entry. Task type:Internal,  Date: 2025-05-28, Updated hours : 8:00 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-11 15:16:34', '2025-06-11 15:16:34'),
(928, 45, '2025-06-11', '-', 0, ' Logged In', 'Management Anushree R  Logged In ', '-', NULL, '2025-06-11 15:17:23', '2025-06-11 15:17:23'),
(929, 1, '2025-06-13', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.44.119', '2025-06-13 14:54:21', '2025-06-13 14:54:21'),
(930, 1, '2025-06-16', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.118.118', '2025-06-16 11:24:02', '2025-06-16 11:24:02'),
(931, 1, '2025-06-16', 'timesheet', 0, 'edited a timesheet entry. Task type:Internal,  Date: 2025-06-06, Updated hours : 2:50 ,Job code:Training, Task name:Onboarding', 'Super Admin System Super Super Admin edited a timesheet entry. Task type:Internal,  Date: 2025-06-06, Updated hours : 2:50 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-16 11:24:25', '2025-06-16 11:24:25'),
(932, 1, '2025-06-18', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.55.161', '2025-06-18 13:44:03', '2025-06-18 13:44:03'),
(933, 1, '2025-06-18', 'permission', 4, ' updated the access for MANAGER. Access Changes  Remove Permission (status-insert, status-update, status-delete, status-view, staff-insert, staff-update, staff-delete, staff-view, client-insert, client-update, client-delete, client-view, job-insert, job-update, job-delete, job-view)', 'Super Admin System Super Super Admin  updated the access for MANAGER. Access Changes  Remove Permission (status-insert, status-update, status-delete, status-view, staff-insert, staff-update, staff-delete, staff-view, client-insert, client-update, client-delete, client-view, job-insert, job-update, job-delete, job-view) ', 'updated', '110.227.55.161', '2025-06-18 13:44:38', '2025-06-18 13:44:38'),
(934, 88, '2025-06-18', '-', 0, ' Logged In', 'Account Manager Darshita Trivedi  Logged In ', '-', NULL, '2025-06-18 13:45:21', '2025-06-18 13:45:21'),
(935, 1, '2025-06-18', 'permission', 4, ' updated the access for MANAGER. Access Changes Add Permission (status-insert, status-update, status-delete, status-view, staff-view, staff-delete, staff-update, staff-insert, client-insert, client-update, client-delete, client-view, job-update, job-insert, job-delete, job-view) ', 'Super Admin System Super Super Admin  updated the access for MANAGER. Access Changes Add Permission (status-insert, status-update, status-delete, status-view, staff-view, staff-delete, staff-update, staff-insert, client-insert, client-update, client-delete, client-view, job-update, job-insert, job-delete, job-view)  ', 'updated', '110.227.55.161', '2025-06-18 13:45:53', '2025-06-18 13:45:53'),
(936, 1, '2025-06-20', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-06-20 06:55:36', '2025-06-20 06:55:36'),
(937, 1, '2025-06-20', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.119.74', '2025-06-20 09:31:04', '2025-06-20 09:31:04'),
(938, 80, '2025-06-20', '-', 0, ' Logged In', 'Account Manager Bhakti Kalambate  Logged In ', '-', NULL, '2025-06-20 09:31:47', '2025-06-20 09:31:47'),
(939, 80, '2025-06-20', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2025-06-16, Hours : 8:00 Date: 2025-06-17, Hours : 8:05 Date: 2025-06-18, Hours : 0:30 Date: 2025-06-19, Hours : 8:50 Date: 2025-06-20, Hours : 7:05 Date: 2025-06-21, Hours : 3:00 ,Job code:Training, Task name:Onboarding', 'Account Manager Bhakti Kalambate submitted a timesheet entry. Task type:Internal,  Date: 2025-06-16, Hours : 8:00 Date: 2025-06-17, Hours : 8:05 Date: 2025-06-18, Hours : 0:30 Date: 2025-06-19, Hours : 8:50 Date: 2025-06-20, Hours : 7:05 Date: 2025-06-21, Hours : 3:00 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-20 09:38:47', '2025-06-20 09:38:47'),
(940, 1, '2025-06-24', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.119.74', '2025-06-24 14:09:54', '2025-06-24 14:09:54'),
(941, 1, '2025-06-24', 'staff', 102, 'created staff Vikas Yadav', 'Super Admin System Super Super Admin created staff Vikas Yadav ', 'created', '27.59.126.76', '2025-06-24 14:10:14', '2025-06-24 14:10:14'),
(942, 1, '2025-06-26', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-06-26 11:39:44', '2025-06-26 11:39:44'),
(943, 1, '2025-06-26', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2025-06-23, Hours : 6:00 Date: 2025-06-24, Hours : 5:00 Date: 2025-06-25, Hours : 5:00 Date: 2025-06-26, Hours : 5:00 Date: 2025-06-27, Hours : 5:00 ,Job code:Training, Task name:Onboarding and Task type:Internal,  Date: 2025-06-23, Hours : 5:00 Date: 2025-06-24, Hours : 5:00 Date: 2025-06-25, Hours : 5:00 Date: 2025-06-26, Hours : 5:00 ,Job code:Training, Task name:Onboarding', 'Super Admin System Super Super Admin created a timesheet entry. Task type:Internal,  Date: 2025-06-23, Hours : 6:00 Date: 2025-06-24, Hours : 5:00 Date: 2025-06-25, Hours : 5:00 Date: 2025-06-26, Hours : 5:00 Date: 2025-06-27, Hours : 5:00 ,Job code:Training, Task name:Onboarding and Task type:Internal,  Date: 2025-06-23, Hours : 5:00 Date: 2025-06-24, Hours : 5:00 Date: 2025-06-25, Hours : 5:00 Date: 2025-06-26, Hours : 5:00 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-26 11:40:49', '2025-06-26 11:40:49'),
(944, 1, '2025-06-26', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.126.76', '2025-06-26 12:55:06', '2025-06-26 12:55:06'),
(945, 1, '2025-06-26', 'timesheet', 0, 'deleted a timesheet entry. Task type:Internal ,Job code:Training, Task name:Onboarding and Task type:Internal ,Job code:Training, Task name:Onboarding', 'Super Admin System Super Super Admin deleted a timesheet entry. Task type:Internal ,Job code:Training, Task name:Onboarding and Task type:Internal ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-26 12:55:35', '2025-06-26 12:55:35'),
(946, 1, '2025-06-26', 'customer', 92, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_GE _000073(GE ACCOUNTANCY LTD)', 'created', '27.60.14.114', '2025-06-26 12:56:55', '2025-06-26 12:56:55'),
(947, 1, '2025-06-26', 'customer', 92, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_GE _000073(GE ACCOUNTANCY LTD)', 'updated', '27.60.14.114', '2025-06-26 12:57:14', '2025-06-26 12:57:14'),
(948, 1, '2025-06-26', 'client', 51, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_GE _Nor_000047(Northbridge Trading Group12)', 'created', '27.60.14.114', '2025-06-26 12:59:20', '2025-06-26 12:59:20'),
(949, 1, '2025-06-26', 'job', 21, 'created job code:', 'Super Admin System Super Super Admin created job code: GE _Nor_Book_000021', 'created', '27.60.14.114', '2025-06-26 13:01:40', '2025-06-26 13:01:40'),
(950, 1, '2025-06-26', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2025-06-23, Hours : 2:00 Date: 2025-06-24, Hours : 2:00 Date: 2025-06-25, Hours : 2:00 Date: 2025-06-26, Hours : 2:00 Date: 2025-06-27, Hours : 2:00 Date: 2025-06-28, Hours : 2:00 ,Job code:GE _Nor_Book_000021, Task name:test', 'Super Admin System Super Super Admin created a timesheet entry. Task type:External,  Date: 2025-06-23, Hours : 2:00 Date: 2025-06-24, Hours : 2:00 Date: 2025-06-25, Hours : 2:00 Date: 2025-06-26, Hours : 2:00 Date: 2025-06-27, Hours : 2:00 Date: 2025-06-28, Hours : 2:00 ,Job code:GE _Nor_Book_000021, Task name:test ', 'updated', '0.0.0.0', '2025-06-26 13:03:32', '2025-06-26 13:03:32'),
(951, 1, '2025-06-26', 'timesheet', 0, 'submitted a timesheet entry. Task type:External,  ,Job code:GE _Nor_Book_000021, Task name:test', 'Super Admin System Super Super Admin submitted a timesheet entry. Task type:External,  ,Job code:GE _Nor_Book_000021, Task name:test ', 'updated', '0.0.0.0', '2025-06-26 13:03:47', '2025-06-26 13:03:47'),
(952, 1, '2025-06-26', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '27.60.14.114', '2025-06-26 13:08:12', '2025-06-26 13:08:12'),
(953, 1, '2025-06-26', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.60.14.114', '2025-06-26 13:21:13', '2025-06-26 13:21:13'),
(954, 1, '2025-06-26', 'staff', 103, 'created staff Shakir test test', 'Super Admin System Super Super Admin created staff Shakir test test ', 'created', '27.60.14.114', '2025-06-26 13:22:44', '2025-06-26 13:22:44'),
(955, 1, '2025-06-26', 'staff', 103, 'edited staff Shakir test test', 'Super Admin System Super Super Admin edited staff Shakir test test ', 'updated', '27.60.14.114', '2025-06-26 13:23:48', '2025-06-26 13:23:48'),
(956, 1, '2025-06-26', 'staff', 103, 'edited staff Shakir test test', 'Super Admin System Super Super Admin edited staff Shakir test test ', 'updated', '27.60.14.114', '2025-06-26 13:24:23', '2025-06-26 13:24:23'),
(957, 103, '2025-06-26', '-', 0, ' Logged In', 'Account Manager Shakir test test  Logged In ', '-', NULL, '2025-06-26 13:24:35', '2025-06-26 13:24:35'),
(958, 1, '2025-06-26', 'customer', 93, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_H. _000074(H. CAMPBELL LLC)', 'created', '27.60.14.114', '2025-06-26 13:27:07', '2025-06-26 13:27:07'),
(959, 1, '2025-06-26', 'customer', 93, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_H. _000074(H. CAMPBELL LLC)', 'updated', '27.60.14.114', '2025-06-26 13:27:14', '2025-06-26 13:27:14'),
(960, 103, '2025-06-26', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2025-06-23, Hours : 5:50 Date: 2025-06-24, Hours : 4:50 Date: 2025-06-25, Hours : 3:59 Date: 2025-06-26, Hours : 4:00 Date: 2025-06-27, Hours : 6:00 Date: 2025-06-28, Hours : 7:00 ,Job code:Training, Task name:Onboarding', 'Account Manager Shakir test test created a timesheet entry. Task type:Internal,  Date: 2025-06-23, Hours : 5:50 Date: 2025-06-24, Hours : 4:50 Date: 2025-06-25, Hours : 3:59 Date: 2025-06-26, Hours : 4:00 Date: 2025-06-27, Hours : 6:00 Date: 2025-06-28, Hours : 7:00 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-06-26 14:56:46', '2025-06-26 14:56:46'),
(961, 103, '2025-06-26', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2025-06-24, Hours : 8:00 Date: 2025-06-25, Hours : 8:00 ,Job code:Leave, Task name:Sick Leave', 'Account Manager Shakir test test created a timesheet entry. Task type:Internal,  Date: 2025-06-24, Hours : 8:00 Date: 2025-06-25, Hours : 8:00 ,Job code:Leave, Task name:Sick Leave ', 'updated', '0.0.0.0', '2025-06-26 14:57:23', '2025-06-26 14:57:23'),
(962, 103, '2025-06-26', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  ,Job code:Training, Task name:Onboarding and Task type:Internal,  ,Job code:Leave, Task name:Sick Leave', 'Account Manager Shakir test test submitted a timesheet entry. Task type:Internal,  ,Job code:Training, Task name:Onboarding and Task type:Internal,  ,Job code:Leave, Task name:Sick Leave ', 'updated', '0.0.0.0', '2025-06-26 14:57:35', '2025-06-26 14:57:35'),
(963, 103, '2025-06-26', '-', 0, ' Logged Out', 'Account Manager Shakir test test  Logged Out ', '-', '27.60.14.114', '2025-06-26 14:58:40', '2025-06-26 14:58:40'),
(964, 102, '2025-06-26', '-', 0, ' Logged In', 'Processor Vikas Yadav  Logged In ', '-', '27.60.14.114', '2025-06-26 14:58:49', '2025-06-26 14:58:49'),
(965, 1, '2025-06-30', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.60.14.114', '2025-06-30 09:05:26', '2025-06-30 09:05:26'),
(966, 1, '2025-07-08', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-07-08 10:48:44', '2025-07-08 10:48:44'),
(967, 1, '2025-07-08', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.116.52', '2025-07-08 10:50:39', '2025-07-08 10:50:39'),
(968, 1, '2025-07-10', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-07-10 11:26:26', '2025-07-10 11:26:26'),
(969, 1, '2025-07-10', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.116.52', '2025-07-10 11:31:24', '2025-07-10 11:31:24'),
(970, 36, '2025-07-10', '-', 0, ' Logged In', 'Management vikas for testing  Logged In ', '-', NULL, '2025-07-10 11:35:55', '2025-07-10 11:35:55'),
(971, 36, '2025-07-10', 'customer', 94, 'created customer profile. customer code :', 'Management vikas for testing created customer profile. customer code : cust_ATO_000075(ATOMIC 42 LTD)', 'created', '171.79.39.139', '2025-07-10 11:36:40', '2025-07-10 11:36:40'),
(972, 36, '2025-07-10', 'customer', 94, ' edited the service details and added an additional service while editing the customer code :', 'Management vikas for testing  edited the service details and added an additional service while editing the customer code : cust_ATO_000075(ATOMIC 42 LTD)', 'updated', '171.79.39.139', '2025-07-10 11:37:55', '2025-07-10 11:37:55'),
(973, 36, '2025-07-10', 'client', 52, 'created client profile. client code :', 'Management vikas for testing created client profile. client code : cli_ATO_BIS_000048(BISHOPS DAL ENERGY STORAGE LIMITED)', 'created', '171.79.39.139', '2025-07-10 11:39:46', '2025-07-10 11:39:46'),
(974, 36, '2025-07-10', 'job', 22, 'created job code:', 'Management vikas for testing created job code: ATO_BIS_VAT _000022', 'created', '171.79.39.139', '2025-07-10 11:40:46', '2025-07-10 11:40:46'),
(975, 36, '2025-07-10', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2025-07-10, Hours : 1:50 ,Job code:ATO_BIS_VAT _000022, Task name:ABC', 'Management vikas for testing created a timesheet entry. Task type:External,  Date: 2025-07-10, Hours : 1:50 ,Job code:ATO_BIS_VAT _000022, Task name:ABC ', 'updated', '0.0.0.0', '2025-07-10 11:45:39', '2025-07-10 11:45:39'),
(976, 36, '2025-07-10', 'client', 53, 'created client profile. client code :', 'Management vikas for testing created client profile. client code : cli_ATO_Mer_000049(Merchant’s Haven Ltd.)', 'created', '171.79.39.139', '2025-07-10 11:46:03', '2025-07-10 11:46:03'),
(977, 36, '2025-07-10', 'checklist', 4, 'edited checklist Checklist (3)', 'Management vikas for testing edited checklist Checklist (3) ', 'updated', '171.79.39.139', '2025-07-10 11:48:00', '2025-07-10 11:48:00'),
(978, 36, '2025-07-10', 'job', 23, 'created job code:', 'Management vikas for testing created job code: ATO_Mer_VAT _000023', 'created', '171.79.39.139', '2025-07-10 11:48:37', '2025-07-10 11:48:37'),
(979, 36, '2025-07-10', 'job', 23, 'updated the job status from WIP – To Be Reviewed to WIP – Processing. job code:', 'Management vikas for testing updated the job status from WIP – To Be Reviewed to WIP – Processing. job code: ATO_Mer_VAT _000023', 'updated', '171.79.39.139', '2025-07-10 11:49:03', '2025-07-10 11:49:03'),
(980, 36, '2025-07-10', 'job', 22, 'edited the job information and has assigned the job to the processor, Sunny  Thoriya job code:', 'Management vikas for testing edited the job information and has assigned the job to the processor, Sunny  Thoriya job code: ATO_BIS_VAT _000022', 'updated', '171.79.39.139', '2025-07-10 11:49:19', '2025-07-10 11:49:19'),
(981, 36, '2025-07-10', 'job', 22, 'updated the job status from WIP – Processing to Complete - Draft Sent. job code:', 'Management vikas for testing updated the job status from WIP – Processing to Complete - Draft Sent. job code: ATO_BIS_VAT _000022', 'updated', '171.79.39.139', '2025-07-10 11:50:52', '2025-07-10 11:50:52'),
(982, 36, '2025-07-10', 'job', 22, 'updated the job status from Complete - Draft Sent to WIP – Processing. job code:', 'Management vikas for testing updated the job status from Complete - Draft Sent to WIP – Processing. job code: ATO_BIS_VAT _000022', 'updated', '171.79.39.139', '2025-07-10 11:52:40', '2025-07-10 11:52:40'),
(983, 36, '2025-07-10', 'job', 22, 'updated the job status from WIP – Processing to Complete - Draft Sent. job code:', 'Management vikas for testing updated the job status from WIP – Processing to Complete - Draft Sent. job code: ATO_BIS_VAT _000022', 'updated', '171.79.39.139', '2025-07-10 11:53:45', '2025-07-10 11:53:45'),
(984, 36, '2025-07-10', 'job', 23, 'updated the job status from WIP – Processing to Complete - Draft Sent. job code:', 'Management vikas for testing updated the job status from WIP – Processing to Complete - Draft Sent. job code: ATO_Mer_VAT _000023', 'updated', '171.79.39.139', '2025-07-10 11:54:00', '2025-07-10 11:54:00'),
(985, 36, '2025-07-10', 'job', 23, 'updated the job status from Complete - Draft Sent to WIP – Processing. job code:', 'Management vikas for testing updated the job status from Complete - Draft Sent to WIP – Processing. job code: ATO_Mer_VAT _000023', 'updated', '171.79.39.139', '2025-07-10 11:54:34', '2025-07-10 11:54:34'),
(986, 36, '2025-07-10', '-', 0, ' Logged In', 'Management vikas for testing  Logged In ', '-', NULL, '2025-07-10 11:57:35', '2025-07-10 11:57:35'),
(987, 34, '2025-07-10', '-', 0, ' Logged In', 'Account Manager vikas for test  Logged In ', '-', NULL, '2025-07-10 12:01:01', '2025-07-10 12:01:01'),
(988, 34, '2025-07-10', 'job', 23, 'updated the job status from WIP – Processing to Complete - Draft Sent. job code:', 'Account Manager vikas for test updated the job status from WIP – Processing to Complete - Draft Sent. job code: ATO_Mer_VAT _000023', 'updated', '171.79.39.139', '2025-07-10 12:09:29', '2025-07-10 12:09:29'),
(989, 34, '2025-07-10', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 0:00 ,Job code:ATO_Mer_VAT _000023, Task name:ABC', 'Account Manager vikas for test created a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 0:00 ,Job code:ATO_Mer_VAT _000023, Task name:ABC ', 'updated', '0.0.0.0', '2025-07-10 12:10:53', '2025-07-10 12:10:53'),
(990, 34, '2025-07-10', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 1:09 ,Job code:ATO_Mer_VAT _000023, Task name:ABC and deleted a timesheet entry. Task type:External ,Job code:ATO_Mer_VAT _000023, Task name:ABC', 'Account Manager vikas for test created a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 1:09 ,Job code:ATO_Mer_VAT _000023, Task name:ABC and deleted a timesheet entry. Task type:External ,Job code:ATO_Mer_VAT _000023, Task name:ABC ', 'updated', '0.0.0.0', '2025-07-10 12:11:54', '2025-07-10 12:11:54'),
(991, 34, '2025-07-10', 'timesheet', 0, 'edited a timesheet entry. Task type:External,  Date: 2025-07-08, Updated hours : 2:90 ,Job code:ATO_Mer_VAT _000023, Task name:ABC', 'Account Manager vikas for test edited a timesheet entry. Task type:External,  Date: 2025-07-08, Updated hours : 2:90 ,Job code:ATO_Mer_VAT _000023, Task name:ABC ', 'updated', '0.0.0.0', '2025-07-10 12:12:08', '2025-07-10 12:12:08'),
(992, 34, '2025-07-10', 'timesheet', 0, 'edited a timesheet entry. Task type:External,  Date: 2025-07-09, Updated hours : 0:30 ,Job code:ATO_Mer_VAT _000023, Task name:ABC', 'Account Manager vikas for test edited a timesheet entry. Task type:External,  Date: 2025-07-09, Updated hours : 0:30 ,Job code:ATO_Mer_VAT _000023, Task name:ABC ', 'updated', '0.0.0.0', '2025-07-10 12:12:20', '2025-07-10 12:12:20'),
(993, 36, '2025-07-10', '-', 0, ' Logged In', 'Management vikas for testing  Logged In ', '-', NULL, '2025-07-10 12:14:13', '2025-07-10 12:14:13'),
(994, 36, '2025-07-10', '-', 0, ' Logged Out', 'Management vikas for testing  Logged Out ', '-', '122.168.114.106', '2025-07-10 12:14:33', '2025-07-10 12:14:33'),
(995, 36, '2025-07-10', '-', 0, ' Logged Out', 'Management vikas for testing  Logged Out ', '-', '122.168.114.106', '2025-07-10 12:14:37', '2025-07-10 12:14:37'),
(996, 36, '2025-07-10', '-', 0, ' Logged In', 'Management vikas for testing  Logged In ', '-', '122.168.114.106', '2025-07-10 12:14:40', '2025-07-10 12:14:40'),
(997, 34, '2025-07-10', 'timesheet', 0, 'edited a timesheet entry. Task type:External,  Date: 2025-07-10, Updated hours : 12:00 ,Job code:ATO_Mer_VAT _000023, Task name:ABC', 'Account Manager vikas for test edited a timesheet entry. Task type:External,  Date: 2025-07-10, Updated hours : 12:00 ,Job code:ATO_Mer_VAT _000023, Task name:ABC ', 'updated', '0.0.0.0', '2025-07-10 12:28:43', '2025-07-10 12:28:43'),
(998, 34, '2025-07-10', 'timesheet', 0, 'edited a timesheet entry. Task type:External,  Date: 2025-07-11, Updated hours : 3:00 ,Job code:ATO_Mer_VAT _000023, Task name:ABC', 'Account Manager vikas for test edited a timesheet entry. Task type:External,  Date: 2025-07-11, Updated hours : 3:00 ,Job code:ATO_Mer_VAT _000023, Task name:ABC ', 'updated', '0.0.0.0', '2025-07-10 12:28:49', '2025-07-10 12:28:49'),
(999, 34, '2025-07-10', 'timesheet', 0, 'edited a timesheet entry. Task type:External,  Date: 2025-07-12, Updated hours : 2:00 ,Job code:ATO_Mer_VAT _000023, Task name:ABC', 'Account Manager vikas for test edited a timesheet entry. Task type:External,  Date: 2025-07-12, Updated hours : 2:00 ,Job code:ATO_Mer_VAT _000023, Task name:ABC ', 'updated', '0.0.0.0', '2025-07-10 12:28:56', '2025-07-10 12:28:56'),
(1000, 34, '2025-07-10', 'timesheet', 0, 'submitted a timesheet entry. Task type:External,  ,Job code:ATO_Mer_VAT _000023, Task name:ABC', 'Account Manager vikas for test submitted a timesheet entry. Task type:External,  ,Job code:ATO_Mer_VAT _000023, Task name:ABC ', 'updated', '0.0.0.0', '2025-07-10 12:29:11', '2025-07-10 12:29:11'),
(1001, 34, '2025-07-10', 'staff', 34, 'edited staff vikas for test', 'Account Manager vikas for test edited staff vikas for test ', 'updated', '171.79.39.139', '2025-07-10 12:32:21', '2025-07-10 12:32:21'),
(1002, 36, '2025-07-10', '-', 0, ' Logged Out', 'Management vikas for testing  Logged Out ', '-', '122.168.114.106', '2025-07-10 13:30:04', '2025-07-10 13:30:04'),
(1003, 36, '2025-07-10', '-', 0, ' Logged In', 'Management vikas for testing  Logged In ', '-', '122.168.114.106', '2025-07-10 13:31:13', '2025-07-10 13:31:13'),
(1004, 36, '2025-07-10', 'timesheet', 0, 'submitted a timesheet entry. Task type:External,  Date: 2025-07-07, Updated hours : 8:00 Date: 2025-07-08, Updated hours : 8:00 Date: 2025-07-09, Updated hours : 9:00 Date: 2025-07-10, Updated hours : 12:00 ,Job code:ATO_BIS_VAT _000022, Task name:ABC', 'Management vikas for testing submitted a timesheet entry. Task type:External,  Date: 2025-07-07, Updated hours : 8:00 Date: 2025-07-08, Updated hours : 8:00 Date: 2025-07-09, Updated hours : 9:00 Date: 2025-07-10, Updated hours : 12:00 ,Job code:ATO_BIS_VAT _000022, Task name:ABC ', 'updated', '0.0.0.0', '2025-07-10 13:34:35', '2025-07-10 13:34:35'),
(1005, 36, '2025-07-10', '-', 0, ' Logged Out', 'Management vikas for testing  Logged Out ', '-', '122.168.114.106', '2025-07-10 13:35:36', '2025-07-10 13:35:36'),
(1006, 36, '2025-07-10', '-', 0, ' Logged In', 'Management vikas for testing  Logged In ', '-', '122.168.114.106', '2025-07-10 13:35:42', '2025-07-10 13:35:42'),
(1007, 34, '2025-07-10', '-', 0, ' Logged Out', 'Account Manager vikas for test  Logged Out ', '-', '171.79.39.139', '2025-07-10 13:57:17', '2025-07-10 13:57:17'),
(1008, 36, '2025-07-10', '-', 0, ' Logged In', 'Management vikas for testing  Logged In ', '-', '171.79.39.139', '2025-07-10 13:57:30', '2025-07-10 13:57:30'),
(1009, 36, '2025-07-10', 'job', 22, 'completed the draft for job code:', 'Management vikas for testing completed the draft for job code: ATO_BIS_VAT _000022', 'created', '171.79.39.139', '2025-07-10 13:58:24', '2025-07-10 13:58:24'),
(1010, 36, '2025-07-10', 'job', 22, 'updated the job status from Completed - Opening Balances Adjusted to WIP – In Queries. job code:', 'Management vikas for testing updated the job status from Completed - Opening Balances Adjusted to WIP – In Queries. job code: ATO_BIS_VAT _000022', 'updated', '171.79.39.139', '2025-07-10 13:58:41', '2025-07-10 13:58:41'),
(1011, 36, '2025-07-10', 'job', 22, 'completed the draft for job code:', 'Management vikas for testing completed the draft for job code: ATO_BIS_VAT _000022', 'created', '171.79.39.139', '2025-07-10 13:58:53', '2025-07-10 13:58:53'),
(1012, 36, '2025-07-10', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 1:90 ,Job code:ATO_Mer_VAT _000023, Task name:ABC, Task type:Internal,  Date: 2025-07-07, Hours : 2:90 Date: 2025-07-08, Hours : 2:40 Date: 2025-07-09, Hours : 4:60 Date: 2025-07-10, Hours : 23:00 Date: 2025-07-11, Hours : 2:00 ,Job code:Training, Task name:Onboarding and Task type:Internal,  Date: 2025-07-07, Hours : 22:00 Date: 2025-07-09, Hours : 4:00 ,Job code:Leave, Task name:Sick Leave', 'Management vikas for testing created a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 1:90 ,Job code:ATO_Mer_VAT _000023, Task name:ABC, Task type:Internal,  Date: 2025-07-07, Hours : 2:90 Date: 2025-07-08, Hours : 2:40 Date: 2025-07-09, Hours : 4:60 Date: 2025-07-10, Hours : 23:00 Date: 2025-07-11, Hours : 2:00 ,Job code:Training, Task name:Onboarding and Task type:Internal,  Date: 2025-07-07, Hours : 22:00 Date: 2025-07-09, Hours : 4:00 ,Job code:Leave, Task name:Sick Leave ', 'updated', '0.0.0.0', '2025-07-10 14:04:17', '2025-07-10 14:04:17'),
(1013, 36, '2025-07-10', 'job', 24, 'created job code:', 'Management vikas for testing created job code: MED_IJ _Supp_000024', 'created', '171.79.39.139', '2025-07-10 14:04:53', '2025-07-10 14:04:53'),
(1014, 36, '2025-07-10', 'job', 24, 'sent the missing logs for job code:', 'Management vikas for testing sent the missing logs for job code: MED_IJ _Supp_000024', 'created', '171.79.39.139', '2025-07-10 14:05:20', '2025-07-10 14:05:20'),
(1015, 36, '2025-07-10', 'job', 24, 'completed the missing logs job code:', 'Management vikas for testing completed the missing logs job code: MED_IJ _Supp_000024', 'updated', '171.79.39.139', '2025-07-10 14:05:48', '2025-07-10 14:05:48'),
(1016, 36, '2025-07-10', 'job', 24, 'completed the draft for job code:', 'Management vikas for testing completed the draft for job code: MED_IJ _Supp_000024', 'created', '171.79.39.139', '2025-07-10 14:06:21', '2025-07-10 14:06:21'),
(1017, 36, '2025-07-10', 'job', 24, 'edited the job other tasks job code:', 'Management vikas for testing edited the job other tasks job code: MED_IJ _Supp_000024', 'updated', '171.79.39.139', '2025-07-10 14:07:21', '2025-07-10 14:07:21'),
(1018, 36, '2025-07-10', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 1:00 Date: 2025-07-08, Hours : 11:00 Date: 2025-07-09, Hours : 2:70 Date: 2025-07-10, Hours : 3:90 Date: 2025-07-12, Hours : 3:90 ,Job code:MED_IJ _Supp_000024, Task name:ABC', 'Management vikas for testing created a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 1:00 Date: 2025-07-08, Hours : 11:00 Date: 2025-07-09, Hours : 2:70 Date: 2025-07-10, Hours : 3:90 Date: 2025-07-12, Hours : 3:90 ,Job code:MED_IJ _Supp_000024, Task name:ABC ', 'updated', '0.0.0.0', '2025-07-10 14:08:36', '2025-07-10 14:08:36'),
(1019, 36, '2025-07-10', 'timesheet', 0, 'submitted a timesheet entry. Task type:External,  ,Job code:ATO_Mer_VAT _000023, Task name:ABC, Task type:Internal,  ,Job code:Training, Task name:Onboarding, Task type:Internal,  ,Job code:Leave, Task name:Sick Leave and Task type:External,  ,Job code:MED_IJ _Supp_000024, Task name:ABC', 'Management vikas for testing submitted a timesheet entry. Task type:External,  ,Job code:ATO_Mer_VAT _000023, Task name:ABC, Task type:Internal,  ,Job code:Training, Task name:Onboarding, Task type:Internal,  ,Job code:Leave, Task name:Sick Leave and Task type:External,  ,Job code:MED_IJ _Supp_000024, Task name:ABC ', 'updated', '0.0.0.0', '2025-07-10 14:09:00', '2025-07-10 14:09:00'),
(1020, 36, '2025-07-10', '-', 0, ' Logged Out', 'Management vikas for testing  Logged Out ', '-', '171.79.39.139', '2025-07-10 14:12:22', '2025-07-10 14:12:22'),
(1021, 1, '2025-07-10', 'staff', 34, 'edited staff vikas for test', 'Super Admin System Super Super Admin edited staff vikas for test ', 'updated', '171.79.39.139', '2025-07-10 14:12:56', '2025-07-10 14:12:56'),
(1022, 36, '2025-07-10', '-', 0, ' Logged In', 'Management vikas for testing  Logged In ', '-', '171.79.39.139', '2025-07-10 14:13:36', '2025-07-10 14:13:36'),
(1023, 36, '2025-07-10', '-', 0, ' Logged Out', 'Management vikas for testing  Logged Out ', '-', '171.79.39.139', '2025-07-10 14:14:12', '2025-07-10 14:14:12'),
(1024, 34, '2025-07-10', '-', 0, ' Logged In', 'Account Manager vikas for test  Logged In ', '-', '171.79.39.139', '2025-07-10 14:14:23', '2025-07-10 14:14:23'),
(1025, 34, '2025-07-10', 'customer', 94, 'edited the company information customer code :', 'Account Manager vikas for test edited the company information customer code : cust_ATO_000075(ATOMIC 42 LTD)', 'updated', '171.79.39.139', '2025-07-10 14:16:32', '2025-07-10 14:16:32'),
(1026, 34, '2025-07-10', 'customer', 94, 'edited the service details customer code :', 'Account Manager vikas for test edited the service details customer code : cust_ATO_000075(ATOMIC 42 LTD)', 'updated', '171.79.39.139', '2025-07-10 14:18:47', '2025-07-10 14:18:47'),
(1027, 34, '2025-07-10', 'customer', 94, 'added Percentage Model, added Adhoc/PAYG/Hourly and Removed FTE/Dedicated Staffing (engagement model) customer code :', 'Account Manager vikas for test added Percentage Model, added Adhoc/PAYG/Hourly and Removed FTE/Dedicated Staffing (engagement model) customer code : cust_ATO_000075(ATOMIC 42 LTD)', 'updated', '171.79.39.139', '2025-07-10 14:19:15', '2025-07-10 14:19:15'),
(1028, 30, '2025-07-10', '-', 0, ' Logged In', 'Account Manager Vikas test  Logged In ', '-', NULL, '2025-07-10 14:20:37', '2025-07-10 14:20:37'),
(1029, 30, '2025-07-10', 'job', 25, 'created job code:', 'Account Manager Vikas test created job code: ATO_BIS_Prep_000025', 'created', '171.79.39.139', '2025-07-10 14:22:14', '2025-07-10 14:22:14'),
(1030, 30, '2025-07-10', 'job', 25, 'updated the job status from WIP – Processing to Completed - Draft Sent. job code:', 'Account Manager Vikas test updated the job status from WIP – Processing to Completed - Draft Sent. job code: ATO_BIS_Prep_000025', 'updated', '171.79.39.139', '2025-07-10 14:22:29', '2025-07-10 14:22:29'),
(1031, 30, '2025-07-10', 'timesheet', 0, 'submitted a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 1:00 Date: 2025-07-08, Hours : 1:09 Date: 2025-07-09, Hours : 3:05 Date: 2025-07-10, Hours : 3:30 Date: 2025-07-11, Hours : 4:40 Date: 2025-07-12, Hours : 5:45 ,Job code:ATO_BIS_Prep_000025, Task name:Employment Income, Task type:External,  Date: 2025-07-07, Hours : 2:00 Date: 2025-07-08, Hours : 3:00 Date: 2025-07-09, Hours : 4:00 Date: 2025-07-10, Hours : 3:00 Date: 2025-07-11, Hours : 02:00 ,Job code:ATO_BIS_Prep_000025, Task name:Self-Employment Income and Task type:External,  Date: 2025-07-07, Hours : 5:00 Date: 2025-07-08, Hours : 3:00 Date: 2025-07-09, Hours : 3:00 Date: 2025-07-10, Hours : 5:00 Date: 2025-07-11, Hours : 4:00 Date: 2025-07-12, Hours : 5:00 ,Job code:ATO_BIS_Prep_000025, Task name:Property Income', 'Account Manager Vikas test submitted a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 1:00 Date: 2025-07-08, Hours : 1:09 Date: 2025-07-09, Hours : 3:05 Date: 2025-07-10, Hours : 3:30 Date: 2025-07-11, Hours : 4:40 Date: 2025-07-12, Hours : 5:45 ,Job code:ATO_BIS_Prep_000025, Task name:Employment Income, Task type:External,  Date: 2025-07-07, Hours : 2:00 Date: 2025-07-08, Hours : 3:00 Date: 2025-07-09, Hours : 4:00 Date: 2025-07-10, Hours : 3:00 Date: 2025-07-11, Hours : 02:00 ,Job code:ATO_BIS_Prep_000025, Task name:Self-Employment Income and Task type:External,  Date: 2025-07-07, Hours : 5:00 Date: 2025-07-08, Hours : 3:00 Date: 2025-07-09, Hours : 3:00 Date: 2025-07-10, Hours : 5:00 Date: 2025-07-11, Hours : 4:00 Date: 2025-07-12, Hours : 5:00 ,Job code:ATO_BIS_Prep_000025, Task name:Property Income ', 'updated', '0.0.0.0', '2025-07-10 14:27:45', '2025-07-10 14:27:45'),
(1032, 34, '2025-07-10', '-', 0, ' Logged Out', 'Account Manager vikas for test  Logged Out ', '-', '171.79.39.139', '2025-07-10 14:40:35', '2025-07-10 14:40:35'),
(1033, 36, '2025-07-10', '-', 0, ' Logged In', 'Management vikas for testing  Logged In ', '-', '171.79.39.139', '2025-07-10 14:40:46', '2025-07-10 14:40:46'),
(1034, 36, '2025-07-10', 'customer', 78, 'edited the company information customer code :', 'Management vikas for testing edited the company information customer code : cust_MED_000059(MEDICAL SICKNESS ANNUITY AND LIFE ASSURANCE SOCIETY LIMITED(THE)_000059)', 'updated', '171.79.39.139', '2025-07-10 14:42:04', '2025-07-10 14:42:04'),
(1035, 36, '2025-07-10', 'customer', 94, 'edited the service details customer code :', 'Management vikas for testing edited the service details customer code : cust_ATO_000075(ATOMIC 42 LTD)', 'updated', '171.79.39.139', '2025-07-10 14:44:00', '2025-07-10 14:44:00'),
(1036, 36, '2025-07-10', '-', 0, ' Logged Out', 'Management vikas for testing  Logged Out ', '-', '171.79.39.139', '2025-07-10 14:45:04', '2025-07-10 14:45:04'),
(1037, 34, '2025-07-10', '-', 0, ' Logged In', 'Account Manager vikas for test  Logged In ', '-', '171.79.39.139', '2025-07-10 14:45:18', '2025-07-10 14:45:18'),
(1038, 53, '2025-07-10', '-', 0, ' Logged In', 'Account Manager Vivek Singh  Logged In ', '-', NULL, '2025-07-10 14:49:05', '2025-07-10 14:49:05'),
(1039, 53, '2025-07-10', 'customer', 91, 'edited the company information customer code :', 'Account Manager Vivek Singh edited the company information customer code : cust_THE_000072(THE GLOBAL DIALOGUES TRUST)', 'updated', NULL, '2025-07-10 14:49:22', '2025-07-10 14:49:22'),
(1040, 53, '2025-07-10', 'customer', 91, 'edited the service details customer code :', 'Account Manager Vivek Singh edited the service details customer code : cust_THE_000072(THE GLOBAL DIALOGUES TRUST)', 'updated', NULL, '2025-07-10 14:49:24', '2025-07-10 14:49:24');
INSERT INTO `staff_logs` (`id`, `staff_id`, `date`, `module_name`, `module_id`, `log_message`, `log_message_all`, `permission_type`, `ip`, `created_at`, `updated_at`) VALUES
(1041, 34, '2025-07-10', 'customer', 79, 'edited the company information customer code :', 'Account Manager vikas for test edited the company information customer code : cust_M L_000060(M LIMITED_000060)', 'updated', '171.79.39.139', '2025-07-10 14:49:59', '2025-07-10 14:49:59'),
(1042, 34, '2025-07-10', 'customer', 79, 'edited the service details customer code :', 'Account Manager vikas for test edited the service details customer code : cust_M L_000060(M LIMITED_000060)', 'updated', '171.79.39.139', '2025-07-10 14:50:01', '2025-07-10 14:50:01'),
(1043, 53, '2025-07-10', '-', 0, ' Logged Out', 'Account Manager Vivek Singh  Logged Out ', '-', NULL, '2025-07-10 14:51:38', '2025-07-10 14:51:38'),
(1044, 34, '2025-07-10', '-', 0, ' Logged Out', 'Account Manager vikas for test  Logged Out ', '-', '171.79.39.139', '2025-07-10 14:54:13', '2025-07-10 14:54:13'),
(1045, 36, '2025-07-10', '-', 0, ' Logged In', 'Management vikas for testing  Logged In ', '-', '171.79.39.139', '2025-07-10 14:54:22', '2025-07-10 14:54:22'),
(1046, 36, '2025-07-10', '-', 0, ' Logged Out', 'Management vikas for testing  Logged Out ', '-', '171.79.39.139', '2025-07-10 15:01:08', '2025-07-10 15:01:08'),
(1047, 36, '2025-07-10', '-', 0, ' Logged In', 'Management vikas for testing  Logged In ', '-', '171.79.39.139', '2025-07-10 15:01:31', '2025-07-10 15:01:31'),
(1048, 1, '2025-07-11', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.125.175', '2025-07-11 11:45:52', '2025-07-11 11:45:52'),
(1049, 1, '2025-07-11', 'checklist', 6, 'created checklist New', 'Super Admin System Super Super Admin created checklist New ', 'created', '106.207.224.161', '2025-07-11 11:47:04', '2025-07-11 11:47:04'),
(1050, 1, '2025-07-11', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '106.207.225.247', '2025-07-11 14:40:08', '2025-07-11 14:40:08'),
(1051, 1, '2025-07-12', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-07-12 05:56:34', '2025-07-12 05:56:34'),
(1052, 102, '2025-07-12', '-', 0, ' Logged In', 'Processor Vikas Yadav  Logged In ', '-', NULL, '2025-07-12 09:36:08', '2025-07-12 09:36:08'),
(1053, 102, '2025-07-12', '-', 0, ' Logged Out', 'Processor Vikas Yadav  Logged Out ', '-', '122.168.114.106', '2025-07-12 09:36:33', '2025-07-12 09:36:33'),
(1054, 88, '2025-07-12', '-', 0, ' Logged In', 'Account Manager Darshita Trivedi  Logged In ', '-', '122.168.114.106', '2025-07-12 09:36:41', '2025-07-12 09:36:41'),
(1055, 88, '2025-07-12', '-', 0, ' Logged Out', 'Account Manager Darshita Trivedi  Logged Out ', '-', '122.168.114.106', '2025-07-12 09:37:34', '2025-07-12 09:37:34'),
(1056, 1, '2025-07-12', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '106.207.225.247', '2025-07-12 10:32:54', '2025-07-12 10:32:54'),
(1057, 1, '2025-07-12', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '171.79.32.167', '2025-07-12 10:33:17', '2025-07-12 10:33:17'),
(1058, 103, '2025-07-12', '-', 0, ' Logged In', 'Account Manager Shakir test test  Logged In ', '-', '171.79.32.167', '2025-07-12 10:33:29', '2025-07-12 10:33:29'),
(1059, 103, '2025-07-12', 'client', 54, 'created client profile. client code :', 'Account Manager Shakir test test created client profile. client code : cli_H. _Mer_000050(Merchant’s Haven Ltd.)', 'created', '171.79.32.167', '2025-07-12 10:33:54', '2025-07-12 10:33:54'),
(1060, 103, '2025-07-12', 'checklist', 7, 'created checklist Testing new', 'Account Manager Shakir test test created checklist Testing new ', 'created', '171.79.32.167', '2025-07-12 10:34:40', '2025-07-12 10:34:40'),
(1061, 1, '2025-07-12', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-07-12 11:34:43', '2025-07-12 11:34:43'),
(1062, 103, '2025-07-12', '-', 0, ' Logged Out', 'Account Manager Shakir test test  Logged Out ', '-', '171.79.32.167', '2025-07-12 13:23:17', '2025-07-12 13:23:17'),
(1063, 1, '2025-07-12', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.32.167', '2025-07-12 13:23:20', '2025-07-12 13:23:20'),
(1064, 1, '2025-07-12', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '171.79.41.167', '2025-07-12 13:28:20', '2025-07-12 13:28:20'),
(1065, 1, '2025-07-12', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-07-12 13:28:23', '2025-07-12 13:28:23'),
(1066, 1, '2025-07-12', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.41.167', '2025-07-12 13:36:44', '2025-07-12 13:36:44'),
(1067, 1, '2025-07-12', 'staff', 104, 'created staff New staff test', 'Super Admin System Super Super Admin created staff New staff test ', 'created', '171.79.41.167', '2025-07-12 13:37:24', '2025-07-12 13:37:24'),
(1068, 104, '2025-07-12', '-', 0, ' Logged In', 'Management New staff test  Logged In ', '-', NULL, '2025-07-12 13:38:00', '2025-07-12 13:38:01'),
(1069, 104, '2025-07-12', 'customer', 95, 'created customer profile. customer code :', 'Management New staff test created customer profile. customer code : cust_43 _000076(43 AYLESFORD STREET LIMITED test)', 'created', '171.79.41.167', '2025-07-12 13:39:12', '2025-07-12 13:39:12'),
(1070, 104, '2025-07-12', 'customer', 95, ' edited the service details and added an additional service while editing the customer code :', 'Management New staff test  edited the service details and added an additional service while editing the customer code : cust_43 _000076(43 AYLESFORD STREET LIMITED test)', 'updated', '171.79.41.167', '2025-07-12 13:39:32', '2025-07-12 13:39:32'),
(1071, 104, '2025-07-12', 'client', 55, 'created client profile. client code :', 'Management New staff test created client profile. client code : cli_43 _JOH_000051(JOHN J RYAN (SEALING PRODUCTS) LIMITED)', 'created', '171.79.41.167', '2025-07-12 13:40:27', '2025-07-12 13:40:27'),
(1072, 104, '2025-07-12', 'checklist', 8, 'created checklist VAT Review', 'Management New staff test created checklist VAT Review ', 'created', '171.79.41.167', '2025-07-12 13:41:26', '2025-07-12 13:41:26'),
(1073, 104, '2025-07-12', 'job', 26, 'created job code:', 'Management New staff test created job code: 43 _JOH_VAT _000026', 'created', '171.79.41.167', '2025-07-12 13:43:25', '2025-07-12 13:43:25'),
(1074, 104, '2025-07-12', 'checklist', 9, 'edited checklist Checklist', 'Management New staff test edited checklist Checklist ', 'updated', '171.79.41.167', '2025-07-12 13:45:46', '2025-07-12 13:45:46'),
(1075, 104, '2025-07-12', 'job', 27, 'created job code:', 'Management New staff test created job code: 43 _JOH_Book_000027', 'created', '171.79.41.167', '2025-07-12 13:46:36', '2025-07-12 13:46:36'),
(1076, 104, '2025-07-12', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 1:00 Date: 2025-07-08, Hours : 1:00 Date: 2025-07-09, Hours : 1:00 Date: 2025-07-10, Hours : 1:00 Date: 2025-07-11, Hours : 1:00 Date: 2025-07-12, Hours : 1:00 ,Job code:43 _JOH_Book_000027, Task name:Self-Employment Income', 'Management New staff test created a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 1:00 Date: 2025-07-08, Hours : 1:00 Date: 2025-07-09, Hours : 1:00 Date: 2025-07-10, Hours : 1:00 Date: 2025-07-11, Hours : 1:00 Date: 2025-07-12, Hours : 1:00 ,Job code:43 _JOH_Book_000027, Task name:Self-Employment Income ', 'updated', '0.0.0.0', '2025-07-12 13:47:22', '2025-07-12 13:47:22'),
(1077, 104, '2025-07-12', 'timesheet', 0, 'submitted a timesheet entry. Task type:External,  ,Job code:43 _JOH_Book_000027, Task name:Self-Employment Income, Task type:External,  Date: 2025-07-07, Hours : 5:50 Date: 2025-07-08, Hours : 4:00 Date: 2025-07-09, Hours : 8:00 Date: 2025-07-10, Hours : 7:00 Date: 2025-07-11, Hours : 5:00 Date: 2025-07-12, Hours : 7:00 ,Job code:43 _JOH_VAT _000026, Task name:Prepare, Review & File and Task type:Internal,  Date: 2025-07-08, Hours : 2:99 Date: 2025-07-10, Hours : 0:00 Date: 2025-07-11, Hours : 0:00 ,Job code:National Holiday, Task name:Christmas ', 'Management New staff test submitted a timesheet entry. Task type:External,  ,Job code:43 _JOH_Book_000027, Task name:Self-Employment Income, Task type:External,  Date: 2025-07-07, Hours : 5:50 Date: 2025-07-08, Hours : 4:00 Date: 2025-07-09, Hours : 8:00 Date: 2025-07-10, Hours : 7:00 Date: 2025-07-11, Hours : 5:00 Date: 2025-07-12, Hours : 7:00 ,Job code:43 _JOH_VAT _000026, Task name:Prepare, Review & File and Task type:Internal,  Date: 2025-07-08, Hours : 2:99 Date: 2025-07-10, Hours : 0:00 Date: 2025-07-11, Hours : 0:00 ,Job code:National Holiday, Task name:Christmas  ', 'updated', '0.0.0.0', '2025-07-12 13:51:01', '2025-07-12 13:51:01'),
(1078, 103, '2025-07-12', '-', 0, ' Logged In', 'Account Manager Shakir test test  Logged In ', '-', '171.79.39.139', '2025-07-12 13:56:48', '2025-07-12 13:56:48'),
(1079, 1, '2025-07-12', 'permission', 4, ' updated the access for MANAGER. Access Changes  Remove Permission (customer-delete, customer-view, status-view, status-delete, status-update, status-insert, staff-insert, staff-update, staff-delete, staff-view, client-insert, client-update, client-delete, client-view, job-insert, job-update, job-delete, job-view)', 'Super Admin System Super Super Admin  updated the access for MANAGER. Access Changes  Remove Permission (customer-delete, customer-view, status-view, status-delete, status-update, status-insert, staff-insert, staff-update, staff-delete, staff-view, client-insert, client-update, client-delete, client-view, job-insert, job-update, job-delete, job-view) ', 'updated', '171.79.41.167', '2025-07-12 13:57:29', '2025-07-12 13:57:29'),
(1080, 1, '2025-07-12', 'permission', 4, ' updated the access for MANAGER. Access Changes Add Permission (customer-delete, customer-view, status-insert, status-update, status-delete, status-view, job-insert, job-update, client-insert, client-update, staff-update, staff-insert, staff-delete, staff-view, client-view, client-delete, job-delete, job-view) Remove Permission (all_clients-view, all_jobs-view, all_customers-view)', 'Super Admin System Super Super Admin  updated the access for MANAGER. Access Changes Add Permission (customer-delete, customer-view, status-insert, status-update, status-delete, status-view, job-insert, job-update, client-insert, client-update, staff-update, staff-insert, staff-delete, staff-view, client-view, client-delete, job-delete, job-view) Remove Permission (all_clients-view, all_jobs-view, all_customers-view) ', 'updated', '171.79.41.167', '2025-07-12 13:58:42', '2025-07-12 13:58:42'),
(1081, 1, '2025-07-12', 'staff', 104, 'edited staff New staff test', 'Super Admin System Super Super Admin edited staff New staff test ', 'updated', '171.79.41.167', '2025-07-12 13:59:17', '2025-07-12 13:59:17'),
(1082, 102, '2025-07-12', '-', 0, ' Logged In', 'Processor Vikas Yadav  Logged In ', '-', NULL, '2025-07-12 14:00:30', '2025-07-12 14:00:30'),
(1083, 104, '2025-07-12', 'job', 27, 'edited the job information and has assigned the job to the processor, Vikas Yadav job code:', 'Management New staff test edited the job information and has assigned the job to the processor, Vikas Yadav job code: 43 _JOH_Book_000027', 'updated', '171.79.41.167', '2025-07-12 14:01:22', '2025-07-12 14:01:22'),
(1084, 102, '2025-07-12', 'job', 27, 'sent the missing logs for job code:', 'Processor Vikas Yadav sent the missing logs for job code: 43 _JOH_Book_000027', 'created', 'null', '2025-07-12 14:04:10', '2025-07-12 14:04:10'),
(1085, 102, '2025-07-12', 'job', 27, 'completed the missing logs job code:', 'Processor Vikas Yadav completed the missing logs job code: 43 _JOH_Book_000027', 'updated', 'null', '2025-07-12 14:04:39', '2025-07-12 14:04:39'),
(1086, 102, '2025-07-12', 'job', 27, 'updated the job status from On Hold – Missing Paperwork to WIP - Customer Reviewed & To be Updated. job code:', 'Processor Vikas Yadav updated the job status from On Hold – Missing Paperwork to WIP - Customer Reviewed & To be Updated. job code: 43 _JOH_Book_000027', 'updated', NULL, '2025-07-12 14:05:03', '2025-07-12 14:05:03'),
(1087, 68, '2025-07-12', '-', 0, ' Logged In', 'Reviewer Vivek Jangid  Logged In ', '-', NULL, '2025-07-12 14:10:03', '2025-07-12 14:10:03'),
(1088, 104, '2025-07-12', 'job', 27, 'edited the job information and has assigned the job to the reviewer, Vivek Jangid job code:', 'Management New staff test edited the job information and has assigned the job to the reviewer, Vivek Jangid job code: 43 _JOH_Book_000027', 'updated', '171.79.41.167', '2025-07-12 14:10:39', '2025-07-12 14:10:39'),
(1089, 68, '2025-07-12', 'job', 27, 'sent the draft for job code:', 'Reviewer Vivek Jangid sent the draft for job code: 43 _JOH_Book_000027', 'created', '171.79.41.167', '2025-07-12 14:11:39', '2025-07-12 14:11:39'),
(1090, 68, '2025-07-12', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 3:00 Date: 2025-07-08, Hours : 1:00 Date: 2025-07-09, Hours : 01:00 Date: 2025-07-11, Hours : 2:00 ,Job code:43 _JOH_Book_000027, Task name:Employment Income', 'Reviewer Vivek Jangid created a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 3:00 Date: 2025-07-08, Hours : 1:00 Date: 2025-07-09, Hours : 01:00 Date: 2025-07-11, Hours : 2:00 ,Job code:43 _JOH_Book_000027, Task name:Employment Income ', 'updated', '0.0.0.0', '2025-07-12 14:14:09', '2025-07-12 14:14:09'),
(1091, 102, '2025-07-12', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 1:00 Date: 2025-07-08, Hours : 1:00 Date: 2025-07-10, Hours : 2:00 ,Job code:43 _JOH_Book_000027, Task name:Employment Income', 'Processor Vikas Yadav created a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 1:00 Date: 2025-07-08, Hours : 1:00 Date: 2025-07-10, Hours : 2:00 ,Job code:43 _JOH_Book_000027, Task name:Employment Income ', 'updated', '0.0.0.0', '2025-07-12 14:14:39', '2025-07-12 14:14:39'),
(1092, 1, '2025-07-12', 'staff', 102, 'edited staff Vikas Yadav', 'Super Admin System Super Super Admin edited staff Vikas Yadav ', 'updated', '171.79.41.167', '2025-07-12 14:15:36', '2025-07-12 14:15:36'),
(1093, 103, '2025-07-12', 'customer', 96, 'created customer profile. customer code :', 'Account Manager Shakir test test created customer profile. customer code : cust_D01_000077(D01 PARKVIEW HOLDING LIMITED)', 'created', '171.79.41.167', '2025-07-12 14:17:51', '2025-07-12 14:17:51'),
(1094, 103, '2025-07-12', 'customer', 96, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Shakir test test  edited the service details and added an additional service while editing the customer code : cust_D01_000077(D01 PARKVIEW HOLDING LIMITED)', 'updated', '171.79.41.167', '2025-07-12 14:18:02', '2025-07-12 14:18:02'),
(1095, 103, '2025-07-12', 'customer', 93, 'edited the company information customer code :', 'Account Manager Shakir test test edited the company information customer code : cust_H. _000074(H. CAMPBELL LLC)', 'updated', '171.79.41.167', '2025-07-12 14:19:44', '2025-07-12 14:19:44'),
(1096, 103, '2025-07-12', 'customer', 93, 'edited the service details customer code :', 'Account Manager Shakir test test edited the service details customer code : cust_H. _000074(H. CAMPBELL LLC)', 'updated', '171.79.41.167', '2025-07-12 14:19:47', '2025-07-12 14:19:47'),
(1097, 53, '2025-07-12', '-', 0, ' Logged In', 'Account Manager Vivek Singh  Logged In ', '-', NULL, '2025-07-12 14:20:29', '2025-07-12 14:20:29'),
(1098, 103, '2025-07-12', 'customer', 95, 'edited sole trader information. customer code :', 'Account Manager Shakir test test edited sole trader information. customer code : cust_43 _000076(43 AYLESFORD STREET LIMITED test)', 'updated', '171.79.41.167', '2025-07-12 14:21:05', '2025-07-12 14:21:05'),
(1099, 103, '2025-07-12', 'customer', 95, 'edited the service details customer code :', 'Account Manager Shakir test test edited the service details customer code : cust_43 _000076(43 AYLESFORD STREET LIMITED test)', 'updated', '171.79.41.167', '2025-07-12 14:21:07', '2025-07-12 14:21:07'),
(1100, 104, '2025-07-12', 'customer', 97, 'created customer profile. customer code :', 'Management New staff test created customer profile. customer code : cust_Nor_000078(Northbridge Trading Group12)', 'created', '171.79.41.167', '2025-07-12 14:22:21', '2025-07-12 14:22:21'),
(1101, 104, '2025-07-12', 'customer', 97, ' edited the service details and added an additional service while editing the customer code :', 'Management New staff test  edited the service details and added an additional service while editing the customer code : cust_Nor_000078(Northbridge Trading Group12)', 'updated', '171.79.41.167', '2025-07-12 14:22:29', '2025-07-12 14:22:29'),
(1102, 104, '2025-07-12', 'customer', 97, 'edited the partnership information customer code :', 'Management New staff test edited the partnership information customer code : cust_Nor_000078(Northbridge Trading Group12)', 'updated', '171.79.41.167', '2025-07-12 14:23:37', '2025-07-12 14:23:37'),
(1103, 104, '2025-07-12', 'customer', 97, 'edited the service details customer code :', 'Management New staff test edited the service details customer code : cust_Nor_000078(Northbridge Trading Group12)', 'updated', '171.79.41.167', '2025-07-12 14:23:38', '2025-07-12 14:23:38'),
(1104, 1, '2025-07-12', 'staff', 53, 'edited staff Vivek Singh', 'Super Admin System Super Super Admin edited staff Vivek Singh ', 'updated', '171.79.41.167', '2025-07-12 14:27:20', '2025-07-12 14:27:20'),
(1105, 104, '2025-07-12', 'customer', 97, 'edited the service details customer code :', 'Management New staff test edited the service details customer code : cust_Nor_000078(Northbridge Trading Group12)', 'updated', '171.79.41.167', '2025-07-12 14:28:49', '2025-07-12 14:28:49'),
(1106, 104, '2025-07-12', 'customer', 95, 'edited the service details customer code :', 'Management New staff test edited the service details customer code : cust_43 _000076(43 AYLESFORD STREET LIMITED test)', 'updated', '171.79.41.167', '2025-07-12 14:33:56', '2025-07-12 14:33:56'),
(1107, 103, '2025-07-12', 'customer', 96, 'edited the company information customer code :', 'Account Manager Shakir test test edited the company information customer code : cust_D01_000077(D01 PARKVIEW HOLDING LIMITED)', 'updated', '171.79.41.167', '2025-07-12 14:34:56', '2025-07-12 14:34:56'),
(1108, 103, '2025-07-12', 'customer', 96, 'edited the service details customer code :', 'Account Manager Shakir test test edited the service details customer code : cust_D01_000077(D01 PARKVIEW HOLDING LIMITED)', 'updated', '171.79.41.167', '2025-07-12 14:35:02', '2025-07-12 14:35:02'),
(1109, 53, '2025-07-12', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 1:00 Date: 2025-07-08, Hours : 2:50 Date: 2025-07-09, Hours : 3:59 Date: 2025-07-10, Hours : 5:00 Date: 2025-07-11, Hours : 6:00 ,Job code:43 _JOH_Book_000027, Task name:Employment Income, Task type:Internal,  Date: 2025-07-07, Hours : 5:50 Date: 2025-07-08, Hours : 2:00 Date: 2025-07-09, Hours : 3:00 Date: 2025-07-10, Hours : 4:00 Date: 2025-07-11, Hours : 5:00 ,Job code:Training, Task name:Onboarding and Task type:External,  Date: 2025-07-07, Hours : 1:00 Date: 2025-07-08, Hours : 3:00 Date: 2025-07-09, Hours : 4:00 Date: 2025-07-10, Hours : 5:00 Date: 2025-07-11, Hours : 5:00 Date: 2025-07-12, Hours : 5:00 ,Job code:43 _JOH_VAT _000026, Task name:tet', 'Account Manager Vivek Singh created a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 1:00 Date: 2025-07-08, Hours : 2:50 Date: 2025-07-09, Hours : 3:59 Date: 2025-07-10, Hours : 5:00 Date: 2025-07-11, Hours : 6:00 ,Job code:43 _JOH_Book_000027, Task name:Employment Income, Task type:Internal,  Date: 2025-07-07, Hours : 5:50 Date: 2025-07-08, Hours : 2:00 Date: 2025-07-09, Hours : 3:00 Date: 2025-07-10, Hours : 4:00 Date: 2025-07-11, Hours : 5:00 ,Job code:Training, Task name:Onboarding and Task type:External,  Date: 2025-07-07, Hours : 1:00 Date: 2025-07-08, Hours : 3:00 Date: 2025-07-09, Hours : 4:00 Date: 2025-07-10, Hours : 5:00 Date: 2025-07-11, Hours : 5:00 Date: 2025-07-12, Hours : 5:00 ,Job code:43 _JOH_VAT _000026, Task name:tet ', 'updated', '0.0.0.0', '2025-07-12 14:39:34', '2025-07-12 14:39:34'),
(1110, 104, '2025-07-12', 'client', 56, 'created client profile. client code :', 'Management New staff test created client profile. client code : cli_Nor_COR_000052(CORNISH EVERGLADES LIMITED)', 'created', '171.79.41.167', '2025-07-12 14:40:15', '2025-07-12 14:40:15'),
(1111, 104, '2025-07-12', 'job', 28, 'created job code:', 'Management New staff test created job code: Nor_COR_VAT _000028', 'created', '171.79.41.167', '2025-07-12 14:40:54', '2025-07-12 14:40:54'),
(1112, 104, '2025-07-12', 'checklist', 10, 'created checklist company client', 'Management New staff test created checklist company client ', 'created', '171.79.41.167', '2025-07-12 14:43:30', '2025-07-12 14:43:30'),
(1113, 1, '2025-07-12', 'staff', 104, 'edited staff New staff test', 'Super Admin System Super Super Admin edited staff New staff test ', 'updated', '171.79.41.167', '2025-07-12 15:03:33', '2025-07-12 15:03:33'),
(1114, 104, '2025-07-12', '-', 0, ' Logged Out', 'Account Manager New staff test  Logged Out ', '-', '171.79.41.167', '2025-07-12 15:03:55', '2025-07-12 15:03:55'),
(1115, 104, '2025-07-12', '-', 0, ' Logged In', 'Account Manager New staff test  Logged In ', '-', '171.79.41.167', '2025-07-12 15:04:12', '2025-07-12 15:04:12'),
(1116, 1, '2025-07-12', 'staff', 104, 'edited staff New staff test', 'Super Admin System Super Super Admin edited staff New staff test ', 'updated', '171.79.41.167', '2025-07-12 15:05:04', '2025-07-12 15:05:04'),
(1117, 104, '2025-07-12', '-', 0, ' Logged Out', 'Reviewer New staff test  Logged Out ', '-', '171.79.41.167', '2025-07-12 15:05:17', '2025-07-12 15:05:17'),
(1118, 104, '2025-07-12', '-', 0, ' Logged In', 'Reviewer New staff test  Logged In ', '-', '171.79.41.167', '2025-07-12 15:05:26', '2025-07-12 15:05:26'),
(1119, 1, '2025-07-12', 'staff', 104, 'edited staff New staff test', 'Super Admin System Super Super Admin edited staff New staff test ', 'updated', '171.79.41.167', '2025-07-12 15:07:00', '2025-07-12 15:07:00'),
(1120, 104, '2025-07-12', '-', 0, ' Logged Out', 'Management New staff test  Logged Out ', '-', '171.79.41.167', '2025-07-12 15:07:08', '2025-07-12 15:07:08'),
(1121, 104, '2025-07-12', '-', 0, ' Logged In', 'Management New staff test  Logged In ', '-', '171.79.41.167', '2025-07-12 15:07:18', '2025-07-12 15:07:18'),
(1122, 1, '2025-07-14', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-07-14 05:49:57', '2025-07-14 05:49:57'),
(1123, 36, '2025-07-14', '-', 0, ' Logged In', 'Management vikas for testing  Logged In ', '-', '122.168.114.106', '2025-07-14 05:50:05', '2025-07-14 05:50:05'),
(1124, 36, '2025-07-14', '-', 0, ' Logged Out', 'Management vikas for testing  Logged Out ', '-', '122.168.114.106', '2025-07-14 05:51:00', '2025-07-14 05:51:00'),
(1125, 1, '2025-07-14', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-07-14 05:51:02', '2025-07-14 05:51:02'),
(1126, 1, '2025-07-14', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-07-14 09:53:52', '2025-07-14 09:53:52'),
(1127, 1, '2025-07-14', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '27.59.117.37', '2025-07-14 10:05:35', '2025-07-14 10:05:35'),
(1128, 104, '2025-07-14', '-', 0, ' Logged In', 'Management New staff test  Logged In ', '-', '27.59.117.37', '2025-07-14 10:05:44', '2025-07-14 10:05:44'),
(1129, 104, '2025-07-14', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2025-06-30, Hours : 23:00 Date: 2025-07-01, Hours : 19:00 ,Job code:Training, Task name:Onboarding', 'Management New staff test submitted a timesheet entry. Task type:Internal,  Date: 2025-06-30, Hours : 23:00 Date: 2025-07-01, Hours : 19:00 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-07-14 10:06:57', '2025-07-14 10:06:57'),
(1130, 104, '2025-07-14', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2025-07-14, Hours : 12:00 Date: 2025-07-15, Hours : 12:00 Date: 2025-07-16, Hours : 12:00 Date: 2025-07-17, Hours : 6:50 ,Job code:Training, Task name:Onboarding', 'Management New staff test submitted a timesheet entry. Task type:Internal,  Date: 2025-07-14, Hours : 12:00 Date: 2025-07-15, Hours : 12:00 Date: 2025-07-16, Hours : 12:00 Date: 2025-07-17, Hours : 6:50 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-07-14 10:08:42', '2025-07-14 10:08:42'),
(1131, 1, '2025-07-14', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.41.167', '2025-07-14 15:16:41', '2025-07-14 15:16:41'),
(1132, 104, '2025-07-14', '-', 0, ' Logged In', 'Management New staff test  Logged In ', '-', '171.79.41.167', '2025-07-14 15:19:14', '2025-07-14 15:19:14'),
(1133, 103, '2025-07-14', '-', 0, ' Logged Out', 'Account Manager Shakir test test  Logged Out ', '-', '171.79.41.167', '2025-07-14 15:19:37', '2025-07-14 15:19:37'),
(1134, 103, '2025-07-14', '-', 0, ' Logged In', 'Account Manager Shakir test test  Logged In ', '-', '171.79.41.167', '2025-07-14 15:19:42', '2025-07-14 15:19:42'),
(1135, 102, '2025-07-14', '-', 0, ' Logged Out', 'Processor Vikas Yadav  Logged Out ', '-', NULL, '2025-07-14 15:20:12', '2025-07-14 15:20:12'),
(1136, 68, '2025-07-14', '-', 0, ' Logged Out', 'Reviewer Vivek Jangid  Logged Out ', '-', '171.79.41.167', '2025-07-14 15:20:24', '2025-07-14 15:20:24'),
(1137, 53, '2025-07-14', '-', 0, ' Logged Out', 'Account Manager Vivek Singh  Logged Out ', '-', '171.79.41.167', '2025-07-14 15:20:29', '2025-07-14 15:20:29'),
(1138, 102, '2025-07-14', '-', 0, ' Logged In', 'Processor Vikas Yadav  Logged In ', '-', NULL, '2025-07-14 15:20:56', '2025-07-14 15:20:56'),
(1139, 68, '2025-07-14', '-', 0, ' Logged In', 'Reviewer Vivek Jangid  Logged In ', '-', '171.79.41.167', '2025-07-14 15:21:32', '2025-07-14 15:21:32'),
(1140, 104, '2025-07-14', 'customer', 95, 'edited sole trader information. customer code :', 'Management New staff test edited sole trader information. customer code : cust_43 _000076(43 AYLESFORD STREET LIMITED test)', 'updated', '27.60.15.23', '2025-07-14 15:22:00', '2025-07-14 15:22:00'),
(1141, 104, '2025-07-14', 'customer', 95, 'edited the service details customer code :', 'Management New staff test edited the service details customer code : cust_43 _000076(43 AYLESFORD STREET LIMITED test)', 'updated', '27.60.15.23', '2025-07-14 15:22:03', '2025-07-14 15:22:03'),
(1142, 53, '2025-07-14', '-', 0, ' Logged In', 'Account Manager Vivek Singh  Logged In ', '-', '171.79.41.167', '2025-07-14 15:22:51', '2025-07-14 15:22:51'),
(1143, 104, '2025-07-14', 'customer', 95, 'edited sole trader information. customer code :', 'Management New staff test edited sole trader information. customer code : cust_43 _000076(43 AYLESFORD STREET LIMITED test)', 'updated', '27.60.15.23', '2025-07-14 15:23:29', '2025-07-14 15:23:29'),
(1144, 104, '2025-07-14', 'customer', 95, 'edited the service details customer code :', 'Management New staff test edited the service details customer code : cust_43 _000076(43 AYLESFORD STREET LIMITED test)', 'updated', '27.60.15.23', '2025-07-14 15:23:31', '2025-07-14 15:23:31'),
(1145, 104, '2025-07-14', 'customer', 95, 'edited the service details customer code :', 'Management New staff test edited the service details customer code : cust_43 _000076(43 AYLESFORD STREET LIMITED test)', 'updated', '27.60.15.23', '2025-07-14 15:24:26', '2025-07-14 15:24:26'),
(1146, 53, '2025-07-14', 'customer', 95, 'edited the service details customer code :', 'Account Manager Vivek Singh edited the service details customer code : cust_43 _000076(43 AYLESFORD STREET LIMITED test)', 'updated', '27.60.15.23', '2025-07-14 15:25:04', '2025-07-14 15:25:04'),
(1147, 104, '2025-07-14', 'customer', 95, 'edited sole trader information. customer code :', 'Management New staff test edited sole trader information. customer code : cust_43 _000076(43 AYLESFORD STREET LIMITED test)', 'updated', '27.60.15.23', '2025-07-14 15:26:49', '2025-07-14 15:26:49'),
(1148, 104, '2025-07-14', 'customer', 95, 'edited the service details customer code :', 'Management New staff test edited the service details customer code : cust_43 _000076(43 AYLESFORD STREET LIMITED test)', 'updated', '27.60.15.23', '2025-07-14 15:26:51', '2025-07-14 15:26:51'),
(1149, 103, '2025-07-14', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2025-07-14, Hours : 7:11 Date: 2025-07-15, Hours : 7:11 Date: 2025-07-16, Hours : 7:12 Date: 2025-07-17, Hours : 7:15 Date: 2025-07-18, Hours : 14:00 ,Job code:43 _JOH_Book_000027, Task name:Employment Income', 'Account Manager Shakir test test created a timesheet entry. Task type:External,  Date: 2025-07-14, Hours : 7:11 Date: 2025-07-15, Hours : 7:11 Date: 2025-07-16, Hours : 7:12 Date: 2025-07-17, Hours : 7:15 Date: 2025-07-18, Hours : 14:00 ,Job code:43 _JOH_Book_000027, Task name:Employment Income ', 'updated', '0.0.0.0', '2025-07-14 15:29:03', '2025-07-14 15:29:03'),
(1150, 103, '2025-07-14', 'timesheet', 0, 'submitted a timesheet entry. Task type:External,  ,Job code:43 _JOH_Book_000027, Task name:Employment Income', 'Account Manager Shakir test test submitted a timesheet entry. Task type:External,  ,Job code:43 _JOH_Book_000027, Task name:Employment Income ', 'updated', '0.0.0.0', '2025-07-14 15:29:08', '2025-07-14 15:29:08'),
(1151, 103, '2025-07-14', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2025-07-21, Hours : 12:00 Date: 2025-07-22, Hours : 12:00 Date: 2025-07-23, Hours : 12:00 Date: 2025-07-24, Hours : 6:30 ,Job code:Training, Task name:Onboarding', 'Account Manager Shakir test test submitted a timesheet entry. Task type:Internal,  Date: 2025-07-21, Hours : 12:00 Date: 2025-07-22, Hours : 12:00 Date: 2025-07-23, Hours : 12:00 Date: 2025-07-24, Hours : 6:30 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-07-14 15:30:51', '2025-07-14 15:30:51'),
(1152, 103, '2025-07-14', 'timesheet', 0, 'submitted a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 12:00 Date: 2025-07-08, Hours : 12:00 Date: 2025-07-09, Hours : 12:00 Date: 2025-07-10, Hours : 6:30 ,Job code:43 _JOH_Book_000027, Task name:Employment Income', 'Account Manager Shakir test test submitted a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 12:00 Date: 2025-07-08, Hours : 12:00 Date: 2025-07-09, Hours : 12:00 Date: 2025-07-10, Hours : 6:30 ,Job code:43 _JOH_Book_000027, Task name:Employment Income ', 'updated', '0.0.0.0', '2025-07-14 15:32:02', '2025-07-14 15:32:02'),
(1153, 103, '2025-07-14', 'timesheet', 0, 'submitted a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 12:00 Date: 2025-07-08, Hours : 12:00 Date: 2025-07-09, Hours : 12:00 Date: 2025-07-10, Hours : 6:30 ,Job code:43 _JOH_Book_000027, Task name:Employment Income', 'Account Manager Shakir test test submitted a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 12:00 Date: 2025-07-08, Hours : 12:00 Date: 2025-07-09, Hours : 12:00 Date: 2025-07-10, Hours : 6:30 ,Job code:43 _JOH_Book_000027, Task name:Employment Income ', 'updated', '0.0.0.0', '2025-07-14 15:32:02', '2025-07-14 15:32:02'),
(1154, 103, '2025-07-14', 'timesheet', 0, 'submitted a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 12:00 Date: 2025-07-08, Hours : 12:00 Date: 2025-07-09, Hours : 12:00 Date: 2025-07-10, Hours : 6:30 ,Job code:43 _JOH_Book_000027, Task name:Employment Income', 'Account Manager Shakir test test submitted a timesheet entry. Task type:External,  Date: 2025-07-07, Hours : 12:00 Date: 2025-07-08, Hours : 12:00 Date: 2025-07-09, Hours : 12:00 Date: 2025-07-10, Hours : 6:30 ,Job code:43 _JOH_Book_000027, Task name:Employment Income ', 'updated', '0.0.0.0', '2025-07-14 15:32:02', '2025-07-14 15:32:02'),
(1155, 103, '2025-07-14', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2025-06-30, Hours : 12:00 Date: 2025-07-01, Hours : 12:00 Date: 2025-07-02, Hours : 18:30 ,Job code:Training, Task name:Onboarding', 'Account Manager Shakir test test submitted a timesheet entry. Task type:Internal,  Date: 2025-06-30, Hours : 12:00 Date: 2025-07-01, Hours : 12:00 Date: 2025-07-02, Hours : 18:30 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-07-14 15:32:31', '2025-07-14 15:32:31'),
(1156, 104, '2025-07-14', 'customer', 95, 'edited sole trader information. customer code :', 'Management New staff test edited sole trader information. customer code : cust_43 _000076(43 AYLESFORD STREET LIMITED test)', 'updated', '27.60.15.23', '2025-07-14 15:32:50', '2025-07-14 15:32:50'),
(1157, 104, '2025-07-14', 'customer', 95, 'edited the service details customer code :', 'Management New staff test edited the service details customer code : cust_43 _000076(43 AYLESFORD STREET LIMITED test)', 'updated', '27.60.15.23', '2025-07-14 15:32:52', '2025-07-14 15:32:52'),
(1158, 53, '2025-07-14', 'timesheet', 0, 'submitted a timesheet entry. Task type:External,  Date: 2025-07-14, Hours : 12:00 Date: 2025-07-15, Hours : 12:00 Date: 2025-07-16, Hours : 12:00 Date: 2025-07-17, Hours : 6:30 ,Job code:43 _JOH_Book_000027, Task name:Employment Income', 'Account Manager Vivek Singh submitted a timesheet entry. Task type:External,  Date: 2025-07-14, Hours : 12:00 Date: 2025-07-15, Hours : 12:00 Date: 2025-07-16, Hours : 12:00 Date: 2025-07-17, Hours : 6:30 ,Job code:43 _JOH_Book_000027, Task name:Employment Income ', 'updated', '0.0.0.0', '2025-07-14 15:33:51', '2025-07-14 15:33:51'),
(1159, 1, '2025-07-15', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-07-15 07:03:05', '2025-07-15 07:03:05'),
(1160, 1, '2025-07-15', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2025-07-14, Hours : 9:00 Date: 2025-07-15, Hours : 9:00 Date: 2025-07-16, Hours : 9:00 Date: 2025-07-17, Hours : 9:00 Date: 2025-07-18, Hours : 9:00 ,Job code:Training, Task name:Onboarding', 'Super Admin System Super Super Admin submitted a timesheet entry. Task type:Internal,  Date: 2025-07-14, Hours : 9:00 Date: 2025-07-15, Hours : 9:00 Date: 2025-07-16, Hours : 9:00 Date: 2025-07-17, Hours : 9:00 Date: 2025-07-18, Hours : 9:00 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-07-15 07:05:19', '2025-07-15 07:05:19'),
(1161, 1, '2025-07-15', 'timesheet', 0, 'created a timesheet entry. Task type:Internal,  Date: 2025-07-14, Hours : 9:60 Date: 2025-07-15, Hours : 9:60 Date: 2025-07-16, Hours : 9:60 Date: 2025-07-17, Hours : 9:00 Date: 2025-07-18, Hours : 9:00 ,Job code:Training, Task name:Onboarding', 'Super Admin System Super Super Admin created a timesheet entry. Task type:Internal,  Date: 2025-07-14, Hours : 9:60 Date: 2025-07-15, Hours : 9:60 Date: 2025-07-16, Hours : 9:60 Date: 2025-07-17, Hours : 9:00 Date: 2025-07-18, Hours : 9:00 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-07-15 07:11:15', '2025-07-15 07:11:15'),
(1162, 1, '2025-07-15', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2025-07-14, Updated hours : 5:70 ,Job code:Training, Task name:Onboarding', 'Super Admin System Super Super Admin submitted a timesheet entry. Task type:Internal,  Date: 2025-07-14, Updated hours : 5:70 ,Job code:Training, Task name:Onboarding ', 'updated', '0.0.0.0', '2025-07-15 08:23:47', '2025-07-15 08:23:47'),
(1163, 1, '2025-07-15', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-07-15 08:34:39', '2025-07-15 08:34:39'),
(1164, 1, '2025-07-15', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.60.15.23', '2025-07-15 13:43:21', '2025-07-15 13:43:21'),
(1165, 1, '2025-07-16', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.60.15.23', '2025-07-16 13:54:48', '2025-07-16 13:54:48'),
(1166, 1, '2025-07-16', 'client', 57, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_Nor_tes_000053(testtesttest)', 'created', '27.59.119.235', '2025-07-16 14:06:44', '2025-07-16 14:06:45'),
(1167, 1, '2025-07-17', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.60.13.149', '2025-07-17 08:50:59', '2025-07-17 08:51:00'),
(1168, 1, '2025-07-17', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '27.59.117.53', '2025-07-17 08:52:37', '2025-07-17 08:52:37'),
(1169, 1, '2025-07-17', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.117.53', '2025-07-17 08:52:49', '2025-07-17 08:52:49'),
(1170, 1, '2025-07-17', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-07-17 08:54:17', '2025-07-17 08:54:17'),
(1171, 1, '2025-07-17', 'checklist', 11, 'edited checklist Checklist', 'Super Admin System Super Super Admin edited checklist Checklist ', 'updated', '122.168.114.106', '2025-07-17 08:55:50', '2025-07-17 08:55:50'),
(1172, 1, '2025-07-17', 'checklist', 11, 'edited checklist Checklist', 'Super Admin System Super Super Admin edited checklist Checklist ', 'updated', '122.168.114.106', '2025-07-17 08:56:26', '2025-07-17 08:56:26'),
(1173, 1, '2025-07-17', 'checklist', 11, 'edited checklist Checklist', 'Super Admin System Super Super Admin edited checklist Checklist ', 'updated', '122.168.114.106', '2025-07-17 09:03:10', '2025-07-17 09:03:10'),
(1174, 1, '2025-07-17', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-07-17 09:05:21', '2025-07-17 09:05:21'),
(1175, 1, '2025-07-17', 'checklist', 12, 'created checklist Checklist1', 'Super Admin System Super Super Admin created checklist Checklist1 ', 'created', '27.59.117.53', '2025-07-17 09:06:20', '2025-07-17 09:06:20'),
(1176, 1, '2025-07-17', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-07-17 09:18:31', '2025-07-17 09:18:31'),
(1177, 1, '2025-07-17', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-07-17 09:21:13', '2025-07-17 09:21:13'),
(1178, 1, '2025-07-17', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-07-17 09:30:48', '2025-07-17 09:30:48'),
(1179, 1, '2025-07-17', 'checklist', 10, 'edited checklist company client', 'Super Admin System Super Super Admin edited checklist company client ', 'updated', '122.168.114.106', '2025-07-17 09:53:53', '2025-07-17 09:53:53'),
(1180, 1, '2025-07-21', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.119.235', '2025-07-21 12:42:00', '2025-07-21 12:42:00'),
(1181, 1, '2025-07-22', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.224.165.51', '2025-07-22 12:43:14', '2025-07-22 12:43:14'),
(1182, 1, '2025-07-22', 'checklist', 13, 'created checklist VAT Review', 'Super Admin System Super Super Admin created checklist VAT Review ', 'created', '171.79.37.157', '2025-07-22 15:25:47', '2025-07-22 15:25:47'),
(1183, 1, '2025-07-22', 'checklist', 14, 'created checklist Testing new', 'Super Admin System Super Super Admin created checklist Testing new ', 'created', '171.79.37.157', '2025-07-22 15:27:14', '2025-07-22 15:27:14'),
(1184, 1, '2025-07-22', 'checklist', 15, 'created checklist Testing new', 'Super Admin System Super Super Admin created checklist Testing new ', 'created', '171.79.37.157', '2025-07-22 15:30:33', '2025-07-22 15:30:33'),
(1185, 1, '2025-07-23', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.37.157', '2025-07-23 13:56:41', '2025-07-23 13:56:41'),
(1186, 53, '2025-07-23', '-', 0, ' Logged In', 'Account Manager Vivek Singh  Logged In ', '-', NULL, '2025-07-23 13:58:53', '2025-07-23 13:58:53'),
(1187, 103, '2025-07-23', '-', 0, ' Logged In', 'Account Manager Shakir test test  Logged In ', '-', '27.60.15.23', '2025-07-23 14:00:05', '2025-07-23 14:00:05'),
(1188, 53, '2025-07-23', 'job', 29, 'created job code:', 'Account Manager Vivek Singh created job code: Nor_COR_Prep_000029', 'created', '27.60.6.18', '2025-07-23 14:00:45', '2025-07-23 14:00:45'),
(1189, 53, '2025-07-23', 'job', 30, 'created job code:', 'Account Manager Vivek Singh created job code: THE_MOV_Prep_000030', 'created', '27.60.6.18', '2025-07-23 14:15:25', '2025-07-23 14:15:25'),
(1190, 53, '2025-07-23', 'job', 31, 'created job code:', 'Account Manager Vivek Singh created job code: M L_ABC_Supp_000031', 'created', '27.60.6.18', '2025-07-23 14:16:37', '2025-07-23 14:16:37'),
(1191, 103, '2025-07-23', 'job', 32, 'created job code:', 'Account Manager Shakir test test created job code: H. _Mer_Book_000032', 'created', '27.60.6.18', '2025-07-23 14:18:25', '2025-07-23 14:18:25'),
(1192, 1, '2025-07-24', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.60.6.18', '2025-07-24 16:12:10', '2025-07-24 16:12:10'),
(1193, 88, '2025-07-24', '-', 0, ' Logged In', 'Account Manager Darshita Trivedi  Logged In ', '-', NULL, '2025-07-24 16:12:45', '2025-07-24 16:12:45'),
(1194, 88, '2025-07-24', 'client', 58, 'created client profile. client code :', 'Account Manager Darshita Trivedi created client profile. client code : cli_F A_R L_000054(R LIMITED)', 'created', '27.60.6.40', '2025-07-24 16:13:09', '2025-07-24 16:13:09'),
(1195, 88, '2025-07-24', 'job', 33, 'created job code:', 'Account Manager Darshita Trivedi created job code: F A_R L_Work_000033', 'created', '27.60.6.40', '2025-07-24 16:13:43', '2025-07-24 16:13:43'),
(1196, 88, '2025-07-24', 'job', 33, 'edited the job information and changed the job to the reviewer, Vivek Jangid job code:', 'Account Manager Darshita Trivedi edited the job information and changed the job to the reviewer, Vivek Jangid job code: F A_R L_Work_000033', 'updated', '27.60.6.40', '2025-07-24 16:19:41', '2025-07-24 16:19:41'),
(1197, 68, '2025-07-24', '-', 0, ' Logged In', 'Reviewer Vivek Jangid  Logged In ', '-', '27.60.6.18', '2025-07-24 16:20:39', '2025-07-24 16:20:39'),
(1198, 88, '2025-07-24', '-', 0, ' Logged Out', 'Account Manager Darshita Trivedi  Logged Out ', '-', '27.60.6.40', '2025-07-24 16:21:56', '2025-07-24 16:21:56'),
(1199, 80, '2025-07-24', '-', 0, ' Logged In', 'Account Manager Bhakti Kalambate  Logged In ', '-', '27.60.6.40', '2025-07-24 16:22:05', '2025-07-24 16:22:05'),
(1200, 80, '2025-07-24', 'customer', 98, 'created customer profile. customer code :', 'Account Manager Bhakti Kalambate created customer profile. customer code : cust_GG _000079(GG AEGON LTD)', 'created', '27.60.6.40', '2025-07-24 16:22:35', '2025-07-24 16:22:35'),
(1201, 80, '2025-07-24', 'customer', 98, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Bhakti Kalambate  edited the service details and added an additional service while editing the customer code : cust_GG _000079(GG AEGON LTD)', 'updated', '27.60.6.40', '2025-07-24 16:22:43', '2025-07-24 16:22:43'),
(1202, 80, '2025-07-24', 'client', 59, 'created client profile. client code :', 'Account Manager Bhakti Kalambate created client profile. client code : cli_GG _AFR_000055(AFROFRING ENTERTAINMENT LIMITED)', 'created', '27.60.6.40', '2025-07-24 16:23:15', '2025-07-24 16:23:15'),
(1203, 80, '2025-07-24', 'job', 34, 'created job code:', 'Account Manager Bhakti Kalambate created job code: GG _AFR_Prep_000034', 'created', '27.60.6.40', '2025-07-24 16:23:59', '2025-07-24 16:23:59'),
(1204, 68, '2025-07-24', '-', 0, ' Logged Out', 'Reviewer Vivek Jangid  Logged Out ', '-', '27.60.6.40', '2025-07-24 16:24:10', '2025-07-24 16:24:10'),
(1205, 103, '2025-07-24', '-', 0, ' Logged In', 'Account Manager Shakir test test  Logged In ', '-', '27.60.6.40', '2025-07-24 16:24:13', '2025-07-24 16:24:13'),
(1206, 103, '2025-07-24', '-', 0, ' Logged Out', 'Account Manager Shakir test test  Logged Out ', '-', '27.60.6.40', '2025-07-24 16:24:25', '2025-07-24 16:24:25'),
(1207, 88, '2025-07-24', '-', 0, ' Logged In', 'Account Manager Darshita Trivedi  Logged In ', '-', '27.60.6.40', '2025-07-24 16:24:41', '2025-07-24 16:24:41'),
(1208, 1, '2025-07-25', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '27.60.6.40', '2025-07-25 06:08:45', '2025-07-25 06:08:45'),
(1209, 1, '2025-07-25', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.60.6.40', '2025-07-25 06:08:47', '2025-07-25 06:08:47'),
(1210, 80, '2025-07-25', '-', 0, ' Logged Out', 'Account Manager Bhakti Kalambate  Logged Out ', '-', '27.60.6.40', '2025-07-25 06:09:07', '2025-07-25 06:09:07'),
(1211, 88, '2025-07-25', '-', 0, ' Logged In', 'Account Manager Darshita Trivedi  Logged In ', '-', '27.60.6.40', '2025-07-25 06:09:15', '2025-07-25 06:09:15'),
(1212, 88, '2025-07-25', '-', 0, ' Logged Out', 'Account Manager Darshita Trivedi  Logged Out ', '-', '27.60.6.40', '2025-07-25 06:11:18', '2025-07-25 06:11:18'),
(1213, 68, '2025-07-25', '-', 0, ' Logged In', 'Reviewer Vivek Jangid  Logged In ', '-', '27.60.6.40', '2025-07-25 06:11:25', '2025-07-25 06:11:25'),
(1214, 88, '2025-07-25', '-', 0, ' Logged Out', 'Account Manager Darshita Trivedi  Logged Out ', '-', '106.207.216.251', '2025-07-25 06:12:05', '2025-07-25 06:12:05'),
(1215, 80, '2025-07-25', '-', 0, ' Logged In', 'Account Manager Bhakti Kalambate  Logged In ', '-', '106.207.216.251', '2025-07-25 06:12:13', '2025-07-25 06:12:13'),
(1216, 1, '2025-07-26', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '106.207.216.251', '2025-07-26 14:06:29', '2025-07-26 14:06:29'),
(1217, 1, '2025-07-28', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '106.207.223.211', '2025-07-28 09:07:08', '2025-07-28 09:07:08'),
(1218, 1, '2025-07-31', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-07-31 11:28:46', '2025-07-31 11:28:46'),
(1219, 88, '2025-07-31', '-', 0, ' Logged In', 'Account Manager Darshita Trivedi  Logged In ', '-', NULL, '2025-07-31 11:35:03', '2025-07-31 11:35:03'),
(1220, 53, '2025-07-31', '-', 0, ' Logged In', 'Account Manager Vivek Singh  Logged In ', '-', NULL, '2025-07-31 11:36:12', '2025-07-31 11:36:12'),
(1221, 1, '2025-07-31', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.118.170', '2025-07-31 15:02:27', '2025-07-31 15:02:27'),
(1222, 1, '2025-07-31', 'customer', 99, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_R E_000080(R ERWIN DESIGN ENGINEERING LTD)', 'created', '27.60.6.97', '2025-07-31 15:35:06', '2025-07-31 15:35:06'),
(1223, 1, '2025-07-31', 'customer', 99, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_R E_000080(R ERWIN DESIGN ENGINEERING LTD)', 'updated', '27.60.6.97', '2025-07-31 15:45:30', '2025-07-31 15:45:30'),
(1224, 1, '2025-08-01', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-08-01 09:45:29', '2025-08-01 09:45:29'),
(1225, 1, '2025-08-01', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-08-01 10:00:43', '2025-08-01 10:00:43'),
(1226, 88, '2025-08-01', '-', 0, ' Logged In', 'Account Manager Darshita Trivedi  Logged In ', '-', NULL, '2025-08-01 10:01:29', '2025-08-01 10:01:29'),
(1227, 88, '2025-08-01', '-', 0, ' Logged Out', 'Account Manager Darshita Trivedi  Logged Out ', '-', '122.168.114.106', '2025-08-01 12:01:36', '2025-08-01 12:01:36'),
(1228, 1, '2025-08-01', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.60.6.97', '2025-08-01 13:57:43', '2025-08-01 13:57:43'),
(1229, 52, '2025-08-01', '-', 0, ' Logged In', 'Account Manager Robin Bhaik  Logged In ', '-', NULL, '2025-08-01 14:00:54', '2025-08-01 14:00:54'),
(1230, 52, '2025-08-01', 'customer', 100, 'created customer profile. customer code :', 'Account Manager Robin Bhaik created customer profile. customer code : cust_J &_000081(J & E PROPERTIES LIMITED)', 'created', '106.207.232.140', '2025-08-01 14:01:24', '2025-08-01 14:01:24'),
(1231, 52, '2025-08-01', 'customer', 100, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Robin Bhaik  edited the service details and added an additional service while editing the customer code : cust_J &_000081(J & E PROPERTIES LIMITED)', 'updated', '106.207.232.140', '2025-08-01 14:01:37', '2025-08-01 14:01:37'),
(1232, 52, '2025-08-01', 'client', 60, 'created client profile. client code :', 'Account Manager Robin Bhaik created client profile. client code : cli_J &_fal_000056(false)', 'created', '106.207.232.140', '2025-08-01 14:02:11', '2025-08-01 14:02:11'),
(1233, 52, '2025-08-01', 'checklist', 16, 'created checklist Bookkepping catchup', 'Account Manager Robin Bhaik created checklist Bookkepping catchup ', 'created', '106.207.232.140', '2025-08-01 14:03:11', '2025-08-01 14:03:11'),
(1234, 52, '2025-08-01', 'job', 35, 'created job code:', 'Account Manager Robin Bhaik created job code: J &_fal_Prep_000035', 'created', '106.207.232.140', '2025-08-01 14:03:51', '2025-08-01 14:03:51'),
(1235, 52, '2025-08-01', 'client', 61, 'created client profile. client code :', 'Account Manager Robin Bhaik created client profile. client code : cli_AXA_CLA_000057(CLASSIC CARS (NW) LIMITED)', 'created', '106.207.232.140', '2025-08-01 14:05:16', '2025-08-01 14:05:16');
INSERT INTO `staff_logs` (`id`, `staff_id`, `date`, `module_name`, `module_id`, `log_message`, `log_message_all`, `permission_type`, `ip`, `created_at`, `updated_at`) VALUES
(1236, 52, '2025-08-01', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2025-07-28, Hours : 00:00 ,Job code:J &_fal_Prep_000035, Task name:Self-Employment Income', 'Account Manager Robin Bhaik created a timesheet entry. Task type:External,  Date: 2025-07-28, Hours : 00:00 ,Job code:J &_fal_Prep_000035, Task name:Self-Employment Income ', 'updated', '0.0.0.0', '2025-08-01 14:06:12', '2025-08-01 14:06:12'),
(1237, 52, '2025-08-01', 'job', 36, 'created job code:', 'Account Manager Robin Bhaik created job code: AXA_CLA_Book_000036', 'created', '106.207.232.140', '2025-08-01 14:08:04', '2025-08-01 14:08:04'),
(1238, 52, '2025-08-01', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2025-07-28, Hours : 1:00 ,Job code:AXA_CLA_Book_000036, Task name:test', 'Account Manager Robin Bhaik created a timesheet entry. Task type:External,  Date: 2025-07-28, Hours : 1:00 ,Job code:AXA_CLA_Book_000036, Task name:test ', 'updated', '0.0.0.0', '2025-08-01 14:09:16', '2025-08-01 14:09:16'),
(1239, 61, '2025-08-01', '-', 0, ' Logged In', 'Account Manager Nishtha Jain  Logged In ', '-', '106.207.216.251', '2025-08-01 14:10:41', '2025-08-01 14:10:41'),
(1240, 52, '2025-08-01', 'job', 36, 'edited the job information and changed the job to the reviewer, Nishtha Jain job code:', 'Account Manager Robin Bhaik edited the job information and changed the job to the reviewer, Nishtha Jain job code: AXA_CLA_Book_000036', 'updated', '106.207.232.140', '2025-08-01 14:11:12', '2025-08-01 14:11:12'),
(1241, 52, '2025-08-01', 'job', 36, 'edited the job information and has assigned the job to the processor, Nishtha Jain job code:', 'Account Manager Robin Bhaik edited the job information and has assigned the job to the processor, Nishtha Jain job code: AXA_CLA_Book_000036', 'updated', '106.207.232.140', '2025-08-01 14:12:46', '2025-08-01 14:12:46'),
(1242, 52, '2025-08-01', '-', 0, ' Logged Out', 'Account Manager Robin Bhaik  Logged Out ', '-', '106.207.232.140', '2025-08-01 14:58:50', '2025-08-01 14:58:50'),
(1243, 80, '2025-08-01', '-', 0, ' Logged In', 'Account Manager Bhakti Kalambate  Logged In ', '-', '106.207.232.140', '2025-08-01 14:58:58', '2025-08-01 14:58:58'),
(1244, 80, '2025-08-01', 'customer', 101, 'created customer profile. customer code :', 'Account Manager Bhakti Kalambate created customer profile. customer code : cust_AA _000082(AA EXPRESS LOGISTICS LTD)', 'created', '106.207.232.140', '2025-08-01 14:59:32', '2025-08-01 14:59:32'),
(1245, 80, '2025-08-01', 'customer', 101, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Bhakti Kalambate  edited the service details and added an additional service while editing the customer code : cust_AA _000082(AA EXPRESS LOGISTICS LTD)', 'updated', '106.207.232.140', '2025-08-01 14:59:42', '2025-08-01 14:59:42'),
(1246, 80, '2025-08-01', 'client', 62, 'created client profile. client code :', 'Account Manager Bhakti Kalambate created client profile. client code : cli_AA _R. _000058(R. MANCHESTER OPCO HOLDCO LIMITED)', 'created', '106.207.232.140', '2025-08-01 15:00:29', '2025-08-01 15:00:29'),
(1247, 80, '2025-08-01', 'job', 37, 'created job code:', 'Account Manager Bhakti Kalambate created job code: AA _R. _Prep_000037', 'created', '106.207.232.140', '2025-08-01 15:01:15', '2025-08-01 15:01:15'),
(1248, 80, '2025-08-01', 'job', 37, 'edited the job information and has assigned the job to the processor, Bhakti Kalambate job code:', 'Account Manager Bhakti Kalambate edited the job information and has assigned the job to the processor, Bhakti Kalambate job code: AA _R. _Prep_000037', 'updated', '106.207.232.140', '2025-08-01 15:02:05', '2025-08-01 15:02:05'),
(1249, 80, '2025-08-01', 'job', 38, 'created job code:', 'Account Manager Bhakti Kalambate created job code: AA _R. _Prep_000038', 'created', '106.207.232.140', '2025-08-01 15:11:41', '2025-08-01 15:11:41'),
(1250, 80, '2025-08-01', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2025-07-28, Hours : 1:00 ,Job code:AA _R. _Prep_000038, Task name:Property Income', 'Account Manager Bhakti Kalambate created a timesheet entry. Task type:External,  Date: 2025-07-28, Hours : 1:00 ,Job code:AA _R. _Prep_000038, Task name:Property Income ', 'updated', '0.0.0.0', '2025-08-01 15:13:49', '2025-08-01 15:13:49'),
(1251, 88, '2025-08-01', '-', 0, ' Logged In', 'Account Manager Darshita Trivedi  Logged In ', '-', NULL, '2025-08-01 15:14:39', '2025-08-01 15:14:39'),
(1252, 80, '2025-08-01', 'job', 38, 'edited the job information and has assigned the job to the processor, Nishtha Jain job code:', 'Account Manager Bhakti Kalambate edited the job information and has assigned the job to the processor, Nishtha Jain job code: AA _R. _Prep_000038', 'updated', '106.207.232.140', '2025-08-01 15:15:54', '2025-08-01 15:15:54'),
(1253, 1, '2025-08-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-08-02 08:30:11', '2025-08-02 08:30:11'),
(1254, 55, '2025-08-02', '-', 0, ' Logged In', 'Management Elakkya Vikas  Logged In ', '-', NULL, '2025-08-02 08:39:31', '2025-08-02 08:39:31'),
(1255, 1, '2025-08-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-08-02 09:00:34', '2025-08-02 09:00:34'),
(1256, 1, '2025-08-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.60.14.167', '2025-08-02 13:55:42', '2025-08-02 13:55:42'),
(1257, 1, '2025-08-02', 'job', 38, 'sent the missing logs for job code:', 'Super Admin System Super Super Admin sent the missing logs for job code: AA _R. _Prep_000038', 'created', '27.60.14.167', '2025-08-02 14:39:00', '2025-08-02 14:39:00'),
(1258, 1, '2025-08-05', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-08-05 13:30:43', '2025-08-05 13:30:43'),
(1259, 1, '2025-08-05', 'job', 39, 'created job code:', 'Super Admin System Super Super Admin created job code: AA _R. _Prep_000039', 'created', '122.168.114.106', '2025-08-05 13:31:59', '2025-08-05 13:31:59'),
(1260, 1, '2025-08-05', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.60.8.240', '2025-08-05 13:41:29', '2025-08-05 13:41:29'),
(1261, 93, '2025-08-05', '-', 0, ' Logged In', 'Processor Talib Khan  Logged In ', '-', NULL, '2025-08-05 13:42:02', '2025-08-05 13:42:02'),
(1262, 93, '2025-08-05', '-', 0, ' Logged Out', 'Processor Talib Khan  Logged Out ', '-', '27.60.8.240', '2025-08-05 13:42:46', '2025-08-05 13:42:46'),
(1263, 60, '2025-08-05', '-', 0, ' Logged In', 'Account Manager Mohit Kumar  Logged In ', '-', '27.60.8.240', '2025-08-05 13:42:54', '2025-08-05 13:42:54'),
(1264, 60, '2025-08-05', 'customer', 102, 'created customer profile. customer code :', 'Account Manager Mohit Kumar created customer profile. customer code : cust_PAR_000083(PARKVIEW ASSET MANAGEMENT BOLSOVER HEAD LTD)', 'created', '27.60.8.240', '2025-08-05 13:43:40', '2025-08-05 13:43:40'),
(1265, 60, '2025-08-05', 'customer', 102, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Mohit Kumar  edited the service details and added an additional service while editing the customer code : cust_PAR_000083(PARKVIEW ASSET MANAGEMENT BOLSOVER HEAD LTD)', 'updated', '27.60.8.240', '2025-08-05 13:43:48', '2025-08-05 13:43:48'),
(1266, 60, '2025-08-05', 'client', 63, 'created client profile. client code :', 'Account Manager Mohit Kumar created client profile. client code : cli_PAR_AGR_000059(AGRIPPA ARCHITECTURAL SERVICES LTD)', 'created', '27.60.8.240', '2025-08-05 13:45:00', '2025-08-05 13:45:00'),
(1267, 60, '2025-08-05', 'job', 40, 'created job code:', 'Account Manager Mohit Kumar created job code: PAR_AGR_Deta_000040', 'created', '27.60.8.240', '2025-08-05 13:46:29', '2025-08-05 13:46:29'),
(1268, 93, '2025-08-05', '-', 0, ' Logged In', 'Processor Talib Khan  Logged In ', '-', '106.207.232.140', '2025-08-05 13:47:42', '2025-08-05 13:47:42'),
(1269, 102, '2025-08-05', '-', 0, ' Logged In', 'Processor Vikas Yadav  Logged In ', '-', NULL, '2025-08-05 13:49:12', '2025-08-05 13:49:12'),
(1270, 1, '2025-08-05', 'job', 41, 'created job code:', 'Super Admin System Super Super Admin created job code: PAR_AGR_Basi_000041', 'created', '27.60.8.240', '2025-08-05 13:51:04', '2025-08-05 13:51:04'),
(1271, 1, '2025-08-11', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.60.8.240', '2025-08-11 14:02:10', '2025-08-11 14:02:10'),
(1272, 48, '2025-08-11', '-', 0, ' Logged In', 'Account Manager Anand Vyas  Logged In ', '-', NULL, '2025-08-11 14:50:35', '2025-08-11 14:50:35'),
(1273, 48, '2025-08-11', '-', 0, ' Logged In', 'Account Manager Anand Vyas  Logged In ', '-', NULL, '2025-08-11 14:50:35', '2025-08-11 14:50:35'),
(1274, 48, '2025-08-11', 'customer', 103, 'created customer profile. customer code :', 'Account Manager Anand Vyas created customer profile. customer code : cust_H P_000084(H PARKVIEW LTD)', 'created', '110.227.51.94', '2025-08-11 14:51:05', '2025-08-11 14:51:05'),
(1275, 48, '2025-08-11', 'customer', 103, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Anand Vyas  edited the service details and added an additional service while editing the customer code : cust_H P_000084(H PARKVIEW LTD)', 'updated', '110.227.51.94', '2025-08-11 14:51:12', '2025-08-11 14:51:12'),
(1276, 48, '2025-08-11', 'client', 64, 'created client profile. client code :', 'Account Manager Anand Vyas created client profile. client code : cli_H P_AMA_000060(AMAN MARKET LTD)', 'created', '110.227.51.94', '2025-08-11 14:51:42', '2025-08-11 14:51:42'),
(1277, 48, '2025-08-11', 'job', 42, 'created job code:', 'Account Manager Anand Vyas created job code: H P_AMA_Prep_000042', 'created', '110.227.51.94', '2025-08-11 14:53:16', '2025-08-11 14:53:16'),
(1278, 75, '2025-08-11', '-', 0, ' Logged In', 'Processor satyam kumar  Logged In ', '-', '27.60.8.240', '2025-08-11 14:57:10', '2025-08-11 14:57:10'),
(1279, 46, '2025-08-11', '-', 0, ' Logged In', 'Account Manager Lalita Pal  Logged In ', '-', NULL, '2025-08-11 15:00:13', '2025-08-11 15:00:13'),
(1280, 48, '2025-08-11', 'customer', 104, 'created customer profile. customer code :', 'Account Manager Anand Vyas created customer profile. customer code : cust_tes_000085(test for issues)', 'created', '110.227.51.94', '2025-08-11 15:21:21', '2025-08-11 15:21:21'),
(1281, 48, '2025-08-11', 'customer', 104, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Anand Vyas  edited the service details and added an additional service while editing the customer code : cust_tes_000085(test for issues)', 'updated', '110.227.51.94', '2025-08-11 15:21:28', '2025-08-11 15:21:28'),
(1282, 48, '2025-08-11', 'client', 65, 'created client profile. client code :', 'Account Manager Anand Vyas created client profile. client code : cli_tes_D M_000061(D M HOLDINGS LTD)', 'created', '110.227.51.94', '2025-08-11 15:22:03', '2025-08-11 15:22:03'),
(1283, 48, '2025-08-11', 'job', 43, 'created job code:', 'Account Manager Anand Vyas created job code: tes_D M_Full_000043', 'created', '110.227.51.94', '2025-08-11 15:23:39', '2025-08-11 15:23:39'),
(1284, 75, '2025-08-11', '-', 0, ' Logged Out', 'Processor satyam kumar  Logged Out ', '-', '110.227.51.94', '2025-08-11 15:23:47', '2025-08-11 15:23:47'),
(1285, 5, '2025-08-11', '-', 0, ' Logged In', 'Account Manager shk hu  Logged In ', '-', '110.227.51.94', '2025-08-11 15:26:23', '2025-08-11 15:26:23'),
(1286, 5, '2025-08-11', '-', 0, ' Logged Out', 'Account Manager shk hu  Logged Out ', '-', '110.227.51.94', '2025-08-11 15:32:04', '2025-08-11 15:32:04'),
(1287, 46, '2025-08-11', '-', 0, ' Logged In', 'Account Manager Lalita Pal  Logged In ', '-', '110.227.51.94', '2025-08-11 15:33:19', '2025-08-11 15:33:19'),
(1288, 1, '2025-08-12', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.56.155', '2025-08-12 13:44:58', '2025-08-12 13:44:58'),
(1289, 48, '2025-08-12', '-', 0, ' Logged In', 'Account Manager Anand Vyas  Logged In ', '-', NULL, '2025-08-12 13:50:01', '2025-08-12 13:50:01'),
(1290, 48, '2025-08-12', 'customer', 105, 'created customer profile. customer code :', 'Account Manager Anand Vyas created customer profile. customer code : cust_O A_000086(O A BAMGBOSE LTD)', 'created', '110.227.61.86', '2025-08-12 13:50:27', '2025-08-12 13:50:27'),
(1291, 48, '2025-08-12', 'customer', 105, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Anand Vyas  edited the service details and added an additional service while editing the customer code : cust_O A_000086(O A BAMGBOSE LTD)', 'updated', '110.227.61.86', '2025-08-12 13:50:36', '2025-08-12 13:50:36'),
(1292, 48, '2025-08-12', 'client', 66, 'created client profile. client code :', 'Account Manager Anand Vyas created client profile. client code : cli_O A_tes_000062(test)', 'created', '110.227.61.86', '2025-08-12 13:51:29', '2025-08-12 13:51:29'),
(1293, 48, '2025-08-12', 'job', 44, 'created job code:', 'Account Manager Anand Vyas created job code: O A_tes_VAT _000044', 'created', '110.227.61.86', '2025-08-12 13:52:39', '2025-08-12 13:52:39'),
(1294, 30, '2025-08-12', '-', 0, ' Logged In', 'Account Manager Vikas test  Logged In ', '-', '110.227.51.94', '2025-08-12 13:53:59', '2025-08-12 13:53:59'),
(1295, 48, '2025-08-12', 'client', 67, 'created client profile. client code :', 'Account Manager Anand Vyas created client profile. client code : cli_O A_DFD_000063(DFDS A/S)', 'created', '110.227.61.86', '2025-08-12 13:57:57', '2025-08-12 13:57:57'),
(1296, 1, '2025-08-13', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.61.86', '2025-08-13 14:43:41', '2025-08-13 14:43:41'),
(1297, 48, '2025-08-13', '-', 0, ' Logged In', 'Account Manager Anand Vyas  Logged In ', '-', NULL, '2025-08-13 14:58:00', '2025-08-13 14:58:00'),
(1298, 48, '2025-08-13', 'customer', 106, 'created customer profile. customer code :', 'Account Manager Anand Vyas created customer profile. customer code : cust_THE_000087(THE BEAR ( DEVON ) LTD)', 'created', '110.227.60.161', '2025-08-13 14:58:21', '2025-08-13 14:58:21'),
(1299, 48, '2025-08-13', 'customer', 106, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Anand Vyas  edited the service details and added an additional service while editing the customer code : cust_THE_000087(THE BEAR ( DEVON ) LTD)', 'updated', '110.227.60.161', '2025-08-13 14:58:27', '2025-08-13 14:58:27'),
(1300, 48, '2025-08-13', 'client', 68, 'created client profile. client code :', 'Account Manager Anand Vyas created client profile. client code : cli_THE_AGA_000064(AGAXI LTD)', 'created', '110.227.60.161', '2025-08-13 14:59:01', '2025-08-13 14:59:01'),
(1301, 48, '2025-08-13', 'job', 45, 'created job code:', 'Account Manager Anand Vyas created job code: THE_AGA_VAT _000045', 'created', '110.227.60.161', '2025-08-13 14:59:54', '2025-08-13 14:59:54'),
(1302, 42, '2025-08-13', '-', 0, ' Logged In', 'Account Manager Mauli Mehta  Logged In ', '-', '110.227.61.86', '2025-08-13 15:01:04', '2025-08-13 15:01:04'),
(1303, 47, '2025-08-13', '-', 0, ' Logged In', 'Account Manager Tushar Sharma  Logged In ', '-', NULL, '2025-08-13 15:02:38', '2025-08-13 15:02:38'),
(1304, 47, '2025-08-13', 'job', 45, 'updated the job status from WIP – To Be Reviewed to Completed - Filed with HMRC. job code:', 'Account Manager Tushar Sharma updated the job status from WIP – To Be Reviewed to Completed - Filed with HMRC. job code: THE_AGA_VAT _000045', 'updated', NULL, '2025-08-13 15:04:28', '2025-08-13 15:04:28'),
(1305, 47, '2025-08-13', 'job', 45, 'updated the job status from Completed - Filed with HMRC to WIP - Customer Processing. job code:', 'Account Manager Tushar Sharma updated the job status from Completed - Filed with HMRC to WIP - Customer Processing. job code: THE_AGA_VAT _000045', 'updated', NULL, '2025-08-13 15:04:34', '2025-08-13 15:04:34'),
(1306, 47, '2025-08-13', '-', 0, ' Logged Out', 'Account Manager Tushar Sharma  Logged Out ', '-', NULL, '2025-08-13 15:17:41', '2025-08-13 15:17:41'),
(1307, 47, '2025-08-13', '-', 0, ' Logged In', 'Account Manager Tushar Sharma  Logged In ', '-', NULL, '2025-08-13 15:17:52', '2025-08-13 15:17:52'),
(1308, 48, '2025-08-13', 'client', 69, 'created client profile. client code :', 'Account Manager Anand Vyas created client profile. client code : cli_THE_Tha_000065(Thames International Trading Group)', 'created', '110.227.60.161', '2025-08-13 15:23:50', '2025-08-13 15:23:50'),
(1309, 48, '2025-08-13', 'job', 46, 'created job code:', 'Account Manager Anand Vyas created job code: THE_Tha_VAT _000046', 'created', '110.227.60.161', '2025-08-13 15:25:04', '2025-08-13 15:25:04'),
(1310, 42, '2025-08-13', '-', 0, ' Logged Out', 'Account Manager Mauli Mehta  Logged Out ', '-', '110.227.60.161', '2025-08-13 15:25:14', '2025-08-13 15:25:14'),
(1311, 76, '2025-08-13', '-', 0, ' Logged In', 'Processor Harun Saifi   Mohammad   Logged In ', '-', '110.227.60.161', '2025-08-13 15:25:23', '2025-08-13 15:25:23'),
(1312, 47, '2025-08-13', '-', 0, ' Logged Out', 'Account Manager Tushar Sharma  Logged Out ', '-', NULL, '2025-08-13 15:31:13', '2025-08-13 15:31:13'),
(1313, 20, '2025-08-13', '-', 0, ' Logged In', 'Reviewer Pradeep Soni  Logged In ', '-', NULL, '2025-08-13 15:31:27', '2025-08-13 15:31:27'),
(1314, 48, '2025-08-13', 'client', 70, 'created client profile. client code :', 'Account Manager Anand Vyas created client profile. client code : cli_THE_43 _000066(43 AYLESFORD STREET LIMITED)', 'created', '110.227.60.161', '2025-08-13 15:33:47', '2025-08-13 15:33:47'),
(1315, 48, '2025-08-13', 'job', 47, 'created job code:', 'Account Manager Anand Vyas created job code: THE_43 _VAT _000047', 'created', '110.227.60.161', '2025-08-13 15:34:34', '2025-08-13 15:34:34'),
(1316, 48, '2025-08-13', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2025-08-11, Hours : 1:00 Date: 2025-08-13, Hours : 1:00 ,Job code:THE_43 _VAT _000047, Task name:Review & FIle', 'Account Manager Anand Vyas created a timesheet entry. Task type:External,  Date: 2025-08-11, Hours : 1:00 Date: 2025-08-13, Hours : 1:00 ,Job code:THE_43 _VAT _000047, Task name:Review & FIle ', 'updated', '0.0.0.0', '2025-08-13 15:36:25', '2025-08-13 15:36:25'),
(1317, 48, '2025-08-13', 'client', 71, 'created client profile. client code :', 'Account Manager Anand Vyas created client profile. client code : cli_THE_tes_000067(test)', 'created', '110.227.60.161', '2025-08-13 15:37:16', '2025-08-13 15:37:16'),
(1318, 48, '2025-08-13', 'job', 48, 'created job code:', 'Account Manager Anand Vyas created job code: THE_tes_VAT _000048', 'created', '110.227.60.161', '2025-08-13 15:38:11', '2025-08-13 15:38:11'),
(1319, 76, '2025-08-13', '-', 0, ' Logged Out', 'Processor Harun Saifi   Mohammad   Logged Out ', '-', '110.227.60.161', '2025-08-13 15:38:20', '2025-08-13 15:38:20'),
(1320, 40, '2025-08-13', '-', 0, ' Logged In', 'Account Manager Sandhya Bhardwaj  Logged In ', '-', '110.227.60.161', '2025-08-13 15:38:29', '2025-08-13 15:38:29'),
(1321, 48, '2025-08-14', '-', 0, ' Logged In', 'Account Manager Anand Vyas  Logged In ', '-', '122.168.114.106', '2025-08-14 05:02:13', '2025-08-14 05:02:13'),
(1322, 47, '2025-08-14', '-', 0, ' Logged In', 'Account Manager Tushar Sharma  Logged In ', '-', NULL, '2025-08-14 05:04:30', '2025-08-14 05:04:30'),
(1323, 42, '2025-08-14', '-', 0, ' Logged In', 'Account Manager Mauli Mehta  Logged In ', '-', NULL, '2025-08-14 05:05:47', '2025-08-14 05:05:47'),
(1324, 48, '2025-08-14', 'job', 49, 'created job code:', 'Account Manager Anand Vyas created job code: THE_AGA_Prep_000049', 'created', '122.168.114.106', '2025-08-14 05:06:56', '2025-08-14 05:06:56'),
(1325, 1, '2025-08-18', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.60.161', '2025-08-18 12:23:46', '2025-08-18 12:23:46'),
(1326, 1, '2025-08-18', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '27.59.118.130', '2025-08-18 12:33:48', '2025-08-18 12:33:48'),
(1327, 1, '2025-08-18', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.118.130', '2025-08-18 12:38:43', '2025-08-18 12:38:43'),
(1328, 104, '2025-08-18', '-', 0, ' Logged In', 'Management New staff test  Logged In ', '-', NULL, '2025-08-18 12:41:05', '2025-08-18 12:41:05'),
(1329, 1, '2025-08-18', 'permission', 8, ' updated the access for MANAGEMENT. Access Changes  Remove Permission (report-update, report-delete, report-view)', 'Super Admin System Super Super Admin  updated the access for MANAGEMENT. Access Changes  Remove Permission (report-update, report-delete, report-view) ', 'updated', '27.59.118.130', '2025-08-18 12:43:35', '2025-08-18 12:43:35'),
(1330, 1, '2025-08-18', 'customer', 105, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_O A_000086(O A BAMGBOSE LTD)', 'updated', '27.59.118.130', '2025-08-18 13:06:17', '2025-08-18 13:06:17'),
(1331, 26, '2025-08-20', '-', 0, ' Logged In', 'Processor Kamal Jatav  Logged In ', '-', NULL, '2025-08-20 11:11:06', '2025-08-20 11:11:06'),
(1332, 1, '2025-08-20', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-08-20 11:25:37', '2025-08-20 11:25:37'),
(1333, 88, '2025-08-20', '-', 0, ' Logged In', 'Account Manager Darshita Trivedi  Logged In ', '-', '122.168.114.106', '2025-08-20 11:26:09', '2025-08-20 11:26:09'),
(1334, 88, '2025-08-20', '-', 0, ' Logged Out', 'Account Manager Darshita Trivedi  Logged Out ', '-', '122.168.114.106', '2025-08-20 11:29:04', '2025-08-20 11:29:04'),
(1335, 1, '2025-08-20', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-08-20 11:35:00', '2025-08-20 11:35:00'),
(1336, 1, '2025-08-20', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.118.130', '2025-08-20 11:51:09', '2025-08-20 11:51:09'),
(1337, 1, '2025-08-20', 'staff', 105, 'created staff Staff account  manager', 'Super Admin System Super Super Admin created staff Staff account  manager ', 'created', '110.227.56.0', '2025-08-20 11:52:18', '2025-08-20 11:52:18'),
(1338, 1, '2025-08-20', 'staff', 106, 'created staff Staff  Processor', 'Super Admin System Super Super Admin created staff Staff  Processor ', 'created', '110.227.56.0', '2025-08-20 11:53:03', '2025-08-20 11:53:03'),
(1339, 1, '2025-08-20', 'staff', 107, 'created staff Staff  Reviewer', 'Super Admin System Super Super Admin created staff Staff  Reviewer ', 'created', '110.227.56.0', '2025-08-20 11:53:39', '2025-08-20 11:53:39'),
(1340, 1, '2025-08-20', 'staff', 108, 'created staff Staff admin', 'Super Admin System Super Super Admin created staff Staff admin ', 'created', '110.227.56.0', '2025-08-20 11:54:08', '2025-08-20 11:54:08'),
(1341, 1, '2025-08-20', 'staff', 109, 'created staff Staff management', 'Super Admin System Super Super Admin created staff Staff management ', 'created', '110.227.56.0', '2025-08-20 11:54:52', '2025-08-20 11:54:52'),
(1342, 1, '2025-08-20', 'staff', 110, 'created staff staff Support', 'Super Admin System Super Super Admin created staff staff Support ', 'created', '110.227.56.0', '2025-08-20 11:55:27', '2025-08-20 11:55:27'),
(1343, 108, '2025-08-20', '-', 0, ' Logged In', 'Admin Staff admin  Logged In ', '-', NULL, '2025-08-20 11:56:00', '2025-08-20 11:56:00'),
(1344, 108, '2025-08-20', 'customer', 107, 'created customer profile. customer code :', 'Admin Staff admin created customer profile. customer code : cust_Pin_000088(Pinnacle UK Trade test account manager)', 'created', '110.227.56.0', '2025-08-20 11:59:43', '2025-08-20 11:59:43'),
(1345, 108, '2025-08-20', 'customer', 107, ' edited the service details and added an additional service while editing the customer code :', 'Admin Staff admin  edited the service details and added an additional service while editing the customer code : cust_Pin_000088(Pinnacle UK Trade test account manager)', 'updated', '110.227.56.0', '2025-08-20 12:00:00', '2025-08-20 12:00:00'),
(1346, 105, '2025-08-20', '-', 0, ' Logged In', 'Account Manager Staff account  manager  Logged In ', '-', '110.227.60.161', '2025-08-20 12:01:01', '2025-08-20 12:01:01'),
(1347, 105, '2025-08-20', 'client', 72, 'created client profile. client code :', 'Account Manager Staff account  manager created client profile. client code : cli_Pin_tes_000068(test for sole trader)', 'created', '110.227.56.0', '2025-08-20 12:03:57', '2025-08-20 12:03:57'),
(1348, 105, '2025-08-20', 'job', 50, 'created job code:', 'Account Manager Staff account  manager created job code: Pin_tes_VAT _000050', 'created', '110.227.56.0', '2025-08-20 12:05:42', '2025-08-20 12:05:42'),
(1349, 1, '2025-08-20', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (all_jobs-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (all_jobs-view)  ', 'updated', '110.227.56.0', '2025-08-20 12:07:49', '2025-08-20 12:07:49'),
(1350, 105, '2025-08-20', 'checklist', 17, 'created checklist vat', 'Account Manager Staff account  manager created checklist vat ', 'created', '110.227.56.0', '2025-08-20 12:09:40', '2025-08-20 12:09:40'),
(1351, 105, '2025-08-20', 'checklist', 18, 'created checklist company', 'Account Manager Staff account  manager created checklist company ', 'created', '110.227.56.0', '2025-08-20 12:10:19', '2025-08-20 12:10:19'),
(1352, 106, '2025-08-20', '-', 0, ' Logged In', 'Processor Staff  Processor  Logged In ', '-', NULL, '2025-08-20 12:11:17', '2025-08-20 12:11:17'),
(1353, 105, '2025-08-20', 'job', 50, 'edited the job information and has assigned the job to the processor, Staff  Processor job code:', 'Account Manager Staff account  manager edited the job information and has assigned the job to the processor, Staff  Processor job code: Pin_tes_VAT _000050', 'updated', '110.227.56.0', '2025-08-20 12:12:26', '2025-08-20 12:12:26'),
(1354, 108, '2025-08-20', 'job', 50, 'edited the job information and has assigned the job to the reviewer, Staff  Reviewer job code:', 'Admin Staff admin edited the job information and has assigned the job to the reviewer, Staff  Reviewer job code: Pin_tes_VAT _000050', 'updated', '110.227.56.0', '2025-08-20 12:14:50', '2025-08-20 12:14:50'),
(1355, 107, '2025-08-20', '-', 0, ' Logged In', 'Reviewer Staff  Reviewer  Logged In ', '-', '27.60.15.23', '2025-08-20 12:16:02', '2025-08-20 12:16:02'),
(1356, 105, '2025-08-20', 'customer', 108, 'created customer profile. customer code :', 'Account Manager Staff account  manager created customer profile. customer code : cust_BRA_000089(BRADFORD AUTO CARE LIMITED)', 'created', '110.227.56.0', '2025-08-20 12:18:21', '2025-08-20 12:18:21'),
(1357, 105, '2025-08-20', 'customer', 108, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Staff account  manager  edited the service details and added an additional service while editing the customer code : cust_BRA_000089(BRADFORD AUTO CARE LIMITED)', 'updated', '110.227.56.0', '2025-08-20 12:18:46', '2025-08-20 12:18:46'),
(1358, 40, '2025-08-20', '-', 0, ' Logged In', 'Account Manager Sandhya Bhardwaj  Logged In ', '-', NULL, '2025-08-20 12:20:38', '2025-08-20 12:20:38'),
(1359, 105, '2025-08-20', 'client', 73, 'created client profile. client code :', 'Account Manager Staff account  manager created client profile. client code : cli_BRA_H. _000069(H. CAMPBELL LLC)', 'created', '110.227.56.0', '2025-08-20 12:21:49', '2025-08-20 12:21:49'),
(1360, 105, '2025-08-20', 'job', 51, 'created job code:', 'Account Manager Staff account  manager created job code: BRA_H. _Prep_000051', 'created', '110.227.56.0', '2025-08-20 12:22:57', '2025-08-20 12:22:57'),
(1361, 105, '2025-08-20', 'job', 52, 'created job code:', 'Account Manager Staff account  manager created job code: BRA_H. _VAT _000052', 'created', '110.227.56.0', '2025-08-20 12:24:27', '2025-08-20 12:24:27'),
(1362, 1, '2025-08-20', 'staff', 111, 'created staff staff acount manager multiple', 'Super Admin System Super Super Admin created staff staff acount manager multiple ', 'created', '110.227.56.0', '2025-08-20 12:36:10', '2025-08-20 12:36:10'),
(1363, 1, '2025-08-20', 'staff', 112, 'created staff staff acount manager multiple', 'Super Admin System Super Super Admin created staff staff acount manager multiple ', 'created', '110.227.56.0', '2025-08-20 12:36:44', '2025-08-20 12:36:44'),
(1364, 1, '2025-08-20', 'staff', 113, 'created staff staff acount manager multiple', 'Super Admin System Super Super Admin created staff staff acount manager multiple ', 'created', '110.227.56.0', '2025-08-20 12:37:13', '2025-08-20 12:37:13'),
(1365, 1, '2025-08-20', 'staff', 111, 'edited staff staff acount manager multiple1', 'Super Admin System Super Super Admin edited staff staff acount manager multiple1 ', 'updated', '110.227.56.0', '2025-08-20 12:38:19', '2025-08-20 12:38:19'),
(1366, 1, '2025-08-20', 'staff', 112, 'edited staff staff acount manager multiple2', 'Super Admin System Super Super Admin edited staff staff acount manager multiple2 ', 'updated', '110.227.56.0', '2025-08-20 12:38:32', '2025-08-20 12:38:32'),
(1367, 1, '2025-08-20', 'staff', 113, 'edited staff staff acount manager multiple3', 'Super Admin System Super Super Admin edited staff staff acount manager multiple3 ', 'updated', '110.227.56.0', '2025-08-20 12:38:44', '2025-08-20 12:38:44'),
(1368, 105, '2025-08-20', 'job', 53, 'created job code:', 'Account Manager Staff account  manager created job code: BRA_H. _VAT _000053', 'created', '110.227.56.0', '2025-08-20 12:39:26', '2025-08-20 12:39:26'),
(1369, 106, '2025-08-20', '-', 0, ' Logged Out', 'Processor Staff  Processor  Logged Out ', '-', NULL, '2025-08-20 12:39:58', '2025-08-20 12:39:58'),
(1370, 111, '2025-08-20', '-', 0, ' Logged In', 'Account Manager staff acount manager multiple1  Logged In ', '-', NULL, '2025-08-20 12:40:30', '2025-08-20 12:40:30'),
(1371, 107, '2025-08-20', '-', 0, ' Logged Out', 'Reviewer Staff  Reviewer  Logged Out ', '-', '110.227.56.0', '2025-08-20 12:42:23', '2025-08-20 12:42:23'),
(1372, 112, '2025-08-20', '-', 0, ' Logged In', 'Account Manager staff acount manager multiple2  Logged In ', '-', '110.227.56.0', '2025-08-20 12:42:31', '2025-08-20 12:42:31'),
(1373, 105, '2025-08-20', '-', 0, ' Logged Out', 'Account Manager Staff account  manager  Logged Out ', '-', '110.227.56.0', '2025-08-20 12:47:10', '2025-08-20 12:47:10'),
(1374, 105, '2025-08-20', '-', 0, ' Logged In', 'Account Manager Staff account  manager  Logged In ', '-', '110.227.56.0', '2025-08-20 12:49:04', '2025-08-20 12:49:04'),
(1375, 105, '2025-08-20', 'client', 74, 'created client profile. client code :', 'Account Manager Staff account  manager created client profile. client code : cli_BRA_R. _000070(R. HEATHROW M4 J4 OPCO LIMITED)', 'created', '110.227.56.0', '2025-08-20 12:49:36', '2025-08-20 12:49:36'),
(1376, 105, '2025-08-20', 'job', 54, 'created job code:', 'Account Manager Staff account  manager created job code: BRA_R. _VAT _000054', 'created', '110.227.56.0', '2025-08-20 12:50:15', '2025-08-20 12:50:15'),
(1377, 105, '2025-08-20', '-', 0, ' Logged Out', 'Account Manager Staff account  manager  Logged Out ', '-', '110.227.56.0', '2025-08-20 12:52:35', '2025-08-20 12:52:35'),
(1378, 105, '2025-08-20', '-', 0, ' Logged In', 'Account Manager Staff account  manager  Logged In ', '-', '110.227.56.0', '2025-08-20 12:53:03', '2025-08-20 12:53:03'),
(1379, 105, '2025-08-20', 'client', 75, 'created client profile. client code :', 'Account Manager Staff account  manager created client profile. client code : cli_BRA_ABB_000071(ABBOTT AND WILDE LIMITED)', 'created', '110.227.56.0', '2025-08-20 12:53:16', '2025-08-20 12:53:16'),
(1380, 105, '2025-08-20', 'job', 55, 'created job code:', 'Account Manager Staff account  manager created job code: BRA_R. _VAT _000055', 'created', '110.227.56.0', '2025-08-20 12:53:45', '2025-08-20 12:53:45'),
(1381, 105, '2025-08-20', '-', 0, ' Logged Out', 'Account Manager Staff account  manager  Logged Out ', '-', '110.227.56.0', '2025-08-20 12:54:08', '2025-08-20 12:54:08'),
(1382, 105, '2025-08-20', '-', 0, ' Logged In', 'Account Manager Staff account  manager  Logged In ', '-', '110.227.56.0', '2025-08-20 12:55:02', '2025-08-20 12:55:02'),
(1383, 105, '2025-08-20', 'client', 76, 'created client profile. client code :', 'Account Manager Staff account  manager created client profile. client code : cli_BRA_W F_000072(W FOURTEEN PROPERTY LIMITED)', 'created', '110.227.56.0', '2025-08-20 12:55:13', '2025-08-20 12:55:13'),
(1384, 105, '2025-08-20', 'job', 56, 'created job code:', 'Account Manager Staff account  manager created job code: BRA_R. _VAT _000056', 'created', '110.227.56.0', '2025-08-20 12:55:46', '2025-08-20 12:55:46'),
(1385, 105, '2025-08-20', '-', 0, ' Logged Out', 'Account Manager Staff account  manager  Logged Out ', '-', '110.227.56.0', '2025-08-20 12:55:56', '2025-08-20 12:55:56'),
(1386, 105, '2025-08-20', '-', 0, ' Logged In', 'Account Manager Staff account  manager  Logged In ', '-', '110.227.56.0', '2025-08-20 12:56:13', '2025-08-20 12:56:13'),
(1387, 40, '2025-08-20', '-', 0, ' Logged Out', 'Account Manager Sandhya Bhardwaj  Logged Out ', '-', '110.227.56.0', '2025-08-20 12:57:36', '2025-08-20 12:57:36'),
(1388, 113, '2025-08-20', '-', 0, ' Logged In', 'Account Manager staff acount manager multiple3  Logged In ', '-', '110.227.56.0', '2025-08-20 12:57:49', '2025-08-20 12:57:49'),
(1389, 105, '2025-08-20', '-', 0, ' Logged Out', 'Account Manager Staff account  manager  Logged Out ', '-', '110.227.56.0', '2025-08-20 13:00:23', '2025-08-20 13:00:23'),
(1390, 105, '2025-08-20', '-', 0, ' Logged In', 'Account Manager Staff account  manager  Logged In ', '-', '110.227.56.0', '2025-08-20 13:01:00', '2025-08-20 13:01:00'),
(1391, 105, '2025-08-20', 'client', 77, 'created client profile. client code :', 'Account Manager Staff account  manager created client profile. client code : cli_Pin_B. _000073(B. & I. HOLDINGS LIMITED)', 'created', '110.227.56.0', '2025-08-20 13:01:33', '2025-08-20 13:01:33'),
(1392, 105, '2025-08-20', 'job', 57, 'created job code:', 'Account Manager Staff account  manager created job code: Pin_B. _Demo_000057', 'created', '110.227.56.0', '2025-08-20 13:02:21', '2025-08-20 13:02:21'),
(1393, 105, '2025-08-20', '-', 0, ' Logged Out', 'Account Manager Staff account  manager  Logged Out ', '-', '110.227.56.0', '2025-08-20 13:05:13', '2025-08-20 13:05:13'),
(1394, 105, '2025-08-20', '-', 0, ' Logged In', 'Account Manager Staff account  manager  Logged In ', '-', '110.227.56.0', '2025-08-20 13:05:24', '2025-08-20 13:05:24'),
(1395, 105, '2025-08-20', 'client', 78, 'created client profile. client code :', 'Account Manager Staff account  manager created client profile. client code : cli_Pin_HEA_000074(HEAVEN RETAIL LIMITED)', 'created', '110.227.56.0', '2025-08-20 13:05:34', '2025-08-20 13:05:34'),
(1396, 105, '2025-08-20', 'job', 58, 'created job code:', 'Account Manager Staff account  manager created job code: Pin_B. _Demo_000058', 'created', '110.227.56.0', '2025-08-20 13:05:57', '2025-08-20 13:05:57'),
(1397, 105, '2025-08-20', '-', 0, ' Logged Out', 'Account Manager Staff account  manager  Logged Out ', '-', '110.227.56.0', '2025-08-20 13:06:11', '2025-08-20 13:06:11'),
(1398, 105, '2025-08-20', '-', 0, ' Logged In', 'Account Manager Staff account  manager  Logged In ', '-', '110.227.56.0', '2025-08-20 13:06:13', '2025-08-20 13:06:13'),
(1399, 105, '2025-08-20', '-', 0, ' Logged Out', 'Account Manager Staff account  manager  Logged Out ', '-', '110.227.56.0', '2025-08-20 13:06:24', '2025-08-20 13:06:24'),
(1400, 105, '2025-08-20', '-', 0, ' Logged In', 'Account Manager Staff account  manager  Logged In ', '-', '110.227.56.0', '2025-08-20 13:06:36', '2025-08-20 13:06:36'),
(1401, 105, '2025-08-20', '-', 0, ' Logged Out', 'Account Manager Staff account  manager  Logged Out ', '-', '110.227.56.0', '2025-08-20 13:06:54', '2025-08-20 13:06:54'),
(1402, 5, '2025-08-20', '-', 0, ' Logged In', 'Account Manager shk hu  Logged In ', '-', '110.227.56.0', '2025-08-20 13:07:14', '2025-08-20 13:07:14'),
(1403, 105, '2025-08-20', '-', 0, ' Logged In', 'Account Manager Staff account  manager  Logged In ', '-', '110.227.56.0', '2025-08-20 13:07:42', '2025-08-20 13:07:42'),
(1404, 105, '2025-08-20', '-', 0, ' Logged In', 'Account Manager Staff account  manager  Logged In ', '-', '110.227.56.0', '2025-08-20 13:07:43', '2025-08-20 13:07:43'),
(1405, 105, '2025-08-20', '-', 0, ' Logged In', 'Account Manager Staff account  manager  Logged In ', '-', '110.227.56.0', '2025-08-20 13:07:43', '2025-08-20 13:07:43'),
(1406, 105, '2025-08-20', '-', 0, ' Logged In', 'Account Manager Staff account  manager  Logged In ', '-', '110.227.56.0', '2025-08-20 13:07:44', '2025-08-20 13:07:44'),
(1407, 105, '2025-08-20', '-', 0, ' Logged In', 'Account Manager Staff account  manager  Logged In ', '-', '110.227.56.0', '2025-08-20 13:07:44', '2025-08-20 13:07:44'),
(1408, 5, '2025-08-20', '-', 0, ' Logged Out', 'Account Manager shk hu  Logged Out ', '-', '110.227.56.0', '2025-08-20 13:07:44', '2025-08-20 13:07:44'),
(1409, 111, '2025-08-20', '-', 0, ' Logged Out', 'Account Manager staff acount manager multiple1  Logged Out ', '-', NULL, '2025-08-20 13:08:47', '2025-08-20 13:08:47'),
(1410, 113, '2025-08-20', '-', 0, ' Logged In', 'Account Manager staff acount manager multiple3  Logged In ', '-', NULL, '2025-08-20 13:08:56', '2025-08-20 13:08:56'),
(1411, 113, '2025-08-20', '-', 0, ' Logged Out', 'Account Manager staff acount manager multiple3  Logged Out ', '-', NULL, '2025-08-20 13:11:27', '2025-08-20 13:11:27'),
(1412, 105, '2025-08-20', 'customer', 109, 'created customer profile. customer code :', 'Account Manager Staff account  manager created customer profile. customer code : cust_tes_000090(test multiple)', 'created', '110.227.56.0', '2025-08-20 13:13:05', '2025-08-20 13:13:05'),
(1413, 105, '2025-08-20', 'customer', 109, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager Staff account  manager  edited the service details and added an additional service while editing the customer code : cust_tes_000090(test multiple)', 'updated', '110.227.56.0', '2025-08-20 13:13:14', '2025-08-20 13:13:14'),
(1414, 47, '2025-08-20', '-', 0, ' Logged In', 'Account Manager Tushar Sharma  Logged In ', '-', '122.168.114.106', '2025-08-20 13:13:39', '2025-08-20 13:13:39'),
(1415, 105, '2025-08-20', 'client', 79, 'created client profile. client code :', 'Account Manager Staff account  manager created client profile. client code : cli_tes_tes_000075(test)', 'created', '110.227.56.0', '2025-08-20 13:14:08', '2025-08-20 13:14:08'),
(1416, 47, '2025-08-20', '-', 0, ' Logged Out', 'Account Manager Tushar Sharma  Logged Out ', '-', '122.168.114.106', '2025-08-20 13:14:52', '2025-08-20 13:14:52'),
(1417, 105, '2025-08-20', 'job', 59, 'created job code:', 'Account Manager Staff account  manager created job code: tes_tes_Prep_000059', 'created', '110.227.56.0', '2025-08-20 13:16:03', '2025-08-20 13:16:03'),
(1418, 111, '2025-08-20', '-', 0, ' Logged In', 'Account Manager staff acount manager multiple1  Logged In ', '-', NULL, '2025-08-20 13:21:54', '2025-08-20 13:21:54'),
(1419, 105, '2025-08-20', 'job', 59, 'edited the job information and changed the job to the processor, staff acount manager multiple2 job code:', 'Account Manager Staff account  manager edited the job information and changed the job to the processor, staff acount manager multiple2 job code: tes_tes_Prep_000059', 'updated', '110.227.56.0', '2025-08-20 13:31:03', '2025-08-20 13:31:03'),
(1420, 105, '2025-08-20', 'job', 59, 'edited the job information and changed the job to the processor, Staff account  manager job code:', 'Account Manager Staff account  manager edited the job information and changed the job to the processor, Staff account  manager job code: tes_tes_Prep_000059', 'updated', '110.227.56.0', '2025-08-20 13:32:11', '2025-08-20 13:32:11'),
(1421, 111, '2025-08-20', '-', 0, ' Logged Out', 'Account Manager staff acount manager multiple1  Logged Out ', '-', NULL, '2025-08-20 13:33:17', '2025-08-20 13:33:17'),
(1422, 113, '2025-08-20', '-', 0, ' Logged In', 'Account Manager staff acount manager multiple3  Logged In ', '-', NULL, '2025-08-20 13:33:27', '2025-08-20 13:33:27'),
(1423, 112, '2025-08-20', '-', 0, ' Logged Out', 'Account Manager staff acount manager multiple2  Logged Out ', '-', '110.227.56.0', '2025-08-20 13:37:59', '2025-08-20 13:37:59'),
(1424, 110, '2025-08-20', '-', 0, ' Logged In', 'Support staff Support  Logged In ', '-', '110.227.56.0', '2025-08-20 13:38:09', '2025-08-20 13:38:09'),
(1425, 113, '2025-08-20', '-', 0, ' Logged Out', 'Account Manager staff acount manager multiple3  Logged Out ', '-', NULL, '2025-08-20 13:40:38', '2025-08-20 13:40:38'),
(1426, 110, '2025-08-20', '-', 0, ' Logged Out', 'Support staff Support  Logged Out ', '-', '110.227.56.0', '2025-08-20 13:40:57', '2025-08-20 13:40:57'),
(1427, 109, '2025-08-20', '-', 0, ' Logged In', 'Management Staff management  Logged In ', '-', '110.227.56.0', '2025-08-20 13:41:07', '2025-08-20 13:41:07'),
(1428, 106, '2025-08-20', '-', 0, ' Logged In', 'Processor Staff  Processor  Logged In ', '-', NULL, '2025-08-20 13:47:08', '2025-08-20 13:47:08'),
(1429, 109, '2025-08-20', '-', 0, ' Logged Out', 'Management Staff management  Logged Out ', '-', '110.227.56.0', '2025-08-20 13:53:33', '2025-08-20 13:53:33'),
(1430, 105, '2025-08-20', 'job', 59, 'edited the job information and changed the job to the processor, Staff  Processor job code:', 'Account Manager Staff account  manager edited the job information and changed the job to the processor, Staff  Processor job code: tes_tes_Prep_000059', 'updated', '110.227.56.0', '2025-08-20 13:54:52', '2025-08-20 13:54:52'),
(1431, 105, '2025-08-20', 'job', 59, 'edited the job information and changed the job to the processor, Staff account  manager job code:', 'Account Manager Staff account  manager edited the job information and changed the job to the processor, Staff account  manager job code: tes_tes_Prep_000059', 'updated', '110.227.56.0', '2025-08-20 13:55:46', '2025-08-20 13:55:46'),
(1432, 107, '2025-08-20', '-', 0, ' Logged In', 'Reviewer Staff  Reviewer  Logged In ', '-', '110.227.56.0', '2025-08-20 13:56:24', '2025-08-20 13:56:24'),
(1433, 105, '2025-08-20', 'job', 59, 'edited the job information and changed the job to the reviewer, Staff  Reviewer job code:', 'Account Manager Staff account  manager edited the job information and changed the job to the reviewer, Staff  Reviewer job code: tes_tes_Prep_000059', 'updated', '110.227.56.0', '2025-08-20 13:58:20', '2025-08-20 13:58:20'),
(1434, 105, '2025-08-20', 'job', 60, 'created job code:', 'Account Manager Staff account  manager created job code: tes_tes_Deta_000060', 'created', '110.227.56.0', '2025-08-20 13:59:51', '2025-08-20 13:59:51'),
(1435, 105, '2025-08-21', '-', 0, ' Logged Out', 'Account Manager Staff account  manager  Logged Out ', '-', '110.227.56.0', '2025-08-21 15:12:15', '2025-08-21 15:12:15'),
(1436, 105, '2025-08-21', '-', 0, ' Logged In', 'Account Manager Staff account  manager  Logged In ', '-', '110.227.56.0', '2025-08-21 15:12:24', '2025-08-21 15:12:24'),
(1437, 106, '2025-08-21', '-', 0, ' Logged Out', 'Processor Staff  Processor  Logged Out ', '-', NULL, '2025-08-21 15:13:33', '2025-08-21 15:13:33'),
(1438, 47, '2025-08-21', '-', 0, ' Logged In', 'Account Manager Tushar Sharma  Logged In ', '-', NULL, '2025-08-21 15:13:42', '2025-08-21 15:13:42'),
(1439, 47, '2025-08-21', '-', 0, ' Logged Out', 'Account Manager Tushar Sharma  Logged Out ', '-', NULL, '2025-08-21 15:15:26', '2025-08-21 15:15:26'),
(1440, 42, '2025-08-21', '-', 0, ' Logged In', 'Account Manager Mauli Mehta  Logged In ', '-', NULL, '2025-08-21 15:15:33', '2025-08-21 15:15:33'),
(1441, 42, '2025-08-21', '-', 0, ' Logged Out', 'Account Manager Mauli Mehta  Logged Out ', '-', NULL, '2025-08-21 15:16:17', '2025-08-21 15:16:17'),
(1442, 76, '2025-08-21', '-', 0, ' Logged In', 'Processor Harun Saifi   Mohammad   Logged In ', '-', NULL, '2025-08-21 15:16:28', '2025-08-21 15:16:28'),
(1443, 76, '2025-08-21', '-', 0, ' Logged Out', 'Processor Harun Saifi   Mohammad   Logged Out ', '-', NULL, '2025-08-21 15:17:31', '2025-08-21 15:17:31'),
(1444, 20, '2025-08-21', '-', 0, ' Logged In', 'Reviewer Pradeep Soni  Logged In ', '-', NULL, '2025-08-21 15:17:47', '2025-08-21 15:17:47'),
(1445, 1, '2025-08-23', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-08-23 12:30:21', '2025-08-23 12:30:21'),
(1446, 1, '2025-08-23', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-08-23 12:30:26', '2025-08-23 12:30:26'),
(1447, 1, '2025-08-23', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.42.128', '2025-08-23 12:55:59', '2025-08-23 12:55:59'),
(1448, 111, '2025-08-23', '-', 0, ' Logged In', 'Account Manager staff acount manager multiple1  Logged In ', '-', NULL, '2025-08-23 12:58:23', '2025-08-23 12:58:23'),
(1449, 111, '2025-08-23', 'customer', 108, 'edited the service details customer code :', 'Account Manager staff acount manager multiple1 edited the service details customer code : cust_BRA_000089(BRADFORD AUTO CARE LIMITED)', 'updated', '171.79.42.128', '2025-08-23 12:58:51', '2025-08-23 12:58:51'),
(1450, 112, '2025-08-23', '-', 0, ' Logged In', 'Account Manager staff acount manager multiple2  Logged In ', '-', '171.79.44.215', '2025-08-23 12:59:41', '2025-08-23 12:59:41'),
(1451, 111, '2025-08-23', 'customer', 110, 'created customer profile. customer code :', 'Account Manager staff acount manager multiple1 created customer profile. customer code : cust_D M_000091(D M HOLDINGS LTD)', 'created', '171.79.42.128', '2025-08-23 13:01:21', '2025-08-23 13:01:21'),
(1452, 111, '2025-08-23', 'customer', 110, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager staff acount manager multiple1  edited the service details and added an additional service while editing the customer code : cust_D M_000091(D M HOLDINGS LTD)', 'updated', '171.79.42.128', '2025-08-23 13:01:27', '2025-08-23 13:01:27'),
(1453, 111, '2025-08-23', 'customer', 110, 'edited the service details customer code :', 'Account Manager staff acount manager multiple1 edited the service details customer code : cust_D M_000091(D M HOLDINGS LTD)', 'updated', '171.79.42.128', '2025-08-23 13:03:22', '2025-08-23 13:03:22'),
(1454, 111, '2025-08-23', 'customer', 111, 'created customer profile. customer code :', 'Account Manager staff acount manager multiple1 created customer profile. customer code : cust_AIL_000092(AILYNE LTD)', 'created', '171.79.42.128', '2025-08-23 13:03:43', '2025-08-23 13:03:43'),
(1455, 111, '2025-08-23', 'client', 111, 'deleted customer. customer code :', NULL, 'deleted', '171.79.42.128', '2025-08-23 13:03:51', '2025-08-23 13:03:51'),
(1456, 111, '2025-08-23', 'client', 80, 'created client profile. client code :', 'Account Manager staff acount manager multiple1 created client profile. client code : cli_D M_HEA_000076(HEAVEN RETAIL LIMITED)', 'created', '171.79.42.128', '2025-08-23 13:04:10', '2025-08-23 13:04:10'),
(1457, 111, '2025-08-23', 'job', 61, 'created job code:', 'Account Manager staff acount manager multiple1 created job code: D M_HEA_PTR _000061', 'created', '171.79.42.128', '2025-08-23 13:05:47', '2025-08-23 13:05:47'),
(1458, 111, '2025-08-23', 'job', 62, 'created job code:', 'Account Manager staff acount manager multiple1 created job code: D M_HEA_Book_000062', 'created', '171.79.42.128', '2025-08-23 13:06:37', '2025-08-23 13:06:37'),
(1459, 40, '2025-08-23', '-', 0, ' Logged In', 'Account Manager Sandhya Bhardwaj  Logged In ', '-', '110.227.56.0', '2025-08-23 13:11:07', '2025-08-23 13:11:07'),
(1460, 1, '2025-08-25', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-08-25 11:52:45', '2025-08-25 11:52:45'),
(1461, 112, '2025-08-25', '-', 0, ' Logged Out', 'Account Manager staff acount manager multiple2  Logged Out ', '-', '171.79.42.128', '2025-08-25 12:46:16', '2025-08-25 12:46:16'),
(1462, 53, '2025-08-25', '-', 0, ' Logged In', 'Account Manager Vivek Singh  Logged In ', '-', '171.79.42.128', '2025-08-25 12:47:06', '2025-08-25 12:47:06'),
(1463, 40, '2025-08-25', '-', 0, ' Logged Out', 'Account Manager Sandhya Bhardwaj  Logged Out ', '-', '171.79.42.128', '2025-08-25 13:33:42', '2025-08-25 13:33:42'),
(1464, 1, '2025-08-26', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-08-26 04:48:25', '2025-08-26 04:48:25'),
(1465, 112, '2025-08-26', '-', 0, ' Logged In', 'Account Manager staff acount manager multiple2  Logged In ', '-', NULL, '2025-08-26 04:50:16', '2025-08-26 04:50:16'),
(1466, 1, '2025-08-27', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-08-27 10:15:53', '2025-08-27 10:15:53'),
(1467, 1, '2025-08-27', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-08-27 10:16:13', '2025-08-27 10:16:13'),
(1468, 1, '2025-09-04', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-09-04 11:27:03', '2025-09-04 11:27:03'),
(1469, 1, '2025-09-04', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-09-04 11:28:43', '2025-09-04 11:28:43');
INSERT INTO `staff_logs` (`id`, `staff_id`, `date`, `module_name`, `module_id`, `log_message`, `log_message_all`, `permission_type`, `ip`, `created_at`, `updated_at`) VALUES
(1470, 1, '2025-09-04', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.42.128', '2025-09-04 14:05:00', '2025-09-04 14:05:00'),
(1471, 113, '2025-09-04', '-', 0, ' Logged In', 'Account Manager staff acount manager multiple3  Logged In ', '-', NULL, '2025-09-04 14:08:58', '2025-09-04 14:08:58'),
(1472, 113, '2025-09-04', 'job', 60, 'edited the job information job code:', 'Account Manager staff acount manager multiple3 edited the job information job code: tes_tes_Full_000060', 'updated', '27.60.4.69', '2025-09-04 14:11:51', '2025-09-04 14:11:51'),
(1473, 113, '2025-09-04', 'customer', 112, 'created customer profile. customer code :', 'Account Manager staff acount manager multiple3 created customer profile. customer code : cust_AAR_000092(AARONS EXPRESS STORE LTD)', 'created', '27.60.4.69', '2025-09-04 14:13:08', '2025-09-04 14:13:08'),
(1474, 113, '2025-09-04', 'customer', 112, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager staff acount manager multiple3  edited the service details and added an additional service while editing the customer code : cust_AAR_000092(AARONS EXPRESS STORE LTD)', 'updated', '27.60.4.69', '2025-09-04 14:13:15', '2025-09-04 14:13:15'),
(1475, 113, '2025-09-04', 'client', 81, 'created client profile. client code :', 'Account Manager staff acount manager multiple3 created client profile. client code : cli_AAR_CUS_000077(CUSTOM OF THE COUNTY LIMITED)', 'created', '27.60.4.69', '2025-09-04 14:13:44', '2025-09-04 14:13:44'),
(1476, 113, '2025-09-04', 'job', 63, 'created job code:', 'Account Manager staff acount manager multiple3 created job code: AAR_CUS_Deta_000063', 'created', '27.60.4.69', '2025-09-04 14:14:14', '2025-09-04 14:14:14'),
(1477, 113, '2025-09-04', 'timesheet', 0, 'created a timesheet entry. Task type:External,  Date: 2025-08-25, Hours : 2:00 Date: 2025-08-27, Hours : 4:00 Date: 2025-08-29, Hours : 4:50 ,Job code:AAR_CUS_Deta_000063, Task name:testtesttest', 'Account Manager staff acount manager multiple3 created a timesheet entry. Task type:External,  Date: 2025-08-25, Hours : 2:00 Date: 2025-08-27, Hours : 4:00 Date: 2025-08-29, Hours : 4:50 ,Job code:AAR_CUS_Deta_000063, Task name:testtesttest ', 'updated', '0.0.0.0', '2025-09-04 14:14:55', '2025-09-04 14:14:55'),
(1478, 1, '2025-09-06', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-09-06 05:08:43', '2025-09-06 05:08:43'),
(1479, 1, '2025-09-06', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-09-06 08:37:17', '2025-09-06 08:37:17'),
(1480, 1, '2025-09-08', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-09-08 06:20:04', '2025-09-08 06:20:04'),
(1481, 1, '2025-09-08', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.60.4.69', '2025-09-08 12:24:51', '2025-09-08 12:24:51'),
(1482, 1, '2025-09-08', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '106.207.220.121', '2025-09-08 12:28:59', '2025-09-08 12:28:59'),
(1483, 1, '2025-09-08', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '106.207.220.121', '2025-09-08 12:29:06', '2025-09-08 12:29:06'),
(1484, 1, '2025-09-08', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '106.207.223.255', '2025-09-08 13:23:04', '2025-09-08 13:23:04'),
(1485, 1, '2025-09-08', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '106.207.223.255', '2025-09-08 13:23:10', '2025-09-08 13:23:10'),
(1486, 113, '2025-09-08', '-', 0, ' Logged In', 'Account Manager staff acount manager multiple3  Logged In ', '-', '106.207.223.255', '2025-09-08 13:35:57', '2025-09-08 13:35:57'),
(1487, 9, '2025-09-08', '-', 0, ' Logged In', 'Account Manager Hitixa Raja  Logged In ', '-', NULL, '2025-09-08 13:38:56', '2025-09-08 13:38:56'),
(1488, 1, '2025-09-09', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.37.237', '2025-09-09 04:47:05', '2025-09-09 04:47:05'),
(1489, 1, '2025-09-09', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-09-09 04:52:04', '2025-09-09 04:52:04'),
(1490, 1, '2025-09-12', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-09-12 13:19:45', '2025-09-12 13:19:45'),
(1491, 1, '2025-09-12', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-09-12 13:21:22', '2025-09-12 13:21:22'),
(1492, 1, '2025-09-12', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '106.207.223.255', '2025-09-12 13:36:00', '2025-09-12 13:36:00'),
(1493, 112, '2025-09-12', '-', 0, ' Logged In', 'Account Manager staff acount manager multiple2  Logged In ', '-', NULL, '2025-09-12 13:41:58', '2025-09-12 13:41:58'),
(1494, 112, '2025-09-12', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2025-06-02, Hours : 1:00 Date: 2025-06-04, Hours : 1:00 Date: 2025-06-05, Hours : 20:00 Date: 2025-06-06, Hours : 1:00 Date: 2025-06-07, Hours : 1:00 ,Job code:Training, Task name:Onboarding, Task type:Internal,  Date: 2025-06-02, Hours : 19:00 Date: 2025-06-03, Hours : 2:00 Date: 2025-06-04, Hours : 9:00 Date: 2025-06-05, Hours : 2:00 Date: 2025-06-06, Hours : 2:00 Date: 2025-06-07, Hours : 1:00 ,Job code:Training, Task name:Onboarding, Task type:External,  Date: 2025-06-02, Hours : 1:00 Date: 2025-06-03, Hours : 1:00 Date: 2025-06-04, Hours : 1:00 Date: 2025-06-05, Hours : 3:00 Date: 2025-06-06, Hours : 1:00 Date: 2025-06-07, Hours : 1:00 ,Job code:D M_HEA_Book_000062, Task name:test and Task type:External,  Date: 2025-06-02, Hours : 1:00 Date: 2025-06-04, Hours : 1:00 Date: 2025-06-06, Hours : 1:00 ,Job code:D M_HEA_Book_000062, Task name:test', 'Account Manager staff acount manager multiple2 submitted a timesheet entry. Task type:Internal,  Date: 2025-06-02, Hours : 1:00 Date: 2025-06-04, Hours : 1:00 Date: 2025-06-05, Hours : 20:00 Date: 2025-06-06, Hours : 1:00 Date: 2025-06-07, Hours : 1:00 ,Job code:Training, Task name:Onboarding, Task type:Internal,  Date: 2025-06-02, Hours : 19:00 Date: 2025-06-03, Hours : 2:00 Date: 2025-06-04, Hours : 9:00 Date: 2025-06-05, Hours : 2:00 Date: 2025-06-06, Hours : 2:00 Date: 2025-06-07, Hours : 1:00 ,Job code:Training, Task name:Onboarding, Task type:External,  Date: 2025-06-02, Hours : 1:00 Date: 2025-06-03, Hours : 1:00 Date: 2025-06-04, Hours : 1:00 Date: 2025-06-05, Hours : 3:00 Date: 2025-06-06, Hours : 1:00 Date: 2025-06-07, Hours : 1:00 ,Job code:D M_HEA_Book_000062, Task name:test and Task type:External,  Date: 2025-06-02, Hours : 1:00 Date: 2025-06-04, Hours : 1:00 Date: 2025-06-06, Hours : 1:00 ,Job code:D M_HEA_Book_000062, Task name:test ', 'updated', '0.0.0.0', '2025-09-12 13:43:55', '2025-09-12 13:43:55'),
(1495, 112, '2025-09-12', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2025-09-08, Hours : 1:00 Date: 2025-09-09, Hours : 4:00 Date: 2025-09-10, Hours : 2:00 Date: 2025-09-11, Hours : 3:00 Date: 2025-09-13, Hours : 5:00 ,Job code:National Holiday, Task name:Christmas , Task type:Internal,  Date: 2025-09-08, Hours : 5:50 Date: 2025-09-09, Hours : 5:00 Date: 2025-09-10, Hours : 6:00 Date: 2025-09-12, Hours : 7:00 Date: 2025-09-13, Hours : 7:00 ,Job code:Training, Task name:Onboarding and Task type:External,  Date: 2025-09-08, Hours : 5:00 Date: 2025-09-10, Hours : 6:00 Date: 2025-09-12, Hours : 7:00 Date: 2025-09-13, Hours : 10:00 ,Job code:D M_HEA_Book_000062, Task name:test', 'Account Manager staff acount manager multiple2 submitted a timesheet entry. Task type:Internal,  Date: 2025-09-08, Hours : 1:00 Date: 2025-09-09, Hours : 4:00 Date: 2025-09-10, Hours : 2:00 Date: 2025-09-11, Hours : 3:00 Date: 2025-09-13, Hours : 5:00 ,Job code:National Holiday, Task name:Christmas , Task type:Internal,  Date: 2025-09-08, Hours : 5:50 Date: 2025-09-09, Hours : 5:00 Date: 2025-09-10, Hours : 6:00 Date: 2025-09-12, Hours : 7:00 Date: 2025-09-13, Hours : 7:00 ,Job code:Training, Task name:Onboarding and Task type:External,  Date: 2025-09-08, Hours : 5:00 Date: 2025-09-10, Hours : 6:00 Date: 2025-09-12, Hours : 7:00 Date: 2025-09-13, Hours : 10:00 ,Job code:D M_HEA_Book_000062, Task name:test ', 'updated', '0.0.0.0', '2025-09-12 13:53:04', '2025-09-12 13:53:04'),
(1496, 1, '2025-09-12', 'staff', 113, 'edited staff staff acount manager multiple3', 'Super Admin System Super Super Admin edited staff staff acount manager multiple3 ', 'updated', '171.79.39.160', '2025-09-12 14:03:41', '2025-09-12 14:03:41'),
(1497, 1, '2025-09-13', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-09-13 13:27:08', '2025-09-13 13:27:08'),
(1498, 1, '2025-09-13', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-09-13 13:29:03', '2025-09-13 13:29:03'),
(1499, 1, '2025-09-15', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-09-15 08:52:51', '2025-09-15 08:52:51'),
(1500, 1, '2025-09-15', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-09-15 12:28:09', '2025-09-15 12:28:09'),
(1501, 1, '2025-09-15', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-09-15 12:34:26', '2025-09-15 12:34:26'),
(1502, 1, '2025-09-15', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-09-15 13:10:37', '2025-09-15 13:10:37'),
(1503, 1, '2025-09-15', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.46.107', '2025-09-15 13:24:16', '2025-09-15 13:24:16'),
(1504, 1, '2025-09-16', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-09-16 04:49:38', '2025-09-16 04:49:38'),
(1505, 1, '2025-09-19', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-09-19 11:10:15', '2025-09-19 11:10:15'),
(1506, 1, '2025-09-19', 'job', 64, 'created job code:', 'Super Admin System Super Super Admin created job code: AAR_CUS_Deta_000064', 'created', '122.168.114.106', '2025-09-19 11:12:40', '2025-09-19 11:12:40'),
(1507, 1, '2025-09-19', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-09-19 11:12:49', '2025-09-19 11:12:49'),
(1508, 1, '2025-09-22', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.46.107', '2025-09-22 14:59:51', '2025-09-22 14:59:51'),
(1509, 34, '2025-09-22', '-', 0, ' Logged In', 'Account Manager vikas for test  Logged In ', '-', NULL, '2025-09-22 15:06:11', '2025-09-22 15:06:11'),
(1510, 34, '2025-09-22', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2025-09-01, Hours : 012:00 Date: 2025-09-02, Hours : 12:00 Date: 2025-09-03, Hours : 12:00 Date: 2025-09-04, Hours : 4:00 ,Job code:Training, Task name:Onboarding and Task type:External,  Date: 2025-09-01, Hours : 12:00 Date: 2025-09-02, Hours : 4:00 Date: 2025-09-04, Hours : 5:00 ,Job code:GE _Nor_Book_000021, Task name:test', 'Account Manager vikas for test submitted a timesheet entry. Task type:Internal,  Date: 2025-09-01, Hours : 012:00 Date: 2025-09-02, Hours : 12:00 Date: 2025-09-03, Hours : 12:00 Date: 2025-09-04, Hours : 4:00 ,Job code:Training, Task name:Onboarding and Task type:External,  Date: 2025-09-01, Hours : 12:00 Date: 2025-09-02, Hours : 4:00 Date: 2025-09-04, Hours : 5:00 ,Job code:GE _Nor_Book_000021, Task name:test ', 'updated', '0.0.0.0', '2025-09-22 15:07:14', '2025-09-22 15:07:14'),
(1511, 1, '2025-09-22', 'customer', 113, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_F L_000093(F LIMITED)', 'created', '171.79.37.91', '2025-09-22 15:12:00', '2025-09-22 15:12:00'),
(1512, 1, '2025-09-22', 'customer', 113, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_F L_000093(F LIMITED)', 'updated', '171.79.37.91', '2025-09-22 15:12:27', '2025-09-22 15:12:27'),
(1513, 1, '2025-09-22', 'client', 82, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_F L_D M_000078(D M HOLDINGS LTD)', 'created', '171.79.37.91', '2025-09-22 15:13:02', '2025-09-22 15:13:02'),
(1514, 1, '2025-09-22', 'job types', 28, 'created job types test', 'Super Admin System Super Super Admin created job types test ', 'created', '171.79.37.91', '2025-09-22 15:13:42', '2025-09-22 15:13:42'),
(1515, 1, '2025-09-22', 'job types', 29, 'created job types test', 'Super Admin System Super Super Admin created job types test ', 'created', '171.79.37.91', '2025-09-22 15:13:55', '2025-09-22 15:13:55'),
(1516, 1, '2025-09-22', 'job types', 30, 'created job types test', 'Super Admin System Super Super Admin created job types test ', 'created', '171.79.37.91', '2025-09-22 15:14:07', '2025-09-22 15:14:07'),
(1517, 1, '2025-09-22', 'job types', 31, 'created job types test', 'Super Admin System Super Super Admin created job types test ', 'created', '171.79.37.91', '2025-09-22 15:14:19', '2025-09-22 15:14:19'),
(1518, 1, '2025-09-22', 'job types', 32, 'created job types test', 'Super Admin System Super Super Admin created job types test ', 'created', '171.79.37.91', '2025-09-22 15:14:36', '2025-09-22 15:14:36'),
(1519, 1, '2025-09-22', 'job types', 33, 'created job types test', 'Super Admin System Super Super Admin created job types test ', 'created', '171.79.37.91', '2025-09-22 15:14:47', '2025-09-22 15:14:47'),
(1520, 1, '2025-09-22', 'job types', 34, 'created job types test', 'Super Admin System Super Super Admin created job types test ', 'created', '171.79.37.91', '2025-09-22 15:14:58', '2025-09-22 15:14:58'),
(1521, 1, '2025-09-22', 'job types', 35, 'created job types test', 'Super Admin System Super Super Admin created job types test ', 'created', '171.79.37.91', '2025-09-22 15:15:11', '2025-09-22 15:15:11'),
(1522, 1, '2025-09-22', 'job', 65, 'created job code:', 'Super Admin System Super Super Admin created job code: F L_D M_test_000065', 'created', '171.79.37.91', '2025-09-22 15:19:25', '2025-09-22 15:19:25'),
(1523, 1, '2025-09-23', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.37.91', '2025-09-23 13:36:50', '2025-09-23 13:36:50'),
(1524, 1, '2025-09-23', 'job', 66, 'created job code:', 'Super Admin System Super Super Admin created job code: F L_D M_test_000066', 'created', '171.79.44.155', '2025-09-23 15:23:58', '2025-09-23 15:23:58'),
(1525, 1, '2025-09-23', 'job', 67, 'created job code:', 'Super Admin System Super Super Admin created job code: F L_D M_test_000067', 'created', '171.79.44.155', '2025-09-23 15:24:43', '2025-09-23 15:24:43'),
(1526, 1, '2025-09-23', 'job', 68, 'created job code:', 'Super Admin System Super Super Admin created job code: F L_D M_test_000068', 'created', '171.79.44.155', '2025-09-23 15:25:51', '2025-09-23 15:25:51'),
(1527, 1, '2025-09-23', 'job', 69, 'created job code:', 'Super Admin System Super Super Admin created job code: F L_D M_test_000069', 'created', '171.79.44.155', '2025-09-23 15:27:44', '2025-09-23 15:27:44'),
(1528, 1, '2025-09-23', 'job', 70, 'created job code:', 'Super Admin System Super Super Admin created job code: F L_D M_test_000070', 'created', '171.79.44.155', '2025-09-23 15:28:41', '2025-09-23 15:28:41'),
(1529, 1, '2025-09-24', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-09-24 04:57:00', '2025-09-24 04:57:00'),
(1530, 1, '2025-09-24', 'job', 71, 'created job code:', 'Super Admin System Super Super Admin created job code: F L_D M_test_000071', 'created', '122.168.114.106', '2025-09-24 05:03:36', '2025-09-24 05:03:36'),
(1531, 1, '2025-09-24', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.44.155', '2025-09-24 13:09:48', '2025-09-24 13:09:48'),
(1532, 1, '2025-09-24', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-09-24 13:12:52', '2025-09-24 13:12:52'),
(1533, 1, '2025-09-24', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-09-24 13:13:16', '2025-09-24 13:13:16'),
(1534, 1, '2025-09-24', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-09-24 13:16:25', '2025-09-24 13:16:25'),
(1535, 1, '2025-09-24', 'job', 72, 'created job code:', 'Super Admin System Super Super Admin created job code: F L_D M_Work_000072', 'created', '171.79.47.82', '2025-09-24 14:40:56', '2025-09-24 14:40:56'),
(1536, 1, '2025-09-24', 'job', 72, 'deletes job code:', 'Super Admin System Super Super Admin deletes job code: F L_D M_Work_000072', 'deleted', '171.79.47.82', '2025-09-24 14:41:09', '2025-09-24 14:41:09'),
(1537, 1, '2025-09-25', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-09-25 06:42:58', '2025-09-25 06:42:58'),
(1538, 1, '2025-09-25', 'task', 0, 'created task A,B,', 'Super Admin System Super Super Admin created task A,B, ', 'created', '122.168.114.106', '2025-09-25 06:52:44', '2025-09-25 06:52:44'),
(1539, 1, '2025-09-25', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-09-25 06:59:50', '2025-09-25 06:59:50'),
(1540, 1, '2025-09-25', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-09-25 07:11:35', '2025-09-25 07:11:35'),
(1541, 1, '2025-09-25', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-09-25 12:18:34', '2025-09-25 12:18:34'),
(1542, 1, '2025-09-25', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-09-25 12:19:23', '2025-09-25 12:19:23'),
(1543, 1, '2025-09-25', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '171.79.47.82', '2025-09-25 14:16:50', '2025-09-25 14:16:50'),
(1544, 9, '2025-09-25', '-', 0, ' Logged In', 'Admin Hitixa Raja  Logged In ', '-', NULL, '2025-09-25 14:23:02', '2025-09-25 14:23:02'),
(1545, 9, '2025-09-25', 'customer', 80, 'edited the company information customer code :', 'Admin Hitixa Raja edited the company information customer code : cust_ANT_000061(ANTICUS RECRUITMENT LTD_000061)', 'updated', '110.227.55.144', '2025-09-25 14:25:01', '2025-09-25 14:25:01'),
(1546, 9, '2025-09-25', 'customer', 80, 'edited the service details customer code :', 'Admin Hitixa Raja edited the service details customer code : cust_ANT_000061(ANTICUS RECRUITMENT LTD_000061)', 'updated', '110.227.55.144', '2025-09-25 14:25:03', '2025-09-25 14:25:03'),
(1547, 1, '2025-09-27', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-09-27 11:28:32', '2025-09-27 11:28:32'),
(1548, 1, '2025-09-27', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-09-27 11:42:27', '2025-09-27 11:42:27'),
(1549, 1, '2025-09-27', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.55.144', '2025-09-27 12:48:26', '2025-09-27 12:48:26'),
(1550, 111, '2025-09-27', '-', 0, ' Logged In', 'Account Manager staff acount manager multiple1  Logged In ', '-', '110.227.55.144', '2025-09-27 12:50:55', '2025-09-27 12:50:55'),
(1551, 111, '2025-09-27', '-', 0, ' Logged In', 'Account Manager staff acount manager multiple1  Logged In ', '-', '110.227.55.144', '2025-09-27 12:50:56', '2025-09-27 12:50:56'),
(1552, 111, '2025-09-27', 'customer', 114, 'created customer profile. customer code :', 'Account Manager staff acount manager multiple1 created customer profile. customer code : cust_CLA_000094(CLARKES OF BOWLEY LIMITED)', 'created', '27.59.117.231', '2025-09-27 12:55:03', '2025-09-27 12:55:03'),
(1553, 111, '2025-09-27', 'customer', 114, ' edited the service details and added an additional service while editing the customer code :', 'Account Manager staff acount manager multiple1  edited the service details and added an additional service while editing the customer code : cust_CLA_000094(CLARKES OF BOWLEY LIMITED)', 'updated', '27.59.117.231', '2025-09-27 12:56:06', '2025-09-27 12:56:06'),
(1554, 111, '2025-09-27', 'client', 83, 'created client profile. client code :', 'Account Manager staff acount manager multiple1 created client profile. client code : cli_CLA_DEV_000079(DEVONSHIRE HOTELS & RESTAURANTS GROUP LIMITED)', 'created', '27.59.117.231', '2025-09-27 12:59:36', '2025-09-27 12:59:36'),
(1555, 111, '2025-09-27', 'job', 73, 'created job code:', 'Account Manager staff acount manager multiple1 created job code: CLA_DEV_test_000072', 'created', '27.59.117.231', '2025-09-27 13:03:06', '2025-09-27 13:03:06'),
(1556, 111, '2025-09-27', 'job', 73, 'updated the job status from To Be Started - Not Yet Allocated Internally to Not Progressing - Duplicate. job code:', 'Account Manager staff acount manager multiple1 updated the job status from To Be Started - Not Yet Allocated Internally to Not Progressing - Duplicate. job code: CLA_DEV_test_000072', 'updated', '27.59.117.231', '2025-09-27 13:03:33', '2025-09-27 13:03:33'),
(1557, 1, '2025-09-27', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '110.227.55.144', '2025-09-27 13:04:44', '2025-09-27 13:04:44'),
(1558, 1, '2025-09-27', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.227.55.144', '2025-09-27 13:08:12', '2025-09-27 13:08:12'),
(1559, 1, '2025-09-29', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-09-29 04:48:37', '2025-09-29 04:48:37'),
(1560, 1, '2025-09-29', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-09-29 04:48:37', '2025-09-29 04:48:37'),
(1561, 1, '2025-09-29', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-09-29 05:06:25', '2025-09-29 05:06:25'),
(1562, 1, '2025-09-29', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-09-29 05:30:44', '2025-09-29 05:30:44'),
(1563, 1, '2025-09-29', 'customer', 115, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_D10_000095(D10S HOLDING LTD)', 'created', '122.168.114.106', '2025-09-29 06:14:53', '2025-09-29 06:14:53'),
(1564, 1, '2025-09-29', 'customer', 115, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_D10_000095(D10S HOLDING LTD)', 'updated', '122.168.114.106', '2025-09-29 06:32:51', '2025-09-29 06:32:51'),
(1565, 1, '2025-09-29', 'customer', 115, 'edited the service details customer code :', 'Super Admin System Super Super Admin edited the service details customer code : cust_D10_000095(D10S HOLDING LTD)', 'updated', '122.168.114.106', '2025-09-29 06:33:08', '2025-09-29 06:33:08'),
(1566, 1, '2025-09-29', 'customer', 115, 'edited the service details customer code :', 'Super Admin System Super Super Admin edited the service details customer code : cust_D10_000095(D10S HOLDING LTD)', 'updated', '122.168.114.106', '2025-09-29 06:33:20', '2025-09-29 06:33:20'),
(1567, 1, '2025-09-29', 'customer', 116, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_LA _000096(LA MANO DE D10S LTD)', 'created', '122.168.114.106', '2025-09-29 06:46:39', '2025-09-29 06:46:39'),
(1568, 1, '2025-09-29', 'customer', 116, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_LA _000096(LA MANO DE D10S LTD)', 'updated', '122.168.114.106', '2025-09-29 06:46:49', '2025-09-29 06:46:49'),
(1569, 1, '2025-09-29', 'customer', 114, 'changes the status Deactivate customer code :', 'Super Admin System Super Super Admin changes the status Deactivate customer code : cust_CLA_000094(CLARKES OF BOWLEY LIMITED)', 'updated', '122.168.114.106', '2025-09-29 07:11:26', '2025-09-29 07:11:26'),
(1570, 1, '2025-09-29', 'customer', 114, 'changes the status Activate customer code :', 'Super Admin System Super Super Admin changes the status Activate customer code : cust_CLA_000094(CLARKES OF BOWLEY LIMITED)', 'updated', '122.168.114.106', '2025-09-29 08:25:46', '2025-09-29 08:25:46'),
(1571, 1, '2025-10-04', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-10-04 11:31:54', '2025-10-04 11:31:54'),
(1572, 1, '2025-10-04', 'task', 0, 'created task task bookkiping,task 2 bookkiping,', 'Super Admin System Super Super Admin created task task bookkiping,task 2 bookkiping, ', 'created', '122.168.114.106', '2025-10-04 11:33:43', '2025-10-04 11:33:43'),
(1573, 1, '2025-10-04', 'job', 74, 'created job code:', 'Super Admin System Super Super Admin created job code: CLA_DEV_test_000073', 'created', '122.168.114.106', '2025-10-04 11:34:40', '2025-10-04 11:34:40'),
(1574, 1, '2025-10-04', 'job', 74, 'edited the job information job code:', 'Super Admin System Super Super Admin edited the job information job code: CLA_DEV_test_000073', 'updated', '122.168.114.106', '2025-10-04 11:34:57', '2025-10-04 11:34:57'),
(1575, 1, '2025-10-04', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-10-04 11:35:04', '2025-10-04 11:35:04'),
(1576, 1, '2025-10-04', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-10-04 13:21:13', '2025-10-04 13:21:13'),
(1577, 1, '2025-10-04', 'task', 108, 'deleted task A', 'Super Admin System Super Super Admin deleted task A ', 'deleted', '110.224.166.120', '2025-10-04 13:22:47', '2025-10-04 13:22:47'),
(1578, 1, '2025-10-04', 'task', 109, 'deleted task B', 'Super Admin System Super Super Admin deleted task B ', 'deleted', '110.224.166.120', '2025-10-04 13:22:54', '2025-10-04 13:22:54'),
(1579, 1, '2025-10-04', 'customer', 116, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_LA _000096(LA MANO DE D10S LTD)', 'updated', '110.224.166.120', '2025-10-04 13:23:31', '2025-10-04 13:23:31'),
(1580, 1, '2025-10-04', 'client', 84, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_LA _H P_000080(H PARKVIEW LTD)', 'created', '110.224.166.120', '2025-10-04 13:24:03', '2025-10-04 13:24:03'),
(1581, 1, '2025-10-04', 'task', 0, 'created task test,test2,', 'Super Admin System Super Super Admin created task test,test2, ', 'created', '110.224.166.120', '2025-10-04 13:26:53', '2025-10-04 13:26:53'),
(1582, 1, '2025-10-04', 'job', 75, 'created job code:', 'Super Admin System Super Super Admin created job code: LA _H P_test_000074', 'created', '110.224.166.120', '2025-10-04 13:28:24', '2025-10-04 13:28:24'),
(1583, 112, '2025-10-04', '-', 0, ' Logged In', 'Account Manager staff acount manager multiple2  Logged In ', '-', NULL, '2025-10-04 13:32:08', '2025-10-04 13:32:08'),
(1584, 112, '2025-10-04', 'job', 76, 'created job code:', 'Account Manager staff acount manager multiple2 created job code: LA _H P_test_000075', 'created', '110.224.166.120', '2025-10-04 13:32:38', '2025-10-04 13:32:38'),
(1585, 1, '2025-10-06', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '152.59.48.60', '2025-10-06 05:08:22', '2025-10-06 05:08:22'),
(1586, 1, '2025-10-06', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '116.72.201.106', '2025-10-06 10:28:53', '2025-10-06 10:28:53'),
(1587, 1, '2025-10-06', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-10-06 10:29:33', '2025-10-06 10:29:33'),
(1588, 1, '2025-10-06', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-10-06 10:43:29', '2025-10-06 10:43:29'),
(1589, 1, '2025-10-06', 'job', 77, 'created job code:', 'Super Admin System Super Super Admin created job code: LA _H P_test_000076', 'created', '110.224.175.220', '2025-10-06 10:45:10', '2025-10-06 10:45:10'),
(1590, 1, '2025-10-06', 'job', 77, 'edited the job information job code:', 'Super Admin System Super Super Admin edited the job information job code: LA _H P_test_000076', 'updated', '110.224.175.220', '2025-10-06 10:45:35', '2025-10-06 10:45:35'),
(1591, 1, '2025-10-06', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-10-06 10:48:11', '2025-10-06 10:48:11'),
(1592, 1, '2025-10-06', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-10-06 11:16:04', '2025-10-06 11:16:04'),
(1593, 2, '2025-10-06', '-', 0, ' Logged In', 'Super Admin Amit Agarwal  Logged In ', '-', '122.168.114.106', '2025-10-06 11:19:53', '2025-10-06 11:19:53'),
(1594, 1, '2025-10-06', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-10-06 12:14:29', '2025-10-06 12:14:29'),
(1595, 1, '2025-10-06', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-10-06 12:14:55', '2025-10-06 12:14:55'),
(1596, 1, '2025-10-06', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.224.166.120', '2025-10-06 12:31:03', '2025-10-06 12:31:03'),
(1597, 1, '2025-10-06', 'task', 107, 'edited task undefined to Prepare Initial Query', 'Super Admin System Super Super Admin edited task undefined to Prepare Initial Query ', 'updated', '110.224.169.177', '2025-10-06 12:31:29', '2025-10-06 12:31:29'),
(1598, 1, '2025-10-06', 'job', 78, 'created job code:', 'Super Admin System Super Super Admin created job code: LA _H P_test_000077', 'created', '110.224.169.177', '2025-10-06 12:33:37', '2025-10-06 12:33:37'),
(1599, 1, '2025-10-09', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-10-09 04:44:37', '2025-10-09 04:44:37'),
(1600, 1, '2025-10-09', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.224.174.173', '2025-10-09 04:45:01', '2025-10-09 04:45:01'),
(1601, 1, '2025-10-09', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-10-09 04:50:23', '2025-10-09 04:50:23'),
(1602, 1, '2025-10-09', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '27.59.118.95', '2025-10-09 07:00:55', '2025-10-09 07:00:55'),
(1603, 1, '2025-10-09', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.118.95', '2025-10-09 07:01:13', '2025-10-09 07:01:13'),
(1604, 1, '2025-10-09', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-10-09 07:12:44', '2025-10-09 07:12:44'),
(1605, 1, '2025-10-09', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-10-09 07:12:58', '2025-10-09 07:12:58'),
(1606, 1, '2025-10-09', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-10-09 07:15:52', '2025-10-09 07:15:52'),
(1607, 1, '2025-10-09', 'job', 79, 'created job code:', 'Super Admin System Super Super Admin created job code: LA _H P_test_000078', 'created', '27.59.118.95', '2025-10-09 07:17:51', '2025-10-09 07:17:51'),
(1608, 1, '2025-10-09', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-10-09 07:41:57', '2025-10-09 07:41:57'),
(1609, 1, '2025-10-09', 'job', 79, 'edited the job information job code:', 'Super Admin System Super Super Admin edited the job information job code: LA _H P_test_000078', 'updated', '27.59.118.95', '2025-10-09 07:42:41', '2025-10-09 07:42:41'),
(1610, 1, '2025-10-10', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.124.131', '2025-10-10 16:17:28', '2025-10-10 16:17:28'),
(1611, 1, '2025-10-10', 'Internal', 10, 'created Internal Job/Project Test', 'Super Admin System Super Super Admin created Internal Job/Project Test ', 'created', '27.59.124.131', '2025-10-10 16:17:53', '2025-10-10 16:17:53'),
(1612, 1, '2025-10-13', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-10-13 12:11:37', '2025-10-13 12:11:37'),
(1613, 1, '2025-10-13', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-10-13 12:16:03', '2025-10-13 12:16:03'),
(1614, 1, '2025-10-13', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-10-13 12:38:46', '2025-10-13 12:38:46'),
(1615, 1, '2025-10-15', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.116.30', '2025-10-15 13:36:18', '2025-10-15 13:36:18'),
(1616, 1, '2025-10-16', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '106.207.212.45', '2025-10-16 09:16:52', '2025-10-16 09:16:52'),
(1617, 1, '2025-10-16', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-10-16 09:40:25', '2025-10-16 09:40:25'),
(1618, 1, '2025-10-16', 'task', 104, 'deleted task Miscellaneous Tasks', 'Super Admin System Super Super Admin deleted task Miscellaneous Tasks ', 'deleted', '122.168.114.106', '2025-10-16 09:40:59', '2025-10-16 09:40:59'),
(1619, 1, '2025-10-16', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.224.169.177', '2025-10-16 12:44:58', '2025-10-16 12:44:58'),
(1620, 1, '2025-10-16', 'task', 72, 'edited task undefined to tst', 'Super Admin System Super Super Admin edited task undefined to tst ', 'updated', '106.207.214.227', '2025-10-16 12:45:37', '2025-10-16 12:45:37'),
(1621, 1, '2025-10-16', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '106.207.214.227', '2025-10-16 12:56:04', '2025-10-16 12:56:04'),
(1622, 1, '2025-10-17', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '106.207.227.251', '2025-10-17 02:50:25', '2025-10-17 02:50:25'),
(1623, 1, '2025-10-17', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-10-17 05:04:56', '2025-10-17 05:04:56'),
(1624, 1, '2025-10-22', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-10-22 04:59:50', '2025-10-22 04:59:50'),
(1625, 1, '2025-10-22', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-10-22 05:34:35', '2025-10-22 05:34:35'),
(1626, 1, '2025-10-22', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-10-22 12:05:37', '2025-10-22 12:05:37'),
(1627, 1, '2025-10-22', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-10-22 13:33:43', '2025-10-22 13:33:43'),
(1628, 1, '2025-10-23', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.224.171.41', '2025-10-23 15:12:48', '2025-10-23 15:12:48'),
(1629, 1, '2025-10-24', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-10-24 04:46:35', '2025-10-24 04:46:35'),
(1630, 1, '2025-10-24', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '110.224.168.194', '2025-10-24 05:31:26', '2025-10-24 05:31:26'),
(1631, 1, '2025-10-24', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.224.168.194', '2025-10-24 05:31:44', '2025-10-24 05:31:44'),
(1632, 1, '2025-10-24', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-10-24 05:42:36', '2025-10-24 05:42:36'),
(1633, 1, '2025-10-24', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-10-24 07:09:53', '2025-10-24 07:09:53'),
(1634, 1, '2025-10-24', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-10-24 08:10:16', '2025-10-24 08:10:16'),
(1635, 1, '2025-10-24', 'job', 79, 'updated the job status from To Be Started - Not Yet Allocated Internally to Completed - Update Sent. job code:', 'Super Admin System Super Super Admin updated the job status from To Be Started - Not Yet Allocated Internally to Completed - Update Sent. job code: LA _H P_test_000078', 'updated', '110.224.171.230', '2025-10-24 08:11:15', '2025-10-24 08:11:15'),
(1636, 1, '2025-10-24', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-10-24 08:54:28', '2025-10-24 08:54:28'),
(1637, 1, '2025-10-24', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-10-24 09:07:24', '2025-10-24 09:07:24'),
(1638, 1, '2025-10-24', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-10-24 09:18:40', '2025-10-24 09:18:40'),
(1639, 1, '2025-10-24', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '106.207.214.227', '2025-10-24 09:30:40', '2025-10-24 09:30:40'),
(1640, 1, '2025-10-24', 'job', 79, 'sent the draft for job code:', 'Super Admin System Super Super Admin sent the draft for job code: LA _H P_test_000078', 'created', '27.59.126.69', '2025-10-24 09:45:54', '2025-10-24 09:45:54'),
(1641, 1, '2025-10-24', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-10-24 11:51:54', '2025-10-24 11:51:54'),
(1642, 1, '2025-10-25', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-10-25 06:05:26', '2025-10-25 06:05:26'),
(1643, 1, '2025-10-25', 'job', 80, 'created job code:', 'Super Admin System Super Super Admin created job code: BIS_AGM_Book_000079', 'created', '122.168.114.106', '2025-10-25 06:10:58', '2025-10-25 06:10:58'),
(1644, 1, '2025-10-25', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '110.224.169.174', '2025-10-25 08:52:10', '2025-10-25 08:52:10'),
(1645, 1, '2025-10-25', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-10-25 09:21:52', '2025-10-25 09:21:52'),
(1646, 1, '2025-10-25', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-10-25 09:22:21', '2025-10-25 09:22:21'),
(1647, 1, '2025-10-25', 'job', 81, 'created job code:', 'Super Admin System Super Super Admin created job code: LA _H P_test_000080', 'created', '122.168.114.106', '2025-10-25 10:58:51', '2025-10-25 10:58:51'),
(1648, 1, '2025-10-25', 'job', 81, 'edited the job information job code:', 'Super Admin System Super Super Admin edited the job information job code: LA _H P_test_000080', 'updated', '122.168.114.106', '2025-10-25 10:59:09', '2025-10-25 10:59:09'),
(1649, 1, '2025-10-25', 'job', 81, 'completed the draft for job code:', 'Super Admin System Super Super Admin completed the draft for job code: LA _H P_test_000080', 'created', '122.168.114.106', '2025-10-25 11:04:49', '2025-10-25 11:04:49'),
(1650, 1, '2025-10-25', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-10-25 11:13:03', '2025-10-25 11:13:03'),
(1651, 1, '2025-10-25', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-10-25 11:16:15', '2025-10-25 11:16:15'),
(1652, 1, '2025-10-25', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '27.60.11.169', '2025-10-25 11:17:02', '2025-10-25 11:17:02'),
(1653, 1, '2025-10-25', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-10-25 11:17:26', '2025-10-25 11:17:26'),
(1654, 1, '2025-10-25', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.59.126.69', '2025-10-25 11:58:37', '2025-10-25 11:58:37'),
(1655, 2, '2025-10-25', '-', 0, ' Logged In', 'Super Admin Amit Agarwal  Logged In ', '-', '122.168.114.106', '2025-10-25 12:04:06', '2025-10-25 12:04:06'),
(1656, 1, '2025-10-25', 'customer', 116, 'changes the status Deactivate customer code :', 'Super Admin System Super Super Admin changes the status Deactivate customer code : cust_LA _000096(LA MANO DE D10S LTD)', 'updated', '27.60.9.51', '2025-10-25 12:10:14', '2025-10-25 12:10:14'),
(1657, 1, '2025-10-25', 'job', 56, 'edited the job information job code:', 'Super Admin System Super Super Admin edited the job information job code: BRA_R. _VAT _000056', 'updated', '27.60.9.51', '2025-10-25 12:18:37', '2025-10-25 12:18:37'),
(1658, 1, '2025-10-25', 'job', 56, 'updated the job status from WIP – To Be Reviewed to Completed - Update Sent. job code:', 'Super Admin System Super Super Admin updated the job status from WIP – To Be Reviewed to Completed - Update Sent. job code: BRA_R. _VAT _000056', 'updated', '27.60.9.51', '2025-10-25 12:19:21', '2025-10-25 12:19:21'),
(1659, 1, '2025-10-25', 'job', 56, 'sent the draft for job code:', 'Super Admin System Super Super Admin sent the draft for job code: BRA_R. _VAT _000056', 'created', '27.60.9.51', '2025-10-25 12:19:40', '2025-10-25 12:19:40'),
(1660, 1, '2025-10-25', 'job', 56, 'completed the draft job code:', 'Super Admin System Super Super Admin completed the draft job code: BRA_R. _VAT _000056', 'updated', '27.60.9.51', '2025-10-25 12:20:05', '2025-10-25 12:20:05'),
(1661, 2, '2025-10-25', '-', 0, ' Logged Out', 'Super Admin Amit Agarwal  Logged Out ', '-', '122.168.114.106', '2025-10-25 13:07:12', '2025-10-25 13:07:12'),
(1662, 1, '2025-10-25', 'job', 82, 'created job code:', 'Super Admin System Super Super Admin created job code: BRA_ABB_VAT _000081', 'created', '27.60.9.51', '2025-10-25 13:19:47', '2025-10-25 13:19:47'),
(1663, 1, '2025-10-25', 'job', 27, 'sent the missing logs for job code:', 'Super Admin System Super Super Admin sent the missing logs for job code: 43 _JOH_Book_000027', 'created', '27.60.9.51', '2025-10-25 13:36:56', '2025-10-25 13:36:56'),
(1664, 1, '2025-10-25', 'job', 27, 'sent the queries for job code:', 'Super Admin System Super Super Admin sent the queries for job code: 43 _JOH_Book_000027', 'created', '27.60.9.51', '2025-10-25 13:37:52', '2025-10-25 13:37:52'),
(1665, 1, '2025-10-25', 'job', 27, 'completed the queries job code:', 'Super Admin System Super Super Admin completed the queries job code: 43 _JOH_Book_000027', 'updated', '27.60.9.51', '2025-10-25 13:38:34', '2025-10-25 13:38:34'),
(1666, 1, '2025-10-25', 'job', 27, 'edited the draft job code:', 'Super Admin System Super Super Admin edited the draft job code: 43 _JOH_Book_000027', 'updated', '27.60.9.51', '2025-10-25 13:39:31', '2025-10-25 13:39:31'),
(1667, 1, '2025-10-25', 'job', 27, 'completed the missing logs job code:', 'Super Admin System Super Super Admin completed the missing logs job code: 43 _JOH_Book_000027', 'updated', '27.60.9.14', '2025-10-25 13:40:02', '2025-10-25 13:40:02'),
(1668, 1, '2025-10-25', 'job', 27, 'completed the draft job code:', 'Super Admin System Super Super Admin completed the draft job code: 43 _JOH_Book_000027', 'updated', '27.60.9.14', '2025-10-25 13:40:17', '2025-10-25 13:40:17'),
(1669, 1, '2025-10-25', 'job', 37, 'sent the draft for job code:', 'Super Admin System Super Super Admin sent the draft for job code: AA _R. _Prep_000037', 'created', '27.60.9.14', '2025-10-25 13:41:55', '2025-10-25 13:41:55'),
(1670, 1, '2025-10-25', 'customer', 116, 'changes the status Activate customer code :', 'Super Admin System Super Super Admin changes the status Activate customer code : cust_LA _000096(LA MANO DE D10S LTD)', 'updated', '27.60.9.14', '2025-10-25 13:50:23', '2025-10-25 13:50:23'),
(1671, 1, '2025-10-25', 'job', 78, 'updated the job status from To Be Started - Not Yet Allocated Internally to Completed - Draft Sent. job code:', 'Super Admin System Super Super Admin updated the job status from To Be Started - Not Yet Allocated Internally to Completed - Draft Sent. job code: LA _H P_test_000077', 'updated', '27.60.9.14', '2025-10-25 13:50:38', '2025-10-25 13:50:38'),
(1672, 1, '2025-10-25', 'job', 77, 'updated the job status from To Be Started - Not Yet Allocated Internally to Completed - Draft Sent. job code:', 'Super Admin System Super Super Admin updated the job status from To Be Started - Not Yet Allocated Internally to Completed - Draft Sent. job code: LA _H P_test_000076', 'updated', '27.60.9.14', '2025-10-25 13:50:47', '2025-10-25 13:50:47'),
(1673, 1, '2025-10-27', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.5.43.202', '2025-10-27 06:11:19', '2025-10-27 06:11:19'),
(1674, 1, '2025-10-27', 'job', 27, 'sent the draft for job code:', 'Super Admin System Super Super Admin sent the draft for job code: 43 _JOH_Book_000027', 'created', '122.168.114.106', '2025-10-27 06:12:21', '2025-10-27 06:12:21'),
(1675, 1, '2025-10-27', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-10-27 06:28:29', '2025-10-27 06:28:29'),
(1676, 1, '2025-10-27', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '27.60.9.51', '2025-10-27 06:39:55', '2025-10-27 06:39:55'),
(1677, 1, '2025-10-27', 'job', 37, 'sent the draft for job code:', 'Super Admin System Super Super Admin sent the draft for job code: AA _R. _Prep_000037', 'created', '110.227.63.3', '2025-10-27 06:42:04', '2025-10-27 06:42:04'),
(1678, 1, '2025-10-27', 'job', 37, 'completed the draft job code:', 'Super Admin System Super Super Admin completed the draft job code: AA _R. _Prep_000037', 'updated', '110.227.63.3', '2025-10-27 06:42:45', '2025-10-27 06:42:45'),
(1679, 1, '2025-10-28', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-10-28 00:14:26', '2025-10-28 00:14:26'),
(1680, 1, '2025-10-28', 'permission', 4, ' updated the access for MANAGER. Access Changes  Remove Permission (staff-insert, staff-update, staff-delete)', 'Super Admin System Super Super Admin  updated the access for MANAGER. Access Changes  Remove Permission (staff-insert, staff-update, staff-delete) ', 'updated', '110.227.52.238', '2025-10-28 00:14:42', '2025-10-28 00:14:42'),
(1681, 1, '2025-10-28', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '110.227.52.238', '2025-10-28 00:15:01', '2025-10-28 00:15:01'),
(1682, 10, '2025-10-28', '-', 0, ' Logged In', 'Account Manager Abhishek Mangal  Logged In ', '-', '110.227.52.238', '2025-10-28 00:15:41', '2025-10-28 00:15:41'),
(1683, 1, '2025-10-29', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-10-29 10:49:23', '2025-10-29 10:49:23');

-- --------------------------------------------------------

--
-- Table structure for table `staff_portfolio`
--

CREATE TABLE `staff_portfolio` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `statuses`
--

CREATE TABLE `statuses` (
  `id` int(11) NOT NULL,
  `master_status_id` int(11) NOT NULL,
  `status_name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `status_types`
--

CREATE TABLE `status_types` (
  `id` int(11) NOT NULL,
  `type` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `status_types`
--

INSERT INTO `status_types` (`id`, `type`, `status`, `created_at`, `updated_at`) VALUES
(1, 'WIP', '1', '2024-06-28 12:52:45', '2024-10-22 22:01:38'),
(2, 'Completed', '1', '2024-06-28 12:53:10', '2024-10-22 22:01:31'),
(3, 'Not Progressing', '1', '2024-06-28 12:53:26', '2024-10-22 22:01:14'),
(4, 'On Hold', '1', '2025-01-30 08:52:20', '2025-01-30 08:52:20'),
(5, 'To Be Started', '1', '2025-01-30 08:52:20', '2025-01-30 08:52:20');

-- --------------------------------------------------------

--
-- Table structure for table `sub_internal`
--

CREATE TABLE `sub_internal` (
  `id` int(11) NOT NULL,
  `internal_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `sub_internal`
--

INSERT INTO `sub_internal` (`id`, `internal_id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 'Bookkeeping', '1', '2024-10-22 10:23:36', '2024-10-22 22:34:13'),
(2, 1, 'Accounts Production', '1', '2024-10-22 10:23:43', '2024-10-22 22:34:42'),
(3, 1, 'Payroll', '1', '2024-10-22 22:34:21', '2024-10-22 22:34:21'),
(4, 1, 'Personal Tax Return (Self-Assessment)', '1', '2024-10-22 22:34:31', '2024-10-22 22:34:31'),
(5, 1, 'Communication', '1', '2024-10-22 22:34:57', '2024-10-22 22:34:57'),
(6, 1, 'Onboarding', '1', '2024-10-22 22:35:07', '2024-10-22 22:35:07'),
(7, 4, 'Hardware Issue', '1', '2024-11-09 08:35:03', '2024-11-09 08:35:03'),
(8, 3, 'Sick Leave', '1', '2024-11-09 08:35:21', '2024-11-09 08:35:21'),
(9, 2, 'Christmas ', '1', '2024-11-09 08:35:45', '2024-11-09 08:35:45'),
(11, 7, 'vikash', '1', '2024-11-26 05:03:10', '2024-11-26 05:03:10'),
(12, 5, 'Marketing Support', '1', '2025-01-04 17:57:45', '2025-01-04 17:57:45'),
(13, 5, 'Content Writing', '1', '2025-01-04 17:58:03', '2025-01-04 17:58:03'),
(14, 5, 'Social Media', '1', '2025-01-04 17:58:17', '2025-01-04 17:58:17'),
(15, 5, 'SEO', '1', '2025-01-04 17:58:23', '2025-01-04 17:58:23'),
(16, 5, 'PPC', '1', '2025-01-04 17:58:29', '2025-01-04 17:58:29'),
(17, 5, 'Website Development', '1', '2025-01-04 17:59:16', '2025-01-04 17:59:16'),
(18, 5, 'Other', '1', '2025-01-04 17:59:21', '2025-01-04 17:59:21'),
(19, 3, 'Annual Leave', '1', '2025-01-04 18:02:04', '2025-01-04 18:02:04'),
(22, 9, 'a', '1', '2025-01-07 11:39:52', '2025-01-07 11:39:52');

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `service_id` int(11) NOT NULL,
  `job_type_id` int(11) NOT NULL,
  `budgeted_hour` varchar(100) DEFAULT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`id`, `name`, `service_id`, `job_type_id`, `budgeted_hour`, `status`, `created_at`, `updated_at`) VALUES
(1, 'test', 5, 1, NULL, '1', '2025-03-26 13:58:12', '2025-03-26 13:58:12'),
(2, 'ABC', 5, 1, NULL, '1', '2025-03-27 15:05:05', '2025-03-27 15:05:05'),
(3, 'account update', 5, 1, NULL, '1', '2025-03-28 11:18:14', '2025-03-28 11:18:14'),
(4, 'Review & FIle', 8, 2, NULL, '1', '2025-03-29 13:40:26', '2025-03-29 13:40:26'),
(5, 'Prepare, Review & File', 8, 3, NULL, '1', '2025-03-29 13:40:40', '2025-03-29 13:40:40'),
(6, 'File', 8, 4, NULL, '1', '2025-03-29 13:40:55', '2025-03-29 13:40:55'),
(7, 'test', 5, 9, NULL, '1', '2025-03-29 14:03:44', '2025-03-29 14:03:44'),
(8, 'ABC', 10, 26, NULL, '1', '2025-03-30 14:34:51', '2025-03-30 14:34:51'),
(9, 'Working paper - Jackie Format', 6, 7, NULL, '1', '2025-03-31 06:13:45', '2025-03-31 06:13:45'),
(10, 'Year End', 1, 21, NULL, '1', '2025-03-31 06:15:16', '2025-03-31 06:15:16'),
(11, 'BP flats', 1, 22, NULL, '1', '2025-03-31 06:51:23', '2025-03-31 06:51:23'),
(12, 'Year End', 1, 22, NULL, '1', '2025-03-31 13:55:55', '2025-03-31 13:55:55'),
(13, 'Checklist and draft', 1, 22, NULL, '1', '2025-04-01 09:59:55', '2025-04-01 09:59:55'),
(14, 'U Can Property Limited ', 1, 22, NULL, '1', '2025-04-01 12:19:06', '2025-04-01 12:19:06'),
(15, 'tewst', 7, 5, NULL, '1', '2025-04-03 14:50:05', '2025-04-03 14:50:05'),
(16, 'test', 8, 3, NULL, '1', '2025-04-03 15:35:29', '2025-04-03 15:35:29'),
(17, 'Employment Income', 9, 25, NULL, '1', '2025-04-07 14:23:07', '2025-04-07 14:23:07'),
(18, 'Self-Employment Income', 9, 25, NULL, '1', '2025-04-07 14:23:08', '2025-04-07 14:23:08'),
(19, 'Property Income', 9, 25, NULL, '1', '2025-04-07 14:23:08', '2025-04-07 14:23:08'),
(20, 'tet', 8, 3, NULL, '1', '2025-06-10 16:05:39', '2025-06-10 16:05:39'),
(21, 'test', 2, 19, NULL, '1', '2025-06-26 13:01:40', '2025-06-26 13:01:40'),
(22, 'ABC', 8, 4, NULL, '1', '2025-07-10 11:37:55', '2025-07-10 11:37:55'),
(23, 'Employment Income', 7, 5, NULL, '1', '2025-07-10 14:18:27', '2025-07-10 14:18:27'),
(24, 'Self-Employment Income', 7, 5, NULL, '1', '2025-07-10 14:18:27', '2025-07-10 14:18:27'),
(25, 'Property Income', 7, 5, NULL, '1', '2025-07-10 14:18:27', '2025-07-10 14:18:27'),
(26, 'Catchup meeting ', 2, 18, NULL, '1', '2025-07-12 10:34:40', '2025-07-12 10:34:40'),
(27, 'Employment Income', 2, 18, NULL, '1', '2025-07-12 13:44:30', '2025-07-12 13:44:30'),
(28, 'Self-Employment Income', 2, 18, NULL, '1', '2025-07-12 13:44:30', '2025-07-12 13:44:30'),
(29, 'Property Income', 2, 18, NULL, '1', '2025-07-12 13:44:30', '2025-07-12 13:44:30'),
(30, 'Processing', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(31, 'Finalisation', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(32, 'Review and prepare AWP', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(33, 'Interim Processing', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(34, 'Ready for Lodgement', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(35, 'SMSF Year-End Compliance', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(36, 'Fund Wind-Up', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(37, 'Rollover In/Out', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(38, 'SMSF Audit Preparation', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(39, 'SMSF Setup', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(40, 'Pension Commencement', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(41, 'Contribution Processing', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(42, 'Lump Sum Payment Processing', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(43, 'Client Query Handling', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(44, 'Quarterly BAS', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(45, 'Book- Keeping', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(46, 'SMSF Year End Compliance', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(47, 'Audit Papers', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(48, 'Other Tasks', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(49, 'Query', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(50, 'Year End Compliance', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(51, 'Bank Reconciliation', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(52, 'Share Transactions Posting & Corporate Actions', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(53, 'Market Valuation Updates', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(54, 'Report Preparation (TBAR, Minutes, etc.)', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(55, 'BAS Preparation', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(56, 'Query & Resolution', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(57, 'BGL360 Fund Setup', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(58, 'Miscellaneous Tasks', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(59, 'Fund Review & Prepare Financials', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(60, 'Audit Workpapers Preparation & Respond Auditor', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(61, 'Prepare Initial Query', 3, 14, NULL, '1', '2025-07-16 14:07:23', '2025-07-16 14:07:23'),
(62, 'Catchup meeting ', 2, 20, NULL, '1', '2025-07-22 15:27:14', '2025-07-22 15:27:14'),
(63, 'tes', 7, 5, NULL, '1', '2025-07-24 16:23:59', '2025-07-24 16:23:59'),
(64, 'test', 7, 5, NULL, '1', '2025-08-01 15:01:15', '2025-08-01 15:01:15'),
(65, 'test', 6, 7, NULL, '1', '2025-08-05 13:46:29', '2025-08-05 13:46:29'),
(66, 'test', 6, 6, NULL, '1', '2025-08-05 13:51:04', '2025-08-05 13:51:04'),
(67, 'test', 6, 8, NULL, '1', '2025-08-11 15:23:39', '2025-08-11 15:23:39'),
(68, 'testtest', 8, 4, NULL, '1', '2025-08-12 13:52:39', '2025-08-12 13:52:39'),
(69, 'test', 8, 2, NULL, '1', '2025-08-13 14:59:54', '2025-08-13 14:59:54'),
(70, 'A', 7, 5, NULL, '1', '2025-08-14 05:06:56', '2025-08-14 05:06:56'),
(71, 'test', 9, 25, NULL, '1', '2025-08-20 13:02:21', '2025-08-20 13:02:21'),
(72, 'tst', 7, 5, '1:1', '1', '2025-08-20 13:16:03', '2025-10-16 12:45:37'),
(73, 'test', 4, 10, NULL, '1', '2025-08-23 13:05:47', '2025-08-23 13:05:47'),
(74, 'test', 2, 18, NULL, '1', '2025-08-23 13:06:37', '2025-08-23 13:06:37'),
(75, 'testtesttest', 6, 7, NULL, '1', '2025-09-04 14:14:14', '2025-09-04 14:14:14'),
(76, 'Processing', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(77, 'Finalisation', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(78, 'Review and prepare AWP', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(79, 'Interim Processing', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(80, 'Ready for Lodgement', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(81, 'SMSF Year-End Compliance', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(82, 'Fund Wind-Up', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(83, 'Rollover In/Out', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(84, 'SMSF Audit Preparation', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(85, 'SMSF Setup', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(86, 'Pension Commencement', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(87, 'Contribution Processing', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(88, 'Lump Sum Payment Processing', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(89, 'Client Query Handling', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(90, 'Quarterly BAS', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(91, 'Book- Keeping', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(92, 'SMSF Year End Compliance', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(93, 'Audit Papers', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(94, 'Other Tasks', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(95, 'Query', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(96, 'Year End Compliance', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(97, 'Bank Reconciliation', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(98, 'Share Transactions Posting & Corporate Actions', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(99, 'Market Valuation Updates', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(100, 'Report Preparation (TBAR, Minutes, etc.)', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(101, 'BAS Preparation', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(102, 'Query & Resolution', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(103, 'BGL360 Fund Setup', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(105, 'Fund Review & Prepare Financials', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(106, 'Audit Workpapers Preparation & Respond Auditor', 33, 28, NULL, '1', '2025-09-22 15:17:41', '2025-09-22 15:17:41'),
(107, 'Prepare Initial Query', 33, 28, '1:1', '1', '2025-09-22 15:17:41', '2025-10-06 12:31:29'),
(112, 'test', 33, 28, '1:2', '1', '2025-10-04 13:26:53', '2025-10-04 13:26:53'),
(110, 'task bookkiping', 32, 29, '10:15', '1', '2025-10-04 11:33:43', '2025-10-04 11:33:43'),
(111, 'task 2 bookkiping', 32, 29, '10:15', '1', '2025-10-04 11:33:43', '2025-10-04 11:33:43'),
(113, 'test2', 33, 28, '1:2', '1', '2025-10-04 13:26:53', '2025-10-04 13:26:53');

-- --------------------------------------------------------

--
-- Table structure for table `task_timesheet`
--

CREATE TABLE `task_timesheet` (
  `id` int(11) NOT NULL,
  `checklist_task_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `timesheet`
--

CREATE TABLE `timesheet` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `task_type` enum('1','2') NOT NULL DEFAULT '1' COMMENT '1: Internal, 2: External',
  `customer_id` int(11) NOT NULL DEFAULT 0,
  `client_id` int(11) NOT NULL DEFAULT 0,
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
  `remark` longtext DEFAULT NULL,
  `final_remark` longtext DEFAULT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `submit_status` enum('0','1') NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `timesheet`
--

INSERT INTO `timesheet` (`id`, `staff_id`, `task_type`, `customer_id`, `client_id`, `job_id`, `task_id`, `monday_date`, `monday_hours`, `tuesday_date`, `tuesday_hours`, `wednesday_date`, `wednesday_hours`, `thursday_date`, `thursday_hours`, `friday_date`, `friday_hours`, `saturday_date`, `saturday_hours`, `sunday_date`, `sunday_hours`, `remark`, `final_remark`, `status`, `submit_status`, `created_at`, `updated_at`) VALUES
(1, 41, '1', 0, 0, 5, 13, '2025-01-06', '1:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-01-07 16:08:04', '2025-01-07 16:08:04'),
(2, 46, '1', 6, 6, 1, 2, '2025-03-17', '5:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-03-17 10:46:59', '2025-03-17 10:46:59'),
(4, 47, '1', 0, 0, 1, 2, '2025-03-17', '1:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-03-18 09:27:41', '2025-03-18 09:27:41'),
(9, 60, '2', 71, 38, 12, 14, '2025-03-31', '10:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-04-01 12:20:12', '2025-04-01 12:20:12'),
(7, 49, '2', 9, 7, 7, 9, '2025-03-17', '6:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-03-31 06:39:36', '2025-03-31 06:40:34'),
(8, 49, '1', 0, 0, 1, 2, '2025-03-17', '1:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-03-31 06:39:36', '2025-03-31 06:40:34'),
(10, 100, '1', 0, 0, 1, 6, '2025-05-26', '7:45', '2025-05-27', '8:30', '2025-05-28', '7:45', '2025-05-29', '8:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-05-28 14:25:54', '2025-05-29 12:27:48'),
(11, 100, '1', 0, 0, 1, 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-06-03 14:51:43', '2025-06-03 14:51:43'),
(12, 100, '1', 0, 0, 1, 6, '2025-06-02', '1:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-06-03 14:51:53', '2025-06-03 14:51:53'),
(14, 36, '1', 0, 0, 1, 6, '2025-06-02', '5:00', '2025-06-03', '5:00', '2025-06-04', '7:00', '2025-06-05', '6:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-06-04 14:40:53', '2025-06-04 14:41:05'),
(19, 1, '1', 0, 0, 1, 6, '2025-06-02', '12:00', '2025-06-03', '12:00', '2025-06-04', '12:00', '2025-06-05', '12:00', '2025-06-06', '2:00', '2025-06-07', '2:00', NULL, NULL, NULL, NULL, '1', '0', '2025-06-05 14:24:51', '2025-06-05 14:24:51'),
(20, 1, '1', 0, 0, 1, 6, '2025-06-02', '2:00', '2025-06-03', '3:00', '2025-06-04', '4:00', '2025-06-05', '2:00', '2025-06-06', '2:50', '2025-06-07', '2:00', NULL, NULL, NULL, NULL, '1', '0', '2025-06-05 14:24:51', '2025-06-16 11:24:25'),
(21, 34, '1', 0, 0, 1, 6, '2025-06-02', '8:05', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-06-05 14:36:19', '2025-06-05 14:36:19'),
(22, 34, '1', 0, 0, 1, 6, '2025-05-26', '8:50', '2025-05-27', ':00', '2025-05-28', ':00', '2025-05-29', ':00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-06-05 14:37:02', '2025-06-05 14:39:56'),
(23, 34, '1', 0, 0, 3, 8, '2025-05-26', '5:00', '2025-05-27', '4:00', '2025-05-28', '5:00', '2025-05-29', '4:00', '2025-05-30', '4:00', '2025-05-31', '4:00', NULL, NULL, NULL, NULL, '1', '1', '2025-06-05 14:38:53', '2025-06-05 14:39:56'),
(24, 34, '1', 0, 0, 2, 9, '2025-05-26', '4:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-06-05 14:39:52', '2025-06-05 14:39:56'),
(25, 34, '2', 83, 41, 13, 15, '2025-05-19', '7:00', '2025-05-20', '8:59', '2025-05-21', '7:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-06-05 15:02:32', '2025-06-05 15:02:39'),
(26, 61, '2', 91, 50, 20, 20, '2025-06-09', '11:00', '2025-06-10', '11:00', '2025-06-11', '11:00', '2025-06-12', '11:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-06-10 16:06:04', '2025-06-10 16:06:04'),
(27, 1, '1', 0, 0, 1, 6, '2025-06-09', '6:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-06-11 09:00:47', '2025-06-11 09:00:54'),
(28, 1, '1', 0, 0, 1, 6, '2025-06-09', '8:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-06-11 09:00:47', '2025-06-11 09:00:54'),
(29, 1, '1', 0, 0, 1, 6, '2025-06-16', '5:00', '2025-06-17', '6:00', '2025-06-18', '9:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-06-11 09:01:54', '2025-06-11 09:01:54'),
(30, 1, '1', 0, 0, 1, 6, '2025-05-26', '8:50', '2025-05-27', '8:05', '2025-05-28', '8:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-06-11 15:15:37', '2025-06-11 15:16:34'),
(31, 80, '1', 0, 0, 1, 6, '2025-06-16', '8:00', '2025-06-17', '8:05', '2025-06-18', '0:30', '2025-06-19', '8:50', '2025-06-20', '7:05', '2025-06-21', '3:00', NULL, NULL, NULL, NULL, '1', '1', '2025-06-20 09:38:47', '2025-06-20 09:38:47'),
(34, 1, '2', 92, 51, 21, 21, '2025-06-23', '2:00', '2025-06-24', '2:00', '2025-06-25', '2:00', '2025-06-26', '2:00', '2025-06-27', '2:00', '2025-06-28', '2:00', NULL, NULL, NULL, 'test', '1', '1', '2025-06-26 13:03:32', '2025-06-26 13:03:47'),
(35, 103, '1', 0, 0, 1, 6, '2025-06-23', '5:50', '2025-06-24', '4:50', '2025-06-25', '3:59', '2025-06-26', '4:00', '2025-06-27', '6:00', '2025-06-28', '7:00', NULL, NULL, NULL, 'test', '1', '1', '2025-06-26 14:56:46', '2025-06-26 14:57:35'),
(36, 103, '1', 0, 0, 3, 8, NULL, NULL, '2025-06-24', '8:00', '2025-06-25', '8:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'test', '1', '1', '2025-06-26 14:57:23', '2025-06-26 14:57:35'),
(42, 36, '1', 0, 0, 3, 8, '2025-07-07', '22:00', NULL, NULL, '2025-07-09', '4:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'sick leave', 'final remark', '1', '1', '2025-07-10 14:04:17', '2025-07-10 14:09:00'),
(40, 36, '2', 94, 53, 23, 22, '2025-07-07', '1:90', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'test', 'final remark', '1', '1', '2025-07-10 14:04:17', '2025-07-10 14:09:00'),
(41, 36, '1', 0, 0, 1, 6, '2025-07-07', '2:90', '2025-07-08', '2:40', '2025-07-09', '4:60', '2025-07-10', '23:00', '2025-07-11', '2:00', NULL, NULL, NULL, NULL, 'test', 'final remark', '1', '1', '2025-07-10 14:04:17', '2025-07-10 14:09:00'),
(43, 36, '2', 78, 34, 24, 2, '2025-07-07', '1:00', '2025-07-08', '11:00', '2025-07-09', '2:70', '2025-07-10', '3:90', NULL, NULL, '2025-07-12', '3:90', NULL, NULL, 'test', 'final remark', '1', '1', '2025-07-10 14:08:36', '2025-07-10 14:09:00'),
(44, 30, '2', 94, 52, 25, 23, '2025-07-07', '1:00', '2025-07-08', '1:09', '2025-07-09', '3:05', '2025-07-10', '3:30', '2025-07-11', '4:40', '2025-07-12', '5:45', NULL, NULL, NULL, 'test', '1', '1', '2025-07-10 14:27:45', '2025-07-10 14:27:45'),
(45, 30, '2', 94, 52, 25, 24, '2025-07-07', '2:00', '2025-07-08', '3:00', '2025-07-09', '4:00', '2025-07-10', '3:00', '2025-07-11', '02:00', NULL, NULL, NULL, NULL, NULL, 'test', '1', '1', '2025-07-10 14:27:45', '2025-07-10 14:27:45'),
(46, 30, '2', 94, 52, 25, 25, '2025-07-07', '5:00', '2025-07-08', '3:00', '2025-07-09', '3:00', '2025-07-10', '5:00', '2025-07-11', '4:00', '2025-07-12', '5:00', NULL, NULL, NULL, 'test', '1', '1', '2025-07-10 14:27:45', '2025-07-10 14:27:45'),
(47, 104, '2', 95, 55, 27, 28, '2025-07-07', '1:00', '2025-07-08', '1:00', '2025-07-09', '1:00', '2025-07-10', '1:00', '2025-07-11', '1:00', '2025-07-12', '1:00', NULL, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '1', '1', '2025-07-12 13:47:22', '2025-07-12 13:51:01'),
(48, 104, '2', 95, 55, 26, 5, '2025-07-07', '5:50', '2025-07-08', '4:00', '2025-07-09', '8:00', '2025-07-10', '7:00', '2025-07-11', '5:00', '2025-07-12', '7:00', NULL, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '1', '1', '2025-07-12 13:51:01', '2025-07-12 13:51:01'),
(49, 104, '1', 0, 0, 2, 9, NULL, NULL, '2025-07-08', '2:99', NULL, NULL, '2025-07-10', '0:00', '2025-07-11', '0:00', NULL, NULL, NULL, NULL, 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '1', '1', '2025-07-12 13:51:01', '2025-07-12 13:51:01'),
(50, 68, '2', 95, 55, 27, 27, '2025-07-07', '3:00', '2025-07-08', '1:00', '2025-07-09', '01:00', NULL, NULL, '2025-07-11', '2:00', NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-07-12 14:14:09', '2025-07-12 14:14:09'),
(51, 102, '2', 95, 55, 27, 27, '2025-07-07', '1:00', '2025-07-08', '1:00', NULL, NULL, '2025-07-10', '2:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-07-12 14:14:39', '2025-07-12 14:14:39'),
(52, 53, '2', 95, 55, 27, 27, '2025-07-07', '1:00', '2025-07-08', '2:50', '2025-07-09', '3:59', '2025-07-10', '5:00', '2025-07-11', '6:00', NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-07-12 14:39:34', '2025-07-12 14:39:34'),
(53, 53, '1', 0, 0, 1, 6, '2025-07-07', '5:50', '2025-07-08', '2:00', '2025-07-09', '3:00', '2025-07-10', '4:00', '2025-07-11', '5:00', NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-07-12 14:39:34', '2025-07-12 14:39:34'),
(54, 53, '2', 95, 55, 26, 20, '2025-07-07', '1:00', '2025-07-08', '3:00', '2025-07-09', '4:00', '2025-07-10', '5:00', '2025-07-11', '5:00', '2025-07-12', '5:00', NULL, NULL, NULL, NULL, '1', '0', '2025-07-12 14:39:34', '2025-07-12 14:39:34'),
(55, 104, '1', 97, 56, 1, 6, '2025-06-30', '23:00', '2025-07-01', '19:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-07-14 10:06:57', '2025-07-14 10:06:57'),
(56, 104, '1', 0, 0, 1, 6, '2025-07-14', '12:00', '2025-07-15', '12:00', '2025-07-16', '12:00', '2025-07-17', '6:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-07-14 10:08:42', '2025-07-14 10:08:42'),
(57, 103, '2', 95, 55, 27, 27, '2025-07-14', '7:11', '2025-07-15', '7:11', '2025-07-16', '7:12', '2025-07-17', '7:15', '2025-07-18', '14:00', NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-07-14 15:29:03', '2025-07-14 15:29:08'),
(58, 103, '1', 0, 0, 1, 6, '2025-07-21', '12:00', '2025-07-22', '12:00', '2025-07-23', '12:00', '2025-07-24', '6:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-07-14 15:30:51', '2025-07-14 15:30:51'),
(59, 103, '2', 95, 55, 27, 27, '2025-07-07', '12:00', '2025-07-08', '12:00', '2025-07-09', '12:00', '2025-07-10', '6:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-07-14 15:32:02', '2025-07-14 15:32:02'),
(60, 103, '2', 95, 55, 27, 27, '2025-07-07', '12:00', '2025-07-08', '12:00', '2025-07-09', '12:00', '2025-07-10', '6:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-07-14 15:32:02', '2025-07-14 15:32:02'),
(61, 103, '2', 95, 55, 27, 27, '2025-07-07', '12:00', '2025-07-08', '12:00', '2025-07-09', '12:00', '2025-07-10', '6:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-07-14 15:32:02', '2025-07-14 15:32:02'),
(62, 103, '1', 0, 0, 1, 6, '2025-06-30', '12:00', '2025-07-01', '12:00', '2025-07-02', '18:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-07-14 15:32:31', '2025-07-14 15:32:31'),
(63, 53, '2', 95, 55, 27, 27, '2025-07-14', '12:00', '2025-07-15', '12:00', '2025-07-16', '12:00', '2025-07-17', '6:30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-07-14 15:33:51', '2025-07-14 15:33:51'),
(65, 1, '1', 0, 0, 1, 6, '2025-07-14', '5:70', '2025-07-15', '9:60', '2025-07-16', '9:60', '2025-07-17', '9:00', '2025-07-18', '9:00', NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-07-15 07:11:15', '2025-07-15 08:23:47'),
(66, 1, '1', 0, 0, 1, 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-07-15 08:23:47', '2025-07-15 08:23:47'),
(67, 52, '2', 100, 60, 35, 24, '2025-07-28', '00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-08-01 14:06:12', '2025-08-01 14:06:12'),
(68, 52, '2', 20, 61, 36, 21, '2025-07-28', '1:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-08-01 14:09:16', '2025-08-01 14:09:16'),
(69, 80, '2', 101, 62, 38, 25, '2025-07-28', '1:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-08-01 15:13:49', '2025-08-01 15:13:49'),
(70, 48, '2', 106, 70, 47, 4, '2025-08-11', '1:00', NULL, NULL, '2025-08-13', '1:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-08-13 15:36:25', '2025-08-13 15:36:25'),
(71, 113, '2', 112, 81, 63, 75, '2025-08-25', '2:00', NULL, NULL, '2025-08-27', '4:00', NULL, NULL, '2025-08-29', '4:50', NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-09-04 14:14:55', '2025-09-04 14:14:55'),
(72, 112, '1', 0, 0, 1, 6, '2025-06-02', '1:00', NULL, NULL, '2025-06-04', '1:00', '2025-06-05', '20:00', '2025-06-06', '1:00', '2025-06-07', '1:00', NULL, NULL, NULL, NULL, '1', '1', '2025-09-12 13:43:55', '2025-09-12 13:43:55'),
(73, 112, '1', 0, 0, 1, 6, '2025-06-02', '19:00', '2025-06-03', '2:00', '2025-06-04', '9:00', '2025-06-05', '2:00', '2025-06-06', '2:00', '2025-06-07', '1:00', NULL, NULL, NULL, NULL, '1', '1', '2025-09-12 13:43:55', '2025-09-12 13:43:55'),
(74, 112, '2', 110, 80, 62, 74, '2025-06-02', '1:00', '2025-06-03', '1:00', '2025-06-04', '1:00', '2025-06-05', '3:00', '2025-06-06', '1:00', '2025-06-07', '1:00', NULL, NULL, NULL, NULL, '1', '1', '2025-09-12 13:43:55', '2025-09-12 13:43:55'),
(75, 112, '2', 110, 80, 62, 74, '2025-06-02', '1:00', NULL, NULL, '2025-06-04', '1:00', NULL, NULL, '2025-06-06', '1:00', NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-09-12 13:43:55', '2025-09-12 13:43:55'),
(76, 112, '1', 0, 0, 2, 9, '2025-09-08', '1:00', '2025-09-09', '4:00', '2025-09-10', '2:00', '2025-09-11', '3:00', NULL, NULL, '2025-09-13', '5:00', NULL, NULL, NULL, NULL, '1', '1', '2025-09-12 13:53:04', '2025-09-12 13:53:04'),
(77, 112, '1', 0, 0, 1, 6, '2025-09-08', '5:50', '2025-09-09', '5:00', '2025-09-10', '6:00', NULL, NULL, '2025-09-12', '7:00', '2025-09-13', '7:00', NULL, NULL, NULL, NULL, '1', '1', '2025-09-12 13:53:04', '2025-09-12 13:53:04'),
(78, 112, '2', 110, 80, 62, 74, '2025-09-08', '5:00', NULL, NULL, '2025-09-10', '6:00', NULL, NULL, '2025-09-12', '7:00', '2025-09-13', '10:00', NULL, NULL, NULL, NULL, '1', '1', '2025-09-12 13:53:04', '2025-09-12 13:53:04'),
(79, 34, '1', 0, 0, 1, 6, '2025-09-01', '012:00', '2025-09-02', '12:00', '2025-09-03', '12:00', '2025-09-04', '4:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-09-22 15:07:14', '2025-09-22 15:07:14'),
(80, 34, '2', 92, 51, 21, 21, '2025-09-01', '12:00', '2025-09-02', '4:00', NULL, NULL, '2025-09-04', '5:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-09-22 15:07:14', '2025-09-22 15:07:14');

-- --------------------------------------------------------

--
-- Table structure for table `timesheet_filter`
--

CREATE TABLE `timesheet_filter` (
  `id` int(11) NOT NULL,
  `type` varchar(100) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `filter_record` longtext NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `timesheet_filter`
--

INSERT INTO `timesheet_filter` (`id`, `type`, `staff_id`, `filter_record`, `status`, `created_at`, `updated_at`) VALUES
(4, 'timesheet_report', 1, '{\"groupBy\":[\"staff_id\"],\"internal_external\":\"0\",\"fieldsToDisplay\":null,\"fieldsToDisplayId\":null,\"staff_id\":null,\"customer_id\":null,\"client_id\":null,\"job_id\":null,\"task_id\":null,\"internal_job_id\":null,\"internal_task_id\":null,\"timePeriod\":\"this_month\",\"displayBy\":\"Weekly\",\"fromDate\":null,\"toDate\":null}', '1', '2025-09-23 15:23:03', '2025-09-23 15:23:03'),
(7, 'timesheet_report', 1, '{\"groupBy\":[\"staff_id\"],\"internal_external\":\"0\",\"fieldsToDisplay\":null,\"fieldsToDisplayId\":null,\"staff_id\":null,\"customer_id\":null,\"client_id\":null,\"job_id\":null,\"task_id\":null,\"internal_job_id\":null,\"internal_task_id\":null,\"timePeriod\":\"this_month\",\"displayBy\":\"Weekly\",\"fromDate\":null,\"toDate\":null}', '1', '2025-09-25 06:43:46', '2025-09-25 06:43:46'),
(8, 'timesheet_report', 1, '{\"groupBy\":[\"staff_id\",\"customer_id\",\"task_id\"],\"internal_external\":\"0\",\"fieldsToDisplay\":null,\"fieldsToDisplayId\":null,\"staff_id\":null,\"customer_id\":110,\"client_id\":null,\"job_id\":null,\"task_id\":74,\"internal_job_id\":null,\"internal_task_id\":null,\"timePeriod\":\"this_month\",\"displayBy\":\"Weekly\",\"fromDate\":null,\"toDate\":null}', '1', '2025-09-25 06:44:33', '2025-09-25 06:44:33'),
(9, 'timesheet_report', 1, '{\"groupBy\":[\"staff_id\"],\"internal_external\":\"0\",\"fieldsToDisplay\":null,\"fieldsToDisplayId\":null,\"staff_id\":null,\"customer_id\":null,\"client_id\":null,\"job_id\":null,\"task_id\":null,\"internal_job_id\":null,\"internal_task_id\":null,\"timePeriod\":\"this_month\",\"displayBy\":\"Weekly\",\"fromDate\":null,\"toDate\":null}', '1', '2025-09-25 14:17:09', '2025-09-25 14:17:09'),
(10, 'timesheet_report', 1, '{\"groupBy\":[\"staff_id\",\"customer_id\"],\"internal_external\":\"0\",\"fieldsToDisplay\":null,\"fieldsToDisplayId\":null,\"staff_id\":null,\"customer_id\":null,\"client_id\":null,\"job_id\":null,\"task_id\":null,\"internal_job_id\":null,\"internal_task_id\":null,\"timePeriod\":\"this_month\",\"displayBy\":\"Weekly\",\"fromDate\":null,\"toDate\":null}', '1', '2025-09-27 13:11:47', '2025-09-27 13:11:47'),
(11, 'timesheet_report', 1, '{\"groupBy\":[\"staff_id\"],\"internal_external\":\"0\",\"fieldsToDisplay\":null,\"fieldsToDisplayId\":null,\"staff_id\":null,\"customer_id\":null,\"client_id\":null,\"job_id\":null,\"task_id\":null,\"internal_job_id\":null,\"internal_task_id\":null,\"timePeriod\":\"this_year\",\"displayBy\":\"Weekly\",\"fromDate\":null,\"toDate\":null}', '1', '2025-10-06 12:57:12', '2025-10-06 12:57:12'),
(12, 'timesheet_report', 1, '{\"groupBy\":[\"staff_id\"],\"internal_external\":\"2\",\"fieldsToDisplay\":null,\"fieldsToDisplayId\":null,\"staff_id\":1,\"customer_id\":null,\"client_id\":null,\"job_id\":null,\"task_id\":null,\"internal_job_id\":null,\"internal_task_id\":null,\"timePeriod\":\"this_year\",\"displayBy\":\"Daily\",\"fromDate\":null,\"toDate\":null}', '1', '2025-10-06 12:57:54', '2025-10-06 12:57:54');

-- --------------------------------------------------------

--
-- Structure for view `assigned_jobs_staff_view`
--
DROP TABLE IF EXISTS `assigned_jobs_staff_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `assigned_jobs_staff_view`  AS SELECT `customers`.`id` AS `customer_id`, `clients`.`id` AS `client_id`, `jobs`.`id` AS `job_id`, `staffs`.`id` AS `staff_id`, 'assign_customer_portfolio' AS `source`, NULL AS `service_id_assign` FROM ((((`customers` join `staff_portfolio` on(`staff_portfolio`.`customer_id` = `customers`.`id`)) join `staffs` on(`staffs`.`id` = `staff_portfolio`.`staff_id`)) left join `clients` on(`clients`.`customer_id` = `customers`.`id`)) left join `jobs` on(`jobs`.`client_id` = `clients`.`id`))union all select `customers`.`id` AS `customer_id`,`clients`.`id` AS `client_id`,`jobs`.`id` AS `job_id`,`staffs`.`id` AS `staff_id`,'assign_customer_service' AS `source`,`customer_services`.`service_id` AS `service_id_assign` from (((((`customers` join `customer_services` on(`customer_services`.`customer_id` = `customers`.`id`)) join `customer_service_account_managers` on(`customer_service_account_managers`.`customer_service_id` = `customer_services`.`id`)) join `staffs` on(`staffs`.`id` = `customer_service_account_managers`.`account_manager_id`)) left join `clients` on(`clients`.`customer_id` = `customers`.`id`)) left join `jobs` on(`jobs`.`client_id` = `clients`.`id`)) union all select `customers`.`id` AS `customer_id`,`clients`.`id` AS `client_id`,`jobs`.`id` AS `job_id`,`staffs`.`id` AS `staff_id`,'assign_customer_main_account_manager' AS `source`,NULL AS `service_id_assign` from (((`customers` join `staffs` on(`staffs`.`id` = `customers`.`account_manager_id`)) left join `clients` on(`clients`.`customer_id` = `customers`.`id`)) left join `jobs` on(`jobs`.`client_id` = `clients`.`id`)) union all select `customers`.`id` AS `customer_id`,`clients`.`id` AS `client_id`,`jobs`.`id` AS `job_id`,`jobs`.`reviewer` AS `staff_id`,'reviewer' AS `source`,NULL AS `service_id_assign` from (((`jobs` join `clients` on(`clients`.`id` = `jobs`.`client_id`)) join `customers` on(`customers`.`id` = `clients`.`customer_id`)) join `staffs` on(`staffs`.`id` = `jobs`.`reviewer`)) union all select `customers`.`id` AS `customer_id`,`clients`.`id` AS `client_id`,`jobs`.`id` AS `job_id`,`jobs`.`allocated_to` AS `staff_id`,'allocated_to' AS `source`,NULL AS `service_id_assign` from (((`jobs` join `clients` on(`clients`.`id` = `jobs`.`client_id`)) join `customers` on(`customers`.`id` = `clients`.`customer_id`)) join `staffs` on(`staffs`.`id` = `jobs`.`allocated_to`)) union all select `customers`.`id` AS `customer_id`,`clients`.`id` AS `client_id`,`jobs`.`id` AS `job_id`,`job_allowed_staffs`.`staff_id` AS `staff_id`,'job_allowed_staffs' AS `source`,NULL AS `service_id_assign` from ((((`jobs` join `clients` on(`clients`.`id` = `jobs`.`client_id`)) join `customers` on(`customers`.`id` = `clients`.`customer_id`)) left join `job_allowed_staffs` on(`job_allowed_staffs`.`job_id` = `jobs`.`id`)) join `staffs` on(`staffs`.`id` = `job_allowed_staffs`.`staff_id`))  ;

-- --------------------------------------------------------

--
-- Structure for view `dashboard_data_view`
--
DROP TABLE IF EXISTS `dashboard_data_view`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `dashboard_data_view`  AS SELECT `customers`.`id` AS `customer_id`, `customers`.`customer_type` AS `customer_type`, `customers`.`staff_id` AS `staff_id`, `customers`.`account_manager_id` AS `account_manager_id`, `customer_service_account_managers`.`account_manager_id` AS `a_account_manager_id`, `jobs`.`allocated_to` AS `allocated_to`, `jobs`.`reviewer` AS `reviewer`, `jobs`.`id` AS `job_id`, `jobs`.`status_type` AS `status_type`, `clients`.`id` AS `client_id`, `clients`.`created_at` AS `client_created_at`, `jobs`.`created_at` AS `job_created_at`, `customers`.`created_at` AS `customer_created_at`, `sp_customers`.`id` AS `sp_customer_id` FROM (((((((((`customers` left join `clients` on(`clients`.`customer_id` = `customers`.`id`)) left join `jobs` on(`jobs`.`client_id` = `clients`.`id`)) join `staffs` `staff1` on(`customers`.`staff_id` = `staff1`.`id`)) join `staffs` `staff2` on(`customers`.`account_manager_id` = `staff2`.`id`)) left join `customer_services` on(`customer_services`.`customer_id` = `customers`.`id`)) left join `customer_service_account_managers` on(`customer_service_account_managers`.`customer_service_id` = `customer_services`.`id`)) left join `customer_company_information` on(`customers`.`id` = `customer_company_information`.`customer_id`)) left join `staff_portfolio` on(`staff_portfolio`.`customer_id` = `customers`.`id`)) left join `customers` `sp_customers` on(`sp_customers`.`id` = `staff_portfolio`.`customer_id` or `sp_customers`.`staff_id` = `staff_portfolio`.`staff_id`)) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `checklists`
--
ALTER TABLE `checklists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `job_type_id` (`job_type_id`),
  ADD KEY `client_type_id` (`client_type_id`);

--
-- Indexes for table `checklist_tasks`
--
ALTER TABLE `checklist_tasks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `checklist_id` (`checklist_id`,`task_id`),
  ADD KEY `task_id` (`task_id`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `client_code` (`client_code`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `client_industry_id` (`client_industry_id`);

--
-- Indexes for table `client_company_information`
--
ALTER TABLE `client_company_information`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`);

--
-- Indexes for table `client_contact_details`
--
ALTER TABLE `client_contact_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `role` (`role`);

--
-- Indexes for table `client_documents`
--
ALTER TABLE `client_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`);

--
-- Indexes for table `client_industry_types`
--
ALTER TABLE `client_industry_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `business_type` (`business_type`);

--
-- Indexes for table `client_job_task`
--
ALTER TABLE `client_job_task`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `job_id` (`job_id`,`client_id`,`checklist_id`,`task_id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `checklist_id` (`checklist_id`),
  ADD KEY `task_id` (`task_id`);

--
-- Indexes for table `client_trustee_contact_details`
--
ALTER TABLE `client_trustee_contact_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `role` (`role`);

--
-- Indexes for table `client_types`
--
ALTER TABLE `client_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `type` (`type`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `trading_name` (`trading_name`),
  ADD UNIQUE KEY `customer_code` (`customer_code`),
  ADD KEY `staff_id` (`staff_id`),
  ADD KEY `account_manager_id` (`account_manager_id`);

--
-- Indexes for table `customer_company_information`
--
ALTER TABLE `customer_company_information`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `customer_contact_details`
--
ALTER TABLE `customer_contact_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `contact_person_role_id` (`contact_person_role_id`);

--
-- Indexes for table `customer_contact_person_role`
--
ALTER TABLE `customer_contact_person_role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `customer_documents`
--
ALTER TABLE `customer_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `customer_engagement_adhoc_hourly`
--
ALTER TABLE `customer_engagement_adhoc_hourly`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_engagement_model_id` (`customer_engagement_model_id`);

--
-- Indexes for table `customer_engagement_customised_pricing`
--
ALTER TABLE `customer_engagement_customised_pricing`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_engagement_model_id` (`customer_engagement_model_id`),
  ADD KEY `job_type_id` (`job_type_id`);

--
-- Indexes for table `customer_engagement_fte`
--
ALTER TABLE `customer_engagement_fte`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_engagement_model_id` (`customer_engagement_model_id`);

--
-- Indexes for table `customer_engagement_model`
--
ALTER TABLE `customer_engagement_model`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `customer_engagement_percentage`
--
ALTER TABLE `customer_engagement_percentage`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_engagement_model_id` (`customer_engagement_model_id`);

--
-- Indexes for table `customer_paper_work`
--
ALTER TABLE `customer_paper_work`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `customer_services`
--
ALTER TABLE `customer_services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customer_id` (`customer_id`,`service_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `customer_service_account_managers`
--
ALTER TABLE `customer_service_account_managers`
  ADD UNIQUE KEY `customer_service_id` (`customer_service_id`,`account_manager_id`),
  ADD KEY `account_manager_id` (`account_manager_id`);

--
-- Indexes for table `customer_service_task`
--
ALTER TABLE `customer_service_task`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `customer_id` (`customer_id`,`service_id`,`task_id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `task_id` (`task_id`);

--
-- Indexes for table `customer_source`
--
ALTER TABLE `customer_source`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `customer_sub_source`
--
ALTER TABLE `customer_sub_source`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_source_id` (`customer_source_id`);

--
-- Indexes for table `drafts`
--
ALTER TABLE `drafts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_id` (`job_id`);

--
-- Indexes for table `incorporation_in`
--
ALTER TABLE `incorporation_in`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `internal`
--
ALTER TABLE `internal`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `job_id` (`job_id`),
  ADD KEY `account_manager_id` (`account_manager_id`),
  ADD KEY `reviewer` (`reviewer`),
  ADD KEY `allocated_to` (`allocated_to`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `customer_contact_details_id` (`customer_contact_details_id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `job_type_id` (`job_type_id`),
  ADD KEY `currency` (`currency`);

--
-- Indexes for table `job_allowed_staffs`
--
ALTER TABLE `job_allowed_staffs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `job_documents`
--
ALTER TABLE `job_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_id` (`job_id`);

--
-- Indexes for table `job_types`
--
ALTER TABLE `job_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `line_managers`
--
ALTER TABLE `line_managers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_by` (`staff_by`),
  ADD KEY `staff_to` (`staff_to`);

--
-- Indexes for table `master_status`
--
ALTER TABLE `master_status`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `status_type_id` (`status_type_id`);

--
-- Indexes for table `missing_logs`
--
ALTER TABLE `missing_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_id` (`job_id`),
  ADD KEY `missing_log_reviewed_by` (`missing_log_reviewed_by`);

--
-- Indexes for table `missing_logs_documents`
--
ALTER TABLE `missing_logs_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `missing_log_id` (`missing_log_id`);

--
-- Indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `queries`
--
ALTER TABLE `queries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_id` (`job_id`);

--
-- Indexes for table `queries_documents`
--
ALTER TABLE `queries_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `query_id` (`query_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD UNIQUE KEY `role_id` (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `sharepoint_token`
--
ALTER TABLE `sharepoint_token`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `staffs`
--
ALTER TABLE `staffs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `staff_competencies`
--
ALTER TABLE `staff_competencies`
  ADD UNIQUE KEY `staff_id` (`staff_id`,`service_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `staff_logs`
--
ALTER TABLE `staff_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_id` (`staff_id`);

--
-- Indexes for table `staff_portfolio`
--
ALTER TABLE `staff_portfolio`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `statuses`
--
ALTER TABLE `statuses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `master_status_id` (`master_status_id`);

--
-- Indexes for table `status_types`
--
ALTER TABLE `status_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `type` (`type`);

--
-- Indexes for table `sub_internal`
--
ALTER TABLE `sub_internal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `internal_id` (`internal_id`);

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`,`service_id`,`job_type_id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `job_type_id` (`job_type_id`);

--
-- Indexes for table `task_timesheet`
--
ALTER TABLE `task_timesheet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `checklist_task_id` (`checklist_task_id`),
  ADD KEY `job_id` (`job_id`);

--
-- Indexes for table `timesheet`
--
ALTER TABLE `timesheet`
  ADD PRIMARY KEY (`id`),
  ADD KEY `staff_id` (`staff_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `client_id` (`client_id`),
  ADD KEY `job_id` (`job_id`),
  ADD KEY `task_id` (`task_id`);

--
-- Indexes for table `timesheet_filter`
--
ALTER TABLE `timesheet_filter`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `checklists`
--
ALTER TABLE `checklists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `checklist_tasks`
--
ALTER TABLE `checklist_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=110;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT for table `client_company_information`
--
ALTER TABLE `client_company_information`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `client_contact_details`
--
ALTER TABLE `client_contact_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT for table `client_documents`
--
ALTER TABLE `client_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `client_industry_types`
--
ALTER TABLE `client_industry_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `client_job_task`
--
ALTER TABLE `client_job_task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT for table `client_trustee_contact_details`
--
ALTER TABLE `client_trustee_contact_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `client_types`
--
ALTER TABLE `client_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- AUTO_INCREMENT for table `customer_company_information`
--
ALTER TABLE `customer_company_information`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `customer_contact_details`
--
ALTER TABLE `customer_contact_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `customer_contact_person_role`
--
ALTER TABLE `customer_contact_person_role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `customer_documents`
--
ALTER TABLE `customer_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer_engagement_adhoc_hourly`
--
ALTER TABLE `customer_engagement_adhoc_hourly`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `customer_engagement_customised_pricing`
--
ALTER TABLE `customer_engagement_customised_pricing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `customer_engagement_fte`
--
ALTER TABLE `customer_engagement_fte`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `customer_engagement_model`
--
ALTER TABLE `customer_engagement_model`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `customer_engagement_percentage`
--
ALTER TABLE `customer_engagement_percentage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `customer_paper_work`
--
ALTER TABLE `customer_paper_work`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `customer_services`
--
ALTER TABLE `customer_services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=167;

--
-- AUTO_INCREMENT for table `customer_service_task`
--
ALTER TABLE `customer_service_task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer_source`
--
ALTER TABLE `customer_source`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `customer_sub_source`
--
ALTER TABLE `customer_sub_source`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `drafts`
--
ALTER TABLE `drafts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `incorporation_in`
--
ALTER TABLE `incorporation_in`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `internal`
--
ALTER TABLE `internal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `job_allowed_staffs`
--
ALTER TABLE `job_allowed_staffs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT for table `job_documents`
--
ALTER TABLE `job_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_types`
--
ALTER TABLE `job_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `line_managers`
--
ALTER TABLE `line_managers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `master_status`
--
ALTER TABLE `master_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `missing_logs`
--
ALTER TABLE `missing_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `missing_logs_documents`
--
ALTER TABLE `missing_logs_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `queries`
--
ALTER TABLE `queries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `queries_documents`
--
ALTER TABLE `queries_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `sharepoint_token`
--
ALTER TABLE `sharepoint_token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `staffs`
--
ALTER TABLE `staffs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `staff_logs`
--
ALTER TABLE `staff_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1684;

--
-- AUTO_INCREMENT for table `staff_portfolio`
--
ALTER TABLE `staff_portfolio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `statuses`
--
ALTER TABLE `statuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `status_types`
--
ALTER TABLE `status_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sub_internal`
--
ALTER TABLE `sub_internal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `task_timesheet`
--
ALTER TABLE `task_timesheet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `timesheet`
--
ALTER TABLE `timesheet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `timesheet_filter`
--
ALTER TABLE `timesheet_filter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
