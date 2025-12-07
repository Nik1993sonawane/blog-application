// ----------------- ✅ React Core -----------------
import React, { useState, useEffect, useCallback } from "react";

// ----------------- ✅ CSS -----------------
import "../Style/Posts.css";

// ----------------- ✅ SweetAlert -----------------
import Swal from "sweetalert2";

// ----------------- ✅ Components -----------------
import Comments from "./Comments";

// ----------------- ✅ React Icons ----------------
import { FaBookReader } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";

// ----------------- ✅ Posts Component -----------------
function Posts() {

  // ----------------- ✅ States -----------------
  const [posts, setPosts] = useState([]);

  // ----------------- ✅ Search & Pagination -----------------
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  // ----------------- ✅ Modals -----------------
  const [createModal, setCreateModal] = useState(false);
  const [readAllModal, setReadAllModal] = useState(false);
  const [readOneModal, setReadOneModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  // ----------------- ✅ Forms -----------------
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  // ----------------- ✅ Comments Modal -----------------
  const [commentsModal, setCommentsModal] = useState(false);

  // ----------------- ✅ Read All Modal Data -----------------
  const [modalSearch, setModalSearch] = useState("");
  const [modalPage, setModalPage] = useState(1);
  const modalRows = 5;

  // ----------------- ✅ Fetch Posts -----------------
  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/posts");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Error Fetching Posts:", err);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ----------------- ✅ Filter & Pagination -----------------
  const filteredPosts = posts
    .filter(
      (p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.id - b.id);

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const nextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  // ----------------- ✅ Create Post -----------------
  const createPost = async () => {
    const userId = 1;
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle && !trimmedContent) {
      return Swal.fire({
        title: "Error",
        text: "Post All Fields are Required",
        icon: "error",
        confirmButtonColor: "#ff0000"
      });
    }

    if (!trimmedTitle) {
      return Swal.fire({
        title: "Error",
        text: "Post Title Cannot be Empty",
        icon: "error",
        confirmButtonColor: "#ff0000"
      });
    }

    if (!trimmedContent) {
      return Swal.fire({
        title: "Error",
        text: "Post Content Cannot be Empty",
        icon: "error",
        confirmButtonColor: "#ff0000"
      });
    }

    const confirm = await Swal.fire({
      title: "Create New Post?",
      text: "Do you want to Create this Post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Create",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#00ff00",
      cancelButtonColor: "#ff0000"
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("http://localhost:5000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedTitle,
          content: trimmedContent,
          author_id: userId,
        })
      });

      const data = await res.json();

      if (data.status === "success") {
        await Swal.fire({
          title: "Success",
          text: "Post Create Successfully",
          icon: "success",
          confirmButtonColor: "#00ff00"
        });

        setTitle("");
        setContent("");
        setCreateModal(false);
        fetchPosts();
      } else {
        Swal.fire({
          title: "Error",
          text: data.message || "Unable to Create Post",
          icon: "error",
          confirmButtonColor: "#ff0000"
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Unable to Create Post",
        icon: "error",
        confirmButtonColor: "#ff0000"
      });
    }
  };

  // ----------------- ✅ Read All Modal Pagination -----------------
  const modalFiltered = posts
    .filter(
      (p) =>
        p.title.toLowerCase().includes(modalSearch.toLowerCase()) ||
        p.content.toLowerCase().includes(modalSearch.toLowerCase())
    )
    .sort((a, b) => a.id - b.id);

  const modalLast = modalPage * modalRows;
  const modalFirst = modalLast - modalRows;
  const modalRowsCurrent = modalFiltered.slice(modalFirst, modalLast);
  const modalTotalPages = Math.ceil(modalFiltered.length / modalRows);

  // ----------------- ✅ Open Comments Modal -----------------
  const openCommentsModal = (post) => {
    setSelectedPost(post);
    setCommentsModal(true);
  };

  // ----------------- ✅ Read Post -----------------
  const readPost = (e, post) => {
    e.stopPropagation();
    setSelectedPost(post);
    setReadOneModal(true);
  };

  // ----------------- ✅ Open Edit Modal -----------------
  const openEditModal = (e, post) => {
    e.stopPropagation();
    setSelectedPost(post);
    setTitle(post.title);
    setContent(post.content);
    setEditModal(true);
  };

  // ----------------- ✅ Update Post -----------------
  const updatePost = async () => {
    if (!selectedPost) return;

    const updatedFields = {};
    if (title !== selectedPost.title) updatedFields.title = title;
    if (content !== selectedPost.content) updatedFields.content = content;

    if (Object.keys(updatedFields).length === 0)
      return Swal.fire({
        title: "No Changes",
        text: "Nothing to Update",
        icon: "info",
        confirmButtonColor: "#ff0000",
      });

    const confirmUpdate = await Swal.fire({
      title: "Update Post?",
      text: "Are you Sure you want to Update this Post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Update",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#00ff00", 
      cancelButtonColor: "#ff0000", 
    });

    if (!confirmUpdate.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/posts/${selectedPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });

      const data = await res.json();

      if (data.status === "success") {
        await Swal.fire({
          title: "Update",
          text: "Post Update Successfully",
          icon: "success",
          confirmButtonColor: "#00ff00",
        });

        setEditModal(false);
        fetchPosts();
      } else {
        Swal.fire({
          title: "Error",
          text: data.message,
          icon: "error",
          confirmButtonColor: "#ff0000",
        });
      }
    } catch {
      Swal.fire({
        title: "Error",
        text: "Failed to Update Post",
        icon: "error",
        confirmButtonColor: "#ff0000",
      });
    }
  };

  // ----------------- ✅ Delete Post -----------------
  const deletePost = async (e, id) => {
    e.stopPropagation();

    const confirm = await Swal.fire({
      title: "Delete Post?",
      text: "Are you Sure you want to Delete this Post?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#00ff00", 
      cancelButtonColor: "#ff0000", 
    });

    if (!confirm.isConfirmed) return;

    try {
      await fetch(`http://localhost:5000/posts/${id}`, { method: "DELETE" });

      await Swal.fire({
        title: "Delete!",
        text: "Post Delete Successfully",
        icon: "success",
        confirmButtonColor: "#00ff00",
      });

      fetchPosts();
    } catch {
      Swal.fire({
        title: "Error",
        text: "Failed to Delete Post",
        icon: "error",
        confirmButtonColor: "#00ff00",
      });
    }
  };

