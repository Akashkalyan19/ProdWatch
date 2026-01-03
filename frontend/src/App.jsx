import React, { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import IncidentList from "./pages/IncidentList";
import AuditLogs from "./pages/AuditLogs";
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
  const handleLogout = () => {
    logout();
    setActivePage("incidents");
  };

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     setActivePage("incidents");
  //   }
  // }, [isAuthenticated]);

  return (
    <div className="flex h-screen bg-[#79B791] text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-[#EDF4ED] border-r border-gray-200 p-5 flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-[#51291E]">PRODWATCH</h2>

        <p className="text-sm text-[#51291E] mb-6 truncate ">{user.email}</p>

        <nav className="space-y-1 flex-1">
          <button
            onClick={() => setActivePage("incidents")}
            className={
              "w-full bg-[#51291E] text-left border border-[#51291E]  text-white px-3 py-2 rounded-lg hover:bg-[#EDF4ED] hover:text-[#51291E] "
            }
          >
            Incidents
          </button>

          <button
            onClick={() => setActivePage("team")}
            className="w-full bg-[#51291E] text-left border border-[#51291E]  text-white px-3 py-2 rounded-lg hover:bg-[#EDF4ED] hover:text-[#51291E] "
          >
            Team Members
          </button>
          {user.role === "owner" && (
            <button
              onClick={() => setActivePage("audits")}
              className={
                "w-full bg-[#51291E] text-left border border-[#51291E]  text-white px-3 py-2 rounded-lg hover:bg-[#EDF4ED] hover:text-[#51291E] "
              }
            >
              Audit Logs
            </button>
          )}
        </nav>

        <button
          onClick={handleLogout}
          className="w-full bg-[#51291E] text-white py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {activePage === "incidents" && <IncidentList />}
        {activePage === "team" && <TeamMembers />}
        {activePage === "audits" && <AuditLogs />}
      </main>
    </div>
  );
}

export default App;
