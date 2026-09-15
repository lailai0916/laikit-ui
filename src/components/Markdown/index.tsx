import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Heading } from '../../provider.js';
import styles from './styles.module.css';

export interface MDTitleProps {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function MDTitle({ title, description, className }: MDTitleProps) {
  return (
    <section className={clsx(styles.section, className)}>
      <Heading as="h1">{title}</Heading>
      {description && <p>{description}</p>}
    </section>
  );
}
