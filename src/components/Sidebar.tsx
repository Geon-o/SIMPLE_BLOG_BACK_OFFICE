import React from 'react';
import styles from '../style/Sidebar.module.css';

const Sidebar = () => {
    return (
        <aside className={styles.sidebar}>
            <h2 className={styles.title}>카테고리</h2>
            {/* Category list will go here */}
        </aside>
    );
};

export default Sidebar;
