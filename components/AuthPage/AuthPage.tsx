import Button from "../Button/Button";
import * as s from "./AuthPageAtom";

interface AuthPageProps {
  title: string;
  children: React.ReactNode;
  confirmButtonLabel: string;
  confirmButtonOnClick: () => void;
}

const AuthPage = ({
  title,
  children,
  confirmButtonLabel,
  confirmButtonOnClick,
}: AuthPageProps) => {
  return (
    <s.PageContainer>
      <s.CredentialsContainer>
        <s.CredentialsBox>
          <s.Title>{title}</s.Title>
          {children}
          <Button onClick={confirmButtonOnClick}>{confirmButtonLabel}</Button>
        </s.CredentialsBox>
      </s.CredentialsContainer>
    </s.PageContainer>
  );
};

export default AuthPage;
