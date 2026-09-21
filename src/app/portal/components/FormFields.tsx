export function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-secondary-text">{label}</label>
      <div className="mt-1">{children}</div>
      {error && <p className="text-xs text-secondary-light mt-1">{error}</p>}
    </div>
  );
}