import { useEffect } from "react";
import Button from "../Button/Button";
import * as s from "./AuthPageAtom";

const enterKey = "Enter";

interface AuthPageProps {
  title: string;
  children: React.ReactNode;
  disableButton: boolean;
  confirmButtonLabel: string;
  confirmButtonOnClick: () => void;
}

const AuthPage = ({
  title,
  children,
  disableButton,
  confirmButtonLabel,
  confirmButtonOnClick,
}: AuthPageProps) => {
  useEffect(() => {
    const handleSubmit = (event: KeyboardEvent) => {
      if (event.key === enterKey) confirmButtonOnClick();
    };
    window.addEventListener("keydown", handleSubmit);
    return () => {
      window.removeEventListener("keydown", handleSubmit);
    };
  }, [confirmButtonOnClick]);

  return (
    <s.PageContainer>
      <s.CredentialsContainer>
        <s.CredentialsBox>
          <s.Title>{title}</s.Title>
          {children}
          <Button disabled={disableButton} onClick={confirmButtonOnClick}>
            {confirmButtonLabel}
          </Button>
        </s.CredentialsBox>
      </s.CredentialsContainer>
    </s.PageContainer>
  );
};

export default AuthPage;
