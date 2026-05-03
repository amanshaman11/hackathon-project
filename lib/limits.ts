export const MAX_DESCRIPTION_LENGTH = 4000;

export const RATE_LIMIT_MATCH = { windowMs: 60_000, max: 20 } as const;
export const RATE_LIMIT_PROXY = { windowMs: 60_000, max: 100 } as const;
