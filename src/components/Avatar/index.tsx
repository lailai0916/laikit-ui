import styles from './styles.module.css';
export type AvatarProps = {
  alt: string;
  name: string;
  size?: number;
  src?: string | null;
};

export function Avatar({ alt, name, size = 36, src }: AvatarProps) {
  const initial = Array.from(name.trim())[0]?.toUpperCase() ?? '?';

  return (
    <span
      data-lk="avatar"
      className={styles.avatar}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {src ? <img src={src} alt={alt} /> : <span aria-label={alt}>{initial}</span>}
    </span>
  );
}

export default Avatar;
