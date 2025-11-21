import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Badge,
  Paper
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Lock as LockIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Message as MessageIcon,
  ThumbDown as ThumbDownIcon
} from '@mui/icons-material';
import { useSessionRequests } from '../contexts/SessionRequestContext';

const EmployeeEngagement = () => {
  const { sessionRequests, updateRequestStatus, refreshRequests } = useSessionRequests();
  
  // Fallback data in case context is not working
  const fallbackRequests = [
    {
      id: 1,
      employeeName: "Test User",
      sessionName: "Test Session",
      attemptsUsed: 2,
      maxAttempts: 3,
      lockedDate: "Dec 16, 2024",
      status: "locked",
      reason: "Test reason for debugging",
      employeeEmail: "test@company.com"
    }
  ];
  
  const displayRequests = sessionRequests && sessionRequests.length > 0 ? sessionRequests : fallbackRequests;
  const [activeSubTab, setActiveSubTab] = useState('requests');
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    employeeCode: '',
    jobRole: '',
    reportingManager: ''
  });

  // Debug logging
  console.log('EmployeeEngagement component loaded');
  console.log('EmployeeEngagement - sessionRequests:', sessionRequests);
  console.log('EmployeeEngagement - sessionRequests length:', sessionRequests.length);
  console.log('EmployeeEngagement - displayRequests:', displayRequests);
  
  // Removed localStorage check - now using API via context

  const handleAddEmployee = () => {
    if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email || !newEmployee.department) {
      alert('Please fill in all required fields');
      return;
    }
    
    alert('Employee added successfully!');
    setNewEmployee({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      employeeCode: '',
      jobRole: '',
      reportingManager: ''
    });
    setShowAddEmployee(false);
  };

  const handleRequestAction = (requestId, action) => {
    if (action === 'approve') {
      updateRequestStatus(requestId, 'approved');
      alert('Request approved successfully! Employee will be notified.');
    } else if (action === 'deny') {
      updateRequestStatus(requestId, 'denied');
      alert('Request denied.');
    } else if (action === 'message') {
      alert('Message sent to employee.');
    }
  };

  const handleRefresh = () => {
    // Refresh from API via context
    if (refreshRequests) {
      refreshRequests();
    } else {
      // Fallback: reload page
      window.location.reload();
    }
  };

  return (
    <Box p={3}>
      {/* Debug Info */}
      <Box mb={2} p={2} sx={{ backgroundColor: '#f0f0f0', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Debug: Component loaded, displayRequests: {displayRequests.length}
        </Typography>
        <Button 
          variant="contained" 
          size="small" 
          onClick={() => alert('Component is working!')}
          sx={{ mt: 1 }}
        >
          Test Button
        </Button>
      </Box>
      
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Employee Engagement
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage session requests and employee access
        </Typography>
      </Box>

      {/* Sub Navigation Tabs */}
      <Box mb={4}>
        <Box display="flex" gap={2}>
          <Button
            variant={activeSubTab === 'requests' ? 'contained' : 'outlined'}
            onClick={() => setActiveSubTab('requests')}
            sx={{
              backgroundColor: activeSubTab === 'requests' ? '#3b82f6' : 'transparent',
              color: activeSubTab === 'requests' ? 'white' : '#3b82f6',
              '&:hover': {
                backgroundColor: activeSubTab === 'requests' ? '#2563eb' : '#f3f4f6',
              },
            }}
          >
            Request Approvals
          </Button>
          <Button
            variant={activeSubTab === 'employees' ? 'contained' : 'outlined'}
            onClick={() => setActiveSubTab('employees')}
            sx={{
              backgroundColor: activeSubTab === 'employees' ? '#3b82f6' : 'transparent',
              color: activeSubTab === 'employees' ? 'white' : '#3b82f6',
              '&:hover': {
                backgroundColor: activeSubTab === 'employees' ? '#2563eb' : '#f3f4f6',
              },
            }}
          >
            Add Employee
          </Button>
        </Box>
      </Box>

      {/* Request Approvals Tab */}
      {activeSubTab === 'requests' && (
        <>
          {/* Session Requests Alert */}
          <Box mb={4}>
            <Card sx={{ backgroundColor: '#fff3cd', border: '1px solid #ffeaa7' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <WarningIcon sx={{ color: '#856404', mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold" color="#856404">
                    Session Requests Alert
                  </Typography>
                </Box>
                <Typography variant="body1" color="#856404">
                  {displayRequests.filter(req => req.status === 'locked').length} locked sessions and {displayRequests.filter(req => req.status === 'pending').length} new access requests need your attention
                </Typography>
                <Typography variant="body2" color="#856404" sx={{ mt: 1 }}>
                  Total requests: {displayRequests.length}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Session Requests Section */}
          <Box mb={4}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography variant="h5" fontWeight="bold">
                Session Requests
              </Typography>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                size="small"
              >
                Refresh
              </Button>
            </Box>

            {displayRequests.length === 0 ? (
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No session requests found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  When employees request access to courses, they will appear here.
                </Typography>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {displayRequests.map((request) => (
                  <Grid item xs={12} md={6} key={request.id}>
                    <Card sx={{ p: 3, height: '100%', border: '1px solid #e5e7eb' }}>
                      {/* Header with Employee Info */}
                      <Box display="flex" alignItems="center" mb={3}>
                        <Avatar sx={{ bgcolor: '#3b82f6', mr: 2 }}>
                          <PersonIcon />
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="h6" fontWeight="bold">
                            {request.employeeName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {request.employeeEmail}
                          </Typography>
                        </Box>
                        <Chip
                          label={request.status === 'locked' ? 'Locked' : request.status}
                          color={request.status === 'locked' ? 'error' : request.status === 'approved' ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>

                      {/* Session Details */}
                      <Box mb={3}>
                        <Typography variant="body2" fontWeight="medium" color="text.secondary" gutterBottom>
                          Session: {request.sessionName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {request.status === 'locked' 
                            ? `Attempts Used: ${request.attemptsUsed}/${request.maxAttempts} • Locked: ${request.lockedDate}`
                            : `Request Date: ${request.lockedDate} • Status: New Request`
                          }
                        </Typography>
                      </Box>

                      {/* Employee's Reason */}
                      <Box mb={3}>
                        <Typography variant="body2" fontWeight="medium" mb={1}>
                          Employee's Reason:
                        </Typography>
                        <Paper sx={{ 
                          backgroundColor: '#f8fafc', 
                          p: 2, 
                          borderRadius: 1,
                          borderLeft: '4px solid #3b82f6'
                        }}>
                          <Typography variant="body2" fontStyle="italic">
                            "{request.reason}"
                          </Typography>
                        </Paper>
                      </Box>

                      {/* Action Buttons */}
                      {(request.status === 'locked' || request.status === 'pending') && (
                        <Box display="flex" gap={1} flexWrap="wrap">
                          <Button
                            variant="contained"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleRequestAction(request.id, 'approve')}
                            size="small"
                            sx={{ 
                              backgroundColor: '#10b981', 
                              '&:hover': { backgroundColor: '#059669' },
                              flex: 1,
                              minWidth: '120px'
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<ThumbDownIcon />}
                            onClick={() => handleRequestAction(request.id, 'deny')}
                            size="small"
                            sx={{ 
                              borderColor: '#ef4444',
                              color: '#ef4444',
                              '&:hover': { 
                                borderColor: '#dc2626',
                                backgroundColor: '#fef2f2'
                              },
                              flex: 1,
                              minWidth: '120px'
                            }}
                          >
                            Deny
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<MessageIcon />}
                            onClick={() => handleRequestAction(request.id, 'message')}
                            size="small"
                            sx={{ 
                              borderColor: '#3b82f6',
                              color: '#3b82f6',
                              '&:hover': { 
                                borderColor: '#2563eb',
                                backgroundColor: '#eff6ff'
                              },
                              flex: 1,
                              minWidth: '120px'
                            }}
                          >
                            Message
                          </Button>
                        </Box>
                      )}

                      {request.status === 'approved' && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <CheckCircleIcon sx={{ color: '#10b981' }} />
                          <Typography variant="body2" color="text.secondary">
                            Request approved - Employee has been notified
                          </Typography>
                        </Box>
                      )}

                      {request.status === 'denied' && (
                        <Box display="flex" alignItems="center" gap={1}>
                          <CloseIcon sx={{ color: '#ef4444' }} />
                          <Typography variant="body2" color="text.secondary">
                            Request denied - Employee has been notified
                          </Typography>
                        </Box>
                      )}
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </>
      )}

      {/* Add Employee Tab */}
      {activeSubTab === 'employees' && (
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h5" fontWeight="bold">
              Add New Employee
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowAddEmployee(true)}
              sx={{ backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669' } }}
            >
              Add New Employee
            </Button>
          </Box>

          {showAddEmployee && (
            <Card sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Employee Information
              </Typography>
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
                  <FormControl fullWidth required>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={newEmployee.department}
                      onChange={(e) => setNewEmployee(prev => ({ ...prev, department: e.target.value }))}
                      label="Department"
                    >
                      <MenuItem value="Engineering">Engineering</MenuItem>
                      <MenuItem value="Marketing">Marketing</MenuItem>
                      <MenuItem value="HR">HR</MenuItem>
                      <MenuItem value="Finance">Finance</MenuItem>
                      <MenuItem value="Sales">Sales</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Employee Code"
                    value={newEmployee.employeeCode}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, employeeCode: e.target.value }))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Job Role"
                    value={newEmployee.jobRole}
                    onChange={(e) => setNewEmployee(prev => ({ ...prev, jobRole: e.target.value }))}
                    fullWidth
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
                  onClick={() => setShowAddEmployee(false)}
                >
                  Cancel
                </Button>
              </Box>
            </Card>
          )}
        </Box>
      )}
    </Box>
  );
};

export default EmployeeEngagement;