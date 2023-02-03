import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import AuthPage from "@/components/AuthPage/AuthPage";
import { useRouter } from "next/router";

const Login = () => {
  const [neptun, setNeptun] = useState("");
  const [password, setPassword] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  if (session) router.push("/");

  return (
    <AuthPage
      title={"Login"}
      confirmButtonLabel={"Sign In"}
      confirmButtonOnClick={() => signIn("credentials", { neptun, password })}
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
    </AuthPage>
  );
};
export default Login;
