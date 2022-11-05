import React, {useState} from 'react';''
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Display from './components/Display';
import './index.css';

/**
 * Boilerplate typescript React App 
 * @returns Whole app
 */
function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        cynliu
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

export default function App() {
  const [num, setNum] = useState(0);

  return (
    <Container maxWidth="xl">
      <Box sx={{ border: 0, my: 4, height: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          rtp.
        </Typography>
        <Display />
        <Copyright />
      </Box>
    </Container>
  );
}
