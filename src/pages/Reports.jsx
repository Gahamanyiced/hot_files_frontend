import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
  LinearProgress,
  Alert,
  useTheme,
} from '@mui/material';
import {
  GetApp as ExportIcon,
  Assessment as ReportIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  DateRange as DateIcon,
  FilterList as FilterIcon,
  Description as DocumentIcon,
  TableChart as TableIcon,
  BarChart as ChartIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Hooks
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { addNotification } from '../store/slices/uiSlice';

// Utils
import { formatDate, formatNumber, formatCurrency } from '../utils/formatters';

const Reports = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const [reportConfig, setReportConfig] = React.useState({
    type: 'transactions',
    format: 'csv',
    dateRange: {
      startDate: null,
      endDate: null,
    },
    filters: {
      agentCode: '',
      currency: '',
      transactionType: '',
    },
  });

  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedReports, setGeneratedReports] = React.useState([
    {
      id: 1,
      name: 'Transaction Summary Report',
      type: 'transactions',
      format: 'csv',
      size: '2.4 MB',
      records: 15420,
      generatedAt: new Date().toISOString(),
      status: 'completed',
    },
    {
      id: 2,
      name: 'Revenue Analytics Report',
      type: 'revenue',
      format: 'pdf',
      size: '1.8 MB',
      records: 8750,
      generatedAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'completed',
    },
    {
      id: 3,
      name: 'Office Performance Report',
      type: 'offices',
      format: 'xlsx',
      size: '3.2 MB',
      records: 125,
      generatedAt: new Date(Date.now() - 172800000).toISOString(),
      status: 'completed',
    },
  ]);

  const reportTypes = [
    {
      value: 'transactions',
      label: 'Transaction Report',
      description:
        'Detailed transaction data with passenger and financial information',
      icon: TableIcon,
    },
    {
      value: 'revenue',
      label: 'Revenue Analytics',
      description: 'Revenue breakdown by office, agent, and time period',
      icon: ChartIcon,
    },
    {
      value: 'commission',
      label: 'Commission Report',
      description: 'Commission calculations and agent performance',
      icon: ReportIcon,
    },
    {
      value: 'offices',
      label: 'Office Performance',
      description: 'Office statistics and performance metrics',
      icon: ReportIcon,
    },
    {
      value: 'passengers',
      label: 'Passenger Analytics',
      description: 'Passenger demographics and travel patterns',
      icon: ReportIcon,
    },
    {
      value: 'summary',
      label: 'Executive Summary',
      description: 'High-level business metrics and KPIs',
      icon: DocumentIcon,
    },
  ];

  const formatOptions = [
    { value: 'csv', label: 'CSV', icon: TableIcon },
    { value: 'xlsx', label: 'Excel', icon: TableIcon },
    { value: 'pdf', label: 'PDF', icon: PdfIcon },
    { value: 'json', label: 'JSON', icon: DocumentIcon },
  ];

  const handleConfigChange = (key, value) => {
    setReportConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFilterChange = (key, value) => {
    setReportConfig((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        [key]: value,
      },
    }));
  };

  const handleDateRangeChange = (field, value) => {
    setReportConfig((prev) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value,
      },
    }));
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);

    try {
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const newReport = {
        id: Date.now(),
        name: `${
          reportTypes.find((t) => t.value === reportConfig.type)?.label
        } - ${formatDate(new Date())}`,
        type: reportConfig.type,
        format: reportConfig.format,
        size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
        records: Math.floor(Math.random() * 50000 + 1000),
        generatedAt: new Date().toISOString(),
        status: 'completed',
      };

      setGeneratedReports((prev) => [newReport, ...prev]);

      dispatch(
        addNotification({
          type: 'success',
          message: 'Report generated successfully!',
        })
      );
    } catch (error) {
      dispatch(
        addNotification({
          type: 'error',
          message: 'Failed to generate report',
        })
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = (reportId) => {
    dispatch(
      addNotification({
        type: 'info',
        message: 'Download started...',
        autoHideDuration: 2000,
      })
    );
  };

  const handleDeleteReport = (reportId) => {
    setGeneratedReports((prev) =>
      prev.filter((report) => report.id !== reportId)
    );
    dispatch(
      addNotification({
        type: 'info',
        message: 'Report deleted',
        autoHideDuration: 2000,
      })
    );
  };

  const getReportIcon = (type) => {
    const reportType = reportTypes.find((t) => t.value === type);
    const IconComponent = reportType?.icon || DocumentIcon;
    return <IconComponent />;
  };

  const getFormatIcon = (format) => {
    const formatOption = formatOptions.find((f) => f.value === format);
    const IconComponent = formatOption?.icon || DocumentIcon;
    return <IconComponent fontSize="small" />;
  };

  const selectedReportType = reportTypes.find(
    (t) => t.value === reportConfig.type
  );

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold">
          Reports & Analytics
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh Reports">
            <IconButton>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Report Generator */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Generate New Report
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create custom reports with your preferred data and format
              </Typography>

              <Grid container spacing={3}>
                {/* Report Type Selection */}
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Report Type
                  </Typography>
                  <Grid container spacing={2}>
                    {reportTypes.map((type) => (
                      <Grid item xs={12} sm={6} md={4} key={type.value}>
                        <Card
                          variant="outlined"
                          sx={{
                            cursor: 'pointer',
                            border: reportConfig.type === type.value ? 2 : 1,
                            borderColor:
                              reportConfig.type === type.value
                                ? 'primary.main'
                                : 'divider',
                            '&:hover': {
                              borderColor: 'primary.main',
                            },
                          }}
                          onClick={() => handleConfigChange('type', type.value)}
                        >
                          <CardContent sx={{ p: 2 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1,
                              }}
                            >
                              <type.icon color="primary" sx={{ mr: 1 }} />
                              <Typography variant="subtitle2" fontWeight={600}>
                                {type.label}
                              </Typography>
                            </Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {type.description}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                {/* Format and Date Range */}
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Format</InputLabel>
                    <Select
                      value={reportConfig.format}
                      label="Format"
                      onChange={(e) =>
                        handleConfigChange('format', e.target.value)
                      }
                    >
                      {formatOptions.map((format) => (
                        <MenuItem key={format.value} value={format.value}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <format.icon fontSize="small" />
                            {format.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <DatePicker
                    label="Start Date"
                    value={reportConfig.dateRange.startDate}
                    onChange={(value) =>
                      handleDateRangeChange('startDate', value)
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <DatePicker
                    label="End Date"
                    value={reportConfig.dateRange.endDate}
                    onChange={(value) =>
                      handleDateRangeChange('endDate', value)
                    }
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>

                {/* Filters */}
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Agent Code"
                    placeholder="Optional filter"
                    value={reportConfig.filters.agentCode}
                    onChange={(e) =>
                      handleFilterChange('agentCode', e.target.value)
                    }
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={reportConfig.filters.currency}
                      label="Currency"
                      onChange={(e) =>
                        handleFilterChange('currency', e.target.value)
                      }
                    >
                      <MenuItem value="">All Currencies</MenuItem>
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="EUR">EUR</MenuItem>
                      <MenuItem value="GBP">GBP</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Transaction Type</InputLabel>
                    <Select
                      value={reportConfig.filters.transactionType}
                      label="Transaction Type"
                      onChange={(e) =>
                        handleFilterChange('transactionType', e.target.value)
                      }
                    >
                      <MenuItem value="">All Types</MenuItem>
                      <MenuItem value="STD">Standard</MenuItem>
                      <MenuItem value="RFND">Refund</MenuItem>
                      <MenuItem value="EXCH">Exchange</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Report Preview */}
              {selectedReportType && (
                <Paper
                  variant="outlined"
                  sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}
                >
                  <Typography variant="subtitle2" gutterBottom>
                    Report Preview
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {getReportIcon(reportConfig.type)}
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        {selectedReportType.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Format: {reportConfig.format.toUpperCase()} |
                        {reportConfig.dateRange.startDate &&
                        reportConfig.dateRange.endDate
                          ? ` Period: ${formatDate(
                              reportConfig.dateRange.startDate
                            )} - ${formatDate(reportConfig.dateRange.endDate)}`
                          : ' All available data'}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}

              {/* Generate Button */}
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={isGenerating ? <RefreshIcon /> : <ExportIcon />}
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  sx={{ minWidth: 160 }}
                >
                  {isGenerating ? 'Generating...' : 'Generate Report'}
                </Button>

                {isGenerating && (
                  <Box
                    sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}
                  >
                    <LinearProgress sx={{ flexGrow: 1, mr: 2 }} />
                    <Typography variant="body2" color="text.secondary">
                      Processing data...
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Reports */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Reports
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Generate common reports instantly
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<TableIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Today's Transactions
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<ChartIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Weekly Revenue Summary
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<ReportIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Monthly Commission Report
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<DocumentIcon />}
                  fullWidth
                  sx={{ justifyContent: 'flex-start' }}
                >
                  Office Performance
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Scheduled Reports
              </Typography>

              <Alert severity="info" sx={{ mt: 1 }}>
                <Typography variant="body2">
                  Set up automated report generation to receive regular updates
                  via email.
                </Typography>
              </Alert>

              <Button
                variant="text"
                startIcon={<ScheduleIcon />}
                sx={{ mt: 1 }}
                size="small"
              >
                Configure Schedules
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Generated Reports */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Generated Reports</Typography>
                <Chip
                  label={`${generatedReports.length} reports`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              </Box>

              {generatedReports.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <DocumentIcon
                    sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    No reports generated yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create your first report using the generator above
                  </Typography>
                </Box>
              ) : (
                <List>
                  {generatedReports.map((report, index) => (
                    <React.Fragment key={report.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          {getReportIcon(report.type)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <Typography variant="body1" fontWeight={500}>
                                {report.name}
                              </Typography>
                              <Chip
                                icon={getFormatIcon(report.format)}
                                label={report.format.toUpperCase()}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary">
                              {formatNumber(report.records)} records •{' '}
                              {report.size} • Generated{' '}
                              {formatDate(report.generatedAt)}
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Download">
                              <IconButton
                                size="small"
                                onClick={() => handleDownloadReport(report.id)}
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </ListItemSecondaryAction>
                      </ListItem>
                      {index < generatedReports.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reports;
