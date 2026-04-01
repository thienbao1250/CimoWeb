import { lazy } from "react";
import Loadable from "../ui-components/Loadable";

const CimoHomePage = Loadable(lazy(() => import("../views/page/home/home")));

const TeacherRoutes = {
  path: "/",
  element: <CimoHomePage />,
};

export default TeacherRoutes;
