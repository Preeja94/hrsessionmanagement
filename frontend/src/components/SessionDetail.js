import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  School as SchoolIcon,
  VideoLibrary as VideoIcon,
  Description as DescriptionIcon,
  Quiz as QuizIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { buildSessionContentItems } from '../utils/sessionContent';
import CourseRatingFeedback from './CourseRatingFeedback';

const SessionDetail = ({ session, onBack, onGetStarted, onFeedbackSubmit, isCompleted = false, backLabel }) => {
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

  const downloadItems = contentItems.filter(item => item.downloadable);
  const assessmentItem = contentItems.find(item => item.type === 'assessment');
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
  const hasDownloadableMaterials = downloadItems.length > 0;

  const getContentUrl = (content) => {
    if (!content) return null;
    return (
      content.dataUrl ||
      content.downloadUrl ||
      content.url ||
      content.link ||
      content.assetUrl ||
      content.path ||
      null
    );
  };

  return (
    <Box p={3} maxWidth="960px" sx={{ mx: '10px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* Back to My Sessions */}
          {onBack && (
            <Box mb={2}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={onBack}
                sx={{
                  color: '#114417DB',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#f0fdf4' }
                }}
              >
                {backLabel || 'Back'}
              </Button>
            </Box>
          )}

          <Card sx={{ p: 2, mb: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
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
                  Type
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {session.type || 'General'}
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
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Due Date &amp; Time
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {session.dueDateTime
                    ? new Date(session.dueDateTime).toLocaleString()
                    : session.dueDate && session.dueTime
                    ? `${new Date(session.dueDate).toLocaleDateString()} ${session.dueTime}`
                    : 'Not set'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Key Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                  {session.skills && session.skills.length > 0 ? (
                    session.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        sx={{ backgroundColor: '#e8f5e9', color: '#166534' }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No skills specified
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Card>

          {/* Session Content (only after completion) */}
          {isCompleted && (
            <Card sx={{ p: 2, mt: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Session Content
              </Typography>
              {downloadItems.length === 0 && !assessmentItem ? (
                <Typography variant="body2" color="text.secondary">
                  No downloadable content available for this session.
                </Typography>
              ) : (
                <List>
                  {downloadItems.map((content) => {
                    const url = getContentUrl(content);
                    return (
                      <ListItem key={content.id} sx={{ px: 0 }}>
                        <ListItemText
                          primary={content.title}
                          secondary={content.description}
                        />
                        {url && (
                          <Button
                            variant="outlined"
                            component="a"
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{ ml: 2 }}
                          >
                            Download
                          </Button>
                        )}
                      </ListItem>
                    );
                  })}

                  {assessmentItem && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={assessmentItem.title || 'Assessment'}
                        secondary="Assessment attached to this session"
                      />
                    </ListItem>
                  )}
                </List>
              )}
            </Card>
          )}

          {/* Start Session Button (hidden after completion) */}
          {!isCompleted && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={() => onGetStarted(session)}
                sx={{ 
                  backgroundColor: '#10b981', 
                  '&:hover': { backgroundColor: '#059669' },
                  py: 1.5,
                  px: 4
                }}
              >
                {session.status === 'in-progress' ? 'Resume Session' : 'Start Session'}
              </Button>
            </Box>
          )}

          {/* Feedback Section */}
          <Box mt={0}>
            <CourseRatingFeedback
              session={session}
              onSubmit={onFeedbackSubmit}
              isViewOnly={false}
              sectionTitle="Session Feedback"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SessionDetail;

