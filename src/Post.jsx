import "./index.css";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { increment, reset } from "../src/store/counterSlice";

function Post() {
  const counter = useSelector((state) => state.counter.value);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const storedPosts = JSON.parse(localStorage.getItem("posts"));
    if (storedPosts && storedPosts.length > 0) {
      setPosts(storedPosts);
      setLoading(false);
    } else {
      fetch("https://jsonplaceholder.typicode.com/posts")
        .then((response) => response.json())
        .then((data) => {
          const first10Posts = data.slice(0, 10);
          setPosts(first10Posts);
          localStorage.setItem("posts", JSON.stringify(first10Posts));
          setLoading(false);
        });
    }
  }, []);

  const handleDelete = (id) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    setPosts(updatedPosts);
    dispatch(increment());

    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };
  const dispatch = useDispatch();

  const handleReset = () => {
    dispatch(reset());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const lastUserId =
      posts.length > 0 ? Math.max(...posts.map((post) => post.userId)) : 0;
    const lastId =
      posts.length > 0 ? Math.max(...posts.map((post) => post.id)) : 0;
    const updatedPost = { ...newPost, userId: lastUserId + 1, id: lastId + 1 };
    setPosts([updatedPost, ...posts]);
    setNewPost({ title: "", body: "", userId: lastUserId + 1 });

    dispatch(increment());

    const currentPosts = JSON.parse(localStorage.getItem("posts")) || [];
    const updatedPosts = [updatedPost, ...currentPosts];
    localStorage.setItem("posts", JSON.stringify(updatedPosts));
  };

  if (loading) {
    return <div className="loading">Yükleniyor...</div>;
  }

  return (
    <div className="App">
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center", // İçerikleri yatay olarak ortalar
          padding: "10px",
          backgroundColor: "greenblue",
          width: "100%",
          borderBottom: "2px solid #333", // Alt kenarına 2px kalınlığında gri bir çizgi ekler
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <p style={{ fontSize: "20px", color: "red" }}>Sayaç: {counter}</p>{" "}
          <button
            style={{
              padding: "10px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginLeft: "20px", // Sayaç ve buton arasında boşluk bırakıyoruz
            }}
            onClick={handleReset}
          >
            Sıfırla
          </button>{" "}
        </div>
      </nav>
      <header className="App-header">
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="form-input"
          />
          <input
            type="text"
            placeholder="Body"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            className="form-input"
          />
          <button type="submit" className="form-button">
            Post Ekle
          </button>
        </form>
        {posts.map((post) => (
          <div key={post.id} className="card">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p className="author">Kullanıcı: {post.userId}</p>
            <button
              className="delete-button"
              onClick={() => handleDelete(post.id)}
            >
              Sil
            </button>
          </div>
        ))}
      </header>
    </div>
  );
}

export default Post;
