export type ViewMode = 'cli' | 'classic';

type ViewModeToggleProps = {
  viewMode: ViewMode;
  onToggle: () => void;
  /**
   * `link` renders as inline text matching the email / github / linkedin links
   * (used in the CLI). `button` renders as the reference site's black outline
   * button (used in Classic Mode).
   */
  variant?: 'link' | 'button';
};

/**
 * Shared toggle that ferries visitors between the CLI experience and Classic
 * Mode. It renders in both modes; it is deliberately NOT rendered inside
 * Buildlands, which stays reachable only through the CLI.
 */
export function ViewModeToggle({ viewMode, onToggle, variant = 'link' }: ViewModeToggleProps) {
  const switchingToClassic = viewMode === 'cli';
  const label = switchingToClassic ? 'Classic View' : 'CLI Mode';

  return (
    <button
      type="button"
      className={`view-mode-toggle ${variant} ${switchingToClassic ? 'to-classic' : 'to-cli'}`}
      onClick={onToggle}
      aria-label={`Switch to ${label}`}
      title={`Switch to ${label}`}
    >
      {label}
    </button>
  );
}
