import React, { useEffect, useContext } from "react";

enum NodeType {
  IMPORT = "import",
  COMPONENT = "component"
}

const Compot = ({
  yamlPath,
  importName = "App",
  editor = false,
  props = undefined,
  children
}) => {
  const root = require("json-loader!yaml-loader!../editor/App.compot.yml");
  let scope = {};

  if (root[NodeType.IMPORT]) {
    scope = handleImports(scope, root[NodeType.IMPORT]);
  }

  if (root[NodeType.COMPONENT]) {
    scope = handleComponents(scope, root[NodeType.COMPONENT], props);
  }

  return scope[importName];
};

const handleImports = (scope, node) => {
  for (const [moduleName, moduleDef] of Object.entries(node)) {
    for (const [importName, importAlias] of Object.entries(moduleDef)) {
      scope[importAlias || importName] = require(moduleName)[importName];
    }
  }
  return scope;
};

const handleComponents = (scope, node, externalProps = {}) => {
  for (const [name, componentNode] of Object.entries(node)) {
    scope[name] = renderComponent(scope, componentNode, externalProps);
  }
  return scope;
};

const renderComponent = (scope, node, externalProps = {}) => {
  if (typeof node === "string") {
    return node;
  }

  const { tag = "div", type, props = {}, render } = node;
  const element = scope[type] || tag;

  const children = Array.isArray(render)
    ? render.map(childNode => renderComponent(scope, childNode))
    : render && render.length > 0
    ? renderComponent(scope, render[0])
    : undefined;

  return React.createElement(
    element,
    { ...props, ...externalProps },
    ...children
  );
};

export default Compot;
