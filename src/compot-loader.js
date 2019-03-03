module.exports = function(source, map) {
  const yaml = require("js-yaml");
  const def = yaml.load(source);

  const createComponent = node => {
    if (typeof node === "string") {
      return JSON.stringify(node);
    }

    const { tag = "div", children = [], ...props } = node;

    const childDefs = Array.isArray(children) ? children : [children];

    const _children = childDefs.map(createComponent);

    return `React.createElement(${JSON.stringify(tag)}, ${JSON.stringify(
      props
    )}, \n${_children})`;
  };

  this.callback(
    null,
    `
    const React = require('react');

    module.exports = function() {
      return ${createComponent(def.App)};
    }
    `,
    map
  );
};
