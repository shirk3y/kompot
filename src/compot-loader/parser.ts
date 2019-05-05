enum NodeType {
  IMPORT = "import",
  COMPONENT = "component"
}

export interface ImportInfo {
  alias: string;
  symbol: string;
  module: string;
}

export interface ComponentInfo {
  name?: string;
  type: string | (() => any);
  props: {};
  children: ChildInfo[];
}

export type ChildInfo = ComponentInfo | string;

export const parseImports = (root = {}): ImportInfo[] => {
  const imports = [];

  for (const [module, moduleInfo] of Object.entries(
    root[NodeType.IMPORT] || {}
  )) {
    for (const [symbol, alias] of Object.entries(moduleInfo)) {
      imports.push({
        alias: alias || symbol,
        symbol,
        module
      });
    }
  }
  return imports;
};

export const parseComponents = (
  root = {},
  rootProps = {},
  imports
): ComponentInfo[] => {
  const makeInfo = (node): ComponentInfo => {
    const { tag = "div", type, props = {}, children } = node;
    const element = imports[type] || tag;

    const children_ = (Array.isArray(children)
      ? children
      : children
      ? [children]
      : []
    ).map(n => makeInfo(n));

    return {
      type: element,
      props: { ...rootProps, ...props },
      children: children_
    };
  };

  const components = [];

  for (const [name, node] of Object.entries(root[NodeType.COMPONENT] || {})) {
    components.push({ name, ...makeInfo(node) });
  }
  return components;
};
