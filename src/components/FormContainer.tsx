import React from 'react';
import styles from '../style/FormContainer.module.css';

interface FormContainerProps {
  children: React.ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
  return (
    <div className={styles.formContainerWrapper}>
      <div className={styles.formContainer}>
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
