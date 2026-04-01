import { Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import blogService from "../../service/apis/blogService";
import IBlog from "../../types/blog";
import NewsList from "./NewsList";

const NewsSection = () => {
  const {
    data: blogs,
    isLoading,
    isError,
  } = useQuery<IBlog[]>({
    queryKey: ["blogs"],
    queryFn: blogService.getBlogs,
  });

  if (isLoading)
    return (
      <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
    );
  if (isError)
    return (
      <p style={{ textAlign: "center", color: "red" }}>
        Không thể tải dữ liệu!
      </p>
    );

  return <NewsList blogs={blogs || []} title="Tin mới" />;
};

export default NewsSection;
