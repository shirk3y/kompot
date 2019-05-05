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

type RawChildInfo = ChildInfo | ChildInfo[];

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
  const normalizeChildren = (children: RawChildInfo): ChildInfo[] =>
    (Array.isArray(children) ? children : [children]).filter(c => c);

  const parse = ({
    tag = "div",
    type,
    props = {},
    children
  }): ComponentInfo => ({
    type: imports[type] || tag,
    props: { ...rootProps, ...props },
    children: normalizeChildren(children).map(n =>
      typeof n === "string" ? n : parse(n)
    )
  });

  const components = [];

  for (const [name, node] of Object.entries(root[NodeType.COMPONENT])) {
    components.push({ name, ...parse(node as ComponentInfo) });
  }
  return components;
};
