-- SQL script to delete all sessions from the database
-- Run this in your PostgreSQL database
-- ⚠️  WARNING: This will delete ALL sessions and related data!

-- First, delete related records (though CASCADE should handle this automatically)
-- But we'll do it explicitly to be safe

-- Delete all session requests
DELETE FROM session_requests;

-- Delete all session completions
DELETE FROM session_completions;

-- Finally, delete all sessions
DELETE FROM sessions;

-- Verify deletion
SELECT COUNT(*) as remaining_sessions FROM sessions;
SELECT COUNT(*) as remaining_requests FROM session_requests;
SELECT COUNT(*) as remaining_completions FROM session_completions;



