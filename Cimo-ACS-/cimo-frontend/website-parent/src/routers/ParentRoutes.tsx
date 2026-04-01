import { Outlet } from "react-router-dom";
import GuestGuard from "../gurads/GuestGuard";
import Container from "../layout/ParentLayout/container";
import Loadable from "../ui-components/Loadable";
import { lazy } from "react";
import BottomNav from "../ui-components/BottomNav/BottomNav";

const CimoHomePage = Loadable(lazy(() => import("../views/pages/home")));
const CimoBlogPage = Loadable(lazy(() => import("../views/pages/blog")));
const CimoCheckIn = Loadable(lazy(() => import("../views/pages/checkInOut")));
const CimoCheckOff = Loadable(lazy(() => import("../views/pages//studentOff")));

const ParentRoutes = {
  path: "/",
  element: (
    <GuestGuard>
      <Container>
        <Outlet />
        <BottomNav />
      </Container>
    </GuestGuard>
  ),
  children: [
    { index: true, element: <CimoHomePage /> },
    { path: "blog", element: <CimoBlogPage /> },
    { path: "check-in-out", element: <CimoCheckIn /> },
    { path: "student-off", element: <CimoCheckOff /> },
  ],
};

export default ParentRoutes;
