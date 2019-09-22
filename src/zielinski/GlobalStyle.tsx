import React from "react";
import { Global, css } from "@emotion/core";

export default ({ children }) => (
  <Global
    styles={css`
      ${children}
    `}
  />
);
