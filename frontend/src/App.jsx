import React, { useState } from "react";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import IncidentList from "./pages/IncidentList";
import TeamMembers from "./pages/TeamMembers";

function App() {
  const { isAuthenticated, user, logout } = useAuth();
  const [authPage, setAuthPage] = useState("login");
  const [activePage, setActivePage] = useState("incidents");

  if (!isAuthenticated) {
    return authPage === "login" ? (
      <Login onSwitch={() => setAuthPage("register")} />
    ) : (
      <Register onSwitch={() => setAuthPage("login")} />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <div className="relative w-64 bg-white border-r border-gray-200 p-5 h-screen">
        <h2 className="text-xl font-bold mb-6">ProdWatch</h2>

        <p className="text-sm text-gray-600 mb-6">{user.email}</p>

        <button
          onClick={() => setActivePage("incidents")}
          className={`text-left px-3 py-2 rounded mb-2 ${
            activePage === "incidents"
              ? "bg-gray-100 font-medium"
              : "hover:bg-gray-100"
          }`}
        >
          Incidents
        </button>

        <button
          onClick={() => setActivePage("team")}
          className={`text-left px-3 py-2 rounded ${
            activePage === "team"
              ? "bg-gray-100 font-medium"
              : "hover:bg-gray-100"
          }`}
        >
          Team Members
        </button>

        <div className="absolute bottom-4 left-5">
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activePage === "incidents" && <IncidentList />}
        {activePage === "team" && <TeamMembers />}
      </div>
    </div>
  );
}

export default App;
