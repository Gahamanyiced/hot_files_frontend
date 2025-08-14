import React from 'react';
import { Box, Typography, Link, Divider, useTheme, alpha } from '@mui/material';
import {
  FlightTakeoff as FlightIcon,
  Copyright as CopyrightIcon,
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 2,
        px: 3,
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
        borderTop: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* Left Section - Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FlightIcon color="primary" fontSize="small" />
          <Typography variant="body2" color="text.primary" fontWeight={500}>
            HOT22 Airlines Data Management
          </Typography>
        </Box>

        {/* Center Section - Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Link
            href="/help"
            color="text.secondary"
            underline="hover"
            variant="body2"
          >
            Help
          </Link>
          <Link
            href="/settings"
            color="text.secondary"
            underline="hover"
            variant="body2"
          >
            Settings
          </Link>
          <Link
            href="/api-docs"
            color="text.secondary"
            underline="hover"
            variant="body2"
          >
            API Docs
          </Link>
        </Box>

        {/* Right Section - Copyright */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CopyrightIcon fontSize="small" color="disabled" />
          <Typography variant="body2" color="text.secondary">
            {currentYear} HOT22 Systems. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
