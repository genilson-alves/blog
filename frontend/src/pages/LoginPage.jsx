import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import App from "./../App";

const API_URL = "http://localhost:3000";

const LoginPage = ({ setToken, setModalMessage }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");
      setToken(data.token);
      navigate("/");
    } catch (error) {
      setModalMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Welcome
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
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700"
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
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg disabled:bg-blue-300"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="text-center text-gray-600 mt-6">
        Don't have an account?
        <Link
          to="/register"
          className="text-blue-500 hover:text-blue-700 font-bold ml-2"
        >
          Register
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
