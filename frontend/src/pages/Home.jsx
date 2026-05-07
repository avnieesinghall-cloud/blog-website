import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  const API_URL = "https://insightflow-backend-7vjp.onrender.com";

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_URL}/posts`);
      setPosts(res.data);
    } catch (err) {
      console.log("Home fetch error:", err);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <section className="hero">
        <div className="badge">🚀 Modern blogging for creators</div>

        <h1>
          Share ideas with clarity,
          <br />
          style, and flow.
        </h1>

        <p>
          InsightFlow is a premium writing space for developers, students,
          creators, and thinkers to publish stories beautifully.
        </p>

        <div className="hero-actions">
          <Link to="/write">
            <button className="primary-btn">Start Writing</button>
          </Link>

          <a href="#stories">
            <button className="secondary-btn">Explore Stories</button>
          </a>
        </div>
      </section>

      <section className="stories-section" id="stories">
        <h2>Latest Stories</h2>

        <input
          type="text"
          placeholder="Search stories..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="story-grid">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <Link
                to={`/post/${post._id}`}
                className="story-card"
                key={post._id}
              >
                <img
                  src={
                    post.coverImage ||
                    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4"
                  }
                  alt={post.title}
                />

                <div className="story-content">
                  <h3>{post.title}</h3>
                  <p>{post.content?.slice(0, 100)}...</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="empty-text">No stories found yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}