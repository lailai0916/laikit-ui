import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import styles from './styles.module.css';

export type PageContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  width?: number;
};

export type FlowProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  gap?: number;
};

export function PageContainer({
  children,
  className = '',
  style,
  width,
  ...props
}: PageContainerProps) {
  return (
    <div
      {...props}
      className={`${styles.pageContainer} ${className}`.trim()}
      style={
        {
          ...style,
          '--lk-container-width': width != null ? `${width}px` : undefined,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

export function Stack({ children, className = '', gap, style, ...props }: FlowProps) {
  return (
    <div
      {...props}
      className={`${styles.stack} ${className}`.trim()}
      style={{ ...style, '--lk-stack-gap': gap != null ? `${gap}px` : undefined } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function Cluster({ children, className = '', gap, style, ...props }: FlowProps) {
  return (
    <div
      {...props}
      className={`${styles.cluster} ${className}`.trim()}
      style={
        {
          ...style,
          '--lk-cluster-gap': gap != null ? `${gap}px` : undefined,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
