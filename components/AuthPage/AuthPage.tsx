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
          <s.ConfirmButton onClick={confirmButtonOnClick}>
            {confirmButtonLabel}
          </s.ConfirmButton>
        </s.CredentialsBox>
      </s.CredentialsContainer>
    </s.PageContainer>
  );
};

export default AuthPage;
