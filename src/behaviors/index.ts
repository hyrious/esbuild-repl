import { isMobile } from "../helpers";
import "./esbuild";
import "./query";
import "./theme";

if (isMobile) {
  import("./editor");
} else {
  // import("./codemirror");
  import("./editor");
}
