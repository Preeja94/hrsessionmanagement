import React, { useState } from 'react';
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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';

const MyCourses = ({ completedSessions, onSessionComplete, onSessionStart, onSessionClick }) => {
  const [activeTab, setActiveTab] = useState('in-progress');

  // Sample course data
  const allCourses = [
    {
      id: 1,
      title: 'Mental Health & Wellbeing',
      instructor: 'Dr. Sarah Johnson',
      description: 'Comprehensive session on maintaining mental wellness in the workplace',
      duration: '60 minutes',
      progress: 45,
      status: 'in-progress',
      dateStarted: '2024-12-20',
      lastAccessed: '2024-12-24',
      tags: ['Wellbeing', 'Mental Health', 'Workplace'],
      content: [
        { type: 'video', title: 'Introduction to Mental Health', duration: '15 min' },
        { type: 'presentation', title: 'Stress Management Techniques', duration: '20 min' },
        { type: 'interactive', title: 'Mindfulness Exercise', duration: '10 min' },
        { type: 'assessment', title: 'Knowledge Check', duration: '15 min' }
      ]
    },
    {
      id: 2,
      title: 'JavaScript ES6+ Mastery',
      instructor: 'Mike Wilson',
      description: 'Learn modern JavaScript features and best practices',
      duration: '90 minutes',
      progress: 100,
      status: 'completed',
      dateCompleted: '2024-12-22',
      timeTaken: '85 minutes',
      score: 92,
      certificate: true,
      tags: ['Programming', 'JavaScript', 'ES6'],
      content: [
        { type: 'video', title: 'ES6 Introduction', duration: '20 min' },
        { type: 'presentation', title: 'Arrow Functions', duration: '15 min' },
        { type: 'interactive', title: 'Destructuring Exercise', duration: '25 min' },
        { type: 'assessment', title: 'Final Quiz', duration: '30 min' }
      ]
    }
  ];

  const inProgressCourses = allCourses.filter(course => course.status === 'in-progress');
  const completedCourses = allCourses.filter(course => course.status === 'completed');

  const handleSessionClick = (course) => {
    onSessionClick(course);
  };

  const handleSessionComplete = (courseId) => {
    onSessionComplete(courseId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-progress': return '#f59e0b';
      case 'completed': return '#10b981';
      case 'not-started': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'not-started': return 'Not Started';
      default: return 'Unknown';
    }
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Hi Luke, It's a good day to start something new
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Continue your learning journey and track your progress
        </Typography>
      </Box>

      {/* Tab Navigation */}
      <Box mb={4}>
        <Box display="flex" gap={1}>
          <Button
            variant={activeTab === 'in-progress' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('in-progress')}
            sx={{
              backgroundColor: activeTab === 'in-progress' ? '#3b82f6' : 'transparent',
              color: activeTab === 'in-progress' ? 'white' : '#3b82f6',
              '&:hover': {
                backgroundColor: activeTab === 'in-progress' ? '#2563eb' : '#f3f4f6',
              },
            }}
          >
            In Progress Courses
          </Button>
          <Button
            variant={activeTab === 'completed' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('completed')}
            sx={{
              backgroundColor: activeTab === 'completed' ? '#3b82f6' : 'transparent',
              color: activeTab === 'completed' ? 'white' : '#3b82f6',
              '&:hover': {
                backgroundColor: activeTab === 'completed' ? '#2563eb' : '#f3f4f6',
              },
            }}
          >
            Completed Courses
          </Button>
        </Box>
      </Box>

      {/* Back to My Courses indicator */}
      <Box mb={3}>
        <Button
          startIcon={<ArrowIcon />}
          onClick={() => setActiveTab('in-progress')}
          sx={{ color: '#3b82f6' }}
        >
          Back to My Courses
        </Button>
      </Box>

      {/* In Progress Courses */}
      {activeTab === 'in-progress' && (
        <Grid container spacing={3}>
          {inProgressCourses.map((course) => (
            <Grid item xs={12} md={6} key={course.id}>
              <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {course.title}
                    </Typography>
                    <Chip
                      label={getStatusLabel(course.status)}
                      sx={{ backgroundColor: getStatusColor(course.status), color: 'white' }}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {course.description}
                  </Typography>

                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Created by {course.instructor}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Started on {new Date(course.dateStarted).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2" fontWeight="medium">
                        Progress
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {course.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={course.progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Box display="flex" gap={1} mb={2}>
                    {course.tags && course.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                  </Box>

                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      startIcon={<PlayIcon />}
                      onClick={() => handleSessionClick(course)}
                      sx={{ 
                        backgroundColor: '#10b981', 
                        '&:hover': { backgroundColor: '#059669' },
                        flex: 1
                      }}
                    >
                      Continue
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleSessionComplete(course.id)}
                      sx={{ flex: 1 }}
                    >
                      Mark Complete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Completed Courses */}
      {activeTab === 'completed' && (
        <Grid container spacing={3}>
          {completedCourses.map((course) => (
            <Grid item xs={12} md={6} key={course.id}>
              <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {course.title}
                    </Typography>
                    <Chip
                      label={getStatusLabel(course.status)}
                      sx={{ backgroundColor: getStatusColor(course.status), color: 'white' }}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {course.description}
                  </Typography>

                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ width: 32, height: 32, mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Created by {course.instructor}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Completed on {new Date(course.dateCompleted).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box mb={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <TimeIcon sx={{ mr: 1, fontSize: 16, color: '#6b7280' }} />
                          <Typography variant="body2" color="text.secondary">
                            Time Taken: {course.timeTaken}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box display="flex" alignItems="center" mb={1}>
                          <StarIcon sx={{ mr: 1, fontSize: 16, color: '#f59e0b' }} />
                          <Typography variant="body2" color="text.secondary">
                            Score: {course.score}%
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  <Box display="flex" gap={1} mb={2}>
                    {course.tags && course.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.75rem' }}
                      />
                    ))}
                  </Box>

                  <Box display="flex" gap={1}>
                    <Button
                      variant="outlined"
                      startIcon={<PlayIcon />}
                      onClick={() => handleSessionClick(course)}
                      sx={{ flex: 1 }}
                    >
                      Review
                    </Button>
                    {course.certificate && (
                      <Button
                        variant="contained"
                        startIcon={<CheckCircleIcon />}
                        sx={{ 
                          backgroundColor: '#10b981', 
                          '&:hover': { backgroundColor: '#059669' },
                          flex: 1
                        }}
                      >
                        Certificate
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Empty State */}
      {activeTab === 'in-progress' && inProgressCourses.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No courses in progress
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start a new course from the Course Library
          </Typography>
        </Box>
      )}

      {activeTab === 'completed' && completedCourses.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No completed courses yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Complete your in-progress courses to see them here
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MyCourses;

