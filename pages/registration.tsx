import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const Registration = () => {
  const [name, setName] = useState("");
  const [neptun, setNeptun] = useState("");
  const [password, setPassword] = useState("");
  const { data: session } = useSession();

  const registerUser = async () => {
    const res = await fetch("/api/hello");
    const data = await res.json();
    console.log(data);
  };

  if (session) return <div>Logged in buddy! {session.user?.name}</div>;
  return (
    <div>
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
      <button onClick={() => signIn()}>Sign Up</button>
    </div>
  );
};
export default Registration;
