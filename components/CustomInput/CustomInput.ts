import TextField from "@mui/material/TextField";
import styled from "styled-components";

interface CustomInputProps {
  isSelected?: boolean;
}

const CustomInput = styled(TextField)<CustomInputProps>(
  ({ theme, isSelected }) => ({
    backgroundColor: `${isSelected ? "lightgreen" : "white"}`,
    ".css-1sumxir-MuiFormLabel-root-MuiInputLabel-root.Mui-focused": {
      color: `${theme.main}`,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: `${theme.main} !important`,
    },
    "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
      color: `${theme.main}`,
    },
  })
);

export default CustomInput;
