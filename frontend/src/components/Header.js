/* eslint-disable no-unused-vars */

// ----------------- ✅ React Core Imports ----------------
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

// ----------------- ✅ CSS Import ----------------
import "../Styles/Header.css";

// ----------------- ✅ Image Import ----------------
import logoImg from "../assests/Logo.png";

// ----------------- ✅ React Icons ----------------
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

// ----------------- ✅ Header Component ----------------
function Header({ setIsLoggedIn }) {

  // ----------------- ✅ State Management ----------------
  const [searchQuery, setSearchQuery] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // ----------------- ✅ Register Form State ----------------
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ----------------- ✅ Login Form State ----------------
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // ----------------- ✅ Router Hooks ----------------
  const navigate = useNavigate();
  const location = useLocation();

  // ----------------- ✅ Route Check ----------------
  const isPostsPage = location.pathname === "/posts";

  // ----------------- ✅ Modal Controls ----------------
  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);

  const openRegisterModal = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const closeRegisterModal = () => setShowRegisterModal(false);

  // ----------------- ✅ Email Validation Function ----------------
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
  };

  // ----------------- ✅ Register Logic ----------------
  const handleRegister = async () => {
    if (!username || !email || !password) {
      return Swal.fire({
        title: "Error",
        text: "All Fields are Required",
        icon: "error",
        confirmButtonColor: "#ff0000"
      });
    }

    // ----------------- ✅ Email Validation Check ----------------
    if (!isValidEmail(email)) {
      return Swal.fire({
        title: "Invalid Email",
        text: "Please Enter a Valid Email Address",
        icon: "error",
        confirmButtonColor: "#ff0000"
      });
    }

    // ----------------- ✅ Password Validation ----------------
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;

    if (!passwordRegex.test(password)) {
      return Swal.fire({
        title: "Invalid Password",
        html: `
          <div style="text-align:left;">
            <b>Password Must Contain:</b><br/><br/>
            ✔ One Uppercase Letter<br/>
            ✔ One Lowercase Letter<br/>
            ✔ One Number<br/>
            ✔ One Special Character<br/>
            ✔ Password Length: 8 to 12 Characters
          </div>
        `,
        icon: "error",
        confirmButtonColor: "#ff0000"
      });
    }

    // ----------------- ✅ Registration Confirmation ----------------
    const confirm = await Swal.fire({
      title: "Confirm Registration",
      text: "Do you want to Register?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Register",
      confirmButtonColor: "#00ff00",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#ff0000"
    });

    if (!confirm.isConfirmed) return;

    // ----------------- ✅ Register API Call ----------------
    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    // ----------------- ✅ Register Response Handling ----------------
    if (data.status === "success") {
      await Swal.fire({
        title: "Success",
        text: "User Registered Successfully",
        icon: "success",
        confirmButtonColor: "#00ff00"
      });

      setUsername("");
      setEmail("");
      setPassword("");

      setShowRegisterModal(false);
      setShowLoginModal(true);
    } else {
      Swal.fire({
        title: "Error",
        text: data.message,
        icon: "error",
        confirmButtonColor: "#ff0000"
      });
    }
  };

  // ----------------- ✅ Login Logic ----------------
  const handleLoginSubmit = async () => {
    if (!loginEmail || !loginPassword) {
      return Swal.fire({
        title: "Error",
        text: "Please Enter Email Address & Password",
        icon: "error",
        confirmButtonColor: "#ff0000"
      });
    }

    // ----------------- ✅ Email Validation Check ----------------
    if (!isValidEmail(loginEmail)) {
      return Swal.fire({
        title: "Invalid Email",
        text: "Please enter a valid email address",
        icon: "error",
        confirmButtonColor: "#ff0000"
      });
    }

    // ----------------- ✅ Terms Checkbox Validation ----------------
    const checkbox = document.getElementById("terms");
    if (!checkbox?.checked) {
      return Swal.fire({
        title: "Error",
        text: "I Agree all Statements in Terms & Conditions",
        icon: "error",
        confirmButtonColor: "#ff0000"
      });
    }

    // ----------------- ✅ Login API Call ----------------
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPassword })
    });

    const data = await res.json();

    // ----------------- ✅ Login Response Handling ----------------
    if (data.status === "success") {
      await Swal.fire({
        title: "Success",
        text: "User Login Successfully",
        icon: "success",
        confirmButtonColor: "#00ff00"
      });

      setLoginEmail("");
      setLoginPassword("");
      checkbox.checked = false;

      setShowLoginModal(false);
      setIsLoggedIn(true);
      navigate("/posts");
    } else {
      Swal.fire({
        title: "User Login Failed",
        text: data.message,
        icon: "error",
        confirmButtonColor: "#ff0000"
      });
    }
  };

  // ----------------- ✅ UI Render ----------------
  return (
    <>
      {!isPostsPage && (
        <header className="header">
          <div className="logo-container">
            <img src={logoImg} alt="Logo" className="logo-image" />
            <div className="logo-text">Blog Application</div>
          </div>

          <button className="login-btn" onClick={openLoginModal}>
            <FaSignInAlt /> Login
          </button>
        </header>
      )}

      {/* ----------------- ✅ Login Modal ---------------- */}
      {!isPostsPage && showLoginModal && (
        <div className="modal-overlay">
          <div className="login-modal">
            <button className="close-modal" onClick={closeLoginModal}>✖</button>

            <div className="login-header"><h2>Login</h2></div>

            <input
              type="text"
              placeholder="Email Address"
              className="modal-input"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="modal-input"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            <div className="checkbox-container">
              <input type="checkbox" id="terms" />
              <label htmlFor="terms">
                I Agree all Statements in Terms & Conditions
              </label>
            </div>

            <button className="modal-login-btn" onClick={handleLoginSubmit}>
              <FaSignInAlt /> Login
            </button>

            <div className="or-container">
              <span className="line"></span>
              <span className="or-text">OR</span>
              <span className="line"></span>
            </div>

            <div className="bottom-links">
              <p>
                Don't have an account?{" "}
                <span className="register-link" onClick={openRegisterModal}>
                  Register
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- ✅ Register Modal ---------------- */}
      {!isPostsPage && showRegisterModal && (
        <div className="modal-overlay">
          <div className="login-modal">
            <button className="close-modal" onClick={closeRegisterModal}>✖</button>

            <div className="create-header"><h2>Create Account</h2></div>

            <input
              type="text"
              placeholder="Username"
              className="modal-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email Address"
              className="modal-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="modal-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="modal-login-btn" onClick={handleRegister}>
              <FaUserPlus /> Register
            </button>

            <div className="or-container">
              <span className="line"></span>
              <span className="or-text">OR</span>
              <span className="line"></span>
            </div>

            <div className="bottom-links">
              <p>
                Already have an account?{" "}
                <span
                  className="register-link"
                  onClick={() => {
                    closeRegisterModal();
                    openLoginModal();
                  }}
                >
                  Login
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ----------------- ✅ Export Component ----------------
export default Header;
