import React from "react";
import { List, Avatar } from "antd";
import style from "./style.module.scss";

interface Student {
  name: string;
  image: string;
}

interface Props {
  studentsData: Student[];
}

const StudentList: React.FC<Props> = ({ studentsData }) => {
  return (
    <div className={style.studentListPopup}>
      <List
        dataSource={studentsData}
        renderItem={(student) => (
          <List.Item className={style.studentItem}>
            <Avatar src={student.image} className={style.studentAvatar} />
            <span className={style.studentName}>{student.name}</span>
          </List.Item>
        )}
      />
    </div>
  );
};

export default StudentList;
