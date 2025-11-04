import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Paper,
  Grid
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Business as BusinessIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: theme.spacing(2),
}));

const LoginCard = styled(Card)(({ theme }) => ({
  maxWidth: 500,
  width: '100%',
  borderRadius: theme.spacing(3),
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  overflow: 'hidden',
}));

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 4 }}>{children}</Box>}
    </div>
  );
};

const FeatureCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: 'rgba(255,255,255,0.1)',
  color: 'white',
  borderRadius: theme.spacing(2),
  backdropFilter: 'blur(10px)',
}));

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Employee login form
  const [employeeForm, setEmployeeForm] = useState({
    employeeId: '',
    password: ''
  });
  
  // Admin login form
  const [adminForm, setAdminForm] = useState({
    username: '',
    password: ''
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
  };

  const handleEmployeeInputChange = (field) => (event) => {
    setEmployeeForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
  };

  const handleAdminInputChange = (field) => (event) => {
    setAdminForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
  };

  const handleEmployeeLogin = async () => {
    const employeeId = employeeForm.employeeId.trim();
    const password = employeeForm.password.trim();

    if (!employeeId || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any employee ID and password
      if (employeeId && password) {
        // Store login state in localStorage for session management
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'employee');
        localStorage.setItem('userId', employeeId);
        
        navigate('/employee-dashboard', { replace: true });
      } else {
        setError('Invalid credentials');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    const username = adminForm.username.trim();
    const password = adminForm.password.trim();

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept multiple admin credentials
      const validCredentials = [
        { username: 'admin', password: 'admin' },
        { username: 'admin@company.com', password: 'admin123' }
      ];
      
      const isValid = validCredentials.some(
        cred => cred.username === username && cred.password === password
      );
      
      if (isValid) {
        // Store login state in localStorage for session management
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userId', username);
        
        navigate('/admin-dashboard', { replace: true });
      } else {
        setError('Invalid admin credentials. Try: admin/admin or admin@company.com/admin123');
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (activeTab === 0) {
        handleEmployeeLogin();
      } else {
        handleAdminLogin();
      }
    }
  };

  return (
    <LoginContainer>
      <Box sx={{ maxWidth: 1200, width: '100%' }}>
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Features */}
          <Grid item xs={12} md={6}>
            <Box sx={{ color: 'white', textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                HR Session Management
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 4 }}>
                Comprehensive learning and development platform for modern organizations
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FeatureCard>
                    <SchoolIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Employee Learning
                    </Typography>
                    <Typography variant="body2">
                      Access courses, track progress, and earn certificates
                    </Typography>
                  </FeatureCard>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FeatureCard>
                    <BusinessIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Admin Management
                    </Typography>
                    <Typography variant="body2">
                      Create sessions, manage employees, and track analytics
                    </Typography>
                  </FeatureCard>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Right Side - Login Form */}
          <Grid item xs={12} md={6}>
            <LoginCard>
              <CardContent sx={{ p: 0 }}>
                {/* Header */}
                <Box sx={{ p: 3, pb: 0 }}>
                  <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
                    Welcome Back
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Sign in to your account
                  </Typography>
                </Box>

                {/* Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={activeTab} onChange={handleTabChange} centered>
                    <Tab 
                      icon={<PersonIcon />} 
                      label="Employee Login" 
                      iconPosition="start"
                      sx={{ minHeight: 48 }}
                    />
                    <Tab 
                      icon={<AdminIcon />} 
                      label="HR Admin Login" 
                      iconPosition="start"
                      sx={{ minHeight: 48 }}
                    />
                  </Tabs>
                </Box>

                {/* Error Alert */}
                {error && (
                  <Box sx={{ p: 2 }}>
                    <Alert severity="error">{error}</Alert>
                  </Box>
                )}

                {/* Employee Login Tab */}
                <TabPanel value={activeTab} index={0}>
                  <Box 
                    component="form" 
                    noValidate 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEmployeeLogin();
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Employee ID"
                      value={employeeForm.employeeId}
                      onChange={handleEmployeeInputChange('employeeId')}
                      margin="normal"
                      autoComplete="username"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon />
                          </InputAdornment>
                        ),
                      }}
                      onKeyPress={handleKeyPress}
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={employeeForm.password}
                      onChange={handleEmployeeInputChange('password')}
                      margin="normal"
                      autoComplete="current-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              type="button"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      onKeyPress={handleKeyPress}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      disabled={loading}
                      sx={{ 
                        mt: 3, 
                        mb: 2,
                        py: 1.5,
                        backgroundColor: '#3b82f6',
                        '&:hover': { backgroundColor: '#2563eb' }
                      }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Login as Employee'}
                    </Button>
                  </Box>
                </TabPanel>

                {/* Admin Login Tab */}
                <TabPanel value={activeTab} index={1}>
                  <Box 
                    component="form" 
                    noValidate 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAdminLogin();
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Admin Username"
                      value={adminForm.username}
                      onChange={handleAdminInputChange('username')}
                      margin="normal"
                      autoComplete="username"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon />
                          </InputAdornment>
                        ),
                      }}
                      onKeyPress={handleKeyPress}
                    />
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={adminForm.password}
                      onChange={handleAdminInputChange('password')}
                      margin="normal"
                      autoComplete="current-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              type="button"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      onKeyPress={handleKeyPress}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      type="submit"
                      disabled={loading}
                      sx={{ 
                        mt: 3, 
                        mb: 2,
                        py: 1.5,
                        backgroundColor: '#10b981',
                        '&:hover': { backgroundColor: '#059669' }
                      }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Login as Admin'}
                    </Button>
                  </Box>
                </TabPanel>

                {/* Footer */}
                <Box sx={{ p: 3, pt: 0 }}>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    Demo Credentials:<br/>
                    <strong>Employee:</strong> Any ID + Any Password<br/>
                    <strong>Admin:</strong> admin/admin or admin@company.com/admin123
                  </Typography>
                </Box>
              </CardContent>
            </LoginCard>
          </Grid>
        </Grid>
      </Box>
    </LoginContainer>
  );
};

export default LoginPage;
