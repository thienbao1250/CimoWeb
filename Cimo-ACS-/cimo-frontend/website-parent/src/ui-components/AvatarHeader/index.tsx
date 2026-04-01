import style from "./style.module.scss";

const AvatarHeader = () => {
  return (
    <div className={style["background"]}>
      <img
        style={{ width: "100%", maxHeight: "290px", display: "block" }}
        src="https://placehold.co/500"
        alt="background"
      />
    </div>
  );
};

export default AvatarHeader;
