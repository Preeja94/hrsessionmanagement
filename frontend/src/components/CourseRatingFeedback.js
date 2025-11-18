import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Grid
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Star as StarIcon,
  Send as SendIcon
} from '@mui/icons-material';

const CourseRatingFeedback = ({ session, onSubmit, onBack, backLabel = 'Back to Certificate', isViewOnly = false }) => {
  const [rating, setRating] = useState(session?.feedback?.rating || 0);
  const [feedback, setFeedback] = useState(session?.feedback?.feedback || '');
  const [valuableAspect, setValuableAspect] = useState(session?.feedback?.valuableAspect || '');
  const [difficulty, setDifficulty] = useState(session?.feedback?.difficulty || '');
  
  // If view-only, disable all inputs
  React.useEffect(() => {
    if (isViewOnly && session?.feedback) {
      setRating(session.feedback.rating || 0);
      setFeedback(session.feedback.feedback || '');
      setValuableAspect(session.feedback.valuableAspect || '');
      setDifficulty(session.feedback.difficulty || '');
    }
  }, [isViewOnly, session]);

  const handleSubmit = () => {
    const feedbackData = {
      rating: rating || 0,
      feedback,
      valuableAspect,
      difficulty,
      sessionId: session.id,
      sessionTitle: session.title
    };

    onSubmit(feedbackData);
  };

  const handleSkip = () => {
    // Skip feedback - still submit with empty data to complete session
    const feedbackData = {
      rating: 0,
      feedback: '',
      valuableAspect: '',
      difficulty: '',
      sessionId: session.id,
      sessionTitle: session.title
    };

    onSubmit(feedbackData);
  };

  const getRatingText = (value) => {
    switch (value) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  return (
    <Box p={3}>
      {/* Header with Back Button */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="flex-start">
        {onBack && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ color: '#114417DB', '&:hover': { backgroundColor: '#f0fdf4' } }}
          >
            {backLabel}
          </Button>
        )}
        <Box flex={1} />
      </Box>

      <Card sx={{ p: 4, backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#1f2937' }}>
          How would you rate this session?
        </Typography>
        
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Rating
            value={rating}
            onChange={(event, newValue) => !isViewOnly && setRating(newValue)}
            size="large"
            icon={<StarIcon fontSize="inherit" />}
            readOnly={isViewOnly}
          />
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#114417DB' }}>
            {getRatingText(rating)}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>What was most valuable about this session?</InputLabel>
              <Select
                value={valuableAspect}
                onChange={(e) => !isViewOnly && setValuableAspect(e.target.value)}
                label="What was most valuable about this session?"
                disabled={isViewOnly}
              >
                <MenuItem value="content">Session Content</MenuItem>
                <MenuItem value="instructor">Instructor Quality</MenuItem>
                <MenuItem value="interactive">Interactive Elements</MenuItem>
                <MenuItem value="practical">Practical Applications</MenuItem>
                <MenuItem value="assessment">Assessment Quality</MenuItem>
                <MenuItem value="materials">Learning Materials</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>How would you rate the difficulty level?</InputLabel>
              <Select
                value={difficulty}
                onChange={(e) => !isViewOnly && setDifficulty(e.target.value)}
                label="How would you rate the difficulty level?"
                disabled={isViewOnly}
              >
                <MenuItem value="too-easy">Too Easy</MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="just-right">Just Right</MenuItem>
                <MenuItem value="challenging">Challenging</MenuItem>
                <MenuItem value="too-difficult">Too Difficult</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <TextField
          label="Additional Feedback"
          value={feedback}
          onChange={(e) => !isViewOnly && setFeedback(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          placeholder="Share any additional thoughts, suggestions, or comments about this session..."
          helperText="Your feedback helps us improve the learning experience for everyone"
          disabled={isViewOnly}
        />

        {!isViewOnly && (
          <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={4}>
            <Button
              variant="outlined"
              onClick={handleSkip}
              sx={{ 
                color: '#6b7280',
                borderColor: '#e5e7eb',
                '&:hover': { borderColor: '#d1d5db', backgroundColor: '#f9fafb' }
              }}
            >
              Skip Feedback
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<SendIcon />}
              onClick={handleSubmit}
              sx={{ 
                backgroundColor: '#114417DB', 
                '&:hover': { backgroundColor: '#0a2f0e' },
                px: 4,
                py: 1.5
              }}
            >
              Submit Feedback
            </Button>
          </Box>
        )}
      </Card>
    </Box>
  );
};

export default CourseRatingFeedback;

