import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { employeeAPI, sessionAPI, sessionCompletionAPI, sessionRequestAPI, notificationAPI, getAuthToken } from '../utils/api';
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
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
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

// Helper function to calculate number of modules (content items) in a session
const calculateModuleCount = (session) => {
  if (!session) return 0;
  let count = 0;
  
  // Count creation mode content
  if (session.creationMode || session.creation_mode) count++;
  
  // Count AI content
  if (session.aiContent || session.resumeState?.aiContentGenerated) count++;
  
  // Count files
  const files = session.files || session.resumeState?.selectedFiles || session.resumeState?.files || [];
  if (Array.isArray(files)) {
    count += files.length;
  }
  
  // Count quiz/assessment
  if (session.quiz || session.assessmentInfo || (session.quiz?.questions && session.quiz.questions.length > 0)) {
    count++;
  }
  
  return count;
};

const normalizePublishedSession = (session = {}) => ({
  ...session,
  createdAt: session.createdAt || session.created_at || null,
  scheduledDate: session.scheduledDate || session.scheduled_date || null,
  scheduledTime: session.scheduledTime || session.scheduled_time || null,
  scheduledDateTime: session.scheduledDateTime || session.scheduled_datetime || null,
  dueDate: session.dueDate || session.due_date || null,
  dueTime: session.dueTime || session.due_time || null,
  dueDateTime: session.dueDateTime || session.due_datetime || null,
  isLocked: session.isLocked ?? false,
  approvalExpiresAt: session.approvalExpiresAt || null,
  lastApprovalDate: session.lastApprovalDate || null,
  lockedAt: session.lockedAt || null,
  completedAt: session.completedAt || null,
  lastCompletionScore: session.lastCompletionScore ?? null,
  lastFeedback: session.lastFeedback || null,
  moduleCount: calculateModuleCount(session), // Add module count
  // Content fields: explicitly preserve both camelCase and snake_case formats
  files: session.files || [],
  aiContent: session.aiContent || session.ai_content || null,
  ai_content: session.ai_content || session.aiContent || null,
  aiKeywords: session.aiKeywords || session.ai_keywords || null,
  ai_keywords: session.ai_keywords || session.aiKeywords || null,
  creationMode: session.creationMode || session.creation_mode || null,
  creation_mode: session.creation_mode || session.creationMode || null,
  quiz: session.quiz || null,
  assessmentInfo: session.assessmentInfo || session.assessment_info || null,
  assessment_info: session.assessment_info || session.assessmentInfo || null,
  questions: session.questions || session.quiz?.questions || null,
  // Certification fields: handle both formats
  certificate: session.certificate || session.certification || null,
  certification: session.certification || session.certificate || null,
  hasCertificate: session.hasCertificate !== undefined ? session.hasCertificate : (session.has_certificate !== undefined ? session.has_certificate : false),
  // Preserve audience/participants field for recommendation logic
  audience: session.audience || session.participants || null,
  participants: session.participants || session.audience || null
});

