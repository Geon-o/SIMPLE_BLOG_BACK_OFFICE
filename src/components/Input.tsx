import React from 'react';
import { TextField, type TextFieldProps } from '@mui/material';

interface CustomInputProps {
    label: string;
    id: string;
}

type Props = CustomInputProps & TextFieldProps;

const Input: React.FC<Props> = ({ label, id, ...rest }) => {
    return (
        <TextField
            label={label}
            id={id}
            fullWidth
            margin="normal"
            variant="outlined"
            {...rest}
            sx={{
                marginBottom: '1rem',
                ...rest.sx,
            }}
        />
    );
};

export default Input;