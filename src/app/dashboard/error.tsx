'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard Error:', error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <Card className="p-8 text-center max-w-md w-full">
        <h2 className="font-display font-bold text-2xl text-white mb-2">Dashboard Error</h2>
        <p className="text-secondary text-sm mb-6">
          Unable to load dashboard data. This might be a temporary issue.
        </p>
        <Button onClick={() => reset()} className="w-full">
          Retry
        </Button>
      </Card>
    </div>
  );
}
