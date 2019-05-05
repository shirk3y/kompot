import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  createContext
} from "react";
import Children from "react-children-utilities";

import { infoMap } from "../compot-loader/component";

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

    if (grandChildren) {
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

  useLayoutEffect(() => {
    // const child = React.Children.only(children);

    // console.log(infoMap.get(child));
    const infos = Array.from(
      document.querySelectorAll("*[data-compot-id]")
    ).reduce((map, node) => {
      const info = infoMap.get(node);

      // console.warn({ node, info });

      return map;
    }, {});

    // const c = Children.deepFilter(children, c => true);
    // const al = mapRecursive(children, c => c);
  }, [children]);

  // console.log(React.Children.toArray(children));
  // console.log(
  //   Children.deepFilter(children, c => console.log(c, infoMap.get(c)))
  // );
  // Children.deepMap(children, child => console.warn(child));

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
          right: 0,
          width: 300,
          backgroundColor: "#ddd",
          opacity: 0.8
        }}
      >
        {Array.from(document.querySelectorAll("*[data-compot-id]")).map(
          node => (
            <li style={{ marginLeft: 18 }}>
              {JSON.stringify(infoMap.get(node))}
            </li>
          )
        )}
        {/* {console.warn(children)} */}
        {/* {recursiveMap(children, child => { */}
        {/* {Children.deepMap(children, child => {
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
        })} */}
      </ul>
      <div>{children}</div>
    </CompotEditorContext.Provider>
  );
};

export default Editor;
