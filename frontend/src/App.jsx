// src/App.jsx

import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // <-- Import jwt-decode
import Header from "./components/Header";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("blog-token"));
  const [modalMessage, setModalMessage] = useState("");
  const [userId, setUserId] = useState(null); // <-- State for the user's ID
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem("blog-token", token);
      try {
        const decoded = jwtDecode(token); // Decode the token
        setUserId(decoded.id); // Set the user ID from the token's payload
      } catch (error) {
        // Handle invalid token
        console.error("Invalid token:", error);
        handleLogout();
      }
    } else {
      localStorage.removeItem("blog-token");
      setUserId(null); // Clear user ID on logout
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
                userId={userId}
                setModalMessage={setModalMessage}
              />
            } // <-- Pass userId
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
