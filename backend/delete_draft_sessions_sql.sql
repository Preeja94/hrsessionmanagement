-- SQL script to delete all draft sessions from the database
-- Run this in your PostgreSQL database

-- First, delete related records (though CASCADE should handle this automatically)
-- But we'll do it explicitly to be safe

-- Delete session requests for draft sessions
DELETE FROM session_requests 
WHERE session_id IN (SELECT id FROM sessions WHERE status = 'draft');

-- Delete session completions for draft sessions
DELETE FROM session_completions 
WHERE session_id IN (SELECT id FROM sessions WHERE status = 'draft');

-- Finally, delete the draft sessions themselves
DELETE FROM sessions WHERE status = 'draft';

-- Verify deletion
SELECT COUNT(*) as remaining_drafts FROM sessions WHERE status = 'draft';



