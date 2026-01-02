import React, { useState } from "react";
import RegisterOrg from "./RegisterOrg";
import RegisterUser from "./RegisterUser";
import AuthLayout from "../layouts/AuthLayout";

function Register({ onSwitch }) {
  const [tab, setTab] = useState("org");

  return (
    <AuthLayout>
      <h2 className="text-xl font-semibold text-center mb-4">Register</h2>

      <div className="flex mb-6 border-b">
        <button
          className={`flex-1 py-2 text-sm ${
            tab === "org"
              ? "border-b-2 border-black font-medium"
              : "text-gray-500"
          }`}
          onClick={() => setTab("org")}
        >
          Organization
        </button>

        <button
          className={`flex-1 py-2 text-sm ${
            tab === "user"
              ? "border-b-2 border-black font-medium"
              : "text-gray-500"
          }`}
          onClick={() => setTab("user")}
        >
          Join Team
        </button>
      </div>

      {tab === "org" ? <RegisterOrg /> : <RegisterUser />}

      <p className="text-sm text-center mt-4 text-gray-600">
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          className="text-black font-medium hover:underline"
        >
          Login
        </button>
      </p>
    </AuthLayout>
  );
}

export default Register;
