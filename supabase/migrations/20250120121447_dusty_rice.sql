/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - username (text, unique)
      - points (integer)
      - completed_tasks (integer array)
    - tasks
      - id (integer, primary key)
      - title (text)
      - description (text)
      - image_url (text)
      - points (integer)
      - link (text)
      - conditions (text array)
      - section (text)
      - sort_order (integer) - for ordering tasks within sections

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  points integer DEFAULT 0,
  completed_tasks integer[] DEFAULT '{}'
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id serial PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  points integer NOT NULL,
  link text NOT NULL,
  conditions text[] NOT NULL,
  section text NOT NULL,
  sort_order integer NOT NULL
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can read tasks"
  ON tasks
  FOR SELECT
  TO authenticated
  USING (true);