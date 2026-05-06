import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/posts");
      setPosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <section className="hero">
        <div className="badge">
          🚀 Modern blogging for creators
        </div>

        <h1>
          Share ideas with clarity,
          <br />
          style, and flow.
        </h1>

        <p>
          InsightFlow is a premium writing space for developers,
          students, creators, and thinkers to publish stories beautifully.
        </p>

        <div className="hero-actions">
          <Link to="/write">
            <button className="primary-btn">
              Start Writing
            </button>
          </Link>

          <button className="secondary-btn">
            Explore Stories
          </button>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <h3>✍️ Rich Editor</h3>

          <p>
            Write formatted posts with headings, links,
            lists, and styling.
          </p>
        </div>

        <div className="feature-card">
          <h3>🖼️ Image Upload</h3>

          <p>
            Upload beautiful cover images for your stories.
          </p>
        </div>

        <div className="feature-card">
          <h3>❤️ Likes & Comments</h3>

          <p>
            Engage with stories using likes and discussions.
          </p>
        </div>
      </section>

      <section className="stories-section">
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

                  <p>
                    {post.content.slice(0, 100)}...
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <>
              <div className="story-card">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085"
                  alt=""
                />

                <div className="story-content">
                  <h3>Building Modern React Apps</h3>

                  <p>
                    Learn how to structure scalable and elegant React projects.
                  </p>
                </div>
              </div>

              <div className="story-card">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                  alt=""
                />

                <div className="story-content">
                  <h3>Designing Clean Interfaces</h3>

                  <p>
                    Explore modern UI principles used in premium SaaS products.
                  </p>
                </div>
              </div>

              <div className="story-card">
                <img
                  src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4"
                  alt=""
                />

                <div className="story-content">
                  <h3>Productivity for Developers</h3>

                  <p>
                    Systems and habits to improve your coding workflow.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}