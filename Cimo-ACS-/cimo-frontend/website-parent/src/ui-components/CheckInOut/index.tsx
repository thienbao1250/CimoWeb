import { useState } from "react";
import { Card, Typography, Button, Calendar } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import CheckInInfo from "./CheckInfo";
import useAuth from "../../hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import SoParent from "../../service/apis/parentService";
import { useEffect } from "react";

const { Title } = Typography;

const CheckInOut = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const today = dayjs(); // Lưu tháng hiện tại của hệ thống

  const { user } = useAuth();

  const fetchLists = useMutation({
    mutationFn: () => {
      return SoParent.getCheckIn(user?.id, today.format("YYYY-MM-DD"));
    },
    onSuccess: (data) => {
      console.log("test dâta", data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  useEffect(() => {
    fetchLists.mutate();
  }, []);

  // Hàm quay về tháng trước
  const handlePrevMonth = () => {
    const newMonth = currentMonth.subtract(1, "month");
    setCurrentMonth(newMonth);
    console.log("Tải lịch của tháng:", newMonth.format("MM/YYYY"));
  };

  // Hàm tiến tới tháng sau
  const handleNextMonth = () => {
    if (!currentMonth.isSame(today, "month")) {
      const newMonth = currentMonth.add(1, "month");
      setCurrentMonth(newMonth);
      console.log("Tải lịch của tháng:", newMonth.format("MM/YYYY"));
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <CheckInInfo date={currentMonth} />

      <Card
        style={{
          marginTop: 20,
          borderRadius: 10,
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        {/* Tiêu đề tháng và nút điều hướng */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 5,
            marginTop: 5,
          }}
        >
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={handlePrevMonth}
          />
          <Title style={{ margin: 0 }} level={5}>
            Tháng {currentMonth.format("MM/YYYY")}
          </Title>
          <Button
            type="text"
            icon={<RightOutlined />}
            onClick={handleNextMonth}
            disabled={currentMonth.isSame(today, "month")} // Tắt khi đang ở tháng hiện tại
          />
        </div>

        <Calendar
          fullscreen={false}
          value={currentMonth}
          headerRender={() => null} // Ẩn header mặc định của Calendar
        />
      </Card>
    </div>
  );
};

export default CheckInOut;
