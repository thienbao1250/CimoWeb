import { Typography } from "antd";
import style from "./style.module.scss";
import IBlog from "../../../types/blog";
import { useEffect, useState } from "react";
import NewsList from "../../../ui-components/News/NewsList";

const { Title } = Typography;

const featuredNews = {
  title: "Chương trình cải cách 2019",
  subtitle: "Sách giáo khoa mới 2019 sẽ có nhiều thay đổi mới nhằm...",
  image: "https://placehold.co/480x250/png",
};

const Blog = () => {
  const [blogs, setBlogs] = useState<IBlog[]>([]);
  useEffect(() => {
    setTimeout(() => {
      setBlogs([
        {
          id: "1",
          name: "Chương trình cải cách 2019",
          sumary: "Sách giáo khoa mới 2019 sẽ có nhiều thay đổi mới...",
          description:
            "S ách giáo khoa mới 2019 sẽ có nhiều thay đổi mới... Chương trình cải cách 201 ",
          imgs: ["https://placehold.co/400x200/png"],
        },
        {
          id: "2",
          name: "Những khó khăn khi học online",
          sumary: "Nói nhiều về khó khăn khi học online...",
          description:
            "S ách giáo khoa mới 2019 sẽ có nhiều thay đổi mới... Chương trình cải cách 201 ",
          imgs: ["https://placehold.co/400x200/png"],
        },
        {
          id: "3",
          name: "Làm sao quản lý thời gian",
          sumary: "Bí quyết quản lý thời gian hiệu quả cho học sinh",
          description:
            "S ách giáo khoa mới 2019 sẽ có nhiều thay đổi mới... Chương trình cải cách 201 ",
          imgs: ["https://placehold.co/400x200/png"],
        },
      ]);
    }, 10);
  }, []);

  return (
    <div className={style["blog-container"]}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <Title style={{ margin: 0 }} level={2}>
          Tin tức
        </Title>
      </div>
      <div className={style["featured-news"]}>
        <img src={featuredNews.image} alt={featuredNews.title} />
        <div className={style["news-content"]}>
          <Title level={4}>{featuredNews.title}</Title>
          <p>{featuredNews.subtitle}</p>
        </div>
      </div>
      <NewsList blogs={blogs} title="Tin tức" />
      <NewsList blogs={blogs} title="Tin tức" />
    </div>
  );
};

export default Blog;
