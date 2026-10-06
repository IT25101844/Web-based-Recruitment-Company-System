-- =============================================================================
-- JobConnect Seed Data Script
-- Client: LankaHire Solutions (Pvt) Ltd.
-- Database: jobconnect_db
-- Target: MySQL 8.0+ / MySQL Workbench
-- Default password for all demo accounts: Password@123
-- =============================================================================

USE `jobconnect_db`;

-- Temporarily disable foreign keys for safe clean insert
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `audit_logs`;
TRUNCATE TABLE `complaint_attachments`;
TRUNCATE TABLE `complaints`;
TRUNCATE TABLE `interviews`;
TRUNCATE TABLE `messages`;
TRUNCATE TABLE `conversations`;
TRUNCATE TABLE `notifications`;
TRUNCATE TABLE `candidate_likes`;
TRUNCATE TABLE `application_status_history`;
TRUNCATE TABLE `applications`;
TRUNCATE TABLE `job_skills`;
TRUNCATE TABLE `job_postings`;
TRUNCATE TABLE `employer_documents`;
TRUNCATE TABLE `employer_profiles`;
TRUNCATE TABLE `resumes`;
TRUNCATE TABLE `candidate_skills`;
TRUNCATE TABLE `skills`;
TRUNCATE TABLE `candidate_experience`;
TRUNCATE TABLE `candidate_education`;
TRUNCATE TABLE `candidate_profiles`;
TRUNCATE TABLE `user_roles`;
TRUNCATE TABLE `roles`;
TRUNCATE TABLE `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- 1. ROLES
-- -----------------------------------------------------------------------------
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'JOB_SEEKER', 'Job seeker candidate searching and applying for vacancies'),
(2, 'EMPLOYER', 'Corporate recruiter or hiring manager posting jobs and screening talent'),
(3, 'RECRUITMENT_OFFICER', 'Internal recruitment agency officer coordinating candidate pipelines'),
(4, 'OPERATIONS_EXECUTIVE', 'Operations team managing verifications, compliance, and platform metrics'),
(5, 'CUSTOMER_SUPPORT', 'Help desk support agent handling user inquiries, disputes, and complaints'),
(6, 'ADMIN', 'Super administrator with full access to moderation, users, and audit logs');

-- -----------------------------------------------------------------------------
-- 2. USERS (Password for all: Password@123)
-- BCrypt: $2a$10$QZAe9tL7qVywZ.DluVjLa.SG3l4Hsb7ECodoMIGVTAOb2FkT7K9YC
-- -----------------------------------------------------------------------------
INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `phone`, `status`, `email_verified`) VALUES
(1, 'admin@jobconnect.local', '$2a$10$QZAe9tL7qVywZ.DluVjLa.SG3l4Hsb7ECodoMIGVTAOb2FkT7K9YC', 'System Administrator', '+94 11 234 5678', 'ACTIVE', TRUE),
(2, 'operations@jobconnect.local', '$2a$10$QZAe9tL7qVywZ.DluVjLa.SG3l4Hsb7ECodoMIGVTAOb2FkT7K9YC', 'Nimali Jayawardena', '+94 11 234 5679', 'ACTIVE', TRUE),
(3, 'recruitment@jobconnect.local', '$2a$10$QZAe9tL7qVywZ.DluVjLa.SG3l4Hsb7ECodoMIGVTAOb2FkT7K9YC', 'Kamal Perera', '+94 11 234 5680', 'ACTIVE', TRUE),
(4, 'support@jobconnect.local', '$2a$10$QZAe9tL7qVywZ.DluVjLa.SG3l4Hsb7ECodoMIGVTAOb2FkT7K9YC', 'Saman Fernando', '+94 11 234 5681', 'ACTIVE', TRUE),
(5, 'employer@jobconnect.local', '$2a$10$QZAe9tL7qVywZ.DluVjLa.SG3l4Hsb7ECodoMIGVTAOb2FkT7K9YC', 'Dinesh Wickramasinghe', '+94 77 123 4567', 'ACTIVE', TRUE),
(6, 'employer2@jobconnect.local', '$2a$10$QZAe9tL7qVywZ.DluVjLa.SG3l4Hsb7ECodoMIGVTAOb2FkT7K9YC', 'Priyantha De Silva', '+94 71 987 6543', 'PENDING_VERIFICATION', FALSE),
(7, 'candidate@jobconnect.local', '$2a$10$QZAe9tL7qVywZ.DluVjLa.SG3l4Hsb7ECodoMIGVTAOb2FkT7K9YC', 'John Silva', '+94 77 555 1234', 'ACTIVE', TRUE),
(8, 'anusha@jobconnect.local', '$2a$10$QZAe9tL7qVywZ.DluVjLa.SG3l4Hsb7ECodoMIGVTAOb2FkT7K9YC', 'Anusha Gunasekara', '+94 76 333 9988', 'ACTIVE', TRUE),
(9, 'kasun@jobconnect.local', '$2a$10$QZAe9tL7qVywZ.DluVjLa.SG3l4Hsb7ECodoMIGVTAOb2FkT7K9YC', 'Kasun Mendis', '+94 70 444 8877', 'ACTIVE', TRUE);

-- Map user roles
INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(1, 6), -- Admin
(2, 4), -- Operations Executive
(3, 3), -- Recruitment Officer
(4, 5), -- Customer Support
(5, 2), -- Employer
(6, 2), -- Employer 2
(7, 1), -- Candidate 1
(8, 1), -- Candidate 2
(9, 1); -- Candidate 3

-- -----------------------------------------------------------------------------
-- 3. EMPLOYER PROFILES
-- -----------------------------------------------------------------------------
INSERT INTO `employer_profiles` (`id`, `user_id`, `company_name`, `contact_person`, `phone`, `address`, `website`, `registration_number`, `industry`, `company_size`, `description`, `verification_status`, `verified_at`) VALUES
(1, 5, 'TechCorp Lanka Solutions (Pvt) Ltd', 'Dinesh Wickramasinghe', '+94 77 123 4567', 'Level 14, World Trade Center, Colombo 01', 'https://techcorplanka.example.com', 'PV-98765-LK', 'Information Technology', '50-250 Employees', 'Leading software engineering enterprise providing enterprise cloud and AI solutions across South Asia.', 'VERIFIED', '2026-01-15 10:00:00'),
(2, 6, 'Ceylon Innovations Ltd', 'Priyantha De Silva', '+94 71 987 6543', 'No 45, Galle Road, Colombo 03', 'https://ceyloninnovations.example.com', 'PV-54321-LK', 'FinTech & Banking', '10-50 Employees', 'Emerging financial technology startup building digital wallet and payment gateway solutions.', 'PENDING_VERIFICATION', NULL);

-- -----------------------------------------------------------------------------
-- 4. CANDIDATE PROFILES
-- -----------------------------------------------------------------------------
INSERT INTO `candidate_profiles` (`id`, `user_id`, `headline`, `location`, `address`, `professional_summary`, `profile_completion_pct`) VALUES
(1, 7, 'Senior Full Stack Software Engineer', 'Colombo, Sri Lanka', 'No 28, Havelock Road, Colombo 05', 'Experienced Full Stack Engineer with 6+ years of hands-on expertise building scalable enterprise web applications, microservices, and modern user experiences using Java, Spring Boot, React, and MySQL. Proven track record of architecting mission-critical platforms.', 95),
(2, 8, 'UI/UX Designer & Frontend Developer', 'Kandy, Sri Lanka', 'Peradeniya Road, Kandy', 'Passionate product designer and frontend specialist with 4 years creating delightful, accessible, and user-centric interfaces. Proficient in Figma, Design Systems, React, and responsive CSS.', 80),
(3, 9, 'DevOps & Cloud Infrastructure Engineer', 'Galle, Sri Lanka', 'Fort View Terrace, Galle', 'Cloud engineer focused on containerization, CI/CD pipelines, Kubernetes, Docker, and AWS infrastructure automation with 5 years experience.', 75);

-- -----------------------------------------------------------------------------
-- 5. CANDIDATE EDUCATION
-- -----------------------------------------------------------------------------
INSERT INTO `candidate_education` (`id`, `candidate_id`, `qualification`, `institution`, `field_of_study`, `start_date`, `end_date`, `description`) VALUES
(1, 1, 'B.Sc. (Hons) in Software Engineering', 'University of Colombo School of Computing (UCSC)', 'Software Engineering & Computer Science', '2016-01-10', '2020-01-15', 'Graduated with First Class Honours. Specialized in Distributed Systems and Cloud Computing.'),
(2, 1, 'Postgraduate Diploma in Cloud Architecture', 'University of Moratuwa', 'Computer Science & Engineering', '2021-03-01', '2022-04-30', 'Focused on Microservices architecture, high availability, and database optimization.'),
(3, 2, 'B.Sc. in Interactive Media & Design', 'Sri Lanka Institute of Information Technology (SLIIT)', 'Human-Computer Interaction', '2018-02-01', '2022-02-01', 'Awarded Best Final Year UI/UX Product Prototype.'),
(4, 3, 'B.Sc. in Computer Systems & Networking', 'University of Kelaniya', 'Network Systems & Cloud', '2017-01-15', '2021-01-20', 'Dean’s List achievement, focus on Linux systems and automation.');

-- -----------------------------------------------------------------------------
-- 6. CANDIDATE EXPERIENCE
-- -----------------------------------------------------------------------------
INSERT INTO `candidate_experience` (`id`, `candidate_id`, `job_title`, `company`, `location`, `start_date`, `end_date`, `is_current`, `description`) VALUES
(1, 1, 'Lead Full Stack Engineer', 'Virtusa Sri Lanka', 'Colombo, Sri Lanka', '2022-05-01', '2026-02-15', FALSE, 'Led a team of 8 engineers delivering enterprise fintech services using Java Spring Boot, React, and MySQL. Optimized query execution times by 40% and maintained 99.9% uptime.'),
(2, 1, 'Software Engineer', 'IFS World Operations', 'Colombo, Sri Lanka', '2020-02-01', '2022-04-30', FALSE, 'Developed core RESTful APIs, scheduled batch jobs, and modern single-page frontend interfaces for global supply chain clients.'),
(3, 2, 'Senior UI/UX Designer', 'Creative Wave Labs', 'Colombo, Sri Lanka', '2022-03-01', '2026-01-01', FALSE, 'Designed end-to-end design systems, mobile apps, and SaaS dashboards. Conducted usability testing sessions.'),
(4, 3, 'DevOps Specialist', 'CloudNexus Global', 'Colombo, Sri Lanka', '2021-03-01', '2026-03-01', FALSE, 'Maintained Kubernetes clusters, automated Docker container deployments, and managed secure production VPC networks.');

-- -----------------------------------------------------------------------------
-- 7. SKILLS
-- -----------------------------------------------------------------------------
INSERT INTO `skills` (`id`, `name`, `category`) VALUES
(1, 'Java', 'Backend'),
(2, 'Spring Boot', 'Backend'),
(3, 'React', 'Frontend'),
(4, 'JavaScript', 'Frontend'),
(5, 'MySQL', 'Database'),
(6, 'Hibernate / JPA', 'Backend'),
(7, 'REST APIs', 'Backend'),
(8, 'HTML5 / CSS3', 'Frontend'),
(9, 'Docker', 'DevOps'),
(10, 'Kubernetes', 'DevOps'),
(11, 'Figma / UI Design', 'Design'),
(12, 'Git', 'Tools'),
(13, 'AWS Cloud', 'Cloud'),
(14, 'Microservices', 'Architecture'),
(15, 'Agile / Scrum', 'Management');

-- -----------------------------------------------------------------------------
-- 8. CANDIDATE SKILLS
-- -----------------------------------------------------------------------------
INSERT INTO `candidate_skills` (`candidate_id`, `skill_id`, `proficiency_level`) VALUES
(1, 1, 'EXPERT'),
(1, 2, 'EXPERT'),
(1, 3, 'ADVANCED'),
(1, 4, 'ADVANCED'),
(1, 5, 'EXPERT'),
(1, 6, 'EXPERT'),
(1, 7, 'EXPERT'),
(1, 8, 'ADVANCED'),
(1, 14, 'ADVANCED'),
(2, 3, 'INTERMEDIATE'),
(2, 4, 'INTERMEDIATE'),
(2, 8, 'EXPERT'),
(2, 11, 'EXPERT'),
(3, 9, 'EXPERT'),
(3, 10, 'ADVANCED'),
(3, 13, 'ADVANCED'),
(3, 12, 'EXPERT');

-- -----------------------------------------------------------------------------
-- 9. RESUMES
-- -----------------------------------------------------------------------------
INSERT INTO `resumes` (`id`, `candidate_id`, `original_filename`, `stored_filename`, `file_path`, `file_size`, `content_type`, `is_default`) VALUES
(1, 1, 'John_Silva_CV_2026.pdf', 'resume_cand1_seed.pdf', 'uploads/resumes/resume_cand1_seed.pdf', 1048576, 'application/pdf', TRUE),
(2, 2, 'Anusha_Design_Resume.pdf', 'resume_cand2_seed.pdf', 'uploads/resumes/resume_cand2_seed.pdf', 850000, 'application/pdf', TRUE);

-- -----------------------------------------------------------------------------
-- 10. JOB POSTINGS
-- -----------------------------------------------------------------------------
INSERT INTO `job_postings` (`id`, `employer_id`, `title`, `description`, `requirements`, `location`, `job_type`, `experience_level`, `salary_min`, `salary_max`, `currency`, `deadline`, `status`, `views_count`) VALUES
(1, 1, 'Senior Java / Spring Boot Developer', 
'We are seeking an experienced Senior Java / Spring Boot developer to build resilient microservices and mission-critical cloud backends. You will work in an agile team developing scalable distributed systems.',
'5+ years of Java experience, strong Spring Boot, Hibernate, MySQL, and clean architecture knowledge.',
'Colombo, Sri Lanka (Hybrid)', 'FULL_TIME', 'SENIOR_LEVEL', 350000.00, 500000.00, 'LKR', '2026-10-31 23:59:59', 'APPROVED', 142),

(2, 1, 'Full Stack React & Java Engineer', 
'Exciting opportunity for a versatile Full Stack Engineer to drive user-facing web applications alongside Spring Boot REST APIs. Excellent collaborative environment.',
'Proficient with React hooks, CSS design systems, Java 17+, and relational database modeling.',
'Colombo, Sri Lanka', 'FULL_TIME', 'MID_LEVEL', 250000.00, 380000.00, 'LKR', '2026-11-15 23:59:59', 'APPROVED', 98),

(3, 1, 'Cloud DevOps Engineer', 
'Join our infrastructure reliability team managing AWS multi-region clusters, Docker containers, and CI/CD pipelines.',
'Hands-on experience with Docker, Kubernetes, Linux servers, and infrastructure as code.',
'Remote / Sri Lanka', 'REMOTE', 'MID_LEVEL', 280000.00, 420000.00, 'LKR', '2026-09-30 23:59:59', 'APPROVED', 65),

(4, 1, 'Associate QA Automation Engineer', 
'Seeking a detail-oriented QA Automation engineer to write Selenium and API test suites for continuous release pipelines.',
'Understanding of test automation frameworks, REST API testing, and Java basics.',
'Colombo, Sri Lanka', 'FULL_TIME', 'ENTRY_LEVEL', 120000.00, 180000.00, 'LKR', '2026-08-01 00:00:00', 'EXPIRED', 89),

(5, 1, 'Lead Enterprise Architect', 
'Draft job pending administrative review to guide our upcoming banking microservices platform architecture.',
'10+ years experience in large-scale system design.',
'Colombo, Sri Lanka', 'FULL_TIME', 'EXECUTIVE', 600000.00, 850000.00, 'LKR', '2026-12-31 23:59:59', 'PENDING_REVIEW', 12);

-- Link job skills
INSERT INTO `job_skills` (`job_id`, `skill_id`) VALUES
(1, 1), (1, 2), (1, 5), (1, 6), (1, 7),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5),
(3, 9), (3, 10), (3, 13),
(4, 1), (4, 7);

-- -----------------------------------------------------------------------------
-- 11. APPLICATIONS & PIPELINE
-- -----------------------------------------------------------------------------
INSERT INTO `applications` (`id`, `job_id`, `candidate_id`, `resume_id`, `cover_letter`, `status`, `applied_at`) VALUES
(1, 1, 1, 1, 'Dear Hiring Team, with over 6 years of hands-on Java and Spring Boot experience building high-throughput systems, I am excited to contribute to TechCorp Lanka.', 'SHORTLISTED', '2026-08-10 09:30:00'),
(2, 2, 1, 1, 'I have strong expertise in both React single-page frontend architectures and Spring Boot backend services.', 'APPLIED', '2026-08-12 14:15:00'),
(3, 3, 3, NULL, 'Extensive experience operating production Kubernetes clusters on AWS.', 'INTERVIEW_SCHEDULED', '2026-08-14 11:00:00');

-- Application status history
INSERT INTO `application_status_history` (`id`, `application_id`, `previous_status`, `new_status`, `changed_by_user_id`, `notes`) VALUES
(1, 1, NULL, 'APPLIED', 7, 'Application submitted by candidate.'),
(2, 1, 'APPLIED', 'SHORTLISTED', 5, 'Candidate possesses excellent Java & Spring Boot background. Shortlisted for interview round.'),
(3, 3, NULL, 'APPLIED', 9, 'Application submitted by candidate.'),
(4, 3, 'APPLIED', 'SHORTLISTED', 5, 'Strong Kubernetes experience.'),
(5, 3, 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 5, 'Technical screening interview scheduled.');

-- -----------------------------------------------------------------------------
-- 12. CANDIDATE LIKES (EMPLOYER LIKES CANDIDATE)
-- -----------------------------------------------------------------------------
INSERT INTO `candidate_likes` (`id`, `employer_id`, `candidate_id`, `created_at`) VALUES
(1, 1, 1, '2026-08-11 16:20:00');

-- -----------------------------------------------------------------------------
-- 13. NOTIFICATIONS
-- -----------------------------------------------------------------------------
INSERT INTO `notifications` (`id`, `recipient_id`, `type`, `title`, `message`, `reference_id`, `is_read`, `created_at`) VALUES
(1, 7, 'PROFILE_LIKED', 'A recruiter liked your profile!', 'TechCorp Lanka Solutions (Pvt) Ltd has shown interest in your profile.', 1, FALSE, '2026-08-11 16:20:00'),
(2, 7, 'APPLICATION_STATUS', 'Application Shortlisted', 'Your application for "Senior Java / Spring Boot Developer" has been Shortlisted!', 1, FALSE, '2026-08-11 17:00:00'),
(3, 5, 'NEW_APPLICATION', 'New Application Received', 'John Silva applied for "Senior Java / Spring Boot Developer".', 1, TRUE, '2026-08-10 09:30:00'),
(4, 9, 'INTERVIEW_SCHEDULED', 'Interview Invitation Scheduled', 'TechCorp Lanka scheduled an interview for "Cloud DevOps Engineer".', 1, FALSE, '2026-08-15 10:00:00');

-- -----------------------------------------------------------------------------
-- 14. CONVERSATIONS & MESSAGES
-- -----------------------------------------------------------------------------
INSERT INTO `conversations` (`id`, `participant_one_id`, `participant_two_id`, `created_at`) VALUES
(1, 5, 7, '2026-08-11 17:30:00');

INSERT INTO `messages` (`id`, `conversation_id`, `sender_id`, `receiver_id`, `message_body`, `is_read`, `created_at`) VALUES
(1, 1, 5, 7, 'Hi John, we were impressed by your profile and experience in Spring Boot. We would love to discuss our Senior Java opening.', TRUE, '2026-08-11 17:30:00'),
(2, 1, 7, 5, 'Thank you Dinesh! I would be glad to discuss the role and how I can help your team.', TRUE, '2026-08-11 18:00:00');

-- -----------------------------------------------------------------------------
-- 15. INTERVIEWS
-- -----------------------------------------------------------------------------
INSERT INTO `interviews` (`id`, `application_id`, `candidate_id`, `employer_id`, `scheduled_at`, `location_type`, `location_or_link`, `instructions`, `status`) VALUES
(1, 3, 3, 1, '2026-09-20 14:00:00', 'ONLINE', 'https://meet.google.com/abc-defg-hij', 'Please ensure camera and microphone are functional. Focus on AWS & Docker architecture.', 'SCHEDULED');

-- -----------------------------------------------------------------------------
-- 16. COMPLAINTS & TICKETS
-- -----------------------------------------------------------------------------
INSERT INTO `complaints` (`id`, `ticket_id`, `reporter_id`, `issue_type`, `subject`, `description`, `priority`, `status`, `assigned_to_id`, `resolution_note`) VALUES
(1, 'TKT-2026-001', 7, 'TECHNICAL_ISSUE', 'Resume preview loading delay', 'Occasionally PDF preview takes a few seconds on high latency connections.', 'LOW', 'RESOLVED', 4, 'Optimized CDN streaming and cached document metadata.'),
(2, 'TKT-2026-002', 8, 'SPAM_REPORT', 'Suspicious unsolicited WhatsApp recruitment message', 'Received an unverified third party claim referencing JobConnect.', 'HIGH', 'IN_PROGRESS', 4, 'Investigating IP access log and warning flagged entity.');

-- -----------------------------------------------------------------------------
-- 17. AUDIT LOGS
-- -----------------------------------------------------------------------------
INSERT INTO `audit_logs` (`id`, `actor_id`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`) VALUES
(1, 1, 'EMPLOYER_APPROVED', 'EMPLOYER_PROFILE', 1, 'Approved employer registration for TechCorp Lanka Solutions.', '192.168.1.10'),
(2, 1, 'JOB_APPROVED', 'JOB_POSTING', 1, 'Approved job posting: Senior Java / Spring Boot Developer.', '192.168.1.10'),
(3, 1, 'JOB_APPROVED', 'JOB_POSTING', 2, 'Approved job posting: Full Stack React & Java Engineer.', '192.168.1.10'),
(4, 1, 'JOB_APPROVED', 'JOB_POSTING', 3, 'Approved job posting: Cloud DevOps Engineer.', '192.168.1.10');
