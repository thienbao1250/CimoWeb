import { ReactNode } from "react";
import { Layout } from "antd";

interface SectionContainerProps {
  children: ReactNode;
}

const SectionContainer = ({ children }: SectionContainerProps) => {
  return (
    <Layout
      style={{
        background: "transparent",
        position: "relative",
        width: "100%",
        top: "5%",
        padding: "20px",
      }}
    >
      {children}
    </Layout>
  );
};

export default SectionContainer;
