-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 19, 2022 at 08:40 AM
-- Server version: 10.4.19-MariaDB
-- PHP Version: 7.4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `referral`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `user_img` varchar(500) NOT NULL,
  `name` varchar(50) NOT NULL,
  `father` varchar(100) NOT NULL,
  `cnic` varchar(100) NOT NULL,
  `mobile` varchar(100) NOT NULL,
  `address` varchar(200) NOT NULL,
  `khilafatText` varchar(100) NOT NULL,
  `bday` varchar(100) NOT NULL,
  `khilafat` varchar(100) NOT NULL,
  `murshad` int(11) NOT NULL,
  `certificate` varchar(500) NOT NULL,
  `joining` varchar(100) NOT NULL,
  `job` varchar(50) NOT NULL,
  `role` int(11) NOT NULL,
  `password` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `user_img`, `name`, `father`, `cnic`, `mobile`, `address`, `khilafatText`, `bday`, `khilafat`, `murshad`, `certificate`, `joining`, `job`, `role`, `password`) VALUES
(5, 'meetmrusama@gmail.com', 'uploads/images/0c6a2735-6bd6-444e-8c11-53ece9793560.png', 'Usama', 'Bashir', '45624-3254215-1', '03060854097', 'RedxSoft', 'Khilafat', '1997-07-16', '1997-07-16', 0, 'uploads/images/48de80c1-6628-405c-9663-2c176113ed20.png', '1997-07-16', '1', 1, ''),
(6, 'asdas@asd.asdsa', 'uploads/images/ba8c8777-07c6-4271-b5c7-d438b738c259.png', 'Redx', 'asdasd', 'asdasd', 'asdasd', 'asdasd', 'asdasd', '2022-07-18', '2022-07-18', 0, 'uploads/images/c2b5ea36-d7d4-45b2-a3b1-160ace2a9be5.png', '2022-07-18', '2', 1, ''),
(7, 'asdff@asd.asd', 'uploads/images/95dbfd33-e2ae-4422-b04c-f78c211193b9.png', 'Testing', 'asdasd', 'asdas', 'asdasd', 'asdsad', 'asdasd', '2022-07-18', '2022-07-18', 5, 'uploads/images/153560b2-d875-4e0b-9410-5d0db108fb52.png', '2022-07-18', '2', 2, ''),
(9, 'asdsad@asd.ffff', 'uploads/images/0769001b-9899-45ce-b514-18ad7deae06f.png', 'New', 'dfdsf', 'sdfsd', 'sdfsdf', 'sdfsdf', 'sdfsdf', '2022-07-18', '2022-07-18', 6, 'uploads/images/9f0cd888-0f52-40d9-9d89-856773ae719a.png', '2022-07-18', '3', 2, ''),
(10, 'fgh@sadf.sdf', 'uploads/images/9092cdf9-b28d-4d50-8741-3f6e4a1000f0.png', 'fghgfh', 'sdfsdf', 'sdfsdf', 'sdfsd', 'fsdfds', 'sdfsdf', '2022-07-18', '2022-07-18', 7, 'uploads/images/485cf7e0-6a8a-4633-90b9-991002e2cb18.png', '2022-07-18', '2', 2, ''),
(12, 'bnmnb@bnmnbm.nbm', 'uploads/images/892e8a74-0f97-45de-9fd9-6a956f8d4108.png', 'bnmnbm', 'bnmbn', 'mbnm', 'bnmnb', 'mbnmbnm', 'bnmbnm', '2022-07-18', '2022-07-18', 5, 'uploads/images/29083c46-84e4-41f3-b4d4-19f9bbad7fdd.png', '2022-07-18', '3', 2, ''),
(13, 'meemrusama@gmail.com', 'uploads/images/bb62069f-13d9-4929-96d3-ccadb461ef02.png', 'asdsa', 'asdsad', 'asdasd', 'asdasd', 'asdasd', 'asdasd', '2022-07-18', '2022-07-18', 5, 'uploads/images/0c95e06e-275f-4849-b956-5a35a1532902.png', '2022-07-18', '2', 2, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
