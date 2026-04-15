const rateLimitCache = new Map();

export function rateLimit(ip: string, limit: number, windowMs: number) {
  const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
  const key = `${ip}_${windowStart}`;

  let requestCount = rateLimitCache.get(key) || 0;
  
  if (requestCount >= limit) {
    return false;
  }
  
  rateLimitCache.set(key, requestCount + 1);
  
  // Cleanup old keys occasionally
  if (Math.random() < 0.05) {
    for (const [k] of Array.from(rateLimitCache.entries())) {
      const parts = k.split('_');
      const timestamp = parts[1];
      if (Date.now() - parseInt(timestamp) > windowMs) {
        rateLimitCache.delete(k);
      }
    }
  }

  return true;
}

export function getClientIp(request: Request): string {
  const fallback = '127.0.0.1';
  return request.headers.get('x-forwarded-for')?.split(',')[0] || 
         request.headers.get('x-real-ip') || 
         fallback;
}
