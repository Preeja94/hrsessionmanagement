import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  Lock as LockIcon,
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
import GrowGridLogo from '../assets/Grow Grid logo.PNG';

const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: '#f8f9fa',
  display: 'flex',
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: 280,
  backgroundColor: 'white',
  color: '#374151',
  padding: theme.spacing(2),
  paddingTop: 0,
  display: 'flex',
  flexDirection: 'column',
  borderRight: '1px solid #e5e7eb',
  position: 'sticky',
  top: 0,
  height: '100vh',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  scrollbarWidth: 'none',
  msOverflowStyle: 'none'
}));

const MainContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
}));

const normalizePublishedSession = (session = {}) => ({
  ...session,
  scheduledDate: session.scheduledDate || null,
  scheduledTime: session.scheduledTime || null,
  scheduledDateTime: session.scheduledDateTime || null,
  dueDate: session.dueDate || null,
  dueTime: session.dueTime || null,
  dueDateTime: session.dueDateTime || null,
  isLocked: session.isLocked ?? false,
  approvalExpiresAt: session.approvalExpiresAt || null,
  lastApprovalDate: session.lastApprovalDate || null,
  lockedAt: session.lockedAt || null,
  completedAt: session.completedAt || null,
  lastCompletionScore: session.lastCompletionScore ?? null,
  lastFeedback: session.lastFeedback || null
});

const loadPublishedSessions = () => {
  const stored = localStorage.getItem('published_sessions');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed.map(normalizePublishedSession) : [];
    } catch (error) {
      console.error('Failed to load published sessions', error);
    }
  }
  return [];
};

const HeaderBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'white',
  color: '#374151',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
}));

