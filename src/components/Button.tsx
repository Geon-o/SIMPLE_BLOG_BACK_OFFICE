import React from 'react';
import { Button as MuiButton, type ButtonProps as MuiButtonProps } from '@mui/material';

interface CustomButtonProps {
    children: React.ReactNode;
}

type Props = CustomButtonProps & MuiButtonProps;

const Button: React.FC<Props> = ({ children, ...rest }) => {
    return (
        <MuiButton
            variant="contained"
            color="primary"
            fullWidth
            {...rest}
            sx={{
                padding: '0.75rem',
                borderRadius: '4px',
                boxShadow: 'none',
                ...rest.sx,
            }}
        >
            {children}
        </MuiButton>
    );
};

export default Button;