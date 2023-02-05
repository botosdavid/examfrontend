import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

const CustomSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
        color: `rgba(93,107,237,255)`,
        "&:hover": {
        backgroundColor: "rgba(93,107,237,0.3)",
        },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
        backgroundColor: "rgba(93,107,237,255)",
    },
}));

export default CustomSwitch;