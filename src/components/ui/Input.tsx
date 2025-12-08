import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      {label && <span className="font-semibold text-slate-700">{label}</span>}
      <input
        className={cn(
          "w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm transition-all duration-200 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:shadow-md",
          error && "border-red-300 focus:border-red-500 focus:ring-red-100",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
    </label>
  );
}

