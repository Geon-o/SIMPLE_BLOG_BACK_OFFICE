import React from 'react';
import { Box, Paper } from '@mui/material';

interface FormContainerProps {
  children: React.ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: '2rem',
          borderRadius: '8px',
          width: '360px',
        }}
      >
        {children}
      </Paper>
    </Box>
  );
};

export default FormContainer;
