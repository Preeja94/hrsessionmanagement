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
  TextField as MuiTextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  RequestPage as RequestIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Schedule as ScheduleIcon,
  Lock as LockIcon,
  PlayArrow as PlayIcon
} from '@mui/icons-material';
import { useSessionRequests } from '../contexts/SessionRequestContext';

const APPROVAL_WINDOW_DAYS = 5;

const CourseLibrary = ({ lockedSessions = [], onSessionStart, onSessionClick, loading = false }) => {
  const { addSessionRequest } = useSessionRequests();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [skillFilter, setSkillFilter] = useState('all');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [requestReason, setRequestReason] = useState('');

  const filteredSessions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let filtered = lockedSessions;
    
    // Apply search filter
    if (term) {
      filtered = filtered.filter(session =>
        session.title?.toLowerCase().includes(term) ||
        session.description?.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => {
        if (statusFilter === 'locked') {
          return session.isLocked || session.status === 'locked';
        }
        return session.status === statusFilter;
      });
    }
    
    // Apply skill filter
    if (skillFilter !== 'all') {
      filtered = filtered.filter(session => {
        return session.skills && session.skills.includes(skillFilter);
      });
    }
    
    return filtered;
  }, [lockedSessions, searchTerm, statusFilter, skillFilter]);

  const sortedSessions = useMemo(
    () =>
      [...filteredSessions].sort((a, b) => {
        const left = new Date(a.lockedAt || a.dueDateTime || a.publishedAt || a.createdAt || 0);
        const right = new Date(b.lockedAt || b.dueDateTime || b.publishedAt || b.createdAt || 0);
        return right - left;
      }),
    [filteredSessions]
  );

  const recentlyAdded = useMemo(
    () => sortedSessions.slice(0, 3),
    [sortedSessions]
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

  const renderAvailableCard = (session) => (
    <Card 
      sx={{ 
        height: '100%', 
        cursor: 'pointer',
        '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
        transition: 'all 0.2s ease-in-out'
      }}
      onClick={() => {
        if (onSessionClick) {
          onSessionClick(session);
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {session.title}
            </Typography>
            {session.type && (
              <Chip
                label={session.type}
                size="small"
                sx={{ 
                  backgroundColor: '#e3f2fd', 
                  color: '#1976d2',
                  fontSize: '0.7rem',
                  mt: 0.5
                }}
              />
            )}
          </Box>
          <Chip
            label={
              session.completed || session.status === 'completed'
                ? 'Completed'
                : session.status === 'scheduled'
                ? 'Scheduled'
                : 'Available'
            }
            size="small"
            sx={{ backgroundColor: '#114417DB', color: 'white' }}
          />
        </Box>

        {/* Module count */}
        <Box display="flex" alignItems="center" mb={1.5} gap={0.75}>
          <Typography variant="body2" color="text.secondary">
            {session.moduleCount || (session.files?.length || 0) + (session.quiz ? 1 : 0) + (session.aiContent ? 1 : 0)} modules
          </Typography>
        </Box>

        {session.skills && session.skills.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.5} mb={1.5}>
            {session.skills.slice(0, 3).map((skill, idx) => (
              <Chip
                key={idx}
                label={skill}
                size="small"
                sx={{
                  backgroundColor: '#e8f5e9',
                  color: '#2e7d32',
                  fontSize: '0.7rem'
                }}
              />
            ))}
            {session.skills.length > 3 && (
              <Chip
                label={`+${session.skills.length - 3}`}
                size="small"
                sx={{
                  backgroundColor: '#e8f5e9',
                  color: '#2e7d32',
                  fontSize: '0.7rem'
                }}
              />
            )}
          </Box>
        )}

        {session.dueDateTime && (
          <Box display="flex" alignItems="center" mb={1.5} gap={0.75}>
            <ScheduleIcon sx={{ fontSize: 16, color: '#6b7280' }} />
            <Typography variant="body2" color="text.secondary">
              Due by {formatDate(session.dueDateTime)}
            </Typography>
          </Box>
        )}
      </CardContent>
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

  if (loading) {
    return (
      <Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Box textAlign="center">
          <CircularProgress size={60} sx={{ color: '#114417DB', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Loading sessions...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box p={3} sx={{ mx: '10px' }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Session Library
        </Typography>
      </Box>

      {/* Filters and Search */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Search Courses"
              placeholder="Search by title or description..."
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
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel shrink={true}>Filter by Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Filter by Status"
                displayEmpty
              >
                <MenuItem value="all">
                  <em>All Sessions</em>
                </MenuItem>
                <MenuItem value="locked">Locked</MenuItem>
                <MenuItem value="published">Published</MenuItem>
                <MenuItem value="scheduled">Scheduled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel shrink={true}>Filter by Skills</InputLabel>
              <Select
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                label="Filter by Skills"
                displayEmpty
              >
                <MenuItem value="all">
                  <em>All Skills</em>
                </MenuItem>
                {Array.from(new Set(
                  (lockedSessions || []).flatMap(session => session.skills || [])
                )).sort().map(skill => (
                  <MenuItem key={skill} value={skill}>{skill}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={1}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setSkillFilter('all');
              }}
              sx={{ height: '56px', width: '100%', minWidth: 'auto' }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Card>

      <Box mb={4}>
        {sortedSessions.length === 0 ? (
          renderEmptyState('No sessions available at the moment.')
        ) : (
          <Grid container spacing={3}>
            {sortedSessions.map(session => (
              <Grid item xs={12} md={6} lg={4} key={session.id}>
                {session.isLocked || session.status === 'locked' ? (
                  renderLockedCard(session)
                ) : (
                  renderAvailableCard(session)
                )}
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
