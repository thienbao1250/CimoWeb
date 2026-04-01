import { lazy } from "react";
import Loadable from "../ui-components/Loadable";
import NavMotion from "../layout/NavMotion";
import MinimalLayout from "../layout/MiniLayout";

const AuthRouter = Loadable(
  lazy(() => import("../views/page/authentication/Login"))
);

const LoginRouter = {
  path: "/",
  element: (
    <NavMotion>
      <MinimalLayout />
    </NavMotion>
  ),
  children: [
    {
      path: "/login",
      element: <AuthRouter />,
    },
  ],
};

export default LoginRouter;
