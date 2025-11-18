import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  Divider
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  Lock as LockIcon
} from '@mui/icons-material';

const MyCourses = ({ sessions = [], onSessionComplete, onSessionStart, onSessionClick }) => {
  const [activeTab, setActiveTab] = useState('in-progress');

  const sortedSessions = useMemo(
    () =>
      [...sessions].sort((a, b) => {
        const left = new Date(a.scheduledDateTime || a.publishedAt || a.createdAt || 0);
        const right = new Date(b.scheduledDateTime || b.publishedAt || b.createdAt || 0);
        return right - left;
      }),
    [sessions]
  );

  const inProgressSessions = useMemo(
    () => sortedSessions.filter(session => !session.completed && !session.isLocked),
    [sortedSessions]
  );

  const expiredSessions = useMemo(
    () => sortedSessions.filter(session => session.isLocked || (session.dueDateTime && new Date(session.dueDateTime) < new Date())),
    [sortedSessions]
  );

  const completedSessionsList = useMemo(
    () => sortedSessions.filter(session => session.completed),
    [sortedSessions]
  );

  const formatDate = (value, fallback = 'Not available') => {
    if (!value) return fallback;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return fallback;
    return date.toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#114417DB';
      case 'locked':
        return '#ef4444';
      case 'scheduled':
        return '#3b82f6';
      case 'published':
        return '#114417DB';
      case 'in-progress':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'locked':
        return 'Locked';
      case 'scheduled':
        return 'Scheduled';
      case 'published':
        return 'Published';
      case 'in-progress':
      default:
        return 'In Progress';
    }
  };

  const getProgressValue = (session) => {
    if (session.progress !== undefined && session.progress !== null) return session.progress;
    return session.completed ? 100 : 0;
  };

  const handleContinue = (session) => {
    if (onSessionStart) {
      onSessionStart(session.id);
    }
    // Directly start the session without intermediate screen
    if (onSessionClick) {
      // Pass the session directly to start it
      onSessionClick(session);
    }
  };

  const renderEmptyState = (message) => (
    <Card sx={{ p: 4, textAlign: 'center', backgroundColor: '#f8fafc' }}>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        No sessions found
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Card>
  );

  const renderInProgressCard = (session) => (
    <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {session.title}
          </Typography>
          <Chip
            label={getStatusLabel(session.status)}
            sx={{ backgroundColor: getStatusColor(session.status), color: 'white' }}
            size="small"
          />
        </Box>

        {session.description && (
          <Typography variant="body2" color="text.secondary" mb={2}>
            {session.description}
          </Typography>
        )}

        {/* Show file count if files are available */}
        {session.files && Array.isArray(session.files) && session.files.length > 0 && (
          <Box mb={2}>
            <Chip
              label={`${session.files.length} file${session.files.length === 1 ? '' : 's'} available`}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.75rem', color: '#3b82f6', borderColor: '#3b82f6' }}
            />
          </Box>
        )}

        <Box display="flex" alignItems="center" mb={2}>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Start Date: {formatDate(session.scheduledDateTime || session.publishedAt || session.createdAt, 'Not available')}
            </Typography>
            {session.dueDateTime && (
              <Typography variant="caption" color="text.secondary" display="block">
                Due by {formatDate(session.dueDateTime)}
              </Typography>
            )}
          </Box>
        </Box>

        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" fontWeight="medium">
              Progress
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {getProgressValue(session)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={getProgressValue(session)}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {(session.dueDateTime || session.approvalExpiresAt) && (
          <Box mb={2} display="flex" flexDirection="column" gap={0.5}>
            {session.dueDateTime && (
              <Typography variant="caption" color="#b91c1c" display="flex" alignItems="center" gap={0.5}>
                <ScheduleIcon sx={{ fontSize: 14 }} />
                Due by {formatDate(session.dueDateTime)}
              </Typography>
            )}
            {session.approvalExpiresAt && (
              <Typography variant="caption" color="#b91c1c" display="flex" alignItems="center" gap={0.5}>
                <LockIcon sx={{ fontSize: 14 }} />
                Approval expires {formatDate(session.approvalExpiresAt)}
              </Typography>
            )}
          </Box>
        )}

        {session.tags && session.tags.length > 0 && (
          <Box display="flex" gap={1} mb={2} flexWrap="wrap">
            {session.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            ))}
          </Box>
        )}

        <Button
          variant="contained"
          startIcon={<PlayIcon />}
          onClick={() => handleContinue(session)}
          sx={{ 
            backgroundColor: '#114417DB', 
            '&:hover': { backgroundColor: '#0a2f0e' },
            width: '100%'
          }}
        >
          {session.status === 'in-progress' || session.lastAccessed || (session.progress && session.progress > 0)
            ? 'Continue Session'
            : 'Start Session'}
        </Button>
      </CardContent>
    </Card>
  );

  const renderCompletedCard = (session) => (
    <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {session.title}
          </Typography>
          <Chip
            label={getStatusLabel(session.status)}
            sx={{ backgroundColor: getStatusColor(session.status), color: 'white' }}
            size="small"
          />
        </Box>

        {session.description && (
          <Typography variant="body2" color="text.secondary" mb={2}>
            {session.description}
          </Typography>
        )}

        <Box display="flex" alignItems="center" mb={2}>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Start Date: {formatDate(session.scheduledDateTime || session.publishedAt || session.createdAt, 'Not available')}
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              Completed on {formatDate(session.completedAt || session.dueDateTime || session.scheduledDateTime, 'Completion date unavailable')}
            </Typography>
          </Box>
        </Box>

        <Box mb={2}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <TimeIcon sx={{ fontSize: 16, color: '#6b7280' }} />
                <Typography variant="body2" color="text.secondary">
                  Time Taken: {session.timeTaken || 'N/A'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                <Typography variant="body2" color="text.secondary">
                  Score: {session.lastCompletionScore !== undefined && session.lastCompletionScore !== null ? `${session.lastCompletionScore}%` : 'N/A'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {session.tags && session.tags.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" gap={1} flexWrap="wrap">
              {session.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.75rem' }}
                />
              ))}
            </Box>
          </>
        )}

        <Box display="flex" gap={1} mt={2}>
          <Button
            variant="outlined"
            startIcon={<PlayIcon />}
            onClick={() => onSessionClick && onSessionClick(session)}
            sx={{ flex: 1 }}
          >
            Review Session
          </Button>
          {session.certificate && (
            <Button
              variant="contained"
              startIcon={<CheckCircleIcon />}
              sx={{ 
                backgroundColor: '#10b981', 
                '&:hover': { backgroundColor: '#059669' },
                flex: 1
              }}
            >
              Download Certificate
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  const renderExpiredCard = (session) => {
    const handleRequestAccess = () => {
      if (window.confirm(`Request access to "${session.title}"?`)) {
        alert('Request submitted! The admin team will review it shortly.');
      }
    };

    return (
      <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {session.title}
            </Typography>
            <Chip
              label="Expired/Locked"
              sx={{ backgroundColor: '#ef4444', color: 'white' }}
              size="small"
              icon={<LockIcon sx={{ fontSize: 16 }} />}
            />
          </Box>

          {session.description && (
            <Typography variant="body2" color="text.secondary" mb={2}>
              {session.description}
            </Typography>
          )}

          <Box mb={2}>
            <Typography variant="body2" fontWeight="medium" mb={0.5}>
              Start Date: {formatDate(session.scheduledDateTime || session.publishedAt || session.createdAt, 'Not available')}
            </Typography>
            {session.dueDateTime && (
              <Typography variant="caption" color="#b91c1c" display="flex" alignItems="center" gap={0.5}>
                <ScheduleIcon sx={{ fontSize: 14 }} />
                Due by {formatDate(session.dueDateTime)}
              </Typography>
            )}
            {session.lockedAt && (
              <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5} mt={0.5}>
                <LockIcon sx={{ fontSize: 14 }} />
                Locked on {formatDate(session.lockedAt)}
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            fullWidth
            startIcon={<LockIcon />}
            onClick={handleRequestAccess}
            sx={{ 
              backgroundColor: '#114417DB', 
              '&:hover': { backgroundColor: '#0a2f0e' }
            }}
          >
            Request Access
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderSessionsGrid = (list, emptyMessage, renderer) => (
    <Grid container spacing={3}>
      {list.length === 0 ? (
        <Grid item xs={12}>
          {renderEmptyState(emptyMessage)}
        </Grid>
      ) : (
        list.map((session) => (
          <Grid item xs={12} md={6} key={session.id}>
            {renderer(session)}
          </Grid>
        ))
      )}
    </Grid>
  );

  return (
    <Box p={3}>
      <Box mb={4}>
        <Box display="flex" gap={1}>
          <Button
            variant={activeTab === 'all' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('all')}
            sx={{
              backgroundColor: activeTab === 'all' ? '#114417DB' : 'transparent',
              color: activeTab === 'all' ? 'white' : '#114417DB',
              borderColor: '#114417DB',
              '&:hover': {
                backgroundColor: activeTab === 'all' ? '#0a2f0e' : '#f3f4f6',
                borderColor: '#114417DB',
              },
            }}
          >
            All Sessions
          </Button>
          <Button
            variant={activeTab === 'in-progress' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('in-progress')}
            sx={{
              backgroundColor: activeTab === 'in-progress' ? '#114417DB' : 'transparent',
              color: activeTab === 'in-progress' ? 'white' : '#114417DB',
              borderColor: '#114417DB',
              '&:hover': {
                backgroundColor: activeTab === 'in-progress' ? '#0a2f0e' : '#f3f4f6',
                borderColor: '#114417DB',
              },
            }}
          >
            In Progress
          </Button>
          <Button
            variant={activeTab === 'expired' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('expired')}
            sx={{
              backgroundColor: activeTab === 'expired' ? '#114417DB' : 'transparent',
              color: activeTab === 'expired' ? 'white' : '#114417DB',
              borderColor: '#114417DB',
              '&:hover': {
                backgroundColor: activeTab === 'expired' ? '#0a2f0e' : '#f3f4f6',
                borderColor: '#114417DB',
              },
            }}
          >
            Expired
          </Button>
          <Button
            variant={activeTab === 'completed' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('completed')}
            sx={{
              backgroundColor: activeTab === 'completed' ? '#114417DB' : 'transparent',
              color: activeTab === 'completed' ? 'white' : '#114417DB',
              borderColor: '#114417DB',
              '&:hover': {
                backgroundColor: activeTab === 'completed' ? '#0a2f0e' : '#f3f4f6',
                borderColor: '#114417DB',
              },
            }}
          >
            Completed
          </Button>
        </Box>
      </Box>

      {activeTab === 'all' &&
        renderSessionsGrid(
          sortedSessions,
          'Your assigned sessions will appear here once published by the HR team.',
          (session) => (session.completed ? renderCompletedCard(session) : renderInProgressCard(session))
        )}

      {activeTab === 'in-progress' &&
        renderSessionsGrid(
          inProgressSessions,
          'You have no sessions in progress right now.',
          renderInProgressCard
        )}

      {activeTab === 'completed' &&
        renderSessionsGrid(
          completedSessionsList,
          'You have not completed any sessions yet. Keep learning!',
          renderCompletedCard
        )}
    </Box>
  );
};

export default MyCourses;

