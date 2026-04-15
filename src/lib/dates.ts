export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateLong(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getDaysRemaining(endDateString: string): number {
  const endDate = new Date(endDateString).getTime();
  const now = Date.now();
  const diffTime = endDate - now;
  if (diffTime <= 0) return 0;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isExpired(endDateString: string): boolean {
  return getDaysRemaining(endDateString) <= 0;
}

export function isExpiringSoon(endDateString: string, daysThreshold: number = 7): boolean {
  const remaining = getDaysRemaining(endDateString);
  return remaining > 0 && remaining <= daysThreshold;
}
