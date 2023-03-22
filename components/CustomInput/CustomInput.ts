import TextField from "@mui/material/TextField";
import styled from "styled-components";

interface CustomInputProps {
  selected?: boolean;
}

const CustomInput = styled(TextField)<CustomInputProps>(
  ({ theme, selected }) => ({
    backgroundColor: `${selected ? "lightgreen" : "transparent"}`,
    ".css-1sumxir-MuiFormLabel-root-MuiInputLabel-root.Mui-focused": {
      color: `${theme.main}`,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: `${theme.main}`,
    },
    "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
      color: `${theme.main}`,
    },
  })
);

export default CustomInput;
