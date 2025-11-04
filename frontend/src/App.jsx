import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Modal from "./components/Modal.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("blog-token"));
  const [modalMessage, setModalMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem("blog-token", token);
      try {
        const decoded = jwtDecode(token);
        setCurrentUser({ id: decoded.id, username: decoded.username });
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout();
      }
    } else {
      localStorage.removeItem("blog-token");
      setCurrentUser(null);
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    navigate("/");
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
      {modalMessage && (
        <Modal message={modalMessage} onClose={() => setModalMessage("")} />
      )}
      <Header token={token} onLogout={handleLogout} />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                token={token}
                currentUser={currentUser}
                setModalMessage={setModalMessage}
              />
            }
          />
          <Route
            path="/login"
            element={
              <LoginPage
                setToken={setToken}
                setModalMessage={setModalMessage}
              />
            }
          />
          <Route
            path="/register"
            element={<RegisterPage setModalMessage={setModalMessage} />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
