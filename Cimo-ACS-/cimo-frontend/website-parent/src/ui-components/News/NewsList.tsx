import { Card, Typography } from "antd";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import style from "./style.module.scss";
import IBlog from "../../types/blog";

const { Title } = Typography;

interface Props {
  blogs: IBlog[];
  title: string;
}

const NewsList: React.FC<Props> = ({ blogs, title }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1.1,
    slidesToScroll: 1,
    autoplaySpeed: 3000,
    arrows: false,
    centerMode: true,
  };

  return (
    <div className={style["news-section"]}>
      <div className={style["news-header"]}>
        <Title level={5}>{title}</Title>
        <a href="#" className={style["view-all"]}>
          Xem tất cả »
        </a>
      </div>

      <Slider {...settings} className={style["news-slider"]}>
        {blogs.map((blog) => (
          <div key={blog.id} className={style["news-card-wrapper"]}>
            <Card
              bodyStyle={{
                padding: "5px 10px",
              }}
              hoverable
              className={style["news-card"]}
              cover={
                <div className={style["news-image-container"]}>
                  <img
                    alt={blog.name}
                    src={blog.imgs?.[0] || "https://placehold.co/400x200/png"}
                    className={style["news-image"]}
                  />
                </div>
              }
            >
              <Title
                style={{ fontSize: "14px" }}
                level={5}
                className={style["news-title"]}
              >
                {blog.name}
              </Title>
              <p className={style["news-subtitle"]}>{blog.sumary}</p>
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default NewsList;
