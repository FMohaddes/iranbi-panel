'use client';

import useSWR , { mutate } from "swr";
import React , { useState , useEffect , useCallback } from "react";

import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import {
  DataGrid ,
  gridClasses ,
  GridActionsCellItem ,
  GridToolbarContainer ,
  GridToolbarFilterButton ,
  GridToolbarColumnsButton ,
} from "@mui/x-data-grid";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";
import { useSetState } from "src/hooks/use-set-state";

import { PRODUCT_STOCK_OPTIONS } from "src/_mock";
import { DashboardContent } from "src/layouts/dashboard";

import { toast } from "src/components/snackbar";
import { Iconify } from "src/components/iconify";
import { EmptyContent } from "src/components/empty-content";
import { ConfirmDialog } from "src/components/custom-dialog";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";

import { ProductTableToolbar } from "../product-table-toolbar";
import axios , { fetcher , endpoints } from "../../../utils/axios";
import { ProductTableFiltersResult } from "../product-table-filters-result";
import {
  RenderCellPrice ,
  RenderCellStock ,
  RenderCellProduct ,
  RenderCellDescription ,
} from "../product-table-row";

// ----------------------------------------------------------------------

const PUBLISH_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'draft', label: 'پیش نویس' },
];

const HIDE_COLUMNS = { category: false };

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  dedupingInterval: 5000,
};

export function ProductListView() {
  const confirmRows = useBoolean();
  const [tableData, setTableData] = useState([]);
  const router = useRouter();
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const filters = useSetState({ search: '', publish: [], stock: [] });

  const url = `${endpoints.product.list}?page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}&search=${filters.state.search}`;

  const { data, isLoading: productsLoading } = useSWR(url, fetcher, {
    ...swrOptions,
  });

  const products=data?.data || []
  const { itemsPerPage = 10, currentPage = 1, totalPages = 1, totalItems = 0 } = data || {};

  useEffect(() => {
    if (products.length) {
      setTableData(products);
    }
  }, [products]);

  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const [filterButtonEl, setFilterButtonEl] = useState(null);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(HIDE_COLUMNS);

  const canReset = filters.state.publish.length > 0 || filters.state.stock.length > 0;

  const dataFiltered = applyFilter({ inputData: tableData, filters: filters.state });

  const handleDeleteRow = useCallback(async (id) => {
      try {
        const response = await axios.delete(`${endpoints.product.delete}/${id}`);

        if (response.status === 200) {
          mutate(url)
          toast.success('حذف موفقیت آمیز!');
        } else {
          toast.error('خطا در حذف!');
        }
      } catch (error) {
        console.error('Error deleting row:', error);
        toast.error('خطا در حذف!');
      }
    },
    [tableData]
  );

  const handleDeleteRows = useCallback(async () => {
    try {
      const response = await axios.delete(`${endpoints.product.delete}`, {
        data: {
          ids: selectedRowIds
        }
      });

      if (response.status === 200) {
        mutate(url)
        toast.success('حذف موفقیت آمیز!');

      } else {
        toast.error('خطا در حذف!');
      }
    } catch (error) {
      console.error('Error deleting rows:', error);
      toast.error('خطا در حذف!');
    }
  }, [selectedRowIds, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.product.edit(id));
    },
    [router]
  );

  const CustomToolbarCallback = useCallback(
    () => (
      <CustomToolbar
        filters={filters}
        canReset={canReset}
        selectedRowIds={selectedRowIds}
        setFilterButtonEl={setFilterButtonEl}
        filteredResults={dataFiltered.length}
        onOpenConfirmDeleteRows={confirmRows.onTrue}
      />
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.state, selectedRowIds]
  );

  const handlePaginationChange = (newPaginationModel) => {
    setPaginationModel((prevModel) => {

      if (newPaginationModel.page === 0 && prevModel.page > 1) {
        return prevModel;
      }

      return {
        ...prevModel,
        page: newPaginationModel.page,
        pageSize: newPaginationModel.pageSize || prevModel.pageSize,
      };
    });
  };


  const columns = [
    { field: 'ProductCode', headerName: 'کدمحصول', filterable: false,
      renderCell: (params) => (
        <>{params?.row?.ProductCode}</>
      ),},
    {
      field: 'ProductName',
      headerName: 'نام محصول',
      flex: 1,
      minWidth: 340,
      hideable: false,
      renderCell: (params) => (
        <RenderCellProduct params={params} onViewRow={() => handleViewRow(params.row.ProductID)} />
      ),
    },
    {
      field: 'Description',
      headerName: 'توضیحات',
      width: 160,
      renderCell: (params) => <RenderCellDescription params={params} />,
    },
    {
      field: 'inventoryType',
      headerName: 'موجودی',
      width: 160,
      type: 'singleSelect',
      valueOptions: PRODUCT_STOCK_OPTIONS,
      renderCell: (params) => <RenderCellStock params={params} />,
    },
    {
      field: 'Price',
      headerName: 'قیمت',
      width: 140,
      editable: true,
      renderCell: (params) => <RenderCellPrice params={params} />,
    },
 /*   {
      field: 'publish',
      headerName: 'انتشار',
      width: 110,
      type: 'singleSelect',
      editable: true,
      valueOptions: PUBLISH_OPTIONS,
      renderCell: (params) => <RenderCellPublish params={params} />,
    }, */
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        /* <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="نمایش"
          onClick={() => handleViewRow(params.row.ProductID)}
        />, */
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="ویرایش"
          onClick={() => handleEditRow(params.row.ProductID)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="حذف"
          onClick={() => {
            handleDeleteRow(params.row.ProductID);
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);




  return (
    <>
      <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CustomBreadcrumbs
          heading="لیست محصولات"
          links={[
            { name: 'داشبورد', href: paths.dashboard.root },
            { name: 'لیست' },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.product.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
               محصول جدید
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 } }}
        />

        <Card
          sx={{
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            height: { xs: 800, md: 600 },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            checkboxSelection
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={productsLoading}
            paginationMode="server"
            rowCount={totalItems}
            paginationModel={paginationModel}
            onPaginationModelChange={handlePaginationChange}
            getRowId={(row) => row.ProductID}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[10, 25, 100]}
            onRowSelectionModelChange={(newSelectionModel) => setSelectedRowIds(newSelectionModel)}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              toolbar: CustomToolbarCallback,
              noRowsOverlay: () => <EmptyContent />,
              noResultsOverlay: () => <EmptyContent title="اطلاعاتی یافت نشد" />,
            }}
            slotProps={{
              panel: { anchorEl: filterButtonEl },
              toolbar: { setFilterButtonEl },
              columnsManagement: { getTogglableColumns },
            }}
            sx={{ [`& .${gridClasses.cell}`]: { alignItems: 'center', display: 'inline-flex' } }}
          />

        </Card>
      </DashboardContent>

      <ConfirmDialog
        open={confirmRows.value}
        onClose={confirmRows.onFalse}
        title="حذف"
        content={
          <>
            آیا از حذف کردن <strong> {selectedRowIds.length} </strong> اطمینان دارید؟
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirmRows.onFalse();
            }}
          >
            حذف
          </Button>
        }
      />
    </>
  );
}

