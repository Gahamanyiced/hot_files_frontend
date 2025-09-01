// src/components/charts/BarChart.jsx
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Paper } from '@mui/material';

const BarChart = ({
  data = [],
  bars = [],
  title,
  height = 400,
  xAxisKey = 'name',
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  colors,
  layout = 'horizontal',
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
          <RechartsBarChart
            data={data}
            layout={layout}
            {...props}
          >
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
              type={layout === 'horizontal' ? 'category' : 'number'}
            />
            <YAxis
              stroke={theme.palette.text.secondary}
              fontSize={12}
              type={layout === 'horizontal' ? 'number' : 'category'}
            />
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
            {bars.map((bar, index) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                fill={getColor(index)}
                name={bar.name || bar.dataKey}
                radius={[2, 2, 0, 0]}
                {...bar}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default BarChart;