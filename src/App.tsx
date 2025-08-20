import { useStore } from '@/store/useStore';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';

function App() {
  const { count, increment, decrement } = useStore();

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Card sx={{ minWidth: 275, textAlign: 'center', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" component="div" gutterBottom>
              MUI Counter
            </Typography>
            <Typography variant="h2" component="p" sx={{ mb: 2 }}>
              {count}
            </Typography>
            <Box>
              <IconButton color="primary" aria-label="increment" onClick={increment} sx={{ mx: 1 }}>
                <AddCircle sx={{ fontSize: 40 }} />
              </IconButton>
              <IconButton color="secondary" aria-label="decrement" onClick={decrement} sx={{ mx: 1 }}>
                <RemoveCircle sx={{ fontSize: 40 }} />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default App;
