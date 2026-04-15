'use client';

import { useSubscription } from '@/hooks/useSubscription';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/dates';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export const SubscriptionCard = () => {
  const { subscription, loading, isActive, telegramLink } = useSubscription();

  if (loading) {
    return <Skeleton className="h-56 w-full max-w-lg rounded-lg" />;
  }

  if (!isActive || !subscription) {
    return (
      <Card className="p-8 max-w-lg bg-black/[0.02] border-white/[0.05] rounded-lg">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="font-display text-lg font-bold text-white mb-2 uppercase tracking-tight">Membership Status</h3>
            <Badge variant="danger" className="rounded-sm px-2">INACTIVE</Badge>
          </div>
        </div>
        <p className="text-on-surface-muted text-sm leading-relaxed mb-8">
          No active plan detected. Select a trading plan to start receiving live signals.
        </p>
        <Link href="/pricing" className="block">
           <Button fullWidth size="lg" className="font-bold py-4 rounded-lg">
             Select a Plan
           </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="p-8 max-w-lg border-primary/30 bg-black/[0.02] rounded-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <svg className="w-16 h-16 text-primary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
        </svg>
      </div>

      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="font-display text-lg font-bold text-white mb-2 uppercase tracking-tight">{subscription.plan?.name || 'Active Membership'}</h3>
          <Badge variant="success" className="px-2 py-0.5 rounded-sm">ACTIVE PLAN</Badge>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-on-surface-muted uppercase tracking-[0.2em] mb-1 font-mono">Expires On</p>
          <p className="font-bold text-white font-mono text-sm">{formatDate(subscription.end_date)}</p>
        </div>
      </div>
      
      {telegramLink && (
        <a href={telegramLink} target="_blank" rel="noreferrer" className="block mb-6">
          <Button variant="ghost" fullWidth size="lg" className="border-primary/20 hover:bg-primary/5 hover:border-primary/40 rounded-lg">
            Join Telegram Group
          </Button>
        </a>
      )}
      
      <div className="flex items-center justify-between pt-6 border-t border-white/[0.05]">
         <span className="text-[9px] font-bold text-on-surface-muted uppercase tracking-widest font-mono">ID: {subscription.id.slice(0,8).toUpperCase()}</span>
         <span className="text-[9px] font-bold text-on-surface-muted uppercase tracking-widest font-mono">Started: {formatDate(subscription.start_date)}</span>
      </div>
    </Card>
  );
};
