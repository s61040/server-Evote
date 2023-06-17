-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 19, 2023 at 06:16 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `elec_vote`
--

-- --------------------------------------------------------

--
-- Table structure for table `event_info`
--

CREATE TABLE `event_info` (
  `Id_event` int(11) NOT NULL,
  `User_id` int(11) NOT NULL,
  `Event_name` char(255) NOT NULL,
  `Event_detail` char(255) DEFAULT NULL,
  `Date_vote` char(255) DEFAULT NULL,
  `Time_start` char(255) DEFAULT NULL,
  `timeout` int(11) NOT NULL,
  `Time_end` char(255) DEFAULT NULL,
  `Results` int(11) NOT NULL,
  `status_event` char(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_info`
--

INSERT INTO `event_info` (`Id_event`, `User_id`, `Event_name`, `Event_detail`, `Date_vote`, `Time_start`, `timeout`, `Time_end`, `Results`, `status_event`) VALUES
(0, 0, 'admin', 'admin', NULL, NULL, 0, NULL, 0, '4'),
(1, 27, 'Test1', 'Test1detail', '2023-03-21', '00:00:00', 1, '23:59:00', 0, '0');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `event_info`
--
ALTER TABLE `event_info`
  ADD PRIMARY KEY (`Id_event`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
