-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Feb 06, 2025 at 12:45 PM
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
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `client_type`, `customer_id`, `staff_created_id`, `client_industry_id`, `trading_name`, `client_code`, `trading_address`, `service_address`, `charity_commission_number`, `vat_registered`, `vat_number`, `website`, `notes`, `status`, `created_at`, `updated_at`) VALUES
(1, '5', 1, 2, 0, 'Charity', '00001', 'a', '', 'abc', '0', '', '', '', '1', '2025-01-30 09:02:25', '2025-01-30 09:02:25'),
(2, '1', 1, 2, 3, 'Cli2', '00002', 'd', NULL, NULL, '0', '', '', '', '1', '2025-01-30 09:08:41', '2025-01-30 09:08:41'),
(3, '1', 2, 2, 0, 'Cli2g', '00003', 'gg', NULL, NULL, '0', '', '', '', '1', '2025-02-04 05:09:01', '2025-02-04 05:09:01'),
(4, '1', 5, 5, 0, 'CLI-STAFF1', '00004', 'qa', NULL, NULL, '0', '', '', '', '1', '2025-02-06 11:20:55', '2025-02-06 11:20:55');

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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `client_contact_details`
--

INSERT INTO `client_contact_details` (`id`, `client_id`, `role`, `first_name`, `last_name`, `email`, `alternate_email`, `phone_code`, `phone`, `alternate_phone_code`, `alternate_phone`, `residential_address`, `authorised_signatory_status`, `created_at`, `updated_at`) VALUES
(1, 1, 0, 'a', 'a', '', '', '+44', '', '+44', '', NULL, '0', '2025-01-30 09:02:25', '2025-01-30 09:02:25'),
(2, 2, 0, 'd', 'd', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'd', '0', '2025-01-30 09:08:41', '2025-01-30 09:08:41'),
(3, 3, 0, 'g', 'g', 's@gmail.com', NULL, '+44', '', NULL, NULL, 'g', '0', '2025-02-04 05:09:01', '2025-02-04 05:09:01'),
(4, 4, 0, 's', 's', 's@gmail.com', NULL, '+44', '2777777777', NULL, NULL, 's', '0', '2025-02-06 11:20:55', '2025-02-06 11:20:55');

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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `client_job_task`
--

INSERT INTO `client_job_task` (`id`, `job_id`, `client_id`, `task_id`, `task_status`, `time`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 1, NULL, '12:12', '2025-01-30 09:09:00', '2025-01-30 09:09:00');

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
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `client_trustee_contact_details`
--

INSERT INTO `client_trustee_contact_details` (`id`, `client_id`, `role`, `first_name`, `last_name`, `email`, `alternate_email`, `phone_code`, `phone`, `alternate_phone_code`, `alternate_phone`, `residential_address`, `authorised_signatory_status`, `created_at`, `updated_at`) VALUES
(1, 1, 0, 'a', 'a', '', '', '+44', '', '+44', '', NULL, '0', '2025-01-30 09:02:25', '2025-01-30 09:02:25');

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
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `customer_type`, `staff_id`, `account_manager_id`, `trading_name`, `customer_code`, `trading_address`, `vat_registered`, `vat_number`, `website`, `customerJoiningDate`, `customerSource`, `customerSubSource`, `form_process`, `notes`, `status`, `created_at`, `updated_at`) VALUES
(1, '1', 2, 4, 'CUS1', '00001', 's', '0', '', '', '2025-01-30', 5, 7, '4', '', '1', '2025-01-30 08:58:35', '2025-02-06 07:26:09'),
(2, '1', 2, 4, 'DDDD', '00002', 'ss', '0', '', '', '2025-02-04', 10, 14, '4', '', '1', '2025-02-04 05:08:03', '2025-02-06 09:27:18'),
(5, '1', 5, 4, 'CUST-STAFF1', '00003', 'ok', '0', '', '', '2025-02-06', 10, 14, '4', '', '1', '2025-02-06 10:46:57', '2025-02-06 10:47:15'),
(6, '1', 4, 4, 'CUST-4', '00004', 'a', '0', '0', '', '2025-02-06', 10, 14, '4', '', '1', '2025-02-06 11:34:48', '2025-02-06 11:35:07');

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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_contact_details`
--

INSERT INTO `customer_contact_details` (`id`, `customer_id`, `contact_person_role_id`, `first_name`, `last_name`, `email`, `alternate_email`, `phone_code`, `phone`, `alternate_phone`, `residential_address`, `authorised_signatory_status`, `created_at`, `updated_at`) VALUES
(1, 1, 0, 's', 's', 's@gmail.com', NULL, '+44', '', NULL, 's', '1', '2025-01-30 08:58:35', '2025-01-30 08:58:35'),
(2, 2, 0, 'ss', 'sss', 's@gmail.com', NULL, '+44', '', NULL, 's', '1', '2025-02-04 05:08:03', '2025-02-04 05:08:03'),
(5, 5, 0, 's', 's', 's@gmail.com', NULL, '+44', '2777777777', NULL, 's', '1', '2025-02-06 10:46:57', '2025-02-06 10:46:57'),
(6, 6, 0, 's', 's', 's@gmail.com', NULL, '+44', '7777777777', NULL, 'z', '1', '2025-02-06 11:34:48', '2025-02-06 11:34:48');

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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_engagement_model`
--

