import React, { useState, useEffect, useMemo } from 'react';
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
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
  Badge,
  LinearProgress,
  Menu,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  InputAdornment,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import {
  BarChart as BarChartIcon,
  Schedule as ScheduleIcon,
  Lightbulb as LightbulbIcon,
  Group as GroupIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Add as AddIcon,
  People as PeopleIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  TrendingUp as TrendingUpIcon,
  Feedback as FeedbackIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  LocalFireDepartment as FireIcon,
  ArrowBack as ArrowBackIcon,
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Article as ArticleIcon,
  VideoLibrary as VideoLibraryIcon,
  Quiz as QuizIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  Search as SearchIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  InsertDriveFile as FileIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  DeleteForever as DeleteForeverIcon,
  Save as SaveIcon,
  Visibility as PreviewIcon,
  Publish as PublishIcon,
  LibraryBooks as LibraryBooksIcon,
  GridOn as GridViewIcon,
  ViewList as ListViewIcon,
  Star as StarIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Image as ImageIcon,
  CloudUpload as CloudUploadIcon2,
  AutoAwesome as AutoAwesomeIcon,
  Info as InfoIcon,
  UploadFile as UploadFileIcon2,
  Event as EventIcon,
  Send as SendIcon,
  AccessTime as AccessTimeIcon,
  Today as TodayIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Description as DescriptionIcon2,
  Edit as EditIcon2,
  Lock as LockIcon2,
  Done as DoneIcon,
  Cancel as CancelIcon,
  CardMembership as CertificateIcon,
  EmojiEvents as AwardIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Analytics from './Analytics';
import Approvals from './Approvals';
import InteractiveQuiz from './InteractiveQuiz';

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

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [showContentCreator, setShowContentCreator] = useState(false);
  const [contentCreatorView, setContentCreatorView] = useState('main'); // 'main', 'ai-creator', 'creation-modes', 'upload-file'
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [aiContentGenerated, setAiContentGenerated] = useState(false);
  const [aiKeywords, setAiKeywords] = useState('');
  const [showContentPreview, setShowContentPreview] = useState(false);
  const [selectedCreationMode, setSelectedCreationMode] = useState(null); // 'powerpoint', 'word', 'video'
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showScheduleSuccess, setShowScheduleSuccess] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [showAppSelector, setShowAppSelector] = useState(false);
  const [selectedAppType, setSelectedAppType] = useState('');
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [currentQuizData, setCurrentQuizData] = useState(null); // For tracking quiz being edited
  const [showPasswordManager, setShowPasswordManager] = useState(false);
  const [showSavedSessionsFolder, setShowSavedSessionsFolder] = useState(false);
  const [currentQuizSessionId, setCurrentQuizSessionId] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [adminCredentials, setAdminCredentials] = useState({
    username: 'admin',
    password: 'admin123'
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    duration: '',
    title: '',
    description: ''
  });
  
  // Profile states
  const [showProfile, setShowProfile] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@company.com',
    phone: '123-456-7890',
    department: 'Human Resources',
    jobRole: 'HR Administrator',
    reportingManager: 'CEO',
    employeeId: 'ADM001'
  });
  const [editProfileData, setEditProfileData] = useState(profileData);
  
  // Notification states
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  // Load functions for initializing state from localStorage
  // Load employees from localStorage
  const loadEmployees = () => {
    const stored = localStorage.getItem('admin_employees');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error loading employees:', e);
      }
    }
    return [
      { 
      id: 1, 
      firstName: "John", 
      lastName: "Smith", 
      name: "John Smith", 
      email: "john.smith@company.com", 
      department: "Engineering",
      jobRole: "Software Engineer",
      employeeId: "EMP001",
      reportingManager: "Tech Lead",
      phone: "123-456-7890",
      role: "employee",
      status: "active",
      createdAt: "2024-01-15"
    },
    { 
      id: 2, 
      firstName: "Sarah", 
      lastName: "Johnson", 
      name: "Sarah Johnson", 
      email: "sarah.johnson@company.com", 
      department: "Engineering",
      jobRole: "Senior Developer",
      employeeId: "EMP002",
      reportingManager: "Tech Lead",
      phone: "123-456-7891",
      role: "employee",
      status: "active",
      createdAt: "2024-01-20"
    },
    { 
      id: 3, 
      firstName: "Mike", 
      lastName: "Wilson", 
      name: "Mike Wilson", 
      email: "mike.wilson@company.com", 
      department: "Engineering",
      jobRole: "DevOps Engineer",
      employeeId: "EMP003",
      reportingManager: "Tech Lead",
      phone: "123-456-7892",
      role: "employee",
      status: "active",
      createdAt: "2024-02-01"
    },
    { 
      id: 4, 
      firstName: "Emily", 
      lastName: "Davis", 
      name: "Emily Davis", 
      email: "emily.davis@company.com", 
      department: "Marketing",
      jobRole: "Marketing Manager",
      employeeId: "EMP004",
      reportingManager: "Marketing Director",
      phone: "123-456-7893",
      role: "employee",
      status: "active",
      createdAt: "2024-02-10"
    },
    { 
      id: 5, 
      firstName: "David", 
      lastName: "Brown", 
      name: "David Brown", 
      email: "david.brown@company.com", 
      department: "Marketing",
      jobRole: "Content Creator",
      employeeId: "EMP005",
      reportingManager: "Marketing Manager",
      phone: "123-456-7894",
      role: "employee",
      status: "active",
      createdAt: "2024-02-15"
    },
    { 
      id: 6, 
      firstName: "Lisa", 
      lastName: "Anderson", 
      name: "Lisa Anderson", 
      email: "lisa.anderson@company.com", 
      department: "Marketing",
      jobRole: "Social Media Specialist",
      employeeId: "EMP006",
      reportingManager: "Marketing Manager",
      phone: "123-456-7895",
      role: "employee",
      status: "active",
      createdAt: "2024-02-20"
    },
    { 
      id: 7, 
      firstName: "Tom", 
      lastName: "Miller", 
      name: "Tom Miller", 
      email: "tom.miller@company.com", 
      department: "HR",
      jobRole: "HR Manager",
      employeeId: "EMP007",
      reportingManager: "HR Director",
      phone: "123-456-7896",
      role: "admin",
      status: "active",
      createdAt: "2024-01-01"
    },
    { 
      id: 8, 
      firstName: "Anna", 
      lastName: "Garcia", 
      name: "Anna Garcia", 
      email: "anna.garcia@company.com", 
      department: "HR",
      jobRole: "HR Specialist",
      employeeId: "EMP008",
      reportingManager: "HR Manager",
      phone: "123-456-7897",
      role: "employee",
      status: "active",
      createdAt: "2024-01-10"
    },
    { 
      id: 9, 
      firstName: "Chris", 
      lastName: "Lee", 
      name: "Chris Lee", 
      email: "chris.lee@company.com", 
      department: "Finance",
      jobRole: "Financial Analyst",
      employeeId: "EMP009",
      reportingManager: "Finance Manager",
      phone: "123-456-7898",
      role: "employee",
      status: "active",
      createdAt: "2024-01-25"
    },
    { 
      id: 10, 
      firstName: "Maria", 
      lastName: "Rodriguez", 
      name: "Maria Rodriguez", 
      email: "maria.rodriguez@company.com", 
      department: "Finance",
      jobRole: "Accountant",
      employeeId: "EMP010",
      reportingManager: "Finance Manager",
      phone: "123-456-7899",
      role: "employee",
      status: "active",
      createdAt: "2024-02-05"
    },
    { 
      id: 11, 
      firstName: "James", 
      lastName: "Taylor", 
      name: "James Taylor", 
      email: "james.taylor@company.com", 
      department: "Sales",
      jobRole: "Sales Representative",
      employeeId: "EMP011",
      reportingManager: "Sales Manager",
      phone: "123-456-7800",
      role: "employee",
      status: "active",
      createdAt: "2024-02-12"
    },
    { 
      id: 12, 
      firstName: "Jennifer", 
      lastName: "White", 
      name: "Jennifer White", 
      email: "jennifer.white@company.com", 
      department: "Sales",
      jobRole: "Sales Manager",
      employeeId: "EMP012",
      reportingManager: "Sales Director",
      phone: "123-456-7801",
      role: "admin",
      status: "active",
      createdAt: "2024-01-05"
    }
    ];
  };

  // Load notifications from localStorage
  const loadNotifications = () => {
    const stored = localStorage.getItem('admin_notifications');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error loading notifications:', e);
      }
    }
    return [
      { 
        id: 1, 
        type: 'session_request', 
        message: 'New session access request from John Smith', 
        time: 'Just now', 
        read: false,
        action: 'view_request'
      },
      { 
        id: 2, 
        type: 'session_completed', 
        message: 'Sarah Johnson completed "Mental Health & Wellbeing" session', 
        time: '5 minutes ago', 
        read: false,
        action: 'view_analytics'
      },
      { 
        id: 3, 
        type: 'system_alert', 
        message: 'System maintenance scheduled for tonight at 11 PM', 
        time: '1 hour ago', 
        read: true,
        action: 'view_details'
      },
      { 
        id: 4, 
        type: 'employee_added', 
        message: 'New employee Mike Wilson added to Engineering department', 
        time: '2 hours ago', 
        read: true,
        action: 'view_employee'
      }
    ];
  };

  // Employee database with departments
  const [employees, setEmployees] = useState(() => loadEmployees());
  const [notifications, setNotifications] = useState(() => loadNotifications());

  // Load saved sessions from localStorage or use default data
  const loadSavedSessions = () => {
    const stored = localStorage.getItem('admin_saved_sessions');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error loading saved sessions:', e);
      }
    }
    return [
      {
        id: 1,
        title: "Mental Health & Wellbeing Training",
        type: "Employee Wellbeing",
        audience: "All Employees",
        description: "Comprehensive session on maintaining mental wellness in the workplace",
        dateTime: "2024-12-25T10:00",
        files: ["mental_health_guide.pdf", "wellbeing_presentation.pptx"],
        status: "draft",
        createdAt: "2024-12-20"
      },
      {
        id: 2,
        title: "React Development Fundamentals",
        type: "Technical Training",
        audience: "Developers",
        description: "Learn modern React development with hooks and best practices",
        dateTime: "2024-12-28T14:00",
        files: ["react_tutorial.pdf", "react_examples.docx"],
        status: "scheduled",
        createdAt: "2024-12-18"
      }
    ];
  };

  const [savedSessions, setSavedSessions] = useState(loadSavedSessions());
  
  // Load draft and published sessions from localStorage
  const loadDraftSessions = () => {
    const stored = localStorage.getItem('draft_sessions');
    return stored ? JSON.parse(stored) : [];
  };

  const loadPublishedSessions = () => {
    const stored = localStorage.getItem('published_sessions');
    return stored ? JSON.parse(stored) : [];
  };

  const loadSavedAssessments = () => {
    const stored = localStorage.getItem('saved_assessments');
    return stored ? JSON.parse(stored) : [];
  };

  // Load activities from localStorage
  const loadActivities = () => {
    const stored = localStorage.getItem('admin_activities');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error loading activities:', e);
        return [];
      }
    }
    return [];
  };

  const [draftSessions, setDraftSessions] = useState(loadDraftSessions());
  const [publishedSessions, setPublishedSessions] = useState(loadPublishedSessions());
  const [savedAssessments, setSavedAssessments] = useState(loadSavedAssessments());
  const [activities, setActivities] = useState(loadActivities());
  
  // Folder view states
  const [openFolder, setOpenFolder] = useState(null); // 'drafts', 'assessments', 'published'
  const [selectedAllSessionItem, setSelectedAllSessionItem] = useState(null); // Selected session/assessment for view in All Sessions
  const [viewMode, setViewMode] = useState(null); // 'preview', 'edit'
  const [editingSession, setEditingSession] = useState(null); // Editable copy of session for editing
  
  // Course Library states
  const [courseLibraryView, setCourseLibraryView] = useState('list'); // 'grid' or 'list'
  const [courseSearchTerm, setCourseSearchTerm] = useState('');
  const [courseFilters, setCourseFilters] = useState({
    skill: 'all',
    category: 'all',
    reviews: 'all'
  });
  
  // Analytics/Reports states
  const [analyticsTab, setAnalyticsTab] = useState('dashboard'); // 'dashboard' or 'reports'
  const [selectedReportCategory, setSelectedReportCategory] = useState('learn-reports'); // 'reports-home', 'learn-reports', 'scheduled-reports'
  const [selectedReport, setSelectedReport] = useState(null); // null, 'all-learners', 'course-status', 'learner-status'
  const [reportFilters, setReportFilters] = useState({
    departments: [],
    businessUnits: [],
    employmentStatus: []
  });
  const [reportData, setReportData] = useState([]);
  const [reportPage, setReportPage] = useState(0);
  const [reportRowsPerPage, setReportRowsPerPage] = useState(10);
  const [reportSearchTerm, setReportSearchTerm] = useState('');
  
  // Publish Course Dialog states
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [sessionToPublish, setSessionToPublish] = useState(null);
  const [publishCourseData, setPublishCourseData] = useState({
    courseImage: null,
    courseTitle: '',
    description: '',
    skills: []
  });
  
  // Schedule Session states (using existing showScheduleDialog from line 175)
  const [selectedSessionForScheduling, setSelectedSessionForScheduling] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [scheduleView, setScheduleView] = useState('sessions'); // 'sessions' or 'certification'
  const [scheduleSessionsViewMode, setScheduleSessionsViewMode] = useState('list'); // 'list' or 'grid'
  const [scheduleSessionsSearchTerm, setScheduleSessionsSearchTerm] = useState('');
  
  // Certification Templates states
  const [certificationView, setCertificationView] = useState('templates'); // 'templates', 'configure', 'permissions'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [certificateFields, setCertificateFields] = useState({
    title: 'CERTIFICATE',
    subtitle: '-OF APPRECIATION-',
    recipientLabel: 'Presented to',
    descriptionText: 'who gave the best and completed the course',
    userName: 'User Name',
    dateOfIssue: '01 Sept 2026',
    authorisedBy: 'Country Head'
  });
  const [templateMenuAnchor, setTemplateMenuAnchor] = useState(null);
  const [selectedMenuTemplate, setSelectedMenuTemplate] = useState(null);
  const [defaultTemplateId, setDefaultTemplateId] = useState(null);
  const [disabledTemplateIds, setDisabledTemplateIds] = useState([]);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [permissions, setPermissions] = useState({
    allowHRAdmins: true,
    allowManagers: true,
    requireApproval: false,
    autoGenerate: true,
    sendEmailNotification: true
  });
  const [savedCertifications, setSavedCertifications] = useState([]);
  const [showSavedCertifications, setShowSavedCertifications] = useState(false);
  const [selectedSessionForCertification, setSelectedSessionForCertification] = useState(null);
  const [certificationToConfirm, setCertificationToConfirm] = useState(null);
  const [showCertificationConfirm, setShowCertificationConfirm] = useState(false);
  const [sessionCertifications, setSessionCertifications] = useState({}); // { sessionId: certificationId }
  
  // View All dialog states
  const [showViewAllDialog, setShowViewAllDialog] = useState(false);
  const [viewAllType, setViewAllType] = useState(null); // 'drafts', 'popular', 'newlyAdded'
  
  // Save draft and published sessions to localStorage
  useEffect(() => {
    localStorage.setItem('draft_sessions', JSON.stringify(draftSessions));
  }, [draftSessions]);

  useEffect(() => {
    localStorage.setItem('published_sessions', JSON.stringify(publishedSessions));
  }, [publishedSessions]);

  useEffect(() => {
    localStorage.setItem('saved_assessments', JSON.stringify(savedAssessments));
  }, [savedAssessments]);

  // Save activities to localStorage
  useEffect(() => {
    localStorage.setItem('admin_activities', JSON.stringify(activities));
  }, [activities]);
  
  // Store File objects separately in memory (not in localStorage)
  const [sessionFileObjects, setSessionFileObjects] = useState({});

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    // Create a serializable version of savedSessions (without File objects)
    const serializableSessions = savedSessions.map(session => ({
      ...session,
      files: session.files?.map(file => {
        if (file.fileObject) {
          // Store only metadata, not the File object
          return {
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: file.uploadedAt,
            isFileObject: true // Flag to indicate this was a File object
          };
        }
        return file;
      })
    }));
    localStorage.setItem('admin_saved_sessions', JSON.stringify(serializableSessions));
    console.log('Saved sessions to localStorage:', serializableSessions);
  }, [savedSessions]);

  // Save employees to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('admin_employees', JSON.stringify(employees));
    console.log('Saved employees to localStorage:', employees);
  }, [employees]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('admin_notifications', JSON.stringify(notifications));
    console.log('Saved notifications to localStorage:', notifications);
  }, [notifications]);

  // Real-time updates: Listen for storage changes (cross-tab communication)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'admin_saved_sessions' && e.newValue) {
        try {
          const newSessions = JSON.parse(e.newValue);
          setSavedSessions(newSessions);
          console.log('Received sessions update from another tab:', newSessions);
        } catch (error) {
          console.error('Error parsing sessions from storage:', error);
        }
      } else if (e.key === 'admin_employees' && e.newValue) {
        try {
          const newEmployees = JSON.parse(e.newValue);
          setEmployees(newEmployees);
          console.log('Received employees update from another tab:', newEmployees);
        } catch (error) {
          console.error('Error parsing employees from storage:', error);
        }
      } else if (e.key === 'admin_notifications' && e.newValue) {
        try {
          const newNotifications = JSON.parse(e.newValue);
          setNotifications(newNotifications);
          console.log('Received notifications update from another tab:', newNotifications);
        } catch (error) {
          console.error('Error parsing notifications from storage:', error);
        }
      }
    };

    // Listen to storage events (cross-tab)
    window.addEventListener('storage', handleStorageChange);

    // Also listen to custom storage events for same-tab updates
    const handleCustomStorageEvent = (e) => {
      if (e.detail?.key === 'admin_saved_sessions' && e.detail?.value) {
        try {
          const newSessions = typeof e.detail.value === 'string' 
            ? JSON.parse(e.detail.value) 
            : e.detail.value;
          setSavedSessions(newSessions);
        } catch (error) {
          console.error('Error parsing sessions from custom event:', error);
        }
      } else if (e.detail?.key === 'admin_employees' && e.detail?.value) {
        try {
          const newEmployees = typeof e.detail.value === 'string' 
            ? JSON.parse(e.detail.value) 
            : e.detail.value;
          setEmployees(newEmployees);
        } catch (error) {
          console.error('Error parsing employees from custom event:', error);
        }
      } else if (e.detail?.key === 'admin_notifications' && e.detail?.value) {
        try {
          const newNotifications = typeof e.detail.value === 'string' 
            ? JSON.parse(e.detail.value) 
            : e.detail.value;
          setNotifications(newNotifications);
        } catch (error) {
          console.error('Error parsing notifications from custom event:', error);
        }
      }
    };

    window.addEventListener('localStorageUpdate', handleCustomStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageUpdate', handleCustomStorageEvent);
    };
  }, []);

  // Real-time polling: Periodically check for localStorage updates (for same-tab updates)
  useEffect(() => {
    const pollInterval = setInterval(() => {
      // Check for sessions updates
      try {
        const storedSessions = localStorage.getItem('admin_saved_sessions');
        if (storedSessions) {
          const parsedSessions = JSON.parse(storedSessions);
          // Only update if data has changed
          const currentSessionsStr = JSON.stringify(savedSessions);
          const storedSessionsStr = JSON.stringify(parsedSessions);
          if (currentSessionsStr !== storedSessionsStr) {
            setSavedSessions(parsedSessions);
          }
        }
      } catch (error) {
        console.error('Error polling sessions:', error);
      }

      // Check for employees updates
      try {
        const storedEmployees = localStorage.getItem('admin_employees');
        if (storedEmployees) {
          const parsedEmployees = JSON.parse(storedEmployees);
          const currentEmployeesStr = JSON.stringify(employees);
          const storedEmployeesStr = JSON.stringify(parsedEmployees);
          if (currentEmployeesStr !== storedEmployeesStr) {
            setEmployees(parsedEmployees);
          }
        }
      } catch (error) {
        console.error('Error polling employees:', error);
      }

      // Check for notifications updates
      try {
        const storedNotifications = localStorage.getItem('admin_notifications');
        if (storedNotifications) {
          const parsedNotifications = JSON.parse(storedNotifications);
          const currentNotificationsStr = JSON.stringify(notifications);
          const storedNotificationsStr = JSON.stringify(parsedNotifications);
          if (currentNotificationsStr !== storedNotificationsStr) {
            setNotifications(parsedNotifications);
          }
        }
      } catch (error) {
        console.error('Error polling notifications:', error);
      }
    }, 2000); // Poll every 2 seconds for real-time updates

    return () => clearInterval(pollInterval);
  }, [savedSessions, employees, notifications]);

  const [sessionFormData, setSessionFormData] = useState({
    title: '',
    type: 'compliance',
    audience: 'all',
    description: ''
  });

  // Real-time metrics using useMemo
  const metrics = useMemo(() => {
    const totalSessionsCreated = savedSessions.length;
    const activeEmployees = employees.length;
    const upcomingSessions = savedSessions.filter(s => s.status === 'scheduled').length;
    const feedbackReceived = notifications.filter(n => n.type === 'session_completed').length;

    return [
      { label: 'Total Sessions Created', value: totalSessionsCreated.toString(), color: '#3b82f6', icon: <BarChartIcon sx={{ color: '#3b82f6' }} /> },
      { label: 'Active Employees', value: activeEmployees.toString(), color: '#10b981', icon: <PeopleIcon sx={{ color: '#10b981' }} /> },
      { label: 'Upcoming Sessions', value: upcomingSessions.toString(), color: '#f59e0b', icon: <CalendarIcon sx={{ color: '#f59e0b' }} /> },
      { label: 'Feedback Received', value: feedbackReceived.toString(), color: '#ef4444', icon: <FeedbackIcon sx={{ color: '#ef4444' }} /> }
    ];
  }, [savedSessions, employees, notifications]);

  // Real-time session status data using useMemo
  const sessionStatusData = useMemo(() => {
    const completedSessions = savedSessions.filter(s => s.status === 'completed').length;
    const inProgressSessions = savedSessions.filter(s => s.status === 'in_progress').length;
    const scheduledSessions = savedSessions.filter(s => s.status === 'scheduled').length;
    const draftSessionsCount = savedSessions.filter(s => s.status === 'draft').length;
    const totalSessionCount = savedSessions.length;
    
    return [
      { label: 'Completed', value: completedSessions, percentage: totalSessionCount > 0 ? Math.round((completedSessions / totalSessionCount) * 100) : 0 },
      { label: 'In Progress', value: inProgressSessions, percentage: totalSessionCount > 0 ? Math.round((inProgressSessions / totalSessionCount) * 100) : 0 },
      { label: 'Scheduled', value: scheduledSessions, percentage: totalSessionCount > 0 ? Math.round((scheduledSessions / totalSessionCount) * 100) : 0 },
      { label: 'Draft', value: draftSessionsCount, percentage: totalSessionCount > 0 ? Math.round((draftSessionsCount / totalSessionCount) * 100) : 0 }
    ];
  }, [savedSessions]);

  // Function to add new activity
  const addActivity = (action, user, type = 'info', iconType = 'default') => {
    const newActivity = {
      id: Date.now(),
      action: action,
      user: user,
      type: type,
      timestamp: new Date().toISOString(),
      iconType: iconType
    };
    
    setActivities(prev => {
      const updated = [newActivity, ...prev].slice(0, 50); // Keep last 50 activities
      return updated;
    });
  };

  // Get icon component based on icon type
  const getActivityIcon = (iconType, status) => {
    switch (iconType) {
      case 'session_created':
        return <AddIcon />;
      case 'session_scheduled':
        return <ScheduleIcon />;
      case 'session_completed':
        return <CheckCircleIcon />;
      case 'session_published':
        return <PublishIcon />;
      case 'session_deleted':
        return <DeleteIcon />;
      case 'quiz_created':
        return <QuizIcon />;
      case 'content_uploaded':
        return <CloudUploadIcon />;
      case 'employee_added':
        return <PeopleIcon />;
      default:
        return status === 'completed' ? <CheckCircleIcon /> : 
               status === 'scheduled' ? <ScheduleIcon /> : 
               status === 'draft' ? <EditIcon /> : <AddIcon />;
    }
  };
  
  // Enhanced time formatting with date and day
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    // Format time
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    // Format date
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    
    let dateStr = '';
    if (isToday) {
      dateStr = 'Today';
    } else if (isYesterday) {
      dateStr = 'Yesterday';
    } else if (diffDays < 7) {
      dateStr = date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      dateStr = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
    
    if (diffMins < 1) return `Just now`;
    if (diffMins < 60) return `${dateStr} at ${timeStr}`;
    if (diffHours < 24) return `${dateStr} at ${timeStr}`;
    return `${dateStr} at ${timeStr}`;
  };

  // Real-time recent activity from activities state
  const getRecentActivity = () => {
    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10)
      .map((activity) => ({
        id: activity.id,
        action: activity.action,
        user: activity.user,
        time: getTimeAgo(activity.timestamp),
        icon: getActivityIcon(activity.iconType, activity.type),
        timestamp: activity.timestamp
      }));
  };

  // State to force re-render for real-time time updates
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every minute for real-time activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);
  
  // Memoize recent activity to recalculate when activities or currentTime changes
  const recentActivity = useMemo(() => {
    return getRecentActivity();
  }, [activities, currentTime]);

  // Real-time filtered sessions for Course Management
  const draftCoursesList = useMemo(() => {
    return savedSessions.filter(s => s.status === 'draft');
  }, [savedSessions]);

  const popularCoursesList = useMemo(() => {
    return savedSessions
      .filter(s => s.status === 'completed')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [savedSessions]);

  const newlyAddedCoursesList = useMemo(() => {
    return savedSessions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [savedSessions]);

  // Get filtered list based on viewAllType
  const getFilteredSessions = () => {
    switch(viewAllType) {
      case 'drafts':
        return draftCoursesList;
      case 'popular':
        return popularCoursesList;
      case 'newlyAdded':
        return newlyAddedCoursesList;
      default:
        return [];
    }
  };

  // Get dialog title based on type
  const getDialogTitle = () => {
    switch(viewAllType) {
      case 'drafts':
        return 'All Draft Courses';
      case 'popular':
        return 'All Popular Courses';
      case 'newlyAdded':
        return 'All Newly Added Courses';
      default:
        return 'All Courses';
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChartIcon /> },
    { id: 'schedule', label: 'Schedule', icon: <ScheduleIcon /> },
    { id: 'manage-session', label: 'Manage', icon: <LightbulbIcon /> },
    { id: 'course-library', label: 'Course Library', icon: <LibraryBooksIcon /> },
    { id: 'approvals', label: 'Approvals', icon: <CheckCircleIcon /> },
    { id: 'employees', label: 'Employee Management', icon: <GroupIcon /> },
    { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  // Manage Session tab state (replacing submenu with tabs)
  const [manageSessionTab, setManageSessionTab] = useState('all-sessions'); // 'create', 'content-creator', 'live-trainings', 'assessment', 'certification', 'all-sessions'
  const [manageSessionView, setManageSessionView] = useState('all-sessions'); // Keep for backward compatibility, synced with manageSessionTab
  const [manageSessionsViewMode, setManageSessionsViewMode] = useState('list'); // 'list' or 'grid'
  const [manageSessionsSearchTerm, setManageSessionsSearchTerm] = useState('');

  const handleTabChange = (tab) => {
    console.log('handleTabChange called with tab:', tab);
    setActiveTab(tab);
    
    // Reset manage session state when switching away from manage-session
    if (tab !== 'manage-session') {
        setManageSessionView(null);
      setManageSessionTab('all-sessions');
      // Reset other manage-session related states
      setShowContentCreator(false);
      setShowQuizForm(false);
      setShowContentPreview(false);
      setSelectedAllSessionItem(null);
      setShowPublishDialog(false);
      setSessionToPublish(null);
    } else {
      // When switching to manage-session, set default tab if not set
      if (!manageSessionTab) {
        setManageSessionTab('all-sessions');
        setManageSessionView('all-sessions');
      } else {
        // Sync manageSessionView with manageSessionTab
        setManageSessionView(manageSessionTab);
      }
      // Clear selected session and publish dialog when entering manage sessions
      setSelectedAllSessionItem(null);
      setShowPublishDialog(false);
      setSessionToPublish(null);
    }
  };

  const handleManageSessionTabChange = (newTab) => {
    console.log('handleManageSessionTabChange called with tab:', newTab);
    setManageSessionTab(newTab);
    setManageSessionView(newTab);
    // Reset content creator related states when switching tabs
    if (newTab !== 'content-creator' && newTab !== 'create') {
      setShowContentCreator(false);
      setShowContentPreview(false);
    }
    if (newTab !== 'assessment') {
      setShowQuizForm(false);
    }
    // Clear selected session and publish dialog when switching to all-sessions
    if (newTab === 'all-sessions') {
      setSelectedAllSessionItem(null);
      setShowPublishDialog(false);
      setSessionToPublish(null);
    }
  };

  const handleManageSessionClick = (view) => {
    console.log('handleManageSessionClick called with view:', view);
    setActiveTab('manage-session');
    setManageSessionTab(view);
    setManageSessionView(view);
    // Reset all show flags
    setShowContentCreator(false);
    setShowQuizForm(false);
    setShowContentPreview(false);
    
    if (view === 'create') {
      setContentCreatorView('main');
    }
    if (view === 'content-creator') {
      setShowContentCreator(true);
      setContentCreatorView('main');
    }
    if (view === 'assessment') {
      setShowQuizForm(true);
    }
    if (view === 'all-sessions') {
      // Load latest from localStorage
      const drafts = localStorage.getItem('draft_sessions');
      const published = localStorage.getItem('published_sessions');
      const saved = localStorage.getItem('saved_assessments');
      if (drafts) {
        try {
          setDraftSessions(JSON.parse(drafts));
        } catch (e) {
          console.error('Error parsing draft sessions:', e);
        }
      }
      if (published) {
        try {
          setPublishedSessions(JSON.parse(published));
        } catch (e) {
          console.error('Error parsing published sessions:', e);
        }
      }
      if (saved) {
        try {
          setSavedAssessments(JSON.parse(saved));
        } catch (e) {
          console.error('Error parsing saved assessments:', e);
        }
      }
      console.log('All Sessions view activated, activeTab: manage-session, manageSessionView: all-sessions');
    }
  };

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleLogout = () => {
    // Handle logout logic
    console.log('Logout clicked');
    navigate('/login');
  };

  const handleViewProfile = () => {
    setShowProfile(true);
    setProfileAnchorEl(null);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    setShowEditProfile(false);
  };

  const handleEditProfile = () => {
    setEditProfileData(profileData);
    setShowEditProfile(true);
  };

  const handleEditProfileChange = (field) => (event) => {
    setEditProfileData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleProfileSave = () => {
    setProfileData(editProfileData);
    setShowEditProfile(false);
    setShowProfile(true);
  };

  const handleManagePasswords = () => {
    setShowPasswordManager(true);
    setProfileAnchorEl(null);
  };

  const handlePasswordChange = (field) => (event) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handlePasswordReset = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (passwordData.currentPassword !== adminCredentials.password) {
      alert('Current password is incorrect');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setAdminCredentials(prev => ({
      ...prev,
      password: passwordData.newPassword
    }));

    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    alert('Password updated successfully!');
  };

  const handleClosePasswordManager = () => {
    setShowPasswordManager(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // Notification handlers
  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNotificationAction = (notification) => {
    markNotificationAsRead(notification.id);
    if (notification.action === 'view_request') {
      navigate('/employee-engagement');
    } else if (notification.action === 'view_analytics') {
      setActiveTab('analytics');
    } else if (notification.action === 'view_employee') {
      setActiveTab('employees');
    } else if (notification.action === 'view_details') {
      alert('System maintenance details: Scheduled maintenance will occur from 11 PM to 1 AM EST.');
    }
    setNotificationAnchorEl(null);
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
      case 'session_request': return <GroupIcon fontSize="small" />;
      case 'session_completed': return <CheckCircleIcon fontSize="small" />;
      case 'system_alert': return <WarningIcon fontSize="small" />;
      case 'employee_added': return <AddIcon fontSize="small" />;
      default: return <NotificationsIcon fontSize="small" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'session_request': return 'info';
      case 'session_completed': return 'success';
      case 'system_alert': return 'warning';
      case 'employee_added': return 'primary';
      default: return 'default';
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        type: 'session_request',
        message: `New session access request from ${employees[Math.floor(Math.random() * employees.length)].name}`,
        time: 'Just now',
        read: false,
        action: 'view_request'
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only last 10 notifications
    }, 30000); // Add new notification every 30 seconds

    return () => clearInterval(interval);
  }, [employees]);

  const handleSessionFormChange = (field, value) => {
    setSessionFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateSession = () => {
    setShowContentCreator(true);
  };

  const handleContentCreatorCancel = () => {
    setActiveTab('dashboard');
    setContentCreatorView('main');
    setShowContentCreator(false);
    setSelectedFiles([]);
    setAiContentGenerated(false);
    setAiKeywords('');
    setShowContentPreview(false);
    setSelectedCreationMode(null);
  };

  const handleContentCreatorProceed = () => {
    // Check if there's content to proceed with
    const hasContent = selectedFiles.length > 0 || aiContentGenerated || selectedCreationMode;
    
    if (!hasContent) {
      alert('Please generate content, create a file, or upload a file before proceeding.');
      return;
    }
    
    // Show content preview, then navigate to quiz
    setShowContentPreview(true);
  };

  const handleGenerateAIContent = () => {
    if (!aiKeywords.trim()) {
      alert('Please enter keywords or topics to generate content.');
      return;
    }
    // Simulate AI content generation
    setAiContentGenerated(true);
    alert('AI Content generated successfully! You can now proceed to create the questionnaire.');
  };

  const handleProceedToQuiz = () => {
    console.log('Proceeding to Checkpoint Assessment');
    setShowContentPreview(false);
    setShowContentCreator(false);
    setContentCreatorView('main');
    // Navigate to Checkpoint Assessment view
    setActiveTab('manage-session');
    setManageSessionTab('assessment');
    setManageSessionView('assessment');
    // Reset showQuizForm since we're using manageSessionTab for navigation
    setShowQuizForm(false);
    // Store current session data for quiz
    setCurrentQuizData({
      aiContent: aiContentGenerated ? { keywords: aiKeywords } : null,
      creationMode: selectedCreationMode,
      files: selectedFiles,
      timestamp: new Date().toISOString()
    });
    console.log('Navigation set: activeTab=manage-session, manageSessionTab=assessment');
  };

  const handleSaveQuizAsDraft = (quizData) => {
    // Save session with quiz as draft
    const draftSession = {
      id: Date.now(),
      title: sessionFormData.title || quizData.title || 'Untitled Session',
      type: sessionFormData.type,
      audience: sessionFormData.audience,
      description: sessionFormData.description || quizData.description || '',
      files: selectedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
      quiz: quizData,
      aiContent: aiContentGenerated ? { keywords: aiKeywords } : null,
      creationMode: selectedCreationMode,
      status: 'draft',
      createdAt: new Date().toISOString(),
      savedAt: new Date().toISOString()
    };
    
    setDraftSessions(prev => {
      const updated = [draftSession, ...prev];
      localStorage.setItem('draft_sessions', JSON.stringify(updated));
      return updated;
    });
    
    // Navigate to Manage Sessions
    setActiveTab('manage-session');
    setManageSessionTab('all-sessions');
    setManageSessionView('all-sessions');
    setShowQuizForm(false);
    setShowContentPreview(false);
    setShowContentCreator(false);
    setSelectedAllSessionItem(null);
    setShowPublishDialog(false);
    setSessionToPublish(null);
    setCurrentQuizData(null);
    
    alert('Changes saved in Draft successfully!');
  };

  const handlePublishQuiz = (quizData) => {
    // Save session with quiz as ready to publish
    const publishedSession = {
      id: Date.now(),
      title: sessionFormData.title || quizData.title || 'Untitled Session',
      type: sessionFormData.type,
      audience: sessionFormData.audience,
      description: sessionFormData.description || quizData.description || '',
      files: selectedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
      quiz: quizData,
      aiContent: aiContentGenerated ? { keywords: aiKeywords } : null,
      creationMode: selectedCreationMode,
      status: 'ready_to_publish',
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString()
    };
    
    setPublishedSessions(prev => {
      const updated = [publishedSession, ...prev];
      localStorage.setItem('published_sessions', JSON.stringify(updated));
      return updated;
    });
    
    // Log activity
    addActivity(
      `Session published: ${publishedSession.title}`,
      'Admin',
      'published',
      'session_published'
    );
    
    alert('Session published successfully! It is now ready to publish.');
    setCurrentQuizData(null);
    setShowQuizForm(false);
    setActiveTab('dashboard');
  };

  const handleQuizPreview = (quizData) => {
    // Show preview of quiz - could open a dialog or navigate to preview page
    alert('Preview functionality - Quiz preview will open in a new window');
    // You can implement a preview modal here
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Log activity for file uploads
    if (files.length > 0) {
      const fileNames = files.map(f => f.name).join(', ');
      addActivity(
        `Content uploaded: ${fileNames}`,
        'Admin',
        'upload',
        'content_uploaded'
      );
    }
  };

  const handleFileInputClick = () => {
    document.getElementById('file-upload-input').click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Log activity for file uploads
    if (files.length > 0) {
      const fileNames = files.map(f => f.name).join(', ');
      addActivity(
        `Content uploaded: ${fileNames}`,
        'Admin',
        'upload',
        'content_uploaded'
      );
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSaveSession = () => {
    if (!sessionFormData.title || !sessionFormData.description) {
      alert('Please fill in all required fields');
      return;
    }

    const sessionId = Date.now();
    const newSession = {
      id: sessionId,
      title: sessionFormData.title,
      type: sessionFormData.type,
      audience: sessionFormData.audience,
      description: sessionFormData.description,
      files: selectedFiles.map(file => {
        // Store the actual File object with metadata
        return {
          name: file.name, 
          size: file.size, 
          type: file.type,
          uploadedAt: new Date().toISOString(),
          fileObject: file // Store the actual File object
        };
      }),
      status: 'draft',
      createdAt: new Date().toISOString()
    };

    // Store File objects separately in memory
    if (selectedFiles.length > 0) {
      setSessionFileObjects(prev => ({
        ...prev,
        [sessionId]: selectedFiles
      }));
    }

    setSavedSessions(prev => [newSession, ...prev]);
    
    // Log activity
    addActivity(
      `Session created: ${sessionFormData.title}`,
      'Admin',
      'draft',
      'session_created'
    );
    
    // Reset form
    setSessionFormData({
      title: '',
      type: 'compliance',
      audience: 'all',
      description: ''
    });
    setSelectedFiles([]);
    setShowContentCreator(false);
    
    // Redirect to saved sessions folder view
    setShowSavedSessionsFolder(true);
  };

  const handleScheduleSession = (session) => {
    setSelectedSession(session);
    setScheduleData({
      date: session.dateTime ? session.dateTime.split('T')[0] : '',
      startTime: session.dateTime ? session.dateTime.split('T')[1] : '',
      endTime: '',
      duration: '60',
      title: session.title,
      description: session.description
    });
    setShowScheduleDialog(true);
  };

  const handleDepartmentSelection = (department) => {
    setSelectedDepartment(department);
    if (department === 'all') {
      // Handle all organization selection
    } else {
      // Handle specific department selection
    }
  };

  const getDepartmentOptions = () => {
    const departments = [...new Set(employees.map(emp => emp.department))];
    return [
      { value: 'all', label: 'All Organization' },
      ...departments.map(dept => ({ value: dept, label: dept }))
    ];
  };

  const handleOpenPowerPoint = () => {
    setSelectedAppType('presentation');
    setShowAppSelector(true);
  };

  const handleOpenWord = () => {
    setSelectedAppType('document');
    setShowAppSelector(true);
  };

  const handleOpenVideoEditor = () => {
    setSelectedAppType('video');
    setShowAppSelector(true);
  };

  const handleCreateQuiz = () => {
    setShowQuizForm(true);
  };

  const handleQuizSave = (quizData) => {
    // Save assessment to Saved Assessment folder
    const savedAssessment = {
      id: Date.now(),
      title: quizData.title || quizData.assessmentInfo?.quizTitle || 'Untitled Assessment',
      description: quizData.description || '',
      quiz: quizData,
      assessmentInfo: quizData.assessmentInfo || {},
      questions: quizData.questions || [],
      status: 'saved',
      createdAt: new Date().toISOString(),
      savedAt: new Date().toISOString()
    };
    
    setSavedAssessments(prev => {
      const updated = [savedAssessment, ...prev];
      localStorage.setItem('saved_assessments', JSON.stringify(updated));
      return updated;
    });
    
    // Log activity
    addActivity(
      `Quiz/Assessment created: ${savedAssessment.title}`,
      'Admin',
      'quiz',
      'quiz_created'
    );
    
    // Navigate to Manage Sessions
    setActiveTab('manage-session');
    setManageSessionTab('all-sessions');
    setManageSessionView('all-sessions');
    setShowQuizForm(false);
    setShowContentPreview(false);
    setShowContentCreator(false);
    setSelectedAllSessionItem(null);
    setShowPublishDialog(false);
    setSessionToPublish(null);
    
    alert('Assessment saved successfully!');
  };

  const handleQuizCancel = () => {
    setShowQuizForm(false);
    // Reset manage session view state
    if (manageSessionView === 'assessment') {
      // If coming from Content Creator flow, go back to content creator
      if (showContentCreator || currentQuizData) {
        setManageSessionView('content-creator');
        setShowContentCreator(true);
        setContentCreatorView('main');
      } else {
        // Otherwise, go back to dashboard
      setActiveTab('dashboard');
        setManageSessionView(null);
    }
    }
    setCurrentQuizData(null);
  };

  const handleDeleteSession = (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      const session = savedSessions.find(s => s.id === sessionId);
      setSavedSessions(prev => prev.filter(session => session.id !== sessionId));
      
      // Log activity
      if (session) {
        addActivity(
          `Session deleted: ${session.title}`,
          'Admin',
          'deleted',
          'session_deleted'
        );
      }
      
      alert('Session deleted successfully!');
    }
  };

  // Folder view handlers
  const handleOpenFolder = (folderType) => {
    setOpenFolder(folderType);
    setSelectedAllSessionItem(null);
    setViewMode(null);
  };

  const handleCloseFolder = () => {
    setOpenFolder(null);
    setSelectedAllSessionItem(null);
    setViewMode(null);
  };

  const handleViewSession = (session, folderType) => {
    setSelectedAllSessionItem({ ...session, folderType });
    setViewMode('preview');
  };

  const handleEditSession = (session, folderType) => {
    const sessionWithFolder = { ...session, folderType };
    setSelectedAllSessionItem(sessionWithFolder);
    // Create deep copy for editing
    setEditingSession(JSON.parse(JSON.stringify(sessionWithFolder)));
    setViewMode('edit');
  };

  const handleSaveEdits = () => {
    if (!editingSession || !selectedAllSessionItem) return;

    const updatedSession = { ...editingSession };
    const folderType = updatedSession.folderType;

    // Update in the appropriate array
    if (folderType === 'drafts') {
      setDraftSessions(prev => 
        prev.map(s => s.id === updatedSession.id ? updatedSession : s)
      );
    } else if (folderType === 'assessments') {
      setSavedAssessments(prev => 
        prev.map(a => a.id === updatedSession.id ? updatedSession : a)
      );
    } else if (folderType === 'published') {
      setPublishedSessions(prev => 
        prev.map(s => s.id === updatedSession.id ? updatedSession : s)
      );
    }

    // Update the selected item
    setSelectedAllSessionItem(updatedSession);
    setEditingSession(null);
    setViewMode('preview');
    alert('Session updated successfully!');
  };

  const handleCancelEdit = () => {
    setEditingSession(null);
    setViewMode('preview');
  };

  const updateEditingQuestion = (questionIndex, field, value) => {
    if (!editingSession) return;
    const updated = JSON.parse(JSON.stringify(editingSession));
    
    if (updated.quiz?.questions) {
      updated.quiz.questions[questionIndex] = {
        ...updated.quiz.questions[questionIndex],
        [field]: value
      };
    } else if (updated.questions) {
      updated.questions[questionIndex] = {
        ...updated.questions[questionIndex],
        [field]: value
      };
    }
    
    setEditingSession(updated);
  };

  const updateEditingOption = (questionIndex, optionIndex, value) => {
    if (!editingSession) return;
    const updated = JSON.parse(JSON.stringify(editingSession));
    const questions = updated.quiz?.questions || updated.questions || [];
    
    if (questions[questionIndex]) {
      if (!questions[questionIndex].options) {
        questions[questionIndex].options = [];
      }
      questions[questionIndex].options[optionIndex] = value;
      
      if (updated.quiz) {
        updated.quiz.questions = questions;
      } else {
        updated.questions = questions;
      }
      
      setEditingSession(updated);
    }
  };

  const addOptionToQuestion = (questionIndex) => {
    if (!editingSession) return;
    const updated = JSON.parse(JSON.stringify(editingSession));
    const questions = updated.quiz?.questions || updated.questions || [];
    
    if (questions[questionIndex]) {
      if (!questions[questionIndex].options) {
        questions[questionIndex].options = [];
      }
      questions[questionIndex].options.push('');
      
      if (updated.quiz) {
        updated.quiz.questions = questions;
      } else {
        updated.questions = questions;
      }
      
      setEditingSession(updated);
    }
  };

  const removeOptionFromQuestion = (questionIndex, optionIndex) => {
    if (!editingSession) return;
    const updated = JSON.parse(JSON.stringify(editingSession));
    const questions = updated.quiz?.questions || updated.questions || [];
    
    if (questions[questionIndex]?.options) {
      questions[questionIndex].options.splice(optionIndex, 1);
      
      if (updated.quiz) {
        updated.quiz.questions = questions;
      } else {
        updated.questions = questions;
      }
      
      setEditingSession(updated);
    }
  };

  const addQuestion = () => {
    if (!editingSession) return;
    const updated = JSON.parse(JSON.stringify(editingSession));
    const newQuestion = {
      text: '',
      type: 'multiple-choice',
      options: ['', ''],
      required: false
    };
    
    if (updated.quiz) {
      if (!updated.quiz.questions) {
        updated.quiz.questions = [];
      }
      updated.quiz.questions.push(newQuestion);
    } else {
      if (!updated.questions) {
        updated.questions = [];
      }
      updated.questions.push(newQuestion);
    }
    
    setEditingSession(updated);
  };

  const removeQuestion = (questionIndex) => {
    if (!editingSession) return;
    if (!window.confirm('Are you sure you want to remove this question?')) return;
    
    const updated = JSON.parse(JSON.stringify(editingSession));
    const questions = updated.quiz?.questions || updated.questions || [];
    questions.splice(questionIndex, 1);
    
    if (updated.quiz) {
      updated.quiz.questions = questions;
    } else {
      updated.questions = questions;
    }
    
    setEditingSession(updated);
  };

  const handleDeleteDraftSession = (sessionId) => {
    if (window.confirm('Are you sure you want to delete this draft session? This action cannot be undone.')) {
      const session = draftSessions.find(s => s.id === sessionId);
      setDraftSessions(prev => prev.filter(s => s.id !== sessionId));
      
      // Log activity
      if (session) {
        addActivity(
          `Draft session deleted: ${session.title || 'Untitled'}`,
          'Admin',
          'deleted',
          'session_deleted'
        );
      }
      
      alert('Draft session deleted successfully!');
    }
  };

  const handleDeleteAssessment = (assessmentId) => {
    if (window.confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
      const assessment = savedAssessments.find(a => a.id === assessmentId);
      setSavedAssessments(prev => prev.filter(a => a.id !== assessmentId));
      
      // Log activity
      if (assessment) {
        addActivity(
          `Assessment deleted: ${assessment.title || 'Untitled'}`,
          'Admin',
          'deleted',
          'session_deleted'
        );
      }
      
      alert('Assessment deleted successfully!');
    }
  };

  const handleDeletePublishedSession = (sessionId) => {
    if (window.confirm('Are you sure you want to delete this published session? This action cannot be undone.')) {
      const session = publishedSessions.find(s => s.id === sessionId);
      setPublishedSessions(prev => prev.filter(s => s.id !== sessionId));
      
      // Log activity
      if (session) {
        addActivity(
          `Published session deleted: ${session.title || 'Untitled'}`,
          'Admin',
          'deleted',
          'session_deleted'
        );
      }
      
      alert('Published session deleted successfully!');
    }
  };


  const handleFileView = (file) => {
    try {
      // Get the actual file object
      const fileToOpen = file.fileObject || file;
      
      // Check if file has a stored blob URL or if it's a File object
      if (file.url) {
        // If we stored a blob URL
        window.open(file.url, '_blank');
      } else if (fileToOpen instanceof File) {
        // If it's a File object, create a blob URL
        const url = URL.createObjectURL(fileToOpen);
        window.open(url, '_blank');
        // Clean up the URL after a delay
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } else if (typeof fileToOpen === 'string') {
        // If it's a URL string
        window.open(fileToOpen, '_blank');
      } else {
        alert(`Unable to open file: ${file.name || 'Unknown file'}\n\nThe file may no longer be available in memory.`);
      }
    } catch (error) {
      console.error('Error opening file:', error);
      alert(`Error opening file: ${file.name || 'Unknown file'}`);
    }
  };

  const handleFileDownload = (file) => {
    try {
      let url;
      let filename = file.name || 'download';
      const fileToDownload = file.fileObject || file;
      
      if (file.url) {
        url = file.url;
      } else if (fileToDownload instanceof File) {
        url = URL.createObjectURL(fileToDownload);
      } else {
        alert('Unable to download file');
        return;
      }
      
      // Create a temporary anchor element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up if we created a blob URL
      if (fileToDownload instanceof File) {
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert(`Error downloading file: ${file.name || 'Unknown file'}`);
    }
  };

  const handleAppOpen = (appName) => {
    setShowAppSelector(false);
    
    // Try different methods to open the application
    try {
      // Method 1: Try using file protocol URIs
      const appProtocols = {
        'PowerPoint': 'ms-powerpoint:',
        'Word': 'ms-word:',
        'Excel': 'ms-excel:',
        'Video Editor': 'ms-photos:'
      };

      // Method 2: Try opening via exec protocol
      if (appProtocols[appName]) {
        window.location.href = appProtocols[appName];
        
        // Also try with window.open as fallback
        setTimeout(() => {
          const fallback = window.open(appProtocols[appName], '_blank');
          if (!fallback) {
            alert(`Please manually open ${appName} from your Start menu or desktop.`);
          }
        }, 100);
      } else {
        alert(`Please manually open ${appName} to create your content.`);
      }
    } catch (error) {
      alert(`Please manually open ${appName} to create your content.`);
    }
  };

  const handleScheduleSubmit = () => {
    if (!scheduleData.date || !scheduleData.startTime || !scheduleData.endTime || !selectedDepartment) {
      alert('Please fill in all required fields and select a department');
      return;
    }

    // Update session status to scheduled
    setSavedSessions(prev => prev.map(session => 
      session.id === selectedSession.id 
        ? { ...session, status: 'scheduled', dateTime: `${scheduleData.date}T${scheduleData.startTime}`, createdAt: new Date().toISOString() }
        : session
    ));

    // Log activity
    addActivity(
      `Session scheduled: ${selectedSession.title}`,
      'Admin',
      'scheduled',
      'session_scheduled'
    );

    setShowScheduleDialog(false);
    setShowScheduleSuccess(true);
  };

  const renderDashboard = () => (
    <Box p={3}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comprehensive session management and employee oversight
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


      <Grid container spacing={3}>
        {/* Session Status Overview */}
        <Grid item xs={12} md={4}>
          <ActivityCard>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Session Status Overview
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={3}>
              <Box flex={1}>
                {sessionStatusData.map((item, index) => {
                  const getColor = () => {
                    switch(item.label) {
                      case 'Completed': return '#10b981';
                      case 'In Progress': return '#f59e0b';
                      case 'Scheduled': return '#3b82f6';
                      case 'Draft': return '#ef4444';
                      default: return '#6b7280';
                    }
                  };
                  return (
                    <Box key={index} mb={2}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" fontWeight="medium">
                          {item.label}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {item.value}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={item.percentage} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: getColor()
                          }
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </ActivityCard>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <ActivityCard>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recent Activity
            </Typography>
            {recentActivity.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="body2" color="text.secondary">
                  No recent activity
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Activities will appear here as you perform actions
                </Typography>
              </Box>
            ) : (
              <List>
                {recentActivity.map((activity) => (
                  <ListItem key={activity.id} sx={{ px: 0 }}>
                    <ListItemIcon>
                      {activity.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.action}
                      secondary={`${activity.user} • ${activity.time}`}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </ActivityCard>
        </Grid>
      </Grid>

      {/* Course Management Sections */}
      <Box mt={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Course Management
        </Typography>
        <Grid container spacing={3}>
          {/* Draft Courses */}
          <Grid item xs={12} md={4}>
            <ActivityCard>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Draft Courses
                </Typography>
                <Chip 
                  label={draftCoursesList.length} 
                  color="warning" 
                  size="small"
                />
              </Box>
              <List>
                {draftCoursesList.slice(0, 3).map((session) => (
                  <ListItem key={session.id} sx={{ px: 0, py: 1 }}>
                    <ListItemIcon>
                      <EditIcon sx={{ color: '#f59e0b' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={session.title}
                      secondary={`${session.type} • ${new Date(session.createdAt).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
                {draftCoursesList.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                    No draft courses
                  </Typography>
                )}
              </List>
              <Button 
                size="small" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={() => {
                  setViewAllType('drafts');
                  setShowViewAllDialog(true);
                }}
              >
                View All Drafts
              </Button>
            </ActivityCard>
          </Grid>

          {/* Popular Courses */}
          <Grid item xs={12} md={4}>
            <ActivityCard>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Popular Courses
                </Typography>
                <Chip 
                  label={popularCoursesList.length} 
                  color="success" 
                  size="small"
                />
              </Box>
              <List>
                {popularCoursesList.slice(0, 3).map((session) => (
                  <ListItem key={session.id} sx={{ px: 0, py: 1 }}>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#10b981' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={session.title}
                      secondary={`${session.type} • ${session.audience}`}
                    />
                  </ListItem>
                ))}
                {popularCoursesList.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                    No completed courses yet
                  </Typography>
                )}
              </List>
              <Button 
                size="small" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={() => {
                  setViewAllType('popular');
                  setShowViewAllDialog(true);
                }}
              >
                View All Popular
              </Button>
            </ActivityCard>
          </Grid>

          {/* Newly Added Courses */}
          <Grid item xs={12} md={4}>
            <ActivityCard>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Newly Added Courses
                </Typography>
                <Chip 
                  label={newlyAddedCoursesList.length} 
                  color="primary" 
                  size="small"
                />
              </Box>
              <List>
                {newlyAddedCoursesList.slice(0, 3).map((session) => (
                  <ListItem key={session.id} sx={{ px: 0, py: 1 }}>
                    <ListItemIcon>
                      <AddIcon sx={{ color: '#3b82f6' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={session.title}
                      secondary={`${session.type} • ${new Date(session.createdAt).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
                {newlyAddedCoursesList.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                    No courses added yet
                  </Typography>
                )}
              </List>
              <Button 
                size="small" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={() => {
                  setViewAllType('newlyAdded');
                  setShowViewAllDialog(true);
                }}
              >
                View All Courses
              </Button>
            </ActivityCard>
          </Grid>
        </Grid>
      </Box>

      {/* View All Dialog */}
      <Dialog 
        open={showViewAllDialog} 
        onClose={() => setShowViewAllDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              {getDialogTitle()}
            </Typography>
            <IconButton onClick={() => setShowViewAllDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {getFilteredSessions().length === 0 ? (
              <Box textAlign="center" py={6}>
                <Typography variant="body1" color="text.secondary">
                  No courses found
                </Typography>
              </Box>
            ) : (
              <List>
                {getFilteredSessions().map((session) => (
                  <ListItem 
                    key={session.id} 
                    sx={{ 
                      px: 0, 
                      py: 2,
                      borderBottom: '1px solid #e5e7eb',
                      '&:hover': {
                        backgroundColor: '#f9fafb'
                      }
                    }}
                  >
                    <ListItemIcon>
                      {viewAllType === 'drafts' ? (
                        <EditIcon sx={{ color: '#f59e0b' }} />
                      ) : viewAllType === 'popular' ? (
                        <CheckCircleIcon sx={{ color: '#10b981' }} />
                      ) : (
                        <AddIcon sx={{ color: '#3b82f6' }} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" fontWeight="medium">
                          {session.title || 'Untitled Session'}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" component="span">
                            {session.type || 'N/A'} • {session.audience || 'All Employees'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                            Created: {new Date(session.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                          {session.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {session.description.length > 100 
                                ? `${session.description.substring(0, 100)}...` 
                                : session.description}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <Box display="flex" gap={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          setShowViewAllDialog(false);
                          handleScheduleSession(session);
                        }}
                        disabled={viewAllType === 'drafts'}
                      >
                        Schedule
                      </Button>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this session?')) {
                            handleDeleteSession(session.id);
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowViewAllDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  const renderLiveTrainings = () => (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Live Trainings
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This section is under development
      </Typography>
    </Box>
  );

  const renderCheckpointAssessment = () => (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Checkpoint Assessment
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This section is under development
      </Typography>
    </Box>
  );

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  const handleTemplateMenuOpen = (event, template) => {
    event.stopPropagation();
    setTemplateMenuAnchor(event.currentTarget);
    setSelectedMenuTemplate(template);
  };

  const handleTemplateMenuClose = () => {
    setTemplateMenuAnchor(null);
    setSelectedMenuTemplate(null);
  };

  const handleSetAsDefault = () => {
    if (selectedMenuTemplate) {
      setDefaultTemplateId(selectedMenuTemplate.id);
      alert(`Template "${selectedMenuTemplate.name}" has been set as default.`);
    }
    handleTemplateMenuClose();
  };

  const handlePreviewTemplate = () => {
    if (selectedMenuTemplate) {
      setPreviewTemplate(selectedMenuTemplate);
      // Open preview dialog
    }
    handleTemplateMenuClose();
  };

  const handleDisableTemplate = () => {
    if (selectedMenuTemplate) {
      if (disabledTemplateIds.includes(selectedMenuTemplate.id)) {
        setDisabledTemplateIds(prev => prev.filter(id => id !== selectedMenuTemplate.id));
        alert(`Template "${selectedMenuTemplate.name}" has been enabled.`);
      } else {
        setDisabledTemplateIds(prev => [...prev, selectedMenuTemplate.id]);
        alert(`Template "${selectedMenuTemplate.name}" has been disabled.`);
        // If the disabled template was selected, clear selection
        if (selectedTemplate?.id === selectedMenuTemplate.id) {
          setSelectedTemplate(null);
        }
      }
    }
    handleTemplateMenuClose();
  };

  const handleConfirmTemplate = () => {
    if (!selectedTemplate) {
      alert('Please select a template first.');
      return;
    }
    setCertificationView('configure');
    // Reset certificate fields to template defaults
    setCertificateFields({
      title: selectedTemplate.title || 'CERTIFICATE',
      subtitle: selectedTemplate.subtitle || '-OF APPRECIATION-',
      recipientLabel: selectedTemplate.recipientLabel || 'Presented to',
      descriptionText: selectedTemplate.descriptionText || 'who gave the best and completed the course',
      userName: 'User Name',
      dateOfIssue: '01 Sept 2026',
      authorisedBy: 'Country Head'
    });
  };

  const handleUpdateFields = () => {
    // Save certificate fields and navigate to permissions
    setCertificationView('permissions');
    // In real app, this would save to backend
  };

  const handlePermissionsSave = () => {
    // Save certification configuration (template + fields + permissions)
    const newCertification = {
      id: Date.now(),
      template: selectedTemplate,
      fields: certificateFields,
      permissions: permissions,
      createdAt: new Date().toISOString(),
      name: selectedTemplate?.name || 'Certificate Configuration'
    };
    
    setSavedCertifications(prev => [...prev, newCertification]);
    
    // Navigate to manage sessions
    setActiveTab('manage-session');
    setManageSessionTab('all-sessions');
    // In real app, this would save to backend
  };

  const handleOpenCertifications = (session) => {
    setSelectedSessionForCertification(session);
    setShowSavedCertifications(true);
  };

  const handleSelectCertification = (certification) => {
    // Show confirmation dialog
    if (selectedSessionForCertification) {
      setCertificationToConfirm(certification);
      setShowCertificationConfirm(true);
    }
  };

  const handleConfirmCertification = () => {
    if (selectedSessionForCertification && certificationToConfirm) {
      // Associate certification with the selected session
      setSessionCertifications(prev => ({
        ...prev,
        [selectedSessionForCertification.id]: certificationToConfirm.id
      }));
      
      // In real app, this would save to backend
      setShowCertificationConfirm(false);
      setShowSavedCertifications(false);
      setSelectedSessionForCertification(null);
      setCertificationToConfirm(null);
    }
  };

  const handleCancelCertification = () => {
    setShowCertificationConfirm(false);
    setCertificationToConfirm(null);
  };

  const hasCertification = (sessionId) => {
    return sessionCertifications[sessionId] !== undefined;
  };

  const renderCertificationTemplates = () => {
    const certificateTemplates = [
      { 
        id: 1, 
        name: 'Certificate of Appreciation', 
        title: 'CERTIFICATE', 
        subtitle: 'OF APPRECIATION',
        design: 'gradient-border',
        borderColors: ['#8b5cf6', '#f59e0b']
      },
      { 
        id: 2, 
        name: 'Certificate of Excellence', 
        title: 'CERTIFICATE', 
        subtitle: 'Meaningful Leader Certification',
        design: 'green-gold',
        borderColors: ['#10b981', '#fbbf24'],
        hasMedal: true
      },
      { 
        id: 3, 
        name: 'Certificate of Completion', 
        title: 'CERTIFICATE', 
        subtitle: 'OF COMPLETION',
        design: 'minimal',
        borderColors: ['#10b981']
      },
      { 
        id: 4, 
        name: 'Certificate of Achievement', 
        title: 'CERTIFICATE', 
        subtitle: 'OF ACHIEVEMENT',
        design: 'gradient-vibrant',
        borderColors: ['#8b5cf6', '#f59e0b', '#fbbf24'],
        hasMedal: true
      },
      { 
        id: 5, 
        name: 'Certificate Vertical', 
        title: 'CERTIFICATE', 
        subtitle: 'OF COMPLETION',
        design: 'vertical-red',
        borderColors: ['#ef4444']
      },
      { 
        id: 6, 
        name: 'Certificate Simple', 
        title: 'CERTIFICATE', 
        subtitle: 'Creating Power Manager for Leader',
        design: 'simple-white',
        borderColors: ['#e5e7eb'],
        hasMedal: true
      }
    ];

    const renderTemplatePreview = (template) => {
      const isSelected = selectedTemplate?.id === template.id;
      const isDisabled = disabledTemplateIds.includes(template.id);
      const isDefault = defaultTemplateId === template.id;
      
      return (
        <Card
          key={template.id}
          sx={{
            position: 'relative',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            border: isSelected ? '2px solid #8b5cf6' : '1px solid #e5e7eb',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: isSelected ? '0 4px 12px rgba(139, 92, 246, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            opacity: isDisabled ? 0.5 : 1,
            '&:hover': {
              boxShadow: isDisabled ? '0 2px 8px rgba(0,0,0,0.1)' : '0 4px 12px rgba(139, 92, 246, 0.3)',
              transform: isDisabled ? 'none' : 'translateY(-2px)'
            }
          }}
          onClick={() => !isDisabled && setSelectedTemplate(template)}
        >
          {/* Default Badge */}
          {isDefault && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                zIndex: 2,
                backgroundColor: '#10b981',
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.65rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              Default
            </Box>
          )}
          
          {/* 3-Dot Menu Button */}
          <IconButton
            onClick={(e) => handleTemplateMenuOpen(e, template)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)'
              },
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            size="small"
          >
            <MoreVertIcon sx={{ fontSize: 18, color: '#6b7280' }} />
          </IconButton>

          {/* Template Preview - Certificate Sample */}
          <Box
            sx={{
              aspectRatio: '4/3',
              position: 'relative',
              backgroundColor: '#ffffff',
              p: 2.5,
              ...(template.design === 'gradient-border' && {
                borderLeft: `4px solid ${template.borderColors[0]}`,
                borderBottom: `4px solid ${template.borderColors[1]}`,
              }),
              ...(template.design === 'green-gold' && {
                border: `3px solid ${template.borderColors[0]}`,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  border: `2px solid ${template.borderColors[1]}`,
                  borderStyle: 'dashed',
                  margin: '8px'
                }
              }),
              ...(template.design === 'minimal' && {
                borderTop: `2px solid ${template.borderColors[0]}`,
              }),
              ...(template.design === 'gradient-vibrant' && {
                borderLeft: `4px solid ${template.borderColors[0]}`,
                borderBottom: `4px solid ${template.borderColors[1]}`,
                borderRight: `2px solid ${template.borderColors[2]}`
              }),
              ...(template.design === 'vertical-red' && {
                borderTop: `4px solid ${template.borderColors[0]}`,
                borderLeft: `4px solid ${template.borderColors[0]}`
              }),
              ...(template.design === 'simple-white' && {
                border: '1px solid #e5e7eb'
              })
            }}
          >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              {/* Top Section - Certificate Heading */}
              <Box sx={{ textAlign: 'center', mb: 1 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontStyle: 'italic',
                    color: '#000000',
                    fontSize: '0.85rem',
                    mb: 0.5,
                    letterSpacing: '1px'
                  }}
                >
                  CERTIFICATE
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#000000',
                    fontSize: '0.6rem',
                    display: 'block',
                    mb: 2
                  }}
                >
                  -OF APPRECIATION-
                </Typography>
                
                {/* Decorative Line */}
                <Box 
                  sx={{ 
                    width: '60%', 
                    height: '1px', 
                    backgroundColor: '#fbbf24', 
                    margin: '0 auto 1rem',
                    opacity: 0.6
                  }} 
                />
                
                {/* Presented to */}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#6b7280',
                    fontSize: '0.55rem',
                    display: 'block',
                    mb: 1
                  }}
                >
                  Presented to
                </Typography>
                
                {/* User Name */}
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#000000',
                    fontSize: '0.9rem',
                    mb: 1
                  }}
                >
                  User Name
                </Typography>
                
                {/* Description */}
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#6b7280',
                    fontSize: '0.5rem',
                    fontStyle: 'italic',
                    display: 'block',
                    mb: 1
                  }}
                >
                  who gave the best and completed the course
                </Typography>
              </Box>
              
              {/* Bottom Section - Date and Authorisation */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 'auto' }}>
                {/* Left - Date of Issue */}
                <Box>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#6b7280',
                      fontSize: '0.45rem',
                      display: 'block',
                      mb: 0.5
                    }}
                  >
                    Date of Issue
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#000000',
                      fontSize: '0.5rem',
                      fontWeight: 'medium'
                    }}
                  >
                    01 Sept 2026
                  </Typography>
                </Box>
                
                {/* Right - Authorised by */}
                <Box sx={{ textAlign: 'right' }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#6b7280',
                      fontSize: '0.45rem',
                      display: 'block',
                      mb: 0.5
                    }}
                  >
                    Authorised by
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#000000',
                      fontSize: '0.5rem',
                      fontWeight: 'medium',
                      display: 'block',
                      mb: 0.5
                    }}
                  >
                    Country Head
                  </Typography>
                  {/* Signature Line */}
                  <Box 
                    sx={{ 
                      width: '60px', 
                      height: '1px', 
                      backgroundColor: '#000000', 
                      marginLeft: 'auto',
                      mt: 0.5
                    }} 
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>
      );
    };

    return (
      <Box p={3} sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Certification
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Configure certification templates and settings for your training sessions
          </Typography>
        </Box>

        {/* Sub-header Tabs */}
        <Box mb={3} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={certificationView} onChange={(e, newValue) => setCertificationView(newValue)}>
            <Tab label="Templates" value="templates" />
            <Tab label="Configure Fields" value="configure" />
            <Tab label="Permissions" value="permissions" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {certificationView === 'templates' && (
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Select template
            </Typography>
            
            {/* Template Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {certificateTemplates.map((template) => (
                <Grid item xs={12} sm={6} md={4} key={template.id}>
                  {renderTemplatePreview(template)}
                </Grid>
              ))}
            </Grid>

            {/* Action Buttons */}
            <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
              <Button
                variant="outlined"
                onClick={() => {
                  setSelectedTemplate(null);
                  setCertificationView('templates');
                }}
                sx={{
                  borderColor: '#10b981',
                  color: '#10b981',
                  '&:hover': { 
                    borderColor: '#059669', 
                    backgroundColor: '#f0fdf4' 
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disabled={!selectedTemplate || disabledTemplateIds.includes(selectedTemplate?.id)}
                onClick={() => {
                  if (selectedTemplate) {
                    handleConfirmTemplate();
                  }
                }}
                sx={{
                  backgroundColor: '#10b981',
                  '&:hover': { backgroundColor: '#059669' },
                  '&:disabled': {
                    backgroundColor: '#d1d5db',
                    color: '#9ca3af'
                  }
                }}
              >
                Save
              </Button>
            </Box>

            {/* Template Menu */}
            <Menu
              anchorEl={templateMenuAnchor}
              open={Boolean(templateMenuAnchor)}
              onClose={handleTemplateMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleSetAsDefault}>
                Set as default
              </MenuItem>
              <MenuItem onClick={handlePreviewTemplate}>
                Preview
              </MenuItem>
              <MenuItem onClick={handleDisableTemplate}>
                {selectedMenuTemplate && disabledTemplateIds.includes(selectedMenuTemplate.id) 
                  ? 'Enable' 
                  : 'Disable'}
              </MenuItem>
            </Menu>

            {/* Preview Dialog */}
            <Dialog
              open={Boolean(previewTemplate)}
              onClose={() => setPreviewTemplate(null)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>
                Preview: {previewTemplate?.name}
                <IconButton
                  onClick={() => setPreviewTemplate(null)}
                  sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                {previewTemplate && (
                  <Box sx={{ p: 4, backgroundColor: '#ffffff', border: '2px solid #e5e7eb', borderRadius: 2, minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      {/* Top Section - Certificate Heading */}
                      <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 'bold',
                            fontStyle: 'italic',
                            color: '#000000',
                            mb: 1,
                            letterSpacing: '2px'
                          }}
                        >
                          CERTIFICATE
                        </Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#000000',
                            mb: 3
                          }}
                        >
                          -OF APPRECIATION-
                        </Typography>
                        
                        {/* Decorative Line */}
                        <Box 
                          sx={{ 
                            width: '60%', 
                            height: '2px', 
                            backgroundColor: '#fbbf24', 
                            margin: '0 auto 2rem',
                            opacity: 0.6
                          }} 
                        />
                        
                        {/* Presented to */}
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#6b7280',
                            mb: 2
                          }}
                        >
                          Presented to
                        </Typography>
                        
                        {/* User Name */}
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            fontWeight: 'bold',
                            color: '#000000',
                            mb: 2
                          }}
                        >
                          User Name
                        </Typography>
                        
                        {/* Description */}
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#6b7280',
                            fontStyle: 'italic',
                            mb: 2
                          }}
                        >
                          who gave the best and completed the course
                        </Typography>
                      </Box>
                      
                      {/* Bottom Section - Date and Authorisation */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 'auto' }}>
                        {/* Left - Date of Issue */}
                        <Box>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#6b7280',
                              mb: 1
                            }}
                          >
                            Date of Issue
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: '#000000',
                              fontWeight: 'medium'
                            }}
                          >
                            01 Sept 2026
                          </Typography>
                        </Box>
                        
                        {/* Right - Authorised by */}
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#6b7280',
                              mb: 1
                            }}
                          >
                            Authorised by
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: '#000000',
                              fontWeight: 'medium',
                              mb: 1
                            }}
                          >
                            Country Head
                          </Typography>
                          {/* Signature Line */}
                          <Box 
                            sx={{ 
                              width: '120px', 
                              height: '2px', 
                              backgroundColor: '#000000', 
                              marginLeft: 'auto',
                              mt: 1
                            }} 
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setPreviewTemplate(null)}>Close</Button>
              </DialogActions>
            </Dialog>
          </Card>
        )}

        {certificationView === 'configure' && (
          <Card sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <EditIcon2 sx={{ fontSize: 32, color: '#10b981' }} />
              <Typography variant="h5" fontWeight="bold">
                Configure Fields
              </Typography>
            </Box>
            
            {selectedTemplate ? (
              <Box>
                {/* Preview Section */}
                <Box mb={3}>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      Preview
                    </Typography>
                    <Card 
                      sx={{ 
                        p: 4, 
                        backgroundColor: '#ffffff',
                        border: '2px solid #e5e7eb',
                        borderRadius: 2,
                        maxWidth: '800px',
                        margin: '0 auto',
                        minHeight: '500px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        {/* Top Section - Certificate Heading */}
                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              fontWeight: 'bold',
                              fontStyle: 'italic',
                              color: '#000000',
                              mb: 1,
                              letterSpacing: '2px'
                            }}
                          >
                            {certificateFields.title}
                          </Typography>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: '#000000',
                              mb: 3
                            }}
                          >
                            {certificateFields.subtitle}
                          </Typography>
                          
                          {/* Decorative Line */}
                          <Box 
                            sx={{ 
                              width: '60%', 
                              height: '2px', 
                              backgroundColor: '#fbbf24', 
                              margin: '0 auto 2rem',
                              opacity: 0.6
                            }} 
                          />
                          
                          {/* Presented to */}
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: '#6b7280',
                              mb: 2
                            }}
                          >
                            {certificateFields.recipientLabel}
                          </Typography>
                          
                          {/* User Name */}
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              fontWeight: 'bold',
                              color: '#000000',
                              mb: 2
                            }}
                          >
                            {certificateFields.userName}
                          </Typography>
                          
                          {/* Description */}
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#6b7280',
                              fontStyle: 'italic',
                              mb: 2
                            }}
                          >
                            {certificateFields.descriptionText}
                          </Typography>
                        </Box>
                        
                        {/* Bottom Section - Date and Authorisation */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 'auto' }}>
                          {/* Left - Date of Issue */}
                          <Box>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#6b7280',
                                mb: 1
                              }}
                            >
                              Date of Issue
                            </Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                color: '#000000',
                                fontWeight: 'medium'
                              }}
                            >
                              {certificateFields.dateOfIssue}
                            </Typography>
                          </Box>
                          
                          {/* Right - Authorised by */}
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#6b7280',
                                mb: 1
                              }}
                            >
                              Authorised by
                            </Typography>
                            <Typography 
                              variant="body1" 
                              sx={{ 
                                color: '#000000',
                                fontWeight: 'medium',
                                mb: 1
                              }}
                            >
                              {certificateFields.authorisedBy}
                            </Typography>
                            {/* Signature Line */}
                            <Box 
                              sx={{ 
                                width: '120px', 
                                height: '2px', 
                                backgroundColor: '#000000', 
                                marginLeft: 'auto',
                                mt: 1
                              }} 
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                    <Typography variant="caption" color="text.secondary" mt={1} display="block">
                      Note: The changes made to fields will be applied to all the templates.
                    </Typography>
                  </Box>

                  {/* Editable Fields */}
                  <Box mb={3}>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                      Configure Fields
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Title"
                          value={certificateFields.title}
                          onChange={(e) => setCertificateFields(prev => ({ ...prev, title: e.target.value }))}
                          margin="normal"
                          helperText="Main certificate title (e.g., CERTIFICATE)"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Subtitle"
                          value={certificateFields.subtitle}
                          onChange={(e) => setCertificateFields(prev => ({ ...prev, subtitle: e.target.value }))}
                          margin="normal"
                          helperText="Certificate type (e.g., -OF APPRECIATION-)"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Recipient Label"
                          value={certificateFields.recipientLabel}
                          onChange={(e) => setCertificateFields(prev => ({ ...prev, recipientLabel: e.target.value }))}
                          margin="normal"
                          helperText="Text before recipient name (e.g., Presented to)"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="User Name"
                          value={certificateFields.userName}
                          onChange={(e) => setCertificateFields(prev => ({ ...prev, userName: e.target.value }))}
                          margin="normal"
                          helperText="Recipient name (will be updated per session)"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Description Text"
                          value={certificateFields.descriptionText}
                          onChange={(e) => setCertificateFields(prev => ({ ...prev, descriptionText: e.target.value }))}
                          multiline
                          rows={2}
                          margin="normal"
                          helperText="Description under recipient name"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Date of Issue"
                          value={certificateFields.dateOfIssue}
                          onChange={(e) => setCertificateFields(prev => ({ ...prev, dateOfIssue: e.target.value }))}
                          margin="normal"
                          helperText="Issue date format (e.g., 01 Sept 2026)"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Authorised By"
                          value={certificateFields.authorisedBy}
                          onChange={(e) => setCertificateFields(prev => ({ ...prev, authorisedBy: e.target.value }))}
                          margin="normal"
                          helperText="Authorizing authority (e.g., Country Head)"
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Action Buttons */}
                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                      variant="outlined"
                      startIcon={<CancelIcon />}
                      onClick={() => setCertificationView('templates')}
                      sx={{
                        borderColor: '#10b981',
                        color: '#10b981',
                        '&:hover': { borderColor: '#059669', backgroundColor: '#f0fdf4' }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<DoneIcon />}
                      onClick={handleUpdateFields}
                      sx={{
                        backgroundColor: '#10b981',
                        '&:hover': { backgroundColor: '#059669' },
                        border: '2px solid #8b5cf6',
                        boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.2)'
                      }}
                    >
                      Update
                    </Button>
                  </Box>
              </Box>
            ) : (
              <Box textAlign="center" py={8}>
                <EditIcon2 sx={{ fontSize: 64, color: '#d1d5db', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Configure Fields
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Please select a template from Templates tab first
                </Typography>
              </Box>
            )}
          </Card>
        )}

        {certificationView === 'permissions' && (
          <Card sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <LockIcon2 sx={{ fontSize: 32, color: '#f59e0b' }} />
              <Typography variant="h5" fontWeight="bold">
                Permissions
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Configure who can view and issue certificates:
              </Typography>
              <Box>
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={permissions.allowHRAdmins}
                          onChange={(e) => setPermissions(prev => ({ ...prev, allowHRAdmins: e.target.checked }))}
                        />
                      }
                      label="Allow HR admins to issue certificates"
                      sx={{ mb: 2, display: 'block' }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={permissions.allowManagers}
                          onChange={(e) => setPermissions(prev => ({ ...prev, allowManagers: e.target.checked }))}
                        />
                      }
                      label="Allow managers to view certificates"
                      sx={{ mb: 2, display: 'block' }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={permissions.requireApproval}
                          onChange={(e) => setPermissions(prev => ({ ...prev, requireApproval: e.target.checked }))}
                        />
                      }
                      label="Require approval before issuing certificates"
                      sx={{ mb: 2, display: 'block' }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={permissions.autoGenerate}
                          onChange={(e) => setPermissions(prev => ({ ...prev, autoGenerate: e.target.checked }))}
                        />
                      }
                      label="Auto-generate certificates upon course completion"
                      sx={{ mb: 2, display: 'block' }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={permissions.sendEmailNotification}
                          onChange={(e) => setPermissions(prev => ({ ...prev, sendEmailNotification: e.target.checked }))}
                        />
                      }
                      label="Send email notification when certificate is issued"
                      sx={{ mb: 2, display: 'block' }}
                    />
              </Box>

              {/* Action Buttons */}
              <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => setCertificationView('configure')}
                  sx={{
                    borderColor: '#10b981',
                    color: '#10b981',
                    '&:hover': { 
                      borderColor: '#059669', 
                      backgroundColor: '#f0fdf4' 
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handlePermissionsSave}
                  sx={{
                    backgroundColor: '#10b981',
                    '&:hover': { backgroundColor: '#059669' }
                  }}
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Card>
        )}

      </Box>
    );
  };

  const renderCreateSession = () => (
    <Box p={3}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Create New Session
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate comprehensive learning materials from keywords
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Session Details
            </Typography>
            <TextField
              label="Session Title"
              value={sessionFormData.title}
              onChange={(e) => handleSessionFormChange('title', e.target.value)}
              fullWidth
              margin="normal"
            />
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Session Type</InputLabel>
                          <Select
                            value={sessionFormData.type}
                            onChange={(e) => handleSessionFormChange('type', e.target.value)}
                            label="Session Type"
                          >
                            <MenuItem value="compliance">Compliance Training</MenuItem>
                            <MenuItem value="learning">Employee Learning and Development</MenuItem>
                            <MenuItem value="engagement">Employee Engagement & Well-being</MenuItem>
                            <MenuItem value="performance">Organizational Growth & Performance</MenuItem>
                            <MenuItem value="culture">Company & Culture-Oriented Sessions</MenuItem>
                            <MenuItem value="dei">Diversity, Equity & Inclusion (DEI)</MenuItem>
                            <MenuItem value="safety">Workplace Safety</MenuItem>
                            <MenuItem value="security">Security Awareness</MenuItem>
                            <MenuItem value="live-training">Live Training</MenuItem>
                          </Select>
                        </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Participants</InputLabel>
              <Select
                value={sessionFormData.audience}
                onChange={(e) => handleSessionFormChange('audience', e.target.value)}
                label="Participants"
              >
                <MenuItem value="all">All Employees</MenuItem>
                <MenuItem value="managers">Managers Only</MenuItem>
                <MenuItem value="developers">Developers</MenuItem>
                <MenuItem value="hr">HR Team</MenuItem>
              </Select>
            </FormControl>
                        <TextField
                          label="Description"
                          value={sessionFormData.description}
                          onChange={(e) => handleSessionFormChange('description', e.target.value)}
                          fullWidth
                          multiline
                          rows={3}
                          margin="normal"
                        />
            <Box display="flex" gap={2} mt={3}>
              <Button 
                variant="outlined" 
                fullWidth
                onClick={handleSaveSession}
                sx={{ borderColor: '#10b981', color: '#10b981', '&:hover': { borderColor: '#059669', backgroundColor: '#d1fae5' } }}
              >
                Save as Draft
              </Button>
              <Button 
                variant="outlined" 
                fullWidth
                onClick={() => setActiveTab('dashboard')}
                sx={{ borderColor: '#ef4444', color: '#ef4444', '&:hover': { borderColor: '#dc2626', backgroundColor: '#fef2f2' } }}
              >
                Cancel
              </Button>
              <Button 
                variant="contained" 
                fullWidth
                onClick={handleCreateSession}
                sx={{ backgroundColor: '#3b82f6', '&:hover': { backgroundColor: '#2563eb' } }}
              >
                Create Session
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Main Content Creator Menu
  const renderContentCreatorMain = () => (
    <Box p={3}>
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => {
              if (manageSessionView === 'content-creator') {
                setActiveTab('dashboard');
              } else {
                setShowContentCreator(false);
              }
            }}
          >
            Back
          </Button>
          <Button
            variant="outlined"
            startIcon={<FolderIcon />}
            onClick={() => {
              setShowContentCreator(false);
              setShowSavedSessionsFolder(true);
            }}
            sx={{
              borderColor: '#f59e0b',
              color: '#f59e0b',
              '&:hover': {
                borderColor: '#d97706',
                backgroundColor: '#fef3c7'
              }
            }}
          >
            View Saved Sessions
          </Button>
        </Box>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Content Creator
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate comprehensive learning materials from keywords
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* AI Content Creator Option */}
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              cursor: 'pointer', 
              height: '100%',
              transition: 'all 0.3s',
              '&:hover': { 
                backgroundColor: '#f8fafc',
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              } 
            }}
            onClick={() => setContentCreatorView('ai-creator')}
          >
            <FireIcon sx={{ fontSize: 64, color: '#f59e0b', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              AI Content Creator
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Generate comprehensive learning content using AI based on keywords and topics
            </Typography>
          </Card>
        </Grid>

        {/* Content Creation Modes Option */}
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              cursor: 'pointer', 
              height: '100%',
              transition: 'all 0.3s',
              '&:hover': { 
                backgroundColor: '#f8fafc',
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              } 
            }}
            onClick={() => setContentCreatorView('creation-modes')}
          >
            <LightbulbIcon sx={{ fontSize: 64, color: '#3b82f6', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Content Creation Modes
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create presentations, documents, and training videos using various tools
            </Typography>
          </Card>
        </Grid>

        {/* Upload File Option */}
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              p: 4, 
              textAlign: 'center', 
              cursor: 'pointer', 
              height: '100%',
              transition: 'all 0.3s',
              '&:hover': { 
                backgroundColor: '#f8fafc',
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
              } 
            }}
            onClick={() => setContentCreatorView('upload-file')}
          >
            <CloudUploadIcon sx={{ fontSize: 64, color: '#10b981', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Upload File
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload existing files like PDFs, documents, presentations, and videos
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // AI Content Creator Page
  const renderAIContentCreator = () => (
    <Box p={3}>
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => setContentCreatorView('main')}
          sx={{ mb: 2 }}
        >
          Back to Content Creator
        </Button>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          AI Content Creator
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Generate comprehensive learning materials from keywords
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Card sx={{ p: 3 }}>
            <TextField
              label="Enter keywords or topics"
              placeholder="e.g., mental health, workplace stress, mindfulness techniques"
              fullWidth
              multiline
              rows={6}
              margin="normal"
              value={aiKeywords}
              onChange={(e) => setAiKeywords(e.target.value)}
            />
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<FireIcon />}
              onClick={handleGenerateAIContent}
              sx={{ mt: 3, backgroundColor: '#f59e0b', '&:hover': { backgroundColor: '#d97706' } }}
            >
              Generate AI Content
            </Button>
            
            {aiContentGenerated && (
              <Box mt={3} p={2} sx={{ backgroundColor: '#d1fae5', borderRadius: 2 }}>
                <Typography variant="body1" color="success.main" fontWeight="medium">
                  ✓ Content generated successfully based on: "{aiKeywords}"
                </Typography>
              </Box>
            )}

            {/* Cancel and Proceed Buttons */}
            <Box display="flex" gap={2} mt={4}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={handleContentCreatorCancel}
                sx={{
                  borderColor: '#ef4444',
                  color: '#ef4444',
                  '&:hover': { borderColor: '#dc2626', backgroundColor: '#fef2f2' }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleContentCreatorProceed}
                disabled={!aiContentGenerated}
                sx={{
                  backgroundColor: '#10b981',
                  '&:hover': { backgroundColor: '#059669' },
                  '&:disabled': { backgroundColor: '#d1d5db', color: '#9ca3af' }
                }}
              >
                Proceed
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Content Creation Modes Page
  const renderContentCreationModes = () => (
    <Box p={3}>
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => setContentCreatorView('main')}
          sx={{ mb: 2 }}
        >
          Back to Content Creator
        </Button>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Content Creation Modes
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Choose a tool to create your content
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            p: 3, 
            textAlign: 'center', 
            cursor: 'pointer', 
            border: selectedCreationMode === 'powerpoint' ? '2px solid #3b82f6' : '1px solid #e5e7eb',
            backgroundColor: selectedCreationMode === 'powerpoint' ? '#eff6ff' : 'white',
            '&:hover': { backgroundColor: '#f8fafc' } 
          }}>
            <DescriptionIcon sx={{ fontSize: 48, color: '#3b82f6', mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              PowerPoint
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Create engaging presentations with slides, animations, and interactive elements.
            </Typography>
            <Button 
              variant={selectedCreationMode === 'powerpoint' ? 'contained' : 'outlined'} 
              fullWidth 
              onClick={() => {
                handleOpenPowerPoint();
                setSelectedCreationMode('powerpoint');
              }}
            >
              Create Presentation
            </Button>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            p: 3, 
            textAlign: 'center', 
            cursor: 'pointer', 
            border: selectedCreationMode === 'word' ? '2px solid #10b981' : '1px solid #e5e7eb',
            backgroundColor: selectedCreationMode === 'word' ? '#f0fdf4' : 'white',
            '&:hover': { backgroundColor: '#f8fafc' } 
          }}>
            <ArticleIcon sx={{ fontSize: 48, color: '#10b981', mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Word Document
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Create comprehensive documents with text, images, and formatting.
            </Typography>
            <Button 
              variant={selectedCreationMode === 'word' ? 'contained' : 'outlined'} 
              fullWidth 
              onClick={() => {
                handleOpenWord();
                setSelectedCreationMode('word');
              }}
            >
              Create Document
            </Button>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ 
            p: 3, 
            textAlign: 'center', 
            cursor: 'pointer', 
            border: selectedCreationMode === 'video' ? '2px solid #f59e0b' : '1px solid #e5e7eb',
            backgroundColor: selectedCreationMode === 'video' ? '#fffbeb' : 'white',
            '&:hover': { backgroundColor: '#f8fafc' } 
          }}>
            <VideoLibraryIcon sx={{ fontSize: 48, color: '#f59e0b', mb: 2 }} />
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Training Videos
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Create engaging video content with narration, animations, and interactive elements.
            </Typography>
            <Button 
              variant={selectedCreationMode === 'video' ? 'contained' : 'outlined'} 
              fullWidth 
              onClick={() => {
                handleOpenVideoEditor();
                setSelectedCreationMode('video');
              }}
            >
              Create Video
            </Button>
          </Card>
        </Grid>
      </Grid>

      {selectedCreationMode && (
        <Box mt={3} p={2} sx={{ backgroundColor: '#d1fae5', borderRadius: 2 }}>
          <Typography variant="body1" color="success.main" fontWeight="medium">
            ✓ {selectedCreationMode === 'powerpoint' ? 'PowerPoint' : selectedCreationMode === 'word' ? 'Word Document' : 'Training Video'} selected. 
            Please open the application to create your content, then proceed.
          </Typography>
        </Box>
      )}

      {/* Cancel and Proceed Buttons */}
      <Box display="flex" gap={2} mt={4}>
        <Button
          variant="outlined"
          fullWidth
          size="large"
          onClick={handleContentCreatorCancel}
          sx={{
            borderColor: '#ef4444',
            color: '#ef4444',
            '&:hover': { borderColor: '#dc2626', backgroundColor: '#fef2f2' }
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={handleContentCreatorProceed}
          disabled={!selectedCreationMode}
          sx={{
            backgroundColor: '#10b981',
            '&:hover': { backgroundColor: '#059669' },
            '&:disabled': { backgroundColor: '#d1d5db', color: '#9ca3af' }
          }}
        >
          Proceed
        </Button>
      </Box>
    </Box>
  );

  // Upload File Page
  const renderUploadFile = () => (
    <Box p={3}>
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => setContentCreatorView('main')}
          sx={{ mb: 2 }}
        >
          Back to Content Creator
        </Button>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Upload File
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload your existing files to attach to the session
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                border: '2px dashed #d1d5db',
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                backgroundColor: dragOver ? '#f3f4f6' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  backgroundColor: '#f9fafb',
                  borderColor: '#3b82f6',
                },
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleFileInputClick}
            >
              <CloudUploadIcon sx={{ fontSize: 64, color: '#6b7280', mb: 2 }} />
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Drag and drop files here, or click to browse
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supports PDF, DOC, PPT, MP4, and more
              </Typography>
              <input
                type="file"
                id="file-upload-input"
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
            </Box>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleFileInputClick}
              sx={{ mt: 3 }}
              size="large"
            >
              Choose Files
            </Button>
            
            {selectedFiles.length > 0 && (
              <Box mt={3}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Selected Files ({selectedFiles.length}):
                </Typography>
                {selectedFiles.map((file, index) => (
                  <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={2} p={2} sx={{ backgroundColor: '#f8fafc', borderRadius: 1 }}>
                    <Typography variant="body1">
                      {file.name} ({formatFileSize(file.size)})
                    </Typography>
                    <IconButton size="small" onClick={() => removeFile(index)} color="error">
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}

            {/* Cancel and Proceed Buttons */}
            <Box display="flex" gap={2} mt={4}>
              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={handleContentCreatorCancel}
                sx={{
                  borderColor: '#ef4444',
                  color: '#ef4444',
                  '&:hover': { borderColor: '#dc2626', backgroundColor: '#fef2f2' }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleContentCreatorProceed}
                disabled={selectedFiles.length === 0}
                sx={{
                  backgroundColor: '#10b981',
                  '&:hover': { backgroundColor: '#059669' },
                  '&:disabled': { backgroundColor: '#d1d5db', color: '#9ca3af' }
                }}
              >
                Proceed
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Main Content Creator Router
  const renderContentCreator = () => {
    switch (contentCreatorView) {
      case 'ai-creator':
        return renderAIContentCreator();
      case 'creation-modes':
        return renderContentCreationModes();
      case 'upload-file':
        return renderUploadFile();
      default:
        return renderContentCreatorMain();
    }
  };

  // Content Preview Page - shows uploaded/created content before quiz
  const renderContentPreview = () => (
    <Box p={3}>
      <Box mb={4}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <IconButton 
            onClick={() => setShowContentPreview(false)}
            sx={{ color: '#666' }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
          Content Preview
        </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Review your content before creating the questionnaire
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Card sx={{ p: 3 }}>
            {/* AI Generated Content */}
            {aiContentGenerated && (
              <Box mb={3}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  AI Generated Content
                </Typography>
                <Box p={2} sx={{ backgroundColor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    Content generated based on keywords: <strong>{aiKeywords}</strong>
                  </Typography>
                  <Chip 
                    label="AI Generated" 
                    color="warning" 
                    size="small" 
                    sx={{ mt: 1 }}
                    icon={<FireIcon />}
                  />
                </Box>
              </Box>
            )}

            {/* Creation Mode Content */}
            {selectedCreationMode && (
              <Box mb={3}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Created Content
                </Typography>
                <Box p={2} sx={{ backgroundColor: '#f8fafc', borderRadius: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    {selectedCreationMode === 'powerpoint' ? 'PowerPoint Presentation' : 
                     selectedCreationMode === 'word' ? 'Word Document' : 
                     'Training Video'} created successfully
                  </Typography>
                  <Chip 
                    label={selectedCreationMode === 'powerpoint' ? 'PowerPoint' : selectedCreationMode === 'word' ? 'Word Document' : 'Video'} 
                    color="primary" 
                    size="small" 
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Box>
            )}

            {/* Uploaded Files */}
            {selectedFiles.length > 0 && (
              <Box mb={3}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Uploaded Files ({selectedFiles.length})
                </Typography>
                {selectedFiles.map((file, index) => (
                  <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={2} p={2} sx={{ backgroundColor: '#f8fafc', borderRadius: 1 }}>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(file.size)}
                      </Typography>
                    </Box>
                    <Chip label="Uploaded" color="success" size="small" />
                  </Box>
                ))}
              </Box>
            )}

            {/* Proceed to Quiz Button */}
            <Box mt={4}>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleProceedToQuiz}
                startIcon={<QuizIcon />}
                sx={{
                  backgroundColor: '#3b82f6',
                  '&:hover': { backgroundColor: '#2563eb' }
                }}
              >
                Create Questionnaire (Checkpoint Assessment)
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const handleOpenScheduleDialog = (session) => {
    if (session) {
      // Direct scheduling flow
      setSelectedSessionForScheduling(session);
      setShowScheduleDialog(true);
      setScheduleDate('');
      setScheduleTime('');
      setShowCalendar(true);
    } else {
      // Open session selection view
      setShowScheduleDialog(true);
      setSelectedSessionForScheduling(null);
      setScheduleDate('');
      setScheduleTime('');
      setShowCalendar(false);
    }
  };

  const handleConfirmSchedule = () => {
    if (!scheduleDate || !scheduleTime) {
      alert('Please select both date and time');
      return;
    }
    setShowCalendar(false);
  };

  const handleSendAndPublish = () => {
    if (!scheduleDate || !scheduleTime) {
      alert('Please select both date and time');
      return;
    }

    const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    
    // Update published session with scheduled date/time
    const updatedSession = {
      ...selectedSessionForScheduling,
      scheduledDate: scheduleDate,
      scheduledTime: scheduleTime,
      scheduledDateTime: scheduledDateTime.toISOString(),
      status: 'scheduled'
    };

    setPublishedSessions(prev => {
      const updated = prev.map(s => s.id === updatedSession.id ? updatedSession : s);
      localStorage.setItem('published_sessions', JSON.stringify(updated));
      return updated;
    });

    // Simulate Google Calendar integration - block calendar for all employees
    const employeeEmails = employees.map(emp => emp.email || `${emp.employeeId}@company.com`);
    
    // Simulate sending calendar invites and notifications
    employeeEmails.forEach(email => {
      // In real app, this would call Google Calendar API
      console.log(`Blocking calendar for ${email} at ${scheduledDateTime}`);
      console.log(`Sending notification to ${email}: "A new session has been started. Click here to complete the session."`);
    });

    // Log activity
    addActivity(
      `Session scheduled: ${selectedSessionForScheduling.title}`,
      'Admin',
      'scheduled',
      'session_scheduled'
    );

    setShowScheduleDialog(false);
    setSelectedSessionForScheduling(null);
    setScheduleDate('');
    setScheduleTime('');
    setShowCalendar(false);
    
    alert(`Session scheduled successfully! Calendar invites sent to ${employeeEmails.length} employees.`);
  };

  const renderScheduleSessions = () => {
    // Show schedule dialog if open (either for session selection or calendar view)
    if (showScheduleDialog) {
      return renderScheduleDialog();
    }

    return (
      <Box p={3} sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Schedule
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and schedule your training sessions
          </Typography>
        </Box>

        {/* Schedule Sessions Content */}
        <Box>
          {/* Search and View Toggle */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <TextField
                placeholder="Search sessions..."
                value={scheduleSessionsSearchTerm}
                onChange={(e) => setScheduleSessionsSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 400 }}
              />
              <Box display="flex" gap={1}>
                <IconButton
                  onClick={() => setScheduleSessionsViewMode('grid')}
                  sx={{
                    backgroundColor: scheduleSessionsViewMode === 'grid' ? '#3b82f6' : 'transparent',
                    color: scheduleSessionsViewMode === 'grid' ? 'white' : '#666',
                    border: '1px solid #e5e7eb',
                    '&:hover': {
                      backgroundColor: scheduleSessionsViewMode === 'grid' ? '#2563eb' : '#f3f4f6'
                    }
                  }}
                >
                  <GridViewIcon />
                </IconButton>
                <IconButton
                  onClick={() => setScheduleSessionsViewMode('list')}
                  sx={{
                    backgroundColor: scheduleSessionsViewMode === 'list' ? '#3b82f6' : 'transparent',
                    color: scheduleSessionsViewMode === 'list' ? 'white' : '#666',
                    border: '1px solid #e5e7eb',
                    '&:hover': {
                      backgroundColor: scheduleSessionsViewMode === 'list' ? '#2563eb' : '#f3f4f6'
                    }
                  }}
                >
                  <ListViewIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Sessions List */}
            {publishedSessions.length === 0 ? (
              <Box textAlign="center" py={8}>
                <EventIcon sx={{ fontSize: 64, color: '#d1d5db', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No published sessions available
                </Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Publish a session first to schedule it
                </Typography>
              </Box>
            ) : (
              <>
                {(() => {
                  const filteredSessions = publishedSessions.filter(session => {
                    const title = session.title || 'Untitled Session';
                    return title.toLowerCase().includes(scheduleSessionsSearchTerm.toLowerCase());
                  });

                  return scheduleSessionsViewMode === 'list' ? (
                    <Box>
                      {filteredSessions.map((session) => {
                        const isScheduled = session.scheduledDateTime || session.status === 'scheduled';
                        return (
                          <Card key={session.id} sx={{ mb: 2, p: 2, '&:hover': { boxShadow: 2 } }}>
                            <Box display="flex" alignItems="center" gap={3}>
                              {/* Thumbnail */}
                              <Box
                                sx={{
                                  width: 80,
                                  height: 80,
                                  borderRadius: 2,
                                  backgroundColor: '#f3f4f6',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 40
                                }}
                              >
                                📅
                              </Box>

                              {/* Session Info */}
                              <Box flex={1}>
                                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                                  <Typography variant="h6" fontWeight="bold">
                                    {session.title || 'Untitled Session'}
                                  </Typography>
                                  {isScheduled && (
                                    <Chip
                                      label="Session scheduled"
                                      size="small"
                                      sx={{
                                        backgroundColor: '#10b981',
                                        color: 'white',
                                        fontWeight: 'medium',
                                        fontSize: '0.7rem'
                                      }}
                                    />
                                  )}
                                  {!isScheduled && (
                                    <Chip
                                      label="Published"
                                      size="small"
                                      sx={{
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        fontWeight: 'medium',
                                        fontSize: '0.7rem'
                                      }}
                                    />
                                  )}
                                </Box>
                                <Typography variant="body2" color="text.secondary" mb={1}>
                                  {session.description || 'No description'}
                                </Typography>
                                {isScheduled && session.scheduledDateTime && (
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <CalendarIcon sx={{ fontSize: 16, color: '#10b981' }} />
                                    <Typography variant="body2" color="#10b981" fontWeight="medium">
                                      Scheduled: {new Date(session.scheduledDateTime).toLocaleString()}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>

                              {/* Action Button */}
                              <Button
                                variant="contained"
                                startIcon={<CalendarIcon />}
                                onClick={() => handleOpenScheduleDialog(session)}
                                sx={{
                                  backgroundColor: isScheduled ? '#10b981' : '#3b82f6',
                                  '&:hover': { 
                                    backgroundColor: isScheduled ? '#059669' : '#2563eb' 
                                  }
                                }}
                              >
                                {isScheduled ? 'Reschedule' : 'Schedule Session'}
                              </Button>
                            </Box>
                          </Card>
                        );
                      })}
                    </Box>
                  ) : (
                    <Grid container spacing={3}>
                      {filteredSessions.map((session) => {
                        const isScheduled = session.scheduledDateTime || session.status === 'scheduled';
                        return (
                          <Grid item xs={12} sm={6} md={4} key={session.id}>
                            <Card sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                              <Box
                                sx={{
                                  width: '100%',
                                  height: 160,
                                  borderRadius: 2,
                                  backgroundColor: '#f3f4f6',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 64,
                                  mb: 2
                                }}
                              >
                                📅
                              </Box>
                              <Box flex={1}>
                                <Box display="flex" alignItems="center" gap={1} mb={1} flexWrap="wrap">
                                  <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
                                    {session.title || 'Untitled Session'}
                                  </Typography>
                                </Box>
                                {isScheduled ? (
                                  <Chip
                                    label="Session scheduled"
                                    size="small"
                                    sx={{
                                      backgroundColor: '#10b981',
                                      color: 'white',
                                      fontWeight: 'medium',
                                      fontSize: '0.7rem',
                                      mb: 1
                                    }}
                                  />
                                ) : (
                                  <Chip
                                    label="Published"
                                    size="small"
                                    sx={{
                                      backgroundColor: '#3b82f6',
                                      color: 'white',
                                      fontWeight: 'medium',
                                      fontSize: '0.7rem',
                                      mb: 1
                                    }}
                                  />
                                )}
                                <Typography variant="body2" color="text.secondary" mb={1}>
                                  {session.description || 'No description'}
                                </Typography>
                                {isScheduled && session.scheduledDateTime && (
                                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    <CalendarIcon sx={{ fontSize: 16, color: '#10b981' }} />
                                    <Typography variant="body2" color="#10b981" fontWeight="medium" fontSize="0.75rem">
                                      {new Date(session.scheduledDateTime).toLocaleString()}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                              <Button
                                variant="contained"
                                fullWidth
                                startIcon={<CalendarIcon />}
                                onClick={() => handleOpenScheduleDialog(session)}
                                sx={{
                                  backgroundColor: isScheduled ? '#10b981' : '#3b82f6',
                                  '&:hover': { 
                                    backgroundColor: isScheduled ? '#059669' : '#2563eb' 
                                  },
                                  mt: 1
                                }}
                              >
                                {isScheduled ? 'Reschedule' : 'Schedule Session'}
                              </Button>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  );
                })()}
              </>
            )}
        </Box>
      </Box>
    );
  };

  const renderScheduleDialog = () => {
    // If no session selected and calendar not showing, show session selection view
    if (!selectedSessionForScheduling && !showCalendar) {
      // Show Course Library-style view of published sessions
      const filteredSessions = publishedSessions.filter(session => {
        const title = session.title || 'Untitled Session';
        return title.toLowerCase().includes(scheduleSessionsSearchTerm.toLowerCase());
      });

      return (
        <Box p={3} sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
          {/* Header */}
          <Box mb={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Schedule Session
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Select a published session to schedule
                </Typography>
              </Box>
              <IconButton onClick={() => {
                setShowScheduleDialog(false);
                setSelectedSessionForScheduling(null);
                setScheduleDate('');
                setScheduleTime('');
                setShowCalendar(false);
              }}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Search and View Toggle */}
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
              <TextField
                placeholder="Search sessions..."
                value={scheduleSessionsSearchTerm}
                onChange={(e) => setScheduleSessionsSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 400 }}
              />
              <Box display="flex" gap={1}>
                <IconButton
                  onClick={() => setScheduleSessionsViewMode('grid')}
                  sx={{
                    backgroundColor: scheduleSessionsViewMode === 'grid' ? '#3b82f6' : 'transparent',
                    color: scheduleSessionsViewMode === 'grid' ? 'white' : '#666',
                    border: '1px solid #e5e7eb',
                    '&:hover': {
                      backgroundColor: scheduleSessionsViewMode === 'grid' ? '#2563eb' : '#f3f4f6'
                    }
                  }}
                >
                  <GridViewIcon />
                </IconButton>
                <IconButton
                  onClick={() => setScheduleSessionsViewMode('list')}
                  sx={{
                    backgroundColor: scheduleSessionsViewMode === 'list' ? '#3b82f6' : 'transparent',
                    color: scheduleSessionsViewMode === 'list' ? 'white' : '#666',
                    border: '1px solid #e5e7eb',
                    '&:hover': {
                      backgroundColor: scheduleSessionsViewMode === 'list' ? '#2563eb' : '#f3f4f6'
                    }
                  }}
                >
                  <ListViewIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Sessions List */}
          {filteredSessions.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" color="text.secondary">
                No sessions found
              </Typography>
            </Box>
          ) : scheduleSessionsViewMode === 'list' ? (
            <Box>
              {filteredSessions.map((session) => (
                <Card key={session.id} sx={{ mb: 2, p: 2, '&:hover': { boxShadow: 2 } }}>
                  <Box display="flex" alignItems="center" gap={3}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 40
                      }}
                    >
                      📅
                    </Box>
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Typography variant="h6" fontWeight="bold">
                          {session.title || 'Untitled Session'}
                        </Typography>
                        <Chip
                          label="Published"
                          size="small"
                          sx={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            fontWeight: 'medium',
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {session.description || 'No description'}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<CalendarIcon />}
                      onClick={() => {
                        setSelectedSessionForScheduling(session);
                        setShowCalendar(true);
                      }}
                      sx={{
                        backgroundColor: '#3b82f6',
                        '&:hover': { backgroundColor: '#2563eb' }
                      }}
                    >
                      Schedule Session
                    </Button>
                  </Box>
                </Card>
              ))}
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredSessions.map((session) => (
                <Grid item xs={12} sm={6} md={4} key={session.id}>
                  <Card sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: 160,
                        borderRadius: 2,
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 64,
                        mb: 2
                      }}
                    >
                      📅
                    </Box>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight="bold" mb={1}>
                        {session.title || 'Untitled Session'}
                      </Typography>
                      <Chip
                        label="Published"
                        size="small"
                        sx={{
                          backgroundColor: '#3b82f6',
                          color: 'white',
                          fontWeight: 'medium',
                          fontSize: '0.7rem',
                          mb: 1
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {session.description || 'No description'}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<CalendarIcon />}
                      onClick={() => {
                        setSelectedSessionForScheduling(session);
                        setShowCalendar(true);
                      }}
                      sx={{
                        backgroundColor: '#3b82f6',
                        '&:hover': { backgroundColor: '#2563eb' },
                        mt: 1
                      }}
                    >
                      Schedule Session
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      );
    }

    if (!selectedSessionForScheduling) return null;

    return (
      <Box p={3}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Schedule Session
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {selectedSessionForScheduling.title || 'Untitled Session'}
            </Typography>
          </Box>
          <IconButton onClick={() => {
            setShowScheduleDialog(false);
            setSelectedSessionForScheduling(null);
            setScheduleDate('');
            setScheduleTime('');
            setShowCalendar(false);
          }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {showCalendar ? (
          <Card sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Select Date and Time
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Select Date"
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TodayIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Select Time"
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {scheduleDate && scheduleTime && (
              <Box mt={3} p={2} sx={{ backgroundColor: '#f0f9ff', borderRadius: 2 }}>
                <Typography variant="body2" fontWeight="medium" gutterBottom>
                  Selected Schedule:
                </Typography>
                <Typography variant="h6" color="#3b82f6">
                  {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString()}
                </Typography>
              </Box>
            )}

            <Box display="flex" justifyContent="flex-end" gap={2} mt={4}>
              <Button
                variant="outlined"
                onClick={() => {
                  setShowScheduleDialog(false);
                  setSelectedSessionForScheduling(null);
                  setScheduleDate('');
                  setScheduleTime('');
                  setShowCalendar(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmSchedule}
                disabled={!scheduleDate || !scheduleTime}
                sx={{
                  backgroundColor: '#3b82f6',
                  '&:hover': { backgroundColor: '#2563eb' }
                }}
              >
                Confirm Date & Time
              </Button>
            </Box>
          </Card>
        ) : (
          <Card sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Confirm and Send Invites
            </Typography>

            {/* Session Details */}
            <Box mb={4}>
              <Typography variant="body1" fontWeight="medium" mb={2}>
                Session Details:
              </Typography>
              <Card sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Title:</strong> {selectedSessionForScheduling.title || 'Untitled Session'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Description:</strong> {selectedSessionForScheduling.description || 'No description'}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mt={2}>
                  <CalendarIcon sx={{ color: '#10b981' }} />
                  <Typography variant="body1" fontWeight="bold" color="#10b981">
                    Scheduled for: {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString()}
                  </Typography>
                </Box>
              </Card>
            </Box>

            {/* Employee List */}
            <Box mb={4}>
              <Typography variant="body1" fontWeight="medium" mb={2}>
                Employees to Invite ({employees.length}):
              </Typography>
              <Card sx={{ p: 2, maxHeight: 200, overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                <List dense>
                  {employees.map((employee) => (
                    <ListItem key={employee.id} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <PeopleIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={employee.name}
                        secondary={employee.email || `${employee.employeeId}@company.com`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Card>
            </Box>

            {/* Integration Info */}
            <Box mb={4} p={2} sx={{ backgroundColor: '#e0f2fe', borderRadius: 2, border: '1px solid #3b82f6' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Google Calendar Integration:</strong> This will automatically block the selected time in each employee's Google Calendar and send them a notification.
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box display="flex" justifyContent="space-between" gap={2}>
              <Button
                variant="outlined"
                onClick={() => setShowCalendar(true)}
              >
                Change Date & Time
              </Button>
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handleSendAndPublish}
                sx={{
                  backgroundColor: '#10b981',
                  '&:hover': { backgroundColor: '#059669' }
                }}
              >
                Send & Publish
              </Button>
            </Box>
          </Card>
        )}
      </Box>
    );
  };

  // Render session detail view
  const renderSessionDetail = (session) => {
    if (!selectedAllSessionItem) return null;

    const isDraft = selectedAllSessionItem.folderType === 'drafts';
    const isAssessment = selectedAllSessionItem.folderType === 'assessments';
    const isPublished = selectedAllSessionItem.folderType === 'published';

    return (
      <Box p={3}>
        <Box mb={3} display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => { setSelectedAllSessionItem(null); setViewMode(null); }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            {selectedAllSessionItem.title || 'Untitled Session'}
          </Typography>
        </Box>

        <Card sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>Title</Typography>
              <Typography variant="h6" mb={2}>{selectedAllSessionItem.title || 'Untitled Session'}</Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>Description</Typography>
              <Typography variant="body1" mb={2}>{selectedAllSessionItem.description || 'No description'}</Typography>
              
              {selectedAllSessionItem.type && (
                <>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Type</Typography>
                  <Chip label={selectedAllSessionItem.type} sx={{ mb: 2 }} />
                </>
              )}
              
              {selectedAllSessionItem.audience && (
                <>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Audience</Typography>
                  <Chip label={selectedAllSessionItem.audience} sx={{ mb: 2 }} />
                </>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              {selectedAllSessionItem.files && selectedAllSessionItem.files.length > 0 && (
                <Box mb={3}>
                  <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="bold">
                    Uploaded Files ({selectedAllSessionItem.files.length})
                  </Typography>
                  {selectedAllSessionItem.files.map((file, idx) => {
                    const fileObj = typeof file === 'string' ? { name: file } : file;
                    const fileName = fileObj.name || file || 'Unknown file';
                    const fileSize = fileObj.size ? formatFileSize(fileObj.size) : '';
                    
                    return (
                      <Card key={idx} sx={{ mb: 2, p: 2, backgroundColor: '#f8fafc' }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center" gap={1} flex={1}>
                            <FileIcon sx={{ color: '#666' }} />
                            <Box>
                              <Typography variant="body2" fontWeight="medium">{fileName}</Typography>
                              {fileSize && (
                                <Typography variant="caption" color="text.secondary">{fileSize}</Typography>
                              )}
                            </Box>
                          </Box>
                          <Box display="flex" gap={1}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                if (fileObj.fileObject) {
                                  handleFileView(fileObj);
                                } else {
                                  alert('File preview not available. The file may need to be re-uploaded.');
                                }
                              }}
                            >
                              Preview
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<DownloadIcon />}
                              onClick={() => {
                                if (fileObj.fileObject) {
                                  handleFileDownload(fileObj);
                                } else {
                                  alert('File download not available. The file may need to be re-uploaded.');
                                }
                              }}
                            >
                              Download
                            </Button>
                          </Box>
                        </Box>
                      </Card>
                    );
                  })}
                </Box>
              )}

              {selectedAllSessionItem.quiz && (
                <Box mb={3}>
                  <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="bold">
                    Quiz/Assessment Info
                  </Typography>
                  <Chip label={`${selectedAllSessionItem.quiz.questions?.length || 0} questions`} sx={{ mb: 1 }} />
                </Box>
              )}

              {isAssessment && selectedAllSessionItem.assessmentInfo && (
                <Box mb={3}>
                  <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="bold">
                    Assessment Settings
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2">Quiz Title: {selectedAllSessionItem.assessmentInfo.quizTitle || 'N/A'}</Typography>
                    <Typography variant="body2">Passing Score: {selectedAllSessionItem.assessmentInfo.passingScore || 'N/A'}%</Typography>
                    <Typography variant="body2">Max Attempts: {selectedAllSessionItem.assessmentInfo.maxAttempts || 'N/A'}</Typography>
                  </Box>
                </Box>
              )}

              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>{isPublished ? 'Published' : 'Saved'}:</strong> {new Date(selectedAllSessionItem.publishedAt || selectedAllSessionItem.savedAt).toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </Card>

        {/* File Preview Section */}
        {selectedAllSessionItem.files && selectedAllSessionItem.files.length > 0 && (
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              File Preview
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Click Preview on any file above to view it in a new window
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              {selectedAllSessionItem.files.map((file, idx) => {
                const fileObj = typeof file === 'string' ? { name: file } : file;
                return (
                  <Card key={idx} sx={{ p: 2, minWidth: 150, textAlign: 'center' }}>
                    <FileIcon sx={{ fontSize: 48, color: '#3b82f6', mb: 1 }} />
                    <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                      {fileObj.name || file || 'Unknown'}
                    </Typography>
                  </Card>
                );
              })}
            </Box>
          </Card>
        )}

        {/* Complete Questionnaire/Quiz Preview */}
        {(selectedAllSessionItem.quiz?.questions || selectedAllSessionItem.questions) && (
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Complete Questionnaire
            </Typography>
            
            {isAssessment && selectedAllSessionItem.assessmentInfo && (
              <Box mb={3} p={2} sx={{ backgroundColor: '#eff6ff', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  Assessment Title: {selectedAllSessionItem.assessmentInfo.quizTitle || selectedAllSessionItem.title || 'Untitled Assessment'}
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap" mt={1}>
                  <Chip 
                    label={`Passing Score: ${selectedAllSessionItem.assessmentInfo.passingScore || 'N/A'}%`} 
                    size="small" 
                    color="primary"
                  />
                  <Chip 
                    label={`Max Attempts: ${selectedAllSessionItem.assessmentInfo.maxAttempts || 'N/A'}`} 
                    size="small" 
                    color="secondary"
                  />
                  {(selectedAllSessionItem.quiz?.questions || selectedAllSessionItem.questions) && (
                    <Chip 
                      label={`${(selectedAllSessionItem.quiz?.questions || selectedAllSessionItem.questions).length} Questions`} 
                      size="small" 
                      color="success"
                    />
                  )}
                </Box>
              </Box>
            )}

            <Box>
              {(selectedAllSessionItem.quiz?.questions || selectedAllSessionItem.questions || []).map((question, index) => (
                <Card key={index} sx={{ mb: 3, p: 3, border: '1px solid #e5e7eb' }}>
                  <Box display="flex" alignItems="start" gap={2} mb={2}>
                    <Box
                      sx={{
                        minWidth: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold'
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight="medium" gutterBottom>
                        {question.text || question.question || 'Untitled Question'}
                      </Typography>
                      <Chip 
                        label={question.type || 'multiple-choice'} 
                        size="small" 
                        sx={{ mt: 1 }}
                        color="secondary"
                      />
                      {question.required && (
                        <Chip 
                          label="Required" 
                          size="small" 
                          color="error"
                          sx={{ ml: 1, mt: 1 }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Options/Answers */}
                  {question.options && question.options.length > 0 && (
                    <Box mt={2}>
                      <Typography variant="body2" color="text.secondary" gutterBottom fontWeight="medium">
                        Options:
                      </Typography>
                      <Box component="ul" sx={{ pl: 3, mt: 1 }}>
                        {question.options.map((option, optIdx) => (
                          <Box component="li" key={optIdx} sx={{ mb: 1 }}>
                            <Typography variant="body2">
                              {typeof option === 'string' ? option : option.text || option.label || option}
                              {question.correctAnswer !== undefined && question.correctAnswer === optIdx && (
                                <Chip 
                                  label="Correct" 
                                  size="small" 
                                  color="success" 
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Correct Answer if specified */}
                  {question.correctAnswer !== undefined && question.type !== 'multiple-choice' && (
                    <Box mt={2} p={2} sx={{ backgroundColor: '#f0fdf4', borderRadius: 1 }}>
                      <Typography variant="body2" fontWeight="medium" color="#10b981">
                        Correct Answer: {question.correctAnswer}
                      </Typography>
                    </Box>
                  )}

                  {/* Additional question details */}
                  {question.explanation && (
                    <Box mt={2} p={2} sx={{ backgroundColor: '#fffbeb', borderRadius: 1 }}>
                      <Typography variant="body2" fontWeight="medium" gutterBottom>
                        Explanation:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {question.explanation}
                      </Typography>
                    </Box>
                  )}
                </Card>
              ))}
            </Box>

            {(selectedAllSessionItem.quiz?.questions || selectedAllSessionItem.questions || []).length === 0 && (
              <Box textAlign="center" py={4}>
                <QuizIcon sx={{ fontSize: 64, color: '#d1d5db', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No questions in this questionnaire
                </Typography>
              </Box>
            )}
          </Card>
        )}

        <Box display="flex" gap={2} justifyContent="flex-end">
          {viewMode === 'preview' && (
            <>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setViewMode('edit')}
              >
                Edit
              </Button>
              {!isPublished && (
                <Button
                  variant="contained"
                  startIcon={<PublishIcon />}
                  onClick={() => handleProceedToPublish(selectedAllSessionItem)}
                  sx={{ backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669' } }}
                >
                  Proceed to Publish
                </Button>
              )}
            </>
          )}
          {viewMode === 'edit' && (
            <>
              <Button
                variant="outlined"
                onClick={() => setViewMode('preview')}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() => {
                  alert('Session updated successfully!');
                  setViewMode('preview');
                }}
              >
                Save Changes
              </Button>
            </>
          )}
        </Box>
      </Box>
    );
  };

  // Render folder contents
  const renderFolderContents = (folderType) => {
    let items = [];
    let emptyMessage = '';
    let emptyIcon = <FolderIcon />;

    if (folderType === 'drafts') {
      items = draftSessions;
      emptyMessage = 'No draft sessions yet';
      emptyIcon = <EditIcon />;
    } else if (folderType === 'assessments') {
      items = savedAssessments;
      emptyMessage = 'No saved assessments yet';
      emptyIcon = <SaveIcon />;
    } else if (folderType === 'published') {
      items = publishedSessions;
      emptyMessage = 'No sessions ready to publish';
      emptyIcon = <CheckCircleIcon />;
    }

    return (
      <Box p={3}>
        <Box mb={3} display="flex" alignItems="center" gap={2}>
          <IconButton onClick={handleCloseFolder}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            {folderType === 'drafts' ? 'Draft Sessions' : 
             folderType === 'assessments' ? 'Saved Assessments' : 
             'Ready to Publish'}
          </Typography>
        </Box>

        {items.length === 0 ? (
          <Box textAlign="center" py={8}>
            {emptyIcon}
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              {emptyMessage}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {items.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item.id}>
                <Card 
                  sx={{ 
                    p: 2, 
                    cursor: 'pointer',
                    '&:hover': { boxShadow: 4 }
                  }}
                >
                  <Box display="flex" alignItems="flex-start" gap={1} mb={1}>
                    <FileIcon sx={{ color: '#666', mt: 0.5 }} />
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {item.title || 'Untitled'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, minHeight: 40 }}>
                        {(item.description || 'No description').substring(0, 60)}...
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(item.savedAt || item.publishedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewSession(item, folderType)}
                      sx={{ flex: 1, minWidth: '80px' }}
                    >
                      Preview
                    </Button>
                    {folderType !== 'published' && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleEditSession(item, folderType)}
                        sx={{ flex: 1, minWidth: '80px' }}
                      >
                        Edit
                      </Button>
                    )}
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        if (folderType === 'drafts') handleDeleteDraftSession(item.id);
                        else if (folderType === 'assessments') handleDeleteAssessment(item.id);
                        else handleDeletePublishedSession(item.id);
                      }}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  };

  const handleProceedToPublish = (session) => {
    setSessionToPublish(session);
    setPublishCourseData({
      courseImage: null,
      courseTitle: session.title || session.assessmentInfo?.quizTitle || 'Untitled Session',
      description: session.description || session.assessmentInfo?.description || '',
      skills: []
    });
    setShowPublishDialog(true);
  };

  const handlePublishNow = () => {
    if (!publishCourseData.courseTitle) {
      alert('Please enter a course title');
      return;
    }

    const publishedSession = {
      ...sessionToPublish,
      title: publishCourseData.courseTitle,
      description: publishCourseData.description,
      skills: publishCourseData.skills,
      courseImage: publishCourseData.courseImage,
      status: 'published',
      publishedAt: new Date().toISOString()
    };

    // Move from draft/assessment to published
    if (sessionToPublish.status === 'draft' || !sessionToPublish.status) {
      setDraftSessions(prev => prev.filter(s => s.id !== sessionToPublish.id));
    } else if (sessionToPublish.status === 'saved') {
      setSavedAssessments(prev => prev.filter(s => s.id !== sessionToPublish.id));
    }

    setPublishedSessions(prev => [publishedSession, ...prev]);
    
    // Log activity
    addActivity(
      `Session published: ${publishCourseData.courseTitle}`,
      'Admin',
      'published',
      'session_published'
    );
    
    setShowPublishDialog(false);
    setSessionToPublish(null);
    
    // Navigate to Schedule module
    setActiveTab('schedule');
    setSelectedSessionForScheduling(publishedSession);
    
    alert('Course published successfully! Please schedule the session.');
  };

  const handleSaveForLater = () => {
    // Update the session with publish data but keep as draft/saved
    if (sessionToPublish.status === 'draft' || !sessionToPublish.status) {
      setDraftSessions(prev => prev.map(s => 
        s.id === sessionToPublish.id 
          ? { ...s, ...publishCourseData }
          : s
      ));
    } else if (sessionToPublish.status === 'saved') {
      setSavedAssessments(prev => prev.map(s => 
        s.id === sessionToPublish.id 
          ? { ...s, ...publishCourseData }
          : s
      ));
    }
    
    setShowPublishDialog(false);
    setSessionToPublish(null);
    alert('Changes saved for later');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5 MB');
        return;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        alert('Please upload JPG, JPEG, or PNG format');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPublishCourseData(prev => ({ ...prev, courseImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getAllSessionsForManage = () => {
    const allSessions = [];
    
    // Add draft sessions
    draftSessions.forEach(session => {
      allSessions.push({
        ...session,
        status: 'Draft',
        type: 'draft'
      });
    });
    
    // Add saved assessments
    savedAssessments.forEach(assessment => {
      allSessions.push({
        ...assessment,
        status: 'Saved Assessment',
        type: 'saved'
      });
    });
    
    return allSessions;
  };

  const renderAllSessions = () => {
    // Show publish dialog if open
    if (showPublishDialog && sessionToPublish) {
      return renderPublishDialog();
    }

    // Show session detail if one is selected
    if (selectedAllSessionItem) {
      return renderSessionDetail(selectedAllSessionItem);
    }

    const allSessions = getAllSessionsForManage();

    const filteredSessions = allSessions.filter(session => {
      const title = session.title || session.assessmentInfo?.quizTitle || '';
      return title.toLowerCase().includes(manageSessionsSearchTerm.toLowerCase());
    });

    return (
      <Box p={3} sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
        {/* Header */}
        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Manage Sessions
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View and manage all your draft and saved sessions
              </Typography>
            </Box>
          </Box>

          {/* Search and View Toggle */}
          <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
            <TextField
              placeholder="Search sessions..."
              value={manageSessionsSearchTerm}
              onChange={(e) => setManageSessionsSearchTerm(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 400 }}
            />
            <Box display="flex" gap={1}>
              <IconButton
                onClick={() => setManageSessionsViewMode('grid')}
                sx={{
                  backgroundColor: manageSessionsViewMode === 'grid' ? '#3b82f6' : 'transparent',
                  color: manageSessionsViewMode === 'grid' ? 'white' : '#666',
                  border: '1px solid #e5e7eb',
                  '&:hover': {
                    backgroundColor: manageSessionsViewMode === 'grid' ? '#2563eb' : '#f3f4f6'
                  }
                }}
              >
                <GridViewIcon />
              </IconButton>
              <IconButton
                onClick={() => setManageSessionsViewMode('list')}
                sx={{
                  backgroundColor: manageSessionsViewMode === 'list' ? '#3b82f6' : 'transparent',
                  color: manageSessionsViewMode === 'list' ? 'white' : '#666',
                  border: '1px solid #e5e7eb',
                  '&:hover': {
                    backgroundColor: manageSessionsViewMode === 'list' ? '#2563eb' : '#f3f4f6'
                  }
                }}
              >
                <ListViewIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Sessions List */}
        {filteredSessions.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              No sessions found
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              {manageSessionsSearchTerm ? 'Try adjusting your search' : 'Create a new session to get started'}
            </Typography>
          </Box>
        ) : manageSessionsViewMode === 'list' ? (
          <Box>
            {filteredSessions.map((session) => {
              const sessionTitle = session.title || session.assessmentInfo?.quizTitle || 'Untitled Session';
              const questionCount = session.quiz?.questions?.length || session.questions?.length || 0;
              
              return (
                <Card key={session.id} sx={{ mb: 2, p: 2, '&:hover': { boxShadow: 2 } }}>
                  <Box display="flex" alignItems="center" gap={3}>
                    {/* Thumbnail */}
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 40
                      }}
                    >
                      {session.type === 'draft' ? '📝' : '📚'}
                    </Box>

                    {/* Session Info */}
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Typography variant="h6" fontWeight="bold">
                          {sessionTitle}
                        </Typography>
                        <Chip
                          label={session.status}
                          size="small"
                          sx={{
                            backgroundColor: session.status === 'Draft' ? '#f59e0b' : '#3b82f6',
                            color: 'white',
                            fontWeight: 'medium',
                            fontSize: '0.7rem'
                          }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {questionCount} {questionCount === 1 ? 'question' : 'questions'} | {session.type === 'draft' ? 'Draft' : 'Saved Assessment'}
                      </Typography>
                    </Box>

                    {/* Action Buttons */}
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => setSelectedAllSessionItem(session)}
                        sx={{ border: '1px solid #e5e7eb' }}
                        title="Preview"
                      >
                        <PreviewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedAllSessionItem(session);
                          setViewMode('edit');
                        }}
                        sx={{ border: '1px solid #e5e7eb' }}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenCertifications(session)}
                        sx={{ 
                          border: '1px solid #e5e7eb', 
                          color: hasCertification(session.id) ? '#10b981' : '#8b5cf6',
                          backgroundColor: hasCertification(session.id) ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                        }}
                        title={hasCertification(session.id) ? "Certification Attached" : "Certification"}
                      >
                        <CertificateIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (session.type === 'draft') {
                            if (window.confirm('Are you sure you want to delete this draft session?')) {
                              handleDeleteDraftSession(session.id);
                            }
                          } else {
                            if (window.confirm('Are you sure you want to delete this assessment?')) {
                              handleDeleteAssessment(session.id);
                            }
                          }
                        }}
                        sx={{ border: '1px solid #e5e7eb', color: '#ef4444' }}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleProceedToPublish(session)}
                        sx={{
                          backgroundColor: '#8b5cf6',
                          '&:hover': { backgroundColor: '#7c3aed' }
                        }}
                      >
                        Proceed to Publish
                      </Button>
                    </Box>
                  </Box>
                </Card>
              );
            })}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredSessions.map((session) => {
              const sessionTitle = session.title || session.assessmentInfo?.quizTitle || 'Untitled Session';
              const questionCount = session.quiz?.questions?.length || session.questions?.length || 0;
              
              return (
                <Grid item xs={12} sm={6} md={4} key={session.id}>
                  <Card sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: 160,
                        borderRadius: 2,
                        backgroundColor: '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 64,
                        mb: 2
                      }}
                    >
                      {session.type === 'draft' ? '📝' : '📚'}
                    </Box>
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
                          {sessionTitle}
                        </Typography>
                      </Box>
                      <Chip
                        label={session.status}
                        size="small"
                        sx={{
                          backgroundColor: session.status === 'Draft' ? '#f59e0b' : '#3b82f6',
                          color: 'white',
                          fontWeight: 'medium',
                          fontSize: '0.7rem',
                          mb: 1
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {questionCount} {questionCount === 1 ? 'question' : 'questions'}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <IconButton
                        size="small"
                        onClick={() => setSelectedAllSessionItem(session)}
                        title="Preview"
                      >
                        <PreviewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedAllSessionItem(session);
                          setViewMode('edit');
                        }}
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenCertifications(session)}
                        title={hasCertification(session.id) ? "Certification Attached" : "Certification"}
                        sx={{ 
                          color: hasCertification(session.id) ? '#10b981' : '#8b5cf6',
                          backgroundColor: hasCertification(session.id) ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                        }}
                      >
                        <CertificateIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => {
                          if (session.type === 'draft') {
                            if (window.confirm('Are you sure you want to delete this draft session?')) {
                              handleDeleteDraftSession(session.id);
                            }
                          } else {
                            if (window.confirm('Are you sure you want to delete this assessment?')) {
                              handleDeleteAssessment(session.id);
                            }
                          }
                        }}
                        sx={{ color: '#ef4444' }}
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                      <Button
                        variant="contained"
                        size="small"
                        fullWidth
                        onClick={() => handleProceedToPublish(session)}
                        sx={{
                          backgroundColor: '#8b5cf6',
                          '&:hover': { backgroundColor: '#7c3aed' },
                          mt: 1
                        }}
                      >
                        Proceed to Publish
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* Saved Certifications Dialog */}
        <Dialog
          open={showSavedCertifications}
          onClose={() => {
            setShowSavedCertifications(false);
            setSelectedSessionForCertification(null);
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1}>
                <CertificateIcon sx={{ color: '#8b5cf6' }} />
                <Typography variant="h6" fontWeight="bold">
                  Select Certification
                </Typography>
              </Box>
              <IconButton
                onClick={() => {
                  setShowSavedCertifications(false);
                  setSelectedSessionForCertification(null);
                }}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            </Box>
            {selectedSessionForCertification && (
              <Typography variant="body2" color="text.secondary" mt={1}>
                For session: {selectedSessionForCertification.title || selectedSessionForCertification.assessmentInfo?.quizTitle || 'Untitled Session'}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent>
            {savedCertifications.length === 0 ? (
              <Box textAlign="center" py={6}>
                <CertificateIcon sx={{ fontSize: 64, color: '#d1d5db', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" mb={1}>
                  No Saved Certifications
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Create a certification configuration from the Certification section to see it here.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {savedCertifications.map((certification) => (
                  <Grid item xs={12} sm={6} key={certification.id}>
                    <Card
                      sx={{
                        p: 2,
                        border: '1px solid #e5e7eb',
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: '#8b5cf6',
                          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                      onClick={() => handleSelectCertification(certification)}
                    >
                      <Box display="flex" alignItems="flex-start" gap={2}>
                        <Box
                          sx={{
                            backgroundColor: '#f3f4f6',
                            borderRadius: 2,
                            p: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <CertificateIcon sx={{ fontSize: 32, color: '#8b5cf6' }} />
                        </Box>
                        <Box flex={1}>
                          <Typography variant="h6" fontWeight="bold" mb={0.5}>
                            {certification.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" mb={1}>
                            Template: {certification.template?.name || 'N/A'}
                          </Typography>
                          <Box display="flex" gap={1} flexWrap="wrap">
                            <Chip
                              label={certification.fields?.title || 'CERTIFICATE'}
                              size="small"
                              sx={{ fontSize: '0.7rem' }}
                            />
                            <Chip
                              label={new Date(certification.createdAt).toLocaleDateString()}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setShowSavedCertifications(false);
                setSelectedSessionForCertification(null);
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Certification Confirmation Dialog */}
        <Dialog
          open={showCertificationConfirm}
          onClose={handleCancelCertification}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <CertificateIcon sx={{ color: '#8b5cf6' }} />
              <Typography variant="h6" fontWeight="bold">
                Confirm Certification Assignment
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {certificationToConfirm && selectedSessionForCertification && (
              <Box>
                <Typography variant="body1" mb={2}>
                  Are you sure you want to attach the following certification to this session?
                </Typography>
                
                <Card sx={{ p: 2, mb: 2, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb' }}>
                  <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                    Certification:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" mb={1}>
                    {certificationToConfirm.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={0.5}>
                    Template: {certificationToConfirm.template?.name || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Certificate Title: {certificationToConfirm.fields?.title || 'CERTIFICATE'}
                  </Typography>
                </Card>

                <Card sx={{ p: 2, backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                  <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                    Session:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedSessionForCertification.title || selectedSessionForCertification.assessmentInfo?.quizTitle || 'Untitled Session'}
                  </Typography>
                </Card>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCancelCertification}
              sx={{
                color: '#6b7280',
                '&:hover': { backgroundColor: '#f3f4f6' }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirmCertification}
              sx={{
                backgroundColor: '#10b981',
                '&:hover': { backgroundColor: '#059669' }
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  const renderPublishDialog = () => {
    return (
      <Box p={3} sx={{ maxWidth: 800, mx: 'auto' }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight="bold">
            Publish course
          </Typography>
          <IconButton onClick={() => {
            setShowPublishDialog(false);
            setSessionToPublish(null);
          }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* General Settings */}
        <Typography variant="h5" fontWeight="bold" mb={3}>
          General Settings
        </Typography>

        {/* Course Image */}
        <Box mb={4}>
          <Typography variant="body1" fontWeight="medium" mb={2}>
            Course image
          </Typography>
          <Box display="flex" gap={3}>
            {publishCourseData.courseImage ? (
              <Box
                sx={{
                  width: 200,
                  height: 120,
                  borderRadius: 2,
                  backgroundImage: `url(${publishCourseData.courseImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  border: '1px solid #e5e7eb'
                }}
              >
                <Chip
                  label="New"
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    backgroundColor: '#3b82f6',
                    color: 'white'
                  }}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  width: 200,
                  height: 120,
                  borderRadius: 2,
                  backgroundColor: '#f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid #e5e7eb'
                }}
              >
                <ImageIcon sx={{ fontSize: 48, color: '#9ca3af' }} />
              </Box>
            )}
            <Box>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="course-image-upload"
              />
              <Box display="flex" gap={2} flexDirection="column">
                <Button
                  variant="outlined"
                  startIcon={<CloudUploadIcon2 />}
                  onClick={() => document.getElementById('course-image-upload').click()}
                >
                  Upload image
                </Button>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Format: JPG, JPEG, PNG | Max size: 5 MB
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Course Title */}
        <Box mb={4}>
          <Typography variant="body1" fontWeight="medium" mb={2}>
            Course title
          </Typography>
          <TextField
            fullWidth
            value={publishCourseData.courseTitle}
            onChange={(e) => setPublishCourseData(prev => ({ ...prev, courseTitle: e.target.value }))}
            placeholder="Enter course title"
          />
        </Box>

        {/* Description */}
        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="body1" fontWeight="medium">
              Description
            </Typography>
            <Button
              size="small"
              startIcon={<AutoAwesomeIcon />}
              sx={{ color: '#8b5cf6' }}
            >
              Generate using AI (2)
            </Button>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={publishCourseData.description}
            onChange={(e) => {
              const newDesc = e.target.value;
              if (newDesc.length <= 1000) {
                setPublishCourseData(prev => ({ ...prev, description: newDesc }));
              }
            }}
            placeholder="Enter course description"
          />
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
            <Typography variant="body2" color="text.secondary">
              {publishCourseData.description.length}/1000 characters
            </Typography>
            <Box display="flex" gap={1} alignItems="center">
              <IconButton size="small">
                <KeyboardArrowLeftIcon />
              </IconButton>
              <Typography variant="body2">1 / 1</Typography>
              <IconButton size="small">
                <KeyboardArrowRightIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Skills */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Typography variant="body1" fontWeight="medium">
              Skills
            </Typography>
            <InfoIcon sx={{ fontSize: 18, color: '#6b7280' }} />
          </Box>
          <FormControl fullWidth>
            <InputLabel>Select the skills that user will gain from this course</InputLabel>
            <Select
              multiple
              value={publishCourseData.skills}
              onChange={(e) => setPublishCourseData(prev => ({ ...prev, skills: e.target.value }))}
              renderValue={(selected) => selected.join(', ')}
              label="Select the skills that user will gain from this course"
            >
              <MenuItem value="Communication">Communication</MenuItem>
              <MenuItem value="Leadership">Leadership</MenuItem>
              <MenuItem value="Teamwork">Teamwork</MenuItem>
              <MenuItem value="Problem Solving">Problem Solving</MenuItem>
              <MenuItem value="Technical Skills">Technical Skills</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            onClick={handleSaveForLater}
            sx={{
              borderColor: '#8b5cf6',
              color: '#8b5cf6',
              px: 3
            }}
          >
            Save for later
          </Button>
          <Button
            variant="contained"
            onClick={handlePublishNow}
            sx={{
              backgroundColor: '#8b5cf6',
              '&:hover': { backgroundColor: '#7c3aed' },
              px: 3
            }}
          >
            Publish Now
          </Button>
        </Box>
      </Box>
    );
  };

  const renderProfile = () => (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Admin Profile
        </Typography>
        <Box display="flex" gap={2}>
          <IconButton 
            onClick={handleEditProfile}
            sx={{ border: '1px solid rgba(0, 0, 0, 0.23)', '&:hover': { borderColor: 'rgba(0, 0, 0, 0.87)' } }}
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            onClick={handleCloseProfile}
            sx={{ border: '1px solid rgba(0, 0, 0, 0.23)', '&:hover': { borderColor: 'rgba(0, 0, 0, 0.87)' } }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
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
          <Grid item xs={12} sm={6}>
            <Typography variant="body1" color="text.secondary">Employee ID:</Typography>
            <Typography variant="h6">{profileData.employeeId}</Typography>
          </Grid>
        </Grid>
      </Card>
    </Box>
  );

  const renderEditProfile = () => (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">
          Edit Admin Profile
        </Typography>
        <Box display="flex" gap={2}>
          <Button 
            variant="contained" 
            onClick={handleProfileSave}
            sx={{ backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669' } }}
          >
            Save Changes
          </Button>
          <IconButton 
            onClick={handleCloseProfile}
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
              value={editProfileData.firstName}
              onChange={handleEditProfileChange('firstName')}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              value={editProfileData.lastName}
              onChange={handleEditProfileChange('lastName')}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              value={editProfileData.email}
              onChange={handleEditProfileChange('email')}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              value={editProfileData.phone}
              onChange={handleEditProfileChange('phone')}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Department"
              value={editProfileData.department}
              onChange={handleEditProfileChange('department')}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Job Role"
              value={editProfileData.jobRole}
              onChange={handleEditProfileChange('jobRole')}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Reporting Manager"
              value={editProfileData.reportingManager}
              onChange={handleEditProfileChange('reportingManager')}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Employee ID"
              value={editProfileData.employeeId}
              onChange={handleEditProfileChange('employeeId')}
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>
      </Card>
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
          {/* Current Credentials */}
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Current Credentials
              </Typography>
              <Box mt={3}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Login ID:
                </Typography>
                <Typography variant="h6" mb={2}>
                  {adminCredentials.username}
                </Typography>
                
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Password:
                </Typography>
                <Typography variant="h6">
                  ••••••••
                </Typography>
              </Box>
            </Card>
          </Grid>

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
                  onChange={handlePasswordChange('currentPassword')}
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
                  onChange={handlePasswordChange('newPassword')}
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
                  onChange={handlePasswordChange('confirmPassword')}
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

  const renderSavedSessionsFolder = () => (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => setShowSavedSessionsFolder(false)}
            sx={{ mr: 2 }}
          >
            Back to Dashboard
          </Button>
          <FolderIcon sx={{ fontSize: 40, color: '#f59e0b' }} />
          <Typography variant="h4" fontWeight="bold">
            Saved Sessions Folder
          </Typography>
        </Box>
      </Box>

      <Typography variant="body1" color="text.secondary" mb={4}>
        All your saved sessions and their files are stored here
      </Typography>

      <Grid container spacing={3}>
        {savedSessions.map((session) => (
          <Grid item xs={12} key={session.id}>
            <Card sx={{ p: 3 }}>
              <Box display="flex" alignItems="start" gap={2} mb={3}>
                <FolderIcon sx={{ fontSize: 48, color: '#3b82f6' }} />
                <Box flex={1}>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                    <Typography variant="h5" fontWeight="bold">
                      {session.title}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Chip
                        label={session.status}
                        color={session.status === 'draft' ? 'default' : session.status === 'scheduled' ? 'primary' : 'success'}
                        size="small"
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteSession(session.id)}
                        sx={{
                          color: '#ef4444',
                          '&:hover': {
                            backgroundColor: '#fef2f2'
                          }
                        }}
                        title="Delete Session"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {session.description}
                  </Typography>
                  <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
                    <Chip label={`Type: ${session.type}`} size="small" variant="outlined" />
                    <Chip label={`Audience: ${session.audience}`} size="small" variant="outlined" />
                    <Chip label={`Created: ${new Date(session.createdAt).toLocaleDateString()}`} size="small" variant="outlined" />
                  </Box>
                </Box>
              </Box>

              {session.files && session.files.length > 0 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FileIcon /> Attached Files ({session.files.length})
                  </Typography>
                  <Grid container spacing={2}>
                    {session.files.map((file, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card 
                          onClick={() => file.fileObject ? handleFileView(file) : null}
                          sx={{ 
                            p: 2, 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 2,
                            cursor: file.fileObject ? 'pointer' : 'not-allowed',
                            opacity: file.fileObject ? 1 : 0.6,
                            transition: 'all 0.2s',
                            '&:hover': file.fileObject ? { 
                              backgroundColor: '#f8fafc', 
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            } : {}
                          }}
                        >
                          <FileIcon sx={{ fontSize: 32, color: file.fileObject ? '#10b981' : '#94a3b8' }} />
                          <Box flex={1} sx={{ minWidth: 0 }}>
                            <Typography 
                              variant="body2" 
                              fontWeight="medium" 
                              sx={{ 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis', 
                                whiteSpace: 'nowrap' 
                              }}
                            >
                              {file.name || file}
                              {file.isFileObject && !file.fileObject && (
                                <Chip 
                                  label="File not available" 
                                  size="small" 
                                  color="warning" 
                                  sx={{ ml: 1, height: 18, fontSize: '0.65rem' }}
                                />
                              )}
                            </Typography>
                            {file.size && (
                              <Typography variant="caption" color="text.secondary">
                                {formatFileSize(file.size)}
                              </Typography>
                            )}
                            {file.type && (
                              <Typography variant="caption" color="text.secondary" display="block">
                                {file.type}
                              </Typography>
                            )}
                          </Box>
                          {file.fileObject && (
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFileDownload(file);
                              }}
                              title="Download file"
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              {(!session.files || session.files.length === 0) && (
                <Box textAlign="center" py={3} sx={{ backgroundColor: '#f8fafc', borderRadius: 2 }}>
                  <FileIcon sx={{ fontSize: 48, color: '#9ca3af', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No files attached to this session
                  </Typography>
                </Box>
              )}

              {/* Create Interactive Quiz Section */}
              <Box mt={3} p={3} sx={{ backgroundColor: session.quiz ? '#d1fae5' : '#fef3c7', borderRadius: 2, border: `2px dashed ${session.quiz ? '#10b981' : '#f59e0b'}` }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <QuizIcon sx={{ fontSize: 40, color: session.quiz ? '#10b981' : '#f59e0b' }} />
                  <Box flex={1}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Interactive Quiz
                      {session.quiz && <Chip label="Quiz Attached" size="small" color="success" sx={{ ml: 2 }} />}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {session.quiz 
                        ? `Quiz "${session.quiz.title}" with ${session.quiz.questions.length} questions is attached`
                        : 'Create assessments and quizzes for this session to test learner understanding'
                      }
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  startIcon={<QuizIcon />}
                  onClick={() => {
                    setCurrentQuizSessionId(session.id);
                    handleCreateQuiz();
                  }}
                  sx={{
                    backgroundColor: session.quiz ? '#10b981' : '#f59e0b',
                    '&:hover': { backgroundColor: session.quiz ? '#059669' : '#d97706' },
                    width: '100%',
                    mb: session.quiz ? 2 : 0
                  }}
                >
                  {session.quiz ? 'Edit Quiz' : 'Create Interactive Quiz'}
                </Button>

                {/* Display Quiz Details if exists */}
                {session.quiz && (
                  <Box mt={3} p={3} sx={{ backgroundColor: 'white', borderRadius: 2, border: '1px solid #e5e7eb' }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <QuizIcon sx={{ color: '#10b981' }} />
                      Quiz Preview
                    </Typography>
                    
                    <Box mt={2}>
                      <Typography variant="body1" fontWeight="medium" gutterBottom>
                        {session.quiz.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {session.quiz.description}
                      </Typography>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        Questions ({session.quiz.questions.length}):
                      </Typography>
                      
                      {session.quiz.questions.map((question, index) => (
                        <Box key={question.id} mb={2} p={2} sx={{ backgroundColor: '#f9fafb', borderRadius: 1, borderLeft: '3px solid #10b981' }}>
                          <Typography variant="body2" fontWeight="medium" gutterBottom>
                            {index + 1}. {question.text}
                            {question.required && <Chip label="Required" size="small" color="error" sx={{ ml: 1, height: 18 }} />}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                            Type: {question.type}
                          </Typography>
                          {question.options && question.options.length > 0 && (
                            <Box ml={2}>
                              {question.options.map((option, optIndex) => (
                                <Typography key={optIndex} variant="body2" color="text.secondary">
                                  • {option}
                                </Typography>
                              ))}
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {savedSessions.length === 0 && (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <FolderIcon sx={{ fontSize: 80, color: '#9ca3af', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No Saved Sessions Yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and save your first session to see it here
          </Typography>
        </Card>
      )}
    </Box>
  );

  // Employee management states
  const [settingsSubTab, setSettingsSubTab] = useState('manage');
  const [showSettingsSubmenu, setShowSettingsSubmenu] = useState(false);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeRoleFilter, setEmployeeRoleFilter] = useState('all');
  const [employeeSearchTerm, setEmployeeSearchTerm] = useState('');
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    jobRole: '',
    reportingManager: '',
    employeeId: '',
    role: 'employee', // 'employee' or 'admin'
    password: ''
  });

  const handleAddEmployee = () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email || !newEmployee.employeeId) {
      alert('Please fill in all required fields');
      return;
    }
    
    const employee = {
      id: Date.now(),
      ...newEmployee,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setEmployees(prev => [employee, ...prev]);
    setNewEmployee({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      jobRole: '',
      reportingManager: '',
      employeeId: '',
      role: 'employee',
      password: ''
    });
    setShowAddEmployee(false);
    alert('Employee added successfully!');
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setNewEmployee(employee);
    setShowEditEmployee(true);
  };

  const handleUpdateEmployee = () => {
    setEmployees(prev => 
      prev.map(emp => 
        emp.id === selectedEmployee.id ? { ...emp, ...newEmployee } : emp
      )
    );
    setShowEditEmployee(false);
    setSelectedEmployee(null);
    setNewEmployee({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      jobRole: '',
      reportingManager: '',
      employeeId: '',
      role: 'employee',
      password: ''
    });
    alert('Employee updated successfully!');
  };

  const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      const employee = employees.find(emp => emp.id === employeeId);
      setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
      
      // Log activity
      if (employee) {
        addActivity(
          `Employee deleted: ${employee.name}`,
          'Admin',
          'deleted',
          'employee_added'
        );
      }
      
      alert('Employee deleted successfully!');
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesRole = employeeRoleFilter === 'all' || emp.role === employeeRoleFilter;
    const matchesSearch = employeeSearchTerm === '' || 
      emp.firstName.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      emp.name.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(employeeSearchTerm.toLowerCase()) ||
      emp.jobRole.toLowerCase().includes(employeeSearchTerm.toLowerCase());
    
    return matchesRole && matchesSearch;
  });

  const renderSettings = () => (
    <Box p={3}>

      {/* Manage Employee Accounts Tab */}
      {settingsSubTab === 'manage' && (
        <Card sx={{ p: 3, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold">
              Manage Employee Accounts
            </Typography>
          </Box>

        {/* Search and Filter Controls */}
        <Grid container spacing={3} mb={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Employees"
              placeholder="Search by name, email, ID, department, or job role..."
              value={employeeSearchTerm}
              onChange={(e) => setEmployeeSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Filter by Role"
              value={employeeRoleFilter}
              onChange={(e) => setEmployeeRoleFilter(e.target.value)}
              SelectProps={{ native: true }}
            >
              <option value="all">All Roles</option>
              <option value="employee">Employees</option>
              <option value="admin">Admins</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setEmployeeSearchTerm('');
                setEmployeeRoleFilter('all');
              }}
              sx={{ height: '56px' }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>

        {/* Employees List */}
        <Grid container spacing={3}>
          {filteredEmployees.map((employee) => (
            <Grid item xs={12} md={6} lg={4} key={employee.id}>
              <Card sx={{ p: 3, height: '100%' }}>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {employee.firstName} {employee.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {employee.email}
                    </Typography>
                  </Box>
                  <Chip
                    label={employee.role === 'admin' ? 'Admin' : 'Employee'}
                    color={employee.role === 'admin' ? 'error' : 'primary'}
                    size="small"
                  />
                </Box>

                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Department:</strong> {employee.department}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Job Role:</strong> {employee.jobRole}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Employee ID:</strong> {employee.employeeId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Reporting Manager:</strong> {employee.reportingManager}
                  </Typography>
                </Box>

                <Box display="flex" gap={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditEmployee(employee)}
                    sx={{ flex: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CloseIcon />}
                    onClick={() => handleDeleteEmployee(employee.id)}
                    sx={{ 
                      flex: 1,
                      borderColor: '#ef4444',
                      color: '#ef4444',
                      '&:hover': {
                        borderColor: '#dc2626',
                        backgroundColor: '#fef2f2'
                      }
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredEmployees.length === 0 && (
          <Box textAlign="center" py={4}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No employees found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {employeeSearchTerm || employeeRoleFilter !== 'all'
                ? 'No employees match your search criteria. Try adjusting your search or filter settings.'
                : 'Add your first employee to get started'
              }
            </Typography>
            {(employeeSearchTerm || employeeRoleFilter !== 'all') && (
              <Button
                variant="outlined"
                onClick={() => {
                  setEmployeeSearchTerm('');
                  setEmployeeRoleFilter('all');
                }}
                sx={{ mt: 2 }}
              >
                Clear Search & Filters
              </Button>
            )}
          </Box>
        )}
        </Card>
      )}

      {/* Add Employee Tab */}
      {settingsSubTab === 'add' && (
        <Card sx={{ p: 3, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight="bold">
              Add Employee
            </Typography>
          </Box>

          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  value={newEmployee.firstName}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, firstName: e.target.value }))}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  value={newEmployee.lastName}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, lastName: e.target.value }))}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Department"
                  value={newEmployee.department}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, department: e.target.value }))}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Job Role"
                  value={newEmployee.jobRole}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, jobRole: e.target.value }))}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Reporting Manager"
                  value={newEmployee.reportingManager}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, reportingManager: e.target.value }))}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Employee ID"
                  value={newEmployee.employeeId}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, employeeId: e.target.value }))}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, role: e.target.value }))}
                    label="Role"
                  >
                    <MenuItem value="employee">Employee</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Password"
                  type="password"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, password: e.target.value }))}
                  fullWidth
                  required
                  helperText="Set initial password for the employee"
                />
              </Grid>
            </Grid>

            <Box display="flex" gap={2} mt={4}>
              <Button
                variant="contained"
                onClick={handleAddEmployee}
                sx={{ backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669' } }}
              >
                Add Employee
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setNewEmployee({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    department: '',
                    jobRole: '',
                    reportingManager: '',
                    employeeId: '',
                    role: 'employee',
                    password: ''
                  });
                }}
              >
                Clear Form
              </Button>
            </Box>
          </Box>
        </Card>
      )}

      {/* Add/Edit Employee Dialog */}
      <Dialog 
        open={showAddEmployee || showEditEmployee} 
        onClose={() => {
          setShowAddEmployee(false);
          setShowEditEmployee(false);
          setSelectedEmployee(null);
          setNewEmployee({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            department: '',
            jobRole: '',
            reportingManager: '',
            employeeId: '',
            role: 'employee',
            password: ''
          });
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            {showEditEmployee ? 'Edit Employee' : 'Add New Employee'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                value={newEmployee.firstName}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, firstName: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                value={newEmployee.lastName}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, lastName: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Department"
                value={newEmployee.department}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, department: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Job Role"
                value={newEmployee.jobRole}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, jobRole: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Reporting Manager"
                value={newEmployee.reportingManager}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, reportingManager: e.target.value }))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Employee ID"
                value={newEmployee.employeeId}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, employeeId: e.target.value }))}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select
                  value={newEmployee.role}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, role: e.target.value }))}
                  label="Role"
                >
                  <MenuItem value="employee">Employee</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                type="password"
                value={newEmployee.password}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, password: e.target.value }))}
                fullWidth
                required
                helperText="Set initial password for the employee"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowAddEmployee(false);
            setShowEditEmployee(false);
            setSelectedEmployee(null);
          }}>
            Cancel
          </Button>
          <Button 
            onClick={showEditEmployee ? handleUpdateEmployee : handleAddEmployee}
            variant="contained"
            sx={{ backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669' } }}
          >
            {showEditEmployee ? 'Update Employee' : 'Add Employee'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  // Combine all sessions and assessments from different sources
  const getAllCourses = () => {
    const courses = [];
    
    // Add draft sessions
    draftSessions.forEach(session => {
      const questionCount = session.quiz?.questions?.length || session.questions?.length || 0;
      const duration = questionCount > 0 ? `${questionCount * 5}min` : 'N/A';
      
      courses.push({
        id: session.id,
        title: session.title || 'Untitled Session',
        modules: questionCount || 0,
        duration: duration,
        skill: 'NA', // Can be enhanced later
        rating: 0.0,
        reviews: 0,
        thumbnail: session.type === 'Employee Wellbeing' ? '🧘' : session.type === 'Technical Training' ? '💻' : '📚',
        status: 'Draft',
        category: session.type || 'General',
        createdAt: session.savedAt || session.createdAt,
        originalData: session,
        source: 'draft'
      });
    });
    
    // Add published sessions
    publishedSessions.forEach(session => {
      const questionCount = session.quiz?.questions?.length || session.questions?.length || 0;
      const duration = questionCount > 0 ? `${questionCount * 5}min` : 'N/A';
      
      courses.push({
        id: session.id,
        title: session.title || 'Untitled Session',
        modules: questionCount || 0,
        duration: duration,
        skill: 'NA',
        rating: 0.0,
        reviews: 0,
        thumbnail: session.type === 'Employee Wellbeing' ? '🧘' : session.type === 'Technical Training' ? '💻' : '📚',
        status: 'Published',
        category: session.type || 'General',
        createdAt: session.publishedAt || session.createdAt,
        originalData: session,
        source: 'published'
      });
    });
    
    // Add saved assessments
    savedAssessments.forEach(assessment => {
      const questionCount = assessment.quiz?.questions?.length || assessment.questions?.length || 0;
      const duration = questionCount > 0 ? `${questionCount * 5}min` : 'N/A';
      
      courses.push({
        id: assessment.id,
        title: assessment.title || assessment.assessmentInfo?.quizTitle || 'Untitled Assessment',
        modules: questionCount || 0,
        duration: duration,
        skill: 'NA',
        rating: 0.0,
        reviews: 0,
        thumbnail: '📝',
        status: 'Saved',
        category: assessment.type || 'Assessment',
        createdAt: assessment.savedAt || assessment.createdAt,
        originalData: assessment,
        source: 'assessment'
      });
    });
    
    return courses;
  };

  const allCourses = getAllCourses();

  // Filter courses based on search and filters
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(courseSearchTerm.toLowerCase());
    const matchesSkill = courseFilters.skill === 'all' || course.skill === courseFilters.skill;
    const matchesCategory = courseFilters.category === 'all' || course.category === courseFilters.category;
    const matchesReviews = courseFilters.reviews === 'all' || 
      (courseFilters.reviews === 'with' && course.reviews > 0) ||
      (courseFilters.reviews === 'without' && course.reviews === 0);
    
    return matchesSearch && matchesSkill && matchesCategory && matchesReviews;
  });

  const renderCourseLibrary = () => (
    <Box p={3}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Course library
        </Typography>
        <Typography variant="body1" color="text.secondary">
          List of all courses accessible to you
        </Typography>
      </Box>

      {/* Filters and Search */}
      <Box mb={3} display="flex" gap={2} alignItems="center" flexWrap="wrap">
        {/* Filter Dropdowns */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Skill</InputLabel>
          <Select
            value={courseFilters.skill}
            label="Skill"
            onChange={(e) => setCourseFilters(prev => ({ ...prev, skill: e.target.value }))}
          >
            <MenuItem value="all">All Skills</MenuItem>
            <MenuItem value="NA">NA</MenuItem>
            {/* Add more skills as needed */}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={courseFilters.category}
            label="Category"
            onChange={(e) => setCourseFilters(prev => ({ ...prev, category: e.target.value }))}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {[...new Set(allCourses.map(c => c.category))].map(category => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Reviews</InputLabel>
          <Select
            value={courseFilters.reviews}
            label="Reviews"
            onChange={(e) => setCourseFilters(prev => ({ ...prev, reviews: e.target.value }))}
          >
            <MenuItem value="all">All Reviews</MenuItem>
            <MenuItem value="with">With Reviews</MenuItem>
            <MenuItem value="without">Without Reviews</MenuItem>
          </Select>
        </FormControl>

        {/* Search Bar */}
        <Box flex={1} minWidth={250}>
          <TextField
            placeholder="Search by course title"
            value={courseSearchTerm}
            onChange={(e) => setCourseSearchTerm(e.target.value)}
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* View Toggle Buttons */}
        <Box display="flex" gap={1}>
          <IconButton
            onClick={() => setCourseLibraryView('grid')}
            sx={{
              backgroundColor: courseLibraryView === 'grid' ? '#3b82f6' : 'transparent',
              color: courseLibraryView === 'grid' ? 'white' : '#666',
              border: '1px solid #e5e7eb',
              '&:hover': {
                backgroundColor: courseLibraryView === 'grid' ? '#2563eb' : '#f3f4f6'
              }
            }}
          >
            <GridViewIcon />
          </IconButton>
          <IconButton
            onClick={() => setCourseLibraryView('list')}
            sx={{
              backgroundColor: courseLibraryView === 'list' ? '#3b82f6' : 'transparent',
              color: courseLibraryView === 'list' ? 'white' : '#666',
              border: '1px solid #e5e7eb',
              '&:hover': {
                backgroundColor: courseLibraryView === 'list' ? '#2563eb' : '#f3f4f6'
              }
            }}
          >
            <ListViewIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Course List */}
      <Box>
        {courseLibraryView === 'list' ? (
          <Box>
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                sx={{
                  mb: 2,
                  p: 2,
                  '&:hover': {
                    boxShadow: 2,
                    transition: 'box-shadow 0.2s'
                  }
                }}
              >
                <Box display="flex" alignItems="center" gap={3}>
                  {/* Thumbnail */}
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 40
                    }}
                  >
                    {course.thumbnail}
                  </Box>

                  {/* Course Info */}
                  <Box flex={1}>
                    <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                      <Typography variant="h6" fontWeight="bold">
                        {course.title}
                      </Typography>
                      <Chip
                        label={course.status}
                        size="small"
                        sx={{
                          backgroundColor: course.status === 'Published' ? '#10b981' : 
                                           course.status === 'Draft' ? '#f59e0b' : '#3b82f6',
                          color: 'white',
                          fontWeight: 'medium',
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {course.modules} modules | {course.duration}
                    </Typography>
                  </Box>

                  {/* Skills */}
                  <Box sx={{ minWidth: 100, textAlign: 'right' }}>
                    <Typography variant="body2" color="text.secondary">
                      Skills: {course.skill}
                    </Typography>
                  </Box>

                  {/* Rating */}
                  <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 150 }}>
                    <StarIcon sx={{ color: '#fbbf24', fontSize: 20 }} />
                    <Typography variant="body2" fontWeight="medium">
                      {course.rating}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.reviews === 0 ? '(No Reviews)' : `(${course.reviews} Reviews)`}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            ))}
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: 4,
                      transition: 'box-shadow 0.2s'
                    }
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: 180,
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 60
                    }}
                  >
                    {course.thumbnail}
                  </Box>
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
                        {course.title}
                      </Typography>
                      <Chip
                        label={course.status}
                        size="small"
                        sx={{
                          backgroundColor: course.status === 'Published' ? '#10b981' : 
                                           course.status === 'Draft' ? '#f59e0b' : '#3b82f6',
                          color: 'white',
                          fontWeight: 'medium',
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      {course.modules} modules | {course.duration}
                    </Typography>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        Skills: {course.skill}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1} mt="auto">
                      <StarIcon sx={{ color: '#fbbf24', fontSize: 18 }} />
                      <Typography variant="body2" fontWeight="medium">
                        {course.rating}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {course.reviews === 0 ? '(No Reviews)' : `(${course.reviews})`}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {filteredCourses.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            No courses found
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}
    </Box>
  );

  // Sample analytics data - In real app, this would come from context/API
  const getAnalyticsData = () => ({
    totalLearners: employees.length,
    completionRate: 75,
    averageRating: 4.5,
    activeSessions: publishedSessions.length,
    totalSessionsCompleted: publishedSessions.length,
    topPerformers: employees.slice(0, 5).map((emp, idx) => ({
      id: emp.id,
      name: emp.name,
      department: emp.department,
      sessionsCompleted: Math.floor(Math.random() * 10) + 1,
      completionRate: Math.floor(Math.random() * 40) + 60
    }))
  });

  const renderAnalyticsDashboard = () => {
    const analyticsData = getAnalyticsData();
    const kpiData = [
      {
        value: analyticsData.totalLearners.toString(),
        label: 'Total Learners',
        color: '#3b82f6',
        icon: <PeopleIcon sx={{ fontSize: 40 }} />
      },
      {
        value: `${analyticsData.completionRate}%`,
        label: 'Completion Rate',
        color: '#10b981',
        icon: <CheckCircleIcon sx={{ fontSize: 40 }} />
      },
      {
        value: analyticsData.averageRating.toString(),
        label: 'Avg. Rating',
        color: '#f59e0b',
        icon: <StarIcon sx={{ fontSize: 40 }} />
      },
      {
        value: analyticsData.activeSessions.toString(),
        label: 'Active Sessions',
        color: '#ef4444',
        icon: <VideoLibraryIcon sx={{ fontSize: 40 }} />
      }
    ];

    const topEmployees = analyticsData.topPerformers.map((employee, index) => ({
      id: employee.id,
      name: employee.name,
      department: employee.department,
      sessionsCompleted: employee.sessionsCompleted,
      completionRate: employee.completionRate,
      rank: index + 1,
      rankColor: index === 0 ? '#10b981' : index === 1 ? '#f59e0b' : '#ef4444'
    }));

    return (
      <Box p={3}>
        {/* KPI Cards Section */}
        <Box mb={4}>
          <Grid container spacing={3}>
            {kpiData.map((kpi, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ p: 3, textAlign: 'center', borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', height: '100%' }}>
                  <Box display="flex" justifyContent="center" mb={2}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: `${kpi.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {kpi.icon}
                    </Box>
                  </Box>
                  <Typography 
                    variant="h3" 
                    fontWeight="bold" 
                    sx={{ color: kpi.color, mb: 1 }}
                  >
                    {kpi.value}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" fontWeight="medium">
                    {kpi.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Top Performing Employees Section */}
        <Box>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
                <Box display="flex" alignItems="center">
                  <CalendarIcon sx={{ fontSize: 28, color: '#3b82f6', mr: 2 }} />
                  <Typography variant="h4" fontWeight="bold" color="text.primary">
                    Top Performing Employees
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                {topEmployees.map((employee) => (
                  <Grid item xs={12} md={4} key={employee.id}>
                    <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb', mb: 2 }}>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: employee.rankColor,
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            mr: 2
                          }}
                        >
                          {employee.rank}
                        </Box>
                        <Box flex={1}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {employee.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {employee.department} • {employee.sessionsCompleted} sessions completed
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="h4" fontWeight="bold" sx={{ color: employee.rankColor }}>
                            {employee.completionRate}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Completion Rate
                          </Typography>
                        </Box>
                        <Chip
                          label={`Rank #${employee.rank}`}
                          sx={{
                            backgroundColor: `${employee.rankColor}20`,
                            color: employee.rankColor,
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* Additional Stats */}
              <Box mt={4} p={3} sx={{ backgroundColor: '#f8fafc', borderRadius: 2 }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Performance Summary
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography variant="h4" fontWeight="bold" color="#3b82f6">
                        {analyticsData.totalSessionsCompleted}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Sessions Completed
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography variant="h4" fontWeight="bold" color="#10b981">
                        {analyticsData.completionRate}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Completion Rate
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography variant="h4" fontWeight="bold" color="#f59e0b">
                        {topEmployees.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Top Performers
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  };

  const handleRunReport = () => {
    // Generate report data based on selected report and filters
    let data = [];
    
    if (selectedReport === 'all-learners') {
      // All Learner's Report
      data = employees.map(emp => ({
        userName: emp.name,
        empId: emp.employeeId || emp.id,
        jobTitle: emp.jobRole || 'N/A',
        department: emp.department,
        businessUnit: 'N/A', // Add if available
        reportingManager: emp.reportingManager || 'N/A',
        employmentStatus: emp.status || 'Active',
        coursesEnrolled: Math.floor(Math.random() * 5) + 1,
        coursesNotStarted: Math.floor(Math.random() * 3),
        coursesCompleted: Math.floor(Math.random() * 2)
      }));
    } else if (selectedReport === 'course-status') {
      // Course Status Report - would show courses with enrollment and completion
      const allCoursesData = getAllCourses();
      data = allCoursesData.map(course => ({
        courseTitle: course.title,
        learnersEnrolled: Math.floor(Math.random() * 20) + 5,
        learnersCompleted: Math.floor(Math.random() * 15),
        completionRate: Math.floor(Math.random() * 50) + 50,
        status: course.status
      }));
    } else if (selectedReport === 'learner-status') {
      // Learner Status Report
      const allCoursesData = getAllCourses();
      data = [];
      employees.forEach(emp => {
        allCoursesData.forEach(course => {
          data.push({
            userName: emp.name,
            courseTitle: course.title,
            completionStatus: Math.random() > 0.5 ? 'Completed' : 'In Progress',
            timeSpent: `${Math.floor(Math.random() * 60) + 10}min`,
            progress: Math.floor(Math.random() * 100)
          });
        });
      });
    }
    
    setReportData(data);
  };

  const handleResetFilters = () => {
    setReportFilters({
      departments: [],
      businessUnits: [],
      employmentStatus: []
    });
  };

  const renderReportDetail = () => {
    if (!selectedReport) return null;

    const reportTitles = {
      'all-learners': 'All Learner\'s Report',
      'course-status': 'Course Status Report',
      'learner-status': 'Learner Status Report'
    };

    const allDepartments = [...new Set(employees.map(e => e.department))];
    const allBusinessUnits = ['Keka Onboa', 'sa', 'Others']; // Sample - would come from data
    const allEmploymentStatuses = ['Active', 'Inactive'];

    const getReportColumns = () => {
      if (selectedReport === 'all-learners') {
        return ['USER NAME', 'EMP ID', 'JOB TITLE', 'DEPARTMENT', 'BUSINESS UNIT', 'REPORTING MANAGER', 'EMPLOYMENT STATUS', 'COURSES ENROLLED', 'COURSES NOT STARTED', 'COURSES COMPLETED'];
      } else if (selectedReport === 'course-status') {
        return ['COURSE TITLE', 'LEARNERS ENROLLED', 'LEARNERS COMPLETED', 'COMPLETION RATE', 'STATUS'];
      } else if (selectedReport === 'learner-status') {
        return ['USER NAME', 'COURSE TITLE', 'COMPLETION STATUS', 'TIME SPENT', 'PROGRESS'];
      }
      return [];
    };

    const columns = getReportColumns();

    return (
      <Box p={3}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            {reportTitles[selectedReport]}
          </Typography>
          <IconButton onClick={() => setSelectedReport(null)}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Filter Bar */}
        <Card sx={{ p: 2, mb: 3 }}>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>DEPARTMENT</InputLabel>
              <Select
                multiple
                value={reportFilters.departments}
                label="DEPARTMENT"
                onChange={(e) => setReportFilters(prev => ({ ...prev, departments: e.target.value }))}
                renderValue={(selected) => `${selected.length} selected`}
              >
                {allDepartments.map(dept => (
                  <MenuItem key={dept} value={dept}>
                    <Checkbox checked={reportFilters.departments.indexOf(dept) > -1} />
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>BUSINESS UNIT</InputLabel>
              <Select
                multiple
                value={reportFilters.businessUnits}
                label="BUSINESS UNIT"
                onChange={(e) => setReportFilters(prev => ({ ...prev, businessUnits: e.target.value }))}
                renderValue={(selected) => `${selected.length} selected`}
              >
                {allBusinessUnits.map(unit => (
                  <MenuItem key={unit} value={unit}>
                    <Checkbox checked={reportFilters.businessUnits.indexOf(unit) > -1} />
                    {unit}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>EMPLOYMENT STATUS</InputLabel>
              <Select
                multiple
                value={reportFilters.employmentStatus}
                label="EMPLOYMENT STATUS"
                onChange={(e) => setReportFilters(prev => ({ ...prev, employmentStatus: e.target.value }))}
                renderValue={(selected) => `${selected.length} selected`}
              >
                {allEmploymentStatuses.map(status => (
                  <MenuItem key={status} value={status}>
                    <Checkbox checked={reportFilters.employmentStatus.indexOf(status) > -1} />
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleResetFilters}
            >
              Reset
            </Button>

            <Button
              variant="contained"
              onClick={handleRunReport}
              sx={{
                backgroundColor: '#10b981',
                '&:hover': { backgroundColor: '#059669' }
              }}
            >
              Run
            </Button>
          </Box>
        </Card>

        {/* Search and Actions */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <TextField
            placeholder="Search by course title"
            value={reportSearchTerm}
            onChange={(e) => setReportSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 300 }}
          />
          <Box display="flex" gap={1}>
            <IconButton>
              <DownloadIcon />
            </IconButton>
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Report Table */}
        {reportData.length > 0 && (
          <Card>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {columns.map((col) => (
                      <TableCell key={col} sx={{ fontWeight: 'bold', backgroundColor: '#f8f9fa' }}>
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData
                    .slice(reportPage * reportRowsPerPage, reportPage * reportRowsPerPage + reportRowsPerPage)
                    .map((row, index) => (
                      <TableRow key={index}>
                        {columns.map((col) => {
                          const fieldMap = {
                            'USER NAME': 'userName',
                            'EMP ID': 'empId',
                            'JOB TITLE': 'jobTitle',
                            'DEPARTMENT': 'department',
                            'BUSINESS UNIT': 'businessUnit',
                            'REPORTING MANAGER': 'reportingManager',
                            'EMPLOYMENT STATUS': 'employmentStatus',
                            'COURSES ENROLLED': 'coursesEnrolled',
                            'COURSES NOT STARTED': 'coursesNotStarted',
                            'COURSES COMPLETED': 'coursesCompleted',
                            'COURSE TITLE': 'courseTitle',
                            'LEARNERS ENROLLED': 'learnersEnrolled',
                            'LEARNERS COMPLETED': 'learnersCompleted',
                            'COMPLETION RATE': 'completionRate',
                            'STATUS': 'status',
                            'COMPLETION STATUS': 'completionStatus',
                            'TIME SPENT': 'timeSpent',
                            'PROGRESS': 'progress'
                          };
                          const value = row[fieldMap[col]];
                          
                          if (col === 'EMPLOYMENT STATUS') {
                            return (
                              <TableCell key={col}>
                                <Chip
                                  label={value}
                                  size="small"
                                  sx={{
                                    backgroundColor: value === 'Active' ? '#10b981' : '#ef4444',
                                    color: 'white'
                                  }}
                                />
                              </TableCell>
                            );
                          }
                          
                          return (
                            <TableCell key={col}>
                              {typeof value === 'number' ? value : value || 'N/A'}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box display="flex" justifyContent="space-between" alignItems="center" p={2}>
              <Typography variant="body2" color="text.secondary">
                {reportPage * reportRowsPerPage + 1} to {Math.min((reportPage + 1) * reportRowsPerPage, reportData.length)} of {reportData.length}
              </Typography>
              <TablePagination
                component="div"
                count={reportData.length}
                page={reportPage}
                onPageChange={(e, newPage) => setReportPage(newPage)}
                rowsPerPage={reportRowsPerPage}
                onRowsPerPageChange={(e) => {
                  setReportRowsPerPage(parseInt(e.target.value, 10));
                  setReportPage(0);
                }}
                rowsPerPageOptions={[10, 25, 50, 100]}
              />
            </Box>
          </Card>
        )}

        {reportData.length === 0 && (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No data to display
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Choose filters and click "Run" to generate the report
            </Typography>
          </Card>
        )}
      </Box>
    );
  };

  const renderReports = () => {
    const reportCategories = [
      { id: 'reports-home', label: 'Reports Home', icon: <HomeIcon /> },
      { id: 'learn-reports', label: 'Learn Reports', icon: <DescriptionIcon /> },
      { id: 'scheduled-reports', label: 'Scheduled reports', icon: <CalendarIcon /> }
    ];

    const learnReports = [
      {
        id: 'all-learners',
        title: 'All Learner\'s Report',
        description: 'Shows all learners in Keka Learn with a breakdown of all their courses.'
      },
      {
        id: 'course-status',
        title: 'Course Status Report',
        description: 'This report shows the list of courses with details of course consumption & completion.'
      },
      {
        id: 'learner-status',
        title: 'Learner Status Report',
        description: 'This report shows the list of users enrolled in a course along with status & scores...'
      }
    ];

    if (selectedReport) {
      return renderReportDetail();
    }

    return (
      <Box display="flex" sx={{ minHeight: 'calc(100vh - 64px)' }}>
        {/* Sidebar - Categories */}
        <Box sx={{ width: 240, backgroundColor: '#f8f9fa', borderRight: '1px solid #e5e7eb', p: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ px: 2, py: 1 }}>
            Categories
          </Typography>
          <List>
            {reportCategories.map((category) => (
              <ListItem
                key={category.id}
                disablePadding
                sx={{
                  mb: 0.5,
                  backgroundColor: selectedReportCategory === category.id ? '#d1fae5' : 'transparent',
                  borderLeft: selectedReportCategory === category.id ? '4px solid #8b5cf6' : '4px solid transparent',
                  '&:hover': {
                    backgroundColor: '#f3f4f6'
                  }
                }}
              >
                <ListItemButton
                  onClick={() => setSelectedReportCategory(category.id)}
                  sx={{ py: 1.5, px: 2 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {category.icon}
                  </ListItemIcon>
                  <ListItemText primary={category.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Main Content */}
        <Box flex={1} p={3}>
          {selectedReportCategory === 'learn-reports' && (
            <>
              {/* Header */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" fontWeight="bold">
                  Learn Reports
                </Typography>
                <TextField
                  placeholder="Search in Learn Reports"
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 300 }}
                />
              </Box>

              {/* Report Cards */}
              <Grid container spacing={3}>
                {learnReports.map((report) => (
                  <Grid item xs={12} md={6} lg={4} key={report.id}>
                    <Card
                      sx={{
                        p: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          boxShadow: 4,
                          cursor: 'pointer'
                        }
                      }}
                      onClick={() => setSelectedReport(report.id)}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                        <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>
                          {report.title}
                        </Typography>
                        <IconButton size="small">
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        {report.description}
                      </Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {selectedReportCategory === 'reports-home' && (
            <Box textAlign="center" py={8}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Reports Home
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Select a category from the sidebar to view available reports
              </Typography>
            </Box>
          )}

          {selectedReportCategory === 'scheduled-reports' && (
            <Box textAlign="center" py={8}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Scheduled Reports
              </Typography>
              <Typography variant="body1" color="text.secondary">
                This feature is coming soon
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  const renderManageSession = () => {
    return (
      <Box>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={manageSessionTab || 'all-sessions'}
            onChange={(e, newValue) => handleManageSessionTabChange(newValue)}
            sx={{ px: 3, pt: 2 }}
          >
            <Tab label="Create a New Session" value="create" />
            <Tab label="Content Creator" value="content-creator" />
            <Tab label="Live Trainings" value="live-trainings" />
            <Tab label="Checkpoint Assessment" value="assessment" />
            <Tab label="Certification" value="certification" />
            <Tab label="Manage Sessions" value="all-sessions" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {(manageSessionTab === 'all-sessions' || !manageSessionTab) ? renderAllSessions() :
         manageSessionTab === 'create' ? (showContentCreator ? renderContentCreator() : renderCreateSession()) :
         manageSessionTab === 'content-creator' ? renderContentCreator() :
         manageSessionTab === 'live-trainings' ? renderLiveTrainings() :
         manageSessionTab === 'assessment' ? <InteractiveQuiz 
           onSave={handleQuizSave} 
           onPublish={handlePublishQuiz}
           onSaveDraft={handleSaveQuizAsDraft}
           onCancel={handleQuizCancel}
           existingQuizData={currentQuizData}
         /> :
         manageSessionTab === 'certification' ? renderCertificationTemplates() :
         null}
      </Box>
    );
  };

  const renderAnalytics = () => {
    return (
      <Box>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={analyticsTab}
            onChange={(e, newValue) => setAnalyticsTab(newValue)}
            sx={{ px: 3, pt: 2 }}
          >
            <Tab label="Dashboard" value="dashboard" />
            <Tab label="Reports" value="reports" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {analyticsTab === 'dashboard' ? renderAnalyticsDashboard() : renderReports()}
      </Box>
    );
  };

  const renderOtherTabs = () => (
    <Box p={3} textAlign="center">
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {navigationItems.find(item => item.id === activeTab)?.label}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        This section is under development
      </Typography>
    </Box>
  );

  return (
    <DashboardContainer>
      {/* Sidebar */}
      <Sidebar>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          HR Session Management
        </Typography>
        <Divider sx={{ my: 2, backgroundColor: '#374151' }} />
        <List>
          {navigationItems.map((item) => (
            <ListItem 
              key={item.id} 
              component="div"
              onClick={() => {
                // Handle clicks - manage-session is now a tab-based view
                if (item.id !== 'settings') {
                handleTabChange(item.id);
                } else {
                  // For settings, clicking the parent just opens/closes submenu
                  if (showSettingsSubmenu) {
                  setShowSettingsSubmenu(false);
                  } else {
                    handleTabChange(item.id);
                }
                }
              }}
              onMouseEnter={() => {
                if (item.id === 'settings') {
                  setShowSettingsSubmenu(true);
                }
              }}
              onMouseLeave={() => {
                // Don't close if mouse is moving to submenu
                if (item.id === 'settings') {
                  setTimeout(() => {
                    if (!document.querySelector('[data-submenu="settings"]:hover')) {
                  setShowSettingsSubmenu(false);
                }
                  }, 100);
                }
              }}
              sx={{
                backgroundColor: activeTab === item.id ? '#3b82f6' : 'transparent',
                borderRadius: 1,
                mb: 1,
                position: 'relative',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: activeTab === item.id ? '#3b82f6' : '#374151',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
              
              {/* Settings Submenu */}
              {item.id === 'settings' && showSettingsSubmenu && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: '100%',
                    top: 0,
                    ml: 1,
                    minWidth: 250,
                    backgroundColor: '#1e293b',
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                    border: '1px solid #374151',
                  }}
                  onMouseEnter={() => setShowSettingsSubmenu(true)}
                  onMouseLeave={() => setShowSettingsSubmenu(false)}
                >
                  <List sx={{ p: 1 }}>
                    <ListItem
                      button
                      onClick={() => {
                        handleTabChange('settings');
                        setSettingsSubTab('manage');
                        setShowSettingsSubmenu(false);
                      }}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        '&:hover': {
                          backgroundColor: '#374151',
                        },
                      }}
                    >
                      <ListItemText 
                        primary="Manage Employee Accounts" 
                        primaryTypographyProps={{ fontSize: '0.875rem' }}
                      />
                    </ListItem>
                    <ListItem
                      button
                      onClick={() => {
                        handleTabChange('settings');
                        setSettingsSubTab('add');
                        setShowSettingsSubmenu(false);
                      }}
                      sx={{
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: '#374151',
                        },
                      }}
                    >
                      <ListItemText 
                        primary="Add Employee" 
                        primaryTypographyProps={{ fontSize: '0.875rem' }}
                      />
                    </ListItem>
                  </List>
                </Box>
              )}


            </ListItem>
          ))}
        </List>
      </Sidebar>

      <MainContent>
        {/* Header */}
        <HeaderBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Welcome back, Admin
            </Typography>
            <IconButton 
              color="inherit" 
              onClick={handleNotificationClick}
              sx={{ mr: 1 }}
            >
              <NotificationsIcon sx={{ fontSize: 32 }} />
              {unreadNotificationsCount > 0 && (
                <Chip 
                  label={unreadNotificationsCount} 
                  size="small" 
                  color="error" 
                  sx={{ 
                    position: 'absolute', 
                    top: 10, 
                    right: 10, 
                    height: 20, 
                    minWidth: 20, 
                    borderRadius: '10px', 
                    fontSize: '0.75rem',
                    '& .MuiChip-label': { px: '6px' } 
                  }} 
                />
              )}
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleProfileClick}
            >
              <AccountIcon sx={{ fontSize: 36 }} />
            </IconButton>
          </Toolbar>
        </HeaderBar>

        {/* Content */}
        {showContentPreview ? renderContentPreview() :
         showSavedSessionsFolder ? renderSavedSessionsFolder() :
         showPasswordManager ? renderPasswordManager() :
         showProfile ? (showEditProfile ? renderEditProfile() : renderProfile()) :
         activeTab === 'dashboard' ? renderDashboard() :
         activeTab === 'manage-session' ? renderManageSession() :
         showQuizForm ? <InteractiveQuiz 
           onSave={handleQuizSave} 
           onCancel={handleQuizCancel}
           onSaveDraft={handleSaveQuizAsDraft}
           onPreview={handleQuizPreview}
           onPublish={handlePublishQuiz}
         /> :
         activeTab === 'schedule' ? renderScheduleSessions() :
         activeTab === 'approvals' ? <Approvals /> :
         activeTab === 'course-library' ? renderCourseLibrary() :
         activeTab === 'analytics' ? renderAnalytics() :
         activeTab === 'settings' ? renderSettings() :
         renderOtherTabs()}

        {/* Profile Menu */}
        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileClose}
          PaperProps={{
            sx: { minWidth: 200 }
          }}
        >
          <MenuItem onClick={handleViewProfile}>
            <ListItemIcon>
              <AccountIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleManagePasswords}>
            <ListItemIcon>
              <LockIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Manage Passwords</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <CloseIcon fontSize="small" />
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
            sx: { width: 350, maxHeight: 400 },
          }}
        >
          <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #eee' }}>
            <Typography variant="h6" fontWeight="bold">Notifications</Typography>
          </Box>
          {notifications.length === 0 ? (
            <MenuItem disabled>No new notifications</MenuItem>
          ) : (
            notifications.map((notification) => (
              <MenuItem 
                key={notification.id} 
                onClick={() => handleNotificationAction(notification)}
                sx={{ 
                  backgroundColor: notification.read ? 'transparent' : '#e3f2fd',
                  '&:hover': {
                    backgroundColor: notification.read ? '#f5f5f5' : '#bbdefb',
                  },
                  display: 'flex',
                  alignItems: 'center',
                  whiteSpace: 'normal',
                  py: 1.5,
                }}
              >
                <ListItemIcon sx={{ color: getNotificationColor(notification.type), minWidth: 35 }}>
                  {getNotificationIcon(notification.type)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={notification.read ? 'normal' : 'bold'}>
                      {notification.message}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  }
                />
                {!notification.read && (
                  <Chip 
                    label="New" 
                    size="small" 
                    color="primary" 
                    sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                  />
                )}
              </MenuItem>
            ))
          )}
          <Divider />
          <MenuItem onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}>
            Mark all as read
          </MenuItem>
        </Menu>

        {/* Success Popup for Session Save */}
        <Dialog open={showSuccessPopup} onClose={() => setShowSuccessPopup(false)}>
          <DialogContent sx={{ textAlign: 'center', p: 4 }}>
            <Box display="flex" justifyContent="center" mb={2}>
              <CheckCircleIcon sx={{ fontSize: 60, color: '#10b981' }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              New session saved successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Your session has been saved and is ready to be scheduled.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => setShowSuccessPopup(false)}
              sx={{ backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669' } }}
            >
              OK
            </Button>
          </DialogContent>
        </Dialog>

        {/* Schedule Session Dialog */}
        <Dialog 
          open={showScheduleDialog} 
          onClose={() => setShowScheduleDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5" fontWeight="bold">
              Schedule Session
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Set date, time, and invite employees
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box mt={2}>
              {/* Session Details */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Session Title"
                    value={scheduleData.title}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, title: e.target.value }))}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Date"
                    type="date"
                    value={scheduleData.date}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, date: e.target.value }))}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Start Time"
                    type="time"
                    value={scheduleData.startTime}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, startTime: e.target.value }))}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="End Time"
                    type="time"
                    value={scheduleData.endTime}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, endTime: e.target.value }))}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    value={scheduleData.description}
                    onChange={(e) => setScheduleData(prev => ({ ...prev, description: e.target.value }))}
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                  />
                </Grid>
              </Grid>

              {/* Department Selection */}
              <Box mt={4}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Select Department to Invite
                </Typography>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Select Department</InputLabel>
                  <Select
                    value={selectedDepartment}
                    onChange={(e) => handleDepartmentSelection(e.target.value)}
                    label="Select Department"
                  >
                    {getDepartmentOptions().map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedDepartment && (
                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      {selectedDepartment === 'all' 
                        ? `All employees (${employees.length} total) will be invited`
                        : `${employees.filter(emp => emp.department === selectedDepartment).length} employees from ${selectedDepartment} department will be invited`
                      }
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleScheduleSubmit}
              sx={{ backgroundColor: '#3b82f6', '&:hover': { backgroundColor: '#2563eb' } }}
            >
              Schedule & Send Invites
            </Button>
          </DialogActions>
        </Dialog>

        {/* Schedule Success Popup */}
        <Dialog open={showScheduleSuccess} onClose={() => setShowScheduleSuccess(false)}>
          <DialogContent sx={{ textAlign: 'center', p: 4 }}>
            <Box display="flex" justifyContent="center" mb={2}>
              <CheckCircleIcon sx={{ fontSize: 60, color: '#10b981' }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Session scheduled successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              Email invitations have been sent to the selected department.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => setShowScheduleSuccess(false)}
              sx={{ backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669' } }}
            >
              OK
            </Button>
          </DialogContent>
        </Dialog>

        {/* App Selector Dialog */}
        <Dialog 
          open={showAppSelector} 
          onClose={() => setShowAppSelector(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Typography variant="h5" fontWeight="bold">
              Select Application
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose the application to open
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              {selectedAppType === 'presentation' && (
                <Box>
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    Open with:
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2} mt={2}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      onClick={() => handleAppOpen('PowerPoint')}
                      sx={{ py: 2 }}
                    >
                      Microsoft PowerPoint
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      onClick={() => handleAppOpen('Word')}
                      sx={{ py: 2 }}
                    >
                      Microsoft Word
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      onClick={() => handleAppOpen('Excel')}
                      sx={{ py: 2 }}
                    >
                      Microsoft Excel
                    </Button>
                  </Box>
                </Box>
              )}
              {selectedAppType === 'document' && (
                <Box>
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    Open with:
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2} mt={2}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      onClick={() => handleAppOpen('Word')}
                      sx={{ py: 2 }}
                    >
                      Microsoft Word
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      onClick={() => handleAppOpen('PowerPoint')}
                      sx={{ py: 2 }}
                    >
                      Microsoft PowerPoint
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      onClick={() => handleAppOpen('Excel')}
                      sx={{ py: 2 }}
                    >
                      Microsoft Excel
                    </Button>
                  </Box>
                </Box>
              )}
              {selectedAppType === 'video' && (
                <Box>
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    Open with:
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2} mt={2}>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      onClick={() => handleAppOpen('Video Editor')}
                      sx={{ py: 2 }}
                    >
                      Windows Photos (Video Editor)
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      onClick={() => alert('Please manually open your preferred video editing application.')}
                      sx={{ py: 2 }}
                    >
                      Other Video Editor
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAppSelector(false)}>
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </MainContent>
    </DashboardContainer>
  );
};

export default AdminDashboard;
