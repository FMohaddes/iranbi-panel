import {
  useState , useEffect ,
  useCallback
} from "react";

import Stack from "@mui/material/Stack";
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TextField from "@mui/material/TextField";
import InputAdornment
  from "@mui/material/InputAdornment";

import { useSetState } from 'src/hooks/use-set-state';

import { Iconify } from 'src/components/iconify';
import { usePopover, CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export function ProductTableToolbar( { filters, options }) {
  const popover = usePopover();
  const [searchTerm, setSearchTerm] = useState(filters.state.search);
  let typingTimer;
  const typingDelay = 2000;

  const handleFilterSearch = useCallback(
    (event) => {
      const { value } = event.target;
      setSearchTerm(value);

      clearTimeout(typingTimer);
      typingTimer = setTimeout(() => {
        filters.setState({ search: value });
      }, typingDelay);
    },
    [filters]
  );

  useEffect(() => () => clearTimeout(typingTimer), []);

  const local = useSetState({
    stock: filters.state.stock,
    publish: filters.state.publish,
  });

  const handleChangeStock = useCallback(
    (event) => {
      const {
        target: { value },
      } = event;

      local.setState({ stock: typeof value === 'string' ? value.split(',') : value });
    },
    [local]
  );

  const handleChangePublish = useCallback(
    (event) => {
      const {
        target: { value },
      } = event;

      local.setState({ publish: typeof value === 'string' ? value.split(',') : value });
    },
    [local]
  );

  const handleFilterStock = useCallback(() => {
    filters.setState({ stock: local.state.stock });
  }, [filters, local.state.stock]);

  const handleFilterPublish = useCallback(() => {
    filters.setState({ publish: local.state.publish });
  }, [filters, local.state.publish]);

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5, pr: { xs: 2.5, md: 1 } }}
      >

        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            fullWidth
            value={searchTerm}
            onChange={handleFilterSearch}
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
      </Stack>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:printer-minimalistic-bold" />
            چاپ
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:import-bold" />
            ورودی
          </MenuItem>

          <MenuItem
            onClick={() => {
              popover.onClose();
            }}
          >
            <Iconify icon="solar:export-bold" />
            خروجی
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
