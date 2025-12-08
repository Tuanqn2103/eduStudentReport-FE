export default function SectionWrapper({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`container mx-auto px-4 py-16 ${className}`}>
      {children}
    </section>
  );
}
