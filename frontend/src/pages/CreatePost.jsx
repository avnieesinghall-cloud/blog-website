import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Editor from "../components/Editor";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first ❌");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    try {
      await axios.post("http://localhost:5000/posts", formData, {
        headers: { Authorization: token },
      });

      toast.success("Post published 🚀");
      navigate("/");
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("Post creation failed ❌");
    }
  };

  return (
    <motion.div
      className="form-box premium-editor glass"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>Write a new story</h2>

      <form className="form" onSubmit={submit}>
        <input
          className="input title-input"
          placeholder="Story title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="upload-box">
          🖼 Upload cover image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
          />
        </label>

        {coverImage && <p className="meta">Selected: {coverImage.name}</p>}

        <Editor content={content} setContent={setContent} />

        <button className="btn btn-primary">Publish Story</button>
      </form>
    </motion.div>
  );
}