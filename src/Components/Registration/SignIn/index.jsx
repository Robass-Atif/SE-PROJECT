import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import google from "../../../assets/google.svg";
import apple from "../../../assets/apple.png";
import passwordshow from "../../../assets/eye.png";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

function SignIn() {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  const handleLogin = async (e) => {
    e.preventDefault();
    const role = localStorage.getItem("role");
    const route = role === "freelancer" ? "/addservice" : "/services";

    try {
      const response = await fetch("https://backend-qyb4mybn.b4a.run/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Store the response in a variable

      if (!response.ok) {
        throw new Error(data.message || 'Login failed'); // Use the message from the server
      }
      else
      {
      console.log("Success:", data);
      navigate('/profile', { state: { user: data.data } });
      }
    } catch (error) {
      setErrorMessage(error.message); // Set error message to display
      console.error("Error:", error);
    }
  };

  const handleGoogleSignIn = async (credentialResponse) => {
    
    const { credential } = credentialResponse;
    console.log("Google sign-in response:", credential);
    try {
      const response = await fetch("https://sebackend-za96l0pv.b4a.run/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credential }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("User signed in:", data.user);
        navigate("/profile"); // Redirect to the profile page
      } else {
        console.error("Error signing in:", data.error);
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  return (
    <GoogleOAuthProvider clientId="697063750023-7nha10stlk2j37gijq3p2kvgbmpmpu9r.apps.googleusercontent.com">
      <main className="flex justify-center items-center bg-gray-50 p-4 min-h-screen">
        <form className="bg-white shadow-lg p-6 sm:p-8 rounded-lg w-full max-w-sm sm:max-w-md">
          <h3 className="mb-6 font-semibold text-black text-center text-xl sm:text-2xl">
            Log in to Your Account
          </h3>

          {/* Username or Email Field */}
          <div className="relative flex flex-col mb-4">
            <label
              htmlFor="username"
              className="mb-2 font-medium text-gray-700 text-sm sm:text-base"
            >
              Username or Email
            </label>
            <input
              type="email"
              id="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Controlled input
              placeholder="Email or phone"
              className="border-gray-300 p-3 border rounded-lg focus:ring-2 focus:ring-custom-violet w-full text-sm sm:text-base focus:outline-none"
            />
          </div>

          {/* Password Field */}
          <div className="relative flex flex-col mb-4">
            <label
              htmlFor="password"
              className="mb-2 font-medium text-gray-700 text-sm sm:text-base"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Controlled input
                placeholder="Type your password"
                className="border-gray-300 p-3 border rounded-lg focus:ring-2 focus:ring-custom-violet w-full text-sm sm:text-base focus:outline-none pr-10"
              />
              <img
                src={passwordshow}
                alt="Show password"
                className="absolute right-3 w-5 h-5 cursor-pointer"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="bg-[#5433FF] hover:bg-indigo-600 py-3 rounded-full w-full font-medium text-sm text-white sm:text-base transition duration-300"
          >
            Log In
          </button>

          <div className="flex items-center my-6 text-gray-500 text-xs sm:text-sm">
            <div className="bg-gray-300 w-full h-px"></div>
            <span className="mx-2">or</span>
            <div className="bg-gray-300 w-full h-px"></div>
          </div>
          {/* <button className="flex justify-center items-center border-gray-300 bg-white hover:bg-gray-100 mb-4 py-3 border rounded-full w-full text-gray-800 text-sm sm:text-base transition duration-300"> */}
            <GoogleLogin
              onSuccess={handleGoogleSignIn}
              onError={(error) => {
                console.error("Google sign-in failed:", error);
              }}
            />
          {/* </button> */}

          <button className="flex justify-center items-center border-gray-300 bg-white hover:bg-gray-100 mb-4 py-3 border rounded-full w-full text-gray-800 text-sm sm:text-base transition duration-300">
            <img src={apple} alt="Apple" className="mr-2 w-5 h-5" />
            Continue with Apple
          </button>

          <div className="mt-6 text-center text-gray-500 text-xs sm:text-sm">
            Don’t have an account?
            <Link to="/signup">
              <span
                className="ml-1 font-medium hover:underline"
                style={{ color: "#5433FF" }}
              >
                Sign Up now
              </span>
            </Link>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="bg-indigo-600 py-4 w-full text-white">
        <div className="mx-auto text-center container">
          <p className="text-xs sm:text-sm">
            © 2024 Your App. All rights reserved.
          </p>
        </div>
      </footer>
    </GoogleOAuthProvider>
  );
}

export default SignIn;
