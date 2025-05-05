'use client';

import { m } from 'framer-motion';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { SimpleLayout } from 'src/layouts/simple';
import { PageNotFoundIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

export function NotFoundView() {
  return (
    <SimpleLayout content={{ compact: true }}>
      <Container component={MotionContainer}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            صفحه موردنظر یافت
            نشد!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>متأسفانه صفحه‌ای که به دنبال آن هستید پیدا نشد. ممکن است آدرس را اشتباه وارد کرده باشید. لطفاً املا را دوباره بررسی کنید.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <PageNotFoundIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </m.div>

        <Button component={RouterLink} href="/" size="large" variant="contained">
          برگشت به خانه
        </Button>
      </Container>
    </SimpleLayout>
  );
}
