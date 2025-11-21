#!/usr/bin/env python
"""
Script to delete all leaderboard data (session completions) from the database.
This will clear all session completion records which are used to calculate leaderboard rankings.
"""
import os
import sys
import django

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'hr_session_management.settings')
django.setup()

from authentication.models import SessionCompletion

def delete_leaderboard():
    """Delete all session completions (leaderboard data)"""
    
    # Get all session completions
    all_completions = SessionCompletion.objects.all()
    total_count = all_completions.count()
    
    if total_count == 0:
        print("No session completions found in the database. Leaderboard is already empty.")
        return
    
    print(f"Found {total_count} session completion(s) to delete.")
    
    # Show statistics
    print("\nLeaderboard statistics:")
    
    # Count by employee
    from django.db.models import Count
    employee_counts = SessionCompletion.objects.values('employee__username', 'employee__first_name', 'employee__last_name').annotate(
        completion_count=Count('id')
    ).order_by('-completion_count')
    
    print(f"  - Total employees with completions: {employee_counts.count()}")
    print(f"  - Top 5 employees by completions:")
    for i, emp in enumerate(employee_counts[:5], 1):
        name = f"{emp['employee__first_name']} {emp['employee__last_name']}" if emp['employee__first_name'] else emp['employee__username']
        print(f"    {i}. {name}: {emp['completion_count']} completion(s)")
    
    # Count passed vs failed
    passed_count = SessionCompletion.objects.filter(passed=True).count()
    failed_count = SessionCompletion.objects.filter(passed=False).count()
    print(f"\n  - Passed: {passed_count}")
    print(f"  - Failed: {failed_count}")
    
    # Show sample completions
    print("\nSample completions to be deleted:")
    for completion in all_completions[:5]:
        employee_name = f"{completion.employee.first_name} {completion.employee.last_name}" if completion.employee.first_name else completion.employee.username
        session_title = completion.session.title if completion.session else "Unknown Session"
        print(f"  - {employee_name} completed '{session_title}' (Score: {completion.score or 'N/A'}, Passed: {completion.passed})")
    if total_count > 5:
        print(f"  ... and {total_count - 5} more")
    
    # Check for --yes flag to skip confirmation
    skip_confirmation = '--yes' in sys.argv or '-y' in sys.argv
    
    if not skip_confirmation:
        # Confirm deletion
        response = input(f"\nWARNING: Are you sure you want to delete ALL {total_count} session completion(s)? This will clear the leaderboard. (yes/no): ")
        
        if response.lower() != 'yes':
            print("Deletion cancelled.")
            return
    
    # Delete all session completions
    deleted_count = all_completions.delete()[0]
    
    print(f"\nSuccessfully deleted {deleted_count} session completion(s).")
    print("Leaderboard has been cleared.")
    
    # Verify deletion
    remaining = SessionCompletion.objects.count()
    if remaining == 0:
        print("Verification: All session completions have been deleted. Leaderboard is now empty.")
    else:
        print(f"Warning: {remaining} session completion(s) still remain in the database.")

if __name__ == '__main__':
    delete_leaderboard()