INSERT INTO `customer_engagement_model` (`id`, `customer_id`, `fte_dedicated_staffing`, `percentage_model`, `adhoc_payg_hourly`, `customised_pricing`, `created_at`, `updated_at`) VALUES
(1, 1, '0', '1', '0', '0', '2025-01-30 08:59:03', '2025-01-30 08:59:03'),
(2, 2, '0', '1', '0', '0', '2025-02-04 05:08:19', '2025-02-04 05:08:19'),
(3, 5, '0', '1', '0', '0', '2025-02-06 10:47:13', '2025-02-06 10:47:13'),
(4, 6, '0', '1', '0', '0', '2025-02-06 11:35:05', '2025-02-06 11:35:05');

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
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `customer_engagement_percentage`
--

INSERT INTO `customer_engagement_percentage` (`id`, `customer_engagement_model_id`, `total_outsourcing`, `accountants`, `bookkeepers`, `payroll_experts`, `tax_experts`, `admin_staff`, `created_at`, `updated_at`) VALUES
(1, 1, '1.00', '1.00', '1.00', '1.00', '1.00', '1.00', '2025-01-30 08:59:03', '2025-01-30 08:59:03'),
(2, 2, '22.00', '22.00', '22.00', '22.00', '22.00', '22.00', '2025-02-04 05:08:19', '2025-02-04 05:08:19'),
(3, 3, '4.00', '4.00', '4.00', '4.00', '4.00', '4.00', '2025-02-06 10:47:13', '2025-02-06 10:47:13'),
(4, 4, '1.00', '1.00', '1.00', '1.00', '1.00', '1.00', '2025-02-06 11:35:05', '2025-02-06 11:35:05');

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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

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
(9, 6, 2, '1', '2025-02-06 11:34:52', '2025-02-06 11:34:52');

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
(1, 4, '2025-02-01 06:20:02', '2025-02-06 07:26:50'),
(2, 4, '2025-02-01 06:20:02', '2025-02-06 07:26:50'),
(3, 4, '2025-02-01 06:20:02', '2025-02-06 07:26:50'),
(4, 4, '2025-02-01 06:20:02', '2025-02-06 07:26:50'),
(5, 4, '2025-02-04 05:09:30', '2025-02-06 07:26:50'),
(6, 4, '2025-02-04 05:09:30', '2025-02-06 07:26:50'),
(7, 4, '2025-02-06 10:47:02', '2025-02-06 10:47:02'),
(8, 4, '2025-02-06 11:34:52', '2025-02-06 11:34:52'),
(9, 4, '2025-02-06 11:34:52', '2025-02-06 11:34:52');

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
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `drafts`
--

