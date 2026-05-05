import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Profile() {
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const stripHtml = (html = "") => html.replace(/<[^>]*>?/gm, "");

  const fetchMyPosts = async () => {
    if (!token) {
      toast.error("Please login first ❌");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get("http://localhost:5000/my-posts", {
        headers: { Authorization: token },
      });

      setPosts(res.data);
    } catch {
      toast.error("Please login again ❌");
      navigate("/login");
    }
  };

  const deletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/posts/${id}`, {
        headers: { Authorization: token },
      });

      toast.success("Post deleted ✅");
      fetchMyPosts();
    } catch {
      toast.error("You cannot delete this post ❌");
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  return (
    <main className="page-container profile-page">
      <section className="profile-header">
        <div className="avatar">IF</div>

        <div>
          <h1>Your Dashboard</h1>
          <p>Manage your stories, edits, likes, and comments.</p>
        </div>
      </section>

      <div className="profile-stats">
        <div className="stat-card">
          <h3>{posts.length}</h3>
          <p>Total Posts</p>
        </div>

        <div className="stat-card">
          <h3>
            {posts.reduce((total, post) => total + (post.likes?.length || 0), 0)}
          </h3>
          <p>Total Likes</p>
        </div>

        <div className="stat-card">
          <h3>
            {posts.reduce(
              (total, post) => total + (post.comments?.length || 0),
              0
            )}
          </h3>
          <p>Total Comments</p>
        </div>
      </div>

      <h2 className="section-title">My Stories</h2>

      {posts.length === 0 ? (
        <div className="empty-state">
          You haven’t written anything yet. Click <b>Write</b> to publish your
          first story.
        </div>
      ) : (
        posts.map((post) => (
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

            <p>{stripHtml(post.content).slice(0, 160)}...</p>

            <div className="post-stats">
              <span>❤️ {post.likes?.length || 0}</span>
              <span>💬 {post.comments?.length || 0} comments</span>
            </div>

            <div className="actions">
              <Link to={`/post/${post._id}`}>
                <button className="btn btn-outline">View</button>
              </Link>

              <Link to={`/edit/${post._id}`}>
                <button className="btn btn-primary">Edit</button>
              </Link>

              <button
                className="btn btn-dark"
                onClick={() => deletePost(post._id)}
              >
                Delete
              </button>
            </div>
          </article>
        ))
      )}
    </main>
  );
}