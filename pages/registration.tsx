import { useState } from "react";

const Registration = () => {
  const [name, setName] = useState("");
  const [neptun, setNeptun] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {
    const res = await fetch("/api/hello");
    const data = await res.json();
    console.log(data);
  };

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
      <button onClick={registerUser}>Sign Up</button>
    </div>
  );
};
export default Registration;
