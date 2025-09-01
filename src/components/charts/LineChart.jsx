// src/components/charts/LineChart.jsx
import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Paper } from '@mui/material';

const LineChart = ({
  data = [],
  lines = [],
  title,
  height = 400,
  xAxisKey = 'name',
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  colors,
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
          <RechartsLineChart data={data} {...props}>
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
            {lines.map((line, index) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={getColor(index)}
                strokeWidth={2}
                dot={{ fill: getColor(index), strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: getColor(index), strokeWidth: 2 }}
                name={line.name || line.dataKey}
                {...line}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default LineChart;