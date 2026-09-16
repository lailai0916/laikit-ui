import styles from './styles.module.css';
export type BrandProps = {
  logoAlt?: string;
  logoSrc: string;
  name: string;
};

export function Brand({ logoAlt = '', logoSrc, name }: BrandProps) {
  return (
    <span data-lk="brand" className={styles.brand}>
      <img data-lk="brand-logo" className={styles.brandLogo} src={logoSrc} alt={logoAlt} />
      <span>{name}</span>
    </span>
  );
}

export default Brand;
