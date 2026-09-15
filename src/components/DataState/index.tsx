import { type ReactNode } from 'react';
import styles from './styles.module.css';

export interface DataStateProps {
  message: string;
  action?: ReactNode;
}

export default function DataState({ message, action }: DataStateProps) {
  return (
    <div className={styles.state}>
      <p className={styles.message}>{message}</p>
      {action}
    </div>
  );
}
