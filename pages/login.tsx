import { useState } from "react";
import { signIn, SignInResponse } from "next-auth/react";
import AuthPage from "@/components/AuthPage/AuthPage";
import { GetServerSideProps } from "next/types";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession, Session } from "next-auth";
import { notifyInvalidCredentials } from "@/utils/toast/toastify";
import CustomInput from "@/components/CustomInput/CustomInput";
import Link from "next/link";
import { loginSchema, loginSchemaType } from "@/utils/validation/schema";
import { ZodFormattedError } from "zod";
import Loading from "@/components/Loading/Loading";

interface LoginPageProps {
  session: Session;
}

const Login = ({ session }: LoginPageProps) => {
  const [neptun, setNeptun] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] =
    useState<ZodFormattedError<loginSchemaType> | null>();

  const handleLoginIn = async (credentials: LoginCredentials) => {
    const validate = loginSchema.safeParse(credentials);
    if (!validate.success) return setErrors(validate.error.format());
    setErrors(null);

    setIsLoading(true);
    const { ok } = (await signIn("credentials", {
      ...credentials,
      redirect: false,
    })) as SignInResponse;
    setIsLoading(false);

    if (!ok) return notifyInvalidCredentials();
    window.location.replace("/");
  };

  return (
    <AuthPage
      title={"Login"}
      confirmButtonLabel={"Sign In"}
      confirmButtonOnClick={() => handleLoginIn({ neptun, password })}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <CustomInput
            type="text"
            label="Neptun"
            value={neptun}
            onChange={(e) => setNeptun(e.target.value)}
            error={!!errors?.neptun?._errors?.[0]}
            helperText={errors?.neptun?._errors?.[0]}
          />
          <CustomInput
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors?.password?._errors?.[0]}
            helperText={errors?.password?._errors?.[0]}
          />
          <Link href={"/registration"}>Haven&apos;t got an account yet?</Link>
        </>
      )}
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
