const IMPORT_KEY = "import";
const EXPORT_KEY = "export";
const COMPONENT_KEY = "component";

// type createComponentHandler = (name: string, element: string, props: {}, childrenComponents: []) =>

// export const processObject = (obj) => Object.keys(obj).reduce((res, key) => {
//   res[key] = res[key] + 'abc'
// }, {})
const processObject = obj => obj;

export const parseComponent = (name, node, createComponent, createExport) => {
  if (typeof node === "string") {
    return node;
  }
  const { element = "div", props = {}, children = [] } = node;

  const processedProps = processObject(props);

  const childrenComponents = Array.isArray(children)
    ? children.map(child =>
        parseComponent(name, child, createComponent, createExport)
      )
    : parseComponent(name, children, createComponent, createExport);

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
  Object.entries(root).forEach(([key, node]) => {
    switch (key) {
      case IMPORT_KEY:
        parseImport(node, createImport);
        break;

      case COMPONENT_KEY:
        parseComponent(key, node, createComponent, createExport);
        break;

      default:
        console.warn("Unknown key:", key);
    }
  });
};
