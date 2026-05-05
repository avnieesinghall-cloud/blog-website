import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Editor from "../components/Editor";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [oldImage, setOldImage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first ❌");
      navigate("/login");
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await axios.get(`https://blog-backend-rn0w.onrender.com/posts/${id}`);
        setTitle(res.data.title);
        setContent(res.data.content);
        setOldImage(res.data.coverImage);
      } catch {
        toast.error("Could not load post ❌");
      }
    };

    fetchPost();
  }, [id, navigate]);

  const updatePost = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    try {
      await axios.put(`https://blog-backend-rn0w.onrender.com/posts/${id}`, formData, {
        headers: { Authorization: token },
      });

      toast.success("Post updated ✅");
      navigate(`/post/${id}`);
    } catch {
      toast.error("Update failed ❌");
    }
  };

  return (
    <motion.div
      className="form-box premium-editor glass"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>Edit story</h2>

      {oldImage && <img src={oldImage} alt="cover" className="edit-cover" />}

      <form className="form" onSubmit={updatePost}>
        <input
          className="input title-input"
          placeholder="Story title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="upload-box">
          🖼 Change cover image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
          />
        </label>

        {coverImage && <p className="meta">Selected: {coverImage.name}</p>}

        <Editor content={content} setContent={setContent} />

        <button className="btn btn-primary">Update Story</button>
      </form>
    </motion.div>
  );
}