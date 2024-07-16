import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import styles from "../css/postView.module.css";
import Modal from "react-modal";

Modal.setAppElement("#root");

const PostView = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/posts/${id}`, {
          headers: {
            "x-auth-token": auth.token,
          },
        });
        setPost(response.data);
        setTitle(response.data.title);
        setBody(response.data.body);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, auth.token]);

  const deletePost = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/posts/${id}`, {
        headers: {
          "x-auth-token": auth.token,
        },
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openModal = (modalType) => {
    if (modalType === "edit") {
      setTitle(post.title);
      setBody(post.body);
      setEditOpen(true);
    } else if (modalType === "delete") {
      setDeleteOpen(true);
    }
  };

  const closeModal = (modalType) => {
    if (modalType === "edit") {
      setEditOpen(false);
    } else if (modalType === "delete") {
      setDeleteOpen(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/posts/update/${id}`,
        { title, body },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      console.log("Post updated!");
      setEditOpen(false);  // Close the modal
      setPost({ ...post, title, body });  // Update the post state with new data
    } catch (error) {
      console.error(error.response.data.msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrap}>
        {post ? (
          <>
            <h2 className={styles.title}>
              <b>Title</b>
              <br />
              {post.title}
            </h2>
            <p className={styles.body}>
              <b>Description</b>
              <br />
              {post.body}
            </p>
            {auth && auth.userId === post.createdBy && (
              <div className={styles.end}>
                <button
                  onClick={() => openModal("edit")}
                  className={styles.editButton}
                  disabled={isSubmitting || isDeleting}
                >
                  Edit
                </button>
                <Modal
                  isOpen={isEditOpen}
                  className={styles.containerEdit}
                  onRequestClose={() => closeModal("edit")}
                >
                  <div>
                    <div className={styles.headerEdit}>
                      <h2>Edit Post</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className={styles.formGroupEdit}>
                        <label>Title</label>
                        <input
                          type="text"
                          placeholder="Title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          className={styles.inputEdit}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className={styles.formGroupEdit}>
                        <label>Description</label>
                        <textarea
                          placeholder="Body"
                          value={body}
                          onChange={(e) => setBody(e.target.value)}
                          required
                          className={styles.textareaEdit}
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className={styles.pEdit}>
                        <button
                          onClick={() => closeModal("edit")}
                          className={styles.btnCancelEdit}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                        <button type="submit" className={styles.btnPrimaryEdit} disabled={isSubmitting}>
                          Update
                        </button>
                      </div>
                    </form>
                  </div>
                </Modal>
                <button
                  onClick={() => openModal("delete")}
                  className={styles.deleteButton}
                  disabled={isSubmitting || isDeleting}
                >
                  Delete
                </button>
                <Modal
                  isOpen={isDeleteOpen}
                  onRequestClose={() => closeModal("delete")}
                  className={styles.modal}
                >
                  <h2 className={styles.modalHead}>Delete</h2>
                  <div className={styles.modalBody}>
                    Do you want to delete this post?
                  </div>
                  <div className={styles.modalButton}>
                    <button
                      onClick={deletePost}
                      className={styles.modalDeleteButton}
                      disabled={isDeleting}
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => closeModal("delete")}
                      className={styles.modalEditButton}
                      disabled={isDeleting}
                    >
                      No, Cancel
                    </button>
                  </div>
                </Modal>
              </div>
            )}
          </>
        ) : (
          <div className={styles.loading}>Post not found</div>
        )}
      </div>
    </div>
  );
};

export { PostView };
