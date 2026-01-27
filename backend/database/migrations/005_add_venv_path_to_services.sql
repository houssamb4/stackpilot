-- Add venv_path column to services table
ALTER TABLE services ADD COLUMN venv_path TEXT DEFAULT NULL AFTER working_directory;
