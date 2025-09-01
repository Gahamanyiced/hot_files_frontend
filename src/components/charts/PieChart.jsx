// src/components/charts/PieChart.jsx
import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Paper } from '@mui/material';

const PieChart = ({
  data = [],
  title,
  height = 400,
  dataKey = 'value',
  nameKey = 'name',
  showLegend = true,
  showTooltip = true,
  colors,
  innerRadius = 0,
  outerRadius = 120,
  showLabels = true,
  labelFormatter,
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
    theme.palette.grey[500],
    theme.palette.grey[700],
  ];

  const getColor = (index) => {
    return colors?.[index] || defaultColors[index % defaultColors.length];
  };

  const renderLabel = (entry) => {
    if (!showLabels) return null;
    if (labelFormatter) return labelFormatter(entry);
    return `${entry[nameKey]}: ${entry[dataKey]}`;
  };

  return (
    <Paper elevation={1} sx={{ p: 2, height: height + 60 }}>
      {title && (
        <Typography variant="h6" gutterBottom textAlign="center">
          {title}
        </Typography>
      )}
      <Box sx={{ width: '100%', height }}>
        <ResponsiveContainer>
          <RechartsPieChart {...props}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={outerRadius}
              innerRadius={innerRadius}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(index)} />
              ))}
            </Pie>
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
          </RechartsPieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default PieChart;