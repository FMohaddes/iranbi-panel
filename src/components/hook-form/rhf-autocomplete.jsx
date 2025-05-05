import { Controller, useFormContext } from "react-hook-form";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

// Utility function to detect HTML
function isHtml(content) {
  const htmlRegex = /<\/?[a-z][\s\S]*>/i; // Regex to match HTML tags
  return typeof content === "string" && htmlRegex.test(content);
}

// Utility function to safely strip HTML tags if present
function stripHtmlTags(content) {
  return content.replace(/<\/?[^>]+(>|$)/g, "");
}

export function RHFAutocomplete({
                                  name,
                                  label,
                                  helperText,
                                  placeholder,
                                  options = [],
                                  getOptionLabel = (option) => (option ? String(option.label || "") : ""),
                                  returnValue = "value",
                                  valueKey = "value",
                                  labelKey = "label",
                                  onChangeCallback = null,
                                  ...other
                                }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const selectedOption =
          options.find((opt) => opt[valueKey] === field.value) || null;

        return (
          <Autocomplete
            {...field}
            fullWidth
            size="small"
            options={options.filter((option) => option && typeof option === "object")} // Ensure valid options
            value={selectedOption}
            getOptionLabel={(option) => {
              const label = option?.[labelKey];
              return label
                ? isHtml(label)
                  ? stripHtmlTags(label) // Strip HTML for filtering
                  : String(label) // Use plain text or number as-is
                : "";
            }}
            renderOption={(props, option) => {
              const label = option[labelKey];
              return (
                <li {...props}>
                  {label
                    ? isHtml(label)
                      ? <span dangerouslySetInnerHTML={{ __html: label }} /> // Render HTML
                      : String(label) // Render plain text or number
                    : "بدون نتیجه"}
                </li>
              );
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const label = option[labelKey];
                return (
                  <span key={option[valueKey]} {...getTagProps({ index })}>
                    {label
                      ? isHtml(label)
                        ? stripHtmlTags(label) // Strip HTML for tags
                        : String(label) // Render plain text or number
                      : ""}
                  </span>
                );
              })
            }
            isOptionEqualToValue={(option, value) =>
              option[valueKey] === value?.[valueKey]
            }
            onChange={(event, newValue) => {
              let result = newValue;

              if (returnValue === "value") {
                result = newValue ? newValue[valueKey] : null;
              } else if (returnValue === "labelValue") {
                result = newValue
                  ? { label: newValue[labelKey], value: newValue[valueKey] }
                  : null;
              }

              field.onChange(result); // Update form state
              if (onChangeCallback) onChangeCallback(result); // Trigger additional logic
            }}
            inputValue={
              selectedOption?.[labelKey]
                ? isHtml(selectedOption[labelKey])
                  ? stripHtmlTags(selectedOption[labelKey]) // Remove HTML for inputValue
                  : String(selectedOption[labelKey]) // Render plain text or number
                : field.value || "" // Reflect user input if no option is selected
            }
            onInputChange={(event, newInputValue) => {
              if (event?.type === "change") {
                // Directly update inputValue to allow typing any valid characters
                field.onChange(newInputValue);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label={label}
                placeholder={placeholder}
                error={!!error}
                helperText={error ? error.message : helperText}
                inputProps={{
                  ...params.inputProps,
                  autoComplete: false,
                }}
              />
            )}
            {...other}
          />
        );
      }}
    />
  );
}
