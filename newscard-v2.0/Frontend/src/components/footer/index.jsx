import React, { useState } from 'react';
import {
  Container,
  Typography,
  Input,
  Button,
  Link,
  Grid,
  TextField,
} from '@mui/material';
import './footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  return (
    <Container
      maxWidth="xl"
      sx={{ backgroundColor: '#007bff' }}
      className="footer"
    >
      <Grid
        container
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
      >
        <Typography variant="subtitle2" color="white" marginBottom={1}>
          Our Newsletter Signup
        </Typography>
        <Grid
          container
          justifyContent="center"
          alignItems="baseline"
          marginBottom={1}
        >
          <Typography variant="caption" color="white" marginRight={1}>
            By subscribing to our newsletter, you will always be updated with
            the latest news from us.
          </Typography>
          <Grid className="inputgrid">
            <TextField
              className="input"
              id="standard-email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Button
                    sx={{
                      textTransform: 'none',
                      color: 'white',
                      backgroundColor: '#9C2486',
                      borderRadius: 0,
                    }}
                  >
                    Subscribe
                  </Button>
                ),
              }}
              sx={{ color: 'whitesmoke', backgroundColor: 'white' }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent="center"
        style={{ backgroundColor: '#3F1F68', width: '100%' }}
      >
        <Typography variant="caption" color="white" marginRight={1}>
          <Link href="#" color="#fff">
            Terms & Privacy
          </Link>
        </Typography>
        <Typography variant="caption" color="white" marginRight={1}>
          |
        </Typography>
        <Typography variant="caption" color="white" marginRight={1}>
          <Link href="#" color="#fff">
            FAQ
          </Link>
        </Typography>
        <Typography variant="caption" color="white" marginRight={1}>
          |
        </Typography>
        <Typography variant="caption" color="white">
          <Link href="#" color="#fff">
            Contact Us
          </Link>
        </Typography>
      </Grid>
    </Container>
  );
};

export default Footer;
