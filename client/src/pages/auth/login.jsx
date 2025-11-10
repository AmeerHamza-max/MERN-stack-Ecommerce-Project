import React, { useState } from "react";
import { CommonForm } from "../../components/common/form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/auth-slice";
import { useToast } from "@/hooks/use-toast";

const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

const initialState = { email: "", password: "" };

const AuthLogin = () => {
  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data) => {
    setSubmitting(true);

    try {
      const resultAction = await dispatch(loginUser(data));

      if (loginUser.fulfilled.match(resultAction)) {
        const payload = resultAction.payload;

        if (payload?.success) {
          toast({ title: payload.message });

          // Redirect based on role
          if (payload.user?.role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/shop/home");
          }
        } else {
          toast({ title: payload.message || "Login failed", variant: "destructive" });
        }
      } else {
        toast({ title: resultAction.payload || "Login failed", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Unexpected error occurred", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-md border border-neutral-700 rounded-2xl p-8 shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-amber-400">Welcome Back</h1>
        <p className="text-gray-400 mt-2 text-sm">
          Don’t have an account?{" "}
          <Link to="/auth/register" className="text-amber-400 hover:text-amber-300 underline">
            Register
          </Link>
        </p>
      </div>

      {/* Login Form */}
      <CommonForm
        formControls={loginFormControls}
        formData={formData}
        setFormData={setFormData}
        buttonText={submitting ? "Signing In..." : "Sign In"}
        onSubmit={handleSubmit} // Pass handleSubmit directly
      />
    </div>
  );
};

export default AuthLogin;
