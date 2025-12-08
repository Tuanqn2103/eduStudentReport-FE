export default function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-10">
      <h2 className="text-3xl font-bold text-black">{title}</h2>
      {subtitle && <p className="text-black mt-2 text-lg">{subtitle}</p>}
    </div>
  );
}
