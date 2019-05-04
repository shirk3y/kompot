import React, { useState, useEffect, useRef, createContext } from "react";
import Children from "react-children-utilities";

export const CompotEditorContext = createContext({
  onMount: void 0,
  onUnmount: void 0
});

const mapRecursive = (children, callback) =>
  React.Children.map(children, child =>
    child.props.children
      ? [callback(child), mapRecursive(child.props.children, callback)]
      : callback(child)
  );

function recursiveMap(children, fn) {
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) {
      return child;
    }

    const grandChildren = (child.props as any).children;

    // console.log({ children, grandChildren });

    if (grandChildren) {
      // child = React.cloneElement(child, {
      //   children: recursiveMap(child.props.children, fn)
      // });
      child = React.cloneElement(
        child,
        undefined,
        recursiveMap(grandChildren, fn)
      );
    }

    return fn(child);
  });
}

const Editor = ({ children }) => {
  const [tree, setTree] = useState({});

  console.log(React.Children.toArray(children));

  return (
    <CompotEditorContext.Provider
      value={{
        // onMount: id => setTree({ ...tree, [id]: true }),
        // onMount: id => console.warn("mount", id),
        // onUnmount: id => console.log("umount", id)
        onMount: id => console.debug("mount", id),
        onUnmount: id => console.debug("umount", id)
      }}
    >
      <ul
        style={{
          margin: 0,
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          width: 300,
          backgroundColor: "#ddd",
          opacity: 0.8
        }}
      >
        {/* {console.warn(children)} */}
        {/* {recursiveMap(children, child => { */}
        {Children.deepMap(children, child => {
          // {mapRecursive(children, child => {
          const {
            type: { _compot }
          } = child as any;

          // console.warn((child.type as any)._compot);

          if (_compot) {
            const { node, name, parentIds } = _compot;
            return (
              <li style={{ marginLeft: 18 * parentIds.length }}>{name}</li>
            );
          }

          // console.warn("no compot", child);

          return null;
        })}
      </ul>
      <div>{children}</div>
    </CompotEditorContext.Provider>
  );
};

export default Editor;
