// styles.ts
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import { varAlpha } from 'src/theme/styles';

export const StyledRoot = styled(Stack, {
  shouldForwardProp: (prop) => prop !== 'error' && prop !== 'disabled' && prop !== 'fullScreen',
})(({ error, disabled, fullScreen, theme }) => ({
  minHeight: 240,
  borderRadius: theme.shape.borderRadius,
  border: `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.2)}`,
  backgroundColor: varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
  position: 'relative',
  overflow: 'hidden',
  transition: theme.transitions.create(['border-color', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),

  ...(error && {
    borderColor: theme.vars.palette.error.main,
    backgroundColor: varAlpha(theme.vars.palette.error.mainChannel, 0.08),
  }),

  ...(disabled && {
    opacity: 0.48,
    pointerEvents: 'none',
  }),

  ...(fullScreen && {
    top: 16,
    left: 16,
    position: 'fixed',
    zIndex: theme.zIndex.modal,
    width: `calc(100% - 32px)`,
    height: `calc(100% - 32px)`,
    backgroundColor: theme.vars.palette.background.default,
  }),

  // iframe TinyMCE
  '& iframe': {
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    width: '100%',
    backgroundColor: 'transparent',
  },

  '& .tox': {
    fontFamily: theme.typography.fontFamily,
    border: 'none',

    '& .tox-toolbar': {
      backgroundColor: theme.vars.palette.background.paper,
      borderBottom: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
    },

    '& .tox-edit-area': {
      backgroundColor: 'transparent',
      padding: theme.spacing(2),
    },

    '& .tox-statusbar': {
      borderTop: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
    },
  },
}));
