import type { GridPoint } from './pathfinding';

export type InteractionKind = 'landmark' | 'discovery' | 'exit';
export type LandmarkEffect = 'sparks' | 'signal' | 'terminal' | 'embers' | 'pages' | 'shrine';

export type RealmAction = {
  label: string;
  href: string;
  download?: string;
};

export type SpriteSheetCrop = {
  width: number;
  height: number;
  cellWidth: number;
  cellHeight: number;
  index: number;
};

type RealmObjectBase = {
  id: string;
  label: string;
  position: GridPoint;
  asset: string;
  blocksMovement?: boolean;
  className?: string;
  displayWidth?: number;
  displayHeight?: number;
  crop?: SpriteSheetCrop;
  effect?: LandmarkEffect;
};

export type RealmLandmark = RealmObjectBase & {
  kind: 'landmark';
  kicker: string;
  details: string[];
  actions?: RealmAction[];
};

export type RealmProp = RealmObjectBase & {
  kind: 'discovery';
  messages: string[];
};

export type RealmExit = RealmObjectBase & {
  kind: 'exit';
};

export type RealmObject = RealmLandmark | RealmProp | RealmExit;

export type RealmDecoration = {
  id: string;
  position: GridPoint;
  asset: string;
  className?: string;
  displayWidth?: number;
  displayHeight?: number;
  crop?: SpriteSheetCrop;
  blocksMovement?: boolean;
};

export type RealmZone = {
  id: string;
  label: string;
  col: number;
  row: number;
  width: number;
  height: number;
  tone: 'amber' | 'cyan' | 'violet' | 'blue' | 'gold' | 'slate' | 'ember' | 'teal' | 'ivory';
};

export const REALM_WIDTH = 20;
export const REALM_HEIGHT = 16;
export const TILE_SIZE = 64;
export const PLAYER_START: GridPoint = { col: 9, row: 8 };

const base = import.meta.env.BASE_URL;
export const realmAsset = (path: string) => `${base}realm-assets/${path}`;

export const tileAssets = {
  grass: realmAsset('tiles/tile-57.png'),
  grassAlt: realmAsset('tiles/tile-58.png'),
};

export type RealmTile = keyof typeof tileAssets;

export const realmMap: RealmTile[][] = Array.from({ length: REALM_HEIGHT }, (_, row) =>
  Array.from({ length: REALM_WIDTH }, (_, col) => ((row + col) % 5 === 0 ? 'grass' : 'grassAlt')),
);

