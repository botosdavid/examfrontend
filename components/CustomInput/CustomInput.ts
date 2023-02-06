import TextField from "@mui/material/TextField";
import styled from "styled-components";

const CustomInput = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: `${theme.main} !important`,
    },
    "& .css-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input": {
        color: `${theme.main}`,
    }
}));

export default CustomInput;