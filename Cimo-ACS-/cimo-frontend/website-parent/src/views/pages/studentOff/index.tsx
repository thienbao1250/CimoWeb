import { useNavigate } from "react-router-dom";
import LeaveRequestList from "../../../ui-components/StudentOff/RequestList";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
const { Title } = Typography;

const StudentOff = () => {
  const navigate = useNavigate();

  return (
    <div className="containerPage">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ArrowLeftOutlined
            onClick={() => navigate("/")}
            style={{ fontSize: "20px", cursor: "pointer" }}
          />
          <Title style={{ margin: 0, fontSize: "20px" }} level={2}>
            Đơn xin nghỉ học
          </Title>
        </div>
        <Button shape="circle" icon={<PlusOutlined />} />
      </div>
      <LeaveRequestList />
    </div>
  );
};

export default StudentOff;
