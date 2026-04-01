import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import * as _ from 'lodash';
import moment from 'moment';
import React, { createContext, useEffect, useState } from 'react';
import { useBoolean } from 'react-use';
import authService from 'service/apis/authService';
import localstorageService from 'service/core/localstorage.service';
import Loader from 'ui-components/Loader';
import axios from 'utils/axiosClient';

type UserProfile = {
  id?: string | null;
  name?: string | null;
  image?: string | null;
  email?: string | null;
  [name: string]: any;
};

type AuthContextType = {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
  loadingPrepareData: boolean;

  logout: () => void;
  login: (username: string, password: string) => Promise<any>;
};

interface InitialLoginContextProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
}

// constant
const initialState: InitialLoginContextProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
};

const verifyToken: (st: string) => boolean = (st0k3n) => {
  if (!st0k3n) {
    return false;
  }
  const decoded: any = jwtDecode(st0k3n);
  const createDateTime = moment.unix(decoded.iat).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toDate().getTime();
  const toDateTime = new Date().setHours(0, 0, 0, 0);

  return createDateTime === toDateTime;
};

const setSession = (st0k3n?: string | null) => {
  if (st0k3n) {
    localstorageService.setItem('st0k3n', st0k3n);
    axios.defaults.headers.common.Authorization = `Bearer ${st0k3n}`;
  } else {
    localstorageService.removeItem('st0k3n');
    delete axios.defaults.headers.common.Authorization;
  }
};

// ==============================|| Auth CONTEXT & PROVIDER ||============================== //
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactElement }) => {
  const [state, setState] = useState<InitialLoginContextProps>(initialState);
  const [loadingPrepareData, toggleLoading] = useBoolean(false);

  const mPrepareProfile = useMutation({
    mutationKey: ['GetProfile'],
    mutationFn: () => authService.getProfile(),
    onSuccess: (res) => {
      setState({ isLoggedIn: true, isInitialized: true, user: _.get(res, 'data', {}) });
    },
    onError() {
      logout();
    },
    retry: true,
  });

  const init = async () => {
    try {
      const st0k3n = localstorageService.getItem('st0k3n', '');
      if (st0k3n && verifyToken(st0k3n)) {
        setSession(st0k3n);
        mPrepareProfile.mutate();
      } else {
        logout();
      }
    } catch (err) {
      logout();
    }
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    toggleLoading(mPrepareProfile.isPending);
  }, [mPrepareProfile.isPending]);

  const login = async (username: string, password: string) => {
    const response = await authService.login(username, password);

    const accessToken = _.get(response, 'data.token', '');
    if (accessToken) {
      setSession(accessToken);
      init();
    }
    return response;
  };

  const logout = async () => {
    setSession(null);
    setState({ ...initialState, isInitialized: true });
  };

  if (!state.isInitialized) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        loadingPrepareData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
