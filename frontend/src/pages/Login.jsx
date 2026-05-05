import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://blog-backend-rn0w.onrender.com/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      toast.success("Login successful 🚀");
      navigate("/");
      window.location.reload();
    } catch {
      toast.error("Invalid credentials ❌");
    }
  };

  return (
    <div className="auth-box">
      <h2>Welcome back</h2>

      <form className="form" onSubmit={login}>
        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="btn btn-primary">Login</button>
      </form>

      <p>
        New here? <Link to="/register">Create account</Link>
      </p>
    </div>
  );
}