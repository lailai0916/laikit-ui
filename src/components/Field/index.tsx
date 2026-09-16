import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react';
import styles from './styles.module.css';

type FieldCopy = {
  description?: string;
  error?: string;
  label: string;
};

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & FieldCopy;
export type TextAreaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & FieldCopy;
export type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & FieldCopy;

function FieldFrame({
  children,
  description,
  error,
  id,
  label,
}: FieldCopy & { children: ReactNode; id: string }) {
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <label className={styles.field} htmlFor={id}>
      <span className={styles.fieldLabel}>{label}</span>
      {children}
      {description && (
        <p id={descriptionId} className={styles.fieldDescription}>
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.fieldError} role="alert">
          {error}
        </p>
      )}
    </label>
  );
}

export function TextField({ description, error, id, label, ...props }: TextFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const className = props.className;
  const describedBy = [
    props['aria-describedby'],
    description && `${fieldId}-description`,
    error && `${fieldId}-error`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <FieldFrame id={fieldId} label={label} description={description} error={error}>
      <input
        data-lk="field-control"
        {...props}
        id={fieldId}
        className={`${styles.fieldControl} ${className ?? ''}`.trim()}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : props['aria-invalid']}
      />
    </FieldFrame>
  );
}

export function TextAreaField({ description, error, id, label, ...props }: TextAreaFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const className = props.className;
  const describedBy = [
    props['aria-describedby'],
    description && `${fieldId}-description`,
    error && `${fieldId}-error`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <FieldFrame id={fieldId} label={label} description={description} error={error}>
      <textarea
        data-lk="field-control"
        {...props}
        id={fieldId}
        className={`${styles.fieldControl} ${className ?? ''}`.trim()}
        aria-describedby={describedBy || undefined}
        aria-invalid={error ? true : props['aria-invalid']}
      />
    </FieldFrame>
  );
}

export function SelectField({ description, error, id, label, ...props }: SelectFieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const className = props.className;
  const describedBy = [
    props['aria-describedby'],
    description && `${fieldId}-description`,
    error && `${fieldId}-error`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <FieldFrame id={fieldId} label={label} description={description} error={error}>
      <span className={styles.fieldSelect}>
        <select
          data-lk="field-control"
          {...props}
          id={fieldId}
          className={`${styles.fieldControl} ${className ?? ''}`.trim()}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? true : props['aria-invalid']}
        />
        <svg aria-hidden="true" viewBox="0 0 16 16">
          <path d="m4.5 6 3.5 3.5L11.5 6" />
        </svg>
      </span>
    </FieldFrame>
  );
}
