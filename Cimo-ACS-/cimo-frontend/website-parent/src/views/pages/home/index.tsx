import SectionContainer from "../../../layout/sectionContainer";
import { useState } from "react";
import style from "./style.module.scss";

import AvatarHeader from "../../../ui-components/AvatarHeader";
import Popup from "../../../ui-components/PopUp";
import useAuth from "../../../hooks/useAuth";
import QuickActions from "./QuickAcitons";
import StudentInfo from "./StudentInfo/StudentInfo";
import TeacherInfo from "./TeacherInfo/TeacherInfo";
import NewsSection from "../../../ui-components/News/NewsSection";

const teacherInfo = {
  name: "Phạm Ngọc Lê Anh Thư",
  email: "thu.pham.98@gmail.com",
  phone: "093 7544 900",
  image: "https://placehold.co/150x150",
};

const Home = () => {
  const { user } = useAuth();

  const { wrapper, container } = style;
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState<"teacher" | "studentList">(
    "teacher"
  );
  const studentsData = user?.students || [];
  const [selectedStudent, setSelectedStudent] = useState(
    studentsData?.[0] || null
  );

  return (
    <>
      <div className={wrapper}>
        <div className={container}>
          <AvatarHeader />
          <SectionContainer>
            <StudentInfo
              setPopupType={setPopupType}
              setPopupVisible={setPopupVisible}
              setSelectedStudent={setSelectedStudent}
              selectedStudent={selectedStudent}
            />
            <QuickActions selectedStudent={selectedStudent} />
            <TeacherInfo
              setPopupType={setPopupType}
              setPopupVisible={setPopupVisible}
            />
            <NewsSection />
          </SectionContainer>
          <Popup
            visible={popupVisible}
            onClose={() => setPopupVisible(false)}
            type={popupType}
            teacherData={popupType === "teacher" ? teacherInfo : undefined}
            studentsData={
              popupType === "studentList" && studentsData
                ? studentsData.map((student: any) => ({
                    name: student.name,
                    image: "https://placehold.co/150x150",
                  }))
                : undefined
            }
          />
        </div>
      </div>
    </>
  );
};

export default Home;
