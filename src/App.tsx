import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PostCreationPage from './pages/PostCreationPage';
import PostManagementPage from './pages/PostManagementPage';
import TagManagementPage from './pages/TagManagementPage';
import { supabase } from './apis/SupabaseClient';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { Box } from '@mui/material';

const AdminDashboard = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                overflow: 'hidden',
            }}
        >
            <Header />
            <Box
                sx={{
                    display: 'flex',
                    flex: 1,
                    overflow: 'hidden',
                }}
            >
                <Sidebar />
                <Box
                    component="main"
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '2rem',
                    }}
                >
                    <Outlet /> {/* This is where nested routes will render */}
                </Box>
            </Box>
        </Box>
    );
};

const useAuth = () => {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        // 컴포넌트가 처음 렌더링될 때 현재 세션 정보를 가져옵니다.
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // 로그인, 로그아웃 등 인증 상태에 변경이 생길 때마다 콜백 함수가 실행됩니다.
        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            setSession(session);
        });

        // 컴포넌트가 언마운트될 때 리스너를 정리합니다.
        return () => subscription.unsubscribe();
    }, []);

    return session;
};

function App() {
    const isAuthenticated = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/"/> : <LoginPage/>}
            />
            <Route path="/" element={isAuthenticated ? <AdminDashboard/> : <Navigate to="/login"/>}>
                <Route index element={<p>대시보드 메인 페이지</p>} /> {/* Default content for / */}
                <Route path="posts" element={<PostManagementPage />} />
                <Route path="posts/create" element={<PostCreationPage />} />
                <Route path="tags" element={<TagManagementPage />} />
            </Route>
            {/* Redirect any other path to the main page logic */}
            <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
    );
}

export default App;
