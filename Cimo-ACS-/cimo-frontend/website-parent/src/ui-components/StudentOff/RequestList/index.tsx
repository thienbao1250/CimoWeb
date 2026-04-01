import { List, Tag, Typography, Card, Space } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface LeaveRequest {
  id: number;
  startDate: string;
  endDate: string;
  days: number;
  status: "pending" | "approved" | "rejected";
  reason?: string;
}

const statusLabels: Record<LeaveRequest["status"], string> = {
  pending: "Đang chờ duyệt",
  approved: "Đã duyệt",
  rejected: "Từ chối",
};

const statusColors: Record<LeaveRequest["status"], string> = {
  pending: "orange",
  approved: "green",
  rejected: "red",
};

const leaveRequests: LeaveRequest[] = [
  {
    id: 1,
    startDate: "10/09/2019",
    endDate: "12/09/2019",
    days: 1,
    status: "pending",
    reason: "không rõ lý do",
  },
  {
    id: 2,
    startDate: "10/06/2019",
    endDate: "15/06/2019",
    days: 5,
    status: "pending",
    reason: "không rõ lý do",
  },
  {
    id: 3,
    startDate: "01/04/2019",
    endDate: "02/04/2019",
    days: 1,
    status: "approved",
    reason: "không rõ lý do",
  },
];

const LeaveRequestList = () => {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <Card
        style={{
          padding: "10px",
          borderRadius: "12px",
          textAlign: "center",
          background: "#f5f5f5",
          fontWeight: "bold",
        }}
      >
        Tháng 2/2019
      </Card>

      <List
        dataSource={leaveRequests}
        renderItem={(item) => (
          <Card
            style={{
              borderRadius: "12px",
              background:
                item.status === "approved" ? "#D4EDDA" : "rgb(197 206 212)",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              marginBottom: 10,
            }}
            bodyStyle={{
              padding: 0,
            }}
          >
            <List.Item
              style={{ display: "flex", flexDirection: "column", gap: "5px" }}
              actions={[<EllipsisOutlined key="more" />]}
            >
              <Text strong style={{ fontSize: "16px" }}>
                {item.startDate} Đến {item.endDate}
              </Text>
              <Tag
                color={statusColors[item.status]}
                style={{
                  fontSize: "12px",
                  fontWeight: "bold",
                  borderRadius: "12px",
                }}
              >
                {statusLabels[item.status]}
              </Tag>
              <Text type="secondary" style={{ fontSize: "14px" }}>
                {item.days} ngày
              </Text>
              <Text type="secondary" style={{ fontSize: "14px" }}>
                Lý do: {item.reason || "Không có"}
              </Text>
            </List.Item>
          </Card>
        )}
      />
    </Space>
  );
};

export default LeaveRequestList;
