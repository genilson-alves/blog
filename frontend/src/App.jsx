import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("blog-token"));
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem("blog-token", token);
    } else {
      localStorage.removeItem("blog-token");
    }
  }, token);

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
              <HomePage token={token} setModalMessage={setModalMessage} />
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
};

export default App;
