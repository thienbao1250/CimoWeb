/* eslint-disable no-unused-vars */
import { useMutation } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";
import { useBoolean } from "react-use";
import SoParents from "../service/apis/parentService";
import _ from "lodash";
import { jwtDecode } from "jwt-decode";
import axiosClient from "../util/axiosClient";
import { message } from "antd";
import Loader from "../ui-components/Loader";

export type Class = {
  id?: string;
  name?: string;
};

export type Student = {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
  soClass?: Class;
  [key: string]: any;
};
export type UserProFile = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  students?: Student[];
  [key: string]: any;
};

type AuthContextType = {
  user?: UserProFile | null;
  isLoginedIn: boolean;
  isInitialized: boolean;
  loadingPrepareData: boolean;
  sendOtp: (phone: string) => Promise<any>;
  verifyOtp: (otp: string) => Promise<any>;
  logout: () => void;
};

const initialState: AuthContextType = {
  user: null,
  isLoginedIn: false,
  isInitialized: false,
  loadingPrepareData: false,
  sendOtp: async () => {},
  verifyOtp: async () => {},
  logout: () => {},
};

export const verifyToken = (token: string | null) => {
  if (!token) return false;
  const decoded: { exp: number } = jwtDecode(token);
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp > currentTime;
};

const setSession = (token: string | null) => {
  if (token) {
    localStorage.setItem("token", token);
    axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete axiosClient.defaults.headers.Authorization;
  }
};
// ==============================|| Auth CONTEXT & PROVIDER ||============================== //

const AuthContext = createContext<AuthContextType>(initialState);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState(initialState);
  const [loadingPrepareData, toggleLoading] = useBoolean(false);
  const [messageApi, contextHolder] = message.useMessage();

  const mPrepareProfile = useMutation({
    mutationKey: ["GetProfile"],
    mutationFn: SoParents.getProfile,
    onSuccess: (data) => {
      //   console.log("API trả về:", data);
      //   const userData = _.get(data.data, "data", {});
      //   console.log("Dữ liệu user sau khi xử lý:", userData);
      console.log("API trả về:", data);

      setState((prevState) => ({
        ...prevState,
        isLoginedIn: true,
        isInitialized: true,
        user: data,
      }));
    },
    onError: (err) => {
      messageApi.error(err.message);
      logout();
    },
  });

  const init = async () => {
    try {
      const token = localStorage.getItem("token");
      const phone = localStorage.getItem("phone");

      if (phone) {
        setState((prevState) => ({
          ...prevState,
          user: {
            ...prevState.user,
            phone,
          },
        }));
      }
      if (token && verifyToken(token)) {
        setSession(token);
        await mPrepareProfile.mutate();
      } else {
        localStorage.removeItem("phone");
        logout();
      }
    } catch (error) {
      localStorage.removeItem("phone");
      logout();
    }
  };

  const sendOtp = async (phone: string) => {
    try {
      localStorage.setItem("phone", phone);
      setState((prevState) => ({
        ...prevState,
        user: {
          ...prevState.user,
          phone,
        },
      }));
      const res = await SoParents.sendOtp({ phone });
      return res;
    } catch (error: any) {
      return (
        messageApi.error(
          "Số diện thoại chưa đăng ký hoặc không hợp lệ. Vui lòng liên hệ với nhà trường!"
        ),
        Promise.reject(error)
      );
    }
  };

  const verifyOtp = async (otp: any) => {
    try {
      const phone = state.user?.phone;
      if (!phone) {
        throw new Error("Phone number is required");
      }

      const response = await SoParents.loginWithOtp({ phone, otp });
      const token = response.token;

      if (token) {
        setSession(token);
        setState((prevState) => ({
          ...prevState,
          isLoginedIn: true,
          isInitialized: true,
        }));
        mPrepareProfile.mutate();
      }

      return response;
    } catch (error: any) {
      return messageApi.error("Mã OTP không hợp lệ!"), Promise.reject(error);
    }
  };

  useEffect(() => {
    toggleLoading(mPrepareProfile.isPending);
  }, [mPrepareProfile.isPending]);

  useEffect(() => {
    init();
  }, []);

  const logout = async () => {
    setSession(null);
    setState({ ...state, isInitialized: true });
  };

  if (!state.isInitialized) return <Loader />;

  return (
    <>
      {contextHolder}
      <AuthContext.Provider
        value={{
          ...state,
          sendOtp,
          verifyOtp,
          logout,
          loadingPrepareData,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};

export default AuthContext;
