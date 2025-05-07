-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 05, 2025 at 06:30 PM
-- Server version: 10.6.15-MariaDB-1:10.6.15+maria~ubu2004
-- PHP Version: 7.4.3-4ubuntu2.28

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

CREATE TABLE `checklists` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `is_all_customer` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`is_all_customer`)),
  `service_id` int(11) NOT NULL,
  `job_type_id` int(11) NOT NULL,
  `client_type_id` varchar(10) NOT NULL,
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
(2, 80, NULL, 10, 26, '2', 'Checklist (3)', '1', '2025-03-30 14:34:51', '2025-03-30 14:34:51');

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
(2, 2, 8, 'ABC', '11:22', '2025-03-30 14:34:51', '2025-03-30 14:34:51');

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
(26, '2', 76, 94, 0, 'KJ ACADEMY (NORTH WEST) C.I.C. _000022', NULL, NULL, '000022', '1 Wellington Road, Swinton, Manchester, England, M27 4BR', '0', '', '', '', '1', '2025-03-27 14:19:34', '2025-03-27 14:19:34'),
(27, '1', 76, 94, 9, '43 AYLESFORD STREET LIMITED', NULL, NULL, '000023', '34 Merchant Plaza, Liverpool, L1 0AX, UK', '0', '', '', '', '1', '2025-03-27 14:20:24', '2025-03-27 14:47:42'),
(28, '3', 76, 94, 0, 'MaxCharacterFieldValidationForTestingPurposeIncludingAlphanumericAndSpecialSymbolsLikeDashAndDot.Max', NULL, NULL, '000024', '5th Floor 111 Charterhouse Street, London, United Kingdom, EC1M 6AW', '0', '', '', '', '1', '2025-03-27 14:46:46', '2025-03-27 14:46:46'),
(29, '4', 76, 94, 0, 'Merchant’s Haven Ltd.', NULL, NULL, '000025', NULL, '1', NULL, NULL, '', '1', '2025-03-27 14:47:54', '2025-03-27 14:47:54'),
(30, '1', 76, 94, 8, 'Great Britain Trade Consortiumk', NULL, NULL, '000026', '43 Aylesford Street, London, SW1V 3RY', '0', '', '', '', '1', '2025-03-27 14:48:45', '2025-03-27 14:49:02'),
(31, '1', 79, 2, 7, 'ABCD Trading', NULL, NULL, '000027', 'Suite 18 Winsor & Newton Building, Whitefriars Avenue', '0', '', '', '', '1', '2025-03-29 13:52:16', '2025-03-29 13:52:16'),
(32, '6', 79, 1, 0, 'teststesttest', NULL, NULL, '000028', 'false', '0', '', '', '', '1', '2025-03-30 14:13:18', '2025-03-30 14:13:18'),
(33, '2', 78, 1, 0, 'B.S.N.V. LIMITED_000029', NULL, NULL, '000029', '29 Astley Avenue, Coventry, England, CV6 6EY', '0', '', '', '', '1', '2025-03-30 14:20:56', '2025-03-30 14:20:56'),
(34, '2', 78, 1, 0, 'IJ ACHARA CONSULTANCY LTD_000030', NULL, NULL, '000030', 'International House 36-38, Cornhill, London, England, EC3V 3NG', '0', '', '', '', '1', '2025-03-30 14:22:30', '2025-03-30 14:22:30'),
(35, '2', 77, 1, 0, 'MH LIMITED_000031', NULL, NULL, '000031', 'Suite 3 Middlesex House, Meadway Technology Prak, Rutherford Close, Stevenage Hertfordshire, SG1 2EF', '0', '', '', '', '1', '2025-03-30 14:29:41', '2025-03-30 14:29:41'),
(36, '2', 80, 1, 0, 'GF ABERNETHY ENERGY LTD_000032', NULL, NULL, '000032', '20 Wenlock Road, London, England, N1 7GU', '0', '', '', '', '1', '2025-03-30 14:35:32', '2025-03-30 14:35:32'),
(37, '2', 81, 7, 0, 'KMD PROPERTY INVESTMENTS LIMITED_000033', NULL, NULL, '000033', '85 Bridge Street, Worksop, Nottinghamshire, United Kingdom, S80 1DL', '0', '', '', '', '1', '2025-04-01 09:57:54', '2025-04-01 09:57:54'),
(38, '2', 71, 60, 10, 'U CAN PROPERTY LIMITED_000034', NULL, NULL, '000034', 'Stags Head 990 Whittingham Lane, Whittingham, Preston, England, PR3 2AU', '0', '', '', '', '1', '2025-04-01 12:16:15', '2025-04-01 12:16:15'),
(39, '4', 82, 34, 0, 'Pinnacle UK Trade', NULL, NULL, '000035', NULL, '1', NULL, NULL, '', '1', '2025-04-03 14:49:22', '2025-04-03 14:49:22');

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
(21, 38, 'U CAN PROPERTY LIMITED', 'ltd', 'active', '12456071', 'Stags Head 990 Whittingham Lane, Whittingham, Preston, England, PR3 2AU', '2020-02-11', '4', '2025-04-01 12:16:15', '2025-04-01 12:16:15');

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
(41, 39, 0, 'Vikas', 'Patel', '', NULL, '+44', '', NULL, NULL, '', '0', '2025-04-03 14:49:22', '2025-04-03 14:49:22');

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
(1, 37, '1729316168785-Activity.PNG', 'Activity.PNG', 'image/png', 54446, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST81_CLIENT37/Activity.PNG', '2025-04-02 13:22:34', '2025-04-02 13:22:34');

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
(12, 14, 16, NULL, 16, NULL, '01:01:00', '2025-04-03 15:35:29', '2025-04-03 15:35:29');

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
(2, 25, 0, 'Ritesh ', 'Yadav', '', '', '+44', '', '+44', '', NULL, '0', '2025-03-26 14:00:42', '2025-03-26 14:00:42');

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
(1, '2', 1, 34, 'BISHOPS DAL ENERGY STORAGE LIMITED_00001', '00001', 'Beaufort Court, Egg Farm Lane, Kings Langley, Hertfordshire, United Kingdom, WD4 8LR', '0', '', '', '2025-02-10', 7, 10, '4', '', '1', '2025-02-10 14:03:38', '2025-02-10 14:03:58'),
(2, '2', 7, 7, 'TAG ACCOUNTANTS GROUP LIMITED (Copia)_00002', '00002', '8 Pendeford Place, Pendeford Business Park, Wolverhampton, West Midlands, United Kingdom, WV9 5HD', '0', '', '', '2025-03-17', 13, 4, '4', '', '1', '2025-03-17 09:40:24', '2025-03-17 09:41:15'),
(9, '2', 10, 10, 'GOWER ACCOUNTANCY & TAX ADVISORY SERVICES LTD_00007', '00007', 'Unit 47a Crofty Industrial Estate, Penclawdd, Swansea, Wales, SA4 3RS', '0', '', '', '2005-01-17', 13, 14, '4', '', '1', '2025-03-17 10:53:29', '2025-03-17 10:56:04'),
(12, '2', 15, 15, 'FM ACCOUNTING LTD', '00008', '1 Blenheim Court, Suite 22, Peppercorn Close, Peterborough, England, PE1 2DU', '0', '', '', '2020-07-01', 13, 4, '4', '', '1', '2025-03-17 14:07:00', '2025-03-17 14:11:10'),
(13, '2', 55, 11, '321ACCOUNTS LTD', '00009', '152 Coles Green Road, London, NW2 7HD', '0', '', '', '2023-10-10', 1, 1, '4', '', '1', '2025-03-18 08:48:46', '2025-03-18 15:20:48'),
(6, '2', 46, 47, 'LD ACCOUNTING AND BUSINESS SERVICES LTD_00006', '00006', '9 Whitebeam Close, Kempston, Bedford, England, MK42 7RN', '0', '', '', '2024-01-08', 13, 4, '4', '', '1', '2025-03-17 10:31:21', '2025-03-17 10:33:52'),
(23, '2', 55, 15, 'BLENHEIM PARTNERS LIMITED_000014', '000014', 'Cedar Court 221 Hagley Road, Hayley Green, Halesowen, West Midlands, B63 1ED', '0', '', '', '2023-08-01', 1, 2, '4', '', '1', '2025-03-18 11:51:48', '2025-03-18 11:55:47'),
(22, '2', 55, 7, 'BERKO WEALTH LTD. _000013', '000013', '38 Nye Bevan Estate, London, United Kingdom, E5 0AG', '0', '', '', '2019-11-12', 1, 2, '4', '', '1', '2025-03-18 11:12:27', '2025-03-20 09:35:19'),
(21, '2', 50, 50, 'Clear Group_000012', '000012', 'Limestone House, 20 Drogheda Street, Balbriggan, Dublin, Ireland', '1', '', '', '2025-03-18', 12, 5, '4', '', '1', '2025-03-18 11:00:03', '2025-03-18 11:26:13'),
(20, '2', 55, 52, 'AXADA LTD_000011', '000011', '483 Green Lanes, London, United Kingdom, N13 4BS', '0', '', '', '2019-06-25', 1, 3, '4', '', '1', '2025-03-18 10:51:29', '2025-03-20 09:42:13'),
(19, '2', 55, 39, 'BAANX GROUP LTD_000010', '000010', '96 Pavilion Office, Kensington High Street, London, United Kingdom, W8 4SG', '0', '', '', '2024-03-22', 1, 3, '4', '', '1', '2025-03-18 10:32:23', '2025-03-18 10:42:40'),
(24, '2', 55, 46, 'BPC PARTNERS LIMITED_000015', '000015', '3 Royal Crescent, Cheltenham, Gloucestershire, United Kingdom, GL50 3DA', '0', '', '', '2022-08-16', 1, 1, '4', '', '1', '2025-03-18 12:08:22', '2025-03-18 12:12:23'),
(25, '2', 55, 14, 'CAMERON PARTNERSHIP LIMITED_000016', '000016', 'Suite 37 Chessington Business Centre, Cox Lane, Chessington, Surrey, KT9 1SD', '0', '', '', '2022-08-10', 13, 4, '4', '', '1', '2025-03-18 12:32:54', '2025-03-18 12:40:56'),
(31, '2', 55, 9, 'FIELDS LUXURY LIMITED', '000022', ' 2nd Floor Gadd House, Arcadia  Avenue, London, England, N3 2JU', '0', '', '', '2022-04-19', 1, 2, '4', '', '1', '2025-03-18 14:23:03', '2025-03-18 14:32:07'),
(72, '2', 8, 8, 'STRATOM CONSULTING LIMITED_000053', '000053', '85 Great Portland Street, First Floor, London, England, W1W 7LT', '0', '', '', '2025-01-10', 13, 4, '4', '', '1', '2025-03-20 07:07:40', '2025-03-20 07:08:45'),
(42, '2', 59, 59, 'MY TAX HELPER LTD', '000024', 'Office 10, 7 Throwley Way, Sutton, England, SM1 4AF', '0', '', 'https://mytaxhelper.co.uk/', '2025-03-19', 13, 4, '4', '', '1', '2025-03-19 03:22:10', '2025-03-19 03:39:23'),
(43, '2', 59, 59, 'ROBERT LEWIS, REDBOND, RUGGIERI & CO LIMITED_000025', '000025', 'Building 18, Gateway 1000 Whittle Way, Arlington Business Park, Stevenage, Hertfordshire, England, SG1 2FP', '0', '', '', NULL, NULL, NULL, '1', '', '1', '2025-03-19 03:41:12', '2025-03-19 03:41:12'),
(74, '2', 1, 34, 'FDSFGDSTXDGES LIMITED_000055', '000055', '2381, NI709505 - COMPANIES HOUSE DEFAULT ADDRESS, Belfast, BT1 9DY', '0', '', '', '2025-03-26', 12, 5, '4', '', '1', '2025-03-26 14:09:44', '2025-03-26 14:10:02'),
(75, '2', 1, 34, 'BIRMINGHAM CONNECTION LTD', '000056', '18 Manor House Lane, Birmingham, England, B26 1PG', '0', '', '', '2025-03-26', 8, 16, '4', '', '1', '2025-03-26 14:11:05', '2025-03-26 14:11:50'),
(76, '2', 94, 30, 'ASKL LTD', '000057', 'Flat 2 13 Thornhill Road, Croydon, England, CR0 2XZ', '1', '99999999', 'www.test.com', '2025-03-27', 8, 14, '4', '', '1', '2025-03-27 14:15:50', '2025-03-27 14:17:19'),
(77, '1', 94, 30, '43 AYLESFORD STREET LIMITED', '000058', '34 Merchant Plaza, Liverpool, L1 0AX, UK', '0', '', '', '2025-03-27', 7, 9, '4', '', '1', '2025-03-27 14:18:25', '2025-03-27 14:18:53'),
(78, '2', 36, 34, 'MEDICAL SICKNESS ANNUITY AND LIFE ASSURANCE SOCIETY LIMITED(THE)_000059', '000059', 'Colmore Circus Queensway, Birmingham, B4 6AR', '0', '', '', '2025-03-27', 12, 5, '4', '', '1', '2025-03-27 15:04:41', '2025-03-27 15:05:26'),
(79, '2', 34, 30, 'M LIMITED_000060', '000060', '99  Holly Avenue, Jesmond, Newcastle Upon Tyne, NE2 2QB', '0', '', '', '2025-03-27', 4, 6, '4', '', '1', '2025-03-27 15:43:41', '2025-03-27 15:43:56'),
(71, '2', 60, 60, 'ASTONIA ASSOCIATES LIMITED_000052', '000052', 'Business & Technology Centre, Bessemer Drive, Stevenage, Herts, England, SG1 2DX', '1', '284730387', '', '2024-03-01', 13, 4, '4', '', '1', '2025-03-19 15:03:31', '2025-03-19 15:06:07'),
(60, '2', 61, 61, 'FRYNANCE LIMITED_000041', '000041', 'Derek Ashton Court (Office 3), 77 Mottram Road, Stalybridge, England, SK15 2QP', '0', '', '', '2025-03-19', 13, 4, '4', '', '1', '2025-03-19 07:05:42', '2025-03-19 07:06:58'),
(73, '2', 1, 34, 'ANDREWS BUILDING SERVICES CONSULTING ENGINEERS LTD', '000054', 'Lightyear Building Suite 23 9 Marchburn Drive, Glasgow Airport Business Park, Paisley, Scotland, PA3 2SJ', '0', '', '', '2025-03-26', 13, 4, '4', '', '1', '2025-03-26 13:53:59', '2025-03-26 13:54:33'),
(53, '2', 61, 61, 'RLA (CAMBS) LTD', '000034', 'Building 18, Gateway 1000 Whittle Way, Arlington Business Park, Stevenage, Hertfordshire, England, SG1 2FP', '1', '', '', '2021-12-20', 13, 4, '4', '', '1', '2025-03-19 06:59:24', '2025-03-19 07:07:36'),
(80, '2', 1, 94, 'ANTICUS RECRUITMENT LTD_000061', '000061', '24a Market Street, Disley, Stockport, England, SK12 2AA', '0', '', '', '2025-03-30', 7, 10, '4', '', '1', '2025-03-30 14:34:09', '2025-03-30 14:35:07'),
(81, '2', 7, 7, 'OPTIMISE ACCOUNTANTS LIMITED_000062', '000062', 'Office 15 Bramley House 2a, Bramley Road, Long Eaton, Nottinghamshire, United Kingdom, NG10 3SX', '0', '', '', '2025-04-01', 13, 4, '4', '', '1', '2025-04-01 09:51:02', '2025-04-01 09:56:11'),
(82, '2', 34, 34, 'ADVANCED HOUSING ENGINEERING UA LTD_000063', '000063', 'Suite A-82 James Carter Rd, Mildenhall, Bury St. Edmunds, England, IP28 7DE', '0', '', '', '2025-04-03', 1, 3, '4', '', '1', '2025-04-03 14:46:21', '2025-04-03 14:46:53');

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
(32, 82, 'ADVANCED HOUSING ENGINEERING UA LTD', 'ltd', 'dissolved', '12321497', 'Suite A-82 James Carter Rd, Mildenhall, Bury St. Edmunds, England, IP28 7DE', '2019-11-19', '4', '2025-04-03 14:46:21', '2025-04-03 14:46:21');

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
(31, 78, 0, 'Selena Jane', 'PRITCHARD', 'jennifer@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-03-27 15:04:41', '2025-03-27 15:04:41'),
(32, 79, NULL, 'Suzanne Elizabeth', 'SPEAK', 'vikas@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-03-27 15:43:41', '2025-03-28 11:20:24'),
(33, 80, 0, 'Lucy', 'BREWER', 'jennifer@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-03-30 14:34:09', '2025-03-30 14:34:09'),
(34, 81, 3, 'Louise', 'MISIEWICZ', 'louise@optimiseaccountants.co.uk', NULL, '+44', '', NULL, NULL, '1', '2025-04-01 09:51:02', '2025-04-01 09:51:02'),
(35, 82, 1, 'Tiago', 'BARROSO', 'jennifer@gmail.com', NULL, '+44', '', NULL, NULL, '1', '2025-04-03 14:46:21', '2025-04-03 14:46:21');

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
(12, 23, 21.00, NULL, NULL, NULL, NULL, '2025-03-27 14:16:20', '2025-03-27 14:16:20');

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
(13, 29, 32, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-04-03 14:46:40', '2025-04-03 14:46:40');

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
(29, 82, '1', '0', '0', '0', '2025-04-03 14:46:40', '2025-04-03 14:46:40');

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
(5, 23, 12.00, 21.00, NULL, NULL, NULL, NULL, '2025-03-27 14:16:20', '2025-03-27 14:16:20');

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
(1, 82, '1742918187902-gr2kuwc2.png', 'gr2kuwc2.png', 'image/png', 12370, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST82/gr2kuwc2.png', '2025-04-03 14:46:53', '2025-04-03 14:46:53');

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
(61, 82, 6, '1', '2025-04-03 14:46:30', '2025-04-03 14:46:30');

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
(1, 34, '2025-02-10 14:03:46', '2025-02-10 14:03:46'),
(2, 7, '2025-03-17 09:40:33', '2025-03-17 09:40:33'),
(3, 7, '2025-03-17 09:40:33', '2025-03-17 09:40:33'),
(4, 7, '2025-03-17 09:40:33', '2025-03-17 09:40:33'),
(5, 7, '2025-03-17 09:40:33', '2025-03-17 09:40:33'),
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
(18, 7, '2025-03-20 09:28:50', '2025-03-20 09:28:50'),
(19, 7, '2025-03-20 09:28:50', '2025-03-20 09:28:50'),
(21, 15, '2025-03-20 09:23:55', '2025-03-20 09:23:55'),
(22, 15, '2025-03-20 09:23:55', '2025-03-20 09:23:55'),
(23, 46, '2025-03-20 09:17:20', '2025-03-20 09:17:20'),
(24, 14, '2025-03-20 09:10:58', '2025-03-20 09:10:58'),
(25, 9, '2025-03-20 09:13:55', '2025-03-20 09:13:55'),
(26, 9, '2025-03-20 09:13:55', '2025-03-20 09:13:55'),
(28, 7, '2025-03-20 09:28:50', '2025-03-20 09:28:50'),
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
(42, 34, '2025-03-26 14:03:52', '2025-03-26 14:03:52'),
(43, 34, '2025-03-26 14:03:52', '2025-03-26 14:03:52'),
(44, 61, '2025-03-26 14:09:53', '2025-03-26 14:09:53'),
(44, 34, '2025-03-26 14:09:53', '2025-03-26 14:09:53'),
(45, 34, '2025-03-26 14:11:26', '2025-03-26 14:11:26'),
(46, 34, '2025-03-26 14:11:26', '2025-03-26 14:11:26'),
(47, 30, '2025-03-27 14:17:21', '2025-03-27 14:17:21'),
(47, 34, '2025-03-27 14:17:21', '2025-03-27 14:17:21'),
(48, 30, '2025-03-27 14:18:41', '2025-03-27 14:18:41'),
(49, 30, '2025-03-27 14:18:41', '2025-03-27 14:18:41'),
(50, 34, '2025-03-27 14:18:41', '2025-03-27 14:18:41'),
(50, 30, '2025-03-27 14:18:41', '2025-03-27 14:18:41'),
(51, 34, '2025-03-27 15:05:05', '2025-03-27 15:05:05'),
(52, 34, '2025-03-27 15:05:05', '2025-03-27 15:05:05'),
(53, 30, '2025-03-27 15:43:46', '2025-03-27 15:43:46'),
(54, 30, '2025-03-27 15:43:46', '2025-03-27 15:43:46'),
(55, 94, '2025-03-30 14:34:51', '2025-03-30 14:34:51'),
(56, 7, '2025-04-01 09:54:03', '2025-04-01 09:54:03'),
(57, 7, '2025-04-01 09:54:03', '2025-04-01 09:54:03'),
(58, 34, '2025-04-03 14:48:45', '2025-04-03 14:48:45'),
(59, 34, '2025-04-03 14:48:45', '2025-04-03 14:48:45'),
(60, 34, '2025-04-03 14:48:45', '2025-04-03 14:48:45'),
(61, 34, '2025-04-03 14:48:45', '2025-04-03 14:48:45');

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
(1, 7, '2025-03-19', 'D_00001', NULL, '0', '1', NULL, '0', '2025-03-31 06:19:09', '2025-03-31 06:19:09');

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
(5, 'Marketing', '1', '2024-11-09 08:36:31', '2025-01-04 17:57:32');

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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `staff_created_id`, `job_id`, `account_manager_id`, `customer_id`, `client_id`, `client_job_code`, `customer_contact_details_id`, `service_id`, `job_type_id`, `budgeted_hours`, `reviewer`, `allocated_to`, `allocated_on`, `date_received_on`, `year_end`, `total_preparation_time`, `review_time`, `feedback_incorporation_time`, `total_time`, `engagement_model`, `expected_delivery_date`, `due_on`, `submission_deadline`, `customer_deadline_date`, `sla_deadline_date`, `internal_deadline_date`, `filing_Companies_required`, `filing_Companies_date`, `filing_hmrc_required`, `filing_hmrc_date`, `opening_balance_required`, `opening_balance_date`, `number_of_transaction`, `number_of_balance_items`, `turnover`, `number_of_employees`, `vat_reconciliation`, `bookkeeping`, `processing_type`, `invoiced`, `currency`, `invoice_value`, `invoice_date`, `invoice_hours`, `invoice_remark`, `status_type`, `total_hours`, `total_hours_status`, `notes`, `Turnover_Period_id_0`, `Turnover_Currency_id_0`, `Turnover_id_0`, `VAT_Registered_id_0`, `VAT_Frequency_id_0`, `Who_Did_The_Bookkeeping_id_1`, `PAYE_Registered_id_1`, `Number_of_Trial_Balance_Items_id_1`, `Bookkeeping_Frequency_id_2`, `Number_of_Total_Transactions_id_2`, `Number_of_Bank_Transactions_id_2`, `Number_of_Purchase_Invoices_id_2`, `Number_of_Sales_Invoices_id_2`, `Number_of_Petty_Cash_Transactions_id_2`, `Number_of_Journal_Entries_id_2`, `Number_of_Other_Transactions_id_2`, `Transactions_Posting_id_2`, `Quality_of_Paperwork_id_2`, `Number_of_Integration_Software_Platforms_id_2`, `CIS_id_2`, `Posting_Payroll_Journals_id_2`, `Department_Tracking_id_2`, `Sales_Reconciliation_Required_id_2`, `Factoring_Account_id_2`, `Payment_Methods_id_2`, `Payroll_Frequency_id_3`, `Type_of_Payslip_id_3`, `Percentage_of_Variable_Payslips_id_3`, `Is_CIS_Required_id_3`, `CIS_Frequency_id_3`, `Number_of_Sub_contractors_id_3`, `Whose_Tax_Return_is_it_id_4`, `Number_of_Income_Sources_id_4`, `If_Landlord_Number_of_Properties_id_4`, `If_Sole_Trader_Who_is_doing_Bookkeeping_id_4`, `Management_Accounts_Frequency_id_6`, `created_at`, `updated_at`) VALUES
(5, 1, '00005', 34, 78, 33, '', 31, 5, 9, '11:22', 0, 0, '2025-03-30', '2025-03-30', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2025-03-31', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', 'Daily', 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', 'Quarterly', '2025-03-30 14:23:38', '2025-03-30 14:23:38'),
(4, 94, '00004', 30, 76, 27, '', 28, 5, 9, '01:00', 0, 0, '2025-03-29', '2025-03-29', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2025-03-30', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', 'Daily', 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', 'Quarterly', '2025-03-29 14:03:44', '2025-03-29 14:03:44'),
(3, 2, '00003', 30, 79, 31, '', 32, 4, 12, '00:00', 68, 83, '2025-03-28', '2025-03-29', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-04-03', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', 'Daily', 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', 'Quarterly', '2025-03-29 13:53:48', '2025-03-29 13:53:48'),
(6, 1, '00006', 94, 80, 36, '', 33, 10, 26, '11:22', 0, 0, '2025-03-30', '2025-03-30', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2025-03-31', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', 'Daily', 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', 'Quarterly', '2025-03-30 14:35:52', '2025-03-30 14:35:52'),
(7, 10, '00007', 10, 9, 7, 'PIN108', 5, 6, 7, '08:30', 23, 49, '2025-03-17', '2025-03-16', '', '06:30', '01:30', '00:30', '08:30', 'adhoc_payg_hourly', '2025-03-19', NULL, NULL, '2025-03-19', '2025-04-19', '2025-03-19', '0', NULL, '0', NULL, '1', '2025-03-17', 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 21, '06:30', '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', 'Daily', 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', 'Quarterly', '2025-03-31 06:13:45', '2025-03-31 06:36:29'),
(8, 47, '00008', 47, 6, 6, '', 3, 1, 21, '08:00', 68, 58, '2025-03-31', '2025-03-31', '', '12:00', '00:00', '00:00', '12:00', 'adhoc_payg_hourly', NULL, NULL, NULL, NULL, '2025-04-01', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 5, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Client', '1 to 5', '1 to 5', 'Daily', 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', 'Quarterly', '2025-03-31 06:15:16', '2025-03-31 06:15:16'),
(9, 60, '00009', 60, 71, 16, 'Astonia1', 22, 1, 22, '20:00', 0, 90, '2025-03-25', '2025-03-25', '', '00:00', '00:00', '00:00', '00:00', 'percentage_model', NULL, NULL, NULL, NULL, '2025-04-28', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 7, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Client', 'No', '51 to 75', 'Daily', 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', 'Quarterly', '2025-03-31 06:51:23', '2025-04-01 12:23:07'),
(10, 7, '000010', 7, 2, 2, 'TMF001', 2, 1, 22, '16:00', 0, 20, '2025-03-18', '2025-03-18', '', '16:00', '00:00', '00:00', '16:00', 'percentage_model', '2025-03-25', NULL, NULL, NULL, '2025-04-28', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 3, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Customer', 'No', '1 to 5', 'Daily', 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', 'Quarterly', '2025-03-31 13:55:55', '2025-03-31 13:55:55'),
(11, 7, '000011', 7, 81, 37, '', 34, 1, 22, '10:00', 0, 84, '2025-04-01', '2025-04-01', '', '00:00', '00:00', '00:00', '00:00', '', NULL, NULL, NULL, NULL, '2025-04-29', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 3, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', 'Daily', 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', 'Quarterly', '2025-04-01 09:59:55', '2025-04-01 09:59:55'),
(12, 60, '000012', 60, 71, 38, 'Astonia2', 22, 1, 22, '15:00', 0, 91, '2025-03-25', '2025-03-25', '', '16:00', '01:00', '01:00', '18:00', 'percentage_model', '2025-04-01', NULL, NULL, NULL, '2025-04-29', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 3, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Client', 'No', '51 to 75', 'Daily', 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', 'Quarterly', '2025-04-01 12:19:06', '2025-04-01 12:19:06'),
(13, 34, '000013', 34, 82, 39, '', 35, 7, 5, '10:00', 0, 0, '2025-04-03', '2025-04-03', '', '00:00', '00:00', '00:00', '00:00', 'fte_dedicated_staffing', NULL, NULL, NULL, NULL, '2025-04-04', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 4, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', 'Daily', 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', 'Quarterly', '2025-04-03 14:50:05', '2025-04-03 15:00:38'),
(14, 96, '000014', 60, 71, 16, '', 22, 8, 3, '01:01', 0, 0, '2025-04-03', '2025-04-03', '', '00:00', '00:00', '00:00', '00:00', 'percentage_model', NULL, NULL, NULL, NULL, '2025-04-04', NULL, '0', NULL, '0', NULL, '0', NULL, 0.00, 0, 0.00, 0, '0', '0', '0', '0', 0, 0.00, NULL, '00:00', '', 1, NULL, '1', '', 'Monthly', 'GBP', 0, 'No', 'Quarterly', 'Outbooks', 'No', '1 to 5', 'Daily', 0, 0, 0, 0, 0, 0, 0, 'Manual', 'Bad', '1', 'No', 'Yes', 'No', 'No', 'Provider Deducts Commission Only', '1', 'Weekly', 'Wages Only', '0%', 'No', 'Weekly', 0, 'Director', '1', '1', 'Outbooks', 'Quarterly', '2025-04-03 15:35:29', '2025-04-03 15:35:29');

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
(26, 10, 'Vikas test', '1', '2025-03-30 14:33:31', '2025-03-30 14:33:31');

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
(1, 44, 38, '2025-03-17 09:29:50', '2025-03-17 09:29:50'),
(2, 45, 38, '2025-03-17 09:30:33', '2025-03-17 09:30:33'),
(3, 46, 12, '2025-03-17 09:49:12', '2025-03-17 09:49:12'),
(4, 47, 46, '2025-03-17 10:27:49', '2025-03-17 10:27:49'),
(5, 48, 46, '2025-03-17 10:28:39', '2025-03-17 10:28:39'),
(6, 49, 10, '2025-03-17 10:44:02', '2025-03-17 10:44:02'),
(7, 50, 14, '2025-03-17 13:26:37', '2025-03-17 13:26:37'),
(8, 51, 12, '2025-03-17 13:27:27', '2025-03-17 13:27:27'),
(9, 52, 12, '2025-03-17 13:28:31', '2025-03-17 13:28:31'),
(10, 53, 12, '2025-03-17 13:29:13', '2025-03-17 13:29:13'),
(11, 54, 15, '2025-03-17 13:38:59', '2025-03-17 13:38:59'),
(12, 55, 45, '2025-03-17 13:51:40', '2025-03-17 13:51:40'),
(13, 56, 44, '2025-03-17 13:58:22', '2025-03-17 13:58:22'),
(14, 57, 9, '2025-03-18 09:12:30', '2025-03-18 09:12:30'),
(15, 58, 46, '2025-03-18 09:20:42', '2025-03-18 09:20:42'),
(16, 59, 12, '2025-03-18 09:41:54', '2025-03-18 09:41:54'),
(17, 60, 12, '2025-03-18 09:51:32', '2025-03-18 09:51:32'),
(18, 61, 12, '2025-03-18 09:57:38', '2025-03-18 09:57:38'),
(19, 62, 50, '2025-03-18 11:30:02', '2025-03-18 11:30:02'),
(20, 63, 53, '2025-03-18 14:31:56', '2025-03-18 14:31:56'),
(21, 64, 53, '2025-03-18 14:32:47', '2025-03-18 14:32:47'),
(22, 65, 53, '2025-03-18 14:38:50', '2025-03-18 14:38:50'),
(23, 66, 53, '2025-03-18 14:39:14', '2025-03-18 14:39:14'),
(24, 67, 53, '2025-03-18 14:39:39', '2025-03-18 14:39:39'),
(25, 68, 59, '2025-03-19 03:47:06', '2025-03-19 03:47:06'),
(26, 69, 59, '2025-03-19 03:47:53', '2025-03-19 03:47:53'),
(27, 70, 59, '2025-03-19 03:48:22', '2025-03-19 03:48:22'),
(28, 71, 59, '2025-03-19 03:48:50', '2025-03-19 03:48:50'),
(29, 72, 59, '2025-03-19 03:49:31', '2025-03-19 03:49:31'),
(30, 73, 59, '2025-03-19 03:51:27', '2025-03-19 03:51:27'),
(31, 74, 59, '2025-03-19 03:53:17', '2025-03-19 03:53:17'),
(32, 75, 59, '2025-03-19 03:53:58', '2025-03-19 03:53:58'),
(33, 76, 59, '2025-03-19 03:54:48', '2025-03-19 03:54:48'),
(34, 77, 59, '2025-03-19 03:55:20', '2025-03-19 03:55:20'),
(35, 78, 59, '2025-03-19 03:55:51', '2025-03-19 03:55:51'),
(36, 79, 59, '2025-03-19 03:56:42', '2025-03-19 03:56:42'),
(37, 80, 59, '2025-03-19 03:57:27', '2025-03-19 03:57:27'),
(38, 81, 59, '2025-03-19 03:58:05', '2025-03-19 03:58:05'),
(39, 82, 61, '2025-03-19 06:43:53', '2025-03-19 06:43:53'),
(40, 83, 61, '2025-03-19 06:44:48', '2025-03-19 06:44:48'),
(41, 84, 51, '2025-03-19 06:45:35', '2025-03-19 06:45:35'),
(42, 85, 51, '2025-03-19 06:47:00', '2025-03-19 06:47:00'),
(43, 86, 61, '2025-03-19 07:11:39', '2025-03-19 07:11:39'),
(44, 87, 61, '2025-03-19 07:12:31', '2025-03-19 07:12:31'),
(45, 88, 14, '2025-03-19 09:01:57', '2025-03-19 09:01:57'),
(46, 89, 52, '2025-03-19 10:17:40', '2025-03-19 10:17:40'),
(47, 90, 60, '2025-03-19 15:11:44', '2025-03-19 15:11:44'),
(48, 91, 60, '2025-03-19 15:12:34', '2025-03-19 15:12:34'),
(49, 92, 20, '2025-03-20 07:14:00', '2025-03-20 07:14:00'),
(50, 93, 14, '2025-03-21 07:59:14', '2025-03-21 07:59:14'),
(51, 94, 34, '2025-03-29 15:17:05', '2025-03-29 15:17:05'),
(52, 20, 7, '2025-04-01 09:53:39', '2025-04-01 09:53:39');

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
(1, 'To Be Started - Not Yet Allocated Internally', 1, '1', '1', '2024-08-27 11:42:24', '2025-02-06 13:17:10'),
(2, 'WIP – Missing Paperwork', 1, '1', '1', '2024-08-27 11:53:06', '2025-02-06 13:17:14'),
(3, 'WIP – Processing', 1, '1', '1', '2024-08-27 11:53:06', '2025-02-06 13:17:17'),
(4, 'WIP – In Queries', 1, '1', '1', '2024-08-27 11:53:06', '2025-02-06 13:17:20'),
(5, 'WIP – To Be Reviewed', 1, '1', '1', '2024-08-27 11:53:06', '2025-02-06 13:17:23'),
(6, 'Complete', 2, '1', '1', '2024-09-24 13:07:54', '2025-02-06 13:17:29'),
(7, 'Complete - Draft Sent', 2, '1', '1', '2024-11-10 22:47:22', '2025-02-10 14:06:21'),
(8, 'Duplicate', 3, '1', '0', '2024-11-10 22:48:56', '2024-11-10 22:48:56'),
(9, 'Awaiting Paperwork/Accounts/VAT', 7, '1', '0', '2024-11-10 22:49:22', '2024-11-10 22:49:22'),
(10, 'Client Not Responding', 7, '1', '0', '2024-11-10 22:49:41', '2024-11-10 22:49:41'),
(11, 'Waiting for Credentials', 7, '1', '0', '2024-11-10 22:49:57', '2024-11-10 22:49:57'),
(12, 'Bookkeeping Not Completed', 7, '1', '0', '2024-11-10 22:50:12', '2024-11-10 22:50:12'),
(13, 'To Be Reviewed', 1, '1', '0', '2024-11-10 22:51:55', '2024-11-10 22:51:55'),
(14, 'Draft Sent 2', 1, '1', '0', '2024-11-10 22:52:10', '2025-02-10 07:06:31'),
(15, 'Customer Processing', 1, '1', '0', '2024-11-10 22:52:24', '2024-11-10 22:52:24'),
(16, 'Draft Sent 1 ', 2, '1', '0', '2024-11-10 22:52:52', '2025-02-10 07:03:10'),
(17, 'Update Sent', 2, '1', '0', '2024-11-10 22:53:06', '2024-11-10 22:53:06'),
(18, 'Filed with Companies House and HMRC', 2, '1', '0', '2024-11-10 22:53:20', '2024-11-10 22:53:20'),
(19, 'Filed with Companies House', 2, '1', '0', '2024-11-10 22:53:35', '2024-11-10 22:53:35'),
(20, 'Filed with HMRC', 2, '1', '0', '2024-11-10 22:53:48', '2024-11-10 22:53:48'),
(21, 'WIP - Customer Reviewed & To be Updated', 1, '1', '1', '2025-02-01 12:10:19', '2025-02-06 13:17:37');

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
(2, 13, '1', '0', '2025-04-03', '2025-03-31', 'M_00001', 34, NULL, NULL, '2025-04-03', '0', '2025-04-03 14:51:49', '2025-04-03 14:51:49');

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
(1, 2, '1743691908967-Clipboard - December 3, 2024 6_04 PM.png', 'Clipboard - December 3, 2024 6_04 PM.png', 'image/png', 240236, 'https://outbooksglobal.sharepoint.com/sites/SharePointOnlineforJobManagement/Shared%20Documents/JobManagement/CUST82_CLIENT39_JOB13/CUST82_CLIENT39_JOB13_MISSING_LOG_2/Clipboard%20-%20December%203,%202024%206_04%20PM.png', '2025-04-03 14:51:49', '2025-04-03 14:51:55');

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
(1, 13, '0', 'Q_00001', '0', NULL, '2025-04-03', '0', NULL, NULL, '2025-04-03', '0', '2025-04-03 15:00:38', '2025-04-03 15:00:38');

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
(1, 'Super Admin', 'SUPERADMIN', '45:00', '1', '1', '2024-06-28 11:59:13', '2025-02-06 13:15:07'),
(2, 'Admin', 'ADMIN', '45:00', '1', '1', '2024-06-28 11:59:22', '2025-02-06 13:15:07'),
(3, 'Processor', 'PROCESSOR', '45:00', '1', '1', '2024-06-28 12:05:34', '2025-02-06 13:15:07'),
(4, 'Account Manager', 'MANAGER', '45:00', '1', '1', '2024-09-07 09:17:08', '2025-02-08 13:27:26'),
(5, 'Leadership', 'LEADERSHIP', '45:00', '1', '1', '2024-09-07 09:17:08', '2025-02-06 13:15:07'),
(6, 'Reviewer', 'REVIEWER', '45:00', '1', '1', '2024-09-07 09:17:38', '2025-02-06 13:15:07'),
(8, 'Management', 'MANAGEMENT', '45:00', '1', '0', '2024-10-14 09:00:37', '2025-02-06 13:15:16'),
(9, 'Support', 'SUPPORT', '45:00', '1', '0', '2024-10-22 22:03:17', '2025-02-06 13:15:13');

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
(4, 4, '2024-09-12 12:13:22', '2024-11-08 15:32:06'),
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
(4, 16, '2024-10-07 08:30:15', '2024-11-08 15:32:06'),
(4, 13, '2024-10-09 10:22:48', '2024-11-08 15:32:06'),
(4, 17, '2024-10-09 10:22:48', '2024-11-08 15:32:06'),
(4, 20, '2024-10-09 10:22:48', '2024-11-08 15:32:06'),
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
(8, 28, '2024-10-15 04:25:36', '2024-11-08 15:32:41'),
(9, 29, '2024-10-22 22:03:17', '2024-11-08 15:33:09'),
(9, 30, '2024-10-22 22:03:17', '2024-11-08 15:33:09'),
(9, 31, '2024-10-22 22:03:17', '2024-11-08 15:33:09'),
(9, 32, '2025-03-30 15:50:06', '2025-03-30 15:50:06'),
(4, 1, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 2, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 3, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 5, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 6, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 7, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 8, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 9, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 10, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 11, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 12, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 14, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 15, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 18, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 19, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 21, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 22, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 23, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 24, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 25, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 26, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 27, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(4, 28, '2024-11-08 15:32:06', '2024-11-08 15:32:06'),
(8, 25, '2024-11-08 15:32:41', '2024-11-08 15:32:41'),
(8, 26, '2024-11-08 15:32:41', '2024-11-08 15:32:41'),
(8, 27, '2024-11-08 15:32:41', '2024-11-08 15:32:41'),
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
(2, 3, '2025-04-04 05:15:53', '2025-04-04 05:15:53'),
(2, 2, '2025-04-04 05:15:53', '2025-04-04 05:15:53'),
(2, 1, '2025-04-04 05:15:53', '2025-04-04 05:15:53'),
(2, 9, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 10, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 11, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 13, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 14, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 15, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 16, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 17, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 18, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 19, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 20, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 21, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 22, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 23, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 24, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 29, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 30, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 31, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 32, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 25, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 26, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 27, '2025-03-29 14:17:27', '2025-03-29 14:17:27'),
(2, 28, '2025-03-29 14:17:27', '2025-03-29 14:17:27');

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
(9, 'Demo', '0', '1', '2025-03-30 11:48:08', '2025-03-30 11:48:08'),
(10, 'Vikas test', '0', '1', '2025-03-30 14:33:31', '2025-03-30 14:33:31');

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
(1, 1, 'System Super', 'Super Admin', 'superadmin@gmail.com', NULL, '1234567891', '$2a$10$ekMKJcAGvIiNIUrg0E3W5uZdoQsDrZUaZyw/p4XLb9/nS7WCJS3OK', NULL, '1', '1', 0, '2024-06-28 12:02:41', '2025-04-05 12:22:23', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTc0Mzg1NTc0MywiZXhwIjoxNzQzODkxNzQzfQ.TNiqmQN4JgVg1IWWGxYSr5vZKDfgHssT35qHbQyy0q0'),
(2, 1, 'Amit', 'Agarwal', 'amit@outbooks.com', 44, '5777777777', '$2a$10$lHTJ1oq6ESX/pzbzZZtkCuq5AEco8HaPoEtx2ajUt96gq6GezvWPu', '45:00', '1', '1', 1, '2024-07-08 07:25:41', '2025-04-03 13:55:35', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTc0MzY4ODUzNSwiZXhwIjoxNzQzNzI0NTM1fQ.qZs4UBKrCJlh-1TLNlJ9AQ3dwDVsY-ls-x-Xe8ghZOU'),
(3, 1, 'Ajeet', 'Ajeet', 'Ajeet@outbooks.com', NULL, '5777777777', '$2a$10$lQDJwmTJHLByytnG0SaIcOskd3II2HWFL5nYzNK29G3JV3G6nUwmW', NULL, '1', '1', 1, '2024-07-08 07:25:41', '2025-02-06 13:11:05', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcyODk4MjQ0NiwiZXhwIjoxNzI5MDE4NDQ2fQ.1U5gl6v26iwHHcMR42HQLLv9kJGsY366R77O9hD3t4Q'),
(4, 8, 'Vikas', 'Patel', 'vikaspnpinfotech@gmail.com', NULL, '9993034106', '$2a$10$T0UWcmLDhl.kFAfLvPDbUuCGEdstSD1taXGjUao1sE.kEgIYnN6pC', NULL, '1', '0', 1, '2024-10-14 15:42:25', '2024-12-16 14:31:20', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQsImlhdCI6MTczNDM1OTQ4MCwiZXhwIjoxNzM0Mzk1NDgwfQ.9iJaadEqnur_xO2QGZo2e3MehQ3Nvjlfppj5Sy5b3NE'),
(5, 4, 'shk', 'hu', 'accountmanager@gmail.com', NULL, '2777777777', '$2a$10$NSS0.c3FvdBSfGG2u624U.l.JyHEhy1eS5VjX/YYXkd5dwB/MwVF.', NULL, '1', '0', 2, '2024-10-22 10:12:19', '2025-04-02 13:28:34', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImlhdCI6MTc0MzYwMDUxNCwiZXhwIjoxNzQzNjM2NTE0fQ.bwwx40ebE4y_evOY5ktNRdNEcfPAICn_U8vkBr1eRcI'),
(6, 3, 'proce', 'pro', 'pro@gmail.com', NULL, '2777777777', '$2a$10$ScoANvWK5A2b7a3xogO0LubYkjJOWE3mB1AnbSkNAMY4/XDr4HBcq', NULL, '1', '0', 2, '2024-10-22 11:33:47', '2024-10-23 12:17:27', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYsImlhdCI6MTcyOTY4NTg0NywiZXhwIjoxNzI5NzIxODQ3fQ.8zXVqW0vX-6Fl16exT24YAmP0UrPBnlEipskEFwOuOc'),
(7, 4, 'Abhishek', 'Singh', 'abhishek.singh@outbooks.com', NULL, '07932337282', '$2a$10$zwRlpDZOHRM35YVOcft5bO8tPl63/UiFfotKWm/TMeeDDebYRYhHS', '00:00', '1', '0', 1, '2024-10-22 22:37:14', '2025-04-01 09:34:30', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjcsImlhdCI6MTc0MzUwMDA3MCwiZXhwIjoxNzQzNTM2MDcwfQ.75pxvP_r7YYblI2_Tf-ZLM1-4tNrbjxvVn-cMUHpZfI'),
(8, 4, 'Lavesh', 'Premani', 'lavesh.premani@outbooks.com', NULL, '07932337282', '$2a$10$iGCpnOIuu.ipfP61Z8umM.RkJYpuzIqjT/1vT3cZRrRP8HCqtprmq', '00:00', '1', '0', 1, '2024-10-22 22:38:10', '2025-03-20 07:05:21', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTc0MjQ1NDMyMSwiZXhwIjoxNzQyNDkwMzIxfQ.6fyHeGn9Mc1gT--wiUQ0ET742o4LTlxF6WVQHCJgbmE'),
(9, 4, 'Hitixa', 'Raja', 'hitixa.raja@outbooks.com', NULL, '07932337282', '$2a$10$MUGz4gdRWJw60IjPAxnMau4wgwKMS1fv1qUMw3sxVFd4QqLjdd562', '00:00', '1', '0', 1, '2024-10-22 22:38:39', '2025-03-18 09:05:42', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjksImlhdCI6MTc0MjI4ODc0MiwiZXhwIjoxNzQyMzI0NzQyfQ.WnzZUQyEkGOtCSSFKUGnCJ2p0u8pUppWW5CALoR_b0s'),
(10, 4, 'Abhishek', 'Mangal', 'abhishek.mangal1@outbooks.com', NULL, '07932337282', '$2a$10$OgpM32lciSVidkqg0WHf1uLVYk35jdMfEYZVSYaWhqIR6D05SALJW', '00:00', '1', '0', 1, '2024-10-22 22:39:06', '2025-03-31 06:03:50', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJpYXQiOjE3NDM0MDEwMzAsImV4cCI6MTc0MzQzNzAzMH0.jVSiIWunHNuNpkYoiXrRkm6ByYX9ehPswIBVhXoM0RA'),
(11, 4, 'Ankit', 'Gupta', 'ankit.gupta@outbooks.com', NULL, '07932337282', '$2a$10$SIJMFK5k/woLfwqfEJGMruiO6.f5oZwnCBb5S9zhmoPR/MiVI5c6K', '00:00', '1', '0', 1, '2024-10-22 22:39:35', '2025-03-17 09:28:43', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjExLCJpYXQiOjE3NDIyMDM3MjIsImV4cCI6MTc0MjIzOTcyMn0.WV-qU2Z3AcqVc6Gt57tCdhZw7NgKjx8hnUMOc4XwK8g'),
(12, 8, 'Ravinder', 'Singh', 'ravinder.singh@outbooks.com', NULL, '07932337282', '$2a$10$lLu6RcHvfrCQBhQ58tzT0OWBKZ.oqfhuRZRqG1H5D8AHUKU5NJ06e', NULL, '1', '0', 1, '2024-10-22 22:40:45', '2025-03-19 09:00:19', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJpYXQiOjE3NDIzNzQ4MTksImV4cCI6MTc0MjQxMDgxOX0.5FtmU4R50L47RrOBSSlwp9giCvveYj_lRDIt3wnVQls'),
(13, 8, 'Rohit', 'Roy', 'Rohit.Roy@outbooks.com', NULL, '07932337282', '$2a$10$tHPF.uDiTuq9ioPBJS5Fv.8Vdc0QtpUFDmMCNSwGz22WsV.lRcMTi', NULL, '1', '0', 1, '2024-10-22 22:41:43', '2025-02-18 10:22:37', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEzLCJpYXQiOjE3Mzk4NzQxNTcsImV4cCI6MTczOTkxMDE1N30.3vRGofWFF7M_OSQ-WKPjT4F-EI8iZKnD_2W_WlCaDUs'),
(14, 4, 'Sonu', 'Kumar', 'sonu.kumar@outbooks.com', NULL, '07932337282', '$2a$10$6K5PDgAMGW0HY3mQw.cmWe2D7GtfYLb.snby0OuOhd4mIZFWDqZUa', '00:00', '1', '0', 1, '2024-10-22 22:42:45', '2025-03-21 07:56:55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE0LCJpYXQiOjE3NDI1NDM4MTUsImV4cCI6MTc0MjU3OTgxNX0.EDjdN4Ko9hvT8rUR7A-i5OS_rhlnc0xHSrtDDIPfvGY'),
(15, 4, 'Amit', 'Singh', 'amit.singh@outbooks.com', NULL, '07932337282', '$2a$10$MibNCLM1WlsiiwsCcLdgiuxG0mLMJSGeVoIlSsXLgx.DbcuMhovvO', '00:00', '1', '0', 1, '2024-10-22 22:43:20', '2025-03-26 09:13:06', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE1LCJpYXQiOjE3NDI5ODAzODYsImV4cCI6MTc0MzAxNjM4Nn0.Dro7pSRIZCOOp0L_Q7Q8oBAp4sBuKu_LKOTdUvuv-_g'),
(16, 8, 'Mohit', 'Aneja', 'Mohit.Aneja@outbooks.com', NULL, '07932337282', '$2a$10$MxZgw1b5TORjQdfTAvNNSO4.AMSemelSfjcW2Cn31ldwWxHcr9qRq', NULL, '1', '0', 1, '2024-10-22 22:57:18', '2024-10-22 22:57:18', NULL),
(17, 9, ' Nidhi', 'Agarwal', 'Nidhi.Agarwal@outbooks.com', NULL, '7932337282', '$2a$10$hLKMdVm7R4SQIyq00G805uApx3XinS3UZJ76xVGLIXcJwwiCGzYEi', '00:00', '1', '0', 1, '2024-10-23 21:07:27', '2024-12-02 13:31:39', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE3LCJpYXQiOjE3MzA4ODg3NTcsImV4cCI6MTczMDkyNDc1N30.2ql5FppgPrHHdQmVg51JNYo6R7wgdYPAhewZQTWgEIM'),
(18, 8, 'nikita', 'bhagat', 'nikitabhagat.wpress@gmail.com', 44, '', '$2a$10$EkNpwjP6u9sWzraz8k5nDekMZ4fmniL3dk/BGXQ4cqPaj6T6.0ZWW', NULL, '1', '0', 2, '2024-10-24 08:41:16', '2024-10-25 15:48:04', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE4LCJpYXQiOjE3Mjk4NzEyODQsImV4cCI6MTcyOTkwNzI4NH0.wEoKE3Xa2mG7YqNW_PtdfJRXAEISKtxY7ueaxpDdVD0'),
(19, 1, 'Dheeraj', 'Prakash', 'Dheeraj.Prakash@outbooks.com', NULL, '5777777777', '$2a$10$lQDJwmTJHLByytnG0SaIcOskd3II2HWFL5nYzNK29G3JV3G6nUwmW', NULL, '1', '0', 1, '2024-07-08 07:25:41', '2024-11-11 10:28:05', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTcyODk4MjQ0NiwiZXhwIjoxNzI5MDE4NDQ2fQ.1U5gl6v26iwHHcMR42HQLLv9kJGsY366R77O9hD3t4Q'),
(20, 6, 'Pradeep', 'Soni', 'pradeep.soni@outbooks.com', 91, '7976410483', '$2a$10$7QO7cYoGVE95pElfejr3QOH7f.FtNWAnuoxlDARhjfjqBIYxmLkS6', '45:00', '1', '0', 7, '2024-11-18 09:19:20', '2025-04-01 09:52:20', NULL),
(22, 3, 'Vanshika ', 'Aggarwal', 'vanshika.agrawal1@outbooks.com', 91, '0', '$2a$10$RkGUue.CTUCQ0ZQ1IK/NtuzshjeYXcFsJBwCADGcjlEMStq3Z1nAe', '45:00', '1', '0', 11, '2024-11-18 13:09:02', '2024-11-18 13:09:02', NULL),
(23, 6, 'Dheeraj', 'Prajapati', 'Dheeraj.prajapati@outbooks.com', 91, '9873170113', '$2a$10$8IeSzdzfkNxEDN1e9TULAe8yLYvIMbiUDF0bA6nuScLRsu4Kdmlge', '45:00', '1', '0', 15, '2024-11-18 15:51:58', '2024-11-18 15:51:58', NULL),
(24, 3, 'Khushi', 'Kaneriya', 'Khushi.kaneriya@outbooks.com', 91, '9873170113', '$2a$10$gzCtxy15ZaB2ndBT0krEO.xbUi47U4q6Zr2G.ho006gNzECuZWLB2', '45:00', '1', '0', 15, '2024-11-18 16:51:51', '2024-11-18 16:51:51', NULL),
(25, 3, 'Kanav', 'Jaglan', 'kanav.jaglan@outbooks.com', 91, '1111111111', '$2a$10$7J3iPmC3p06PwnzJc4h9Me8.InLOFsyAB0A5QFv.fcFONoRpj/cRW', '45:00', '1', '0', 8, '2024-11-19 16:10:40', '2024-11-19 16:10:40', NULL),
(26, 3, 'Kamal', 'Jatav', 'kamal.jatav@outbooks.com', 91, '9910705144', '$2a$10$vVCWCgn723owgZ9jhDs0nOFkHug1UKs0w8FrY1sbJ2f/1j7933eUW', '45:00', '1', '0', 14, '2024-11-19 17:23:10', '2025-03-18 08:09:06', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI2LCJpYXQiOjE3NDIyODUzNDYsImV4cCI6MTc0MjMyMTM0Nn0.8lSMnoHTH4yZuBBslvPY6ejmOG5sdZCGA3YSoyToTVM'),
(27, 3, 'Kripa Shankar', 'Saxena', 'kripashankar.saxena@outbooks.com', 91, '9654282850', '$2a$10$nUVJwGkKWL4VJtBlP8.xX.GcCGHYLCF2AfE7a1barCyLx2zFA2EJy', '45:00', '1', '0', 10, '2024-11-20 07:57:49', '2024-11-20 07:57:49', NULL),
(28, 6, 'Test ', 'User', 'testuserv@outbooks.com', 91, '9999999999', '$2a$10$AYusp1mOCJR9xHzekwmdsO0Co3qfR4jUunus5L7GyvVrAztP3PGZ6', '45:00', '0', '0', 1, '2024-11-23 12:55:16', '2024-11-25 14:14:14', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI4LCJpYXQiOjE3MzI1NDA4MzYsImV4cCI6MTczMjU3NjgzNn0.PtWeCY6CO_pSlCXwyGWH03hmEb_mPHWwJ9td-N5b13w'),
(29, 8, 'Narayan', 'Yadav', 'Narayan.Yadav@outbooks.com', 44, '9999555588', '$2a$10$./mTsSZ9/I5ovVC9gaXlL.aKT/ltQ65NxKG7DjpK.3Qb6PtqL.XUW', '45:00', '1', '0', 1, '2024-11-25 14:09:49', '2025-01-06 05:53:26', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI5LCJpYXQiOjE3MzYxNDI4MDYsImV4cCI6MTczNjE3ODgwNn0.Fz6osPgpqRe9zJcvWCpQNbHEbUTVpsWMnVgD8v12URo'),
(30, 4, 'Vikas', 'test', 'vikasptl17@gmail.com', 44, '7932337282', '$2a$10$jV8Z4eeffChWZ019d.maXOMeqzr8O.2haYXuSHbLI/Y4IhdnaoGN.', '45:30', '1', '0', 1, '2024-11-25 17:39:41', '2024-12-16 14:36:18', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMwLCJpYXQiOjE3MzQzNTk3NzgsImV4cCI6MTczNDM5NTc3OH0.lzSZkgV2kWskvdQx3iKZcwuaQ9DToLFOUiEYhd5Phmc'),
(31, 3, 'Kshitiz', 'Kumar', 'kshitiz.kumar@outbooks.com', 91, '123567890', '$2a$10$0FMW1r6UqXrjLsru78PJ.e/tm9kruE6peFbbaG26437cg5vl3IN9C', '45:00', '1', '0', 10, '2024-11-28 07:34:34', '2024-11-28 07:34:34', NULL),
(32, 3, 'Ankur', 'Shukla', 'ankur.shukla@outbooks.com', 91, '', '$2a$10$95cc.xs.DQQEccuLVHiJfOx9zr4Ilcn7MhkSSBNtf7MoZ30deNP/u', '45:00', '1', '0', 14, '2024-11-28 12:38:23', '2024-11-28 12:38:23', NULL),
(33, 9, 'Test Nidhi', 'IGNORE2345678', 'nidhis2e@gmail.com', 44, NULL, '$2a$10$NBDpsvOtN7OnkrfjAIYVdu.20NMjtrKwlpkmlXIFR/KDgfZ9H2PtK', '45:00', '1', '0', 1, '2024-12-02 13:34:54', '2024-12-02 13:35:27', NULL),
(34, 4, 'vikas for', 'test', 'vikasfortest@gmail.com', 44, '7777788888', '$2a$10$XSSRlO1fTLBfH6fbDY5yoemSUOb441QEQfkJ34OupJyBtFLVOg5Hi', '45:00', '1', '0', 1, '2024-12-04 14:52:48', '2025-04-03 14:45:10', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM0LCJpYXQiOjE3NDM2OTE1MTAsImV4cCI6MTc0MzcyNzUxMH0.t-i6VIIHV-k2iN4jYufGUuvGrkbw_2kJvBaETUTk_Kk'),
(35, 3, 'vikas for', 'test2', 'vikasfortest2@gmail.com', 44, '7777788888', '$2a$10$vfzfp.GTdcek7UnzCW0wme09.mu.dreQdtW/iACOE.PJAut2CLAI.', '45:00', '1', '0', 1, '2024-12-04 14:55:51', '2025-03-27 15:31:52', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM1LCJpYXQiOjE3NDMwODk1MTIsImV4cCI6MTc0MzEyNTUxMn0.u3vQjKN1FSSVMSkq8E9uM0GCJ6a-56Q1q7ZWg4JcJAQ'),
(36, 8, 'vikas for', 'testing', 'vikastesting@gmail.com', 44, '7898342323', '$2a$10$o.wdCSasiJsvKbpD0FGmwekh3MMTXUMd/ZYQm1EkBu9auZ2BZMFKe', '45:00', '1', '0', 1, '2024-12-04 15:11:12', '2025-03-27 15:03:58', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM2LCJpYXQiOjE3NDMwODc4MzgsImV4cCI6MTc0MzEyMzgzOH0.XavuWm7IVKR0O0xaBjDxH-XTmPamzAs8jzw0BK8M7fc'),
(37, 4, 'Sabiha', 'Ansari', 'sabiha.ansari@outbooks.com', 91, '123456789', '$2a$10$LyZgTnI6e/UevPlH7UevceeGZMWWAleFWZmzGMiTI/6gmwR1xogFy', '45:00', '1', '0', 1, '2024-12-23 15:13:02', '2024-12-24 13:47:34', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM3LCJpYXQiOjE3MzUwNDgwNTQsImV4cCI6MTczNTA4NDA1NH0.VLvZHLctFHxpAcMmtxjS1Z3afDncCkP9IU35RNeQWqU'),
(38, 4, 'Rajesh', 'Bhardwaj', 'rajesh.bhardwaj@outbooks.com', 91, '123456789', '$2a$10$GfUQvke5dT0uFAKTwyuw6.5HsgceD1Qvk0EaOBqa2HY3XKv2Ru6/.', '45:00', '1', '0', 1, '2024-12-23 15:14:01', '2024-12-23 15:14:01', NULL),
(39, 4, 'Gaurav', 'Mehra', 'gaurav.mehra@outbooks.com', 91, '123456789', '$2a$10$Pu2wWTVxfkxfHWNR/pqV3eIBVkRHLBL5gFKZhcRMu/FMZ4ndIek/a', '45:00', '1', '0', 1, '2024-12-23 15:14:56', '2024-12-24 15:32:45', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjM5LCJpYXQiOjE3MzUwNTQzNjUsImV4cCI6MTczNTA5MDM2NX0.DZHk3XuxI2uPnlys7gAbrVMOJlO5_Pfu13JHsHIZd04'),
(40, 4, 'Sandhya', 'Bhardwaj', 'sandhya.bhardwaj@outbooks.com', 91, '123456789', '$2a$10$WwnZIxcf0QmqFhsJmTrv7.vZTuIW1A/oGArXJ7ZR635qu.PFwBhUO', '45:00', '1', '0', 1, '2024-12-23 15:15:58', '2025-01-02 08:21:22', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQwLCJpYXQiOjE3MzU4MDYwODIsImV4cCI6MTczNTg0MjA4Mn0.Esl6RJ8qmxx1UvUwTQ9mHQ9_BYlPAFCKIJ2HbFv48Wo'),
(41, 9, 'Hemant', 'Mehta', 'hemant.mehta@outbooks.com', 44, '123456789', '$2a$10$lraWt9bQjnxJi0SrTpGOKua8CHkBCTRAn64qjeF9Jkx9JQowXDOwS', '45:00', '1', '0', 1, '2025-01-07 12:18:49', '2025-03-28 11:27:25', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQxLCJpYXQiOjE3NDMxNjEyNDUsImV4cCI6MTc0MzE5NzI0NX0.BUcGqZzI09f7ZpLB8c2K8OQxQnjkOTOy0jaB5u__lGQ'),
(42, 4, 'Mauli', 'Mehta', 'mauli.mehta@outbooks.com', 44, '123456789', '$2a$10$UIwIu4t6qjBZaBjG2wq0WOW.uPupr12oZy71987ncW.2Zu4iLBBDe', '45:00', '1', '0', 1, '2025-01-07 12:19:33', '2025-01-07 14:11:19', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJpYXQiOjE3MzYyNTkwNzksImV4cCI6MTczNjI5NTA3OX0.6qrM0wrBvopztPCwBylykp3TNxHxD7lZyJ3sAPqRVcs'),
(43, 4, 'Himanshu', 'Khattar', 'himanshu.khattar@outbooks.com', 44, '123456789', '$2a$10$ZtSYHVcnJnRY.m6DzbB6IOno2L7ex9BWVSgPKdmWOW/s73Y4q4Mqm', '45:00', '1', '0', 1, '2025-01-07 12:20:25', '2025-01-08 08:51:20', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQzLCJpYXQiOjE3MzYzMjYyODAsImV4cCI6MTczNjM2MjI4MH0.gzweMp_p8ij_fq3DwYliYmn0TttxFk6ZxstQWiiYEVg'),
(44, 8, 'Sachin', 'Daga', 'Sachin.Daga@outbooks.com', 44, NULL, '$2a$10$ImL1QsIjNX/TkutJw05Ez.T5chg1VTmQWWWEHZNCAxcR1Bp/FFpKK', '45:00', '1', '0', 2, '2025-03-17 09:29:50', '2025-03-31 06:02:24', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ0LCJpYXQiOjE3NDM0MDA5NDQsImV4cCI6MTc0MzQzNjk0NH0.1R-6kLe3n1-_30dt2ALnYyLG_PvMcxhm2b5sCSGj154'),
(45, 8, 'Anushree', 'R', 'Anushree@outbooks.com', 44, NULL, '$2a$10$H9ktdY0qOwkiB6BcrvX6deIvAEynU.tuy1gzx3Wbwelco.Z8x.IQ2', '45:00', '1', '0', 44, '2025-03-17 09:30:33', '2025-03-27 15:10:16', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ1LCJpYXQiOjE3NDMwODgyMTYsImV4cCI6MTc0MzEyNDIxNn0.W-c-eYWGVZVJps4ekUuk7B6zq7VfS6zZzfcjwNV5TWU'),
(46, 4, 'Lalita', 'Pal', 'Lalita.pal@outbooks.com', 44, '', '$2a$10$B4Ikc23apssEe.wDYe91uO1EBDShzYCqvAI08e02j2DiEF7A8b7Re', '45:00', '1', '0', 12, '2025-03-17 09:49:12', '2025-03-31 06:23:03', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ2LCJpYXQiOjE3NDM0MDIxODMsImV4cCI6MTc0MzQzODE4M30.lmQM4b7WrIeg6_OUmnF0NEDQTBhmmnOIsaWr7aShvRk'),
(47, 4, 'Tushar', 'Sharma', 'tushar.sharma@outbooks.com', 44, '', '$2a$10$9gQs./ST7Sk9ArAol2Jsx.Atowthuj99p/nVPbv5hiWX6ktbTjAJa', '45:00', '1', '0', 46, '2025-03-17 10:27:49', '2025-03-31 06:02:11', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ3LCJpYXQiOjE3NDM0MDA5MzEsImV4cCI6MTc0MzQzNjkzMX0.4hxRrKTkE4C13RMr95RqY1rQW4sChH09Ua9SudL-8gc'),
(48, 4, 'Anand', 'Vyas', 'anand.vyas@outbooks.com', 44, '', '$2a$10$NKL8m9TECcKdlBNG01Woluqq44LMsfsz72FBsXw0/WHmfap7si4BG', '45:00', '1', '0', 46, '2025-03-17 10:28:39', '2025-03-17 10:28:39', NULL),
(49, 3, 'Utsav', 'Taneja', 'utsav.taneja@outbooks.com', 44, '', '$2a$10$lZvdmiu0nCQFwPfRGPVnTecFxWhIfGGJyQ2Q3q6kp41L1hcz0tceW', '45:00', '1', '0', 10, '2025-03-17 10:44:02', '2025-03-31 06:34:16', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ5LCJpYXQiOjE3NDM0MDI4NTYsImV4cCI6MTc0MzQzODg1Nn0.IKB1M7H7adu7HnneqrjSlMs-4namE3PPoi7aXTcAI_k'),
(50, 4, 'Deepak', 'Singh', 'Deepak.Singh@outbooks.com', 44, '123456789', '$2a$10$8tuLGADI2WfsjKIygB5k/.xcGNxLuJvDsIm4AfOyZfmf9uB29uz.C', '45:00', '1', '0', 2, '2025-03-17 13:26:37', '2025-03-31 08:40:08', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUwLCJpYXQiOjE3NDM0MTA0MDgsImV4cCI6MTc0MzQ0NjQwOH0.3fSvT0nLI27I-2N-VCFt32fUJUueVsHqCaBDGODJV7A'),
(51, 4, 'Nishtha', 'Jain', 'Nishtha.Jain.@Outbooks.com', 44, '123456789', '$2a$10$E7SYXZgebo8TVsUYxl/7QO2TneItgW8cx0taZxK5Scd/4lUNZmE5G', '45:00', '1', '0', 2, '2025-03-17 13:27:27', '2025-03-17 13:27:27', NULL),
(52, 4, 'Robin', 'Bhaik', 'Robin.Bhaik@outbooks.com', 44, '123456789', '$2a$10$SRB/Xs8nAKEJ63IIWlTPiO.f7.eZ7RJfEgx5ZnvggG/r9hCBdctcq', '45:00', '1', '0', 2, '2025-03-17 13:28:31', '2025-03-19 08:58:22', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUyLCJpYXQiOjE3NDIzNzQ3MDIsImV4cCI6MTc0MjQxMDcwMn0.vAiot84ruEtL8klNeY0enPc6aSQ8Kz_i5Z5WWXbUOAo'),
(53, 4, 'Vivek', 'Singh', 'Vivek.Singh@outbooks.com', 44, '123456789', '$2a$10$1dxzRTRNsZogLZrEFUD3lue0ve1LNoAa2oz.yO2aWk.kzXLB/zgZa', '45:00', '1', '0', 2, '2025-03-17 13:29:13', '2025-03-31 06:12:19', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUzLCJpYXQiOjE3NDM0MDE1MzgsImV4cCI6MTc0MzQzNzUzOH0.Fn4or3LUz2f_6WxjBva2H05cnTK5uq_zQL1tvlX-4Jk'),
(54, 3, 'Mohammad', 'Kashif', 'Mohammad.kasif@outbooks.com', 44, '', '$2a$10$7P5Gb9zIBwag7xNhJfF0B.2ysDFlrS5ZnB.6URzvKePWHzz2WXmIK', '45:00', '1', '0', 15, '2025-03-17 13:38:59', '2025-03-17 13:38:59', NULL),
(55, 8, 'Elakkya', 'Vikas', 'elakkaya.vikas@outbooks.com', 44, '123456789', '$2a$10$HoUNnhAdrSSfAAcqRdbQT.EpFK1vlcSlCLtlfiR1p7woozBl4g8P2', '45:00', '1', '0', 55, '2025-03-17 13:51:40', '2025-03-28 11:27:59', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU1LCJpYXQiOjE3NDMxNjEyNzksImV4cCI6MTc0MzE5NzI3OX0.l8qCOH55i3n_TR0GrJ91ZBI1LjiwGwepdg5F3SSoBog'),
(56, 9, 'Kamlesh', 'Kumar', 'kamlesh.kumar@outbooks.com', 44, '123456789', '$2a$10$8nReVzxuoxJKY2qYvoG4PuE30t/lYsviMH50cU1OTrP3YwYnACUCy', '45:00', '1', '0', 2, '2025-03-17 13:58:22', '2025-03-20 07:56:55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU2LCJpYXQiOjE3NDI0NTc0MTUsImV4cCI6MTc0MjQ5MzQxNX0._gpLjdAx-80h_810ZZXyz-YygHvxnUuc4FHy_Kji9d4'),
(57, 3, 'Bharti', 'Setia', 'bharti.setia@outbooks.com', 44, '', '$2a$10$NpnY9i/qsIHqIupwmje7ROl0ODrteoudtfPKbY5qTFBziNB4G.bxy', '45:00', '1', '0', 9, '2025-03-18 09:12:30', '2025-03-18 09:12:30', NULL),
(58, 3, 'Sachin', 'Singh', 'Sachin.Singh1@outbooks.com', 44, '', '$2a$10$ET/BpPyD85MnsEgbeQNBieP5x8FG6QAb1hXUXq1YdXEKdfnoTu9qS', '45:00', '1', '0', 47, '2025-03-18 09:20:42', '2025-03-18 09:20:42', NULL),
(59, 4, 'Vikash ', 'Jaimini', 'vikash.jaimini@outbooks.com', 44, '', '$2a$10$Zq26klcKEaqL5dHXO8j4TeBTGoFMx7aP1J7kKzSHlj5AqvcNWGIVK', '45:00', '1', '0', 12, '2025-03-18 09:41:54', '2025-04-02 09:21:49', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjU5LCJpYXQiOjE3NDM1ODU3MDksImV4cCI6MTc0MzYyMTcwOX0.3SNc_GTw0LGLVBCtocsvrDIUlOQ1Q5az65EzsqxZdXA'),
(60, 4, 'Mohit', 'Kumar', 'mohit.kumar@outbooks.com', 44, '', '$2a$10$9I.BpZL9JFtKnUGn3IQz5e8SKYMBGeR15P6LtXIL2VyDx3pxZRze2', '45:00', '1', '0', 12, '2025-03-18 09:51:32', '2025-04-01 12:02:33', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYwLCJpYXQiOjE3NDM1MDg5NTMsImV4cCI6MTc0MzU0NDk1M30.jmklAhv90EqVjXff1CbXk4pCmUf7nJYn-Dq9S1kYRjU'),
(61, 4, 'Nishtha', 'Jain', 'nishtha.jain@outbooks.com', 44, '', '$2a$10$PQ./6R37r9SaVeLl7I.Iweub.5/BRcMv/JWIj/8vHpxMdeMtkZiLO', '45:00', '1', '0', 12, '2025-03-18 09:57:38', '2025-03-27 15:35:34', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYxLCJpYXQiOjE3NDMwODk3MzQsImV4cCI6MTc0MzEyNTczNH0.2YVzxDmUmYLzphbYav2uWK-h3kqsWyeyLi78x0k8RXQ'),
(62, 3, 'Sridhar', 'Kumar Thakur', 'Sridhar.Thakur@outbooks.com', 91, NULL, '$2a$10$1U2BAlAiUukCyQH/9o2lje1HJYKDRndYrsdiyamK7b9aiUjfmxVS.', '45:00', '1', '0', 50, '2025-03-18 11:30:02', '2025-03-18 11:30:26', NULL),
(63, 3, 'Satish', 'Khemchandani', 'Satish.Khemchandani@outbooks.com', 44, '', '$2a$10$GMp/6euZ.x3Czfy61AKXLOyGpfjB8tSAOzL09pMvKS7jGO9aSY52i', '45:00', '1', '0', 53, '2025-03-18 14:31:56', '2025-03-18 14:31:56', NULL),
(64, 3, 'Narayan ', 'Singh', 'narayan.singh@outbooks.com', 44, '', '$2a$10$Vk.UCZkbGkUufyhOcMUUdelatJGWdfOS06Zt0STmVFna/QZIX1y0q', '45:00', '1', '0', 53, '2025-03-18 14:32:47', '2025-03-18 14:32:47', NULL),
(65, 3, 'Ayushi', 'Jaiswal', 'Ayushi.Jaiswal@outbooks.com', 44, '', '$2a$10$EwHd8.TdgZjUt09rGH6N9ePxMZmQyfZ8aIoCMr3iUYgCgNzsYkE/.', '45:00', '1', '0', 53, '2025-03-18 14:38:50', '2025-03-18 14:38:50', NULL),
(66, 3, 'Moumita', 'Guha', 'Moumita.Guha@outbooks.com', 44, '', '$2a$10$emJnzX0hEDIolfaL1KKBIeddMg6gxiXL99kWNOZ35qXXymKdj6XSy', '45:00', '1', '0', 53, '2025-03-18 14:39:14', '2025-03-18 14:39:14', NULL),
(67, 3, 'Priya', 'Jangir', 'Priya.Jangir@outbooks.com', 44, '', '$2a$10$TjuutCpx2uWncbNMcIWuDe5t9p20CtH0OduLq.cOmjdaIDGnBK.Zm', '45:00', '1', '0', 53, '2025-03-18 14:39:39', '2025-03-18 14:39:39', NULL),
(68, 6, 'Vivek', 'Jangid', 'vivek.jangid@outbooks.com', 44, '', '$2a$10$1KxHx0etEJk6NFTSJfBR6u0tjI7TqaZK8rqQoIyK2Kk3m.UUUCVVK', '45:00', '1', '0', 59, '2025-03-19 03:47:06', '2025-03-19 03:50:32', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjY4LCJpYXQiOjE3NDIzNTYyMzIsImV4cCI6MTc0MjM5MjIzMn0.ly6nQ_G7bOZoaGXbBVs_12hH74X78zwKT_s8e--FfZI'),
(69, 3, 'Priya', 'Gupta', 'Priya.gupta@outbooks.com', 44, '', '$2a$10$25ciE6bbf1qYlwFppogNcurUBnn3wm3khS9hL6d5O.hl4XbvPWkMW', '45:00', '1', '0', 59, '2025-03-19 03:47:53', '2025-03-19 03:47:53', NULL),
(70, 3, 'Varun', 'Singh', 'varun.singh@outbooks.com', 44, '', '$2a$10$dQnoDwZJREuDcU.uRIeZUuUpd0uTOQ/7FeYV/o11.n3Or9SMkbuom', '45:00', '1', '0', 59, '2025-03-19 03:48:22', '2025-03-19 03:48:22', NULL),
(71, 3, 'manisha', 'Jain', 'manisha.jain@outbooks.com', 44, '', '$2a$10$4eNMWBRPOXu5dgNf2UGCV.4.mE7QoBN6LiXyqqcer1gcV2ycChexO', '45:00', '1', '0', 59, '2025-03-19 03:48:50', '2025-03-19 03:48:50', NULL),
(72, 3, 'Pankaj', 'Choudhary', 'pankaj.choudhary@outbooks.com', 44, '', '$2a$10$o3c6Sr8dzDkwd66IdsUf4uGJGqL8cu7b5CA14V/OJv1tujyOpo4Ki', '45:00', '1', '0', 59, '2025-03-19 03:49:31', '2025-03-19 03:49:31', NULL),
(73, 3, 'khushboo', 'somvanshi', 'khushboo.somvanshi@outbooks.com', 44, '', '$2a$10$YzSS6xw7OD/AXkZjQVKs..Fr.nDu9wReRzFGxOdEj9nHEwVrZRmTq', '45:00', '1', '0', 59, '2025-03-19 03:51:27', '2025-03-19 03:51:27', NULL),
(74, 3, 'Saumya', 'Agrawal', 'saumya.agrawal@outbooks.com', 44, '', '$2a$10$o5CyuAEOlcrsOgqvqtR81.mHSeg8Tofvj5Chf0AB6XWpRmI2xRZPW', '45:00', '1', '0', 59, '2025-03-19 03:53:17', '2025-03-19 03:53:17', NULL),
(75, 3, 'satyam', 'kumar', 'satyam.kumar@outbooks.com', 44, '', '$2a$10$NkUFG.F0gbjdvnVbSD7izeJY9BcQlrSH/OC.TacebhgmJtMe.HWQW', '45:00', '1', '0', 59, '2025-03-19 03:53:58', '2025-03-19 03:53:58', NULL),
(76, 3, 'Harun Saifi  ', 'Mohammad ', 'Harun.Saifi@outbooks.com', 44, '', '$2a$10$Uy5tiBLdACQ3LzkzFTb3Zu0dhrXwAR3sL1aKkVRPzijZEMExgs9xW', '45:00', '1', '0', 59, '2025-03-19 03:54:48', '2025-03-19 03:54:48', NULL),
(77, 3, 'Talib', 'Mohd ', 'Mohd.Talib@outbooks.com', 44, '', '$2a$10$z8ma5YVxl7YNPhCV6536Qerq7C1jpP/55ELnIQqkt8A8WJTrNEfbi', '45:00', '1', '0', 59, '2025-03-19 03:55:20', '2025-03-19 03:55:20', NULL),
(78, 3, 'Shreya', 'Gupta', 'shreya.gupta@outbooks.com', 44, '', '$2a$10$Oc4DyjySYdzE3/MWa7emnOeTonz2cAHwg/qd8DBSBDkExh7LTYg1.', '45:00', '1', '0', 59, '2025-03-19 03:55:51', '2025-03-19 03:55:51', NULL),
(79, 3, 'Aiswarya', 'VC', 'aiswarya.vc@outbooks.com', 44, '', '$2a$10$ApyPoSDs40H5dd1AGgIwl.EmsW6plU9.PxhsAHW8VA.P75zpvuQyG', '45:00', '1', '0', 59, '2025-03-19 03:56:42', '2025-03-19 03:56:42', NULL),
(80, 4, 'Bhakti', 'Kalambate', 'Bhakti.Kalambate@outbooks.com', 44, NULL, '$2a$10$6ILWvho6vi.68TsudeSIie7XQyT4Nj7eUlQESJZP3MYAzCOMjgKQC', '45:00', '1', '0', 59, '2025-03-19 03:57:27', '2025-03-19 03:58:31', NULL),
(81, 3, 'Shruti', 'Manwani', 'shruti.manwai@outbooks.com', 44, '', '$2a$10$ey/4usW9jH1lW09sEAxt0OY1qRJimBtTUzNEPJtCTxCJ6dZ3888BG', '45:00', '1', '0', 59, '2025-03-19 03:58:05', '2025-03-19 03:58:05', NULL),
(82, 3, 'Diksha', 'Garg', 'diksha.garg@outbooks.com', 91, '9983273805', '$2a$10$pQonz7vUC9tzSACj7iC1aeZYk7vCKN.D0mYw5fHdZXrPQkdC4Jw/S', '45:00', '1', '0', 61, '2025-03-19 06:43:53', '2025-03-19 06:43:53', NULL),
(83, 3, 'Sunny ', 'Thoriya', 'sunny.thoriya@outbooks.com', 91, '8758950063', '$2a$10$JLJ9pf3cEKw5w65fboevjepuPe4KR1HeXtPKBNh29oJAMcWA3ZIqa', '45:00', '1', '0', 61, '2025-03-19 06:44:48', '2025-03-19 06:44:48', NULL),
(84, 3, 'Kanika ', 'Gosian', 'kanika.gosain@outbooks.com', 91, '8860448775', '$2a$10$JTBKF4SYWWujJMxfuJFjRugbuvdAcdfZcVbr.qfkp2AglmkeAqrBG', '45:00', '1', '0', 61, '2025-03-19 06:45:35', '2025-03-19 06:45:35', NULL),
(85, 3, 'Vipasha', 'Santuka', 'vipasha.santuka@outbooks.com', 91, '9827664496', '$2a$10$rA9RTALeFfhSdPRCNPVar.jPo2iJ8qT9GLvfL7x.j5Tu7RwuMrylq', '45:00', '1', '0', 61, '2025-03-19 06:47:00', '2025-03-19 06:47:00', NULL),
(86, 3, 'Mudit', 'Yadav', 'mudit.yadav@outbooks.com', 44, '', '$2a$10$/OEY/pThkLaEXEUXNShaX.WkQUZKQKjHK9bSLMYdPvKjzarWaaS2.', '45:00', '1', '0', 61, '2025-03-19 07:11:39', '2025-03-19 07:11:39', NULL),
(87, 3, 'Shalini', 'Gudivada', 'shalini.gudivada@outbooks.com', 44, '', '$2a$10$Y6qog7QZYXXozakmmuC5YucbJh4rTyf2hhq.aQUMLAMW5XQOZSeQi', '45:00', '1', '0', 61, '2025-03-19 07:12:31', '2025-03-19 07:12:31', NULL),
(88, 4, 'Darshita', 'Trivedi', 'darshita.trivedi@outbooks.com', 44, '', '$2a$10$7jK2pBsSbNflq3xjzdGU/OGZyOKgfVqlb/ohRxTL2VLr4u2QPa61u', '45:00', '1', '0', 12, '2025-03-19 09:01:57', '2025-03-26 07:10:05', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjg4LCJpYXQiOjE3NDI5NzMwMDUsImV4cCI6MTc0MzAwOTAwNX0.nlxPbjD1urBAh1ObxY8FQqg8lTaFE4UNXv96tnTFNZc'),
(89, 3, 'Gaurav', 'Kumar', 'gaurav.kumar@outbooks.com', 91, '9650521233', '$2a$10$0VSl76kEaPyhGhfCwdZ6oeQcEBPpN.1URg6Vb.PfFgwGlxY2DjbDu', '45:00', '1', '0', 52, '2025-03-19 10:17:40', '2025-03-19 10:17:40', NULL),
(90, 3, 'Kanishka', 'Chhabra', 'Kanishka.Chhabra@outbooks.com', 44, '', '$2a$10$xdh4jrXeZP9fLx6AUQyW6eY3aB2RSgrTpKODmMDved7O./pw0xKe2', '45:00', '1', '0', 60, '2025-03-19 15:11:44', '2025-03-19 15:11:44', NULL),
(91, 3, 'Gaurav', 'Prajapat', 'Gaurav.Prajapat@outbooks.com', 44, '', '$2a$10$TVY/CbLRMAxaRW4XglvmIueite8OjxySeEZRQVxrvajqyepcx.6C.', '45:00', '1', '0', 60, '2025-03-19 15:12:34', '2025-03-19 15:12:34', NULL),
(92, 3, 'Mohd.', 'Irshad', 'Mohd.Irshad@outbooks.com', 44, '', '$2a$10$e0dyZMkYjTuGSqZruHo8k.nWTaY/AkLSTjZHIL.5bpWhQJlZ9xnqe', '45:00', '1', '0', 8, '2025-03-20 07:14:00', '2025-03-20 07:14:00', NULL),
(93, 3, 'Talib', 'Khan', 'talib.khan@outbooks.com', 44, '', '$2a$10$oJuG.3l0/BrFH4QV0RpSAOwVPEdTEErBw1VqqLTc2e0nlX2qnSRce', '45:00', '1', '0', 14, '2025-03-21 07:59:14', '2025-03-21 07:59:14', NULL),
(94, 2, 'Vikas', 'Patel', 'vikasfortest12@gmail.com', 44, NULL, '$2a$10$V2Kx4U22WD/OU8of9OJrpODRdiiMzH/.iEXo7H7eoa.4PsklFKzjy', '45:00', '1', '0', 1, '2025-03-21 14:15:02', '2025-04-04 05:16:54', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjk0LCJpYXQiOjE3NDM3NDM4MTQsImV4cCI6MTc0Mzc3OTgxNH0.RjBSPOKEfMj2C2efBFOrDA-poM2_CpfYQmZb7zTHAdU'),
(96, 2, 'New Vikas ', 'test', 'newvikas@gmail.com', 44, '', '$2a$10$S/zWBA8vA.J9.gs9ft6/ueLfIU9Ic8qe2ktwL7YVIr2.P7yQ2h3jW', '45:00', '1', '0', 1, '2025-04-03 15:31:05', '2025-04-03 15:31:42', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjk2LCJpYXQiOjE3NDM2OTQzMDIsImV4cCI6MTc0MzczMDMwMn0.Jx8QACbsgDE6M2mJlVCYt_KtyBQ0LxPHRbejO6e33UA');

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
(688, 1, '2025-04-05', 'permission', 9, ' updated the access for SUPPORT. Access Changes  Remove Permission (all_customers-view)', 'Super Admin System Super Super Admin  updated the access for SUPPORT. Access Changes  Remove Permission (all_customers-view) ', 'updated', '122.168.114.106', '2025-04-05 12:26:45', '2025-04-05 12:26:45');

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
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`id`, `name`, `service_id`, `job_type_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'test', 5, 1, '1', '2025-03-26 13:58:12', '2025-03-26 13:58:12'),
(2, 'ABC', 5, 1, '1', '2025-03-27 15:05:05', '2025-03-27 15:05:05'),
(3, 'account update', 5, 1, '1', '2025-03-28 11:18:14', '2025-03-28 11:18:14'),
(4, 'Review & FIle', 8, 2, '1', '2025-03-29 13:40:26', '2025-03-29 13:40:26'),
(5, 'Prepare, Review & File', 8, 3, '1', '2025-03-29 13:40:40', '2025-03-29 13:40:40'),
(6, 'File', 8, 4, '1', '2025-03-29 13:40:55', '2025-03-29 13:40:55'),
(7, 'test', 5, 9, '1', '2025-03-29 14:03:44', '2025-03-29 14:03:44'),
(8, 'ABC', 10, 26, '1', '2025-03-30 14:34:51', '2025-03-30 14:34:51'),
(9, 'Working paper - Jackie Format', 6, 7, '1', '2025-03-31 06:13:45', '2025-03-31 06:13:45'),
(10, 'Year End', 1, 21, '1', '2025-03-31 06:15:16', '2025-03-31 06:15:16'),
(11, 'BP flats', 1, 22, '1', '2025-03-31 06:51:23', '2025-03-31 06:51:23'),
(12, 'Year End', 1, 22, '1', '2025-03-31 13:55:55', '2025-03-31 13:55:55'),
(13, 'Checklist and draft', 1, 22, '1', '2025-04-01 09:59:55', '2025-04-01 09:59:55'),
(14, 'U Can Property Limited ', 1, 22, '1', '2025-04-01 12:19:06', '2025-04-01 12:19:06'),
(15, 'tewst', 7, 5, '1', '2025-04-03 14:50:05', '2025-04-03 14:50:05'),
(16, 'test', 8, 3, '1', '2025-04-03 15:35:29', '2025-04-03 15:35:29');

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
  `remark` text DEFAULT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '1' COMMENT '0: deactive, 1: active',
  `submit_status` enum('0','1') NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `timesheet`
--

INSERT INTO `timesheet` (`id`, `staff_id`, `task_type`, `customer_id`, `client_id`, `job_id`, `task_id`, `monday_date`, `monday_hours`, `tuesday_date`, `tuesday_hours`, `wednesday_date`, `wednesday_hours`, `thursday_date`, `thursday_hours`, `friday_date`, `friday_hours`, `saturday_date`, `saturday_hours`, `sunday_date`, `sunday_hours`, `remark`, `status`, `submit_status`, `created_at`, `updated_at`) VALUES
(1, 41, '1', 0, 0, 5, 13, '2025-01-06', '1:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-01-07 16:08:04', '2025-01-07 16:08:04'),
(2, 46, '1', 6, 6, 1, 2, '2025-03-17', '5:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-03-17 10:46:59', '2025-03-17 10:46:59'),
(4, 47, '1', 0, 0, 1, 2, '2025-03-17', '1:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '0', '2025-03-18 09:27:41', '2025-03-18 09:27:41'),
(9, 60, '2', 71, 38, 12, 14, '2025-03-31', '10:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-04-01 12:20:12', '2025-04-01 12:20:12'),
(7, 49, '2', 9, 7, 7, 9, '2025-03-17', '6:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-03-31 06:39:36', '2025-03-31 06:40:34'),
(8, 49, '1', 0, 0, 1, 2, '2025-03-17', '1:50', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1', '1', '2025-03-31 06:39:36', '2025-03-31 06:40:34');

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
  ADD UNIQUE KEY `trading_name` (`trading_name`),
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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `checklists`
--
ALTER TABLE `checklists`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `checklist_tasks`
--
ALTER TABLE `checklist_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `client_company_information`
--
ALTER TABLE `client_company_information`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `client_contact_details`
--
ALTER TABLE `client_contact_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `client_documents`
--
ALTER TABLE `client_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `client_industry_types`
--
ALTER TABLE `client_industry_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `client_job_task`
--
ALTER TABLE `client_job_task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `client_trustee_contact_details`
--
ALTER TABLE `client_trustee_contact_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT for table `customer_company_information`
--
ALTER TABLE `customer_company_information`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `customer_contact_details`
--
ALTER TABLE `customer_contact_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `customer_contact_person_role`
--
ALTER TABLE `customer_contact_person_role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `customer_documents`
--
ALTER TABLE `customer_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer_engagement_adhoc_hourly`
--
ALTER TABLE `customer_engagement_adhoc_hourly`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `customer_engagement_customised_pricing`
--
ALTER TABLE `customer_engagement_customised_pricing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `customer_engagement_fte`
--
ALTER TABLE `customer_engagement_fte`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `customer_engagement_model`
--
ALTER TABLE `customer_engagement_model`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `customer_engagement_percentage`
--
ALTER TABLE `customer_engagement_percentage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `customer_paper_work`
--
ALTER TABLE `customer_paper_work`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `customer_services`
--
ALTER TABLE `customer_services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `customer_service_task`
--
ALTER TABLE `customer_service_task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customer_source`
--
ALTER TABLE `customer_source`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `customer_sub_source`
--
ALTER TABLE `customer_sub_source`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `drafts`
--
ALTER TABLE `drafts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `incorporation_in`
--
ALTER TABLE `incorporation_in`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `internal`
--
ALTER TABLE `internal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `job_documents`
--
ALTER TABLE `job_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_types`
--
ALTER TABLE `job_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `line_managers`
--
ALTER TABLE `line_managers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `master_status`
--
ALTER TABLE `master_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `missing_logs`
--
ALTER TABLE `missing_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `missing_logs_documents`
--
ALTER TABLE `missing_logs_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `queries`
--
ALTER TABLE `queries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `queries_documents`
--
ALTER TABLE `queries_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `sharepoint_token`
--
ALTER TABLE `sharepoint_token`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `staffs`
--
ALTER TABLE `staffs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT for table `staff_logs`
--
ALTER TABLE `staff_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=689;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `sub_internal`
--
ALTER TABLE `sub_internal`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `task_timesheet`
--
ALTER TABLE `task_timesheet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `timesheet`
--
ALTER TABLE `timesheet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
