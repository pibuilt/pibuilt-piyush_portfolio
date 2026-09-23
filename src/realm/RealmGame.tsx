import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react';
import {
  PLAYER_START,
  REALM_HEIGHT,
  REALM_WIDTH,
  TILE_SIZE,
  knightAsset,
  realmDecorations,
  realmMap,
  realmObjects,
  realmZones,
  tileAssets,
} from './realmConfig';
import type {
  LandmarkEffect,
  RealmLandmark,
  RealmObject,
  RealmProp,
  SpriteSheetCrop,
} from './realmConfig';
import { findNearestReachableAdjacent, findPath, pointKey } from './pathfinding';
import type { GridPoint } from './pathfinding';
import { createRouteGuard } from './routeGuard';
import './realm.css';

type RealmGameProps = {
  onExit: () => void;
};

const bounds = { width: REALM_WIDTH, height: REALM_HEIGHT };
const mapWidth = REALM_WIDTH * TILE_SIZE;
const mapHeight = REALM_HEIGHT * TILE_SIZE;
const stepDurationMs = 145;
const discoverableObjects = realmObjects.filter((object) => object.kind !== 'exit');
const offDutySequence = ['comic-crate', 'fragrance-bush', 'open-model-rock'];
const labelledObjectIds = new Set(['project-forge', 'keyloop-hq', 'systems-lab', 'return-gate']);

type ActiveDialog = {
  object: RealmLandmark | RealmProp;
  message?: string;
};

const wait = (duration: number) => new Promise<void>((resolve) => window.setTimeout(resolve, duration));

