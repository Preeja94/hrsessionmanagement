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

const CourseRatingFeedback = ({ session, onSubmit, onBack, backLabel = 'Back to Certificate' }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [valuableAspect, setValuableAspect] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please provide a rating');
      return;
    }

    const feedbackData = {
      rating,
      feedback,
      valuableAspect,
      difficulty,
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
      {/* Header */}
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mb: 2 }}
        >
          {backLabel}
        </Button>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Session Rating & Feedback
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Help us improve by sharing your experience
        </Typography>
      </Box>

      <Card sx={{ p: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          How would you rate this session?
        </Typography>
        
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Rating
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            size="large"
            icon={<StarIcon fontSize="inherit" />}
          />
          <Typography variant="h6" fontWeight="bold" color="primary">
            {getRatingText(rating)}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>What was most valuable about this session?</InputLabel>
              <Select
                value={valuableAspect}
                onChange={(e) => setValuableAspect(e.target.value)}
                label="What was most valuable about this session?"
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
                onChange={(e) => setDifficulty(e.target.value)}
                label="How would you rate the difficulty level?"
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
          onChange={(e) => setFeedback(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
          placeholder="Share any additional thoughts, suggestions, or comments about this session..."
          helperText="Your feedback helps us improve the learning experience for everyone"
        />

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            variant="outlined"
            onClick={onBack}
          >
            Skip Feedback
          </Button>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSubmit}
            sx={{ 
              backgroundColor: '#10b981', 
              '&:hover': { backgroundColor: '#059669' },
              px: 4
            }}
          >
            Submit Feedback
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default CourseRatingFeedback;

