import { createContext, useEffect, useReducer } from 'react';
import type { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import Amplify, { Auth } from 'aws-amplify';
import { amplifyConfig } from '../config';
import type { User } from '../types/user';

Amplify.configure(amplifyConfig);

interface State {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextValue extends State {
  platform: 'Amplify';
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  verifyCode: (username: string, code: string) => Promise<void>;
  resendCode: (username: string) => Promise<void>;
  passwordRecovery: (username: string) => Promise<void>;
  passwordReset: (
    username: string,
    code: string,
    newPassword: string
  ) => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

type InitializeAction = {
  type: 'INITIALIZE';
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type LoginAction = {
  type: 'LOGIN';
  payload: {
    user: User;
  };
};

type LogoutAction = {
  type: 'LOGOUT';
};

type RegisterAction = {
  type: 'REGISTER';
};

type VerifyCodeAction = {
  type: 'VERIFY_CODE';
};

type ResendCodeAction = {
  type: 'RESEND_CODE';
}
  ;
type PasswordRecoveryAction = {
  type: 'PASSWORD_RECOVERY';
};

type PasswordResetAction = {
  type: 'PASSWORD_RESET';
};

type Action =
  | InitializeAction
  | LoginAction
  | LogoutAction
  | RegisterAction
  | VerifyCodeAction
  | ResendCodeAction
  | PasswordRecoveryAction
  | PasswordResetAction;

const initialState: State = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers: Record<string, (state: State, action: Action) => State> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state: State, action: LoginAction): State => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state: State): State => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state: State): State => ({ ...state }),
  VERIFY_CODE: (state: State): State => ({ ...state }),
  RESEND_CODE: (state: State): State => ({ ...state }),
  PASSWORD_RECOVERY: (state: State): State => ({ ...state }),
  PASSWORD_RESET: (state: State): State => ({ ...state })
};

const reducer = (state: State, action: Action): State => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

export const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  platform: 'Amplify',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  verifyCode: () => Promise.resolve(),
  resendCode: () => Promise.resolve(),
  passwordRecovery: () => Promise.resolve(),
  passwordReset: () => Promise.resolve()
});

export const AuthProvider: FC<AuthProviderProps> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      try {
        const user = await Auth.currentAuthenticatedUser();

        // Here you should extract the complete user profile to make it
        // available in your entire app.
        // The auth state only provides basic information.

        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: true,
            user: {
              id: user.sub,
              avatar: '/static/mock-images/avatars/avatar-anika_visser.png',
              email: user.attributes.email,
              name: 'Anika Visser',
              plan: 'Premium'
            }
          }
        });
      } catch (error) {
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const user = await Auth.signIn(email, password);

    if (user.challengeName) {
      console.error(`Unable to login, because challenge "${user.challengeName}" is mandated and we did not handle this case.`);
      return;
    }

    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          id: user.attributes.sub,
          avatar: '/static/mock-images/avatars/avatar-anika_visser.png',
          email: user.attributes.email,
          name: 'Anika Visser',
          plan: 'Premium'
        }
      }
    });
  };

  const logout = async (): Promise<void> => {
    await Auth.signOut();
    dispatch({
      type: 'LOGOUT'
    });
  };

  const register = async (email: string, password: string): Promise<void> => {
    await Auth.signUp({
      username: email,
      password,
      attributes: { email }
    });
    dispatch({
      type: 'REGISTER'
    });
  };

  const verifyCode = async (username: string, code: string): Promise<void> => {
    await Auth.confirmSignUp(username, code);
    dispatch({
      type: 'VERIFY_CODE'
    });
  };

  const resendCode = async (username: string): Promise<void> => {
    await Auth.resendSignUp(username);
    dispatch({
      type: 'RESEND_CODE'
    });
  };

  const passwordRecovery = async (username: string): Promise<void> => {
    await Auth.forgotPassword(username);
    dispatch({
      type: 'PASSWORD_RECOVERY'
    });
  };

  const passwordReset = async (
    username: string,
    code: string,
    newPassword: string
  ): Promise<void> => {
    await Auth.forgotPasswordSubmit(username, code, newPassword);
    dispatch({
      type: 'PASSWORD_RESET'
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        platform: 'Amplify',
        login,
        logout,
        register,
        verifyCode,
        resendCode,
        passwordRecovery,
        passwordReset
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const AuthConsumer = AuthContext.Consumer;