export function RealmGame({ onExit }: RealmGameProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<GridPoint>(PLAYER_START);
  const routeGuardRef = useRef(createRouteGuard());
  const rejectTimerRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);
  const achievementTimerRef = useRef<number | null>(null);
  const hasCenteredRef = useRef(false);
  const discoveredRef = useRef(new Set<string>());
  const conversationCountsRef = useRef<Record<string, number>>({});
  const interactionTrailRef = useRef<string[]>([]);
  const unlockedSecretsRef = useRef(new Set<string>());

  const [player, setPlayer] = useState<GridPoint>(PLAYER_START);
  const [scale, setScale] = useState(1);
  const [walking, setWalking] = useState(false);
  const [walkFrame, setWalkFrame] = useState(7);
  const [facingRight, setFacingRight] = useState(false);
  const [target, setTarget] = useState<GridPoint | null>(null);
  const [rejectedTarget, setRejectedTarget] = useState<GridPoint | null>(null);
  const [activeDialog, setActiveDialog] = useState<ActiveDialog | null>(null);
  const [discovered, setDiscovered] = useState(new Set<string>());
  const [unlockedSecrets, setUnlockedSecrets] = useState(new Set<string>());
  const [journalOpen, setJournalOpen] = useState(false);
  const [achievement, setAchievement] = useState<string | null>(null);
  const [status, setStatus] = useState('Choose a landmark or any open tile.');

  const blocked = useMemo(
    () =>
      new Set(
        [
          ...realmObjects
            .filter((object) => object.blocksMovement !== false)
            .map((object) => pointKey(object.position)),
          ...realmDecorations
            .filter((decoration) => decoration.blocksMovement !== false)
            .map((decoration) => pointKey(decoration.position)),
        ],
      ),
    [],
  );

  const showAchievement = useCallback((message: string) => {
    if (achievementTimerRef.current !== null) window.clearTimeout(achievementTimerRef.current);
    setAchievement(message);
    achievementTimerRef.current = window.setTimeout(() => {
      setAchievement(null);
      achievementTimerRef.current = null;
    }, 5200);
  }, []);

  const unlockSecret = useCallback(
    (id: string, message: string) => {
      if (unlockedSecretsRef.current.has(id)) return;
      const next = new Set(unlockedSecretsRef.current).add(id);
      unlockedSecretsRef.current = next;
      setUnlockedSecrets(next);
      showAchievement(message);
    },
    [showAchievement],
  );

  const recordDiscovery = useCallback(
    (object: RealmLandmark | RealmProp) => {
      if (!discoveredRef.current.has(object.id)) {
        const next = new Set(discoveredRef.current).add(object.id);
        discoveredRef.current = next;
        setDiscovered(next);

        if (next.size === discoverableObjects.length) {
          unlockSecret('cartographer', 'Secret unlocked: Buildlands Cartographer — every story in the field has been found.');
        }
      }

      if (object.kind === 'discovery') {
        const trail = [...interactionTrailRef.current, object.id].slice(-offDutySequence.length);
        interactionTrailRef.current = trail;
        if (trail.every((id, index) => id === offDutySequence[index])) {
          unlockSecret('off-duty', 'Secret unlocked: Off-Duty Loadout — comics, fragrance, and a local model.');
        }
      }
    },
    [unlockSecret],
  );

  const rejectDestination = useCallback((point: GridPoint) => {
    if (rejectTimerRef.current !== null) {
      window.clearTimeout(rejectTimerRef.current);
    }

    setRejectedTarget(point);
    setStatus('No clear route. Even enchanted pathfinding has boundaries.');
    rejectTimerRef.current = window.setTimeout(() => {
      setRejectedTarget(null);
      setStatus('Choose a landmark or any open tile.');
      rejectTimerRef.current = null;
    }, 1500);
  }, []);

  useEffect(() => {
    document.body.classList.add('realm-mode');
    return () => document.body.classList.remove('realm-mode');
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateScale = () => {
      const { width, height } = viewport.getBoundingClientRect();
      const compact = width < 760;
      const padding = compact ? 16 : 28;
      const fitted = Math.min((width - padding) / mapWidth, (height - padding) / mapHeight, 1);
      setScale(compact ? Math.max(0.7, fitted) : Math.max(0.45, fitted));
    };

    const observer = new ResizeObserver(updateScale);
    observer.observe(viewport);
    updateScale();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || hasCenteredRef.current) return;

    const animationFrame = window.requestAnimationFrame(() => {
      viewport.scrollLeft = Math.max(0, PLAYER_START.col * TILE_SIZE * scale - viewport.clientWidth / 2);
      viewport.scrollTop = Math.max(0, PLAYER_START.row * TILE_SIZE * scale - viewport.clientHeight / 2);
      hasCenteredRef.current = true;
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [scale]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      if (activeDialog) {
        setActiveDialog(null);
        return;
      }

      if (journalOpen) {
        setJournalOpen(false);
        return;
      }

      routeGuardRef.current.cancel();
      onExit();
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activeDialog, journalOpen, onExit]);

  useEffect(() => {
    return () => {
      routeGuardRef.current.cancel();
      if (rejectTimerRef.current !== null) window.clearTimeout(rejectTimerRef.current);
      if (exitTimerRef.current !== null) window.clearTimeout(exitTimerRef.current);
      if (achievementTimerRef.current !== null) window.clearTimeout(achievementTimerRef.current);
    };
  }, []);

  const travel = useCallback(
    async (path: GridPoint[], destination: GridPoint, onArrive?: () => void) => {
      const routeId = routeGuardRef.current.begin();
      setActiveDialog(null);
      setJournalOpen(false);
      setRejectedTarget(null);
      setTarget(destination);
      setStatus(path.length > 0 ? 'Walking the realm…' : 'Already here. Convenient.');

      if (path.length === 0) {
        setTarget(null);
        onArrive?.();
        return;
      }

      setWalking(true);

      for (let index = 0; index < path.length; index += 1) {
        if (!routeGuardRef.current.isActive(routeId)) return;

        const next = path[index];
        const current = playerRef.current;
        if (next.col !== current.col) setFacingRight(next.col > current.col);
        setWalkFrame(index % 2 === 0 ? 1 : 2);
        playerRef.current = next;
        setPlayer(next);
        await wait(stepDurationMs);
      }

      if (!routeGuardRef.current.isActive(routeId)) return;

      setWalking(false);
      setWalkFrame(7);
      setTarget(null);
      setStatus('Destination reached.');
      onArrive?.();
    },
    [],
  );

  const walkToTile = useCallback(
    (destination: GridPoint) => {
      const path = findPath(playerRef.current, destination, blocked, bounds);
      if (path === null) {
        rejectDestination(destination);
        return;
      }
      void travel(path, destination);
    },
    [blocked, rejectDestination, travel],
  );

  const interactWith = useCallback(
    (object: RealmObject) => {
      const route = findNearestReachableAdjacent(playerRef.current, object.position, blocked, bounds);
      if (!route) {
        rejectDestination(object.position);
        return;
      }

      void travel(route.path, route.target, () => {
        if (object.kind === 'landmark') {
          recordDiscovery(object);
          setActiveDialog({ object });
          setStatus(`${object.label} opened.`);
          return;
        }

        if (object.kind === 'discovery') {
          recordDiscovery(object);
          const count = conversationCountsRef.current[object.id] ?? 0;
          const message = object.messages[count % object.messages.length];
          conversationCountsRef.current[object.id] = count + 1;
          setActiveDialog({ object, message });
          setStatus(`${object.label} discovered.`);
          return;
        }

        setStatus('Returning to the terminal…');
        exitTimerRef.current = window.setTimeout(onExit, 420);
      });
    },
    [blocked, onExit, recordDiscovery, rejectDestination, travel],
  );

  const handleMapClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('.realm-object')) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const col = Math.floor(((event.clientX - rect.left) / rect.width) * REALM_WIDTH);
    const row = Math.floor(((event.clientY - rect.top) / rect.height) * REALM_HEIGHT);
    if (col < 0 || col >= REALM_WIDTH || row < 0 || row >= REALM_HEIGHT) return;

    walkToTile({ col, row });
  };

  const playerStyle = {
    left: player.col * TILE_SIZE,
    top: player.row * TILE_SIZE,
  } satisfies CSSProperties;
  const mapStyle = {
    width: mapWidth,
    height: mapHeight,
    transform: `scale(${scale})`,
    '--realm-scale': scale,
  } as CSSProperties;

  return (
    <main className="realm-shell">
      <header className="realm-hud">
        <div>
          <p className="realm-eyebrow">portfolio runtime // buildlands preview</p>
          <h1>The Buildlands</h1>
        </div>
        <div className="realm-hud-copy">
          <p>{status}</p>
          <span>click or tap to walk · visit the Return Gate or press Esc to leave</span>
        </div>
        <button type="button" className="realm-journal-toggle" onClick={() => setJournalOpen((open) => !open)}>
          journal <strong>{discovered.size}/{discoverableObjects.length}</strong>
        </button>
      </header>

      <div ref={viewportRef} className="realm-viewport">
        <div className="realm-stage" style={{ width: mapWidth * scale, height: mapHeight * scale }}>
          <div
            className={`realm-map ${discovered.size === discoverableObjects.length ? 'complete' : ''}`}
            style={mapStyle}
            onClick={handleMapClick}
            role="application"
            aria-label="Interactive portfolio realm. Click an open tile to walk or choose a labelled landmark."
          >
            <div className="realm-tile-layer" aria-hidden="true">
              {realmMap.flatMap((row, rowIndex) =>
                row.map((tile, colIndex) => (
                  <img
                    key={`${colIndex}-${rowIndex}`}
                    className="realm-tile"
                    src={tileAssets[tile]}
                    alt=""
                    draggable={false}
                    style={{ left: colIndex * TILE_SIZE, top: rowIndex * TILE_SIZE }}
                  />
                )),
              )}
            </div>

            <div className="realm-zone-layer" aria-hidden="true">
              {realmZones.map((zone) => (
                <div
                  key={zone.id}
                  className={`realm-zone ${zone.tone}`}
                  style={{
                    left: zone.col * TILE_SIZE,
                    top: zone.row * TILE_SIZE,
                    width: zone.width * TILE_SIZE,
                    height: zone.height * TILE_SIZE,
                  }}
                />
              ))}
            </div>

            <div className="realm-decoration-layer" aria-hidden="true">
              {realmDecorations.map((decoration) => (
                <div
                  key={decoration.id}
                  className={`realm-decoration ${decoration.className ?? ''}`}
                  style={{ left: decoration.position.col * TILE_SIZE, top: decoration.position.row * TILE_SIZE }}
                >
                  <RealmSprite
                    asset={decoration.asset}
                    label=""
                    width={decoration.displayWidth ?? 64}
                    height={decoration.displayHeight ?? 64}
                    crop={decoration.crop}
                  />
                </div>
              ))}
            </div>

            {realmObjects.map((object) => (
              <button
                key={object.id}
                type="button"
                className={`realm-object ${object.kind} ${object.className ?? ''} ${discovered.has(object.id) ? 'discovered' : ''}`}
                style={{ left: object.position.col * TILE_SIZE, top: object.position.row * TILE_SIZE }}
                onClick={(event) => {
                  event.stopPropagation();
                  interactWith(object);
                }}
                aria-label={`${object.label}. Walk here and interact.`}
                title={object.label}
              >
                <RealmSprite
                  asset={object.asset}
                  label=""
                  width={object.displayWidth ?? (object.kind === 'landmark' ? 88 : object.kind === 'exit' ? 76 : 64)}
                  height={object.displayHeight ?? (object.kind === 'landmark' ? 88 : object.kind === 'exit' ? 76 : 64)}
                  crop={object.crop}
                />
                {object.effect ? <LandmarkAmbientEffect effect={object.effect} /> : null}
                {labelledObjectIds.has(object.id) ? <span className="realm-nameplate">{object.label}</span> : null}
              </button>
            ))}

            {target ? <MapMarker point={target} variant="target" /> : null}
            {rejectedTarget ? <MapMarker point={rejectedTarget} variant="rejected" /> : null}

            <div
              className={`realm-player ${walking ? 'walking' : ''}`}
              style={playerStyle}
              aria-label="Sir Piyush"
            >
              <div
                className="realm-player-sprite"
                style={{
                  backgroundImage: `url(${knightAsset})`,
                  backgroundPosition: `${-walkFrame * TILE_SIZE}px ${-3 * TILE_SIZE}px`,
                  transform: facingRight ? 'scaleX(-1)' : undefined,
                }}
              />
            </div>

          </div>
        </div>
      </div>

      <footer className="realm-credits">
        Realm art: Kenney Medieval RTS (CC0), MurphysDad robot-lab (CC0), and Calciumtrice Simple Knight (CC-BY).
      </footer>

      {activeDialog ? (
        <RealmDialog
          object={activeDialog.object}
          message={activeDialog.message}
          discoveredCount={discovered.size}
          totalCount={discoverableObjects.length}
          onClose={() => setActiveDialog(null)}
        />
      ) : null}

      {journalOpen ? (
        <DiscoveryJournal
          discovered={discovered}
          unlockedSecrets={unlockedSecrets}
          onClose={() => setJournalOpen(false)}
        />
      ) : null}

      {achievement ? <div className="realm-achievement" role="status">{achievement}</div> : null}
    </main>
  );
}

