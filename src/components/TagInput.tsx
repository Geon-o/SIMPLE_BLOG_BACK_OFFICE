
import { Box, IconButton, InputBase } from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import React from 'react';

interface TagInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function TagInput({ value, onChange, onSave, onCancel }: TagInputProps) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        border: '1px solid #2c5e4c',
        borderRadius: '16px',
        padding: '4px 8px',
        height: '32px',
      }}
    >
      <InputBase
        placeholder="태그명 입력"
        value={value}
        onChange={onChange}
        sx={{
          fontSize: '0.8125rem',
          fontFamily: 'inherit',
          color: '#2c5e4c',
          '& input': {
            padding: '4px 0 5px',
          },
        }}
        autoFocus
      />
      <IconButton size="small" onClick={onSave} sx={{ color: '#2c5e4c' }}>
        <Check />
      </IconButton>
      <IconButton size="small" onClick={onCancel} sx={{ color: '#2c5e4c' }}>
        <Close />
      </IconButton>
    </Box>
  );
}
