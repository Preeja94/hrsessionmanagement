from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, EmployeeProfile, Session, SessionRequest, SessionCompletion


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'role', 'employee_id', 'department', 'is_active']
    list_filter = ['role', 'is_active', 'is_verified']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'employee_id', 'department', 'phone_number', 'is_verified')}),
    )


@admin.register(EmployeeProfile)
class EmployeeProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'job_role', 'reporting_manager', 'status']
    list_filter = ['status', 'job_role']
    search_fields = ['user__first_name', 'user__last_name', 'user__email', 'job_role']


@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ['title', 'type', 'status', 'created_by', 'created_at']
    list_filter = ['status', 'type', 'created_at']
    search_fields = ['title', 'description']
    date_hierarchy = 'created_at'


@admin.register(SessionRequest)
class SessionRequestAdmin(admin.ModelAdmin):
    list_display = ['employee', 'session', 'status', 'attempts_used', 'max_attempts', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['employee__username', 'session__title']


@admin.register(SessionCompletion)
class SessionCompletionAdmin(admin.ModelAdmin):
    list_display = ['employee', 'session', 'score', 'passed', 'completed_at']
    list_filter = ['passed', 'completed_at']
    search_fields = ['employee__username', 'session__title']

