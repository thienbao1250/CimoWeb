import { useRoutes } from "react-router-dom";
import LoginRoutes from "./LoginRoutes";
import ParentRoutes from "./ParentRoutes";

export default function ThemeRoutes() {
  return useRoutes([LoginRoutes, ParentRoutes]);
}
