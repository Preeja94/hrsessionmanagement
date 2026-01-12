import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  Paper
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Message as MessageIcon,
  ThumbDown as ThumbDownIcon
} from '@mui/icons-material';
import { useSessionRequests } from '../contexts/SessionRequestContext';

const EmployeeEngagement = () => {
  const { sessionRequests, updateRequestStatus, refreshRequests } = useSessionRequests();
  
  // Use actual session requests from API (no fallback fake data)
  const displayRequests = sessionRequests || [];

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
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Session Access Approvals
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review and manage employee requests for session access
        </Typography>
      </Box>

      {/* Request Approvals Section */}
      <>
          {/* Session Requests Alert */}
          <Box mb={4}>
            <Card sx={{ backgroundColor: '#fff3cd', border: '1px solid #ffeaa7' }}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <WarningIcon sx={{ color: '#856404', mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold" color="#856404">
                    New Session Requests
                  </Typography>
                </Box>
                {displayRequests.filter(req => req.status === 'pending').length > 0 ? (
                  <>
                    <Typography variant="body1" color="#856404">
                      You have {displayRequests.filter(req => req.status === 'pending').length} new session access request{displayRequests.filter(req => req.status === 'pending').length !== 1 ? 's' : ''} that need{displayRequests.filter(req => req.status === 'pending').length === 1 ? 's' : ''} your attention.
                    </Typography>
                    {displayRequests.filter(req => req.status === 'locked').length > 0 && (
                      <Typography variant="body2" color="#856404" sx={{ mt: 1 }}>
                        Additionally, {displayRequests.filter(req => req.status === 'locked').length} locked session{displayRequests.filter(req => req.status === 'locked').length !== 1 ? 's' : ''} require review.
                      </Typography>
                    )}
                  </>
                ) : (
                  <Typography variant="body1" color="#856404">
                    {displayRequests.filter(req => req.status === 'locked').length > 0 
                      ? `You have ${displayRequests.filter(req => req.status === 'locked').length} locked session${displayRequests.filter(req => req.status === 'locked').length !== 1 ? 's' : ''} that require review.`
                      : 'No pending requests at this time.'
                    }
                  </Typography>
                )}
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
                            ? `Attempts Used: ${request.attemptsUsed}/${request.maxAttempts} • Locked: ${request.lockedDate || 'N/A'}`
                            : `Request Date: ${request.requestDate || (request.createdAt ? new Date(request.createdAt).toLocaleString() : 'N/A')} • Status: ${request.status === 'pending' ? 'New Request' : request.status}`
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
    </Box>
  );
};

export default EmployeeEngagement;