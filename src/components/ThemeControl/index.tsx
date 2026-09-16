import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { useTheme, type ThemePreference } from '../ThemeProvider/index.js';
import styles from './styles.module.css';

export type ThemeControlProps = {
  labels: Record<ThemePreference, string>;
  variant?: 'segmented' | 'compact';
};

const preferences: ThemePreference[] = ['system', 'light', 'dark'];

function ThemeIcon({ preference }: { preference: ThemePreference }) {
  const paths: Record<ThemePreference, ReactNode> = {
    system: (
      <>
        <rect x="3.5" y="4.5" width="17" height="12" rx="2" />
        <path d="M8 20h8M12 16.5V20" />
      </>
    ),
    light: (
      <>
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
      </>
    ),
    dark: <path d="M20.2 15.4A8.7 8.7 0 0 1 8.6 3.8 8.8 8.8 0 1 0 20.2 15.4Z" />,
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[preference]}
    </svg>
  );
}

export function ThemeControl({ labels, variant = 'segmented' }: ThemeControlProps) {
  const { preference, setPreference } = useTheme();
  const [open, setOpen] = useState(false);
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (open) optionRefs.current[preferences.indexOf(preference)]?.focus();
  }, [open, preference]);

  useEffect(() => {
    if (!open) return;

    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeWithEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeWithEscape);
    };
  }, [open]);

  if (variant === 'compact') {
    return (
      <div
        className={styles.themePicker}
        ref={rootRef}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
        }}
      >
        <button
          ref={triggerRef}
          type="button"
          className={styles.themePickerTrigger}
          aria-label={`${labels.system}: ${labels[preference]}`}
          aria-controls={id}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              setOpen(true);
            }
          }}
        >
          <ThemeIcon preference={preference} />
        </button>
        {open && (
          <div id={id} data-lk="theme-menu" className={styles.themePickerMenu} role="menu">
            {preferences.map((value, index) => (
              <button
                key={value}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                type="button"
                className={styles.themePickerOption}
                role="menuitemradio"
                aria-checked={preference === value}
                tabIndex={preference === value ? 0 : -1}
                onKeyDown={(event) => {
                  const next =
                    event.key === 'Home'
                      ? 0
                      : event.key === 'End'
                        ? preferences.length - 1
                        : event.key === 'ArrowDown'
                          ? (index + 1) % preferences.length
                          : event.key === 'ArrowUp'
                            ? (index + preferences.length - 1) % preferences.length
                            : null;
                  if (next !== null) {
                    event.preventDefault();
                    optionRefs.current[next]?.focus();
                  }
                }}
                onClick={() => {
                  setPreference(value);
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
              >
                <ThemeIcon preference={value} />
                <span>{labels[value]}</span>
                <span className={styles.themePickerCheck} aria-hidden="true" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.themeControl} role="group" aria-label={labels.system}>
      {preferences.map((value) => (
        <button
          key={value}
          type="button"
          className={styles.themeControlButton}
          aria-pressed={preference === value}
          onClick={() => setPreference(value)}
        >
          {labels[value]}
        </button>
      ))}
    </div>
  );
}

export default ThemeControl;
