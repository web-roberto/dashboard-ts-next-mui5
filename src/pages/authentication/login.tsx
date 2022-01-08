import { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Card, Container, Divider, Link, Typography } from '@mui/material';
import { GuestGuard } from '../../components/authentication/guest-guard';
import { AuthBanner } from '../../components/authentication/auth-banner';
import { AmplifyLogin } from '../../components/authentication/amplify-login';
import { Auth0Login } from '../../components/authentication/auth0-login';
import { FirebaseLogin } from '../../components/authentication/firebase-login';
import { JWTLogin } from '../../components/authentication/jwt-login';
import { Logo } from '../../components/logo';
import { useAuth } from '../../hooks/use-auth';
import { gtm } from '../../lib/gtm';

const platformIcons = {
  Amplify: '/static/icons/amplify.svg',
  Auth0: '/static/icons/auth0.svg',
  Firebase: '/static/icons/firebase.svg',
  JWT: '/static/icons/jwt.svg'
};

const Login: NextPage = () => {
  const router = useRouter();
  const { platform } = useAuth() as any;
  const { disableGuard } = router.query;

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Head>
        <title>
          Login | Material Kit Pro
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        <AuthBanner />
        <Container
          maxWidth="sm"
          sx={{
            py: {
              xs: '60px',
              md: '120px'
            }
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: (theme) => theme.palette.mode === 'dark'
                ? 'neutral.900'
                : 'neutral.100',
              borderColor: 'divider',
              borderRadius: 1,
              borderStyle: 'solid',
              borderWidth: 1,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              mb: 4,
              p: 2,
              '& > img': {
                height: 32,
                width: 'auto',
                flexGrow: 0,
                flexShrink: 0
              }
            }}
          >
            <Typography
              color="textSecondary"
              variant="caption"
            >
              The app authenticates via {platform}
            </Typography>
            <img
              alt="Auth platform"
              src={platformIcons[platform]}
            />
          </Box>
          <Card
            elevation={16}
            sx={{ p: 4 }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <NextLink
                href="/"
                passHref
              >
                <a>
                  <Logo
                    sx={{
                      height: 40,
                      width: 40
                    }}
                  />
                </a>
              </NextLink>
              <Typography variant="h4">
                Log in
              </Typography>
              <Typography
                color="textSecondary"
                sx={{ mt: 2 }}
                variant="body2"
              >
                Sign in on the internal platform
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3
              }}
            >
              {platform === 'Amplify' && <AmplifyLogin />}
              {platform === 'Auth0' && <Auth0Login />}
              {platform === 'Firebase' && <FirebaseLogin />}
              {platform === 'JWT' && <JWTLogin />}
            </Box>
            <Divider sx={{ my: 3 }} />
            <NextLink
              href={
                disableGuard
                  ? `/authentication/register?disableGuard=${disableGuard}`
                  : '/authentication/register'
              }
              passHref
            >
              <Link
                color="textSecondary"
                variant="body2"
              >
                Create new account
              </Link>
            </NextLink>
            {platform === 'Amplify' && (
              <NextLink
                href={
                  disableGuard
                    ? `/authentication/password-recovery?disableGuard=${disableGuard}`
                    : '/authentication/password-recovery'
                }
                passHref
              >
                <Link
                  color="textSecondary"
                  sx={{ mt: 1 }}
                  variant="body2"
                >
                  Forgot password
                </Link>
              </NextLink>
            )}
          </Card>
        </Container>
      </Box>
    </>
  );
};

Login.getLayout = (page) => (
  <GuestGuard>
    {page}
  </GuestGuard>
);

export default Login;
