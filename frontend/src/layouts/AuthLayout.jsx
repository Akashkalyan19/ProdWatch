import React from "react";

function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#79B791]">
      <div className="w-full max-w-md rounded-xl shadow-lg p-6 bg-[#EDF4ED]">
        <h1 className="text-2xl font-bold text-center mb-6">ProdWatch</h1>
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
