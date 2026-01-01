import React, { useState } from "react";
import RegisterOrg from "./RegisterOrg";
import RegisterUser from "./RegisterUser";
import AuthLayout from "../layouts/AuthLayout";

function Register({ onSwitch }) {
  const [tab, setTab] = useState("org");

  return (
    <AuthLayout>
      <div className="flex mb-6 border-b">
        <button
          className={`flex-1 py-2 ${
            tab === "org" ? "border-b-2 border-black font-semibold" : ""
          }`}
          onClick={() => setTab("org")}
        >
          Register Organization
        </button>
        <button
          className={`flex-1 py-2 ${
            tab === "user" ? "border-b-2 border-black font-semibold" : ""
          }`}
          onClick={() => setTab("user")}
        >
          Join Organization
        </button>
      </div>

      {tab === "org" ? <RegisterOrg /> : <RegisterUser />}

      <p className="text-sm text-center mt-4">
        Already have an account?{" "}
        <button onClick={onSwitch} className="text-blue-600 underline">
          Login
        </button>
      </p>
    </AuthLayout>
  );
}

export default Register;
