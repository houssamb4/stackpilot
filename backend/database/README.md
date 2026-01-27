# Database Schema

## Tables

### users
User authentication and profile information.

| Column | Type | Description |
|--------|------|-------------|
| id | VARCHAR(36) | Primary key (UUID) |
| email | VARCHAR(255) | User email (unique) |
| password | VARCHAR(255) | Hashed password |
| name | VARCHAR(255) | User display name |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Record update time |

**Indexes:**
- Primary key on `id`
- Index on `email` for fast lookups
- Unique constraint on `email`

## Setup Instructions

### 1. Create Database
```bash
mysql -u root -p < database/schema.sql
```

Or manually:
```sql
CREATE DATABASE `stackpilot-db`;
USE `stackpilot-db`;
SOURCE database/schema.sql;
```

### 2. Create Database User (Optional but recommended)
```sql
CREATE USER 'stackpilot'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON `stackpilot-db`.* TO 'stackpilot'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Update .env
```env
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=stackpilot-db
```

## Migrations

For future schema changes, create timestamped migration files:
- `YYYYMMDD_HHMMSS_description.sql`

Example:
- `20260127_120000_create_users_table.sql`
- `20260127_130000_add_user_avatar.sql`
