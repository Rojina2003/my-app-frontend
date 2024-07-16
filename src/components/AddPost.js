import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from "../css/addPost.module.css";

const AddPost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/posts/add', { title, body }, {
        headers: {
          'x-auth-token': token
        }
      });
      console.log('Post added!'); 
      navigate('/');

    } catch (error) {
      console.error(error.response.data.msg);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Add Post</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Title</label>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            className={styles.textarea}
          />
        </div>
        <p className={styles.p}>
          <a href="/" className={styles.btnCancel}>Cancel</a>
          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Adding...' : 'Add Post'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default AddPost;
