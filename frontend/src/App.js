// ----------------- ✅ React Core -----------------
import React, { useState } from "react";

// ----------------- ✅ React Router -----------------
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ----------------- ✅ Header Components -----------------
import Header from "./components/Header";
import Header1 from "./components/Header1";

// ----------------- ✅ Footer Component -----------------
import Footer from "./components/Footer";

// ----------------- ✅ Pages -----------------
import Home from "./pages/Home";
import Posts from "./pages/Posts";

// ----------------- ✅ Main CSS -----------------
import "./App.css";

// ----------------- ✅ App Component -----------------
function App() {
  // ----------------- ✅ Login State -----------------
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    // ----------------- ✅ Router Wrapper -----------------
    <Router>
      <div className="app-container">
        
        {/* ----------------- ✅ Conditional Header ----------------- */}
        {isLoggedIn ? (
          <Header1 setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <Header setIsLoggedIn={setIsLoggedIn} />
        )}

        {/* ----------------- ✅ Main Content ----------------- */}
        <main className="main-content">
          <Routes>

            {/* ----------------- ✅ Home Route ----------------- */}
            <Route path="/" element={<Home />} />

            {/* ----------------- ✅ Protected Posts Route ----------------- */}
            <Route
              path="/posts"
              element={isLoggedIn ? <Posts /> : <Navigate to="/" />}
            />

          </Routes>
        </main>

        {/* ----------------- ✅ Footer Area ----------------- */}
        <Footer />
      </div>
    </Router>
  );
}

// ----------------- ✅ Export App -----------------
export default App;
