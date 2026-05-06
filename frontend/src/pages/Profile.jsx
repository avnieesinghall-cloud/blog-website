import { Link } from "react-router-dom";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Avni Singhal",
    email: "avni@insightflow.com",
  };

  return (
    <section className="profile-page">
      <div className="profile-hero">
        <div className="profile-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : "A"}
        </div>

        <h1>{user.name || "Avni Singhal"}</h1>
        <p>{user.email || "avni@insightflow.com"}</p>

        <Link to="/write">
          <button className="primary-btn">Write New Story</button>
        </Link>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <h2>12</h2>
          <p>Stories</p>
        </div>

        <div className="stat-card">
          <h2>248</h2>
          <p>Reads</p>
        </div>

        <div className="stat-card">
          <h2>36</h2>
          <p>Likes</p>
        </div>
      </div>

      <div className="profile-section">
        <h2>Your Recent Stories</h2>

        <div className="profile-story">
          <div>
            <h3>Building Modern React Apps</h3>
            <p>Draft • Updated today</p>
          </div>

          <Link to="/write">Edit</Link>
        </div>

        <div className="profile-story">
          <div>
            <h3>Designing Clean Interfaces</h3>
            <p>Published • 2 days ago</p>
          </div>

          <Link to="/write">Edit</Link>
        </div>
      </div>
    </section>
  );
}