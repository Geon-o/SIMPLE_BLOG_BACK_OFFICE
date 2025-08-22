import React from 'react';
import styles from '../style/Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className={styles.button}
    >
      {children}
    </button>
  );
};

export default Button;
