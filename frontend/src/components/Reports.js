import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';

const Reports = ({ completedSessions, certificatesEarned, totalSessionsAttended, completionRate }) => {
  // Learning Analytics Data
  const learningAnalytics = [
    {
      label: 'Total Sessions Completed',
      value: completedSessions,
      icon: <CheckCircleIcon />,
      color: '#10b981'
    },
    {
      label: 'Learning Hours',
      value: completedSessions * 1.5, // Assuming 1.5 hours per session
      icon: <TimeIcon />,
      color: '#3b82f6'
    },
    {
      label: 'Average Score',
      value: '87%',
      icon: <AssessmentIcon />,
      color: '#f59e0b'
    },
    {
      label: 'Certificates Earned',
      value: certificatesEarned,
      icon: <StarIcon />,
      color: '#ef4444'
    }
  ];

  // Learning Goals Progress
  const learningGoals = [
    {
      category: 'Wellbeing',
      progress: Math.min(100, (completedSessions / 2) * 100), // 2 sessions for 100%
      target: 2,
      completed: Math.min(completedSessions, 2),
      color: '#10b981'
    },
    {
      category: 'Technology',
      progress: Math.min(100, (completedSessions / 3) * 100), // 3 sessions for 100%
      target: 3,
      completed: Math.min(completedSessions, 3),
      color: '#3b82f6'
    }
  ];

  // Recent Achievements
  const recentAchievements = [
    {
      id: 1,
      title: 'First Certificate Earned',
      description: 'Completed JavaScript ES6+ Mastery course',
      date: '2024-12-22',
      icon: <StarIcon />
    },
    {
      id: 2,
      title: 'Learning Streak',
      description: 'Completed 2 sessions in a week',
      date: '2024-12-20',
      icon: <TrendingUpIcon />
    },
    {
      id: 3,
      title: 'Skill Development',
      description: 'Started Mental Health & Wellbeing course',
      date: '2024-12-18',
      icon: <SchoolIcon />
    }
  ];

  // Performance Trends
  const performanceTrends = [
    { month: 'Oct', sessions: 0, score: 0 },
    { month: 'Nov', sessions: 1, score: 85 },
    { month: 'Dec', sessions: 2, score: 87 }
  ];

  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Learning Reports
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your learning progress and achievements
        </Typography>
      </Box>

      {/* Learning Analytics */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Your Learning Analytics
        </Typography>
        <Grid container spacing={3}>
          {learningAnalytics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Box display="flex" justifyContent="center" mb={2}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      backgroundColor: metric.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    {metric.icon}
                  </Box>
                </Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {metric.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {metric.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {/* Learning Goals Progress */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Learning Goal Progress
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Track your progress towards learning goals
            </Typography>
            
            {learningGoals.map((goal, index) => (
              <Box key={index} mb={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2" fontWeight="medium">
                    {goal.category}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {goal.completed}/{goal.target} sessions
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={goal.progress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e5e7eb',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: goal.color,
                    },
                  }}
                />
                <Typography variant="caption" color="text.secondary" mt={1}>
                  {Math.round(goal.progress)}% complete
                </Typography>
              </Box>
            ))}
          </Card>
        </Grid>

        {/* Recent Achievements */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Recent Achievements
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Your latest learning milestones
            </Typography>
            
            <List>
              {recentAchievements.map((achievement, index) => (
                <React.Fragment key={achievement.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          backgroundColor: '#f3f4f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#6b7280'
                        }}
                      >
                        {achievement.icon}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={achievement.title}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {achievement.description}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(achievement.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < recentAchievements.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Card>
        </Grid>

        {/* Performance Trends */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Performance Trends
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Your learning progress over time
            </Typography>
            
            <Grid container spacing={3}>
              {performanceTrends.map((trend, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Box textAlign="center" p={2}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {trend.month}
                    </Typography>
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Sessions Completed
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="#3b82f6">
                        {trend.sessions}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Average Score
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color="#10b981">
                        {trend.score}%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;

