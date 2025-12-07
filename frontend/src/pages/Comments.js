// ----------------- ✅ React Imports ----------------
import React, { useState, useEffect, useCallback } from "react";

// ----------------- ✅ CSS Import ----------------
import "../Style/Comments.css";

// ----------------- ✅ SweetAlert Import ----------------
import Swal from "sweetalert2";

// ----------------- ✅ React Icons ----------------
import { FaComments, FaCommentDots, FaEdit, FaTrash, FaPlusCircle } from "react-icons/fa";

// ----------------- ✅ Comments Component ----------------
function Comments({ post, onClose }) {

  // ----------------- ✅ Props Data ----------------
  const postId = post.id;
  const authorId = post.author_id;

  // ----------------- ✅ State Management ----------------
  const [comments, setComments] = useState([]);
  const [author] = useState(authorId);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  const [createModal, setCreateModal] = useState(false);
  const [readAllModal, setReadAllModal] = useState(false);
  const [readOneModal, setReadOneModal] = useState(false);
  const [editModal, setEditModal] = useState(false);

  const [content, setContent] = useState("");
  const [selectedComment, setSelectedComment] = useState(null);
  const [updatedCommentText, setUpdatedCommentText] = useState("");

  const [modalSearch, setModalSearch] = useState("");
  const [modalPage, setModalPage] = useState(1);
  const modalRows = 5;

  // ----------------- ✅ Fetch Comments ----------------
  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:5000/comments/${postId}`);
      const data = await res.json();
      setComments(data || []);
    } catch (err) {
      console.error("Error loading Comments:", err);
    }
  }, [postId]);

  // ----------------- ✅ useEffect ----------------
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // ----------------- ✅ Filtered Comments ----------------
  const filteredComments = comments
    .filter((c) =>
      (c.content || c.comment || "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.id - b.id);

  // ----------------- ✅ Pagination Logic ----------------
  const indexOfLast = currentPage * commentsPerPage;
  const indexOfFirst = indexOfLast - commentsPerPage;
  const currentComments = filteredComments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);

  const nextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  // ----------------- ✅ Create Comment ----------------
  const createComment = async () => {
    if (!content.trim()) {
      return Swal.fire({
        title: "Error",
        text: "Comment Cannot be Empty!",
        icon: "error",
        confirmButtonColor: "#ff0000",
      });
    }

    const confirm = await Swal.fire({
      title: "Create Comment?",
      text: "Do you want to Create this Comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Create",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#00ff00",
      cancelButtonColor: "#ff0000",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("http://localhost:5000/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, content, author_id: author }),
      });
      const data = await res.json();

      if (data.status === "success") {
        await Swal.fire({
          title: "Success",
          text: "Comment Created Successfully",
          icon: "success",
          confirmButtonColor: "#00ff00",
        });
        setContent("");
        setCreateModal(false);
        fetchComments();
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Unable to Create Comment",
        icon: "error",
        confirmButtonColor: "#ff0000",
      });
    }
  };

  // ----------------- ✅ Read One Comment ----------------
  const readComment = (comment) => {
    setSelectedComment(comment);
    setReadOneModal(true);
  };

  // ----------------- ✅ Open Edit Modal ----------------
  const openEditModal = (comment) => {
    setSelectedComment(comment);
    setUpdatedCommentText(comment.content || "");
    setEditModal(true);
  };

  // ----------------- ✅ Update Comment ----------------
  const updateComment = async () => {
    if (!updatedCommentText.trim()) {
      return Swal.fire({
        title: "Error",
        text: "Comment Cannot be Empty!",
        icon: "error",
        confirmButtonColor: "#ff0000",
      });
    }

    const confirm = await Swal.fire({
      title: "Update Comment?",
      text: "Do you want to Update this Comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      cancelButtonColor: "#ff0000",
      confirmButtonText: "Update",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/comments/${selectedComment.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: updatedCommentText }),
      });

      const data = await res.json();
      if (data.status === "success") {
        await Swal.fire({
          title: "Update!",
          text: "Comment Update Successfully",
          icon: "success",
          confirmButtonColor: "#00ff00",
        });
        setEditModal(false);
        fetchComments();
      }
    } catch {
      Swal.fire({
        title: "Error",
        text: "Failed to Update Comment",
        icon: "error",
        confirmButtonColor: "#ff0000",
      });
    }
  };

  // ----------------- ✅ Delete Comment ----------------
  const deleteComment = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Comment?",
      text: "Do you really want to Delete this Comment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#00ff00",
      cancelButtonColor: "#ff0000",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/comments/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.status === "success") {
        await Swal.fire({
          title: "Delete!",
          text: "Comment Delete Successfully",
          icon: "success",
          confirmButtonColor: "#00ff00",
        });
        fetchComments();
      }
    } catch {
      Swal.fire({
        title: "Error",
        text: "Failed to Delete Comment",
        icon: "error",
        confirmButtonColor: "#ff0000",
      });
    }
  };

  // ----------------- ✅ Modal Filtered Comments ----------------
  const modalFiltered = comments
    .filter((c) =>
      (c.content || c.comment || "")
        .toString()
        .toLowerCase()
        .includes(modalSearch.toLowerCase())
    )
    .sort((a, b) => a.id - b.id);

  const modalLast = modalPage * modalRows;
  const modalFirst = modalLast - modalRows;
  const modalRowsCurrent = modalFiltered.slice(modalFirst, modalLast);
  const modalTotalPages = Math.ceil(modalFiltered.length / modalRows);

  // ----------------- ✅ Component UI ----------------
  return (
    <div className="comments-container">
      <button className="comments-close-modal" onClick={onClose}>✖</button>

      {/* ----------------- ✅ Header Section ---------------- */}
      <div className="comments-header">
        <h1>Comments</h1>

        <div className="comments-search-container">
          <input
            type="text"
            className="search-box"
            placeholder="Search Comments..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button type="submit">Search</button>
        </div>

        <button className="comments-create-btn" onClick={() => setCreateModal(true)}>
          + Create New Comment
        </button>

        <button className="comments-read-all-btn" onClick={() => setReadAllModal(true)}>
          <FaComments /> Read All Comments
        </button>
      </div>

      {/* ----------------- ✅ Comments Grid ---------------- */}
      <div className="comments-grid-container">
        <div className="comments-grid">
          {currentComments.length === 0 ? (
            <p className="comments-no-posts">No comments found</p>
          ) : (
            currentComments.map((c) => (
              <div className="comments-card" key={c.id}>
                <h2>Comment ID: {c.id}</h2>
                <p><strong>Content:</strong> {c.content ?? "No content"}</p>

                <div className="comments-actions">
                  <button className="read-btn" onClick={() => readComment(c)}>
                    <FaCommentDots /> Read
                  </button>
                  <button className="edit-btn" onClick={() => openEditModal(c)}>
                    <FaEdit /> Update
                  </button>
                  <button className="delete-btn" onClick={() => deleteComment(c.id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ----------------- ✅ Pagination ---------------- */}
        {filteredComments.length > commentsPerPage && (
          <div className="container-comments-pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>◀ Prev</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={nextPage} disabled={currentPage === totalPages}>Next ▶</button>
          </div>
        )}
      </div>

      {/* ----------------- ✅ Create Comment Modal ---------------- */}
      {createModal && (
        <div className="comments-modal-overlay1">
          <div className="comments-modal-box1">
            <button className="close-modal1" onClick={() => setCreateModal(false)}>✖</button>
            <h2>Create New Comment</h2>
            <input
              type="text"
              className="modal-input1"
              placeholder="Author ID..."
              value={author}
              readOnly
            />
            <textarea
              className="modal-textarea1"
              rows={5}
              placeholder="Write comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <button className="save-btn" onClick={createComment}>
              <FaPlusCircle /> Create Comment
            </button>
          </div>
        </div>
      )}

      {/* ----------------- ✅ Read All Comments Modal ---------------- */}
      {readAllModal && (
        <div className="comments-modal-overlay1">
          <div className="comments-modal-box-table">
            <button className="read-close-modal" onClick={() => setReadAllModal(false)}>✖</button>

            <div className="comments-read-header">
              <h2>Read All Comments</h2>
              <div className="comments-read-search-container">
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

            <table className="comments-table">
              <thead>
                <tr>
                  <th>Comment ID</th>
                  <th>Post ID</th>
                  <th>Author ID</th>
                  <th>Comment</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {modalRowsCurrent.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.post_id ?? "N/A"}</td>
                    <td>{c.author_id ?? "Unknown"}</td>
                    <td>{c.content ?? c.comment ?? "No content"}</td>
                    <td>{c.created_at ? new Date(c.created_at).toLocaleString() : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {modalFiltered.length > modalRows && (
              <div className="comments-pagination">
                <button onClick={() => setModalPage((prev) => Math.max(prev - 1, 1))} disabled={modalPage === 1}>◀ Prev</button>
                <span>Page {modalPage} of {modalTotalPages}</span>
                <button onClick={() => setModalPage((prev) => (prev < modalTotalPages ? prev + 1 : prev))} disabled={modalPage === modalTotalPages}>Next ▶</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- ✅ Read One Comment Modal ---------------- */}
      {readOneModal && selectedComment && (
        <div className="comments-modal-overlay1">
          <div className="comments-modal-box-read-table">
            <button className="close-modal2" onClick={() => setReadOneModal(false)}>✖</button>
            <h2>Read Single Comment</h2>
            <table className="comments-table">
              <tbody>
                <tr>
                  <th>Comment ID</th>
                  <td>{selectedComment.id}</td>
                </tr>
                <tr>
                  <th>Post ID</th>
                  <td>{selectedComment.post_id ?? "N/A"}</td>
                </tr>
                <tr>
                  <th>Author ID</th>
                  <td>{selectedComment.author_id ?? "Unknown"}</td>
                </tr>
                <tr>
                  <th>Comment</th>
                  <td>{selectedComment.content ?? selectedComment.comment ?? "No content"}</td>
                </tr>
                <tr>
                  <th>Created At</th>
                  <td>{selectedComment.created_at ? new Date(selectedComment.created_at).toLocaleString() : "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ----------------- ✅ Update Comment Modal ---------------- */}
      {editModal && (
        <div className="comments-modal-overlay1">
          <div className="comments-modal-box1">
            <button className="close-modal1" onClick={() => setEditModal(false)}>✖</button>
            <h2>Update Comment</h2>
            <textarea
              className="modal-textarea1"
              rows={5}
              value={updatedCommentText}
              onChange={(e) => setUpdatedCommentText(e.target.value)}
            ></textarea>
            <button className="save-btn" onClick={updateComment}>
              <FaEdit /> Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------- ✅ Export ----------------
export default Comments;
