import { Outlet } from "react-router-dom";

const MinimalLayout = () => {
  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Outlet />
    </div>
  );
};

export default MinimalLayout;
