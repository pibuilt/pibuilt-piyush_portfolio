import { describe, expect, it } from 'vitest';
import { emptyJournalState, loadJournalState, saveJournalState } from './realmJournal';

function createMockStorage(initial: Record<string, string> = {}): Storage {
  const entries = new Map(Object.entries(initial));
  const storage: Record<string, unknown> = {
    get length() {
      return entries.size;
    },
    clear() {
      entries.clear();
    },
    getItem(key: string) {
      return entries.has(key) ? entries.get(key) ?? null : null;
    },
    key(index: number) {
      return Array.from(entries.keys())[index] ?? null;
    },
    removeItem(key: string) {
      entries.delete(key);
    },
    setItem(key: string, value: string) {
      entries.set(key, value);
    },
  };

  return storage as Storage;
}

describe('realm journal storage', () => {
  it('loads an empty state when nothing has been saved', () => {
    const storage = createMockStorage();

    expect(loadJournalState(storage)).toEqual(emptyJournalState());
  });

  it('round-trips a saved state', () => {
    const storage = createMockStorage();
    const state = {
      discovered: ['project-forge', 'comic-crate'],
      unlockedSecrets: ['off-duty'],
      conversationCounts: { 'open-model-rock': 2 },
      interactionTrail: ['comic-crate', 'fragrance-bush', 'open-model-rock'],
    };

    saveJournalState(state, storage);

    expect(loadJournalState(storage)).toEqual(state);
  });

  it('falls back to empty state on corrupt json', () => {
    const storage = createMockStorage({ realm_journal_v1: '{"discovered": not-json' });

    expect(loadJournalState(storage)).toEqual(emptyJournalState());
  });

  it('drops malformed fields while keeping valid ones', () => {
    const storage = createMockStorage({
      realm_journal_v1: JSON.stringify({
        discovered: ['project-forge', 42],
        unlockedSecrets: 'nope',
        conversationCounts: { 'comic-crate': 'many', 'open-model-rock': 2 },
        interactionTrail: [null],
      }),
    });

    expect(loadJournalState(storage)).toEqual({
      discovered: ['project-forge'],
      unlockedSecrets: [],
      conversationCounts: { 'open-model-rock': 2 },
      interactionTrail: [],
    });
  });

  it('returns an empty state without storage', () => {
    expect(loadJournalState(undefined)).toEqual(emptyJournalState());
    expect(() => saveJournalState(emptyJournalState(), undefined)).not.toThrow();
  });
});