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
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Alert,
  CircularProgress,
  Snackbar,
  Popper
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
  ArrowForward as ArrowForwardIcon,
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Article as ArticleIcon,
  VideoLibrary as VideoLibraryIcon,
  Quiz as QuizIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  WarningAmber as WarningAmberIcon,
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
  AutoAwesome as AutoAwesomeIcon,
  Info as InfoIcon,
  UploadFile as UploadFileIcon,
  Event as EventIcon,
  Send as SendIcon,
  AccessTime as AccessTimeIcon,
  Today as TodayIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  Done as DoneIcon,
  Cancel as CancelIcon,
  CardMembership as CertificateIcon,
  EmojiEvents as AwardIcon,
  PlayCircleFilled as PlayCircleFilledIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import Analytics from './Analytics';
import Approvals from './Approvals';
import InteractiveQuiz from './InteractiveQuiz';
import SessionDetail from './SessionDetail';
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
  overflowX: 'visible',
  '&::-webkit-scrollbar': {
    display: 'none'
  },
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '& > *': {
    overflow: 'visible'
  }
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

// Custom Step Connector for Manage Session Progress Bar - will be defined inside renderManageSession

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Load saved page state from localStorage on mount
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const savedState = localStorage.getItem('admin_page_state');
      if (savedState) {
        const state = JSON.parse(savedState);
        return state.activeTab || 'dashboard';
      }
    } catch (error) {
      console.error('Error loading page state:', error);
    }
    return 'dashboard';
  });
  const [dateRangeFilter, setDateRangeFilter] = useState('all'); // 'all', '7days', '30days', 'custom'
  const [showCustomDateDialog, setShowCustomDateDialog] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [showContentCreator, setShowContentCreator] = useState(false);
  const [contentCreatorView, setContentCreatorView] = useState('main'); // 'main', 'ai-creator', 'creation-modes', 'upload-file', 'live-trainings'
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [sessionContentSnapshot, setSessionContentSnapshot] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [aiContentGenerated, setAiContentGenerated] = useState(false);
  const [aiKeywords, setAiKeywords] = useState('');
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [chatgptResponse, setChatgptResponse] = useState('');
  const [parsedContent, setParsedContent] = useState(null);
  const [showContentPreview, setShowContentPreview] = useState(false);
  // Toast notification state
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });
  const [selectedCreationMode, setSelectedCreationMode] = useState(null);

  // Show toast notification
  const showToast = (message, severity = 'info') => {
    setToast({ open: true, message, severity });
  };

  // Close toast
  const closeToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  }; // 'powerpoint', 'word', 'video'
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
  const [showCancelConfirmDialog, setShowCancelConfirmDialog] = useState(false);
  const [cancelCallback, setCancelCallback] = useState(null);
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

  const MAX_FILE_DATA_URL_SIZE = 2 * 1024 * 1024; // 2 MB cap for inline previews (reduced to prevent localStorage quota issues)

  const readFileAsDataUrl = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const createFileEntriesFromFiles = async (files) => {
    const results = [];
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      let dataUrl = null;
      
      // Check if it's a video file
      const fileType = file.type || '';
      const fileName = (file.name || '').toLowerCase();
      const isVideo = fileType.startsWith('video/') || 
                     fileName.endsWith('.mp4') || 
                     fileName.endsWith('.avi') || 
                     fileName.endsWith('.mov') ||
                     fileName.endsWith('.webm') ||
                     fileName.endsWith('.mkv');
      
      try {
        // Always read dataUrl for videos (regardless of size) so they can be played
        // For other files, only read if smaller than MAX_FILE_DATA_URL_SIZE
        if (isVideo || file.size <= MAX_FILE_DATA_URL_SIZE) {
          dataUrl = await readFileAsDataUrl(file);
        }
      } catch (error) {
        console.error('Failed to read file for preview:', file.name, error);
      }

      results.push({
        id: `${Date.now()}-${index}-${file.name}-${Math.random().toString(36).slice(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString(),
        lastModified: file.lastModified,
        dataUrl,
        fileObject: file,
      });
    }
    return results;
  };

  const serializeFilesForStorage = (files) => {
    return (files || []).map((file, idx) => {
      // Don't store data URLs in localStorage to prevent quota issues
      // Only store metadata - data URLs will be regenerated from file objects if needed
      const fileType = file.type || '';
      const fileName = (file.name || '').toLowerCase();
      const isVideo = fileType.startsWith('video/') || 
                     fileName.endsWith('.mp4') || 
                     fileName.endsWith('.avi') || 
                     fileName.endsWith('.mov') ||
                     fileName.endsWith('.webm') ||
                     fileName.endsWith('.mkv');
      
      const fileEntry = {
        id: file.id || `${file.name}-${file.size}-${file.uploadedAt || idx}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        uploadedAt: file.uploadedAt || new Date().toISOString(),
        lastModified: file.lastModified || Date.now(),
        // Store dataUrl for videos (always) and small files (< 500KB) to prevent quota issues
        // Videos need dataUrl to be playable, so we must store them
        dataUrl: isVideo ? (file.dataUrl || null) : (file.dataUrl && file.size < 500 * 1024) ? file.dataUrl : null,
      };
      return fileEntry;
    });
  };

  const deserializeFilesFromStorage = (files) => {
    // Convert stored file metadata back to file objects if needed
    // For now, just return as-is since we're storing metadata
    return files || [];
  };
  
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
    lockedAt: session.lockedAt || null
  });

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
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed.map(normalizePublishedSession) : [];
      } catch (error) {
        console.error('Failed to parse published sessions', error);
        return [];
      }
    }
    return [];
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
    status: 'all' // Changed from reviews to status
  });
  const [selectedLibrarySession, setSelectedLibrarySession] = useState(null);
  const [showSessionDetailsDialog, setShowSessionDetailsDialog] = useState(false);
  const [sessionViewMode, setSessionViewMode] = useState(null); // 'view', 'edit', 'reschedule'
  
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
  
  // Employee Management states
  const [showEmployeesSubmenu, setShowEmployeesSubmenu] = useState(false);
  const [employeesSubTab, setEmployeesSubTab] = useState('manage'); // 'manage' or 'add'
  const [employeesAnchorEl, setEmployeesAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  
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
  const [scheduleDueDate, setScheduleDueDate] = useState('');
  const [scheduleDueTime, setScheduleDueTime] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [scheduleView, setScheduleView] = useState('sessions'); // 'sessions' or 'certification'
  const [scheduleSessionsViewMode, setScheduleSessionsViewMode] = useState('list'); // 'list' or 'grid'
  const [scheduleSessionsSearchTerm, setScheduleSessionsSearchTerm] = useState('');
  
  // Certification Templates states
  const [certificationView, setCertificationView] = useState('templates'); // 'templates', 'configure', 'permissions'
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [fieldsSaved, setFieldsSaved] = useState(false);
  const [showCertificatePreview, setShowCertificatePreview] = useState(false);
  const [certificateFields, setCertificateFields] = useState({
    title: 'CERTIFICATE',
    subtitle: '-OF APPRECIATION-',
    recipientLabel: 'Presented to',
    descriptionText: 'who gave the best and completed the session',
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
  const [sessionCertifications, setSessionCertifications] = useState(() => {
    try {
      const stored = localStorage.getItem('session_certifications');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to parse stored session certifications', error);
      return {};
    }
  }); // { sessionId: certificationId }
  const [employeeCompletions, setEmployeeCompletions] = useState(() => {
    try {
      const stored = localStorage.getItem('employee_completed_sessions');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to parse employee completions', error);
      return [];
    }
  });
  
  // View All dialog states
  const [showViewAllDialog, setShowViewAllDialog] = useState(false);
  const [viewAllType, setViewAllType] = useState(null); // 'drafts', 'popular', 'newlyAdded'
  
  // Save draft and published sessions to localStorage
  // Helper function to clean up old localStorage data
  const cleanupOldData = (aggressive = false) => {
    try {
      let cleanedBytes = 0;
      
      // Clean up old draft sessions (keep only last 5 if aggressive, 10 otherwise)
      const drafts = localStorage.getItem('draft_sessions');
      if (drafts) {
        const parsed = JSON.parse(drafts);
        const keepCount = aggressive ? 5 : 10;
        if (parsed.length > keepCount) {
          const cleaned = parsed.slice(0, keepCount);
          const oldSize = drafts.length;
          localStorage.setItem('draft_sessions', JSON.stringify(cleaned));
          cleanedBytes += oldSize - JSON.stringify(cleaned).length;
          console.log(`Cleaned up ${parsed.length - keepCount} old draft sessions`);
        }
      }
      
      // Clean up old published sessions (remove completed ones older than 14 days if aggressive, 30 days otherwise)
      const published = localStorage.getItem('published_sessions');
      if (published) {
        const parsed = JSON.parse(published);
        const daysAgo = aggressive ? 14 : 30;
        const cutoffTime = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);
        const cleaned = parsed.filter(session => {
          // Keep active/in-progress sessions
          if (session.status && session.status !== 'completed') return true;
          // Keep recent completed sessions
          const completedAt = session.completedAt ? new Date(session.completedAt).getTime() : 0;
          return completedAt > cutoffTime;
        });
        if (cleaned.length < parsed.length) {
          const oldSize = published.length;
          localStorage.setItem('published_sessions', JSON.stringify(cleaned));
          cleanedBytes += oldSize - JSON.stringify(cleaned).length;
          console.log(`Cleaned up ${parsed.length - cleaned.length} old published sessions`);
        }
      }
      
      // Clean up old activities (keep only last 50 if aggressive, 100 otherwise)
      const activities = localStorage.getItem('admin_activities');
      if (activities) {
        const parsed = JSON.parse(activities);
        const keepCount = aggressive ? 50 : 100;
        if (parsed.length > keepCount) {
          const cleaned = parsed.slice(0, keepCount);
          const oldSize = activities.length;
          localStorage.setItem('admin_activities', JSON.stringify(cleaned));
          cleanedBytes += oldSize - JSON.stringify(cleaned).length;
          console.log(`Cleaned up ${parsed.length - keepCount} old activities`);
        }
      }
      
      // Clean up saved assessments (keep only last 10 if aggressive, 20 otherwise)
      const assessments = localStorage.getItem('saved_assessments');
      if (assessments) {
        try {
          const parsed = JSON.parse(assessments);
          // Check size first - if it's over 2MB, be more aggressive
          const dataSize = new Blob([assessments]).size;
          const isLarge = dataSize > 2 * 1024 * 1024; // 2MB
          const keepCount = isLarge ? 5 : (aggressive ? 10 : 20);
          
          if (parsed.length > keepCount || isLarge) {
            // Keep only the most recent assessments
            const cleaned = parsed.slice(0, keepCount);
            const oldSize = assessments.length;
            localStorage.setItem('saved_assessments', JSON.stringify(cleaned));
            cleanedBytes += oldSize - JSON.stringify(cleaned).length;
            console.log(`Cleaned up ${parsed.length - keepCount} old assessments. Reduced size from ${(dataSize / 1024 / 1024).toFixed(2)}MB to ${(new Blob([JSON.stringify(cleaned)]).size / 1024 / 1024).toFixed(2)}MB`);
          }
        } catch (error) {
          console.error('Error cleaning up assessments:', error);
          // If parsing fails, clear it entirely
          localStorage.removeItem('saved_assessments');
          console.log('Removed corrupted saved_assessments data');
        }
      }
      
      // Clean up saved sessions (keep only last 50 if aggressive, 100 otherwise)
      const savedSessions = localStorage.getItem('admin_saved_sessions');
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        const keepCount = aggressive ? 50 : 100;
        if (parsed.length > keepCount) {
          const cleaned = parsed.slice(0, keepCount);
          const oldSize = savedSessions.length;
          localStorage.setItem('admin_saved_sessions', JSON.stringify(cleaned));
          cleanedBytes += oldSize - JSON.stringify(cleaned).length;
          console.log(`Cleaned up ${parsed.length - keepCount} old saved sessions`);
        }
      }
      
      // Clean up old notifications (keep only last 50 if aggressive, 100 otherwise)
      const notifications = localStorage.getItem('admin_notifications');
      if (notifications) {
        const parsed = JSON.parse(notifications);
        const keepCount = aggressive ? 50 : 100;
        if (parsed.length > keepCount) {
          const cleaned = parsed.slice(0, keepCount);
          const oldSize = notifications.length;
          localStorage.setItem('admin_notifications', JSON.stringify(cleaned));
          cleanedBytes += oldSize - JSON.stringify(cleaned).length;
          console.log(`Cleaned up ${parsed.length - keepCount} old notifications`);
        }
      }
      
      // Clean up old session certifications (keep only last 100 if aggressive, 200 otherwise)
      const certifications = localStorage.getItem('session_certifications');
      if (certifications) {
        const parsed = JSON.parse(certifications);
        const keepCount = aggressive ? 100 : 200;
        if (parsed.length > keepCount) {
          const cleaned = parsed.slice(0, keepCount);
          const oldSize = certifications.length;
          localStorage.setItem('session_certifications', JSON.stringify(cleaned));
          cleanedBytes += oldSize - JSON.stringify(cleaned).length;
          console.log(`Cleaned up ${parsed.length - keepCount} old certifications`);
        }
      }
      
      if (cleanedBytes > 0) {
        console.log(`Total storage cleaned: ${(cleanedBytes / 1024).toFixed(2)} KB`);
      }
      
      return true;
    } catch (error) {
      console.error('Error during cleanup:', error);
      return false;
    }
  };

  // Helper function to safely set localStorage with quota error handling
  const safeSetLocalStorage = (key, value) => {
    try {
      const serialized = JSON.stringify(value);
      // Check if data is too large (localStorage limit is usually 5-10MB)
      if (serialized.length > 4 * 1024 * 1024) { // 4MB warning threshold
        console.warn(`Warning: ${key} data is large (${(serialized.length / 1024 / 1024).toFixed(2)}MB). Consider cleaning up old data.`);
        // Attempt cleanup before saving
        cleanupOldData();
      }
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.error(`localStorage quota exceeded for ${key}. Attempting aggressive cleanup...`);
        // Try aggressive cleanup first
        if (cleanupOldData(true)) {
          try {
            // Try again after aggressive cleanup
            localStorage.setItem(key, JSON.stringify(value));
            console.log(`Successfully saved ${key} after aggressive cleanup`);
            return true;
          } catch (retryError) {
            console.error(`Failed to save ${key} even after aggressive cleanup:`, retryError);
            // Try one more time with even more aggressive cleanup
            try {
              // Remove oldest 50% of data from each category
              const allKeys = Object.keys(localStorage);
              let totalCleaned = 0;
              for (const storageKey of allKeys) {
                if (storageKey.startsWith('admin_') || storageKey.includes('session') || storageKey.includes('assessment')) {
                  try {
                    const data = localStorage.getItem(storageKey);
                    if (data) {
                      const parsed = JSON.parse(data);
                      if (Array.isArray(parsed) && parsed.length > 10) {
                        const keepCount = Math.max(10, Math.floor(parsed.length * 0.5));
                        const cleaned = parsed.slice(0, keepCount);
                        localStorage.setItem(storageKey, JSON.stringify(cleaned));
                        totalCleaned += data.length - JSON.stringify(cleaned).length;
                      }
                    }
                  } catch (e) {
                    // Skip if can't parse
                  }
                }
              }
              if (totalCleaned > 0) {
                console.log(`Emergency cleanup freed ${(totalCleaned / 1024).toFixed(2)} KB`);
                localStorage.setItem(key, JSON.stringify(value));
                return true;
              }
            } catch (finalError) {
              console.error(`Final attempt failed:`, finalError);
            }
            const message = `Storage limit reached. The app has automatically cleaned up old data, but storage is still full. Please refresh the page to reload data or manually clear old sessions from the dashboard. Your current work will be saved in memory but may be lost on refresh.`;
            showToast(message, 'warning');
            return false;
          }
        } else {
          const message = `Storage limit reached. Unable to clean up automatically. Please refresh the page or clear browser storage manually. Your current work will be saved in memory but may be lost on refresh.`;
          showToast(message, 'warning');
          return false;
        }
      }
      console.error(`Failed to save ${key}:`, error);
      return false;
    }
  };

  useEffect(() => {
    safeSetLocalStorage('draft_sessions', draftSessions);
  }, [draftSessions]);

