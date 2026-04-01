import React from "react";
import style from "./style.module.scss";

interface ActionTitleProps {
  title: string;
}

const ActionTitle: React.FC<ActionTitleProps> = ({ title }) => {
  return <div className={style["info-student"]}>{title}</div>;
};

export default ActionTitle;
