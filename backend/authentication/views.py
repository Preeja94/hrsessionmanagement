from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.conf import settings
import os
import json
from .serializers import UserSerializer, LoginSerializer

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
                'user': user_serializer.data
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

