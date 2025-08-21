import { useState } from 'react';
import FormContainer from '../components/FormContainer';
import Input from '../components/Input';
import Button from '../components/Button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password });
    // Supabase login logic will go here
  };

  return (
    <FormContainer>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>로그인</h2>
      <form onSubmit={handleLogin}>
        <Input
          label="이메일"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div style={{ marginBottom: '1.5rem' }}>
          <Input
            label="비밀번호"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit">
          로그인
        </Button>
      </form>
    </FormContainer>
  );
};

export default LoginPage;
