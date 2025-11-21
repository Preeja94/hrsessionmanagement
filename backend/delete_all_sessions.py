#!/usr/bin/env python
"""
Script to delete all sessions from the database.
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

def delete_all_sessions():
    """Delete all sessions and related data"""
    
    # Get all sessions
    all_sessions = Session.objects.all()
    total_count = all_sessions.count()
    
    if total_count == 0:
        print("No sessions found in the database.")
        return
    
    print(f"Found {total_count} session(s) to delete.")
    
    # Count by status
    status_counts = {}
    for session in all_sessions:
        status = session.status
        status_counts[status] = status_counts.get(status, 0) + 1
    
    print("\nSessions by status:")
    for status, count in status_counts.items():
        print(f"  - {status}: {count}")
    
    # Count related records
    total_requests = SessionRequest.objects.count()
    total_completions = SessionCompletion.objects.count()
    
    if total_requests > 0:
        print(f"\nRelated session requests: {total_requests}")
    if total_completions > 0:
        print(f"Related session completions: {total_completions}")
    
    # Show sample sessions
    print("\nSample sessions to be deleted:")
    for session in all_sessions[:5]:
        print(f"  - {session.title} (ID: {session.id}, Status: {session.status})")
    if total_count > 5:
        print(f"  ... and {total_count - 5} more")
    
    # Check for --yes flag to skip confirmation
    skip_confirmation = '--yes' in sys.argv or '-y' in sys.argv
    
    if not skip_confirmation:
        # Confirm deletion
        response = input(f"\nWARNING: Are you sure you want to delete ALL {total_count} session(s)? (yes/no): ")
        
        if response.lower() != 'yes':
            print("Deletion cancelled.")
            return
    
    # Delete all sessions (CASCADE will handle related records)
    deleted_count = all_sessions.delete()[0]
    
    print(f"\nSuccessfully deleted {deleted_count} session(s) and all related records.")
    print("Note: Related records in session_requests and session_completions were automatically deleted due to CASCADE constraints.")
    
    # Verify deletion
    remaining = Session.objects.count()
    if remaining == 0:
        print("Verification: All sessions have been deleted.")
    else:
        print(f"Warning: {remaining} session(s) still remain in the database.")

if __name__ == '__main__':
    delete_all_sessions()

