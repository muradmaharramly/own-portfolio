-- Create a secure function to send messages
-- This function runs with "SECURITY DEFINER" privileges, meaning it bypasses RLS policies
-- This is the most reliable way to allow public inserts without exposing the table

CREATE OR REPLACE FUNCTION send_contact_message(
  sender_name text,
  sender_email text,
  subject text,
  message text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_record json;
BEGIN
  INSERT INTO contact_messages (sender_name, sender_email, subject, message)
  VALUES (sender_name, sender_email, subject, message)
  RETURNING json_build_object(
    'id', id, 
    'created_at', created_at,
    'sender_name', sender_name,
    'sender_email', sender_email,
    'subject', subject,
    'message', message,
    'is_read', is_read
  ) INTO new_record;
  
  RETURN new_record;
END;
$$;

-- Grant execute permissions to everyone (public/anon) and admins (authenticated)
GRANT EXECUTE ON FUNCTION send_contact_message TO anon;
GRANT EXECUTE ON FUNCTION send_contact_message TO authenticated;
GRANT EXECUTE ON FUNCTION send_contact_message TO service_role;
GRANT EXECUTE ON FUNCTION send_contact_message TO public;
