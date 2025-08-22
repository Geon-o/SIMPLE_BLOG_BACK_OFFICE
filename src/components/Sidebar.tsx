import { useState } from 'react';
import { Box, List, ListItemButton, ListItemText, Typography, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [openManagement, setOpenManagement] = useState(true); // Default to open
    const navigate = useNavigate();

    const handleClickManagement = () => {
        setOpenManagement(!openManagement);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <Box
            sx={{
                width: '240px',
                backgroundColor: '#2c5e4c',
                color: '#ffffff',
                padding: '1.5rem',
                flexShrink: 0, // Prevent shrinking
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    borderBottom: '1px solid #4a7c69',
                    paddingBottom: '0.5rem',
                }}
            >
                카테고리
            </Typography>
            <List>
                <ListItemButton onClick={handleClickManagement} sx={{ py: 0.4 }}>
                    <ListItemText primary="관리" sx={{ color: '#a0d2b0', fontWeight: 'bold' }} />
                    {openManagement ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openManagement} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ py: 0.4, pl: 4 }} onClick={() => handleNavigation('/posts')}>
                            <ListItemText primary="게시물 관리" />
                        </ListItemButton>
                        <ListItemButton sx={{ py: 0.4, pl: 4 }} onClick={() => handleNavigation('/categories')}>
                            <ListItemText primary="카테고리 관리" />
                        </ListItemButton>
                    </List>
                </Collapse>
            </List>
        </Box>
    );
};

export default Sidebar;
