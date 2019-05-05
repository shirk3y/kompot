import React from "react";

import { ChildInfo } from "./parser";

export const createComponent = (info: ChildInfo) => props => {
  if (typeof info === "string") return info;

  return React.createElement(
    info.type,
    { ...info.props, ...props },
    ...info.children.map(childInfo => createComponent(childInfo)({}))
  );
};
