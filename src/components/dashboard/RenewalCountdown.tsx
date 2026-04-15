'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { Skeleton } from '@/components/ui/Skeleton';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';

export const RenewalCountdown = () => {
  const { daysRemaining, isActive, loading } = useSubscription();

  if (loading) return <Skeleton className="h-32 w-full rounded-2xl" />;
  if (!isActive) return null;

  const isUrgent = daysRemaining <= 7;
  const progressPercent = Math.max(0, Math.min(100, (daysRemaining / 30) * 100)); // normalized to 30 days scale visually

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-display font-semibold text-white">Time Remaining</h4>
        <span className={`font-bold font-display text-xl ${isUrgent ? 'text-danger' : 'text-primary'}`}>
          {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
        </span>
      </div>
      
      <div className="progress-bar mb-4">
        <div 
          className={`progress-bar-fill ${isUrgent ? (daysRemaining <= 1 ? 'progress-bar-fill-danger' : 'progress-bar-fill-warning') : ''}`} 
          style={{ width: `${progressPercent}%` }} 
        />
      </div>

      {isUrgent && (
        <p className="text-sm text-secondary mb-4">
          Your access is expiring soon. Renew now to avoid losing access to live signals.
        </p>
      )}

      {isUrgent && (
        <Link href="/pricing" className="btn w-full justify-center btn-primary">
          Renew Subscription
        </Link>
      )}
    </Card>
  );
};
