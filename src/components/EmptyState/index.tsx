import type { ReactNode } from 'react';
import styles from './styles.module.css';

export type EmptyStateProps = {
  action?: ReactNode;
  description: string;
  icon?: ReactNode;
  title: string;
};

export function EmptyState({ action, description, icon, title }: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      {icon && <div className={styles.emptyStateIcon}>{icon}</div>}
      <p className={styles.emptyStateTitle}>{title}</p>
      <p className={styles.emptyStateDescription}>{description}</p>
      {action}
    </div>
  );
}

export default EmptyState;
