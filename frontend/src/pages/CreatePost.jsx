import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function CreatePost() {
  const [post, setPost] = useState({
    title: "",
    category: "",
    cover: "",
    content: "",
  });

  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    toast.success("Story saved successfully ✨");

    console.log(post);
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