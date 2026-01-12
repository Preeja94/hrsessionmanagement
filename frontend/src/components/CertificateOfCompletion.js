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

const CertificateOfCompletion = ({ session, onNext, onBack, completion, employeeName }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Get certificate configuration from session (can be in certificate or certification field)
  const certConfig = session?.certificate || session?.certification || null;
  let certTemplate = certConfig?.template || null;
  const certFields = certConfig?.fields || {};
  
  // If template is just an ID, resolve it to the full template object
  if (certTemplate && (typeof certTemplate === 'number' || (typeof certTemplate === 'string' && /^\d+$/.test(certTemplate)))) {
    const certificateTemplates = [
      { id: 1, name: 'Certificate of Appreciation', title: 'CERTIFICATE', subtitle: 'OF APPRECIATION', design: 'gradient-border', borderColors: ['#8b5cf6', '#f59e0b'] },
      { id: 2, name: 'Certificate of Excellence', title: 'CERTIFICATE', subtitle: 'Meaningful Leader Certification', design: 'green-gold', borderColors: ['#10b981', '#fbbf24'], hasMedal: true },
      { id: 3, name: 'Certificate of Completion', title: 'CERTIFICATE', subtitle: 'OF COMPLETION', design: 'minimal', borderColors: ['#10b981'] },
      { id: 4, name: 'Certificate of Achievement', title: 'CERTIFICATE', subtitle: 'OF ACHIEVEMENT', design: 'gradient-vibrant', borderColors: ['#8b5cf6', '#f59e0b', '#fbbf24'], hasMedal: true },
      { id: 5, name: 'Certificate Vertical', title: 'CERTIFICATE', subtitle: 'OF COMPLETION', design: 'vertical-red', borderColors: ['#ef4444'] },
      { id: 6, name: 'Certificate Simple', title: 'CERTIFICATE', subtitle: 'Creating Power Manager for Leader', design: 'simple-white', borderColors: ['#e5e7eb'], hasMedal: true }
    ];
    const templateId = typeof certTemplate === 'string' ? parseInt(certTemplate, 10) : certTemplate;
    certTemplate = certificateTemplates.find(t => t.id === templateId) || certTemplate;
  }

  // Get actual score from completion data, fallback to session score
  const actualScore = completion?.score ?? session?.score ?? session?.lastCompletionScore ?? null;
  const completionDate = completion?.completed_at 
    ? new Date(completion.completed_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : currentDate;
  
  // Get employee name from completion or use provided prop
  const displayName = employeeName || completion?.employee_name || certFields.userName || 'Employee';

  // Get certificate text from fields first (admin customizations), then template, then defaults
  // This ensures admin-saved fields take priority over template defaults
  const certTitle = certFields.title || certTemplate?.title || 'CERTIFICATE';
  const certSubtitle = certFields.subtitle || certTemplate?.subtitle || 'OF COMPLETION';
  const recipientLabel = certFields.recipientLabel || 'Presented to';
  const descriptionText = certFields.descriptionText || 'who gave the best and completed the course';
  const authorisedBy = certFields.authorisedBy || certFields.instructor || session?.created_by_name || 'HR Team';
  
  // Use date from fields if provided, otherwise use completion date
  const dateOfIssue = certFields.dateOfIssue || completionDate;

  // Get template design styles - match exactly what admin preview shows
  const getTemplateStyles = () => {
    if (!certTemplate || !certTemplate.design) {
      return {
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb'
      };
    }

    const baseStyle = {
      backgroundColor: '#ffffff',
      position: 'relative',
    };

    switch (certTemplate.design) {
      case 'gradient-border':
        return {
          ...baseStyle,
          borderLeft: `4px solid ${certTemplate.borderColors[0] || '#8b5cf6'}`,
          borderBottom: `4px solid ${certTemplate.borderColors[1] || '#f59e0b'}`,
        };
      case 'green-gold':
        return {
          ...baseStyle,
          border: `3px solid ${certTemplate.borderColors[0] || '#10b981'}`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            border: `2px solid ${certTemplate.borderColors[1] || '#fbbf24'}`,
            borderStyle: 'dashed',
            margin: '8px'
          }
        };
      case 'minimal':
        return {
          ...baseStyle,
          borderTop: `2px solid ${certTemplate.borderColors[0] || '#10b981'}`,
        };
      case 'gradient-vibrant':
        return {
          ...baseStyle,
          borderLeft: `4px solid ${certTemplate.borderColors[0] || '#8b5cf6'}`,
          borderBottom: `4px solid ${certTemplate.borderColors[1] || '#f59e0b'}`,
          borderRight: `2px solid ${certTemplate.borderColors[2] || '#fbbf24'}`
        };
      case 'vertical-red':
        return {
          ...baseStyle,
          borderTop: `4px solid ${certTemplate.borderColors[0] || '#ef4444'}`,
          borderLeft: `4px solid ${certTemplate.borderColors[0] || '#ef4444'}`
        };
      case 'simple-white':
        return {
          ...baseStyle,
          border: '1px solid #e5e7eb'
        };
      default:
        return baseStyle;
    }
  };

  const templateStyles = getTemplateStyles();

  const handleDownload = async () => {
    try {
      // Check if jsPDF is available
      let jsPDF;
      try {
        jsPDF = (await import('jspdf')).default;
      } catch (e) {
        console.warn('jsPDF not available, using alternative download method');
        downloadCertificateAsImage();
        return;
      }

      // Generate PDF certificate
      const doc = new jsPDF('landscape', 'mm', 'a4');
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      // White background (matching admin preview)
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, width, height, 'F');

      // Draw borders based on template design
      if (certTemplate?.borderColors && certTemplate.borderColors.length > 0) {
        const colors = certTemplate.borderColors;
        if (certTemplate.design === 'gradient-border' && colors.length >= 2) {
          doc.setDrawColor(parseInt(colors[0].substring(1, 3), 16), parseInt(colors[0].substring(3, 5), 16), parseInt(colors[0].substring(5, 7), 16));
          doc.setLineWidth(4);
          doc.line(0, 0, 0, height); // Left border
          doc.setDrawColor(parseInt(colors[1].substring(1, 3), 16), parseInt(colors[1].substring(3, 5), 16), parseInt(colors[1].substring(5, 7), 16));
          doc.line(0, height, width, height); // Bottom border
        } else if (certTemplate.design === 'minimal' && colors.length >= 1) {
          doc.setDrawColor(parseInt(colors[0].substring(1, 3), 16), parseInt(colors[0].substring(3, 5), 16), parseInt(colors[0].substring(5, 7), 16));
          doc.setLineWidth(2);
          doc.line(0, 0, width, 0); // Top border
        }
        // Add more design cases as needed
      }

      // Title (black text on white)
      doc.setFontSize(32);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(certTitle, width / 2, 40, { align: 'center' });

      // Subtitle
      if (certSubtitle) {
        doc.setFontSize(18);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(0, 0, 0);
        doc.text(`-${certSubtitle}-`, width / 2, 55, { align: 'center' });
      }

      // Decorative line
      doc.setDrawColor(251, 191, 36); // Gold color
      doc.setLineWidth(1);
      doc.line(width * 0.2, 65, width * 0.8, 65);

      // Recipient label
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128); // Gray
      doc.text(recipientLabel, width / 2, 75, { align: 'center' });

      // Employee Name (black, bold)
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(displayName, width / 2, 85, { align: 'center' });

      // Description text
      doc.setFontSize(12);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(107, 114, 128);
      doc.text(descriptionText, width / 2, 95, { align: 'center' });

      // Session Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      const sessionTitle = session?.title || 'Training Session';
      doc.text(sessionTitle, width / 2, 105, { align: 'center', maxWidth: width - 40 });

      // Details at bottom
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      const detailsY = 130;
      doc.text('Date of Issue', 30, detailsY);
      doc.text(dateOfIssue, 30, detailsY + 5);
      doc.text('Authorised by', width - 30, detailsY, { align: 'right' });
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'bold');
      doc.text(authorisedBy, width - 30, detailsY + 5, { align: 'right' });

      // Score if available
      if (actualScore !== null) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(107, 114, 128);
        doc.text('Score', width / 2, detailsY, { align: 'center' });
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`${actualScore}%`, width / 2, detailsY + 5, { align: 'center' });
      }

      // Certificate ID
      const certId = `CERT-${completion?.id ? completion.id.toString().padStart(8, '0') : Date.now().toString().slice(-8)}`;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text(`Certificate ID: ${certId}`, width / 2, height - 20, { align: 'center' });

      // Download
      doc.save(`Certificate_${sessionTitle.replace(/\s+/g, '_')}_${displayName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      downloadCertificateAsImage();
    }
  };

  const downloadCertificateAsImage = () => {
    // Fallback: Create a canvas and download as image
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw borders based on template
    if (certTemplate?.borderColors && certTemplate.borderColors.length > 0) {
      const colors = certTemplate.borderColors;
      ctx.strokeStyle = colors[0];
      ctx.lineWidth = 4;
      if (certTemplate.design === 'gradient-border' && colors.length >= 2) {
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = colors[1];
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.stroke();
      } else if (certTemplate.design === 'minimal' && colors.length >= 1) {
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, 0);
        ctx.stroke();
      }
    }

    // Draw text (black on white)
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(certTitle, canvas.width / 2, 100);

    if (certSubtitle) {
      ctx.font = 'italic 28px Arial';
      ctx.fillText(`-${certSubtitle}-`, canvas.width / 2, 130);
    }

    // Decorative line
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.2, 150);
    ctx.lineTo(canvas.width * 0.8, 150);
    ctx.stroke();

    ctx.fillStyle = '#6b7280';
    ctx.font = '20px Arial';
    ctx.fillText(recipientLabel, canvas.width / 2, 170);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 36px Arial';
    ctx.fillText(displayName, canvas.width / 2, 220);

    ctx.fillStyle = '#6b7280';
    ctx.font = '20px Arial';
    ctx.font = 'italic 20px Arial';
    ctx.fillText(descriptionText, canvas.width / 2, 260);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 28px Arial';
    const sessionTitle = session?.title || 'Training Session';
    ctx.fillText(sessionTitle, canvas.width / 2, 320);

    // Bottom details
    ctx.fillStyle = '#6b7280';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Date of Issue', 150, 400);
    ctx.fillText(dateOfIssue, 150, 420);
    
    ctx.textAlign = 'right';
    ctx.fillText('Authorised by', canvas.width - 150, 400);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(authorisedBy, canvas.width - 150, 420);

    if (actualScore !== null) {
      ctx.textAlign = 'center';
      ctx.fillStyle = '#6b7280';
      ctx.font = '16px Arial';
      ctx.fillText('Score', canvas.width / 2, 400);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`${actualScore}%`, canvas.width / 2, 420);
    }

    // Convert to image and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Certificate_${sessionTitle.replace(/\s+/g, '_')}.png`;
      link.click();
      URL.revokeObjectURL(url);
    });
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

      {/* Certificate - Match admin preview exactly */}
      <Card sx={{ 
        position: 'relative',
        border: '2px solid #8b5cf6',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.2)',
        maxWidth: '800px',
        mx: 'auto'
      }}>
        <Box
          sx={{
            aspectRatio: '4/3',
            position: 'relative',
            backgroundColor: '#ffffff',
            p: 3,
            ...(certTemplate?.design === 'gradient-border' && certTemplate.borderColors && certTemplate.borderColors.length >= 2 && {
              borderLeft: `4px solid ${certTemplate.borderColors[0]}`,
              borderBottom: `4px solid ${certTemplate.borderColors[1]}`,
            }),
            ...(certTemplate?.design === 'green-gold' && certTemplate.borderColors && certTemplate.borderColors.length >= 2 && {
              border: `3px solid ${certTemplate.borderColors[0]}`,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: `2px solid ${certTemplate.borderColors[1]}`,
                borderStyle: 'dashed',
                margin: '8px'
              }
            }),
            ...(certTemplate?.design === 'minimal' && certTemplate.borderColors && certTemplate.borderColors.length >= 1 && {
              borderTop: `2px solid ${certTemplate.borderColors[0]}`,
            }),
            ...(certTemplate?.design === 'gradient-vibrant' && certTemplate.borderColors && certTemplate.borderColors.length >= 3 && {
              borderLeft: `4px solid ${certTemplate.borderColors[0]}`,
              borderBottom: `4px solid ${certTemplate.borderColors[1]}`,
              borderRight: `2px solid ${certTemplate.borderColors[2]}`
            }),
            ...(certTemplate?.design === 'vertical-red' && certTemplate.borderColors && certTemplate.borderColors.length >= 1 && {
              borderTop: `4px solid ${certTemplate.borderColors[0]}`,
              borderLeft: `4px solid ${certTemplate.borderColors[0]}`
            }),
            ...(certTemplate?.design === 'simple-white' && {
              border: '1px solid #e5e7eb'
            })
          }}
        >
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
            {/* Top Section - Certificate Heading */}
            <Box sx={{ textAlign: 'center', mb: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  fontStyle: 'italic',
                  color: '#000000',
                  fontSize: '1.2rem',
                  mb: 0.5,
                  letterSpacing: '1px'
                }}
              >
                {certTitle}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: '#000000',
                  fontSize: '0.9rem',
                  display: 'block',
                  mb: 2
                }}
              >
                {certSubtitle ? `-${certSubtitle}-` : ''}
              </Typography>
              
              {/* Decorative Line */}
              <Box
                sx={{
                  width: '60%',
                  height: '1px',
                  backgroundColor: '#fbbf24',
                  margin: '0 auto 1.5rem',
                  opacity: 0.6
                }}
              />
              
              {/* Presented to */}
              <Typography
                variant="body2"
                sx={{
                  color: '#6b7280',
                  fontSize: '0.9rem',
                  display: 'block',
                  mb: 1
                }}
              >
                {recipientLabel}
              </Typography>
              
              {/* User Name */}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: '#000000',
                  fontSize: '1.8rem',
                  mb: 1
                }}
              >
                {displayName}
              </Typography>
              
              {/* Description */}
              <Typography
                variant="body2"
                sx={{
                  color: '#6b7280',
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                  display: 'block',
                  mb: 2
                }}
              >
                {descriptionText}
              </Typography>

              {/* Session Title */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: '#000000',
                  fontSize: '1.3rem',
                  mt: 2
                }}
              >
                {session?.title || 'Training Session'}
              </Typography>
            </Box>
            
            {/* Bottom Section - Date, Authorisation, Score */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 'auto' }}>
              {/* Left - Date of Issue */}
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#6b7280',
                    fontSize: '0.75rem',
                    display: 'block',
                    mb: 0.5
                  }}
                >
                  Date of Issue
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#000000',
                    fontSize: '0.85rem',
                    fontWeight: 'medium'
                  }}
                >
                  {dateOfIssue}
                </Typography>
              </Box>
              
              {/* Center - Score (if available) */}
              {actualScore !== null && (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#6b7280',
                      fontSize: '0.75rem',
                      display: 'block',
                      mb: 0.5
                    }}
                  >
                    Score
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#000000',
                      fontSize: '0.85rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {actualScore}%
                  </Typography>
                </Box>
              )}
              
              {/* Right - Authorised by */}
              <Box sx={{ textAlign: 'right' }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#6b7280',
                    fontSize: '0.75rem',
                    display: 'block',
                    mb: 0.5
                  }}
                >
                  Authorised by
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#000000',
                    fontSize: '0.85rem',
                    fontWeight: 'medium'
                  }}
                >
                  {authorisedBy}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        
        {/* Certificate ID at bottom */}
        <Box sx={{ p: 1, textAlign: 'center', backgroundColor: '#f8f9fa' }}>
          <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem' }}>
            Certificate ID: CERT-{completion?.id ? completion.id.toString().padStart(8, '0') : Date.now().toString().slice(-8)}
          </Typography>
        </Box>
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
            backgroundColor: '#114417DB', 
            '&:hover': { backgroundColor: '#0a2f0e' },
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
