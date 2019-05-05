enum NodeType {
  IMPORT = "import",
  COMPONENT = "component"
}

export type Scope = Readonly<{ [symbol: string]: any }>;

export interface ImportInfo {
  alias: string;
  symbol: string;
  module: string;
}

export interface ComponentInfo {
  id: string;
  name?: string;
  // displayName?: string;
  tag?: string;
  type?: string;
  props: {};
  children: NodeInfo[];
}

export type NodeInfo = ComponentInfo | string;

type ChildInput = NodeInfo | NodeInfo[];

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
  rootId,
  imports
): ComponentInfo[] => {
  const normalizeChildren = (children: ChildInput): NodeInfo[] =>
    (Array.isArray(children) ? children : [children]).filter(c => c);

  const parse = (
    { tag, type, props, name, children }: any,
    id
  ): ComponentInfo => ({
    id,
    tag,
    // displayName: name || tag,
    type,
    props: { ...rootProps, ...props },
    children: normalizeChildren(children).map((child, index) =>
      typeof child === "string" ? child : parse(child, `${id}.${index}`)
    )
  });

  const components = [];

  for (const [name, node] of Object.entries(root[NodeType.COMPONENT])) {
    components.push({
      name,
      ...parse(node as ComponentInfo, `${rootId}:${name}`)
    });
  }
  return components;
};
