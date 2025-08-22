import React from 'react';
import { Button as MuiButton } from '@mui/material';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, ...props }) => {
  return (
    <MuiButton
      variant="contained"
      color="primary"
      fullWidth
      {...props}
      sx={{
        padding: '0.75rem',
        borderRadius: '4px',
        boxShadow: 'none',
      }}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
