import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const RegisterView = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    userType: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.userType ||
      !formData.password
    ) {
      const msg = "Please fill in all fields";
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      await register(formData);
      const msg = "Registration successful! Redirecting to dashboard...";
      setSuccess(msg);
      // toast.success(msg);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      const message = err || "Registration failed. Please try again.";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#d7dbde] overflow-y-auto">
      <Header />

      {/* Main Content */}
      <main className="flex items-center justify-center  px-8 py-8 mt-5">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row  bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Left Side branding */}
          <div className="lg:flex lg:w-[55%] bg-primary relative overflow-hidden flex-col justify-between p-14 text-white">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold mb-10">
                <span className="material-symbols-outlined text-sm">
                  auto_awesome
                </span>
                Powered by Devstringx
              </div>
              <h1 className="text-5xl font-black leading-[1.15] mb-6">
                The Future of Talent Acquisition is Here.
              </h1>
              <p className="text-white/80 text-lg leading-relaxed font-medium">
                Automate your screening process, reduce bias, and hire 10x
                faster with our AI-driven recruitment engine.
              </p>
            </div>

            <div className="relative z-10 space-y-8">
              <div className="flex items-start gap-5">
                <div className="bg-white/15 p-3 rounded-2xl backdrop-blur-sm">
                  <span className="material-symbols-outlined text-2xl">
                    bolt
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-xl mb-1">
                    Instant Screening
                  </h4>
                  <p className="text-sm opacity-70 font-medium">
                    Rank candidates based on skills and culture fit in seconds.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="bg-white/15 p-3 rounded-2xl backdrop-blur-sm">
                  <span className="material-symbols-outlined text-2xl">
                    analytics
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-xl mb-1">Deep Insights</h4>
                  <p className="text-sm opacity-70 font-medium">
                    Predictive performance analytics for every applicant.
                  </p>
                </div>
              </div>
            </div>

            {/* Abstract Background Decoration */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>

          {/* Right Side Form */}
          <div className="w-full lg:w-[45%] p-6 lg:p-8 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-6">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                  Join the AI Hiring Revolution
                </h2>
                <p className="text-slate-500 font-medium text-base">
                  Start finding top talent in minutes.
                </p>
              </div>

              <form className="space-y-2 font-roboto" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="mt-2 material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      person
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-1 focus:ring-primary/5 focus:border-primary outline-none transition-all text-slate-700 font-medium"
                      placeholder="Enter your full name"
                      required
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-1 mt-4">
                  <label className="text-sm font-bold text-slate-700">
                    Email
                  </label>
                  <div className="relative">
                    <span className="mt-2 material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      mail
                    </span>
                    <input
                      className="w-full pl-12 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-1 focus:ring-primary/5 focus:border-primary outline-none transition-all text-slate-700 font-medium"
                      placeholder="Enter your email"
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="space-y-1 mt-4">
                  <label className="text-sm font-bold text-slate-700">
                    Category
                  </label>

                  <div className="relative">
                    {/* Left Icon */}
                    <span className="mt-2 material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      corporate_fare
                    </span>

                    {/* Dropdown */}
                    <select
                      required
                      name="userType"
                      value={formData.userType}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-1 focus:ring-primary/5 focus:border-primary outline-none transition-all text-slate-500 font-medium appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        UserType
                      </option>
                      <option value="CANDIDATE">Candidate</option>
                      <option value="HR">Recruiter</option>
                    </select>

                    {/* Right dropdown arrow */}
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                <div className="space-y-1 mt-4">
                  <label className="text-sm font-bold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <span className="mt-2 material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                      lock
                    </span>
                    <input
                      className="w-full pl-12 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-1 focus:ring-primary/5 focus:border-primary outline-none transition-all text-slate-700 font-medium"
                      placeholder="••••••••"
                      required
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/3 -translate-y-1/3 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {/* <span className="mt-5 material-symbols-outlined">visibility</span> */}
                      <span className="mt-5 material-symbols-outlined text-[20px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-2xl text-sm font-medium flex items-center gap-2 mt-2">
                    <span className="material-symbols-outlined text-[18px]">
                      error
                    </span>
                    {error}
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded-2xl text-sm font-medium flex items-center gap-2 mt-2">
                    <span className="material-symbols-outlined text-[18px]">
                      check_circle
                    </span>
                    {success}
                  </div>
                )}

                <button
                  className={`w-full mt-4 bg-primary hover:bg-primary-dark text-white font-black py-2 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                  <span className="material-symbols-outlined">
                    arrow_forward
                  </span>
                </button>
              </form>

              <p className="mt-20 text-xs text-slate-400 text-center font-medium leading-relaxed px-4">
                By clicking Create Account, you agree to our
                <a
                  className="text-primary font-bold hover:underline mx-1"
                  href="#"
                >
                  Terms of Service
                </a>
                and
                <a
                  className="text-primary font-bold hover:underline mx-1"
                  href="#"
                >
                  Privacy Policy
                </a>
                . Data security is our top priority.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default RegisterView;
