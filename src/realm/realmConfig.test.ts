import { describe, expect, it } from 'vitest';
import {
  PLAYER_START,
  REALM_HEIGHT,
  REALM_WIDTH,
  realmDecorations,
  realmExit,
  realmJournalObjects,
  realmMap,
  realmObjects,
  realmProps,
} from './realmConfig';
import { findNearestReachableAdjacent, pointKey } from './pathfinding';

describe('realm configuration', () => {
  it('defines a complete 20 by 16 map', () => {
    expect(realmMap).toHaveLength(REALM_HEIGHT);
    realmMap.forEach((row) => expect(row).toHaveLength(REALM_WIDTH));
  });

  it('keeps movement-blocking objects on unique cells', () => {
    const occupied = [...realmObjects, ...realmDecorations]
      .filter((object) => object.blocksMovement !== false)
      .map((object) => pointKey(object.position));

    expect(new Set(occupied).size).toBe(occupied.length);
  });

  it('makes every object reachable from the player spawn', () => {
    const blocked = new Set(
      [...realmObjects, ...realmDecorations]
        .filter((object) => object.blocksMovement !== false)
        .map((object) => pointKey(object.position)),
    );

    realmObjects.forEach((object) => {
      const route = findNearestReachableAdjacent(
        PLAYER_START,
        object.position,
        blocked,
        { width: REALM_WIDTH, height: REALM_HEIGHT },
      );
      expect(route, object.label).not.toBeNull();
    });
  });

  it('gives every optional encounter evolving dialogue', () => {
    realmProps.forEach((prop) => expect(prop.messages.length, prop.label).toBeGreaterThanOrEqual(2));
  });

  it('journals every visible interactive object except the Return Gate', () => {
    expect(realmDecorations).toHaveLength(0);
    expect(realmJournalObjects).toEqual(realmObjects.filter((object) => object.kind !== 'exit'));
    expect(realmJournalObjects.some((object) => object.id === realmExit.id)).toBe(false);
  });
});
