export type RouteGuard = {
  begin: () => number;
  cancel: () => void;
  isActive: (routeId: number) => boolean;
};

export function createRouteGuard(): RouteGuard {
  let activeRouteId = 0;

  return {
    begin: () => {
      activeRouteId += 1;
      return activeRouteId;
    },
    cancel: () => {
      activeRouteId += 1;
    },
    isActive: (routeId) => routeId === activeRouteId,
  };
}
