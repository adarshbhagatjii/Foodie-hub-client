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
    <div className='flex items-center justify-center h-screen w-full  '>
      <div className="flex h-auto w-96 flex-col justify-center px-6 py-12 lg:px-8 bg-orange-100 rounded-xl shadow-xl">
        <h2 className="text-center text-2xl font-bold tracking-tight text-orange-600">
          Login to your account
        </h2>

        <div className="m-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-orange-500">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md border border-gray-900 bg-gray-100 px-3 py-2 text-gray-900 shadow-sm focus:outline-2 focus:outline-red-600 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-orange-500">
                  Password
                </label>
                <div className="text-sm">
                  <Link to='/forgotPassword' className="font-semibold text-orange-500 hover:text-orange-600">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-md border border-gray-900 bg-gray-100 px-3 py-2 text-gray-900 shadow-sm focus:outline-2 focus:outline-orange-600 sm:text-sm"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-orange-500"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <p className="text-red-500 text-sm">{error}</p>

            <div>
              <button
                type="button" 
                onClick={handleSubmit}
                className="flex w-full justify-center rounded-md bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                Login
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-orange-500">
            Don't have an Account?{' '}
            <Link to="/signup" className="font-semibold text-orange-500 hover:text-orange-600">
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
