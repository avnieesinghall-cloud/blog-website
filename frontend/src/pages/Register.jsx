import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/register`, form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Account created successfully ✨");

      setTimeout(() => {
        navigate("/");
      }, 800);
    } catch (err) {
      console.log("Register error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="auth-page">
      <Toaster position="top-center" />

      <form onSubmit={handleSubmit} className="auth-card">
        <span className="auth-badge">🚀 Join InsightFlow</span>

        <h1>Create your account</h1>

        <p>Start publishing clean, beautiful stories with a premium writing space.</p>

        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          required
        />

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
          Register
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
}