import { supabase } from '../apis/SupabaseClient';
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button as MuiButton } from '@mui/material';

const Header = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AppBar position="static" color="white" sx={{ height: '60px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <Toolbar sx={{ justifyContent: 'space-between', height: '100%' }}>
                <Typography
                    variant="h6"
                    component="div"
                    color="black"
                    sx={{
                        fontWeight: 'bold',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        navigate('/');
                    }}
                >
                    관리자 페이지
                </Typography>
                <MuiButton variant="text" onClick={handleLogout} sx={{
                    backgroundColor: '#2c5e4c',
                    color: '#ffffff',
                    borderRadius: '13px',
                }}>
                    로그아웃
                </MuiButton>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
