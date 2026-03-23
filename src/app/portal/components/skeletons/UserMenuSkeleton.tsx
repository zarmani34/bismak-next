"use client";

type Props = {
  showDetails?: boolean;
};

export default function UserMenuSkeleton({ showDetails = true }: Props) {
  return (
    <div className="relative flex items-center space-x-2 animate-pulse">
      <div className="rounded-lg p-1 md:px-2 md:py-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary-light/30" />
          {showDetails ? (
            <div className="hidden md:block space-y-1">
              <div className="h-3 w-24 rounded bg-primary-light/30" />
              <div className="h-3 w-16 rounded bg-primary-light/20" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
