import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as MuiTextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  RequestPage as RequestIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  Lock as LockIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useSessionRequests } from '../contexts/SessionRequestContext';

const CourseLibrary = ({ completedSessions }) => {
  const { addSessionRequest } = useSessionRequests();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [requestReason, setRequestReason] = useState('');

  // Sample course data
  const allCourses = [
    {
      id: 1,
      title: 'Leadership Development',
      instructor: 'Dr. Emily Davis',
      description: 'Comprehensive leadership skills training for managers and team leads',
      duration: '120 minutes',
      category: 'Leadership',
      difficulty: 'Intermediate',
      rating: 4.8,
      students: 156,
      tags: ['Leadership', 'Management', 'Team Building'],
      status: 'available',
      recommended: true
    },
    {
      id: 2,
      title: 'Cybersecurity Fundamentals',
      instructor: 'Mike Chen',
      description: 'Essential cybersecurity practices for modern workplaces',
      duration: '90 minutes',
      category: 'Technology',
      difficulty: 'Beginner',
      rating: 4.6,
      students: 203,
      tags: ['Security', 'Technology', 'Best Practices'],
      status: 'available',
      recommended: false
    },
    {
      id: 3,
      title: 'Data Analysis with Python',
      instructor: 'Sarah Wilson',
      description: 'Learn data analysis techniques using Python and pandas',
      duration: '150 minutes',
      category: 'Technology',
      difficulty: 'Advanced',
      rating: 4.9,
      students: 89,
      tags: ['Python', 'Data Science', 'Analytics'],
      status: 'locked',
      recommended: true
    },
    {
      id: 4,
      title: 'Communication Skills',
      instructor: 'John Smith',
      description: 'Improve your communication skills for better workplace relationships',
      duration: '75 minutes',
      category: 'Soft Skills',
      difficulty: 'Beginner',
      rating: 4.7,
      students: 312,
      tags: ['Communication', 'Soft Skills', 'Relationships'],
      status: 'available',
      recommended: false
    },
    {
      id: 5,
      title: 'Project Management',
      instructor: 'Lisa Anderson',
      description: 'Master project management methodologies and tools',
      duration: '180 minutes',
      category: 'Management',
      difficulty: 'Intermediate',
      rating: 4.8,
      students: 145,
      tags: ['Project Management', 'Methodology', 'Tools'],
      status: 'available',
      recommended: true
    }
  ];

  // Filter out completed courses
  const availableCourses = allCourses.filter(course => 
    !completedSessions.includes(course.id)
  );

  const filteredCourses = availableCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(availableCourses.map(course => course.category))];

  const handleRequestAccess = (course) => {
    setSelectedCourse(course);
    setShowRequestDialog(true);
  };

  const handleSubmitRequest = () => {
    if (!requestReason.trim()) {
      alert('Please provide a reason for your request');
      return;
    }

    const request = {
      employeeName: 'Luke Wilson',
      sessionName: selectedCourse.title,
      reason: requestReason,
      employeeEmail: 'luke.wilson@company.com',
      status: 'pending',
      attemptsUsed: 0,
      maxAttempts: 3,
      lockedDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit' 
      })
    };

    addSessionRequest(request);
    setShowRequestDialog(false);
    setRequestReason('');
    setSelectedCourse(null);
    alert('Request submitted successfully! The HR team will review your request and notify you when approved.');
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <CheckCircleIcon sx={{ color: '#10b981' }} />;
      case 'locked': return <LockIcon sx={{ color: '#ef4444' }} />;
      default: return null;
    }
  };

  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Course Library
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Explore all courses issued by the HR team
        </Typography>
      </Box>

      {/* Search and Filter */}
      <Box mb={4}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              fullWidth
              sx={{ height: '56px' }}
            >
              More Filters
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Recommended Courses */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Recommended for You
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Based on your skills and interests
        </Typography>
        <Grid container spacing={3}>
          {filteredCourses.filter(course => course.recommended).map((course) => (
            <Grid item xs={12} md={6} lg={4} key={course.id}>
              <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {course.title}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getStatusIcon(course.status)}
                      <Chip
                        label="Recommended"
                        size="small"
                        sx={{ backgroundColor: '#3b82f6', color: 'white' }}
                      />
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {course.description}
                  </Typography>

                  <Box display="flex" alignItems="center" mb={2}>
                    <PersonIcon sx={{ mr: 1, fontSize: 16, color: '#6b7280' }} />
                    <Typography variant="body2" color="text.secondary">
                      {course.instructor}
                    </Typography>
                  </Box>

                  <Box display="flex" gap={1} mb={2}>
                    <Chip
                      label={course.difficulty}
                      size="small"
                      sx={{ 
                        backgroundColor: getDifficultyColor(course.difficulty), 
                        color: 'white' 
                      }}
                    />
                    <Chip
                      label={course.duration}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" alignItems="center">
                      <StarIcon sx={{ mr: 0.5, fontSize: 16, color: '#f59e0b' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {course.rating}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {course.students} students
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<RequestIcon />}
                    onClick={() => handleRequestAccess(course)}
                    sx={{ 
                      backgroundColor: '#10b981', 
                      '&:hover': { backgroundColor: '#059669' }
                    }}
                  >
                    Request Access
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* All Courses */}
      <Box>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          All Available Courses
        </Typography>
        <Grid container spacing={3}>
          {filteredCourses.map((course) => (
            <Grid item xs={12} md={6} lg={4} key={course.id}>
              <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {course.title}
                    </Typography>
                    {getStatusIcon(course.status)}
                  </Box>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {course.description}
                  </Typography>

                  <Box display="flex" alignItems="center" mb={2}>
                    <PersonIcon sx={{ mr: 1, fontSize: 16, color: '#6b7280' }} />
                    <Typography variant="body2" color="text.secondary">
                      {course.instructor}
                    </Typography>
                  </Box>

                  <Box display="flex" gap={1} mb={2}>
                    <Chip
                      label={course.difficulty}
                      size="small"
                      sx={{ 
                        backgroundColor: getDifficultyColor(course.difficulty), 
                        color: 'white' 
                      }}
                    />
                    <Chip
                      label={course.duration}
                      size="small"
                      variant="outlined"
                    />
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box display="flex" alignItems="center">
                      <StarIcon sx={{ mr: 0.5, fontSize: 16, color: '#f59e0b' }} />
                      <Typography variant="body2" fontWeight="medium">
                        {course.rating}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {course.students} students
                    </Typography>
                  </Box>

                  <Button
                    variant={course.status === 'available' ? 'contained' : 'outlined'}
                    fullWidth
                    startIcon={course.status === 'available' ? <CheckCircleIcon /> : <LockIcon />}
                    onClick={() => course.status === 'available' ? handleRequestAccess(course) : null}
                    disabled={course.status === 'locked'}
                    sx={{ 
                      backgroundColor: course.status === 'available' ? '#10b981' : 'transparent',
                      '&:hover': { 
                        backgroundColor: course.status === 'available' ? '#059669' : '#f3f4f6'
                      }
                    }}
                  >
                    {course.status === 'available' ? 'Request Access' : 'Locked'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Request Access Dialog */}
      <Dialog 
        open={showRequestDialog} 
        onClose={() => setShowRequestDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h5" fontWeight="bold">
            Request Access to {selectedCourse?.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please provide a reason for your request
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <MuiTextField
              label="Reason for Request"
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
              fullWidth
              multiline
              rows={4}
              placeholder="Explain why you need access to this course..."
              helperText="Your request will be reviewed by the HR team"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setShowRequestDialog(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitRequest}
            sx={{ backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669' } }}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CourseLibrary;
