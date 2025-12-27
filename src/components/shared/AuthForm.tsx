"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { BookOpen, Sparkles, Eye, EyeOff } from "lucide-react";
import TeacherImages from "@/components/ui/TeacherImages";
import { cn } from "@/lib/utils";

type Field = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
};

interface AuthFormProps {
  role: "admin" | "teacher" | "parent";
  title: string;
  subtitle?: string;
  fields: Field[];
  submitLabel?: string;
  onSubmit: (values: Record<string, string>) => Promise<void>;
}

const REMEMBER_KEY_PREFIX = "auth_remember_";
const REMEMBER_EXPIRY_DAYS = 30;

const saveRememberMe = (role: string, credentials: Record<string, string>) => {
  if (typeof window === "undefined") return;
  
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + REMEMBER_EXPIRY_DAYS);
  
  const data = {
    credentials,
    expiry: expiry.getTime(),
  };
  
  try {
    localStorage.setItem(`${REMEMBER_KEY_PREFIX}${role}`, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save remember me data:", e);
  }
};

const getRememberMe = (role: string): Record<string, string> | null => {
  if (typeof window === "undefined") return null;
  
  try {
    const saved = localStorage.getItem(`${REMEMBER_KEY_PREFIX}${role}`);
    if (!saved) return null;
    
    const data = JSON.parse(saved);
    const now = new Date().getTime();
    
    if (data.expiry && now > data.expiry) {
      localStorage.removeItem(`${REMEMBER_KEY_PREFIX}${role}`);
      return null;
    }
    
    return data.credentials;
  } catch (e) {
    console.error("Failed to get remember me data:", e);
    return null;
  }
};

const clearRememberMe = (role: string) => {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(`${REMEMBER_KEY_PREFIX}${role}`);
  } catch (e) {
    console.error("Failed to clear remember me data:", e);
  }
};

export default function AuthForm({
  role,
  title,
  subtitle,
  fields,
  submitLabel = "Đăng nhập",
  onSubmit,
}: AuthFormProps) {
  const [formState, setFormState] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const isTeacher = role === "teacher";
  const isAdmin = role === "admin";
  const hasPasswordField = fields.some((field) => field.type === "password");

  useEffect(() => {
    const savedCredentials = getRememberMe(role);
    if (savedCredentials) {
      setFormState(savedCredentials);
      setRememberMe(true);
    }
  }, [role]);

  const handleChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleRememberMeChange = (checked: boolean) => {
    setRememberMe(checked);
    
    if (!checked) {
      clearRememberMe(role);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await onSubmit(formState);
      
      if (rememberMe) {
        saveRememberMe(role, formState);
      } else {
        clearRememberMe(role);
      }
    } catch (err: any) {
      setError(err?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex min-h-screen items-center justify-center px-4 py-12",
        isTeacher
          ? "bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50"
          : "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <Card
          className={cn(
            "border-2 shadow-2xl backdrop-blur-sm",
            isTeacher
              ? "border-pink-200 bg-white/90"
              : "border-slate-200 bg-white/90"
          )}
        >
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6 sm:mb-8 text-center">
              {isTeacher ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="mb-4 flex justify-center"
                >
                  <TeacherImages size={52} className="sm:h-20 sm:w-auto" />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="mb-4 flex justify-center"
                >
                  <div
                    className={cn(
                      "flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-2xl shadow-lg",
                      isAdmin
                        ? "bg-gradient-to-br from-indigo-600 to-blue-600"
                        : "bg-gradient-to-br from-blue-600 to-indigo-600"
                    )}
                  >
                    <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {isTeacher && (
                  <div className="mb-2 flex items-center justify-center gap-2">
                    <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-pink-500" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-pink-500">
                      Giáo viên
                    </p>
                  </div>
                )}
                {isAdmin && (
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-500">
                    Quản trị viên
                  </p>
                )}
                {role === "parent" && (
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-500">
                    Phụ huynh
                  </p>
                )}
                <h1
                  className={cn(
                    "text-xl sm:text-2xl font-bold",
                    isTeacher ? "bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent" : "text-slate-900"
                  )}
                >
                  {title}
                </h1>
                {subtitle && (
                  <p className={cn("mt-2 text-xs sm:text-sm", isTeacher ? "text-pink-600" : "text-slate-600")}>
                    {subtitle}
                  </p>
                )}
              </motion.div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {fields.map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="relative"
                >
                  <Input
                    name={field.name}
                    label={field.label}
                    type={field.type === "password" ? (showPassword ? "text" : "password") : field.type || "text"}
                    placeholder={field.placeholder}
                    value={formState[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    required
                    autoComplete={field.type === "password" ? "current-password" : "username"}
                  />
                  {field.type === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded cursor-pointer"
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </motion.div>
              ))}

              {hasPasswordField && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => handleRememberMeChange(e.target.checked)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label 
                      htmlFor="rememberMe" 
                      className="text-sm text-gray-700 cursor-pointer select-none hover:text-gray-900"
                    >
                      Nhớ mật khẩu
                    </label>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200"
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  type="submit"
                  className={cn(
                    "w-full font-semibold shadow-lg transition-all",
                    isTeacher
                      ? "rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 hover:shadow-xl"
                      : "rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 hover:shadow-xl"
                  )}
                  disabled={loading}
                >
                  {loading ? "Đang xử lý..." : submitLabel}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}