export const realmLandmarks: RealmLandmark[] = [
  {
    id: 'keyloop-hq',
    kind: 'landmark',
    label: 'Keyloop HQ',
    kicker: 'The production keep · experience',
    position: { col: 9, row: 2 },
    asset: realmAsset('structures/structure-06.png'),
    effect: 'signal',
    details: [
      'Applied AI Engineer building orchestrators, agent harnesses, guardrails, and reliable execution paths.',
      'Previously shipped infrastructure automation that cut manual intervention by 78% and MTTR by 25%.',
      'Earlier rolled out security visibility across 2,000+ servers. The kingdom calls that “quite a few.”',
    ],
  },
  {
    id: 'project-forge',
    kind: 'landmark',
    label: 'Project Forge',
    kicker: 'Where side projects acquire unreasonable scope',
    position: { col: 2, row: 2 },
    asset: realmAsset('structures/structure-13.png'),
    effect: 'sparks',
    details: [
      'Pispyre catches hallucinated, moved, and dead Python imports using static analysis and package metadata.',
      'SupportPilot is a multi-tenant AI support platform with LangGraph orchestration, retrieval, RBAC, and observability.',
      'Both began as “small ideas,” which remains the oldest lie in software engineering.',
    ],
    actions: [
      { label: 'Open Pispyre', href: 'https://github.com/pibuilt/pispyre' },
      { label: 'Open SupportPilot', href: 'https://github.com/pibuilt/supportpilot' },
    ],
  },
  {
    id: 'systems-lab',
    kind: 'landmark',
    label: 'Systems Lab',
    kicker: 'Backend, AI, infrastructure · skills',
    position: { col: 16, row: 2 },
    asset: realmAsset('structures/structure-20.png'),
    effect: 'terminal',
    details: [
      'Python, FastAPI, SQL, JavaScript, Linux, API design, and distributed systems form the plumbing.',
      'Claude, Bedrock, RAG, LangGraph, MCP, and multi-agent systems provide the experimental lightning.',
      'AWS, Docker, CI/CD, observability, and ML tooling keep the lightning inside the building.',
    ],
  },
  {
    id: 'guild-hall',
    kind: 'landmark',
    label: 'Guild Hall',
    kicker: 'Stamped scrolls · certifications',
    position: { col: 17, row: 7 },
    asset: realmAsset('structures/structure-02.png'),
    details: [
      'AWS Certified Cloud Practitioner and Certified SAFe 6 Practitioner.',
      'Stanford Machine Learning Specialization via Coursera.',
      'NPTEL: The Joy of Computing using Python. The joy survived production, mostly.',
    ],
  },
  {
    id: 'academy',
    kind: 'landmark',
    label: 'The Academy',
    kicker: 'Vasavi College of Engineering · education',
    position: { col: 2, row: 7 },
    asset: realmAsset('structures/structure-17.png'),
    details: [
      'Bachelor of Engineering in Information Technology, graduating with a 9.04/10 grade.',
      'Won Best Project in the IT department and helped lead the Euphoria annual fest.',
      'Toastmasters and MUN supplied the public-speaking skill tree and several Best Delegate wins.',
    ],
  },
  {
    id: 'archive',
    kind: 'landmark',
    label: 'Research Archive',
    kicker: 'Peer-reviewed spellbook · publication',
    position: { col: 2, row: 12 },
    asset: realmAsset('structures/structure-11.png'),
    effect: 'pages',
    details: [
      'Layered Security — Gradient Boosting Meets Naive Bayes for Intrusion Detection.',
      'Published in the Sixth Congress on Intelligent Systems, Springer LNNS Vol. 1837.',
      'Combines Naive Bayes, XGBoost, and GAN augmentation to improve rare-attack detection.',
    ],
    actions: [{ label: 'Read the paper', href: 'https://doi.org/10.1007/978-3-032-18282-1_2' }],
  },
  {
    id: 'campfire',
    kind: 'landmark',
    label: 'Builder’s Campfire',
    kicker: 'About Piyush · mind the sparks',
    position: { col: 7, row: 12 },
    asset: realmAsset('environment/environment-21.png'),
    displayWidth: 62,
    displayHeight: 62,
    effect: 'embers',
    details: [
      'Applied AI engineer interested in systems that do useful things instead of merely describing them confidently.',
      'Usually found connecting backend services, infrastructure, and AI workflows until the boring work disappears.',
      'Also collects DC comics and fragrances, experiments with open models, and willingly enters debate rooms.',
    ],
  },
  {
    id: 'messenger-board',
    kind: 'landmark',
    label: 'Messenger Board',
    kicker: 'Send a raven · contact',
    position: { col: 13, row: 12 },
    asset: realmAsset('structures/structure-03.png'),
    details: [
      'Email is fastest for actual conversation.',
      'GitHub contains the builds, experiments, and evidence.',
      'LinkedIn contains the professional timeline and significantly fewer enchanted barrels.',
    ],
    actions: [
      { label: 'Email', href: 'mailto:works.piyushb@gmail.com' },
      { label: 'GitHub', href: 'https://github.com/pibuilt' },
      { label: 'LinkedIn', href: 'https://linkedin.com/in/piyush-bhuyan' },
    ],
  },
  {
    id: 'resume-shrine',
    kind: 'landmark',
    label: 'Résumé Shrine',
    kicker: 'One practical scroll among the lore',
    position: { col: 17, row: 12 },
    asset: realmAsset('structures/structure-12.png'),
    effect: 'shrine',
    details: [
      'A concise record of applied AI, backend systems, infrastructure automation, research, and projects.',
      'The download begins only when you choose the action below. No mimic chests here.',
    ],
    actions: [
      {
        label: 'Download résumé',
        href: `${base}Piyush_Bhuyan_Resume.pdf`,
        download: 'Piyush_Bhuyan_Resume.pdf',
      },
    ],
  },
  {
    id: 'art-credits',
    kind: 'landmark',
    label: 'Art Credits',
    kicker: 'The makers behind the pixels',
    position: { col: 12, row: 15 },
    asset: realmAsset('lab/monitors.png'),
    displayWidth: 44,
    displayHeight: 58,
    className: 'credits-icon',
    effect: 'terminal',
    details: [
      'Medieval world, buildings, scenery, and units: Kenney Vleugels — Medieval RTS Pack, released under CC0.',
      'Laboratory machines, drones, and technology props: Murphy’s Dad — Robot Lab, released under CC0.',
      'The playable knight sprite: zwonky — Knights, released under CC0.',
    ],
    actions: [
      { label: 'Kenney Vleugels ↗', href: 'https://kenney.nl/assets/medieval-rts' },
      { label: 'Murphy’s Dad ↗', href: 'https://murphysdad.itch.io/robot-lab-asset-pack' },
      { label: 'zwonky ↗', href: 'https://opengameart.org/content/knights' },
    ],
  },
];

