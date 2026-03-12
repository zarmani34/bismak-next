type ProjectDescriptionCardProps = {
  description?: string | null;
};

export default function ProjectDescriptionCard({ description }: ProjectDescriptionCardProps) {
  return (
    <div className="rounded-xl border border-border bg-primary-light/20 p-6">
      <h2 className="text-lg font-semibold text-primary-dark mb-3">Description</h2>
      <p className="text-sm text-secondary-text">
        {description || "No description provided for this project."}
      </p>
    </div>
  );
}
