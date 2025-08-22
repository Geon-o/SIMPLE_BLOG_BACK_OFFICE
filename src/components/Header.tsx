import React from 'react';
import { supabase } from '../apis/SupabaseClient';
import styles from '../style/Header.module.css';

const Header = () => {
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <header className={styles.header}>
            <div className={styles.title}>관리자 페이지</div>
            <button className={styles.button} onClick={handleLogout}>로그아웃</button>
        </header>
    );
};

export default Header;
