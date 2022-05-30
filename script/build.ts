import { spawn } from "./spawn";
import { createConsoleLogger } from "@iamyth/logger";
import path from "path";

const logger = createConsoleLogger("TypeScript Compiler");

require("./format");
require("./lint");

function build() {
    logger.task("Build and Transpile");
    spawn("tsc", ["--build", path.join(__dirname, "../tsconfig.json")], "Build Failed.");
}

build();
