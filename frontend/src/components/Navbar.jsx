import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLight, setIsLight] = useState(
    localStorage.getItem("theme") === "light"
  );

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isLight) {
      document.body.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  }, [isLight]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Insight<span>Flow</span>
      </Link>

      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/write">Write</NavLink>

        {token ? (
          <>
            <NavLink to="/profile">Profile</NavLink>

            <button
              type="button"
              className="theme-toggle"
              onClick={() => setIsLight(!isLight)}
            >
              {isLight ? "☀️ Light" : "🌙 Dark"}
            </button>

            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setIsLight(!isLight)}
            >
              {isLight ? "☀️ Light" : "🌙 Dark"}
            </button>

            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}