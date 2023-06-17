-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 20, 2023 at 04:28 PM
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
-- Table structure for table `candidate_info`
--

CREATE TABLE `candidate_info` (
  `Id_can` int(11) NOT NULL,
  `Id_event` int(11) NOT NULL,
  `User_id` int(11) DEFAULT NULL,
  `Name` char(255) DEFAULT NULL,
  `Surname` char(255) DEFAULT NULL,
  `Detail` char(255) DEFAULT NULL,
  `Img` char(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `candidate_info`
--

INSERT INTO `candidate_info` (`Id_can`, `Id_event`, `User_id`, `Name`, `Surname`, `Detail`, `Img`) VALUES
(0, 1, NULL, NULL, NULL, 'No vote', 'no_vote.png'),
(1, 1, 2, NULL, NULL, 'asd', '2twst.jpg'),
(2, 1, 4, NULL, NULL, 'asdsa', '1666111788849-test3.png');

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

-- --------------------------------------------------------

--
-- Table structure for table `participant`
--

CREATE TABLE `participant` (
  `Par_id` int(11) NOT NULL,
  `User_id` int(11) DEFAULT NULL,
  `Id_event` int(11) NOT NULL,
  `Email` char(255) DEFAULT NULL,
  `Password` char(255) DEFAULT NULL,
  `Token` char(255) DEFAULT NULL,
  `Authen` char(255) NOT NULL,
  `Vote` int(11) NOT NULL,
  `hash_vote` char(255) DEFAULT NULL,
  `P_hash` char(255) DEFAULT NULL,
  `c_hash` char(255) DEFAULT NULL,
  `ElecStatus` int(11) NOT NULL,
  `Date_vote` char(255) DEFAULT NULL,
  `Time_vote` char(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `participant`
--

INSERT INTO `participant` (`Par_id`, `User_id`, `Id_event`, `Email`, `Password`, `Token`, `Authen`, `Vote`, `hash_vote`, `P_hash`, `c_hash`, `ElecStatus`, `Date_vote`, `Time_vote`) VALUES
(0, 0, 0, 'admin@gmail.com', 'YWRtaW5AZ21haWwuY29t', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaW5mbyI6ImFkbWluQGdtYWlsLmNvbSIsImF1dGhlbiI6ImFkbWluIiwiaWF0IjoxNjY4MzI3NzUwfQ.A_7xSiTrDu9Pa-LrdiXVhehaLpHdYkx3yMOaHzAynkw', 'admin', 0, NULL, NULL, NULL, 0, NULL, NULL),
(1, 27, 1, 'teerann003+10@gmail.com', 'aXNyanplN2trOW80aWR3NTAwN24=', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaW5mbyI6InRlZXJhbm4wMDMrMTBAZ21haWwuY29tIiwiYXV0aGVuIjoic3RhZmYiLCJpYXQiOjE2NzkyNDYxNDZ9.m37mTqxz73nIK1DVHAjMREG4uoEcrenBd116aueCuf4', 'staff', 0, NULL, NULL, NULL, 0, NULL, NULL),
(2, 3, 1, 'teerann003@gmail.com', 'cTQwbG1xcmYzZ216NG90ZDd1MGhw', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaW5mbyI6InRlZXJhbm4wMDNAZ21haWwuY29tIiwiYXV0aGVuIjoicGFydGljaXBhbnQiLCJpYXQiOjE2NzkyNDYxNTB9.1vmB6h2sv8TeUZgMSXWz7um47sMj2TQD57nOgnebEFw', 'participant', 0, NULL, NULL, NULL, 0, NULL, NULL),
(3, 4, 1, 'resr@gmail.com', 'N2tqZXRjZDR1ZHBvc2ZxajRlZTZoZg==', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaW5mbyI6InJlc3JAZ21haWwuY29tIiwiYXV0aGVuIjoicGFydGljaXBhbnQiLCJpYXQiOjE2NzkyNDYxNTJ9.GCJ_BgY6TO3jivmxRA6nB0CWz0Ld2G75k0N-7kkwM5A', 'participant', 0, NULL, NULL, NULL, 0, NULL, NULL),
(4, 5, 1, 'resr2@gmail.com', 'dHU2bWZnMWJnYXVnbXRidGh3NDc=', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaW5mbyI6InJlc3IyQGdtYWlsLmNvbSIsImF1dGhlbiI6InBhcnRpY2lwYW50IiwiaWF0IjoxNjc5MjQ2MTUyfQ.kC52XEdoNhQawT-S8LYzQ9kRq5Xntweuxu8-xFJbym8', 'participant', 0, NULL, NULL, NULL, 0, NULL, NULL),
(5, 7, 1, 'A2@gmail.com', 'cmJydGtqM2Nnb2dkbHpkaWx2bG1uag==', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaW5mbyI6IkEyQGdtYWlsLmNvbSIsImF1dGhlbiI6InBhcnRpY2lwYW50IiwiaWF0IjoxNjc5MjQ2MTUzfQ.3hkoTJ0Ei62kjrYPhBZI3Y32vnFJAAS2hpYFnkUuepM', 'participant', 0, NULL, NULL, NULL, 0, NULL, NULL),
(6, 11, 1, 'A6@gmail.com', 'djdvczg2MGZhZ2Fma3c1MWR2cDZvOA==', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaW5mbyI6IkE2QGdtYWlsLmNvbSIsImF1dGhlbiI6InBhcnRpY2lwYW50IiwiaWF0IjoxNjc5MjQ2MTU0fQ.tlBtd_Se7f55KoRTdteVOFTG7joAg_LURl0cos8V6ps', 'participant', 0, NULL, NULL, NULL, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

CREATE TABLE `user_info` (
  `User_id` int(11) NOT NULL,
  `Name` char(255) DEFAULT NULL,
  `Surname` char(255) DEFAULT NULL,
  `Email` char(255) DEFAULT NULL,
  `Status_user` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_info`
--

INSERT INTO `user_info` (`User_id`, `Name`, `Surname`, `Email`, `Status_user`) VALUES
(0, 'Admin1', 'Admin1', 'admin@email.com', 0),
(1, 'staff', 'staff', 'staff@gmail.com', 0),
(2, 'Sirawit', 'KSN', 'jangod1150@gmail.com', 0),
(3, 'Teeranun', 'Swng', 'teerann003@gmail.com', 0),
(4, 'teerapat', 'Swngww', 'resr@gmail.com', 0),
(5, 'teerapat1', 'Swngww23', 'resr2@gmail.com', 0),
(7, 'ABCDEFG', 'ABBDD', 'A2@gmail.com', 0),
(11, 'A6', 'A6', 'A6@gmail.com', 0),
(12, 'A7', 'A7', 'A7@gmail.com', 0),
(13, 'A8', 'A8', 'A8@gmail.com', 0),
(16, 'teera2', 'teerasususu', 'teerann002@gmail.com', 0),
(17, 'admin2', 'admin2', 'admin2@gmail.com', 0),
(18, 'ABC1', 'C1', 'teerann003+1@gmail.com', 0),
(19, 'ABC12', 'C2', 'teerann003+2@gmail.com', 0),
(20, 'ABC13', 'C3', 'teerann003+3@gmail.com', 0),
(21, 'ABC14', 'C4', 'teerann003+4@gmail.com', 0),
(22, 'ABC15', 'C5', 'teerann003+5@gmail.com', 0),
(23, 'ABC16', 'C6', 'teerann003+6@gmail.com', 0),
(24, 'ABC17', 'C7', 'teerann003+7@gmail.com', 0),
(25, 'ABC18', 'C8', 'teerann003+8@gmail.com', 0),
(26, 'ABC19', 'C9', 'teerann003+9@gmail.com', 0),
(27, 'ABC20', 'C10', 'teerann003+10@gmail.com', 0),
(28, 'ABC21', 'D1', 'teerann003+11@gmail.com', 0),
(29, 'ABC22', 'D2', 'teerann003+12@gmail.com', 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `candidate_info`
--
ALTER TABLE `candidate_info`
  ADD PRIMARY KEY (`Id_can`,`Id_event`),
  ADD KEY `FK_PersonOrder` (`User_id`),
  ADD KEY `FK_PersonOrder2` (`Id_event`);

--
-- Indexes for table `event_info`
--
ALTER TABLE `event_info`
  ADD PRIMARY KEY (`Id_event`);

--
-- Indexes for table `participant`
--
ALTER TABLE `participant`
  ADD PRIMARY KEY (`Par_id`),
  ADD KEY `FK_user_par` (`User_id`),
  ADD KEY `Fk_event_par` (`Id_event`);

--
-- Indexes for table `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`User_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