function RealmSprite({
  asset,
  label,
  width,
  height,
  crop,
}: {
  asset: string;
  label: string;
  width: number;
  height: number;
  crop?: SpriteSheetCrop;
}) {
  if (!crop) {
    return <img className="realm-object-image" src={asset} alt={label} draggable={false} style={{ width, height }} />;
  }

  const columns = crop.width / crop.cellWidth;
  const sourceCol = crop.index % columns;
  const sourceRow = Math.floor(crop.index / columns);

  return (
    <span
      className="realm-object-image cropped"
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      style={{
        width,
        height,
        backgroundImage: `url(${asset})`,
        backgroundSize: `${(crop.width / crop.cellWidth) * width}px ${(crop.height / crop.cellHeight) * height}px`,
        backgroundPosition: `${-sourceCol * width}px ${-sourceRow * height}px`,
      }}
    />
  );
}

function MapMarker({ point, variant }: { point: GridPoint; variant: 'target' | 'rejected' }) {
  return (
    <span
      className={`realm-marker ${variant}`}
      style={{
        left: point.col * TILE_SIZE + TILE_SIZE / 2,
        top: point.row * TILE_SIZE + TILE_SIZE / 2,
      }}
      aria-hidden="true"
    />
  );
}

function LandmarkAmbientEffect({ effect }: { effect: LandmarkEffect }) {
  return (
    <span className={`realm-landmark-effect ${effect}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function RealmDialog({
  object,
  message,
  discoveredCount,
  totalCount,
  onClose,
}: {
  object: RealmLandmark | RealmProp;
  message?: string;
  discoveredCount: number;
  totalCount: number;
  onClose: () => void;
}) {
  const isLandmark = object.kind === 'landmark';
  const details = isLandmark ? object.details : [message ?? object.messages[0]];
  const kicker = isLandmark ? object.kicker : `optional encounter // ${object.label}`;

  return (
    <div className="realm-dialog-backdrop" role="presentation" onPointerDown={onClose}>
      <section
        className="realm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="realm-dialog-title"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <p className="realm-dialog-kicker">{kicker}</p>
        <h2 id="realm-dialog-title">{object.label}</h2>
        <button type="button" className="realm-dialog-close" onClick={onClose} autoFocus aria-label="Close">
          ×
        </button>

        <div className="realm-dialog-details">
          {details.map((detail) => (
            <p key={detail}>{detail}</p>
          ))}
        </div>

        {isLandmark && object.actions ? (
          <div className="realm-dialog-actions">
            {object.actions.map((action) => (
              <a
                key={`${object.id}-${action.label}`}
                href={action.href}
                download={action.download}
                target={action.href.startsWith('http') ? '_blank' : undefined}
                rel={action.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                {action.label}
              </a>
            ))}
          </div>
        ) : null}
        <p className="realm-dialog-progress">journal: {discoveredCount}/{totalCount} discoveries</p>
      </section>
    </div>
  );
}

function DiscoveryJournal({
  discovered,
  unlockedSecrets,
  onClose,
}: {
  discovered: Set<string>;
  unlockedSecrets: Set<string>;
  onClose: () => void;
}) {
  return (
    <aside className="realm-journal" aria-label="Discovery journal">
      <div className="realm-journal-head">
        <div>
          <span>field notes</span>
          <h2>Discovery Journal</h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close journal">×</button>
      </div>
      <div className="realm-journal-grid">
        {discoverableObjects.map((object) => {
          const found = discovered.has(object.id);
          return (
            <div key={object.id} className={found ? 'found' : ''}>
              <span>{found ? '◆' : '◇'}</span>
              {found ? object.label : 'undiscovered'}
            </div>
          );
        })}
      </div>
      <div className="realm-journal-secrets">
        <strong>hidden records</strong>
        <span>{unlockedSecrets.has('off-duty') ? '◆ Off-Duty Loadout' : '◇ ???'}</span>
        <span>{unlockedSecrets.has('cartographer') ? '◆ Buildlands Cartographer' : '◇ ???'}</span>
      </div>
    </aside>
  );
}
