from django.contrib.auth.models import AbstractUser
from django.db import models
import json


class User(AbstractUser):
    ROLE_CHOICES = [
        ('employee', 'Employee'),
        ('hr_admin', 'HR Admin'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee')
    employee_id = models.CharField(max_length=50, unique=True, null=True, blank=True)
    department = models.CharField(max_length=100, null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    password_reset_required = models.BooleanField(default=False)  # True if user needs to reset default password
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'


class EmployeeProfile(models.Model):
    """Extended employee profile with additional fields"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee_profile')
    job_role = models.CharField(max_length=100, null=True, blank=True)
    reporting_manager = models.CharField(max_length=100, null=True, blank=True)
    keyskills = models.JSONField(default=list, blank=True)  # Array of skill strings
    status = models.CharField(max_length=20, default='active', choices=[
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'employee_profiles'
    
    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.user.employee_id}"


class Session(models.Model):
    """Training session model"""
    SESSION_STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('deleted', 'Deleted'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    type = models.CharField(max_length=100, default='Not specified')  # Increased max_length and removed choices constraint
    status = models.CharField(max_length=20, choices=SESSION_STATUS_CHOICES, default='draft')
    audience = models.CharField(max_length=100, null=True, blank=True)  # Participants/audience field
    
    # Content fields
    creation_mode = models.CharField(max_length=50, null=True, blank=True)  # powerpoint, word, video, etc.
    files = models.JSONField(default=list, blank=True)  # Array of file metadata
    ai_content = models.JSONField(null=True, blank=True)  # AI generated content
    ai_keywords = models.CharField(max_length=500, null=True, blank=True)
    
    # Quiz/Assessment
    quiz = models.JSONField(null=True, blank=True)  # Quiz data structure
    assessment_info = models.JSONField(null=True, blank=True)
    
    # Scheduling
    scheduled_date = models.DateField(null=True, blank=True)
    scheduled_time = models.TimeField(null=True, blank=True)
    scheduled_datetime = models.DateTimeField(null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    due_time = models.TimeField(null=True, blank=True)
    due_datetime = models.DateTimeField(null=True, blank=True)
    
    # Certification
    certification = models.JSONField(null=True, blank=True)
    has_certificate = models.BooleanField(default=False)
    
    # Skills
    skills = models.JSONField(default=list, blank=True)  # Array of skill strings
    
    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_sessions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    saved_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'sessions'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


class SessionRequest(models.Model):
    """Employee requests for session access"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('locked', 'Locked'),
    ]
    
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='session_requests')
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='requests')
    attempts_used = models.IntegerField(default=0)
    max_attempts = models.IntegerField(default=3)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    reason = models.TextField(null=True, blank=True)
    locked_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'session_requests'
        unique_together = ['employee', 'session']
    
    def __str__(self):
        return f"{self.employee.username} - {self.session.title}"


class SessionCompletion(models.Model):
    """Track employee session completions"""
    employee = models.ForeignKey(User, on_delete=models.CASCADE, related_name='completed_sessions')
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='completions')
    score = models.FloatField(null=True, blank=True)
    passed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(auto_now_add=True)
    feedback = models.JSONField(null=True, blank=True)
    
    class Meta:
        db_table = 'session_completions'
        unique_together = ['employee', 'session']
    
    def __str__(self):
        return f"{self.employee.username} completed {self.session.title}"

