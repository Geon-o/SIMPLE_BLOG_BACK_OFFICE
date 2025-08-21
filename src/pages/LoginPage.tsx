import {useState} from 'react';
import FormContainer from '../components/FormContainer';
import Input from '../components/Input';
import Button from '../components/Button';

import {supabase} from '../apis/SupabaseClient.ts';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const {error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) {
                throw error;
            }

        } catch (error: any) {
            setError('로그인중 에러발생');
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormContainer>
            <h2 style={{textAlign: 'center', marginBottom: '1.5rem'}}>로그인</h2>
            <form onSubmit={handleLogin}>
                <Input
                    label="이메일"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                />
                <Input
                    label="비밀번호"
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                />
                {error && <p style={{
                    color: 'red', textAlign: 'center', fontSize: '0.875rem',
                    marginTop: '1rem'
                }}>{error}</p>}
                <div style={{marginTop: '1.5rem'}}>
                    <Button type="submit" disabled={loading}>
                        {loading ? '로그인 중...' : '로그인'}
                    </Button>
                </div>
            </form>
        </FormContainer>
    );
};

export default LoginPage;