function CustomToolbar({
  filters,
  canReset,
  selectedRowIds,
  filteredResults,
  setFilterButtonEl,
  onOpenConfirmDeleteRows,
}) {
  return (
    <>
      <GridToolbarContainer>
        <ProductTableToolbar
          filters={filters}
          options={{ stocks: PRODUCT_STOCK_OPTIONS, publishs: PUBLISH_OPTIONS }}
        />

        <Stack
          spacing={1}
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
        >
          {!!selectedRowIds.length && (
            <Button
              size="small"
              color="error"
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
              onClick={onOpenConfirmDeleteRows}
            >
              حذف ({selectedRowIds.length})
            </Button>
          )}

          <GridToolbarColumnsButton />
          <GridToolbarFilterButton ref={setFilterButtonEl} />
          {/* <GridToolbarExport /> */}
        </Stack>
      </GridToolbarContainer>

      {canReset && (
        <ProductTableFiltersResult
          filters={filters}
          totalResults={filteredResults}
          sx={{ p: 2.5, pt: 0 }}
        />
      )}
    </>
  );
}

function applyFilter({ inputData, filters }) {
  const {search, stock, publish } = filters;

  if (stock.length) {
    inputData = inputData.filter((product) => stock.includes(product.inventoryType));
  }

  if (publish.length) {
    inputData = inputData.filter((product) => publish.includes(product.publish));
  }
  if (search) {
    inputData = inputData.filter(
      (product) =>
        product.ProductName?.toLowerCase()?.includes(search.toLowerCase()) ||
        product.ProductCode?.toString()?.includes(search)
    );
  }

  return inputData;
}
