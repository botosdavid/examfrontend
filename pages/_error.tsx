import * as s from "../styles/shared";
import { useRouter } from "next/navigation";
import Button from "@/components/Button/Button";

function Error({ statusCode }: { statusCode: number }) {
  const router = useRouter();

  return (
    <s.ErrorMessage>
      Something went wrong
      <Button onClick={router.refresh}>Try again</Button>
    </s.ErrorMessage>
  );
}

export const getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
