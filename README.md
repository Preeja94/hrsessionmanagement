# HR Session Management Application

A comprehensive HR session management application built with Django backend and React frontend, featuring dual authentication for employees and HR admins.

## Features

- **Dual Authentication**: Separate login interfaces for employees and HR admins
- **Role-based Access Control**: Different dashboards and permissions based on user roles
- **Session Management**: Create, schedule, and manage HR sessions
- **Content Creation**: AI-powered PPT generation and video demo creation
- **Questionnaire System**: Create and distribute surveys to employees
- **Employee Dashboard**: Access to learning content and session participation
- **Admin Dashboard**: Comprehensive management tools for HR administrators

## Technology Stack

- **Backend**: Django 5.2.7 with Django REST Framework
- **Frontend**: React 18 with Material-UI
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: Token-based authentication with role management

## Project Structure

```
hr-session-management/
├── backend/                 # Django backend
│   ├── authentication/     # Authentication app
│   ├── hr_session_management/  # Main Django project
│   ├── requirements.txt    # Python dependencies
│   └── manage.py          # Django management script
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main App component
│   │   └── index.js       # Entry point
│   └── package.json       # Node.js dependencies
└── README.md              # This file
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Create sample users:
   ```bash
   python setup_users.py
   ```

6. Start the Django server:
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## Sample Users

### Employee Login
- **Username**: employee@company.com
- **Password**: password123
- **Role**: Employee

### HR Admin Login
- **Username**: admin@company.com
- **Password**: admin123
- **Role**: HR Admin

## API Endpoints

- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile

## Features Overview

### Login Page
- Dual authentication tabs (Employee/HR Admin)
- Modern, responsive design matching the provided mockup
- Form validation and error handling
- Role-based redirection after login

### Employee Dashboard
- View upcoming sessions
- Access learning content
- Complete questionnaires
- Track learning progress

### Admin Dashboard
- Session management
- Content creation tools
- User statistics
- Questionnaire management
- AI-powered content generation

## Development

### Adding New Features

1. **Backend**: Add new models, views, and serializers in the appropriate Django app
2. **Frontend**: Create new React components and add routes in App.js
3. **Database**: Create and run migrations for model changes

### Database Migrations

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate
```

## Production Deployment

1. Set up a production database (PostgreSQL recommended)
2. Configure environment variables
3. Set DEBUG=False in settings
4. Use a production WSGI server (Gunicorn)
5. Serve static files with a web server (Nginx)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
