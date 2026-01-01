-- Enable RLS (Row Level Security) for the table
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 1. Allow EVERYONE (Public/Anonymous) to INSERT messages
-- This is crucial for the contact form to work for visitors
CREATE POLICY "Allow public insert access" 
ON contact_messages 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 2. Allow ONLY AUTHENTICATED users (Admins) to READ messages
CREATE POLICY "Allow authenticated read access" 
ON contact_messages 
FOR SELECT 
TO authenticated 
USING (true);

-- 3. Allow ONLY AUTHENTICATED users (Admins) to UPDATE messages (e.g. mark as read)
CREATE POLICY "Allow authenticated update access" 
ON contact_messages 
FOR UPDATE 
TO authenticated 
USING (true);

-- 4. Allow ONLY AUTHENTICATED users (Admins) to DELETE messages
CREATE POLICY "Allow authenticated delete access" 
ON contact_messages 
FOR DELETE 
TO authenticated 
USING (true);
