import {useState, useEffect} from 'react';
import FormContainer from '../components/FormContainer';
import Input from '../components/Input';
import Button from '../components/Button';
import {supabase} from '../apis/SupabaseClient.ts';
import { Typography, Box } from '@mui/material';

const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [attempts, setAttempts] = useState(() => {
        const savedAttempts = localStorage.getItem('loginAttempts');
        return savedAttempts ? parseInt(savedAttempts, 10) : 0;
    });

    const [lockoutUntil, setLockoutUntil] = useState(() => {
        const savedLockout = localStorage.getItem('lockoutUntil');
        return savedLockout ? parseInt(savedLockout, 10) : 0;
    });

    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
        const now = Date.now();
        if (lockoutUntil > now) {
            const remaining = Math.ceil((lockoutUntil - now) / 1000);
            setRemainingTime(remaining);

            const interval = setInterval(() => {
                setRemainingTime(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        resetLockout();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [lockoutUntil]);

    const resetLockout = () => {
        setAttempts(0);
        localStorage.removeItem('loginAttempts');
        localStorage.removeItem('lockoutUntil');
        setLockoutUntil(0);
        setError(null);
    };

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
            resetLockout(); // Successful login resets attempts

        } catch (error: any) {
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);
            localStorage.setItem('loginAttempts', newAttempts.toString());

            if (newAttempts >= 3) {
                const lockoutTime = Date.now() + LOCKOUT_DURATION;
                setLockoutUntil(lockoutTime);
                localStorage.setItem('lockoutUntil', lockoutTime.toString());
                setError('로그인 시도 횟수를 초과했습니다.');
                setRemainingTime(Math.ceil(LOCKOUT_DURATION / 1000));
            } else {
                setError(`아이디 또는 비밀번호가 맞지 않습니다. (남은 시도: ${3 - newAttempts}번)`);
            }
        } finally {
            setLoading(false);
        }
    };

    const isLockedOut = lockoutUntil > Date.now();
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    return (
        <FormContainer>
            <Typography variant="h5" component="h2" align="center" sx={{ marginBottom: '1.5rem' }}>
                로그인
            </Typography>
            <form onSubmit={handleLogin}>
                <Input
                    label="이메일"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading || isLockedOut}
                />
                <Input
                    label="비밀번호"
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading || isLockedOut}
                />
                {error && (
                    <Typography color="error" align="center" sx={{ fontSize: '0.875rem', marginTop: '1rem' }}>
                        {error}
                    </Typography>
                )}

                {isLockedOut && (
                    <Box sx={{ textAlign: 'center', marginTop: '1rem', color: 'error.main' }}>
                        <Typography variant="body2">
                            {`로그인이 잠겼습니다. ${minutes}분 ${seconds}초 후에 다시 시도하세요.`}
                        </Typography>
                    </Box>
                )}

                <Box sx={{ marginTop: '1.5rem' }}>
                    <Button type="submit" disabled={loading || isLockedOut}>
                        {isLockedOut ? '잠김' : (loading ? '로그인 중...' : '로그인')}
                    </Button>
                </Box>
            </form>
        </FormContainer>
    );
};

export default LoginPage;
