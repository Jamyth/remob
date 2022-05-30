# Remob Util

It provide two main functions, to add more functionality to React components

-   lazy
-   observer

## `RemobUtil.lazy(functionImport, exportName)`

lazy function provide the ability to dynamically load your component, as well as to achieve `code-splitting`.

> It is very similar to `React.lazy`, but `remob` support named export.

```ts
// component.ts
export const Main = React.memo(() => null);

// index.ts
import { RemobUtil } from "remob";

// @type {React.ComponentType}
const MainComponent = RemobUtil.lazy(() => import("./component"), "Main");
```

## `RemobUtil.observer(displayName, component)`;

`Remob` wrapped `mobx-react-lite`'s `observer` function, to assign displayName to the component.

> `mobx-react-lite`'s observer have already wrap your component with `React.memo`, there is no need to wrap it ourself

> Important Notes:
>
> Remember to wrap all component that will access the mobx store with this observer function, or the component will not update when state change.

```ts
import { useMyStoreState } from "./hooks.ts";
import { RemobUtil } from "remob";

export const MyPage = RemobUtil.observer("MyPage", () => {
    const username = useMyStoreState((state) => state.username);

    return <h1>{username}</h1>;
});
```
