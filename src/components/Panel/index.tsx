import type { HTMLAttributes, ReactNode } from 'react';
import styles from './styles.module.css';

export type PanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  tone?: 'default' | 'muted';
  feature?: boolean;
};

export function Panel({
  children,
  className = '',
  feature = false,
  tone = 'default',
  ...props
}: PanelProps) {
  const classes = [
    styles.panel,
    feature ? styles.panelFeature : '',
    tone === 'muted' ? styles.panelMuted : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div {...props} data-lk="panel" className={classes}>
      {children}
    </div>
  );
}

export function PanelHeader({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`${styles.panelHeader} ${className}`.trim()}>
      {children}
    </div>
  );
}

export function PanelBody({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`${styles.panelBody} ${className}`.trim()}>
      {children}
    </div>
  );
}

export function PanelFooter({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={`${styles.panelFooter} ${className}`.trim()}>
      {children}
    </div>
  );
}
