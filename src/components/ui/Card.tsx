import React from "react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-xl border bg-white p-4 shadow-sm", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("mb-3", className)}>{children}</div>;
}

export function CardTitle({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-lg font-semibold text-gray-900", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ 
  children, 
  className 
}: { 
  children: React.ReactNode;
  className?: string;
}) {
  return <p className={cn("text-gray-600", className)}>{children}</p>;
}

export function CardContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("mt-4 text-gray-700", className)}>{children}</div>;
}