import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const LoginView = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      const msg = "Please fill in all fields";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!isValidEmail(email)) {
      const msg = "Please enter a valid email";
      setEmailError(msg);
      toast.error(msg);
      return;
    }

    try {
      await login({ email, password });
      // toast.success("Logged in successfully");
      navigate("/dashboard");
    } catch (err) {
      const message = err || "Login failed. Please try again.";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-[85vh] min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-[440px] bg-white rounded-[20px] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="pt-2 pb-2 px-4 flex flex-col items-center">
          <div className="size-8 bg-[#EEF2FF] rounded-xl flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-primary text-4xl">
              neurology
            </span>
          </div>
          <h2 className="text-sm font-extrabold text-slate-700 tracking-tight">
            AI Hiring Portal
          </h2>
          <p className="text-slate-500 text-lg mt-3 text-center">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Form */}
        <form className="px-8 pb-4 space-y-2" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <span className="material-symbols-outlined text-[20px]">
                  mail
                </span>
              </span>

              <input
                type="text"
                value={email}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmail(value);

                  if (!value) {
                    setEmailError("");
                  } else if (!isValidEmail(value)) {
                    setEmailError("Please enter a valid work email address");
                  } else {
                    setEmailError("");
                  }
                }}
                className={`w-full pl-11 pr-4 py-2 rounded-xl outline-none transition-all font-medium text-slate-700
                  ${emailError ? "border-2 border-red-400" : "border border-slate-200 focus:border-primary"}
                `}
                placeholder="Enter your email"
              />
              {emailError && (
                <p className="text-red-400 text-xs font-semibold flex items-center gap-1.5 mt-2">
                  <span className="material-symbols-outlined text-[16px]">
                    error
                  </span>
                  {emailError}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700">
                Password
              </label>
              <a
                href="#"
                className="text-xs font-bold text-primary hover:underline"
              >
                Forgot Password?
              </a>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <span className="material-symbols-outlined text-[20px]">
                  lock
                </span>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-2 border border-slate-200 rounded-xl focus:ring-1 focus:ring-primary/10 focus:border-primary outline-none transition-all font-medium text-slate-700"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                error
              </span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center mt-4 justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Logging in..." : "Log In"}
            <span className="material-symbols-outlined text-[22px]">login</span>
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink mx-4 mt-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
              or continue with
            </span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 py-2 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPK1ebVW9qiuo0yq1Ib5BSXrVZMIprH0O7YiipRa6yAngaXvEasTBrlQ7WKF5YOjh2IzT1wvwiLXd4S5v_bvkAtoyz-sgzqt5URZDjQXd7aXlqVC3S6BMntLn_1wpkuasGYJtUBr5PUZsrviVERBcOSEap8M6vjKScoXLeSInOs4tT9SgorhiSVkCWrxPRO10rvAOy3MAa4CscfEr1eRsPF34u8uR7elFzrn6lWq1o3tpdjHPWBToa6MEXt8cF1QF7EuwwrTDm94c"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>
        </form>

        <div className="bg-slate-50/50 py-2 px-10 border-t border-slate-100 text-center gap-1">
          <span className="text-sm text-slate-500 font-medium">
            Don't have an account?
          </span>
          <button
            onClick={() => navigate("/register")}
            className="text-primary font-bold hover:underline ml-1"
          >
            signUp
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
