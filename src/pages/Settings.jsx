import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  Paper,
  Slider,
  useTheme,
} from '@mui/material';
import {
  Palette as PaletteIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Restore as RestoreIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

// Hooks
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import {
  toggleDarkMode,
  setPrimaryColor,
  setViewPreference,
  addNotification,
} from '../store/slices/uiSlice';

const Settings = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  
  const { darkMode, primaryColor, viewPreferences } = useAppSelector((state) => state.ui);

  const [settings, setSettings] = React.useState({
    // Appearance
    notifications: {
      email: true,
      browser: true,
      autoHide: true,
      duration: 5000,
    },
    // Data & Privacy
    dataRetention: 90,
    autoBackup: true,
    anonymizeData: false,
    // Performance
    pageSize: 50,
    autoRefresh: true,
    refreshInterval: 300000,
    enableAnimations: true,
    // Language & Locale
    language: 'en',
    timezone: 'UTC',
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    numberFormat: 'en-US',
  });

  const [unsavedChanges, setUnsavedChanges] = React.useState(false);

  const colorOptions = [
    { name: 'Blue', value: '#1976d2' },
    { name: 'Green', value: '#388e3c' },
    { name: 'Purple', value: '#7b1fa2' },
    { name: 'Orange', value: '#f57c00' },
    { name: 'Red', value: '#d32f2f' },
    { name: 'Teal', value: '#00796b' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
  ];

  const timezoneOptions = [
    { value: 'UTC', label: 'UTC' },
    { value: 'America/New_York', label: 'Eastern Time' },
    { value: 'America/Chicago', label: 'Central Time' },
    { value: 'America/Denver', label: 'Mountain Time' },
    { value: 'America/Los_Angeles', label: 'Pacific Time' },
    { value: 'Europe/London', label: 'London' },
    { value: 'Europe/Paris', label: 'Paris' },
    { value: 'Asia/Tokyo', label: 'Tokyo' },
  ];

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    setUnsavedChanges(true);
  };

  const handleDirectSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    setUnsavedChanges(true);
  };

  const handleColorChange = (color) => {
    dispatch(setPrimaryColor(color));
    dispatch(addNotification({
      type: 'success',
      message: 'Theme color updated',
      autoHideDuration: 2000,
    }));
  };

  const handleSaveSettings = () => {
    // Save settings to localStorage or API
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    dispatch(addNotification({
      type: 'success',
      message: 'Settings saved successfully',
    }));
    
    setUnsavedChanges(false);
  };

  const handleResetSettings = () => {
    const defaultSettings = {
      notifications: {
        email: true,
        browser: true,
        autoHide: true,
        duration: 5000,
      },
      dataRetention: 90,
      autoBackup: true,
      anonymizeData: false,
      pageSize: 50,
      autoRefresh: true,
      refreshInterval: 300000,
      enableAnimations: true,
      language: 'en',
      timezone: 'UTC',
      currency: 'USD',
      dateFormat: 'MM/dd/yyyy',
      numberFormat: 'en-US',
    };
    
    setSettings(defaultSettings);
    setUnsavedChanges(true);
    
    dispatch(addNotification({
      type: 'info',
      message: 'Settings reset to defaults',
    }));
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hot22-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    
    dispatch(addNotification({
      type: 'success',
      message: 'Settings exported successfully',
    }));
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings(importedSettings);
          setUnsavedChanges(true);
          dispatch(addNotification({
            type: 'success',
            message: 'Settings imported successfully',
          }));
        } catch (error) {
          dispatch(addNotification({
            type: 'error',
            message: 'Failed to import settings: Invalid file format',
          }));
        }
      };
      reader.readAsText(file);
    }
  };

  // Load settings from localStorage on mount
  React.useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Settings
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RestoreIcon />}
            onClick={handleResetSettings}
          >
            Reset to Defaults
          </Button>
          
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveSettings}
            disabled={!unsavedChanges}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      {/* Unsaved Changes Alert */}
      {unsavedChanges && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You have unsaved changes. Don't forget to save your settings.
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Appearance Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PaletteIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Appearance</Typography>
              </Box>
              
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Dark Mode" secondary="Switch between light and dark themes" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={darkMode}
                      onChange={(e) => dispatch(toggleDarkMode())}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Enable Animations" secondary="Smooth transitions and effects" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.enableAnimations}
                      onChange={(e) => handleDirectSettingChange('enableAnimations', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Theme Color
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {colorOptions.map((color) => (
                  <Box
                    key={color.value}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      backgroundColor: color.value,
                      cursor: 'pointer',
                      border: primaryColor === color.value ? 3 : 1,
                      borderColor: primaryColor === color.value ? 'white' : 'divider',
                      boxShadow: primaryColor === color.value ? `0 0 0 2px ${color.value}` : 'none',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                    onClick={() => handleColorChange(color.value)}
                    title={color.name}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <NotificationsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Notifications</Typography>
              </Box>
              
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Email Notifications" secondary="Receive updates via email" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.email}
                      onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Browser Notifications" secondary="Show desktop notifications" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.browser}
                      onChange={(e) => handleSettingChange('notifications', 'browser', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Auto-hide Notifications" secondary="Automatically dismiss notifications" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.autoHide}
                      onChange={(e) => handleSettingChange('notifications', 'autoHide', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>

              <Box sx={{ px: 0, mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Notification Duration (seconds)
                </Typography>
                <Slider
                  value={settings.notifications.duration / 1000}
                  onChange={(e, value) => handleSettingChange('notifications', 'duration', value * 1000)}
                  min={1}
                  max={10}
                  step={1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Language & Locale Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LanguageIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Language & Locale</Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={settings.language}
                      label="Language"
                      onChange={(e) => handleDirectSettingChange('language', e.target.value)}
                    >
                      {languageOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={settings.timezone}
                      label="Timezone"
                      onChange={(e) => handleDirectSettingChange('timezone', e.target.value)}
                    >
                      {timezoneOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Default Currency"
                    value={settings.currency}
                    onChange={(e) => handleDirectSettingChange('currency', e.target.value)}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date Format"
                    value={settings.dateFormat}
                    onChange={(e) => handleDirectSettingChange('dateFormat', e.target.value)}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RefreshIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Performance</Typography>
              </Box>
              
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Auto Refresh" secondary="Automatically refresh data" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.autoRefresh}
                      onChange={(e) => handleDirectSettingChange('autoRefresh', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>

              <Box sx={{ px: 0, mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Default Page Size
                </Typography>
                <Slider
                  value={settings.pageSize}
                  onChange={(e, value) => handleDirectSettingChange('pageSize', value)}
                  min={10}
                  max={100}
                  step={10}
                  marks={[
                    { value: 10, label: '10' },
                    { value: 25, label: '25' },
                    { value: 50, label: '50' },
                    { value: 100, label: '100' },
                  ]}
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box sx={{ px: 0, mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Refresh Interval (minutes)
                </Typography>
                <Slider
                  value={settings.refreshInterval / 60000}
                  onChange={(e, value) => handleDirectSettingChange('refreshInterval', value * 60000)}
                  min={1}
                  max={30}
                  step={1}
                  marks={[
                    { value: 1, label: '1' },
                    { value: 5, label: '5' },
                    { value: 15, label: '15' },
                    { value: 30, label: '30' },
                  ]}
                  valueLabelDisplay="auto"
                  disabled={!settings.autoRefresh}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Data & Privacy Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Data & Privacy</Typography>
              </Box>
              
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Auto Backup" secondary="Automatically backup settings" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.autoBackup}
                      onChange={(e) => handleDirectSettingChange('autoBackup', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Anonymize Data" secondary="Remove personal identifiers from logs" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.anonymizeData}
                      onChange={(e) => handleDirectSettingChange('anonymizeData', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>

              <Box sx={{ px: 0, mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Data Retention (days)
                </Typography>
                <Slider
                  value={settings.dataRetention}
                  onChange={(e, value) => handleDirectSettingChange('dataRetention', value)}
                  min={30}
                  max={365}
                  step={30}
                  marks={[
                    { value: 30, label: '30' },
                    { value: 90, label: '90' },
                    { value: 180, label: '180' },
                    { value: 365, label: '365' },
                  ]}
                  valueLabelDisplay="auto"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Storage & Backup */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StorageIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Storage & Backup</Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Manage your settings and application data
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleExportSettings}
                  fullWidth
                >
                  Export Settings
                </Button>
                
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadIcon />}
                  fullWidth
                >
                  Import Settings
                  <input
                    type="file"
                    hidden
                    accept=".json"
                    onChange={handleImportSettings}
                  />
                </Button>
                
                <Divider />
                
                <Alert severity="info" icon={<InfoIcon />}>
                  <Typography variant="body2">
                    Settings are automatically saved to your browser's local storage
                  </Typography>
                </Alert>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* System Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Application Version
                    </Typography>
                    <Typography variant="h6">
                      v1.0.0
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="h6">
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Browser
                    </Typography>
                    <Typography variant="h6">
                      {navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                       navigator.userAgent.includes('Firefox') ? 'Firefox' : 
                       navigator.userAgent.includes('Safari') ? 'Safari' : 
                       'Other'}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Local Storage
                    </Typography>
                    <Typography variant="h6">
                      {Object.keys(localStorage).length} items
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Feature Flags
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip label="Analytics Enabled" color="success" size="small" />
                  <Chip label="Real-time Updates" color="success" size="small" />
                  <Chip label="Export Features" color="success" size="small" />
                  <Chip label="Advanced Search" color="success" size="small" />
                  <Chip label="Dark Mode" color={darkMode ? 'success' : 'default'} size="small" />
                </Box>
              </Box>

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Having issues? Check our <strong>Help</strong> section or contact support for assistance.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer Actions */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<RestoreIcon />}
          onClick={handleResetSettings}
        >
          Reset All Settings
        </Button>
        
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveSettings}
          disabled={!unsavedChanges}
          size="large"
        >
          {unsavedChanges ? 'Save Changes' : 'All Changes Saved'}
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;