const MetricsCard = styled(Card)(({ theme, color = '#114417DB' }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: 'white',
  color: '#333',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  border: `2px solid ${color}`,
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
  const [completedSessions, setCompletedSessions] = useState(() => {
    try {
      const stored = localStorage.getItem('employee_completed_sessions');
      const parsed = stored ? JSON.parse(stored) : [];
      const initialSet = new Set([2, ...parsed]);
      return Array.from(initialSet);
    } catch (error) {
      console.error('Failed to load completed sessions', error);
      return [2];
    }
  }); // Array of completed session IDs
  const [activeSessions, setActiveSessions] = useState(1);
  const [totalSessionsStarted, setTotalSessionsStarted] = useState(2);
  const [certificatesEarned, setCertificatesEarned] = useState(1);
  const [sessionCertifications, setSessionCertifications] = useState(() => {
    try {
      const stored = localStorage.getItem('session_certifications');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to read session certifications', error);
      return {};
    }
  });
  const [publishedSessions, setPublishedSessions] = useState(loadPublishedSessions);
  const persistPublishedSessions = useCallback((updater) => {
    setPublishedSessions(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      const normalized = Array.isArray(next) ? next.map(normalizePublishedSession) : [];
      try {
        localStorage.setItem('published_sessions', JSON.stringify(normalized));
        window.dispatchEvent(new Event('published-sessions-updated'));
      } catch (error) {
        console.error('Failed to persist published sessions', error);
      }
      return normalized;
    });
  }, []);
  
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

  const hasCertificationForSession = (sessionId) => {
    if (!sessionId) return false;
    return Boolean(sessionCertifications && sessionCertifications[sessionId]);
  };

  useEffect(() => {
    const syncSessionCertifications = () => {
      try {
        const stored = localStorage.getItem('session_certifications');
        setSessionCertifications(stored ? JSON.parse(stored) : {});
      } catch (error) {
        console.error('Failed to sync session certifications', error);
      }
    };

    window.addEventListener('session-certifications-updated', syncSessionCertifications);
    window.addEventListener('storage', syncSessionCertifications);

    return () => {
      window.removeEventListener('session-certifications-updated', syncSessionCertifications);
      window.removeEventListener('storage', syncSessionCertifications);
    };
  }, []);

  useEffect(() => {
    const syncPublished = () => {
      console.log('Employee dashboard: Syncing published sessions...');
      const loaded = loadPublishedSessions();
      console.log('Employee dashboard: Published sessions updated', loaded.length, 'sessions');
      console.log('Sessions status breakdown:', loaded.map(s => ({ 
        title: s.title, 
        isLocked: s.isLocked, 
        status: s.status 
      })));
      setPublishedSessions(loaded);
    };

    // Initial load
    syncPublished();

    // Listen for updates
    window.addEventListener('published-sessions-updated', syncPublished);
    const handleStorage = (event) => {
      if (event.key === 'published_sessions') {
        console.log('Employee dashboard: Storage event detected for published_sessions');
        syncPublished();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('published-sessions-updated', syncPublished);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('employee_completed_sessions', JSON.stringify(completedSessions));
      window.dispatchEvent(new Event('employee-completions-updated'));
    } catch (error) {
      console.error('Failed to persist employee completed sessions', error);
    }
  }, [completedSessions]);

  useEffect(() => {
    if (!publishedSessions.length) return;

    const now = new Date();
    let changed = false;

    const updatedSessions = publishedSessions.map((session) => {
      const completed = completedSessions.includes(session.id);
      const dueDateTime = session.dueDateTime ? new Date(session.dueDateTime) : null;
      const approvalExpiresAt = session.approvalExpiresAt ? new Date(session.approvalExpiresAt) : null;

      if (completed) {
        if (session.status !== 'completed' || session.isLocked || session.approvalExpiresAt) {
          changed = true;
          return normalizePublishedSession({
            ...session,
            status: 'completed',
            isLocked: false,
            approvalExpiresAt: null,
            lockedAt: null
          });
        }
        return session;
      }

      let shouldLock = false;
      if (approvalExpiresAt && now > approvalExpiresAt) {
        shouldLock = true;
      } else if (dueDateTime && now > dueDateTime) {
        shouldLock = true;
      }

      if (shouldLock) {
        if (!session.isLocked || session.status !== 'locked') {
          changed = true;
          return normalizePublishedSession({
            ...session,
            isLocked: true,
            status: 'locked',
            lockedAt: session.lockedAt || new Date().toISOString()
          });
        }
      } else if (session.isLocked) {
        changed = true;
        return normalizePublishedSession({
          ...session,
          isLocked: false,
          status: session.status === 'locked' ? 'scheduled' : session.status,
          lockedAt: null
        });
      }

      return session;
    });

    if (changed) {
      persistPublishedSessions(updatedSessions);
    }
  }, [publishedSessions, completedSessions, persistPublishedSessions]);

  useEffect(() => {
    const earnedCount = completedSessions.reduce((count, sessionId) => {
      return sessionCertifications && sessionCertifications[sessionId] ? count + 1 : count;
    }, 0);
    setCertificatesEarned(earnedCount);
  }, [completedSessions, sessionCertifications]);

  useEffect(() => {
    const total = publishedSessions.length;
    setTotalSessionsStarted(total);
    const activeCount = publishedSessions.filter(
      session => !session.isLocked && !completedSessions.includes(session.id)
    ).length;
    setActiveSessions(activeCount);
  }, [publishedSessions, completedSessions]);

  useEffect(() => {
    setSelectedSession((prev) => {
      if (!prev) return prev;
      const hasCertification = hasCertificationForSession(prev.id) || prev.certificate || prev.hasCertificate;
      if (prev.hasCertificate === hasCertification && prev.certificate === hasCertification) {
        return prev;
      }
      return {
        ...prev,
        hasCertificate: hasCertification,
        certificate: hasCertification
      };
    });
  }, [sessionCertifications, publishedSessions]);

  const enrichedSessions = useMemo(() => {
    if (!publishedSessions.length) return [];
    return publishedSessions.map((session) => {
      const completed = completedSessions.includes(session.id);
      const hasCertification = Boolean(sessionCertifications[session.id]);
      const dueDateObj = session.dueDateTime ? new Date(session.dueDateTime) : null;
      const approvalExpiresObj = session.approvalExpiresAt ? new Date(session.approvalExpiresAt) : null;
      const scheduledDateObj = session.scheduledDateTime ? new Date(session.scheduledDateTime) : null;
      const status = completed
        ? 'completed'
        : session.isLocked
          ? 'locked'
          : session.status && session.status !== 'locked'
            ? session.status
            : 'in-progress';

      const progress = completed ? 100 : session.progress ?? 0;

      return {
        ...session,
        status,
        completed,
        progress,
        instructor: session.instructor || 'HR Team',
        dueDateObj,
        approvalExpiresObj,
        scheduledDateObj,
        hasCertificate: hasCertification && completed,
        certificate: hasCertification && completed
      };
    });
  }, [publishedSessions, completedSessions, sessionCertifications]);

  const lockedSessionsList = useMemo(
    () => enrichedSessions.filter(session => session.status === 'locked' && !session.completed),
    [enrichedSessions]
  );

  const openSessionsList = useMemo(
    () => enrichedSessions.filter(session => session.status !== 'locked'),
    [enrichedSessions]
  );

  const getPrimarySessionDate = useCallback((session) => {
    if (!session) return null;
    if (session.scheduledDateObj) return session.scheduledDateObj;
    if (session.dueDateObj) return session.dueDateObj;
    if (session.approvalExpiresObj) return session.approvalExpiresObj;
    if (session.createdAt) {
      const created = new Date(session.createdAt);
      if (!Number.isNaN(created.getTime())) return created;
    }
    return null;
  }, []);

  const formatRelativeTime = useCallback((value) => {
    if (!value) return 'Just now';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return 'Just now';

    const diffMs = Date.now() - date.getTime();
    if (diffMs <= 0) return 'Just now';

    const diffMinutes = Math.round(diffMs / 60000);
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;

    const diffHours = Math.round(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;

    const diffDays = Math.round(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;

    const diffWeeks = Math.round(diffDays / 7);
    if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;

    return date.toLocaleDateString();
  }, []);

  const getSessionDetails = useCallback((session) => {
    if (!session) return null;
    const base = typeof session === 'object'
      ? session
      : enrichedSessions.find(item => item.id === session);

    if (!base) return null;

    const hasCertification = hasCertificationForSession(base.id) || base.certificate || base.hasCertificate;

    return {
      ...base,
      hasCertificate: hasCertification && base.completed,
      certificate: hasCertification && base.completed
    };
  }, [enrichedSessions, sessionCertifications]);

  const completionRateValue = totalSessionsStarted > 0
    ? Math.round((completedSessions.length / totalSessionsStarted) * 100)
    : 0;

  const metrics = [
    { 
      label: 'Total Sessions', 
      value: totalSessionsStarted, 
      color: '#114417DB', 
      icon: <CheckCircleIcon /> 
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
    },
    { 
      label: 'Completion Rate', 
      value: `${completionRateValue}%`, 
      color: '#10b981', 
      icon: <TrendingUpIcon /> 
    }
  ];

  const latestSession = useMemo(() => {
    const latestPublished = [...enrichedSessions].sort(
      (a, b) => (b.scheduledDateObj || new Date(b.createdAt || '')).getTime() - (a.scheduledDateObj || new Date(a.createdAt || '')).getTime()
    )[0];

    if (latestPublished) {
      return {
        id: latestPublished.id,
        title: latestPublished.title || 'Latest Session',
        instructor: latestPublished.instructor || 'HR Team',
        date: latestPublished.date || (latestPublished.scheduledDateObj ? latestPublished.scheduledDateObj.toLocaleDateString() : 'TBD'),
        time: latestPublished.time || (latestPublished.scheduledDateObj ? latestPublished.scheduledDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD'),
        duration: latestPublished.duration || '60 minutes',
        status: latestPublished.status || 'in-progress',
        description: latestPublished.description || 'Stay tuned for more details.'
      };
    }

    return {
      id: null,
      title: 'No sessions available yet',
      instructor: 'HR Team',
      date: 'TBD',
      time: 'TBD',
      duration: 'TBD',
      status: 'info',
      description: 'Once new sessions are published, they will appear here.'
    };
  }, [enrichedSessions]);

  const recentActivity = useMemo(() => {
    if (!enrichedSessions.length) return [];

    const events = enrichedSessions.map((session) => {
      const referenceDate = session.completed
        ? new Date(session.completedAt || session.lastCompletionScoreDate || session.scheduledDateTime || session.createdAt || Date.now())
        : getPrimarySessionDate(session) || new Date(session.createdAt || Date.now());

      const isCompleted = session.completed;
      const isLocked = session.isLocked;

      return {
        id: `${session.id}-${isCompleted ? 'completed' : 'upcoming'}`,
        action: isCompleted ? 'Completed session' : isLocked ? 'Session locked' : 'Upcoming session',
        session: session.title || 'Untitled session',
        time: formatRelativeTime(referenceDate),
                  icon: isCompleted ? <CheckCircleIcon sx={{ color: '#10b981' }} /> : isLocked ? <LockIcon sx={{ color: '#ef4444' }} /> : <ScheduleIcon sx={{ color: '#114417DB' }} />,
        sortDate: referenceDate ? referenceDate.getTime() : Date.now()
      };
    });

    return events
      .sort((a, b) => b.sortDate - a.sortDate)
      .slice(0, 5);
  }, [enrichedSessions, formatRelativeTime, getPrimarySessionDate]);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'my-courses', label: 'My Sessions', icon: <SchoolIcon /> },
    { id: 'course-library', label: 'Session Library', icon: <LibraryIcon /> },
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

  const handleSessionComplete = (session) => {
    if (!session || !session.id) return;
    const sessionId = session.id;
    const alreadyCompleted = completedSessions.includes(sessionId);
    const completionDate = new Date().toISOString();
    const score = session.score ?? session.lastCompletionScore ?? null;
    const feedback = session.feedback ?? session.lastFeedback ?? null;

    if (!alreadyCompleted) {
      setCompletedSessions(prev => [...prev, sessionId]);
      setActiveSessions(prev => Math.max(0, prev - 1));
    }

    persistPublishedSessions(prev => prev.map(s => {
      if (s.id !== sessionId) return s;
      return normalizePublishedSession({
        ...s,
        status: 'completed',
        isLocked: false,
        approvalExpiresAt: null,
        lockedAt: null,
        completedAt: completionDate,
        lastCompletionScore: score,
        lastFeedback: feedback
      });
    }));
  };

  const handleSessionStart = (sessionId) => {
    if (!sessionId) return;
    persistPublishedSessions(prev => prev.map(session => {
      if (session.id !== sessionId) return session;
      if (session.status === 'locked') return session;
      return normalizePublishedSession({
        ...session,
        status: session.status === 'completed' ? session.status : 'in-progress',
        isLocked: false
      });
    }));
  };

  const handleJoinSession = () => {
    setCurrentView('my-courses');
    setActiveTab('my-courses');
  };

  const handleSessionClick = (session) => {
    const details = getSessionDetails(session);
    if (!details) return;
    setSelectedSession(details);
    setCurrentView('session-detail');
  };

  const handleBackToCourses = () => {
    setCurrentView(null);
    setActiveTab('my-courses');
  };

  const handleGetStarted = (session) => {
    if (!session) return;
    const details = getSessionDetails(session);
    if (!details) return;
    setCurrentView('session-content');
    setSelectedSession(details);
  };

  const handleSessionCompleteFlow = ({ session, score, feedback }) => {
    if (session) {
      const details = getSessionDetails(session);
      handleSessionComplete({
        ...(details || session),
        score,
        feedback
      });
    }
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
          Dashboard
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
              <Box display="flex" alignItems="center" justifyContent="center" mb={2} sx={{ color: metric.color }}>
                {metric.icon}
              </Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: metric.color }}>
                {metric.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
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
                  backgroundColor: '#114417DB', 
                  '&:hover': { backgroundColor: '#0a2f0e' },
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
            {recentActivity.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Your upcoming sessions and recent progress will appear here once available.
              </Typography>
            ) : (
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
            )}
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
                View My Sessions
              </Button>
              <Button
                variant="outlined"
                startIcon={<LibraryIcon />}
                onClick={() => setActiveTab('course-library')}
                fullWidth
              >
                Browse Session Library
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
              sx={{ backgroundColor: '#114417DB', '&:hover': { backgroundColor: '#0a2f0e' } }}
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
            sx={{ backgroundColor: '#114417DB', '&:hover': { backgroundColor: '#0a2f0e' } }}
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
        {/* Logo and Text Side by Side */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            height: 64,
            mb: 0,
            pt: 0,
            mt: 0
          }}
        >
          <Box
            component="img"
            src={GrowGridLogo}
            alt="GrowGrid logo"
            sx={{ 
              width: 'auto', 
              height: 48, 
              maxWidth: '60px',
              display: 'block',
              objectFit: 'contain',
              flexShrink: 0
            }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '64px' }}>
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              sx={{ 
                lineHeight: 1.1,
                letterSpacing: '0.02em',
                mb: 0,
                color: '#374151'
              }}
            >
              GROW
            </Typography>
            <Typography 
              variant="h5" 
              fontWeight="bold"
              sx={{ 
                lineHeight: 1.1,
                letterSpacing: '0.02em',
                mt: 0,
                color: '#374151'
              }}
            >
              GRID
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 2, backgroundColor: '#e5e7eb' }} />
        <List>
          {navigationItems.map((item) => (
            <ListItem 
              key={item.id} 
              button 
              onClick={() => handleTabChange(item.id)}
              sx={{
                backgroundColor: activeTab === item.id ? '#114417DB' : 'transparent',
                borderRadius: 1,
                mb: 1,
                '&:hover': {
                  backgroundColor: activeTab === item.id ? '#114417DB' : '#f0fdf4',
                },
              }}
            >
              <ListItemIcon sx={{ color: activeTab === item.id ? 'white' : '#374151' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  color: activeTab === item.id ? 'white' : '#374151',
                  fontWeight: activeTab === item.id ? 600 : 400
                }}
              />
            </ListItem>
          ))}
        </List>
      </Sidebar>

      <MainContent>
        {/* Header */}
        <HeaderBar position="static" sx={{ top: 0 }}>
          <Toolbar sx={{ minHeight: '64px !important', height: '64px', paddingTop: 0, paddingBottom: 0 }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '1rem',
                lineHeight: '64px',
                fontFamily: '"Poppins", sans-serif'
              }}
            >
              Welcome back, {profileData.firstName}!
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
            onBack={handleBackToCourses}
           />
         ) :
         activeTab === 'dashboard' ? renderDashboard() :
         activeTab === 'my-courses' ? (
           <MyCourses 
            sessions={openSessionsList}
             onSessionComplete={handleSessionComplete}
             onSessionStart={handleSessionStart}
             onSessionClick={handleSessionClick}
           />
         ) :
         activeTab === 'course-library' ? (
           <CourseLibrary 
            lockedSessions={lockedSessionsList}
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
