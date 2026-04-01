import { lazy } from "react";
import Loadable from "../ui-components/Loadable";
import NavMotion from "../layout/NavMotion";
import UserGuard from "../gurads/UserGuard";
import MinimalLayout from "../layout/MiniLayout";

const AuthLogin = Loadable(
  lazy(() => import("../views/pages/authentication/Login"))
);

const AuthOtp = Loadable(
  lazy(() => import("../views/pages/authentication/OTP"))
);

const LoginRoutes = {
  path: "/",
  element: (
    <NavMotion>
      <UserGuard>
        <MinimalLayout />
      </UserGuard>
    </NavMotion>
  ),
  children: [
    {
      path: "/login",
      element: <AuthLogin />,
    },
    {
      path: "/login/otp",
      element: <AuthOtp />,
    },
  ],
};

export default LoginRoutes;
