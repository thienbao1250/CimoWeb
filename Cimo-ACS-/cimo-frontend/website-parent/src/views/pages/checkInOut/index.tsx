import { Typography } from "antd";
import CheckInOut from "../../../ui-components/CheckInOut";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const CheckInOutPage = () => {
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
            Điểm Danh
          </Title>
        </div>
      </div>
      <CheckInOut />
    </div>
  );
};

export default CheckInOutPage;
