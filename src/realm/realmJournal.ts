export type RealmJournalState = {
  discovered: string[];
  unlockedSecrets: string[];
  conversationCounts: Record<string, number>;
  interactionTrail: string[];
};

const journalStorageKey = 'realm_journal_v1';

export const emptyJournalState = (): RealmJournalState => ({
  discovered: [],
  unlockedSecrets: [],
  conversationCounts: {},
  interactionTrail: [],
});

export function loadJournalState(
  storage: Pick<Storage, 'getItem'> | undefined = undefined,
): RealmJournalState {
  const targetStorage = storage ?? browserStorage();
  if (!targetStorage) {
    return emptyJournalState();
  }

  try {
    const raw = targetStorage.getItem(journalStorageKey);
    if (!raw) {
      return emptyJournalState();
    }

    const parsed = JSON.parse(raw) as Partial<RealmJournalState>;
    const empty = emptyJournalState();
    const discovered = Array.isArray(parsed.discovered)
      ? parsed.discovered.filter((id): id is string => typeof id === 'string')
      : empty.discovered;
    const unlockedSecrets = Array.isArray(parsed.unlockedSecrets)
      ? parsed.unlockedSecrets.filter((id): id is string => typeof id === 'string')
      : empty.unlockedSecrets;
    const conversationCounts =
      parsed.conversationCounts && typeof parsed.conversationCounts === 'object'
        ? Object.fromEntries(
            Object.entries(parsed.conversationCounts).filter(
              ([, count]) => typeof count === 'number' && Number.isFinite(count),
            ),
          )
        : empty.conversationCounts;
    const interactionTrail = Array.isArray(parsed.interactionTrail)
      ? parsed.interactionTrail.filter((id): id is string => typeof id === 'string')
      : empty.interactionTrail;

    return { discovered, unlockedSecrets, conversationCounts, interactionTrail };
  } catch {
    return emptyJournalState();
  }
}

export function saveJournalState(
  state: RealmJournalState,
  storage: Pick<Storage, 'setItem'> | undefined = undefined,
): void {
  const targetStorage = storage ?? browserStorage();
  if (!targetStorage) {
    return;
  }

  try {
    targetStorage.setItem(journalStorageKey, JSON.stringify(state));
  } catch {
    // Storage can be unavailable in private/restricted browsing. Persistence is best-effort.
  }
}

function browserStorage(): Storage | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    return window.sessionStorage;
  } catch {
    return undefined;
  }
}