from rest_framework import serializers
from .models import User, EmployeeProfile, Session, SessionRequest, SessionCompletion


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 
                  'role', 'employee_id', 'department', 'phone_number', 
                  'is_verified', 'password_reset_required', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class EmployeeProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), 
        source='user', 
        write_only=True, 
        required=False
    )
    firstName = serializers.CharField(source='user.first_name', read_only=True)
    lastName = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    phone = serializers.CharField(source='user.phone_number', read_only=True)
    department = serializers.CharField(source='user.department', read_only=True)
    employeeId = serializers.CharField(source='user.employee_id', read_only=True)
    role = serializers.CharField(source='user.role', read_only=True)
    jobRole = serializers.CharField(source='job_role')
    reportingManager = serializers.CharField(source='reporting_manager')
    keyskills = serializers.JSONField()
    
    class Meta:
        model = EmployeeProfile
        fields = ['id', 'user', 'user_id', 'firstName', 'lastName', 'email', 'phone',
                  'department', 'employeeId', 'role', 'jobRole', 'reportingManager',
                  'keyskills', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class EmployeeCreateSerializer(serializers.Serializer):
    """Serializer for creating employees with user and profile"""
    firstName = serializers.CharField()
    lastName = serializers.CharField()
    email = serializers.EmailField()
    phone = serializers.CharField(required=False, allow_blank=True)
    department = serializers.CharField(required=False, allow_blank=True)
    employeeId = serializers.CharField(required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default='employee')
    password = serializers.CharField(write_only=True)
    jobRole = serializers.CharField(required=False, allow_blank=True)
    reportingManager = serializers.CharField(required=False, allow_blank=True)
    keyskills = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        allow_empty=True
    )


class SessionListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing sessions (excludes heavy fields)"""
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    skills = serializers.JSONField(default=list, allow_null=True)
    
    class Meta:
        model = Session
        fields = ['id', 'title', 'description', 'type', 'status', 'creation_mode',
                  'scheduled_date', 'scheduled_time', 'scheduled_datetime',
                  'due_date', 'due_time', 'due_datetime',
                  'has_certificate', 'skills', 'created_by', 'created_by_name',
                  'created_at', 'updated_at', 'published_at', 'saved_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by_name']


class SessionSerializer(serializers.ModelSerializer):
    """Full serializer for session detail/create/update (includes all fields)"""
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    skills = serializers.JSONField(default=list, allow_null=True)
    
    class Meta:
        model = Session
        fields = ['id', 'title', 'description', 'type', 'status', 'creation_mode',
                  'files', 'ai_content', 'ai_keywords', 'quiz', 'assessment_info',
                  'scheduled_date', 'scheduled_time', 'scheduled_datetime',
                  'due_date', 'due_time', 'due_datetime', 'certification',
                  'has_certificate', 'skills', 'audience', 'created_by', 'created_by_name',
                  'created_at', 'updated_at', 'published_at', 'saved_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by_name']


class SessionRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    employee_email = serializers.CharField(source='employee.email', read_only=True)
    session_name = serializers.CharField(source='session.title', read_only=True)
    
    class Meta:
        model = SessionRequest
        fields = ['id', 'employee', 'employee_name', 'employee_email', 'session',
                  'session_name', 'attempts_used', 'max_attempts', 'status',
                  'reason', 'locked_date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class SessionCompletionSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.get_full_name', read_only=True)
    session_name = serializers.CharField(source='session.title', read_only=True)
    
    class Meta:
        model = SessionCompletion
        fields = ['id', 'employee', 'employee_name', 'session', 'session_name',
                  'score', 'passed', 'completed_at', 'feedback']
        read_only_fields = ['id', 'completed_at']

