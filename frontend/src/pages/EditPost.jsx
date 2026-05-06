import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    category: "",
    content: "",
  });

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    const res = await axios.get(`http://localhost:5000/posts/${id}`);
    setPost(res.data);
  };

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    await axios.put(`http://localhost:5000/posts/${id}`, post, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("Story updated ✨");

    setTimeout(() => {
      navigate(`/post/${id}`);
    }, 800);
  };

  return (
    <section className="write-page">
      <Toaster position="top-center" />

      <div className="write-header">
        <span className="auth-badge">✏️ Edit Story</span>
        <h1>Update your story</h1>
        <p>Refine your published article and keep your ideas fresh.</p>
      </div>

      <form onSubmit={handleUpdate} className="write-card">
        <input
          type="text"
          name="title"
          value={post.title}
          onChange={handleChange}
          className="title-input"
          required
        />

        <input
          type="text"
          name="category"
          value={post.category || ""}
          onChange={handleChange}
          placeholder="Category"
        />

        <textarea
          name="content"
          value={post.content}
          onChange={handleChange}
          required
        />

        <div className="write-actions">
          <button type="submit" className="primary-btn">
            Save Changes
          </button>
        </div>
      </form>
    </section>
  );
}