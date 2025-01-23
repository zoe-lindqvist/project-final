import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LogIn,
  UserPlus,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Music2,
} from "lucide-react";

export const Auth: React.FC = () => {
  // State to track if user is signing up or logging in
  const [isSignUp, setIsSignUp] = useState(false);

  // State to track loading state during authentication
  const [isLoading, setIsLoading] = useState(false);

  // State to store and display error messages
  const [error, setError] = useState<string | null>(null);

  // Hook to navigate to different pages (/journal after successful login)
  const navigate = useNavigate();

  const register = useAuthStore((state) => state.register);
  const login = useAuthStore((state) => state.login);

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Clear any previous error messages
    setIsLoading(true); // Set loading state to true

    // Get form data
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;

    try {
      if (isSignUp) {
        await register(username, email, password);
      } else {
        await login(email, password);
      }

      navigate("/journal"); // Navigate after successful login/signup
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      {/* Logo that links back to the homepage */}
      <Link to="/" className="mb-12 group" aria-label="Return to homepage">
        <div className="relative">
          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-blue-400/30 dark:from-purple-400/20 dark:to-blue-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
          {/* Music icon inside the animated logo */}
          <div className="relative bg-gradient-to-r p-4 from-purple-100 to-blue-100 dark:from-purple-900/50 dark:to-blue-900/50 rounded-full transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[360deg]">
            <Music2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </Link>

      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 dark:from-purple-900/30 dark:to-blue-900/30" />

            <div className="relative p-8">
              {/* Heading */}
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {isSignUp ? "Create an Account" : "Welcome Back"}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  {isSignUp
                    ? "Start your musical journey today"
                    : "Continue your musical journey"}
                </p>
              </div>

              {/* Authentication Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {/* Conditionally render the Username field for Sign Up */}
                  {isSignUp && (
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Username
                      </label>
                      <div className="relative">
                        <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          id="username"
                          name="username"
                          type="text"
                          required
                          className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                          placeholder="Choose a username"
                        />
                      </div>
                    </div>
                  )}
                  {/* Email input field */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  {/* Password input field */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="pl-10 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>

                {/* Display error message */}
                {error && (
                  <div className="text-red-500 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* Submit button with loading state */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 dark:bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 dark:hover:bg-purple-600 transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  ) : (
                    <>
                      {isSignUp ? "Create Account" : "Sign In"}
                      <ArrowRight className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </>
                  )}
                </button>
              </form>

              {/* Toggle sign-in/sign-up mode */}
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                >
                  {isSignUp
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign up"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-8 text-sm text-gray-600 dark:text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};
