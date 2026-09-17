-- phpMyAdmin SQL Dump
-- Database: `events_db`
-- Host Container & Microfrontend Events Architecture

CREATE DATABASE IF NOT EXISTS `events_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `events_db`;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `github_id` VARCHAR(100) UNIQUE NOT NULL,
  `username` VARCHAR(100) NOT NULL,
  `name` VARCHAR(255) DEFAULT NULL,
  `email` VARCHAR(255) DEFAULT NULL,
  `avatar_url` TEXT DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `public_repos` INT DEFAULT 0,
  `role` ENUM('admin', 'creator', 'guest') DEFAULT 'creator',
  `is_approved` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`github_id`, `username`, `name`, `email`, `avatar_url`, `bio`, `public_repos`, `role`, `is_approved`) VALUES
('1001', 'anayap04', 'Paola Anaya', 'paola@anayap.tech', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&auto=format', 'Microfrontend Host Lead & Software Architect', 42, 'admin', 1),
('1002', 'alexrivera', 'Alex Rivera', 'alex@eventshq.io', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format', 'Event Creator & Lead Organizer', 18, 'creator', 1)
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE IF NOT EXISTS `events` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `url` TEXT NOT NULL,
  `description` TEXT,
  `category` VARCHAR(100) NOT NULL,
  `status` ENUM('active', 'draft', 'archived') DEFAULT 'active',
  `thumbnail` TEXT,
  `mfe_remote_url` TEXT,
  `created_by` VARCHAR(100) DEFAULT 'anayap04',
  `created_at` DATE NOT NULL,
  `last_modified` DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `slug`, `url`, `description`, `category`, `status`, `thumbnail`, `mfe_remote_url`, `created_by`, `created_at`, `last_modified`) VALUES
('7', 'Gender Reveal Martinez Gonzalez Family', 'gender-reveal-martinez-gonzalez-family', 'https://anayap.tech/reveal/', 'A private family gender reveal celebration page with event details and guest information.', 'Gender Reveal', 'active', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&h=340&fit=crop&auto=format', 'https://events.anayap.tech/remoteEntry.js', 'anayap04', '2026-09-17', '2026-09-17'),
('1', 'Rivera Family Baby Shower', 'rivera-baby-shower', 'https://babyshower.riveras.family', 'A private celebration page for our baby shower — RSVP, gift registry, venue details, and photo album for guests.', 'Baby Shower', 'active', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=340&fit=crop&auto=format', 'https://events.anayap.tech/remoteEntry.js', 'anayap04', '2026-07-15', '2026-09-10'),
('2', 'Q3 Product Leadership Offsite', 'product-leadership-offsite', 'https://offsite.internal.acme.co', 'Private agenda, session notes, speaker bios, and hotel info for the 3-day leadership conference in Sonoma.', 'Conference', 'active', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&h=340&fit=crop&auto=format', 'https://events.anayap.tech/remoteEntry.js', 'anayap04', '2026-06-01', '2026-09-05'),
('3', 'Sophie\'s 30th Birthday', 'sophie-30th-birthday', 'https://sophie30.party', 'Surprise birthday celebration for Sophie — venue surprise reveal on the day, RSVP tracking, and a shared memory wall.', 'Birthday', 'draft', 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&h=340&fit=crop&auto=format', 'https://experiences.anayap.tech/remoteEntry.js', 'alexrivera', '2026-08-20', '2026-09-12'),
('4', 'Chen & Nakamura Wedding', 'chen-nakamura-wedding', 'https://chennakamura.wedding', 'Wedding info hub with ceremony details, accommodation options, dietary preferences form, and a live photo stream for guests.', 'Wedding', 'active', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=340&fit=crop&auto=format', 'https://experiences.anayap.tech/remoteEntry.js', 'anayap04', '2026-03-10', '2026-08-28'),
('5', 'Morales Family Reunion 2026', 'morales-reunion-2026', 'https://moralesreunion.com', 'Annual family gathering page with potluck signup, activity schedule, directions to the lake house, and a photo booth uploader.', 'Family Reunion', 'active', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=340&fit=crop&auto=format', 'https://events.anayap.tech/remoteEntry.js', 'alexrivera', '2026-04-22', '2026-09-01'),
('6', 'Design Dept Farewell — Mia', 'design-farewell-mia', 'https://farewell.mia.internal', 'Team farewell for Mia Santos — a private tribute page where colleagues can leave messages, share memories, and view the event schedule.', 'Farewell', 'archived', 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&h=340&fit=crop&auto=format', 'https://tickets.anayap.tech/remoteEntry.js', 'anayap04', '2025-11-05', '2025-12-14')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- --------------------------------------------------------

--
-- Table structure for table `mfe_remotes`
--

CREATE TABLE IF NOT EXISTS `mfe_remotes` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `base_path` VARCHAR(255) NOT NULL,
  `remote_url` TEXT NOT NULL,
  `status` ENUM('active', 'maintenance', 'offline') DEFAULT 'active',
  `version` VARCHAR(50) DEFAULT '1.0.0',
  `wcag_level` VARCHAR(50) DEFAULT 'WCAG 2.2 AA',
  `category` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `mfe_remotes`
--

INSERT INTO `mfe_remotes` (`id`, `name`, `description`, `base_path`, `remote_url`, `status`, `version`, `wcag_level`, `category`) VALUES
('events', 'Events Discovery MFE', 'Concerts, conferences, workshops, and live gathering management.', '/events-experiences/events', 'https://events.anayap.tech/remoteEntry.js', 'active', '1.4.0', 'WCAG 2.2 AA', 'events'),
('experiences', 'Interactive Experiences MFE', 'Immersive pop-ups, VIP tours, and curated community experiences.', '/events-experiences/experiences', 'https://experiences.anayap.tech/remoteEntry.js', 'active', '2.1.0', 'WCAG 2.2 AA', 'experiences'),
('tickets', 'Ticketing & Pass MFE', 'Secure pass reservation, QR validation, and checkout workflows.', '/events-experiences/tickets', 'https://tickets.anayap.tech/remoteEntry.js', 'maintenance', '0.9.5', 'WCAG 2.2 AA', 'ticketing')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);
