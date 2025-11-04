import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Grid
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayIcon,
  Description as DescriptionIcon,
  Quiz as QuizIcon
} from '@mui/icons-material';
import KnowledgeAssessment from './KnowledgeAssessment';
import CertificateOfCompletion from './CertificateOfCompletion';
import CourseRatingFeedback from './CourseRatingFeedback';

const SessionContentView = ({ session, onComplete }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentView, setCurrentView] = useState('content'); // 'content', 'assessment', 'certificate', 'feedback'
  const [isCompleted, setIsCompleted] = useState(false);

  // Sample session content
  const sessionContent = [
    {
      id: 1,
      type: 'video',
      title: 'Introduction to Mental Health',
      duration: '15 min',
      content: 'This video covers the fundamentals of mental health in the workplace...',
      completed: true
    },
    {
      id: 2,
      type: 'presentation',
      title: 'Stress Management Techniques',
      duration: '20 min',
      content: 'Learn effective strategies for managing stress and maintaining work-life balance...',
      completed: true
    },
    {
      id: 3,
      type: 'interactive',
      title: 'Mindfulness Exercise',
      duration: '10 min',
      content: 'Practice mindfulness techniques to improve focus and reduce anxiety...',
      completed: false
    },
    {
      id: 4,
      type: 'assessment',
      title: 'Knowledge Check',
      duration: '15 min',
      content: 'Test your understanding of the material covered in this session...',
      completed: false
    }
  ];

  const totalPages = sessionContent.length;
  const progress = ((currentPage + 1) / totalPages) * 100;

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      // Last page reached, show assessment
      setCurrentView('assessment');
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleMarkAsDone = () => {
    setCurrentView('assessment');
  };

  const handleAssessmentComplete = (score) => {
    setCurrentView('certificate');
  };

  const handleCertificateNext = () => {
    setCurrentView('feedback');
  };

  const handleFeedbackSubmit = (feedback) => {
    setIsCompleted(true);
    onComplete(session);
  };

  const getContentIcon = (type) => {
    switch (type) {
      case 'video': return <PlayIcon />;
      case 'presentation': return <DescriptionIcon />;
      case 'interactive': return <PlayIcon />;
      case 'assessment': return <QuizIcon />;
      default: return <PlayIcon />;
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

  if (currentView === 'assessment') {
    return (
      <KnowledgeAssessment
        session={session}
        onComplete={handleAssessmentComplete}
        onBack={() => setCurrentView('content')}
      />
    );
  }

  if (currentView === 'certificate') {
    return (
      <CertificateOfCompletion
        session={session}
        onNext={handleCertificateNext}
        onBack={() => setCurrentView('assessment')}
      />
    );
  }

  if (currentView === 'feedback') {
    return (
      <CourseRatingFeedback
        session={session}
        onSubmit={handleFeedbackSubmit}
        onBack={() => setCurrentView('certificate')}
      />
    );
  }

  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {session.title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Interactive Learning Content
        </Typography>
      </Box>

      {/* Progress */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" fontWeight="medium">
            Progress: {currentPage + 1} of {totalPages}
          </Typography>
          <Typography variant="body2" fontWeight="bold">
            {Math.round(progress)}%
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {/* Content Steps */}
      <Box mb={4}>
        <Stepper activeStep={currentPage} alternativeLabel>
          {sessionContent.map((content, index) => (
            <Step key={content.id}>
              <StepLabel>
                <Box display="flex" alignItems="center" gap={1}>
                  {getContentIcon(content.type)}
                  <Typography variant="body2">
                    {content.title}
                  </Typography>
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Current Content */}
      <Card sx={{ p: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: getContentColor(sessionContent[currentPage].type),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              mr: 2
            }}
          >
            {getContentIcon(sessionContent[currentPage].type)}
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {sessionContent[currentPage].title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {sessionContent[currentPage].duration}
            </Typography>
          </Box>
        </Box>

        <Box mb={3}>
          <Typography variant="body1" paragraph>
            {sessionContent[currentPage].content}
          </Typography>
        </Box>

        {/* Content Placeholder */}
        <Box
          sx={{
            height: 300,
            backgroundColor: '#f8f9fa',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed #d1d5db',
            mb: 3
          }}
        >
          <Box textAlign="center">
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {sessionContent[currentPage].type === 'video' && 'Video Player'}
              {sessionContent[currentPage].type === 'presentation' && 'Presentation Viewer'}
              {sessionContent[currentPage].type === 'interactive' && 'Interactive Content'}
              {sessionContent[currentPage].type === 'assessment' && 'Assessment Tool'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Content would be displayed here
            </Typography>
          </Box>
        </Box>

        {/* Navigation */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handlePrevious}
            disabled={currentPage === 0}
          >
            Previous
          </Button>

          <Box display="flex" gap={2}>
            {currentPage === totalPages - 1 ? (
              <Button
                variant="contained"
                startIcon={<CheckCircleIcon />}
                onClick={handleMarkAsDone}
                sx={{ 
                  backgroundColor: '#10b981', 
                  '&:hover': { backgroundColor: '#059669' }
                }}
              >
                Mark as Done
              </Button>
            ) : (
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleNext}
                sx={{ 
                  backgroundColor: '#3b82f6', 
                  '&:hover': { backgroundColor: '#2563eb' }
                }}
              >
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Card>

      {/* Session Info */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Session Information
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2">
                <strong>Instructor:</strong> {session.instructor}
              </Typography>
              <Typography variant="body2">
                <strong>Duration:</strong> {session.duration}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong> In Progress
              </Typography>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Learning Objectives
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2">
                • Understand mental health fundamentals
              </Typography>
              <Typography variant="body2">
                • Learn stress management techniques
              </Typography>
              <Typography variant="body2">
                • Practice mindfulness exercises
              </Typography>
              <Typography variant="body2">
                • Apply knowledge in assessments
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SessionContentView;

