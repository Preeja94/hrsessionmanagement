import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { setAuthToken } from '../utils/api';
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
  Link
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon
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
  position: 'relative',
  perspective: '1000px',
}));

const FlipContainer = styled(Box)(({ flipped }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  transformStyle: 'preserve-3d',
  transition: 'transform 0.6s',
  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
}));

const FlipFace = styled(Box)({
  position: 'relative',
  width: '100%',
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
});

const FlipFaceFront = styled(FlipFace)({
  transform: 'rotateY(0deg)',
});

const FlipFaceBack = styled(FlipFace)({
  transform: 'rotateY(180deg)',
  position: 'absolute',
  top: 0,
  left: 0,
});

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
  const { login } = useAuth();
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
      // Call the actual API login endpoint
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email, // Backend expects 'username' field
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Invalid credentials' }));
        throw new Error(errorData.error || 'Invalid credentials');
      }

      const data = await response.json();
      
      // Store authentication data using AuthContext
      const userData = {
        id: data.user?.id || email,
        email: data.user?.email || email,
        role: data.user?.role || determineUserRole(email),
        ...data.user
      };
      
      login(data.token, userData);
      setAuthToken(data.token);
      
      // Check if password reset is required
      if (data.password_reset_required) {
        navigate('/reset-password', { state: { showInfo: true }, replace: true });
        return;
      }
      
      // Navigate to appropriate dashboard
      const userRole = userData.role;
      if (userRole === 'admin' || userRole === 'hr_admin') {
        navigate('/admin-dashboard', { replace: true });
      } else {
        navigate('/employee-dashboard', { replace: true });
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
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
    setError('');
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
    } catch (error) {
      console.error('Reset password error:', error);
      setResetError('Failed to send reset email. Please try again.');
      setResetLoading(false);
    }
  };

  const handleBackToLogin = () => {
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
            {/* Static Header - Logo and Tagline (doesn't flip) */}
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
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
                Where Learning Grows, Compliance Flows
              </Typography>
            </Box>

            {/* Flip Container - Only form content flips */}
            <FlipContainer flipped={showResetPassword}>
              {/* Front Face - Login Form */}
              <FlipFaceFront>
                {/* Error Alert */}
                {error && (
                  <Box sx={{ p: 2 }}>
                    <Alert severity="error">{error}</Alert>
                  </Box>
                )}

                {/* Login Form */}
                <Box sx={{ p: 4, pt: 2 }}>
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
                      sx={{ mt: 0 }}
                      autoComplete="email"
                      placeholder="Enter your email address"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon sx={{ color: '#114417DB' }} />
                          </InputAdornment>
                        ),
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
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#114417DB',
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
                            <LockIcon sx={{ color: '#114417DB' }} />
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
                            borderColor: '#114417DB',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#114417DB',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#114417DB',
                        },
                      }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <Link
                        component="button"
                        type="button"
                        onClick={handleForgotPassword}
                        sx={{
                          color: '#114417DB',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          '&:hover': {
                            textDecoration: 'underline',
                            color: '#0a2f0e'
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
                        backgroundColor: '#114417DB',
                        color: '#ffffff',
                        fontWeight: 500,
                        fontSize: '0.9375rem',
                        textTransform: 'none',
                        '&:hover': { 
                          backgroundColor: '#0a2f0e',
                          boxShadow: '0 4px 12px rgba(17, 68, 23, 0.3)'
                        },
                        '&:disabled': {
                          backgroundColor: '#114417DB',
                          color: '#ffffff',
                          opacity: 0.6
                        }
                      }}
                    >
                      {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
                    </Button>
                  </Box>
                </Box>

              </FlipFaceFront>

              {/* Back Face - Forgot Password Form */}
              <FlipFaceBack>
                {/* Forgot Password Form */}
                <Box sx={{ p: 4 }}>
                  {resetSuccess ? (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
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
                        <EmailIcon sx={{ fontSize: 32, color: '#114417DB' }} />
                      </Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Reset Email Sent!
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        We've sent a password reset link to <strong>{resetEmail}</strong>
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Please check your email and follow the instructions to reset your password.
                      </Typography>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={handleBackToLogin}
                        startIcon={<ArrowBackIcon />}
                        sx={{ 
                          mt: 2,
                          backgroundColor: '#114417DB',
                          '&:hover': { 
                            backgroundColor: '#0a2f0e',
                            boxShadow: '0 4px 12px rgba(17, 68, 23, 0.3)'
                          }
                        }}
                      >
                        Back to Login
                      </Button>
                    </Box>
                  ) : (
                    <>
                      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                        Reset Password
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                        Enter your email address and we'll send you a link to reset your password.
                      </Typography>
                      {resetError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
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
                              <EmailIcon sx={{ color: '#114417DB' }} />
                            </InputAdornment>
                          ),
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
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#114417DB',
                          },
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !resetLoading) {
                            handleResetPassword();
                          }
                        }}
                      />
                      <Button
                        fullWidth
                        variant="contained"
                        type="button"
                        onClick={handleResetPassword}
                        disabled={resetLoading || !resetEmail.trim()}
                        sx={{ 
                          mt: 3, 
                          mb: 2,
                          py: 1.5,
                          backgroundColor: '#114417DB',
                          color: '#ffffff',
                          fontWeight: 500,
                          fontSize: '0.9375rem',
                          textTransform: 'none',
                          '&:hover': { 
                            backgroundColor: '#0a2f0e',
                            boxShadow: '0 4px 12px rgba(17, 68, 23, 0.3)'
                          },
                          '&:disabled': {
                            backgroundColor: '#114417DB',
                            color: '#ffffff',
                            opacity: 0.6
                          }
                        }}
                      >
                        {resetLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Send Reset Link'}
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={handleBackToLogin}
                        startIcon={<ArrowBackIcon />}
                        sx={{ 
                          mt: 1,
                          borderColor: '#114417DB',
                          color: '#114417DB',
                          '&:hover': { 
                            borderColor: '#0a2f0e',
                            backgroundColor: 'rgba(17, 68, 23, 0.04)'
                          }
                        }}
                      >
                        Back to Login
                      </Button>
                    </>
                  )}
                </Box>
              </FlipFaceBack>
            </FlipContainer>
          </CardContent>
        </LoginCard>
      </Box>
    </LoginContainer>
  );
};

export default LoginPage;
