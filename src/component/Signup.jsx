import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { BASE_URL } from "../utils/constants";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

 
  const navigate = useNavigate();

  // Handle Signup and OTP Sending
  const handleSignup = async () => {
    try {
      await axios.post(
        BASE_URL + "/signup",
        { firstName, lastName, email, password },
        { withCredentials: true }
      );
      alert("OTP sent to your email. Please verify.");
      setShowOtpInput(true);
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
      console.error(err);
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/verify",
        { email, otp },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data)); // Add user to redux store
      navigate("/profile"); // Redirect after successful verification
    } catch (err) {
      setError(err?.response?.data || "Invalid OTP");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="w-96 p-8 bg-gray-800 rounded-xl shadow-xl">
        <h2 className="text-center text-2xl font-bold text-indigo-600">
          {showOtpInput ? "Verify OTP" : "Create an Account"}
        </h2>

        <div className="mt-6">
          {!showOtpInput ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full mt-2 rounded-md bg-gray-400 px-3 py-1.5 text-gray-900 focus:outline-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full mt-2 rounded-md bg-gray-400 px-3 py-1.5 text-gray-900 focus:outline-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mt-2 rounded-md bg-gray-400 px-3 py-1.5 text-gray-900 focus:outline-indigo-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-2 rounded-md bg-gray-400 px-3 py-1.5 text-gray-900 focus:outline-indigo-600"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                onClick={handleSignup}
                className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500"
              >
                Sign Up
              </button>

              <p className="mt-4 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
                  Log in
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full mt-2 rounded-md bg-gray-400 px-3 py-1.5 text-gray-900 focus:outline-indigo-600"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                onClick={handleVerifyOtp}
                className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-500"
              >
                Verify OTP
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;

