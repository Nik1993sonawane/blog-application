// ----------------- ✅ React Core -----------------
import React from "react";

// ----------------- ✅ Footer CSS -----------------
import "../Styles/Footer.css";

// ----------------- ✅ React Icons -----------------
import { FaFacebookF, FaTwitter, FaInstagram, FaGoogle, FaYoutube } from "react-icons/fa";

// ----------------- ✅ Gmail Icon -----------------
import { SiGmail } from "react-icons/si";

// ----------------- ✅ Footer Component -----------------
function Footer() {
  return (
    // ----------------- ✅ Footer Wrapper -----------------
    <footer className="footer">
      {/* ----------------- ✅ Footer Row ----------------- */}
      <div className="footer-row">

        {/* ----------------- ✅ Copyright Text ----------------- */}
        <p className="footer-text">
          © {new Date().getFullYear()} Blog Application. All rights reserved.
        </p>

        {/* ----------------- ✅ Social Media Links ----------------- */}
        <div className="social-links">

          {/* ----------------- ✅ Facebook Icon ----------------- */}
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <FaFacebookF />
          </a>

          {/* ----------------- ✅ Twitter Icon ----------------- */}
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <FaTwitter />
          </a>

          {/* ----------------- ✅ Instagram Icon ----------------- */}
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <FaInstagram />
          </a>

          {/* ----------------- ✅ Gmail Icon ----------------- */}
          <a href="mailto:someone@example.com" target="_blank" rel="noreferrer">
            <SiGmail />
          </a>

          {/* ----------------- ✅ Google Icon ----------------- */}
          <a href="https://google.com" target="_blank" rel="noreferrer">
            <FaGoogle />
          </a>

          {/* ----------------- ✅ YouTube Icon ----------------- */}
          <a href="https://youtube.com" target="_blank" rel="noreferrer">
            <FaYoutube />
          </a>

        </div>
      </div>
    </footer>
  );
}

// ----------------- ✅ Export Footer -----------------
export default Footer;
