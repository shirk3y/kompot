enum NodeType {
  IMPORT = "import",
  COMPONENT = "component"
}

export type Scope = Readonly<{ [symbol: string]: any }>;

export interface ModuleInfo {
  name: string;
  imports: ImportInfo[];
  components: ComponentInfo[];
}

export interface ImportInfo {
  module: string;
  symbol: string;
  alias: string;
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

export interface ValueInfo {
  // vars: VarInfo
}

export type NodeInfo = ComponentInfo | string;

type ChildInput = NodeInfo | NodeInfo[];

export const parseModule = (root = {}, filename: string): ModuleInfo => {
  const imports = parseImports(root);
  return {
    name: filename,
    imports,
    components: parseComponents(root, {}, filename, imports)
  };
};

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
  const parse = (
    { tag, type, props, name, children }: any,
    id
  ): ComponentInfo => ({
    id,
    tag,
    name,
    // displayName: name || tag,
    type,
    props: { ...rootProps, ...props },
    children: normalizeChildren(children).map((child, index) =>
      typeof child === "string" ? child : parse(child, `${id}.${index}`)
    )
  });

  const components = [];

  for (const [name, node] of Object.entries(root[NodeType.COMPONENT])) {
    console.log(name, {
      ...parse(node as ComponentInfo, `${rootId}:${name}`),
      name
    });
    components.push({
      ...parse(node as ComponentInfo, `${rootId}:${name}`),
      name
    });
  }
  return components;
};

const normalizeChildren = (children: ChildInput): NodeInfo[] =>
  (Array.isArray(children) ? children : [children]).filter(c => c);
// const nextComponentId = parentId =>
