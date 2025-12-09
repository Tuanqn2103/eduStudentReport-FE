import type { ReactNode } from "react";

export default function SectionWrapper({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`container mx-auto px-4 py-16 ${className}`}>
      {children}
    </section>
  );
}
