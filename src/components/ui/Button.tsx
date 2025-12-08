import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "default" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
  href?: string;
  children: React.ReactNode;
}

export function Button({
  variant = "default",
  size = "md",
  asChild = false,
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-lg font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

  const variants: Record<Variant, string> = {
    default: "bg-blue-600 hover:bg-blue-700 text-white focus-visible:outline-blue-500",
    outline:
      "border border-gray-300 hover:bg-gray-100 text-gray-800 focus-visible:outline-blue-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus-visible:outline-blue-500",
  };

  const sizes: Record<Size, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-5 py-2.5 text-lg",
  };

  const classes = cn(base, variants[variant], sizes[size], className);

  if (asChild && href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
