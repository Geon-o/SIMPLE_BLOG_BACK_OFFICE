import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import type { SelectChangeEvent, SxProps, Theme } from '@mui/material';
import type { JSX } from 'react';

interface DropdownProps {
    label?: string;
    value: string | null;
    onChange: (newValue: string | null) => void;
    options: { value: string; label: string }[];
    size?: 'small' | 'medium';
    sx?: SxProps<Theme>;
    disabled?: boolean;
}

const Dropdown = ({
                      label,
                      value,
                      onChange,
                      options,
                      size = 'small',
                      sx,
                      disabled = false,
                  }: DropdownProps) => {
    const labelId = label ? `${label.toLowerCase().replace(/\s/g, '-')}-label` : undefined;

    const handleChange = (event: SelectChangeEvent<unknown>) => {
        const selectedValue = event.target.value as string;
        onChange(selectedValue === '' ? null : selectedValue);
    };

    let labelElement: JSX.Element | null = null;
    if (label) {
        labelElement = <InputLabel id={labelId}>{label}</InputLabel>;
    }

    return (
        <FormControl fullWidth size={size} sx={sx} disabled={disabled}>
            {/* 위에서 생성한 변수를 렌더링합니다. */}
            {labelElement}

            <Select
                labelId={labelId}
                label={label}
                value={value || ''}
                onChange={handleChange}
            >
                <MenuItem value="">
                    <em>선택 안 함</em>
                </MenuItem>

                {options.map((option) => (
                    <MenuItem key={option.value} value={option.label}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default Dropdown;
