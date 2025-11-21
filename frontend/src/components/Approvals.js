import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Lock as LockIcon,
  Message as MessageIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSessionRequests } from '../contexts/SessionRequestContext';
import { sessionAPI } from '../utils/api';

const APPROVAL_WINDOW_DAYS = 5;

const unlockSessionForEmployee = async (request) => {
  try {
    console.log('Unlocking session for employee:', request);
    
    // Get session from API
    const session = await sessionAPI.getById(request.session || request.sessionId);
    if (!session) {
      console.error('Session not found:', request.sessionId);
      return;
    }

    const now = new Date();
    const expiration = new Date(now);
    expiration.setDate(expiration.getDate() + APPROVAL_WINDOW_DAYS);

    const isCompleted = session.status === 'completed' || 
                       (session.completedAt !== undefined && session.completedAt !== null);

    // Determine the new status
    let newStatus = 'in-progress';
    if (isCompleted) {
      newStatus = 'completed';
    } else if (session.scheduled_datetime) {
      newStatus = 'scheduled';
    }

    // Update session via API
    await sessionAPI.update(session.id, {
      ...session,
      status: newStatus,
      // Note: approvalExpiresAt and other fields would need to be stored in session model
      // For now, we update the status
    });
    
    console.log('Session unlocked successfully via API');
  } catch (error) {
    console.error('Failed to unlock session for employee', error);
  }
};

const ApprovalsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#f8f9fa',
  minHeight: '100vh',
}));

const RequestCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid #e5e7eb',
  marginBottom: theme.spacing(2),
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
    transition: 'all 0.3s ease',
  },
}));

const Approvals = () => {
  const { sessionRequests, updateRequestStatus } = useSessionRequests();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  // Filter requests based on search and status
  const filteredRequests = sessionRequests.filter(request => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.sessionName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setActionType('approve');
    setActionMessage('');
    setShowActionDialog(true);
  };

  const handleReject = (request) => {
    setSelectedRequest(request);
    setActionType('reject');
    setActionMessage('');
    setShowActionDialog(true);
  };

  const handleMessage = (request) => {
    setSelectedRequest(request);
    setActionType('message');
    setActionMessage('');
    setShowActionDialog(true);
  };

  const handleActionSubmit = () => {
    if (!selectedRequest) return;

    if (actionType === 'approve') {
      const approvedAt = new Date();
      const approvalExpiresAt = new Date(approvedAt);
      approvalExpiresAt.setDate(approvalExpiresAt.getDate() + APPROVAL_WINDOW_DAYS);

      updateRequestStatus(selectedRequest.id, 'approved', {
        approvedAt: approvedAt.toISOString(),
        approvalExpiresAt: approvalExpiresAt.toISOString()
      });

      // Unlock the session
      unlockSessionForEmployee(selectedRequest);
      
      // Small delay to ensure localStorage is updated and event is processed
      setTimeout(() => {
        alert(`Request approved successfully! The employee has ${APPROVAL_WINDOW_DAYS} days to complete the session before it locks again.`);
      }, 100);
    } else if (actionType === 'reject') {
      updateRequestStatus(selectedRequest.id, 'denied', {
        deniedAt: new Date().toISOString()
      });
      alert('Request rejected. Employee will be notified.');
    } else if (actionType === 'message') {
      alert(`Message sent to ${selectedRequest.employeeName}: "${actionMessage}"`);
    }
    setShowActionDialog(false);
    setSelectedRequest(null);
    setActionMessage('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'locked': return 'error';
      case 'approved': return 'success';
      case 'denied': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <ScheduleIcon />;
      case 'locked': return <LockIcon />;
      case 'approved': return <CheckCircleIcon />;
      case 'denied': return <CancelIcon />;
      default: return <ScheduleIcon />;
    }
  };

  return (
    <ApprovalsContainer>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Session Access Approvals
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and manage employee requests for session access
        </Typography>
      </Box>

      {/* Filters and Search */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Search Requests"
              placeholder="Search by employee name or session..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel shrink={true}>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Filter by Status"
                displayEmpty
              >
                <MenuItem value="all">
                  <em>All Requests</em>
                </MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="locked">Locked</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="denied">Denied</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            {/* Spacer for consistent layout */}
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              sx={{ height: '56px', width: '100%', minWidth: 'auto' }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Summary Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#fff3cd' }}>
            <Typography variant="h4" fontWeight="bold" color="#856404">
              {sessionRequests.filter(r => r.status === 'pending').length}
            </Typography>
            <Typography variant="body2" color="#856404">
              Pending Requests
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#f8d7da' }}>
            <Typography variant="h4" fontWeight="bold" color="#721c24">
              {sessionRequests.filter(r => r.status === 'locked').length}
            </Typography>
            <Typography variant="body2" color="#721c24">
              Locked Sessions
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#d1edff' }}>
            <Typography variant="h4" fontWeight="bold" color="#0c5460">
              {sessionRequests.filter(r => r.status === 'approved').length}
            </Typography>
            <Typography variant="body2" color="#0c5460">
              Approved Requests
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
            <Typography variant="h4" fontWeight="bold" color="#495057">
              {sessionRequests.length}
            </Typography>
            <Typography variant="body2" color="#495057">
              Total Requests
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No requests found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'No session access requests have been made yet'
            }
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredRequests.map((request) => (
            <Grid item xs={12} md={6} key={request.id}>
              <RequestCard>
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
                    icon={getStatusIcon(request.status)}
                    label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    color={getStatusColor(request.status)}
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
                      : `Request Date: ${request.lockedDate} • Status: ${request.status}`
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
                      onClick={() => handleApprove(request)}
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
                      startIcon={<CancelIcon />}
                      onClick={() => handleReject(request)}
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
                      Reject
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<MessageIcon />}
                      onClick={() => handleMessage(request)}
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
                    <CancelIcon sx={{ color: '#ef4444' }} />
                    <Typography variant="body2" color="text.secondary">
                      Request denied - Employee has been notified
                    </Typography>
                  </Box>
                )}
              </RequestCard>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Action Dialog */}
      <Dialog 
        open={showActionDialog} 
        onClose={() => setShowActionDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            {actionType === 'approve' ? 'Approve Request' : 
             actionType === 'reject' ? 'Reject Request' : 
             'Send Message'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedRequest && `Request from ${selectedRequest.employeeName} for "${selectedRequest.sessionName}"`}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {actionType === 'message' && (
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Message to Employee"
              value={actionMessage}
              onChange={(e) => setActionMessage(e.target.value)}
              placeholder="Enter your message to the employee..."
              margin="normal"
            />
          )}
          {(actionType === 'approve' || actionType === 'reject') && (
            <Alert severity={actionType === 'approve' ? 'success' : 'warning'}>
              {actionType === 'approve' 
                ? 'This will approve the employee\'s request and grant them access to the session.'
                : 'This will reject the employee\'s request. They will be notified of the decision.'
              }
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowActionDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleActionSubmit}
            variant="contained"
            sx={{ 
              backgroundColor: actionType === 'approve' ? '#10b981' : 
                             actionType === 'reject' ? '#ef4444' : '#3b82f6',
              '&:hover': { 
                backgroundColor: actionType === 'approve' ? '#059669' : 
                               actionType === 'reject' ? '#dc2626' : '#2563eb'
              }
            }}
          >
            {actionType === 'approve' ? 'Approve' : 
             actionType === 'reject' ? 'Reject' : 
             'Send Message'}
          </Button>
        </DialogActions>
      </Dialog>
    </ApprovalsContainer>
  );
};

export default Approvals;

