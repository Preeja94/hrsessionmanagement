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

const SessionDetail = ({ session, onBack, onGetStarted }) => {
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
          Back to Courses
        </Button>
      </Box>
    );
  }

  const sessionContent = [
    { type: 'video', title: 'Introduction to Mental Health', duration: '15 min', completed: true },
    { type: 'presentation', title: 'Stress Management Techniques', duration: '20 min', completed: true },
    { type: 'interactive', title: 'Mindfulness Exercise', duration: '10 min', completed: false },
    { type: 'assessment', title: 'Knowledge Check', duration: '15 min', completed: false }
  ];

  const getContentIcon = (type) => {
    switch (type) {
      case 'video': return <VideoIcon />;
      case 'presentation': return <DescriptionIcon />;
      case 'interactive': return <PlayIcon />;
      case 'assessment': return <QuizIcon />;
      default: return <SchoolIcon />;
    }
  };

  const getContentColor = (type) => {
    switch (type) {
      case 'video': return '#3b82f6';
      case 'presentation': return '#10b981';
      case 'interactive': return '#f59e0b';
      case 'assessment': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const completedContent = sessionContent.filter(item => item.completed).length;
  const totalContent = sessionContent.length;
  const progressPercentage = (completedContent / totalContent) * 100;

  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mb: 2 }}
        >
          Back to My Courses
        </Button>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {session.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {session.description}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Session Information */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Session Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <PersonIcon sx={{ mr: 2, color: '#6b7280' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Instructor
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {session.instructor}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <TimeIcon sx={{ mr: 2, color: '#6b7280' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Duration
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {session.duration}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <SchoolIcon sx={{ mr: 2, color: '#6b7280' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={session.status === 'in-progress' ? 'In Progress' : 'Completed'}
                      sx={{ 
                        backgroundColor: session.status === 'in-progress' ? '#f59e0b' : '#10b981',
                        color: 'white'
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" mb={2}>
                  <TimeIcon sx={{ mr: 2, color: '#6b7280' }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Accessed
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {new Date(session.lastAccessed).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Card>

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
              {completedContent} of {totalContent} sections completed
            </Typography>
          </Card>

          {/* Session Content */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Session Content
            </Typography>
            <List>
              {sessionContent.map((content, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
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
                        <Typography variant="body2" color="text.secondary">
                          {content.duration}
                        </Typography>
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

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Actions
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={() => onGetStarted(session)}
                fullWidth
                sx={{ 
                  backgroundColor: '#10b981', 
                  '&:hover': { backgroundColor: '#059669' },
                  py: 1.5
                }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Download Materials
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{ py: 1.5 }}
              >
                Share Session
              </Button>
            </Box>
          </Card>

          {/* Session Tags */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tags
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {session.tags && session.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SessionDetail;

