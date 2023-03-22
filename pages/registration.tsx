import { useState } from "react";
import AuthPage from "@/components/AuthPage/AuthPage";
import { GetServerSideProps } from "next/types";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession, Session } from "next-auth";
import FormControlLabel from "@mui/material/FormControlLabel";
import CustomSwitch from "@/components/CustomSwitch/CustomSwitch";
import { useMutation } from "react-query";
import { createUser } from "@/utils/api/post";
import { useRouter } from "next/router";
import CustomInput from "@/components/CustomInput/CustomInput";

import { registrationSchema } from "@/utils/validation/schema";
import type { registrationSchemaType } from "@/utils/validation/schema";
import { ZodFormattedError } from "zod";
import { notifyRegistered } from "@/utils/toast/toastify";

interface RegistrationPageProps {
  session: Session;
}

const Registration = ({ session }: RegistrationPageProps) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [neptun, setNeptun] = useState("");
  const [password, setPassword] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  const [errors, setErrors] =
    useState<ZodFormattedError<registrationSchemaType>>();

  const createUserMutation = useMutation(createUser, {
    onSuccess: () => {
      notifyRegistered();
      router.push("/login");
    },
  });

  const handleSubmit = () => {
    const result = registrationSchema.safeParse({
      name,
      neptun,
      password,
      isTeacher,
    });
    if (!result.success) return setErrors(result.error.format());
    createUserMutation.mutate({ name, neptun, password, isTeacher });
  };

  return (
    <AuthPage
      title={"Register"}
      confirmButtonLabel={"Sign Up"}
      confirmButtonOnClick={handleSubmit}
    >
      <CustomInput
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={!!errors?.name?._errors?.[0]}
        helperText={errors?.name?._errors?.[0]}
      />
      <CustomInput
        type="text"
        placeholder="Neptun"
        value={neptun}
        onChange={(e) => setNeptun(e.target.value)}
        error={!!errors?.neptun?._errors?.[0]}
        helperText={errors?.neptun?._errors?.[0]}
      />
      <CustomInput
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={!!errors?.password?._errors?.[0]}
        helperText={errors?.password?._errors?.[0]}
      />
      <FormControlLabel
        control={
          <CustomSwitch
            checked={isTeacher}
            onChange={(e) => setIsTeacher(e.target.checked)}
          />
        }
        label="I'm a teacher"
      />
    </AuthPage>
  );
};
export default Registration;

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
