import "./index.css";
import React, { useState, useEffect } from "react";

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => {
        const localPosts = JSON.parse(localStorage.getItem("posts")) || [];
        setPosts([...localPosts, ...data.slice(0, 15)]);
        setLoading(false);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const lastUserId = Math.max(...posts.map((post) => post.userId));
    const updatedPost = { ...newPost, userId: lastUserId + 1 };
    setPosts([updatedPost, ...posts]);
    setNewPost({ title: "", body: "", userId: lastUserId + 1 });

    // Store the posts in localStorage
    localStorage.setItem("posts", JSON.stringify([updatedPost, ...posts]));
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Body"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <button type="submit">Add Post</button>
        </form>
        {posts.map((post) => (
          <div key={post.id} className="card">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p className="author">Kullanıcı: {post.userId}</p>
          </div>
        ))}
      </header>
    </div>
  );
}

export default App;
