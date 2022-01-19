import { isMobile } from "../helpers";
import "./esbuild";
import "./sw";
import "./theme";

if (isMobile) {
  import("./editor");
} else {
  // import("./codemirror");
  import("./editor");
}
