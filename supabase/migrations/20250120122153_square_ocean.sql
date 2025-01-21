/*
  # Add sample tasks

  1. New Data
    - Adds sample tasks to the `tasks` table with different sections
    - Each task has title, description, points, and conditions
  2. Changes
    - Inserts initial data into tasks table
*/

INSERT INTO tasks (title, description, image_url, points, link, conditions, section, sort_order)
VALUES
  (
    'Share and Download App',
    'Share this app with friends and download it to earn points',
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113',
    100,
    'https://example.com/app1',
    ARRAY['Share with 3 friends', 'Download and install the app', 'Run the app for 5 minutes'],
    'Mobile Apps',
    1
  ),
  (
    'Gaming Survey',
    'Complete a quick gaming survey and earn points',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420',
    50,
    'https://example.com/survey1',
    ARRAY['Answer all questions honestly', 'Provide valid information', 'Complete the entire survey'],
    'Surveys',
    1
  ),
  (
    'Watch Tutorial Video',
    'Watch this educational video to earn points',
    'https://images.unsplash.com/photo-1485846234645-a62644f84728',
    75,
    'https://example.com/video1',
    ARRAY['Watch the full video', 'Like and subscribe', 'Leave a comment'],
    'Videos',
    1
  );