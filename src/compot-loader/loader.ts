import { stringifyRequest } from "loader-utils";
import { yamlToIntermediate, intermediateToReact } from "./syntax";

export default function(source, map) {
  const rootId = JSON.parse(
    stringifyRequest(this, this.request.replace(/^.+?!/, ""))
  );

  const im = yamlToIntermediate(source);
  const js = intermediateToReact(im, rootId);

  this.callback(null, js, map);
}
