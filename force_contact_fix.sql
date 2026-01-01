-- FORCE FIX: Reset RLS and Permissions for contact_messages

-- 1. Ensure RLS is enabled
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- 2. Drop ALL existing policies (to clear any conflicts)
DROP POLICY IF EXISTS "Allow public insert access" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated read access" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated update access" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated delete access" ON contact_messages;
DROP POLICY IF EXISTS "Enable read access for all users" ON contact_messages;
DROP POLICY IF EXISTS "Enable insert for all users" ON contact_messages;
DROP POLICY IF EXISTS "contact_insert_policy" ON contact_messages;
DROP POLICY IF EXISTS "universal_insert_policy" ON contact_messages;
DROP POLICY IF EXISTS "admin_manage_policy" ON contact_messages;

-- 3. Create a SIMPLE, UNIVERSAL INSERT POLICY
-- This applies to everyone (visitors and admins)
CREATE POLICY "universal_insert_policy" 
ON contact_messages 
FOR INSERT 
WITH CHECK (true);

-- 4. Create policies for Admins (Authenticated users) to View/Manage
CREATE POLICY "admin_select_policy" 
ON contact_messages 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "admin_update_policy" 
ON contact_messages 
FOR UPDATE 
TO authenticated 
USING (true);

CREATE POLICY "admin_delete_policy" 
ON contact_messages 
FOR DELETE 
TO authenticated 
USING (true);

-- 5. CRITICAL: Explicitly GRANT permissions to the 'anon' (visitor) role
-- Sometimes RLS is fine but the role lacks basic table permissions
GRANT INSERT ON contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON contact_messages TO authenticated;
GRANT ALL ON contact_messages TO service_role;
