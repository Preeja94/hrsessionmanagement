-- SQL script to delete all leaderboard data (session completions) from the database
-- Run this in your PostgreSQL database
-- WARNING: This will clear all session completion records and reset the leaderboard!

-- Delete all session completions
DELETE FROM session_completions;

-- Verify deletion
SELECT COUNT(*) as remaining_completions FROM session_completions;



