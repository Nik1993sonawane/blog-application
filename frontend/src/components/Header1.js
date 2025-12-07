// ----------------- ✅ React Router ----------------
import { useNavigate } from "react-router-dom";

// ----------------- ✅ SweetAlert ----------------
import Swal from "sweetalert2";

// ----------------- ✅ CSS ----------------
import "../Styles/Header1.css";

// ----------------- ✅ Logo Asset ----------------
import logoImg from "../assests/Logo.png";

// ----------------- ✅ React Icon ----------------
import { FaSignOutAlt } from "react-icons/fa";

// ----------------- ✅ Header Component ----------------
function Header1({ setIsLoggedIn }) {

  // ----------------- ✅ Navigation Hook ----------------
  const navigate = useNavigate();

  // ----------------- ✅ Logout Function ----------------
  const handleLogout = async () => {

    // ----------------- ✅ Confirmation Popup ----------------
    const confirm = await Swal.fire({
      title: "Are you Sure?",
      text: "Do you want to Logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      cancelButtonColor: "#ff0000",
      confirmButtonText: "Logout",
    });

    if (!confirm.isConfirmed) return;

    // ----------------- ✅ Update Login State ----------------
    setIsLoggedIn(false);

    // ----------------- ✅ Success Popup ----------------
    await Swal.fire({
      title: "Log Out",
      text: "You have been Log Out Successfully",
      icon: "success",
      confirmButtonColor: "#00ff00",
    });

    // ----------------- ✅ Redirect to Home ----------------
    navigate("/");
  };

  // ----------------- ✅ JSX UI ----------------
  return (
    <header className="header1">

      {/* ----------------- ✅ Logo Section ---------------- */}
      <div className="logo-container1">
        <img src={logoImg} alt="Logo" className="logo-image1" />
        <span className="logo-text1">Blog Application</span>
      </div>

      {/* ----------------- ✅ Logout Section ---------------- */}
      <form className="search-logout-form">
        <button
          type="button"
          className="logout-btn1"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Logout
        </button>
      </form>

    </header>
  );
}

// ----------------- ✅ Export Component ----------------
export default Header1;
