import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAuthToken } from '../utils/api';
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
  IconButton
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import GrowGridLogo from '../assets/Grow Grid logo.PNG';

const Container = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f8f9fa',
  padding: theme.spacing(2),
}));

const ResetCard = styled(Card)(({ theme }) => ({
  maxWidth: 500,
  width: '100%',
  borderRadius: theme.spacing(3),
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
}));

const PasswordResetPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getUserRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    // Check if user was redirected from login with showInfo flag
    if (location.state?.showInfo) {
      setShowInfo(true);
    }
  }, [location]);

  const handleInputChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setError('');
  };

  const handleResetPassword = async () => {
    if (!formData.current_password || !formData.new_password || !formData.confirm_password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      setError('New password and confirm password do not match');
      return;
    }

    if (formData.new_password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error('Not authenticated. Please login again.');
      }
      
      const response = await fetch('http://localhost:8000/api/auth/reset-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to reset password' }));
        throw new Error(errorData.error || 'Failed to reset password');
      }

      setSuccess(true);
      setTimeout(() => {
        // Navigate to appropriate dashboard based on user role
        const userRole = getUserRole();
        if (userRole === 'admin' || userRole === 'hr_admin') {
          navigate('/admin-dashboard', { replace: true });
        } else {
          navigate('/employee-dashboard', { replace: true });
        }
      }, 2000);
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.message || 'Failed to reset password. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Container>
      <ResetCard>
        <CardContent sx={{ p: 4 }}>
          {/* Logo and Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              component="img"
              src={GrowGridLogo}
              alt="GrowGrid logo"
              sx={{ 
                width: 'auto', 
                height: 80, 
                maxWidth: '120px',
                mb: 2
              }}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Reset Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please set a new password for your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          )}

          {success ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Password reset successfully! Redirecting...
            </Alert>
          ) : (
            <Box component="form" noValidate>
              <TextField
                fullWidth
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={formData.current_password}
                onChange={handleInputChange('current_password')}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#114417DB' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        edge="end"
                        type="button"
                      >
                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: '#114417DB' },
                    '&.Mui-focused fieldset': { borderColor: '#114417DB' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#114417DB' },
                }}
              />
              <TextField
                fullWidth
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={formData.new_password}
                onChange={handleInputChange('new_password')}
                margin="normal"
                required
                helperText="Must be at least 8 characters"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#114417DB' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                        type="button"
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: '#114417DB' },
                    '&.Mui-focused fieldset': { borderColor: '#114417DB' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#114417DB' },
                }}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirm_password}
                onChange={handleInputChange('confirm_password')}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#114417DB' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        type="button"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: '#114417DB' },
                    '&.Mui-focused fieldset': { borderColor: '#114417DB' },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#114417DB' },
                }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={handleResetPassword}
                disabled={loading}
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  py: 1.5,
                  backgroundColor: '#114417DB',
                  '&:hover': { backgroundColor: '#0a2f0e' }
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Reset Password'}
              </Button>
            </Box>
          )}
        </CardContent>
      </ResetCard>
    </Container>
  );
};

export default PasswordResetPage;

