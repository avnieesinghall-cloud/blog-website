import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const API_URL = "https://blog-backend-rn0w.onrender.com";

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/login`, form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful ✨");

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="auth-page">
      <Toaster position="top-center" />

      <form onSubmit={handleLogin} className="auth-card">
        <span className="auth-badge">✨ Welcome back</span>

        <h1>Login to InsightFlow</h1>

        <p>Continue writing, sharing, and publishing your ideas beautifully.</p>

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" className="primary-btn">
          Login
        </button>

        <p className="auth-switch">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </section>
  );
}