// Removed loadPublishedSessions - now using API

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
  const { getUserId, getUserEmail, logout: logoutUser, getUserRole } = useAuth();
  
  // Check user role and redirect if admin
  useEffect(() => {
    const userRole = getUserRole();
    const isAdmin = userRole === 'admin' || userRole === 'hr_admin';
    if (isAdmin) {
      // User is an admin, redirect to admin dashboard
      navigate('/admin-dashboard', { replace: true });
    }
  }, [getUserRole, navigate]);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCompletedSessions, setShowCompletedSessions] = useState(true); // Toggle to show/hide completed sessions
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showPasswordManager, setShowPasswordManager] = useState(false);
  const [currentView, setCurrentView] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionDetailSource, setSessionDetailSource] = useState('my-courses'); // 'my-courses' or 'course-library'
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Dynamic metrics state - now loaded from API
  const [completedSessions, setCompletedSessions] = useState([]); // Array of completed session IDs
  const [sessionCompletions, setSessionCompletions] = useState([]); // Full completion records for feedback, etc.
  const [activeSessions, setActiveSessions] = useState(0);
  const [totalSessionsStarted, setTotalSessionsStarted] = useState(0);
  const [certificatesEarned, setCertificatesEarned] = useState(0);
  const [sessionCertifications, setSessionCertifications] = useState({});
  const [publishedSessions, setPublishedSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [completionsLoading, setCompletionsLoading] = useState(true);
  const [approvedRequests, setApprovedRequests] = useState([]); // Track approved session requests
  
  // Track started sessions
  const [startedSessions, setStartedSessions] = useState(new Set());
  
  // Function to load sessions (reusable)
  const loadSessions = async () => {
    try {
      setSessionsLoading(true);
      // Load all published and scheduled sessions
      const allSessions = await sessionAPI.getAll();
      // Show both published and scheduled sessions (scheduled sessions will auto-publish when start time arrives)
      const publishedAndScheduled = allSessions.filter(s => s.status === 'published' || s.status === 'scheduled');
      const normalized = Array.isArray(publishedAndScheduled) ? publishedAndScheduled.map(normalizePublishedSession) : [];
      setPublishedSessions(normalized);
    } catch (error) {
      console.error('Failed to load published sessions:', error);
      setPublishedSessions([]);
    } finally {
      setSessionsLoading(false);
    }
  };

  // Function to load completions (reusable)
  const loadCompletions = async () => {
    try {
      setCompletionsLoading(true);
      const userId = getUserId();
      if (userId) {
        const completions = await sessionCompletionAPI.getAll(parseInt(userId));
        const completedIds = completions.map(c => c.session);
        setCompletedSessions(completedIds);
        setTotalSessionsStarted(completions.length);
        setCertificatesEarned(completions.filter(c => c.passed).length);
        setSessionCompletions(completions);
      }
    } catch (error) {
      console.error('Failed to load completed sessions:', error);
      setCompletedSessions([]);
      setSessionCompletions([]);
    } finally {
      setCompletionsLoading(false);
    }
  };

  // Function to load approved session requests
  const loadApprovedRequests = async () => {
    try {
      const userId = getUserId();
      if (userId) {
        // Get approved requests for this employee
        const requests = await sessionRequestAPI.getAll('approved');
        const myApprovedRequests = requests.filter(req => req.employee === parseInt(userId) || req.employee === userId);
        setApprovedRequests(myApprovedRequests);
      }
    } catch (error) {
      console.error('Failed to load approved requests:', error);
      setApprovedRequests([]);
    }
  };

  // Load published sessions from API on mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Listen for session updates (when admin schedules a new session)
  useEffect(() => {
    const handleSessionUpdate = () => {
      loadSessions();
    };
    
    window.addEventListener('published-sessions-updated', handleSessionUpdate);
    
    return () => {
      window.removeEventListener('published-sessions-updated', handleSessionUpdate);
    };
  }, []);

  // Load completed sessions from API on mount
  useEffect(() => {
    loadCompletions();
  }, [getUserId]);

  // Load approved requests on mount
  useEffect(() => {
    loadApprovedRequests();
  }, [getUserId]);

  // Reload data when switching to tabs that need fresh data
  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'my-courses' || activeTab === 'course-library') {
      loadSessions();
      loadCompletions();
      loadApprovedRequests(); // Refresh approved requests when switching tabs
    }
  }, [activeTab]);
  
  // Profile data - will be loaded from API
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    department: '',
    jobRole: '',
    reportingManager: '',
    email: '',
    keyskills: []
  });
  const [profileLoading, setProfileLoading] = useState(true);
  
  // Load employee profile from API
  useEffect(() => {
    const loadEmployeeProfile = async () => {
      try {
        setProfileLoading(true);
        const userId = getUserId();
        const userEmail = getUserEmail();
        
        if (userId) {
          try {
            // The backend employee_detail accepts User ID and returns EmployeeProfile
            const employeeData = await employeeAPI.getById(parseInt(userId));
            setProfileData({
              firstName: employeeData.firstName || employeeData.user?.first_name || '',
              lastName: employeeData.lastName || employeeData.user?.last_name || '',
              phone: employeeData.phone || employeeData.user?.phone_number || '',
              department: employeeData.department || employeeData.user?.department || '',
              jobRole: employeeData.jobRole || employeeData.job_role || '',
              reportingManager: employeeData.reportingManager || employeeData.reporting_manager || '',
              email: employeeData.email || employeeData.user?.email || userEmail || '',
              keyskills: employeeData.keyskills || []
            });
      } catch (error) {
            console.error('Failed to load employee profile:', error);
            // Fallback: try to get from all employees list
            try {
              const allEmployees = await employeeAPI.getAll();
              const employeeData = allEmployees.find(emp => 
                emp.user?.id === parseInt(userId) || emp.email === userEmail
              );
              if (employeeData) {
                setProfileData({
                  firstName: employeeData.firstName || employeeData.user?.first_name || '',
                  lastName: employeeData.lastName || employeeData.user?.last_name || '',
                  phone: employeeData.phone || employeeData.user?.phone_number || '',
                  department: employeeData.department || employeeData.user?.department || '',
                  jobRole: employeeData.jobRole || employeeData.job_role || '',
                  reportingManager: employeeData.reportingManager || employeeData.reporting_manager || '',
                  email: employeeData.email || employeeData.user?.email || userEmail || '',
                  keyskills: employeeData.keyskills || []
                });
              } else if (userEmail) {
                setProfileData(prev => ({ ...prev, email: userEmail }));
              }
            } catch (fallbackError) {
              console.error('Fallback also failed:', fallbackError);
              if (userEmail) {
                setProfileData(prev => ({ ...prev, email: userEmail }));
              }
            }
          }
        } else if (userEmail) {
          // If no userId, try to get from email
          setProfileData(prev => ({ ...prev, email: userEmail }));
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };
    
    loadEmployeeProfile();
    loadNotifications();
  }, [getUserId, getUserEmail]);

  // Refresh notifications periodically (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Notifications
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  // Function to load notifications from API
  const loadNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const data = await notificationAPI.getAll();
      // Transform API response to match frontend format
      const transformedNotifications = data.map(notif => ({
        id: notif.id,
        type: mapNotificationType(notif.type),
        title: notif.title || notif.message || '',
        message: notif.message || notif.title || '',
        time: formatNotificationTime(notif.created_at),
        read: notif.is_read || false
      }));
      setNotifications(transformedNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Helper function to format notification time
  const formatNotificationTime = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // Helper function to map backend notification types to frontend types
  const mapNotificationType = (backendType) => {
    switch (backendType) {
      case 'session_scheduled':
        return 'upcoming';
      case 'session_approved':
        return 'upcoming';
      case 'session_completed':
        return 'completion';
      case 'certificate_earned':
        return 'completion';
      default:
        return 'general';
    }
  };

  const hasCertificationForSession = (sessionId) => {
    if (!sessionId) return false;
    return Boolean(sessionCertifications && sessionCertifications[sessionId]);
  };

  // Removed localStorage sync hooks - now using API

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
      setPublishedSessions(updatedSessions);
    }
  }, [publishedSessions, completedSessions]);

  // Removed duplicate useEffect hooks - metrics are now calculated from API data

  useEffect(() => {
    setSelectedSession((prev) => {
      if (!prev) return prev;
      // Don't overwrite if session has full content fields (was fetched via getById)
      // Check if session has content fields that indicate it was fully loaded
      const hasFullContent = prev.files !== undefined || prev.aiContent !== undefined || prev.quiz !== undefined || prev.ai_content !== undefined;
      if (hasFullContent) {
        // Only update certification fields, don't replace the whole session
        const hasCertification = hasCertificationForSession(prev.id) || prev.certificate || prev.hasCertificate;
        if (prev.hasCertificate === hasCertification && prev.certificate === hasCertification) {
          return prev;
        }
        return {
          ...prev,
          hasCertificate: hasCertification,
          certificate: hasCertification
        };
      }
      // If session doesn't have full content, try to find it in publishedSessions and merge
      const publishedSession = publishedSessions.find(s => s.id === prev.id);
      if (publishedSession) {
        const hasCertification = hasCertificationForSession(prev.id) || publishedSession.certificate || publishedSession.hasCertificate;
        return {
          ...publishedSession,
          ...prev, // Preserve any additional fields from prev
          hasCertificate: hasCertification,
          certificate: hasCertification
        };
      }
      // If not found, just update certification
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
    // Get approved request session IDs
    const approvedSessionIds = new Set(approvedRequests.map(req => req.session));

    // Create a map of session completions by session ID (get the latest completion for each session)
    const completionsBySession = new Map();
    sessionCompletions.forEach(completion => {
      const sessionId = completion.session;
      const existing = completionsBySession.get(sessionId);
      // Keep the most recent completion (highest attempt_number or latest completed_at)
      if (!existing || 
          (completion.attempt_number && existing.attempt_number && completion.attempt_number > existing.attempt_number) ||
          (completion.completed_at && existing.completed_at && new Date(completion.completed_at) > new Date(existing.completed_at))) {
        completionsBySession.set(sessionId, completion);
      }
    });

    return publishedSessions.map((session) => {
      const completed = completedSessions.includes(session.id);
      const hasCertification = Boolean(sessionCertifications[session.id]);
      const dueDateObj = session.dueDateTime ? new Date(session.dueDateTime) : null;
      const approvalExpiresObj = session.approvalExpiresAt ? new Date(session.approvalExpiresAt) : null;
      const scheduledDateObj = session.scheduledDateTime ? new Date(session.scheduledDateTime) : null;

      // Get completion data for this session
      const completion = completionsBySession.get(session.id);
      const completedAt = completion?.completed_at ? new Date(completion.completed_at) : null;
      const score = completion?.score ?? null;
      
      // Calculate time taken (from start date to completion date)
      let timeTaken = null;
      if (completed && completedAt) {
        const startDate = scheduledDateObj || dueDateObj || (session.createdAt ? new Date(session.createdAt) : null);
        if (startDate && !isNaN(startDate.getTime()) && !isNaN(completedAt.getTime())) {
          const diffMs = completedAt.getTime() - startDate.getTime();
          if (diffMs > 0) {
            const diffMinutes = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMinutes / 60);
            const diffDays = Math.floor(diffHours / 24);
            
            if (diffDays > 0) {
              timeTaken = `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
            } else if (diffHours > 0) {
              timeTaken = `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
            } else if (diffMinutes > 0) {
              timeTaken = `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
            } else {
              timeTaken = 'Less than a minute';
            }
          }
        }
      }

      // Check if this session has an approved request
      const hasApprovedRequest = approvedSessionIds.has(session.id);

      // If session has approved request, it should not be locked
      const isActuallyLocked = hasApprovedRequest ? false : (session.isLocked ?? false);

      const status = completed
        ? 'completed'
        : isActuallyLocked
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
        isLocked: isActuallyLocked,
        instructor: session.instructor || 'HR Team',
        dueDateObj,
        approvalExpiresObj,
        scheduledDateObj,
        hasCertificate: hasCertification && completed,
        certificate: hasCertification && completed,
        hasApprovedRequest,
        // Add completion data
        completedAt: completedAt ? completedAt.toISOString() : null,
        lastCompletionScore: score,
        timeTaken: timeTaken
      };
    });
  }, [publishedSessions, completedSessions, sessionCompletions, sessionCertifications, approvedRequests]);

  const lockedSessionsList = useMemo(
    () => enrichedSessions.filter(session => session.status === 'locked' && !session.completed),
    [enrichedSessions]
  );

  // Recommended sessions based on employee skills OR audience="all"
  const recommendedSessionsList = useMemo(() => {
    const employeeSkillsRaw = profileData.keyskills || [];
    const employeeSkills = employeeSkillsRaw
      .map(skill => (skill || '').toString().toLowerCase().trim())
      .filter(Boolean);

    // Filter sessions that match employee skills OR are for all employees
    return enrichedSessions.filter(session => {
      // Exclude locked or completed sessions
      // Include both 'published' and 'scheduled' sessions
      if (session.status === 'locked' || session.completed) return false;
      
      // Include scheduled sessions (they should appear in recommendations)
      // The status check above already handles locked/completed, so scheduled sessions will pass through
      
      // Check if session is for all employees (audience="all" or "all employees" or similar)
      const sessionAudience = (session.audience || session.participants || '').toLowerCase().trim();
      // Check for various forms: "all", "all employees", or starts with "all"
      const isForAllEmployees = sessionAudience === 'all' || 
                                 sessionAudience === 'all employees' || 
                                 sessionAudience.startsWith('all');
      if (isForAllEmployees) {
        return true; // Include all sessions for "all employees"
      }
      
      // If no employee skills, only show "all" audience sessions
      if (employeeSkills.length === 0) {
        return false;
      }
      
      // Check if session has matching skills
      if (!session.skills || session.skills.length === 0) return false;
      const sessionSkills = (session.skills || [])
        .map(skill => (skill || '').toString().toLowerCase().trim())
        .filter(Boolean);
      return sessionSkills.some(skill => employeeSkills.includes(skill));
    });
  }, [enrichedSessions, profileData.keyskills]);
  
  // Sessions that have been started by the employee
  const startedSessionsList = useMemo(() => {
    return enrichedSessions.filter(session => {
      // Include if started, not completed, and not locked
      return startedSessions.has(session.id) && !session.completed && !session.isLocked;
    });
  }, [enrichedSessions, startedSessions]);
  
  // Combined list for "My Sessions" - show all enriched sessions so completed sessions appear as well,
  // and mark which ones are recommended based on skills
  // Optionally filter out completed sessions if user prefers
  const mySessionsList = useMemo(() => {
    const recommendedIds = new Set(recommendedSessionsList.map(s => s.id));
    let sessionsToShow = enrichedSessions;
    
    // Filter out completed sessions if user doesn't want to see them
    if (!showCompletedSessions) {
      sessionsToShow = enrichedSessions.filter(session => !session.completed);
    }
    
    return sessionsToShow.map(session => ({
      ...session,
      isRecommended: recommendedIds.has(session.id),
    }));
  }, [enrichedSessions, recommendedSessionsList, showCompletedSessions]);

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
      color: '#114417DB', 
      icon: <TrendingUpIcon /> 
    }
  ];

  const latestSessions = useMemo(() => {
    // Get sessions sorted by publishedAt or createdAt (most recent first)
    const sorted = [...publishedSessions].sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt) : new Date(a.createdAt || 0);
      const dateB = b.publishedAt ? new Date(b.publishedAt) : new Date(b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });
    
    // Return top 3 most recently published sessions
    return sorted.slice(0, 3).map(session => ({
      ...session,
      instructor: session.instructor || 'HR Team',
      duration: session.duration || '60 minutes'
    }));
  }, [publishedSessions]);

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
                  icon: isCompleted ? <CheckCircleIcon sx={{ color: '#114417DB' }} /> : isLocked ? <LockIcon sx={{ color: '#ef4444' }} /> : <ScheduleIcon sx={{ color: '#114417DB' }} />,
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
    setActiveTab('profile');
    setShowProfile(false);
    setShowEditProfile(false);
    setShowPasswordManager(false);
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

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      navigate('/login');
    }
  };

  const handleViewProfile = () => {
    setShowProfile(true);
    setProfileAnchorEl(null);
  };

  const handleManagePasswords = () => {
    setShowPasswordManager(true);
    setSettingsAnchorEl(null);
  };

  const handleClosePasswordManager = () => {
    setShowPasswordManager(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    // Stay on profile page
  };

  const handlePasswordReset = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        alert('Not authenticated. Please login again.');
        return;
      }
      
      const response = await fetch('http://localhost:8000/api/auth/reset-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
          confirm_password: passwordData.confirmPassword
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Password updated successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordManager(false);
      } else {
        alert(data.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      alert('An error occurred while updating password');
    }
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
    setShowProfile(false);
    setShowPasswordManager(false);
  };
  
  const handleChangePassword = () => {
    setShowPasswordManager(true);
    setShowEditProfile(false);
    setShowProfile(false);
  };
  
  const handleCloseProfile = () => {
    setActiveTab('dashboard');
    setShowProfile(false);
    setShowEditProfile(false);
    setShowPasswordManager(false);
  };

  const handleProfileSave = () => {
    setShowEditProfile(false);
    setShowProfile(true);
    setShowPasswordManager(false);
  };

  const handleSessionComplete = async (session) => {
    if (!session || !session.id) return;
    const sessionId = session.id;
    const alreadyCompleted = completedSessions.includes(sessionId);
    const completionDate = new Date().toISOString();
    const score = session.score ?? session.lastCompletionScore ?? null;
    const feedback = session.feedback ?? session.lastFeedback ?? null;

    try {
      const userId = getUserId();
      if (userId && !alreadyCompleted) {
        // Create completion record via API
        const created = await sessionCompletionAPI.create({
          employee: parseInt(userId),
          session: sessionId,
          score: score,
          passed: score !== null && score >= 70, // Assuming 70 is passing
          feedback: feedback
        });
        
        // Update local state
        setCompletedSessions(prev => [...prev, sessionId]);
        setSessionCompletions(prev => [...prev, created]);
        setTotalSessionsStarted(prev => prev + 1);
        if (score !== null && score >= 70) {
          setCertificatesEarned(prev => prev + 1);
        }
        setActiveSessions(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to save session completion:', error);
    }
  };

  const handleSessionStart = (sessionId) => {
    if (!sessionId) return;
    // Track that this session has been started
    setStartedSessions(prev => new Set([...prev, sessionId]));
    // Update local state only - no API call needed for starting
    setPublishedSessions(prev => prev.map(session => {
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

  const handleSessionClick = async (session, source = 'my-courses') => {
    if (!session) return;
    
    try {
      const fullSession = await sessionAPI.getById(session.id);
      const normalized = normalizePublishedSession(fullSession);
      // Attach feedback from completion if available
      const completion = sessionCompletions.find(c => c.session === normalized.id);
      const sessionWithFeedback = completion?.feedback
        ? { ...normalized, feedback: completion.feedback }
        : normalized;

      setSelectedSession(sessionWithFeedback);
      setSessionDetailSource(source);
      setCurrentView('session-detail'); // First show session detail page
    } catch (error) {
      console.error('Failed to load session details:', error);
      // Fallback: try to get full session from publishedSessions or fetch again
      const details = getSessionDetails(session);
      if (details) {
        // Check if details have content fields, if not, try to fetch again
        const hasContent = details.files?.length > 0 || details.aiContent || details.quiz || details.ai_content;
        if (!hasContent) {
          // Try fetching one more time
          try {
            const retrySession = await sessionAPI.getById(session.id);
            const retryNormalized = normalizePublishedSession(retrySession);
            const completion = sessionCompletions.find(c => c.session === retryNormalized.id);
            const sessionWithFeedback = completion?.feedback
              ? { ...retryNormalized, feedback: completion.feedback }
              : retryNormalized;
            setSelectedSession(sessionWithFeedback);
            setSessionDetailSource(source);
            setCurrentView('session-detail');
            return;
          } catch (retryError) {
            console.error('Retry fetch also failed:', retryError);
          }
        }
        const completion = sessionCompletions.find(c => c.session === details.id);
        const sessionWithFeedback = completion?.feedback
          ? { ...details, feedback: completion.feedback }
          : details;
        setSelectedSession(sessionWithFeedback);
        setSessionDetailSource(source);
        setCurrentView('session-detail');
      }
    }
  };

  // Get previous attempts for a session (sorted by attempt_number)
  const getPreviousAttempts = (sessionId) => {
    if (!sessionId) return [];
    return sessionCompletions
      .filter(c => c.session === sessionId)
      .sort((a, b) => (b.attempt_number || 0) - (a.attempt_number || 0));
  };

  // Get latest completion for a session
  const getLatestCompletion = (sessionId) => {
    if (!sessionId) return null;
    const attempts = getPreviousAttempts(sessionId);
    return attempts.length > 0 ? attempts[0] : null; // First one is latest (sorted desc)
  };

  const handleBackToCourses = () => {
    setCurrentView(null);
    setActiveTab('my-courses');
  };

  const handleRetakeAssessment = (session) => {
    if (!session) return;
    // Navigate to session content view to retake assessment
    setSelectedSession(session);
    setCurrentView('session-content');
  };

  const handleBackFromSessionDetail = () => {
    setCurrentView(null);
    setActiveTab(sessionDetailSource === 'course-library' ? 'course-library' : 'my-courses');
  };

  const handleGetStarted = async (session) => {
    if (!session) return;
    // If session is already completed, do not allow starting again
    if (completedSessions.includes(session.id)) {
      return;
    }
    // Track that this session has been started
    if (session.id) {
      setStartedSessions(prev => new Set([...prev, session.id]));
    }
    
    try {
      // Fetch full session details from API to get files, quiz, etc.
      const fullSession = await sessionAPI.getById(session.id);
      console.log('Raw API response for session:', fullSession);
      console.log('Certificate config from API:', fullSession?.certification || fullSession?.certificate);
      const normalized = normalizePublishedSession(fullSession);
      console.log('Normalized session:', normalized);
      console.log('Certificate config after normalization:', normalized?.certification || normalized?.certificate);
      
      // Verify that content fields are present
      const hasContent = normalized.files?.length > 0 || normalized.aiContent || normalized.quiz || normalized.ai_content || normalized.creationMode || normalized.creation_mode;
      
      if (!hasContent) {
        console.warn('Session fetched but no content fields found. Session data:', normalized);
        // Log for debugging
        console.log('Files:', normalized.files);
        console.log('AI Content:', normalized.aiContent || normalized.ai_content);
        console.log('Quiz:', normalized.quiz);
        console.log('Creation Mode:', normalized.creationMode || normalized.creation_mode);
        console.log('Raw session from API (before normalization):', fullSession);
      }
      
      setSelectedSession(normalized);
      setCurrentView('session-content');
    } catch (error) {
      console.error('Failed to load session details:', error);
      // Fallback: try to get from publishedSessions or use local data
      const details = getSessionDetails(session);
      if (details) {
        // Check if we have content, if not try fetching from publishedSessions
        const hasContent = details.files?.length > 0 || details.aiContent || details.quiz || details.ai_content;
        if (!hasContent) {
          // Try to find in publishedSessions with full data
          const publishedSession = publishedSessions.find(s => s.id === session.id);
          if (publishedSession && (publishedSession.files?.length > 0 || publishedSession.aiContent || publishedSession.quiz)) {
            setSelectedSession(publishedSession);
            setCurrentView('session-content');
            return;
          }
        }
        setSelectedSession(details);
        setCurrentView('session-content');
      }
    }
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

  const handleSessionFeedbackUpdate = async (feedbackData) => {
    if (!selectedSession || !selectedSession.id) return;
    const userId = getUserId();
    if (!userId) return;

    const sessionId = selectedSession.id;
    try {
      // Find existing completion for this session
      const existing = sessionCompletions.find(c => c.session === sessionId);
      let updated;

      if (existing) {
        updated = await sessionCompletionAPI.update(existing.id, {
          ...existing,
          feedback: feedbackData,
        });

        setSessionCompletions(prev =>
          prev.map(c => (c.id === existing.id ? updated : c))
        );
      } else {
        // Create a completion with feedback if none exists yet
        updated = await sessionCompletionAPI.create({
          employee: parseInt(userId),
          session: sessionId,
          score: null,
          passed: false,
          feedback: feedbackData,
        });

        setSessionCompletions(prev => [...prev, updated]);
        if (!completedSessions.includes(sessionId)) {
          setCompletedSessions(prev => [...prev, sessionId]);
          setTotalSessionsStarted(prev => prev + 1);
        }
      }

      // Update selected session with latest feedback
      setSelectedSession(prev =>
        prev ? { ...prev, feedback: updated.feedback } : prev
      );
    } catch (error) {
      console.error('Failed to update session feedback:', error);
    }
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

  const markNotificationAsRead = async (notificationId) => {
    try {
      // Update in backend
      await notificationAPI.update(notificationId, { is_read: true });
      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Still update local state on error
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    }
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

      {/* Latest Sessions */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Latest Sessions
        </Typography>
        {latestSessions.length === 0 ? (
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No sessions available yet. Once new sessions are published, they will appear here.
              </Typography>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {latestSessions.map((session) => {
              const details = getSessionDetails(session);
              return (
                <Grid item xs={12} md={4} key={session.id}>
                  <Card 
                    sx={{ 
                      p: 2, 
                      height: '100%',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: 4,
                        transition: 'box-shadow 0.2s'
                      }
                    }}
                    onClick={() => {
                      if (details) {
                        setSelectedSession(details);
                        setCurrentView('session-detail');
                      }
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minHeight: '3.5em'
                    }}>
                      {session.title || 'Untitled Session'}
              </Typography>
                    {session.description && (
                      <Typography variant="body2" color="text.secondary" mb={2} sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minHeight: '2.5em'
                      }}>
                        {session.description}
                      </Typography>
                    )}
                    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                      {session.skills && session.skills.length > 0 && (
                        session.skills.slice(0, 2).map((skill, idx) => (
                <Chip 
                            key={idx}
                            label={skill}
                  size="small" 
                            sx={{
                              backgroundColor: '#e8f5e9',
                              color: '#2e7d32',
                              fontSize: '0.7rem',
                              height: '24px'
                            }}
                          />
                        ))
                      )}
                    </Box>
                    <Box display="flex" gap={1} flexWrap="wrap">
                <Chip 
                        label={session.instructor || 'HR Team'} 
                  size="small" 
                  variant="outlined" 
                />
                      {session.publishedAt && (
                <Chip 
                          label={new Date(session.publishedAt).toLocaleDateString()} 
                  size="small" 
                  variant="outlined" 
                />
                      )}
              </Box>
                  </Card>
            </Grid>
              );
            })}
            </Grid>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <ActivityCard sx={{ height: '100%' }}>
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

        {/* Recommended Sessions */}
        <Grid item xs={12} md={6}>
          <ActivityCard sx={{ height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recommended Sessions
            </Typography>
            {(() => {
              // Get employee skills for display
              const employeeSkills = (profileData.keyskills || [])
                .map(skill => (skill || '').toString().toLowerCase().trim())
                .filter(Boolean);
              
              // Use the already-calculated recommendedSessionsList (includes scheduled sessions)
              const recommendedSessions = recommendedSessionsList.slice(0, 5); // Limit to 5 recommendations

              if (recommendedSessions.length === 0) {
                return (
                  <Typography variant="body2" color="text.secondary">
                    {employeeSkills.length === 0
                      ? 'Complete your profile with skills to get personalized session recommendations.'
                      : 'No sessions match your skills at the moment. Check back later for new recommendations.'}
                  </Typography>
                );
              }

              return (
                <List>
                  {recommendedSessions.map((session) => {
                    // Get matching skills for this session
                    const sessionSkills = (session.skills || [])
                      .map(skill => (skill || '').toString().toLowerCase().trim())
                      .filter(Boolean);
                    const matchingSkills = sessionSkills.filter(skill => employeeSkills.includes(skill));
                    
                    return (
                      <ListItem 
                        key={session.id} 
                        sx={{ px: 0, cursor: 'pointer' }}
                        onClick={() => {
                          const details = getSessionDetails(session);
                          if (details) {
                            setSelectedSession(details);
                            setCurrentView('session-detail');
                          }
                        }}
                      >
                        <ListItemIcon>
                          <SchoolIcon sx={{ color: '#114417DB' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={session.title || 'Untitled Session'}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" component="span">
                                {matchingSkills.slice(0, 2).join(', ') || sessionSkills.slice(0, 2).join(', ')}
                              </Typography>
                              {session.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ 
                                  display: '-webkit-box',
                                  WebkitLineClamp: 1,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  mt: 0.5
                                }}>
                                  {session.description}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              );
            })()}
          </ActivityCard>
        </Grid>
      </Grid>
    </Box>
  );

  const renderProfile = () => (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Employee Profile
        </Typography>
        <IconButton 
          onClick={handleCloseProfile}
          sx={{ border: '1px solid rgba(0, 0, 0, 0.23)', '&:hover': { borderColor: 'rgba(0, 0, 0, 0.87)' } }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" color="text.secondary">First Name:</Typography>
            <Typography variant="h6">{profileData.firstName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" color="text.secondary">Last Name:</Typography>
            <Typography variant="h6">{profileData.lastName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" color="text.secondary">Email:</Typography>
            <Typography variant="h6">{profileData.email}</Typography>
        </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" color="text.secondary">Phone Number:</Typography>
            <Typography variant="h6">{profileData.phone}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" color="text.secondary">Department:</Typography>
            <Typography variant="h6">{profileData.department}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" color="text.secondary">Job Role:</Typography>
            <Typography variant="h6">{profileData.jobRole}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" color="text.secondary">Reporting Manager:</Typography>
            <Typography variant="h6">{profileData.reportingManager}</Typography>
          </Grid>
          {profileData.keyskills && profileData.keyskills.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Skills:
                </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {profileData.keyskills.map((skill, idx) => (
                  <Chip
                    key={idx}
                    label={skill}
                    size="small"
                    sx={{
                      backgroundColor: '#e8f5e9',
                      color: '#2e7d32',
                      fontSize: '0.75rem'
                    }}
                  />
                ))}
            </Box>
          </Grid>
          )}
        </Grid>
      </Card>
      
      {/* Action Buttons */}
      <Box display="flex" gap={2} mt={3} justifyContent="center">
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEditProfile}
          sx={{
            backgroundColor: '#114417DB',
            '&:hover': { backgroundColor: '#0a2f0e' },
            minWidth: 200
          }}
        >
          Edit
            </Button>
        <Button
          variant="outlined"
          startIcon={<LockIcon />}
          onClick={handleChangePassword}
          sx={{
            borderColor: '#114417DB',
            color: '#114417DB',
            '&:hover': { borderColor: '#0a2f0e', backgroundColor: 'rgba(17, 68, 23, 0.08)' },
            minWidth: 200
          }}
        >
          Change Password
        </Button>
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            borderColor: '#ef4444',
            color: '#ef4444',
            '&:hover': { borderColor: '#dc2626', backgroundColor: 'rgba(239, 68, 68, 0.08)' },
            minWidth: 200
          }}
        >
          Logout
        </Button>
              </Box>
            </Box>
  );

  const renderPasswordManager = () => (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Manage Passwords
                </Typography>
        <IconButton 
          onClick={handleClosePasswordManager}
          sx={{ border: '1px solid rgba(0, 0, 0, 0.23)', '&:hover': { borderColor: 'rgba(0, 0, 0, 0.87)' } }}
        >
          <CloseIcon />
        </IconButton>
              </Box>

      <Grid container spacing={3}>
        {/* Reset Password */}
          <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Reset Password
                </Typography>
            <Box mt={3}>
              <TextField
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />
              <TextField
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                fullWidth
                margin="normal"
                helperText="Minimum 6 characters"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />
              <TextField
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handlePasswordReset}
                sx={{ mt: 3, backgroundColor: '#3b82f6', '&:hover': { backgroundColor: '#2563eb' } }}
              >
                Reset Password
              </Button>
              </Box>
          </Card>
          </Grid>
          </Grid>
    </Box>
  );

  const renderEditProfile = () => (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Edit Employee Profile
        </Typography>
        <Box display="flex" gap={2}>
        <Button
            variant="contained" 
            onClick={handleProfileSave}
            sx={{ backgroundColor: '#114417DB', '&:hover': { backgroundColor: '#0a2f0e' } }}
          >
            Save Changes
        </Button>
          <IconButton 
            onClick={() => setShowEditProfile(false)}
            sx={{ border: '1px solid rgba(0, 0, 0, 0.23)', '&:hover': { borderColor: 'rgba(0, 0, 0, 0.87)' } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <Card sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              value={profileData.firstName}
              onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              value={profileData.lastName}
              onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              value={profileData.phone}
              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Department"
              value={profileData.department}
              onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Job Role"
              value={profileData.jobRole}
              onChange={(e) => setProfileData(prev => ({ ...prev, jobRole: e.target.value }))}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Reporting Manager"
              value={profileData.reportingManager}
              onChange={(e) => setProfileData(prev => ({ ...prev, reportingManager: e.target.value }))}
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>
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
        {activeTab === 'profile' ? (showPasswordManager ? renderPasswordManager() : (showEditProfile ? renderEditProfile() : renderProfile())) :
         currentView === 'session-detail' ? (
           <SessionDetail
             session={selectedSession}
             isCompleted={selectedSession && completedSessions.includes(selectedSession.id)}
             onBack={handleBackFromSessionDetail}
             backLabel={sessionDetailSource === 'course-library' ? 'Back to Session Library' : 'Back to My Sessions'}
             onGetStarted={handleGetStarted}
             onFeedbackSubmit={handleSessionFeedbackUpdate}
             completion={selectedSession ? getLatestCompletion(selectedSession.id) : null}
             previousAttempts={selectedSession ? getPreviousAttempts(selectedSession.id) : []}
             onRetakeAssessment={handleRetakeAssessment}
             employeeName={profileData.firstName && profileData.lastName ? `${profileData.firstName} ${profileData.lastName}` : profileData.firstName || profileData.lastName || 'Employee'}
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
            sessions={mySessionsList}
             onSessionComplete={handleSessionComplete}
             onSessionStart={handleSessionStart}
             onSessionClick={(session) => handleSessionClick(session, 'my-courses')}
             startedSessionIds={startedSessions}
             loading={sessionsLoading || completionsLoading}
           />
         ) :
         activeTab === 'course-library' ? (
           <CourseLibrary 
            lockedSessions={enrichedSessions}
            onSessionStart={handleSessionStart}
            onSessionClick={(session) => handleSessionClick(session, 'course-library')}
            loading={sessionsLoading}
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
