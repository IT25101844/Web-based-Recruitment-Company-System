-- =============================================================================
-- JobConnect Database Schema
-- Client: LankaHire Solutions (Pvt) Ltd.
-- Database: jobconnect_db
-- Target: MySQL 8.0+ / MySQL Workbench
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `jobconnect_db` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `jobconnect_db`;

-- Drop tables in reverse dependency order for clean recreation
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `complaint_attachments`;
DROP TABLE IF EXISTS `complaints`;
DROP TABLE IF EXISTS `interviews`;
DROP TABLE IF EXISTS `messages`;
DROP TABLE IF EXISTS `conversations`;
DROP TABLE IF EXISTS `notifications`;
DROP TABLE IF EXISTS `candidate_likes`;
DROP TABLE IF EXISTS `application_status_history`;
DROP TABLE IF EXISTS `applications`;
DROP TABLE IF EXISTS `job_skills`;
DROP TABLE IF EXISTS `job_postings`;
DROP TABLE IF EXISTS `employer_documents`;
DROP TABLE IF EXISTS `employer_profiles`;
DROP TABLE IF EXISTS `resumes`;
DROP TABLE IF EXISTS `candidate_skills`;
DROP TABLE IF EXISTS `skills`;
DROP TABLE IF EXISTS `candidate_experience`;
DROP TABLE IF EXISTS `candidate_education`;
DROP TABLE IF EXISTS `candidate_profiles`;
DROP TABLE IF EXISTS `user_roles`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. ROLES & USERS
-- -----------------------------------------------------------------------------
CREATE TABLE `roles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL UNIQUE,
    `description` VARCHAR(255) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(30) NULL,
    `status` ENUM('ACTIVE', 'PENDING_VERIFICATION', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `email_verified` BOOLEAN NOT NULL DEFAULT FALSE,
    `verification_token` VARCHAR(255) NULL,
    `reset_token` VARCHAR(255) NULL,
    `reset_token_expiry` DATETIME NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `user_roles` (
    `user_id` BIGINT NOT NULL,
    `role_id` BIGINT NOT NULL,
    PRIMARY KEY (`user_id`, `role_id`),
    CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_user_roles_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 2. CANDIDATE PROFILE MODULE
-- -----------------------------------------------------------------------------
CREATE TABLE `candidate_profiles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL UNIQUE,
    `headline` VARCHAR(150) NULL,
    `location` VARCHAR(150) NULL,
    `address` VARCHAR(255) NULL,
    `professional_summary` TEXT NULL,
    `profile_picture_path` VARCHAR(255) NULL,
    `profile_completion_pct` INT NOT NULL DEFAULT 20,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_candidate_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_candidate_location` (`location`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `candidate_education` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `candidate_id` BIGINT NOT NULL,
    `qualification` VARCHAR(150) NOT NULL,
    `institution` VARCHAR(200) NOT NULL,
    `field_of_study` VARCHAR(150) NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,
    `description` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_candidate_edu_profile` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE,
    INDEX `idx_candidate_edu_cand` (`candidate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `candidate_experience` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `candidate_id` BIGINT NOT NULL,
    `job_title` VARCHAR(150) NOT NULL,
    `company` VARCHAR(150) NOT NULL,
    `location` VARCHAR(150) NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NULL,
    `is_current` BOOLEAN DEFAULT FALSE,
    `description` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_candidate_exp_profile` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE,
    INDEX `idx_candidate_exp_cand` (`candidate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `skills` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `category` VARCHAR(100) DEFAULT 'General',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_skills_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `candidate_skills` (
    `candidate_id` BIGINT NOT NULL,
    `skill_id` BIGINT NOT NULL,
    `proficiency_level` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT') DEFAULT 'INTERMEDIATE',
    PRIMARY KEY (`candidate_id`, `skill_id`),
    CONSTRAINT `fk_cand_skills_cand` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_cand_skills_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `resumes` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `candidate_id` BIGINT NOT NULL,
    `original_filename` VARCHAR(255) NOT NULL,
    `stored_filename` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `file_size` BIGINT NOT NULL,
    `content_type` VARCHAR(100) NOT NULL,
    `is_default` BOOLEAN DEFAULT TRUE,
    `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_candidate_resumes_profile` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE,
    INDEX `idx_resumes_cand` (`candidate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 3. EMPLOYER MODULE
-- -----------------------------------------------------------------------------
CREATE TABLE `employer_profiles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL UNIQUE,
    `company_name` VARCHAR(200) NOT NULL,
    `contact_person` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(30) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `website` VARCHAR(255) NULL,
    `registration_number` VARCHAR(100) NOT NULL,
    `industry` VARCHAR(100) NULL,
    `company_size` VARCHAR(50) NULL,
    `description` TEXT NULL,
    `logo_path` VARCHAR(255) NULL,
    `verification_status` ENUM('PENDING_VERIFICATION', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING_VERIFICATION',
    `rejection_reason` TEXT NULL,
    `verified_at` DATETIME NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_employer_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_employer_status` (`verification_status`),
    INDEX `idx_employer_company` (`company_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `employer_documents` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `employer_id` BIGINT NOT NULL,
    `document_type` VARCHAR(100) NOT NULL,
    `original_filename` VARCHAR(255) NOT NULL,
    `stored_filename` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_employer_docs_profile` FOREIGN KEY (`employer_id`) REFERENCES `employer_profiles` (`id`) ON DELETE CASCADE,
    INDEX `idx_employer_docs_emp` (`employer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 4. JOB POSTINGS & SKILLS
-- -----------------------------------------------------------------------------
CREATE TABLE `job_postings` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `employer_id` BIGINT NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NOT NULL,
    `requirements` TEXT NULL,
    `location` VARCHAR(150) NOT NULL,
    `job_type` ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE') NOT NULL DEFAULT 'FULL_TIME',
    `experience_level` ENUM('ENTRY_LEVEL', 'MID_LEVEL', 'SENIOR_LEVEL', 'EXECUTIVE') DEFAULT 'MID_LEVEL',
    `salary_min` DECIMAL(12,2) NULL,
    `salary_max` DECIMAL(12,2) NULL,
    `currency` VARCHAR(10) DEFAULT 'LKR',
    `deadline` DATETIME NOT NULL,
    `status` ENUM('PENDING_REVIEW', 'APPROVED', 'REJECTED', 'CLOSED', 'EXPIRED') NOT NULL DEFAULT 'PENDING_REVIEW',
    `rejection_reason` TEXT NULL,
    `views_count` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_job_postings_employer` FOREIGN KEY (`employer_id`) REFERENCES `employer_profiles` (`id`) ON DELETE CASCADE,
    INDEX `idx_job_status` (`status`),
    INDEX `idx_job_deadline` (`deadline`),
    INDEX `idx_job_location` (`location`),
    INDEX `idx_job_title` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `job_skills` (
    `job_id` BIGINT NOT NULL,
    `skill_id` BIGINT NOT NULL,
    PRIMARY KEY (`job_id`, `skill_id`),
    CONSTRAINT `fk_job_skills_job` FOREIGN KEY (`job_id`) REFERENCES `job_postings` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_job_skills_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 5. APPLICATIONS & PIPELINE
-- -----------------------------------------------------------------------------
CREATE TABLE `applications` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `job_id` BIGINT NOT NULL,
    `candidate_id` BIGINT NOT NULL,
    `resume_id` BIGINT NULL,
    `cover_letter` TEXT NULL,
    `status` ENUM('APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED') NOT NULL DEFAULT 'APPLIED',
    `applied_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_apps_job` FOREIGN KEY (`job_id`) REFERENCES `job_postings` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_apps_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_apps_resume` FOREIGN KEY (`resume_id`) REFERENCES `resumes` (`id`) ON DELETE SET NULL,
    UNIQUE KEY `uk_job_candidate` (`job_id`, `candidate_id`),
    INDEX `idx_apps_status` (`status`),
    INDEX `idx_apps_candidate` (`candidate_id`),
    INDEX `idx_apps_job` (`job_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `application_status_history` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `application_id` BIGINT NOT NULL,
    `previous_status` VARCHAR(50) NULL,
    `new_status` VARCHAR(50) NOT NULL,
    `changed_by_user_id` BIGINT NOT NULL,
    `notes` TEXT NULL,
    `changed_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_app_history_app` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_app_history_user` FOREIGN KEY (`changed_by_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_app_history_app` (`application_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 6. CANDIDATE LIKES (EMPLOYER LIKE SYSTEM)
-- -----------------------------------------------------------------------------
CREATE TABLE `candidate_likes` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `employer_id` BIGINT NOT NULL,
    `candidate_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_candidate_likes_employer` FOREIGN KEY (`employer_id`) REFERENCES `employer_profiles` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_candidate_likes_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `uk_employer_candidate` (`employer_id`, `candidate_id`),
    INDEX `idx_likes_cand` (`candidate_id`),
    INDEX `idx_likes_emp` (`employer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 7. NOTIFICATIONS
-- -----------------------------------------------------------------------------
CREATE TABLE `notifications` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `recipient_id` BIGINT NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `message` TEXT NOT NULL,
    `reference_id` BIGINT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_notifications_user` FOREIGN KEY (`recipient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_notifications_user_read` (`recipient_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 8. MESSAGING & CONVERSATIONS
-- -----------------------------------------------------------------------------
CREATE TABLE `conversations` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `participant_one_id` BIGINT NOT NULL,
    `participant_two_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_conv_p1` FOREIGN KEY (`participant_one_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_conv_p2` FOREIGN KEY (`participant_two_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    UNIQUE KEY `uk_participants` (`participant_one_id`, `participant_two_id`),
    INDEX `idx_conv_p1` (`participant_one_id`),
    INDEX `idx_conv_p2` (`participant_two_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `messages` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `conversation_id` BIGINT NOT NULL,
    `sender_id` BIGINT NOT NULL,
    `receiver_id` BIGINT NOT NULL,
    `message_body` TEXT NOT NULL,
    `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_messages_conv` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_messages_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_messages_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_messages_conv` (`conversation_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 9. INTERVIEWS
-- -----------------------------------------------------------------------------
CREATE TABLE `interviews` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `application_id` BIGINT NOT NULL,
    `candidate_id` BIGINT NOT NULL,
    `employer_id` BIGINT NOT NULL,
    `scheduled_at` DATETIME NOT NULL,
    `location_type` ENUM('ONLINE', 'IN_PERSON') NOT NULL DEFAULT 'ONLINE',
    `location_or_link` VARCHAR(255) NOT NULL,
    `instructions` TEXT NULL,
    `status` ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'SCHEDULED',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_interviews_app` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_interviews_cand` FOREIGN KEY (`candidate_id`) REFERENCES `candidate_profiles` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_interviews_emp` FOREIGN KEY (`employer_id`) REFERENCES `employer_profiles` (`id`) ON DELETE CASCADE,
    INDEX `idx_interviews_cand` (`candidate_id`),
    INDEX `idx_interviews_emp` (`employer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 10. COMPLAINTS & SUPPORT TICKETS
-- -----------------------------------------------------------------------------
CREATE TABLE `complaints` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `ticket_id` VARCHAR(50) NOT NULL UNIQUE,
    `reporter_id` BIGINT NOT NULL,
    `issue_type` ENUM('COMPLAINT', 'TECHNICAL_ISSUE', 'SPAM_REPORT', 'OTHER') NOT NULL DEFAULT 'COMPLAINT',
    `subject` VARCHAR(200) NOT NULL,
    `description` TEXT NOT NULL,
    `priority` ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL DEFAULT 'MEDIUM',
    `status` ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED') NOT NULL DEFAULT 'OPEN',
    `assigned_to_id` BIGINT NULL,
    `resolution_note` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_complaints_reporter` FOREIGN KEY (`reporter_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_complaints_assigned` FOREIGN KEY (`assigned_to_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    INDEX `idx_complaints_status` (`status`),
    INDEX `idx_complaints_priority` (`priority`),
    INDEX `idx_complaints_ticket` (`ticket_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `complaint_attachments` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `complaint_id` BIGINT NOT NULL,
    `original_filename` VARCHAR(255) NOT NULL,
    `stored_filename` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `uploaded_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_complaint_att_comp` FOREIGN KEY (`complaint_id`) REFERENCES `complaints` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------------------------------
-- 11. AUDIT LOGS
-- -----------------------------------------------------------------------------
CREATE TABLE `audit_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `actor_id` BIGINT NULL,
    `action` VARCHAR(100) NOT NULL,
    `entity_type` VARCHAR(100) NOT NULL,
    `entity_id` BIGINT NULL,
    `description` TEXT NOT NULL,
    `ip_address` VARCHAR(50) NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_audit_actor` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
    INDEX `idx_audit_action` (`action`),
    INDEX `idx_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
