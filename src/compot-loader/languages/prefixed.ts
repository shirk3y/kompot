const SYSTEM_PREFIX = "$";
const COMPONENT_PREFIX = "";
const META_PROP_PREFIX = "";
const PROP_PREFIX = ".";

import { groupByKeyPrefix, parsePrefix } from "../prefix";

export const parseComponent = (name, node, createComponent, createExport) => {
  if (typeof node === "string") {
    return node;
  }

  const {
    [META_PROP_PREFIX]: metaProps = {},
    [PROP_PREFIX]: props = {}
  } = groupByKeyPrefix(node) as any;

  const { tag = "div", type, render = [] } = metaProps;
  const element = type || tag;

  const childrenComponents = Array.isArray(render)
    ? render.map(child =>
        parseComponent(name, child, createComponent, createExport)
      )
    : parseComponent(name, render, createComponent, createExport);

  createComponent(name, element, props, childrenComponents);
  createExport(name);
};

export const parseImport = (node, createImport) => {
  for (const [moduleName, moduleDef] of Object.entries(node)) {
    for (const [importName, importAlias] of Object.entries(moduleDef)) {
      const finalAlias = importAlias ? importAlias : importName;
      createImport(moduleName, importName, finalAlias);
    }
  }
};

export const parseModule = (
  root,
  createImport,
  createExport,
  createComponent
) => {
  Object.entries(root).forEach(([rawName, node]) => {
    const [prefix, name] = parsePrefix(rawName);

    switch (prefix) {
      case SYSTEM_PREFIX:
        switch (name) {
          case "import":
            parseImport(node, createImport);
            break;
        }
        break;

      case COMPONENT_PREFIX:
        parseComponent(name, node, createComponent, createExport);
        break;
    }
  });
};
