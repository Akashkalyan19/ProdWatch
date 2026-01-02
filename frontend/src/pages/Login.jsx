import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../layouts/AuthLayout";

function Login({ onSwitch }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-xl font-semibold text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#51291E] text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-sm text-center mt-4 text-gray-600">
        Don’t have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-black font-medium hover:underline"
        >
          Register
        </button>
      </p>
    </AuthLayout>
  );
}

export default Login;
