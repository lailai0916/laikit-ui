import { useLaikit } from '../../provider.js';
import Card from '../Card/index.js';
import IconBlock from '../IconBlock/index.js';
import styles from './styles.module.css';

export interface DataCardProps {
  value: number;
  label: string;
  icon: string;
  // Optional display formatter (e.g. compact "88.8K"); defaults to the raw value.
  format?: (value: number) => string;
}

export default function DataCard({ value, label, icon, format }: DataCardProps) {
  const { selectMessage } = useLaikit();
  const displayLabel = selectMessage(value, label);

  return (
    <Card padding="1.5rem">
      <div className={styles.statCard}>
        <IconBlock icon={icon} variant="muted" />
        <div className={styles.statContent}>
          <div className={styles.statNumber}>{format ? format(value) : value}</div>
          <div className={styles.statLabel}>{displayLabel}</div>
        </div>
      </div>
    </Card>
  );
}
