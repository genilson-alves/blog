import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import API_URL from "../config";

const LoginPage = ({ setToken, setModalMessage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleApiError = async (response) => {
    let errorMsg = `Error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMsg = errorData.error || errorMsg;
    } catch (e) {
      console.debug("Error parsing error response", e);
    }
    throw new Error(errorMsg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (username.length < 4) {
      setModalMessage("Username must be at least 4 characters.");
      setIsLoading(false);
      return;
    }
    if (password.length === 0) {
      setModalMessage("Password cannot be empty.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) await handleApiError(response);

      const data = await response.json();
      setToken(data.token);
      setModalMessage("Login successful!");
      navigate("/");
    } catch (error) {
      setModalMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="shadow-inner appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-inner appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg disabled:bg-blue-300 transition-all duration-200 transform hover:scale-105"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-blue-500 hover:text-blue-700"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
