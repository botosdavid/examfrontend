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
        <s.Title>{title}</s.Title>
        {children}
        <s.ConfirmButton onClick={confirmButtonOnClick}>
          {confirmButtonLabel}
        </s.ConfirmButton>
      </s.CredentialsContainer>
    </s.PageContainer>
  );
};

export default AuthPage;
