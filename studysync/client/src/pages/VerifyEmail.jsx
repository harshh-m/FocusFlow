import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState({
    loading: true,
    success: false,
    message: "Verifying your email...",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus({
          loading: false,
          success: false,
          message: "Verification token is missing.",
        });
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/auth/verify-email",
          {
            params: { token },
          }
        );

        setStatus({
          loading: false,
          success: true,
          message:
            res.data.message ||
            "Email verified successfully.",
        });
      } catch (error) {
        setStatus({
          loading: false,
          success: false,
          message:
            error?.response?.data?.message ||
            "Verification failed.",
        });
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#0b1020] flex items-center justify-center text-white px-4">
      <div className="max-w-md w-full bg-[#121a2f] p-8 rounded-3xl border border-white/10 text-center">
        <h1 className="text-3xl font-bold mb-4">Email Verification</h1>
        <p className="text-gray-300 mb-6">{status.message}</p>
        {!status.loading && (
          <button
            onClick={() => navigate("/signin")}
            className="bg-indigo-500 hover:bg-indigo-600 px-6 py-3 rounded-xl font-semibold"
          >
            Go to Sign In
          </button>
        )}
      </div>
    </div>
  );
}
