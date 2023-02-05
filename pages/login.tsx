import { useState } from "react";
import { signIn, SignInResponse } from "next-auth/react";
import AuthPage from "@/components/AuthPage/AuthPage";
import { GetServerSideProps } from "next/types";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession, Session } from "next-auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginPageProps {
  session: Session;
}

interface Credentials {
  neptun: string;
  password: string;
}

const notify = () =>
  toast("Invalid Credentials!", {
    position: "top-center",
    type: "error",
  });

const handleLoginIn = async (credentials: Credentials) => {
  const { ok } = (await signIn("credentials", {
    ...credentials,
    redirect: false,
  })) as SignInResponse;

  if (!ok) return notify();
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
      <input
        type="text"
        placeholder="Neptun"
        value={neptun}
        onChange={(e) => setNeptun(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <ToastContainer />
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
