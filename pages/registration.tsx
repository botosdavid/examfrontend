import { useState } from "react";
import AuthPage from "@/components/AuthPage/AuthPage";
import { GetServerSideProps } from "next/types";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession, Session } from "next-auth";
import FormControlLabel from "@mui/material/FormControlLabel";
import CustomSwitch from "@/components/CustomSwitch/CustomSwitch";

interface RegistrationPageProps {
  session: Session;
}

const Registration = ({ session }: RegistrationPageProps) => {
  const [name, setName] = useState("");
  const [neptun, setNeptun] = useState("");
  const [password, setPassword] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);

  const handleRegistration = async () => {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, neptun, password, isTeacher }),
    });
    if (response.status !== 200) return;
    window.location.replace("/login");
  };

  return (
    <AuthPage
      title={"Register"}
      confirmButtonLabel={"Sign Up"}
      confirmButtonOnClick={handleRegistration}
    >
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
