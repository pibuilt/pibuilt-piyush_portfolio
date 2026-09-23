import { describe, expect, it } from 'vitest';
import { createRouteGuard } from './routeGuard';

describe('route guard', () => {
  it('invalidates an older walk when a new destination starts', () => {
    const guard = createRouteGuard();
    const first = guard.begin();
    const second = guard.begin();

    expect(guard.isActive(first)).toBe(false);
    expect(guard.isActive(second)).toBe(true);
  });

  it('invalidates the active walk when cancelled', () => {
    const guard = createRouteGuard();
    const route = guard.begin();
    guard.cancel();

    expect(guard.isActive(route)).toBe(false);
  });
});
