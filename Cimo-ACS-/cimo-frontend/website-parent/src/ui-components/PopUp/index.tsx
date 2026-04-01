import React from "react";
import { Drawer } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import TeacherContact from "../../views/pages/home/TeacherInfo/Contact/Contact";
import StudentList from "../../views/pages/home/StudentInfo/StudentList/StudentList";

import style from "./style.module.scss";

interface PopupProps {
  visible: boolean;
  onClose: () => void;
  type: "teacher" | "studentList";
  teacherData?: {
    name: string;
    email: string;
    phone: string;
    image: string;
  };
  studentsData?: { name: string; image: string }[];
}

const Popup: React.FC<PopupProps> = ({
  visible,
  onClose,
  type,
  teacherData,
  studentsData,
}) => {
  return (
    <Drawer
      title={teacherData ? "Giáo viên chủ nhiệm" : "Danh sách học sinh"}
      className={style.Popup}
      placement="bottom"
      closable={true}
      onClose={onClose}
      open={visible}
      closeIcon={<CloseOutlined />}
      getContainer={false}
      style={{
        position: "fixed",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "480px",
        bottom: 0,
        borderRadius: "10px 10px 0 0",
        height: "auto",
      }}
      bodyStyle={{
        padding: "20px",
        overflow: "hidden",
      }}
    >
      {type === "teacher" && teacherData && (
        <TeacherContact teacherData={teacherData} />
      )}
      {type === "studentList" && studentsData && (
        <StudentList studentsData={studentsData} />
      )}
    </Drawer>
  );
};

export default Popup;
