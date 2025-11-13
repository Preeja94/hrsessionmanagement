import React, { useMemo, useState } from 'react';
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
  Chip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayIcon,
  Description as DescriptionIcon,
  Quiz as QuizIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import KnowledgeAssessment from './KnowledgeAssessment';
import CertificateOfCompletion from './CertificateOfCompletion';
import CourseRatingFeedback from './CourseRatingFeedback';
import { buildSessionContentItems } from '../utils/sessionContent';

const SessionContentView = ({ session, onComplete, onBack }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [currentView, setCurrentView] = useState('content'); // 'content', 'assessment', 'certificate', 'feedback'
  const [isCompleted, setIsCompleted] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState(null);

  const hasCertificateStep = Boolean(
    session?.hasCertificate ||
    session?.certificate ||
    session?.certificationId ||
    session?.hasCertification
  );

  const allContentItems = useMemo(
    () => buildSessionContentItems(session),
    [session]
  );

  const assessmentItem = useMemo(
    () => allContentItems.find(item => item.type === 'assessment'),
    [allContentItems]
  );

  const sessionContent = useMemo(() => {
    const filtered = allContentItems.filter(item => item.type !== 'assessment');
    if (filtered.length > 0) {
      return filtered;
    }
    return allContentItems.length > 0
      ? allContentItems
      : [{
          id: 'placeholder-content',
          type: 'info',
          title: 'Session content',
          description: 'Uploaded session materials will appear here.',
          downloadable: false,
        }];
  }, [allContentItems]);

  const totalPages = sessionContent.length;
  const currentIndex = Math.min(currentPage, totalPages - 1);
  const activeContent = sessionContent[currentIndex] || sessionContent[0];
  const progress = ((currentIndex + 1) / totalPages) * 100;
  const statusColorMap = {
    completed: '#10b981',
    'in-progress': '#f59e0b',
    scheduled: '#3b82f6',
    published: '#6366f1',
    locked: '#ef4444',
  };
  const normalizedStatus = session?.status ? session.status.toLowerCase() : 'draft';
  const statusLabel = normalizedStatus
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const statusColor = statusColorMap[normalizedStatus] || '#6366f1';
  const lastAccessedValue =
    session?.lastAccessed ||
    session?.updatedAt ||
    session?.scheduledDateTime ||
    session?.createdAt ||
    null;
  const lastAccessedLabel = lastAccessedValue
    ? new Date(lastAccessedValue).toLocaleDateString()
    : 'N/A';

  const handleCompleteContent = () => {
    if (assessmentItem) {
      setCurrentView('assessment');
      return;
    }
    if (hasCertificateStep) {
      setCurrentView('certificate');
      return;
    }
    setCurrentView('feedback');
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      handleCompleteContent();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleAssessmentComplete = (score) => {
    setAssessmentScore(score);
    if (hasCertificateStep) {
      setCurrentView('certificate');
    } else {
      setCurrentView('feedback');
    }
  };

  const handleCertificateNext = () => {
    setCurrentView('feedback');
  };
  const handleFeedbackSubmit = (feedback) => {
    setIsCompleted(true);
    if (onComplete) {
      onComplete({
        session: {
          ...session,
          hasCertificate: hasCertificateStep || session?.hasCertificate || session?.certificate,
          certificate: hasCertificateStep || session?.certificate
        },
        score: assessmentScore,
        assessment: assessmentItem || null,
        feedback
      });
    }
  };

  const getContentIcon = (type) => {
    switch (type) {
      case 'video': return <PlayIcon />;
      case 'presentation': return <DescriptionIcon />;
      case 'interactive': return <PlayIcon />;
      case 'assessment': return <QuizIcon />;
      case 'document': return <DescriptionIcon />;
      case 'file': return <DescriptionIcon />;
      case 'ai': return <DescriptionIcon />;
      default: return <PlayIcon />;
    }
  };

  const getContentColor = (type) => {
    switch (type) {
      case 'video': return '#3b82f6';
      case 'presentation': return '#10b981';
      case 'interactive': return '#f59e0b';
      case 'assessment': return '#ef4444';
      case 'document': return '#6366f1';
      case 'file': return '#3b82f6';
      case 'ai': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

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

  const activeContentUrl = getContentUrl(activeContent);

  const renderActiveContentMedia = () => {
    if (!activeContent) {
      return null;
    }

    if (activeContent.type === 'video' && activeContentUrl) {
      return (
        <Box
          sx={{
            height: 360,
            backgroundColor: '#0f172a',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            overflow: 'hidden',
          }}
        >
          <video
            controls
            src={activeContentUrl}
            style={{ width: '100%', height: '100%' }}
          >
            Your browser does not support the video tag.
          </video>
        </Box>
      );
    }

    if (
      activeContentUrl &&
      (activeContent.type === 'document' ||
        activeContent.type === 'presentation' ||
        activeContent.type === 'file')
    ) {
      // Check if it's a PDF - PDFs need special handling
      const isPDF = activeContent.name?.toLowerCase().endsWith('.pdf') || 
                    activeContent.type === 'application/pdf' ||
                    activeContentUrl.includes('.pdf') ||
                    activeContentUrl.startsWith('data:application/pdf');
      
      if (isPDF) {
        // For PDFs, use embed with page view
        return (
          <Box
            sx={{
              height: '70vh',
              minHeight: 500,
              backgroundColor: '#f8fafc',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}
          >
            <embed
              src={`${activeContentUrl}#page=1&toolbar=1&navpanes=1&scrollbar=1`}
              type="application/pdf"
              style={{ width: '100%', height: '100%' }}
              title={activeContent.title || 'PDF Document'}
            />
          </Box>
        );
      }
      
      // For other documents (Word, PowerPoint, etc.), use iframe
      return (
        <Box
          sx={{
            height: '70vh',
            minHeight: 500,
            backgroundColor: '#f8fafc',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
          }}
        >
          <iframe
            title={activeContent.title || 'Document Preview'}
            src={activeContentUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
          />
        </Box>
      );
    }

    if (activeContent.type === 'ai') {
      return (
        <Box
          sx={{
            backgroundColor: '#f0f9ff',
            borderRadius: 2,
            mb: 3,
            p: 3,
            border: '1px solid #bae6fd',
          }}
        >
          <Typography variant="body1" color="text.primary">
            AI generated learning material is attached to this session. You can review the
            summary and download detailed resources from the session details page.
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          height: 300,
          backgroundColor: '#f8f9fa',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed #d1d5db',
          mb: 3,
          textAlign: 'center',
          px: 4
        }}
      >
        <Box sx={{ maxWidth: 420 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Uploaded content placeholder
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Uploaded materials for this session will display here. Downloadable assets are available from the session detail page.
          </Typography>
        </Box>
      </Box>
    );
  };

  const handleActiveContentDownload = () => {
    const url = getContentUrl(activeContent);
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    link.download = activeContent.title || 'session-resource';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  if (currentView === 'certificate' && hasCertificateStep) {
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
        onBack={() => setCurrentView(hasCertificateStep ? 'certificate' : 'assessment')}
        backLabel={hasCertificateStep ? 'Back to Certificate' : 'Back to Assessment'}
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
        <Typography variant="body1" color="text.secondary" mb={2}>
          Interactive Learning Content
        </Typography>
        {onBack && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{ color: '#3b82f6' }}
          >
            Back to My Sessions
          </Button>
        )}
      </Box>

      {/* Progress */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="body2" fontWeight="medium">
            Progress: {currentIndex + 1} of {totalPages}
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
        <Stepper activeStep={currentIndex} alternativeLabel>
          {sessionContent.map((content) => (
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
              backgroundColor: getContentColor(activeContent?.type),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              mr: 2
            }}
          >
            {getContentIcon(activeContent?.type)}
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {activeContent?.title}
            </Typography>
            {activeContent?.description && (
              <Typography variant="body2" color="text.secondary">
                {activeContent.description}
              </Typography>
            )}
          </Box>
        </Box>

        {activeContent?.meta && (
          <Box mb={3}>
            <Typography variant="caption" color="text.secondary">
              {activeContent.meta}
            </Typography>
          </Box>
        )}

        {renderActiveContentMedia()}
        {activeContentUrl && (
          <Box display="flex" justifyContent="flex-end" mb={3}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleActiveContentDownload}
            >
              Download Resource
            </Button>
          </Box>
        )}

        {/* Navigation */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>

          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              endIcon={currentIndex === totalPages - 1 ? <CheckCircleIcon /> : <ArrowForwardIcon />}
              onClick={handleNext}
              sx={{ 
                backgroundColor: currentIndex === totalPages - 1 ? '#10b981' : '#3b82f6', 
                '&:hover': { backgroundColor: currentIndex === totalPages - 1 ? '#059669' : '#2563eb' }
              }}
            >
              {currentIndex === totalPages - 1
                ? assessmentItem
                  ? 'Start Assessment'
                  : hasCertificateStep
                    ? 'Proceed to Certificate'
                    : 'Finish Content'
                : 'Next'}
            </Button>
          </Box>
        </Box>
      </Card>

      {/* Session Summary */}
      <Card sx={{ p: 3, mb: 3 }}>
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
              Duration
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {session.duration || 'Self-paced'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={statusLabel}
              sx={{
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
        </Box>
      </Card>

    </Box>
  );
};

export default SessionContentView;

