"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { storeConfig } from "@/lib/store-config";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("from") || "/admin";

  const [email, setEmail] = useState("admin@maisonatelier.com");
  const [password, setPassword] = useState("AdminPassword2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorNotice("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorNotice(data.error || "Authentication failed. Access denied.");
        return;
      }

      // Successful login
      router.push(returnTo);
      router.refresh();
    } catch (err) {
      setErrorNotice("Network or server security error occurred: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block group mb-6">
          <div className="flex items-center justify-center gap-2">
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.22em] font-normal text-[#171717]">
              {storeConfig.brandName}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B58A52]" />
          </div>
          <div className="text-[9px] uppercase tracking-[0.35em] text-[#71717A] mt-1 font-semibold">
            Atelier Executive Portal
          </div>
        </Link>

        <h1 className="font-serif text-xl sm:text-2xl font-medium text-[#171717]">
          Restricted Security Checkpoint
        </h1>
        <p className="mt-1.5 text-xs text-[#71717A] max-w-sm mx-auto">
          Administrative credentials and session tokens are strictly monitored. All access attempts are cryptographically verified.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-[#E8E4DC] shadow-xl space-y-6">
          {errorNotice && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="leading-tight">{errorNotice}</div>
            </div>
          )}

          <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E8E4DC] flex items-center gap-2.5 text-[11px] text-[#71717A]">
            <ShieldCheck className="w-4 h-4 text-[#B58A52] shrink-0" />
            <span>
              Protected by Rate Limiting & HMAC-SHA256 Signed Cookies.
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1.5">
                Executive Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#FAF8F5] border border-[#E8E4DC] rounded-xl text-[#171717] focus:outline-none focus:border-[#171717]"
                  placeholder="admin@maisonatelier.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#171717] uppercase tracking-wider mb-1.5">
                Master Security Key
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A1A1AA] absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[#FAF8F5] border border-[#E8E4DC] rounded-xl text-[#171717] focus:outline-none focus:border-[#171717]"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-[#A1A1AA] hover:text-[#171717]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#171717] hover:bg-[#B58A52] text-white text-xs uppercase tracking-[0.2em] font-bold rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating Session...</span>
                ) : (
                  <>
                    <span>Authenticate & Access Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="pt-4 border-t border-[#F0ECE3] text-center text-[11px] text-[#A1A1AA] flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#B58A52]" />
            <span>Maison Atelier Security Architecture v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#B58A52] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
