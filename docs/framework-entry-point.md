# Framework Entry Point

`Remob` provide a function to setup error handlers, error boundary, and mount your application.

## `createApp(options)`

```ts
// entry file
import { createApp, RemobUtil } from "remob";

// To know more about Error Listener, please refer to ./modular-design.md
import { ErrorListener } from "./ErrorListener";

// RemobUtil.lazy is used for code split
const EntryElement = RemobUtil.lazy(() => import("path/to/entryComponent"), "Component Name");

// type
interface CreateAppOption {
    componentType: React.ComponentType;
    errorListener: ErrorListener;
    rootContainer?: HTMLElement;
}

createApp({
    componentType: EntryElement,
    errorListener: new ErrorListener(),
});
```
