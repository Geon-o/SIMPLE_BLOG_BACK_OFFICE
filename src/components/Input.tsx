import React from 'react';
import styles from '../style/Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div className={styles.inputGroup}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        {...props}
        className={styles.input}
      />
    </div>
  );
};

export default Input;
