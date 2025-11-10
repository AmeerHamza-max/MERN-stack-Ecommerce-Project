import React, { useState } from "react";
import { CommonForm } from "../../components/common/form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/auth-slice";
import { useToast } from "@/hooks/use-toast";

const registerFormControls = [
  { name: "userName", label: "Username", placeholder: "Enter your username", componentType: "input" },
  { name: "email", label: "Email", placeholder: "Enter your email", componentType: "input", type: "email" },
  { name: "password", label: "Password", placeholder: "Enter your password", componentType: "input", type: "password" },
];

const initialState = { userName: "", email: "", password: "" };

const AuthRegister = () => {
  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      const payload = await dispatch(registerUser(data)).unwrap();

      if (payload?.success) {
        toast({ title: payload.message });
        navigate("/auth/login");
      } else {
        toast({ title: payload.message || "Registration failed", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: error?.message || "Registration failed", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-md border border-neutral-700 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-amber-400">Create Account</h1>
        <p className="text-gray-400 mt-2 text-sm">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-amber-400 hover:text-amber-300 underline">
            Login
          </Link>
        </p>
      </div>

      <CommonForm
        formControls={registerFormControls}
        formData={formData}
        setFormData={setFormData}
        buttonText={submitting ? "Signing Up..." : "Sign Up"}
        showButton
        onSubmit={handleSubmit} // Use CommonForm's onSubmit directly
      />
    </div>
  );
};

export default AuthRegister;
