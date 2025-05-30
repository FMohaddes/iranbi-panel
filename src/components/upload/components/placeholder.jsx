import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { UploadIllustration } from 'src/assets/illustrations';

// ----------------------------------------------------------------------

export function UploadPlaceholder({ ...other }) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      {...other}
    >
      <UploadIllustration hideBackground sx={{ width: 200 }} />

      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Box sx={{ typography: 'h6' }}>عکس را داخل کادر رها کرده یا انتخاب کنید.</Box>
        <Box sx={{ typography: 'body2', color: 'text.secondary' }}>
          فایل  را اینجا رها کنید یا از طریق  &nbsp;
          <Box
            component="span"
            sx={{ mx: 0.5, color: 'primary.main', textDecoration: 'underline' }}
          >
            لینک
          </Box>
          &nbsp;داخل فایل های کامپیوتر بگردید.

        </Box>
      </Stack>
    </Box>
  );
}
