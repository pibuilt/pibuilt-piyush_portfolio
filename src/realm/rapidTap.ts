export type RapidTapResult = {
  timestamps: number[];
  triggered: boolean;
};

export function recordRapidTap(
  timestamps: number[],
  now: number,
  windowMs = 2000,
  allowedTapCount = 3,
): RapidTapResult {
  const recentTaps = [...timestamps.filter((timestamp) => timestamp > now - windowMs), now];
  const triggered = recentTaps.length > allowedTapCount;

  return {
    timestamps: triggered ? [] : recentTaps,
    triggered,
  };
}
