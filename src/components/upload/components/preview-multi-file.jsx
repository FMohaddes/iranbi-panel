import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { fData } from 'src/utils/format-number';

import { varAlpha } from 'src/theme/styles';

import { Iconify } from '../../iconify';
import { fileData, FileThumbnail } from '../../file-thumbnail';

// ----------------------------------------------------------------------

export function MultiFilePreview({
  sx,
  onRemove,
  lastNode,
  thumbnail,
  slotProps,
  firstNode,
  files = [],
}) {
  const renderFirstNode = firstNode && (
    <Box
      component="li"
      sx={{
        ...(thumbnail && {
          width: 'auto',
          display: 'inline-flex',
        }),
      }}
    >
      {firstNode}
    </Box>
  );

  const renderLastNode = lastNode && (
    <Box
      component="li"
      sx={{
        ...(thumbnail && { width: 'auto', display: 'inline-flex' }),
      }}
    >
      {lastNode}
    </Box>
  );

  return (
    <Box
      component="ul"
      key={files.map((file) => (typeof file === "string" ? file : file.name)).join("-")}
      sx={{
        gap: 1,
        display: 'flex',
        flexDirection: 'column',
        ...(thumbnail && {
          flexWrap: 'wrap',
          flexDirection: 'row',
        }),
        ...sx,
      }}
    >
      {renderFirstNode}

      {files.map((file) => {
        const path=(typeof file === "string"
          ? process.env.NEXT_PUBLIC_ASSET_URL + file
          : file)
        const { name, size } = fileData(file);

        if (thumbnail) {
          return (
            <Box component="li" key={name} sx={{ display: 'inline-flex', position: 'relative' }}>
            <FileThumbnail
                tooltip
                imageView
                file={path}
                onRemove={() => onRemove?.(path)}
                sx={{
                  width: 80,
                  height: 80,
                  border: (theme) =>
                    `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
                }}
                slotProps={{ icon: { width: 36, height: 36 } }}
                {...slotProps?.thumbnail}
              />
              {
                typeof file === "string" &&
                <IconButton
                  component="a"
                  href={path}
                  download={name}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'white',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
                  }}
                >
                  <Iconify icon="eva:download-fill" width={16} />
                </IconButton>
              }
            </Box>
          );
        }

        return (
          <Box
            component="li"
            key={name}
            sx={{
              py: 1,
              pr: 1,
              pl: 1.5,
              gap: 1.5,
              display: 'flex',
              borderRadius: 1,
              alignItems: 'center',
              border: (theme) =>
                `solid 1px ${varAlpha(theme.vars.palette.grey['500Channel'], 0.16)}`,
            }}
          >
            <FileThumbnail file={file} {...slotProps?.thumbnail} />

            <ListItemText
              primary={name}
              secondary={fData(size)}
              secondaryTypographyProps={{ component: 'span', typography: 'caption' }}
            />

            {onRemove && (
              <IconButton size="small" onClick={() => onRemove(file)}>
                <Iconify icon="mingcute:close-line" width={16} />
              </IconButton>
            )}
          </Box>
        );
      })}

      {renderLastNode}
    </Box>
  );
}