INSERT INTO `drafts` (`id`, `job_id`, `draft_sent_on`, `draft_title`, `final_draft_sent_on`, `feedback_received`, `updated_amendment`, `feedback`, `was_it_complete`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-02-01', 'D_00001', '2025-02-01', '0', '4', NULL, '1', '2025-02-01 11:19:53', '2025-02-01 11:19:53'),
(2, 1, '2025-02-01', 'D_00002', '2025-02-01', '1', '4', 'okkk', '1', '2025-02-01 11:20:46', '2025-02-01 12:24:00'),
(3, 1, '2025-02-01', 'D_00003', '2025-02-01', '1', '4', 'okkk', '1', '2025-02-01 11:22:40', '2025-02-01 11:23:04'),
(5, 2, '2025-02-06', 'D_00001', NULL, '0', '1', 'sss', '0', '2025-02-06 12:17:52', '2025-02-06 12:38:53'),
(4, 1, '2025-02-01', 'D_00004', NULL, '0', '1', NULL, '0', '2025-02-01 12:05:49', '2025-02-01 12:05:49');

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
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `staff_created_id`, `job_id`, `account_manager_id`, `customer_id`, `client_id`, `client_job_code`, `customer_contact_details_id`, `service_id`, `job_type_id`, `budgeted_hours`, `reviewer`, `allocated_to`, `allocated_on`, `date_received_on`, `year_end`, `total_preparation_time`, `review_time`, `feedback_incorporation_time`, `total_time`, `engagement_model`, `expected_delivery_date`, `due_on`, `submission_deadline`, `customer_deadline_date`, `sla_deadline_date`, `internal_deadline_date`, `filing_Companies_required`, `filing_Companies_date`, `filing_hmrc_required`, `filing_hmrc_date`, `opening_balance_required`, `opening_balance_date`, `number_of_transaction`, `number_of_balance_items`, `turnover`, `number_of_employees`, `vat_reconciliation`, `bookkeeping`, `processing_type`, `invoiced`, `currency`, `invoice_value`, `invoice_date`, `invoice_hours`, `invoice_remark`, `status_type`, `total_hours`, `total_hours_status`, `notes`, `Turnover_Period_id_0`, `Turnover_Currency_id_0`, `Turnover_id_0`, `VAT_Registered_id_0`, `VAT_Frequency_id_0`, `Who_Did_The_Bookkeeping_id_1`, `PAYE_Registered_id_1`, `Number_of_Trial_Balance_Items_id_1`, `Bookkeeping_Frequency_id_2`, `Number_of_Total_Transactions_id_2`, `Number_of_Bank_Transactions_id_2`, `Number_of_Purchase_Invoices_id_2`, `Number_of_Sales_Invoices_id_2`, `Number_of_Petty_Cash_Transactions_id_2`, `Number_of_Journal_Entries_id_2`, `Number_of_Other_Transactions_id_2`, `Transactions_Posting_id_2`, `Quality_of_Paperwork_id_2`, `Number_of_Integration_Software_Platforms_id_2`, `CIS_id_2`, `Posting_Payroll_Journals_id_2`, `Department_Tracking_id_2`, `Sales_Reconciliation_Required_id_2`, `Factoring_Account_id_2`, `Payment_Methods_id_2`, `Payroll_Frequency_id_3`, `Type_of_Payslip_id_3`, `Percentage_of_Variable_Payslips_id_3`, `Is_CIS_Required_id_3`, `CIS_Frequency_id_3`, `Number_of_Sub_contractors_id_3`, `Whose_Tax_Return_is_it_id_4`, `Number_of_Income_Sources_id_4`, `If_Landlord_Number_of_Properties_id_4`, `If_Sole_Trader_Who_is_doing_Bookkeeping_id_4`, `Management_Accounts_Frequency_id_6`, `created_at`, `updated_at`) VALUES
(1, 2, '00001', 11, 1, 2, '', 1, 2, 2, '24:24', 0, 0, '2025-01-30', '2025-01-30', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2025-01-26', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', NULL, 21, NULL, '1', NULL, '', '', 0, '', '', '', '', '', 'Daily', 0, 0, 0, 0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', 0, '0', '0', '0', '', '', '2025-01-30 09:09:00', '2025-02-01 12:05:49'),
(2, 2, '00002', 11, 2, 3, '', 2, 2, 4, '00:00', 0, 0, '2025-02-04', '2025-02-04', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2025-02-05', NULL, '0', NULL, '0', NULL, '0', NULL, '0.00', 0, '0.00', 0, '0', '0', '0', '0', 0, '0.00', NULL, '00:00', '', 21, NULL, '1', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Daily', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-02-04 05:14:36', '2025-02-06 12:17:52');

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
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

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
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `line_managers`
--

INSERT INTO `line_managers` (`id`, `staff_by`, `staff_to`, `created_at`, `updated_at`) VALUES
(1, 5, 4, '2025-02-06 07:27:58', '2025-02-06 07:27:58'),
(2, 6, 5, '2025-02-06 07:28:28', '2025-02-06 11:30:04');

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
(7, 'No Longer Active', 3, '1', '0', '2024-11-10 22:47:22', '2025-02-06 08:42:56'),
(8, 'Duplicate', 3, '1', '0', '2024-11-10 22:48:56', '2025-02-06 08:42:56'),
(9, 'Awaiting Paperwork/Accounts/VAT', 7, '1', '0', '2024-11-10 22:49:22', '2025-02-06 08:42:56'),
(10, 'Client Not Responding', 7, '1', '0', '2024-11-10 22:49:41', '2025-02-06 08:42:56'),
(11, 'Waiting for Credentials', 7, '1', '0', '2024-11-10 22:49:57', '2025-02-06 08:42:56'),
(12, 'Bookkeeping Not Completed', 7, '1', '0', '2024-11-10 22:50:12', '2025-02-06 08:42:56'),
(13, 'To Be Reviewed', 1, '1', '0', '2024-11-10 22:51:55', '2025-02-06 08:42:56'),
(14, 'Customer Reviewed & To be Updated', 1, '1', '0', '2024-11-10 22:52:10', '2025-02-06 08:42:56'),
(15, 'Customer Processing', 1, '1', '0', '2024-11-10 22:52:24', '2025-02-06 08:42:56'),
(16, 'Draft Sent', 2, '1', '0', '2024-11-10 22:52:52', '2025-02-06 08:42:56'),
(17, 'Update Sent', 2, '1', '0', '2024-11-10 22:53:06', '2025-02-06 08:42:56'),
(18, 'Filed with Companies House and HMRC', 2, '1', '0', '2024-11-10 22:53:20', '2025-02-06 08:42:56'),
(19, 'Filed with Companies House', 2, '1', '0', '2024-11-10 22:53:35', '2025-02-06 08:42:56'),
(20, 'Filed with HMRC', 2, '1', '0', '2024-11-10 22:53:48', '2025-02-06 08:42:56'),
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
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `missing_logs`
--

INSERT INTO `missing_logs` (`id`, `job_id`, `missing_log`, `missing_paperwork`, `missing_log_sent_on`, `missing_log_prepared_date`, `missing_log_title`, `missing_log_reviewed_by`, `missing_log_reviewed_date`, `missing_paperwork_received_on`, `last_chaser`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, '1', '0', '2025-01-31', NULL, 'M_00001', 2, '2025-01-25', NULL, '2025-01-31', '1', '2025-01-31 07:03:26', '2025-02-01 11:19:47'),
(2, 1, '1', '0', '2025-01-31', NULL, 'M_00002', 2, '2025-02-01', NULL, '2025-01-31', '1', '2025-01-31 11:44:02', '2025-02-01 11:19:43');

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
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `queries`
--

INSERT INTO `queries` (`id`, `job_id`, `queries_remaining`, `query_title`, `reviewed_by`, `missing_queries_prepared_date`, `query_sent_date`, `response_received`, `response`, `final_query_response_received_date`, `last_chaser`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, '1', 'Q_00001', '1', NULL, '2025-02-01', '0', NULL, '2025-02-02', '2025-02-01', '1', '2025-02-01 07:28:40', '2025-02-01 11:19:12'),
(2, 1, '1', 'Q_00002', '0', NULL, '2025-02-01', '0', NULL, '2025-02-02', '2025-02-01', '1', '2025-02-01 09:08:32', '2025-02-01 11:19:07');

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
  `is_disable` enum('0','1') NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

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
(9, 32, '2025-02-06 05:19:55', '2025-02-06 05:19:55');

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
  `is_disable` enum('0','1') NOT NULL DEFAULT '0',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `login_auth_token` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `staffs`
--

INSERT INTO `staffs` (`id`, `role_id`, `first_name`, `last_name`, `email`, `phone_code`, `phone`, `password`, `hourminute`, `status`, `is_disable`, `created_by`, `created_at`, `updated_at`, `login_auth_token`) VALUES
(1, 1, 'System Super', 'Super Admin', 'superadmin@gmail.com', NULL, '1234567891', '$2a$10$j07X1j33uRnImSqWD108IO9w15nAsQxsb7bb5wQsugxrwZ62msJbS', '152:00', '1', '1', 2, '2024-06-28 12:02:41', '2025-02-06 08:46:04', ''),
(2, 2, 'Amit', 'Amit', 'amit@outbooks.com', NULL, '5777777777', '$2a$10$SIJMFK5k/woLfwqfEJGMruiO6.f5oZwnCBb5S9zhmoPR/MiVI5c6K', '300:85', '1', '1', 2, '2024-07-08 07:25:41', '2025-02-06 10:56:32', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTczODgzOTM5MiwiZXhwIjoxNzM4ODc1MzkyfQ.cmD7ivpZ0nM_4J3IugrfEGw2MnjZTBBSWfuccUnnEK8'),
(3, 2, 'Ajit', 'Ajit', 'ajit@outbooks.com', NULL, '5777777777', '$2a$10$UGh8LOFOP9Kwtha4kypOcuJL.YZYwwyRsSrzaYsRvMiBiwMomGvdW', '659:00', '1', '1', 2, '2024-07-08 07:25:41', '2025-02-06 08:46:14', ''),
(4, 4, 'Account ', 'manager', 'manager@gmail.com', '+44', '2777777777', '$2a$10$KY9n668xQ3ouvmiea6GPo.7lzJzORursb57YiMObW3cQ8TZeadrWy', '2:5', '1', '0', 2, '2025-02-06 07:25:43', '2025-02-06 11:33:44', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTczODg0MTYyNCwiZXhwIjoxNzM4ODc3NjI0fQ.mnCCCW_ldSK7TigCqFfP86mX6NylkWd5X6OK-kSWuPs'),
(5, 3, 'STAFF', 'ONE', 'staff1@gmail.com', '+44', '2777777777', '$2a$10$naFNFC8Lw.Rcu/Bt518RyOFPYntjk30TrdsfAif2jBgd8lYw4HD7i', '232:59', '1', '0', 2, '2025-02-06 07:27:58', '2025-02-06 10:46:12', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTczODgzODc3MiwiZXhwIjoxNzM4ODc0NzcyfQ.CWK50J0fJHeO13M8kcycFoczGHIGqBOxeX1j2bK1vH8'),
(6, 6, 'STAFF', 'TWO', 'staff2@gmail.com', '+44', '2777777777', '$2a$10$hz3Ok/jshVyP5zTIuckV.udTMy/0e9NX1eq0kEbwoFO0rivX1Xmoy', '00:00', '1', '0', 2, '2025-02-06 07:28:28', '2025-02-06 11:21:42', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTczODgzOTA3MCwiZXhwIjoxNzM4ODc1MDcwfQ.qWJynNlsCzvHZ0l_Vps-2tnf0uDEAmbOqg5pWIE-BZk');

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
) ENGINE=MyISAM AUTO_INCREMENT=86 DEFAULT CHARSET=latin1;

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
(85, 2, '2025-02-06', 'job', 2, 'edited the draft job code:', 'Admin Amit Amit edited the draft job code: DDD_Cli_V4_00002', 'updated', '122.168.114.106', '2025-02-06 12:38:53', '2025-02-06 12:38:53');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
