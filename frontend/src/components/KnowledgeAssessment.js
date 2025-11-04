import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  LinearProgress,
  Grid,
  Chip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Quiz as QuizIcon
} from '@mui/icons-material';

const KnowledgeAssessment = ({ session, onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      id: 1,
      question: "What is the primary purpose of mental health awareness in the workplace?",
      options: [
        "To increase productivity at all costs",
        "To create a supportive environment for employee wellbeing",
        "To reduce healthcare costs",
        "To eliminate stress completely"
      ],
      correct: 1
    },
    {
      id: 2,
      question: "Which of the following is NOT a recommended stress management technique?",
      options: [
        "Regular exercise",
        "Mindfulness meditation",
        "Working longer hours without breaks",
        "Deep breathing exercises"
      ],
      correct: 2
    },
    {
      id: 3,
      question: "What percentage of adults experience workplace stress according to recent studies?",
      options: [
        "25%",
        "50%",
        "75%",
        "90%"
      ],
      correct: 2
    },
    {
      id: 4,
      question: "Which mindfulness technique involves focusing on your breath?",
      options: [
        "Body scan",
        "Breathing meditation",
        "Walking meditation",
        "All of the above"
      ],
      correct: 3
    },
    {
      id: 5,
      question: "What is the recommended approach to handling workplace conflicts?",
      options: [
        "Avoiding the situation",
        "Addressing issues directly and constructively",
        "Complaining to others",
        "Ignoring the problem"
      ],
      correct: 1
    }
  ];

  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correct) {
        correct++;
      }
    });
    return Math.round((correct / totalQuestions) * 100);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return "Excellent! You have a strong understanding of the material.";
    if (score >= 60) return "Good job! You understand most of the concepts.";
    return "Keep studying! Review the material and try again.";
  };

  if (!quizStarted) {
    return (
      <Box p={3}>
        <Box mb={4}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ mb: 2 }}
          >
            Back to Session
          </Button>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Knowledge Assessment
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Test your understanding of the material covered in this session
          </Typography>
        </Box>

        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Box display="flex" justifyContent="center" mb={3}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <QuizIcon sx={{ fontSize: 40 }} />
            </Box>
          </Box>
          
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Ready to Test Your Knowledge?
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            This assessment contains {totalQuestions} questions about mental health and wellbeing in the workplace.
          </Typography>
          
          <Box mb={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Assessment Details:
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <Typography variant="body2">
                • {totalQuestions} multiple choice questions
              </Typography>
              <Typography variant="body2">
                • Estimated time: 10-15 minutes
              </Typography>
              <Typography variant="body2">
                • Passing score: 60%
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={handleStartQuiz}
            sx={{ 
              backgroundColor: '#3b82f6', 
              '&:hover': { backgroundColor: '#2563eb' },
              px: 4,
              py: 1.5
            }}
          >
            Get Started
          </Button>
        </Card>
      </Box>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const correctAnswers = Object.values(answers).filter((answer, index) => 
      answer === questions[index].correct
    ).length;

    return (
      <Box p={3}>
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Assessment Results
          </Typography>
        </Box>

        <Card sx={{ p: 4, textAlign: 'center', backgroundColor: '#f0f9ff' }}>
          <Box display="flex" justifyContent="center" mb={3}>
            <Box
              sx={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: getScoreColor(score),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <Typography variant="h3" fontWeight="bold">
                {score}%
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#059669' }}>
            WOOHOO, CONGRATS!
          </Typography>
          
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            You scored {score}% on this assessment
          </Typography>
          
          <Typography variant="body1" color="text.secondary" mb={3}>
            {getScoreMessage(score)}
          </Typography>

          <Grid container spacing={3} mb={4}>
            <Grid item xs={6}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight="bold" color="#10b981">
                  {correctAnswers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Correct Answers
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight="bold" color="#ef4444">
                  {totalQuestions - correctAnswers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Incorrect Answers
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Button
            variant="contained"
            size="large"
            startIcon={<CheckCircleIcon />}
            onClick={() => onComplete(score)}
            sx={{ 
              backgroundColor: '#10b981', 
              '&:hover': { backgroundColor: '#059669' },
              px: 4,
              py: 1.5
            }}
          >
            Get Certificate
          </Button>
        </Card>
      </Box>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={4}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mb: 2 }}
        >
          Back to Session
        </Button>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Knowledge Assessment
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Question {currentQuestion + 1} of {totalQuestions}
        </Typography>
      </Box>

      {/* Progress */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" fontWeight="medium">
            Progress
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

      {/* Question */}
      <Card sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          {currentQ.question}
        </Typography>

        <FormControl component="fieldset" sx={{ mt: 2 }}>
          <RadioGroup
            value={answers[currentQ.id] || ''}
            onChange={(e) => handleAnswerChange(currentQ.id, parseInt(e.target.value))}
          >
            {currentQ.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={index}
                control={<Radio />}
                label={option}
                sx={{ mb: 1 }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Card>

      {/* Navigation */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>

        <Box display="flex" gap={2}>
          <Typography variant="body2" color="text.secondary">
            {currentQuestion + 1} of {totalQuestions}
          </Typography>
          <Button
            variant="contained"
            endIcon={currentQuestion === totalQuestions - 1 ? <CheckCircleIcon /> : <ArrowForwardIcon />}
            onClick={handleNext}
            disabled={!answers[currentQ.id] && answers[currentQ.id] !== 0}
            sx={{ 
              backgroundColor: '#3b82f6', 
              '&:hover': { backgroundColor: '#2563eb' }
            }}
          >
            {currentQuestion === totalQuestions - 1 ? 'Submit' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default KnowledgeAssessment;

