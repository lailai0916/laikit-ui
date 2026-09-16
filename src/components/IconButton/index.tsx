import { forwardRef, type ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import Button from '../Button/index.js';
import styles from './styles.module.css';

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  size?: 'sm' | 'md';
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { children, className, label, size = 'md', title, ...props },
  ref
) {
  return (
    <Button
      {...props}
      ref={ref}
      variant="ghost"
      size={size}
      className={clsx(styles.button, styles[size], className)}
      aria-label={label}
      title={title ?? label}
    >
      {children}
    </Button>
  );
});

export default IconButton;
