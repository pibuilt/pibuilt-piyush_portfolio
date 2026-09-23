export type GridPoint = {
  col: number;
  row: number;
};

export type GridBounds = {
  width: number;
  height: number;
};

export const pointKey = ({ col, row }: GridPoint) => `${col},${row}`;

export const pointsEqual = (left: GridPoint, right: GridPoint) =>
  left.col === right.col && left.row === right.row;

export const isInsideGrid = (point: GridPoint, bounds: GridBounds) =>
  point.col >= 0 && point.col < bounds.width && point.row >= 0 && point.row < bounds.height;

const neighborOffsets: GridPoint[] = [
  { col: 0, row: 1 },
  { col: 1, row: 0 },
  { col: -1, row: 0 },
  { col: 0, row: -1 },
];

export function findPath(
  start: GridPoint,
  target: GridPoint,
  blocked: ReadonlySet<string>,
  bounds: GridBounds,
): GridPoint[] | null {
  if (!isInsideGrid(start, bounds) || !isInsideGrid(target, bounds) || blocked.has(pointKey(target))) {
    return null;
  }

  if (pointsEqual(start, target)) {
    return [];
  }

  const queue: GridPoint[] = [start];
  let queueIndex = 0;
  const visited = new Set<string>([pointKey(start)]);
  const previous = new Map<string, GridPoint>();

  while (queueIndex < queue.length) {
    const current = queue[queueIndex++];

    for (const offset of neighborOffsets) {
      const next = { col: current.col + offset.col, row: current.row + offset.row };
      const nextKey = pointKey(next);

      if (!isInsideGrid(next, bounds) || blocked.has(nextKey) || visited.has(nextKey)) {
        continue;
      }

      visited.add(nextKey);
      previous.set(nextKey, current);

      if (pointsEqual(next, target)) {
        const path: GridPoint[] = [next];
        let cursor = current;

        while (!pointsEqual(cursor, start)) {
          path.push(cursor);
          cursor = previous.get(pointKey(cursor)) as GridPoint;
        }

        return path.reverse();
      }

      queue.push(next);
    }
  }

  return null;
}

export function findNearestReachableAdjacent(
  start: GridPoint,
  objectPosition: GridPoint,
  blocked: ReadonlySet<string>,
  bounds: GridBounds,
): { target: GridPoint; path: GridPoint[] } | null {
  return neighborOffsets
    .map((offset) => ({
      col: objectPosition.col + offset.col,
      row: objectPosition.row + offset.row,
    }))
    .filter((candidate) => isInsideGrid(candidate, bounds) && !blocked.has(pointKey(candidate)))
    .map((target) => ({ target, path: findPath(start, target, blocked, bounds) }))
    .filter((result): result is { target: GridPoint; path: GridPoint[] } => result.path !== null)
    .sort((left, right) => left.path.length - right.path.length)[0] ?? null;
}
