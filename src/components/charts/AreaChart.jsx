// src/components/charts/AreaChart.jsx
import React from 'react';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Paper } from '@mui/material';

const AreaChart = ({
  data = [],
  areas = [],
  title,
  height = 400,
  xAxisKey = 'name',
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  colors,
  stacked = false,
  ...props
}) => {
  const theme = useTheme();

  const defaultColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
  ];

  const getColor = (index) => {
    return colors?.[index] || defaultColors[index % defaultColors.length];
  };

  return (
    <Paper elevation={1} sx={{ p: 2, height: height + 60 }}>
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}
      <Box sx={{ width: '100%', height }}>
        <ResponsiveContainer>
          <RechartsAreaChart data={data} {...props}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme.palette.divider}
              />
            )}
            <XAxis
              dataKey={xAxisKey}
              stroke={theme.palette.text.secondary}
              fontSize={12}
            />
            <YAxis stroke={theme.palette.text.secondary} fontSize={12} />
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius,
                  color: theme.palette.text.primary,
                }}
              />
            )}
            {showLegend && <Legend />}
            {areas.map((area, index) => (
              <Area
                key={area.dataKey}
                type="monotone"
                dataKey={area.dataKey}
                stackId={stacked ? 'stack' : undefined}
                stroke={getColor(index)}
                fill={getColor(index)}
                fillOpacity={0.6}
                name={area.name || area.dataKey}
                {...area}
              />
            ))}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default AreaChart;