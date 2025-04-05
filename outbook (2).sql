-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 05, 2025 at 12:01 PM
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
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `checklists`
--

INSERT INTO `checklists` (`id`, `customer_id`, `is_all_customer`, `service_id`, `job_type_id`, `client_type_id`, `check_list_name`, `status`, `created_at`, `updated_at`) VALUES
(1, 0, '[1]', 7, 2, '1,2,3,4', 'checklist1', '1', '2025-01-30 09:06:45', '2025-01-30 09:07:00');

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
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `checklist_tasks`
--

INSERT INTO `checklist_tasks` (`id`, `checklist_id`, `task_id`, `task_name`, `budgeted_hour`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'b', '12:12', '2025-01-30 09:06:45', '2025-01-30 09:06:45'),
(2, 1, 1, 'a', '12:12', '2025-01-30 09:06:45', '2025-01-30 09:06:45');

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
  `charity_commission_number` varchar(255) DEFAULT NULL,
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
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `client_type`, `customer_id`, `staff_created_id`, `client_industry_id`, `trading_name`, `client_code`, `trading_address`, `service_address`, `charity_commission_number`, `vat_registered`, `vat_number`, `website`, `notes`, `status`, `created_at`, `updated_at`) VALUES
(1, '5', 1, 2, 0, 'Charity', '00001', 'a', '', 'abc', '0', '', '', '', '1', '2025-01-30 09:02:25', '2025-01-30 09:02:25'),
(2, '1', 1, 2, 3, 'Cli2', '00002', 'd', NULL, NULL, '0', '', '', '', '1', '2025-01-30 09:08:41', '2025-01-30 09:08:41'),
(3, '1', 2, 2, 0, 'Cli2g', '00003', 'gg', NULL, NULL, '0', '', '', '', '1', '2025-02-04 05:09:01', '2025-02-04 05:09:01'),
(4, '1', 5, 5, 0, 'CLI-STAFF1', '00004', 'qa', NULL, NULL, '0', '', '', '', '1', '2025-02-06 11:20:55', '2025-02-06 11:20:55'),
(5, '1', 8, 7, 0, 'f4-cli', '00005', 's', NULL, NULL, '0', '', '', '', '1', '2025-02-08 05:27:53', '2025-02-08 05:27:53'),
(6, '5', 8, 2, 0, 'AAA', '00006', 'ss', '', 's', '0', '', '', '', '1', '2025-02-10 11:45:33', '2025-02-10 11:45:33'),
(7, '6', 8, 2, 0, 'UNA', '00007', 'a', NULL, NULL, '0', '', '', '', '1', '2025-02-10 11:46:31', '2025-02-10 11:46:31'),
(8, '7', 8, 2, 0, 'TRUST', '00008', 'a', NULL, NULL, '0', '', '', '', '1', '2025-02-10 11:47:41', '2025-02-10 11:47:41'),
(9, '2', 8, 2, 0, 'G T SCARLET LIMITED_00009', '00009', '156 Newton Road, Torquay, England, TQ2 7AQ', NULL, NULL, '0', '', '', '', '1', '2025-03-26 10:10:13', '2025-03-26 10:10:13'),
(10, '1', 8, 2, 0, 'sss', '000010', 'ss', NULL, NULL, '0', '', '', '', '1', '2025-03-27 06:18:25', '2025-03-27 06:18:25'),
(11, '3', 8, 2, 3, 'ddddd', '000011', 'dd', NULL, NULL, '0', '', '', '', '1', '2025-03-27 06:55:28', '2025-03-27 06:55:28'),
(12, '1', 5, 2, 3, 'sssssssssss', '000012', 'ss', NULL, NULL, '0', '', '', '', '1', '2025-04-02 06:13:37', '2025-04-02 06:13:37'),
(13, '1', 6, 1, 0, 'fgff', '000013', 'f', NULL, NULL, '0', '', '', '', '1', '2025-04-02 07:13:52', '2025-04-02 07:13:52'),
(14, '4', 6, 1, 0, 'SFD', '000014', NULL, NULL, NULL, '1', NULL, NULL, '', '1', '2025-04-02 12:21:40', '2025-04-02 12:21:40'),
(15, '1', 19, 1, 3, 'AA', '000015', 'A', NULL, NULL, '0', '', '', '', '1', '2025-04-03 10:30:20', '2025-04-03 10:30:20');

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
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `client_company_information`
--

INSERT INTO `client_company_information` (`id`, `client_id`, `company_name`, `entity_type`, `company_status`, `company_number`, `registered_office_address`, `incorporation_date`, `incorporation_in`, `created_at`, `updated_at`) VALUES
(1, 9, 'G T SCARLET LIMITED', 'ltd', 'active', '05303995', '156 Newton Road, Torquay, England, TQ2 7AQ', '2004-12-03', '1', '2025-03-26 10:10:13', '2025-03-26 10:10:13');

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
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `client_contact_details`
--

INSERT INTO `client_contact_details` (`id`, `client_id`, `role`, `first_name`, `last_name`, `email`, `alternate_email`, `phone_code`, `phone`, `alternate_phone_code`, `alternate_phone`, `residential_address`, `authorised_signatory_status`, `created_at`, `updated_at`) VALUES
(1, 1, 0, 'a', 'a', '', '', '+44', '', '+44', '', NULL, '0', '2025-01-30 09:02:25', '2025-01-30 09:02:25'),
(2, 2, 0, 'd', 'd', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'd', '0', '2025-01-30 09:08:41', '2025-01-30 09:08:41'),
(3, 3, 0, 'g', 'g', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'g', '0', '2025-02-04 05:09:01', '2025-02-04 05:09:01'),
(4, 4, 0, 's', 's', 's@gmail.com', NULL, '+44', '2777777777', NULL, NULL, 's', '0', '2025-02-06 11:20:55', '2025-02-06 11:20:55'),
(5, 5, 0, 's', 's', 's@gmail.com', NULL, '+44', '2777777777', NULL, NULL, 's', '0', '2025-02-08 05:27:53', '2025-02-08 05:27:53'),
(6, 6, 0, 's', 's', '', '', '+44', '', '+44', '', NULL, '0', '2025-02-10 11:45:33', '2025-02-10 11:45:33'),
(7, 7, 0, 's', 'ss', '', '', '+44', '', '+44', '', NULL, '0', '2025-02-10 11:46:31', '2025-02-10 11:46:31'),
(8, 8, 0, 'ss', 'ss', '', '', '+44', '', '+44', '', NULL, '0', '2025-02-10 11:47:41', '2025-02-10 11:47:41'),
(9, 9, 0, 'Gary John', 'THOMAS', '', NULL, '+44', '', NULL, NULL, NULL, '0', '2025-03-26 10:10:13', '2025-03-26 10:10:13'),
(10, 10, 0, 'ss', 'ss', '', NULL, '+44', '', NULL, NULL, '', '0', '2025-03-27 06:18:25', '2025-03-27 06:18:25'),
(11, 11, 0, 'ddd', 'dddddddddd', '', '', '+44', '', '+44', '', NULL, '0', '2025-03-27 06:55:28', '2025-03-27 06:55:28'),
(12, 11, 0, 'dddddd', 'ddddddddddd', '', '', '+44', '', '+44', '', NULL, '0', '2025-03-27 06:55:28', '2025-03-27 06:55:28'),
(13, 12, 0, 's', 's', '', NULL, '+44', '', NULL, NULL, '', '0', '2025-04-02 06:13:37', '2025-04-02 06:13:37'),
(14, 13, 0, 'f', 'f', '', NULL, '+44', '', NULL, NULL, '', '0', '2025-04-02 07:13:52', '2025-04-02 07:13:52'),
(15, 14, 0, 'ss', 's', '', NULL, '+44', '', NULL, NULL, '', '0', '2025-04-02 12:21:40', '2025-04-02 12:21:40'),
(16, 15, 0, 'A', 'A', '', NULL, '+44', '', NULL, NULL, '', '0', '2025-04-03 10:30:20', '2025-04-03 10:30:20');

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
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `client_documents`
--

INSERT INTO `client_documents` (`id`, `client_id`, `file_name`, `original_name`, `file_type`, `file_size`, `web_url`, `created_at`, `updated_at`) VALUES
(1, 12, '1729316168785-Activity.PNG', 'Activity.PNG', 'image/png', 54446, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CLIENT_DEMO/Activity.PNG', '2025-04-02 11:57:23', '2025-04-02 11:57:23');

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
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `client_job_task`
--

INSERT INTO `client_job_task` (`id`, `job_id`, `client_id`, `task_id`, `task_status`, `time`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 1, NULL, '12:12', '2025-01-30 09:09:00', '2025-01-30 09:09:00'),
(3, 4, 2, 1, NULL, '12:12', '2025-02-10 13:14:57', '2025-02-10 13:14:57'),
(4, 4, 2, 2, NULL, '12:12', '2025-02-10 13:14:57', '2025-02-10 13:14:57'),
(5, 6, 2, 1, NULL, '12:12', '2025-04-03 10:52:43', '2025-04-03 10:52:43');

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
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `client_trustee_contact_details`
--

INSERT INTO `client_trustee_contact_details` (`id`, `client_id`, `role`, `first_name`, `last_name`, `email`, `alternate_email`, `phone_code`, `phone`, `alternate_phone_code`, `alternate_phone`, `residential_address`, `authorised_signatory_status`, `created_at`, `updated_at`) VALUES
(1, 1, 0, 'a', 'a', '', '', '+44', '', '+44', '', NULL, '0', '2025-01-30 09:02:25', '2025-01-30 09:02:25'),
(2, 6, 0, 's', 's', '', '', '+44', '', '+44', '', NULL, '0', '2025-02-10 11:45:33', '2025-02-10 11:45:33'),
(3, 8, 0, 'dd', 'dd', '', '', '+44', '', '+44', '', NULL, '0', '2025-02-10 11:47:41', '2025-02-10 11:47:41');

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
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `customer_type`, `staff_id`, `account_manager_id`, `trading_name`, `customer_code`, `trading_address`, `vat_registered`, `vat_number`, `website`, `customerJoiningDate`, `customerSource`, `customerSubSource`, `form_process`, `notes`, `status`, `created_at`, `updated_at`) VALUES
(1, '1', 2, 10, 'CUS1', '00001', 's', '0', '', '', '2025-01-30', 5, 7, '4', '', '1', '2025-01-30 08:58:35', '2025-02-08 11:36:52'),
(2, '1', 2, 10, 'DDDD', '00002', 'ss', '0', '', '', '2025-02-04', 10, 14, '4', '', '1', '2025-02-04 05:08:03', '2025-02-11 05:04:04'),
(5, '1', 5, 10, 'CUST-STAFF1', '00003', 'ok', '0', '', '', '2025-02-06', 10, 14, '4', '', '1', '2025-02-06 10:46:57', '2025-02-08 11:36:52'),
(6, '1', 10, 10, 'CUST-4', '00004', 'a', '0', '0', '', '2025-02-06', 10, 14, '4', '', '1', '2025-02-06 11:34:48', '2025-02-11 05:08:53'),
(7, '1', 7, 10, 'CUS-9', '00005', 'AA', '0', '', '', '2025-02-07', 10, 14, '4', '', '1', '2025-02-07 13:20:42', '2025-02-08 11:36:52'),
(8, '1', 7, 10, 'f45cust', '00006', 's', '0', '', '', '2025-02-08', 10, 14, '4', '', '1', '2025-02-08 05:26:20', '2025-02-20 06:49:02'),
(15, '1', 1, 10, 'Adad', '00007', '', '0', '', '', NULL, NULL, NULL, '1', '', '1', '2025-04-03 07:27:38', '2025-04-03 07:27:38'),
(16, '1', 1, 10, 'aaaaaa', '00008', '', '0', '', '', NULL, NULL, NULL, '1', '', '1', '2025-04-03 08:24:59', '2025-04-03 08:24:59'),
(17, '1', 1, 10, 'sds', '00009', '', '0', '', '', '2025-04-03', 7, 11, '4', '', '1', '2025-04-03 08:31:15', '2025-04-03 08:34:03'),
(18, '1', 10, 10, 'fh', '000010', '', '0', '', '', '2025-04-03', 10, 14, '4', '', '1', '2025-04-03 08:39:08', '2025-04-03 08:39:19'),
(19, '3', 1, 10, 'SHKKK', '000011', 's', '0', '', '', '2025-04-03', 10, 14, '4', '', '1', '2025-04-03 10:29:53', '2025-04-03 10:30:02'),
(20, '1', 1, 11, 'asad', '000012', 'dd', '0', '', '', '2025-04-03', 10, 14, '4', '', '1', '2025-04-03 10:57:27', '2025-04-03 10:57:41');

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
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

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
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_contact_details`
--

INSERT INTO `customer_contact_details` (`id`, `customer_id`, `contact_person_role_id`, `first_name`, `last_name`, `email`, `alternate_email`, `phone_code`, `phone`, `alternate_phone`, `residential_address`, `authorised_signatory_status`, `created_at`, `updated_at`) VALUES
(1, 1, 0, 's', 's', 's@gmail.com', NULL, '+44', '', NULL, 's', '1', '2025-01-30 08:58:35', '2025-01-30 08:58:35'),
(2, 2, 0, 'ss', 'sss', 's@gmail.com', NULL, '+44', '', NULL, 's', '1', '2025-02-04 05:08:03', '2025-02-04 05:08:03'),
(5, 5, 0, 's', 's', 's@gmail.com', NULL, '+44', '2777777777', NULL, 's', '1', '2025-02-06 10:46:57', '2025-02-06 10:46:57'),
(6, 6, 0, 's', 's', 's@gmail.com', NULL, '+44', '7777777777', NULL, 'z', '1', '2025-02-06 11:34:48', '2025-02-06 11:34:48'),
(7, 7, 0, 's', 's', 's@gmail.com', NULL, '+44', '', NULL, 's', '1', '2025-02-07 13:20:42', '2025-02-07 13:20:42'),
(8, 8, 0, 's', 's', 's@gmail.com', NULL, '+44', '2777777777', NULL, 's', '1', '2025-02-08 05:26:20', '2025-02-08 05:26:20'),
(15, 15, 0, 'SDD', 'scvs', 's@gmail.com', NULL, '+44', '', NULL, 'ada', '1', '2025-04-03 07:27:38', '2025-04-03 07:27:38'),
(16, 16, 0, 'aa', 'aa', 's@gmail.com', NULL, '+44', '', NULL, 'ssss', '1', '2025-04-03 08:24:59', '2025-04-03 08:24:59'),
(17, 17, 0, 'dsd', 'sfs', 's@gmail.com', NULL, '+44', '', NULL, 'sdfasf', '1', '2025-04-03 08:31:15', '2025-04-03 08:31:15'),
(18, 18, 0, 'fhfh', 'fh', 's@gmail.com', NULL, '+44', '', NULL, 'fh', '1', '2025-04-03 08:39:08', '2025-04-03 08:39:08'),
(19, 19, 2, 'sh', 'hu', 's@gmail.com', NULL, '+44', '', NULL, NULL, '0', '2025-04-03 10:29:53', '2025-04-03 10:29:53'),
(20, 19, 2, 'shk', 'huk', 's@gmail.com', NULL, '+44', '', NULL, NULL, '0', '2025-04-03 10:29:53', '2025-04-03 10:29:53'),
(21, 20, 0, 'adad', 'dad', 's@gmail.com', NULL, '+44', '', NULL, 'ada', '1', '2025-04-03 10:57:27', '2025-04-03 10:57:27');

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
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_contact_person_role`
--

INSERT INTO `customer_contact_person_role` (`id`, `name`, `status`, `created_at`, `updated_at`) VALUES
(1, 'RoleName1', '1', '2025-04-03 05:06:14', '2025-04-03 05:06:14'),
(2, 'RoleName2', '1', '2025-04-03 05:06:22', '2025-04-03 05:06:22');

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
  `adhoc_accountants` decimal(10,2) DEFAULT NULL,
  `adhoc_bookkeepers` decimal(10,2) DEFAULT NULL,
  `adhoc_payroll_experts` decimal(10,2) DEFAULT NULL,
  `adhoc_tax_experts` decimal(10,2) DEFAULT NULL,
  `adhoc_admin_staff` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_engagement_model_id` (`customer_engagement_model_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `customer_engagement_customised_pricing`
--

