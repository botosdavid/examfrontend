import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import AuthPage from "@/components/AuthPage/AuthPage";

const Registration = () => {
  const [name, setName] = useState("");
  const [neptun, setNeptun] = useState("");
  const [password, setPassword] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const handleRegistration = async () => {
    const res = await fetch("/api/registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, neptun, password }),
    });
    router.push("/login");
  };

  if (session) router.push("/");

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
    </AuthPage>
  );
};
export default Registration;
