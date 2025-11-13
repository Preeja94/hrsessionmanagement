import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  LinearProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  School as SchoolIcon,
  VideoLibrary as VideoIcon,
  Description as DescriptionIcon,
  Quiz as QuizIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { buildSessionContentItems } from '../utils/sessionContent';

const SessionDetail = ({ session, onBack, onGetStarted }) => {
  const contentItems = useMemo(
    () => buildSessionContentItems(session),
    [session]
  );

  if (!session) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h6" color="text.secondary">
          No session selected
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mt: 2 }}
        >
          Back to Sessions
        </Button>
      </Box>
    );
  }

  const getContentIcon = (type) => {
    switch (type) {
      case 'video': return <VideoIcon />;
      case 'presentation': return <DescriptionIcon />;
      case 'document': return <DescriptionIcon />;
      case 'file': return <DescriptionIcon />;
      case 'ai': return <SchoolIcon />;
      case 'interactive': return <PlayIcon />;
      case 'assessment': return <QuizIcon />;
      default: return <SchoolIcon />;
    }
  };

  const getContentColor = (type) => {
    switch (type) {
      case 'video': return '#3b82f6';
      case 'presentation': return '#10b981';
      case 'document': return '#6366f1';
      case 'file': return '#3b82f6';
      case 'ai': return '#8b5cf6';
      case 'interactive': return '#f59e0b';
      case 'assessment': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const totalContent = contentItems.length;
  const progressPercentage = (() => {
    if (typeof session.progress === 'number') {
      return Math.min(100, Math.max(0, session.progress));
    }
    return session.completed ? 100 : 0;
  })();
  const completedContent = session.completed
    ? totalContent
    : Math.min(totalContent, Math.round((progressPercentage / 100) * totalContent));
  const lastAccessedValue =
    session.lastAccessed ||
    session.updatedAt ||
    session.scheduledDateTime ||
    session.dueDateTime ||
    session.createdAt ||
    null;
  const lastAccessedLabel = lastAccessedValue
    ? new Date(lastAccessedValue).toLocaleString()
    : 'Not available';
  const statusColorMap = {
    completed: '#10b981',
    'in-progress': '#f59e0b',
    scheduled: '#3b82f6',
    published: '#6366f1',
    locked: '#ef4444',
  };
  const normalizedStatus = session.status ? session.status.toLowerCase() : 'draft';
  const statusLabel = normalizedStatus
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const statusColor = statusColorMap[normalizedStatus] || '#6366f1';
  const hasDownloadableMaterials = contentItems.some(item => item.downloadable);

  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {session.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          {session.description}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
        >
          Back to My Sessions
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Session Information
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={4}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Instructor
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {session.instructor || 'HR Team'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {session.duration || 'Self-paced'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={statusLabel}
                  sx={{
                    textTransform: 'capitalize',
                    backgroundColor: statusColor,
                    color: 'white'
                  }}
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Last Accessed
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {lastAccessedLabel}
                </Typography>
              </Box>
            </Box>
          </Card>

          <Box display="flex" gap={2} mb={3}>
            <Button
              variant="contained"
              startIcon={<PlayIcon />}
              onClick={() => onGetStarted(session)}
              sx={{ 
                backgroundColor: '#10b981', 
                '&:hover': { backgroundColor: '#059669' },
                py: 1.5,
                px: 3
              }}
            >
              {session.status === 'in-progress' ? 'Resume Session' : 'Start Session'}
            </Button>
            {hasDownloadableMaterials && (
              <Button
                variant="outlined"
                sx={{ py: 1.5, px: 3 }}
              >
                Download Materials
              </Button>
            )}
          </Box>

          {/* Progress */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Progress
            </Typography>
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" fontWeight="medium">
                  Overall Progress
                </Typography>
                <Typography variant="body2" fontWeight="bold">
                  {Math.round(progressPercentage)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progressPercentage}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              {totalContent > 0
                ? `${completedContent} of ${totalContent} sections completed`
                : 'Session progress will appear once content is added'}
            </Typography>
          </Card>

          {/* Session Content */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Session Content
            </Typography>
            <List>
              {contentItems.map((content) => (
                <ListItem key={content.id} sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: content.completed ? '#10b981' : '#f3f4f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: content.completed ? 'white' : getContentColor(content.type)
                      }}
                    >
                      {content.completed ? <CheckCircleIcon /> : getContentIcon(content.type)}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={content.title}
                    secondary={
                      <Box>
                        {content.description && (
                          <Typography variant="body2" color="text.secondary">
                            {content.description}
                          </Typography>
                        )}
                        {content.meta && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            {content.meta}
                          </Typography>
                        )}
                        {content.completed && (
                          <Chip
                            label="Completed"
                            size="small"
                            sx={{ backgroundColor: '#10b981', color: 'white', mt: 0.5 }}
                          />
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SessionDetail;

