import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      style={{
        width: '100%',
        padding: '0.75rem',
        borderRadius: '4px',
        border: 'none',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        opacity: props.disabled ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
};

export default Button;
