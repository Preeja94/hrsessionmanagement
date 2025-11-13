import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
// Import the GrowGrid logo image
import GrowGridLogo from '../assets/Grow Grid logo.PNG';

const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#ffffff',
  padding: theme.spacing(2),
}));

const LoginCard = styled(Card)(({ theme }) => ({
  maxWidth: 500,
  width: '100%',
  borderRadius: theme.spacing(3),
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  overflow: 'hidden',
}));

// Function to determine user role based on email
const determineUserRole = (email) => {
  if (!email) return null;
  
  const emailLower = email.toLowerCase().trim();
  
  // Admin email patterns
  const adminPatterns = [
    /admin@/i,
    /hr@/i,
    /administrator@/i,
    /^admin$/i,
    /@admin\./i,
    /@hr\./i
  ];
  
  // Check if email matches admin patterns
  const isAdmin = adminPatterns.some(pattern => pattern.test(emailLower));
  
  return isAdmin ? 'admin' : 'employee';
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  
  // Single login form
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (field) => (event) => {
    setLoginForm(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
  };

  const handleLogin = async () => {
    const email = loginForm.email.trim();
    const password = loginForm.password.trim();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) && email !== 'admin') {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Determine user role based on email
      const userRole = determineUserRole(email);
      
      // Validate credentials based on role
      let isValid = false;
      
      if (userRole === 'admin') {
        // Admin credentials
        const adminCredentials = [
          { email: 'admin', password: 'admin' },
          { email: 'admin@company.com', password: 'admin123' },
          { email: 'hr@company.com', password: 'admin123' },
          { email: 'administrator@company.com', password: 'admin123' }
        ];
        
        isValid = adminCredentials.some(
          cred => (cred.email.toLowerCase() === email.toLowerCase() || 
                   email.toLowerCase().includes('admin') || 
                   email.toLowerCase().includes('hr')) && 
                  cred.password === password
        );
        
        // Also accept any email with admin pattern and any password for demo
        if (!isValid && (email.toLowerCase().includes('admin') || email.toLowerCase().includes('hr'))) {
          isValid = true;
        }
      } else {
        // Employee credentials - accept any email and password for demo
        isValid = true;
      }
      
      if (isValid) {
        // Store login state in localStorage for session management
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userId', email);
        localStorage.setItem('userEmail', email);
        
        // Navigate to appropriate dashboard
        if (userRole === 'admin') {
          navigate('/admin-dashboard', { replace: true });
        } else {
          navigate('/employee-dashboard', { replace: true });
        }
      } else {
        setError('Invalid credentials. Please check your email and password.');
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
      handleLogin();
    }
  };

  const handleForgotPassword = () => {
    setShowResetPassword(true);
    setResetEmail('');
    setResetSuccess(false);
    setResetError('');
  };

  const handleResetPassword = async () => {
    const email = resetEmail.trim();

    if (!email) {
      setResetError('Please enter your email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setResetError('Please enter a valid email address');
      return;
    }

    setResetLoading(true);
    setResetError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful password reset
      setResetSuccess(true);
      setResetLoading(false);
      
      // Close dialog after 3 seconds
      setTimeout(() => {
        setShowResetPassword(false);
        setResetSuccess(false);
        setResetEmail('');
      }, 3000);
    } catch (error) {
      console.error('Reset password error:', error);
      setResetError('Failed to send reset email. Please try again.');
      setResetLoading(false);
    }
  };

  const handleCloseResetDialog = () => {
    setShowResetPassword(false);
    setResetEmail('');
    setResetSuccess(false);
    setResetError('');
  };

  return (
    <LoginContainer>
      <Box sx={{ maxWidth: 480, width: '100%' }}>
        <LoginCard>
          <CardContent sx={{ p: 0 }}>
            {/* Header */}
            <Box sx={{ p: 4, pb: 0, textAlign: 'center' }}>
              {/* Logo and Text Side by Side */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: 2,
                  mb: 2
                }}
              >
                <Box
                  component="img"
                  src={GrowGridLogo}
                  alt="GrowGrid logo"
                  sx={{ 
                    width: 'auto', 
                    height: 80, 
                    maxWidth: '120px',
                    display: 'block',
                    objectFit: 'contain',
                    flexShrink: 0
                  }}
                />
                <Box sx={{ textAlign: 'left' }}>
                  <Typography 
                    variant="h4" 
                    fontWeight="bold" 
                    sx={{ 
                      lineHeight: 1.1,
                      letterSpacing: '0.02em',
                      mb: 0
                    }}
                  >
                    GROW
                  </Typography>
                  <Typography 
                    variant="h4" 
                    fontWeight="bold"
                    sx={{ 
                      lineHeight: 1.1,
                      letterSpacing: '0.02em',
                      mt: 0
                    }}
                  >
                    GRID
                  </Typography>
                </Box>
              </Box>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Grid of continuous learning and compliance
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to your account
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Box sx={{ p: 2 }}>
                <Alert severity="error">{error}</Alert>
              </Box>
            )}

            {/* Single Login Form */}
            <Box sx={{ p: 4 }}>
              <Box 
                component="form" 
                noValidate 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  value={loginForm.email}
                  onChange={handleInputChange('email')}
                  margin="normal"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#153B1A' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#153B1A',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#153B1A',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#153B1A',
                    },
                  }}
                  onKeyPress={handleKeyPress}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={handleInputChange('password')}
                  margin="normal"
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#153B1A' }} />
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#153B1A',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#153B1A',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#153B1A',
                    },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Link
                    component="button"
                    type="button"
                    onClick={handleForgotPassword}
                    sx={{
                      color: '#153B1A',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      '&:hover': {
                        textDecoration: 'underline',
                        color: '#0d2a12'
                      }
                    }}
                  >
                    Forgot Password?
                  </Link>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  sx={{ 
                    mt: 3, 
                    mb: 2,
                    py: 1.5,
                    backgroundColor: '#153B1A',
                    '&:hover': { 
                      backgroundColor: '#0d2a12',
                      boxShadow: '0 4px 12px rgba(21, 59, 26, 0.3)'
                    },
                    '&:disabled': {
                      backgroundColor: '#153B1A',
                      opacity: 0.6
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
                </Button>
              </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ p: 3, pt: 0 }}>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Demo Credentials:<br/>
                <strong>Employee:</strong> Any email (e.g., employee@company.com) + Any Password<br/>
                <strong>Admin:</strong> admin@company.com or hr@company.com + admin123
              </Typography>
            </Box>
          </CardContent>
        </LoginCard>
      </Box>

      {/* Reset Password Dialog */}
      <Dialog 
        open={showResetPassword} 
        onClose={handleCloseResetDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#153B1A',
          color: 'white',
          pb: 2
        }}>
          <Typography variant="h6" fontWeight="bold">
            Reset Password
          </Typography>
          <IconButton
            onClick={handleCloseResetDialog}
            sx={{ color: 'white' }}
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {resetSuccess ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Box sx={{ 
                width: 64, 
                height: 64, 
                borderRadius: '50%', 
                backgroundColor: '#e8f5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}>
                <EmailIcon sx={{ fontSize: 32, color: '#153B1A' }} />
              </Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Reset Email Sent!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We've sent a password reset link to <strong>{resetEmail}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Please check your email and follow the instructions to reset your password.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                Enter your email address and we'll send you a link to reset your password.
              </Typography>
              {resetError && (
                <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                  {resetError}
                </Alert>
              )}
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={resetEmail}
                onChange={(e) => {
                  setResetEmail(e.target.value);
                  setResetError('');
                }}
                margin="normal"
                autoComplete="email"
                placeholder="Enter your email address"
                disabled={resetLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#175C23' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mt: 3,
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#175C23',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#175C23',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#175C23',
                  },
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !resetLoading) {
                    handleResetPassword();
                  }
                }}
              />
            </>
          )}
        </DialogContent>
        {!resetSuccess && (
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button 
              onClick={handleCloseResetDialog}
              sx={{ color: '#666' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetPassword}
              variant="contained"
              disabled={resetLoading || !resetEmail.trim()}
              sx={{
                backgroundColor: '#175C23',
                '&:hover': { 
                  backgroundColor: '#0f3d16',
                  boxShadow: '0 4px 12px rgba(23, 92, 35, 0.3)'
                },
                '&:disabled': {
                  backgroundColor: '#175C23',
                  opacity: 0.6
                }
              }}
            >
              {resetLoading ? (
                <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </LoginContainer>
  );
};

export default LoginPage;
