import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem("token", "demo-token");
    localStorage.setItem("user", JSON.stringify({ email: form.email }));

    navigate("/");
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-badge">✨ Welcome back</div>

        <h1>Login to InsightFlow</h1>
        <p>Continue writing, sharing, and publishing your ideas beautifully.</p>

        <form onSubmit={handleSubmit} className="auth-form">
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

          <button type="submit" className="primary-btn auth-btn">
            Login
          </button>
        </form>

        <p className="auth-switch">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </section>
  );
}