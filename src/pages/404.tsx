import { useEffect } from 'react';
import type { NextPage } from 'next';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Button, Container, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { gtm } from '../lib/gtm';

const NotFound: NextPage = () => {
  const theme = useTheme();
  const mobileDevice = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Head>
        <title>
          Error: Not Found | Material Kit Pro
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          backgroundColor: 'background.paper',
          display: 'flex',
          flexGrow: 1,
          py: '80px'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            align="center"
            variant={mobileDevice ? 'h4' : 'h1'}
          >
            404: The page you are looking for isn’t here
          </Typography>
          <Typography
            align="center"
            color="textSecondary"
            sx={{ mt: 0.5 }}
            variant="subtitle2"
          >
            You either tried some shady route or you
            came here by mistake. Whichever it is, try using the
            navigation.
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6
            }}
          >
            <Box
              alt="Under development"
              component="img"
              src={`/static/error/error404_${theme.palette.mode}.svg`}
              sx={{
                height: 'auto',
                maxWidth: '100%',
                width: 400
              }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 6
            }}
          >
            <NextLink
              href="/dashboard"
              passHref
            >
              <Button
                component="a"
                variant="outlined"
              >
                Back to Dashboard
              </Button>
            </NextLink>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default NotFound;
