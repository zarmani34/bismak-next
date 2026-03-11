"use client";

type Props = {
  message: string;
  onRetry?: () => void;
  className?: string;
};

export default function ErrorState({ message, onRetry, className }: Props) {
  return (
    <div
      className={`rounded-xl border border-primary-light/30 bg-primary-light/10 p-4 text-sm text-secondary-text ${
        className ?? ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span>{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