useEffect(() => {
  if (safeSetLocalStorage('published_sessions', publishedSessions)) {
    window.dispatchEvent(new Event('published-sessions-updated'));
  }
}, [publishedSessions]);

  // Run cleanup on mount, especially for large saved_assessments
  useEffect(() => {
    // Check for large saved_assessments and clean aggressively
    const assessments = localStorage.getItem('saved_assessments');
    if (assessments) {
      const dataSize = new Blob([assessments]).size;
      if (dataSize > 2 * 1024 * 1024) { // If over 2MB
        console.log('Large saved_assessments detected, running aggressive cleanup...');
        cleanupOldData(true); // Aggressive cleanup
      } else {
        cleanupOldData(); // Normal cleanup
      }
    } else {
      cleanupOldData(); // Normal cleanup
    }
  }, []);

  useEffect(() => {
    safeSetLocalStorage('saved_assessments', savedAssessments);
  }, [savedAssessments]);

  // Save activities to localStorage
  useEffect(() => {
    safeSetLocalStorage('admin_activities', activities);
  }, [activities]);

  useEffect(() => {
    if (safeSetLocalStorage('session_certifications', sessionCertifications)) {
      window.dispatchEvent(new Event('session-certifications-updated'));
    }
  }, [sessionCertifications]);

  useEffect(() => {
    const syncEmployeeCompletions = () => {
      try {
        const stored = localStorage.getItem('employee_completed_sessions');
        setEmployeeCompletions(stored ? JSON.parse(stored) : []);
      } catch (error) {
        console.error('Failed to sync employee completions', error);
      }
    };

    window.addEventListener('employee-completions-updated', syncEmployeeCompletions);
    window.addEventListener('storage', syncEmployeeCompletions);

    return () => {
      window.removeEventListener('employee-completions-updated', syncEmployeeCompletions);
      window.removeEventListener('storage', syncEmployeeCompletions);
    };
  }, []);
  
  // Store File objects separately in memory (not in localStorage)
  const [sessionFileObjects, setSessionFileObjects] = useState({});

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    // Create a serializable version of savedSessions (without File objects)
    const serializableSessions = savedSessions.map(session => ({
      ...session,
      files: session.files?.map(file => {
        if (!file) return file;

        if (file.fileObject) {
          // Preserve metadata and preview data but omit the File reference
          const {
            fileObject,
            ...rest
          } = file;
          return {
            ...rest,
            isFileObject: true,
          };
        }
        return file;
      })
    }));
    if (safeSetLocalStorage('admin_saved_sessions', serializableSessions)) {
    console.log('Saved sessions to localStorage:', serializableSessions);
    }
  }, [savedSessions]);

  // Save employees to localStorage whenever they change
  useEffect(() => {
    if (safeSetLocalStorage('admin_employees', employees)) {
    console.log('Saved employees to localStorage:', employees);
    }
  }, [employees]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (safeSetLocalStorage('admin_notifications', notifications)) {
    console.log('Saved notifications to localStorage:', notifications);
    }
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
    type: '',
    audience: '',
    description: ''
  });
  
  // Track skipped steps
  const [skippedSteps, setSkippedSteps] = useState(new Set());

  // Function to get date range based on filter
  const getDateRange = (filter) => {
    const now = new Date();
    const startDate = new Date();
    
    switch (filter) {
      case '7days':
        startDate.setDate(now.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
      case '30days':
        startDate.setDate(now.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          const start = new Date(customStartDate);
          start.setHours(0, 0, 0, 0);
          const end = new Date(customEndDate);
          end.setHours(23, 59, 59, 999);
          return { startDate: start, endDate: end };
        }
        return null; // If custom dates not set, don't filter
      default:
        return null; // 'all' - no date filter
    }
    
    return { startDate, endDate: now };
  };

  // Function to check if a date is within the filter range
  const isWithinDateRange = (dateString, filter) => {
    if (!dateString || filter === 'all') return true;
    const dateRange = getDateRange(filter);
    if (!dateRange) return true;
    const date = new Date(dateString);
    return date >= dateRange.startDate && date <= dateRange.endDate;
  };

  // Handle custom date range selection
  const handleCustomDateFilter = () => {
    setShowCustomDateDialog(true);
  };

  // Apply custom date filter
  const handleApplyCustomDate = () => {
    if (customStartDate && customEndDate) {
      setDateRangeFilter('custom');
      setShowCustomDateDialog(false);
    }
  };

  // Handle date filter change
  const handleDateRangeChange = (value) => {
    if (value === 'custom') {
      handleCustomDateFilter();
    } else {
      setDateRangeFilter(value);
    }
  };

  // Real-time metrics using useMemo
  const metrics = useMemo(() => {
    const filteredSessions = dateRangeFilter === 'all' 
      ? savedSessions 
      : savedSessions.filter(s => isWithinDateRange(s.createdAt, dateRangeFilter));
    
    const totalSessionsCreated = filteredSessions.length;
    const activeEmployees = employees.length;
    const upcomingSessions = filteredSessions.filter(s => s.status === 'scheduled').length;
    const totalActiveSessions = filteredSessions.filter(s => s.status === 'in_progress').length;

    return [
      { label: 'Total Sessions Created', value: totalSessionsCreated.toString(), color: '#3b82f6', icon: <BarChartIcon sx={{ color: '#3b82f6' }} /> },
      { label: 'Active Employees', value: activeEmployees.toString(), color: '#114417DB', icon: <PeopleIcon sx={{ color: '#114417DB' }} /> },
      { label: 'Upcoming Sessions', value: upcomingSessions.toString(), color: '#f59e0b', icon: <CalendarIcon sx={{ color: '#f59e0b' }} /> },
      { label: 'Total Active Sessions', value: totalActiveSessions.toString(), color: '#ef4444', icon: <PlayCircleFilledIcon sx={{ color: '#ef4444' }} /> }
    ];
  }, [savedSessions, employees, dateRangeFilter, customStartDate, customEndDate]);

  // Real-time session status data using useMemo
  const sessionStatusData = useMemo(() => {
    const filteredSessions = dateRangeFilter === 'all' 
      ? savedSessions 
      : savedSessions.filter(s => isWithinDateRange(s.createdAt, dateRangeFilter));
    
    const completedSessions = filteredSessions.filter(s => s.status === 'completed').length;
    const inProgressSessions = filteredSessions.filter(s => s.status === 'in_progress').length;
    const scheduledSessions = filteredSessions.filter(s => s.status === 'scheduled').length;
    const draftSessionsCount = filteredSessions.filter(s => s.status === 'draft').length;
    const totalSessionCount = filteredSessions.length;
    
    return [
      { label: 'All', value: totalSessionCount, percentage: 100 },
      { label: 'Scheduled', value: scheduledSessions, percentage: totalSessionCount > 0 ? Math.round((scheduledSessions / totalSessionCount) * 100) : 0 },
      { label: 'In Progress', value: inProgressSessions, percentage: totalSessionCount > 0 ? Math.round((inProgressSessions / totalSessionCount) * 100) : 0 },
      { label: 'Completed', value: completedSessions, percentage: totalSessionCount > 0 ? Math.round((completedSessions / totalSessionCount) * 100) : 0 },
      { label: 'Draft', value: draftSessionsCount, percentage: totalSessionCount > 0 ? Math.round((draftSessionsCount / totalSessionCount) * 100) : 0 }
    ];
  }, [savedSessions, dateRangeFilter, customStartDate, customEndDate]);

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

  // Auto-publish scheduled sessions when start time arrives
  useEffect(() => {
    const checkAndPublishSessions = () => {
      const now = new Date();
      
      setPublishedSessions(prev => {
        const sessionsToPublish = [];
        const updated = prev.map(session => {
          // Check if session is scheduled and start time has arrived
          if (session.status === 'scheduled' && session.scheduledDateTime) {
            const scheduledTime = new Date(session.scheduledDateTime);
            
            // Auto-publish if scheduled time has passed
            if (scheduledTime <= now && !session.publishedAt) {
              console.log(`Auto-publishing session: ${session.title} at ${now.toISOString()}`);
              sessionsToPublish.push(session);
              
              // Update session to published status
              return {
                ...session,
                status: 'published',
                publishedAt: now.toISOString(),
                isLocked: false
              };
            }
          }
          return session;
        });
        
        // Only update if there were changes
        const hasChanges = sessionsToPublish.length > 0;
        if (hasChanges) {
          safeSetLocalStorage('published_sessions', updated);
          window.dispatchEvent(new Event('published-sessions-updated'));
          
          // Log activity for auto-published sessions
          sessionsToPublish.forEach(session => {
            addActivity(
              `Session auto-published: ${session.title}`,
              'System',
              'published',
              'session_published'
            );
          });
        }
        
        return updated;
      });
    };

    // Check immediately on mount
    checkAndPublishSessions();

    // Check every minute for auto-publishing
    const intervalId = setInterval(checkAndPublishSessions, 60000); // 1 minute

    return () => clearInterval(intervalId);
  }, [publishedSessions]);

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
    const filtered = dateRangeFilter === 'all'
      ? activities
      : activities.filter(a => isWithinDateRange(a.timestamp, dateRangeFilter));
    
    return filtered
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
  }, [activities, currentTime, dateRangeFilter, customStartDate, customEndDate]);

  // Memoize top performers for Leader Board
  const topPerformers = useMemo(() => {
    // Calculate top performers directly from employees data
    return employees.slice(0, 5).map((employee, index) => ({
      id: employee.id,
      name: employee.name,
      department: employee.department,
      sessionsCompleted: Math.floor(Math.random() * 10) + 1,
      completionRate: Math.floor(Math.random() * 40) + 60,
      rank: index + 1,
      rankColor: index === 0 ? '#114417DB' : index === 1 ? '#f59e0b' : index === 2 ? '#ef4444' : '#6b7280'
    }));
  }, [employees]);

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
        return 'All Draft Sessions';
      case 'popular':
        return 'All Popular Sessions';
      case 'newlyAdded':
        return 'All Newly Added Sessions';
      default:
        return 'All Sessions';
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChartIcon /> },
    { id: 'manage-session', label: 'Manage sessions', icon: <LightbulbIcon /> },
    { id: 'course-library', label: 'Session Library', icon: <LibraryBooksIcon /> },
    { id: 'approvals', label: 'Approvals', icon: <CheckCircleIcon /> },
    { id: 'employees', label: 'Employee Management', icon: <GroupIcon /> },
    { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
  ];

  // Manage Session tab state (replacing submenu with tabs)
  const [manageSessionTab, setManageSessionTab] = useState(() => {
    try {
      const savedState = localStorage.getItem('admin_page_state');
      if (savedState) {
        const state = JSON.parse(savedState);
        return state.manageSessionTab || 'create';
      }
    } catch (error) {
      console.error('Error loading page state:', error);
    }
    return 'create';
  }); // 'create', 'content-creator', 'live-trainings', 'assessment', 'certification', 'preview', 'schedule'
  const [manageSessionView, setManageSessionView] = useState(() => {
    try {
      const savedState = localStorage.getItem('admin_page_state');
      if (savedState) {
        const state = JSON.parse(savedState);
        return state.manageSessionView || 'create';
      }
    } catch (error) {
      console.error('Error loading page state:', error);
    }
    return 'create';
  }); // Keep for backward compatibility, synced with manageSessionTab
  
  // Save page state to localStorage whenever it changes
  useEffect(() => {
    const pageState = {
      activeTab,
      manageSessionTab,
      manageSessionView
    };
    try {
      localStorage.setItem('admin_page_state', JSON.stringify(pageState));
    } catch (error) {
      console.error('Error saving page state:', error);
    }
  }, [activeTab, manageSessionTab, manageSessionView]);
  const [manageSessionsViewMode, setManageSessionsViewMode] = useState('list'); // 'list' or 'grid'
  const [manageSessionsSearchTerm, setManageSessionsSearchTerm] = useState('');

  const handleTabChange = (tab) => {
    console.log('handleTabChange called with tab:', tab);
    setActiveTab(tab);
    
    // Close modal overlays when switching to dashboard
    if (tab === 'dashboard') {
      setShowContentPreview(false);
      setShowSavedSessionsFolder(false);
      setShowPasswordManager(false);
      setShowProfile(false);
      setShowEditProfile(false);
    }
    
    // Reset manage session state when switching away from manage-session
    if (tab !== 'manage-session') {
        setManageSessionView(null);
      setManageSessionTab('create');
      // Reset other manage-session related states
      setShowContentCreator(false);
      setShowQuizForm(false);
      setShowContentPreview(false);
      setSelectedAllSessionItem(null);
      setShowPublishDialog(false);
      setSessionToPublish(null);
    } else {
      // When switching to manage-session, set default tab to 'create' if not set
      if (!manageSessionTab) {
        setManageSessionTab('create');
        setManageSessionView('create');
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
  };

  // Helper function to get the next step in the flow
  const getNextStep = (currentStep) => {
    const stepOrder = ['create', 'content-creator', 'assessment', 'certification', 'preview', 'schedule'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex >= 0 && currentIndex < stepOrder.length - 1) {
      return stepOrder[currentIndex + 1];
    }
    return currentStep; // If already at last step, stay there
  };

  // Helper function to get the previous step in the flow
  const getPreviousStep = (currentStep) => {
    const stepOrder = ['create', 'content-creator', 'assessment', 'certification', 'preview', 'schedule'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      return stepOrder[currentIndex - 1];
    }
    return currentStep; // If already at first step, stay there
  };

  // Handler for Previous button - moves to previous step
  const handlePreviousStep = () => {
    // Auto-save progress before navigating
    handleSaveAsDraft();
    
    const previousStep = getPreviousStep(manageSessionTab);
    setManageSessionTab(previousStep);
    setManageSessionView(previousStep);
    
    // Handle step-specific setup
    if (previousStep === 'create') {
      setShowContentCreator(false);
      setContentCreatorView('main');
    } else if (previousStep === 'content-creator') {
      setShowContentCreator(true);
      setContentCreatorView('main');
      setShowQuizForm(false);
      setManageSessionTab('content-creator');
      setManageSessionView('content-creator');
    } else if (previousStep === 'assessment') {
      setShowContentCreator(false);
      setShowQuizForm(true);
      setManageSessionTab('assessment');
      setManageSessionView('assessment');
    }
  };

  // Handler for Next button - moves to next step
  const handleNextStep = () => {
    // Validate create step before proceeding
    if (manageSessionTab === 'create') {
      if (!sessionFormData.title || !sessionFormData.type || !sessionFormData.audience) {
        showToast('Please fill in all required fields (Title, Session Type, and Participants)', 'error');
        return;
      }
    }
    
    // If on assessment step, ensure quiz is saved before proceeding
    if (manageSessionTab === 'assessment') {
      // If InteractiveQuiz is visible, it will handle saving via onSave callback
      // But we need to ensure currentQuizData is updated even if no questions exist
      const hasQuestions = currentQuizData?.quiz?.questions?.length > 0 || currentQuizData?.questions?.length > 0;
      if (!hasQuestions) {
        // Mark assessment as skipped
        setSkippedSteps(prev => new Set([...prev, 'assessment']));
      }
      // Save draft with current quiz data (even if empty)
      handleSaveAsDraft();
    } else {
      // Auto-save progress before navigating (saves as one draft)
      handleSaveAsDraft();
    }
    
    const nextStep = getNextStep(manageSessionTab);
    setManageSessionTab(nextStep);
    setManageSessionView(nextStep);
    
    // Handle step-specific setup
    if (nextStep === 'content-creator') {
      setShowContentCreator(true);
      setContentCreatorView('main');
    } else if (nextStep === 'assessment') {
      setShowContentCreator(false);
      setShowQuizForm(false);
    } else if (nextStep === 'certification') {
      setShowContentCreator(false);
      setShowQuizForm(false);
    } else if (nextStep === 'preview') {
      setShowContentCreator(false);
      setShowQuizForm(false);
    } else if (nextStep === 'schedule') {
      setShowContentCreator(false);
      setShowQuizForm(false);
      
      // Build current session from state
      const resolvedSessionForm = sessionContentSnapshot?.sessionForm || sessionFormData;
      const resolvedAiContent = sessionContentSnapshot?.aiContent ?? (aiContentGenerated ? { keywords: aiKeywords } : null);
      const resolvedFiles = sessionContentSnapshot?.files ?? mapFilesToMetadata(selectedFiles);
      const resolvedQuiz = currentQuizData?.quiz || null;
      const resolvedCreationMode = sessionContentSnapshot?.creationMode ?? selectedCreationMode;
      
      // Get certification if any
      const hasCertificate = selectedTemplate && fieldsSaved;
      const sessionCert = hasCertificate ? {
        id: 'preview-cert',
        name: selectedTemplate.name || 'Certificate',
        template: selectedTemplate,
        fields: certificateFields
      } : null;
      
      // Build session object for scheduling
      const currentSession = {
        id: Date.now(),
        title: resolvedSessionForm.title || 'Untitled Session',
        description: resolvedSessionForm.description || '',
        type: resolvedSessionForm.type || 'compliance',
        audience: resolvedSessionForm.audience || 'all',
        files: resolvedFiles,
        quiz: resolvedQuiz,
        aiContent: resolvedAiContent,
        creationMode: resolvedCreationMode,
        certificate: sessionCert,
        status: 'draft',
        createdAt: new Date().toISOString()
      };
      
      // Set as selected session for scheduling
      setSelectedSessionForScheduling(currentSession);
      
      // Prepopulate department based on audience
      // Map audience to department: 'all' -> 'all', others map to department if available
      const audienceToDepartment = {
        'all': 'all',
        'managers': 'all', // Default to all if specific department not found
        'developers': 'all',
        'hr': 'all'
      };
      
      // Try to find matching department from employees
      const audience = resolvedSessionForm.audience || 'all';
      let prepopulatedDepartment = audienceToDepartment[audience] || 'all';
      
      // If audience is not 'all', try to find a matching department
      if (audience !== 'all' && employees.length > 0) {
        const matchingDept = employees.find(emp => 
          emp.department && emp.department.toLowerCase().includes(audience.toLowerCase())
        );
        if (matchingDept) {
          prepopulatedDepartment = matchingDept.department;
        }
      }
      
      setSelectedDepartment(prepopulatedDepartment);
      setShowCalendar(true);
    }
  };

  // Handler for Skip button - moves to next step and marks current step as skipped
  const handleSkipToNextStep = () => {
    // Mark current step as skipped
    const stepOrder = ['create', 'content-creator', 'assessment', 'certification', 'preview', 'schedule'];
    const currentStepIndex = stepOrder.indexOf(manageSessionTab);
    if (currentStepIndex >= 0) {
      setSkippedSteps(prev => new Set([...prev, manageSessionTab]));
    }
    
    const nextStep = getNextStep(manageSessionTab);
    setManageSessionTab(nextStep);
    setManageSessionView(nextStep);
    
    // Handle step-specific setup
    if (nextStep === 'content-creator') {
      setShowContentCreator(true);
    } else if (nextStep === 'assessment') {
      setShowContentCreator(false);
      setShowQuizForm(false);
    } else if (nextStep === 'certification') {
      setShowContentCreator(false);
      setShowQuizForm(false);
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

  const handleClearAllSessions = () => {
    if (window.confirm('Are you sure you want to clear ALL sessions? This will delete:\n- All published sessions\n- All draft sessions\n- All saved assessments\n- Employee completion data\n- Session certifications\n\nThis action cannot be undone!')) {
      try {
        // Clear all session-related localStorage
        localStorage.removeItem('published_sessions');
        localStorage.removeItem('draft_sessions');
        localStorage.removeItem('saved_assessments');
        localStorage.removeItem('employee_completed_sessions');
        localStorage.removeItem('session_certifications');
        localStorage.removeItem('sessionRequests');
        
        // Reset state
        setPublishedSessions([]);
        setDraftSessions([]);
        setSavedAssessments([]);
        
        // Dispatch events to update other components
        window.dispatchEvent(new Event('published-sessions-updated'));
        window.dispatchEvent(new Event('employee-completions-updated'));
        window.dispatchEvent(new Event('session-certifications-updated'));
        
        showToast('All sessions have been cleared successfully!', 'success');
        
        // Log activity
        addActivity(
          'All sessions cleared',
          'Admin',
          'delete',
          'sessions_cleared'
        );
      } catch (error) {
        console.error('Error clearing sessions:', error);
        showToast('Error clearing sessions. Please try again.', 'error');
      }
    }
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
      showToast('Please fill in all fields', 'warning');
      return;
    }

    if (passwordData.currentPassword !== adminCredentials.password) {
      showToast('Current password is incorrect', 'error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast('Password must be at least 6 characters long', 'warning');
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

    showToast('Password updated successfully!', 'success');
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
      showToast('System maintenance details: Scheduled maintenance will occur from 11 PM to 1 AM EST.', 'info');
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
    // Validate required fields
    if (!sessionFormData.title || !sessionFormData.type || !sessionFormData.audience) {
      showToast('Please fill in all required fields (Title, Session Type, and Participants)', 'error');
      return;
    }
    
    // Initialize draftId if not already set (this ensures we use the same draft throughout)
    if (!sessionFormData.draftId) {
      const newDraftId = Date.now();
      setSessionFormData(prev => ({ ...prev, draftId: newDraftId }));
      // Save initial draft
      setTimeout(() => handleSaveAsDraft(), 100);
    }
    
    setShowContentCreator(true);
    // Update manageSessionTab to 'content-creator' to show progress in progress bar
    setManageSessionTab('content-creator');
    setManageSessionView('content-creator');
  };

  const handleContentCreatorCancel = () => {
    setActiveTab('course-library');
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
      showToast('Please generate content, create a file, or upload a file before proceeding.', 'warning');
      return;
    }
    
    // If coming from upload file page, go back to main content creator page
    if (contentCreatorView === 'upload-file') {
      setContentCreatorView('main');
      return;
    }
    
    // Show content preview, then navigate to quiz
    setShowContentPreview(true);
  };

  const handleProceedFromMainToQuiz = () => {
    // Check if there's content to proceed with
    const hasContent = selectedFiles.length > 0 || aiContentGenerated || selectedCreationMode;
    
    if (!hasContent) {
      showToast('Please generate content, create a file, or upload a file before proceeding.', 'warning');
      return;
    }
    
    // Navigate to Checkpoint Assessment view
    handleProceedToQuiz();
  };

  // Generate the prompt based on keywords
  const generatePrompt = () => {
    if (!aiKeywords.trim()) {
      showToast('Please enter keywords or topics to generate a prompt.', 'warning');
      return;
    }
    
    // Create a ChatGPT prompt for training content
    const prompt = `Create comprehensive training content for a learning session about: ${aiKeywords}

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
{
  "title": "Training Session Title",
  "description": "Detailed description...",
  "content": "Full structured content with sections...",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "learningObjectives": ["Objective 1", "Objective 2"]
}

Make the content professional, educational, and suitable for workplace training.`;
    
    // Store the generated prompt
    if (!sessionContentSnapshot) {
      setSessionContentSnapshot({
        aiContent: {
          keywords: aiKeywords,
          title: `Training Session: ${aiKeywords}`,
          description: `Content generation redirected to ChatGPT. Copy the generated content and paste it here when ready.`,
          content: prompt,
          keyPoints: [],
          learningObjectives: [],
          provider: 'chatgpt-redirect',
          generatedAt: new Date().toISOString()
        },
        sessionForm: { ...sessionFormData }
      });
    } else {
      setSessionContentSnapshot(prev => ({
        ...prev,
        aiContent: {
          keywords: aiKeywords,
          title: `Training Session: ${aiKeywords}`,
          description: `Content generation redirected to ChatGPT. Copy the generated content and paste it here when ready.`,
          content: prompt,
          keyPoints: [],
          learningObjectives: [],
          provider: 'chatgpt-redirect',
          generatedAt: new Date().toISOString()
        }
      }));
    }
    
    // Show the prompt
    setAiContentGenerated(true);
  };

  // Copy prompt and open ChatGPT
  const handleCopyAndOpenChatGPT = async () => {
    const prompt = sessionContentSnapshot?.aiContent?.content || '';
    
    if (!prompt) {
      showToast('Please generate a prompt first.', 'warning');
      return;
    }
    
    try {
      // Copy the prompt to clipboard
      await navigator.clipboard.writeText(prompt);
      
      // Open ChatGPT in a new tab
      const chatgptUrl = 'https://chat.openai.com/';
      window.open(chatgptUrl, '_blank');
      
      // Show success message
      setTimeout(() => {
        showToast('ChatGPT opened! Prompt copied to clipboard. Paste (Ctrl+V) into ChatGPT and press Enter.', 'success');
      }, 500);
      
    } catch (err) {
      // Fallback if clipboard API fails
      console.error('Failed to copy to clipboard:', err);
      
      // Open ChatGPT
      window.open('https://chat.openai.com/', '_blank');
      
      // Show prompt in toast as fallback
      setTimeout(() => {
        showToast('ChatGPT opened! Please copy and paste the prompt into ChatGPT.', 'info');
      }, 500);
    }
  };

  // Helper function to normalize questions from AI content to quiz format
  const normalizeAIQuestions = (aiQuestions) => {
    if (!Array.isArray(aiQuestions) || aiQuestions.length === 0) {
      return [];
    }

    return aiQuestions.map((q, index) => {
      // Handle different question formats
      const questionText = q.text || q.question || q.questionText || `Question ${index + 1}`;
      const questionType = q.type || 'multiple-choice';
      
      // Normalize options
      let options = [];
      if (Array.isArray(q.options)) {
        options = q.options.map(opt => {
          if (typeof opt === 'string') return opt;
          if (typeof opt === 'object' && opt.text) return opt.text;
          if (typeof opt === 'object' && opt.option) return opt.option;
          return String(opt);
        });
      } else if (q.choices && Array.isArray(q.choices)) {
        options = q.choices.map(choice => {
          if (typeof choice === 'string') return choice;
          if (typeof choice === 'object' && choice.text) return choice.text;
          return String(choice);
        });
      } else if (q.answers && Array.isArray(q.answers)) {
        options = q.answers.map(answer => {
          if (typeof answer === 'string') return answer;
          if (typeof answer === 'object' && answer.text) return answer.text;
          return String(answer);
        });
      }

      // Ensure at least one option
      if (options.length === 0) {
        options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
      }

      // Normalize correct answer
      let correctAnswer = undefined;
      let correctAnswers = [];
      
      if (q.correctAnswer !== undefined) {
        correctAnswer = Number(q.correctAnswer);
        correctAnswers = [correctAnswer];
      } else if (q.correct !== undefined) {
        correctAnswer = Number(q.correct);
        correctAnswers = [correctAnswer];
      } else if (Array.isArray(q.correctAnswers) && q.correctAnswers.length > 0) {
        correctAnswers = q.correctAnswers.map(c => Number(c)).filter(c => !isNaN(c));
        correctAnswer = correctAnswers.length > 0 ? correctAnswers[0] : undefined;
      } else if (q.correctIndex !== undefined) {
        correctAnswer = Number(q.correctIndex);
        correctAnswers = [correctAnswer];
      } else if (typeof q.answer === 'string' && options.length > 0) {
        // Try to find the correct answer by matching text
        const answerIndex = options.findIndex(opt => 
          opt.toLowerCase().trim() === q.answer.toLowerCase().trim()
        );
        if (answerIndex !== -1) {
          correctAnswer = answerIndex;
          correctAnswers = [answerIndex];
        }
      }

      // Validate correct answer is within bounds
      if (correctAnswer !== undefined && (correctAnswer < 0 || correctAnswer >= options.length)) {
        correctAnswer = undefined;
        correctAnswers = [];
      }

      return {
        id: q.id || index + 1,
        text: questionText,
        type: questionType,
        options: options,
        required: Boolean(q.required),
        hasImage: Boolean(q.hasImage),
        correctAnswer: correctAnswer,
        correctAnswers: correctAnswers
      };
    });
  };

  // Parse and process ChatGPT JSON response
  const handleProcessChatGPTResponse = () => {
    if (!chatgptResponse.trim()) {
      showToast('Please paste the JSON response from ChatGPT.', 'warning');
      return;
    }

    try {
      // Try to parse the JSON response
      let jsonData;
      
      // Remove markdown code blocks if present
      let cleanedResponse = chatgptResponse.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      jsonData = JSON.parse(cleanedResponse);
      
      // Helper function to convert content to string if it's an object
      const convertContentToString = (content) => {
        if (typeof content === 'string') {
          return content;
        } else if (typeof content === 'object' && content !== null) {
          // If content is an object, convert it to a formatted string
          return Object.entries(content)
            .map(([key, value]) => {
              const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              return `## ${formattedKey}\n\n${value || ''}\n`;
            })
            .join('\n');
        }
        return '';
      };
      
      const contentString = convertContentToString(jsonData.content);
      
      // Extract and normalize questions if they exist
      const aiQuestions = jsonData.questions || jsonData.questionnaire || jsonData.quiz || [];
      const normalizedQuestions = normalizeAIQuestions(aiQuestions);
      
      // Update the session content snapshot with parsed data
      if (!sessionContentSnapshot) {
        setSessionContentSnapshot({
          aiContent: {
            keywords: aiKeywords,
            title: jsonData.title || `Training Session: ${aiKeywords}`,
            description: jsonData.description || '',
            content: contentString,
            keyPoints: jsonData.keyPoints || [],
            learningObjectives: jsonData.learningObjectives || [],
            provider: 'chatgpt',
            generatedAt: new Date().toISOString(),
            rawResponse: jsonData,
            questions: normalizedQuestions // Store normalized questions
          },
          sessionForm: sessionFormData || {}
        });
      } else {
        setSessionContentSnapshot(prev => ({
          ...prev,
          aiContent: {
            keywords: aiKeywords,
            title: jsonData.title || `Training Session: ${aiKeywords}`,
            description: jsonData.description || '',
            content: contentString,
            keyPoints: jsonData.keyPoints || [],
            learningObjectives: jsonData.learningObjectives || [],
            provider: 'chatgpt',
            generatedAt: new Date().toISOString(),
            rawResponse: jsonData,
            questions: normalizedQuestions // Store normalized questions
          }
        }));
      }
      
      setParsedContent(jsonData);
      
      // Show success message with question count if questions were found
      if (normalizedQuestions.length > 0) {
        showToast(`Content parsed successfully! Found ${normalizedQuestions.length} question(s) that will be populated in the checkpoint assessment.`, 'success');
      } else {
        showToast('Content parsed successfully! The content is now ready to use in your session.', 'success');
      }
      
    } catch (error) {
      console.error('Error parsing JSON:', error);
      showToast(`Failed to parse JSON. Please make sure you copied the complete JSON response from ChatGPT. Error: ${error.message}`, 'error');
    }
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
    const contentMetadata = mapFilesToMetadata(selectedFiles);
    const snapshot = {
      aiContent: sessionContentSnapshot?.aiContent || (aiContentGenerated ? { keywords: aiKeywords } : null),
      creationMode: selectedCreationMode,
      files: contentMetadata,
    };
    setSessionContentSnapshot({
      ...snapshot,
      sessionForm: { ...sessionFormData },
    });
    
    // Check if AI content has questions and populate them
    const aiQuestions = sessionContentSnapshot?.aiContent?.questions || [];
    let quizData = {
      ...snapshot,
      timestamp: new Date().toISOString()
    };
    
    // If AI content has questions, populate them and clear old quiz data
    if (aiQuestions.length > 0) {
      console.log(`Found ${aiQuestions.length} questions from AI content. Populating checkpoint assessment.`);
      
      // Clear old quiz data and populate with AI questions
      quizData = {
        ...snapshot,
        timestamp: new Date().toISOString(),
        quiz: {
          title: 'Checkpoint Assessment',
          description: 'Assessment questions generated from AI content',
          questions: aiQuestions
        },
        questions: aiQuestions // Also set at root level for compatibility
      };
      
      showToast(`Populated ${aiQuestions.length} question(s) from AI content into checkpoint assessment.`, 'success');
    } else {
      // Clear old quiz data if no AI questions
      quizData = {
        ...snapshot,
        timestamp: new Date().toISOString()
      };
    }
    
    setCurrentQuizData(quizData);
    console.log('Navigation set: activeTab=manage-session, manageSessionTab=assessment');
  };

  const handleSaveQuizAsDraft = (quizData) => {
    // Update sessionFormData with quiz data if needed
    if (!sessionFormData.title && quizData.title) {
      setSessionFormData(prev => ({ ...prev, title: quizData.title }));
    }
    if (!sessionFormData.description && quizData.description) {
      setSessionFormData(prev => ({ ...prev, description: quizData.description }));
    }
    
    const resolvedAiContent = sessionContentSnapshot?.aiContent ?? currentQuizData?.aiContent ?? (aiContentGenerated ? { keywords: aiKeywords } : null);
    const resolvedCreationMode = sessionContentSnapshot?.creationMode ?? currentQuizData?.creationMode ?? selectedCreationMode;
    const resolvedFiles = sessionContentSnapshot?.files ?? mapFilesToMetadata(currentQuizData?.files || selectedFiles);

    setSessionContentSnapshot(prev => ({
      aiContent: resolvedAiContent,
      creationMode: resolvedCreationMode,
      files: resolvedFiles,
      sessionForm: { ...(prev?.sessionForm || {}), ...sessionFormData },
    }));

    // Update currentQuizData
    setCurrentQuizData({
      ...quizData,
      aiContent: resolvedAiContent,
      creationMode: resolvedCreationMode,
      files: resolvedFiles,
    });
    
    // Use the universal save as draft function
    handleSaveAsDraft();
    
    // Optionally navigate (commented out to allow continuing work)
    // setActiveTab('manage-session');
    // setManageSessionTab('all-sessions');
  };

  const handlePublishQuiz = (quizData) => {
    // Save session with quiz as ready to publish
    const publishedSession = {
      id: Date.now(),
      title: sessionFormData.title || quizData.title || 'Untitled Session',
      type: sessionFormData.type || 'compliance',
      audience: sessionFormData.audience || 'all',
      description: sessionFormData.description || quizData.description || '',
      files: serializeFilesForStorage(selectedFiles), // Ensure files are included
      quiz: quizData,
      aiContent: aiContentGenerated ? { keywords: aiKeywords } : null,
      creationMode: selectedCreationMode,
      status: 'published', // Change to published so employees can see it immediately
      createdAt: new Date().toISOString(),
      publishedAt: new Date().toISOString(),
      scheduledDate: null,
      scheduledTime: null,
      scheduledDateTime: null,
      dueDate: null,
      dueTime: null,
      dueDateTime: null,
      isLocked: false,
      approvalExpiresAt: null,
      lastApprovalDate: null,
      instructor: 'HR Team',
      duration: '60 minutes'
    };
    
    setPublishedSessions(prev => [normalizePublishedSession(publishedSession), ...prev]);
    
    // Log activity
    addActivity(
      `Session published: ${publishedSession.title}`,
      'Admin',
      'published',
      'session_published'
    );
    
    showToast('Session published successfully! It is now ready to schedule.', 'success');
    setCurrentQuizData(null);
    setShowQuizForm(false);
    // Navigate to Schedule step in manage section
    setActiveTab('manage-session');
    setManageSessionTab('schedule');
  };

  const handleQuizPreview = (quizData) => {
    // Show preview of quiz - could open a dialog or navigate to preview page
    showToast('Preview functionality - Quiz preview will open in a new window', 'info');
    // You can implement a preview modal here
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const entries = await createFileEntriesFromFiles(files);
    setSelectedFiles(prev => [...prev, ...entries]);

    // Log activity for file uploads
    const fileNames = entries.map(f => f.name).join(', ');
    addActivity(
      `Content uploaded: ${fileNames}`,
      'Admin',
      'upload',
      'content_uploaded'
    );

    // Reset input so same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleFileInputClick = () => {
    const inputId = contentCreatorView === 'upload-file' ? 'file-upload-input-main' : 'file-upload-input';
    const input = document.getElementById(inputId);
    if (input) {
      input.click();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (!files.length) return;

    const entries = await createFileEntriesFromFiles(files);
    setSelectedFiles(prev => [...prev, ...entries]);

    const fileNames = entries.map(f => f.name).join(', ');
    addActivity(
      `Content uploaded: ${fileNames}`,
      'Admin',
      'upload',
      'content_uploaded'
    );
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

  const mapFilesToMetadata = (files) => {
    if (!files || files.length === 0) return [];
    return files
      .filter(Boolean)
      .map((file, index) => {
        if (typeof file === 'string') {
          return {
            id: `${file}-${index}`,
            name: file,
            size: 0,
            type: 'unknown',
            uploadedAt: new Date().toISOString(),
            dataUrl: null,
          };
        }

        // Check if it's a video file
        const fileType = file.type || '';
        const fileName = (file.name || '').toLowerCase();
        const isVideo = fileType.startsWith('video/') || 
                       fileName.endsWith('.mp4') || 
                       fileName.endsWith('.avi') || 
                       fileName.endsWith('.mov') ||
                       fileName.endsWith('.webm') ||
                       fileName.endsWith('.mkv');
        
        // For videos, always preserve dataUrl if available
        // If file is a File object and is a video, try to get dataUrl from fileObject
        let dataUrl = file.dataUrl || null;
        
        // If no dataUrl but we have a File object (fileObject), try to get it
        if (!dataUrl && isVideo && file.fileObject && file.fileObject instanceof File) {
          // Note: This is synchronous - we can't await here, but fileObject might have been read already
          // The dataUrl should already be set during file upload via createFileEntriesFromFiles
        }
        
        // Also check if file has dataUrl in a different property
        if (!dataUrl && isVideo) {
          dataUrl = file.url || file.downloadUrl || file.link || null;
        }

        return {
          id: file.id || `${file.name}-${file.size}-${file.uploadedAt || index}`,
          name: file.name || 'File',
          size: file.size || 0,
          type: file.type || 'application/octet-stream',
          uploadedAt: file.uploadedAt || new Date().toISOString(),
          dataUrl: dataUrl,
          // Preserve other URL properties for fallback
          url: file.url || null,
          downloadUrl: file.downloadUrl || null,
          link: file.link || null,
        };
      });
  };

  // Universal Save as Draft function - saves current state from any page
  const handleSaveAsDraft = () => {
    // Determine if we have a title (from sessionFormData or generate one)
    const draftTitle = sessionFormData.title || 
                      (selectedFiles.length > 0 ? `Draft - ${selectedFiles[0].name}` : 'Untitled Session');
    
    // Get or create draftId - always use the same ID for the same session
    let existingDraftId = sessionFormData.draftId;
    
    // If no draftId exists, create one and set it
    if (!existingDraftId) {
      existingDraftId = Date.now();
      setSessionFormData(prev => ({ ...prev, draftId: existingDraftId }));
    }
    
    // Create resume state object with current progress
    const resumeState = {
      contentCreatorView: contentCreatorView,
      selectedFiles: serializeFilesForStorage(selectedFiles),
      aiContentGenerated: aiContentGenerated,
      aiKeywords: aiKeywords,
      selectedCreationMode: selectedCreationMode,
      showContentPreview: showContentPreview,
      sessionFormData: { ...sessionFormData, draftId: existingDraftId },
      currentQuizData: currentQuizData,
      activeTab: activeTab,
      manageSessionTab: manageSessionTab,
      selectedTemplate: selectedTemplate,
      certificateFields: certificateFields,
      fieldsSaved: fieldsSaved
    };

    const sessionId = existingDraftId;
    
    // Get existing draft to preserve createdAt
    const existingDraft = draftSessions.find(d => d.id === sessionId);
    
    const draftSession = {
      id: sessionId,
      title: draftTitle,
      type: sessionFormData.type || 'compliance',
      audience: sessionFormData.audience || 'all',
      description: sessionFormData.description || '',
      files: serializeFilesForStorage(selectedFiles),
      status: 'draft',
      createdAt: existingDraft?.createdAt || new Date().toISOString(),
      savedAt: new Date().toISOString(),
      resumeState: resumeState,
      aiContent: aiContentGenerated ? { keywords: aiKeywords, content: sessionContentSnapshot?.aiContent?.content } : sessionContentSnapshot?.aiContent || null,
      creationMode: selectedCreationMode,
      quiz: currentQuizData?.quiz || currentQuizData || null,
      certificate: (selectedTemplate && fieldsSaved) ? {
        id: 'preview-cert',
        name: selectedTemplate.name || 'Certificate',
        template: selectedTemplate,
        fields: certificateFields
      } : null,
      draftId: existingDraftId // Store draftId for consistency
    };

    // Update or add to draft sessions - always update the same draft, don't create new ones
    setDraftSessions(prev => {
      const filtered = prev.filter(d => d.id !== sessionId);
      const updated = [draftSession, ...filtered];
      safeSetLocalStorage('draft_sessions', updated);
      return updated;
    });

    // Store File objects separately in memory for restoration
    if (selectedFiles.length > 0) {
      setSessionFileObjects(prev => ({
        ...prev,
        [sessionId]: selectedFiles
      }));
    }

    // Also update savedSessions for compatibility
    setSavedSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      return [draftSession, ...filtered];
    });

    // Don't log activity every time to avoid noise - only log on initial creation
    if (!existingDraft) {
      addActivity(
        `Draft saved: ${draftTitle}`,
        'Admin',
        'draft',
        'session_saved'
      );
    }

    // Don't show toast here - only show when cancelled
  };

  const handleSaveSession = () => {
    // Use the universal save as draft function
    handleSaveAsDraft();
    
    // Optionally reset and navigate (commented out to allow continuing work)
    // setShowContentCreator(false);
    // setShowSavedSessionsFolder(true);
  };

  // Resume/Edit Draft function - restores state and navigates to where user left off
  const handleResumeDraft = (draftSession) => {
    if (!draftSession.resumeState) {
      // Fallback: if no resumeState, start from content creator main
      setContentCreatorView('main');
      setShowContentCreator(true);
      setActiveTab('manage-session');
      setManageSessionTab('content-creator');
      return;
    }

    const resumeState = draftSession.resumeState;
    
    // Restore session form data
    if (resumeState.sessionFormData) {
      setSessionFormData({
        ...resumeState.sessionFormData,
        draftId: draftSession.id // Keep track of draft ID for updates
      });
    }

    // Restore file objects if available
    if (resumeState.selectedFiles && resumeState.selectedFiles.length > 0) {
      const restoredFiles = resumeState.selectedFiles.map((fileInfo, index) => {
        const baseMetadata = {
          id: fileInfo.id || `${fileInfo.name}-${fileInfo.size}-${fileInfo.uploadedAt || index}`,
          name: fileInfo.name,
          size: fileInfo.size,
          type: fileInfo.type || 'application/octet-stream',
          uploadedAt: fileInfo.uploadedAt || new Date().toISOString(),
          lastModified: fileInfo.lastModified || Date.now(),
          dataUrl: fileInfo.dataUrl || null,
          fileObject: null,
        };

        // Try to restore from sessionFileObjects if available
        const storedFiles = sessionFileObjects[draftSession.id];
        if (storedFiles && storedFiles.length > 0) {
          const matchingFile = storedFiles.find(f => f.name === fileInfo.name && f.size === fileInfo.size);
          if (matchingFile) {
            return {
              ...baseMetadata,
              dataUrl: matchingFile.dataUrl || baseMetadata.dataUrl,
              fileObject: matchingFile.fileObject || null,
            };
          }
        }

        // Attempt to rebuild from dataUrl if available
        if (baseMetadata.dataUrl) {
          try {
            const [header, data] = baseMetadata.dataUrl.split(',');
            const mimeMatch = header.match(/data:(.*?);base64/);
            const mimeType = mimeMatch ? mimeMatch[1] : baseMetadata.type;
            const binary = atob(data);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i += 1) {
              bytes[i] = binary.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: mimeType });
            const file = typeof File !== 'undefined'
              ? new File([blob], baseMetadata.name, { type: mimeType, lastModified: baseMetadata.lastModified })
              : blob;
            return {
              ...baseMetadata,
              type: mimeType,
              fileObject: file,
            };
          } catch (error) {
            console.warn('Unable to recreate file from dataUrl', error);
          }
        }

        return baseMetadata;
      }).filter(Boolean); // Remove any null/undefined entries
      setSelectedFiles(restoredFiles);
      
      // Store in sessionFileObjects for future use
      if (restoredFiles.length > 0) {
        setSessionFileObjects(prev => ({
          ...prev,
          [draftSession.id]: restoredFiles
        }));
      }
    }

    // Restore AI content state
    if (resumeState.aiContentGenerated) {
      setAiContentGenerated(true);
      setAiKeywords(resumeState.aiKeywords || '');
    }

    // Restore creation mode
    if (resumeState.selectedCreationMode) {
      setSelectedCreationMode(resumeState.selectedCreationMode);
    }

    // Restore quiz data if available
    if (resumeState.currentQuizData || draftSession.quiz) {
      setCurrentQuizData(resumeState.currentQuizData || draftSession.quiz);
    }

    // Restore content preview state
    if (resumeState.showContentPreview) {
      setShowContentPreview(true);
    }

    // Navigate to the appropriate view
    setActiveTab(resumeState.activeTab || 'manage-session');
    setManageSessionTab(resumeState.manageSessionTab || 'content-creator');
    
    // Navigate to the specific content creator view
    if (resumeState.contentCreatorView) {
      setContentCreatorView(resumeState.contentCreatorView);
      setShowContentCreator(true);
    } else if (resumeState.showContentPreview) {
      setShowContentPreview(true);
      setShowContentCreator(true);
    } else if (resumeState.currentQuizData || draftSession.quiz) {
      // If quiz was started, go to assessment tab
      setManageSessionTab('assessment');
      setShowContentCreator(false);
    } else {
      // Default to content creator main
      setContentCreatorView('main');
      setShowContentCreator(true);
    }

    // Close any dialogs
    setShowViewAllDialog(false);
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
    const resolvedSessionForm = sessionContentSnapshot?.sessionForm || sessionFormData;
    const resolvedAiContent = sessionContentSnapshot?.aiContent ?? currentQuizData?.aiContent ?? (aiContentGenerated ? { keywords: aiKeywords } : null);
    const resolvedCreationMode = sessionContentSnapshot?.creationMode ?? currentQuizData?.creationMode ?? selectedCreationMode;
    const resolvedFiles = sessionContentSnapshot?.files ?? mapFilesToMetadata(currentQuizData?.files || selectedFiles);

    // Build quiz object with all questions
    const quizWithContent = {
      ...quizData,
      quiz: {
        title: quizData.title || quizData.assessmentInfo?.quizTitle,
        description: quizData.description,
        questions: quizData.questions || [],
        passingScore: quizData.assessmentInfo?.passingScore,
        maxAttempts: quizData.assessmentInfo?.maxAttempts
      },
      aiContent: resolvedAiContent,
      creationMode: resolvedCreationMode,
      files: resolvedFiles,
    };

    setCurrentQuizData(quizWithContent);
    setSessionContentSnapshot({
      aiContent: resolvedAiContent,
      creationMode: resolvedCreationMode,
      files: resolvedFiles,
      sessionForm: { ...resolvedSessionForm },
    });

    // Save as draft immediately to ensure questions are saved
    handleSaveAsDraft();
    
    // Note: We no longer create separate savedAssessments here
    // The quiz data is stored in the draft session via handleSaveAsDraft
    
    // Log activity
    addActivity(
      `Assessment saved: ${resolvedSessionForm.title || quizData.title || quizData.assessmentInfo?.quizTitle || 'Untitled Session'}`,
      'Admin',
      'quiz',
      'quiz_created'
    );
    
    // Navigate to Certification step
    setActiveTab('manage-session');
    setManageSessionTab('certification');
    setManageSessionView('certification');
    setShowQuizForm(false);
    setShowContentPreview(false);
    setShowContentCreator(false);
    setSelectedAllSessionItem(null);
    setShowPublishDialog(false);
    setSessionToPublish(null);
  };

  const handleQuizSkip = () => {
    // Navigate to Certification step
    setManageSessionTab('certification');
    setManageSessionView('certification');
    setActiveTab('manage-session');
  };

  const handleQuizCancel = () => {
    // Show confirmation dialog before canceling
    setCancelCallback(() => () => {
    setShowQuizForm(false);
    // Reset manage session view state
    if (manageSessionView === 'assessment') {
      // If coming from Content Creator flow, go back to content creator
        if (showContentCreator || currentQuizData || sessionContentSnapshot) {
        setManageSessionView('content-creator');
          setManageSessionTab('content-creator');
        setShowContentCreator(true);
        setContentCreatorView('main');
      } else {
        // Otherwise, go back to dashboard
          setActiveTab('course-library');
        setManageSessionView(null);
    }
    }
    setCurrentQuizData(null);
      setShowCancelConfirmDialog(false);
      setCancelCallback(null);
    });
    setShowCancelConfirmDialog(true);
  };

  const handleConfirmCancel = () => {
    // Save draft before canceling
    handleSaveAsDraft();
    // Show toast only when cancelled
    showToast('Draft saved successfully!', 'success');
    if (cancelCallback) {
      cancelCallback();
    }
  };

  const handleDismissCancel = () => {
    setShowCancelConfirmDialog(false);
    setCancelCallback(null);
  };

  // Soft delete session
  const handleSoftDeleteSession = (session) => {
    if (!session || !session.id) return;
    
    // Mark as deleted (soft delete)
    const updatedSession = {
      ...session,
      status: 'deleted',
      deletedAt: new Date().toISOString()
    };
    
    // Update in appropriate list and remove from dashboard
    if (session.status === 'draft' || !session.status) {
      setDraftSessions(prev => prev.filter(s => s.id !== session.id));
    } else if (session.status === 'published' || session.status === 'scheduled') {
      setPublishedSessions(prev => prev.filter(s => s.id !== session.id));
    } else if (session.status === 'saved') {
      setSavedAssessments(prev => prev.filter(s => s.id !== session.id));
    }
    
    // Also remove from saved sessions
    setSavedSessions(prev => prev.filter(s => s.id !== session.id));
    
    // Persist to localStorage
    try {
      const published = publishedSessions.filter(s => s.id !== session.id);
      safeSetLocalStorage('published_sessions', published);
      const drafts = draftSessions.filter(s => s.id !== session.id);
      safeSetLocalStorage('draft_sessions', drafts);
      const saved = savedSessions.filter(s => s.id !== session.id);
      safeSetLocalStorage('admin_saved_sessions', saved);
    } catch (error) {
      console.error('Error updating localStorage after delete:', error);
    }
    
    // Log activity
    addActivity(
      `Session deleted: ${session.title}`,
      'Admin',
      'deleted',
      'session_deleted'
    );
    
    showToast('Session deleted successfully', 'success');
    setShowSessionDetailsDialog(false);
    setSelectedLibrarySession(null);
  };

  // Save edited session
  const handleSaveEditedSession = (session) => {
    if (!session || !session.id) return;
    
    // Check if start date has passed
    const startDateTime = session.scheduledDateTime 
      ? new Date(session.scheduledDateTime)
      : null;
    const now = new Date();
    
    if (startDateTime && startDateTime <= now) {
      showToast('Cannot edit session after start date/time', 'error');
      return;
    }
    
    // Navigate to edit mode in manage session
    setActiveTab('manage-session');
    setManageSessionTab('create');
    setManageSessionView('create');
    
    // Load session data for editing
    if (session.resumeState) {
      // Restore from resume state
      const resumeState = session.resumeState;
      setSessionFormData(resumeState.sessionFormData || {});
      setSelectedFiles(deserializeFilesFromStorage(resumeState.selectedFiles || []));
      setAiContentGenerated(resumeState.aiContentGenerated || false);
      setAiKeywords(resumeState.aiKeywords || '');
      setSelectedCreationMode(resumeState.selectedCreationMode || null);
      setCurrentQuizData(resumeState.currentQuizData || null);
      setContentCreatorView(resumeState.contentCreatorView || 'main');
      setManageSessionTab(resumeState.manageSessionTab || 'create');
    } else {
      // Load from session data
      setSessionFormData({
        title: session.title || '',
        type: session.type || '',
        audience: session.audience || '',
        description: session.description || ''
      });
      setSelectedFiles(deserializeFilesFromStorage(session.files || []));
      setCurrentQuizData(session.quiz || null);
      setSelectedCreationMode(session.creationMode || null);
    }
    
    setShowSessionDetailsDialog(false);
    setSelectedLibrarySession(null);
    setSessionViewMode(null);
    showToast('Session loaded for editing', 'success');
  };

  // Reschedule session
  const handleRescheduleSession = (session) => {
    if (!session || !session.id) return;
    
    // Navigate to schedule step
    setActiveTab('manage-session');
    setManageSessionTab('schedule');
    setManageSessionView('schedule');
    
    // Load session data
    setSelectedSessionForScheduling(session);
    setScheduleDate(session.scheduledDate || '');
    setScheduleTime(session.scheduledTime || '');
    setScheduleDueDate(session.dueDate || '');
    setScheduleDueTime(session.dueTime || '');
    setSelectedDepartment(session.audience === 'all' ? 'all' : '');
    setShowCalendar(true);
    
    setShowSessionDetailsDialog(false);
    setSelectedLibrarySession(null);
    setSessionViewMode(null);
    showToast('Session loaded for rescheduling', 'success');
  };

  // Render session view mode (read-only) - Show all stages
  const renderSessionViewMode = (session) => {
    if (!session) return null;
    
    const steps = [
      { label: 'Create New Session', value: 'create', completed: !!(session.title && session.type && session.audience) },
      { label: 'Content Creator', value: 'content-creator', completed: !!(session.files?.length > 0 || session.aiContent || session.creationMode) },
      { label: 'Checkpoint Assessment', value: 'assessment', completed: !!(session.quiz || session.questions?.length > 0) },
      { label: 'Certification', value: 'certification', completed: !!(session.certificate) },
      { label: 'Preview Session', value: 'preview', completed: true },
      { label: 'Schedule', value: 'schedule', completed: !!(session.scheduledDateTime || session.scheduledDate) }
    ];
    
    return (
      <Box>
        <Typography variant="h6" fontWeight="bold" mb={3} sx={{ color: '#114417DB' }}>
          Session Details (View Only)
        </Typography>
        
        {/* Progress Steps */}
        <Card sx={{ p: 3, mb: 3, backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <Typography variant="subtitle1" fontWeight="bold" mb={2} sx={{ color: '#114417DB' }}>
            Session Creation Stages
          </Typography>
          <Stepper orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.value} active={step.completed} completed={step.completed}>
                <StepLabel
                  StepIconComponent={(props) => (
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: step.completed ? '#114417DB' : '#e5e7eb',
                        color: step.completed ? 'white' : '#6b7280',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.875rem'
                      }}
                    >
                      {step.completed ? <CheckCircleIcon sx={{ fontSize: 20 }} /> : index + 1}
                    </Box>
                  )}
                >
                  <Typography variant="body1" fontWeight={step.completed ? 600 : 400}>
                    {step.label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Card>
        
        {/* Stage 1: Create New Session */}
        <Card sx={{ p: 3, mb: 3, backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <CheckCircleIcon sx={{ color: '#114417DB' }} />
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#114417DB' }}>
              Stage 1: Create New Session
            </Typography>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Title
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {session.title || 'Untitled Session'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Type
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {session.type || 'Not specified'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Participants
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {session.audience === 'all' ? 'All Employees' :
                 session.audience === 'managers' ? 'Managers Only' :
                 session.audience === 'developers' ? 'Developers' :
                 session.audience === 'hr' ? 'HR Team' :
                 session.audience || 'Not specified'}
              </Typography>
            </Grid>
            {session.description && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">
                  {session.description}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Card>

        {/* Stage 2: Content Creator */}
        {(session.files?.length > 0 || session.quiz || session.aiContent || session.creationMode) && (
          <Card sx={{ p: 3, mb: 3, backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <CheckCircleIcon sx={{ color: '#114417DB' }} />
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#114417DB' }}>
                Stage 2: Content Creator
              </Typography>
            </Box>
            {session.files && session.files.length > 0 && (
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Uploaded Files ({session.files.length})
                </Typography>
                <List dense>
                  {session.files.map((file, index) => {
                    const fileObj = typeof file === 'string' ? { name: file } : file;
                    const fileSize = fileObj.size ? (fileObj.size / 1024).toFixed(2) + ' KB' : 'Unknown size';
                    const fileType = fileObj.type || fileObj.name?.split('.').pop()?.toUpperCase() || 'Unknown';
                    const uploadedDate = fileObj.uploadedAt ? new Date(fileObj.uploadedAt).toLocaleDateString() : 'Unknown date';
                    
                    return (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <FileIcon />
                        </ListItemIcon>
                        <ListItemText 
                          primary={fileObj.name || `File ${index + 1}`}
                          secondary={`Type: ${fileType} | Size: ${fileSize} | Uploaded: ${uploadedDate}`}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            )}
            {session.aiContent && (
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  AI Generated Content
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Keywords
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {session.aiContent.keywords || 'N/A'}
                    </Typography>
                  </Grid>
                  {session.aiContent.title && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Title
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {session.aiContent.title}
                      </Typography>
                    </Grid>
                  )}
                  {session.aiContent.keyPoints && session.aiContent.keyPoints.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Key Points
                      </Typography>
                      <List dense>
                        {session.aiContent.keyPoints.map((point, idx) => (
                          <ListItem key={idx}>
                            <ListItemText primary={`• ${point}`} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  )}
                  {session.aiContent.learningObjectives && session.aiContent.learningObjectives.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Learning Objectives
                      </Typography>
                      <List dense>
                        {session.aiContent.learningObjectives.map((objective, idx) => (
                          <ListItem key={idx}>
                            <ListItemText primary={`• ${objective}`} />
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  )}
                  {session.aiContent.content && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Content
                      </Typography>
                      <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1, maxHeight: 300, overflowY: 'auto' }}>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                          {session.aiContent.content}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
            {session.creationMode && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Creation Mode
                </Typography>
                <Typography variant="body1">
                  {session.creationMode}
                </Typography>
              </Box>
            )}
          </Card>
        )}

        {/* Stage 3: Checkpoint Assessment */}
        {(session.quiz || session.questions?.length > 0) ? (
          <Card sx={{ p: 3, mb: 3, backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <CheckCircleIcon sx={{ color: '#114417DB' }} />
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#114417DB' }}>
                Stage 3: Checkpoint Assessment
              </Typography>
            </Box>
            {session.quiz && (
              <>
                <Grid container spacing={2} mb={3}>
                  {session.quiz.title && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Assessment Title
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {session.quiz.title}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Questions
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {session.quiz.questions?.length || session.questions?.length || 0} questions
                    </Typography>
                  </Grid>
                  {session.quiz.passingScore && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Passing Score
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {session.quiz.passingScore}%
                      </Typography>
                    </Grid>
                  )}
                  {session.quiz.maxAttempts && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Max Attempts
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {session.quiz.maxAttempts}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
                
                {/* Show Questions Details */}
                {(session.quiz.questions?.length > 0 || session.questions?.length > 0) && (
                  <Box>
                    <Typography variant="body2" fontWeight="bold" color="text.secondary" gutterBottom mb={2}>
                      Questions:
                    </Typography>
                    {(session.quiz.questions || session.questions || []).map((question, qIndex) => (
                      <Card key={qIndex} sx={{ p: 2, mb: 2, backgroundColor: '#f8f9fa' }}>
                        <Typography variant="body1" fontWeight="medium" mb={1}>
                          {qIndex + 1}. {question.question || question.text || 'Question'}
                        </Typography>
                        {question.options && question.options.length > 0 && (
                          <Box ml={2} mt={1}>
                            {question.options.map((option, oIndex) => (
                              <Typography 
                                key={oIndex} 
                                variant="body2" 
                                sx={{ 
                                  color: question.correctAnswer === oIndex || question.correctAnswer === option ? '#114417DB' : 'text.primary',
                                  fontWeight: question.correctAnswer === oIndex || question.correctAnswer === option ? 'bold' : 'normal'
                                }}
                              >
                                {String.fromCharCode(65 + oIndex)}. {option}
                                {(question.correctAnswer === oIndex || question.correctAnswer === option) && ' ✓'}
                              </Typography>
                            ))}
                          </Box>
                        )}
                        {question.type && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                            Type: {question.type}
                          </Typography>
                        )}
                      </Card>
                    ))}
                  </Box>
                )}
              </>
            )}
          </Card>
        ) : (
          <Card sx={{ p: 3, mb: 3, backgroundColor: '#fff3cd', border: '1px solid #ffc107' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <WarningAmberIcon sx={{ color: '#ffc107' }} />
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#856404' }}>
                Stage 3: Checkpoint Assessment (Skipped)
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              No assessment was created for this session.
            </Typography>
          </Card>
        )}

        {/* Stage 4: Certification */}
        {session.certificate ? (
          <Card sx={{ p: 3, mb: 3, backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <CheckCircleIcon sx={{ color: '#114417DB' }} />
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#114417DB' }}>
                Stage 4: Certification
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Certificate Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {session.certificate.name || 'Certificate'}
                </Typography>
              </Grid>
              {session.certificate.template && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Template
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {session.certificate.template.name || 'Template'}
                  </Typography>
                </Grid>
              )}
              {session.certificate.fields && Object.keys(session.certificate.fields).length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Certificate Fields
                  </Typography>
                  <Box sx={{ p: 2, backgroundColor: '#f8f9fa', borderRadius: 1 }}>
                    {Object.entries(session.certificate.fields).map(([key, value]) => (
                      <Box key={key} mb={1}>
                        <Typography variant="body2" component="span" fontWeight="medium">
                          {key}: 
                        </Typography>
                        <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                          {value || 'Not set'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          </Card>
        ) : (
          <Card sx={{ p: 3, mb: 3, backgroundColor: '#fff3cd', border: '1px solid #ffc107' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <WarningAmberIcon sx={{ color: '#ffc107' }} />
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#856404' }}>
                Stage 4: Certification (Not Configured)
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              No certificate was configured for this session.
            </Typography>
          </Card>
        )}

        {/* Stage 5: Schedule */}
        {(session.scheduledDateTime || session.scheduledDate) && (
          <Card sx={{ p: 3, mb: 3, backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <CheckCircleIcon sx={{ color: '#114417DB' }} />
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#114417DB' }}>
                Stage 5: Schedule
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Start Date & Time
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {session.scheduledDateTime 
                    ? new Date(session.scheduledDateTime).toLocaleString()
                    : session.scheduledDate && session.scheduledTime
                    ? `${new Date(session.scheduledDate).toLocaleDateString()} ${session.scheduledTime}`
                    : 'Not scheduled'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  End Date & Time
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {session.dueDateTime 
                    ? new Date(session.dueDateTime).toLocaleString()
                    : session.dueDate && session.dueTime
                    ? `${new Date(session.dueDate).toLocaleDateString()} ${session.dueTime}`
                    : 'Not set'}
                </Typography>
              </Grid>
            </Grid>
          </Card>
        )}
      </Box>
    );
  };

  // Render session edit mode
  const renderSessionEditMode = (session) => {
    if (!session) return null;
    
    return (
      <Box>
        <Typography variant="h6" fontWeight="bold" mb={3} sx={{ color: '#114417DB' }}>
          Edit Session
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          You can edit all sections of the session before the start date and time.
        </Typography>
        <Button
          variant="contained"
          onClick={() => handleSaveEditedSession(session)}
          sx={{
            backgroundColor: '#114417DB',
            '&:hover': { backgroundColor: '#0a2f0e' }
          }}
        >
          Open in Edit Mode
        </Button>
      </Box>
    );
  };

  // Render session reschedule mode
  const renderSessionRescheduleMode = (session) => {
    if (!session) return null;
    
    return (
      <Box>
        <Typography variant="h6" fontWeight="bold" mb={3} sx={{ color: '#114417DB' }}>
          Reschedule Session
        </Typography>
        
        <Card sx={{ p: 3, backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={scheduleDate || session.scheduledDate || ''}
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Time"
                type="time"
                value={scheduleTime || session.scheduledTime || ''}
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={scheduleDueDate || session.dueDate || ''}
                onChange={(e) => setScheduleDueDate(e.target.value)}
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
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Due Time"
                type="time"
                value={scheduleDueTime || session.dueTime || ''}
                onChange={(e) => setScheduleDueTime(e.target.value)}
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
        </Card>
      </Box>
    );
  };

  const handleDeleteSession = (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      const session = savedSessions.find(s => s.id === sessionId);
      setSavedSessions(prev => prev.filter(session => session.id !== sessionId));
      
      // Also remove from draftSessions if it's a draft
      if (session && session.status === 'draft') {
        setDraftSessions(prev => prev.filter(s => s.id !== sessionId));
        
        // Clean up file objects
        setSessionFileObjects(prev => {
          const updated = { ...prev };
          delete updated[sessionId];
          return updated;
        });
      }
      
      // Log activity
      if (session) {
        addActivity(
          `Session deleted: ${session.title}`,
          'Admin',
          'deleted',
          'session_deleted'
        );
      }
      
      showToast('Session deleted successfully!', 'success');
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
    // Remove folderType before saving
    const folderType = updatedSession.folderType;
    delete updatedSession.folderType;
    
    // Update savedAt timestamp
    updatedSession.savedAt = new Date().toISOString();

    // Update in the appropriate array
    if (folderType === 'drafts') {
      setDraftSessions(prev => {
        const updated = prev.map(s => s.id === updatedSession.id ? updatedSession : s);
        localStorage.setItem('draft_sessions', JSON.stringify(updated));
        return updated;
      });
    } else if (folderType === 'assessments') {
      setSavedAssessments(prev => {
        const updated = prev.map(a => a.id === updatedSession.id ? updatedSession : a);
        localStorage.setItem('saved_assessments', JSON.stringify(updated));
        return updated;
      });
    } else if (folderType === 'published') {
      setPublishedSessions(prev => prev.map(s => s.id === updatedSession.id ? normalizePublishedSession(updatedSession) : s));
    }

    // Update the selected item with folderType restored
    const sessionWithFolder = { ...updatedSession, folderType };
    setSelectedAllSessionItem(sessionWithFolder);
    setEditingSession(null);
    setViewMode('preview');
    showToast('Session updated successfully!', 'success');
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
      
      // Also remove from savedSessions
      setSavedSessions(prev => prev.filter(s => s.id !== sessionId));
      
      // Clean up file objects
      setSessionFileObjects(prev => {
        const updated = { ...prev };
        delete updated[sessionId];
        return updated;
      });
      
      // Log activity
      if (session) {
        addActivity(
          `Draft session deleted: ${session.title || 'Untitled'}`,
          'Admin',
          'deleted',
          'session_deleted'
        );
      }
      
      showToast('Draft session deleted successfully!', 'success');
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
      
      showToast('Assessment deleted successfully!', 'success');
    }
  };

  const handleDeletePublishedSession = (sessionId) => {
    if (window.confirm('Are you sure you want to delete this published session? This action cannot be undone.')) {
      // Use functional update to ensure we're working with the latest state
      setPublishedSessions(prev => {
        const session = prev.find(s => s.id === sessionId);
        if (!session) {
          showToast('Session not found!', 'error');
          return prev; // Return unchanged if session not found
        }
        
        // Filter out the session with matching ID (strict comparison)
        const updated = prev.filter(s => String(s.id) !== String(sessionId));
        
        // Log activity
        addActivity(
          `Published session deleted: ${session.title || 'Untitled'}`,
          'Admin',
          'deleted',
          'session_deleted'
        );
        
        return updated;
      });
      
      // Close schedule dialog if the deleted session was selected
      if (selectedSessionForScheduling?.id === sessionId) {
        setShowScheduleDialog(false);
        setSelectedSessionForScheduling(null);
        setScheduleDate('');
        setScheduleTime('');
        setScheduleDueDate('');
        setScheduleDueTime('');
        setShowCalendar(false);
      }
      
      // Show success message
      showToast('Published session deleted successfully!', 'success');
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
      } else if (file.dataUrl) {
        window.open(file.dataUrl, '_blank');
      } else if (typeof fileToOpen === 'string') {
        // If it's a URL string
        window.open(fileToOpen, '_blank');
      } else {
        showToast(`Unable to open file: ${file.name || 'Unknown file'}. The file may no longer be available in memory.`, 'error');
      }
    } catch (error) {
      console.error('Error opening file:', error);
      showToast(`Error opening file: ${file.name || 'Unknown file'}`, 'error');
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
      } else if (file.dataUrl) {
        url = file.dataUrl;
      } else {
        showToast('Unable to download file', 'error');
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
      showToast(`Error downloading file: ${file.name || 'Unknown file'}`, 'error');
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
            showToast(`Please manually open ${appName} from your Start menu or desktop.`, 'info');
          }
        }, 100);
      } else {
        showToast(`Please manually open ${appName} to create your content.`, 'info');
      }
    } catch (error) {
      showToast(`Please manually open ${appName} to create your content.`, 'info');
    }
  };

  const handleScheduleSubmit = () => {
    if (!scheduleData.date || !scheduleData.startTime || !scheduleData.endTime || !selectedDepartment) {
      showToast('Please fill in all required fields and select a department', 'warning');
      return;
    }

    const sessionToSchedule = selectedSession || selectedSessionForScheduling;

    if (!sessionToSchedule) {
      showToast('No session selected. Please select a session first.', 'warning');
      return;
    }

    // Combine date and time for scheduledDateTime
    const scheduledDateTime = new Date(`${scheduleData.date}T${scheduleData.startTime}`).toISOString();
    const dueDateTime = new Date(`${scheduleData.date}T${scheduleData.endTime}`).toISOString();

    // Ensure session has an ID
    const sessionId = sessionToSchedule.id || Date.now();

    // Update session status to scheduled and publish to employees
    const updatedSession = normalizePublishedSession({
      ...sessionToSchedule,
      id: sessionId, // Ensure ID exists
      status: 'published', // Change to published so employees can see it
      dateTime: `${scheduleData.date}T${scheduleData.startTime}`,
      createdAt: sessionToSchedule.createdAt || new Date().toISOString(),
      publishedAt: sessionToSchedule.publishedAt || new Date().toISOString(),
      scheduledDate: scheduleData.date,
      scheduledTime: scheduleData.startTime,
      scheduledDateTime: scheduledDateTime,
      dueDate: scheduleData.date,
      dueTime: scheduleData.endTime,
      dueDateTime: dueDateTime,
      // Preserve files, quiz, and other content
      files: sessionToSchedule.files || sessionToSchedule.resumeState?.selectedFiles || [],
      quiz: sessionToSchedule.quiz || null,
      aiContent: sessionToSchedule.aiContent || null,
      creationMode: sessionToSchedule.creationMode || null,
      instructor: sessionToSchedule.instructor || 'HR Team',
      duration: sessionToSchedule.duration || '60 minutes',
      title: sessionToSchedule.title || scheduleData.title || 'Untitled Session',
      description: sessionToSchedule.description || scheduleData.description || '',
      type: sessionToSchedule.type || 'compliance',
      audience: sessionToSchedule.audience || 'all'
    });

    // Update saved sessions
    setSavedSessions(prev => prev.map(session => 
      session.id === sessionId ? updatedSession : session
    ));

    // Add/update in published sessions so employees can see it
    // Use functional update to ensure state is properly updated
    setPublishedSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      const updated = [updatedSession, ...filtered];
      // Immediately save to localStorage to ensure it's available
      if (safeSetLocalStorage('published_sessions', updated)) {
        // Dispatch custom event to ensure employee dashboard picks it up
        window.dispatchEvent(new Event('published-sessions-updated'));
        console.log('Session scheduled and saved:', updatedSession.title, updatedSession.id);
        console.log('Total published sessions:', updated.length);
      }
      return updated;
    });

    // Log activity
    addActivity(
      `Session scheduled: ${sessionToSchedule.title || scheduleData.title || 'Untitled Session'}`,
      'Admin',
      'scheduled',
      'session_scheduled'
    );

    setShowScheduleDialog(false);
    setShowScheduleSuccess(true);
    setSelectedSession(null);
    setSelectedSessionForScheduling(null);
    
    // Redirect to session library after scheduling
    setTimeout(() => {
      console.log('Published sessions in localStorage:', localStorage.getItem('published_sessions'));
      setActiveTab('course-library');
      setManageSessionTab('create');
      setManageSessionView('create');
      setShowScheduleSuccess(false);
    }, 1500);
  };

  const renderDashboard = () => (
    <Box p={3}>
      {/* Header */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive session management and employee oversight
          </Typography>
        </Box>
        <Box display="flex" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="date-range-filter-label">Date Range</InputLabel>
            <Select
              labelId="date-range-filter-label"
              id="date-range-filter"
              value={dateRangeFilter}
              label="Date Range"
              onChange={(e) => handleDateRangeChange(e.target.value)}
              sx={{
                backgroundColor: 'white',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e5e7eb',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#114417DB',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#114417DB',
                },
              }}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="7days">Last 7 days</MenuItem>
              <MenuItem value="30days">Last 30 days</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>
          </FormControl>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setActiveTab('manage-session');
            setManageSessionTab('create');
            handleManageSessionClick('create');
          }}
          sx={{
              backgroundColor: '#114417DB',
            color: 'white',
            '&:hover': {
                backgroundColor: '#0a2f0e',
            },
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            height: 'fit-content'
          }}
        >
          Create New Session
        </Button>
        </Box>
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
          <ActivityCard sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Session Status Overview
            </Typography>
            <Box display="flex" flexDirection="column" mt={3} flex={1} sx={{ justifyContent: 'space-between' }}>
              <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">
                {sessionStatusData.map((item, index) => {
                  const getColor = () => {
                    switch(item.label) {
                      case 'All': return '#114417DB';
                      case 'Scheduled': return '#3b82f6';
                      case 'In Progress': return '#f59e0b';
                      case 'Completed': return '#114417DB';
                      case 'Draft': return '#ef4444';
                      default: return '#6b7280';
                    }
                  };
                  return (
                    <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
          <ActivityCard sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recent Activity
            </Typography>
            {recentActivity.length === 0 ? (
              <Box textAlign="center" py={4} sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No recent activity
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Activities will appear here as you perform actions
                </Typography>
              </Box>
            ) : (
              <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: '350px' }}>
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
              </Box>
            )}
          </ActivityCard>
        </Grid>

        {/* Leader Board - Top Performers */}
        <Grid item xs={12} md={4}>
          <ActivityCard sx={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <AwardIcon sx={{ color: '#f59e0b', fontSize: 24 }} />
              <Typography variant="h6" fontWeight="bold">
                Leader Board
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
              Top Performers
            </Typography>
            {topPerformers.length === 0 ? (
              <Box textAlign="center" py={4} sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No performance data available
                </Typography>
              </Box>
            ) : (
              <Box sx={{ 
                flex: 1, 
                overflowY: 'auto', 
                maxHeight: '350px',
                '&::-webkit-scrollbar': {
                  display: 'none'
                },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}>
                <List sx={{ pt: 0 }}>
                  {topPerformers.map((employee) => (
                      <ListItem 
                        key={employee.id} 
                        sx={{ 
                          px: 0, 
                          py: 1.5,
                          borderBottom: '1px solid rgba(0,0,0,0.05)',
                          '&:last-child': { borderBottom: 'none' }
                        }}
                      >
                        <Box 
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: `${employee.rankColor}20`,
                            color: employee.rankColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '0.875rem',
                            mr: 2,
                            flexShrink: 0
                          }}
                        >
                          {employee.rank}
                        </Box>
                        <Box flex={1} minWidth={0}>
                          <Typography variant="body2" fontWeight="medium" noWrap>
                            {employee.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {employee.department}
                          </Typography>
                        </Box>
                        <Box textAlign="right" ml={1}>
                          <Typography 
                            variant="body2" 
                            fontWeight="bold" 
                            sx={{ color: employee.rankColor }}
                          >
                            {employee.completionRate}%
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {employee.sessionsCompleted} sessions
                          </Typography>
                        </Box>
                      </ListItem>
                    ))}
                </List>
              </Box>
            )}
          </ActivityCard>
        </Grid>
      </Grid>

      {/* Session Management Sections */}
      <Box mt={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Session Management
        </Typography>
        <Grid container spacing={3}>
          {/* Draft Sessions */}
          <Grid item xs={12} md={4}>
            <ActivityCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Draft Sessions
                </Typography>
                <Chip 
                  label={draftCoursesList.length} 
                  color="warning" 
                  size="small"
                />
              </Box>
              <List sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {draftCoursesList.slice(0, 3).map((session) => (
                  <ListItem 
                    key={session.id} 
                    sx={{ 
                      px: 0, 
                      py: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f3f4f6',
                        borderRadius: 1
                      }
                    }}
                    onClick={() => handleResumeDraft(session)}
                  >
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
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 4, flex: 1, display: 'flex', alignItems: 'center' }}>
                    No draft sessions
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

          {/* Popular Sessions */}
          <Grid item xs={12} md={4}>
            <ActivityCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Popular Sessions
                </Typography>
                <Chip 
                  label={popularCoursesList.length} 
                  color="success" 
                  size="small"
                />
              </Box>
              <List sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 4, flex: 1, display: 'flex', alignItems: 'center' }}>
                    No completed sessions yet
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

          {/* Newly Added Sessions */}
          <Grid item xs={12} md={4}>
            <ActivityCard sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Newly Added Sessions
                </Typography>
                <Chip 
                  label={newlyAddedCoursesList.length} 
                  color="primary" 
                  size="small"
                />
              </Box>
              <List sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
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
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 4, flex: 1, display: 'flex', alignItems: 'center' }}>
                    No sessions added yet
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
                View All Sessions
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
          No sessions found
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
                      cursor: viewAllType === 'drafts' ? 'pointer' : 'default',
                      '&:hover': {
                        backgroundColor: '#f9fafb'
                      }
                    }}
                    onClick={viewAllType === 'drafts' ? () => {
                      setShowViewAllDialog(false);
                      handleResumeDraft(session);
                    } : undefined}
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
                            {session.savedAt && (
                              <span> • Last saved: {new Date(session.savedAt).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}</span>
                            )}
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
                      {viewAllType === 'drafts' && (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowViewAllDialog(false);
                            handleResumeDraft(session);
                          }}
                          sx={{ 
                            backgroundColor: '#f3f4f6',
                            '&:hover': { backgroundColor: '#e5e7eb' }
                          }}
                          title="Edit/Resume Draft"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => {
                          e.stopPropagation();
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
                        onClick={(e) => {
                          e.stopPropagation();
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

      {/* Custom Date Range Dialog */}
      <Dialog 
        open={showCustomDateDialog} 
        onClose={() => setShowCustomDateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            Select Custom Date Range
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3} sx={{ mt: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                max: customEndDate || undefined
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#114417DB',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#114417DB',
                  },
                },
              }}
            />
            <TextField
              label="End Date"
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: customStartDate || undefined
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#114417DB',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#114417DB',
                  },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setShowCustomDateDialog(false);
              setCustomStartDate('');
              setCustomEndDate('');
            }}
            sx={{
              color: '#6b7280',
              '&:hover': {
                backgroundColor: 'rgba(107, 114, 128, 0.08)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApplyCustomDate}
            variant="contained"
            disabled={!customStartDate || !customEndDate || customStartDate > customEndDate}
            sx={{
              backgroundColor: '#114417DB',
              color: 'white',
              '&:hover': {
                backgroundColor: '#0a2f0e',
              },
              '&.Mui-disabled': {
                backgroundColor: '#e5e7eb',
                color: '#9ca3af',
              },
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
            }}
          >
            Apply
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

  // Live Trainings Content Creator Page
  const renderLiveTrainingsContentCreator = () => (
    <Box p={3}>
      <Box mb={4}>
        <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={handleSaveSession}
              startIcon={<SaveIcon />}
              sx={{
                borderColor: '#114417DB',
                color: '#114417DB',
                '&:hover': {
                  borderColor: '#0a2f0e',
                  backgroundColor: 'rgba(17, 68, 23, 0.08)'
                },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Save as Draft
            </Button>
            <Button
              variant="outlined"
              onClick={handleSkipToNextStep}
              sx={{
                borderColor: '#6b7280',
                color: '#6b7280',
                '&:hover': {
                  borderColor: '#4b5563',
                  backgroundColor: '#f3f4f6'
                },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Skip
            </Button>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Live Trainings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Schedule and manage live training sessions with real-time interaction
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
              Live Trainings feature coming soon. This section will allow you to schedule and manage live training sessions.
            </Typography>
          </Card>
        </Grid>
      </Grid>
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
    // Automatically show Configure Fields section
    setCertificationView('configure');
    setFieldsSaved(false); // Reset fields saved state when selecting a new template
    // Reset certificate fields to template defaults
    setCertificateFields({
      title: template.title || 'CERTIFICATE',
      subtitle: template.subtitle || '-OF APPRECIATION-',
      recipientLabel: template.recipientLabel || 'Presented to',
      descriptionText: template.descriptionText || 'who gave the best and completed the course',
      userName: 'User Name',
      dateOfIssue: '01 Sept 2026',
      authorisedBy: 'Country Head'
    });
    // Scroll to Configure Fields section after a short delay to ensure it's rendered
    setTimeout(() => {
      const configureFieldsSection = document.getElementById('configure-fields-section');
      if (configureFieldsSection) {
        configureFieldsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
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
      showToast(`Template "${selectedMenuTemplate.name}" has been set as default.`, 'success');
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
        showToast(`Template "${selectedMenuTemplate.name}" has been enabled.`, 'success');
      } else {
        setDisabledTemplateIds(prev => [...prev, selectedMenuTemplate.id]);
        showToast(`Template "${selectedMenuTemplate.name}" has been disabled.`, 'info');
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
      showToast('Please select a template first.', 'warning');
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

  const handleSaveFields = () => {
    // Save certificate fields
    setFieldsSaved(true);
    // Show Permissions section
    setCertificationView('permissions');
    // Scroll to permissions section after a short delay to ensure it's rendered
    setTimeout(() => {
      const permissionsSection = document.getElementById('permissions-section');
      if (permissionsSection) {
        permissionsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    // In real app, this would save to backend
  };

  const handleEditFields = () => {
    // Allow editing fields again
    setFieldsSaved(false);
    setCertificationView('configure');
    // Scroll back to Configure Fields section
    setTimeout(() => {
      const configureFieldsSection = document.getElementById('configure-fields-section');
      if (configureFieldsSection) {
        configureFieldsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
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
    
    // Navigate to preview
    setManageSessionTab('preview');
    setManageSessionView('preview');
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
          onClick={() => !isDisabled && handleTemplateSelect(template)}
        >
          {/* Default Badge */}
          {isDefault && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
                zIndex: 2,
                backgroundColor: '#114417DB',
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
                  who gave the best and completed the session
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
        {/* Template Selection Section */}
        <Box id="template-selection-section">
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
                          who gave the best and completed the session
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
            
            {/* Default 5 Action Buttons */}
            <Box display="flex" gap={2} mt={4} justifyContent="center" flexWrap="wrap">
              <Button
                variant="outlined"
                startIcon={<SaveIcon />}
                onClick={handleSaveSession}
                sx={{
                  borderColor: '#114417DB',
                  color: '#114417DB',
                  '&:hover': {
                    borderColor: '#0a2f0e',
                    backgroundColor: 'rgba(17, 68, 23, 0.08)'
                  },
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 150
                }}
              >
                Save as Draft
              </Button>
              <Button
                variant="outlined"
                onClick={handleSkipToNextStep}
                sx={{
                  borderColor: '#6b7280',
                  color: '#6b7280',
                  '&:hover': {
                    borderColor: '#4b5563',
                    backgroundColor: '#f3f4f6'
                  },
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 150
                }}
              >
                Skip
              </Button>
              <Button
                variant="outlined"
                onClick={() => setActiveTab('course-library')}
                sx={{
                  borderColor: '#ef4444',
                  color: '#ef4444',
                  '&:hover': {
                    borderColor: '#dc2626',
                    backgroundColor: '#fef2f2'
                  },
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 150
                }}
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handlePreviousStep}
                sx={{
                  borderColor: '#6b7280',
                  color: '#6b7280',
                  '&:hover': {
                    borderColor: '#4b5563',
                    backgroundColor: '#f3f4f6'
                  },
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 150
                }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleNextStep}
                sx={{
                  backgroundColor: '#114417DB',
                  '&:hover': { backgroundColor: '#0a2f0e' },
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 150
                }}
              >
                Next
              </Button>
            </Box>
          </Card>
        </Box>

        {/* Configure Fields Section - Show after template is selected */}
        {selectedTemplate && (
          <Card id="configure-fields-section" sx={{ p: 3, mt: 4 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Box display="flex" alignItems="center" gap={2}>
                <EditIcon sx={{ fontSize: 32, color: '#114417DB' }} />
              <Typography variant="h5" fontWeight="bold">
                Configure Fields
              </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <IconButton
                  onClick={() => setShowCertificatePreview(true)}
                  sx={{
                    color: '#114417DB',
                    '&:hover': {
                      backgroundColor: 'rgba(17, 68, 23, 0.08)'
                    }
                  }}
                >
                  <VisibilityIcon />
                </IconButton>
                {!fieldsSaved ? (
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveFields}
                    sx={{
                      backgroundColor: '#114417DB',
                      '&:hover': { backgroundColor: '#0a2f0e' },
                      textTransform: 'none',
                      fontWeight: 600,
                      minWidth: 120
                    }}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={handleEditFields}
                    sx={{
                      borderColor: '#114417DB',
                      color: '#114417DB',
                      '&:hover': {
                        borderColor: '#0a2f0e',
                        backgroundColor: 'rgba(17, 68, 23, 0.08)'
                      },
                      textTransform: 'none',
                      fontWeight: 600,
                      minWidth: 120
                    }}
                  >
                    Edit
                  </Button>
                )}
              </Box>
            </Box>
            
              <Box>
              {/* Editable Fields */}
                <Box mb={3}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Title"
                          value={certificateFields.title}
                          onChange={(e) => setCertificateFields(prev => ({ ...prev, title: e.target.value }))}
                          margin="normal"
                          helperText="Main certificate title (e.g., CERTIFICATE)"
                          disabled={fieldsSaved}
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
                          disabled={fieldsSaved}
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
                          disabled={fieldsSaved}
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
                          disabled={fieldsSaved}
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
                          disabled={fieldsSaved}
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
                          disabled={fieldsSaved}
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
                          disabled={fieldsSaved}
                        />
                      </Grid>
                    </Grid>
                  </Box>
            </Box>

            {/* Certificate Preview Dialog */}
            <Dialog
              open={showCertificatePreview}
              onClose={() => setShowCertificatePreview(false)}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: {
                  maxHeight: '90vh'
                }
              }}
            >
              <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight="bold">
                    Certificate Preview
                    </Typography>
                  <IconButton onClick={() => setShowCertificatePreview(false)} size="small">
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent dividers sx={{ overflowY: 'auto' }}>
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
                <Typography variant="caption" color="text.secondary" mt={2} display="block" textAlign="center">
                      Note: The changes made to fields will be applied to all the templates.
                    </Typography>
              </DialogContent>
            </Dialog>

            {/* All 5 Action Buttons - Only show when fields are not saved */}
            {!fieldsSaved && (
              <Box display="flex" gap={2} mt={4} justifyContent="center">
                    <Button
                      variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveSession}
                      sx={{
                    borderColor: '#114417DB',
                    color: '#114417DB',
                    '&:hover': {
                      borderColor: '#0a2f0e',
                      backgroundColor: 'rgba(17, 68, 23, 0.08)'
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 150
                  }}
                >
                  Save as Draft
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleSkipToNextStep}
                  sx={{
                    borderColor: '#6b7280',
                    color: '#6b7280',
                    '&:hover': {
                      borderColor: '#4b5563',
                      backgroundColor: '#f3f4f6'
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 150
                  }}
                >
                  Skip
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setActiveTab('course-library')}
                  sx={{
                    borderColor: '#ef4444',
                    color: '#ef4444',
                    '&:hover': {
                      borderColor: '#dc2626',
                      backgroundColor: '#fef2f2'
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 150
                      }}
                    >
                      Cancel
                    </Button>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => {
                    setSelectedTemplate(null);
                    setFieldsSaved(false);
                    setCertificationView('templates');
                    // Scroll back to template selection
                    setTimeout(() => {
                      const templateSection = document.getElementById('template-selection-section');
                      if (templateSection) {
                        templateSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }}
                  sx={{
                    borderColor: '#6b7280',
                    color: '#6b7280',
                    '&:hover': {
                      borderColor: '#4b5563',
                      backgroundColor: '#f3f4f6'
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 150
                  }}
                >
                  Previous
                    </Button>
                    <Button
                      variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleSaveFields}
                  disabled={fieldsSaved}
                      sx={{
                    backgroundColor: '#114417DB',
                    '&:hover': { backgroundColor: '#0a2f0e' },
                    '&:disabled': {
                      backgroundColor: '#d1d5db',
                      color: '#9ca3af'
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 150
                  }}
                >
                  Next
                    </Button>
              </Box>
            )}
          </Card>
        )}

        {/* Permissions Section - Show after fields are saved */}
        {fieldsSaved && certificationView === 'permissions' && (
          <Card id="permissions-section" sx={{ p: 3, mt: 4 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <LockIcon sx={{ fontSize: 32, color: '#f59e0b' }} />
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
                      label="Auto-generate certificates upon session completion"
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
              <Box display="flex" gap={2} mt={4} justifyContent="center">
                <Button
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveSession}
                  sx={{
                    borderColor: '#114417DB',
                    color: '#114417DB',
                    '&:hover': { 
                      borderColor: '#0a2f0e',
                      backgroundColor: 'rgba(17, 68, 23, 0.08)'
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 150
                  }}
                >
                  Save as Draft
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleSkipToNextStep}
                  sx={{
                    borderColor: '#6b7280',
                    color: '#6b7280',
                    '&:hover': {
                      borderColor: '#4b5563',
                      backgroundColor: '#f3f4f6'
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 150
                  }}
                >
                  Skip
                </Button>
          <Button 
            variant="outlined" 
                  onClick={() => setActiveTab('course-library')}
            sx={{ 
                    borderColor: '#ef4444',
                    color: '#ef4444',
              '&:hover': { 
                      borderColor: '#dc2626',
                      backgroundColor: '#fef2f2'
              },
              textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 150
            }}
          >
                  Cancel
          </Button>
          <Button
            variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={handleEditFields}
            sx={{
              borderColor: '#6b7280',
              color: '#6b7280',
              '&:hover': {
                borderColor: '#4b5563',
                backgroundColor: '#f3f4f6'
              },
              textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 150
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handlePermissionsSave}
                  sx={{
                    backgroundColor: '#114417DB',
                    '&:hover': { backgroundColor: '#0a2f0e' },
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: 150
                  }}
                >
                  Next
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
      <Card sx={{ p: 3, maxWidth: '100%' }}>
            <TextField
              label="Session Title"
              value={sessionFormData.title}
              onChange={(e) => handleSessionFormChange('title', e.target.value)}
              fullWidth
              margin="normal"
              required
              error={false}
              helperText=""
            />
                        <FormControl fullWidth margin="normal" required error={false}>
                          <InputLabel id="session-type-label" shrink>Session Type</InputLabel>
                          <Select
                            labelId="session-type-label"
                            value={sessionFormData.type}
                            onChange={(e) => handleSessionFormChange('type', e.target.value)}
                            label="Session Type"
                            displayEmpty
                            renderValue={(selected) => {
                              if (!selected) {
                                return <em style={{ fontStyle: 'normal', color: '#9ca3af' }}>Select</em>;
                              }
                              const labels = {
                                'compliance': 'Compliance Training',
                                'learning': 'Employee Learning and Development',
                                'engagement': 'Employee Engagement & Well-being',
                                'performance': 'Organizational Growth & Performance',
                                'culture': 'Company & Culture-Oriented Sessions',
                                'dei': 'Diversity, Equity & Inclusion (DEI)',
                                'safety': 'Workplace Safety',
                                'security': 'Security Awareness',
                                'live-training': 'Live Training'
                              };
                              return labels[selected] || selected;
                            }}
                          >
                            <MenuItem value="">
                              <em style={{ fontStyle: 'normal', color: '#9ca3af' }}>Select</em>
                            </MenuItem>
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
            <FormControl fullWidth margin="normal" required error={false}>
              <InputLabel id="participants-label" shrink>Participants</InputLabel>
              <Select
                labelId="participants-label"
                value={sessionFormData.audience}
                onChange={(e) => handleSessionFormChange('audience', e.target.value)}
                label="Participants"
                displayEmpty
                renderValue={(selected) => {
                  if (!selected) {
                    return <em style={{ fontStyle: 'normal', color: '#9ca3af' }}>Select</em>;
                  }
                  const labels = {
                    'all': 'All Employees',
                    'managers': 'Managers Only',
                    'developers': 'Developers',
                    'hr': 'HR Team'
                  };
                  return labels[selected] || selected;
                }}
              >
                <MenuItem value="">
                  <em style={{ fontStyle: 'normal', color: '#9ca3af' }}>Select</em>
                </MenuItem>
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
            <Box display="flex" gap={2} mt={3} justifyContent="center">
              <Button 
                variant="outlined" 
                startIcon={<SaveIcon />}
                onClick={handleSaveSession}
                sx={{ 
                  borderColor: '#114417DB', 
                  color: '#114417DB', 
                  '&:hover': { 
                    borderColor: '#0a2f0e', 
                    backgroundColor: 'rgba(17, 68, 23, 0.08)' 
                  },
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 150
                }}
              >
                Save as Draft
              </Button>
              <Button 
                variant="outlined"
                onClick={handleSkipToNextStep}
                sx={{
                  borderColor: '#6b7280',
                  color: '#6b7280',
                  '&:hover': {
                    borderColor: '#4b5563',
                    backgroundColor: '#f3f4f6'
                  },
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 150
                }}
              >
                Skip
          </Button>
            <Button
              variant="outlined"
                onClick={() => setActiveTab('course-library')}
              sx={{
                  borderColor: '#ef4444', 
                  color: '#ef4444', 
                '&:hover': {
                    borderColor: '#dc2626', 
                    backgroundColor: '#fef2f2' 
                },
                textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 150
              }}
            >
                Cancel
            </Button>
            <Button
              variant="outlined"
                startIcon={<ArrowBackIcon />}
              onClick={() => {
                  // Go back - this is the first step, so disable or navigate to session library
                  setActiveTab('course-library');
              }}
                disabled
              sx={{
                borderColor: '#6b7280',
                color: '#6b7280',
                '&:hover': {
                  borderColor: '#4b5563',
                  backgroundColor: '#f3f4f6'
                },
                  '&:disabled': {
                    borderColor: '#e5e7eb',
                    color: '#9ca3af'
                },
                textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 150
                }}
              >
                Previous
              </Button>
              <Button 
                variant="contained" 
                endIcon={<ArrowForwardIcon />}
                onClick={handleNextStep}
                sx={{ 
                  backgroundColor: '#114417DB', 
                  '&:hover': { 
                    backgroundColor: '#0a2f0e' 
                  },
                  textTransform: 'none',
                  fontWeight: 600,
                  minWidth: 150
                }}
              >
                Next
            </Button>
          </Box>
          </Card>
        </Box>
  );

  // Main Content Creator Menu
  const renderContentCreatorMain = () => (
    <Box p={3}>
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
            onClick={() => {
              if (contentCreatorView === 'ai-creator') {
                setContentCreatorView('main');
              } else {
                setContentCreatorView('ai-creator');
              }
            }}
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
            onClick={() => {
              if (contentCreatorView === 'upload-file') {
                setContentCreatorView('main');
              } else {
                setContentCreatorView('upload-file');
              }
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 64, color: '#114417DB', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Upload File
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload existing files like PDFs, documents, presentations, and videos
            </Typography>
          </Card>
        </Grid>

        {/* Live Trainings Option */}
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
            onClick={() => setContentCreatorView('live-trainings')}
          >
            <EventIcon sx={{ fontSize: 64, color: '#ef4444', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Live Trainings
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Schedule and manage live training sessions with real-time interaction
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* AI Content Creator Section - Shown when AI Content Creator is selected */}
      {contentCreatorView === 'ai-creator' && (
        <Box mt={4}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              AI Content Creator
            </Typography>
            {/* Keywords Input */}
            <TextField
              label="Enter keywords or topics"
              placeholder="e.g., mental health wellbeing, workplace stress, mindfulness techniques"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={aiKeywords}
              onChange={(e) => setAiKeywords(e.target.value)}
              sx={{ mt: 0 }}
            />
            
            {/* Generate Prompt Button */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<FireIcon />}
                onClick={generatePrompt}
                disabled={!aiKeywords.trim()}
                sx={{ 
                  backgroundColor: '#f59e0b',
                  minWidth: 200,
                  '&:hover': { backgroundColor: '#d97706' },
                  '&:disabled': { backgroundColor: '#d1d5db', color: '#9ca3af' }
                }}
              >
                GENERATE PROMPT
              </Button>
            </Box>
            
            {/* Generated Prompt Display */}
            {aiContentGenerated && sessionContentSnapshot?.aiContent?.content && (
              <Box mt={3}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="text.secondary">
                  Generated Prompt:
                  </Typography>
                <Box
                  sx={{
                    p: 2,
                    mt: 1,
                    backgroundColor: '#f8fafc',
                    borderRadius: 2,
                    border: '1px solid #e5e7eb',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}
                >
                  <Typography variant="body2" component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                    {typeof sessionContentSnapshot.aiContent.content === 'string' 
                      ? sessionContentSnapshot.aiContent.content 
                      : JSON.stringify(sessionContentSnapshot.aiContent.content, null, 2)}
                  </Typography>
                </Box>

                {/* Copy and Open ChatGPT Button */}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
              <Button
                    variant="contained"
                size="large"
                    startIcon={<FireIcon />}
                    onClick={handleCopyAndOpenChatGPT}
                sx={{
                      backgroundColor: '#114417DB',
                      minWidth: 200,
                      '&:hover': { backgroundColor: '#0a2f0e' }
                    }}
                  >
                    COPY AND OPEN CHATGPT
              </Button>
                </Box>
              </Box>
            )}

            {/* Paste ChatGPT Response Section */}
            {aiContentGenerated && (
              <Box mt={4}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="text.secondary">
                  Paste ChatGPT JSON Response:
                </Typography>
                <TextField
                  label="Paste the JSON response from ChatGPT here"
                  placeholder='Paste the JSON response here, e.g., {"title": "...", "description": "...", "content": "...", "keyPoints": [...], "learningObjectives": [...]}'
                  fullWidth
                  multiline
                  rows={8}
                  margin="normal"
                  value={chatgptResponse}
                  onChange={(e) => setChatgptResponse(e.target.value)}
                  sx={{ 
                    mt: 1,
                    '& .MuiInputBase-input': {
                      fontFamily: 'monospace',
                      fontSize: '0.875rem'
                    }
                  }}
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
              <Button
                variant="contained"
                size="large"
                    onClick={handleProcessChatGPTResponse}
                    disabled={!chatgptResponse.trim()}
                sx={{
                      backgroundColor: '#114417DB',
                      minWidth: 200,
                      '&:hover': { backgroundColor: '#0a2f0e' },
                      '&:disabled': { backgroundColor: '#d1d5db', color: '#9ca3af' }
                    }}
                  >
                    PROCESS AND USE CONTENT
              </Button>
            </Box>

                {/* Show parsed content preview */}
                {parsedContent && (
                  <Box mt={3} p={2} sx={{ backgroundColor: '#d1fae5', borderRadius: 2 }}>
                    <Typography variant="body1" color="success.main" fontWeight="medium" gutterBottom>
                      ✅ Content Processed Successfully!
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      <strong>Title:</strong> {parsedContent.title || 'N/A'}
                    </Typography>
                    {parsedContent.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <strong>Description:</strong> {typeof parsedContent.description === 'string' 
                          ? parsedContent.description.substring(0, 100) + '...'
                          : JSON.stringify(parsedContent.description).substring(0, 100) + '...'}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.85rem' }}>
                      The content is now ready to use in your session. You can proceed to the next step.
                    </Typography>
        </Box>
      )}
    </Box>
            )}
          </Card>
        </Box>
      )}

      {/* Upload Section - Shown when Upload File is selected */}
      {contentCreatorView === 'upload-file' && (
        <Box mt={4}>
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
                Supports PDF, DOC, PPT, MP4, and more. You can upload multiple files.
              </Typography>
              <input
                type="file"
                id="file-upload-input-main"
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
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(file.size)}
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={() => removeFile(index)} color="error">
                      <CloseIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Card>
        </Box>
      )}

      {/* Uploaded Files Display - Show when files are uploaded but upload section is not active */}
      {selectedFiles.length > 0 && contentCreatorView !== 'upload-file' && (
        <Box mt={4}>
          <Card sx={{ p: 3 }}>
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
          </Card>
        </Box>
      )}

      {/* Bottom Buttons */}
      <Box display="flex" gap={2} mt={4} justifyContent="center">
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
          onClick={handleSaveSession}
              sx={{
            borderColor: '#114417DB',
            color: '#114417DB',
                '&:hover': {
              borderColor: '#0a2f0e',
              backgroundColor: 'rgba(17, 68, 23, 0.08)'
                },
                textTransform: 'none',
            fontWeight: 600,
            minWidth: 150
              }}
            >
              Save as Draft
            </Button>
            <Button
              variant="outlined"
          onClick={handleSkipToNextStep}
              sx={{
                borderColor: '#6b7280',
                color: '#6b7280',
                '&:hover': {
                  borderColor: '#4b5563',
                  backgroundColor: '#f3f4f6'
                },
                textTransform: 'none',
            fontWeight: 600,
            minWidth: 150
              }}
            >
              Skip
            </Button>
              <Button
                variant="outlined"
          onClick={() => setActiveTab('course-library')}
                sx={{
                  borderColor: '#ef4444',
                  color: '#ef4444',
            '&:hover': {
              borderColor: '#dc2626',
              backgroundColor: '#fef2f2'
            },
            textTransform: 'none',
            fontWeight: 600,
            minWidth: 150
                }}
              >
                Cancel
              </Button>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            // Go back to Create Session step
            setManageSessionTab('create');
            setManageSessionView('create');
            setShowContentCreator(false);
            setContentCreatorView('main');
          }}
          sx={{
            borderColor: '#6b7280',
            color: '#6b7280',
            '&:hover': {
              borderColor: '#4b5563',
              backgroundColor: '#f3f4f6'
            },
            textTransform: 'none',
            fontWeight: 600,
            minWidth: 150
          }}
        >
          Previous
              </Button>
              <Button
                variant="contained"
          endIcon={<ArrowForwardIcon />}
          onClick={handleProceedFromMainToQuiz}
                sx={{
            backgroundColor: '#114417DB',
            '&:hover': {
              backgroundColor: '#0a2f0e'
            },
            textTransform: 'none',
            fontWeight: 600,
            minWidth: 150
          }}
        >
          Next
              </Button>
            </Box>
    </Box>
  );

  // AI Content Creator Page
  const renderAIContentCreator = () => {
    return (
    <Box p={3}>
      <Box mb={4}>
        <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={handleSaveSession}
              startIcon={<SaveIcon />}
              sx={{
                borderColor: '#114417DB',
                color: '#114417DB',
                '&:hover': {
                  borderColor: '#0a2f0e',
                  backgroundColor: 'rgba(17, 68, 23, 0.08)'
                },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Save as Draft
            </Button>
            <Button
              variant="outlined"
              onClick={handleSkipToNextStep}
              sx={{
                borderColor: '#6b7280',
                color: '#6b7280',
                '&:hover': {
                  borderColor: '#4b5563',
                  backgroundColor: '#f3f4f6'
                },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Skip
            </Button>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              AI Content Creator
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Generate comprehensive learning materials from keywords
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={8} lg={6}>
          <Card sx={{ p: 3 }}>
            {/* Keywords Input */}
            <TextField
              label="Enter keywords or topics"
              placeholder="e.g., mental health wellbeing, workplace stress, mindfulness techniques"
              fullWidth 
              multiline
              rows={3}
              margin="normal"
              value={aiKeywords}
              onChange={(e) => setAiKeywords(e.target.value)}
              sx={{ mt: 0 }}
            />
            
            {/* Generate Prompt Button */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<FireIcon />}
                onClick={generatePrompt}
                disabled={!aiKeywords.trim()}
                sx={{ 
                  backgroundColor: '#f59e0b',
                  minWidth: 200,
                  '&:hover': { backgroundColor: '#d97706' },
                  '&:disabled': { backgroundColor: '#d1d5db', color: '#9ca3af' }
                }}
              >
                GENERATE PROMPT
            </Button>
            </Box>
            
            {/* Generated Prompt Display */}
            {aiContentGenerated && sessionContentSnapshot?.aiContent?.content && (
              <Box mt={3}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="text.secondary">
                  Generated Prompt:
            </Typography>
                <Box
                  sx={{
                    p: 2,
                    mt: 1,
                    backgroundColor: '#f8fafc',
                    borderRadius: 2,
                    border: '1px solid #e5e7eb',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem'
                  }}
                >
                  <Typography variant="body2" component="pre" sx={{ m: 0, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                    {typeof sessionContentSnapshot.aiContent.content === 'string' 
                      ? sessionContentSnapshot.aiContent.content 
                      : JSON.stringify(sessionContentSnapshot.aiContent.content, null, 2)}
            </Typography>
                </Box>
                
                {/* Copy and Open ChatGPT Button */}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
            <Button 
                    variant="contained"
                    size="large"
                    startIcon={<FireIcon />}
                    onClick={handleCopyAndOpenChatGPT}
                    sx={{ 
                      backgroundColor: '#114417DB',
                      minWidth: 200,
                      '&:hover': { backgroundColor: '#0a2f0e' }
                    }}
                  >
                    COPY AND OPEN CHATGPT
            </Button>
                </Box>
              </Box>
            )}

            {/* Paste ChatGPT Response Section */}
            {aiContentGenerated && (
              <Box mt={4}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="text.secondary">
                  Paste ChatGPT JSON Response:
            </Typography>
                <TextField
                  label="Paste the JSON response from ChatGPT here"
                  placeholder='Paste the JSON response here, e.g., {"title": "...", "description": "...", "content": "...", "keyPoints": [...], "learningObjectives": [...]}'
              fullWidth 
                  multiline
                  rows={8}
                  margin="normal"
                  value={chatgptResponse}
                  onChange={(e) => setChatgptResponse(e.target.value)}
                  sx={{ 
                    mt: 1,
                    '& .MuiInputBase-input': {
                      fontFamily: 'monospace',
                      fontSize: '0.875rem'
                    }
                  }}
                />
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleProcessChatGPTResponse}
                    disabled={!chatgptResponse.trim()}
                    sx={{ 
                      backgroundColor: '#114417DB',
                      minWidth: 200,
                      '&:hover': { backgroundColor: '#0a2f0e' },
                      '&:disabled': { backgroundColor: '#d1d5db', color: '#9ca3af' }
                    }}
                  >
                    PROCESS AND USE CONTENT
            </Button>
                </Box>

                {/* Show parsed content preview */}
                {parsedContent && (
        <Box mt={3} p={2} sx={{ backgroundColor: '#d1fae5', borderRadius: 2 }}>
                    <Typography variant="body1" color="success.main" fontWeight="medium" gutterBottom>
                      ✅ Content Processed Successfully!
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      <strong>Title:</strong> {parsedContent.title || 'N/A'}
                    </Typography>
                    {parsedContent.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <strong>Description:</strong> {typeof parsedContent.description === 'string' 
                          ? parsedContent.description.substring(0, 100) + '...'
                          : JSON.stringify(parsedContent.description).substring(0, 100) + '...'}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.85rem' }}>
                      The content is now ready to use in your session. You can proceed to the next step.
          </Typography>
                  </Box>
                )}
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
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                fullWidth
                size="large"
                onClick={handlePreviousStep}
                sx={{
                  borderColor: '#6b7280',
                  color: '#6b7280',
                  '&:hover': {
                    borderColor: '#4b5563',
                    backgroundColor: '#f3f4f6'
                  },
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Previous
        </Button>
        <Button
          variant="contained"
                endIcon={<ArrowForwardIcon />}
          fullWidth
          size="large"
          onClick={handleContentCreatorProceed}
                disabled={!aiContentGenerated}
          sx={{
                  backgroundColor: '#114417DB',
                  '&:hover': { backgroundColor: '#0a2f0e' },
                  '&:disabled': { backgroundColor: '#d1d5db', color: '#9ca3af' },
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Next
        </Button>
      </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
  };


  // Upload File Page
  const renderUploadFile = () => (
    <Box p={3}>
      <Box mb={4}>
        <Box display="flex" justifyContent="flex-end" alignItems="center" mb={2}>
          <Box display="flex" gap={2}>
            <Button
              variant="outlined"
              onClick={handleSaveSession}
              startIcon={<SaveIcon />}
              sx={{
                borderColor: '#114417DB',
                color: '#114417DB',
                '&:hover': {
                  borderColor: '#0a2f0e',
                  backgroundColor: 'rgba(17, 68, 23, 0.08)'
                },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Save as Draft
            </Button>
            <Button
              variant="outlined"
              onClick={handleSkipToNextStep}
              sx={{
                borderColor: '#6b7280',
                color: '#6b7280',
                '&:hover': {
                  borderColor: '#4b5563',
                  backgroundColor: '#f3f4f6'
                },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Skip
            </Button>
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Upload File
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Upload your existing files to attach to the session
            </Typography>
          </Box>
        </Box>
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
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                fullWidth
                size="large"
                onClick={handlePreviousStep}
                sx={{
                  borderColor: '#6b7280',
                  color: '#6b7280',
                  '&:hover': {
                    borderColor: '#4b5563',
                    backgroundColor: '#f3f4f6'
                  },
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                fullWidth
                size="large"
                onClick={handleContentCreatorProceed}
                disabled={selectedFiles.length === 0}
                sx={{
                  backgroundColor: '#114417DB',
                  '&:hover': { backgroundColor: '#0a2f0e' },
                  '&:disabled': { backgroundColor: '#d1d5db', color: '#9ca3af' },
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Next
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
      case 'live-trainings':
        return renderLiveTrainingsContentCreator();
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

            {/* Previous and Next Buttons */}
            <Box display="flex" gap={2} mt={4}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                fullWidth
                size="large"
                onClick={handlePreviousStep}
                sx={{
                  borderColor: '#6b7280',
                  color: '#6b7280',
                  '&:hover': {
                    borderColor: '#4b5563',
                    backgroundColor: '#f3f4f6'
                  },
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                fullWidth
                size="large"
                onClick={handleProceedToQuiz}
                sx={{
                  backgroundColor: '#114417DB',
                  '&:hover': { backgroundColor: '#0a2f0e' },
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Next
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
      setScheduleDate(session.scheduledDate || '');
      setScheduleTime(session.scheduledTime || '');
      setScheduleDueDate(session.dueDate || '');
      setScheduleDueTime(session.dueTime || '');
      setShowCalendar(true);
    } else {
      // Open session selection view
      setShowScheduleDialog(true);
      setSelectedSessionForScheduling(null);
      setScheduleDate('');
      setScheduleTime('');
      setScheduleDueDate('');
      setScheduleDueTime('');
      setShowCalendar(false);
    }
  };

  const handleConfirmSchedule = () => {
    if (!scheduleDate || !scheduleTime) {
      showToast('Please select both date and time', 'warning');
      return;
    }
    setShowCalendar(false);
  };

  const handleSendAndPublish = () => {
    if (!scheduleDate || !scheduleTime) {
      showToast('Please select both date and time', 'warning');
      return;
    }

    if (!scheduleDueDate || !scheduleDueTime) {
      showToast('Please select a due date and time', 'warning');
      return;
    }

    const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
    const dueDateTime = new Date(`${scheduleDueDate}T${scheduleDueTime}`);

    if (dueDateTime <= scheduledDateTime) {
      showToast('Due date must be after the session start time.', 'warning');
      return;
    }
    
    // Check for skipped steps and prompt user to complete them
    const stepOrder = ['create', 'content-creator', 'assessment', 'certification', 'preview', 'schedule'];
    const skippedStepNames = {
      'create': 'Create New Session',
      'content-creator': 'Content Creator',
      'assessment': 'Assessment',
      'certification': 'Certification',
      'preview': 'Preview',
      'schedule': 'Schedule'
    };
    
    const skippedStepsList = stepOrder.filter(step => skippedSteps.has(step));
    if (skippedStepsList.length > 0) {
      const skippedStepNamesList = skippedStepsList.map(step => skippedStepNames[step]).join(', ');
      showToast(`Please complete the following skipped steps before publishing: ${skippedStepNamesList}`, 'error');
      
      // Navigate to the first skipped step
      const firstSkippedStep = skippedStepsList[0];
      setManageSessionTab(firstSkippedStep);
      setManageSessionView(firstSkippedStep);
      setActiveTab('manage-session');
      setShowScheduleDialog(false);
      return;
    }
    
    // Get or use the draft ID to ensure we update the same session
    const sessionId = selectedSessionForScheduling?.id || sessionFormData?.draftId || Date.now();
    
    // Build complete session with all data
    const resolvedSessionForm = sessionContentSnapshot?.sessionForm || sessionFormData;
    const resolvedAiContent = sessionContentSnapshot?.aiContent ?? (aiContentGenerated ? { keywords: aiKeywords } : null);
    
    // For files, prioritize selectedFiles (which should have dataUrl for videos)
    // This ensures videos have dataUrl when published
    let resolvedFiles;
    if (selectedFiles && selectedFiles.length > 0) {
      resolvedFiles = mapFilesToMetadata(selectedFiles);
    } else {
      resolvedFiles = sessionContentSnapshot?.files ?? mapFilesToMetadata(selectedFiles);
    }
    
    const resolvedQuiz = currentQuizData?.quiz || currentQuizData || null;
    const resolvedCreationMode = sessionContentSnapshot?.creationMode ?? selectedCreationMode;
    
    const hasCertificate = selectedTemplate && fieldsSaved;
    const sessionCert = hasCertificate ? {
      id: 'preview-cert',
      name: selectedTemplate.name || 'Certificate',
      template: selectedTemplate,
      fields: certificateFields
    } : null;
    
    // Create session with scheduled status (will auto-publish when start time arrives)
    const updatedSession = {
      ...selectedSessionForScheduling,
      id: sessionId,
      title: resolvedSessionForm.title || selectedSessionForScheduling?.title || 'Untitled Session',
      description: resolvedSessionForm.description || selectedSessionForScheduling?.description || '',
      type: resolvedSessionForm.type || selectedSessionForScheduling?.type || 'compliance',
      audience: resolvedSessionForm.audience || selectedSessionForScheduling?.audience || 'all',
      files: resolvedFiles,
      quiz: resolvedQuiz,
      aiContent: resolvedAiContent,
      creationMode: resolvedCreationMode,
      certificate: sessionCert || selectedSessionForScheduling?.certificate || null,
      scheduledDate: scheduleDate,
      scheduledTime: scheduleTime,
      scheduledDateTime: scheduledDateTime.toISOString(),
      dueDate: scheduleDueDate,
      dueTime: scheduleDueTime,
      dueDateTime: dueDateTime.toISOString(),
      status: 'scheduled', // Changed from 'published' to 'scheduled'
      isLocked: false,
      approvalExpiresAt: null,
      lastApprovalDate: null,
      createdAt: selectedSessionForScheduling?.createdAt || new Date().toISOString(),
      savedAt: new Date().toISOString(),
      publishedAt: null // Will be set when auto-published
    };

    // Remove from draft sessions
    setDraftSessions(prev => prev.filter(s => s.id !== sessionId));
    
    // Add/update in published sessions (will show as scheduled with countdown)
    setPublishedSessions(prev => {
      const filtered = prev.filter(s => s.id !== sessionId);
      const updated = [normalizePublishedSession(updatedSession), ...filtered];
      safeSetLocalStorage('published_sessions', updated);
      // Dispatch event for employee dashboard
      window.dispatchEvent(new Event('published-sessions-updated'));
      return updated;
    });

    // Log activity
    addActivity(
      `Session saved and scheduled: ${updatedSession.title} (Publishing in ${getTimeUntilPublish(scheduledDateTime)})`,
      'Admin',
      'scheduled',
      'session_scheduled'
    );

    // Mark all steps as complete
    setSkippedSteps(new Set());

    // Clear form state
    setSelectedSessionForScheduling(null);
    setScheduleDate('');
    setScheduleTime('');
    setScheduleDueDate('');
    setScheduleDueTime('');
    setShowCalendar(false);
    setSelectedDepartment('');
    setSessionFormData({ type: '', audience: '' });
    setSelectedFiles([]);
    setCurrentQuizData(null);
    setAiContentGenerated(false);
    setAiKeywords('');
    setSelectedCreationMode(null);
    setSelectedTemplate(null);
    setCertificateFields({});
    setFieldsSaved(false);
    
    // Navigate back to session library
    setActiveTab('course-library');
    
    showToast('Session saved and scheduled successfully! It will auto-publish when the start time arrives.', 'success');
  };
  
  // Helper function to calculate time until publish
  const getTimeUntilPublish = (publishDate) => {
    const now = new Date();
    const diff = publishDate - now;
    
    if (diff <= 0) return 'now';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} and ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  };

  const renderScheduleSessions = () => {
    // Build current session from state if not already set
    if (!selectedSessionForScheduling) {
      const resolvedSessionForm = sessionContentSnapshot?.sessionForm || sessionFormData;
      const resolvedAiContent = sessionContentSnapshot?.aiContent ?? (aiContentGenerated ? { keywords: aiKeywords } : null);
      const resolvedFiles = sessionContentSnapshot?.files ?? mapFilesToMetadata(selectedFiles);
      const resolvedQuiz = currentQuizData?.quiz || null;
      const resolvedCreationMode = sessionContentSnapshot?.creationMode ?? selectedCreationMode;
      
      const hasCertificate = selectedTemplate && fieldsSaved;
      const sessionCert = hasCertificate ? {
        id: 'preview-cert',
        name: selectedTemplate.name || 'Certificate',
        template: selectedTemplate,
        fields: certificateFields
      } : null;
      
      const currentSession = {
        id: Date.now(),
        title: resolvedSessionForm.title || 'Untitled Session',
        description: resolvedSessionForm.description || '',
        type: resolvedSessionForm.type || 'compliance',
        audience: resolvedSessionForm.audience || 'all',
        files: resolvedFiles,
        quiz: resolvedQuiz,
        aiContent: resolvedAiContent,
        creationMode: resolvedCreationMode,
        certificate: sessionCert,
        status: 'draft',
        createdAt: new Date().toISOString()
      };
      
      setSelectedSessionForScheduling(currentSession);
      
      // Prepopulate department based on audience
      const audience = resolvedSessionForm.audience || 'all';
      let prepopulatedDepartment = 'all';
      
      if (audience !== 'all' && employees.length > 0) {
        const matchingDept = employees.find(emp => 
          emp.department && emp.department.toLowerCase().includes(audience.toLowerCase())
        );
        if (matchingDept) {
          prepopulatedDepartment = matchingDept.department;
        }
      }
      
      if (!selectedDepartment) {
        setSelectedDepartment(prepopulatedDepartment);
      }
      setShowCalendar(true);
    }

    // Render schedule form inline (not as dialog)
    if (!selectedSessionForScheduling) {
      return (
        <Box p={3} textAlign="center">
          <Typography variant="body1" color="text.secondary">
            Loading session data...
          </Typography>
        </Box>
      );
    }

    const resolvedSessionForm = sessionContentSnapshot?.sessionForm || sessionFormData;
    
    const sessionTitle = selectedSessionForScheduling.title || resolvedSessionForm.title || 'Untitled Session';
    
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {showCalendar ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
            {/* Session Name - Non-editable */}
            <Box mb={3}>
              <TextField
                fullWidth
                label="Session Name"
                value={sessionTitle}
                InputProps={{
                  readOnly: true,
                }}
                sx={{
                  '& .MuiInputBase-input': {
                    backgroundColor: '#f3f4f6',
                    cursor: 'not-allowed'
                  }
                }}
              />
            </Box>

            {/* Select Date and Time - Full Screen */}
            <Box sx={{ flex: 1 }}>
              <Card sx={{ p: 4, backgroundColor: '#ffffff' }}>
                <Typography variant="h6" fontWeight="bold" mb={3} sx={{ color: '#114417DB' }}>
                  Select Date and Time
                </Typography>
                
                <Grid container spacing={3}>
                  {/* Start Date and Time - Two Column Layout */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      onClick={(e) => {
                        if (e.target.type !== 'date') {
                          e.target.showPicker?.();
                        }
                      }}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TodayIcon />
                          </InputAdornment>
                        ),
                        onClick: (e) => {
                          if (e.target.type !== 'date') {
                            const input = e.currentTarget.querySelector('input');
                            if (input && input.type === 'date') {
                              input.showPicker?.();
                            }
                          }
                        },
                        sx: { cursor: 'pointer' }
                      }}
                      sx={{ 
                        '& .MuiInputBase-root': { cursor: 'pointer' },
                        '& .MuiInputBase-input': { cursor: 'pointer' }
                      }}
                    />
                  </Grid>
              
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Start Time"
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      onClick={(e) => {
                        if (e.target.type !== 'time') {
                          e.target.showPicker?.();
                        }
                      }}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccessTimeIcon />
                          </InputAdornment>
                        ),
                        onClick: (e) => {
                          if (e.target.type !== 'time') {
                            const input = e.currentTarget.querySelector('input');
                            if (input && input.type === 'time') {
                              input.showPicker?.();
                            }
                          }
                        },
                        sx: { cursor: 'pointer' }
                      }}
                      sx={{ 
                        '& .MuiInputBase-root': { cursor: 'pointer' },
                        '& .MuiInputBase-input': { cursor: 'pointer' }
                      }}
                    />
                  </Grid>

                  {/* Due Date and Time - Two Column Layout */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Due Date"
                      type="date"
                      value={scheduleDueDate}
                      onChange={(e) => setScheduleDueDate(e.target.value)}
                      onClick={(e) => {
                        if (e.target.type !== 'date') {
                          e.target.showPicker?.();
                        }
                      }}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <TodayIcon />
                          </InputAdornment>
                        ),
                        onClick: (e) => {
                          if (e.target.type !== 'date') {
                            const input = e.currentTarget.querySelector('input');
                            if (input && input.type === 'date') {
                              input.showPicker?.();
                            }
                          }
                        },
                        sx: { cursor: 'pointer' }
                      }}
                      sx={{ 
                        '& .MuiInputBase-root': { cursor: 'pointer' },
                        '& .MuiInputBase-input': { cursor: 'pointer' }
                      }}
                      helperText="Employees must complete the session before this date."
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Due Time"
                      type="time"
                      value={scheduleDueTime}
                      onChange={(e) => setScheduleDueTime(e.target.value)}
                      onClick={(e) => {
                        if (e.target.type !== 'time') {
                          e.target.showPicker?.();
                        }
                      }}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AccessTimeIcon />
                          </InputAdornment>
                        ),
                        onClick: (e) => {
                          if (e.target.type !== 'time') {
                            const input = e.currentTarget.querySelector('input');
                            if (input && input.type === 'time') {
                              input.showPicker?.();
                            }
                          }
                        },
                        sx: { cursor: 'pointer' }
                      }}
                      sx={{ 
                        '& .MuiInputBase-root': { cursor: 'pointer' },
                        '& .MuiInputBase-input': { cursor: 'pointer' }
                      }}
                      helperText="After this time the session will lock automatically."
                    />
                  </Grid>

              {/* Department Selection */}
              <Grid item xs={12}>
                <FormControl fullWidth>
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
                {scheduleDueDate && scheduleDueTime && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Due by&nbsp;
                    <strong>{new Date(`${scheduleDueDate}T${scheduleDueTime}`).toLocaleString()}</strong>
                  </Typography>
                )}
              </Box>
            )}
              </Card>
            </Box>

            {/* Action Buttons - Bottom */}
            <Box display="flex" justifyContent="center" gap={2} mt={4} pt={3} borderTop="1px solid #e5e7eb">
              <Button
                variant="outlined"
                onClick={() => {
                  handleSaveAsDraft();
                  showToast('Draft saved successfully!', 'success');
                }}
                startIcon={<SaveIcon />}
                sx={{ 
                  color: '#114417DB', 
                  borderColor: '#114417DB',
                  minWidth: 150
                }}
              >
                Save as Draft
              </Button>
              <Button
                variant="outlined"
                onClick={handleQuizCancel}
                sx={{ 
                  color: '#ef4444', 
                  borderColor: '#ef4444',
                  minWidth: 150
                }}
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                onClick={handlePreviousStep}
                startIcon={<ArrowBackIcon />}
                sx={{ minWidth: 150 }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                onClick={handleSendAndPublish}
                disabled={!scheduleDate || !scheduleTime || !scheduleDueDate || !scheduleDueTime || !selectedDepartment}
                startIcon={<SendIcon />}
                sx={{
                  backgroundColor: '#114417DB',
                  '&:hover': { backgroundColor: '#0a2f0e' },
                  minWidth: 150
                }}
              >
                Save & Publish
              </Button>
            </Box>
          </Box>
        ) : (
          <Box textAlign="center" py={8}>
            <Typography variant="body1" color="text.secondary">
              Please select date and time to schedule the session
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  // Keep the old renderScheduleSessions for backward compatibility (session list view)
  const renderScheduleSessionsList = () => {
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
                    backgroundColor: scheduleSessionsViewMode === 'grid' ? '#114417DB' : 'transparent',
                    color: scheduleSessionsViewMode === 'grid' ? 'white' : '#666',
                    border: '1px solid #e5e7eb',
                    '&:hover': {
                      backgroundColor: scheduleSessionsViewMode === 'grid' ? '#0a2f0e' : '#f0fdf4'
                    }
                  }}
                >
                  <GridViewIcon />
                </IconButton>
                <IconButton
                  onClick={() => setScheduleSessionsViewMode('list')}
                  sx={{
                    backgroundColor: scheduleSessionsViewMode === 'list' ? '#114417DB' : 'transparent',
                    color: scheduleSessionsViewMode === 'list' ? 'white' : '#666',
                    border: '1px solid #e5e7eb',
                    '&:hover': {
                      backgroundColor: scheduleSessionsViewMode === 'list' ? '#0a2f0e' : '#f0fdf4'
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
                                    backgroundColor: '#114417DB',
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
                                        backgroundColor: '#114417DB',
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
                                    <CalendarIcon sx={{ fontSize: 16, color: '#114417DB' }} />
                                    <Typography variant="body2" color="#114417DB" fontWeight="medium">
                                      Scheduled: {new Date(session.scheduledDateTime).toLocaleString()}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>

                              {/* Action Buttons */}
                              <Box display="flex" gap={1} alignItems="center">
                                <Button
                                  variant="contained"
                                  startIcon={<CalendarIcon />}
                                  onClick={() => handleOpenScheduleDialog(session)}
                                  sx={{
                                    backgroundColor: isScheduled ? '#114417DB' : '#114417DB',
                                    '&:hover': { 
                                      backgroundColor: isScheduled ? '#0a2f0e' : '#0a2f0e' 
                                    }
                                  }}
                                >
                                  {isScheduled ? 'Reschedule' : 'Schedule Session'}
                                </Button>
                                <IconButton
                                  onClick={() => handleDeletePublishedSession(session.id)}
                                  sx={{
                                    color: '#ef4444',
                                    '&:hover': { 
                                      backgroundColor: '#fee2e2' 
                                    }
                                  }}
                                >
                                  <DeleteForeverIcon />
                                </IconButton>
                              </Box>
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
                                    backgroundColor: '#114417DB',
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
                                    <CalendarIcon sx={{ fontSize: 16, color: '#114417DB' }} />
                                    <Typography variant="body2" color="#114417DB" fontWeight="medium" fontSize="0.75rem">
                                      {new Date(session.scheduledDateTime).toLocaleString()}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                              <Box display="flex" gap={1} mt={1}>
                                <Button
                                  variant="contained"
                                  fullWidth
                                  startIcon={<CalendarIcon />}
                                  onClick={() => handleOpenScheduleDialog(session)}
                                  sx={{
                                    backgroundColor: isScheduled ? '#114417DB' : '#114417DB',
                                    '&:hover': { 
                                      backgroundColor: isScheduled ? '#0a2f0e' : '#0a2f0e' 
                                    },
                                    flex: 1
                                  }}
                                >
                                  {isScheduled ? 'Reschedule' : 'Schedule Session'}
                                </Button>
                                <IconButton
                                  onClick={() => handleDeletePublishedSession(session.id)}
                                  sx={{
                                    color: '#ef4444',
                                    border: '1px solid #fee2e2',
                                    '&:hover': { 
                                      backgroundColor: '#fee2e2',
                                      borderColor: '#ef4444'
                                    }
                                  }}
                                >
                                  <DeleteForeverIcon />
                                </IconButton>
                              </Box>
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
                    backgroundColor: scheduleSessionsViewMode === 'grid' ? '#114417DB' : 'transparent',
                    color: scheduleSessionsViewMode === 'grid' ? 'white' : '#666',
                    border: '1px solid #e5e7eb',
                    '&:hover': {
                      backgroundColor: scheduleSessionsViewMode === 'grid' ? '#0a2f0e' : '#f0fdf4'
                    }
                  }}
                >
                  <GridViewIcon />
                </IconButton>
                <IconButton
                  onClick={() => setScheduleSessionsViewMode('list')}
                  sx={{
                    backgroundColor: scheduleSessionsViewMode === 'list' ? '#114417DB' : 'transparent',
                    color: scheduleSessionsViewMode === 'list' ? 'white' : '#666',
                    border: '1px solid #e5e7eb',
                    '&:hover': {
                      backgroundColor: scheduleSessionsViewMode === 'list' ? '#0a2f0e' : '#f0fdf4'
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
                    <Box display="flex" gap={1} alignItems="center">
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
                      <IconButton
                        onClick={() => handleDeletePublishedSession(session.id)}
                        sx={{
                          color: '#ef4444',
                          '&:hover': { 
                            backgroundColor: '#fee2e2' 
                          }
                        }}
                      >
                        <DeleteForeverIcon />
                      </IconButton>
                    </Box>
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
                    <Box display="flex" gap={1} mt={1}>
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
                          flex: 1
                        }}
                      >
                        Schedule Session
                      </Button>
                      <IconButton
                        onClick={() => handleDeletePublishedSession(session.id)}
                        sx={{
                          color: '#ef4444',
                          border: '1px solid #fee2e2',
                          '&:hover': { 
                            backgroundColor: '#fee2e2',
                            borderColor: '#ef4444'
                          }
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
            setScheduleDueDate('');
            setScheduleDueTime('');
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

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  value={scheduleDueDate}
                  onChange={(e) => setScheduleDueDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <TodayIcon />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Employees must complete the session before this date."
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Due Time"
                  type="time"
                  value={scheduleDueTime}
                  onChange={(e) => setScheduleDueTime(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccessTimeIcon />
                      </InputAdornment>
                    ),
                  }}
                  helperText="After this time the session will lock automatically."
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
                {scheduleDueDate && scheduleDueTime && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Due by&nbsp;
                    <strong>{new Date(`${scheduleDueDate}T${scheduleDueTime}`).toLocaleString()}</strong>
                  </Typography>
                )}
              </Box>
            )}

            {/* Session Content Display */}
            {(selectedSessionForScheduling.files?.length > 0 || selectedSessionForScheduling.quiz || selectedSessionForScheduling.questions) && (
              <Box mt={4}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Session Content
                </Typography>
                <Card sx={{ p: 2, backgroundColor: '#f8f9fa' }}>
                  {/* Uploaded Files */}
                  {selectedSessionForScheduling.files && selectedSessionForScheduling.files.length > 0 && (
                    <Box mb={3}>
                      <Typography variant="body1" fontWeight="medium" mb={1.5} display="flex" alignItems="center" gap={1}>
                        <CloudUploadIcon sx={{ fontSize: 20 }} />
                        Uploaded Files ({selectedSessionForScheduling.files.length})
                      </Typography>
                      <List dense>
                        {selectedSessionForScheduling.files.map((file, index) => {
                          const isVideo = file.type?.startsWith('video/');
                          const isImage = file.type?.startsWith('image/');
                          const isPDF = file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf');
                          const isPresentation = file.type?.includes('presentation') || file.type?.includes('powerpoint') || 
                                                file.name?.toLowerCase().match(/\.(ppt|pptx)$/);
                          const isWord = file.type?.includes('word') || file.name?.toLowerCase().match(/\.(doc|docx)$/);
                          
                          let FileIconComponent = FileIcon;
                          if (isVideo) FileIconComponent = VideoLibraryIcon;
                          else if (isImage) FileIconComponent = ImageIcon;
                          else if (isPDF || isPresentation) FileIconComponent = DescriptionIcon;
                          else if (isWord) FileIconComponent = ArticleIcon;
                          
                          return (
                            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                              <ListItemIcon>
                                <FileIconComponent sx={{ color: '#3b82f6' }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={file.name}
                                secondary={file.size ? formatFileSize(file.size) : 'Unknown size'}
                              />
                            </ListItem>
                          );
                        })}
                      </List>
                    </Box>
                  )}

                  {/* Quiz/Assessment */}
                  {(selectedSessionForScheduling.quiz || selectedSessionForScheduling.questions) && (
                    <Box mb={selectedSessionForScheduling.files?.length > 0 ? 2 : 0}>
                      <Typography variant="body1" fontWeight="medium" mb={1.5} display="flex" alignItems="center" gap={1}>
                        <QuizIcon sx={{ fontSize: 20 }} />
                        Assessment/Quiz
                      </Typography>
                      <Box sx={{ pl: 4 }}>
                        {selectedSessionForScheduling.quiz?.title && (
                          <Typography variant="body2" gutterBottom>
                            <strong>Title:</strong> {selectedSessionForScheduling.quiz.title}
                          </Typography>
                        )}
                        {selectedSessionForScheduling.quiz?.description && (
                          <Typography variant="body2" gutterBottom>
                            <strong>Description:</strong> {selectedSessionForScheduling.quiz.description}
                          </Typography>
                        )}
                        {((selectedSessionForScheduling.quiz?.questions || selectedSessionForScheduling.questions)?.length > 0) && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Questions:</strong> {(selectedSessionForScheduling.quiz?.questions || selectedSessionForScheduling.questions)?.length || 0}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Additional Content Info */}
                  {selectedSessionForScheduling.creationMode && (
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Creation Mode:</strong> {selectedSessionForScheduling.creationMode}
                      </Typography>
                    </Box>
                  )}
                </Card>
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
                  setScheduleDueDate('');
                  setScheduleDueTime('');
                  setShowCalendar(false);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmSchedule}
                disabled={!scheduleDate || !scheduleTime || !scheduleDueDate || !scheduleDueTime}
                sx={{
                  backgroundColor: '#114417DB',
                  '&:hover': { backgroundColor: '#0a2f0e' }
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
                  <CalendarIcon sx={{ color: '#114417DB' }} />
                  <Typography variant="body1" fontWeight="bold" color="#114417DB">
                    Scheduled for: {new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString()}
                  </Typography>
                </Box>
                {scheduleDueDate && scheduleDueTime && (
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <WarningIcon sx={{ color: '#f59e0b' }} />
                    <Typography variant="body2" fontWeight="medium" color="#b45309">
                      Due by: {new Date(`${scheduleDueDate}T${scheduleDueTime}`).toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </Card>
            </Box>

            {/* Session Content Display */}
            {(selectedSessionForScheduling.files?.length > 0 || selectedSessionForScheduling.quiz || selectedSessionForScheduling.questions) && (
              <Box mb={4}>
                <Typography variant="body1" fontWeight="medium" mb={2}>
                  Session Content:
                </Typography>
                <Card sx={{ p: 3, backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
                  {/* Uploaded Files */}
                  {selectedSessionForScheduling.files && selectedSessionForScheduling.files.length > 0 && (
                    <Box mb={3}>
                      <Typography variant="body1" fontWeight="medium" mb={2} display="flex" alignItems="center" gap={1}>
                        <CloudUploadIcon sx={{ fontSize: 22, color: '#3b82f6' }} />
                        Uploaded Files ({selectedSessionForScheduling.files.length})
                      </Typography>
                      <Grid container spacing={2}>
                        {selectedSessionForScheduling.files.map((file, index) => {
                          const isVideo = file.type?.startsWith('video/');
                          const isImage = file.type?.startsWith('image/');
                          const isPDF = file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf');
                          const isPresentation = file.type?.includes('presentation') || file.type?.includes('powerpoint') || 
                                                file.name?.toLowerCase().match(/\.(ppt|pptx)$/);
                          const isWord = file.type?.includes('word') || file.name?.toLowerCase().match(/\.(doc|docx)$/);
                          
                          let FileIconComponent = FileIcon;
                          let iconColor = '#6b7280';
                          if (isVideo) { FileIconComponent = VideoLibraryIcon; iconColor = '#ef4444'; }
                          else if (isImage) { FileIconComponent = ImageIcon; iconColor = '#114417DB'; }
                          else if (isPDF || isPresentation) { FileIconComponent = DescriptionIcon; iconColor = '#f59e0b'; }
                          else if (isWord) { FileIconComponent = ArticleIcon; iconColor = '#3b82f6'; }
                          
                          return (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                              <Card sx={{ p: 2, border: '1px solid #e5e7eb', '&:hover': { boxShadow: 2 } }}>
                                <Box display="flex" alignItems="center" gap={2}>
                                  <Box
                                    sx={{
                                      width: 48,
                                      height: 48,
                                      borderRadius: 1,
                                      backgroundColor: `${iconColor}15`,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}
                                  >
                                    <FileIconComponent sx={{ color: iconColor, fontSize: 28 }} />
                                  </Box>
                                  <Box flex={1} sx={{ minWidth: 0 }}>
                                    <Typography variant="body2" fontWeight="medium" noWrap>
                                      {file.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                      {file.size ? formatFileSize(file.size) : 'Unknown size'}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Card>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box>
                  )}

                  {/* Quiz/Assessment */}
                  {(selectedSessionForScheduling.quiz || selectedSessionForScheduling.questions) && (
                    <Box>
                      {selectedSessionForScheduling.files?.length > 0 && <Divider sx={{ my: 3 }} />}
                      <Typography variant="body1" fontWeight="medium" mb={2} display="flex" alignItems="center" gap={1}>
                        <QuizIcon sx={{ fontSize: 22, color: '#8b5cf6' }} />
                        Assessment/Quiz
                      </Typography>
                      <Box sx={{ pl: 4, backgroundColor: '#f9fafb', p: 2, borderRadius: 1 }}>
                        {selectedSessionForScheduling.quiz?.title && (
                          <Typography variant="body2" gutterBottom>
                            <strong>Title:</strong> {selectedSessionForScheduling.quiz.title}
                          </Typography>
                        )}
                        {selectedSessionForScheduling.quiz?.description && (
                          <Typography variant="body2" gutterBottom>
                            <strong>Description:</strong> {selectedSessionForScheduling.quiz.description}
                          </Typography>
                        )}
                        {((selectedSessionForScheduling.quiz?.questions || selectedSessionForScheduling.questions)?.length > 0) && (
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            <strong>Total Questions:</strong> {(selectedSessionForScheduling.quiz?.questions || selectedSessionForScheduling.questions)?.length || 0}
                          </Typography>
                        )}
                        {selectedSessionForScheduling.assessmentInfo && (
                          <Box mt={1.5}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Assessment Type:</strong> {selectedSessionForScheduling.assessmentInfo.type || 'Standard'}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}

                  {/* Additional Content Info */}
                  {selectedSessionForScheduling.creationMode && (
                    <Box mt={2}>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body2" color="text.secondary">
                        <strong>Creation Mode:</strong> {selectedSessionForScheduling.creationMode}
                      </Typography>
                    </Box>
                  )}
                </Card>
              </Box>
            )}

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
                  backgroundColor: '#114417DB',
                  '&:hover': { backgroundColor: '#0a2f0e' }
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
  // Helper functions for editing
  const handleDeleteFile = (fileIndex) => {
    if (!editingSession) return;
    const updated = JSON.parse(JSON.stringify(editingSession));
    if (updated.files) {
      updated.files = updated.files.filter((_, idx) => idx !== fileIndex);
    }
    setEditingSession(updated);
  };

  const handleDeleteQuestion = (questionIndex) => {
    if (!editingSession) return;
    const updated = JSON.parse(JSON.stringify(editingSession));
    if (updated.quiz?.questions) {
      updated.quiz.questions = updated.quiz.questions.filter((_, idx) => idx !== questionIndex);
    } else if (updated.questions) {
      updated.questions = updated.questions.filter((_, idx) => idx !== questionIndex);
    }
    setEditingSession(updated);
  };

  const handleRemoveCertification = () => {
    if (!editingSession) return;
    const updated = JSON.parse(JSON.stringify(editingSession));
    // Remove certification association
    setSessionCertifications(prev => {
      const newCerts = { ...prev };
      delete newCerts[updated.id];
      return newCerts;
    });
    setEditingSession(updated);
  };

  const handleAddFile = (event) => {
    if (!editingSession) return;
    const files = Array.from(event.target.files);
    const updated = JSON.parse(JSON.stringify(editingSession));
    if (!updated.files) updated.files = [];
    updated.files = [...updated.files, ...files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    }))];
    setEditingSession(updated);
  };

  const renderSessionDetail = (session) => {
    if (!selectedAllSessionItem) return null;

    const isDraft = selectedAllSessionItem.folderType === 'drafts';
    const isAssessment = selectedAllSessionItem.folderType === 'assessments';
    const isPublished = selectedAllSessionItem.folderType === 'published';
    const isEditMode = viewMode === 'edit';
    const sessionToDisplay = isEditMode && editingSession ? editingSession : selectedAllSessionItem;

    return (
      <Box p={3}>
        <Box mb={3} display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={() => { 
              setSelectedAllSessionItem(null); 
              setViewMode(null);
              setEditingSession(null);
            }}>
              <ArrowBackIcon />
            </IconButton>
            {isEditMode ? (
              <TextField
                value={sessionToDisplay.title || ''}
                onChange={(e) => {
                  const updated = JSON.parse(JSON.stringify(editingSession));
                  updated.title = e.target.value;
                  setEditingSession(updated);
                }}
                variant="outlined"
                sx={{ minWidth: 400 }}
                placeholder="Session Title"
              />
            ) : (
              <Typography variant="h4" fontWeight="bold">
                {sessionToDisplay.title || 'Untitled Session'}
              </Typography>
            )}
          </Box>
          {isEditMode && (
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveEdits}
                sx={{ backgroundColor: '#114417DB', '&:hover': { backgroundColor: '#0a2f0e' } }}
              >
                Save Changes
              </Button>
            </Box>
          )}
        </Box>

        <Card sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {!isEditMode && (
                <>
                  <Typography variant="body2" color="text.secondary" gutterBottom>Title</Typography>
                  <Typography variant="h6" mb={2}>{sessionToDisplay.title || 'Untitled Session'}</Typography>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>Description</Typography>
                  <Typography variant="body1" mb={2}>{sessionToDisplay.description || 'No description'}</Typography>
                </>
              )}
              {isEditMode && (
                <>
                  <TextField
                    label="Description"
                    value={sessionToDisplay.description || ''}
                    onChange={(e) => {
                      const updated = JSON.parse(JSON.stringify(editingSession));
                      updated.description = e.target.value;
                      setEditingSession(updated);
                    }}
                    fullWidth
                    multiline
                    rows={3}
                    margin="normal"
                  />
                </>
              )}
              
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
                                  showToast('File preview not available. The file may need to be re-uploaded.', 'warning');
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
                                  showToast('File download not available. The file may need to be re-uploaded.', 'warning');
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

        {/* Uploaded Module Section */}
        <Card sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Uploaded Module
          </Typography>
          
          {/* AI Generated Content */}
          {(selectedAllSessionItem.aiContent || selectedAllSessionItem.resumeState?.aiContentGenerated) && (
            <Box mb={3} p={2} sx={{ backgroundColor: '#fef3c7', borderRadius: 1, borderLeft: '4px solid #f59e0b' }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <FireIcon sx={{ color: '#f59e0b' }} />
                <Typography variant="body1" fontWeight="bold">
                  AI Generated Content
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Keywords: {selectedAllSessionItem.aiContent?.keywords || selectedAllSessionItem.resumeState?.aiKeywords || 'N/A'}
              </Typography>
            </Box>
          )}

          {/* Creation Mode Content */}
          {selectedAllSessionItem.creationMode && (
            <Box mb={3} p={2} sx={{ backgroundColor: '#dbeafe', borderRadius: 1, borderLeft: '4px solid #3b82f6' }}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                {selectedAllSessionItem.creationMode === 'powerpoint' ? <ArticleIcon sx={{ color: '#3b82f6' }} /> :
                 selectedAllSessionItem.creationMode === 'word' ? <DescriptionIcon sx={{ color: '#3b82f6' }} /> :
                 <VideoLibraryIcon sx={{ color: '#3b82f6' }} />}
                <Typography variant="body1" fontWeight="bold">
                  Created Content: {selectedAllSessionItem.creationMode === 'powerpoint' ? 'PowerPoint Presentation' : 
                                   selectedAllSessionItem.creationMode === 'word' ? 'Word Document' : 
                                   'Training Video'}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Uploaded Files */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="body1" fontWeight="bold">
              Uploaded Files ({sessionToDisplay.files?.length || 0})
            </Typography>
            {isEditMode && (
              <Button
                variant="outlined"
                size="small"
                component="label"
                startIcon={<CloudUploadIcon />}
              >
                Add File
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={handleAddFile}
                />
              </Button>
            )}
          </Box>
          
          {sessionToDisplay.files && sessionToDisplay.files.length > 0 && (
            <Box display="flex" gap={2} flexWrap="wrap" mt={2}>
              {sessionToDisplay.files.map((file, idx) => {
                const fileObj = typeof file === 'string' ? { name: file } : file;
                return (
                  <Card key={idx} sx={{ p: 2, minWidth: 150, textAlign: 'center', border: '1px solid #e5e7eb', position: 'relative' }}>
                    {isEditMode && (
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteFile(idx)}
                        sx={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          backgroundColor: 'white',
                          '&:hover': { backgroundColor: '#fee2e2' },
                          color: '#ef4444'
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                    <FileIcon sx={{ fontSize: 48, color: '#3b82f6', mb: 1 }} />
                    <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                      {fileObj.name || file || 'Unknown'}
                    </Typography>
                    {fileObj.size && (
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(fileObj.size)}
                      </Typography>
                    )}
                  </Card>
                );
              })}
            </Box>
          )}

          {(!sessionToDisplay.files || sessionToDisplay.files.length === 0) && 
           !sessionToDisplay.aiContent && 
           !sessionToDisplay.creationMode && (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              No module content uploaded
            </Typography>
          )}
        </Card>

        {/* Certificate Section */}
        {hasCertification(sessionToDisplay.id) && (
          <Card sx={{ p: 3, mb: 3, backgroundColor: 'rgba(17, 68, 23, 0.04)', border: '2px solid #114417DB' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Box display="flex" alignItems="center" gap={2}>
                <AwardIcon sx={{ color: '#114417DB', fontSize: 40 }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="#114417DB">
                    Certification Attached
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This session includes a certificate that will be issued upon completion
                  </Typography>
                </Box>
              </Box>
              {isEditMode && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleRemoveCertification}
                  sx={{
                    borderColor: '#ef4444',
                    color: '#ef4444',
                    '&:hover': {
                      borderColor: '#dc2626',
                      backgroundColor: '#fee2e2'
                    }
                  }}
                >
                  Remove Certificate
                </Button>
              )}
            </Box>
            {!isEditMode && (
              <Button
                variant="outlined"
                startIcon={<CertificateIcon />}
                onClick={() => handleOpenCertifications(sessionToDisplay)}
                sx={{
                borderColor: '#114417DB',
                color: '#114417DB',
                  '&:hover': {
                  borderColor: '#0a2f0e',
                  backgroundColor: 'rgba(17, 68, 23, 0.08)'
                  }
                }}
              >
                View Certificate Details
              </Button>
            )}
            {isEditMode && (
              <Button
                variant="outlined"
                startIcon={<CertificateIcon />}
                onClick={() => handleOpenCertifications(sessionToDisplay)}
                sx={{
                borderColor: '#114417DB',
                color: '#114417DB',
                  '&:hover': {
                  borderColor: '#0a2f0e',
                  backgroundColor: 'rgba(17, 68, 23, 0.08)'
                  }
                }}
              >
                Edit Certificate
              </Button>
            )}
          </Card>
        )}

        {/* Complete Questionnaire/Quiz Preview */}
        {(sessionToDisplay.quiz?.questions || sessionToDisplay.questions) && (
          <Card sx={{ p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight="bold">
                Complete Questionnaire
              </Typography>
              {isEditMode && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addQuestion}
                >
                  Add Question
                </Button>
              )}
            </Box>
            
            {isAssessment && sessionToDisplay.assessmentInfo && (
              <Box mb={3} p={2} sx={{ backgroundColor: '#eff6ff', borderRadius: 1 }}>
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  Assessment Title: {sessionToDisplay.assessmentInfo.quizTitle || sessionToDisplay.title || 'Untitled Assessment'}
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap" mt={1}>
                  <Chip 
                    label={`Passing Score: ${sessionToDisplay.assessmentInfo.passingScore || 'N/A'}%`} 
                    size="small" 
                    color="primary"
                  />
                  <Chip 
                    label={`Max Attempts: ${sessionToDisplay.assessmentInfo.maxAttempts || 'N/A'}`} 
                    size="small" 
                    color="secondary"
                  />
                  {(sessionToDisplay.quiz?.questions || sessionToDisplay.questions) && (
                    <Chip 
                      label={`${(sessionToDisplay.quiz?.questions || sessionToDisplay.questions).length} Questions`} 
                      size="small" 
                      color="success"
                    />
                  )}
                </Box>
              </Box>
            )}

            <Box>
              {(sessionToDisplay.quiz?.questions || sessionToDisplay.questions || []).map((question, index) => (
                <Card key={index} sx={{ mb: 3, p: 3, border: '1px solid #e5e7eb', position: 'relative' }}>
                  {isEditMode && (
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteQuestion(index)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        color: '#ef4444',
                        '&:hover': { backgroundColor: '#fee2e2' }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
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
                      {isEditMode ? (
                        <TextField
                          fullWidth
                          value={question.text || question.question || ''}
                          onChange={(e) => updateEditingQuestion(index, 'text', e.target.value)}
                          variant="outlined"
                          placeholder="Question text"
                          sx={{ mb: 2 }}
                        />
                      ) : (
                        <Typography variant="h6" fontWeight="medium" gutterBottom>
                          {question.text || question.question || 'Untitled Question'}
                        </Typography>
                      )}
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
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" color="text.secondary" fontWeight="medium">
                          Options:
                        </Typography>
                        {isEditMode && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={() => addOptionToQuestion(index)}
                          >
                            Add Option
                          </Button>
                        )}
                      </Box>
                      {isEditMode ? (
                        <Box sx={{ mt: 1 }}>
                          {question.options.map((option, optIdx) => (
                            <Box key={optIdx} sx={{ mb: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                              <TextField
                                fullWidth
                                size="small"
                                value={typeof option === 'string' ? option : option.text || option.label || option || ''}
                                onChange={(e) => updateEditingOption(index, optIdx, e.target.value)}
                                placeholder={`Option ${optIdx + 1}`}
                              />
                              <IconButton
                                size="small"
                                onClick={() => removeOptionFromQuestion(index, optIdx)}
                                sx={{ color: '#ef4444' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          ))}
                        </Box>
                      ) : (
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
                      )}
                    </Box>
                  )}

                  {/* Correct Answer if specified */}
                  {question.correctAnswer !== undefined && question.type !== 'multiple-choice' && (
                    <Box mt={2} p={2} sx={{ backgroundColor: '#f0fdf4', borderRadius: 1 }}>
                      <Typography variant="body2" fontWeight="medium" color="#114417DB">
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

            {(sessionToDisplay.quiz?.questions || sessionToDisplay.questions || []).length === 0 && (
              <Box textAlign="center" py={4}>
                <QuizIcon sx={{ fontSize: 64, color: '#d1d5db', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No questions in this questionnaire
                </Typography>
                {isEditMode && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={addQuestion}
                    sx={{ mt: 2 }}
                  >
                    Add First Question
                  </Button>
                )}
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
                onClick={() => {
                  setEditingSession(JSON.parse(JSON.stringify(selectedAllSessionItem)));
                  setViewMode('edit');
                }}
              >
                Edit
              </Button>
              {!isPublished && (
                <Button
                  variant="contained"
                  startIcon={<PublishIcon />}
                  onClick={() => handleProceedToPublish(selectedAllSessionItem)}
                  sx={{ backgroundColor: '#114417DB', '&:hover': { backgroundColor: '#0a2f0e' } }}
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
                  showToast('Session updated successfully!', 'success');
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
    // Validate mandatory fields before showing publish dialog
    const validationErrors = validateMandatoryFields(session);
    if (validationErrors.length > 0) {
      const errorMessage = `Please complete the following mandatory fields before publishing:\n${validationErrors.join('\n')}`;
      showToast(errorMessage, 'error');
      
      // Navigate to the first missing section
      if (validationErrors.some(err => err.includes('Title') || err.includes('Type') || err.includes('Participants'))) {
        setManageSessionTab('create');
        setManageSessionView('create');
        setActiveTab('manage-session');
      } else if (validationErrors.some(err => err.includes('Content Creator'))) {
        setManageSessionTab('content-creator');
        setManageSessionView('content-creator');
        setShowContentCreator(true);
        setActiveTab('manage-session');
      } else if (validationErrors.some(err => err.includes('Schedule'))) {
        setManageSessionTab('schedule');
        setManageSessionView('schedule');
        setActiveTab('manage-session');
      }
      
      return;
    }

    setSessionToPublish(session);
    setPublishCourseData({
      courseImage: null,
      courseTitle: session.title || session.assessmentInfo?.quizTitle || 'Untitled Session',
      description: session.description || session.assessmentInfo?.description || '',
      skills: []
    });
    setShowPublishDialog(true);
  };

  // Validation function for mandatory fields
  const validateMandatoryFields = (sessionData = null) => {
    const resolvedSessionForm = sessionData?.sessionForm || sessionContentSnapshot?.sessionForm || sessionFormData;
    const errors = [];

    // Validate Create New Session fields
    if (!resolvedSessionForm.title || resolvedSessionForm.title.trim() === '') {
      errors.push('Session Title');
    }
    if (!resolvedSessionForm.type || resolvedSessionForm.type.trim() === '') {
      errors.push('Session Type');
    }
    if (!resolvedSessionForm.audience || resolvedSessionForm.audience.trim() === '') {
      errors.push('Participants');
    }

    // Validate Content Creator: At least one content must be created
    const resolvedAiContent = sessionData?.aiContent || (sessionContentSnapshot?.aiContent ?? (aiContentGenerated ? { keywords: aiKeywords } : null));
    const resolvedFiles = sessionData?.files || (sessionContentSnapshot?.files ?? mapFilesToMetadata(selectedFiles));
    const hasAiContent = resolvedAiContent && (resolvedAiContent.keywords || resolvedAiContent.content || resolvedAiContent.title);
    const hasFiles = resolvedFiles && resolvedFiles.length > 0;
    const hasLiveTraining = sessionData?.creationMode === 'live-training' || selectedCreationMode === 'live-training';
    const hasQuiz = sessionData?.quiz || currentQuizData?.quiz;

    if (!hasAiContent && !hasFiles && !hasLiveTraining && !hasQuiz) {
      errors.push('Content Creator (at least one content type required: AI Content, Uploaded Files, Live Training, or Assessment)');
    }

    // Validate Schedule: Must be scheduled
    const hasSchedule = sessionData?.scheduledDateTime || sessionData?.scheduledDate || scheduleDate;

    if (!hasSchedule) {
      errors.push('Schedule (session must be scheduled)');
    }

    return errors;
  };

  const handlePublishNow = () => {
    // Validate all mandatory fields before publishing
    const validationErrors = validateMandatoryFields(sessionToPublish);
    if (validationErrors.length > 0) {
      const errorMessage = `Please complete the following mandatory fields:\n${validationErrors.join('\n')}`;
      showToast(errorMessage, 'error');
      
      // Navigate to the first missing section
      if (validationErrors.some(err => err.includes('Title') || err.includes('Type') || err.includes('Participants'))) {
        setManageSessionTab('create');
        setManageSessionView('create');
      } else if (validationErrors.some(err => err.includes('Content Creator'))) {
        setManageSessionTab('content-creator');
        setManageSessionView('content-creator');
        setShowContentCreator(true);
      } else if (validationErrors.some(err => err.includes('Schedule'))) {
        setManageSessionTab('schedule');
        setManageSessionView('schedule');
      }
      
      setShowPublishDialog(false);
      setSessionToPublish(null);
      return;
    }

    if (!publishCourseData.courseTitle) {
      showToast('Please enter a session title', 'warning');
      return;
    }

    const publishedSession = {
      ...sessionToPublish,
      title: publishCourseData.courseTitle,
      description: publishCourseData.description || sessionToPublish?.description || '',
      skills: publishCourseData.skills,
      courseImage: publishCourseData.courseImage,
      status: 'published',
      publishedAt: new Date().toISOString(),
      scheduledDate: sessionToPublish?.scheduledDate || null,
      scheduledTime: sessionToPublish?.scheduledTime || null,
      scheduledDateTime: sessionToPublish?.scheduledDateTime || null,
      dueDate: sessionToPublish?.dueDate || null,
      dueTime: sessionToPublish?.dueTime || null,
      dueDateTime: sessionToPublish?.dueDateTime || null,
      isLocked: sessionToPublish?.isLocked ?? false,
      approvalExpiresAt: sessionToPublish?.approvalExpiresAt || null,
      lastApprovalDate: sessionToPublish?.lastApprovalDate || null,
      // Explicitly preserve files, quiz, and content
      files: sessionToPublish?.files || sessionToPublish?.resumeState?.selectedFiles || [],
      quiz: sessionToPublish?.quiz || null,
      aiContent: sessionToPublish?.aiContent || null,
      creationMode: sessionToPublish?.creationMode || null,
      instructor: sessionToPublish?.instructor || 'HR Team',
      duration: sessionToPublish?.duration || '60 minutes',
      type: sessionToPublish?.type || 'compliance',
      audience: sessionToPublish?.audience || 'all'
    };

    // Move from draft/assessment to published
    if (sessionToPublish.status === 'draft' || !sessionToPublish.status) {
      setDraftSessions(prev => prev.filter(s => s.id !== sessionToPublish.id));
    } else if (sessionToPublish.status === 'saved') {
      setSavedAssessments(prev => prev.filter(s => s.id !== sessionToPublish.id));
    }

    setPublishedSessions(prev => [normalizePublishedSession(publishedSession), ...prev]);
    
    // Log activity
    addActivity(
      `Session published: ${publishCourseData.courseTitle}`,
      'Admin',
      'published',
      'session_published'
    );
    
    setShowPublishDialog(false);
    setSessionToPublish(null);
    
    // Navigate to Schedule step in manage section
    setActiveTab('manage-session');
    setManageSessionTab('schedule');
    setSelectedSessionForScheduling(publishedSession);
    setShowScheduleDialog(true);
    
    showToast('Session published successfully! Please schedule the session.', 'success');
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
    showToast('Changes saved for later', 'success');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5 MB', 'warning');
        return;
      }
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        showToast('Please upload JPG, JPEG, or PNG format', 'warning');
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

    // Build preview session from current session data
    const resolvedSessionForm = sessionContentSnapshot?.sessionForm || sessionFormData;
    const resolvedAiContent = sessionContentSnapshot?.aiContent ?? (aiContentGenerated ? { keywords: aiKeywords } : null);
    const resolvedFiles = sessionContentSnapshot?.files ?? mapFilesToMetadata(selectedFiles);
    const resolvedQuiz = currentQuizData?.quiz || null;
    const resolvedCreationMode = sessionContentSnapshot?.creationMode ?? selectedCreationMode;
    
    // Get certification for this session if any
    // Check if a certificate template has been selected and configured
    const hasCertificate = selectedTemplate && fieldsSaved;
    const sessionCert = hasCertificate ? {
      id: 'preview-cert',
      name: selectedTemplate.name || 'Certificate',
      template: selectedTemplate,
      fields: certificateFields
    } : null;
    
    // Build content items for preview (excluding assessment - it's shown separately)
    const contentItems = [];
    
    // Add AI Content
    if (resolvedAiContent && (resolvedAiContent.keywords || resolvedAiContent.content || resolvedAiContent.title)) {
      contentItems.push({
        id: 'ai-content',
        type: 'ai',
        title: resolvedAiContent.title || 'AI Generated Content',
        description: resolvedAiContent.description || (resolvedAiContent.keywords ? `Keywords: ${resolvedAiContent.keywords}` : 'AI generated learning material'),
        content: resolvedAiContent.content,
        keyPoints: resolvedAiContent.keyPoints,
        learningObjectives: resolvedAiContent.learningObjectives
      });
    }
    
    // Add uploaded files
    if (resolvedFiles && resolvedFiles.length > 0) {
      resolvedFiles.forEach((file, index) => {
        const fileName = typeof file === 'string' ? file : (file.name || `File ${index + 1}`);
        const fileType = typeof file === 'string' ? null : (file.type || null);
        const fileNameLower = fileName.toLowerCase();
        
        // Detect file types
        const isPDF = fileNameLower.endsWith('.pdf') || 
                     fileType === 'application/pdf' ||
                     (file.dataUrl && file.dataUrl.startsWith('data:application/pdf')) ||
                     (file.url && file.url.includes('.pdf')) ||
                     (file.downloadUrl && file.downloadUrl.includes('.pdf'));
        
        const isVideo = fileNameLower.endsWith('.mp4') || 
                       fileNameLower.endsWith('.avi') || 
                       fileNameLower.endsWith('.mov') ||
                       fileNameLower.endsWith('.webm') ||
                       fileNameLower.endsWith('.mkv') ||
                       fileType?.startsWith('video/') ||
                       (file.dataUrl && file.dataUrl.startsWith('data:video/')) ||
                       (file.url && (file.url.includes('.mp4') || file.url.includes('.avi') || file.url.includes('.mov')));
        
        const isDocument = fileNameLower.endsWith('.doc') || 
                          fileNameLower.endsWith('.docx') ||
                          fileNameLower.endsWith('.ppt') ||
                          fileNameLower.endsWith('.pptx') ||
                          fileType?.includes('document') ||
                          fileType?.includes('presentation');
        
        // Determine content type
        let contentType = 'file';
        if (isVideo) {
          contentType = 'video';
        } else if (isPDF) {
          contentType = 'pdf';
        } else if (isDocument) {
          contentType = fileNameLower.includes('.ppt') ? 'presentation' : 'document';
        }
        
        contentItems.push({
          id: `file-${index}`,
          type: contentType,
          title: fileName,
          description: typeof file === 'object' && file.size ? formatFileSize(file.size) : (fileType || 'Uploaded resource'),
          file: file,
          dataUrl: typeof file === 'object' ? (file.dataUrl || file.url || file.downloadUrl) : null,
          isPDF: isPDF,
          isVideo: isVideo
        });
      });
    }
    
    // Add creation mode content
    if (resolvedCreationMode) {
      const creationLabels = {
        powerpoint: 'PowerPoint Presentation',
        presentation: 'Presentation',
        word: 'Word Document',
        document: 'Document',
        video: 'Training Video',
      };
      contentItems.push({
        id: 'creation-mode',
        type: resolvedCreationMode === 'video' ? 'video' : 'presentation',
        title: creationLabels[resolvedCreationMode] || 'Created Content',
        description: `Generated via ${creationLabels[resolvedCreationMode] || resolvedCreationMode} mode`
      });
    }
    
    // Note: Assessment is NOT added to contentItems - it's shown in a separate section below

    // Render detailed preview
    return (
      <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', p: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={4} sx={{ color: '#1f2937' }}>
          Preview Session
              </Typography>

        {/* Session Information */}
        <Card sx={{ mb: 3, p: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={2} sx={{ color: '#114417DB' }}>
            Session Information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Title
              </Typography>
              <Typography variant="h6" fontWeight="medium">
                {resolvedSessionForm.title || 'Untitled Session'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Session Type
              </Typography>
              <Chip 
                label={resolvedSessionForm.type || 'Not specified'} 
                sx={{ backgroundColor: '#114417DB', color: 'white' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Participants
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {resolvedSessionForm.audience === 'all' ? 'All Employees' :
                 resolvedSessionForm.audience === 'managers' ? 'Managers Only' :
                 resolvedSessionForm.audience === 'developers' ? 'Developers' :
                 resolvedSessionForm.audience === 'hr' ? 'HR Team' :
                 resolvedSessionForm.audience || 'Not specified'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Instructor
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                HR Team
              </Typography>
            </Grid>
            {resolvedSessionForm.description && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1">
                  {resolvedSessionForm.description}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Card>

        {/* Content Section */}
        <Card sx={{ mb: 3, p: 3 }}>
          <Typography variant="h6" fontWeight="bold" mb={2} sx={{ color: '#114417DB' }}>
            Session Content
            </Typography>
          {contentItems.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              No content has been added yet. Content will appear here once added.
            </Typography>
          ) : (
          <Box>
              {contentItems.map((item, index) => {
                const getContentIcon = () => {
                  switch (item.type) {
                    case 'video': return <VideoLibraryIcon sx={{ color: '#3b82f6' }} />;
                    case 'presentation': return <DescriptionIcon sx={{ color: '#10b981' }} />;
                    case 'document': return <DescriptionIcon sx={{ color: '#6366f1' }} />;
                    case 'pdf': return <DescriptionIcon sx={{ color: '#ef4444' }} />;
                    case 'file': return <DescriptionIcon sx={{ color: '#3b82f6' }} />;
                    case 'ai': return <SchoolIcon sx={{ color: '#8b5cf6' }} />;
                    default: return <DescriptionIcon sx={{ color: '#94a3b8' }} />;
                  }
                };

                const getContentUrl = () => {
                  if (item.dataUrl) return item.dataUrl;
                  if (typeof item.file === 'object') {
                    return item.file.dataUrl || item.file.url || item.file.downloadUrl || null;
                  }
                  return null;
                };

                const contentUrl = getContentUrl();
                const isPDF = item.isPDF || item.type === 'pdf';
                const isVideo = item.isVideo || item.type === 'video' || 
                               (item.title && (item.title.toLowerCase().endsWith('.mp4') || 
                                               item.title.toLowerCase().endsWith('.avi') || 
                                               item.title.toLowerCase().endsWith('.mov')));
              
              return (
                  <Card key={item.id || index} sx={{ mb: 2, border: '1px solid #e5e7eb' }}>
                    {/* For videos, show player directly instead of file name */}
                    {contentUrl && (item.type === 'video' || isVideo) ? (
                      <Box>
                        {/* Video Title */}
                        <Box display="flex" alignItems="center" gap={2} p={2} borderBottom="1px solid #e5e7eb">
                          <Box sx={{ 
                            backgroundColor: '#e0f2fe',
                            borderRadius: 1,
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {getContentIcon()}
                          </Box>
                          <Box flex={1}>
                            <Typography variant="h6" fontWeight="bold" mb={0.5}>
                              {item.title}
                            </Typography>
                            {item.description && (
                              <Typography variant="body2" color="text.secondary">
                                {item.description}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        {/* Video Player */}
                    <Box
                      sx={{
                            height: '70vh',
                            minHeight: 400,
                            backgroundColor: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                            overflow: 'hidden'
                          }}
                        >
                          <video
                            controls
                            src={contentUrl}
                            style={{ width: '100%', height: '100%' }}
                          >
                            Your browser does not support the video tag.
                          </video>
                    </Box>
                      </Box>
                    ) : (
                      <>
                        {/* Content Header */}
                        <Box display="flex" alignItems="flex-start" gap={2} p={2}>
                          <Box sx={{ 
                            backgroundColor: item.type === 'ai' ? '#f3e8ff' : '#e0f2fe',
                            borderRadius: 1,
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {getContentIcon()}
                          </Box>
                    <Box flex={1}>
                            <Typography variant="h6" fontWeight="bold" mb={0.5}>
                              {item.title}
                        </Typography>
                            {item.description && (
                              <Typography variant="body2" color="text.secondary" mb={1}>
                                {item.description}
                              </Typography>
                            )}
                            {item.type === 'file' && item.file && !isPDF && (
                        <Chip
                                label={typeof item.file === 'object' ? (item.file.type || 'File') : 'File'} 
                          size="small"
                                sx={{ mr: 1 }}
                              />
                            )}
                            {item.type === 'ai' && item.keyPoints && item.keyPoints.length > 0 && (
                              <Box mt={1}>
                                <Typography variant="body2" fontWeight="medium" mb={0.5}>
                                  Key Points:
                      </Typography>
                                <List dense>
                                  {item.keyPoints.map((point, idx) => (
                                    <ListItem key={idx} sx={{ py: 0.25 }}>
                                      <ListItemIcon sx={{ minWidth: 20 }}>
                                        <CheckCircleIcon sx={{ fontSize: 16, color: '#114417DB' }} />
                                      </ListItemIcon>
                                      <ListItemText 
                                        primary={point}
                                        primaryTypographyProps={{ variant: 'body2' }}
                                      />
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                            )}
                          </Box>
                    </Box>

                        {/* Content Preview - PDFs, Documents, PowerPoint */}
                        {contentUrl && (
                          <>
                        
                        {/* PDF Preview */}
                        {isPDF && (
                          <Box
                        sx={{ 
                              height: '70vh',
                              minHeight: 500,
                              backgroundColor: '#f8fafc',
                              borderTop: '1px solid #e5e7eb',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden'
                            }}
                          >
                            <embed
                              src={`${contentUrl}#page=1&toolbar=1&navpanes=1&scrollbar=1`}
                              type="application/pdf"
                              style={{ width: '100%', height: '100%' }}
                              title={item.title || 'PDF Document'}
                            />
                    </Box>
                        )}
                        
                        {/* Document/PowerPoint Preview (Word, PowerPoint, etc.) */}
                        {!isPDF && !isVideo && (item.type === 'document' || item.type === 'presentation' || item.type === 'file') && (
                    <Box
                      sx={{
                              height: '70vh',
                              minHeight: 500,
                              backgroundColor: '#f8fafc',
                              borderTop: '1px solid #e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                              overflow: 'hidden'
                            }}
                          >
                            <iframe
                              title={item.title || 'Document Preview'}
                              src={contentUrl}
                              style={{ width: '100%', height: '100%', border: 'none' }}
                              allowFullScreen
                            />
                    </Box>
                        )}
                      </>
                    )}
                      </>
                    )}
                    
                    {/* AI Content Preview */}
                    {item.type === 'ai' && (
                      <Box
                        sx={{
                          backgroundColor: '#f0f9ff',
                          borderTop: '1px solid #e5e7eb',
                          borderRadius: '0 0 4px 4px',
                          p: 3,
                          border: '1px solid #bae6fd',
                        }}
                      >
                        {item.content && (
                          <Typography variant="body1" color="text.primary" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                            {item.content}
                      </Typography>
                        )}
                        {item.learningObjectives && item.learningObjectives.length > 0 && (
                          <Box mt={2}>
                            <Typography variant="body2" fontWeight="bold" mb={1}>
                              Learning Objectives:
                      </Typography>
                            <List dense>
                              {item.learningObjectives.map((objective, idx) => (
                                <ListItem key={idx} sx={{ py: 0.25 }}>
                                  <ListItemIcon sx={{ minWidth: 20 }}>
                                    <CheckCircleIcon sx={{ fontSize: 16, color: '#114417DB' }} />
                                  </ListItemIcon>
                                  <ListItemText 
                                    primary={objective}
                                    primaryTypographyProps={{ variant: 'body2' }}
                                  />
                                </ListItem>
                              ))}
                            </List>
                    </Box>
                        )}
                        {!item.content && !item.learningObjectives && (
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            AI generated learning material is attached to this session.
                          </Typography>
                        )}
                    </Box>
                    )}
                  </Card>
              );
            })}
            </Box>
          )}
        </Card>

        {/* Assessment Section */}
        {resolvedQuiz && resolvedQuiz.questions && resolvedQuiz.questions.length > 0 && (
          <Card sx={{ mb: 3, p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <QuizIcon sx={{ color: '#ef4444', fontSize: 28 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#114417DB' }}>
                Assessment Details
                </Typography>
              </Box>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Assessment Title
              </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {resolvedQuiz.title || resolvedQuiz.assessmentInfo?.quizTitle || 'Checkpoint Assessment'}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">
                  Total Questions
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {resolvedQuiz.questions.length}
                          </Typography>
              </Grid>
              {resolvedQuiz.assessmentInfo?.passingScore && (
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Passing Score
                          </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {resolvedQuiz.assessmentInfo.passingScore}%
                  </Typography>
                  </Grid>
              )}
              {resolvedQuiz.assessmentInfo?.maxAttempts && (
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" color="text.secondary">
                    Max Attempts
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {resolvedQuiz.assessmentInfo.maxAttempts}
                  </Typography>
              </Grid>
            )}
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight="bold" mb={1}>
              Questions Preview
              </Typography>
              <Box>
              {resolvedQuiz.questions.slice(0, 3).map((question, idx) => (
                <Card key={idx} sx={{ mb: 1, p: 2, backgroundColor: '#f9fafb' }}>
                  <Typography variant="body2" fontWeight="medium" mb={1}>
                    {idx + 1}. {question.text || question.question || 'Question'}
                </Typography>
                  {question.options && question.options.length > 0 && (
                    <List dense>
                      {question.options.map((option, optIdx) => (
                        <ListItem key={optIdx} sx={{ py: 0.25 }}>
                          <Typography variant="body2" color="text.secondary">
                            {String.fromCharCode(65 + optIdx)}. {option}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Card>
              ))}
              {resolvedQuiz.questions.length > 3 && (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                  ... and {resolvedQuiz.questions.length - 3} more question{resolvedQuiz.questions.length - 3 === 1 ? '' : 's'}
                </Typography>
              )}
            </Box>
          </Card>
        )}

        {/* Certification Section */}
        {sessionCert && (
          <Card sx={{ mb: 3, p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <CertificateIcon sx={{ color: '#f59e0b', fontSize: 28 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#114417DB' }}>
                Certification
                  </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Certificate Name
                  </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {sessionCert.name || 'Certificate'}
                  </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary">
                  Template
                  </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {sessionCert.template?.name || 'Standard Template'}
                </Typography>
              </Grid>
              {sessionCert.fields && (
                <>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary">
                      Title
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {sessionCert.fields.title || 'CERTIFICATE'}
                    </Typography>
                  </Grid>
                  {sessionCert.fields.subtitle && (
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">
                        Subtitle
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {sessionCert.fields.subtitle}
                      </Typography>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
                </Card>
        )}

        {!sessionCert && (
          <Card sx={{ mb: 3, p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <CertificateIcon sx={{ color: '#d1d5db', fontSize: 28 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#6b7280' }}>
                Certification
                  </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              No certification has been attached to this session.
                  </Typography>
                </Card>
            )}

        {/* Default 5 Action Buttons */}
        <Box display="flex" gap={2} mt={4} justifyContent="center" sx={{ pb: 3 }}>
            <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={handleSaveSession}
              sx={{
              borderColor: '#114417DB',
              color: '#114417DB',
              '&:hover': {
                borderColor: '#0a2f0e',
                backgroundColor: 'rgba(17, 68, 23, 0.08)'
              },
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 150
            }}
          >
            Save as Draft
          </Button>
          <Button
            variant="outlined"
            onClick={handleSkipToNextStep}
            sx={{
              borderColor: '#6b7280',
                color: '#6b7280',
              '&:hover': {
                borderColor: '#4b5563',
                backgroundColor: '#f3f4f6'
              },
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 150
            }}
          >
            Skip
          </Button>
          <Button
            variant="outlined"
            onClick={() => setActiveTab('course-library')}
            sx={{
              borderColor: '#ef4444',
              color: '#ef4444',
              '&:hover': {
                borderColor: '#dc2626',
                backgroundColor: '#fef2f2'
              },
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 150
              }}
            >
              Cancel
            </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handlePreviousStep}
            sx={{
              borderColor: '#6b7280',
              color: '#6b7280',
              '&:hover': {
                borderColor: '#4b5563',
                backgroundColor: '#f3f4f6'
              },
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 150
            }}
          >
            Previous
            </Button>
            <Button
              variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={handleNextStep}
              sx={{
              backgroundColor: '#114417DB',
              '&:hover': { backgroundColor: '#0a2f0e' },
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 150
            }}
          >
            Next
            </Button>
        </Box>
      </Box>
    );
  };

  const renderPublishDialog = () => {
    return (
      <Box p={3} sx={{ maxWidth: 800, mx: 'auto' }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight="bold">
            Publish session
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

        {/* Session Image */}
        <Box mb={4}>
          <Typography variant="body1" fontWeight="medium" mb={2}>
            Session image
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
                  startIcon={<CloudUploadIcon />}
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

        {/* Session Title */}
        <Box mb={4}>
          <Typography variant="body1" fontWeight="medium" mb={2}>
            Session title
          </Typography>
          <TextField
            fullWidth
            value={publishCourseData.courseTitle}
            onChange={(e) => setPublishCourseData(prev => ({ ...prev, courseTitle: e.target.value }))}
            placeholder="Enter session title"
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
            placeholder="Enter session description"
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
            <InputLabel>Select the skills that user will gain from this session</InputLabel>
            <Select
              multiple
              value={publishCourseData.skills}
              onChange={(e) => setPublishCourseData(prev => ({ ...prev, skills: e.target.value }))}
              renderValue={(selected) => selected.join(', ')}
              label="Select the skills that user will gain from this session"
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
            sx={{ backgroundColor: '#114417DB', '&:hover': { backgroundColor: '#0a2f0e' } }}
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
                          <FileIcon sx={{ fontSize: 32, color: file.fileObject ? '#114417DB' : '#94a3b8' }} />
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
              <Box mt={3} p={3} sx={{ backgroundColor: session.quiz ? 'rgba(17, 68, 23, 0.04)' : '#fef3c7', borderRadius: 2, border: `2px dashed ${session.quiz ? '#114417DB' : '#f59e0b'}` }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <QuizIcon sx={{ fontSize: 40, color: session.quiz ? '#114417DB' : '#f59e0b' }} />
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
                    backgroundColor: session.quiz ? '#114417DB' : '#f59e0b',
                    '&:hover': { backgroundColor: session.quiz ? '#0a2f0e' : '#d97706' },
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
                      <QuizIcon sx={{ color: '#114417DB' }} />
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
                        <Box key={question.id} mb={2} p={2} sx={{ backgroundColor: '#f9fafb', borderRadius: 1, borderLeft: '3px solid #114417DB' }}>
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
    password: '',
    skills: ''
  });

  const handleAddEmployee = () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email || !newEmployee.employeeId) {
      showToast('Please fill in all required fields', 'warning');
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
      password: '',
      skills: ''
    });
    setShowAddEmployee(false);
    showToast('Employee added successfully!', 'success');
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setNewEmployee({
      ...employee,
      skills: employee.skills || ''
    });
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
      password: '',
      skills: ''
    });
    showToast('Employee updated successfully!', 'success');
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
      
      showToast('Employee deleted successfully!', 'success');
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
      {/* Manage Passwords */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            Manage Passwords
          </Typography>
        </Box>
        <Box sx={{ maxWidth: 600 }}>
          <TextField
            fullWidth
            label="Current Password"
            type={showCurrentPassword ? 'text' : 'password'}
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  edge="end"
                >
                  {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              )
            }}
          />
          <TextField
            fullWidth
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              )
            }}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            margin="normal"
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              )
            }}
          />
          <Box mt={3}>
            <Button
              variant="contained"
              onClick={handleManagePasswords}
              sx={{
                backgroundColor: '#114417DB',
                '&:hover': { backgroundColor: '#0a2f0e' }
              }}
            >
              Update Password
            </Button>
          </Box>
        </Box>
      </Card>

      {/* System Settings - Clear All Sessions */}
      <Card sx={{ p: 3, mb: 4, border: '2px solid #ef4444' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h5" fontWeight="bold" color="error" gutterBottom>
              System Maintenance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Clear all session data from the system
            </Typography>
          </Box>
        </Box>
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            This will permanently delete:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mb: 2 }}>
            <li><Typography variant="body2" color="text.secondary">All published sessions</Typography></li>
            <li><Typography variant="body2" color="text.secondary">All draft sessions</Typography></li>
            <li><Typography variant="body2" color="text.secondary">All saved assessments</Typography></li>
            <li><Typography variant="body2" color="text.secondary">Employee completion data</Typography></li>
            <li><Typography variant="body2" color="text.secondary">Session certifications</Typography></li>
            <li><Typography variant="body2" color="text.secondary">Session requests</Typography></li>
          </Box>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <strong>Warning:</strong> This action cannot be undone. All session data will be permanently deleted.
          </Alert>
        </Box>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteForeverIcon />}
          onClick={handleClearAllSessions}
          sx={{
            backgroundColor: '#ef4444',
            '&:hover': {
              backgroundColor: '#dc2626',
            }
          }}
        >
          Clear All Sessions
        </Button>
      </Card>
    </Box>
  );

  const renderEmployees = () => (
    <Box p={3}>
      {/* Manage Employee Accounts Tab */}
      {employeesSubTab === 'manage' && (
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
      {employeesSubTab === 'add' && (
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
              <Grid item xs={12}>
                <TextField
                  label="Skills"
                  value={newEmployee.skills}
                  onChange={(e) => setNewEmployee(prev => ({ ...prev, skills: e.target.value }))}
                  fullWidth
                  placeholder="e.g. Leadership, Project Management, Communication"
                  helperText="Add relevant skills, separated by commas"
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
                sx={{ backgroundColor: '#114417DB', '&:hover': { backgroundColor: '#0a2f0e' } }}
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
            password: '',
            skills: ''
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
            password: '',
            skills: ''
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
            <Grid item xs={12}>
              <TextField
                label="Skills"
                value={newEmployee.skills}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, skills: e.target.value }))}
                fullWidth
                placeholder="e.g. Leadership, Project Management, Communication"
                helperText="Add relevant skills, separated by commas"
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
            sx={{ backgroundColor: '#114417DB', '&:hover': { backgroundColor: '#0a2f0e' } }}
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
    
    // Add draft sessions (exclude deleted)
    draftSessions.filter(s => s.status !== 'deleted').forEach(session => {
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
        status: session.status || 'draft',
        category: session.type || 'General',
        createdAt: session.savedAt || session.createdAt,
        originalData: session,
        source: 'draft'
      });
    });
    
    // Add published sessions (exclude deleted)
    publishedSessions.filter(s => s.status !== 'deleted').forEach(session => {
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
        status: session.status || 'published',
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
        status: assessment.status || 'saved',
        category: assessment.type || 'Assessment',
        createdAt: assessment.savedAt || assessment.createdAt,
        originalData: assessment,
        source: 'assessment'
      });
    });
    
    return courses;
  };

  const renderCourseLibrary = () => {
    // Get latest courses from all sources (published + drafts)
    const allCourses = getAllCourses();

    // Filter courses based on search and filters
    const filteredCourses = allCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(courseSearchTerm.toLowerCase());
      const matchesSkill = courseFilters.skill === 'all' || course.skill === courseFilters.skill;
      const matchesCategory = courseFilters.category === 'all' || course.category === courseFilters.category;
      const matchesStatus = courseFilters.status === 'all' || course.status.toLowerCase() === courseFilters.status.toLowerCase();
      
      return matchesSearch && matchesSkill && matchesCategory && matchesStatus;
    });

    return (
    <Box p={3}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Session Library
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse all published sessions and draft content
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
          <InputLabel>Status</InputLabel>
          <Select
            value={courseFilters.status}
            label="Status"
            onChange={(e) => setCourseFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="published">Published</MenuItem>
            <MenuItem value="scheduled">Scheduled</MenuItem>
            <MenuItem value="saved">Saved</MenuItem>
          </Select>
        </FormControl>

        {/* Search Bar */}
        <Box flex={1} minWidth={250}>
          <TextField
            placeholder="Search by session title"
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

      {/* Session List */}
      <Box>
        {courseLibraryView === 'list' ? (
          <Box>
            {filteredCourses.map((course) => (
              <Card
                key={course.id}
                onClick={() => {
                  setSelectedLibrarySession(course.originalData);
                  setShowSessionDetailsDialog(true);
                }}
                sx={{
                  mb: 2,
                  p: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    boxShadow: 2,
                    transition: 'box-shadow 0.2s',
                    backgroundColor: '#f9fafb'
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
                        label={course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                        size="small"
                        sx={{
                          backgroundColor: course.status === 'published' ? '#114417DB' : 
                                           course.status === 'draft' ? '#f59e0b' : 
                                           course.status === 'scheduled' ? '#3b82f6' :
                                           course.status === 'saved' ? '#8b5cf6' : '#6b7280',
                          color: 'white',
                          fontWeight: 'medium',
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={0.5}>
                      {course.modules} modules | {course.duration}
                    </Typography>
                    {course.originalData?.scheduledDateTime && (
                      <Typography variant="body2" color="text.secondary" mb={0.5}>
                        <strong>Start:</strong> {new Date(course.originalData.scheduledDateTime).toLocaleString()}
                      </Typography>
                    )}
                    {course.status === 'scheduled' && course.originalData?.scheduledDateTime && (
                      <Typography variant="body2" sx={{ color: '#3b82f6', fontWeight: 'medium' }} mb={0.5}>
                        Publishing in {getTimeUntilPublish(new Date(course.originalData.scheduledDateTime))}
                      </Typography>
                    )}
                    {course.originalData?.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {course.originalData.description}
                      </Typography>
                    )}
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
                  onClick={() => {
                    setSelectedLibrarySession(course.originalData);
                    setShowSessionDetailsDialog(true);
                  }}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 4,
                      transition: 'box-shadow 0.2s',
                      backgroundColor: '#f9fafb'
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
                        label={course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                        size="small"
                        sx={{
                          backgroundColor: course.status === 'published' ? '#114417DB' : 
                                           course.status === 'draft' ? '#f59e0b' : 
                                           course.status === 'scheduled' ? '#3b82f6' :
                                           course.status === 'saved' ? '#8b5cf6' : '#6b7280',
                          color: 'white',
                          fontWeight: 'medium',
                          fontSize: '0.7rem'
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {course.modules} modules | {course.duration}
                    </Typography>
                    {course.originalData?.scheduledDateTime && (
                      <Typography variant="body2" color="text.secondary" mb={1}>
                        <strong>Start:</strong> {new Date(course.originalData.scheduledDateTime).toLocaleString()}
                      </Typography>
                    )}
                    {course.status === 'scheduled' && course.originalData?.scheduledDateTime && (
                      <Typography variant="body2" sx={{ color: '#3b82f6', fontWeight: 'medium' }} mb={1}>
                        Publishing in {getTimeUntilPublish(new Date(course.originalData.scheduledDateTime))}
                      </Typography>
                    )}
                    {course.originalData?.description && (
                      <Typography variant="body2" color="text.secondary" mb={2} sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {course.originalData.description}
                      </Typography>
                    )}
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

      {/* Session Details Dialog */}
      <Dialog
        open={showSessionDetailsDialog}
        onClose={() => {
          setShowSessionDetailsDialog(false);
          setSelectedLibrarySession(null);
          setSessionViewMode(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#114417DB' }}>
              {selectedLibrarySession?.title || 'Session Details'}
            </Typography>
            <IconButton onClick={() => {
              setShowSessionDetailsDialog(false);
              setSelectedLibrarySession(null);
              setSessionViewMode(null);
            }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {sessionViewMode === null ? (
            <Box>
              {/* Schedule Information */}
              <Card sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa', border: '1px solid #e5e7eb' }}>
                <Typography variant="h6" fontWeight="bold" mb={2} sx={{ color: '#114417DB' }}>
                  Schedule Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Start Date & Time
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedLibrarySession?.scheduledDateTime 
                        ? new Date(selectedLibrarySession.scheduledDateTime).toLocaleString()
                        : selectedLibrarySession?.scheduledDate && selectedLibrarySession?.scheduledTime
                        ? `${new Date(selectedLibrarySession.scheduledDate).toLocaleDateString()} ${selectedLibrarySession.scheduledTime}`
                        : 'Not scheduled'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      End Date & Time
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedLibrarySession?.dueDateTime 
                        ? new Date(selectedLibrarySession.dueDateTime).toLocaleString()
                        : selectedLibrarySession?.dueDate && selectedLibrarySession?.dueTime
                        ? `${new Date(selectedLibrarySession.dueDate).toLocaleDateString()} ${selectedLibrarySession.dueTime}`
                        : 'Not set'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Status
                    </Typography>
                    <Chip
                      label={selectedLibrarySession?.status || 'Draft'}
                      size="small"
                      sx={{
                        backgroundColor: selectedLibrarySession?.status === 'published' ? '#114417DB' : 
                                         selectedLibrarySession?.status === 'scheduled' ? '#3b82f6' :
                                         selectedLibrarySession?.status === 'draft' ? '#f59e0b' : '#6b7280',
                        color: 'white',
                        fontWeight: 'medium'
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Created At
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {selectedLibrarySession?.createdAt 
                        ? new Date(selectedLibrarySession.createdAt).toLocaleString()
                        : 'Not available'}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>

              {/* Action Buttons */}
              <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                <Button
                  variant="contained"
                  startIcon={<VisibilityIcon />}
                  onClick={() => setSessionViewMode('view')}
                  sx={{
                    backgroundColor: '#114417DB',
                    '&:hover': { backgroundColor: '#0a2f0e' },
                    minWidth: 150
                  }}
                >
                  View
                </Button>
                {selectedLibrarySession?.status !== 'published' && (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<EditIcon />}
                      onClick={() => {
                        const startDateTime = selectedLibrarySession?.scheduledDateTime 
                          ? new Date(selectedLibrarySession.scheduledDateTime)
                          : null;
                        const now = new Date();
                        
                        if (startDateTime && startDateTime <= now) {
                          showToast('Cannot edit session after start date/time', 'error');
                          return;
                        }
                        setSessionViewMode('edit');
                      }}
                      sx={{
                        color: '#114417DB',
                        borderColor: '#114417DB',
                        minWidth: 150
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this session? This will soft delete the session.')) {
                          handleSoftDeleteSession(selectedLibrarySession);
                        }
                      }}
                      sx={{
                        color: '#ef4444',
                        borderColor: '#ef4444',
                        minWidth: 150
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ScheduleIcon />}
                      onClick={() => setSessionViewMode('reschedule')}
                      sx={{
                        color: '#3b82f6',
                        borderColor: '#3b82f6',
                        minWidth: 150
                      }}
                    >
                      Reschedule
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          ) : sessionViewMode === 'view' ? (
            <Box>
              {/* View Mode - Show all stages in read-only */}
              {renderSessionViewMode(selectedLibrarySession)}
            </Box>
          ) : sessionViewMode === 'edit' ? (
            <Box>
              {/* Edit Mode - Allow editing before start date */}
              {renderSessionEditMode(selectedLibrarySession)}
            </Box>
          ) : sessionViewMode === 'reschedule' ? (
            <Box>
              {/* Reschedule Mode - Edit schedule only */}
              {renderSessionRescheduleMode(selectedLibrarySession)}
            </Box>
          ) : null}
        </DialogContent>
        {sessionViewMode && (
          <DialogActions>
            <Button
              onClick={() => {
                setSessionViewMode(null);
              }}
            >
              Back
            </Button>
            {sessionViewMode === 'edit' && (
              <Button
                variant="contained"
                onClick={() => {
                  handleSaveEditedSession(selectedLibrarySession);
                }}
                sx={{
                  backgroundColor: '#114417DB',
                  '&:hover': { backgroundColor: '#0a2f0e' }
                }}
              >
                Save Changes
              </Button>
            )}
            {sessionViewMode === 'reschedule' && (
              <Button
                variant="contained"
                onClick={() => {
                  if (!scheduleDate || !scheduleTime || !scheduleDueDate || !scheduleDueTime) {
                    showToast('Please fill in all schedule fields', 'error');
                    return;
                  }
                  
                  const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`);
                  const dueDateTime = new Date(`${scheduleDueDate}T${scheduleDueTime}`);
                  
                  if (dueDateTime <= scheduledDateTime) {
                    showToast('Due date must be after the session start time.', 'error');
                    return;
                  }
                  
                  // Update session with new schedule
                  const updatedSession = {
                    ...selectedLibrarySession,
                    scheduledDate: scheduleDate,
                    scheduledTime: scheduleTime,
                    scheduledDateTime: scheduledDateTime.toISOString(),
                    dueDate: scheduleDueDate,
                    dueTime: scheduleDueTime,
                    dueDateTime: dueDateTime.toISOString()
                  };
                  
                  // Update in appropriate list
                  if (selectedLibrarySession.status === 'draft' || !selectedLibrarySession.status) {
                    setDraftSessions(prev => prev.map(s => s.id === selectedLibrarySession.id ? updatedSession : s));
                  } else if (selectedLibrarySession.status === 'published' || selectedLibrarySession.status === 'scheduled') {
                    setPublishedSessions(prev => prev.map(s => s.id === selectedLibrarySession.id ? normalizePublishedSession(updatedSession) : s));
                  }
                  
                  // Log activity
                  addActivity(
                    `Session rescheduled: ${selectedLibrarySession.title}`,
                    'Admin',
                    'scheduled',
                    'session_scheduled'
                  );
                  
                  showToast('Session rescheduled successfully!', 'success');
                  setShowSessionDetailsDialog(false);
                  setSelectedLibrarySession(null);
                  setSessionViewMode(null);
                }}
                sx={{
                  backgroundColor: '#114417DB',
                  '&:hover': { backgroundColor: '#0a2f0e' }
                }}
              >
                Save Schedule
              </Button>
            )}
          </DialogActions>
        )}
      </Dialog>
    </Box>
    );
  };

  // Sample analytics data - In real app, this would come from context/API
  const getAnalyticsData = () => {
    const completedCount = employeeCompletions.length;
    const totalPublished = publishedSessions.length;
    const completionRate =
      totalPublished > 0 ? Math.round((completedCount / totalPublished) * 100) : (completedCount > 0 ? 100 : 0);
    const activeSessionCount = Math.max(totalPublished - completedCount, 0);

    return {
      totalLearners: employees.length,
      completionRate,
      averageRating: 4.5,
      activeSessions: activeSessionCount,
      totalSessionsCompleted: completedCount,
      topPerformers: employees.slice(0, 5).map((emp, idx) => ({
        id: emp.id,
        name: emp.name,
        department: emp.department,
        sessionsCompleted: Math.floor(Math.random() * 10) + 1,
        completionRate: Math.floor(Math.random() * 40) + 60
      }))
    };
  };

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
                      <Typography variant="h4" fontWeight="bold" color="#114417DB">
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
      'course-status': 'Session Status Report',
      'learner-status': 'Learner Status Report'
    };

    const allDepartments = [...new Set(employees.map(e => e.department))];
    const allBusinessUnits = ['Keka Onboa', 'sa', 'Others']; // Sample - would come from data
    const allEmploymentStatuses = ['Active', 'Inactive'];

    const getReportColumns = () => {
      if (selectedReport === 'all-learners') {
        return ['USER NAME', 'EMP ID', 'JOB TITLE', 'DEPARTMENT', 'BUSINESS UNIT', 'REPORTING MANAGER', 'EMPLOYMENT STATUS', 'SESSIONS ENROLLED', 'SESSIONS NOT STARTED', 'SESSIONS COMPLETED'];
      } else if (selectedReport === 'course-status') {
        return ['SESSION TITLE', 'LEARNERS ENROLLED', 'LEARNERS COMPLETED', 'COMPLETION RATE', 'STATUS'];
      } else if (selectedReport === 'learner-status') {
        return ['USER NAME', 'SESSION TITLE', 'COMPLETION STATUS', 'TIME SPENT', 'PROGRESS'];
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
                backgroundColor: '#114417DB',
                '&:hover': { backgroundColor: '#0a2f0e' }
              }}
            >
              Run
            </Button>
          </Box>
        </Card>

        {/* Search and Actions */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <TextField
            placeholder="Search by session title"
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
                            'SESSIONS ENROLLED': 'coursesEnrolled',
                            'SESSIONS NOT STARTED': 'coursesNotStarted',
                            'SESSIONS COMPLETED': 'coursesCompleted',
                            'SESSION TITLE': 'courseTitle',
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
                                    backgroundColor: value === 'Active' ? '#114417DB' : '#ef4444',
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
        title: 'Session Status Report',
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
        <Box sx={{ width: 240, backgroundColor: 'white', borderRight: '1px solid #e5e7eb', p: 2 }}>
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
                  borderLeft: selectedReportCategory === category.id ? '4px solid #114417DB' : '4px solid transparent',
                  '&:hover': {
                    backgroundColor: selectedReportCategory === category.id ? '#d1fae5' : '#f0fdf4'
                  }
                }}
              >
                <ListItemButton
                  onClick={() => setSelectedReportCategory(category.id)}
                  sx={{ py: 1.5, px: 2 }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: selectedReportCategory === category.id ? '#114417DB' : 'inherit' }}>
                    {category.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={category.label} 
                    primaryTypographyProps={{
                      color: selectedReportCategory === category.id ? '#114417DB' : 'inherit',
                      fontWeight: selectedReportCategory === category.id ? 600 : 400
                    }}
                  />
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
    // Define steps for the progress bar
    const steps = [
      { label: 'Create a New Session', value: 'create' },
      { label: 'Content Creator', value: 'content-creator' },
      { label: 'Checkpoint Assessment', value: 'assessment' },
      { label: 'Certification', value: 'certification' },
      { label: 'Preview Session', value: 'preview' },
      { label: 'Schedule', value: 'schedule' }
    ];

    // Find current step index
    const currentStepIndex = steps.findIndex(step => step.value === (manageSessionTab || 'create'));

    // Custom Step Connector for better styling
    const CustomStepConnector = styled(StepConnector)(({ theme }) => ({
      [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 18,
      },
      [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          borderColor: '#114417DB',
          borderTopWidth: 3,
          transition: 'border-color 0.5s ease, border-width 0.5s ease',
        },
      },
      [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          borderColor: '#114417DB',
          borderTopWidth: 3,
          transition: 'border-color 0.5s ease, border-width 0.5s ease',
        },
      },
      [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#e5e7eb',
        borderTopWidth: 2,
        borderRadius: 1,
        transition: 'border-color 0.5s ease, border-width 0.5s ease',
      },
    }));

    // Custom Step Icon Component
    const StepIcon = ({ active, completed, stepNumber, stepValue }) => {
      const isSkipped = skippedSteps.has(stepValue);
      
      // If step is skipped, always show skipped state regardless of completed/active
      if (isSkipped) {
        return (
      <Box
        sx={{
              width: 36,
              height: 36,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
              backgroundColor: '#fbbf24',
              color: 'white',
          fontWeight: 'bold',
              fontSize: '0.9rem',
          transition: 'all 0.3s ease',
              cursor: 'default',
            }}
          >
            <WarningAmberIcon sx={{ fontSize: 20 }} />
          </Box>
        );
      }
      
      return (
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: completed ? '#114417DB' : active ? '#114417DB' : '#e5e7eb',
            color: (completed || active) ? 'white' : '#9ca3af',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease',
            cursor: 'default',
          }}
        >
          {completed ? <CheckCircleIcon sx={{ fontSize: 20 }} /> : stepNumber}
      </Box>
    );
    };

    return (
      <Box>
        {/* Numbered Progress Bar */}
        <Box sx={{ 
          py: 2, 
          px: 3
        }}>
          <Stepper 
            activeStep={currentStepIndex >= 0 ? currentStepIndex : steps.length - 1} 
            alternativeLabel
            connector={<CustomStepConnector />}
            sx={{ width: '100%' }}
          >
            {steps.map((step, index) => (
              <Step 
                key={step.value}
                sx={{ 
                  cursor: 'default',
                  '& .MuiStepLabel-root': {
                    cursor: 'default'
                  }
                }}
              >
                <StepLabel
                  StepIconComponent={(props) => (
                    <StepIcon 
                      {...props} 
                      stepNumber={index + 1}
                      stepValue={step.value}
                      active={currentStepIndex === index && !skippedSteps.has(step.value)}
                      completed={currentStepIndex > index && !skippedSteps.has(step.value)}
                    />
                  )}
                  sx={{
                    '& .MuiStepLabel-label': {
                      fontWeight: currentStepIndex === index ? 600 : 400,
                      color: skippedSteps.has(step.value) ? '#fbbf24' : (currentStepIndex === index ? '#114417DB' : currentStepIndex > index ? '#114417DB' : '#6b7280'),
                      fontSize: '0.8rem',
                      mt: 0.5,
                      '&.Mui-active': {
                        color: '#114417DB',
                      },
                      '&.Mui-completed': {
                        color: skippedSteps.has(step.value) ? '#fbbf24' : '#114417DB',
                      }
                    }
                  }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Tab Content */}
        {manageSessionTab === 'create' ? (showContentCreator ? renderContentCreator() : renderCreateSession()) :
         manageSessionTab === 'content-creator' ? renderContentCreator() :
         manageSessionTab === 'assessment' ? <InteractiveQuiz 
          onSave={handleQuizSave} 
          onPublish={handlePublishQuiz}
          onSaveDraft={handleSaveQuizAsDraft}
          onCancel={handleQuizCancel}
          onSkip={handleQuizSkip}
          existingQuizData={currentQuizData}
        /> :
         manageSessionTab === 'certification' ? renderCertificationTemplates() :
         manageSessionTab === 'preview' ? renderAllSessions() :
         manageSessionTab === 'schedule' ? renderScheduleSessions() :
         (showContentCreator ? renderContentCreator() : renderCreateSession())}
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
      {/* Toast Notification */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={closeToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={closeToast} 
          severity={toast.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {toast.message}
        </Alert>
      </Snackbar>
      {/* Sidebar */}
      <Sidebar>
        {/* Logo and Text Side by Side */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            height: 64,
            py: 1,
            mt: 0,
            px: 2
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
        <List sx={{ overflow: 'visible' }}>
          {navigationItems.map((item) => (
            <ListItem 
              key={item.id} 
              component="div"
              onClick={() => {
                // Handle clicks - manage-session is now a tab-based view
                if (item.id !== 'employees') {
                handleTabChange(item.id);
                } else {
                  // For employees, clicking the parent just opens/closes submenu
                  if (showEmployeesSubmenu) {
                    setShowEmployeesSubmenu(false);
                  } else {
                    handleTabChange(item.id);
                }
                }
              }}
              onMouseEnter={(e) => {
                if (item.id === 'employees') {
                  setEmployeesAnchorEl(e.currentTarget);
                  setShowEmployeesSubmenu(true);
                }
              }}
              onMouseLeave={() => {
                if (item.id === 'employees') {
                  setTimeout(() => {
                    if (!document.querySelector('[data-submenu="employees"]:hover')) {
                      setShowEmployeesSubmenu(false);
                      setEmployeesAnchorEl(null);
                }
                  }, 100);
                }
              }}
              sx={{
                backgroundColor: activeTab === item.id ? '#114417DB' : 'transparent',
                borderRadius: 1,
                mb: 1,
                position: 'relative',
                cursor: 'pointer',
                overflow: 'visible',
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
        
        {/* Employee Management Submenu - Using Popper to escape sidebar overflow */}
        <Popper
          open={showEmployeesSubmenu}
          anchorEl={employeesAnchorEl}
          placement="right-start"
          modifiers={[
            {
              name: 'offset',
              options: {
                offset: [8, 0],
              },
            },
          ]}
          sx={{
            zIndex: 9999,
            '&[data-popper-placement*="right"]': {
              marginLeft: '8px !important',
            },
          }}
          onMouseEnter={() => setShowEmployeesSubmenu(true)}
          onMouseLeave={() => {
            setShowEmployeesSubmenu(false);
            setEmployeesAnchorEl(null);
          }}
        >
          <Box
            data-submenu="employees"
                  sx={{
                    minWidth: 250,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    border: '1px solid #e5e7eb',
              mt: 0.5,
                  }}
                >
                  <List sx={{ p: 1 }}>
                    <ListItem
                      button
                      onClick={() => {
                  handleTabChange('employees');
                  setEmployeesSubTab('manage');
                  setShowEmployeesSubmenu(false);
                  setEmployeesAnchorEl(null);
                      }}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        '&:hover': {
                          backgroundColor: '#f0fdf4',
                        },
                      }}
                    >
                      <ListItemText 
                        primary="Manage Employee Accounts" 
                        primaryTypographyProps={{ fontSize: '0.875rem', color: '#374151' }}
                      />
                    </ListItem>
                    <ListItem
                      button
                      onClick={() => {
                  handleTabChange('employees');
                  setEmployeesSubTab('add');
                  setShowEmployeesSubmenu(false);
                  setEmployeesAnchorEl(null);
                      }}
                      sx={{
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: '#f0fdf4',
                        },
                      }}
                    >
                      <ListItemText 
                        primary="Add Employee" 
                        primaryTypographyProps={{ fontSize: '0.875rem', color: '#374151' }}
                      />
                    </ListItem>
                  </List>
                </Box>
        </Popper>
      </Sidebar>

      <MainContent>
        {/* Header */}
        <HeaderBar position="fixed" sx={{ top: 0, left: '280px', right: 0, zIndex: 1100, width: 'calc(100% - 280px)' }}>
          <Toolbar sx={{ 
            minHeight: '64px !important', 
            height: '64px', 
            paddingTop: 0, 
            paddingBottom: 0,
            paddingLeft: '16px !important',
            paddingRight: '16px !important',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                fontSize: '1rem',
                fontFamily: '"Poppins", sans-serif',
                color: '#374151',
                flex: '0 0 auto'
              }}
            >
              Welcome back, Admin
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              flex: '0 0 auto',
              marginLeft: 'auto'
            }}>
              {/* Notifications */}
            <IconButton 
              onClick={handleNotificationClick}
                size="medium"
                sx={{ 
                  color: '#374151 !important',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                <Badge badgeContent={unreadNotificationsCount} color="error">
                  <NotificationsIcon sx={{ fontSize: 24, color: '#374151 !important' }} />
                </Badge>
              </IconButton>
              
              {/* Settings */}
              <IconButton
                onClick={(e) => {
                  setSettingsAnchorEl(e.currentTarget);
                }}
                size="medium"
                  sx={{ 
                  color: '#374151 !important',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                <SettingsIcon sx={{ fontSize: 24, color: '#374151 !important' }} />
            </IconButton>
              
              {/* Profile */}
            <IconButton
              onClick={handleProfileClick}
                size="medium"
                sx={{
                  color: '#374151 !important',
                  padding: '4px',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  }
                }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#114417DB', color: 'white', fontSize: '0.875rem' }}>
                  {profileData.firstName ? profileData.firstName[0] : 'A'}
                </Avatar>
            </IconButton>
            </Box>
          </Toolbar>
        </HeaderBar>

        {/* Content */}
        <Box sx={{ mt: '64px' }}>
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
         activeTab === 'approvals' ? <Approvals /> :
         activeTab === 'course-library' ? renderCourseLibrary() :
         activeTab === 'analytics' ? renderAnalytics() :
         activeTab === 'employees' ? renderEmployees() :
         activeTab === 'settings' ? renderSettings() :
         renderOtherTabs()}
        </Box>

        {/* Settings Menu */}
        <Menu
          anchorEl={settingsAnchorEl}
          open={Boolean(settingsAnchorEl)}
          onClose={() => setSettingsAnchorEl(null)}
          PaperProps={{
            sx: { minWidth: 200 }
          }}
        >
          <MenuItem onClick={() => {
            setSettingsAnchorEl(null);
            setActiveTab('settings');
          }}>
            <ListItemIcon>
              <LockIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Manage Passwords</ListItemText>
          </MenuItem>
        </Menu>

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
              <CheckCircleIcon sx={{ fontSize: 60, color: '#114417DB' }} />
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
              sx={{ backgroundColor: '#114417DB', '&:hover': { backgroundColor: '#0a2f0e' } }}
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
              <CheckCircleIcon sx={{ fontSize: 60, color: '#114417DB' }} />
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
              sx={{ backgroundColor: '#114417DB', '&:hover': { backgroundColor: '#0a2f0e' } }}
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
                      onClick={() => showToast('Please manually open your preferred video editing application.', 'info')}
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

        {/* Cancel Confirmation Dialog */}
        <Dialog
          open={showCancelConfirmDialog}
          onClose={handleDismissCancel}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box display="flex" alignItems="center" gap={1}>
              <WarningIcon sx={{ color: '#f59e0b' }} />
              <Typography variant="h6" fontWeight="bold">
                Cancel Session Creation?
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1" color="text.secondary">
              You have unsaved changes. Would you like to save your progress as a draft before canceling?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={handleDismissCancel}
              variant="outlined"
              sx={{ color: '#6b7280' }}
            >
              Continue Editing
            </Button>
            <Button
              onClick={() => {
                // Cancel without saving
                if (cancelCallback) {
                  const callback = cancelCallback;
                  setCancelCallback(null);
                  callback();
                }
              }}
              variant="outlined"
              sx={{ color: '#ef4444', borderColor: '#ef4444' }}
            >
              Cancel Without Saving
            </Button>
            <Button
              onClick={handleConfirmCancel}
              variant="contained"
              sx={{ backgroundColor: '#114417DB', '&:hover': { backgroundColor: '#0a2f0e' } }}
            >
              Save Draft & Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </MainContent>
    </DashboardContainer>
  );
};

export default AdminDashboard;
