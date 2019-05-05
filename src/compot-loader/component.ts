import React from "react";

import { ChildInfo } from "./parser";

export const createComponent = (info: ChildInfo) => props =>
  typeof info === "string"
    ? info
    : React.createElement(
        info.type,
        { ...info.props, ...props },
        ...info.children.map(childInfo => createComponent(childInfo)({}))
      );
