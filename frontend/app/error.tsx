'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Image from 'next/image';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="h-[100dvh] w-full flex flex-col items-center justify-center space-y-4">
      <Image src="/error.svg" height="300" width="300" alt="Error" />
      <h2 className="text-xl font-medium">Something went wrong!</h2>
      <p>Error message: {error.message}</p>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </div>
  );
}