import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Rating,
  Chip,
  Grid,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Star as StarIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon
} from '@mui/icons-material';
import { sessionCompletionAPI, sessionRequestAPI } from '../utils/api';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

const SessionReport = ({ session, open, onClose }) => {
  const [completions, setCompletions] = useState([]);
  const [sessionRequests, setSessionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  useEffect(() => {
    if (open && session?.id) {
      loadCompletions();
      loadSessionRequests();
    }
  }, [open, session]);

  const loadCompletions = async () => {
    try {
      setLoading(true);
      const data = await sessionCompletionAPI.getAll(null, session.id);
      setCompletions(data || []);
    } catch (error) {
      console.error('Failed to load session completions:', error);
      setCompletions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSessionRequests = async () => {
    try {
      const data = await sessionRequestAPI.getAll();
      // Filter requests for this session
      const filtered = (data || []).filter(req => req.session === session.id);
      setSessionRequests(filtered);
    } catch (error) {
      console.error('Failed to load session requests:', error);
      setSessionRequests([]);
    }
  };

  // Calculate average feedback score
  const averageFeedbackScore = () => {
    const feedbacks = completions
      .filter(c => c.feedback && c.feedback.rating && c.feedback.rating > 0)
      .map(c => c.feedback.rating);
    
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, rating) => acc + rating, 0);
    return (sum / feedbacks.length).toFixed(1);
  };

  // Get assessment details
  const assessmentInfo = session?.assessment_info || session?.quiz?.assessmentInfo || {};
  const passingScore = assessmentInfo.passingScore || assessmentInfo.passing_score || null;
  const maxAttempts = assessmentInfo.maxAttempts || assessmentInfo.max_attempts || null;
  const criteria = assessmentInfo.criteria || assessmentInfo.criteriaDescription || assessmentInfo.successCriteria || null;

  // Get attempts for each employee (from SessionRequest)
  const getEmployeeAttempts = (employeeId) => {
    const request = sessionRequests.find(req => req.employee === employeeId);
    if (request) {
      return `${request.attempts_used || 0} / ${request.max_attempts || 3}`;
    }
    return 'N/A';
  };

  const handleFeedbackClick = (completion) => {
    if (completion.feedback && completion.feedback.rating) {
      setSelectedFeedback(completion);
      setShowFeedbackDialog(true);
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    // Title
    doc.setFontSize(18);
    doc.text('Session Report', 105, yPos, { align: 'center' });
    yPos += 10;

    // Session Information
    doc.setFontSize(14);
    doc.text('Session Information', 14, yPos);
    yPos += 8;
    doc.setFontSize(11);
    doc.text(`Title: ${session.title || 'N/A'}`, 14, yPos);
    yPos += 6;
    doc.text(`Description: ${session.description || 'N/A'}`, 14, yPos);
    yPos += 6;
    doc.text(`Type: ${session.type || 'N/A'}`, 14, yPos);
    yPos += 6;
    doc.text(`Status: ${session.status || 'N/A'}`, 14, yPos);
    yPos += 10;

    // Assessment Details
    if (session.quiz || assessmentInfo) {
      doc.setFontSize(14);
      doc.text('Assessment Details', 14, yPos);
      yPos += 8;
      doc.setFontSize(11);
      if (passingScore !== null) {
        doc.text(`Passing Score: ${passingScore}%`, 14, yPos);
        yPos += 6;
      }
      if (maxAttempts !== null) {
        doc.text(`Max Attempts: ${maxAttempts}`, 14, yPos);
        yPos += 6;
      }
      if (criteria) {
        const criteriaLines = doc.splitTextToSize(`Criteria: ${criteria}`, 180);
        doc.text(criteriaLines, 14, yPos);
        yPos += criteriaLines.length * 6;
      }
      yPos += 5;
    }

    // Average Feedback Score
    const avgScore = averageFeedbackScore();
    doc.setFontSize(14);
    doc.text('Average Feedback Score', 14, yPos);
    yPos += 8;
    doc.setFontSize(11);
    doc.text(`${avgScore} / 5.0`, 14, yPos);
    yPos += 10;

    // Employee Completions Table
    if (completions.length > 0) {
      doc.setFontSize(14);
      doc.text('Employee Completions', 14, yPos);
      yPos += 8;
      doc.setFontSize(10);
      
      // Table headers
      doc.text('Employee', 14, yPos);
      doc.text('Score', 80, yPos);
      doc.text('Attempts', 110, yPos);
      doc.text('Rating', 140, yPos);
      yPos += 6;
      doc.line(14, yPos, 190, yPos);
      yPos += 5;

      // Table rows
      completions.forEach((completion) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
        const employeeName = completion.employee_name || 'N/A';
        const score = completion.score !== null ? `${completion.score}%` : 'N/A';
        const attempts = getEmployeeAttempts(completion.employee);
        const rating = completion.feedback?.rating || 'N/A';
        
        doc.text(employeeName.substring(0, 30), 14, yPos);
        doc.text(score, 80, yPos);
        doc.text(attempts, 110, yPos);
        doc.text(rating !== 'N/A' ? `${rating}/5` : 'N/A', 140, yPos);
        yPos += 6;
      });
    }

    doc.save(`Session_Report_${session.title || 'Report'}.pdf`);
  };

  const handleExportExcel = () => {
    const worksheetData = [
      ['Employee Name', 'Assessment Score', 'Attempts', 'Feedback Rating', 'Passed', 'Completed At']
    ];

    completions.forEach((completion) => {
      worksheetData.push([
        completion.employee_name || 'N/A',
        completion.score !== null ? `${completion.score}%` : 'N/A',
        getEmployeeAttempts(completion.employee),
        completion.feedback?.rating || 'N/A',
        completion.passed ? 'Yes' : 'No',
        completion.completed_at ? new Date(completion.completed_at).toLocaleString() : 'N/A'
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Employee Completions');
    XLSX.writeFile(wb, `Session_Report_${session.title || 'Report'}.xlsx`);
  };

  if (!session) return null;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { minHeight: '80vh' }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold">
              Session Report
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box>
            {/* Session Information */}
            <Card sx={{ mb: 3, p: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Session Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Title</Typography>
                  <Typography variant="body1" fontWeight="medium">{session.title || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Type</Typography>
                  <Typography variant="body1" fontWeight="medium">{session.type || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip 
                    label={session.status || 'N/A'} 
                    size="small"
                    sx={{ 
                      backgroundColor: session.status === 'published' ? '#114417DB' : '#6b7280',
                      color: 'white'
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Key Skills</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {session.skills && session.skills.length > 0 ? (
                      session.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          sx={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">No skills specified</Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Start Date & Time</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {session.scheduledDateTime 
                      ? new Date(session.scheduledDateTime).toLocaleString()
                      : session.scheduledDate && session.scheduledTime
                      ? `${new Date(session.scheduledDate).toLocaleDateString()} ${session.scheduledTime}`
                      : 'Not scheduled'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">End Date & Time</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {session.dueDateTime 
                      ? new Date(session.dueDateTime).toLocaleString()
                      : session.dueDate && session.dueTime
                      ? `${new Date(session.dueDate).toLocaleDateString()} ${session.dueTime}`
                      : 'Not set'}
                  </Typography>
                </Grid>
                {session.description && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">Description</Typography>
                    <Typography variant="body1">{session.description}</Typography>
                  </Grid>
                )}
              </Grid>
            </Card>

            {/* Assessment Section */}
            <Card sx={{ mb: 3, p: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <AssessmentIcon sx={{ color: '#114417DB' }} />
                <Typography variant="h6" fontWeight="bold">
                  Assessment
                </Typography>
              </Box>
              {(session.quiz || (passingScore !== null || maxAttempts !== null || criteria)) ? (
                <Grid container spacing={2}>
                  {passingScore !== null && (
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">Passing Criteria</Typography>
                      <Typography variant="body1" fontWeight="medium">{passingScore}%</Typography>
                    </Grid>
                  )}
                  {maxAttempts !== null && (
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">Max Attempts</Typography>
                      <Typography variant="body1" fontWeight="medium">{maxAttempts}</Typography>
                    </Grid>
                  )}
                  {criteria && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">Criteria</Typography>
                      <Typography variant="body1">{criteria}</Typography>
                    </Grid>
                  )}
                </Grid>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No assessment
                </Typography>
              )}
            </Card>

            {/* Average Feedback Score */}
            <Card sx={{ mb: 3, p: 2 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <StarIcon sx={{ color: '#f59e0b' }} />
                <Typography variant="h6" fontWeight="bold">
                  Average Feedback Score
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2}>
                <Rating value={parseFloat(averageFeedbackScore())} readOnly precision={0.1} />
                <Typography variant="h5" fontWeight="bold">
                  {averageFeedbackScore()} / 5.0
                </Typography>
              </Box>
            </Card>

            {/* Employee Completions Table */}
            <Card sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                  <PeopleIcon sx={{ color: '#114417DB' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Employee Completions ({completions.length})
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<ExcelIcon />}
                  onClick={handleExportExcel}
                  size="small"
                >
                  Export Excel
                </Button>
              </Box>
              
              {loading ? (
                <Typography>Loading...</Typography>
              ) : completions.length === 0 ? (
                <Typography color="text.secondary">No completions yet</Typography>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Employee Name</strong></TableCell>
                        <TableCell><strong>Assessment Score</strong></TableCell>
                        <TableCell><strong>Attempts</strong></TableCell>
                        <TableCell><strong>Feedback Rating</strong></TableCell>
                        <TableCell><strong>Status</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {completions.map((completion) => (
                        <TableRow key={completion.id}>
                          <TableCell>{completion.employee_name || 'N/A'}</TableCell>
                          <TableCell>
                            {completion.score !== null ? `${completion.score}%` : 'N/A'}
                          </TableCell>
                          <TableCell>{getEmployeeAttempts(completion.employee)}</TableCell>
                          <TableCell>
                            {completion.feedback?.rating ? (
                              <Tooltip title="Click to view full feedback">
                                <Box
                                  sx={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
                                  onClick={() => handleFeedbackClick(completion)}
                                >
                                  <Rating value={completion.feedback.rating} readOnly size="small" />
                                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                                    ({completion.feedback.rating}/5)
                                  </Typography>
                                </Box>
                              </Tooltip>
                            ) : (
                              'N/A'
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={completion.passed ? 'Passed' : 'Failed'}
                              size="small"
                              sx={{
                                backgroundColor: completion.passed ? '#10b981' : '#ef4444',
                                color: 'white'
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Card>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<PdfIcon />}
            onClick={handleExportPDF}
            sx={{ backgroundColor: '#114417DB', '&:hover': { backgroundColor: '#0a2f0e' } }}
          >
            Export PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Detail Dialog */}
      <Dialog
        open={showFeedbackDialog}
        onClose={() => setShowFeedbackDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Employee Feedback
            </Typography>
            <IconButton onClick={() => setShowFeedbackDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Employee: {selectedFeedback.employee_name || 'N/A'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Rating
                </Typography>
                <Rating value={selectedFeedback.feedback?.rating || 0} readOnly />
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {selectedFeedback.feedback?.rating || 0} / 5.0
                </Typography>
              </Box>

              {selectedFeedback.feedback?.feedback && (
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Feedback
                  </Typography>
                  <Typography variant="body1">
                    {selectedFeedback.feedback.feedback}
                  </Typography>
                </Box>
              )}

              {selectedFeedback.feedback?.valuableAspect && (
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Most Valuable Aspect
                  </Typography>
                  <Typography variant="body1">
                    {selectedFeedback.feedback.valuableAspect}
                  </Typography>
                </Box>
              )}

              {selectedFeedback.feedback?.difficulty && (
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Difficulty Level
                  </Typography>
                  <Typography variant="body1">
                    {selectedFeedback.feedback.difficulty}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFeedbackDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SessionReport;

