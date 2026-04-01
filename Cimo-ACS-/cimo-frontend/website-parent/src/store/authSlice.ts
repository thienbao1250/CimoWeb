import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "../util/axiosClient";

interface IParentProfile {
  id: string;
  name: string;
  dob: string;
  gender: boolean;
  phone: string;
  email: string;
  address: string;
  nationalId: string;
  job: string;
  students: any[];
}

interface AuthState {
  user: IParentProfile | null;
  token: string | null;
  phone: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  phone: localStorage.getItem("phone") || null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        user: IParentProfile;
        token: string;
        phone: string;
      }>
    ) => {
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
      axiosClient.defaults.headers.Authorization = `Bearer ${action.payload.token}`;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("phone");
    },
    setProfile: (state, action: PayloadAction<IParentProfile>) => {
      state.user = action.payload;
    },
  },
});

export const { login, logout, setProfile } = authSlice.actions;
export default authSlice.reducer;
