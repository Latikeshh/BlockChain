import TeacherSidebar from "../Teacher/TeacherSidebar";
import "./TeacherLayout.css";

const TeacherLayout = ({ children }) => {
  return (
    <div className="teacher-layout">
      <div className="teacher-layout-content">
        <TeacherSidebar />
        <div className="teacher-main-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TeacherLayout;
