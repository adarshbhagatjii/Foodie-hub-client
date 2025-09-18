import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router'; 
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';


const Login = ({setUser, user}) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("dummy123@gmail.com"); 
  const [password, setPassword] = useState("Dummy@123");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(""); 

    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId: email, password: password },
        { withCredentials: true }
      );
      
      

      if (res.data.success) {
        const userData = {
          _id: res.data.user._id,
          name: res.data.user.name,
          emailId: res.data.user.emailId,
          role: res.data.user.role,
          imageUrl:res.data.user.imageUrl,
        };

        
         localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", res.data.token);

        setUser(userData);

        

        navigate("/"); 
      }
    } catch (err) {
      console.error("Login Error:", err?.response?.data); 
      setError(err?.response?.data?.message || err?.response?.data?.error || "Something went wrong!");
    }
  };

  return (
      <div className="flex items-center justify-center min-h-screen bg-orange-50 p-4">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* LEFT SIDE */}
        <div className="hidden md:flex md:w-1/2 relative bg-gradient-to-br from-orange-400 to-red-500">
          <img
            // src="https://illustrations.popsy.co/gray/online-shopping.svg"
            src="/login1.png"
            alt="welcome"
            className="w-full h-full object-contain p-5"
          />
          
        </div>

        {/* RIGHT SIDE */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">
              Sign in
            </h2>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-orange-600">
                Enter email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-3 border-gray-300 focus:border-orange-500 focus:outline-none rounded-lg py-2 pr-8 bg-gray-50"
                  placeholder="you@example.com"
                />
                <span className="absolute right-2 top-2 text-gray-400">📧</span>
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-orange-600">
                Enter password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-3 rounded-lg border-gray-300 focus:border-orange-500 focus:outline-none py-2 pr-8 bg-gray-50"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-2 text-gray-400"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between mb-6 text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded" /> Remember me
              </label>
              <Link
                to="/forgotPassword"
                className="text-orange-500 font-medium hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Sign in button */}
            <button
               type="button" 
                onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white font-semibold rounded-md py-2 shadow"
            >
              Sign in
            </button>

            {/* Register link */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-orange-500 hover:underline font-medium"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Login;
