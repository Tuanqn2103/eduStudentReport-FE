export function SectionTitle({ title, subtitle }: any) {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="text-gray-500 mt-2">{subtitle}</p>
    </div>
  );
}
