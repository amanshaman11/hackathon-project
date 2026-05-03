import { NextResponse } from 'next/server';
import { RATE_LIMIT_MATCH, RATE_LIMIT_PROXY } from '@/lib/limits';

type LimitKind = 'match' | 'proxy';

const buckets = new Map<string, { count: number; windowStart: number }>();

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return 'unknown';
}

function config(kind: LimitKind) {
  return kind === 'match' ? RATE_LIMIT_MATCH : RATE_LIMIT_PROXY;
}

export function rateLimitResponse(
  request: Request,
  kind: LimitKind,
): NextResponse | null {
  const { windowMs, max } = config(kind);
  const key = `${kind}:${getClientIp(request)}`;
  const now = Date.now();
  let entry = buckets.get(key);

  if (!entry || now - entry.windowStart >= windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return null;
  }

  if (entry.count >= max) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((windowMs - (now - entry.windowStart)) / 1000),
    );
    return NextResponse.json(
      { error: 'Too many requests. Please try again in a moment.' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfterSec) },
      },
    );
  }

  entry.count += 1;
  buckets.set(key, entry);
  return null;
}
