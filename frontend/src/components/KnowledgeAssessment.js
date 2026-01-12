import React, { useState, useEffect } from 'react';
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
  Chip,
  Checkbox,
  FormGroup,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Quiz as QuizIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { sessionCompletionAPI } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

const KnowledgeAssessment = ({ session, onComplete, onBack, isViewOnly = false }) => {
  const { getUserId } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizStarted, setQuizStarted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [previousAttempts, setPreviousAttempts] = useState([]);
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  
  // Load previous attempts when component mounts
  useEffect(() => {
    const loadPreviousAttempts = async () => {
      if (!session?.id || isViewOnly) return;
      
      try {
        const userId = getUserId();
        if (!userId) return;
        
        const completions = await sessionCompletionAPI.getAll(userId, session.id);
        if (completions && Array.isArray(completions)) {
          setPreviousAttempts(completions);
          setAttemptsUsed(completions.length);
          
          // Find the latest attempt
          const latest = completions.sort((a, b) => 
            new Date(b.completed_at) - new Date(a.completed_at)
          )[0];
          if (latest) {
            setCurrentAttempt(latest);
          }
        }
      } catch (error) {
        console.error('Failed to load previous attempts:', error);
      }
    };
    
    loadPreviousAttempts();
  }, [session?.id, isViewOnly, getUserId]);

  // If view-only, show results immediately
  useEffect(() => {
    if (isViewOnly && session?.assessmentResults) {
      setShowResults(true);
      setQuizStarted(true);
      setAnswers(session.assessmentResults.answers || {});
    }
  }, [isViewOnly, session]);

  const defaultQuestions = [
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

  const assessmentInfo = session?.assessmentInfo || {};
  const rawQuestions = session?.quiz?.questions || session?.questions || assessmentInfo?.questions || [];

  const normalizedQuestions = rawQuestions.map((question, index) => {
    const options = question.options || [];

    const normalizeOption = (option) => {
      if (typeof option === 'string') return option;
      if (option?.text) return option.text;
      if (option?.label) return option.label;
      if (option?.value) return option.value;
      return '';
    };

    const normalizedOptions = options.map(normalizeOption);

    const sanitizeIndex = (idx) =>
      idx !== null &&
      idx !== undefined &&
      !Number.isNaN(idx) &&
      idx >= 0 &&
      idx < normalizedOptions.length
        ? idx
        : null;

    let correctIndices = [];
    if (question.correctAnswer !== undefined && question.correctAnswer !== null) {
      if (typeof question.correctAnswer === 'number') {
        const sanitized = sanitizeIndex(question.correctAnswer);
        if (sanitized !== null) {
          correctIndices = [sanitized];
        }
      } else if (typeof question.correctAnswer === 'string') {
        const matchIndex = normalizedOptions.findIndex(
          (option) => option.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
        );
        if (matchIndex !== -1) {
          correctIndices = [matchIndex];
        }
      }
    } else if (question.correct !== undefined) {
      const sanitized = sanitizeIndex(question.correct);
      if (sanitized !== null) {
        correctIndices = [sanitized];
      }
    }

    if (Array.isArray(question.correctAnswers) && question.correctAnswers.length > 0) {
      const sanitizedList = question.correctAnswers
        .map((idx) => sanitizeIndex(idx))
        .filter((idx) => idx !== null);
      if (sanitizedList.length > 0) {
        correctIndices = sanitizedList;
      }
    }

    if (!correctIndices.length && normalizedOptions.some((option) => typeof option === 'object' && option?.isCorrect)) {
      const indices = normalizedOptions
        .map((option, optIndex) => (option?.isCorrect ? optIndex : null))
        .filter((idx) => idx !== null);
      if (indices.length > 0) {
        correctIndices = indices;
      }
    }

    const uniqueCorrectIndices = [...new Set(correctIndices)];

    return {
      id: question.id ?? question.questionId ?? index + 1,
      question: question.text || question.question || `Question ${index + 1}`,
      options: normalizedOptions.length > 0 ? normalizedOptions : ['Option A', 'Option B', 'Option C', 'Option D'],
      correct: uniqueCorrectIndices.length ? uniqueCorrectIndices[0] : null,
      correctAnswers: uniqueCorrectIndices,
      type: question.type || 'multiple-choice'
    };
  });

  const questions = normalizedQuestions.length > 0 ? normalizedQuestions : defaultQuestions;

  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  const isQuestionMultiSelect = (question) =>
    question.type === 'checkbox' || (Array.isArray(question.correctAnswers) && question.correctAnswers.length > 1);

  const questionHasSolution = (question) => {
    if (Array.isArray(question.correctAnswers) && question.correctAnswers.length > 0) return true;
    return question.correct !== null && question.correct !== undefined;
  };

  const isAnswerCorrect = (question, selectedAnswer) => {
    if (!questionHasSolution(question)) return false;

    const expected =
      Array.isArray(question.correctAnswers) && question.correctAnswers.length > 0
        ? question.correctAnswers
        : question.correct !== null && question.correct !== undefined
        ? [question.correct]
        : [];

    if (!expected.length) return false;

    if (isQuestionMultiSelect(question) || expected.length > 1) {
      if (!Array.isArray(selectedAnswer) || selectedAnswer.length === 0) return false;
      const sortedExpected = [...new Set(expected)].sort();
      const sortedSelected = [...new Set(selectedAnswer)].sort();
      if (sortedExpected.length !== sortedSelected.length) return false;
      return sortedExpected.every((value, index) => value === sortedSelected[index]);
    }

    return selectedAnswer === expected[0];
  };

  const handleSingleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleMultiAnswerToggle = (questionId, optionIndex) => {
    setAnswers(prev => {
      const currentForQuestion = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      const exists = currentForQuestion.includes(optionIndex);
      const updated = exists
        ? currentForQuestion.filter((idx) => idx !== optionIndex)
        : [...currentForQuestion, optionIndex];
      return {
        ...prev,
        [questionId]: updated
      };
    });
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
    setAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    setQuizStarted(true);
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    setQuizStarted(true);
    setCurrentAttempt(null);
  };

  const saveScoreToBackend = async (score, passed) => {
    if (!session?.id || isViewOnly) return null;
    
    try {
      setIsSaving(true);
      const userId = getUserId();
      if (!userId) {
        console.error('User ID not found');
        return null;
      }

      // Get questions for feedback calculation
      const evaluableQuestions = questions.filter(questionHasSolution);
      const correctAnswersCount = evaluableQuestions.reduce((count, question) => {
        const selectedAnswer = answers[question.id];
        return isAnswerCorrect(question, selectedAnswer) ? count + 1 : count;
      }, 0);

      const completionData = {
        employee: parseInt(userId),
        session: session.id,
        score: score,
        passed: passed,
        answers: answers, // Store user's answers
        feedback: {
          completedAt: new Date().toISOString(),
          totalQuestions: questions.length,
          correctAnswers: correctAnswersCount
        }
      };

      const saved = await sessionCompletionAPI.create(completionData);
      
      // Update local state
      setPreviousAttempts(prev => [...prev, saved]);
      setAttemptsUsed(prev => prev + 1);
      setCurrentAttempt(saved);
      
      return saved;
    } catch (error) {
      console.error('Failed to save score:', error);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const calculateScore = () => {
    const evaluableQuestions = questions.filter(questionHasSolution);
    // If no questions have correct answers, return null (don't show score)
    if (!evaluableQuestions.length) return null;
    // If only one question and it has no correct answer, return null
    if (questions.length === 1 && !questionHasSolution(questions[0])) return null;
    const correctCount = evaluableQuestions.reduce((count, question) => {
      const selectedAnswer = answers[question.id];
      return isAnswerCorrect(question, selectedAnswer) ? count + 1 : count;
    }, 0);
    return Math.round((correctCount / evaluableQuestions.length) * 100);
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

  const checkpointTitle = assessmentInfo.quizTitle || session?.quiz?.assessmentInfo?.quizTitle || 'Checkpoint Assessment';
  const checkpointDescription = assessmentInfo.description || 'Test your understanding of this session before moving forward.';
  const passingScoreValue =
    assessmentInfo.passingScore !== undefined && assessmentInfo.passingScore !== '' 
      ? assessmentInfo.passingScore 
      : (session?.quiz?.assessmentInfo?.passingScore !== undefined && session?.quiz?.assessmentInfo?.passingScore !== ''
          ? session.quiz.assessmentInfo.passingScore
          : null);
  const maxAttemptsValue =
    assessmentInfo.maxAttempts !== undefined && assessmentInfo.maxAttempts !== '' 
      ? assessmentInfo.maxAttempts 
      : (session?.quiz?.assessmentInfo?.maxAttempts !== undefined && session?.quiz?.assessmentInfo?.maxAttempts !== ''
          ? session.quiz.assessmentInfo.maxAttempts
          : null);
  const criteriaValue =
    assessmentInfo.criteria || assessmentInfo.criteriaDescription || assessmentInfo.successCriteria || null;

  // Save score when results are shown (only once) - MUST be before any early returns
  useEffect(() => {
    if (showResults && !isViewOnly && !currentAttempt && !isSaving) {
      const evaluableQuestions = questions.filter(questionHasSolution);
      if (evaluableQuestions.length > 0) {
        const score = calculateScore();
        const shouldShowScore = score !== null && evaluableQuestions.length > 0;
        
        if (shouldShowScore) {
          const passingScoreNumeric =
            passingScoreValue !== null && !Number.isNaN(parseFloat(passingScoreValue))
              ? parseFloat(passingScoreValue)
              : null;
          const passed = passingScoreNumeric !== null ? score >= passingScoreNumeric : true;
          saveScoreToBackend(score, passed);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResults, isViewOnly, currentAttempt, isSaving, passingScoreValue]);

  const assessmentHighlights = [
    totalQuestions ? `${totalQuestions} question${totalQuestions === 1 ? '' : 's'}` : null,
    passingScoreValue ? `Passing score: ${passingScoreValue}%` : null,
    maxAttemptsValue ? `Maximum attempts: ${maxAttemptsValue}` : null,
    criteriaValue ? `Criteria: ${criteriaValue}` : null
  ].filter(Boolean);

  if (!quizStarted) {
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
              Back to My Sessions
            </Button>
          )}
          <Box flex={1} />
        </Box>

        <Card sx={{ p: 4, textAlign: 'center', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Box display="flex" justifyContent="center" mb={3}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: '#114417DB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <QuizIcon sx={{ fontSize: 40 }} />
            </Box>
          </Box>
          
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#1f2937' }}>
            Ready for Your Assessment?
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            This checkpoint assessment is tailored for the "{session?.title || 'current'}" session.
          </Typography>
          
          <Box mb={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Assessment Details:
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              {assessmentHighlights.length > 0 ? (
                assessmentHighlights.map((detail, index) => (
                  <Typography variant="body2" key={index}>
                    • {detail}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2">
                  • Review the session material before attempting the checkpoint.
                </Typography>
              )}
            </Box>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={handleStartQuiz}
            sx={{ 
              backgroundColor: '#114417DB', 
              '&:hover': { backgroundColor: '#0a2f0e' },
              px: 4,
              py: 1.5
            }}
          >
            Begin Assessment
          </Button>
        </Card>
      </Box>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const evaluableQuestions = questions.filter(questionHasSolution);
    // Don't show score if no questions have correct answers
    const shouldShowScore = score !== null && evaluableQuestions.length > 0;
    const correctAnswersCount = evaluableQuestions.reduce((count, question) => {
      const selectedAnswer = answers[question.id];
      return isAnswerCorrect(question, selectedAnswer) ? count + 1 : count;
    }, 0);
    const incorrectAnswers = Math.max(evaluableQuestions.length - correctAnswersCount, 0);
    const passingScoreNumeric =
      passingScoreValue !== null && !Number.isNaN(parseFloat(passingScoreValue))
        ? parseFloat(passingScoreValue)
        : null;
    const meetsPassingScore = shouldShowScore && passingScoreNumeric !== null ? score >= passingScoreNumeric : true;
    const isPassing = shouldShowScore && meetsPassingScore;

    // Check if certificate is configured
    const hasCertificate = session?.certificate && (session.certificate.template || session.certificate.id);
    
    // Check if retake is allowed
    const maxAttemptsNum = maxAttemptsValue ? parseInt(maxAttemptsValue) : null;
    const canRetake = !isPassing && (maxAttemptsNum === null || attemptsUsed < maxAttemptsNum);
    const bestScore = previousAttempts.length > 0 
      ? Math.max(...previousAttempts.map(a => a.score || 0))
      : null;

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
              Back to My Sessions
            </Button>
          )}
          <Box flex={1} />
        </Box>

        {/* Question Divisions Bar - Show 100% complete */}
        <Box mb={4}>
          <Box display="flex" gap={1} alignItems="center">
            {questions.map((q, index) => (
            <Box
                key={q.id || index}
              sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: '#114417DB',
                  transition: 'all 0.3s ease',
                  opacity: 1
                }}
              />
            ))}
          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
            <Typography variant="body2" color="text.secondary">
              Assessment Complete
            </Typography>
            {shouldShowScore && (
              <Typography variant="body2" fontWeight="bold" sx={{ color: '#114417DB' }}>
                100%
              </Typography>
            )}
            </Box>
          </Box>
          
        <Card sx={{ p: 4, textAlign: 'center', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {shouldShowScore && isPassing ? (
            <>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#114417DB' }}>
                Congratulations!
              </Typography>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#1f2937' }}>
                You scored {score}% on this assessment
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                {getScoreMessage(score)}
              </Typography>
            </>
          ) : shouldShowScore && !isPassing ? (
            <>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#ef4444' }}>
                Keep Going!
              </Typography>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#1f2937' }}>
                You scored {score}% on this assessment
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                {getScoreMessage(score)}
              </Typography>
              <Alert severity="warning" sx={{ mb: 3, textAlign: 'left' }}>
                You have not yet met the passing criteria.
                {passingScoreNumeric !== null && (
                  <>
                    <br />
                    Minimum passing score: {passingScoreNumeric}%
                  </>
                )}
                {criteriaValue && (
                  <>
                    <br />
                    <strong>Criteria:</strong> {criteriaValue}
                  </>
                )}
                <br />
                Please review the content and try again.
              </Alert>
            </>
          ) : (
            <>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#114417DB' }}>
                Assessment Completed
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                You have completed the assessment. Some questions did not have correct answers configured.
              </Typography>
            </>
          )}

          {shouldShowScore && (
            <Grid container spacing={3} mb={4}>
            <Grid item xs={6}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#114417DB' }}>
                  {correctAnswersCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Correct Answers
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box textAlign="center">
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#ef4444' }}>
                  {incorrectAnswers}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Incorrect Answers
                </Typography>
              </Box>
            </Grid>
          </Grid>
          )}

          {shouldShowScore && isPassing ? (
            hasCertificate ? (
            <Button
              variant="contained"
              size="large"
              startIcon={<CheckCircleIcon />}
              onClick={() => onComplete(shouldShowScore ? score : null)}
              sx={{ 
                  backgroundColor: '#114417DB', 
                  '&:hover': { backgroundColor: '#0a2f0e' },
                px: 4,
                py: 1.5
              }}
            >
              Get Certificate
            </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                startIcon={<CheckCircleIcon />}
                onClick={() => onComplete(shouldShowScore ? score : null)}
                sx={{ 
                  backgroundColor: '#114417DB', 
                  '&:hover': { backgroundColor: '#0a2f0e' },
                  px: 4,
                  py: 1.5
                }}
              >
                Continue
              </Button>
            )
          ) : shouldShowScore && !isPassing ? (
            <Box>
              {canRetake ? (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<RefreshIcon />}
                  onClick={handleRetake}
                  disabled={isSaving}
                  sx={{ 
                    backgroundColor: '#f59e0b', 
                    '&:hover': { backgroundColor: '#d97706' },
                    px: 4,
                    py: 1.5,
                    mb: 2
                  }}
                >
                  {isSaving ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                      Saving...
                    </>
                  ) : (
                    `Retake Assessment (${attemptsUsed}/${maxAttemptsNum || '∞'} attempts)`
                  )}
                </Button>
              ) : (
                <Alert severity="error" sx={{ mb: 2 }}>
                  You have reached the maximum number of attempts ({maxAttemptsNum}). 
                  {bestScore !== null && (
                    <> Your best score was {bestScore}%.</>
                  )}
                </Alert>
              )}
              {previousAttempts.length > 0 && (
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Previous Attempts:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {previousAttempts.map((attempt, idx) => (
                      <Chip
                        key={attempt.id || idx}
                        label={`Attempt ${attempt.attempt_number || idx + 1}: ${attempt.score || 0}% ${attempt.passed ? '✓' : '✗'}`}
                        color={attempt.passed ? 'success' : 'error'}
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          ) : (
            <Button
              variant="contained"
              size="large"
              startIcon={<CheckCircleIcon />}
              onClick={() => onComplete(null)}
              sx={{ 
                backgroundColor: '#114417DB', 
                '&:hover': { backgroundColor: '#0a2f0e' },
                px: 4,
                py: 1.5
              }}
            >
              Continue
            </Button>
          )}
        </Card>
      </Box>
    );
  }

  const currentQ = questions[currentQuestion];

  // Calculate completed questions - only mark as complete when answered and moved past
  // Only show 100% after final submit
  const isFinalQuestion = currentQuestion === totalQuestions - 1;
  const showFullProgress = false; // Never show 100% until after submit

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
            Back to My Sessions
          </Button>
        )}
        <Box flex={1} />
      </Box>

      {/* Question Divisions Bar */}
      <Box mb={4}>
        <Box display="flex" gap={1} alignItems="center">
          {questions.map((q, index) => {
            const isCompleted = index < currentQuestion; // Questions before current are completed
            const isCurrent = index === currentQuestion;
            const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null;
            
            return (
              <Box
                key={q.id || index}
                sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 2,
                  backgroundColor: isCompleted || (isCurrent && isAnswered)
                    ? '#114417DB'
                    : isCurrent
                    ? '#114417DB'
                    : '#e5e7eb',
                  transition: 'all 0.3s ease',
                  opacity: isCurrent ? 1 : isCompleted ? 0.8 : 0.5
                }}
              />
            );
          })}
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <Typography variant="body2" color="text.secondary">
            Question {currentQuestion + 1} of {totalQuestions}
          </Typography>
        </Box>
      </Box>

      {/* Question */}
      <Card sx={{ p: 4, mb: 4, backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#1f2937' }}>
          {currentQ.question}
        </Typography>

        <FormControl component="fieldset" sx={{ mt: 2 }}>
          {isQuestionMultiSelect(currentQ) ? (
            <FormGroup>
              {currentQ.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={Array.isArray(answers[currentQ.id]) ? answers[currentQ.id].includes(index) : false}
                      onChange={() => !isViewOnly && handleMultiAnswerToggle(currentQ.id, index)}
                      disabled={isViewOnly}
                    />
                  }
                  label={option}
                  sx={{ mb: 1 }}
                />
              ))}
            </FormGroup>
          ) : (
            <RadioGroup
              value={
                answers[currentQ.id] !== undefined && answers[currentQ.id] !== null
                  ? String(answers[currentQ.id])
                  : ''
              }
              onChange={(e) => !isViewOnly && handleSingleAnswerChange(currentQ.id, parseInt(e.target.value, 10))}
            >
              {currentQ.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={String(index)}
                  control={<Radio disabled={isViewOnly} />}
                  label={option}
                  sx={{ mb: 1 }}
                />
              ))}
            </RadioGroup>
          )}
        </FormControl>
      </Card>

      {/* Navigation - Centered */}
      {!isViewOnly && (
        <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
        <Button
          variant="outlined"
            onClick={() => {
              // Skip assessment - mark as complete and redirect
              if (onComplete) {
                onComplete(0); // Pass 0 score for skipped
              }
            }}
            sx={{ 
              color: '#6b7280',
              borderColor: '#e5e7eb',
              '&:hover': { borderColor: '#d1d5db', backgroundColor: '#f9fafb' }
            }}
        >
            Skip
        </Button>
          <Button
            variant="contained"
            size="large"
            endIcon={currentQuestion === totalQuestions - 1 ? <CheckCircleIcon /> : <ArrowForwardIcon />}
            onClick={handleNext}
            disabled={(() => {
              const currentAnswer = answers[currentQ.id];
              if (isQuestionMultiSelect(currentQ)) {
                return !Array.isArray(currentAnswer) || currentAnswer.length === 0;
              }
              return currentAnswer === undefined || currentAnswer === null;
            })()}
            sx={{ 
              backgroundColor: '#114417DB', 
              '&:hover': { backgroundColor: '#0a2f0e' },
              px: 4,
              py: 1.5
            }}
          >
            {currentQuestion === totalQuestions - 1 ? 'Submit' : 'Next'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default KnowledgeAssessment;

