import React, { useContext, useState, useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { useModal } from "../Modal/useModal";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const LoginPopup = ({ setShowLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const {
    url,
    setToken,
    setUserId,
    setEmail,
    setUsername,
    handleLoginSuccess,
    updateProfileImage,
  } = useContext(StoreContext);

  const { openModal } = useModal();

  const [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setShowLogin(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [setShowLogin]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (data.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    if (isSignUp && !acceptTerms) {
      setError("You must accept the Terms & Conditions");
      return false;
    }

    return true;
  };

// FORGOT PASSWORD FUNCTION
const handleForgotPassword = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setResetMessage("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(resetEmail)) {
    setError("Please enter a valid email address");
    setIsLoading(false);
    return;
  }

  try {
    const response = await axios.post(`${url}/api/user/forgot-password`, {
      email: resetEmail,
    });

    console.log("Backend response:", response.data);

    if (response.data.success) {
      // CLOSE THE LOGIN POPUP FIRST
      setShowLogin(false);
      
      // THEN SHOW THE RESET LINK MODAL
      openModal({
        title: "Password Reset Link",
        message: (
          <div>
            <p>For demo purposes, here's your reset link:</p>
            <a
              href={response.data.resetLink}
              className="text-blue-600 underline break-all block mt-2"
            >
              {response.data.resetLink}
            </a>
            <p className="text-sm text-gray-600 mt-2">
              Click the link above to reset your password.
            </p>
          </div>
        ),
      });

      if (response.data.resetLink) {
        console.log("Reset Link:", response.data.resetLink);
      }
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    const message =
      error.response?.data?.message ||
      "Something went wrong. Please try again.";
    setError(message);
  } finally {
    setIsLoading(false);
  }
};

  const onLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      let endpoint = isSignUp ? "/api/user/register" : "/api/user/login";
      let payload = { ...data, profileImage: selectedImage };

      if (!isSignUp) {
        delete payload.username;
        delete payload.name;
      }

      const response = await axios.post(`${url}${endpoint}`, payload, {
        withCredentials: true,
      });

      if (response.data.success) {
        openModal({
          title: "Success!",
          message: isSignUp
            ? "Your account has been created!"
            : "You are now signed in.",
        });

        handleLoginSuccess(response.data);
        setShowLogin(false);

        if (isSignUp) {
          setTimeout(() => {
            openModal({
              title: "Welcome!",
              message:
                "You've earned 1 reward point! Complete 2 more orders to reach Bronze status.",
            });
          }, 500);
        }
      } else {
        openModal({
          title: "Error",
          message: response.data.message || "Authentication failed",
        });
        setError(response.data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Login/Register error:", error);
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      openModal({
        title: "Error",
        message,
      });
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when switching modes
  const toggleSignUpMode = (isSignUpMode) => {
    setIsSignUp(isSignUpMode);
    setIsForgotPassword(false);
    setError("");
    setResetMessage("");
    setData({
      name: "",
      username: "",
      email: "",
      password: "",
    });
    setSelectedImage(null);
    setAcceptTerms(false);
    setResetEmail("");
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(true);
    setError("");
    setResetMessage("");
    setResetEmail(data.email || ""); // Pre-fill with current email
  };

  const backToLogin = () => {
    setIsForgotPassword(false);
    setError("");
    setResetMessage("");
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-60"
      style={{ fontFamily: "'League Spartan', sans-serif" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      <div
        className="absolute inset-0"
        onClick={() => setShowLogin(false)}
        aria-label="Close modal"
      />

      <div className="bg-white flex flex-col items-center justify-center p-6 m-8 rounded-xl w-[380px] relative shadow-lg gap-6 z-10">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={() => setShowLogin(false)}
          aria-label="Close login modal"
        >
          <IoIosCloseCircle className="w-7 h-7 text-[#2e2e2e] cursor-pointer" />
        </button>

        <h2 id="login-modal-title" className="text-xl font-bold text-center">
          {isForgotPassword
            ? "Reset Password"
            : isSignUp
            ? "Create Account"
            : "Welcome Back"}
        </h2>

        {/* FORGOT PASSWORD VIEW */}
        {isForgotPassword ? (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
              <p className="text-red-500 text-sm font-medium">
                Forgot your password?
              </p>
              <p className="text-green-600 text-xs mt-1">
                Enter your email and we'll send you a reset link
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm w-[250px]">
                {error}
              </div>
            )}

            {resetMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded text-sm w-[250px]">
                {resetMessage}
              </div>
            )}

            <form
              onSubmit={handleForgotPassword}
              className="flex flex-col items-center gap-4 w-full"
            >
              <div className="flex items-center border border-gray-300 rounded-md px-3 w-[250px] focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-colors">
                <FiMail className="text-gray-500 mr-2" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="flex-1 p-2 text-sm focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-green-500 text-white py-2 rounded-full hover:bg-green-600 disabled:bg-green-400 transition text-sm w-[250px] cursor-pointer flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>

            <button
              onClick={backToLogin}
              className="text-green-600 font-medium hover:underline text-sm"
            >
              ← Back to Login
            </button>
          </>
        ) : (
          /* LOGIN/SIGNUP VIEW */
          <>
            {isSignUp && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                <p className="text-blue-800 text-sm font-medium">
                   Join now and start earning rewards!
                </p>
                <p className="text-blue-600 text-xs mt-1">
                  Get discounts and free items as you order more
                </p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded text-sm w-[250px]">
                {error}
              </div>
            )}

            <form
              onSubmit={onLogin}
              className="flex flex-col items-center justify-center gap-4"
              noValidate
            >
              {isSignUp && (
                <div className="flex items-center border border-gray-300 rounded-md px-3 w-[250px] focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-colors">
                  <FiUser className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={data.name}
                    onChange={onChangeHandler}
                    className="flex-1 p-2 text-sm focus:outline-none"
                    required={isSignUp}
                  />
                </div>
              )}

              {isSignUp && (
                <div className="flex items-center border border-gray-300 rounded-md px-3 w-[250px] focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-colors">
                  <FiUser className="text-gray-500 mr-2" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={data.username}
                    onChange={onChangeHandler}
                    className="flex-1 p-2 text-sm focus:outline-none"
                    required={isSignUp}
                  />
                </div>
              )}

              {/* {isSignUp && (
                <div className="flex items-center justify-center w-[250px]">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                      {selectedImage ? (
                        <img
                          src={selectedImage}
                          alt="Profile"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <FiUser className="w-8 h-8 text-gray-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Click to upload photo
                    </p>
                  </label>
                </div>
              )} */}

              <div className="flex items-center border border-gray-300 rounded-md px-3 w-[250px] focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-colors">
                <FiMail className="text-gray-500 mr-2" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={data.email}
                  onChange={onChangeHandler}
                  className="flex-1 p-2 text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center border border-gray-300 rounded-md px-3 w-[250px] focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 transition-colors relative">
                <FiLock className="text-gray-500 mr-2" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={data.password}
                  onChange={onChangeHandler}
                  className="flex-1 p-2 text-sm focus:outline-none"
                  required
                  minLength="6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-800 absolute right-3"
                >
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </button>
              </div>

              {isSignUp && (
                <label className="flex items-start gap-2 text-xs text-gray-600 w-[250px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    I agree to the{" "}
                    <button
                      type="button"
                      className="text-green-600 font-medium hover:underline"
                    >
                      Terms
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="text-green-600 font-medium hover:underline"
                    >
                      Privacy Policy
                    </button>
                  </span>
                </label>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="bg-green-500 text-white py-2 rounded-full mt-2 hover:bg-green-600 disabled:bg-green-400 transition text-sm w-[250px] cursor-pointer flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {isSignUp ? "Creating Account..." : "Signing In..."}
                  </>
                ) : isSignUp ? (
                  "Create Account"
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* FORGOT PASSWORD LINK (Login only) */}
            {!isSignUp && !isForgotPassword && (
              <button
                onClick={toggleForgotPassword}
                className="text-green-600 font-medium hover:underline text-sm"
              >
                Forgot your password?
              </button>
            )}

            {/* TOGGLE BETWEEN LOGIN/SIGNUP */}
            <p className="text-sm text-center text-gray-600">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-green-600 font-medium hover:underline cursor-pointer"
                    onClick={() => toggleSignUpMode(false)}
                  >
                    Sign In
                  </button>
                </>
              ) : (
                !isForgotPassword && (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      className="text-green-600 font-medium hover:underline cursor-pointer"
                      onClick={() => toggleSignUpMode(true)}
                    >
                      Sign Up
                    </button>
                  </>
                )
              )}
            </p>

            {!isSignUp && !isForgotPassword && (
              <div className="text-xs text-gray-500 text-center">
                <p>Sign in to check your rewards progress and discounts!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginPopup;
