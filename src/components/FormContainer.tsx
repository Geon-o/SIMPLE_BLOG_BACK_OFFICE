import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface FormContainerProps {
  children: React.ReactNode;
  title?: string;
}

const FormContainer: React.FC<FormContainerProps> = ({ children, title }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f0f2f5',
        padding: '2rem',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: '2rem',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        {title && (
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
            {title}
          </Typography>
        )}
        {children}
      </Paper>
    </Box>
  );
};

export default FormContainer;
