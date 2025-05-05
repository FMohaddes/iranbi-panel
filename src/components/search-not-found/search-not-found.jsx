import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export function SearchNotFound({ query, sx, ...other }) {
  if (!query) {
    return (
      <Typography variant="body2" sx={sx}>
        لطفا کلمات را کلیدی وارد کنید
      </Typography>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', borderRadius: 1.5, ...sx }} {...other}>
      <Box sx={{ mb: 1, typography: 'h6' }}>یافت نشد</Box>

      <Typography variant="body2">
        هیچ نتیجه‌ای برای &nbsp;
        <strong>{`"${query}"`}</strong>
        یافت نشد.
        <br /> لطفاً بررسی کنید که خطای تایپی نداشته باشید یا از کلمات کامل استفاده کنید.
      </Typography>

    </Box>
  );
}
