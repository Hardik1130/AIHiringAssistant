import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";
import PostJob from "../Jobs/PostJob";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, fetchProfile, hasJobsPostedToday } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [postOpen, setPostOpen] = useState(false);
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // close dropdown when clicking outside
  React.useEffect(() => {
    const handle = (e) => {
      if (menuOpen && !e.target.closest(".profile-dropdown")) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handle);
    return () => document.removeEventListener("click", handle);
  }, [menuOpen]);

  const isActive = (path) => location.pathname === path;

  React.useEffect(() => {
    if (location.pathname !== "/jobs" && location.pathname !== "/candidates") {
      setSearchQuery("");
    }
  }, [location.pathname, setSearchQuery]);

  const navItems = [
    { label: "Home", path: "/dashboard" },
    { label: "Jobs", path: "/jobs" },
    { label: "Candidates", path: "/candidates" },
    { label: "Analytics", path: "/analytics" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-white/80 dark:bg-background-dark/80 glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Brand Identity */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 group"
            style={{ textDecoration: "none" }}
          >
            <div
              className="p-2 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20"
              style={{ backgroundColor: "#ec5b13" }}
            >
              <span className="material-symbols-outlined text-white text-2xl">
                clinical_notes
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
                AI{" "}
                <span className="" style={{ color: "#ec5b13" }}>
                  Hire
                </span>
              </h1>
              <span className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-semibold">
                Intelligence Recruiter
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 text-sm font-semibold transition-all rounded-lg ${isActive(item.path)
                    ? "text-[#ec5b13] nav-link-active"
                    : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-primary/5"
                  }`}
                style={{ textDecoration: "none" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            {(location.pathname === "/jobs" ||
              location.pathname === "/candidates") && (
                <div className="hidden lg:flex items-center bg-gray-100 dark:bg-primary/5 border border-transparent focus-within:border-primary/30 rounded-xl px-3 py-1.5 transition-all">
                  <span className="material-symbols-outlined text-gray-400 text-xl">
                    search
                  </span>
                  <input
                    type="text"
                    className="bg-transparent border-none focus:ring-0 text-sm w-32 xl:w-48 placeholder:text-gray-400 dark:text-white"
                    placeholder={
                      location.pathname === "/jobs"
                        ? "Search jobs..."
                        : "Search talent..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}

            <div className="flex items-center gap-2 border-l border-gray-200 dark:border-white/10 ml-2 pl-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
                <span className="material-symbols-outlined">notifications</span>
                {hasJobsPostedToday && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full ring-2 ring-white dark:ring-background-dark"></span>
                )}
              </button>

              {/* Post Job */}
              <button
                onClick={() => setPostOpen(true)}
                className="hidden sm:flex items-center gap-2 hover:bg-primary/90 text-white px-3.5 py-1.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/25 transition-all active:scale-95 whitespace-nowrap"
                style={{ backgroundColor: "#ec5b13" }}
              >
                <span className="material-symbols-outlined text-lg">
                  add_circle
                </span>
                Post Job
              </button>

              {/* Profile dropdown */}
              <div
                className="relative profile-dropdown"
                onClick={() => setMenuOpen((o) => !o)}
              >
                <div className="flex items-center gap-3 ml-2 pl-2 cursor-pointer group">
                  <div className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 group-hover:border-primary transition-all">
                    <img
                      alt={user?.fullName || user?.name || "User"}
                      className="w-full h-full rounded-full object-cover rounded-full"
                      src={
                        user?.avatar ||
                        user?.photo ||
                        "https://via.placeholder.com/40"
                      }
                    // src="https://scontent.fdel27-5.fna.fbcdn.net/v/t39.30808-6/341258911_963549314638562_6233974754195280257_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=1d70fc&_nc_ohc=4oYQK1LNiBoQ7kNvwHpCthO&_nc_oc=Adlz_MCzu4FB6YZv6EQQS3k3nPFSoEswpHZKnGVIdt3rNrrT8EfeYk_BuFWkvlFRSy80B2wWQcPM-wC6JpIWgx9P&_nc_zt=23&_nc_ht=scontent.fdel27-5.fna&_nc_gid=aCKqW_M6vks2bi8ByVwGJA&_nc_ss=8&oh=00_Afyr-PdrZ0ovt42QOn9trpMFINLgmtWPvCSwn1WkQDn69Q&oe=69BC925C"
                    />
                  </div>
                  <div className="hidden xl:flex flex-col">
                    <span className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                      {user?.fullName || user?.name || "Unknown"}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {user?.role || user?.userType || ""}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">
                    expand_more
                  </span>
                </div>
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setMenuOpen(false);
                        if (typeof fetchProfile === "function") {
                          fetchProfile().catch(() => { });
                        }
                      }}
                    >
                      Profile
                    </Link>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                        navigate("/login");
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {postOpen && <PostJob onClose={() => setPostOpen(false)} />}

            {/* Mobile Menu */}
            <button
              onClick={() => {
                console.log("BURGER CLICKED");
                setMobileMenuOpen(prev => !prev);
              }}
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
            >
              <span className="material-symbols-outlined">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
            
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            style={{
              position: "fixed",
              top: "70px",
              right: "20px",
              zIndex: 999999,
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "8px",
              width: "200px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "block",
                  padding: "12px",
                  borderBottom: "1px solid #eee",
                  textDecoration: "none",
                  color: "#333",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
