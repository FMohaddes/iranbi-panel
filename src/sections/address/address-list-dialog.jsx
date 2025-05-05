import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

export function AddressListDialog({
  list,
  open,
  action,
  onClose,
  selected,
  onSelect,
  title = '',
}) {
  const [searchAddress, setSearchAddress] = useState('');

  const dataFiltered = applyFilter({ inputData: list, query: searchAddress });

  const notFound = !dataFiltered?.length && !!searchAddress;

  const handleSearchAddress = useCallback((event) => {
    setSearchAddress(event.target.value);
  }, []);

  const handleSelectAddress = useCallback(
    (address) => {
      onSelect(address);
      setSearchAddress('');
      onClose();
    },
    [onClose, onSelect]
  );

  const renderList = (
    <Scrollbar sx={{ p: 0.5, maxHeight: 480 }}>
      {dataFiltered?.map((address,index) => (
        <ButtonBase
          key={index + address.LastName + address.FirstName}
          onClick={() => handleSelectAddress(address)}
          sx={{
            py: 1,
            my: 0.5,
            px: 1.5,
            gap: 0.5,
            width: 1,
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            ...(selected(`${address.id}`) && {
              bgcolor: 'action.selected',
            }),
          }}
        >
          <Stack direction="row" spacing={1}>
            <Typography variant="subtitle2">{address.FirstName} {address.LastName}</Typography>

            {address.Addresses?.[0]?.City && <Label color="info">{ address.Addresses?.[0]?.City } ({ address.Addresses?.[0]?.Country })</Label>}
          </Stack>

          {address?.PostalCode && (
            <Box sx={{ color: 'primary.main', typography: 'caption' }}>{address?.PostalCode}</Box>
          )}

          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {address.Addresses?.[0]?.AddressLine1}
          </Typography>

          {address.PhoneNumber && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {address.PhoneNumber}
            </Typography>
          )}
        </ButtonBase>
      ))}
    </Scrollbar>
  );

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 3, pr: 1.5 }}
      >
        <Typography variant="h6"> {title} </Typography>

        {action && action}
      </Stack>

      <Stack sx={{ p: 2, pt: 0 }}>
        <TextField
          value={searchAddress}
          onChange={handleSearchAddress}
          placeholder="جستجو..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      {notFound ? (
        <SearchNotFound query={searchAddress} sx={{ px: 3, pt: 5, pb: 10 }} />
      ) : (
        renderList
      )}
    </Dialog>
  );
}

function applyFilter({ inputData, query }) {
  if (query) {
    return inputData?.filter(
      (search) =>
        (search.FirstName ? search.FirstName.toLowerCase() : '').indexOf(query.toLowerCase()) !== -1 ||
        (search.LastName ? search.LastName.toLowerCase() : '').indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}

