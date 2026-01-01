import { useState } from "react";
import React from "react";
import { useAuth } from "../context/AuthContext";

function RegisterOrg() {
  const { registerOrg } = useAuth();

  const [orgName, setOrgName] = useState("");
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
      await registerOrg({
        org_name: orgName,
        user_name: userName,
        email,
        password,
      });
      // auto-login happens inside AuthContext
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
          className="w-full border px-3 py-2 rounded"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Your Name</label>
        <input
          className="w-full border px-3 py-2 rounded"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Email</label>
        <input
          className="w-full border px-3 py-2 rounded"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Password</label>
        <input
          className="w-full border px-3 py-2 rounded"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p>{error}</p>}

      <button
        className="w-full bg-black text-white py-2 rounded"
        type="submit"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Organization"}
      </button>
    </form>
  );
}

export default RegisterOrg;
