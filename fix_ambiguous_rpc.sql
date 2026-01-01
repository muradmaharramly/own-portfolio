-- Fix Ambiguous Column Reference
-- We rename the function parameters to start with 'p_' to avoid conflict with table column names

DROP FUNCTION IF EXISTS send_contact_message;

CREATE OR REPLACE FUNCTION send_contact_message(
  p_sender_name text,
  p_sender_email text,
  p_subject text,
  p_message text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_record json;
BEGIN
  INSERT INTO contact_messages (sender_name, sender_email, subject, message)
  VALUES (p_sender_name, p_sender_email, p_subject, p_message)
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

-- Grant execute permissions again just in case
GRANT EXECUTE ON FUNCTION send_contact_message TO anon;
GRANT EXECUTE ON FUNCTION send_contact_message TO authenticated;
GRANT EXECUTE ON FUNCTION send_contact_message TO service_role;
GRANT EXECUTE ON FUNCTION send_contact_message TO public;
