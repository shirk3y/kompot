import { createElement } from "react";

import { ChildInfo } from "./parser";

export const infoMap = new WeakMap();

export const createComponent = (
  info: ChildInfo,
  types: {}
) => externalProps => {
  if (typeof info === "string") return info;

  const { id, type, tag = "div", props, children } = info;

  const element = createElement(
    type ? types[type] : tag,
    { ...props, ...externalProps, "data-compot-id": id },
    ...children.map(childInfo => createComponent(childInfo, types)({}))
  );

  // console.warn(element);

  infoMap.set(element, info);

  return element;
};
