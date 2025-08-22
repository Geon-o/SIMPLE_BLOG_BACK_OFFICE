import React from 'react';
import { TextField } from '@mui/material';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <TextField
      label={label}
      id={id}
      fullWidth
      margin="normal"
      variant="outlined"
      {...props}
      sx={{
        marginBottom: '1rem',
      }}
    />
  );
};

export default Input;
