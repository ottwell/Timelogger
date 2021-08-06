import * as React from "react";
import * as ReactDOM from "react-dom";
import Main from "./app/components/main/Main";
import { initializeIcons } from "@fluentui/font-icons-mdl2";

initializeIcons();
ReactDOM.render(<Main />, document.getElementById("root"));
