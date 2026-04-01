import React from "react";
import style from "./style.module.scss";
import ActionTitle from "./ActionTitle";
import ActionCard from "./ActionCard";

interface IAction {
  icon: React.ReactNode;
  label: string;
}

interface ActionsWrapperProps {
  title?: string;
  actions: IAction[];
}

const ActionsWrapper: React.FC<ActionsWrapperProps> = ({ title, actions }) => {
  return (
    <div className={style["section"]}>
      {title && <ActionTitle title={title} />}
      <div
        className={style["quick-actions-container"]}
        style={{
          padding: title ? "10px" : "0px",
          background: title ? "#fff" : "transparent",
          borderRadius: title ? "0px 0px 10px 10px" : "none",
        }}
      >
        {actions.map((action, index) => (
          <ActionCard key={index} icon={action.icon} label={action.label} />
        ))}
      </div>
    </div>
  );
};

export default ActionsWrapper;
