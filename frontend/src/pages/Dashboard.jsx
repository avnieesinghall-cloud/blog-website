import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);

  const token = localStorage.getItem("token");

  const fetchPosts = async () => {
    const res = await axios.get("https://blog-backend-rn0w.onrender.com/api/posts");
    setPosts(res.data);
  };

  const createPost = async () => {
    await axios.post(
      "https://blog-backend-rn0w.onrender.com/api/posts",
      { title, content },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="container">
      <h2>Dashboard</h2>

      <input
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Content"
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={createPost}>Create Post</button>

      <h3>All Posts</h3>

      {posts.map((post) => (
        <div key={post._id} className="card">
          <h4>{post.title}</h4>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;