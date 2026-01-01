import React from "react";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-center mb-6">ProdWatch</h1>
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
