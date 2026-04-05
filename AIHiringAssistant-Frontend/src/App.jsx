import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import RegisterView from "./components/Authentication/RegisterView";
import LoginView from "./components/Authentication/LoginView";
import Footer from "./components/Footer/Footer";
import Dashboard from "./components/Dashboard/Dashboard";
import JobsView from "./components/Jobs/JobsView";
import CandidatesView from "./components/CandidateView/CandidatesView";
import AnalyticsView from "./components/AnalyticsView/AnalyticsView";
import Header from "./components/HeaderComponents/Header";
import CandidateProfilePage from "./components/ProfileComponents/CandidateProfilePage";
import ApplicantsPage from "./pages/ApplicantsPage";

const App = () => {
  const { user } = useAuth();
  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/register"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}
      <div className="min-h-screen bg-background-light dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            {/* Default route */}
            <Route path="/" element={<Navigate to="/register" replace />} />

            {/* Auth routes */}
            <Route
              path="/register"
              element={user ? <Navigate to="/dashboard" /> : <RegisterView />}
            />
            <Route
              path="/login"
              element={user ? <Navigate to="/dashboard" /> : <LoginView />}
            />

            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/jobs"
              element={user ? <JobsView /> : <Navigate to="/login" />}
            />
            <Route
              path="/candidates"
              element={user ? <CandidatesView /> : <Navigate to="/login" />}
            />
            <Route
              path="/analytics"
              element={user ? <AnalyticsView /> : <Navigate to="/login" />}
            />
            {/* Profile */}
            <Route
              path="/profile"
              element={
                user ? <CandidateProfilePage /> : <Navigate to="/login" />
              }
            />

            <Route
              path="/applicants"
              element={
                user ? (
                  user && user.userType === "HR" ? (
                    <ApplicantsPage />
                  ) : (
                    <Navigate to="/dashboard" />
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;
