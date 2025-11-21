from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('reset-password/', views.reset_password, name='reset_password'),
    path('generate-ai-content/', views.generate_ai_content, name='generate_ai_content'),
    
    # Employee Management
    path('employees/', views.employees_list, name='employees_list'),
    path('employees/<int:pk>/', views.employee_detail, name='employee_detail'),
    
    # Session Management
    path('sessions/', views.sessions_list, name='sessions_list'),
    path('sessions/<int:pk>/', views.session_detail, name='session_detail'),
    
    # Session Requests
    path('session-requests/', views.session_requests_list, name='session_requests_list'),
    path('session-requests/<int:pk>/', views.session_request_detail, name='session_request_detail'),
    
    # Session Completions
    path('session-completions/', views.session_completions_list, name='session_completions_list'),
]

