'use client';

import useSWR , { mutate } from "swr";
import {
  useState , useContext , useCallback
} from "react";

import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import TableBody from "@mui/material/TableBody";
import IconButton from "@mui/material/IconButton";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import {
  RouterLink
} from "src/routes/components";

import {
  useBoolean
} from "src/hooks/use-boolean";
import {
  useSetState
} from "src/hooks/use-set-state";

import { varAlpha } from "src/theme/styles";
import {
  DashboardContent
} from "src/layouts/dashboard";

import { toast } from "src/components/snackbar";
import { Iconify } from "src/components/iconify";
import {
  Scrollbar
} from "src/components/scrollbar";
import {
  ConfirmDialog
} from "src/components/custom-dialog";
import {
  CustomBreadcrumbs
} from "src/components/custom-breadcrumbs";
import {
  useTable ,
  emptyRows ,
  rowInPage ,
  TableNoData ,
  getComparator ,
  TableEmptyRows ,
  TableHeadCustom ,
  TableSelectedAction ,
  TablePaginationCustom ,
} from "src/components/table";

import { UserTableRow } from "../user-table-row";
import {
  AuthContext
} from "../../../auth/context/auth-context";
import axios , {
  fetcher , endpoints
} from "../../../utils/axios";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'FirstName', label: 'نام و نام خانوادگی' ,},
  { id: 'Username', label: 'نام کاربری' ,},
  // { id: 'Phone', label: 'تلفن همراه', width: 180 },
  { id: 'RoleID', label: 'نقش', width: 180 },
  { id: 'IsActive', label: 'وضعیت کاربر', width: 180 },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------
const swrOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function UserListView() {
  const table = useTable();
  const router = useRouter();
  const confirm = useBoolean();
  const [tableData, setTableData] = useState([]);
  const { user } = useContext(AuthContext);

  const { data, isLoading, error, isValidating} = useSWR(endpoints.user.list, fetcher, {
    ...swrOptions,
  });
  const { data: roles, isLoading: isRolesLoading, error: rolesError } = useSWR(
    endpoints.user.roles,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      keepPreviousData: true,
    }
  );

  const userRoles=roles?.data || []


  const filters = useSetState({ name: '', role: [], status: 'all' });
  const dataFiltered = applyFilter({
    inputData: data?.filter(item => item.UserID !==user?.UserID) || [],
    comparator: getComparator(table.order, table.orderBy),
    filters: filters.state,
  });

  const dataInPage = rowInPage(dataFiltered, table.page, table.rowsPerPage);

  const canReset =
    !!filters.state.name || filters.state.role.length > 0 || filters.state.status !== 'all';

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;



  const handleIsActiveChange = useCallback(async (id, event) => {
    const IsActive = event.target.checked;

    try {
      const response = await axios.patch(`${endpoints.user.update}/${id}`, {
        IsActive
      });

      if (response.status === 200) {
        mutate(endpoints.user.list);
        toast.success('آپدیت موفقیت آمیز!');
      } else {
        toast.error('خطا در آپدیت!');
      }
    } catch (error) {
      toast.error('خطا در آپدیت!');
    }
  }, []);



  const handleDeleteRow = useCallback(async (id) => {
    try {
      const response = await axios.delete(`${endpoints.user.delete}/${id}`);

      if (response.status === 200) {
        mutate(endpoints.user.list)
        toast.success('حذف موفقیت آمیز!');
        table.onUpdatePageDeleteRow(dataInPage.length);

      } else {
        toast.error('خطا در حذف!');
      }
    } catch (error) {
      console.error('Error deleting row:', error);
      toast.error('خطا در حذف!');
    }
  }, [dataInPage.length, table, tableData]);


  const handleDeleteRows = useCallback(async () => {
    try {
      const response = await axios.delete(`${endpoints.user.bulkDelete}`, {
        data: {
          userIds: table.selected
        }
      });

      if (response.status === 200) {
        mutate(endpoints.user.list)
        toast.success('حذف موفقیت آمیز!');
        table.onUpdatePageDeleteRow(dataInPage.length);

      } else {
        toast.error('خطا در حذف!');
      }
    } catch (error) {
      console.error('Error deleting rows:', error);
      toast.error('خطا در حذف!');
    }
  }, [dataFiltered.length, dataInPage.length, table, tableData]);


  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  const handleFilterStatus = useCallback(
    (event, newValue) => {
      table.onResetPage();
      filters.setState({ status: newValue });
    },
    [filters, table]
  );

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs
          heading="لیست کاربران"
          links={[
            { name: 'داشبورد', href: paths.dashboard.root },
            { name: 'لیست' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.user.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              کاربر جدید
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card>
          <Tabs
            value={filters.state.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) =>
                `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
            }}
           />

          <Box sx={{ position: 'relative' }}>
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => row.UserID)
                )
              }
              action={
                <Tooltip title="حذف">
                  <IconButton color="primary" onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              }
            />

            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={dataFiltered.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      dataFiltered.map((row) => row.UserID)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UserTableRow
                        key={row.UserID}
                        row={row}
                        userRoles={userRoles}
                        handleIsActiveChange={handleIsActiveChange}
                        selected={table.selected.includes(row.UserID)}
                        onSelectRow={() => table.onSelectRow(row.UserID)}
                        onDeleteRow={() => handleDeleteRow(row.UserID)}
                        onEditRow={() => handleEditRow(row.UserID)}
                      />
                    ))}

                  <TableEmptyRows
                    height={table.dense ? 56 : 56 + 20}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </Box>

          <TablePaginationCustom
            page={table.page}
            dense={table.dense}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onChangeDense={table.onChangeDense}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="حذف"
        content={
          <>
          آیا از حذف کردن <strong> {table.selected.length} </strong> اطمینان دارید؟
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            حذف
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name, status, role } = filters;
  if (!Array.isArray(inputData)) {
    return [];
  }

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((user) => user.status === status);
  }

  if (role.length) {
    inputData = inputData.filter((user) => role.includes(user.role));
  }

  return inputData;
}
