'use client';

export function LoadingSpinner() {
  return (
    <div className="inline-block animate-spin h-4 w-4 border-2 border-current border-t-transparent text-white rounded-full" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
}
