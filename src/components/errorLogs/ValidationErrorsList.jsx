// src/components/errorLogs/ValidationErrorsList.jsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Code as CodeIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';

const ValidationErrorsList = ({ errors }) => {
  const handleCopyLine = (line) => {
    navigator.clipboard.writeText(line);
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Line #</TableCell>
            <TableCell>Error Message</TableCell>
            <TableCell>Field</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {errors.map((error, index) => (
            <TableRow key={index}>
              <TableCell>
                <Chip
                  label={error.lineNumber}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2">{error.error}</Typography>
                {error.validationDetails && (
                  <Typography variant="caption" color="text.secondary">
                    Type: {error.validationDetails.type}
                  </Typography>
                )}
              </TableCell>
              <TableCell>
                {error.validationDetails?.path && (
                  <Chip
                    label={error.validationDetails.path.join('.')}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Copy Line">
                    <IconButton
                      size="small"
                      onClick={() => handleCopyLine(error.line)}
                    >
                      <CopyIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {error.line && (
                    <Accordion sx={{ minWidth: 0 }}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          minHeight: 32,
                          '& .MuiAccordionSummary-content': { margin: '6px 0' },
                        }}
                      >
                        <CodeIcon fontSize="small" />
                      </AccordionSummary>
                      <AccordionDetails sx={{ pt: 0 }}>
                        <Typography
                          variant="caption"
                          fontFamily="monospace"
                          sx={{
                            wordBreak: 'break-all',
                            backgroundColor: 'grey.100',
                            p: 1,
                            borderRadius: 1,
                            display: 'block',
                          }}
                        >
                          {error.line}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ValidationErrorsList;
