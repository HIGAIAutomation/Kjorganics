"use client";
import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LogoImg from "../../utils/KJ_Organics_Logo.png";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/login", {
        phone,
        password,
      });

      console.log("Login success:", response.data);
      // Redirect or store tokens if needed
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Header />
      <div className="w-full min-h-screen flex items-center justify-center bg-emerald-50 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm  rounded-xl shadow-lg p-6 md:p-8 border bg-green-700 "
        >
          <div className="flex flex-col items-center mb-6">
            <Image src={LogoImg} alt="Company Logo" width={100} height={100} />
            <h2 className="text-xl md:text-2xl font-semibold text-white ">
              Login Page
            </h2>
          </div>

          <div className="mb-4">
            <label className="block text-lg text-white mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="w-full border border-lime-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg text-white mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-lime-500 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-300"
            />
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full bg-emerald-800 text-white py-2 rounded hover:bg-emerald-900 transition"
          >
            Login
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Login;
