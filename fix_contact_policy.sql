-- Fix RLS policies for contact_messages table
-- We first drop existing policies to avoid conflicts

-- Enable RLS (Row Level Security)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to ensure a clean slate)
DROP POLICY IF EXISTS "Allow public insert access" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated read access" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated update access" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated delete access" ON contact_messages;
-- Also drop any default policies that might have been created
DROP POLICY IF EXISTS "Enable read access for all users" ON contact_messages;
DROP POLICY IF EXISTS "Enable insert for all users" ON contact_messages;

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
