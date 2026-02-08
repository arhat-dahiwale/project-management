// frontend/src/app/AppLayout.jsx

import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { OrgSwitcher } from "../organizations/components/OrgSwitcher";
import { Button } from "../shared/components/Button";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";



export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isOrgScopedRoute = location.pathname.startsWith("/organizations/") && location.pathname !== "/organizations";
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  
  const containerStyle = {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden"
  };

  const sidebarWidth = isMobile ? 240 : 260;
  const sidebarStyle = {
    width: sidebarWidth,
    position: isMobile ? "fixed" : "relative",
    left: isMobile ? (sidebarOpen ? 0 : -sidebarWidth) : 0,
    top: 0,
    height: "100vh",
    zIndex: 1001,
    transition: "left 0.25s ease",
    backgroundColor: "var(--gray-900)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid var(--gray-800)",
  };


  const mainStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    backgroundColor: "var(--gray-50)"
  };

  const headerStyle = {
    height: "64px",
    backgroundColor: "white",
    borderBottom: "1px solid var(--gray-200)",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: isMobile ? "0 1rem" : "0 2rem",
    flexShrink: 0
  };

  const contentStyle = {
    flex: 1,
    overflow: "auto",
    padding: "2rem"
  };

  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobile, sidebarOpen]);


  
  const NavItem = ({ to, icon, label }) => (
    <NavLink 
      to={to}
      onClick={() => isMobile && setSidebarOpen(false)}
      style={({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        padding: "0.75rem 1rem",
        margin: "0.25rem 0.75rem",
        borderRadius: "var(--radius-md)",
        color: isActive ? "white" : "var(--gray-400)",
        backgroundColor: isActive ? "var(--primary-700)" : "transparent",
        fontWeight: isActive ? 500 : 400,
        transition: "all 0.2s"
      })}
    >
      <span style={{ marginRight: "0.75rem" }}>{icon}</span>
      {label}
    </NavLink>
  );

  const displayName = user?.email
  ? user.email.split("@")[0]
  : user.email;

  return (
    <div style={containerStyle}>
      {/* SIDEBAR */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 1000,
          }}
        />
      )}



      <aside style={sidebarStyle}>
        <div style={{ padding: "1.5rem", fontSize: "1.25rem", fontWeight: "bold", letterSpacing: "-0.025em" }}>
          <span style={{ color: "var(--primary-500)" }}>Project Management</span>
        </div>
        
        {isOrgScopedRoute && <OrgSwitcher /> }

        <nav style={{ flex: 1, marginTop: "1rem" }}>
          <NavItem to="/organizations" icon="🏢" label="Overview" />
          
        </nav>

        <div style={{ padding: "1.5rem", borderTop: "1px solid var(--gray-800)" }}>
          <div style={{ fontSize: "0.875rem", marginBottom: "0.5rem", color: "var(--gray-400)" }}>
            {displayName}
          </div>
          <Button variant="secondary" onClick={handleLogout} style={{ width: "100%", fontSize: "0.8rem", color:"white" }}>
            Sign Out
          </Button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={mainStyle}>
        <header style={headerStyle}>
          {isMobile && (
            <Button
              variant="ghost"
              onClick={() => setSidebarOpen(true)}
              style={{ marginRight: "auto" }}
            >
              ☰
            </Button>
          )}
        </header>

        <div style={contentStyle}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}