export const realmProps: RealmProp[] = [
  {
    id: 'qa-knight',
    kind: 'discovery',
    label: 'QA knight',
    position: { col: 6, row: 7 },
    asset: realmAsset('units/unit-16.png'),
    displayWidth: 88,
    displayHeight: 88,
    className: 'npc',
    messages: [
      'QA knight: “I broke the build so it could live forever.”',
      '“The reproduction steps are simple: become me, click everything, then panic.”',
      '“It passed locally. This is both a statement and a prayer.”',
    ],
  },
  {
    id: 'trader',
    kind: 'discovery',
    label: 'The trader',
    position: { col: 12, row: 8 },
    asset: realmAsset('units/unit-24.png'),
    displayWidth: 88,
    displayHeight: 88,
    className: 'npc',
    messages: [
      'Accepts gold, ether, exposure, or one B-grade code review.',
      'Today’s special: one production fix bundled with two completely unrelated regressions.',
      'No refunds after deployment. Store policy. Very ancient.',
    ],
  },
  {
    id: 'crown-server',
    kind: 'discovery',
    label: 'Crown server',
    position: { col: 11, row: 3 },
    asset: realmAsset('lab/computer.png'),
    crop: { width: 32, height: 16, cellWidth: 16, cellHeight: 16, index: 0 },
    displayWidth: 50,
    displayHeight: 50,
    className: 'terminal-pulse',
    messages: [
      'Production runs on observability, sensible retries, and a small amount of candle-tea.',
      'The uptime rune says 99.9%. Nobody asks what happened to the other 0.1%.',
    ],
  },
  {
    id: 'oracle-monitor',
    kind: 'discovery',
    label: 'Project Oracle',
    position: { col: 14, row: 3 },
    asset: realmAsset('lab/monitor_popup.png'),
    displayWidth: 66,
    displayHeight: 50,
    className: 'terminal-pulse delayed',
    messages: [
      'The dashboard sees all. Orange means “we will look at it Monday.”',
      'Every chart is green. This is either excellent news or a permissions problem.',
    ],
  },
  {
    id: 'mana-barrel',
    kind: 'discovery',
    label: 'Mana barrel',
    position: { col: 18, row: 3 },
    asset: realmAsset('lab/radioactive_barrel.png'),
    crop: { width: 128, height: 16, cellWidth: 16, cellHeight: 16, index: 0 },
    displayWidth: 50,
    displayHeight: 50,
    className: 'mana-glow',
    messages: [
      'One whiff and you add three dependencies. Handle with care.',
      'The label says “zero transitive dependencies.” The label is lying.',
    ],
  },
  {
    id: 'drone-west',
    kind: 'discovery',
    label: 'Ethereal birb',
    position: { col: 1, row: 0 },
    asset: realmAsset('lab/drone.png'),
    crop: { width: 64, height: 16, cellWidth: 16, cellHeight: 16, index: 1 },
    displayWidth: 46,
    displayHeight: 46,
    blocksMovement: false,
    className: 'flying',
    messages: [
      'A pigeon with telemetry. It denies everything.',
      'Flight log: one castle, three suspicious commits, no breadcrumbs.',
    ],
  },
  {
    id: 'drone-east',
    kind: 'discovery',
    label: 'Merge scout',
    position: { col: 18, row: 0 },
    asset: realmAsset('lab/drone.png'),
    crop: { width: 64, height: 16, cellWidth: 16, cellHeight: 16, index: 2 },
    displayWidth: 46,
    displayHeight: 46,
    blocksMovement: false,
    className: 'flying delayed',
    messages: [
      'Scouting the horizon for green pipelines and acceptable pull requests.',
      'Report from the east: the pipeline is green, but nobody knows why.',
    ],
  },
  {
    id: 'tree-west',
    kind: 'discovery',
    label: 'Branch manager',
    position: { col: 0, row: 5 },
    asset: realmAsset('environment/environment-01.png'),
    className: 'tree-sway',
    messages: [
      'A well-adjusted branch manager. Rare in these lands.',
      'It approves every merge after sufficient sunlight and two reviewers.',
    ],
  },
  {
    id: 'tree-east',
    kind: 'discovery',
    label: 'Tall tree',
    position: { col: 19, row: 5 },
    asset: realmAsset('environment/environment-02.png'),
    className: 'tree-sway delayed',
    messages: [
      'Main-branch energy, suspiciously tall.',
      'Its roots predate the migration. Nobody is brave enough to inspect them.',
    ],
  },
  {
    id: 'pine-south',
    kind: 'discovery',
    label: 'Evergreen CI',
    position: { col: 0, row: 14 },
    asset: realmAsset('environment/environment-04.png'),
    className: 'tree-sway',
    messages: [
      'Evergreen CI. The needles are lint warnings.',
      'Shake the branch and three flaky tests fall out.',
    ],
  },
  {
    id: 'boulder',
    kind: 'discovery',
    label: 'Legacy boulder',
    position: { col: 11, row: 13 },
    asset: realmAsset('environment/environment-09.png'),
    messages: [
      'Last modified 1024. Refuses every refactor.',
      'There is a TODO carved underneath. The author has become legend.',
    ],
  },
  {
    id: 'comic-crate',
    kind: 'discovery',
    label: 'Longbox',
    position: { col: 5, row: 13 },
    asset: realmAsset('environment/environment-06.png'),
    messages: [
      'DC back issues. Alphabetized until someone mentions Crisis continuity.',
      'The rarest scroll in the box is whichever issue Piyush is currently hunting.',
    ],
  },
  {
    id: 'fragrance-bush',
    kind: 'discovery',
    label: 'Suspiciously fragrant bush',
    position: { col: 11, row: 11 },
    asset: realmAsset('environment/environment-13.png'),
    messages: [
      'Top notes: bergamot. Base notes: another niche bottle purchase.',
      'Projection: excellent. Financial restraint: not detected.',
    ],
  },
  {
    id: 'open-model-rock',
    kind: 'discovery',
    label: 'Local model stone',
    position: { col: 6, row: 3 },
    asset: realmAsset('environment/environment-08.png'),
    messages: [
      'Runs locally. Charges no credits. Requires only RAM and questionable patience.',
      'Quantized to four bits and still more articulate than the council meeting.',
    ],
  },
  {
    id: 'forge-tree-a',
    kind: 'discovery',
    label: 'Forge sentinel tree',
    position: { col: 4, row: 0 },
    asset: realmAsset('environment/environment-01.png'),
    className: 'tree-sway',
    messages: [
      'Its rings record every side project that escaped its original weekend estimate.',
      'A branch falls whenever someone says “this should be a quick feature.”',
    ],
  },
  {
    id: 'forge-bush',
    kind: 'discovery',
    label: 'Hotfix hedge',
    position: { col: 0, row: 3 },
    asset: realmAsset('environment/environment-13.png'),
    messages: [
      'A hotfix was hidden here during the last release. Nobody remembers which one.',
      'The leaves rustle in semver whenever a dependency changes.',
    ],
  },
  {
    id: 'keep-tree',
    kind: 'discovery',
    label: 'Uptime oak',
    position: { col: 12, row: 0 },
    asset: realmAsset('environment/environment-01.png'),
    className: 'tree-sway delayed',
    messages: [
      'This oak has stayed upright through three migrations and one Friday deployment.',
      'Its maintenance window is every second century.',
    ],
  },
  {
    id: 'lab-pine-east',
    kind: 'discovery',
    label: 'Packet pine',
    position: { col: 19, row: 2 },
    asset: realmAsset('environment/environment-03.png'),
    className: 'tree-sway delayed',
    messages: [
      'Packets nest in its branches before crossing the eastern firewall.',
      'A dropped cone indicates roughly one percent packet loss.',
    ],
  },
  {
    id: 'lab-table',
    kind: 'discovery',
    label: 'Prototype bench',
    position: { col: 14, row: 4 },
    asset: realmAsset('lab/table.png'),
    displayWidth: 48,
    displayHeight: 48,
    className: 'terminal-pulse',
    messages: [
      'Half workshop, half incident desk, entirely covered in cables.',
      'The prototype works. The documentation is scheduled for the next lunar cycle.',
    ],
  },
  {
    id: 'lab-parts',
    kind: 'discovery',
    label: 'Spare automaton parts',
    position: { col: 17, row: 4 },
    asset: realmAsset('lab/spare_robot_parts.png'),
    crop: { width: 80, height: 16, cellWidth: 16, cellHeight: 16, index: 0 },
    displayWidth: 48,
    displayHeight: 48,
    messages: [
      'Enough spare parts to build one robot or confuse five code reviewers.',
      'The missing screw is already in production.',
    ],
  },
  {
    id: 'academy-tree',
    kind: 'discovery',
    label: 'Knowledge tree',
    position: { col: 4, row: 9 },
    asset: realmAsset('environment/environment-01.png'),
    className: 'tree-sway',
    messages: [
      'Every leaf is a lesson; several are about off-by-one errors.',
      'Its syllabus changes faster than the seasons.',
    ],
  },
  {
    id: 'guild-tree-east',
    kind: 'discovery',
    label: 'Credential cedar',
    position: { col: 19, row: 9 },
    asset: realmAsset('environment/environment-01.png'),
    className: 'tree-sway',
    messages: [
      'Certificates grow here after sustained exposure to practice exams.',
      'The fruit is valid for three years.',
    ],
  },
  {
    id: 'archive-rock',
    kind: 'discovery',
    label: 'Citation stone',
    position: { col: 0, row: 11 },
    asset: realmAsset('environment/environment-08.png'),
    messages: [
      'Someone cited this stone in APA, IEEE, and an especially bold footnote.',
      'Peer review found it solid but requested clearer methodology.',
    ],
  },
  {
    id: 'archive-tree',
    kind: 'discovery',
    label: 'Paper pine',
    position: { col: 3, row: 15 },
    asset: realmAsset('environment/environment-03.png'),
    className: 'tree-sway',
    messages: [
      'Its needles are camera-ready revisions.',
      'A reviewer once asked it to add another baseline.',
    ],
  },
  {
    id: 'messenger-bush',
    kind: 'discovery',
    label: 'Notification shrub',
    position: { col: 15, row: 14 },
    asset: realmAsset('environment/environment-13.png'),
    messages: [
      'It pings whenever someone writes “quick question.”',
      'Do not shake after office hours unless production is actually on fire.',
    ],
  },
  {
    id: 'sanctum-tree',
    kind: 'discovery',
    label: 'Résumé tree',
    position: { col: 19, row: 15 },
    asset: realmAsset('environment/environment-01.png'),
    className: 'tree-sway',
    messages: [
      'Pruned to one page. The roots contain the extended version.',
      'Every bullet begins with a verb and ends before the reader loses interest.',
    ],
  },
];

