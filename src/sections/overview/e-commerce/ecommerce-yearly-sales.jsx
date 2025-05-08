import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function EcommerceYearlySales({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const [selectedSeries, setSelectedSeries] = useState('2023');

  const chartColors = chart.colors ?? [theme.palette.primary.main, theme.palette.warning.main];

  const monthsInPersian = [
    'فروردین',
    'اردیبهشت',
    'خرداد',
    'تیر',
    'مرداد',
    'شهریور',
    'مهر',
    'آبان',
    'آذر',
    'دی',
    'بهمن',
    'اسفند',
  ];

  const handleChangeSeries = useCallback((newValue) => {
    setSelectedSeries(newValue);
  }, []);

  const currentSeries = chart.series.find((i) => i.name === selectedSeries);

  return <Card />;
}
