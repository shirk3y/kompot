import { createElement } from "react";

import { ComponentInfo } from "./parser";

export const infoMap = new WeakMap();

export const createComponent = (info: ComponentInfo, types: {}) => {
  const component = props => {
    if (typeof info === "string") {
      return info;
    }

    const {
      id,
      type,
      tag = "div",
      props: internalProps,
      children: childInfos
    } = info;

    const children = childInfos.map(childInfo =>
      typeof childInfo === "string"
        ? childInfo
        : createComponent(childInfo, types)({})
    );

    const element = createElement(
      type ? types[type] : tag,
      { ...internalProps, ...props, "data-compot-id": id },
      ...children
    );

    infoMap.set(element, info);

    return element;
  };

  component.displayName = info.id;

  return component;
};
