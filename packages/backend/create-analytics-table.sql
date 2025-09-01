-- Create analytics table manually
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  page_path VARCHAR(500) NOT NULL,
  page_title VARCHAR(500),
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  session_id VARCHAR(100) NOT NULL,
  visit_duration INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_analytics_page_path ON analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_page_path_created_at ON analytics(page_path, created_at);

-- Mark migration as executed (update the ID if needed)
INSERT INTO migrations (id, name) VALUES (2, 'add_analytics_table') 
ON CONFLICT (id) DO NOTHING;

-- Verify table was created
SELECT 'Analytics table created successfully!' as status;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'analytics' ORDER BY ordinal_position;
