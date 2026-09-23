import { describe, expect, it } from 'vitest';
import { findNearestReachableAdjacent, findPath, pointKey } from './pathfinding';

const bounds = { width: 5, height: 5 };

describe('findPath', () => {
  it('returns a four-direction route around blocked cells', () => {
    const blocked = new Set(['1,0', '1,1', '1,2']);
    const path = findPath({ col: 0, row: 0 }, { col: 2, row: 0 }, blocked, bounds);

    expect(path).not.toBeNull();
    expect(path?.[path.length - 1]).toEqual({ col: 2, row: 0 });
    expect(path?.some((point) => blocked.has(pointKey(point)))).toBe(false);
  });

  it('rejects blocked and unreachable destinations', () => {
    expect(findPath({ col: 0, row: 0 }, { col: 1, row: 0 }, new Set(['1,0']), bounds)).toBeNull();
    expect(
      findPath(
        { col: 0, row: 0 },
        { col: 4, row: 4 },
        new Set(['0,1', '1,0']),
        bounds,
      ),
    ).toBeNull();
  });
});

describe('findNearestReachableAdjacent', () => {
  it('chooses the shortest reachable free tile beside an object', () => {
    const object = { col: 2, row: 2 };
    const blocked = new Set([pointKey(object), '2,3']);
    const result = findNearestReachableAdjacent({ col: 0, row: 2 }, object, blocked, bounds);

    expect(result?.target).toEqual({ col: 1, row: 2 });
    expect(result?.path[result.path.length - 1]).toEqual({ col: 1, row: 2 });
  });

  it('returns null when every adjacent tile is blocked', () => {
    const blocked = new Set(['2,2', '2,3', '3,2', '1,2', '2,1']);
    expect(findNearestReachableAdjacent({ col: 0, row: 0 }, { col: 2, row: 2 }, blocked, bounds)).toBeNull();
  });
});
