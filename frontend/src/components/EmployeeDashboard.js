import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  LinearProgress,
  Menu,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Badge,
  ListItemButton
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  LibraryBooks as LibraryIcon,
  Assessment as ReportsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  SupervisorAccount as SupervisorIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import MyCourses from './MyCourses';
import CourseLibrary from './CourseLibrary';
import Reports from './Reports';
import SessionDetail from './SessionDetail';
import SessionContentView from './SessionContentView';

const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  display: 'flex',
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: 280,
  backgroundColor: '#1e293b',
  color: 'white',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
}));

const HeaderBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'white',
  color: '#374151',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
}));

const MetricsCard = styled(Card)(({ theme, color }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  background: color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease',
  },
}));

const ActivityCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
}));

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [currentView, setCurrentView] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  
  // Dynamic metrics state
  const [completedSessions, setCompletedSessions] = useState([2]); // Array of completed session IDs
  const [activeSessions, setActiveSessions] = useState(1);
  const [totalSessionsStarted, setTotalSessionsStarted] = useState(2);
  const [certificatesEarned, setCertificatesEarned] = useState(1);
  
  // Profile data
  const [profileData, setProfileData] = useState({
    firstName: 'Luke',
    lastName: 'Wilson',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    jobRole: 'Senior Developer',
    reportingManager: 'Sarah Johnson',
    email: 'luke.wilson@company.com'
  });

  // Notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Live Session Starting',
      message: 'Mental Health & Wellbeing session is starting in 5 minutes',
      time: '2 minutes ago',
      type: 'live',
      read: false
    },
    {
      id: 2,
      title: 'Upcoming Session',
      message: 'JavaScript ES6+ Mastery session scheduled for tomorrow at 2 PM',
      time: '1 hour ago',
      type: 'upcoming',
      read: false
    },
    {
      id: 3,
      title: 'Session Completed',
      message: 'Congratulations! You completed the React Fundamentals session',
      time: '3 hours ago',
      type: 'completion',
      read: true
    }
  ]);

  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const metrics = [
    { 
      label: 'Total Sessions Attended', 
      value: totalSessionsStarted, 
      color: '#3b82f6', 
      icon: <CheckCircleIcon /> 
    },
    { 
      label: 'Completion Rate', 
      value: `${Math.round((completedSessions.length / totalSessionsStarted) * 100)}%`, 
      color: '#10b981', 
      icon: <TrendingUpIcon /> 
    },
    { 
      label: 'Active Sessions', 
      value: activeSessions, 
      color: '#f59e0b', 
      icon: <PlayIcon /> 
    },
    { 
      label: 'Certificates Earned', 
      value: certificatesEarned, 
      color: '#ef4444', 
      icon: <StarIcon /> 
    }
  ];

  const latestSession = {
    id: 1,
    title: 'Mental Health & Wellbeing',
    instructor: 'Dr. Sarah Johnson',
    date: '2024-12-25',
    time: '10:00 AM',
    duration: '60 minutes',
    status: 'live',
    description: 'Comprehensive session on maintaining mental wellness in the workplace'
  };

  const recentActivity = [
    {
      id: 1,
      action: 'Completed session',
      session: 'JavaScript ES6+ Mastery',
      time: '2 hours ago',
      icon: <CheckCircleIcon />
    },
    {
      id: 2,
      action: 'Started session',
      session: 'Mental Health & Wellbeing',
      time: '1 day ago',
      icon: <PlayIcon />
    },
    {
      id: 3,
      action: 'Earned certificate',
      session: 'React Fundamentals',
      time: '3 days ago',
      icon: <StarIcon />
    }
  ];

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'my-courses', label: 'My Courses', icon: <SchoolIcon /> },
    { id: 'course-library', label: 'Course Library', icon: <LibraryIcon /> },
    { id: 'reports', label: 'Reports', icon: <ReportsIcon /> },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentView(null);
  };

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleViewProfile = () => {
    setShowProfile(true);
    setProfileAnchorEl(null);
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
    setShowProfile(false);
  };

  const handleProfileSave = () => {
    setShowEditProfile(false);
    setShowProfile(true);
  };

  const handleSessionComplete = (sessionId) => {
    setCompletedSessions(prev => [...prev, sessionId]);
    setActiveSessions(prev => Math.max(0, prev - 1));
    setCertificatesEarned(prev => prev + 1);
  };

  const handleSessionStart = (sessionId) => {
    setActiveSessions(prev => prev + 1);
    setTotalSessionsStarted(prev => prev + 1);
  };

  const handleJoinSession = () => {
    setCurrentView('my-courses');
    setActiveTab('my-courses');
  };

  const handleSessionClick = (session) => {
    setSelectedSession(session);
    setCurrentView('session-detail');
  };

  const handleBackToCourses = () => {
    setCurrentView(null);
    setActiveTab('my-courses');
  };

  const handleGetStarted = (session) => {
    setCurrentView('session-content');
    setSelectedSession(session);
  };

  const handleSessionCompleteFlow = (session) => {
    handleSessionComplete(session.id);
    setCurrentView('my-courses');
    setActiveTab('my-courses');
  };

  const handleNotificationAction = (notificationId, action) => {
    if (action === 'join') {
      handleJoinSession();
    }
    setNotificationAnchorEl(null);
  };

  const handleNotificationCloseItem = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'live': return <PlayIcon />;
      case 'upcoming': return <ScheduleIcon />;
      case 'completion': return <CheckCircleIcon />;
      default: return <NotificationsIcon />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'live': return '#ef4444';
      case 'upcoming': return '#f59e0b';
      case 'completion': return '#10b981';
      default: return '#6b7280';
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const renderDashboard = () => (
    <Box p={3}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back, {profileData.firstName}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ready to continue your learning journey
        </Typography>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={4}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricsCard color={metric.color}>
              <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                {metric.icon}
              </Box>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {metric.value}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                {metric.label}
              </Typography>
            </MetricsCard>
          </Grid>
        ))}
      </Grid>

      {/* Latest Session */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Latest Session
        </Typography>
        <Card sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {latestSession.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {latestSession.description}
              </Typography>
              <Box display="flex" gap={2} mb={2}>
                <Chip 
                  label={`Instructor: ${latestSession.instructor}`} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={`${latestSession.date} at ${latestSession.time}`} 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={latestSession.duration} 
                  size="small" 
                  variant="outlined" 
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4} textAlign="right">
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={handleJoinSession}
                sx={{ 
                  backgroundColor: '#10b981', 
                  '&:hover': { backgroundColor: '#059669' },
                  px: 4,
                  py: 1.5
                }}
              >
                Join Session
              </Button>
            </Grid>
          </Grid>
        </Card>
      </Box>

      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <ActivityCard>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recent Activity
            </Typography>
            <List>
              {recentActivity.map((activity) => (
                <ListItem key={activity.id} sx={{ px: 0 }}>
                  <ListItemIcon>
                    {activity.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.action}
                    secondary={`${activity.session} • ${activity.time}`}
                  />
                </ListItem>
              ))}
            </List>
          </ActivityCard>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <ActivityCard>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Actions
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="outlined"
                startIcon={<SchoolIcon />}
                onClick={() => setActiveTab('my-courses')}
                fullWidth
              >
                View My Courses
              </Button>
              <Button
                variant="outlined"
                startIcon={<LibraryIcon />}
                onClick={() => setActiveTab('course-library')}
                fullWidth
              >
                Browse Library
              </Button>
              <Button
                variant="outlined"
                startIcon={<ReportsIcon />}
                onClick={() => setActiveTab('reports')}
                fullWidth
              >
                View Reports
              </Button>
            </Box>
          </ActivityCard>
        </Grid>
      </Grid>
    </Box>
  );

  const renderProfile = () => (
    <Box p={3}>
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => setShowProfile(false)}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Profile Information
        </Typography>
      </Box>

      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar sx={{ width: 80, height: 80, mr: 3, fontSize: '2rem' }}>
                {profileData.firstName[0]}{profileData.lastName[0]}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {profileData.firstName} {profileData.lastName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {profileData.jobRole}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profileData.department}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} textAlign="right">
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEditProfile}
              sx={{ backgroundColor: '#3b82f6', '&:hover': { backgroundColor: '#2563eb' } }}
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <PersonIcon sx={{ mr: 2, color: '#6b7280' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  First Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {profileData.firstName}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <PersonIcon sx={{ mr: 2, color: '#6b7280' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Last Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {profileData.lastName}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <PhoneIcon sx={{ mr: 2, color: '#6b7280' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Phone Number
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {profileData.phone}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <WorkIcon sx={{ mr: 2, color: '#6b7280' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {profileData.department}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <WorkIcon sx={{ mr: 2, color: '#6b7280' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Job Role
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {profileData.jobRole}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <SupervisorIcon sx={{ mr: 2, color: '#6b7280' }} />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Reporting Manager
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {profileData.reportingManager}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );

  const renderEditProfile = () => (
    <Box p={3}>
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => setShowEditProfile(false)}
          sx={{ mb: 2 }}
        >
          Back to Profile
        </Button>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Edit Profile
        </Typography>
      </Box>

      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="First Name"
              value={profileData.firstName}
              onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Last Name"
              value={profileData.lastName}
              onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Phone Number"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Department"
              value={profileData.department}
              onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Job Role"
              value={profileData.jobRole}
              onChange={(e) => setProfileData(prev => ({ ...prev, jobRole: e.target.value }))}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Reporting Manager"
              value={profileData.reportingManager}
              onChange={(e) => setProfileData(prev => ({ ...prev, reportingManager: e.target.value }))}
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>

        <Box display="flex" gap={2} mt={4}>
          <Button
            variant="contained"
            onClick={handleProfileSave}
            sx={{ backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669' } }}
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            onClick={() => setShowEditProfile(false)}
          >
            Cancel
          </Button>
        </Box>
      </Card>
    </Box>
  );

  return (
    <DashboardContainer>
      {/* Sidebar */}
      <Sidebar>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Employee Portal
        </Typography>
        <Divider sx={{ my: 2, backgroundColor: '#374151' }} />
        <List>
          {navigationItems.map((item) => (
            <ListItem 
              key={item.id} 
              button 
              onClick={() => handleTabChange(item.id)}
              sx={{
                backgroundColor: activeTab === item.id ? '#3b82f6' : 'transparent',
                borderRadius: 1,
                mb: 1,
                '&:hover': {
                  backgroundColor: activeTab === item.id ? '#3b82f6' : '#374151',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Sidebar>

      <MainContent>
        {/* Header */}
        <HeaderBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {activeTab === 'dashboard' ? 'Dashboard' : 
               activeTab === 'my-courses' ? 'My Courses' :
               activeTab === 'course-library' ? 'Course Library' :
               activeTab === 'reports' ? 'Reports' : 'Dashboard'}
            </Typography>
            
            {/* Notifications */}
            <IconButton color="inherit" onClick={handleNotificationClick}>
              <Badge badgeContent={unreadNotifications} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            
            {/* Profile */}
            <IconButton
              color="inherit"
              onClick={handleProfileClick}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {profileData.firstName[0]}
              </Avatar>
            </IconButton>
          </Toolbar>
        </HeaderBar>

        {/* Content */}
        {showProfile ? renderProfile() :
         showEditProfile ? renderEditProfile() :
         currentView === 'session-detail' ? (
           <SessionDetail 
             session={selectedSession} 
             onBack={handleBackToCourses}
             onGetStarted={handleGetStarted}
           />
         ) :
         currentView === 'session-content' ? (
           <SessionContentView 
             session={selectedSession}
             onComplete={handleSessionCompleteFlow}
           />
         ) :
         activeTab === 'dashboard' ? renderDashboard() :
         activeTab === 'my-courses' ? (
           <MyCourses 
             completedSessions={completedSessions.length}
             onSessionComplete={handleSessionComplete}
             onSessionStart={handleSessionStart}
             onSessionClick={handleSessionClick}
           />
         ) :
         activeTab === 'course-library' ? (
           <CourseLibrary 
             completedSessions={completedSessions}
           />
         ) :
         activeTab === 'reports' ? (
           <Reports 
             completedSessions={completedSessions.length}
             certificatesEarned={certificatesEarned}
             totalSessionsAttended={totalSessionsStarted}
             completionRate={Math.round((completedSessions.length / totalSessionsStarted) * 100)}
           />
         ) : null}

        {/* Profile Menu */}
        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileClose}
        >
          <MenuItem onClick={handleViewProfile}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText>View Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
          PaperProps={{
            style: {
              maxHeight: 400,
              width: 350,
            },
          }}
        >
          <Box p={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Notifications
            </Typography>
          </Box>
          <Divider />
          {notifications.map((notification) => (
            <MenuItem 
              key={notification.id}
              onClick={() => {
                markNotificationAsRead(notification.id);
                if (notification.type === 'live') {
                  handleNotificationAction(notification.id, 'join');
                }
              }}
              sx={{
                backgroundColor: notification.read ? 'transparent' : '#f3f4f6',
                borderLeft: notification.read ? 'none' : `4px solid ${getNotificationColor(notification.type)}`
              }}
            >
              <ListItemIcon>
                {getNotificationIcon(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={notification.title}
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </Box>
                }
              />
              {!notification.read && (
                <IconButton 
                  size="small" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNotificationCloseItem(notification.id);
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              )}
            </MenuItem>
          ))}
        </Menu>
      </MainContent>
    </DashboardContainer>
  );
};

export default EmployeeDashboard;
