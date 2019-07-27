import React, { useState } from "react";
import { CSSEditor, PositionValue } from "@microsoft/fast-tooling-react";

export const FastTooling = () => {
  const [data, setData] = useState({
    position: PositionValue.absolute,
    left: "0"
  });

  return <CSSEditor data={data} onChange={data => setData(data)} />;
};
