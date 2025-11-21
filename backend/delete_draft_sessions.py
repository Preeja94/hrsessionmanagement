#!/usr/bin/env python
"""
Script to delete all draft sessions from the database.
This will also automatically delete related records in session_requests 
and session_completions due to CASCADE foreign key constraints.
"""
import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hr_session_management.settings')
django.setup()

from authentication.models import Session, SessionRequest, SessionCompletion

def delete_draft_sessions():
    """Delete all draft sessions and related data"""
    
    # Get all draft sessions
    draft_sessions = Session.objects.filter(status='draft')
    draft_count = draft_sessions.count()
    
    if draft_count == 0:
        print("No draft sessions found in the database.")
        return
    
    print(f"Found {draft_count} draft session(s) to delete.")
    
    # Show what will be deleted
    print("\nDraft sessions to be deleted:")
    for session in draft_sessions:
        # Count related records
        requests_count = SessionRequest.objects.filter(session=session).count()
        completions_count = SessionCompletion.objects.filter(session=session).count()
        
        print(f"  - {session.title} (ID: {session.id})")
        print(f"    Created: {session.created_at}")
        if requests_count > 0:
            print(f"    Related requests: {requests_count}")
        if completions_count > 0:
            print(f"    Related completions: {completions_count}")
    
    # Check for --yes flag to skip confirmation
    skip_confirmation = '--yes' in sys.argv or '-y' in sys.argv
    
    if not skip_confirmation:
        # Confirm deletion
        response = input(f"\nAre you sure you want to delete {draft_count} draft session(s)? (yes/no): ")
        
        if response.lower() != 'yes':
            print("Deletion cancelled.")
            return
    
    # Delete draft sessions (CASCADE will handle related records)
    deleted_count = draft_sessions.delete()[0]
    
    print(f"\nSuccessfully deleted {deleted_count} draft session(s) and all related records.")
    print("Note: Related records in session_requests and session_completions were automatically deleted due to CASCADE constraints.")

if __name__ == '__main__':
    delete_draft_sessions()

