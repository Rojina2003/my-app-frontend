import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import style from "../css/postList.module.css";

const PostList = () => {
  const { auth } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("currentPage")) || 1
  );
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10); // Set the limit of posts per page

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/posts/", {
          headers: {
            "x-auth-token": auth.token,
          },
          params: {
            page: currentPage,
            limit: limit,
          },
        });
        setPosts(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPosts();
  }, [auth.token, currentPage, limit]);

  useEffect(() => {
    const userPosts = posts.filter((post) => post.createdBy?._id === auth.userId);
    const allSelected =
      userPosts.length > 0 &&
      userPosts.every((post) => selectedPosts[post._id]);
    setSelectAll(allSelected);
  }, [posts, selectedPosts, auth.userId]);

  useEffect(() => {
    localStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  const formatDate = (dateString) => {
    if (!dateString) return "Inbuilt Post";

    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}/${formattedMonth}/${year}`;
  };

  const handleSelect = (postId) => {
    setSelectedPosts((prevSelectedPosts) => ({
      ...prevSelectedPosts,
      [postId]: !prevSelectedPosts[postId],
    }));
  };

  const handleSelectAll = () => {
    const newSelectedPosts = {};
    posts.forEach((post) => {
      if (post.createdBy?._id === auth.userId) {
        newSelectedPosts[post._id] = !selectAll;
      }
    });
    setSelectedPosts(newSelectedPosts);
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = async () => {
    const selectedPostIds = Object.keys(selectedPosts).filter(
      (postId) => selectedPosts[postId]
    );

    if (selectedPostIds.length === 0) {
      alert("No posts selected for deletion.");
      return;
    }

    try {
      await axios.delete("http://localhost:5000/posts", {
        headers: {
          "x-auth-token": auth.token,
        },
        data: {
          postIds: selectedPostIds,
        },
      });
      setPosts((prevPosts) =>
        prevPosts.filter((post) => !selectedPostIds.includes(post._id))
      );
      setSelectedPosts({});
    } catch (error) {
      console.log(error);
    }
  };

  const postList = () => {
    return posts.map((post) => (
      <tr key={post._id}>
        <td>
          {post.createdBy?._id === auth.userId && (
            <input
              type="checkbox"
              checked={selectedPosts[post._id] || false}
              onChange={() => handleSelect(post._id)}
            />
          )}
        </td>
        <td>{post.title}</td>
        <td>{post.body}</td>
        <td>{post?.createdBy?.name}</td>
        <td>{formatDate(post.createdAt)}</td>
        <td className={style.listButtons}>
          <Link to={`/posts/${post._id}`} className={style.listView}>
            View
          </Link>
        </td>
      </tr>
    ));
  };

  const userHasPosts = posts.some((post) => post.createdBy?._id === auth.userId);
  const hasSelectedPosts = Object.keys(selectedPosts).some(
    (postId) => selectedPosts[postId]
  );

  return (
    <div className={style.warp}>
      <div className={style.postContainer}>
        <table className={style.table}>
          <thead className={style.theadLight}>
            <tr className={style.listTr}>
              <th>
                {userHasPosts && (
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                )}
              </th>
              <th>Title</th>
              <th>Body</th>
              <th>Created By</th>
              <th>Creation Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{postList()}</tbody>
        </table>
        {hasSelectedPosts && (
          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <button
              onClick={handleDeleteSelected}
              className={style.deleteButton}
            >
              Delete Selected Posts
            </button>
          </div>
        )}
      </div>
      <div className={style.pagination}>
        <button
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
          }
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? style.activePage : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
          }
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default PostList;
