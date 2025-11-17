import React, { useState, useEffect, useRef } from 'react';
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
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select
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
  ArrowForward as ArrowForwardIcon,
  UploadFile as UploadFileIcon,
  Close as CloseIcon,
  Preview as PreviewIcon,
  Visibility as VisibilityIcon
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

const QuestionCard = styled(Card)(({ theme, selected, isDragging }) => ({
  padding: theme.spacing(3),
  backgroundColor: 'white',
  borderRadius: theme.spacing(2),
  boxShadow: isDragging ? '0 4px 12px rgba(17, 68, 23, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(2),
  position: 'relative',
  borderLeft: selected ? '4px solid #114417DB' : '4px solid transparent',
  transition: 'border-left 0.2s ease, box-shadow 0.2s ease',
  cursor: 'move',
  opacity: isDragging ? 0.7 : 1,
  '&:hover': {
    borderLeft: '4px solid #114417DB',
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
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const questionsEndRef = useRef(null);

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
      id: Date.now(),
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
    // Auto-scroll to the new question
    setTimeout(() => {
      questionsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
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

  // Drag and drop handlers
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newQuestions = [...questions];
    const draggedQuestion = newQuestions[draggedIndex];
    
    // Remove dragged item
    newQuestions.splice(draggedIndex, 1);
    
    // Insert at new position
    const newDropIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newQuestions.splice(newDropIndex, 0, draggedQuestion);
    
    setQuestions(newQuestions);
    setSelectedQuestion(newDropIndex);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
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

      {/* Main Content - Vertical Stack Layout */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2, pb: 4 }}>
        {/* Assessment Information - Full Width */}
        <Card sx={{ p: 3, width: '100%' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Assessment Information
            </Typography>
            <Divider sx={{ my: 2 }} />
            
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Quiz Title"
                value={assessmentInfo.quizTitle}
                onChange={(e) => setAssessmentInfo(prev => ({ ...prev, quizTitle: e.target.value }))}
                fullWidth
                placeholder="Enter quiz title"
                variant="outlined"
              />
            </Grid>
              
            <Grid item xs={12} md={3}>
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
            </Grid>
              
            <Grid item xs={12} md={3}>
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
            </Grid>
              
            <Grid item xs={12}>
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
        </Grid>
          </Grid>
        </Card>

        {/* Create Questions Section - Full Width */}
          <Card sx={{ width: '100%' }}>
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  '& .MuiTab-root': {
                    color: '#6b7280',
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    '&.Mui-selected': {
                      color: '#114417DB',
                      fontWeight: 600
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#114417DB'
                  }
                }}
              >
                <Tab label="Create Questions" />
                <Tab label="Bulk Upload Quiz" />
              </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{ p: 3 }}>
              {activeTab === 0 && (
              <Box sx={{ width: '100%' }}>
                    {/* Bulk Upload Info */}
                    {bulkUploadFile && (
                      <Card sx={{ p: 2, mb: 2, backgroundColor: 'rgba(17, 68, 23, 0.04)', border: '1px solid #114417DB' }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <UploadFileIcon sx={{ color: '#114417DB' }} />
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
                  isDragging={draggedIndex === index}
                  onClick={() => setSelectedQuestion(index)}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
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
                  sx={{ ml: 1, textTransform: 'none', color: '#114417DB' }}
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
                  <Box display="flex" alignItems="center" ml={4} mt={1}>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => handleAddOption(index)}
                      sx={{
                        textTransform: 'none',
                        color: '#114417DB',
                        '&:hover': {
                          backgroundColor: 'rgba(17, 68, 23, 0.08)'
                        }
                      }}
                    >
                      Add another option
                    </Button>
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
                  <Box display="flex" alignItems="center" ml={4} mt={1}>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => handleAddOption(index)}
                      sx={{
                        textTransform: 'none',
                        color: '#114417DB',
                        '&:hover': {
                          backgroundColor: 'rgba(17, 68, 23, 0.08)'
                        }
                      }}
                    >
                      Add another option
                    </Button>
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
                  <Box display="flex" alignItems="center" ml={5} mt={1}>
                    <Button
                      startIcon={<AddIcon />}
                      onClick={() => handleAddOption(index)}
                      sx={{
                        textTransform: 'none',
                        color: '#114417DB',
                        '&:hover': {
                          backgroundColor: 'rgba(17, 68, 23, 0.08)'
                        }
                      }}
                    >
                      Add another option
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Question Controls */}
              <Box display="flex" alignItems="center" mt={3} pt={2} borderTop="1px solid #e0e0e0">
                <IconButton size="small" sx={{ cursor: 'grab', color: '#114417DB', mr: 1 }} title="Drag to reorder">
                  <DragIndicatorIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDuplicateQuestion(index)} title="Duplicate" sx={{ color: '#114417DB' }}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteQuestion(index)} title="Delete" sx={{ color: '#ef4444' }}>
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
              border: '2px dashed #114417DB',
              borderRadius: 2,
              py: 2,
              width: '100%',
              color: '#114417DB',
              mb: 3,
              '&:hover': {
                borderColor: '#0a2f0e',
                backgroundColor: 'rgba(17, 68, 23, 0.04)'
              }
            }}
          >
            Add question
          </Button>
          <div ref={questionsEndRef} />

                    {/* Preview Button */}
                    <Box display="flex" justifyContent="center" mt={3}>
                      <Button 
                        variant="contained" 
                        startIcon={<VisibilityIcon />}
                        onClick={() => setShowPreview(true)}
                        sx={{ 
                          backgroundColor: '#114417DB',
                          px: 4,
                          py: 1.5,
                          '&:hover': { backgroundColor: '#0a2f0e' }
                        }}
                      >
                        Preview
                      </Button>
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
                        backgroundColor: '#114417DB',
                        px: 4,
                        py: 1.5,
                        '&:hover': { backgroundColor: '#0a2f0e' }
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
                          backgroundColor: '#114417DB',
                          px: 4,
                          py: 1.5,
                          '&:hover': { backgroundColor: '#0a2f0e' }
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
        </Box>

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

      {/* Preview Dialog */}
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Assessment Preview
            </Typography>
            <IconButton onClick={() => setShowPreview(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ overflowY: 'auto' }}>
          {/* Assessment Info Preview */}
          {assessmentInfo.quizTitle && (
            <Box mb={3}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {assessmentInfo.quizTitle}
              </Typography>
              {assessmentInfo.criteriaDescription && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  {assessmentInfo.criteriaDescription}
                </Typography>
              )}
              <Box display="flex" gap={2} mt={2}>
                {assessmentInfo.passingScore && (
                  <Chip label={`Passing Score: ${assessmentInfo.passingScore}%`} size="small" />
                )}
                {assessmentInfo.maxAttempts && (
                  <Chip label={`Max Attempts: ${assessmentInfo.maxAttempts}`} size="small" />
                )}
              </Box>
            </Box>
          )}

          {/* Questions Preview */}
          {questions.map((question, index) => (
            <Card key={question.id} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {index + 1}. {question.text || 'Untitled Question'}
              </Typography>

              {question.type === 'multiple-choice' && (
                <RadioGroup>
                  {question.options.map((option, optIndex) => (
                    <FormControlLabel
                      key={optIndex}
                      value={String(optIndex)}
                      control={
                        <Radio 
                          sx={{
                            color: '#114417DB',
                            '&.Mui-checked': {
                              color: '#114417DB'
                            }
                          }}
                        />
                      }
                      label={option}
                      disabled
                    />
                  ))}
                </RadioGroup>
              )}

              {question.type === 'checkbox' && (
                <Box>
                  {question.options.map((option, optIndex) => (
                    <FormControlLabel
                      key={optIndex}
                      control={
                        <Checkbox 
                          sx={{
                            color: '#114417DB',
                            '&.Mui-checked': {
                              color: '#114417DB'
                            }
                          }}
                        />
                      }
                      label={option}
                      disabled
                      sx={{ display: 'block', mb: 1 }}
                    />
                  ))}
                </Box>
              )}

              {question.type === 'dropdown' && (
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Select
                    value=""
                    disabled
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select an option
                    </MenuItem>
                    {question.options.map((option, optIndex) => (
                      <MenuItem key={optIndex} value={optIndex}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {question.type === 'short-answer' && (
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Your answer"
                  disabled
                  sx={{ mt: 2 }}
                />
              )}

              {question.type === 'paragraph' && (
                <TextField
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  placeholder="Your answer"
                  disabled
                  sx={{ mt: 2 }}
                />
              )}
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)} sx={{ color: '#114417DB' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bottom Buttons */}
      {onSaveDraft && onSkip && (
        <Box display="flex" gap={2} mt={4} justifyContent="center">
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            onClick={() => onSaveDraft(buildQuizData())}
            sx={{
              borderColor: '#114417DB',
              color: '#114417DB',
              '&:hover': {
                borderColor: '#0a2f0e',
                backgroundColor: 'rgba(17, 68, 23, 0.08)'
              },
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 150
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
              fontWeight: 600,
              minWidth: 150
            }}
          >
            Skip
          </Button>
          <Button
            variant="outlined"
            onClick={onCancel}
            sx={{
              borderColor: '#ef4444',
              color: '#ef4444',
              '&:hover': {
                borderColor: '#dc2626',
                backgroundColor: '#fef2f2'
              },
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 150
            }}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => {
              // Go back to Content Creator step
              if (onCancel) onCancel();
            }}
            sx={{
              borderColor: '#6b7280',
              color: '#6b7280',
              '&:hover': {
                borderColor: '#4b5563',
                backgroundColor: '#f3f4f6'
              },
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 150
            }}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={handleSaveQuiz}
            sx={{
              backgroundColor: '#114417DB',
              '&:hover': {
                backgroundColor: '#0a2f0e'
              },
              textTransform: 'none',
              fontWeight: 600,
              minWidth: 150
            }}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default InteractiveQuiz;
