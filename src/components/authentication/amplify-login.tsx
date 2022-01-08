import type { FC } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Alert, Box, Button, FormHelperText, TextField } from '@mui/material';
import { useAuth } from '../../hooks/use-auth';
import { useMounted } from '../../hooks/use-mounted';

export const AmplifyLogin: FC = (props) => {
  const isMounted = useMounted();
  const router = useRouter();
  const { login } = useAuth() as any;
  const formik = useFormik({
    initialValues: {
      email: 'demo@devias.io',
      password: 'Password123!',
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required')
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await login(values.email, values.password);

        if (isMounted()) {
          const returnUrl = (router.query.returnUrl as string) || '/dashboard';
          router.push(returnUrl);
        }
      } catch (err) {
        console.error(err);

        if (isMounted()) {
          if (err.code === 'UserNotConfirmedException') {
            sessionStorage.setItem('username', values.email);
            router.push('/authentication/verify-code');
            return;
          }

          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    }
  });

  return (
    <form
      noValidate
      onSubmit={formik.handleSubmit}
      {...props}
    >
      <TextField
        autoFocus
        error={Boolean(formik.touched.email && formik.errors.email)}
        fullWidth
        helperText={formik.touched.email && formik.errors.email}
        label="Email Address"
        margin="normal"
        name="email"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="email"
        value={formik.values.email}
      />
      <TextField
        error={Boolean(formik.touched.password && formik.errors.password)}
        fullWidth
        helperText={formik.touched.password && formik.errors.password}
        label="Password"
        margin="normal"
        name="password"
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        type="password"
        value={formik.values.password}
      />
      {formik.errors.submit && (
        <Box sx={{ mt: 3 }}>
          <FormHelperText error>
            {formik.errors.submit}
          </FormHelperText>
        </Box>
      )}
      <Box sx={{ mt: 2 }}>
        <Button
          disabled={formik.isSubmitting}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
        >
          Log In
        </Button>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Alert severity="info">
          <div>
            You can use
            {' '}
            <b>demo@devias.io</b>
            {' '}
            and password
            {' '}
            <b>Password123!</b>
          </div>
        </Alert>
      </Box>
    </form>
  );
};
