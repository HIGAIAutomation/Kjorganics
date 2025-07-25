"use client";

import { useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schema
const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(5, "Minimum 5 characters")
    .max(50, "Maximum 50 characters"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]{10,15}$/, "Phone must be 10-15 digits"),
  address: yup
    .string()
    .optional()
    .min(10, "Minimum 10 characters")
    .max(100, "Maximum 100 characters"),
  email: yup.string().email("Enter valid email").optional(),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Minimum 6 characters"),
});

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const onSubmit = async (data: any) => {
    setLoading(true);
    setServerMessage("");
    try {
      const res = await axiosInstance.post("/register", data);
      setServerMessage("Registered successfully!");
      reset();
    } catch (err: any) {
      console.error(err);
      setServerMessage(
        err.response?.data?.message || "Registration failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen bg-[#f9f9f6] px-4">
        <div className="w-full max-w-lg p-6 bg-white shadow-md rounded-md mt-6 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-green-800">Create an Account</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block font-medium">Name</label>
              <input {...register("name")} className="input" />
              <p className="text-red-600 text-sm">{errors.name?.message}</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block font-medium">Phone</label>
              <input {...register("phone")} className="input" />
              <p className="text-red-600 text-sm">{errors.phone?.message}</p>
            </div>

            {/* Address */}
            <div>
              <label className="block font-medium">Address</label>
              <input {...register("address")} className="input" />
              <p className="text-red-600 text-sm">{errors.address?.message}</p>
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium">Email</label>
              <input {...register("email")} className="input" />
              <p className="text-red-600 text-sm">{errors.email?.message}</p>
            </div>

            {/* Password */}
            <div>
              <label className="block font-medium">Password</label>
              <input type="password" {...register("password")} className="input" />
              <p className="text-red-600 text-sm">{errors.password?.message}</p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A5724] text-white py-2 rounded hover:bg-[#154a1e] transition-colors"
              disabled={loading}
            >
              {loading ? "Registering..." : "REGISTER"}
            </button>
          </form>

          {serverMessage && (
            <p className="mt-4 text-center text-sm text-gray-700">{serverMessage}</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
