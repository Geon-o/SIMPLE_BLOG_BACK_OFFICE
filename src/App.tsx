import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { supabase } from './apis/supabaseClient';
import type { Session } from '@supabase/supabase-js';

const AdminDashboard = () => {
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div style={{padding: '2rem'}}>
            <h2>Admin Dashboard</h2>
            <p>Welcome to the blog management page.</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

const useAuth = () => {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        // 컴포넌트가 처음 렌더링될 때 현재 세션 정보를 가져옵니다.
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
        });

        // 로그인, 로그아웃 등 인증 상태에 변경이 생길 때마다 콜백 함수가 실행됩니다.
        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
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
            <Route
                path="/"
                element={isAuthenticated ? <AdminDashboard/> : <Navigate to="/login"/>}
            />
            {/* Redirect any other path to the main page logic */}
            <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
    );
}

export default App;
