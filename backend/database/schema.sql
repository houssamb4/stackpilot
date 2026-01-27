-- Create stackpilot-db database
CREATE DATABASE IF NOT EXISTS `stackpilot-db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `stackpilot-db`;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `role` ENUM('super_admin', 'admin', 'user') DEFAULT 'admin',
  `is_active` TINYINT(1) DEFAULT 0,
  `activated_at` TIMESTAMP NULL,
  `activated_by` VARCHAR(36) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`),
  INDEX `idx_is_active` (`is_active`),
  FOREIGN KEY (`activated_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  executable_path TEXT NOT NULL,
  arguments TEXT,
  working_directory TEXT,
  venv_path TEXT DEFAULT NULL,
  status ENUM('stopped', 'running', 'failed') DEFAULT 'stopped',
  pid INT DEFAULT NULL,
  last_started_at DATETIME DEFAULT NULL,
  last_stopped_at DATETIME DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(36),
  INDEX idx_status (status),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Service logs table
CREATE TABLE IF NOT EXISTS service_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_id INT NOT NULL,
  log_type ENUM('stdout', 'stderr', 'system') DEFAULT 'stdout',
  message TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  INDEX idx_service_timestamp (service_id, timestamp DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Servers table
CREATE TABLE IF NOT EXISTS servers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('database', 'backend', 'frontend', 'custom') DEFAULT 'custom',
  host VARCHAR(255) NOT NULL,
  port INT NOT NULL,
  description TEXT,
  status ENUM('online', 'offline', 'warning') DEFAULT 'online',
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(36),
  INDEX idx_status (status),
  INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default super admin (password: Admin@123)
-- Note: Update the password hash after first login
INSERT INTO `users` (`id`, `email`, `password`, `name`, `role`, `is_active`, `created_at`) 
VALUES (
  'super-admin-001',
  'superadmin@stackpilot.com',
  '$2b$10$XQJ5Z5Z5Z5Z5Z5Z5Z5Z5ZuKGvN8Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5',
  'Super Admin',
  'super_admin',
  1,
  CURRENT_TIMESTAMP
) ON DUPLICATE KEY UPDATE `email`=`email`;

-- Insert default servers
INSERT INTO servers (name, type, host, port, description, started_at) VALUES
('MySQL Database Server', 'database', 'localhost', 3306, 'Primary database server running MySQL', NOW() - INTERVAL 30 DAY),
('Backend API Server', 'backend', 'localhost', 3000, 'Node.js Express API server', NOW() - INTERVAL 15 DAY),
('Frontend Web Server', 'frontend', 'localhost', 3001, 'Next.js frontend application server', NOW() - INTERVAL 15 DAY)
ON DUPLICATE KEY UPDATE `name`=`name`;
