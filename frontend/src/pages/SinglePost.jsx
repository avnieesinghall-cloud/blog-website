import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function SinglePost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);

  const API_URL = "https://insightflow-backend-7vjp.onrender.com";

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`${API_URL}/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Could not load story");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this story?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Story deleted successfully");

      setTimeout(() => {
        navigate("/");
      }, 900);
    } catch (err) {
      console.log(err);
      toast.error("You can only delete your own story");
    }
  };

  if (!post) {
    return <p className="empty-text">Loading story...</p>;
  }

  return (
    <section className="single-post-page">
      <Toaster position="top-center" />

      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="single-cover" />
      )}

      <div className="single-post-card">
        <span className="story-category">{post.category || "Story"}</span>

        <h1>{post.title}</h1>

        <p className="single-meta">
          By {post.author || "InsightFlow Writer"}
        </p>

        <div className="single-content">
          {post.content.split("\n").map((para, index) => (
            <p key={index}>{para}</p>
          ))}
        </div>

        <div className="write-actions">
          <Link to={`/edit/${post._id}`} className="secondary-btn">
            Edit Story
          </Link>

          <button onClick={handleDelete} className="danger-btn">
            Delete Story
          </button>

          <Link to="/" className="primary-btn">
            Back Home
          </Link>
        </div>
      </div>
    </section>
  );
}