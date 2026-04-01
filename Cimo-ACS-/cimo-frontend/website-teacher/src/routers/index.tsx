import { useRoutes } from "react-router-dom";
import LoginRouter from "./LoginRouter";
import TeacherRoutes from "./TeacherRoutes";

export default function ThemeRouters() {
  return useRoutes([LoginRouter, TeacherRoutes]);
}
