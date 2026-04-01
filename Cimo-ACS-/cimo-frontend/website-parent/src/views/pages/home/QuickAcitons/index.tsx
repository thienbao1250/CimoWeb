import { Student } from "../../../../contexts/AuthContext";
import ActionsWrapper from "./ActionsWrapper";
import {
  AppstoreOutlined,
  CalendarOutlined,
  HeartOutlined,
  StarOutlined,
  CheckOutlined,
  FormOutlined,
} from "@ant-design/icons";

const group1 = [
  { icon: <AppstoreOutlined />, label: "Dinh dưỡng" },
  { icon: <CalendarOutlined />, label: "Thời khoá biểu" },
  { icon: <HeartOutlined />, label: "Sức khoẻ" },
];

const group2 = [
  { icon: <StarOutlined />, label: "Sổ bé ngoan" },
  { icon: <CheckOutlined />, label: "Điểm danh" },
  { icon: <FormOutlined />, label: "Nghỉ học" },
];

interface QuickActionsProps {
  selectedStudent: Student | null;
}

const QuickActions: React.FC<QuickActionsProps> = ({ selectedStudent }) => {
  return (
    <>
      <ActionsWrapper
        title={selectedStudent?.soClass?.name || "Chưa có lớp"}
        actions={group1}
      />
      <ActionsWrapper actions={group2} />
    </>
  );
};

export default QuickActions;
