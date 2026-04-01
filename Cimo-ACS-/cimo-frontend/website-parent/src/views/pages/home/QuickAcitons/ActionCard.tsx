import { Card } from "antd";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import style from "./style.module.scss";

interface ActionCardProps {
  icon: ReactNode;
  label: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ icon, label }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    if (label === "Nghỉ học") {
      navigate("/student-off");
    }
    if (label === "Điểm danh") {
      navigate("/check-in-out");
    }
  };

  return (
    <Card
      className={style["quick-action"]}
      onClick={handleRedirect}
      hoverable
      style={{ border: "none", marginRight: "10px" }}
      bodyStyle={{
        textAlign: "center",
        cursor: "pointer",
        color: "#ce5b5b",
        padding: "0",
        paddingBottom: "20px",
        paddingTop: "20px",
      }}
    >
      <div style={{ fontSize: 16 }}>{icon}</div>
      <div className={style["label"]}>{label}</div>
    </Card>
  );
};

export default ActionCard;
