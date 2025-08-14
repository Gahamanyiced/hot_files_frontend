import React from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Tooltip,
  Box,
  Typography,
} from '@mui/material';
import {
  GetApp as ExportIcon,
  TableChart as CsvIcon,
  Description as ExcelIcon,
  PictureAsPdf as PdfIcon,
  Code as JsonIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';

// Hooks
import { useAppDispatch } from '../../hooks/redux';
import { addNotification } from '../../store/slices/uiSlice';

const ExportButton = ({
  data = [],
  filename = 'export',
  formats = ['csv', 'xlsx', 'pdf', 'json'],
  onExport,
  disabled = false,
  loading = false,
  size = 'medium',
  variant = 'outlined',
  showCount = true,
  showPrint = false,
  showShare = false,
  ...props
}) => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [exportLoading, setExportLoading] = React.useState({});

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (formats.length === 1) {
      handleExport(formats[0]);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = async (format) => {
    try {
      setExportLoading(prev => ({ ...prev, [format]: true }));
      
      if (onExport) {
        await onExport(format, data, filename);
      } else {
        await exportData(format);
      }
      
      dispatch(addNotification({
        type: 'success',
        message: `Export completed: ${filename}.${format}`,
      }));
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        message: `Export failed: ${error.message}`,
      }));
    } finally {
      setExportLoading(prev => ({ ...prev, [format]: false }));
      handleClose();
    }
  };

  const exportData = async (format) => {
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }

    switch (format) {
      case 'csv':
        return exportToCsv();
      case 'xlsx':
        return exportToExcel();
      case 'pdf':
        return exportToPdf();
      case 'json':
        return exportToJson();
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  };

  const exportToCsv = () => {
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  };

  const exportToExcel = () => {
    // Simple Excel export using HTML table format
    const headers = Object.keys(data[0]);
    const htmlContent = `
      <table>
        <thead>
          <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${data.map(row => 
            `<tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>`
          ).join('')}
        </tbody>
      </table>
    `;

    downloadFile(htmlContent, `${filename}.xlsx`, 'application/vnd.ms-excel');
  };

  const exportToPdf = () => {
    // Simple PDF export using HTML
    const headers = Object.keys(data[0]);
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <h1>${filename}</h1>
          <table>
            <thead>
              <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${data.map(row => 
                `<tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>`
              ).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    // Open in new window for printing/saving as PDF
    const newWindow = window.open('', '_blank');
    newWindow.document.write(htmlContent);
    newWindow.document.close();
    newWindow.print();
  };

  const exportToJson = () => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
  };

  const downloadFile = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
    handleClose();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: filename,
          text: `Sharing ${data.length} records`,
          url: window.location.href,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          dispatch(addNotification({
            type: 'error',
            message: 'Share failed',
          }));
        }
      }
    } else {
      // Fallback: copy URL to clipboard
      await navigator.clipboard.writeText(window.location.href);
      dispatch(addNotification({
        type: 'success',
        message: 'Link copied to clipboard',
      }));
    }
    handleClose();
  };

  const formatOptions = [
    { key: 'csv', label: 'CSV', icon: CsvIcon, description: 'Comma-separated values' },
    { key: 'xlsx', label: 'Excel', icon: ExcelIcon, description: 'Microsoft Excel format' },
    { key: 'pdf', label: 'PDF', icon: PdfIcon, description: 'Portable document format' },
    { key: 'json', label: 'JSON', icon: JsonIcon, description: 'JavaScript object notation' },
  ];

  const availableFormats = formatOptions.filter(format => formats.includes(format.key));

  const buttonText = loading ? 'Exporting...' : 
                    formats.length === 1 ? `Export ${formats[0].toUpperCase()}` : 
                    'Export';

  const isDisabled = disabled || loading || !data || data.length === 0;

  return (
    <>
      <Tooltip title={isDisabled ? 'No data to export' : 'Export data'}>
        <span>
          <Button
            {...props}
            variant={variant}
            size={size}
            disabled={isDisabled}
            onClick={handleClick}
            startIcon={loading ? <CircularProgress size={16} /> : <ExportIcon />}
            endIcon={formats.length > 1 ? <ExpandMoreIcon /> : null}
          >
            {buttonText}
            {showCount && data.length > 0 && ` (${data.length})`}
          </Button>
        </span>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { minWidth: 200 },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Export {data.length} records
          </Typography>
        </Box>
        
        <Divider />

        {availableFormats.map((format) => (
          <MenuItem
            key={format.key}
            onClick={() => handleExport(format.key)}
            disabled={exportLoading[format.key]}
          >
            <ListItemIcon>
              {exportLoading[format.key] ? (
                <CircularProgress size={20} />
              ) : (
                <format.icon fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText
              primary={format.label}
              secondary={format.description}
            />
          </MenuItem>
        ))}

        {(showPrint || showShare) && (
          <>
            <Divider />
            
            {showPrint && (
              <MenuItem onClick={handlePrint}>
                <ListItemIcon>
                  <PrintIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Print" />
              </MenuItem>
            )}
            
            {showShare && (
              <MenuItem onClick={handleShare}>
                <ListItemIcon>
                  <ShareIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Share" />
              </MenuItem>
            )}
          </>
        )}
      </Menu>
    </>
  );
};

export default ExportButton;