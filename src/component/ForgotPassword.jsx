import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router";


const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  
  const handleSendOtp = async () => {
    try {
      await axios.post(BASE_URL + "/forgotpassword", { emailId: email }, { withCredentials: true });
      setStep(2); 
      setSuccess("OTP sent to your email.");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  };

 
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
    
    <div className="flex items-center justify-center min-h-screen bg-orange-50 p-4">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* LEFT SIDE */}
        <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-orange-400 to-red-500">
          <img
            src="/Resetpassword.png"
            alt="forgot password"
            className="w-full h-full object-contain p-5"
          />
         
        </div>

        {/* RIGHT SIDE */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-8">
          <div 
            className="w-full max-w-sm"
          >
            <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">
              {step === 1 ? "Forgot Password" : "Reset Password"}
            </h2>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {success && <p className="text-green-500 text-sm text-center">{success}</p>}

            {step === 1 ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-orange-600">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:border-orange-500 focus:outline-none"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                 onClick={handleSendOtp}
                  className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-md font-semibold hover:opacity-90"
                >
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-orange-600">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:border-orange-500 focus:outline-none"
                    placeholder="Enter the OTP"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-orange-600">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:border-orange-500 focus:outline-none"
                    placeholder="Enter new password"
                  />
                </div>

                <button
                  onClick={handleResetPassword}
                  className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-md font-semibold hover:opacity-90"
                >
                  Reset Password
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;



// <div className="flex flex-col items-center justify-center min-h-screen">
    //   <div className="w-96 p-8 bg-orange-100 rounded-xl shadow-xl">
    //     <h2 className="text-center text-2xl font-bold text-orange-600">
    //       {step === 1 ? "Forgot Password" : "Reset Password"}
    //     </h2>

    //     {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    //     {success && <p className="text-green-500 text-sm text-center">{success}</p>}

    //     {step === 1 ? (
    //       <div className="mt-6">
    //         <label className="block text-sm font-medium text-gray-500">Email Address</label>
    //         <input
    //           type="email"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //           required
    //           className="w-full mt-2 rounded-md bg-orange-200 px-3 py-1.5 text-gray-900 focus:outline-orange-600"
    //         />
    //         <button
    //           onClick={handleSendOtp}
    //           className="w-full mt-4 bg-orange-600 text-white py-2 rounded-md hover:bg-orange-500"
    //         >
    //           Send OTP
    //         </button>
    //       </div>
    //     ) : (
    //       <div className="mt-6 space-y-4">
    //         <label className="block text-sm font-medium text-orange-500">Enter OTP</label>
    //         <input
    //           type="text"
    //           value={otp}
    //           onChange={(e) => setOtp(e.target.value)}
    //           className="w-full rounded-md bg-orange-200 px-3 py-1.5 text-gray-900 focus:outline-orange-600"
    //         />

    //         <label className="block text-sm font-medium text-orange-500">New Password</label>
    //         <input
    //           type="password"
    //           value={newPassword}
    //           onChange={(e) => setNewPassword(e.target.value)}
    //           className="w-full rounded-md bg-orange-200 px-3 py-1.5 text-gray-900 focus:outline-orange-600"
    //         />

    //         <button
    //           onClick={handleResetPassword}
    //           className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-500"
    //         >
    //           Reset Password
    //         </button>
    //       </div>
    //     )}
    //   </div>
    // </div>