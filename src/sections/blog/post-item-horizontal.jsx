import { mutate } from 'swr';
import { toast } from 'sonner';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import { maxLine } from 'src/theme/styles';

import { Label } from 'src/components/label';
import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

import axios , { endpoints } from '../../utils/axios';

// ----------------------------------------------------------------------

export function PostItemHorizontal({ post,mutateKey }) {
  const theme = useTheme();

  const popover = usePopover();

  const router = useRouter();

  const {
    _id,
    title,
    publish,
    cover,
    category,
    createdAt,
    totalViews,
    totalShares,
    totalComments,
    description,
  } = post;

  const handleDeleteRow = useCallback(
    async (id) => {
      try {
        const response = await axios.delete(`${endpoints.post.delete(id)}`);

        if (response.status === 200) {
          toast.success('حذف موفقیت آمیز!');
          mutate(mutateKey)

        } else {
          toast.error('خطا در حذف!');
        }
      } catch (error) {
        console.error('Error deleting row:', error);
        toast.error('خطا در حذف!');
      }
    },
    []
  );

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Stack spacing={1} sx={{ p: theme.spacing(3, 3, 2, 3) }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ gap: 4, mb: 2 }}
          >
            <Label variant="soft" color={(publish === 'published' && 'info') || 'default'}>
              {publish}
            </Label>

            <Box
              component="span"
              sx={{
                typography: 'caption',
                color: 'text.disabled',
              }}
            >
              {fDate(createdAt)}
            </Box>
          </Box>

          <Stack spacing={1} flexGrow={1}>
            <Link
              component={RouterLink}
              href={paths.dashboard.post.edit(_id)}
              color="inherit"
              variant="subtitle2"
              sx={{ ...maxLine({ line: 2 }) }}
            >
              {title}
            </Link>

            <Typography
              variant="body2"
              sx={{
                ...maxLine({ line: 2 }),
                color: 'text.secondary',
              }}
            >
              {description}
            </Typography>
          </Stack>

          <Box display="flex" alignItems="center">
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>

            <Box
              gap={1.5}
              flexGrow={1}
              display="flex"
              flexWrap="wrap"
              justifyContent="flex-end"
              sx={{
                typography: 'caption',
                color: 'text.disabled',
              }}
            >
              <Box display="flex" alignItems="center" gap={0.5}>
                <Iconify icon="eva:message-circle-fill" width={16} />
                {fShortenNumber(totalComments)}
              </Box>

              <Box display="flex" alignItems="center" gap={0.5}>
                <Iconify icon="solar:eye-bold" width={16} />
                {fShortenNumber(totalViews)}
              </Box>

              <Box display="flex" alignItems="center" gap={0.5}>
                <Iconify icon="solar:share-bold" width={16} />
                {fShortenNumber(totalShares)}
              </Box>
            </Box>
          </Box>
        </Stack>

        <Box
          sx={{
            p: 1,
            height: 240,
            position: 'relative',
            display: {
              xs: 'none',
              sm: 'block',
            },
          }}
        >
          <Image
            alt={title}
            src={cover?.url ? process.env.NEXT_PUBLIC_ASSET_URL + cover.url : ''}
            sx={{
              height: 1,
              borderRadius: 1.5,
            }}
          />
        </Box>
      </Card>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'bottom-center' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
              router.push(paths.dashboard.post.details(title));
            }}
          >
            <Iconify icon="solar:eye-bold" />
            نمایش
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
              router.push(paths.dashboard.post.edit(title));
            }}
          >
            <Iconify icon="solar:pen-bold" />
            ویرایش
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleDeleteRow(_id)
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            حذف
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
