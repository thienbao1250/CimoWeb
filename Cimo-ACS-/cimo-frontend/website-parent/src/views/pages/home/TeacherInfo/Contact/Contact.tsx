import React from "react";
import { Avatar, Typography, Button } from "antd";
import { FacebookFilled, TwitterOutlined } from "@ant-design/icons";
const { Title, Text } = Typography;
import style from "./style.module.scss";

interface TeacherInfo {
  name: string;
  email: string;
  phone: string;
  image: string;
}

interface Props {
  teacherData: TeacherInfo;
}

const TeacherContact: React.FC<Props> = ({ teacherData }) => {
  return (
    <div className={style.teacherPopup}>
      <Avatar
        size={150}
        style={{ marginBottom: "20px" }}
        src={teacherData.image}
      />
      <Title level={4}>{teacherData.name}</Title>
      <Text type="secondary">{teacherData.email}</Text>
      <div className={style.socialIcons}>
        <FacebookFilled className={`${style.icon} ${style.fbIcon}`} />
        <TwitterOutlined className={`${style.icon} ${style.twitterIcon}`} />
      </div>
      <Button
        className={style.customButton}
        type="primary"
        shape="round"
        size="large"
        block
      >
        {teacherData.phone}
      </Button>
    </div>
  );
};

export default TeacherContact;
