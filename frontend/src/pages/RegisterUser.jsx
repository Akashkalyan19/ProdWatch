import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import React from "react";
function RegisterUser() {
  const { registerUser } = useAuth();

  const [orgName, setOrgName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await registerUser({
        org_name: orgName,
        join_code: Number(joinCode),
        user_name: userName,
        email,
        password,
      });
      // auto-login happens in AuthContext
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Organization Name</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Join Code</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Your Name</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Email</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Password</label>
        <input
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p>{error}</p>}

      <button
        className="w-full bg-[#51291E]  text-white py-2 rounded"
        type="submit"
        disabled={loading}
      >
        {loading ? "Joining..." : "Join Organization"}
      </button>
    </form>
  );
}

export default RegisterUser;
