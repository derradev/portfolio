-- Create feature flags table
CREATE TABLE feature_flags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some example feature flags
INSERT INTO feature_flags (name, description, enabled) VALUES
('blog_comments', 'Enable comments on blog posts', false),
('dark_mode', 'Enable dark mode toggle', false),
('analytics_dashboard', 'Show analytics dashboard in admin', true),
('project_filtering', 'Enable project filtering on frontend', false),
('learning_progress_tracking', 'Track detailed learning progress', true);