DROP TABLE IF EXISTS `customer_engagement_customised_pricing`;
CREATE TABLE IF NOT EXISTS `customer_engagement_customised_pricing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_engagement_model_id` int(11) NOT NULL,
  `minimum_number_of_jobs` int(11) DEFAULT NULL,
  `job_type_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `cost_per_job` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_engagement_model_id` (`customer_engagement_model_id`),
  KEY `job_type_id` (`job_type_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `customer_engagement_fte`
--

DROP TABLE IF EXISTS `customer_engagement_fte`;
CREATE TABLE IF NOT EXISTS `customer_engagement_fte` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_engagement_model_id` (`customer_engagement_model_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_engagement_fte`
--

INSERT INTO `customer_engagement_fte` (`id`, `customer_engagement_model_id`, `number_of_accountants`, `fee_per_accountant`, `number_of_bookkeepers`, `fee_per_bookkeeper`, `number_of_payroll_experts`, `fee_per_payroll_expert`, `number_of_tax_experts`, `fee_per_tax_expert`, `number_of_admin_staff`, `fee_per_admin_staff`, `created_at`, `updated_at`) VALUES
(1, 8, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-03 08:33:36', '2025-04-03 08:33:36'),
(2, 9, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-03 08:39:17', '2025-04-03 08:39:17'),
(4, 11, 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-03 10:57:40', '2025-04-03 10:57:40');

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
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_engagement_model`
--

INSERT INTO `customer_engagement_model` (`id`, `customer_id`, `fte_dedicated_staffing`, `percentage_model`, `adhoc_payg_hourly`, `customised_pricing`, `created_at`, `updated_at`) VALUES
(1, 1, '0', '1', '0', '0', '2025-01-30 08:59:03', '2025-01-30 08:59:03'),
(2, 2, '0', '1', '0', '0', '2025-02-04 05:08:19', '2025-02-04 05:08:19'),
(3, 5, '0', '1', '0', '0', '2025-02-06 10:47:13', '2025-02-06 10:47:13'),
(4, 6, '0', '1', '0', '0', '2025-02-06 11:35:05', '2025-02-06 11:35:05'),
(5, 7, '0', '1', '0', '0', '2025-02-07 13:21:40', '2025-02-07 13:21:40'),
(6, 8, '0', '1', '0', '0', '2025-02-08 05:26:33', '2025-02-08 05:26:33'),
(8, 17, '1', '0', '0', '0', '2025-04-03 08:33:36', '2025-04-03 08:33:36'),
(9, 18, '1', '0', '0', '0', '2025-04-03 08:39:17', '2025-04-03 08:39:17'),
(10, 19, '0', '1', '0', '0', '2025-04-03 10:30:01', '2025-04-03 10:48:40'),
(11, 20, '1', '0', '0', '0', '2025-04-03 10:57:40', '2025-04-03 10:57:40');

-- --------------------------------------------------------

--
-- Table structure for table `customer_engagement_percentage`
--

DROP TABLE IF EXISTS `customer_engagement_percentage`;
CREATE TABLE IF NOT EXISTS `customer_engagement_percentage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customer_engagement_model_id` int(11) NOT NULL,
  `total_outsourcing` decimal(15,2) DEFAULT NULL,
  `accountants` decimal(10,2) DEFAULT NULL,
  `bookkeepers` decimal(10,2) DEFAULT NULL,
  `payroll_experts` decimal(10,2) DEFAULT NULL,
  `tax_experts` decimal(10,2) DEFAULT NULL,
  `admin_staff` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `customer_engagement_model_id` (`customer_engagement_model_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_engagement_percentage`
--

INSERT INTO `customer_engagement_percentage` (`id`, `customer_engagement_model_id`, `total_outsourcing`, `accountants`, `bookkeepers`, `payroll_experts`, `tax_experts`, `admin_staff`, `created_at`, `updated_at`) VALUES
(1, 1, '1.00', '1.00', '1.00', '1.00', '1.00', '1.00', '2025-01-30 08:59:03', '2025-01-30 08:59:03'),
(2, 2, '22.00', '22.00', '22.00', '22.00', '22.00', '22.00', '2025-02-04 05:08:19', '2025-02-04 05:08:19'),
(3, 3, '4.00', '4.00', '4.00', '4.00', '4.00', '4.00', '2025-02-06 10:47:13', '2025-02-06 10:47:13'),
(4, 4, '1.00', '1.00', '1.00', '1.00', '1.00', '1.00', '2025-02-06 11:35:05', '2025-02-06 11:35:05'),
(5, 5, '1.00', '1.00', '1.00', '1.00', '1.00', '1.00', '2025-02-07 13:21:40', '2025-02-07 13:21:40'),
(6, 6, '1.00', NULL, '1.00', '1.00', '1.00', '1.00', '2025-02-08 05:26:33', '2025-02-20 08:40:59'),
(8, 10, '1.00', NULL, NULL, NULL, NULL, NULL, '2025-04-03 10:48:40', '2025-04-03 10:48:40');

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
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_paper_work`
--

INSERT INTO `customer_paper_work` (`id`, `customer_id`, `file_name`, `original_name`, `file_type`, `file_size`, `web_url`, `created_at`, `updated_at`) VALUES
(1, 8, '1721719818558-002.png', '002.png', 'image/png', 436901, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST8/002.png', '2025-02-20 06:06:37', '2025-02-20 06:06:37');

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
) ENGINE=MyISAM AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_services`
--

INSERT INTO `customer_services` (`id`, `customer_id`, `service_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '1', '2025-01-30 08:58:44', '2025-01-30 08:58:44'),
(2, 1, 7, '1', '2025-01-30 08:58:44', '2025-01-30 08:58:44'),
(3, 1, 6, '1', '2025-01-30 08:58:44', '2025-01-30 08:58:44'),
(4, 1, 2, '1', '2025-02-01 06:20:02', '2025-02-01 06:20:02'),
(5, 2, 3, '1', '2025-02-04 05:08:07', '2025-02-04 05:08:07'),
(6, 2, 2, '1', '2025-02-04 05:09:30', '2025-02-04 05:09:30'),
(7, 5, 3, '1', '2025-02-06 10:47:02', '2025-02-06 10:47:02'),
(8, 6, 1, '1', '2025-02-06 11:34:52', '2025-02-06 11:34:52'),
(9, 6, 2, '1', '2025-02-06 11:34:52', '2025-02-06 11:34:52'),
(10, 7, 3, '1', '2025-02-07 13:20:46', '2025-02-07 13:20:46'),
(11, 8, 3, '1', '2025-02-08 05:26:22', '2025-02-08 05:26:22'),
(17, 15, 1, '1', '2025-04-03 07:27:41', '2025-04-03 07:27:41'),
(18, 16, 1, '1', '2025-04-03 08:25:03', '2025-04-03 08:25:03'),
(19, 17, 1, '1', '2025-04-03 08:31:20', '2025-04-03 08:31:20'),
(20, 18, 2, '1', '2025-04-03 08:39:11', '2025-04-03 08:39:11'),
(21, 19, 1, '1', '2025-04-03 10:29:55', '2025-04-03 10:29:55'),
(22, 20, 1, '1', '2025-04-03 10:57:30', '2025-04-03 10:57:30');

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
(1, 10, '2025-02-01 06:20:02', '2025-02-08 11:36:52'),
(2, 10, '2025-02-01 06:20:02', '2025-02-08 11:36:52'),
(3, 10, '2025-02-01 06:20:02', '2025-02-08 11:36:52'),
(4, 10, '2025-02-01 06:20:02', '2025-02-08 11:36:52'),
(5, 10, '2025-02-04 05:09:30', '2025-02-08 11:36:52'),
(6, 10, '2025-02-04 05:09:30', '2025-02-08 11:36:52'),
(7, 10, '2025-02-06 10:47:02', '2025-02-08 11:36:52'),
(8, 10, '2025-02-06 11:34:52', '2025-02-08 11:36:52'),
(9, 10, '2025-02-06 11:34:52', '2025-02-08 11:36:52'),
(10, 10, '2025-02-07 13:20:46', '2025-02-08 11:36:52'),
(11, 10, '2025-02-20 08:40:51', '2025-02-20 08:40:51'),
(17, 10, '2025-04-03 07:27:41', '2025-04-03 07:27:41'),
(18, 10, '2025-04-03 08:29:26', '2025-04-03 08:29:26'),
(19, 10, '2025-04-03 08:34:11', '2025-04-03 08:34:11'),
(20, 10, '2025-04-03 08:39:50', '2025-04-03 08:39:50'),
(21, 10, '2025-04-03 10:48:33', '2025-04-03 10:48:33'),
(22, 11, '2025-04-03 10:57:30', '2025-04-03 10:57:30');

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
,`sp_customer_id` int(11)
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
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `drafts`
--

INSERT INTO `drafts` (`id`, `job_id`, `draft_sent_on`, `draft_title`, `final_draft_sent_on`, `feedback_received`, `updated_amendment`, `feedback`, `was_it_complete`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-02-01', 'D_00001', '2025-02-01', '0', '4', NULL, '1', '2025-02-01 11:19:53', '2025-02-01 11:19:53'),
(2, 1, '2025-02-01', 'D_00002', '2025-02-01', '1', '4', 'okkk', '1', '2025-02-01 11:20:46', '2025-02-01 12:24:00'),
(3, 1, '2025-02-01', 'D_00003', '2025-02-01', '1', '4', 'okkk', '1', '2025-02-01 11:22:40', '2025-02-01 11:23:04'),
(5, 2, '2025-02-06', 'D_00001', NULL, '0', '1', 'sss', '0', '2025-02-06 12:17:52', '2025-02-06 12:38:53'),
(4, 1, '2025-02-01', 'D_00004', NULL, '0', '1', NULL, '0', '2025-02-01 12:05:49', '2025-02-01 12:05:49'),
(6, 1, '2025-02-10', 'D_00005', NULL, '0', '1', NULL, '0', '2025-02-10 07:23:21', '2025-02-10 07:23:21'),
(7, 3, '2025-02-10', 'D_00001', NULL, '0', '1', NULL, '0', '2025-02-10 09:50:12', '2025-02-10 09:50:12'),
(8, 1, '2025-02-10', 'D_00006', NULL, '0', '1', NULL, '0', '2025-02-10 09:55:36', '2025-02-10 09:55:36'),
(9, 6, '2025-04-05', 'D_00001', '2025-04-05', '1', '1', 'a', '1', '2025-04-05 06:05:17', '2025-04-05 06:05:17');

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
  `Turnover_Period_id_0` varchar(255) DEFAULT NULL,
  `Turnover_Currency_id_0` varchar(255) DEFAULT NULL,
  `Turnover_id_0` int(11) DEFAULT NULL,
  `VAT_Registered_id_0` varchar(255) DEFAULT NULL,
  `VAT_Frequency_id_0` varchar(255) DEFAULT NULL,
  `Who_Did_The_Bookkeeping_id_1` varchar(255) DEFAULT NULL,
  `PAYE_Registered_id_1` varchar(255) DEFAULT NULL,
  `Number_of_Trial_Balance_Items_id_1` varchar(255) DEFAULT NULL,
  `Bookkeeping_Frequency_id_2` varchar(255) DEFAULT NULL,
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
  `Type_of_Payslip_id_3` varchar(255) DEFAULT NULL,
  `Percentage_of_Variable_Payslips_id_3` varchar(255) DEFAULT NULL,
  `Is_CIS_Required_id_3` varchar(255) DEFAULT NULL,
  `CIS_Frequency_id_3` varchar(255) DEFAULT NULL,
  `Number_of_Sub_contractors_id_3` int(11) DEFAULT NULL,
  `Whose_Tax_Return_is_it_id_4` varchar(255) DEFAULT NULL,
  `Number_of_Income_Sources_id_4` varchar(255) DEFAULT NULL,
  `If_Landlord_Number_of_Properties_id_4` varchar(255) DEFAULT NULL,
  `If_Sole_Trader_Who_is_doing_Bookkeeping_id_4` varchar(255) DEFAULT NULL,
  `Management_Accounts_Frequency_id_6` varchar(255) DEFAULT NULL,
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
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `staff_created_id`, `job_id`, `account_manager_id`, `customer_id`, `client_id`, `client_job_code`, `customer_contact_details_id`, `service_id`, `job_type_id`, `budgeted_hours`, `reviewer`, `allocated_to`, `allocated_on`, `date_received_on`, `year_end`, `total_preparation_time`, `review_time`, `feedback_incorporation_time`, `total_time`, `engagement_model`, `expected_delivery_date`, `due_on`, `submission_deadline`, `customer_deadline_date`, `sla_deadline_date`, `internal_deadline_date`, `filing_Companies_required`, `filing_Companies_date`, `filing_hmrc_required`, `filing_hmrc_date`, `opening_balance_required`, `opening_balance_date`, `number_of_transaction`, `number_of_balance_items`, `turnover`, `number_of_employees`, `vat_reconciliation`, `bookkeeping`, `processing_type`, `invoiced`, `currency`, `invoice_value`, `invoice_date`, `invoice_hours`, `invoice_remark`, `status_type`, `total_hours`, `total_hours_status`, `notes`, `Turnover_Period_id_0`, `Turnover_Currency_id_0`, `Turnover_id_0`, `VAT_Registered_id_0`, `VAT_Frequency_id_0`, `Who_Did_The_Bookkeeping_id_1`, `PAYE_Registered_id_1`, `Number_of_Trial_Balance_Items_id_1`, `Bookkeeping_Frequency_id_2`, `Number_of_Total_Transactions_id_2`, `Number_of_Bank_Transactions_id_2`, `Number_of_Purchase_Invoices_id_2`, `Number_of_Sales_Invoices_id_2`, `Number_of_Petty_Cash_Transactions_id_2`, `Number_of_Journal_Entries_id_2`, `Number_of_Other_Transactions_id_2`, `Transactions_Posting_id_2`, `Quality_of_Paperwork_id_2`, `Number_of_Integration_Software_Platforms_id_2`, `CIS_id_2`, `Posting_Payroll_Journals_id_2`, `Department_Tracking_id_2`, `Sales_Reconciliation_Required_id_2`, `Factoring_Account_id_2`, `Payment_Methods_id_2`, `Payroll_Frequency_id_3`, `Type_of_Payslip_id_3`, `Percentage_of_Variable_Payslips_id_3`, `Is_CIS_Required_id_3`, `CIS_Frequency_id_3`, `Number_of_Sub_contractors_id_3`, `Whose_Tax_Return_is_it_id_4`, `Number_of_Income_Sources_id_4`, `If_Landlord_Number_of_Properties_id_4`, `If_Sole_Trader_Who_is_doing_Bookkeeping_id_4`, `Management_Accounts_Frequency_id_6`, `created_at`, `updated_at`) VALUES
(1, 2, '00001', 11, 1, 2, '', 1, 2, 2, '24:24', 0, 0, '2025-01-30', '2025-01-30', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2025-01-26', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 7, NULL, '1', NULL, '', '', 0, '', '', '', '', '', 'Daily', 0, 0, 0, 0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, '0', '0', '0', '', '', '2025-01-30 09:09:00', '2025-02-10 09:55:36'),
(2, 2, '00002', 11, 2, 3, '', 2, 2, 4, '00:00', 0, 0, '2025-02-04', '2025-02-04', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2025-02-05', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 21, NULL, '1', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-02-04 05:14:36', '2025-02-06 12:17:52'),
(3, 7, '00003', 4, 8, 5, '', 8, 3, 3, '00:00', 0, 0, '2025-02-08', '2025-02-08', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2025-02-09', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 8, NULL, '1', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-02-08 05:28:09', '2025-02-10 11:21:13'),
(4, 2, '00004', 10, 1, 2, '', 1, 2, 4, '24:24', 0, 0, '2025-02-10', '2025-02-10', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2025-02-21', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 4, NULL, '1', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-02-10 13:14:57', '2025-02-20 11:24:54'),
(5, 1, '00005', 10, 2, 3, '', 2, 3, 3, '00:00', 0, 0, '2025-04-02', '2025-04-02', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2025-04-03', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', 'Daily', 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', 'Quarterly', '2025-04-02 08:35:25', '2025-04-02 08:35:25'),
(6, 1, '00006', 10, 1, 2, '', 1, 7, 2, '12:12', 0, 0, '2025-04-03', '2025-04-03', '', '00:00', '00:00', '00:00', '00:00', 'percentage_model', NULL, NULL, NULL, NULL, '2025-04-04', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 6, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', 'Daily', 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', 'Quarterly', '2025-04-03 10:52:43', '2025-04-05 06:05:17');

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
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `job_documents`
--

INSERT INTO `job_documents` (`id`, `job_id`, `file_name`, `original_name`, `file_type`, `file_size`, `web_url`, `created_at`, `updated_at`) VALUES
(1, 4, '1739884530929-Weekly AF-Performance-WE 07_2025.xlsx', 'Weekly AF-Performance-WE 07_2025.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 830876, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/_layouts/15/Doc.aspx?sourcedoc=%7B7214E198-6368-4DD1-A82E-69709FAE54F4%7D&file=Weekly%20AF-Performance-WE%2007_2025.xlsx&action=default&mobileredirect=true', '2025-02-20 07:02:20', '2025-02-20 07:02:20');

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
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `job_types`
--

INSERT INTO `job_types` (`id`, `service_id`, `type`, `status`, `created_at`, `updated_at`) VALUES
(1, 7, 'VAT1', '1', '2025-01-30 08:57:18', '2025-01-30 08:57:18'),
(2, 7, 'VAT2', '1', '2025-01-30 08:57:26', '2025-01-30 08:57:26'),
(3, 3, 'V3', '1', '2025-02-04 05:12:37', '2025-02-04 05:12:37'),
(4, 2, 'V4', '1', '2025-02-04 05:14:10', '2025-02-04 05:14:10');

-- --------------------------------------------------------

--
-- Table structure for table `line_managers`
--

DROP TABLE IF EXISTS `line_managers`;
CREATE TABLE IF NOT EXISTS `line_managers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `staff_by` int(11) NOT NULL,
  `staff_to` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `staff_by` (`staff_by`),
  KEY `staff_to` (`staff_to`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `line_managers`
--

INSERT INTO `line_managers` (`id`, `staff_by`, `staff_to`, `created_at`, `updated_at`) VALUES
(1, 5, 4, '2025-02-06 07:27:58', '2025-02-06 07:27:58'),
(2, 6, 5, '2025-02-06 07:28:28', '2025-02-06 11:30:04'),
(3, 8, 7, '2025-02-08 05:24:21', '2025-02-08 05:24:21'),
(4, 10, 11, '2025-02-08 06:53:36', '2025-02-10 12:11:07'),
(5, 11, 10, '2025-02-10 11:53:22', '2025-02-10 11:53:22');

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
  `is_disable` enum('0','1') NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `status_type_id` (`status_type_id`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `master_status`
--

INSERT INTO `master_status` (`id`, `name`, `status_type_id`, `status`, `is_disable`, `created_at`, `updated_at`) VALUES
(1, 'To Be Started - Not Yet Allocated Internally', 1, '1', '1', '2024-08-27 11:42:24', '2025-02-06 08:43:02'),
(2, 'WIP – Missing Paperwork', 1, '1', '1', '2024-08-27 11:53:06', '2025-02-06 08:43:07'),
(3, 'WIP – Processing', 1, '1', '1', '2024-08-27 11:53:06', '2025-02-06 08:43:11'),
(4, 'WIP – In Queries', 1, '1', '1', '2024-08-27 11:53:06', '2025-02-06 08:43:15'),
(5, 'WIP – To Be Reviewed', 1, '1', '1', '2024-08-27 11:53:06', '2025-02-06 08:43:19'),
(6, 'Complete', 2, '1', '1', '2024-09-24 13:07:54', '2025-02-06 08:43:24'),
(7, 'Draft Sent', 3, '1', '1', '2024-11-10 22:47:22', '2025-02-10 07:08:36'),
(8, 'Duplicate', 3, '1', '0', '2024-11-10 22:48:56', '2025-02-06 08:42:56'),
(9, 'Awaiting Paperwork/Accounts/VAT', 7, '1', '0', '2024-11-10 22:49:22', '2025-02-06 08:42:56'),
(10, 'Client Not Responding', 7, '1', '0', '2024-11-10 22:49:41', '2025-02-06 08:42:56'),
(11, 'Waiting for Credentials', 7, '1', '0', '2024-11-10 22:49:57', '2025-02-06 08:42:56'),
(12, 'Bookkeeping Not Completed', 7, '1', '0', '2024-11-10 22:50:12', '2025-02-06 08:42:56'),
(13, 'To Be Reviewed', 1, '1', '0', '2024-11-10 22:51:55', '2025-02-06 08:42:56'),
(14, 'Customer Reviewed & To be Updated', 1, '1', '0', '2024-11-10 22:52:10', '2025-02-06 08:42:56'),
(17, 'Update Sent', 2, '1', '0', '2024-11-10 22:53:06', '2025-02-06 08:42:56'),
(21, 'WIP - Customer Reviewed & To be Updated', 1, '1', '1', '2025-02-01 11:28:00', '2025-02-06 08:43:32');

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
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `missing_logs`
--

INSERT INTO `missing_logs` (`id`, `job_id`, `missing_log`, `missing_paperwork`, `missing_log_sent_on`, `missing_log_prepared_date`, `missing_log_title`, `missing_log_reviewed_by`, `missing_log_reviewed_date`, `missing_paperwork_received_on`, `last_chaser`, `status`, `created_at`, `updated_at`) VALUES
(1, 4, '1', '0', '2025-02-20', NULL, 'M_00001', 2, '2025-02-20', NULL, '2025-02-20', '0', '2025-02-20 10:00:56', '2025-02-20 10:37:37');

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
  `file_type` text,
  `file_size` int(11) NOT NULL,
  `web_url` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `missing_log_id` (`missing_log_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `missing_logs_documents`
--

INSERT INTO `missing_logs_documents` (`id`, `missing_log_id`, `file_name`, `original_name`, `file_type`, `file_size`, `web_url`, `created_at`, `updated_at`) VALUES
(1, 1, '1740050043553-002.png', '002.png', 'image/png', 436901, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST8_CLIENT8_JOB4/CUST8_CLIENT8_JOB4_MISSING_LOG_1/002.png', '2025-02-20 10:00:56', '2025-02-20 11:14:07');

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
) ENGINE=MyISAM AUTO_INCREMENT=36 DEFAULT CHARSET=latin1;

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
(33, 'all_customers', 'view', '2024-07-09 01:29:27', '2025-04-04 06:42:58'),
(34, 'all_clients', 'view', '2024-07-09 01:29:27', '2025-04-04 06:43:09'),
(35, 'all_jobs', 'view', '2024-07-09 01:29:27', '2025-04-04 06:43:18');

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
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `queries`
--

INSERT INTO `queries` (`id`, `job_id`, `queries_remaining`, `query_title`, `reviewed_by`, `missing_queries_prepared_date`, `query_sent_date`, `response_received`, `response`, `final_query_response_received_date`, `last_chaser`, `status`, `created_at`, `updated_at`) VALUES
(1, 4, '0', 'Q_00001', '0', NULL, '2025-02-20', '0', NULL, NULL, '2025-02-20', '0', '2025-02-20 09:46:24', '2025-02-20 09:46:24'),
(2, 4, '1', 'Q_00002', '0', NULL, '2025-02-20', '0', NULL, '2025-02-21', '2025-02-20', '0', '2025-02-20 09:46:34', '2025-02-20 11:24:54');

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
  `file_type` text NOT NULL,
  `file_size` int(11) NOT NULL,
  `web_url` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `query_id` (`query_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `queries_documents`
--

INSERT INTO `queries_documents` (`id`, `query_id`, `file_name`, `original_name`, `file_type`, `file_size`, `web_url`, `created_at`, `updated_at`) VALUES
(1, 2, '1740050733744-002.png', '002.png', 'image/png', 436901, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST8_CLIENT8_JOB4/CUST8_CLIENT8_JOB4_QUERY_LOG_2/002.png', '2025-02-20 09:46:34', '2025-02-20 11:25:38');

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
  `is_disable` enum('0','1') NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `role`, `hourminute`, `status`, `is_disable`, `created_at`, `updated_at`) VALUES
(1, 'Super Admin', 'SUPERADMIN', NULL, '1', '1', '2024-06-28 11:59:13', '2025-02-06 12:43:48'),
(2, 'Admin', 'ADMIN', '125:59', '1', '1', '2024-06-28 11:59:22', '2025-02-06 12:43:48'),
(3, 'Processor', 'PROCESSOR', '232:59', '1', '1', '2024-06-28 12:05:34', '2025-02-06 12:43:48'),
(4, 'Manager', 'MANAGER', '2:5', '1', '1', '2024-09-07 09:17:08', '2025-02-06 12:43:48'),
(5, 'Leadership', 'LEADERSHIP', NULL, '1', '1', '2024-09-07 09:17:08', '2025-02-06 12:43:48'),
(6, 'Reviewer', 'REVIEWER', NULL, '1', '1', '2024-09-07 09:17:38', '2025-02-06 12:43:48'),
(8, 'Management', 'MANAGEMENT', NULL, '1', '0', '2024-10-14 09:00:37', '2025-02-06 12:43:55'),
(9, 'DEMO', 'DEMO', '00:00', '1', '0', '2025-02-06 05:19:54', '2025-02-06 12:43:58');

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
(4, 14, '2024-12-18 05:23:30', '2024-12-18 05:23:30'),
(9, 29, '2025-02-06 05:19:55', '2025-02-06 05:19:55'),
(9, 30, '2025-02-06 05:19:55', '2025-02-06 05:19:55'),
(9, 31, '2025-02-06 05:19:55', '2025-02-06 05:19:55'),
(9, 32, '2025-02-06 05:19:55', '2025-02-06 05:19:55'),
(9, 1, '2025-02-08 05:25:44', '2025-02-08 05:25:44'),
(9, 13, '2025-02-08 05:25:44', '2025-02-08 05:25:44'),
(9, 17, '2025-02-08 05:25:44', '2025-02-08 05:25:44'),
(9, 20, '2025-02-08 05:25:44', '2025-02-08 05:25:44'),
(9, 4, '2025-02-08 05:25:44', '2025-02-08 05:25:44'),
(9, 16, '2025-02-08 05:25:44', '2025-02-08 05:25:44'),
(10, 29, '2025-02-20 11:49:19', '2025-02-20 11:49:19'),
(10, 30, '2025-02-20 11:49:19', '2025-02-20 11:49:19'),
(10, 31, '2025-02-20 11:49:19', '2025-02-20 11:49:19'),
(10, 32, '2025-02-20 11:49:19', '2025-02-20 11:49:19'),
(2, 9, '2025-03-29 05:15:44', '2025-03-29 05:15:44'),
(2, 10, '2025-03-29 05:15:44', '2025-03-29 05:15:44'),
(2, 11, '2025-03-29 05:15:44', '2025-03-29 05:15:44'),
(2, 24, '2025-04-05 06:13:37', '2025-04-05 06:13:37'),
(2, 2, '2025-03-29 05:16:19', '2025-03-29 05:16:19'),
(2, 3, '2025-03-29 05:16:19', '2025-03-29 05:16:19'),
(2, 33, '2025-04-05 06:24:20', '2025-04-05 06:24:20'),
(2, 5, '2025-03-29 05:16:19', '2025-03-29 05:16:19'),
(2, 6, '2025-03-29 05:16:19', '2025-03-29 05:16:19'),
(2, 7, '2025-03-29 05:16:19', '2025-03-29 05:16:19'),
(2, 14, '2025-03-29 05:16:19', '2025-03-29 05:16:19'),
(2, 15, '2025-03-29 05:16:19', '2025-03-29 05:16:19'),
(2, 34, '2025-04-05 06:46:16', '2025-04-05 06:46:16'),
(2, 17, '2025-04-05 06:59:52', '2025-04-05 06:59:52'),
(2, 18, '2025-03-29 05:16:19', '2025-03-29 05:16:19'),
(2, 19, '2025-03-29 05:16:19', '2025-03-29 05:16:19'),
(2, 21, '2025-03-29 05:16:19', '2025-03-29 05:16:19'),
(2, 22, '2025-03-29 05:16:19', '2025-03-29 05:16:19'),
(2, 23, '2025-03-29 05:16:19', '2025-03-29 05:16:19'),
(2, 12, '2025-04-05 06:04:34', '2025-04-05 06:04:34'),
(2, 25, '2025-03-29 05:16:19', '2025-03-29 05:16:19'),
(2, 26, '2025-03-29 05:16:19', '2025-03-29 05:16:19'),
(2, 27, '2025-03-29 05:16:19', '2025-03-29 05:16:19'),
(2, 35, '2025-04-05 06:57:22', '2025-04-05 06:57:22'),
(2, 29, '2025-03-29 05:16:19', '2025-03-29 05:16:19'),
(2, 30, '2025-03-29 05:16:19', '2025-03-29 05:16:19'),
(2, 31, '2025-03-29 05:16:19', '2025-03-29 05:16:19'),
(2, 8, '2025-04-05 06:13:37', '2025-04-05 06:13:37'),
(2, 285, '2025-04-03 11:47:39', '2025-04-03 11:47:39');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `is_disable` enum('0','1') NOT NULL DEFAULT '0' COMMENT '0: deactive, 1: active',
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

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
(8, 'VAT Returns', '1', '1', '2025-01-28 09:23:31', '2025-02-01 06:48:09'),
(9, 'demo', '0', '1', '2025-02-06 05:16:27', '2025-02-06 05:16:27');

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
(1, 'eyJ0eXAiOiJKV1QiLCJub25jZSI6Ik5CZE5XNEV5TTZlcEI4YWxlVmR2eWFwU0RFNUt0a2tDTDlPSTQ1OG4tYUEiLCJhbGciOiJSUzI1NiIsIng1dCI6InoxcnNZSEhKOS04bWdndDRIc1p1OEJLa0JQdyIsImtpZCI6InoxcnNZSEhKOS04bWdndDRIc1p1OEJLa0JQdyJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8zMzJkY2Q4OS1jZDM3LTQwYTAtYmJhMi1hMmI5MWFiZDQzNGEvIiwiaWF0IjoxNzM1NzMxMTg3LCJuYmYiOjE3MzU3MzExODcsImV4cCI6MTczNTczNjI5MSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhZQUFBQVF5dVlLWmh2VlYzcVpDWFJhRHplQWZpQnMwcjRqcEhlT3lkU242enpXaUJROXhPMmhSd0QzbTdqNUprRTNFZ3QiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6Ik91dGJvb2tBcHAiLCJhcHBpZCI6IjkxODU4NTdmLTczNjUtNGQzNS1iMDBhLTVhMzFkY2RkNThkMiIsImFwcGlkYWNyIjoiMSIsImZhbWlseV9uYW1lIjoiQmhhZ2F0IiwiZ2l2ZW5fbmFtZSI6Ik5pa2l0YSIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjEwMy4xMDMuMjEzLjIxNyIsIm5hbWUiOiJOaWtpdGEgQmhhZ2F0Iiwib2lkIjoiNDI2MWM4MTMtMjViNC00ZjM1LWJmNmItNGE5NzVjZjBhMDU3IiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDA0MUFFRkI5QTQiLCJyaCI6IjEuQVhrQWljMHRNemZOb0VDN29xSzVHcjFEU2dNQUFBQUFBQUFBd0FBQUFBQUFBQUFNQVNSNUFBLiIsInNjcCI6Ik15RmlsZXMuUmVhZCBNeUZpbGVzLldyaXRlIFNpdGVzLlJlYWRXcml0ZS5BbGwgVXNlci5SZWFkIHByb2ZpbGUgb3BlbmlkIGVtYWlsIiwic2lkIjoiZTg3M2Y2OWYtYTE5NS00N2EwLTljYWUtYjc3MDc1MDQ5NzlhIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoiLUFhU09zbnd2T0hmZkhzZmJjbmgwenBKNUtZckhxQ0RiaFluN0hMZmctayIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJFVSIsInRpZCI6IjMzMmRjZDg5LWNkMzctNDBhMC1iYmEyLWEyYjkxYWJkNDM0YSIsInVuaXF1ZV9uYW1lIjoiTmlraXRhLkJoYWdhdEBvdXRib29rcy5jb20iLCJ1cG4iOiJOaWtpdGEuQmhhZ2F0QG91dGJvb2tzLmNvbSIsInV0aSI6InplNFA3T3NYQkVhdzBsa1JOSGhQQVEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImNmMWMzOGU1LTM2MjEtNDAwNC1hN2NiLTg3OTYyNGRjZWQ3YyIsImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfaWRyZWwiOiIxIDE0IiwieG1zX3N0Ijp7InN1YiI6IjRidjJCemlEWUxUNThPVzV6UF91N2Zqc3RkLWFxVEYzamFuZHdDbF9WdkUifSwieG1zX3RjZHQiOjE2MDM0NTY2MDJ9.X8g-2_Kro89Ui4QJfI3cB_WTeRy3OBicxv6rzIqDyFe2f8oPQsrQv_oYBIvFmrGsnaqNBxMACE0oG2oY9WSShwCC3_b7uju_hjGQOXSifmShSWzAIRczdrrB57HXA6txxyCl9YGDoiwc7WVv1wckQ9cz5TupsISLHl83gPsAsg6SFGGJA6N6V5PNBHXVQCUKRFYS4hwUR0HyRDhSdVqYInAiML0QAcNw8kuZ0Tu0i8Jot3iPKMf-ablFuduBFvAurvCbl4ovj-qlE7Lvul6qtrB1xOBDfa6twjpKnFkBWEGnONMd39jqthCSzh-xzA1Qp8Sn5WCFtczuMyK1spUY6w', '1.AXkAic0tMzfNoEC7oqK5Gr1DSn-FhZFlczVNsApaMdzdWNIMASR5AA.AgABAwEAAABVrSpeuWamRam2jAF1XRQEAwDs_wUA9P-ImAq-al0Pv8qPtr24oU8OC0RVtMptaC6RWDPE0h0Q3O1l40oQP4gbdE6kxC_YpjBQKzklOY5-hmhZMWtnZk7Dgt1yZAlZG--izlK5TtBMW3TRg54nTdd99IvEhYpVZVjn6VS_c0TxMgqbuEds3mBbRCQy5IVwwRdqWkYnix4ryMPFZWcOvcTpxeahHNXvSjORokPsRROeq8muUnl2Xxs-47Ycltaik0v6Yy6yCIBNGMoxyFF3PpMbbniAvnW-_vfPRSjfLxUwBT7jLqUDYuZMh30ffK7MB7ftMfzWwEi4cc_xpiUjz6e_Wuc6aFSh37wgb7DZauGp-AFsqXOD-OzoQ1ns4awvqAQ_yGJVsrcNWS_8p_aXOr4XeuILfY-hXiwAGtt4_6SuSzzXAOGdWoaCNce6XfIgW2auB0qazKy3UxDd1aq6xxoHunEPZlxpgMHkhC7I1lA6rZZFGV9yz_mkildQxWwu4PiKNLyRNw7vq6-6zeJqnBznzQqAjxlnHoKHvXAEI62f9CkUN4SH1RuDoIU7pUJw3g0xL7yvd07wUtgTldw8dI_Vsa6ihStoTaAu9WMDVt-Ym86vLd5qLBfWqPD9GLX96vic_oodTWt-Ock8_0JuQKisPpc0sQCifCtyNP_bS3H69ARR8c9h12zaLOj4UUmHgbDgfM887pTnVQknR_9FoB22ZCzIYFvvDzKu0p9Eq9iUhDUcROSf7G7Xaw6l52pHKXdyTZat-rZw0g9TGuwFUsA0XFT-z3I1zcGvB1lOVfMr1pwA-FhekoZImJ7L1-hluVnwVI95DzbTZzFYG890', '9185857f-7365-4d35-b00a-5a31dcdd58d2', 'aCE8Q~nIMereO8MzR6cDsf4QUjJIGLhuBMlcPc-t', '2025-01-01 06:43:05', '2025-04-02 11:56:08');

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
  `is_disable` enum('0','1') NOT NULL DEFAULT '0',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `login_auth_token` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `staffs`
--

INSERT INTO `staffs` (`id`, `role_id`, `first_name`, `last_name`, `email`, `phone_code`, `phone`, `password`, `hourminute`, `status`, `is_disable`, `created_by`, `created_at`, `updated_at`, `login_auth_token`) VALUES
(1, 1, 'System Super', 'Super Admin', 'superadmin@gmail.com', NULL, '1234567891', '$2a$10$j07X1j33uRnImSqWD108IO9w15nAsQxsb7bb5wQsugxrwZ62msJbS', '152:00', '1', '1', 2, '2024-06-28 12:02:41', '2025-04-05 05:02:24', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0MzgyOTM0NCwiZXhwIjoxNzQzODY1MzQ0fQ.mHSmcJxPsMCgw7qsNeT_UUc_90IzXMajIJH2PGHUf6A'),
(2, 2, 'Amit', 'Amit', 'amit@outbooks.com', NULL, '5777777777', '$2a$10$SIJMFK5k/woLfwqfEJGMruiO6.f5oZwnCBb5S9zhmoPR/MiVI5c6K', '300:85', '1', '1', 2, '2024-07-08 07:25:41', '2025-04-05 05:12:00', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc0MzgyOTkyMCwiZXhwIjoxNzQzODY1OTIwfQ.5qV9pm5ioFNjNizVptYZ3rk-4rTJA-g-0CmB9yvPL6Y'),
(3, 2, 'Ajit', 'Ajit', 'ajit@outbooks.com', NULL, '5777777777', '$2a$10$UGh8LOFOP9Kwtha4kypOcuJL.YZYwwyRsSrzaYsRvMiBiwMomGvdW', '659:00', '1', '1', 2, '2024-07-08 07:25:41', '2025-02-06 08:46:14', ''),
(5, 3, 'STAFF', 'ONE', 'staff1@gmail.com', '+44', '2777777777', '$2a$10$naFNFC8Lw.Rcu/Bt518RyOFPYntjk30TrdsfAif2jBgd8lYw4HD7i', '232:59', '1', '0', 2, '2025-02-06 07:27:58', '2025-02-06 10:46:12', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTczODgzODc3MiwiZXhwIjoxNzM4ODc0NzcyfQ.CWK50J0fJHeO13M8kcycFoczGHIGqBOxeX1j2bK1vH8'),
(6, 6, 'STAFF', 'TWO', 'staff2@gmail.com', '+44', '2777777777', '$2a$10$hz3Ok/jshVyP5zTIuckV.udTMy/0e9NX1eq0kEbwoFO0rivX1Xmoy', '00:00', '1', '0', 2, '2025-02-06 07:28:28', '2025-04-05 07:26:54', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTc0MzgzODAxNCwiZXhwIjoxNzQzODc0MDE0fQ.JOv3mdCpY2lC3K1ncCZBN7IHTxBSL4vkFeN3UzCIdIM'),
(11, 4, 'STAFF', 'SIX', 'sss@gmail.com', '+44', '2777777777', '$2a$10$a7sfTgDavJUrU.8kFfbKIe0525d3EF4yABvGUlcZAxV/Amy1qgCVa', '2:5', '1', '0', 2, '2025-02-08 11:43:22', '2025-02-11 04:52:40', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExLCJpYXQiOjE3MzkyNDk1NjAsImV4cCI6MTczOTI4NTU2MH0.42AWkdJ5EM5VAsOlAMU0LlNeB2eGFX2UhbhX0hVvMU8'),
(7, 9, 'STAFF', 'FOUR', 'fs@gmail.com', '+44', '2777777777', '$2a$10$u3oT4jAvi3/U9BvschQsp.3A3HliOeqZgoXOhzx8rjTDJ9jitzvbq', '00:00', '1', '0', 1, '2025-02-07 12:50:36', '2025-04-05 09:34:11', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTc0Mzg0NDkxNCwiZXhwIjoxNzQzODgwOTE0fQ.n4z-9sn0kOJtK1tFhurXsYHQ1Weh5suYbYUxTeKbkbo'),
(10, 4, 'STAFF', 'FIVE', 's@gmail.com', '+44', '2777777777', '$2a$10$NSS0.c3FvdBSfGG2u624U.l.JyHEhy1eS5VjX/YYXkd5dwB/MwVF.', '2:5', '1', '0', 2, '2025-02-08 11:36:28', '2025-04-03 04:50:46', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJpYXQiOjE3NDM2NTU4NDYsImV4cCI6MTc0MzY5MTg0Nn0.6mYVNzn0kJbLOB4Ypu-cMDndmXDXZWt9TTRG57JyafA');

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
) ENGINE=MyISAM AUTO_INCREMENT=377 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `staff_logs`
--

INSERT INTO `staff_logs` (`id`, `staff_id`, `date`, `module_name`, `module_id`, `log_message`, `log_message_all`, `permission_type`, `ip`, `created_at`, `updated_at`) VALUES
(1, 2, '2025-01-30', 'job types', 1, 'created job types VAT1', 'Admin Amit Amit created job types VAT1 ', 'created', '122.168.114.106', '2025-01-30 08:57:18', '2025-01-30 08:57:18'),
(2, 2, '2025-01-30', 'job types', 2, 'created job types VAT2', 'Admin Amit Amit created job types VAT2 ', 'created', '122.168.114.106', '2025-01-30 08:57:26', '2025-01-30 08:57:26'),
(3, 2, '2025-01-30', 'task', 0, 'created task a,b,', 'Admin Amit Amit created task a,b, ', 'created', '122.168.114.106', '2025-01-30 08:57:37', '2025-01-30 08:57:37'),
(4, 2, '2025-01-30', 'task', 0, 'created task c,d,', 'Admin Amit Amit created task c,d, ', 'created', '122.168.114.106', '2025-01-30 08:57:48', '2025-01-30 08:57:48'),
(5, 2, '2025-01-30', 'customer', 1, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_CUS_00001(CUS1)', 'created', '122.168.114.106', '2025-01-30 08:58:35', '2025-01-30 08:58:35'),
(6, 2, '2025-01-30', 'customer', 1, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_00001(CUS1)', 'updated', '122.168.114.106', '2025-01-30 08:58:44', '2025-01-30 08:58:44'),
(7, 2, '2025-01-30', 'client', 1, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_CUS_Cha_00001(Charity)', 'created', '122.168.114.106', '2025-01-30 09:02:25', '2025-01-30 09:02:25'),
(8, 2, '2025-01-30', 'checklist', 1, 'created checklist checklist1', 'Admin Amit Amit created checklist checklist1 ', 'created', '122.168.114.106', '2025-01-30 09:06:45', '2025-01-30 09:06:45'),
(9, 2, '2025-01-30', 'client', 2, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_CUS_Cli_00002(Cli2)', 'created', '122.168.114.106', '2025-01-30 09:08:41', '2025-01-30 09:08:41'),
(10, 2, '2025-01-30', 'job', 1, 'created job code:', 'Admin Amit Amit created job code: CUS_Cli_VAT2_00001', 'created', '122.168.114.106', '2025-01-30 09:09:00', '2025-01-30 09:09:00'),
(11, 2, '2025-01-31', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-01-31 06:55:49', '2025-01-31 06:55:49'),
(12, 2, '2025-01-31', 'job', 1, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_VAT2_00001', 'created', '122.168.114.106', '2025-01-31 07:03:26', '2025-01-31 07:03:26'),
(13, 2, '2025-01-31', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2025-01-31 09:51:43', '2025-01-31 09:51:43'),
(14, 2, '2025-01-31', 'job', 1, 'edited the missing logs job code:', 'Admin Amit Amit edited the missing logs job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-01-31 11:43:53', '2025-01-31 11:43:53'),
(15, 2, '2025-01-31', 'job', 1, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_VAT2_00001', 'created', '122.168.114.106', '2025-01-31 11:44:02', '2025-01-31 11:44:02'),
(16, 2, '2025-02-01', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-02-01 05:01:29', '2025-02-01 05:01:29'),
(17, 2, '2025-02-01', 'job', 1, 'edited the job information and edited the job deadline job code:', 'Admin Amit Amit edited the job information and edited the job deadline job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-01 06:07:22', '2025-02-01 06:07:22'),
(18, 2, '2025-02-01', 'customer', 1, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_CUS_00001(CUS1)', 'updated', '122.168.114.106', '2025-02-01 06:20:02', '2025-02-01 06:20:02'),
(19, 2, '2025-02-01', 'job', 1, 'edited the job information and edited the job deadline job code:', 'Admin Amit Amit edited the job information and edited the job deadline job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-01 06:21:04', '2025-02-01 06:21:04'),
(20, 2, '2025-02-01', 'job', 1, 'updated the job status from WIP – Missing Paperwork to WIP – In Queries. job code:', 'Admin Amit Amit updated the job status from WIP – Missing Paperwork to WIP – In Queries. job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-01 07:11:10', '2025-02-01 07:11:10'),
(21, 2, '2025-02-01', 'job', 1, 'updated the job status from WIP – In Queries to WIP – Processing. job code:', 'Admin Amit Amit updated the job status from WIP – In Queries to WIP – Processing. job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-01 07:14:58', '2025-02-01 07:14:58'),
(22, 2, '2025-02-01', 'job', 1, 'updated the job status from WIP – Processing to WIP – Missing Paperwork. job code:', 'Admin Amit Amit updated the job status from WIP – Processing to WIP – Missing Paperwork. job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-01 07:15:29', '2025-02-01 07:15:29'),
(23, 2, '2025-02-01', 'job', 1, 'edited the missing logs job code:', 'Admin Amit Amit edited the missing logs job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-01 07:25:24', '2025-02-01 07:25:24'),
(24, 2, '2025-02-01', 'job', 1, 'sent the queries for job code:', 'Admin Amit Amit sent the queries for job code: CUS_Cli_VAT2_00001', 'created', '122.168.114.106', '2025-02-01 07:28:40', '2025-02-01 07:28:40'),
(25, 2, '2025-02-01', 'job', 1, 'edited the queries job code:', 'Admin Amit Amit edited the queries job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-01 07:31:16', '2025-02-01 07:31:16'),
(26, 2, '2025-02-01', 'job', 1, 'updated the job status from WIP – In Queries to WIP – Processing. job code:', 'Admin Amit Amit updated the job status from WIP – In Queries to WIP – Processing. job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-01 07:31:24', '2025-02-01 07:31:24'),
(27, 2, '2025-02-01', 'job', 1, 'sent the queries for job code:', 'Admin Amit Amit sent the queries for job code: CUS_Cli_VAT2_00001', 'created', '122.168.114.106', '2025-02-01 09:08:32', '2025-02-01 09:08:32'),
(28, 2, '2025-02-01', 'job', 1, 'edited the queries job code:', 'Admin Amit Amit edited the queries job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-01 09:14:39', '2025-02-01 09:14:39'),
(29, 2, '2025-02-01', 'job', 1, 'completed the queries job code:', 'Admin Amit Amit completed the queries job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-01 11:19:07', '2025-02-01 11:19:07'),
(30, 2, '2025-02-01', 'job', 1, 'completed the queries job code:', 'Admin Amit Amit completed the queries job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-01 11:19:12', '2025-02-01 11:19:12'),
(31, 2, '2025-02-01', 'job', 1, 'completed the missing logs job code:', 'Admin Amit Amit completed the missing logs job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-01 11:19:43', '2025-02-01 11:19:43'),
(32, 2, '2025-02-01', 'job', 1, 'completed the missing logs job code:', 'Admin Amit Amit completed the missing logs job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-01 11:19:47', '2025-02-01 11:19:47'),
(33, 2, '2025-02-01', 'job', 1, 'completed the draft for job code:', 'Admin Amit Amit completed the draft for job code: CUS_Cli_VAT2_00001', 'created', '122.168.114.106', '2025-02-01 11:19:53', '2025-02-01 11:19:53'),
(34, 2, '2025-02-01', 'job', 1, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_Cli_VAT2_00001', 'created', '122.168.114.106', '2025-02-01 11:20:46', '2025-02-01 11:20:46'),
(35, 2, '2025-02-01', 'job', 1, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_Cli_VAT2_00001', 'created', '122.168.114.106', '2025-02-01 11:22:40', '2025-02-01 11:22:40'),
(36, 2, '2025-02-01', 'job', 1, 'completed the draft job code:', 'Admin Amit Amit completed the draft job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-01 11:23:04', '2025-02-01 11:23:04'),
(37, 2, '2025-02-01', 'job', 1, 'completed the draft job code:', 'Admin Amit Amit completed the draft job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-01 11:23:19', '2025-02-01 11:23:19'),
(38, 2, '2025-02-01', 'job', 1, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_Cli_VAT2_00001', 'created', '122.168.114.106', '2025-02-01 12:05:49', '2025-02-01 12:05:49'),
(39, 2, '2025-02-01', 'job', 1, 'edited the draft job code:', 'Admin Amit Amit edited the draft job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-01 12:23:33', '2025-02-01 12:23:33'),
(40, 2, '2025-02-01', 'job', 1, 'completed the draft job code:', 'Admin Amit Amit completed the draft job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-01 12:24:00', '2025-02-01 12:24:00'),
(41, 2, '2025-02-03', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-02-03 07:16:20', '2025-02-03 07:16:20'),
(42, 2, '2025-02-03', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-02-03 08:27:43', '2025-02-03 08:27:43'),
(43, 2, '2025-02-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-02-04 05:05:07', '2025-02-04 05:05:07'),
(44, 2, '2025-02-04', 'customer', 2, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_DDD_00002(DDDD)', 'created', '122.168.114.106', '2025-02-04 05:08:03', '2025-02-04 05:08:03'),
(45, 2, '2025-02-04', 'customer', 2, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_DDD_00002(DDDD)', 'updated', '122.168.114.106', '2025-02-04 05:08:07', '2025-02-04 05:08:07'),
(46, 2, '2025-02-04', 'client', 3, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_DDD_Cli_00003(Cli2g)', 'created', '122.168.114.106', '2025-02-04 05:09:01', '2025-02-04 05:09:01'),
(47, 2, '2025-02-04', 'customer', 2, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_DDD_00002(DDDD)', 'updated', '122.168.114.106', '2025-02-04 05:09:30', '2025-02-04 05:09:30'),
(48, 2, '2025-02-04', 'job types', 3, 'created job types V3', 'Admin Amit Amit created job types V3 ', 'created', '122.168.114.106', '2025-02-04 05:12:37', '2025-02-04 05:12:37'),
(49, 2, '2025-02-04', 'job types', 4, 'created job types V4', 'Admin Amit Amit created job types V4 ', 'created', '122.168.114.106', '2025-02-04 05:14:10', '2025-02-04 05:14:10'),
(50, 2, '2025-02-04', 'job', 2, 'created job code:', 'Admin Amit Amit created job code: DDD_Cli_V4_00002', 'created', '122.168.114.106', '2025-02-04 05:14:36', '2025-02-04 05:14:36'),
(51, 2, '2025-02-05', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-02-05 12:52:48', '2025-02-05 12:52:48'),
(52, 2, '2025-02-06', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-02-06 05:15:05', '2025-02-06 05:15:05'),
(53, 2, '2025-02-06', 'services', 9, 'created services demo', 'Admin Amit Amit created services demo ', 'created', '122.168.114.106', '2025-02-06 05:16:27', '2025-02-06 05:16:27'),
(54, 2, '2025-02-06', 'role', 9, 'created role DEMO', 'Admin Amit Amit created role DEMO ', 'created', '122.168.114.106', '2025-02-06 05:19:55', '2025-02-06 05:19:55'),
(55, 2, '2025-02-06', 'staff', 24, 'created staff SSSS ssss', 'Admin Amit Amit created staff SSSS ssss ', 'created', '122.168.114.106', '2025-02-06 05:20:27', '2025-02-06 05:20:27'),
(56, 2, '2025-02-06', 'staff', 26, 'created staff GGGGGG ssss', 'Admin Amit Amit created staff GGGGGG ssss ', 'created', '122.168.114.106', '2025-02-06 06:56:40', '2025-02-06 06:56:40'),
(57, 2, '2025-02-06', 'staff', 4, 'created staff Account  manager', 'Admin Amit Amit created staff Account  manager ', 'created', '122.168.114.106', '2025-02-06 07:25:43', '2025-02-06 07:25:43'),
(58, 2, '2025-02-06', 'staff', 5, 'created staff STAFF  ONE', 'Admin Amit Amit created staff STAFF  ONE ', 'created', '122.168.114.106', '2025-02-06 07:27:58', '2025-02-06 07:27:58'),
(59, 2, '2025-02-06', 'staff', 6, 'created staff STAFF TWO', 'Admin Amit Amit created staff STAFF TWO ', 'created', '122.168.114.106', '2025-02-06 07:28:28', '2025-02-06 07:28:28'),
(60, 2, '2025-02-06', 'staff', 5, 'edited staff STAFF ONE', 'Admin Amit Amit edited staff STAFF ONE ', 'updated', '122.168.114.106', '2025-02-06 08:22:59', '2025-02-06 08:22:59'),
(61, 2, '2025-02-06', 'customer', 3, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_CUS_00003(CUST3)', 'created', '122.168.114.106', '2025-02-06 08:27:22', '2025-02-06 08:27:22'),
(62, 2, '2025-02-06', 'customer', 2, 'changes the status Deactivate customer code :', 'Admin Amit Amit changes the status Deactivate customer code : cust_DDD_00002(DDDD)', 'updated', '122.168.114.106', '2025-02-06 09:12:45', '2025-02-06 09:12:45'),
(63, 2, '2025-02-06', 'customer', 2, 'changes the status Activate customer code :', 'Admin Amit Amit changes the status Activate customer code : cust_DDD_00002(DDDD)', 'updated', '122.168.114.106', '2025-02-06 09:12:51', '2025-02-06 09:12:51'),
(64, 2, '2025-02-06', 'customer', 2, 'changes the status Deactivate customer code :', 'Admin Amit Amit changes the status Deactivate customer code : cust_DDD_00002(DDDD)', 'updated', '122.168.114.106', '2025-02-06 09:27:07', '2025-02-06 09:27:07'),
(65, 2, '2025-02-06', 'customer', 2, 'changes the status Activate customer code :', 'Admin Amit Amit changes the status Activate customer code : cust_DDD_00002(DDDD)', 'updated', '122.168.114.106', '2025-02-06 09:27:18', '2025-02-06 09:27:18'),
(66, 2, '2025-02-06', 'client', 3, 'deleted customer. customer code :', 'Admin Amit Amit deleted customer. customer code : cli_DDD_Cli_00003(Cli2g)', 'deleted', '122.168.114.106', '2025-02-06 10:09:58', '2025-02-06 10:09:58'),
(67, 2, '2025-02-06', 'customer', 4, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_ada_00003(adad)', 'created', '122.168.114.106', '2025-02-06 10:12:35', '2025-02-06 10:12:35'),
(68, 2, '2025-02-06', 'client', 4, 'deleted customer. customer code :', NULL, 'deleted', '122.168.114.106', '2025-02-06 10:12:41', '2025-02-06 10:12:41'),
(69, 5, '2025-02-06', '-', 0, ' Logged In', 'Processor STAFF ONE  Logged In ', '-', NULL, '2025-02-06 10:46:12', '2025-02-06 10:46:12'),
(70, 5, '2025-02-06', 'customer', 5, 'created customer profile. customer code :', 'Processor STAFF ONE created customer profile. customer code : cust_CUS_00003(CUST-STAFF1)', 'created', NULL, '2025-02-06 10:46:57', '2025-02-06 10:46:57'),
(71, 5, '2025-02-06', 'customer', 5, ' edited the service details and added an additional service while editing the customer code :', 'Processor STAFF ONE  edited the service details and added an additional service while editing the customer code : cust_CUS_00003(CUST-STAFF1)', 'updated', NULL, '2025-02-06 10:47:02', '2025-02-06 10:47:02'),
(72, 6, '2025-02-06', '-', 0, ' Logged In', 'Reviewer STAFF TWO  Logged In ', '-', '103.103.213.217', '2025-02-06 10:48:10', '2025-02-06 10:48:10'),
(73, 2, '2025-02-06', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-02-06 10:48:33', '2025-02-06 10:48:33'),
(74, 6, '2025-02-06', '-', 0, ' Logged In', 'Reviewer STAFF TWO  Logged In ', '-', '122.168.114.106', '2025-02-06 10:48:48', '2025-02-06 10:48:48'),
(75, 6, '2025-02-06', '-', 0, ' Logged In', 'Reviewer STAFF TWO  Logged In ', '-', NULL, '2025-02-06 10:51:10', '2025-02-06 10:51:10'),
(76, 2, '2025-02-06', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-02-06 10:56:32', '2025-02-06 10:56:32'),
(77, 5, '2025-02-06', 'client', 4, 'created client profile. client code :', 'Processor STAFF ONE created client profile. client code : cli_CUS_CLI_00004(CLI-STAFF1)', 'created', '122.168.114.106', '2025-02-06 11:20:55', '2025-02-06 11:20:55'),
(78, 2, '2025-02-06', 'staff', 6, 'edited staff STAFF TWO', 'Admin Amit Amit edited staff STAFF TWO ', 'updated', '122.168.114.106', '2025-02-06 11:21:42', '2025-02-06 11:21:42'),
(79, 6, '2025-02-06', '-', 0, ' Logged Out', 'Reviewer STAFF TWO  Logged Out ', '-', NULL, '2025-02-06 11:33:33', '2025-02-06 11:33:33'),
(80, 4, '2025-02-06', '-', 0, ' Logged In', 'Manager Account  manager  Logged In ', '-', NULL, '2025-02-06 11:33:44', '2025-02-06 11:33:44'),
(81, 4, '2025-02-06', 'customer', 6, 'created customer profile. customer code :', 'Manager Account  manager created customer profile. customer code : cust_CUS_00004(CUST-4)', 'created', NULL, '2025-02-06 11:34:48', '2025-02-06 11:34:48'),
(82, 4, '2025-02-06', 'customer', 6, ' edited the service details and added an additional service while editing the customer code :', 'Manager Account  manager  edited the service details and added an additional service while editing the customer code : cust_CUS_00004(CUST-4)', 'updated', NULL, '2025-02-06 11:34:52', '2025-02-06 11:34:52'),
(83, 2, '2025-02-06', 'job', 2, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: DDD_Cli_V4_00002', 'created', '122.168.114.106', '2025-02-06 12:17:52', '2025-02-06 12:17:52'),
(84, 2, '2025-02-06', 'job', 2, 'edited the draft job code:', 'Admin Amit Amit edited the draft job code: DDD_Cli_V4_00002', 'updated', '122.168.114.106', '2025-02-06 12:38:38', '2025-02-06 12:38:38'),
(85, 2, '2025-02-06', 'job', 2, 'edited the draft job code:', 'Admin Amit Amit edited the draft job code: DDD_Cli_V4_00002', 'updated', '122.168.114.106', '2025-02-06 12:38:53', '2025-02-06 12:38:53'),
(86, 2, '2025-02-07', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-02-07 12:45:39', '2025-02-07 12:45:39'),
(87, 2, '2025-02-07', 'staff', 7, 'created staff STAFF FOUR', 'Admin Amit Amit created staff STAFF FOUR ', 'created', '122.168.114.106', '2025-02-07 12:50:36', '2025-02-07 12:50:36'),
(88, 2, '2025-02-07', 'staff', 8, 'created staff STAFF Five', 'Admin Amit Amit created staff STAFF Five ', 'created', '122.168.114.106', '2025-02-07 13:14:26', '2025-02-07 13:14:26'),
(89, 7, '2025-02-07', '-', 0, ' Logged In', 'DEMO STAFF FOUR  Logged In ', '-', NULL, '2025-02-07 13:19:29', '2025-02-07 13:19:29'),
(90, 7, '2025-02-07', '-', 0, ' Logged Out', 'DEMO STAFF FOUR  Logged Out ', '-', NULL, '2025-02-07 13:19:46', '2025-02-07 13:19:46'),
(91, 8, '2025-02-07', '-', 0, ' Logged In', 'Processor STAFF Five  Logged In ', '-', NULL, '2025-02-07 13:19:54', '2025-02-07 13:19:54'),
(92, 8, '2025-02-07', 'customer', 7, 'created customer profile. customer code :', 'Processor STAFF Five created customer profile. customer code : cust_CUS_00005(CUS-9)', 'created', NULL, '2025-02-07 13:20:42', '2025-02-07 13:20:42'),
(93, 8, '2025-02-07', 'customer', 7, ' edited the service details and added an additional service while editing the customer code :', 'Processor STAFF Five  edited the service details and added an additional service while editing the customer code : cust_CUS_00005(CUS-9)', 'updated', NULL, '2025-02-07 13:20:46', '2025-02-07 13:20:46'),
(94, 2, '2025-02-08', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-02-08 05:02:20', '2025-02-08 05:02:20'),
(95, 2, '2025-02-08', 'job', 1, 'updated the job status from WIP - Customer Reviewed & To be Updated to Filed with HMRC. job code:', 'Admin Amit Amit updated the job status from WIP - Customer Reviewed & To be Updated to Filed with HMRC. job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-08 05:15:28', '2025-02-08 05:15:28'),
(96, 2, '2025-02-08', 'job', 1, 'updated the job status from null to WIP – To Be Reviewed. job code:', 'Admin Amit Amit updated the job status from null to WIP – To Be Reviewed. job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-08 05:18:48', '2025-02-08 05:18:48'),
(97, 2, '2025-02-08', 'job', 1, 'updated the job status from WIP – To Be Reviewed to Filed with Companies House. job code:', 'Admin Amit Amit updated the job status from WIP – To Be Reviewed to Filed with Companies House. job code: CUS_Cli_VAT2_00001', 'updated', '122.168.114.106', '2025-02-08 05:18:58', '2025-02-08 05:18:58'),
(98, 7, '2025-02-08', '-', 0, ' Logged In', 'DEMO STAFF FOUR  Logged In ', '-', NULL, '2025-02-08 05:25:10', '2025-02-08 05:25:10'),
(99, 2, '2025-02-08', 'permission', 9, ' updated the access for DEMO. Access Changes Add Permission (customer-insert, client-insert, job-insert, job-view, customer-view, client-view) Remove Permission (status-view)', 'Admin Amit Amit  updated the access for DEMO. Access Changes Add Permission (customer-insert, client-insert, job-insert, job-view, customer-view, client-view) Remove Permission (status-view) ', 'updated', '122.168.114.106', '2025-02-08 05:25:44', '2025-02-08 05:25:44'),
(100, 7, '2025-02-08', 'customer', 8, 'created customer profile. customer code :', 'DEMO STAFF FOUR created customer profile. customer code : cust_f4-_00006(f4-cust)', 'created', '122.168.114.106', '2025-02-08 05:26:20', '2025-02-08 05:26:20'),
(101, 7, '2025-02-08', 'customer', 8, ' edited the service details and added an additional service while editing the customer code :', 'DEMO STAFF FOUR  edited the service details and added an additional service while editing the customer code : cust_f4-_00006(f4-cust)', 'updated', '122.168.114.106', '2025-02-08 05:26:22', '2025-02-08 05:26:22'),
(102, 8, '2025-02-08', '-', 0, ' Logged In', 'Processor STAFF Five  Logged In ', '-', '122.168.114.106', '2025-02-08 05:27:15', '2025-02-08 05:27:15'),
(103, 7, '2025-02-08', 'client', 5, 'created client profile. client code :', 'DEMO STAFF FOUR created client profile. client code : cli_f4-_f4-_00005(f4-cli)', 'created', '122.168.114.106', '2025-02-08 05:27:53', '2025-02-08 05:27:53'),
(104, 7, '2025-02-08', 'job', 3, 'created job code:', 'DEMO STAFF FOUR created job code: f4-_f4-_V3_00003', 'created', '122.168.114.106', '2025-02-08 05:28:09', '2025-02-08 05:28:09'),
(105, 2, '2025-02-08', 'job', 3, 'updated the job status from To Be Started - Not Yet Allocated Internally to Filed with Companies House and HMRC. job code:', 'Admin Amit Amit updated the job status from To Be Started - Not Yet Allocated Internally to Filed with Companies House and HMRC. job code: f4-_f4-_V3_00003', 'updated', '122.168.114.106', '2025-02-08 05:44:23', '2025-02-08 05:44:23'),
(106, 2, '2025-02-08', 'staff', 9, 'created staff STAFF FIVE', 'Admin Amit Amit created staff STAFF FIVE ', 'created', '122.168.114.106', '2025-02-08 06:53:36', '2025-02-08 06:53:36'),
(107, 9, '2025-02-08', '-', 0, ' Logged In', 'Manager STAFF FIVE  Logged In ', '-', NULL, '2025-02-08 06:54:06', '2025-02-08 06:54:06'),
(108, 2, '2025-02-08', 'staff', 10, 'created staff STAFF FIVE', 'Admin Amit Amit created staff STAFF FIVE ', 'created', '122.168.114.106', '2025-02-08 11:36:28', '2025-02-08 11:36:28'),
(109, 2, '2025-02-08', 'staff', 11, 'created staff STAFF SIX', 'Admin Amit Amit created staff STAFF SIX ', 'created', '122.168.114.106', '2025-02-08 11:43:22', '2025-02-08 11:43:22'),
(110, 2, '2025-02-10', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-02-10 07:21:49', '2025-02-10 07:21:49'),
(111, 2, '2025-02-10', 'job', 1, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_Cli_VAT2_00001', 'created', '122.168.114.106', '2025-02-10 07:23:21', '2025-02-10 07:23:21'),
(112, 2, '2025-02-10', 'job', 3, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: f4-_f4-_V3_00003', 'created', '122.168.114.106', '2025-02-10 09:50:12', '2025-02-10 09:50:12'),
(113, 2, '2025-02-10', 'job', 1, 'sent the draft for job code:', 'Admin Amit Amit sent the draft for job code: CUS_Cli_VAT2_00001', 'created', '122.168.114.106', '2025-02-10 09:55:36', '2025-02-10 09:55:36'),
(114, 2, '2025-02-10', 'job', 3, 'updated the job status from WIP - Customer Reviewed & To be Updated to Duplicate. job code:', 'Admin Amit Amit updated the job status from WIP - Customer Reviewed & To be Updated to Duplicate. job code: f4-_f4-_V3_00003', 'updated', '122.168.114.106', '2025-02-10 11:21:13', '2025-02-10 11:21:13'),
(115, 2, '2025-02-10', 'client', 6, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_f4-_AAA_00006(AAA)', 'created', '122.168.114.106', '2025-02-10 11:45:33', '2025-02-10 11:45:33'),
(116, 2, '2025-02-10', 'client', 7, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_f4-_UNA_00007(UNA)', 'created', '122.168.114.106', '2025-02-10 11:46:31', '2025-02-10 11:46:31'),
(117, 2, '2025-02-10', 'client', 8, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_f4-_TRU_00008(TRUST)', 'created', '122.168.114.106', '2025-02-10 11:47:41', '2025-02-10 11:47:41'),
(118, 10, '2025-02-10', '-', 0, ' Logged In', 'Manager STAFF FIVE  Logged In ', '-', NULL, '2025-02-10 11:50:20', '2025-02-10 11:50:20'),
(119, 11, '2025-02-10', '-', 0, ' Logged In', 'Manager STAFF SIX  Logged In ', '-', '122.168.114.106', '2025-02-10 11:51:00', '2025-02-10 11:51:00'),
(120, 11, '2025-02-10', '-', 0, ' Logged Out', 'Manager STAFF SIX  Logged Out ', '-', '122.168.114.106', '2025-02-10 12:02:19', '2025-02-10 12:02:19'),
(121, 7, '2025-02-10', '-', 0, ' Logged In', 'DEMO STAFF FOUR  Logged In ', '-', '122.168.114.106', '2025-02-10 12:02:28', '2025-02-10 12:02:29'),
(122, 2, '2025-02-10', 'job', 4, 'created job code:', 'Admin Amit Amit created job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-10 13:14:57', '2025-02-10 13:14:57'),
(123, 2, '2025-02-11', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-02-11 04:45:06', '2025-02-11 04:45:06'),
(124, 11, '2025-02-11', '-', 0, ' Logged In', 'Manager STAFF SIX  Logged In ', '-', NULL, '2025-02-11 04:52:40', '2025-02-11 04:52:40'),
(125, 10, '2025-02-11', '-', 0, ' Logged In', 'Manager STAFF FIVE  Logged In ', '-', '122.168.114.106', '2025-02-11 04:54:53', '2025-02-11 04:54:53'),
(126, 11, '2025-02-11', '-', 0, ' Logged Out', 'Manager STAFF SIX  Logged Out ', '-', NULL, '2025-02-11 04:55:25', '2025-02-11 04:55:25'),
(127, 7, '2025-02-11', '-', 0, ' Logged In', 'DEMO STAFF FOUR  Logged In ', '-', NULL, '2025-02-11 04:55:32', '2025-02-11 04:55:32'),
(128, 7, '2025-02-11', '-', 0, ' Logged Out', 'DEMO STAFF FOUR  Logged Out ', '-', '122.168.114.106', '2025-02-11 06:37:14', '2025-02-11 06:37:14'),
(129, 6, '2025-02-11', '-', 0, ' Logged In', 'Reviewer STAFF TWO  Logged In ', '-', '122.168.114.106', '2025-02-11 06:37:43', '2025-02-11 06:37:43'),
(130, 6, '2025-02-11', '-', 0, ' Logged In', 'Reviewer STAFF TWO  Logged In ', '-', NULL, '2025-02-11 13:31:13', '2025-02-11 13:31:13'),
(131, 2, '2025-02-12', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-02-12 06:06:40', '2025-02-12 06:06:40'),
(132, 6, '2025-02-12', '-', 0, ' Logged In', 'Reviewer STAFF TWO  Logged In ', '-', NULL, '2025-02-12 06:11:35', '2025-02-12 06:11:35'),
(133, 2, '2025-02-12', 'job', 4, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-12 06:50:09', '2025-02-12 06:50:09'),
(134, 6, '2025-02-12', 'timesheet', 0, 'submitted a timesheet entry. Task type:External,  Date: 2025-02-10, Hours : 01:00 Date: 2025-02-12, Hours : 02:00 ,Job code:CUS_Cli_VAT2_00001, Task name:a', 'Reviewer STAFF TWO submitted a timesheet entry. Task type:External,  Date: 2025-02-10, Hours : 01:00 Date: 2025-02-12, Hours : 02:00 ,Job code:CUS_Cli_VAT2_00001, Task name:a ', 'updated', '0.0.0.0', '2025-02-12 07:24:24', '2025-02-12 07:24:24'),
(135, 6, '2025-02-12', 'timesheet', 0, 'submitted a timesheet entry. Task type:External,  ,Job code:CUS_Cli_VAT2_00001, Task name:a', 'Reviewer STAFF TWO submitted a timesheet entry. Task type:External,  ,Job code:CUS_Cli_VAT2_00001, Task name:a ', 'updated', '0.0.0.0', '2025-02-12 07:24:35', '2025-02-12 07:24:35'),
(136, 6, '2025-02-12', 'timesheet', 0, 'submitted a timesheet entry. Task type:Internal,  Date: 2025-02-17, Hours : 01:00 ,Job code:abc, Task name:c', 'Reviewer STAFF TWO submitted a timesheet entry. Task type:Internal,  Date: 2025-02-17, Hours : 01:00 ,Job code:abc, Task name:c ', 'updated', '0.0.0.0', '2025-02-12 07:30:29', '2025-02-12 07:30:29'),
(137, 6, '2025-02-12', 'timesheet', 0, 'submitted a timesheet entry. Task type:External,  Date: 2025-02-24, Hours : 01:00 ,Job code:CUS_Cli_VAT2_00001, Task name:a', 'Reviewer STAFF TWO submitted a timesheet entry. Task type:External,  Date: 2025-02-24, Hours : 01:00 ,Job code:CUS_Cli_VAT2_00001, Task name:a ', 'updated', '0.0.0.0', '2025-02-12 08:22:00', '2025-02-12 08:22:00'),
(138, 7, '2025-02-12', '-', 0, ' Logged In', 'DEMO STAFF FOUR  Logged In ', '-', '122.168.114.106', '2025-02-12 09:08:11', '2025-02-12 09:08:11'),
(139, 2, '2025-02-12', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2025-02-12 10:05:28', '2025-02-12 10:05:28'),
(140, 7, '2025-02-12', '-', 0, ' Logged Out', 'DEMO STAFF FOUR  Logged Out ', '-', '122.168.114.106', '2025-02-12 10:06:16', '2025-02-12 10:06:16'),
(141, 7, '2025-02-12', '-', 0, ' Logged In', 'DEMO STAFF FOUR  Logged In ', '-', '122.168.114.106', '2025-02-12 10:06:18', '2025-02-12 10:06:18'),
(142, 6, '2025-02-12', '-', 0, ' Logged In', 'Reviewer STAFF TWO  Logged In ', '-', NULL, '2025-02-12 10:07:09', '2025-02-12 10:07:09'),
(143, 2, '2025-02-19', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-02-19 12:12:41', '2025-02-19 12:12:41'),
(144, 2, '2025-02-19', 'customer', 9, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'created', '122.168.114.106', '2025-02-19 12:32:09', '2025-02-19 12:32:09'),
(145, 2, '2025-02-19', 'customer', 9, ' edited the service details and added an additional service while editing the customer code :', 'Admin Amit Amit  edited the service details and added an additional service while editing the customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'updated', '122.168.114.106', '2025-02-19 12:32:13', '2025-02-19 12:32:13'),
(146, 2, '2025-02-19', 'customer', 9, 'edited the company information customer code :', 'Admin Amit Amit edited the company information customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'updated', '122.168.114.106', '2025-02-19 12:35:54', '2025-02-19 12:35:54'),
(147, 2, '2025-02-19', 'customer', 9, 'edited Percentage Model (engagement model) customer code :', 'Admin Amit Amit edited Percentage Model (engagement model) customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'updated', '122.168.114.106', '2025-02-19 12:58:20', '2025-02-19 12:58:20'),
(148, 2, '2025-02-19', 'customer', 9, 'edited Percentage Model (engagement model) customer code :', 'Admin Amit Amit edited Percentage Model (engagement model) customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'updated', '122.168.114.106', '2025-02-19 12:58:45', '2025-02-19 12:58:45'),
(149, 2, '2025-02-19', 'customer', 9, 'edited Percentage Model (engagement model) customer code :', 'Admin Amit Amit edited Percentage Model (engagement model) customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'updated', '122.168.114.106', '2025-02-19 13:10:16', '2025-02-19 13:10:16'),
(150, 2, '2025-02-19', 'customer', 9, 'edited Percentage Model (engagement model) customer code :', 'Admin Amit Amit edited Percentage Model (engagement model) customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'updated', '122.168.114.106', '2025-02-19 13:10:22', '2025-02-19 13:10:22'),
(151, 2, '2025-02-19', 'customer', 9, 'edited Percentage Model (engagement model) customer code :', 'Admin Amit Amit edited Percentage Model (engagement model) customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'updated', '122.168.114.106', '2025-02-19 13:10:55', '2025-02-19 13:10:55'),
(152, 2, '2025-02-19', 'customer', 9, 'edited Percentage Model (engagement model) customer code :', 'Admin Amit Amit edited Percentage Model (engagement model) customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'updated', '122.168.114.106', '2025-02-19 13:12:42', '2025-02-19 13:12:42'),
(153, 2, '2025-02-19', 'customer', 9, 'edited Percentage Model (engagement model) customer code :', 'Admin Amit Amit edited Percentage Model (engagement model) customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'updated', '122.168.114.106', '2025-02-19 13:14:46', '2025-02-19 13:14:46'),
(154, 2, '2025-02-19', 'customer', 9, 'edited Percentage Model (engagement model) customer code :', 'Admin Amit Amit edited Percentage Model (engagement model) customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'updated', '122.168.114.106', '2025-02-19 13:14:59', '2025-02-19 13:14:59'),
(155, 2, '2025-02-19', 'customer', 9, 'edited Percentage Model (engagement model) customer code :', 'Admin Amit Amit edited Percentage Model (engagement model) customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'updated', '122.168.114.106', '2025-02-19 13:16:23', '2025-02-19 13:16:23'),
(156, 2, '2025-02-19', 'customer', 9, 'edited Percentage Model (engagement model) customer code :', 'Admin Amit Amit edited Percentage Model (engagement model) customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'updated', '122.168.114.106', '2025-02-19 13:16:58', '2025-02-19 13:16:58'),
(157, 2, '2025-02-19', 'customer', 9, 'edited Percentage Model (engagement model) customer code :', 'Admin Amit Amit edited Percentage Model (engagement model) customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'updated', '122.168.114.106', '2025-02-19 13:17:14', '2025-02-19 13:17:14'),
(158, 2, '2025-02-19', 'customer', 9, 'edited Percentage Model (engagement model) customer code :', 'Admin Amit Amit edited Percentage Model (engagement model) customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'updated', '122.168.114.106', '2025-02-19 13:17:36', '2025-02-19 13:17:36'),
(159, 2, '2025-02-19', 'customer', 9, 'edited Percentage Model (engagement model) customer code :', 'Admin Amit Amit edited Percentage Model (engagement model) customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'updated', '122.168.114.106', '2025-02-19 13:18:09', '2025-02-19 13:18:09'),
(160, 2, '2025-02-19', 'customer', 9, 'edited Percentage Model (engagement model) customer code :', 'Admin Amit Amit edited Percentage Model (engagement model) customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'updated', '122.168.114.106', '2025-02-19 13:20:12', '2025-02-19 13:20:12'),
(161, 2, '2025-02-19', 'customer', 9, 'edited Percentage Model (engagement model) customer code :', 'Admin Amit Amit edited Percentage Model (engagement model) customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'updated', '122.168.114.106', '2025-02-19 13:21:49', '2025-02-19 13:21:49'),
(162, 2, '2025-02-19', 'customer', 9, 'edited Percentage Model (engagement model) customer code :', 'Admin Amit Amit edited Percentage Model (engagement model) customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'updated', '122.168.114.106', '2025-02-19 13:25:46', '2025-02-19 13:25:46'),
(163, 2, '2025-02-19', 'customer', 9, 'edited Percentage Model (engagement model) customer code :', 'Admin Amit Amit edited Percentage Model (engagement model) customer code : cust_F A_00007(F A B AUDIO VISUAL LIMITED_00007)', 'updated', '122.168.114.106', '2025-02-19 13:26:00', '2025-02-19 13:26:00'),
(164, 2, '2025-02-20', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-02-20 04:41:22', '2025-02-20 04:41:22'),
(165, 2, '2025-02-20', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2025-02-20 05:50:00', '2025-02-20 05:50:00'),
(166, 2, '2025-02-20', 'job', 4, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 06:19:40', '2025-02-20 06:19:40'),
(167, 2, '2025-02-20', 'job', 4, 'edited the missing logs job code:', 'Admin Amit Amit edited the missing logs job code: CUS_Cli_V4_00004', 'updated', '122.168.114.106', '2025-02-20 06:22:33', '2025-02-20 06:22:33'),
(168, 2, '2025-02-20', 'job', 4, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 06:35:19', '2025-02-20 06:35:19'),
(169, 2, '2025-02-20', 'job', 4, 'edited the missing logs job code:', 'Admin Amit Amit edited the missing logs job code: CUS_Cli_V4_00004', 'updated', '122.168.114.106', '2025-02-20 06:36:40', '2025-02-20 06:36:40'),
(170, 2, '2025-02-20', 'customer', 8, 'edited sole trader information. customer code :', 'Admin Amit Amit edited sole trader information. customer code : cust_f45_00006(f45cust)', 'updated', '122.168.114.106', '2025-02-20 06:49:02', '2025-02-20 06:49:02'),
(171, 2, '2025-02-20', 'job', 4, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 07:06:09', '2025-02-20 07:06:09'),
(172, 2, '2025-02-20', 'job', 4, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 07:17:53', '2025-02-20 07:17:53'),
(173, 2, '2025-02-20', 'job', 4, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 07:29:50', '2025-02-20 07:29:50'),
(174, 2, '2025-02-20', 'job', 4, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 07:31:31', '2025-02-20 07:31:31'),
(175, 2, '2025-02-20', 'customer', 8, 'edited Percentage Model (engagement model) customer code :', 'Admin Amit Amit edited Percentage Model (engagement model) customer code : cust_f45_00006(f45cust)', 'updated', '122.168.114.106', '2025-02-20 08:40:59', '2025-02-20 08:40:59'),
(176, 2, '2025-02-20', 'job', 4, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 08:45:01', '2025-02-20 08:45:01'),
(177, 2, '2025-02-20', 'job', 4, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 08:53:27', '2025-02-20 08:53:27'),
(178, 2, '2025-02-20', 'job', 4, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 08:53:54', '2025-02-20 08:53:54'),
(179, 2, '2025-02-20', 'job', 4, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 09:11:22', '2025-02-20 09:11:22'),
(180, 2, '2025-02-20', 'job', 4, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 09:14:26', '2025-02-20 09:14:26'),
(181, 2, '2025-02-20', 'job', 4, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 09:15:58', '2025-02-20 09:15:58'),
(182, 2, '2025-02-20', 'job', 4, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 09:17:00', '2025-02-20 09:17:00'),
(183, 2, '2025-02-20', 'job', 4, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 09:26:25', '2025-02-20 09:26:25'),
(184, 2, '2025-02-20', 'job', 4, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 09:27:12', '2025-02-20 09:27:12'),
(185, 2, '2025-02-20', 'job', 4, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 09:32:34', '2025-02-20 09:32:34'),
(186, 2, '2025-02-20', 'job', 4, 'sent the queries for job code:', 'Admin Amit Amit sent the queries for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 09:42:51', '2025-02-20 09:42:51'),
(187, 2, '2025-02-20', 'job', 4, 'sent the queries for job code:', 'Admin Amit Amit sent the queries for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 09:46:24', '2025-02-20 09:46:24'),
(188, 2, '2025-02-20', 'job', 4, 'sent the queries for job code:', 'Admin Amit Amit sent the queries for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 09:46:34', '2025-02-20 09:46:34'),
(189, 2, '2025-02-20', 'job', 4, 'sent the missing logs for job code:', 'Admin Amit Amit sent the missing logs for job code: CUS_Cli_V4_00004', 'created', '122.168.114.106', '2025-02-20 10:00:56', '2025-02-20 10:00:56'),
(190, 2, '2025-02-20', 'job', 4, 'edited the missing logs job code:', 'Admin Amit Amit edited the missing logs job code: CUS_Cli_V4_00004', 'updated', '122.168.114.106', '2025-02-20 10:37:37', '2025-02-20 10:37:37'),
(191, 2, '2025-02-20', 'job', 4, 'edited the queries job code:', 'Admin Amit Amit edited the queries job code: CUS_Cli_V4_00004', 'updated', '122.168.114.106', '2025-02-20 11:24:54', '2025-02-20 11:24:54'),
(192, 2, '2025-02-20', 'role', 10, 'created role DEMO1', 'Admin Amit Amit created role DEMO1 ', 'created', '122.168.114.106', '2025-02-20 11:49:19', '2025-02-20 11:49:19'),
(193, 2, '2025-03-26', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-03-26 09:44:36', '2025-03-26 09:44:36'),
(194, 2, '2025-03-26', 'customer', 10, 'created customer profile. customer code :', 'Admin Amit Amit created customer profile. customer code : cust_HEA_00008(HEAVEN RETAIL LIMITED_00008)', 'created', '103.103.213.217', '2025-03-26 09:55:47', '2025-03-26 09:55:47'),
(195, 2, '2025-03-26', 'client', 9, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_f45_G T_00009(G T SCARLET LIMITED_00009)', 'created', '103.103.213.217', '2025-03-26 10:10:13', '2025-03-26 10:10:13'),
(196, 2, '2025-03-27', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-03-27 05:52:43', '2025-03-27 05:52:43'),
(197, 2, '2025-03-27', 'client', 10, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_f45_sss_000010(sss)', 'created', '103.103.213.217', '2025-03-27 06:18:25', '2025-03-27 06:18:25'),
(198, 2, '2025-03-27', 'client', 11, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_f45_ddd_000011(ddddd)', 'created', '103.103.213.217', '2025-03-27 06:55:28', '2025-03-27 06:55:28'),
(199, 2, '2025-03-28', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '103.103.213.217', '2025-03-28 06:47:08', '2025-03-28 06:47:08'),
(200, 2, '2025-03-29', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-03-29 05:13:34', '2025-03-29 05:13:34'),
(201, 2, '2025-03-29', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (staff-insert, staff-update, staff-delete, staff-view) ', 'Admin Amit Amit  updated the access for ADMIN. Access Changes Add Permission (staff-insert, staff-update, staff-delete, staff-view)  ', 'updated', '122.168.114.106', '2025-03-29 05:15:44', '2025-03-29 05:15:44'),
(202, 2, '2025-03-29', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (customer-insert, customer-update, customer-delete, customer-view, status-insert, status-update, status-delete, status-view, client-insert, client-update, client-delete, client-view, job-insert, job-update, job-delete, job-view, setting-insert, setting-update, setting-delete, setting-view, report-insert, report-update, report-delete, report-view, timesheet-insert, timesheet-update, timesheet-delete, timesheet-view) ', 'Admin Amit Amit  updated the access for ADMIN. Access Changes Add Permission (customer-insert, customer-update, customer-delete, customer-view, status-insert, status-update, status-delete, status-view, client-insert, client-update, client-delete, client-view, job-insert, job-update, job-delete, job-view, setting-insert, setting-update, setting-delete, setting-view, report-insert, report-update, report-delete, report-view, timesheet-insert, timesheet-update, timesheet-delete, timesheet-view)  ', 'updated', '122.168.114.106', '2025-03-29 05:16:19', '2025-03-29 05:16:19'),
(203, 6, '2025-03-29', '-', 0, ' Logged In', 'Reviewer STAFF TWO  Logged In ', '-', NULL, '2025-03-29 05:18:24', '2025-03-29 05:18:24'),
(204, 2, '2025-04-02', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-04-02 05:41:53', '2025-04-02 05:41:53'),
(205, 2, '2025-04-02', 'client', 12, 'created client profile. client code :', 'Admin Amit Amit created client profile. client code : cli_CUS_sss_000012(sssssssssss)', 'created', '122.168.114.106', '2025-04-02 06:13:37', '2025-04-02 06:13:37'),
(206, 2, '2025-04-02', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2025-04-02 06:22:33', '2025-04-02 06:22:33'),
(207, 2, '2025-04-02', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2025-04-02 06:22:33', '2025-04-02 06:22:33'),
(208, 1, '2025-04-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-04-02 07:13:21', '2025-04-02 07:13:21'),
(209, 1, '2025-04-02', 'client', 13, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_CUS_fgf_000013(fgff)', 'created', '122.168.114.106', '2025-04-02 07:13:52', '2025-04-02 07:13:52'),
(210, 1, '2025-04-02', 'job', 5, 'created job code:', 'Super Admin System Super Super Admin created job code: DDD_Cli_V3_00005', 'created', '122.168.114.106', '2025-04-02 08:35:25', '2025-04-02 08:35:25'),
(211, 1, '2025-04-02', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-04-02 08:50:31', '2025-04-02 08:50:31'),
(212, 1, '2025-04-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-04-02 08:50:38', '2025-04-02 08:50:38'),
(213, 1, '2025-04-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-04-02 11:56:48', '2025-04-02 11:56:48'),
(214, 1, '2025-04-02', 'client', 14, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_CUS_SFD_000014(SFD)', 'created', '122.168.114.106', '2025-04-02 12:21:40', '2025-04-02 12:21:40'),
(215, 1, '2025-04-02', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', NULL, '2025-04-02 12:35:17', '2025-04-02 12:35:17'),
(216, 10, '2025-04-02', '-', 0, ' Logged In', 'Manager STAFF FIVE  Logged In ', '-', NULL, '2025-04-02 13:23:45', '2025-04-02 13:23:45'),
(217, 1, '2025-04-03', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-04-03 04:50:09', '2025-04-03 04:50:09'),
(218, 10, '2025-04-03', '-', 0, ' Logged In', 'Manager STAFF FIVE  Logged In ', '-', '122.168.114.106', '2025-04-03 04:50:46', '2025-04-03 04:50:46'),
(219, 10, '2025-04-03', 'customer', 11, 'created customer profile. customer code :', 'Manager STAFF FIVE created customer profile. customer code : cust_ads_00009(ads)', 'created', '122.168.114.106', '2025-04-03 04:55:52', '2025-04-03 04:55:52'),
(220, 10, '2025-04-03', 'customer', 11, ' edited the service details and added an additional service while editing the customer code :', 'Manager STAFF FIVE  edited the service details and added an additional service while editing the customer code : cust_ads_00009(ads)', 'updated', '122.168.114.106', '2025-04-03 04:57:07', '2025-04-03 04:57:07'),
(221, 1, '2025-04-03', 'customer contact person role', 1, 'created customer contact person role RoleName1', 'Super Admin System Super Super Admin created customer contact person role RoleName1 ', 'created', '122.168.114.106', '2025-04-03 05:06:14', '2025-04-03 05:06:14'),
(222, 1, '2025-04-03', 'customer contact person role', 2, 'created customer contact person role RoleName2', 'Super Admin System Super Super Admin created customer contact person role RoleName2 ', 'created', '122.168.114.106', '2025-04-03 05:06:22', '2025-04-03 05:06:22'),
(223, 1, '2025-04-03', 'customer', 12, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_S L_000010(S LIMITED_000010)', 'created', '122.168.114.106', '2025-04-03 05:51:23', '2025-04-03 05:51:23'),
(224, 1, '2025-04-03', 'customer', 12, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_S L_000010(S LIMITED_000010)', 'updated', '122.168.114.106', '2025-04-03 05:51:29', '2025-04-03 05:51:29');
INSERT INTO `staff_logs` (`id`, `staff_id`, `date`, `module_name`, `module_id`, `log_message`, `log_message_all`, `permission_type`, `ip`, `created_at`, `updated_at`) VALUES
(225, 1, '2025-04-03', 'customer', 13, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_DDD_000011(DDDDaxaxaax)', 'created', '122.168.114.106', '2025-04-03 06:00:40', '2025-04-03 06:00:40'),
(226, 1, '2025-04-03', 'customer', 13, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_DDD_000011(DDDDaxaxaax)', 'updated', '122.168.114.106', '2025-04-03 06:00:42', '2025-04-03 06:00:42'),
(227, 1, '2025-04-03', 'client', 13, 'deleted customer. customer code :', 'Super Admin System Super Super Admin deleted customer. customer code : cli_CUS_fgf_000013(fgff)', 'deleted', '122.168.114.106', '2025-04-03 06:04:56', '2025-04-03 06:04:56'),
(228, 1, '2025-04-03', 'client', 12, 'deleted customer. customer code :', 'Super Admin System Super Super Admin deleted customer. customer code : cli_CUS_sss_000012(sssssssssss)', 'deleted', '122.168.114.106', '2025-04-03 06:05:00', '2025-04-03 06:05:00'),
(229, 1, '2025-04-03', 'client', 11, 'deleted customer. customer code :', 'Super Admin System Super Super Admin deleted customer. customer code : cli_f45_ddd_000011(ddddd)', 'deleted', '122.168.114.106', '2025-04-03 06:05:03', '2025-04-03 06:05:03'),
(230, 1, '2025-04-03', 'client', 10, 'deleted customer. customer code :', 'Super Admin System Super Super Admin deleted customer. customer code : cli_f45_sss_000010(sss)', 'deleted', '122.168.114.106', '2025-04-03 06:05:06', '2025-04-03 06:05:06'),
(231, 1, '2025-04-03', 'client', 9, 'deleted customer. customer code :', 'Super Admin System Super Super Admin deleted customer. customer code : cli_f45_G T_00009(G T SCARLET LIMITED_00009)', 'deleted', '122.168.114.106', '2025-04-03 06:05:09', '2025-04-03 06:05:09'),
(232, 1, '2025-04-03', 'customer', 14, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_DFG_00007(DFGGG)', 'created', '122.168.114.106', '2025-04-03 06:06:07', '2025-04-03 06:06:07'),
(233, 1, '2025-04-03', 'customer', 14, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_DFG_00007(DFGGG)', 'updated', '122.168.114.106', '2025-04-03 06:06:10', '2025-04-03 06:06:10'),
(234, 1, '2025-04-03', 'client', 14, 'deleted customer. customer code :', 'Super Admin System Super Super Admin deleted customer. customer code : cli_CUS_SFD_000014(SFD)', 'deleted', '122.168.114.106', '2025-04-03 07:26:29', '2025-04-03 07:26:29'),
(235, 1, '2025-04-03', 'customer', 15, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_Ada_00007(Adad)', 'created', '122.168.114.106', '2025-04-03 07:27:38', '2025-04-03 07:27:38'),
(236, 1, '2025-04-03', 'customer', 15, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_Ada_00007(Adad)', 'updated', '122.168.114.106', '2025-04-03 07:27:41', '2025-04-03 07:27:41'),
(237, 1, '2025-04-03', 'customer', 16, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_aaa_00008(aaaaaa)', 'created', '122.168.114.106', '2025-04-03 08:24:59', '2025-04-03 08:24:59'),
(238, 1, '2025-04-03', 'customer', 16, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_aaa_00008(aaaaaa)', 'updated', '122.168.114.106', '2025-04-03 08:25:03', '2025-04-03 08:25:03'),
(239, 1, '2025-04-03', 'customer', 17, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_sds_00009(sds)', 'created', '122.168.114.106', '2025-04-03 08:31:15', '2025-04-03 08:31:15'),
(240, 1, '2025-04-03', 'customer', 17, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_sds_00009(sds)', 'updated', '122.168.114.106', '2025-04-03 08:31:20', '2025-04-03 08:31:20'),
(241, 10, '2025-04-03', 'customer', 18, 'created customer profile. customer code :', 'Manager STAFF FIVE created customer profile. customer code : cust_fh_000010(fh)', 'created', '122.168.114.106', '2025-04-03 08:39:08', '2025-04-03 08:39:08'),
(242, 10, '2025-04-03', 'customer', 18, ' edited the service details and added an additional service while editing the customer code :', 'Manager STAFF FIVE  edited the service details and added an additional service while editing the customer code : cust_fh_000010(fh)', 'updated', '122.168.114.106', '2025-04-03 08:39:11', '2025-04-03 08:39:11'),
(243, 1, '2025-04-03', 'customer', 19, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_SHK_000011(SHKKK)', 'created', '122.168.114.106', '2025-04-03 10:29:53', '2025-04-03 10:29:53'),
(244, 1, '2025-04-03', 'customer', 19, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_SHK_000011(SHKKK)', 'updated', '122.168.114.106', '2025-04-03 10:29:55', '2025-04-03 10:29:55'),
(245, 1, '2025-04-03', 'client', 15, 'created client profile. client code :', 'Super Admin System Super Super Admin created client profile. client code : cli_SHK_AA_000015(AA)', 'created', '122.168.114.106', '2025-04-03 10:30:20', '2025-04-03 10:30:20'),
(246, 1, '2025-04-03', 'customer', 19, 'added Percentage Model and Removed FTE/Dedicated Staffing (engagement model) customer code :', 'Super Admin System Super Super Admin added Percentage Model and Removed FTE/Dedicated Staffing (engagement model) customer code : cust_SHK_000011(SHKKK)', 'updated', '122.168.114.106', '2025-04-03 10:48:40', '2025-04-03 10:48:40'),
(247, 1, '2025-04-03', 'job', 6, 'created job code:', 'Super Admin System Super Super Admin created job code: CUS_Cli_VAT2_00006', 'created', '122.168.114.106', '2025-04-03 10:52:43', '2025-04-03 10:52:43'),
(248, 1, '2025-04-03', 'customer', 20, 'created customer profile. customer code :', 'Super Admin System Super Super Admin created customer profile. customer code : cust_asa_000012(asad)', 'created', '122.168.114.106', '2025-04-03 10:57:27', '2025-04-03 10:57:27'),
(249, 1, '2025-04-03', 'customer', 20, ' edited the service details and added an additional service while editing the customer code :', 'Super Admin System Super Super Admin  edited the service details and added an additional service while editing the customer code : cust_asa_000012(asad)', 'updated', '122.168.114.106', '2025-04-03 10:57:30', '2025-04-03 10:57:30'),
(250, 1, '2025-04-03', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-04-03 11:14:41', '2025-04-03 11:14:41'),
(251, 2, '2025-04-03', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-04-03 11:14:57', '2025-04-03 11:14:57'),
(252, 10, '2025-04-03', '-', 0, ' Logged Out', 'Manager STAFF FIVE  Logged Out ', '-', '122.168.114.106', '2025-04-03 11:15:18', '2025-04-03 11:15:18'),
(253, 1, '2025-04-03', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-04-03 11:15:39', '2025-04-03 11:15:39'),
(254, 1, '2025-04-03', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (status-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (status-view) ', 'updated', '122.168.114.106', '2025-04-03 11:17:02', '2025-04-03 11:17:02'),
(255, 1, '2025-04-03', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (status-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (status-view)  ', 'updated', '122.168.114.106', '2025-04-03 11:17:16', '2025-04-03 11:17:16'),
(256, 1, '2025-04-03', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (timesheet-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (timesheet-view) ', 'updated', '122.168.114.106', '2025-04-03 11:41:07', '2025-04-03 11:41:07'),
(257, 1, '2025-04-03', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (timesheet-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (timesheet-view)  ', 'updated', '122.168.114.106', '2025-04-03 11:41:39', '2025-04-03 11:41:39'),
(258, 1, '2025-04-03', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (All Customer-insert) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (All Customer-insert)  ', 'updated', '122.168.114.106', '2025-04-03 11:47:39', '2025-04-03 11:47:39'),
(259, 1, '2025-04-03', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (status-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (status-view) ', 'updated', '122.168.114.106', '2025-04-03 12:58:37', '2025-04-03 12:58:37'),
(260, 1, '2025-04-03', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (status-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (status-view)  ', 'updated', '122.168.114.106', '2025-04-03 12:59:11', '2025-04-03 12:59:11'),
(261, 2, '2025-04-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2025-04-04 04:55:20', '2025-04-04 04:55:21'),
(262, 2, '2025-04-04', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-04-04 04:55:39', '2025-04-04 04:55:39'),
(263, 1, '2025-04-04', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-04-04 04:56:06', '2025-04-04 04:56:06'),
(264, 2, '2025-04-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', NULL, '2025-04-04 05:18:41', '2025-04-04 05:18:41'),
(265, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (customer-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (customer-view) ', 'updated', '122.168.114.106', '2025-04-04 05:46:35', '2025-04-04 05:46:35'),
(266, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (customer-view) Remove Permission (staff-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (customer-view) Remove Permission (staff-view) ', 'updated', '122.168.114.106', '2025-04-04 05:47:02', '2025-04-04 05:47:02'),
(267, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (staff-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (staff-view)  ', 'updated', '122.168.114.106', '2025-04-04 05:47:16', '2025-04-04 05:47:16'),
(268, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (report-view, customer-view, status-view, staff-view, client-view, job-view, setting-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (report-view, customer-view, status-view, staff-view, client-view, job-view, setting-view) ', 'updated', '122.168.114.106', '2025-04-04 05:47:41', '2025-04-04 05:47:41'),
(269, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (all customers-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (all customers-view)  ', 'updated', '122.168.114.106', '2025-04-04 06:12:19', '2025-04-04 06:12:19'),
(270, 2, '2025-04-04', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-04-04 06:23:37', '2025-04-04 06:23:37'),
(271, 2, '2025-04-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-04-04 06:23:47', '2025-04-04 06:23:47'),
(272, 2, '2025-04-04', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-04-04 06:25:02', '2025-04-04 06:25:02'),
(273, 2, '2025-04-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-04-04 06:25:12', '2025-04-04 06:25:12'),
(274, 2, '2025-04-04', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-04-04 06:26:08', '2025-04-04 06:26:08'),
(275, 2, '2025-04-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-04-04 06:26:14', '2025-04-04 06:26:14'),
(276, 2, '2025-04-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-04-04 06:26:45', '2025-04-04 06:26:45'),
(277, 1, '2025-04-04', '-', 0, ' Logged Out', 'Super Admin System Super Super Admin  Logged Out ', '-', '122.168.114.106', '2025-04-04 06:31:32', '2025-04-04 06:31:32'),
(278, 1, '2025-04-04', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-04-04 06:31:33', '2025-04-04 06:31:33'),
(279, 2, '2025-04-04', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-04-04 06:33:33', '2025-04-04 06:33:33'),
(280, 2, '2025-04-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-04-04 06:34:06', '2025-04-04 06:34:06'),
(281, 2, '2025-04-04', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-04-04 06:35:51', '2025-04-04 06:35:51'),
(282, 2, '2025-04-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-04-04 06:35:58', '2025-04-04 06:35:58'),
(283, 2, '2025-04-04', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-04-04 06:36:33', '2025-04-04 06:36:33'),
(284, 2, '2025-04-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-04-04 06:36:40', '2025-04-04 06:36:40'),
(285, 2, '2025-04-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-04-04 06:37:43', '2025-04-04 06:37:43'),
(286, 2, '2025-04-04', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-04-04 06:37:54', '2025-04-04 06:37:54'),
(287, 2, '2025-04-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-04-04 06:39:08', '2025-04-04 06:39:08'),
(288, 2, '2025-04-04', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-04-04 06:39:23', '2025-04-04 06:39:23'),
(289, 2, '2025-04-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-04-04 06:39:31', '2025-04-04 06:39:31'),
(290, 2, '2025-04-04', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-04-04 06:39:36', '2025-04-04 06:39:36'),
(291, 2, '2025-04-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-04-04 06:39:48', '2025-04-04 06:39:48'),
(292, 2, '2025-04-04', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-04-04 06:45:03', '2025-04-04 06:45:03'),
(293, 2, '2025-04-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-04-04 06:45:11', '2025-04-04 06:45:11'),
(294, 2, '2025-04-04', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-04-04 06:48:05', '2025-04-04 06:48:05'),
(295, 2, '2025-04-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-04-04 06:48:12', '2025-04-04 06:48:12'),
(296, 2, '2025-04-04', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-04-04 06:49:46', '2025-04-04 06:49:46'),
(297, 2, '2025-04-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-04-04 06:49:53', '2025-04-04 06:49:53'),
(298, 2, '2025-04-04', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-04-04 06:50:24', '2025-04-04 06:50:24'),
(299, 2, '2025-04-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-04-04 06:50:29', '2025-04-04 06:50:29'),
(300, 2, '2025-04-04', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-04-04 06:58:55', '2025-04-04 06:58:55'),
(301, 2, '2025-04-04', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-04-04 06:59:00', '2025-04-04 06:59:00'),
(302, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (all_customers-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (all_customers-view) ', 'updated', '122.168.114.106', '2025-04-04 07:01:41', '2025-04-04 07:01:41'),
(303, 1, '2025-04-04', 'permission', 3, ' updated the access for PROCESSOR. Access Changes  Remove Permission (all_jobs-view, all_customers-view, all_clients-view)', 'Super Admin System Super Super Admin  updated the access for PROCESSOR. Access Changes  Remove Permission (all_jobs-view, all_customers-view, all_clients-view) ', 'updated', '122.168.114.106', '2025-04-04 07:03:18', '2025-04-04 07:03:18'),
(304, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (all_jobs-view, all_clients-view, all_customers-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (all_jobs-view, all_clients-view, all_customers-view)  ', 'updated', '122.168.114.106', '2025-04-04 07:03:29', '2025-04-04 07:03:29'),
(305, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (all_jobs-view, all_clients-view, all_customers-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (all_jobs-view, all_clients-view, all_customers-view) ', 'updated', '122.168.114.106', '2025-04-04 07:03:49', '2025-04-04 07:03:49'),
(306, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (timesheet-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (timesheet-view) ', 'updated', '122.168.114.106', '2025-04-04 07:08:33', '2025-04-04 07:08:33'),
(307, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (report-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (report-view)  ', 'updated', '122.168.114.106', '2025-04-04 07:08:44', '2025-04-04 07:08:44'),
(308, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (report-view, customer-view, status-view, staff-view, client-view, job-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (report-view, customer-view, status-view, staff-view, client-view, job-view) ', 'updated', '122.168.114.106', '2025-04-04 07:09:33', '2025-04-04 07:09:33'),
(309, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (customer-insert)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (customer-insert) ', 'updated', '122.168.114.106', '2025-04-04 09:28:32', '2025-04-04 09:28:32'),
(310, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (customer-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (customer-view)  ', 'updated', '122.168.114.106', '2025-04-04 09:35:52', '2025-04-04 09:35:52'),
(311, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (customer-insert) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (customer-insert)  ', 'updated', '122.168.114.106', '2025-04-04 09:36:03', '2025-04-04 09:36:03'),
(312, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (staff-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (staff-view)  ', 'updated', '122.168.114.106', '2025-04-04 09:37:20', '2025-04-04 09:37:20'),
(313, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (client-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (client-view)  ', 'updated', '122.168.114.106', '2025-04-04 09:43:11', '2025-04-04 09:43:11'),
(314, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (customer-view, customer-insert)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (customer-view, customer-insert) ', 'updated', '122.168.114.106', '2025-04-04 09:43:40', '2025-04-04 09:43:40'),
(315, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (customer-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (customer-view)  ', 'updated', '122.168.114.106', '2025-04-04 09:56:41', '2025-04-04 09:56:41'),
(316, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (customer-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (customer-view) ', 'updated', '122.168.114.106', '2025-04-04 10:07:43', '2025-04-04 10:07:43'),
(317, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (customer-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (customer-view)  ', 'updated', '122.168.114.106', '2025-04-04 10:09:13', '2025-04-04 10:09:13'),
(318, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (customer-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (customer-view) ', 'updated', '122.168.114.106', '2025-04-04 10:15:44', '2025-04-04 10:15:44'),
(319, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (customer-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (customer-view) ', 'updated', '122.168.114.106', '2025-04-04 10:15:45', '2025-04-04 10:15:45'),
(320, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (all_customers-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (all_customers-view)  ', 'updated', '122.168.114.106', '2025-04-04 10:15:59', '2025-04-04 10:15:59'),
(321, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (all_jobs-view, all_clients-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (all_jobs-view, all_clients-view)  ', 'updated', '122.168.114.106', '2025-04-04 10:34:43', '2025-04-04 10:34:43'),
(322, 1, '2025-04-04', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (staff-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (staff-view) ', 'updated', '122.168.114.106', '2025-04-04 10:36:29', '2025-04-04 10:36:29'),
(323, 1, '2025-04-05', '-', 0, ' Logged In', 'Super Admin System Super Super Admin  Logged In ', '-', '122.168.114.106', '2025-04-05 05:02:24', '2025-04-05 05:02:24'),
(324, 2, '2025-04-05', '-', 0, ' Logged In', 'Admin Amit Amit  Logged In ', '-', '122.168.114.106', '2025-04-05 05:12:00', '2025-04-05 05:12:00'),
(325, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (all_customers-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (all_customers-view) ', 'updated', '122.168.114.106', '2025-04-05 05:15:00', '2025-04-05 05:15:00'),
(326, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (all_jobs-view, all_clients-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (all_jobs-view, all_clients-view) ', 'updated', '122.168.114.106', '2025-04-05 05:57:09', '2025-04-05 05:57:09'),
(327, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (staff-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (staff-view)  ', 'updated', '122.168.114.106', '2025-04-05 06:04:34', '2025-04-05 06:04:34'),
(328, 2, '2025-04-05', 'job', 6, 'completed the draft for job code:', 'Admin Amit Amit completed the draft for job code: CUS_Cli_VAT2_00006', 'created', '122.168.114.106', '2025-04-05 06:05:17', '2025-04-05 06:05:17'),
(329, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (customer-view, status-view, job-view, setting-view, customer-insert, all_customers-view, all_clients-view, all_jobs-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (customer-view, status-view, job-view, setting-view, customer-insert, all_customers-view, all_clients-view, all_jobs-view)  ', 'updated', '122.168.114.106', '2025-04-05 06:13:37', '2025-04-05 06:13:37'),
(330, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (customer-insert)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (customer-insert) ', 'updated', '122.168.114.106', '2025-04-05 06:14:13', '2025-04-05 06:14:13'),
(331, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (customer-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (customer-view) ', 'updated', '122.168.114.106', '2025-04-05 06:15:56', '2025-04-05 06:15:56'),
(332, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (all_customers-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (all_customers-view) ', 'updated', '122.168.114.106', '2025-04-05 06:16:15', '2025-04-05 06:16:15'),
(333, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (all_customers-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (all_customers-view)  ', 'updated', '122.168.114.106', '2025-04-05 06:16:32', '2025-04-05 06:16:32'),
(334, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (client-view, client-insert)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (client-view, client-insert) ', 'updated', '122.168.114.106', '2025-04-05 06:16:53', '2025-04-05 06:16:53'),
(335, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (all_jobs-view, all_customers-view, all_clients-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (all_jobs-view, all_customers-view, all_clients-view) ', 'updated', '122.168.114.106', '2025-04-05 06:23:48', '2025-04-05 06:23:48'),
(336, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (job-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (job-view) ', 'updated', '122.168.114.106', '2025-04-05 06:24:04', '2025-04-05 06:24:04'),
(337, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (all_jobs-view, all_clients-view, all_customers-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (all_jobs-view, all_clients-view, all_customers-view)  ', 'updated', '122.168.114.106', '2025-04-05 06:24:20', '2025-04-05 06:24:20'),
(338, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (all_jobs-view, all_clients-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (all_jobs-view, all_clients-view) ', 'updated', '122.168.114.106', '2025-04-05 06:28:44', '2025-04-05 06:28:44'),
(339, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (all_jobs-view, all_clients-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (all_jobs-view, all_clients-view)  ', 'updated', '122.168.114.106', '2025-04-05 06:28:52', '2025-04-05 06:28:52'),
(340, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (all_jobs-view, all_clients-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (all_jobs-view, all_clients-view) ', 'updated', '122.168.114.106', '2025-04-05 06:45:51', '2025-04-05 06:45:51'),
(341, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (all_clients-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (all_clients-view)  ', 'updated', '122.168.114.106', '2025-04-05 06:46:16', '2025-04-05 06:46:16'),
(342, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (all_jobs-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (all_jobs-view)  ', 'updated', '122.168.114.106', '2025-04-05 06:46:32', '2025-04-05 06:46:32'),
(343, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (all_jobs-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (all_jobs-view) ', 'updated', '122.168.114.106', '2025-04-05 06:48:52', '2025-04-05 06:48:52'),
(344, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (all_jobs-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (all_jobs-view)  ', 'updated', '122.168.114.106', '2025-04-05 06:49:37', '2025-04-05 06:49:37'),
(345, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (job-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (job-view)  ', 'updated', '122.168.114.106', '2025-04-05 06:53:48', '2025-04-05 06:53:48'),
(346, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (job-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (job-view) ', 'updated', '122.168.114.106', '2025-04-05 06:54:12', '2025-04-05 06:54:12'),
(347, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (all_jobs-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (all_jobs-view) ', 'updated', '122.168.114.106', '2025-04-05 06:54:25', '2025-04-05 06:54:25'),
(348, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (all_jobs-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (all_jobs-view)  ', 'updated', '122.168.114.106', '2025-04-05 06:57:22', '2025-04-05 06:57:22'),
(349, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (job-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (job-view)  ', 'updated', '122.168.114.106', '2025-04-05 06:58:44', '2025-04-05 06:58:44'),
(350, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (job-view)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (job-view) ', 'updated', '122.168.114.106', '2025-04-05 06:59:26', '2025-04-05 06:59:26'),
(351, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes  Remove Permission (job-insert)', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes  Remove Permission (job-insert) ', 'updated', '122.168.114.106', '2025-04-05 06:59:41', '2025-04-05 06:59:41'),
(352, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (job-insert) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (job-insert)  ', 'updated', '122.168.114.106', '2025-04-05 06:59:52', '2025-04-05 06:59:52'),
(353, 2, '2025-04-05', '-', 0, ' Logged Out', 'Admin Amit Amit  Logged Out ', '-', '122.168.114.106', '2025-04-05 07:11:52', '2025-04-05 07:11:52'),
(354, 6, '2025-04-05', '-', 0, ' Logged In', 'Reviewer STAFF TWO  Logged In ', '-', '122.168.114.106', '2025-04-05 07:12:31', '2025-04-05 07:12:31'),
(355, 6, '2025-04-05', '-', 0, ' Logged Out', 'Reviewer STAFF TWO  Logged Out ', '-', '122.168.114.106', '2025-04-05 07:12:40', '2025-04-05 07:12:40'),
(356, 6, '2025-04-05', '-', 0, ' Logged In', 'Reviewer STAFF TWO  Logged In ', '-', '122.168.114.106', '2025-04-05 07:16:39', '2025-04-05 07:16:39'),
(357, 6, '2025-04-05', '-', 0, ' Logged Out', 'Reviewer STAFF TWO  Logged Out ', '-', '122.168.114.106', '2025-04-05 07:26:42', '2025-04-05 07:26:42'),
(358, 6, '2025-04-05', '-', 0, ' Logged In', 'Reviewer STAFF TWO  Logged In ', '-', '122.168.114.106', '2025-04-05 07:26:54', '2025-04-05 07:26:54'),
(359, 1, '2025-04-05', 'permission', 9, ' updated the access for DEMO. Access Changes Add Permission (all_customers-view) ', 'Super Admin System Super Super Admin  updated the access for DEMO. Access Changes Add Permission (all_customers-view)  ', 'updated', '122.168.114.106', '2025-04-05 07:30:25', '2025-04-05 07:30:25'),
(360, 1, '2025-04-05', 'permission', 6, ' updated the access for REVIEWER. Access Changes  Remove Permission (all_customers-view)', 'Super Admin System Super Super Admin  updated the access for REVIEWER. Access Changes  Remove Permission (all_customers-view) ', 'updated', '122.168.114.106', '2025-04-05 08:40:54', '2025-04-05 08:40:54'),
(361, 1, '2025-04-05', 'permission', 2, ' updated the access for ADMIN. Access Changes Add Permission (all_customers-view) ', 'Super Admin System Super Super Admin  updated the access for ADMIN. Access Changes Add Permission (all_customers-view)  ', 'updated', '122.168.114.106', '2025-04-05 08:41:58', '2025-04-05 08:41:58'),
(362, 1, '2025-04-05', 'permission', 6, ' updated the access for REVIEWER. Access Changes Add Permission (all_clients-view) ', 'Super Admin System Super Super Admin  updated the access for REVIEWER. Access Changes Add Permission (all_clients-view)  ', 'updated', '122.168.114.106', '2025-04-05 08:57:04', '2025-04-05 08:57:04'),
(363, 1, '2025-04-05', 'permission', 6, ' updated the access for REVIEWER. Access Changes  Remove Permission (all_clients-view, all_customers-view)', 'Super Admin System Super Super Admin  updated the access for REVIEWER. Access Changes  Remove Permission (all_clients-view, all_customers-view) ', 'updated', '122.168.114.106', '2025-04-05 09:09:36', '2025-04-05 09:09:36'),
(364, 1, '2025-04-05', 'permission', 6, ' updated the access for REVIEWER. Access Changes Add Permission (all_jobs-view, all_clients-view, all_customers-view) ', 'Super Admin System Super Super Admin  updated the access for REVIEWER. Access Changes Add Permission (all_jobs-view, all_clients-view, all_customers-view)  ', 'updated', '122.168.114.106', '2025-04-05 09:17:47', '2025-04-05 09:17:47'),
(365, 1, '2025-04-05', 'permission', 6, ' updated the access for REVIEWER. Access Changes  Remove Permission (all_jobs-view)', 'Super Admin System Super Super Admin  updated the access for REVIEWER. Access Changes  Remove Permission (all_jobs-view) ', 'updated', '122.168.114.106', '2025-04-05 09:18:08', '2025-04-05 09:18:08'),
(366, 1, '2025-04-05', 'permission', 6, ' updated the access for REVIEWER. Access Changes  Remove Permission (all_clients-view, all_customers-view)', 'Super Admin System Super Super Admin  updated the access for REVIEWER. Access Changes  Remove Permission (all_clients-view, all_customers-view) ', 'updated', '122.168.114.106', '2025-04-05 09:19:57', '2025-04-05 09:19:57'),
(367, 7, '2025-04-05', '-', 0, ' Logged In', 'DEMO STAFF FOUR  Logged In ', '-', NULL, '2025-04-05 09:21:54', '2025-04-05 09:21:54'),
(368, 1, '2025-04-05', 'staff', 7, 'edited staff STAFF FOUR', 'Super Admin System Super Super Admin edited staff STAFF FOUR ', 'updated', '122.168.114.106', '2025-04-05 09:26:10', '2025-04-05 09:26:10'),
(369, 1, '2025-04-05', 'staff', 7, 'changes the staff status Deactivate STAFF FOUR', 'Super Admin System Super Super Admin changes the staff status Deactivate STAFF FOUR ', 'updated', '122.168.114.106', '2025-04-05 09:33:50', '2025-04-05 09:33:50'),
(370, 1, '2025-04-05', 'staff', 7, 'changes the staff status Activate STAFF FOUR', 'Super Admin System Super Super Admin changes the staff status Activate STAFF FOUR ', 'updated', '122.168.114.106', '2025-04-05 09:34:11', '2025-04-05 09:34:11'),
(371, 1, '2025-04-05', 'permission', 9, ' updated the access for DEMO. Access Changes Add Permission (all_jobs-view, all_clients-view, all_customers-view) ', 'Super Admin System Super Super Admin  updated the access for DEMO. Access Changes Add Permission (all_jobs-view, all_clients-view, all_customers-view)  ', 'updated', '122.168.114.106', '2025-04-05 10:16:59', '2025-04-05 10:16:59'),
(372, 1, '2025-04-05', 'permission', 6, ' updated the access for REVIEWER. Access Changes  Remove Permission (all_jobs-view, all_clients-view, all_customers-view)', 'Super Admin System Super Super Admin  updated the access for REVIEWER. Access Changes  Remove Permission (all_jobs-view, all_clients-view, all_customers-view) ', 'updated', '122.168.114.106', '2025-04-05 10:19:40', '2025-04-05 10:19:40'),
(373, 1, '2025-04-05', 'permission', 9, ' updated the access for DEMO. Access Changes Add Permission (all_jobs-view, all_clients-view, all_customers-view) ', 'Super Admin System Super Super Admin  updated the access for DEMO. Access Changes Add Permission (all_jobs-view, all_clients-view, all_customers-view)  ', 'updated', '122.168.114.106', '2025-04-05 10:20:07', '2025-04-05 10:20:07'),
(374, 1, '2025-04-05', 'permission', 6, ' updated the access for REVIEWER. Access Changes  Remove Permission (all_customers-view)', 'Super Admin System Super Super Admin  updated the access for REVIEWER. Access Changes  Remove Permission (all_customers-view) ', 'updated', '122.168.114.106', '2025-04-05 10:50:19', '2025-04-05 10:50:19'),
(375, 1, '2025-04-05', 'permission', 9, ' updated the access for DEMO. Access Changes Add Permission (all_customers-view) ', 'Super Admin System Super Super Admin  updated the access for DEMO. Access Changes Add Permission (all_customers-view)  ', 'updated', '122.168.114.106', '2025-04-05 11:24:53', '2025-04-05 11:24:53'),
(376, 1, '2025-04-05', 'permission', 9, ' updated the access for DEMO. Access Changes  Remove Permission (all_jobs-view, all_clients-view, all_customers-view)', 'Super Admin System Super Super Admin  updated the access for DEMO. Access Changes  Remove Permission (all_jobs-view, all_clients-view, all_customers-view) ', 'updated', '122.168.114.106', '2025-04-05 11:25:19', '2025-04-05 11:25:19');

-- --------------------------------------------------------

--
-- Table structure for table `staff_portfolio`
--

DROP TABLE IF EXISTS `staff_portfolio`;
CREATE TABLE IF NOT EXISTS `staff_portfolio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `staff_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `staff_portfolio`
--

INSERT INTO `staff_portfolio` (`id`, `staff_id`, `customer_id`, `createdAt`) VALUES
(9, 6, 1, '2025-02-11 14:28:29');

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
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `status_types`
--

INSERT INTO `status_types` (`id`, `type`, `status`, `created_at`, `updated_at`) VALUES
(1, 'pending', '1', '2024-06-28 12:52:45', '2024-06-28 12:52:45'),
(2, 'completed', '1', '2024-06-28 12:53:10', '2024-06-28 12:53:10'),
(3, 'rejected', '1', '2024-06-28 12:53:26', '2024-09-10 11:25:24');

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
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`id`, `name`, `service_id`, `job_type_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'a', 7, 2, '1', '2025-01-30 08:57:37', '2025-01-30 08:57:37'),
(2, 'b', 7, 2, '1', '2025-01-30 08:57:37', '2025-01-30 08:57:37'),
(3, 'c', 7, 1, '1', '2025-01-30 08:57:48', '2025-01-30 08:57:48'),
(4, 'd', 7, 1, '1', '2025-01-30 08:57:48', '2025-01-30 08:57:48');

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
) ENGINE=MyISAM AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;

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
(25, 22, '1', 0, 0, 1, 3, '2024-12-16', '01:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2024-12-27 09:29:02', '2024-12-27 09:29:17'),
(26, 6, '2', 1, 2, 4, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-02-12 07:24:00', '2025-02-12 07:24:00'),
(27, 6, '2', 1, 2, 1, 1, '2025-02-10', '01:00', NULL, NULL, '2025-02-12', '02:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-02-12 07:24:24', '2025-02-12 07:24:35'),
(28, 6, '1', 0, 0, 1, 3, '2025-02-17', '01:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-02-12 07:30:29', '2025-02-12 07:30:29'),
(29, 6, '2', 1, 2, 1, 1, '2025-02-24', '01:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-02-12 08:22:00', '2025-02-12 08:22:00');

-- --------------------------------------------------------

--
-- Structure for view `dashboard_data_view`
--
DROP TABLE IF EXISTS `dashboard_data_view`;

DROP VIEW IF EXISTS `dashboard_data_view`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `dashboard_data_view`  AS SELECT `customers`.`id` AS `customer_id`, `customers`.`customer_type` AS `customer_type`, `customers`.`staff_id` AS `staff_id`, `customers`.`account_manager_id` AS `account_manager_id`, `customer_service_account_managers`.`account_manager_id` AS `a_account_manager_id`, `jobs`.`allocated_to` AS `allocated_to`, `jobs`.`reviewer` AS `reviewer`, `jobs`.`id` AS `job_id`, `jobs`.`status_type` AS `status_type`, `clients`.`id` AS `client_id`, `clients`.`created_at` AS `client_created_at`, `jobs`.`created_at` AS `job_created_at`, `customers`.`created_at` AS `customer_created_at`, `sp_customers`.`id` AS `sp_customer_id` FROM (((((((((`customers` left join `clients` on((`clients`.`customer_id` = `customers`.`id`))) left join `jobs` on((`jobs`.`client_id` = `clients`.`id`))) join `staffs` `staff1` on((`customers`.`staff_id` = `staff1`.`id`))) join `staffs` `staff2` on((`customers`.`account_manager_id` = `staff2`.`id`))) left join `customer_services` on((`customer_services`.`customer_id` = `customers`.`id`))) left join `customer_service_account_managers` on((`customer_service_account_managers`.`customer_service_id` = `customer_services`.`id`))) left join `customer_company_information` on((`customers`.`id` = `customer_company_information`.`customer_id`))) left join `staff_portfolio` on((`staff_portfolio`.`customer_id` = `customers`.`id`))) left join `customers` `sp_customers` on(((`sp_customers`.`id` = `staff_portfolio`.`customer_id`) or (`sp_customers`.`staff_id` = `staff_portfolio`.`staff_id`)))) ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
