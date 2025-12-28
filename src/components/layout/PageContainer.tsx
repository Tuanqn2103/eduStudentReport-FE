import React from "react";

export default function PageContainer({
  title,
  subtitle,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-screen bg-white-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-10">
        {(title || subtitle) && (
          <div className="mb-5 sm:mb-6">
            {title && (
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#000000] leading-snug">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}
