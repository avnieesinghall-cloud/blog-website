import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function SinglePost() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");

  const token = localStorage.getItem("token");

  const fetchPost = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Could not load post ❌");
    }
  };

  const likePost = async () => {
    if (!token) {
      toast.error("Please login first ❌");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/posts/${id}/like`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setPost(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Like failed ❌");
    }
  };

  const addComment = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login first ❌");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/posts/${id}/comments`,
        {
          text: comment,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setPost(res.data);
      setComment("");
      toast.success("Comment added 💬");
    } catch (err) {
      console.log(err);
      toast.error("Comment failed ❌");
    }
  };

  const deleteComment = async (commentId) => {
    if (!token) {
      toast.error("Please login first ❌");
      return;
    }

    try {
      const res = await axios.delete(
        `http://localhost:5000/posts/${id}/comments/${commentId}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setPost(res.data);
      toast.success("Comment deleted ✅");
    } catch (err) {
      console.log(err);
      toast.error("You cannot delete this comment ❌");
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (!post) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>
        Loading post...
      </p>
    );
  }

  return (
    <main className="page-container">
      <Link to="/">← Back to Home</Link>

      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="single-cover" />
      )}

      <h1 className="article-title">{post.title}</h1>

      <p className="meta">By {post.author}</p>

      <hr />

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="single-post-actions">
        <button className="btn btn-outline" onClick={likePost}>
          ❤️ Like ({post.likes?.length || 0})
        </button>

        {token && (
          <Link to={`/edit/${post._id}`}>
            <button className="btn btn-primary">Edit Story</button>
          </Link>
        )}
      </div>

      <section className="comments-section">
        <h2>Comments ({post.comments?.length || 0})</h2>

        <form onSubmit={addComment} className="comment-form">
          <textarea
            placeholder="Write a thoughtful comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          <button className="btn btn-primary" type="submit">
            Post Comment
          </button>
        </form>

        <div className="comments-list">
          {post.comments?.length > 0 ? (
            post.comments.map((c) => (
              <div className="comment-card" key={c._id}>
                <div>
                  <strong>{c.author}</strong>
                  <p>{c.text}</p>
                </div>

                {token && (
                  <button
                    className="comment-delete"
                    onClick={() => deleteComment(c._id)}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="meta">No comments yet. Be the first to comment.</p>
          )}
        </div>
      </section>
    </main>
  );
}