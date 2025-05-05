import { useState, useCallback } from "react";
import { useFormContext } from "react-hook-form";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import { Iconify } from "src/components/iconify";

import { Field } from "../../components/hook-form";

export function BulkDialog({
                             list,
                             open,
                             action,
                             onClose,
                             selected,
                             onSelect,
                             title = "",
                           }) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const [ProductsDescription, setProductsDescription] = useState([]);

  const values = watch();
  const { ProductsCodes, ProductsID, ProductsIDs = [] } = values;

  // Function to handle reset and add to tags
  const handleResetAndAddToProductsIDs = useCallback(() => {
    const selectedProduct = list.find((product) => product.ProductID === ProductsID);

    if (!selectedProduct) {
      return;
    }

    const { ProductID: id, Description: description, ProductCode: code } = selectedProduct;

    const updatedProductsIDs = ProductsIDs
      ? [...ProductsIDs, {...selectedProduct}]
      : [{...selectedProduct}];

    const updatedDescription = ProductsDescription
      ? [...ProductsDescription, description]
      : [description];

    setValue("ProductsIDs", updatedProductsIDs);
    setProductsDescription(updatedDescription);
  }, [ProductsID, setValue, list, ProductsIDs, ProductsDescription]);

  // Function to handle removal of chips
  const handleRemoveChip = useCallback(
    (value) => {
      // Filter out the removed item from ProductsDescription
      const updatedDescription = ProductsDescription.filter((item) => item !== value);
      setProductsDescription(updatedDescription);

      // Filter out the corresponding item from ProductsIDs
      const updatedProductsIDs = ProductsIDs.filter(
        (item) => item.description !== value
      );
      setValue("ProductsIDs", updatedProductsIDs);
    },
    [ProductsDescription, ProductsIDs, setValue]
  );

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 3, pr: 1.5 }}
      >
        <Typography variant="h6">{title}</Typography>
        {action && action}
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ px: 3, pb: 3 }}
      >
        <Field.Autocomplete
          name="ProductsCodes"
          label="کد محصولات"
          options={list.filter(
            (product, index, self) =>
              index === self.findIndex((p) => p.ProductCode === product.ProductCode)
          )}
          getOptionLabel={(option) => option.ProductCode}
          returnValue="value"
          valueKey="ProductCode"
          labelKey="ProductCode"
          onChange={(event, value) => {
            setValue("ProductsCodes", value?.ProductCode || null);
            setValue("ProductsID", null);
          }}
        />

        <Field.Autocomplete
          name="ProductsID"
          label="محصولات"
          options={list.filter((option) => option.ProductCode === ProductsCodes)}
          getOptionLabel={(option) => option.Description}
          returnValue="value"
          valueKey="ProductID"
          labelKey="Description"
        />

        <Button
          sx={{ height: 40 }}
          variant="contained"
          onClick={handleResetAndAddToProductsIDs}
          disabled={!ProductsID}
        >
          <IconButton>
            <Iconify icon="mingcute:add-line" />
          </IconButton>
        </Button>
      </Stack>

      {/* Field.AutocompleteChip for ProductsIDs */}
      <Box sx={{ px: 3, pb: 3 }}>
        <Field.AutocompleteChip
          name="ProductsIDs"
          label=""
          placeholder="محصولات انتخاب شده"
          multiple
          disableCloseOnSelect
          options={[]}
          value={ProductsDescription || []}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(selected, getTagProps) =>
            selected.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                color="info"
                variant="soft"
                onDelete={() => handleRemoveChip(option)} // Add onDelete handler
              />
            ))
          }
          onChange={(event, value) => {
            setProductsDescription(value);
            setValue(
              "ProductsIDs",
              value.map((desc) =>
                ProductsIDs.find((item) => item.description === desc)
              )
            );
          }}
        />
      </Box>
    </Dialog>
  );
}
