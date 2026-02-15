import Sidebar from "../Teacher/Sidebar";
import Navbar from "../../Navbar";

const TeacherLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ marginLeft: "220px", width: "100%", padding: "20px" }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default TeacherLayout;
