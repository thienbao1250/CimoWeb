import { Avatar, Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import style from "./style.module.scss";
import { useEffect } from "react";
import dayjs from "dayjs";
import useAuth from "../../../../hooks/useAuth";

interface Props {
  setPopupType: (type: "teacher" | "studentList") => void;
  setPopupVisible: (visible: boolean) => void;
  setSelectedStudent: (student: any) => void;
  selectedStudent: any;
}

const StudentInfo: React.FC<Props> = ({
  setPopupType,
  setPopupVisible,
  setSelectedStudent,
  selectedStudent,
}) => {
  const { user } = useAuth();
  const students = user?.students || [];

  useEffect(() => {
    if (students.length > 0) {
      setSelectedStudent(students[0]);
    }
  }, [students]);

  const handleSelectStudent = (student: any) => {
    setSelectedStudent(student);
  };

  return (
    <Card className={style["student-info-card"]}>
      <div className={style["box-info"]}>
        <div
          className={style["student-info"]}
          onClick={() => {
            setPopupType("studentList");
            setPopupVisible(true);
          }}
        >
          {selectedStudent ? (
            <>
              <p>
                {dayjs(selectedStudent.dob).format("DD/MM/YYYY")} |{" "}
                {selectedStudent.gender ? "Nam" : "Nữ"}
              </p>
              <h2>{selectedStudent.name}</h2>
            </>
          ) : (
            <p>Chưa có học sinh nào</p>
          )}
        </div>

        <div className={style["avatar-group"]}>
          {students.map((student: any) => (
            <Avatar
              key={student.id}
              size={40}
              icon={<UserOutlined />}
              className={`${style["avatar"]} ${
                selectedStudent?.id === student.id
                  ? style["selected-avatar"]
                  : ""
              }`}
              onClick={() => handleSelectStudent(student)}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default StudentInfo;
