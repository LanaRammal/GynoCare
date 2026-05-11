import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import loginBackground from "@/assets/login-background.png";

const Login = () => {
  const { user, loading, setUser } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    if (isSignUp && !fullName) {
      toast.error("Please enter your full name");
      return;
    }

    setSubmitting(true);

    try {
      const url = isSignUp
        ? "http://127.0.0.1:8000/api/register"
        : "http://127.0.0.1:8000/api/login";

      const body = isSignUp
        ? {
            name: fullName,
            email,
            password,
            password_confirmation: password,
          }
        : {
            email,
            password,
          };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      }

      toast.success(
        isSignUp ? "Account created successfully!" : "Signed in successfully!",
      );

      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info(
      "Password reset is not connected yet. Please contact the system administrator.",
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fff8fc]">
      <img
        src={loginBackground}
        alt="GynoCare Login Background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-white/35" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-3 sm:p-6">
        <div
          className="relative w-full max-w-[360px] sm:max-w-[440px] lg:max-w-[480px] min-h-[620px] sm:min-h-[700px] overflow-hidden rounded-[28px] sm:rounded-[34px] border border-pink-100/40 shadow-2xl"
          style={{
            backgroundImage: `url(${loginBackground})`,
            backgroundSize: "cover",
            backgroundPosition: "top center",
          }}
        >
          <div className="absolute inset-0 bg-white/72" />

          <div className="relative z-10 flex min-h-[620px] sm:min-h-[700px] flex-col justify-end px-5 sm:px-7 pb-6 sm:pb-8 pt-36 sm:pt-40">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#43206b]">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>

              <p className="mt-2 text-[#7b6b87]">
                {isSignUp
                  ? "Create your clinic account"
                  : "Please sign in to your account"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#43206b]">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-12 w-full rounded-xl border border-pink-100 bg-white/80 px-5 text-[#43206b] outline-none transition-all placeholder:text-[#b7a9c1] focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#43206b]">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="h-12 w-full rounded-xl border border-pink-100 bg-white/80 px-5 text-[#43206b] outline-none transition-all placeholder:text-[#b7a9c1] focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-[#43206b]">
                    Password
                  </label>

                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm font-medium text-[#c056a2] hover:text-[#ec4899]"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    minLength={6}
                    className="h-12 w-full rounded-xl border border-pink-100 bg-white/80 px-5 pr-14 text-[#43206b] outline-none transition-all placeholder:text-[#b7a9c1] focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-[#9c89aa]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-[#5b2a90] to-[#7b38b5] text-base font-semibold text-white shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Please wait..."
                  : isSignUp
                    ? "Create Account"
                    : "Sign In"}
              </button>
            </form>

            {!isSignUp && (
              <>
                <div className="mt-6 flex items-center gap-4">
                  <div className="h-px flex-1 bg-pink-100" />
                  <span className="text-sm text-[#9c89aa]">
                    Or continue with
                  </span>
                  <div className="h-px flex-1 bg-pink-100" />
                </div>

                <div className="mt-5 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      toast.info("Google sign-in is not connected yet.")
                    }
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-pink-100 bg-white/80 shadow-sm transition-all hover:scale-105 hover:shadow-md"
                  >
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                      alt="Google"
                      className="h-6 w-6"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      toast.info("Apple sign-in is not connected yet.")
                    }
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-pink-100 bg-white/80 text-xl shadow-sm transition-all hover:scale-105 hover:shadow-md"
                  >
                    
                  </button>
                </div>
              </>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-[#7b6b87]">
                {isSignUp
                  ? "Already have an account?"
                  : "Don’t have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setPassword("");
                  }}
                  className="font-semibold text-[#ec4899] hover:text-[#d94690]"
                >
                  {isSignUp ? "Sign In" : "Create Account"}
                </button>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm font-medium text-[#d15a9f]">
                Smart Care. Organized Clinic. Empowered Women.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
