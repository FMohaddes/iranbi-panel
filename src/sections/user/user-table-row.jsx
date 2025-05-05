import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableCell from "@mui/material/TableCell";
import FormGroup from "@mui/material/FormGroup";
import IconButton from "@mui/material/IconButton";
import FormControlLabel
  from "@mui/material/FormControlLabel";

import {
  useBoolean
} from "src/hooks/use-boolean";

import { Iconify } from "src/components/iconify";
import {
  ConfirmDialog
} from "src/components/custom-dialog";
import {
  usePopover , CustomPopover
} from "src/components/custom-popover";

import {
  UserQuickEditForm
} from "./user-quick-edit-form";

// ----------------------------------------------------------------------

export function UserTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow, userRoles, handleIsActiveChange }) {
  const confirm = useBoolean();

  const popover = usePopover();

  const quickEdit = useBoolean();

  return (
    <>
      <TableRow hover selected={selected} aria-checked={selected} tabIndex={-1}>
        <TableCell padding="checkbox">
          <Checkbox id={row.UserID} checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Stack spacing={2} direction="row" alignItems="center">
            <Avatar alt={row.Username} src={row.avatarUrl} />

            <Stack sx={{ typography: 'body2', flex: '1 1 auto', alignItems: 'flex-start' }}>
              <Box color="inherit">
                {row.FirstName} {row.LastName}
              </Box>
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {row.Email}
              </Box>
            </Stack>
          </Stack>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row.Username}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{row?.Roles[0]?.RoleName}</TableCell>

        <TableCell>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={row.IsActive}
                  onChange={(event) => handleIsActiveChange(row.UserID, event)}  // Pass UserID and event to the handler
                  color="primary"
                />
              }
            />
          </FormGroup>
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center">
            <Tooltip title="ویرایش سریع" placement="top" arrow>
              <IconButton
                color={quickEdit.value ? 'inherit' : 'default'}
                onClick={quickEdit.onTrue}
              >
                <Iconify icon="solar:pen-bold" />
              </IconButton>
            </Tooltip>

            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </Stack>
        </TableCell>
      </TableRow>

      <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} userRoles={userRoles}/>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            حذف
          </MenuItem>
        </MenuList>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="حذف"
        content="آیا از حذف کردن اطمینان دارید؟"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            حذف
          </Button>
        }
      />
    </>
  );
}
