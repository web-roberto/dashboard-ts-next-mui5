import type { FC } from 'react';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormHelperText,
  Link,
  TextField,
  Typography
} from '@mui/material';
import { useAuth } from '../../hooks/use-auth';
import { useMounted } from '../../hooks/use-mounted';

export const FirebaseRegister: FC = (props) => {
  const isMounted = useMounted();
  const router = useRouter();
  const { createUserWithEmailAndPassword, signInWithGoogle } = useAuth() as any;
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      policy: true,
      submit: null
    },
    validationSchema: Yup.object({
      email: Yup
        .string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
      password: Yup
        .string()
        .min(7)
        .max(255)
        .required('Password is required'),
      policy: Yup
        .boolean()
        .oneOf([true], 'This field must be checked')
    }),
    onSubmit: async (values, helpers): Promise<void> => {
      try {
        await createUserWithEmailAndPassword(values.email, values.password);

        if (isMounted()) {
          const returnUrl = (router.query.returnUrl as string) || '/dashboard';
          router.push(returnUrl);
        }
      } catch (err) {
        console.error(err);

        if (isMounted()) {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
        }
      }
    }
  });

  const handleGoogleClick = async (): Promise<void> => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div {...props}>
      <Button
        fullWidth
        onClick={handleGoogleClick}
        size="large"
        sx={{
          backgroundColor: 'common.white',
          color: 'common.black',
          '&:hover': {
            backgroundColor: 'common.white',
            color: 'common.black'
          }
        }}
        variant="contained"
      >
        <Box
          alt="Google"
          component="img"
          src="/static/icons/google.svg"
          sx={{ mr: 1 }}
        />
        Google
      </Button>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          mt: 2
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Divider orientation="horizontal" />
        </Box>
        <Typography
          color="textSecondary"
          sx={{ m: 2 }}
          variant="body1"
        >
          OR
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Divider orientation="horizontal" />
        </Box>
      </Box>
      <form
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <TextField
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
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            ml: -1,
            mt: 2
          }}
        >
          <Checkbox
            checked={formik.values.policy}
            name="policy"
            onChange={formik.handleChange}
          />
          <Typography
            color="textSecondary"
            variant="body2"
          >
            I have read the
            {' '}
            <Link
              component="a"
              href="#"
            >
              Terms and Conditions
            </Link>
          </Typography>
        </Box>
        {Boolean(formik.touched.policy && formik.errors.policy) && (
          <FormHelperText error>
            {formik.errors.policy}
          </FormHelperText>
        )}
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
            Register
          </Button>
        </Box>
      </form>
    </div>
  );
};
