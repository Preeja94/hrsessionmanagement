import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as MuiTextField
} from '@mui/material';
import {
  Search as SearchIcon,
  RequestPage as RequestIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Schedule as ScheduleIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useSessionRequests } from '../contexts/SessionRequestContext';

const APPROVAL_WINDOW_DAYS = 5;

const CourseLibrary = ({ lockedSessions = [] }) => {
  const { addSessionRequest } = useSessionRequests();
  const [searchTerm, setSearchTerm] = useState('');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [requestReason, setRequestReason] = useState('');

  const filteredLockedSessions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return lockedSessions;
    return lockedSessions.filter(session =>
      session.title?.toLowerCase().includes(term) ||
      session.description?.toLowerCase().includes(term)
    );
  }, [lockedSessions, searchTerm]);

  const sortedLockedSessions = useMemo(
    () =>
      [...filteredLockedSessions].sort((a, b) => {
        const left = new Date(a.lockedAt || a.dueDateTime || a.publishedAt || 0);
        const right = new Date(b.lockedAt || b.dueDateTime || b.publishedAt || 0);
        return right - left;
      }),
    [filteredLockedSessions]
  );

  const recentlyAdded = useMemo(
    () => sortedLockedSessions.slice(0, 3),
    [sortedLockedSessions]
  );

  const formatDate = (value, fallback = 'Not available') => {
    if (!value) return fallback;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return fallback;
    return date.toLocaleString();
  };

  const handleRequestAccess = (session) => {
    setSelectedSession(session);
    setShowRequestDialog(true);
    setRequestReason('');
  };

  const handleSubmitRequest = () => {
    if (!selectedSession) return;
    if (!requestReason.trim()) {
      alert('Please provide a brief reason for your request.');
      return;
    }

    const request = {
      sessionId: selectedSession.id,
      sessionName: selectedSession.title,
      reason: requestReason,
      employeeName: 'Luke Wilson',
      employeeEmail: 'luke.wilson@company.com',
      status: 'pending',
      requestedAt: new Date().toISOString(),
      lockedDate: selectedSession.lockedAt || selectedSession.dueDateTime,
      dueDateTime: selectedSession.dueDateTime,
      approvalWindowDays: APPROVAL_WINDOW_DAYS
    };

    addSessionRequest(request);
    setShowRequestDialog(false);
    setSelectedSession(null);
    setRequestReason('');
    alert('Request submitted successfully! The admin team will review it shortly.');
  };

  const renderEmptyState = (message) => (
    <Card sx={{ p: 4, textAlign: 'center', backgroundColor: '#f8fafc' }}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Nothing to show yet
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Card>
  );

  const renderLockedCard = (session) => (
    <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {session.title}
          </Typography>
          <Chip
            label="Locked"
            size="small"
            sx={{ backgroundColor: '#ef4444', color: 'white' }}
            icon={<LockIcon sx={{ fontSize: 16 }} />}
          />
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          {session.description || 'This session is currently locked. Request access to resume your training.'}
        </Typography>

        <Box display="flex" alignItems="center" mb={1.5} gap={0.75}>
          <PersonIcon sx={{ fontSize: 16, color: '#6b7280' }} />
          <Typography variant="body2" color="text.secondary">
            {session.instructor || 'HR Team'}
          </Typography>
        </Box>

        {session.dueDateTime && (
          <Box display="flex" alignItems="center" mb={1} gap={0.75}>
            <ScheduleIcon sx={{ fontSize: 16, color: '#b91c1c' }} />
            <Typography variant="body2" color="#b91c1c">
              Due by {formatDate(session.dueDateTime)}
            </Typography>
          </Box>
        )}

        {session.lockedAt && (
          <Box display="flex" alignItems="center" mb={1} gap={0.75}>
            <TimeIcon sx={{ fontSize: 16, color: '#6b7280' }} />
            <Typography variant="body2" color="text.secondary">
              Locked on {formatDate(session.lockedAt)}
            </Typography>
          </Box>
        )}

        <Box mt={2}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<RequestIcon />}
            onClick={() => handleRequestAccess(session)}
            sx={{ backgroundColor: '#114417DB', '&:hover': { backgroundColor: '#0a2f0e' } }}
          >
            Request Access
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" display="block" mt={1.5}>
          Once approved, complete this session within {APPROVAL_WINDOW_DAYS} days to avoid relocking.
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box p={3}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Session Library
        </Typography>
        <Typography variant="body1" color="text.secondary">
          All available courses
        </Typography>
      </Box>

      <Box mb={4}>
        <TextField
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box mb={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          All Sessions
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Browse all available courses. Request access to locked sessions.
        </Typography>
        {sortedLockedSessions.length === 0 ? (
          renderEmptyState('No courses available at the moment.')
        ) : (
          <Grid container spacing={3}>
            {sortedLockedSessions.map(session => (
              <Grid item xs={12} md={6} lg={4} key={session.id}>
                {renderLockedCard(session)}
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Dialog open={showRequestDialog} onClose={() => setShowRequestDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request Access</DialogTitle>
        <DialogContent dividers>
          {selectedSession && (
            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                {selectedSession.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                Due by {formatDate(selectedSession.dueDateTime)}
              </Typography>
            </Box>
          )}
          <MuiTextField
            label="Reason for request"
            value={requestReason}
            onChange={(e) => setRequestReason(e.target.value)}
            multiline
            rows={4}
            fullWidth
            placeholder="Provide a brief explanation so the admin can approve your request quickly."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRequestDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitRequest} 
            variant="contained"
            sx={{ backgroundColor: '#114417DB', '&:hover': { backgroundColor: '#0a2f0e' } }}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseLibrary;
