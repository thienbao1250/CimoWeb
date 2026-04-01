import { Card } from "antd";
import style from "./style.module.scss";

const dataTeacher = [{ name: "Nguyễn Thanh Hằng" }];

interface Props {
  setPopupType: (type: "teacher" | "studentList") => void;
  setPopupVisible: (visible: boolean) => void;
}

const TeacherInfo: React.FC<Props> = ({ setPopupType, setPopupVisible }) => {
  return (
    <div className={style["section"]}>
      {dataTeacher.map((item, index) => (
        <Card
          onClick={() => {
            setPopupType("teacher");
            setPopupVisible(true);
          }}
          bodyStyle={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 15px",
            width: "100%",
          }}
          className={style["teacher-info"]}
          key={index}
        >
          <div className={`${style["box"]} ${style["label"]}`}>
            Cô giáo chủ nhiệm
          </div>
          <div className={`${style["box"]} ${style["name"]}`}>{item.name}</div>
        </Card>
      ))}
    </div>
  );
};

export default TeacherInfo;
