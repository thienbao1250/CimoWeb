import { ReactNode } from "react";
import { Layout } from "antd";

interface ContainerProps {
  children: ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <Layout
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        // height: "100vh",
        background: "#rgb(243 237 237)",
        minHeight: "900px",
      }}
    >
      {children}
    </Layout>
  );
};

export default Container;
