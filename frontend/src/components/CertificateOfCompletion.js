import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Divider
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

const CertificateOfCompletion = ({ session, onNext, onBack }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleDownload = () => {
    // In a real application, this would generate and download a PDF certificate
    alert('Certificate downloaded successfully!');
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
          Back to Assessment
        </Button>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Certificate of Completion
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Congratulations on completing this session!
        </Typography>
      </Box>

      {/* Certificate */}
      <Card sx={{ 
        p: 4, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
      }}>
        <Box mb={4}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            CERTIFICATE OF COMPLETION
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            This is to certify that
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Luke Wilson
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            has successfully completed the course
          </Typography>
        </Box>

        <Box mb={4}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {session.title}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {session.description}
          </Typography>
        </Box>

        <Divider sx={{ my: 3, backgroundColor: 'rgba(255,255,255,0.3)' }} />

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }} gutterBottom>
                Instructor
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {session.instructor}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }} gutterBottom>
                Score
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                87%
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }} gutterBottom>
                Date Completed
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {currentDate}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="center" mb={3}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 40 }} />
          </Box>
        </Box>

        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Certificate ID: CERT-{Date.now().toString().slice(-8)}
        </Typography>
      </Card>

      {/* Actions */}
      <Box mt={4} display="flex" justifyContent="center" gap={2}>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={{ 
            borderColor: '#3b82f6',
            color: '#3b82f6',
            '&:hover': {
              borderColor: '#2563eb',
              backgroundColor: '#f3f4f6'
            }
          }}
        >
          Download Certificate
        </Button>
        <Button
          variant="contained"
          onClick={onNext}
          sx={{ 
            backgroundColor: '#10b981', 
            '&:hover': { backgroundColor: '#059669' },
            px: 4
          }}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
};

export default CertificateOfCompletion;

