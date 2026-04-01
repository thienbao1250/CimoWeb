import React from "react";
import { Card, Typography, Space } from "antd";
import {
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

interface Props {
  date: dayjs.Dayjs;
  checkInTime?: string;
  checkOutTime?: string;
  teacher?: string;
}

const CheckInInfo: React.FC<Props> = ({
  date,
  checkInTime = "--:--",
  checkOutTime = "--:--",
  teacher = "Chưa có thông tin",
}) => {
  return (
    <Card
      style={{
        borderRadius: "16px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        padding: "24px",
        backgroundColor: "#F9F9F9",
        width: "100%",
        textAlign: "left",
      }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        {/* Ngày */}
        <Space style={{ alignItems: "center", marginBottom: "10px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#EDE7FE",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CalendarOutlined style={{ color: "#722ED1", fontSize: "18px" }} />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              Ngày
            </Text>
            <br />
            <Text strong style={{ fontSize: "16px" }}>
              {date.format("DD.MM.YYYY")}
            </Text>
          </div>
        </Space>

        {/* Check-in / Check-out */}
        <Space
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: "10px",
          }}
        >
          <Space>
            <div
              style={{
                width: 40,
                height: 40,
                backgroundColor: "#E3F2FD",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ClockCircleOutlined
                style={{ color: "#1890FF", fontSize: "18px" }}
              />
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: "14px" }}>
                Check in
              </Text>
              <br />
              <Text strong style={{ fontSize: "16px" }}>
                {checkInTime}
              </Text>
            </div>
          </Space>

          <div
            style={{
              width: "1px",
              background: "#D9D9D9",
              height: "40px",
              margin: "0 10px",
            }}
          />

          <Space>
            <div>
              <Text type="secondary" style={{ fontSize: "14px" }}>
                Check out
              </Text>
              <br />
              <Text strong style={{ fontSize: "16px" }}>
                {checkOutTime}
              </Text>
            </div>
          </Space>
        </Space>

        {/* Giáo viên */}
        <Space style={{ alignItems: "center", marginBottom: "10px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#FFF3E0",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <UserOutlined style={{ color: "#FAAD14", fontSize: "18px" }} />
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: "14px" }}>
              Giáo viên
            </Text>
            <br />
            <Text strong style={{ fontSize: "16px" }}>
              {teacher}
            </Text>
          </div>
        </Space>
      </Space>
    </Card>
  );
};

export default CheckInInfo;
