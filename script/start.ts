import { WebpackRunner } from "@iamyth/webpack-runner";
import path from "path";

new WebpackRunner({
    port: 8080,
    https: false,
    projectDirectory: path.join(__dirname, "../test"),
    tsconfigFilePath: path.join(__dirname, "../config/tsconfig.test.json"),
    dynamicConfigResolvers: [
        {
            prefix: "remob",
            resolver: (_) => path.join(__dirname, "../src"),
        },
    ],
}).run();
