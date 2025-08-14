import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Chip,
  Alert,
  TextField,
  InputAdornment,
  Divider,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  Search as SearchIcon,
  Book as DocumentationIcon,
  VideoLibrary as VideoIcon,
  Forum as CommunityIcon,
  ContactSupport as SupportIcon,
  GetApp as DownloadIcon,
  PlayArrow as PlayIcon,
  Star as StarIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';

const Help = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedPanel, setExpandedPanel] = React.useState('getting-started');

  const handlePanelChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  const faqData = [
    {
      id: 'getting-started',
      question: 'How do I get started with HOT22 Airlines Data Management?',
      answer: `To get started:
      1. Upload your HOT22 file using the File Upload section
      2. Wait for the file to be processed and validated
      3. Navigate to the Dashboard to view your data overview
      4. Use the Analytics section to generate insights
      5. Create reports as needed from the Reports section`,
    },
    {
      id: 'file-upload',
      question: 'What file formats are supported for upload?',
      answer: `We support HOT22 text files (.txt format) with the following record types:
      • BFH01 - File Header Records
      • BKS24, BKS30, BKS39 - Sales/Booking Records
      • BAR65 - Passenger Records
      • BKI63 - Itinerary Records
      • BOH03 - Office Header Records
      Maximum file size: 100MB`,
    },
    {
      id: 'search-functions',
      question: 'How do I search for transactions and passengers?',
      answer: `Use the Global Search feature to find:
      • Transaction numbers (TXN-123456 or just 123456)
      • Passenger names (full or partial)
      • Agent codes (8-digit codes like 12345678)
      • Ticket numbers (13-digit numbers)
      
      You can also use Quick Lookup for exact identifier searches.`,
    },
    {
      id: 'reports',
      question: 'How do I generate and export reports?',
      answer: `To generate reports:
      1. Go to the Reports section
      2. Select your report type (Transactions, Revenue, Commission, etc.)
      3. Choose your date range and filters
      4. Select export format (CSV, Excel, PDF, JSON)
      5. Click Generate Report
      
      Reports are saved and can be downloaded from the Generated Reports list.`,
    },
    {
      id: 'analytics',
      question: 'What analytics are available?',
      answer: `The Analytics dashboard provides:
      • Revenue Analytics - Revenue trends and breakdowns
      • Commission Analytics - Commission tracking and rates
      • Performance Metrics - Office and agent performance
      • Travel Patterns - Route analysis and passenger demographics
      
      All charts are interactive and can be filtered by date range and other criteria.`,
    },
    {
      id: 'troubleshooting',
      question: 'What should I do if my file upload fails?',
      answer: `If upload fails, check:
      • File size is under 100MB
      • File is in .txt format
      • File contains valid HOT22 record structures
      • Internet connection is stable
      
      Check the upload history for error details. Contact support if issues persist.`,
    },
    {
      id: 'data-privacy',
      question: 'How is my data protected?',
      answer: `Your data is protected through:
      • Encrypted data transmission (HTTPS)
      • Secure data storage
      • Regular security audits
      • Access controls and authentication
      • Data anonymization options in Settings
      
      We comply with industry standard data protection practices.`,
    },
    {
      id: 'performance',
      question: 'How can I improve application performance?',
      answer: `To optimize performance:
      • Use appropriate page sizes (25-50 records per page)
      • Apply filters to reduce data load
      • Clear browser cache periodically
      • Use Chrome or Firefox for best experience
      • Disable animations in Settings if needed`,
    },
  ];

  const quickStartGuides = [
    {
      title: 'Upload Your First File',
      description: 'Learn how to upload and process HOT22 files',
      duration: '5 min',
      steps: ['Go to File Upload', 'Select your .txt file', 'Wait for processing', 'View results'],
    },
    {
      title: 'Dashboard Overview',
      description: 'Understand the main dashboard and key metrics',
      duration: '3 min',
      steps: ['Navigate to Dashboard', 'Review key metrics', 'Explore charts', 'Customize widgets'],
    },
    {
      title: 'Generate Your First Report',
      description: 'Create and export transaction reports',
      duration: '4 min',
      steps: ['Open Reports section', 'Select report type', 'Set date range', 'Generate and download'],
    },
    {
      title: 'Advanced Search',
      description: 'Master the search functionality',
      duration: '6 min',
      steps: ['Use Global Search', 'Try Quick Lookup', 'Apply filters', 'Save search history'],
    },
  ];

  const supportResources = [
    {
      title: 'User Documentation',
      description: 'Complete user guide and feature documentation',
      icon: DocumentationIcon,
      action: 'View Docs',
      color: 'primary',
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for common tasks',
      icon: VideoIcon,
      action: 'Watch Videos',
      color: 'secondary',
    },
    {
      title: 'Community Forum',
      description: 'Ask questions and share tips with other users',
      icon: CommunityIcon,
      action: 'Join Forum',
      color: 'success',
    },
    {
      title: 'Contact Support',
      description: 'Get help from our technical support team',
      icon: SupportIcon,
      action: 'Contact Us',
      color: 'warning',
    },
  ];

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Help & Support
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Everything you need to know about HOT22 Airlines Data Management
        </Typography>
        
        {/* Search */}
        <TextField
          placeholder="Search help articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 500, width: '100%' }}
        />
      </Box>

      <Grid container spacing={4}>
        {/* Quick Start Guides */}
        <Grid item xs={12}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Quick Start Guides
          </Typography>
          <Grid container spacing={3}>
            {quickStartGuides.map((guide, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <PlayIcon />
                      </Avatar>
                      <Chip label={guide.duration} size="small" color="primary" />
                    </Box>
                    
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {guide.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {guide.description}
                    </Typography>
                    
                    <List dense>
                      {guide.steps.map((step, stepIndex) => (
                        <ListItem key={stepIndex} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Typography variant="caption" color="primary" fontWeight="bold">
                              {stepIndex + 1}
                            </Typography>
                          </ListItemIcon>
                          <ListItemText 
                            primary={step} 
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Support Resources */}
        <Grid item xs={12}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Support Resources
          </Typography>
          <Grid container spacing={3}>
            {supportResources.map((resource, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar sx={{ bgcolor: `${resource.color}.main`, mx: 'auto', mb: 2, width: 56, height: 56 }}>
                      <resource.icon sx={{ fontSize: 32 }} />
                    </Avatar>
                    
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {resource.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {resource.description}
                    </Typography>
                    
                    <Button variant="outlined" color={resource.color} fullWidth>
                      {resource.action}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* FAQ Section */}
        <Grid item xs={12}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Frequently Asked Questions
          </Typography>
          
          {filteredFAQs.length === 0 ? (
            <Alert severity="info">
              No help articles found for "{searchQuery}". Try different search terms.
            </Alert>
          ) : (
            <Box>
              {filteredFAQs.map((faq) => (
                <Accordion
                  key={faq.id}
                  expanded={expandedPanel === faq.id}
                  onChange={handlePanelChange(faq.id)}
                  sx={{ mb: 1 }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle1" fontWeight={500}>
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Grid>

        {/* System Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                System Information
              </Typography>
              
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Application Version"
                    secondary="v1.0.0"
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="API Status"
                    secondary="Connected"
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Last Updated"
                    secondary={new Date().toLocaleDateString()}
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CheckIcon color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Browser Compatibility"
                    secondary="Supported"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Need More Help?
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Can't find what you're looking for? Our support team is here to help.
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="contained" fullWidth startIcon={<SupportIcon />}>
                  Contact Support
                </Button>
                
                <Button variant="outlined" fullWidth startIcon={<CommunityIcon />}>
                  Join Community Forum
                </Button>
                
                <Button variant="outlined" fullWidth startIcon={<DownloadIcon />}>
                  Download User Manual
                </Button>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary">
                <strong>Support Hours:</strong> Monday - Friday, 9 AM - 6 PM EST
                <br />
                <strong>Response Time:</strong> Within 24 hours
                <br />
                <strong>Email:</strong> support@hot22systems.com
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Help;