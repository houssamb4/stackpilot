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
