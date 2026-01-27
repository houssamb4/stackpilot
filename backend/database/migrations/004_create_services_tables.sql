-- Services table
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  executable_path TEXT NOT NULL,
  arguments TEXT,
  working_directory TEXT,
  status ENUM('stopped', 'running', 'failed') DEFAULT 'stopped',
  pid INT DEFAULT NULL,
  last_started_at DATETIME DEFAULT NULL,
  last_stopped_at DATETIME DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
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
