import { useState } from "react";
import { Calendar, Card, Typography, Button, Badge } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/vi";

const { Title } = Typography;

import { motion } from "framer-motion";
interface Events {
  [date: string]: { type: string; content: string }[];
}

const events: Events = {
  "2025-03-10": [{ type: "success", content: "Check-in sớm" }],
  "2025-03-15": [{ type: "warning", content: "Check-out trễ" }],
  "2025-03-22": [{ type: "error", content: "Nghỉ học" }],
};

const CustomCalendar = () => {
  const today = dayjs();
  const [currentMonth, setCurrentMonth] = useState(today);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => prev.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    if (!currentMonth.isSame(today, "month")) {
      setCurrentMonth((prev) => prev.add(1, "month"));
    }
  };

  return (
    // <Card
    //   style={{
    //     marginTop: 20,
    //     borderRadius: 12,
    //     boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
    //     backgroundColor: "#F5F7FA",
    //   }}
    // >
    //   {/* Điều hướng tháng */}
    //   <div
    //     style={{
    //       display: "flex",
    //       justifyContent: "space-between",
    //       alignItems: "center",
    //       paddingBottom: "10px",
    //     }}
    //   >
    //     <Button type="text" icon={<LeftOutlined />} onClick={handlePrevMonth} />
    //     <Title level={5}>Tháng {currentMonth.format("MM/YYYY")}</Title>
    //     <Button
    //       type="text"
    //       icon={<RightOutlined />}
    //       onClick={handleNextMonth}
    //       disabled={currentMonth.isSame(today, "month")}
    //     />
    //   </div>

    //   {/* Lịch */}
    //   <Calendar
    //     fullscreen={false}
    //     value={currentMonth}
    //     headerRender={() => null} // Ẩn header mặc định
    //     dateCellRender={(date) => {
    //       const formattedDate = date.format("YYYY-MM-DD");
    //       return (
    //         <div
    //           style={{
    //             textAlign: "center",
    //             fontSize: "14px",
    //             color: date.isSame(today, "day") ? "white" : "black",
    //             backgroundColor: date.isSame(today, "day")
    //               ? "#1890FF"
    //               : "transparent",
    //             borderRadius: "6px",
    //             padding: "5px",
    //           }}
    //         >
    //           {date.date()}
    //           {/* Hiển thị sự kiện */}
    //           {events[formattedDate] &&
    //             events[formattedDate].map((event, index) => (
    //               <Badge
    //                 key={index}
    //                 status={
    //                   event.type as
    //                     | "success"
    //                     | "warning"
    //                     | "error"
    //                     | "default"
    //                     | "processing"
    //                 }
    //               />
    //             ))}
    //         </div>
    //       );
    //     }}
    //   />
    // </Card>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        style={{
          marginTop: 20,
          borderRadius: 16,
          boxShadow: "0px 6px 12px rgba(0,0,0,0.1)",
          backgroundColor: "#ffffff",
          padding: "16px",
        }}
      >
        {/* Điều hướng tháng */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={handlePrevMonth}
            style={{ fontSize: "16px", color: "#1890ff" }}
          />
          <Title level={4} style={{ margin: 0 }}>
            Tháng {currentMonth.format("MM/YYYY")}
          </Title>
          <Button
            type="text"
            icon={<RightOutlined />}
            onClick={handleNextMonth}
            disabled={currentMonth.isSame(today, "month")}
            style={{
              fontSize: "16px",
              color: currentMonth.isSame(today, "month") ? "#ccc" : "#1890ff",
            }}
          />
        </div>

        {/* Lịch */}
        <Calendar
          fullscreen={false}
          value={currentMonth}
          headerRender={() => null} // Ẩn header mặc định
          dateCellRender={(date) => {
            const formattedDate = date.format("YYYY-MM-DD");
            return (
              <div
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  fontWeight: date.isSame(today, "day") ? "bold" : "normal",
                  color: date.isSame(today, "day") ? "white" : "black",
                  background: date.isSame(today, "day")
                    ? "linear-gradient(45deg, #1890ff, #85a5ff)"
                    : "transparent",
                  borderRadius: date.isSame(today, "day") ? "12px" : "0px",
                  padding: "6px",
                  transition: "0.3s ease",
                }}
              >
                {date.date()}
                {/* Hiển thị sự kiện */}
                {events[formattedDate] &&
                  events[formattedDate].map((event, index) => (
                    <Badge
                      key={index}
                      status={
                        event.type as
                          | "success"
                          | "warning"
                          | "error"
                          | "default"
                          | "processing"
                      }
                    />
                  ))}
              </div>
            );
          }}
        />
      </Card>
    </motion.div>
  );
};

export default CustomCalendar;
