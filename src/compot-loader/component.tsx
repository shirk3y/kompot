import { jsx } from "@emotion/core";

import { ComponentInfo } from "./parser";

export const infoMap = new WeakMap();

export const renderComponent = (info: ComponentInfo, props?: any) => {
  if (typeof info === "string") {
    return info;
  }

  const { id, type = "div", props: internalProps, children: childInfos } = info;

  const children = childInfos.map(childInfo =>
    typeof childInfo === "string" ? childInfo : renderComponent(childInfo)
  );

  const element = jsx(
    type,
    { ...internalProps, ...props, "data-compot-id": id },
    ...children
  );

  infoMap.set(element, info);

  return element;
};
