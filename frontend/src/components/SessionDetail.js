import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  School as SchoolIcon,
  VideoLibrary as VideoIcon,
  Description as DescriptionIcon,
  Quiz as QuizIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { buildSessionContentItems } from '../utils/sessionContent';
import CourseRatingFeedback from './CourseRatingFeedback';
import CertificateOfCompletion from './CertificateOfCompletion';

const SessionDetail = ({ session, onBack, onGetStarted, onFeedbackSubmit, isCompleted = false, backLabel, completion, onRetakeAssessment, previousAttempts = [], employeeName }) => {
  const contentItems = useMemo(
    () => buildSessionContentItems(session),
    [session]
  );

  // Get assessment info to check max attempts
  const assessmentInfo = session?.quiz?.assessmentInfo || session?.assessment_info || {};
  const maxAttempts = assessmentInfo.maxAttempts || assessmentInfo.max_attempts || null;
  const passingScore = assessmentInfo.passingScore || assessmentInfo.passing_score || null;
  
  // Check if user can retake (failed and has attempts remaining)
  const canRetake = completion && 
                    !completion.passed && 
                    maxAttempts && 
                    previousAttempts.length < maxAttempts;

  if (!session) {
    return (
      <Box p={3} textAlign="center">
        <Typography variant="h6" color="text.secondary">
          No session selected
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mt: 2 }}
        >
          Back to Sessions
        </Button>
      </Box>
    );
  }

  const getContentIcon = (type) => {
    switch (type) {
      case 'video': return <VideoIcon />;
      case 'presentation': return <DescriptionIcon />;
      case 'document': return <DescriptionIcon />;
      case 'file': return <DescriptionIcon />;
      case 'ai': return <SchoolIcon />;
      case 'interactive': return <PlayIcon />;
      case 'assessment': return <QuizIcon />;
      default: return <SchoolIcon />;
    }
  };

  const getContentColor = (type) => {
    switch (type) {
      case 'video': return '#3b82f6';
      case 'presentation': return '#10b981';
      case 'document': return '#6366f1';
      case 'file': return '#3b82f6';
      case 'ai': return '#8b5cf6';
      case 'interactive': return '#f59e0b';
      case 'assessment': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const downloadItems = contentItems.filter(item => item.downloadable);
  const assessmentItem = contentItems.find(item => item.type === 'assessment');
  const lastAccessedValue =
    session.lastAccessed ||
    session.updatedAt ||
    session.scheduledDateTime ||
    session.dueDateTime ||
    session.createdAt ||
    null;
  const lastAccessedLabel = lastAccessedValue
    ? new Date(lastAccessedValue).toLocaleString()
    : 'Not available';
  const statusColorMap = {
    completed: '#10b981',
    'in-progress': '#f59e0b',
    scheduled: '#3b82f6',
    published: '#6366f1',
    locked: '#ef4444',
  };
  const normalizedStatus = session.status ? session.status.toLowerCase() : 'draft';
  const statusLabel = normalizedStatus
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const statusColor = statusColorMap[normalizedStatus] || '#6366f1';
  const hasDownloadableMaterials = downloadItems.length > 0;

  const getContentUrl = (content) => {
    if (!content) return null;
    return (
      content.dataUrl ||
      content.downloadUrl ||
      content.url ||
      content.link ||
      content.assetUrl ||
      content.path ||
      null
    );
  };

  const handleDownload = (content) => {
    const url = getContentUrl(content);
    if (!url) {
      console.error('No download URL available for content:', content);
      return;
    }

    // For data URLs or regular URLs, try to download
    if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
      // Try fetch first for CORS issues, then fallback to direct link
      if (url.startsWith('data:')) {
        // Data URL - direct download
        const link = document.createElement('a');
        link.href = url;
        link.download = content.title || content.name || 'session-resource';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Regular URL - try fetch then download
        fetch(url)
          .then(response => response.blob())
          .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = content.title || content.name || 'session-resource';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
          })
          .catch(error => {
            console.error('Download failed, trying direct link:', error);
            // Fallback to direct link
            window.open(url, '_blank');
          });
      }
    } else {
      // Direct file path or other URL
      const link = document.createElement('a');
      link.href = url;
      link.download = content.title || content.name || 'session-resource';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Box p={3} maxWidth="960px" sx={{ mx: '10px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* Back to My Sessions */}
          {onBack && (
            <Box mb={2}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={onBack}
                sx={{
                  color: '#114417DB',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#f0fdf4' }
                }}
              >
                {backLabel || 'Back'}
              </Button>
            </Box>
          )}

          <Card sx={{ p: 2, mb: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Session Information
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={4}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Instructor
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {session.instructor || 'HR Team'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Type
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {session.type || 'General'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={statusLabel}
                  sx={{
                    textTransform: 'capitalize',
                    backgroundColor: statusColor,
                    color: 'white'
                  }}
                />
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Last Accessed
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {lastAccessedLabel}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Due Date &amp; Time
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {session.dueDateTime
                    ? new Date(session.dueDateTime).toLocaleString()
                    : session.dueDate && session.dueTime
                    ? `${new Date(session.dueDate).toLocaleDateString()} ${session.dueTime}`
                    : 'Not set'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Key Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                  {session.skills && session.skills.length > 0 ? (
                    session.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        size="small"
                        sx={{ backgroundColor: '#e8f5e9', color: '#166534' }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No skills specified
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Card>

          {/* Session Content (only after completion) */}
          {isCompleted && (
            <Card sx={{ p: 2, mt: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Session Content
              </Typography>
              {downloadItems.length === 0 && !assessmentItem ? (
                <Typography variant="body2" color="text.secondary">
                  No downloadable content available for this session.
                </Typography>
              ) : (
                <List>
                  {downloadItems.map((content) => {
                    const url = getContentUrl(content);
                    return (
                      <ListItem key={content.id} sx={{ px: 0 }}>
                        <ListItemText
                          primary={content.title}
                          secondary={content.description || `${content.size || ''}`.trim()}
                        />
                        {url && (
                          <Button
                            variant="outlined"
                            onClick={() => handleDownload(content)}
                            sx={{ ml: 2 }}
                          >
                            Download
                          </Button>
                        )}
                      </ListItem>
                    );
                  })}

                  {assessmentItem && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={assessmentItem.title || 'Assessment'}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Assessment attached to this session
                            </Typography>
                            {completion && (
                              <Box mt={1}>
                                <Typography variant="body2" color="text.secondary">
                                  Your Score: {completion.score !== null && completion.score !== undefined ? `${completion.score}%` : 'N/A'}
                                  {completion.passed !== undefined && (
                                    <Chip
                                      label={completion.passed ? 'Passed' : 'Failed'}
                                      size="small"
                                      sx={{
                                        ml: 1,
                                        backgroundColor: completion.passed ? '#e8f5e9' : '#fee2e2',
                                        color: completion.passed ? '#166534' : '#991b1b'
                                      }}
                                    />
                                  )}
                                </Typography>
                                {completion.attempt_number && completion.attempt_number > 1 && (
                                  <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                                    Attempt #{completion.attempt_number} - Completed on {completion.completed_at ? new Date(completion.completed_at).toLocaleString() : 'N/A'}
                                  </Typography>
                                )}
                                {previousAttempts && previousAttempts.length > 0 && (
                                  <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                                    Total Attempts: {previousAttempts.length + 1}
                                  </Typography>
                                )}
                              </Box>
                            )}
                          </Box>
                        }
                      />
                      {canRetake && onRetakeAssessment && (
                        <Button
                          variant="contained"
                          onClick={() => onRetakeAssessment(session)}
                          sx={{ ml: 2, backgroundColor: '#114417DB', '&:hover': { backgroundColor: '#0a2f0e' } }}
                        >
                          Retake Assessment ({previousAttempts.length + 1}/{maxAttempts})
                        </Button>
                      )}
                      {completion && !completion.passed && !canRetake && maxAttempts && (
                        <Typography variant="body2" color="error" sx={{ ml: 2 }}>
                          Max attempts ({maxAttempts}) reached
                        </Typography>
                      )}
                    </ListItem>
                  )}
                </List>
              )}
            </Card>
          )}

          {/* Certificate Section - Show if certificate is configured AND employee passed */}
          {isCompleted && completion && completion.passed && (
            (() => {
              // Check if certificate is configured for this session
              const hasCertConfig = Boolean(
                session?.has_certificate || 
                session?.hasCertificate || 
                session?.certification || 
                session?.certificate
              );
              
              if (!hasCertConfig) {
                return (
                  <Card sx={{ p: 3, mt: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Certificate of Completion
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                      No certificate configured for this session.
                    </Typography>
                  </Card>
                );
              }
              
              return (
                <Card sx={{ p: 3, mt: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Certificate of Completion
                  </Typography>
                  <CertificateOfCompletion
                    session={session}
                    completion={completion}
                    employeeName={employeeName}
                  />
                </Card>
              );
            })()
          )}

          {/* Start Session Button (hidden after completion) */}
          {!isCompleted && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Button
                variant="contained"
                startIcon={<PlayIcon />}
                onClick={() => onGetStarted(session)}
                sx={{ 
                  backgroundColor: '#10b981', 
                  '&:hover': { backgroundColor: '#059669' },
                  py: 1.5,
                  px: 4
                }}
              >
                {session.status === 'in-progress' ? 'Resume Session' : 'Start Session'}
              </Button>
            </Box>
          )}

          {/* Feedback Section - Only show after session is completed */}
          {isCompleted && (
            <Box mt={4}>
              <CourseRatingFeedback
                session={session}
                onSubmit={onFeedbackSubmit}
                isViewOnly={false}
                sectionTitle="Session Feedback"
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default SessionDetail;

