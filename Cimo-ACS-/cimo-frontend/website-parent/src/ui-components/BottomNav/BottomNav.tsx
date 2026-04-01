import {
  HomeOutlined,
  BellOutlined,
  FileTextOutlined,
  UserOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import style from "./style.module.scss";

const menuItems = [
  { key: "/", icon: <HomeOutlined />, label: "Trang chủ" },
  { key: "/blog", icon: <FileTextOutlined />, label: "Tài liệu" },
  { key: "/check-in-out", icon: <CheckOutlined />, label: "Điểm danh" },
  { key: "notification", icon: <BellOutlined />, label: "Thông báo" },
  { key: "profile", icon: <UserOutlined />, label: "Cá nhân" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const hiddenRoutes = ["/check-in-out", "/student-off"];

  if (hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  const handleNavigation = (key: string) => {
    navigate(key);
  };

  return (
    <div className={style["bottom-nav"]}>
      {menuItems.map((item) => (
        <div
          key={item.key}
          className={`${style["nav-item"]} ${
            location.pathname === item.key ? style["active"] : ""
          }`}
          onClick={() => handleNavigation(item.key)}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
};

export default BottomNav;
