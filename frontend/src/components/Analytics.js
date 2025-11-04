import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Paper,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
  PlayCircle as PlayCircleIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useSessionRequests } from '../contexts/SessionRequestContext';

const AnalyticsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: '#f8f9fa',
  minHeight: '100vh',
}));

const HeaderCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
  color: 'white',
  borderRadius: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  marginBottom: theme.spacing(4),
}));

const KPICard = styled(Card)(({ theme, color }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid #e5e7eb',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    transition: 'all 0.3s ease',
  },
}));

const EmployeeCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid #e5e7eb',
  marginBottom: theme.spacing(2),
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
    transition: 'all 0.3s ease',
  },
}));

const Analytics = () => {
  const { getAnalyticsData, employeePerformance } = useSessionRequests();
  
  // State for date range and download functionality
  const [showDownloadDialog, setShowDownloadDialog] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  
  // Get real-time analytics data
  const analyticsData = getAnalyticsData();

  // Handle download functionality
  const handleDownloadReport = () => {
    if (!selectedReportType) {
      alert('Please select a report type');
      return;
    }
    
    // Generate CSV data based on selected report type
    let csvData = '';
    let filename = '';
    
    switch (selectedReportType) {
      case 'kpi':
        csvData = generateKPICSV();
        filename = `KPI_Report_${dateRange.startDate}_to_${dateRange.endDate}.csv`;
        break;
      case 'employees':
        csvData = generateEmployeeCSV();
        filename = `Employee_Performance_${dateRange.startDate}_to_${dateRange.endDate}.csv`;
        break;
      case 'completion':
        csvData = generateCompletionCSV();
        filename = `Completion_Rate_${dateRange.startDate}_to_${dateRange.endDate}.csv`;
        break;
      default:
        alert('Invalid report type');
        return;
    }
    
    // Download the CSV file
    downloadCSV(csvData, filename);
    setShowDownloadDialog(false);
    alert('Report downloaded successfully!');
  };

  const generateKPICSV = () => {
    const headers = ['Metric', 'Value', 'Date Range'];
    const rows = [
      ['Total Learners', analyticsData.totalLearners, `${dateRange.startDate} to ${dateRange.endDate}`],
      ['Completion Rate', `${analyticsData.completionRate}%`, `${dateRange.startDate} to ${dateRange.endDate}`],
      ['Average Rating', analyticsData.averageRating, `${dateRange.startDate} to ${dateRange.endDate}`],
      ['Active Sessions', analyticsData.activeSessions, `${dateRange.startDate} to ${dateRange.endDate}`]
    ];
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateEmployeeCSV = () => {
    const headers = ['Rank', 'Name', 'Department', 'Sessions Completed', 'Completion Rate'];
    const rows = analyticsData.topPerformers.map((employee, index) => [
      index + 1,
      employee.name,
      employee.department,
      employee.sessionsCompleted,
      `${employee.completionRate}%`
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const generateCompletionCSV = () => {
    const headers = ['Metric', 'Value', 'Percentage'];
    const rows = [
      ['Total Sessions Completed', analyticsData.totalSessionsCompleted, '100%'],
      ['Completion Rate', analyticsData.completionRate, `${analyticsData.completionRate}%`],
      ['Top Performers Count', analyticsData.topPerformers.length, `${Math.round((analyticsData.topPerformers.length / analyticsData.totalLearners) * 100)}%`]
    ];
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (csvData, filename) => {
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  
  // KPI Data - Real-time from context
  const kpiData = [
    {
      value: analyticsData.totalLearners.toString(),
      label: 'Total Learners',
      color: '#3b82f6',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />
    },
    {
      value: `${analyticsData.completionRate}%`,
      label: 'Completion Rate',
      color: '#10b981',
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />
    },
    {
      value: analyticsData.averageRating.toString(),
      label: 'Avg. Rating',
      color: '#f59e0b',
      icon: <StarIcon sx={{ fontSize: 40 }} />
    },
    {
      value: analyticsData.activeSessions.toString(),
      label: 'Active Sessions',
      color: '#ef4444',
      icon: <PlayCircleIcon sx={{ fontSize: 40 }} />
    }
  ];

  // Top Performing Employees Data - Real-time from context
  const topEmployees = analyticsData.topPerformers.map((employee, index) => ({
    id: employee.id,
    name: employee.name,
    department: employee.department,
    sessionsCompleted: employee.sessionsCompleted,
    completionRate: employee.completionRate,
    rank: index + 1,
    rankColor: index === 0 ? '#10b981' : index === 1 ? '#f59e0b' : '#ef4444'
  }));

  return (
    <AnalyticsContainer>
      {/* Header Section */}
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Interactive charts and metrics visualization
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => setShowDownloadDialog(true)}
            sx={{
              backgroundColor: '#3b82f6',
              '&:hover': {
                backgroundColor: '#2563eb',
              }
            }}
          >
            Download Reports
          </Button>
        </Box>
      </Box>

      {/* KPI Cards Section */}
      <Box mb={4}>
        <Grid container spacing={3}>
          {kpiData.map((kpi, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <KPICard>
                <Box display="flex" justifyContent="center" mb={2}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: `${kpi.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {kpi.icon}
                  </Box>
                </Box>
                <Typography 
                  variant="h3" 
                  fontWeight="bold" 
                  sx={{ color: kpi.color, mb: 1 }}
                >
                  {kpi.value}
                </Typography>
                <Typography variant="h6" color="text.secondary" fontWeight="medium">
                  {kpi.label}
                </Typography>
                <Button
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={() => {
                    setSelectedReportType('kpi');
                    setShowDownloadDialog(true);
                  }}
                  sx={{
                    mt: 2,
                    color: kpi.color,
                    borderColor: kpi.color,
                    '&:hover': {
                      backgroundColor: `${kpi.color}10`,
                      borderColor: kpi.color,
                    }
                  }}
                  variant="outlined"
                >
                  Download
                </Button>
              </KPICard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Top Performing Employees Section */}
      <Box>
        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
              <Box display="flex" alignItems="center">
                <CalendarIcon sx={{ fontSize: 28, color: '#3b82f6', mr: 2 }} />
                <Typography variant="h4" fontWeight="bold" color="text.primary">
                  Top Performing Employees
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => {
                  setSelectedReportType('employees');
                  setShowDownloadDialog(true);
                }}
                sx={{
                  color: '#3b82f6',
                  borderColor: '#3b82f6',
                  '&:hover': {
                    backgroundColor: '#3b82f610',
                    borderColor: '#3b82f6',
                  }
                }}
              >
                Download Report
              </Button>
            </Box>

            <Grid container spacing={3}>
              {topEmployees.map((employee) => (
                <Grid item xs={12} md={4} key={employee.id}>
                  <EmployeeCard>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        sx={{
                          width: 40,
                          height: 40,
                          backgroundColor: employee.rankColor,
                          fontWeight: 'bold',
                          fontSize: '1.2rem',
                          mr: 2
                        }}
                      >
                        {employee.rank}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {employee.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {employee.department} • {employee.sessionsCompleted} sessions completed
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: employee.rankColor }}>
                          {employee.completionRate}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Completion Rate
                        </Typography>
                      </Box>
                      <Chip
                        label={`Rank #${employee.rank}`}
                        sx={{
                          backgroundColor: `${employee.rankColor}20`,
                          color: employee.rankColor,
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                  </EmployeeCard>
                </Grid>
              ))}
            </Grid>

            {/* Additional Stats */}
            <Box mt={4} p={3} sx={{ backgroundColor: '#f8fafc', borderRadius: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Performance Summary
                </Typography>
                <Button
                  size="small"
                  startIcon={<DownloadIcon />}
                  onClick={() => {
                    setSelectedReportType('completion');
                    setShowDownloadDialog(true);
                  }}
                  sx={{
                    color: '#10b981',
                    borderColor: '#10b981',
                    '&:hover': {
                      backgroundColor: '#10b98110',
                      borderColor: '#10b981',
                    }
                  }}
                  variant="outlined"
                >
                  Download
                </Button>
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" color="#3b82f6">
                      {analyticsData.totalSessionsCompleted}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Sessions Completed
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" color="#10b981">
                      {analyticsData.completionRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Completion Rate
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" color="#f59e0b">
                      {topEmployees.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Top Performers
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Download Report Dialog */}
      <Dialog 
        open={showDownloadDialog} 
        onClose={() => setShowDownloadDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <DownloadIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Download Analytics Report
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                label="Report Type"
              >
                <MenuItem value="kpi">KPI Metrics Report</MenuItem>
                <MenuItem value="employees">Employee Performance Report</MenuItem>
                <MenuItem value="completion">Completion Rate Report</MenuItem>
              </Select>
            </FormControl>

            <Box display="flex" gap={2} mb={3}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Report will include:</strong>
                {selectedReportType === 'kpi' && ' Total learners, completion rate, average rating, and active sessions'}
                {selectedReportType === 'employees' && ' Employee rankings, departments, sessions completed, and completion rates'}
                {selectedReportType === 'completion' && ' Total sessions completed, completion rates, and top performers count'}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDownloadDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDownloadReport}
            variant="contained"
            startIcon={<DownloadIcon />}
            disabled={!selectedReportType || !dateRange.startDate || !dateRange.endDate}
          >
            Download Report
          </Button>
        </DialogActions>
      </Dialog>
    </AnalyticsContainer>
  );
};

export default Analytics;
