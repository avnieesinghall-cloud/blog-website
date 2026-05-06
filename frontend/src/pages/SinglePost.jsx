import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function SinglePost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await axios.get(`http://localhost:5000/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.log(err);
      }
    }

    fetchPost();
  }, [id]);

  if (!post) {
    return <p className="empty-text">Loading story...</p>;
  }

  return (
    <section className="single-post-page">
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

          <Link to="/" className="primary-btn">
            Back Home
          </Link>
        </div>
      </div>
    </section>
  );
}