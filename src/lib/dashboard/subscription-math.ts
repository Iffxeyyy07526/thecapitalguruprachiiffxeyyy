const MS_PER_DAY = 86_400_000;

export function subscriptionDayMetrics(start: string, end: string) {
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  const now = Date.now();
  const totalDays = Math.max(1, Math.ceil((endMs - startMs) / MS_PER_DAY));
  const rawRemaining = Math.ceil((endMs - now) / MS_PER_DAY);
  const daysRemaining = Math.max(0, rawRemaining);
  /** Bar fill: fraction of the full plan length still remaining */
  const progressRatio = Math.min(1, Math.max(0, daysRemaining / totalDays));
  return { totalDays, daysRemaining, progressRatio };
}
