import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");

  const stripHtml = (html = "") => html.replace(/<[^>]*>?/gm, "");

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/posts");
      setPosts(res.data);
    } catch {
      toast.error("Could not fetch posts ❌");
    }
  };

  const filteredPosts = posts.filter((post) => {
    const q = search.toLowerCase();

    return (
      post.title?.toLowerCase().includes(q) ||
      post.author?.toLowerCase().includes(q) ||
      stripHtml(post.content || "").toLowerCase().includes(q)
    );
  });

  const likePost = async (id) => {
    if (!token) return toast.error("Please login first ❌");

    try {
      await axios.post(
        `http://localhost:5000/posts/${id}/like`,
        {},
        { headers: { Authorization: token } }
      );

      fetchPosts();
    } catch {
      toast.error("Like failed ❌");
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/posts/${id}`, {
        headers: { Authorization: token },
      });

      toast.success("Post deleted ✅");
      fetchPosts();
    } catch {
      toast.error("You cannot delete this post ❌");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main>
      <section className="landing-hero">
        <span className="hero-badge">🚀 Modern blogging for creators</span>

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
          <Link to="/create">
            <button className="btn btn-primary">Start Writing</button>
          </Link>

          <a href="#stories">
            <button className="btn btn-outline">Explore Stories</button>
          </a>
        </div>
      </section>

      <section className="feature-section">
        <div className="feature-card">
          <h3>✍️ Rich Editor</h3>
          <p>Write formatted posts with headings, links, lists, and styling.</p>
        </div>

        <div className="feature-card">
          <h3>🖼 Image Upload</h3>
          <p>Upload beautiful cover images for your stories.</p>
        </div>

        <div className="feature-card">
          <h3>❤️ Likes & Comments</h3>
          <p>Engage with stories using likes and discussions.</p>
        </div>
      </section>

      <section id="stories" className="page-container">
        <div className="stories-top">
          <h2 className="section-title">Latest Stories</h2>

          <input
            className="search-input"
            placeholder="Search stories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredPosts.length === 0 ? (
          <div className="empty-state">No stories found.</div>
        ) : (
          filteredPosts.map((post) => (
            <article className="card" key={post._id}>
              {post.coverImage && (
                <Link to={`/post/${post._id}`}>
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="post-cover"
                  />
                </Link>
              )}

              <Link to={`/post/${post._id}`}>
                <h2>{post.title}</h2>
              </Link>

              <p>{stripHtml(post.content).slice(0, 180)}...</p>

              <small className="meta">By {post.author}</small>

              <div className="post-stats">
                <button className="like-btn" onClick={() => likePost(post._id)}>
                  ❤️ {post.likes?.length || 0}
                </button>

                <span>💬 {post.comments?.length || 0} comments</span>
              </div>

              <div className="actions">
                <Link to={`/post/${post._id}`}>
                  <button className="btn btn-outline">Read More</button>
                </Link>

                {token && (
                  <>
                    <Link to={`/edit/${post._id}`}>
                      <button className="btn btn-primary">Edit</button>
                    </Link>

                    <button
                      className="btn btn-dark"
                      onClick={() => deletePost(post._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}