export const realmZones: RealmZone[] = [
  { id: 'forge-grove', label: 'forge grove', col: 0, row: 0, width: 6, height: 5, tone: 'amber' },
  { id: 'production-keep', label: 'production keep', col: 7, row: 0, width: 6, height: 5, tone: 'cyan' },
  { id: 'systems-quarter', label: 'systems quarter', col: 13, row: 0, width: 7, height: 5, tone: 'violet' },
  { id: 'academy-meadow', label: 'academy meadow', col: 0, row: 5, width: 6, height: 5, tone: 'blue' },
  { id: 'guild-fields', label: 'guild fields', col: 14, row: 5, width: 6, height: 5, tone: 'gold' },
  { id: 'archive-ruins', label: 'archive ruins', col: 0, row: 10, width: 5, height: 6, tone: 'slate' },
  { id: 'builders-rest', label: 'builder’s rest', col: 5, row: 10, width: 5, height: 6, tone: 'ember' },
  { id: 'messenger-green', label: 'messenger green', col: 10, row: 10, width: 6, height: 6, tone: 'teal' },
  { id: 'resume-sanctum', label: 'résumé sanctum', col: 16, row: 10, width: 4, height: 6, tone: 'ivory' },
];

export const realmDecorations: RealmDecoration[] = [];

export const realmExit: RealmExit = {
  id: 'return-gate',
  kind: 'exit',
  label: 'Return Gate',
  position: { col: 9, row: 14 },
  asset: realmAsset('lab/sliding_doors.png'),
  crop: { width: 64, height: 128, cellWidth: 64, cellHeight: 64, index: 0 },
  displayWidth: 64,
  displayHeight: 64,
};

export const realmObjects: RealmObject[] = [...realmLandmarks, ...realmProps, realmExit];
export const knightAsset = realmAsset('knight.png');
