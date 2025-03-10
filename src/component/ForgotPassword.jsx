import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP & new password
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // Send OTP to email
  const handleSendOtp = async () => {
    try {
      await axios.post(BASE_URL + "/forgotpassword", { emailId: email }, { withCredentials: true });
      setStep(2); // Move to OTP step
      setSuccess("OTP sent to your email.");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };

  // Verify OTP & Reset Password
  const handleResetPassword = async () => {
    try {
      await axios.post(BASE_URL + "/resetpassword", { emailId: email, otp, newPassword },{ withCredentials: true });
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="w-96 p-8 bg-gray-800 rounded-xl shadow-xl">
        <h2 className="text-center text-2xl font-bold text-indigo-600">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}

        {step === 1 ? (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-500">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-2 rounded-md bg-gray-400 px-3 py-1.5 text-gray-900 focus:outline-indigo-600"
            />
            <button
              onClick={handleSendOtp}
              className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500"
            >
              Send OTP
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-gray-500">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-md bg-gray-400 px-3 py-1.5 text-gray-900 focus:outline-indigo-600"
            />

            <label className="block text-sm font-medium text-gray-500">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-md bg-gray-400 px-3 py-1.5 text-gray-900 focus:outline-indigo-600"
            />

            <button
              onClick={handleResetPassword}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-500"
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
