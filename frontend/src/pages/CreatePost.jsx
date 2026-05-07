import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function CreatePost() {
  const [post, setPost] = useState({
    title: "",
    category: "",
    cover: "",
    content: "",
  });

  const API_URL = "https://insightflow-backend-7vjp.onrender.com";

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API_URL}/posts`,
        {
          title: post.title,
          category: post.category,
          coverImage: post.cover,
          content: post.content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Story saved successfully ✨");

      setPost({
        title: "",
        category: "",
        cover: "",
        content: "",
      });
    } catch (err) {
      console.log(err);
      toast.error("Story could not be saved");
    }
  };

  return (
    <section className="write-page">
      <Toaster position="top-center" />

      <div className="write-header">
        <div>
          <span className="auth-badge">✍️ Premium Editor</span>
          <h1>Write your story</h1>
          <p>
            Create beautiful, clean, and readable posts with InsightFlow’s
            modern writing space.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="write-card">
        <input
          type="text"
          name="title"
          placeholder="Story title..."
          value={post.title}
          onChange={handleChange}
          className="title-input"
          required
        />

        <div className="write-row">
          <input
            type="text"
            name="category"
            placeholder="Category e.g. React, UI Design"
            value={post.category}
            onChange={handleChange}
          />

          <input
            type="text"
            name="cover"
            placeholder="Cover image URL"
            value={post.cover}
            onChange={handleChange}
          />
        </div>

        {post.cover && (
          <img src={post.cover} alt="Cover preview" className="cover-preview" />
        )}

        <textarea
          name="content"
          placeholder="Start writing your story here..."
          value={post.content}
          onChange={handleChange}
          required
        />

        <div className="write-actions">
          <button type="button" className="secondary-btn">
            Save Draft
          </button>

          <button type="submit" className="primary-btn">
            Publish Story
          </button>
        </div>
      </form>
    </section>
  );
}