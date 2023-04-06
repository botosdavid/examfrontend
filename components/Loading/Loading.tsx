import { CircularProgress } from "@mui/material";
import * as s from "./LoadingAtom";

const Loading = () => {
  return (
    <s.LoadingWrapper>
      <CircularProgress />
    </s.LoadingWrapper>
  );
};

export default Loading;
