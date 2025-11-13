import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Card,
  FormControlLabel,
  Checkbox,
  Switch,
  Menu,
  MenuItem,
  Chip,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Divider,
  Grid,
  Tabs,
  Tab
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Image as ImageIcon,
  ContentCopy as ContentCopyIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  DragIndicator as DragIndicatorIcon,
  RadioButtonChecked as RadioButtonCheckedIcon,
  CheckBox as CheckBoxIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ShortText as ShortTextIcon,
  Subject as SubjectIcon,
  LinearScale as LinearScaleIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  CloudUpload as CloudUploadIcon,
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  UploadFile as UploadFileIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const QuizContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  backgroundColor: '#f8f9fa',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 600,
}));


const FormTitleCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: 'white',
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(2),
}));

const QuestionCard = styled(Card)(({ theme, selected }) => ({
  padding: theme.spacing(3),
  backgroundColor: 'white',
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(2),
  position: 'relative',
  borderLeft: selected ? '4px solid #4285f4' : '4px solid transparent',
  transition: 'border-left 0.2s ease',
  '&:hover': {
    borderLeft: '4px solid #4285f4',
  }
}));



const InteractiveQuiz = ({ onSave, onCancel, onSaveDraft, onPreview, onPublish, onSkip, existingQuizData }) => {
  const [formTitle, setFormTitle] = useState('Questionnaire Form');
  const [formDescription, setFormDescription] = useState('');
  const [assessmentInfo, setAssessmentInfo] = useState({
    quizTitle: '',
    passingScore: '',
    maxAttempts: '',
    criteriaDescription: '',
    criteria: ''
  });
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: 'Untitled Question',
      type: 'multiple-choice',
      options: ['Option 1'],
      required: false,
      hasImage: false,
      correctAnswer: 0,
      correctAnswers: []
    }
  ]);
  const [selectedQuestion, setSelectedQuestion] = useState(0);
  const [questionTypeAnchor, setQuestionTypeAnchor] = useState(null);
  const [moreOptionsAnchor, setMoreOptionsAnchor] = useState(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [bulkUploadFile, setBulkUploadFile] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  // Debug: Log when questionTypeAnchor changes
  useEffect(() => {
    console.log('questionTypeAnchor changed:', questionTypeAnchor);
  }, [questionTypeAnchor]);

  useEffect(() => {
    if (existingQuizData) {
      setFormTitle(existingQuizData.title || 'Questionnaire Form');
      setFormDescription(existingQuizData.description || '');
      if (existingQuizData.assessmentInfo) {
        const criteriaValue =
          existingQuizData.assessmentInfo.criteriaDescription ||
          existingQuizData.assessmentInfo.criteria ||
          '';
        setAssessmentInfo({
          quizTitle: existingQuizData.assessmentInfo.quizTitle || '',
          passingScore: existingQuizData.assessmentInfo.passingScore || '',
          maxAttempts: existingQuizData.assessmentInfo.maxAttempts || '',
          criteriaDescription: criteriaValue,
          criteria: criteriaValue
        });
      }
      if (existingQuizData.questions && Array.isArray(existingQuizData.questions) && existingQuizData.questions.length > 0) {
        const normalizedQuestions = existingQuizData.questions.map((q, index) => ({
          id: q.id || index + 1,
          text: q.text || q.question || `Untitled Question ${index + 1}`,
          type: q.type || 'multiple-choice',
          options: q.options && q.options.length > 0 ? q.options : ['Option 1'],
          required: Boolean(q.required),
          hasImage: Boolean(q.hasImage),
          correctAnswer:
            q.correctAnswer !== undefined
              ? q.correctAnswer
              : q.correct !== undefined
              ? q.correct
              : q.correctAnswers && Array.isArray(q.correctAnswers) && q.correctAnswers.length === 1
              ? q.correctAnswers[0]
              : 0,
          correctAnswers: Array.isArray(q.correctAnswers) ? q.correctAnswers : []
        }));
        setQuestions(normalizedQuestions);
        setSelectedQuestion(0);
      }
    }
  }, [existingQuizData]);

  const handleAddQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      text: 'Untitled Question',
      type: 'multiple-choice',
      options: ['Option 1'],
      required: false,
      hasImage: false,
      correctAnswer: 0,
      correctAnswers: []
    };
    setQuestions([...questions, newQuestion]);
    setSelectedQuestion(questions.length);
  };

  const handleDuplicateQuestion = (index) => {
    const questionToDuplicate = questions[index];
    const newQuestion = {
      ...questionToDuplicate,
      id: questions.length + 1,
      text: questionToDuplicate.text + ' (Copy)'
    };
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, newQuestion);
    setQuestions(newQuestions);
  };

  const handleDeleteQuestion = (index) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
      if (selectedQuestion >= newQuestions.length) {
        setSelectedQuestion(newQuestions.length - 1);
      }
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (questionIndex) => {
    const newQuestions = [...questions];
    const currentOptions = newQuestions[questionIndex].options;
    // Remove the "Add option" placeholder if it exists, then add new option
    const filteredOptions = currentOptions.filter(opt => !opt.includes('Add option'));
    newQuestions[questionIndex].options = [...filteredOptions, `Option ${filteredOptions.length + 1}`];
    if (newQuestions[questionIndex].type === 'multiple-choice' && newQuestions[questionIndex].correctAnswer === undefined) {
      newQuestions[questionIndex].correctAnswer = 0;
    }
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleDeleteOption = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    // Keep at least one option
    if (newQuestions[questionIndex].options.length > 1) {
      newQuestions[questionIndex].options.splice(optionIndex, 1);
      if (newQuestions[questionIndex].type === 'multiple-choice') {
        if (newQuestions[questionIndex].correctAnswer === optionIndex) {
          newQuestions[questionIndex].correctAnswer = 0;
        } else if (
          newQuestions[questionIndex].correctAnswer !== undefined &&
          newQuestions[questionIndex].correctAnswer > optionIndex
        ) {
          newQuestions[questionIndex].correctAnswer -= 1;
        }
      }
      if (Array.isArray(newQuestions[questionIndex].correctAnswers) && newQuestions[questionIndex].correctAnswers.length) {
        newQuestions[questionIndex].correctAnswers = newQuestions[questionIndex].correctAnswers
          .filter((idx) => idx !== optionIndex)
          .map((idx) => (idx > optionIndex ? idx - 1 : idx));
      }
      setQuestions(newQuestions);
    }
  };

  const handleCorrectAnswerSelect = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswer = optionIndex;
    newQuestions[questionIndex].correctAnswers = [optionIndex];
    setQuestions(newQuestions);
  };

  const handleToggleCorrectAnswer = (questionIndex, optionIndex) => {
    const newQuestions = [...questions];
    const current = newQuestions[questionIndex].correctAnswers || [];
    const exists = current.includes(optionIndex);
    if (exists) {
      newQuestions[questionIndex].correctAnswers = current.filter((idx) => idx !== optionIndex);
    } else {
      newQuestions[questionIndex].correctAnswers = [...current, optionIndex];
    }
    setQuestions(newQuestions);
  };

  const handleQuestionTypeSelect = (type) => {
    const newQuestions = [...questions];
    newQuestions[selectedQuestion].type = type;
    
    // Initialize options for types that need them
    if ((type === 'multiple-choice' || type === 'checkbox' || type === 'dropdown') && 
        (!newQuestions[selectedQuestion].options || newQuestions[selectedQuestion].options.length === 0)) {
      newQuestions[selectedQuestion].options = ['Option 1'];
    }
    
    // Remove options for types that don't need them
    if (type === 'short-answer' || type === 'paragraph') {
      newQuestions[selectedQuestion].options = [];
    }

    if (type === 'multiple-choice') {
      newQuestions[selectedQuestion].correctAnswer = 0;
      newQuestions[selectedQuestion].correctAnswers = [];
    } else if (type === 'checkbox') {
      if (!Array.isArray(newQuestions[selectedQuestion].correctAnswers)) {
        newQuestions[selectedQuestion].correctAnswers = [];
      }
      newQuestions[selectedQuestion].correctAnswer = undefined;
    } else {
      newQuestions[selectedQuestion].correctAnswer = undefined;
      newQuestions[selectedQuestion].correctAnswers = [];
    }
    
    setQuestions(newQuestions);
    setQuestionTypeAnchor(null);
  };

  const buildQuizData = () => {
    const normalizedQuestions = questions.map((question, index) => {
      const base = {
        ...question,
        id: question.id || index + 1,
        correctAnswers: Array.isArray(question.correctAnswers) ? question.correctAnswers : []
      };

      if (question.type === 'multiple-choice') {
        const correctIndex =
          question.correctAnswer !== undefined && question.correctAnswer !== null
            ? question.correctAnswer
            : base.correctAnswers.length === 1
            ? base.correctAnswers[0]
            : 0;
        return {
          ...base,
          correctAnswer: correctIndex,
          correct: correctIndex,
          correctAnswers: [correctIndex]
        };
      }

      if (question.type === 'checkbox') {
        return {
          ...base,
          correctAnswers: base.correctAnswers,
          correctAnswer: base.correctAnswers.length === 1 ? base.correctAnswers[0] : undefined
        };
      }

      return {
        ...base,
        correctAnswer: undefined,
        correctAnswers: []
      };
    });

    const normalizedAssessmentInfo = {
      ...assessmentInfo,
      criteria:
        assessmentInfo.criteriaDescription ||
        assessmentInfo.criteria ||
        ''
    };

    const quizData = {
      title: formTitle,
      description: formDescription,
      questions: normalizedQuestions,
      assessmentInfo: normalizedAssessmentInfo
    };
    return quizData;
  };

  const handleSaveQuiz = () => {
    const quizData = buildQuizData();
    onSave(quizData);
  };

  const handleBulkUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setBulkUploadFile(file);
      
      // Read the file (supports JSON, CSV, or Excel formats)
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          // Try parsing as JSON first
          const data = JSON.parse(e.target.result);
          
          if (data.questions && Array.isArray(data.questions)) {
            setQuestions(data.questions);
            if (data.title) setFormTitle(data.title);
            if (data.description) setFormDescription(data.description);
            alert('Quiz imported successfully!');
          } else {
            alert('Invalid file format. Please upload a valid quiz JSON file.');
          }
        } catch (error) {
          alert('Error reading file. Please ensure it is a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleBulkUploadClick = () => {
    document.getElementById('bulk-upload-input').click();
  };

  const getQuestionTypeLabel = (type) => {
    const types = {
      'multiple-choice': 'Multiple choice',
      'checkbox': 'Checkboxes',
      'short-answer': 'Short answer',
      'paragraph': 'Paragraph',
      'dropdown': 'Dropdown',
      'file-upload': 'File upload',
      'linear-scale': 'Linear scale',
      'multiple-choice-grid': 'Multiple choice grid',
      'checkbox-grid': 'Checkbox grid',
      'date': 'Date',
      'time': 'Time'
    };
    return types[type] || type;
  };

  const getQuestionTypeIcon = (type) => {
    const icons = {
      'short-answer': <ShortTextIcon fontSize="small" />,
      'paragraph': <SubjectIcon fontSize="small" />,
      'multiple-choice': <RadioButtonCheckedIcon fontSize="small" />,
      'checkbox': <CheckBoxIcon fontSize="small" />,
      'dropdown': <ArrowDropDownIcon fontSize="small" />,
      'file-upload': <CloudUploadIcon fontSize="small" />,
      'linear-scale': <LinearScaleIcon fontSize="small" />,
      'date': <CalendarTodayIcon fontSize="small" />,
      'time': <AccessTimeIcon fontSize="small" />
    };
    return icons[type] || null;
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Page Header */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Quiz & Assessment Creator
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create, manage, and deploy training assessments
          </Typography>
        </Box>
        
        {/* Action Buttons - Top Right */}
        {/* Show Save as Draft and Skip buttons when onSkip is provided (for assessment page) */}
        {onSaveDraft && onSkip && (
          <Box display="flex" gap={2} alignItems="center">
            <Button
              variant="outlined"
              onClick={() => onSaveDraft(buildQuizData())}
              startIcon={<SaveIcon />}
              sx={{
                borderColor: '#10b981',
                color: '#10b981',
                '&:hover': {
                  borderColor: '#059669',
                  backgroundColor: '#d1fae5'
                },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Save as Draft
            </Button>
            <Button
              variant="outlined"
              onClick={onSkip}
              sx={{
                borderColor: '#6b7280',
                color: '#6b7280',
                '&:hover': {
                  borderColor: '#4b5563',
                  backgroundColor: '#f3f4f6'
                },
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Skip
            </Button>
          </Box>
        )}
        
        {/* Show Save as Draft and Proceed to Publish buttons when onPreview and onPublish are provided (for other quiz contexts) */}
        {onSaveDraft && onPreview && onPublish && !onSkip && (
          <Box display="flex" gap={1.5} alignItems="center">
            <Button
              variant="outlined"
              size="medium"
              onClick={() => onSaveDraft(buildQuizData())}
              sx={{
                borderColor: '#f59e0b',
                color: '#f59e0b',
                px: 2,
                py: 1,
                fontWeight: 500,
                '&:hover': { borderColor: '#d97706', backgroundColor: '#fffbeb' }
              }}
            >
              Save as Draft
            </Button>
            
            <Button
              variant="contained"
              size="medium"
              onClick={() => onPublish(buildQuizData())}
              sx={{
                backgroundColor: '#10b981',
                px: 2,
                py: 1,
                fontWeight: 600,
                '&:hover': { backgroundColor: '#059669' }
              }}
            >
              Proceed to Publish
            </Button>
          </Box>
        )}
      </Box>

      {/* Back Button */}
      <Box mb={3}>
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={onCancel}
          sx={{ color: '#666' }}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Main Content - Grid Layout */}
      <Grid container spacing={3} sx={{ pt: 2, pb: 4 }}>
        {/* Left Sidebar - Assessment Information */}
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Assessment Information
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Quiz Title"
                value={assessmentInfo.quizTitle}
                onChange={(e) => setAssessmentInfo(prev => ({ ...prev, quizTitle: e.target.value }))}
                fullWidth
                placeholder="Enter quiz title"
                variant="outlined"
              />
              
              <TextField
                label="Passing Score (%)"
                type="number"
                value={assessmentInfo.passingScore}
                onChange={(e) => setAssessmentInfo(prev => ({ ...prev, passingScore: e.target.value }))}
                fullWidth
                placeholder="Enter passing score (e.g., 70)"
                variant="outlined"
                inputProps={{ min: 0, max: 100 }}
              />
              
              <TextField
                label="Max Attempts"
                type="number"
                value={assessmentInfo.maxAttempts}
                onChange={(e) => setAssessmentInfo(prev => ({ ...prev, maxAttempts: e.target.value }))}
                fullWidth
                placeholder="Enter maximum attempts (e.g., 3)"
                variant="outlined"
                inputProps={{ min: 1 }}
              />
              
              <TextField
                label="Passing Criteria"
                value={assessmentInfo.criteriaDescription}
                onChange={(e) =>
                  setAssessmentInfo(prev => ({
                    ...prev,
                    criteriaDescription: e.target.value,
                    criteria: e.target.value
                  }))
                }
                fullWidth
                placeholder="Describe the passing criteria shown to employees"
                variant="outlined"
                multiline
                minRows={2}
              />
            </Box>
          </Card>
        </Grid>

        {/* Right Content - Quiz Form with Tabs */}
        <Grid item xs={12} md={8}>
          <Card sx={{ width: '100%' }}>
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                <Tab label="Create Questions" />
                <Tab label="Bulk Upload Quiz" />
              </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ width: '100%', maxWidth: 640 }}>
                    {/* Bulk Upload Info */}
                    {bulkUploadFile && (
                      <Card sx={{ p: 2, mb: 2, backgroundColor: '#d1fae5', border: '1px solid #10b981' }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <UploadFileIcon sx={{ color: '#10b981' }} />
                          <Typography variant="body2" fontWeight="medium">
                            Uploaded: {bulkUploadFile.name}
                          </Typography>
                          <Chip label={`${questions.length} questions loaded`} size="small" color="success" />
                        </Box>
                      </Card>
                    )}

              {/* Questions */}
              {questions.map((question, index) => (
                <QuestionCard 
                  key={question.id} 
                  selected={selectedQuestion === index}
                  onClick={() => setSelectedQuestion(index)}
                >
                  <Box display="flex" alignItems="center" mb={2}>
                <TextField
                  value={question.text}
                  onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                  variant="standard"
                  fullWidth
                  sx={{ flex: 1 }}
                />
                <IconButton size="small" sx={{ ml: 1 }}>
                  <ImageIcon />
                </IconButton>
                <Button
                  endIcon={<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E" alt="dropdown" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Question type button clicked, index:', index);
                    console.log('Current anchor element:', e.currentTarget);
                    setSelectedQuestion(index);
                    setQuestionTypeAnchor(e.currentTarget);
                  }}
                  sx={{ ml: 1, textTransform: 'none', color: '#666' }}
                >
                  {getQuestionTypeLabel(question.type)}
                </Button>
              </Box>

              {/* Short Answer */}
              {question.type === 'short-answer' && (
                <TextField
                  placeholder="Short answer text"
                  variant="standard"
                  disabled
                  fullWidth
                  sx={{ mt: 2 }}
                />
              )}

              {/* Paragraph */}
              {question.type === 'paragraph' && (
                <TextField
                  placeholder="Long answer text"
                  variant="standard"
                  disabled
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ mt: 2 }}
                />
              )}

              {/* Multiple Choice */}
              {question.type === 'multiple-choice' && (
                <RadioGroup
                  value={
                    question.correctAnswer !== undefined && question.correctAnswer !== null
                      ? String(question.correctAnswer)
                      : ''
                  }
                  onChange={(_, value) => handleCorrectAnswerSelect(index, parseInt(value, 10))}
                >
                  {question.options.map((option, optIndex) => (
                    <Box
                      key={optIndex}
                      display="flex"
                      alignItems="center"
                      mb={1}
                      sx={{
                        backgroundColor:
                          question.correctAnswer === optIndex ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                        borderRadius: 1,
                        pr: 1
                      }}
                    >
                      <Radio
                        value={String(optIndex)}
                        checked={question.correctAnswer === optIndex}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleCorrectAnswerSelect(index, optIndex);
                        }}
                      />
                      <TextField
                        value={option}
                        onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                        variant="standard"
                        fullWidth
                        sx={{ flex: 1, mr: 1 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteOption(index, optIndex)}
                        sx={{ visibility: question.options.length > 1 ? 'visible' : 'hidden' }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                  <Box display="flex" alignItems="center" ml={4}>
                    <Radio disabled />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleAddOption(index)}
                    >
                      Add option or{' '}
                      <span
                        style={{ color: '#1976d2', cursor: 'pointer' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddOption(index);
                        }}
                      >
                        add "Other"
                      </span>
                    </Typography>
                  </Box>
                </RadioGroup>
              )}

              {/* Checkboxes */}
              {question.type === 'checkbox' && (
                <Box>
                  {question.options.map((option, optIndex) => (
                    <Box key={optIndex} display="flex" alignItems="center" mb={1}>
                      <Checkbox
                        checked={Array.isArray(question.correctAnswers) ? question.correctAnswers.includes(optIndex) : false}
                        onChange={() => handleToggleCorrectAnswer(index, optIndex)}
                        sx={{ mr: 1 }}
                      />
                      <TextField
                        value={option}
                        onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                        variant="standard"
                        fullWidth
                        sx={{ flex: 1, mr: 1 }}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteOption(index, optIndex)}
                        sx={{ visibility: question.options.length > 1 ? 'visible' : 'hidden' }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                  <Box display="flex" alignItems="center" ml={4}>
                    <CheckBoxIcon sx={{ color: '#ccc', mr: 1 }} />
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleAddOption(index)}
                    >
                      Add option
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Dropdown */}
              {question.type === 'dropdown' && (
                <Box>
                  {question.options.map((option, optIndex) => (
                    <Box key={optIndex} display="flex" alignItems="center" mb={1}>
                      <Typography variant="body2" sx={{ mr: 2, minWidth: 30 }}>{optIndex + 1}.</Typography>
                      <TextField
                        value={option}
                        onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                        variant="standard"
                        fullWidth
                        sx={{ flex: 1, mr: 1 }}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => handleDeleteOption(index, optIndex)}
                        sx={{ visibility: question.options.length > 1 ? 'visible' : 'hidden' }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
                  <Box display="flex" alignItems="center" ml={5}>
                    <Typography 
                      variant="body2" 
                      color="primary" 
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleAddOption(index)}
                    >
                      Add option
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Question Controls */}
              <Box display="flex" alignItems="center" mt={3} pt={2} borderTop="1px solid #e0e0e0">
                <IconButton size="small" sx={{ cursor: 'grab', color: '#999', mr: 1 }}>
                  <DragIndicatorIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDuplicateQuestion(index)} title="Duplicate">
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteQuestion(index)} title="Delete">
                  <DeleteIcon fontSize="small" />
                </IconButton>
                <Box flex={1} />
              </Box>
            </QuestionCard>
          ))}

          {/* Add Question Button */}
          <Button
            startIcon={<AddIcon />}
            onClick={handleAddQuestion}
            sx={{
              border: '2px dashed #ddd',
              borderRadius: 2,
              py: 2,
              width: '100%',
              color: '#666',
              mb: 3,
              '&:hover': {
                borderColor: '#8e7cc3',
                backgroundColor: '#f8f9fa'
              }
            }}
          >
            Add question
          </Button>

                    {/* Save Assessment Button */}
                    <Box display="flex" justifyContent="center" mt={3}>
                      <Button 
                        variant="contained" 
                        startIcon={<SaveIcon />}
                        onClick={handleSaveQuiz}
                        sx={{ 
                          backgroundColor: '#3b82f6',
                          px: 4,
                          py: 1.5,
                          '&:hover': { backgroundColor: '#2563eb' }
                        }}
                      >
                        Save Assessment
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Bulk Upload Tab */}
              {activeTab === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ width: '100%', maxWidth: 600, textAlign: 'center' }}>
                    {/* Hidden File Input */}
                    <input
                      type="file"
                      id="bulk-upload-input"
                      accept=".json"
                      onChange={handleBulkUpload}
                      style={{ display: 'none' }}
                    />

                    <Button 
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      onClick={handleBulkUploadClick}
                      size="large"
                      sx={{ 
                        backgroundColor: '#10b981',
                        px: 4,
                        py: 1.5,
                        '&:hover': { backgroundColor: '#059669' }
                      }}
                    >
                      Upload File
                    </Button>

                    {bulkUploadFile && (
                      <Card sx={{ p: 2, mt: 2, backgroundColor: '#d1fae5', border: '1px solid #10b981' }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <UploadFileIcon sx={{ color: '#10b981' }} />
                          <Typography variant="body2" fontWeight="medium">
                            Uploaded: {bulkUploadFile.name}
                          </Typography>
                          <Chip label={`${questions.length} questions loaded`} size="small" color="success" />
                        </Box>
                      </Card>
                    )}

                    <Box display="flex" justifyContent="center" mt={3}>
                      <Button 
                        variant="contained" 
                        startIcon={<SaveIcon />}
                        onClick={handleSaveQuiz}
                        sx={{ 
                          backgroundColor: '#3b82f6',
                          px: 4,
                          py: 1.5,
                          '&:hover': { backgroundColor: '#2563eb' }
                        }}
                      >
                        Save Assessment
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Question Type Menu */}
      <Menu
        anchorEl={questionTypeAnchor}
        open={Boolean(questionTypeAnchor)}
        onClose={() => setQuestionTypeAnchor(null)}
        PaperProps={{
          sx: { minWidth: 200, zIndex: 10000 }
        }}
        sx={{ zIndex: 10000 }}
      >
        <MenuItem 
          onClick={() => handleQuestionTypeSelect('short-answer')}
          sx={{ 
            display: 'flex', 
            gap: 2,
            backgroundColor: questions[selectedQuestion]?.type === 'short-answer' ? '#e3f2fd' : 'transparent'
          }}
        >
          <ShortTextIcon fontSize="small" />
          Short answer
        </MenuItem>
        <MenuItem 
          onClick={() => handleQuestionTypeSelect('paragraph')}
          sx={{ 
            display: 'flex', 
            gap: 2,
            backgroundColor: questions[selectedQuestion]?.type === 'paragraph' ? '#e3f2fd' : 'transparent'
          }}
        >
          <SubjectIcon fontSize="small" />
          Paragraph
        </MenuItem>
        <MenuItem 
          onClick={() => handleQuestionTypeSelect('multiple-choice')}
          sx={{ 
            display: 'flex', 
            gap: 2,
            backgroundColor: questions[selectedQuestion]?.type === 'multiple-choice' ? '#e3f2fd' : 'transparent'
          }}
        >
          <RadioButtonCheckedIcon fontSize="small" />
          Multiple choice
        </MenuItem>
        <MenuItem 
          onClick={() => handleQuestionTypeSelect('checkbox')}
          sx={{ 
            display: 'flex', 
            gap: 2,
            backgroundColor: questions[selectedQuestion]?.type === 'checkbox' ? '#e3f2fd' : 'transparent'
          }}
        >
          <CheckBoxIcon fontSize="small" />
          Checkboxes
        </MenuItem>
        <MenuItem 
          onClick={() => handleQuestionTypeSelect('dropdown')}
          sx={{ 
            display: 'flex', 
            gap: 2,
            backgroundColor: questions[selectedQuestion]?.type === 'dropdown' ? '#e3f2fd' : 'transparent'
          }}
        >
          <ArrowDropDownIcon fontSize="small" />
          Dropdown
        </MenuItem>
      </Menu>

      {/* More Options Menu */}
      <Menu
        anchorEl={moreOptionsAnchor}
        open={Boolean(moreOptionsAnchor)}
        onClose={() => setMoreOptionsAnchor(null)}
      >
        <MenuItem>Add section</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <MenuItem>Delete</MenuItem>
        <MenuItem>Get prefilled link</MenuItem>
        <MenuItem>Go to section based on answer</MenuItem>
      </Menu>
    </Box>
  );
};

export default InteractiveQuiz;
