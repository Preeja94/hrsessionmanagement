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
    completed: '#114417DB',
    'in-progress': '#f59e0b',
    scheduled: '#3b82f6',
    published: '#114417DB',
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

    if (activeContent.type === 'video') {
      // Try multiple ways to get video URL
      let videoUrl = activeContentUrl;
      
      // Debug logging
      console.log('Video content search:', {
        activeContentUrl,
        activeContentTitle: activeContent.title,
        sessionFiles: session?.files?.length,
        sessionCreationMode: session?.creationMode
      });
      
      // If no direct URL, check if we can get it from session files
      if (!videoUrl && session?.files) {
        // Try to match by title/name first
        const matchedByName = session.files.find(f => {
          const fileName = typeof f === 'string' ? f : (f.name || '');
          return fileName === activeContent.title || fileName.includes(activeContent.title);
        });
        
        if (matchedByName) {
          if (typeof matchedByName === 'string') {
            videoUrl = matchedByName;
          } else {
            videoUrl = matchedByName.dataUrl || matchedByName.url || matchedByName.downloadUrl || matchedByName.link;
          }
        }
        
        // If still no match, try by file type/extension
        if (!videoUrl) {
          const videoFile = session.files.find(f => {
            const fileName = typeof f === 'string' ? f : (f.name || '');
            const fileType = typeof f === 'object' ? (f.type || '') : '';
            const nameLower = fileName.toLowerCase();
            return nameLower.endsWith('.mp4') || 
                   nameLower.endsWith('.avi') || 
                   nameLower.endsWith('.mov') ||
                   nameLower.endsWith('.webm') ||
                   nameLower.endsWith('.mkv') ||
                   fileType.startsWith('video/') ||
                   (typeof f === 'object' && f.dataUrl && f.dataUrl.startsWith('data:video/'));
          });
          
          if (videoFile) {
            if (typeof videoFile === 'string') {
              videoUrl = videoFile;
            } else {
              videoUrl = videoFile.dataUrl || videoFile.url || videoFile.downloadUrl || videoFile.link;
              console.log('Found video file:', {
                name: videoFile.name,
                hasDataUrl: !!videoFile.dataUrl,
                hasUrl: !!videoFile.url,
                hasDownloadUrl: !!videoFile.downloadUrl
              });
            }
          }
        }
      }
      
      // Also check creationMode for video type
      if (!videoUrl && session?.creationMode === 'video') {
        // Try to find video in files
        const videoFile = session?.files?.find(f => {
          const fileName = typeof f === 'string' ? f : (f.name || '');
          return fileName.toLowerCase().includes('video') || 
                 (typeof f === 'object' && f.type && f.type.startsWith('video/'));
        });
        if (videoFile) {
          videoUrl = typeof videoFile === 'object' ? (videoFile.dataUrl || videoFile.url) : videoFile;
        }
      }
      
      console.log('Final video URL:', videoUrl ? videoUrl.substring(0, 50) + '...' : 'NOT FOUND');
      
      if (videoUrl) {
        return (
          <Box
            sx={{
              height: 500,
              backgroundColor: '#0f172a',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              overflow: 'hidden',
              border: '1px solid #e5e7eb'
            }}
          >
            <video
              controls
              autoPlay={false}
              preload="metadata"
              src={videoUrl}
              style={{ 
                width: '100%', 
                height: '100%',
                objectFit: 'contain'
              }}
              onError={(e) => {
                console.error('Video load error:', e);
                console.error('Video URL:', videoUrl);
                console.error('Active content:', activeContent);
              }}
            >
              Your browser does not support the video tag.
            </video>
          </Box>
        );
      } else {
        // Show placeholder if video URL not found
        return (
          <Box
            sx={{
              height: 500,
              backgroundColor: '#f8fafc',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              border: '2px dashed #d1d5db',
              textAlign: 'center',
              px: 4
            }}
          >
            <Box>
              <PlayIcon sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Video not available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                The video file could not be loaded. Please contact support.
              </Typography>
            </Box>
          </Box>
        );
      }
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
      // Get AI content from activeContent (passed from sessionContent.js)
      const aiContent = activeContent.aiContent || session?.aiContent?.content || session?.resumeState?.aiContent?.content || '';
      const aiTitle = activeContent.aiTitle || session?.aiContent?.title || 'AI Generated Content';
      const aiKeywords = activeContent.aiKeywords || session?.aiContent?.keywords || session?.resumeState?.aiKeywords || '';
      
      if (!aiContent) {
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
              AI generated learning material is attached to this session.
            </Typography>
          </Box>
        );
      }
      
      // Create HTML content for PDF display
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>${aiTitle}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 40px;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
              }
              h1 {
                color: #114417DB;
                border-bottom: 2px solid #114417DB;
                padding-bottom: 10px;
              }
              h2 {
                color: #1f2937;
                margin-top: 30px;
              }
              .keywords {
                background-color: #f0fdf4;
                padding: 15px;
                border-left: 4px solid #114417DB;
                margin: 20px 0;
                border-radius: 4px;
              }
              .content {
                margin-top: 20px;
                white-space: pre-wrap;
                text-align: justify;
              }
            </style>
          </head>
          <body>
            <h1>${aiTitle}</h1>
            ${aiKeywords ? `<div class="keywords"><strong>Keywords:</strong> ${aiKeywords}</div>` : ''}
            <div class="content">${aiContent.replace(/\n/g, '<br>')}</div>
          </body>
        </html>
      `;
      
      // Convert HTML to blob and create data URL
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const pdfUrl = URL.createObjectURL(blob);
      
      // Display as PDF-like document using iframe
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
            title="AI Generated Content"
            src={pdfUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
          />
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

  // Format due date
  const formatDueDate = () => {
    if (session.dueDateTime) {
      return new Date(session.dueDateTime).toLocaleDateString();
    }
    if (session.dueDate) {
      return new Date(session.dueDate).toLocaleDateString();
    }
    return 'Not specified';
  };

  // Format start date
  const formatStartDate = () => {
    if (session.scheduledDateTime) {
      return new Date(session.scheduledDateTime).toLocaleDateString();
    }
    if (session.scheduledDate) {
      return new Date(session.scheduledDate).toLocaleDateString();
    }
    if (session.publishedAt) {
      return new Date(session.publishedAt).toLocaleDateString();
    }
    return 'Not specified';
  };

  // Render Session Information component
  const renderSessionInformation = () => {
    if (isCompleted) return null; // Don't show after completion
    
    return (
      <Card sx={{ p: 3, mb: 4, backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3, color: '#1f2937' }}>
          Session Information
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={4}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Session Name
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {session.title}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Type
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {session.type || 'General'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Start Date
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatStartDate()}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Due Date
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {formatDueDate()}
            </Typography>
          </Box>
        </Box>
        {session.description && (
          <Box mt={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1">
              {session.description}
            </Typography>
          </Box>
        )}
      </Card>
    );
  };

  if (currentView === 'assessment') {
    return (
      <Box>
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
        {/* Session Information */}
        {renderSessionInformation()}
        <KnowledgeAssessment
          session={session}
          onComplete={handleAssessmentComplete}
          onBack={() => setCurrentView('content')}
          isViewOnly={isCompleted}
        />
      </Box>
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
      {/* Header with Back Button at Top */}
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

      {/* Session Information - shown on all screens until completion */}
      {renderSessionInformation()}

      {/* Current Content */}
      <Card sx={{ p: 3, mb: 4 }}>
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

        {/* Navigation - Centered */}
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <Button
            variant="contained"
            size="large"
            endIcon={currentIndex === totalPages - 1 ? <CheckCircleIcon /> : <ArrowForwardIcon />}
            onClick={handleNext}
            sx={{ 
              backgroundColor: '#114417DB', 
              '&:hover': { backgroundColor: '#0a2f0e' },
              px: 4,
              py: 1.5
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
      </Card>

    </Box>
  );
};

export default SessionContentView;

