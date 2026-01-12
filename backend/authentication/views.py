from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.db import transaction
import os
import json
from .serializers import (
    UserSerializer, LoginSerializer, EmployeeProfileSerializer,
    EmployeeCreateSerializer, SessionSerializer, SessionListSerializer,
    SessionRequestSerializer, SessionCompletionSerializer
)
from .models import User, EmployeeProfile, Session, SessionRequest, SessionCompletion, Notification

# Try to import AI libraries (optional - will work without them)
try:
    import openai
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(username=username, password=password)
        if user:
            token, created = Token.objects.get_or_create(user=user)
            user_serializer = UserSerializer(user)
            return Response({
                'token': token.key,
                'user': user_serializer.data,
                'password_reset_required': user.password_reset_required
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        # Blacklisting the tokens
        request.user.auth_token.delete()
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


def generate_simulated_content(keywords):
    """
    Generate simulated training content based on keywords without using real AI API.
    This provides realistic content structure for testing without API keys.
    """
    keywords_lower = keywords.lower()
    
    # Create structured content based on keywords
    content_templates = {
        'title': f"Training Session: {keywords}",
        'description': f"""This comprehensive training session on {keywords} is designed to provide employees with essential knowledge and skills. The content covers fundamental concepts, best practices, and practical applications that are crucial for workplace success and professional development.

Participants will learn through interactive modules, real-world examples, and hands-on activities that ensure understanding and retention of key concepts related to {keywords}.""",
        'content': f"""# {keywords}

## Overview
This training session provides a comprehensive overview of {keywords}, covering essential concepts, best practices, and practical applications for the workplace.

## Learning Objectives
By the end of this session, participants will be able to:
- Understand the fundamental concepts of {keywords}
- Identify key principles and guidelines
- Apply best practices in real-world scenarios
- Recognize common challenges and solutions

## Key Concepts

### Definition and Importance
{keywords} plays a crucial role in modern workplace environments. Understanding this topic is essential for:
- Professional development and growth
- Workplace effectiveness and productivity
- Compliance with industry standards
- Building a positive work environment

### Core Principles
1. **Foundation**: Understanding the basics of {keywords}
2. **Application**: How to apply these concepts in daily work
3. **Best Practices**: Industry-standard approaches and methods
4. **Continuous Improvement**: Strategies for ongoing development

## Best Practices and Guidelines

### Implementation Steps
1. Assess current understanding and identify knowledge gaps
2. Develop a structured learning plan
3. Engage in hands-on practice and application
4. Review and reinforce key concepts regularly

### Common Challenges
- Maintaining consistency in application
- Adapting to different scenarios
- Staying updated with latest developments
- Ensuring team-wide understanding

## Real-World Examples and Case Studies

### Case Study 1: Successful Implementation
A leading organization successfully implemented {keywords} practices, resulting in:
- Improved employee engagement
- Enhanced workplace culture
- Better compliance and outcomes

### Case Study 2: Lessons Learned
This example demonstrates how common challenges were addressed and resolved through structured approaches and team collaboration.

## Interactive Learning Activities

### Activity 1: Concept Mapping
Create a visual representation of key concepts and their relationships.

### Activity 2: Scenario Analysis
Analyze real-world scenarios and discuss appropriate responses and strategies.

### Activity 3: Group Discussion
Engage in collaborative discussions about best practices and experiences.

## Summary and Key Takeaways

### Main Points
- Understanding {keywords} is essential for professional success
- Consistent application of best practices leads to better outcomes
- Continuous learning and improvement are key to staying effective

### Next Steps
- Review the materials and take notes
- Practice applying concepts in your daily work
- Seek feedback and opportunities for improvement
- Stay engaged with ongoing learning resources

## Additional Resources
- Reference materials and documentation
- Related training sessions and workshops
- Support and guidance resources""",
        'keyPoints': [
            f"Fundamental concepts of {keywords}",
            "Best practices and guidelines",
            "Real-world applications and examples",
            "Strategies for continuous improvement"
        ],
        'learningObjectives': [
            f"Understand core concepts related to {keywords}",
            "Apply best practices in workplace scenarios",
            "Identify and address common challenges",
            "Implement strategies for ongoing development"
        ]
    }
    
    return content_templates


@api_view(['POST'])
@permission_classes([AllowAny])  # Allow any for now, can be changed to IsAuthenticated
def generate_ai_content(request):
    """
    Generate AI content based on keywords using OpenAI or Anthropic Claude.
    Falls back to simulated content if API keys are not configured.
    Expects: { "keywords": "mental health awareness", "provider": "openai" or "anthropic" }
    """
    keywords = request.data.get('keywords', '').strip()
    provider = request.data.get('provider', 'openai').lower()  # 'openai' or 'anthropic'
    use_real_api = request.data.get('use_real_api', False)  # Optional flag to force real API
    
    if not keywords:
        return Response(
            {'error': 'Keywords are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Check if API keys are available and user wants real API
        has_openai_key = bool(os.getenv('OPENAI_API_KEY'))
        has_anthropic_key = bool(os.getenv('ANTHROPIC_API_KEY'))
        
        # If no API keys configured, use simulated content (no API calls needed)
        if not has_openai_key and not has_anthropic_key:
            content_data = generate_simulated_content(keywords)
            return Response({
                'success': True,
                'keywords': keywords,
                'provider': 'simulated',
                'content': content_data,
                'generatedAt': None,
                'message': 'Using simulated content generation. Add API keys to .env and set use_real_api=true for real AI content.'
            }, status=status.HTTP_200_OK)
        
        # Get API keys from environment variables
        if provider == 'openai' and (use_real_api or has_openai_key):
            api_key = os.getenv('OPENAI_API_KEY')
            if not OPENAI_AVAILABLE:
                # Fall back to simulated if library not installed
                content_data = generate_simulated_content(keywords)
                return Response({
                    'success': True,
                    'keywords': keywords,
                    'provider': 'simulated',
                    'content': content_data,
                    'generatedAt': None,
                    'message': 'OpenAI library not installed. Using simulated content. Run: pip install openai'
                }, status=status.HTTP_200_OK)
            if not api_key:
                # Fall back to simulated if no key
                content_data = generate_simulated_content(keywords)
                return Response({
                    'success': True,
                    'keywords': keywords,
                    'provider': 'simulated',
                    'content': content_data,
                    'generatedAt': None,
                    'message': 'OPENAI_API_KEY not configured. Using simulated content.'
                }, status=status.HTTP_200_OK)
            
            # Initialize OpenAI client
            client = openai.OpenAI(api_key=api_key)
            
            # Create a comprehensive prompt for training content
            prompt = f"""Create comprehensive training content for a learning session about: {keywords}

Please provide:
1. A clear and engaging title
2. A detailed description (2-3 paragraphs)
3. Structured learning content with:
   - Key concepts and definitions
   - Best practices and guidelines
   - Real-world examples and case studies
   - Interactive learning activities
   - Summary and key takeaways

Format the response as JSON with the following structure:
{{
  "title": "Training Session Title",
  "description": "Detailed description...",
  "content": "Full structured content with sections...",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "learningObjectives": ["Objective 1", "Objective 2"]
}}

Make the content professional, educational, and suitable for workplace training."""
            
            # Call OpenAI API
            response = client.chat.completions.create(
                model="gpt-4o-mini",  # Using gpt-4o-mini for cost efficiency, can change to gpt-4 or gpt-3.5-turbo
                messages=[
                    {"role": "system", "content": "You are an expert instructional designer creating comprehensive training materials for workplace learning."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=2000
            )
            
            # Extract the generated content
            generated_text = response.choices[0].message.content
            
            # Try to parse as JSON, if not, use as plain text
            try:
                content_data = json.loads(generated_text)
            except json.JSONDecodeError:
                # If not JSON, create structured response
                content_data = {
                    "title": f"Training Session: {keywords}",
                    "description": f"Comprehensive learning materials about {keywords}.",
                    "content": generated_text,
                    "keyPoints": [],
                    "learningObjectives": []
                }
            
            return Response({
                'success': True,
                'keywords': keywords,
                'provider': 'openai',
                'content': content_data,
                'generatedAt': response.created
            }, status=status.HTTP_200_OK)
            
        elif provider == 'anthropic' and (use_real_api or has_anthropic_key):
            api_key = os.getenv('ANTHROPIC_API_KEY')
            if not ANTHROPIC_AVAILABLE:
                # Fall back to simulated if library not installed
                content_data = generate_simulated_content(keywords)
                return Response({
                    'success': True,
                    'keywords': keywords,
                    'provider': 'simulated',
                    'content': content_data,
                    'generatedAt': None,
                    'message': 'Anthropic library not installed. Using simulated content. Run: pip install anthropic'
                }, status=status.HTTP_200_OK)
            if not api_key:
                # Fall back to simulated if no key
                content_data = generate_simulated_content(keywords)
                return Response({
                    'success': True,
                    'keywords': keywords,
                    'provider': 'simulated',
                    'content': content_data,
                    'generatedAt': None,
                    'message': 'ANTHROPIC_API_KEY not configured. Using simulated content.'
                }, status=status.HTTP_200_OK)
            
            # Initialize Anthropic client
            client = anthropic.Anthropic(api_key=api_key)
            
            # Create a comprehensive prompt for training content
            prompt = f"""Create comprehensive training content for a learning session about: {keywords}

Please provide:
1. A clear and engaging title
2. A detailed description (2-3 paragraphs)
3. Structured learning content with:
   - Key concepts and definitions
   - Best practices and guidelines
   - Real-world examples and case studies
   - Interactive learning activities
   - Summary and key takeaways

Format the response as JSON with the following structure:
{{
  "title": "Training Session Title",
  "description": "Detailed description...",
  "content": "Full structured content with sections...",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "learningObjectives": ["Objective 1", "Objective 2"]
}}

Make the content professional, educational, and suitable for workplace training."""
            
            # Call Anthropic Claude API
            message = client.messages.create(
                model="claude-3-5-sonnet-20241022",  # Using Claude 3.5 Sonnet
                max_tokens=2000,
                temperature=0.7,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            # Extract the generated content
            generated_text = message.content[0].text
            
            # Try to parse as JSON, if not, use as plain text
            try:
                content_data = json.loads(generated_text)
            except json.JSONDecodeError:
                # If not JSON, create structured response
                content_data = {
                    "title": f"Training Session: {keywords}",
                    "description": f"Comprehensive learning materials about {keywords}.",
                    "content": generated_text,
                    "keyPoints": [],
                    "learningObjectives": []
                }
            
            return Response({
                'success': True,
                'keywords': keywords,
                'provider': 'anthropic',
                'content': content_data,
                'generatedAt': message.model
            }, status=status.HTTP_200_OK)
            
        else:
            # Invalid provider or no real API requested - fall back to simulated content
            content_data = generate_simulated_content(keywords)
            return Response({
                'success': True,
                'keywords': keywords,
                'provider': 'simulated',
                'content': content_data,
                'generatedAt': None,
                'message': 'Using simulated content generation. Set provider="openai" or "anthropic" with API keys for real AI content.'
            }, status=status.HTTP_200_OK)
            
    except Exception as e:
        # On error, fall back to simulated content instead of failing
        try:
            content_data = generate_simulated_content(keywords)
            return Response({
                'success': True,
                'keywords': keywords,
                'provider': 'simulated',
                'content': content_data,
                'generatedAt': None,
                'message': f'AI API error ({str(e)}). Using simulated content generation.'
            }, status=status.HTTP_200_OK)
        except Exception as fallback_error:
            return Response(
                {'error': f'Failed to generate content: {str(e)}. Fallback also failed: {str(fallback_error)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# ==================== Employee Management API ====================

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def employees_list(request):
    """List all employees or create a new employee"""
    if request.method == 'GET':
        # Get all employees with their profiles
        employees = []
        users = User.objects.all().select_related('employee_profile')
        for user in users:
            try:
                profile = user.employee_profile
                serializer = EmployeeProfileSerializer(profile)
                employees.append(serializer.data)
            except EmployeeProfile.DoesNotExist:
                # If no profile exists, create a basic representation
                employees.append({
                    'id': user.id,
                    'firstName': user.first_name or '',
                    'lastName': user.last_name or '',
                    'email': user.email or '',
                    'phone': user.phone_number or '',
                    'department': user.department or '',
                    'employeeId': user.employee_id or '',
                    'role': user.role,
                    'jobRole': '',
                    'reportingManager': '',
                    'keyskills': [],
                    'status': 'active',
                    'created_at': user.date_joined.isoformat() if user.date_joined else None,
                    'updated_at': user.updated_at.isoformat() if hasattr(user, 'updated_at') else None,
                })
        return Response(employees, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        # Create new employee
        serializer = EmployeeCreateSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    # Create User
                    username = serializer.validated_data.get('email', '').split('@')[0]
                    # Ensure username is unique
                    base_username = username
                    counter = 1
                    while User.objects.filter(username=username).exists():
                        username = f"{base_username}{counter}"
                        counter += 1
                    
                    user = User.objects.create_user(
                        username=username,
                        email=serializer.validated_data['email'],
                        password=serializer.validated_data['password'],
                        first_name=serializer.validated_data['firstName'],
                        last_name=serializer.validated_data['lastName'],
                        phone_number=serializer.validated_data.get('phone', ''),
                        department=serializer.validated_data.get('department', ''),
                        employee_id=serializer.validated_data.get('employeeId', ''),
                        role=serializer.validated_data.get('role', 'employee'),
                        password_reset_required=True,  # New employees must reset password on first login
                    )
                    
                    # Create EmployeeProfile
                    profile = EmployeeProfile.objects.create(
                        user=user,
                        job_role=serializer.validated_data.get('jobRole', ''),
                        reporting_manager=serializer.validated_data.get('reportingManager', ''),
                        keyskills=serializer.validated_data.get('keyskills', []),
                    )
                    
                    profile_serializer = EmployeeProfileSerializer(profile)
                    return Response(profile_serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response(
                    {'error': f'Failed to create employee: {str(e)}'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def employee_detail(request, pk):
    """Retrieve, update or delete an employee"""
    try:
        user = User.objects.get(pk=pk)
        try:
            profile = user.employee_profile
        except EmployeeProfile.DoesNotExist:
            # Create profile if it doesn't exist
            profile = EmployeeProfile.objects.create(
                user=user,
                job_role='',
                reporting_manager='',
                keyskills=[]
            )
    except User.DoesNotExist:
        return Response(
            {'error': 'Employee not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        serializer = EmployeeProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        data = request.data
        
        # Update User fields
        if 'firstName' in data:
            user.first_name = data['firstName']
        if 'lastName' in data:
            user.last_name = data['lastName']
        if 'email' in data:
            user.email = data['email']
        if 'phone' in data:
            user.phone_number = data['phone']
        if 'department' in data:
            user.department = data['department']
        if 'employeeId' in data:
            user.employee_id = data['employeeId']
        if 'role' in data:
            user.role = data['role']
        if 'password' in data and data['password']:
            user.set_password(data['password'])
        user.save()
        
        # Update Profile fields
        if 'jobRole' in data:
            profile.job_role = data['jobRole']
        if 'reportingManager' in data:
            profile.reporting_manager = data['reportingManager']
        if 'keyskills' in data:
            profile.keyskills = data['keyskills']
        if 'status' in data:
            profile.status = data['status']
        profile.save()
        
        serializer = EmployeeProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'DELETE':
        user.delete()  # This will cascade delete the profile
        return Response(
            {'message': 'Employee deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )


# ==================== Session Management API ====================

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def sessions_list(request):
    """List all sessions or create a new session"""
    if request.method == 'GET':
        from django.utils import timezone
        
        # Auto-publish scheduled sessions when start time arrives
        now = timezone.now()
        scheduled_sessions = Session.objects.filter(
            status='scheduled',
            scheduled_datetime__lte=now
        )
        for session in scheduled_sessions:
            session.status = 'published'
            if not session.published_at:
                session.published_at = now
            session.save()
        
        status_filter = request.query_params.get('status', None)
        sessions = Session.objects.all().select_related('created_by').order_by('-updated_at', '-created_at')
        if status_filter:
            sessions = sessions.filter(status=status_filter)
        # Use lightweight serializer for list view (excludes heavy JSON fields)
        serializer = SessionListSerializer(sessions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = SessionSerializer(data=request.data)
        if serializer.is_valid():
            created_session = serializer.save(created_by=request.user)
            
            # Create notifications when session is created as scheduled
            if created_session.status == 'scheduled' and created_session.scheduled_datetime:
                # Get all employees based on audience
                from django.contrib.auth import get_user_model
                User = get_user_model()
                
                # Determine target employees
                if created_session.audience and created_session.audience.lower().strip() in ['all', 'all employees']:
                    # Notify all employees
                    employees = User.objects.filter(role='employee', is_active=True)
                else:
                    # Notify employees matching the audience (skills/department)
                    # For now, notify all employees if audience is not 'all'
                    employees = User.objects.filter(role='employee', is_active=True)
                
                # Create notifications for all target employees
                scheduled_date_str = created_session.scheduled_datetime.strftime('%B %d, %Y at %I:%M %p')
                for employee in employees:
                    Notification.objects.create(
                        user=employee,
                        type='session_scheduled',
                        title='New Session Scheduled',
                        message=f'A new session "{created_session.title}" has been scheduled for {scheduled_date_str}.',
                        related_session=created_session
                    )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def session_detail(request, pk):
    """Retrieve, update or delete a session"""
    try:
        session = Session.objects.get(pk=pk)
    except Session.DoesNotExist:
        return Response(
            {'error': 'Session not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        serializer = SessionSerializer(session)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        old_status = session.status
        old_scheduled_datetime = session.scheduled_datetime
        serializer = SessionSerializer(session, data=request.data, partial=True)
        if serializer.is_valid():
            updated_session = serializer.save()
            
            # Create notifications when session is scheduled
            if updated_session.status == 'scheduled' and updated_session.scheduled_datetime:
                # Check if this is a new schedule or reschedule
                is_new_schedule = old_status != 'scheduled' or old_scheduled_datetime != updated_session.scheduled_datetime
                
                if is_new_schedule:
                    # Get all employees based on audience
                    from django.contrib.auth import get_user_model
                    User = get_user_model()
                    
                    # Determine target employees
                    if updated_session.audience and updated_session.audience.lower().strip() in ['all', 'all employees']:
                        # Notify all employees
                        employees = User.objects.filter(role='employee', is_active=True)
                    else:
                        # Notify employees matching the audience (skills/department)
                        # For now, notify all employees if audience is not 'all'
                        # You can enhance this to filter by skills/department later
                        employees = User.objects.filter(role='employee', is_active=True)
                    
                    # Create notifications for all target employees
                    scheduled_date_str = updated_session.scheduled_datetime.strftime('%B %d, %Y at %I:%M %p')
                    for employee in employees:
                        Notification.objects.create(
                            user=employee,
                            type='session_scheduled',
                            title='New Session Scheduled',
                            message=f'A new session "{updated_session.title}" has been scheduled for {scheduled_date_str}.',
                            related_session=updated_session
                        )
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        session.delete()
        return Response(
            {'message': 'Session deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )


# ==================== Session Request API ====================

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def session_requests_list(request):
    """List all session requests or create a new request"""
    if request.method == 'GET':
        status_filter = request.query_params.get('status', None)
        requests = SessionRequest.objects.all()
        if status_filter:
            requests = requests.filter(status=status_filter)
        requests = requests.select_related('employee', 'session')
        serializer = SessionRequestSerializer(requests, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = SessionRequestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def session_request_detail(request, pk):
    """Retrieve, update or delete a session request"""
    try:
        session_request = SessionRequest.objects.get(pk=pk)
    except SessionRequest.DoesNotExist:
        return Response(
            {'error': 'Session request not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        serializer = SessionRequestSerializer(session_request)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        serializer = SessionRequestSerializer(session_request, data=request.data, partial=True)
        if serializer.is_valid():
            old_status = session_request.status
            updated_request = serializer.save()
            
            # Send notification if status changed to approved or rejected
            if old_status != updated_request.status:
                if updated_request.status == 'approved':
                    # Create notification for employee
                    Notification.objects.create(
                        user=updated_request.employee,
                        type='session_approved',
                        title='Session Access Approved',
                        message=f'Your request for "{updated_request.session.title}" has been approved. You can now access the session.',
                        related_session=updated_request.session
                    )
                elif updated_request.status == 'rejected':
                    # Create notification for employee
                    Notification.objects.create(
                        user=updated_request.employee,
                        type='session_rejected',
                        title='Session Access Rejected',
                        message=f'Your request for "{updated_request.session.title}" has been rejected. Please contact HR for more information.',
                        related_session=updated_request.session
                    )
            
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        session_request.delete()
        return Response(
            {'message': 'Session request deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )


# ==================== Session Completion API ====================

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def session_completions_list(request):
    """List all session completions or create a new completion"""
    if request.method == 'GET':
        employee_id = request.query_params.get('employee', None)
        session_id = request.query_params.get('session', None)
        completions = SessionCompletion.objects.all()
        if employee_id:
            completions = completions.filter(employee_id=employee_id)
        if session_id:
            completions = completions.filter(session_id=session_id)
        completions = completions.select_related('employee', 'session')
        serializer = SessionCompletionSerializer(completions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        # Calculate attempt number if not provided
        employee_id = request.data.get('employee')
        session_id = request.data.get('session')
        
        if employee_id and session_id:
            # Get the highest attempt number for this employee-session pair
            last_attempt = SessionCompletion.objects.filter(
                employee_id=employee_id,
                session_id=session_id
            ).order_by('-attempt_number').first()
            
            attempt_number = 1
            if last_attempt:
                attempt_number = last_attempt.attempt_number + 1
            
            # Add attempt_number to request data if not provided
            data = request.data.copy()
            if 'attempt_number' not in data:
                data['attempt_number'] = attempt_number
        else:
            data = request.data
        
        serializer = SessionCompletionSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_data(request):
    """Get analytics data for admin dashboard"""
    from django.db.models import Count, Avg, Q, Max
    from django.utils import timezone
    
    # Get all employees with their completions
    employees_with_completions = User.objects.filter(
        role='employee'
    ).prefetch_related(
        'completed_sessions',
        'employee_profile'
    ).annotate(
        sessions_completed_count=Count('completed_sessions', filter=Q(completed_sessions__passed=True)),
        total_attempts=Count('completed_sessions'),
        avg_score=Avg('completed_sessions__score'),
        last_activity=Max('completed_sessions__completed_at')
    )
    
    # Calculate employee performance
    employee_performance = []
    for user in employees_with_completions:
        try:
            profile = user.employee_profile
            job_role = profile.job_role or ''
            department = user.department or ''
        except EmployeeProfile.DoesNotExist:
            job_role = ''
            department = user.department or ''
        
        # Get unique sessions completed (passed)
        passed_completions = SessionCompletion.objects.filter(
            employee=user,
            passed=True
        ).values('session').distinct()
        unique_sessions_completed = passed_completions.count()
        
        # Get total published sessions available
        total_sessions = Session.objects.filter(status='published').count()
        
        # Calculate completion rate
        completion_rate = round((unique_sessions_completed / total_sessions * 100)) if total_sessions > 0 else 0
        
        # Get average rating from feedback (if available)
        ratings = []
        for completion in SessionCompletion.objects.filter(employee=user, passed=True):
            if completion.feedback and isinstance(completion.feedback, dict):
                rating = completion.feedback.get('rating')
                if rating:
                    try:
                        ratings.append(float(rating))
                    except (ValueError, TypeError):
                        pass
        
        average_rating = round(sum(ratings) / len(ratings), 1) if ratings else 0
        
        employee_performance.append({
            'id': user.id,
            'name': f"{user.first_name or ''} {user.last_name or ''}".strip() or user.username,
            'department': department,
            'jobRole': job_role,
            'sessionsCompleted': unique_sessions_completed,
            'totalSessions': total_sessions,
            'completionRate': completion_rate,
            'averageRating': average_rating,
            'lastActivity': user.last_activity.isoformat() if user.last_activity else None,
            'status': 'active'
        })
    
    # Calculate overall metrics
    total_learners = len(employee_performance)
    total_sessions_completed = sum(emp['sessionsCompleted'] for emp in employee_performance)
    total_sessions_available = Session.objects.filter(status='published').count()
    average_completion_rate = round((total_sessions_completed / (total_sessions_available * total_learners * 100)) * 100) if total_learners > 0 and total_sessions_available > 0 else 0
    
    # Recalculate average completion rate based on individual employee rates
    if total_learners > 0:
        average_completion_rate = round(sum(emp['completionRate'] for emp in employee_performance) / total_learners)
    
    # Calculate average rating
    all_ratings = []
    for emp in employee_performance:
        if emp['averageRating'] > 0:
            all_ratings.append(emp['averageRating'])
    average_rating = round(sum(all_ratings) / len(all_ratings), 1) if all_ratings else 0
    
    # Get active sessions (pending/locked session requests)
    active_sessions = SessionRequest.objects.filter(
        Q(status='pending') | Q(status='locked')
    ).count()
    
    # Sort by completion rate for top performers
    top_performers = sorted(
        employee_performance,
        key=lambda x: (x['completionRate'], x['sessionsCompleted']),
        reverse=True
    )[:3]
    
    return Response({
        'totalLearners': total_learners,
        'completionRate': average_completion_rate,
        'averageRating': average_rating,
        'activeSessions': active_sessions,
        'totalSessionsCompleted': total_sessions_completed,
        'employeePerformance': employee_performance,
        'topPerformers': top_performers
    }, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def notifications_list(request):
    """List all notifications for the current user or create a new notification"""
    if request.method == 'GET':
        notifications = Notification.objects.filter(user=request.user)
        from .serializers import NotificationSerializer
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        from .serializers import NotificationSerializer
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def notification_detail(request, pk):
    """Retrieve, update or delete a notification"""
    try:
        notification = Notification.objects.get(pk=pk, user=request.user)
    except Notification.DoesNotExist:
        return Response(
            {'error': 'Notification not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        from .serializers import NotificationSerializer
        serializer = NotificationSerializer(notification)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        from .serializers import NotificationSerializer
        serializer = NotificationSerializer(notification, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        notification.delete()
        return Response(
            {'message': 'Notification deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_notifications_read(request):
    """Mark all notifications as read for the current user"""
    Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
    return Response(
        {'message': 'All notifications marked as read'},
        status=status.HTTP_200_OK
    )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reset_password(request):
    """Reset password for first-time login"""
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')
    confirm_password = request.data.get('confirm_password')
    
    if not all([current_password, new_password, confirm_password]):
        return Response(
            {'error': 'All password fields are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if new_password != confirm_password:
        return Response(
            {'error': 'New password and confirm password do not match'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if len(new_password) < 8:
        return Response(
            {'error': 'Password must be at least 8 characters long'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Verify current password
    user = request.user
    if not user.check_password(current_password):
        return Response(
            {'error': 'Current password is incorrect'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Set new password
    user.set_password(new_password)
    user.password_reset_required = False
    user.save()
    
    return Response(
        {'message': 'Password reset successfully'},
        status=status.HTTP_200_OK
    )