return (
  <div className="posts-container">

    {/* ✅ Header Section */}
    <div className="posts-header">
      <h1>Posts</h1>

      {/* ✅ Search Box */}
      <div className="search-container">
        <input
          type="text"
          className="search-box"
          placeholder="Search Posts..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <button type="submit">Search</button>
      </div>

      {/* ✅ Create Button */}
      <button className="create-btn" onClick={() => setCreateModal(true)}>
        + Create New Post
      </button>

      {/* ✅ React Icon */}
      <button className="read-all-btn" onClick={() => setReadAllModal(true)}>
        <FaBookReader />
        Read All Posts
      </button>
    </div>

    {/* ✅ Posts Grid */}
    <div className="posts-grid-container">
      <div className="posts-grid">
        {currentPosts.length === 0 ? (
          <p className="no-posts">No posts found</p>
        ) : (
          currentPosts.map((post) => (
            <div
              className="post-card"
              key={post.id}
              onClick={() => openCommentsModal(post)}
            >
              <h2>{post.title}</h2>
              <p>{post.content.substring(0, 120)}...</p>

              {/* ✅ Action Buttons with Icons */}
              <div className="post-actions">
                <button className="read-btn" onClick={(e) => readPost(e, post)}>
                  <FaBookOpen />
                  Read
                </button>

                <button className="edit-btn" onClick={(e) => openEditModal(e, post)}>
                  <FaEdit />
                  Update
                </button>

                <button className="delete-btn" onClick={(e) => deletePost(e, post.id)}>
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ Pagination */}
      {filteredPosts.length > postsPerPage && (
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1}>
            ◀ Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>
            Next ▶
          </button>
        </div>
      )}
    </div>

    {/* ✅ Comments Modal */}
    {commentsModal && selectedPost && (
      <div className="modal-overlay1">
        <div className="modal-box-comments">
          <button className="close-modal1" onClick={() => setCommentsModal(false)}>
            ✖
          </button>

          <Comments
            post={selectedPost}
            refreshParent={fetchPosts}
            onClose={() => setCommentsModal(false)}
          />
        </div>
      </div>
    )}

    {/* ✅ Create Post Modal */}
    {createModal && (
      <div className="modal-overlay1">
        <div className="modal-box1">
          <button className="close-modal1" onClick={() => setCreateModal(false)}>
            ✖
          </button>

          <div className="create-header">
            <h2>Create New Post</h2>
          </div>

          <input
            type="text"
            placeholder="Title..."
            className="modal-input1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="modal-textarea1"
            placeholder="Content..."
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          <button className="save-btn" onClick={createPost}>
            <FaPlusCircle />
            Create Post
          </button>
        </div>
      </div>
    )}

    {/* ✅ Read All Posts Modal */}
    {readAllModal && (
      <div className="modal-overlay1">
        <div className="modal-box-table">
          <button className="read-close-modal" onClick={() => setReadAllModal(false)}>
            ✖
          </button>

          <div className="read-posts-header">
            <h2>Read All Posts</h2>

            <div className="read-search-container">
              <input
                type="text"
                className="search-box"
                placeholder="Search table..."
                value={modalSearch}
                onChange={(e) => {
                  setModalSearch(e.target.value);
                  setModalPage(1);
                }}
              />
              <button type="submit">Search</button>
            </div>
          </div>

          {/* ✅ Posts Table */}
          <table className="posts-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Content</th>
                <th>Author ID</th>
                <th>Created At</th>
                <th>Updated At</th>
              </tr>
            </thead>
            <tbody>
              {modalRowsCurrent.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.title ?? "N/A"}</td>
                  <td>{p.content ?? "N/A"}</td>
                  <td>{p.author_id ?? "N/A"}</td>
                  <td>{p.created_at ? new Date(p.created_at).toLocaleString() : "N/A"}</td>
                  <td>{p.updated_at ? new Date(p.updated_at).toLocaleString() : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Table Pagination */}
          {modalFiltered.length > modalRows && (
            <div className="read-all-pagination">
              <button
                onClick={() => setModalPage((prev) => Math.max(prev - 1, 1))}
                disabled={modalPage === 1}
              >
                ◀ Prev
              </button>
              <span>
                Page {modalPage} of {modalTotalPages}
              </span>
              <button
                onClick={() =>
                  setModalPage((prev) => (prev < modalTotalPages ? prev + 1 : prev))
                }
                disabled={modalPage === modalTotalPages}
              >
                Next ▶
              </button>
            </div>
          )}
        </div>
      </div>
    )}

    {/* ✅ Read Single Post Modal */}
    {readOneModal && selectedPost && (
      <div className="modal-overlay1">
        <div className="modal-box-read-table">
          <button className="one-close-modal" onClick={() => setReadOneModal(false)}>
            ✖
          </button>

          <div className="read-single-posts-header">
            <h2>Read Single Post</h2>
          </div>

          <table className="posts-table">
            <tbody>
              <tr>
                <th>ID</th>
                <td>{selectedPost?.id ?? "N/A"}</td>
              </tr>
              <tr>
                <th>Title</th>
                <td>{selectedPost?.title ?? "N/A"}</td>
              </tr>
              <tr>
                <th>Content</th>
                <td>{selectedPost?.content ?? "N/A"}</td>
              </tr>
              <tr>
                <th>Author</th>
                <td>{selectedPost?.author_id ?? "N/A"}</td>
              </tr>
              <tr>
                <th>Created At</th>
                <td>
                  {selectedPost?.created_at
                    ? new Date(selectedPost.created_at).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <th>Updated At</th>
                <td>
                  {selectedPost?.updated_at
                    ? new Date(selectedPost.updated_at).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )}

    {/* ✅ Edit Post Modal */}
    {editModal && (
      <div className="modal-overlay1">
        <div className="modal-box1">
          <button className="close-modal1" onClick={() => setEditModal(false)}>
            ✖
          </button>

          <div className="edit-header">
            <h2>Update Post</h2>
          </div>

          <input
            type="text"
            className="modal-input1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />

          <textarea
            className="modal-textarea1"
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
          ></textarea>

          <button className="save-btn" onClick={updatePost}>
            <FaEdit />
            Update
          </button>
        </div>
      </div>
    )}

  </div>
 );
}

export default Posts;
