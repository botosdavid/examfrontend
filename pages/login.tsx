import { useState } from "react";
import { signIn, SignInResponse } from "next-auth/react";
import AuthPage from "@/components/AuthPage/AuthPage";
import { GetServerSideProps } from "next/types";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession, Session } from "next-auth";
import { notifyInvalidCredentials } from "@/utils/toast/toastify";
import CustomInput from "@/components/CustomInput/CustomInput";
import Link from "next/link";
interface LoginPageProps {
  session: Session;
}

const handleLoginIn = async (credentials: LoginCredentials) => {
  const { ok } = (await signIn("credentials", {
    ...credentials,
    redirect: false,
  })) as SignInResponse;

  if (!ok) return notifyInvalidCredentials();
  window.location.replace("/");
};

const Login = ({ session }: LoginPageProps) => {
  const [neptun, setNeptun] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthPage
      title={"Login"}
      confirmButtonLabel={"Sign In"}
      confirmButtonOnClick={() => handleLoginIn({ neptun, password })}
    >
      <CustomInput
        type="text"
        label="Neptun"
        value={neptun}
        onChange={(e) => setNeptun(e.target.value)}
      />
      <CustomInput
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Link href={"/registration"}>Haven&apos;t got an account yet?</Link>
    </AuthPage>
  );
};
export default Login;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
