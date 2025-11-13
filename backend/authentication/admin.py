from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'role', 'employee_id', 'department', 'is_active']
    list_filter = ['role', 'is_active', 'is_verified']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role', 'employee_id', 'department', 'phone_number', 'is_verified')}),
    )

