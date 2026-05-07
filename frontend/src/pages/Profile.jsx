import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Profile() {
  const [posts, setPosts] = useState([]);

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Avni Singhal",
    email: "avni@techy.com",
  };

  const API_URL = "https://blog-backend-rn0w.onrender.com";

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/posts`);
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const userPosts = posts.filter(
    (post) => post.author === user.email
  );

  return (
    <section className="profile-page">
      <div className="profile-hero">
        <div className="profile-avatar">
          {user.name ? user.name.charAt(0).toUpperCase() : "A"}
        </div>

        <h1>{user.name || "Avni Singhal"}</h1>
        <p>{user.email}</p>

        <Link to="/write">
          <button className="primary-btn">Write New Story</button>
        </Link>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <h2>{userPosts.length}</h2>
          <p>Stories</p>
        </div>

        <div className="stat-card">
          <h2>{userPosts.length * 48}</h2>
          <p>Reads</p>
        </div>

        <div className="stat-card">
          <h2>{userPosts.length * 7}</h2>
          <p>Likes</p>
        </div>
      </div>

      <div className="profile-section">
        <h2>Your Published Stories</h2>

        {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <div className="profile-story" key={post._id}>
              <div>
                <h3>{post.title}</h3>
                <p>{post.category || "Story"} • Published</p>
              </div>

              <div className="profile-story-actions">
                <Link to={`/post/${post._id}`}>Read</Link>
                <Link to={`/edit/${post._id}`}>Edit</Link>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-text">
            You have not published any stories yet.
          </p>
        )}
      </div>
    </section>
  );
}
