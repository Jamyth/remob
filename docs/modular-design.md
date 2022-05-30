# Modular Design & Error Handling

## **What is a Module**

It is similar to how you create a Mobx Store, but it include logic to be ran during React component lifecycle

-   onEnter (componentDidMount)
-   onDestroy (componentWillUnmount)

To make the store usable, simply create an instance and you are good to go.
But it is not what we want you to do, instead, to make it powerful, you have to `register` it and `attach` it to a `React Component`.

## **Usage**

First, define how the store and action looks like.

```ts
// index.ts
import { Module, observable, register } from "remob";
// Check out READMD.md about folder structure
import { Main } from "./Main";

class FooModule extends Module<"FooModule"> {
    @observable
    bar: string = "";

    override async onEnter() {
        await this.fetch3rdData();
    }

    updateBar(bar: string) {
        this.bar = bar;
    }

    private async fetch3rdData() {
        // Async Tasks
    }
}

const fooModule = register(new FooModule("FooModule"));
// will return { updateBar: (value: string) => void }
// @type {Record<string, Functions>}
export const actions = fooModule.getActions();
// Mobx v4 doesn't have nice support in hooks, so we wrap it ourself.
// @type {React.Context<Store<FooModule>>}
export const fooModuleContext = fooModule.getContext();
// New Component will be created to adopt the lifecycle methods in module
// @type {React.ComponentType}
export const MainComponent = fooModule.attachLifecycle(Main);
```

What `register(Module)` is actually doing ?

-   It will analyze your module, and extract public actions, and wrap each action with an error handler
-   It will create a `React Context`
-   It will handle the timing of calling lifecycle methods

Now, our business logic is ready, let create some hooks to use in our components.

```ts
// hooks.ts
import React from "react";
import { fooModuleContext } from "./index";

// Similar to "useSelector" in 'react-redux'
export function useFooModuleState<T>(fn: (store: React.ContextType<typeof fooModuleContext>) => T): T {
    const store = React.useContext(fooModuleContext);
    return fn(store);
}
```

Here is how we use hooks to implement the business logic

```ts
// Main/index.tsx
import React from "react";
import { RemobUtil } from "remob";
import { useFooModuleState } from "../hooks";
// import our actions
import { actions } from "../index";

// To make our component subscribe to mobx store, we use RemobUtil.observable()
export const Main = RemobUtil.observable("Main", () => {
    const bar = useFooModuleState((store) => store.bar);

    return (
        <div>
            This is "{bar}"
            <input value={bar} onChange={(e) => actions.updateBar(e.target.value)} />
        </div>
    );
});
```

## **What about Error Handling**

Remob will do the error handling for your, all your actions, component error, global error will be caught automatically.

> `Remob` introduces a new class type **`Exception`** , which nicely wrap all exception

```ts
// Exception.ts
class Exception {
    message: string;
}
```

**Types of Exceptions**

```ts
// APIException.ts
class APIException extends Exception {
    message: string;
    statusCode: string;
    requestURL: string;
    responseData: any;
    errorId: string | null;
    errorCode: string | null;
}

// NetworkException.ts
class NetworkException extends Exception {
    message: string;
    requestURL: string;
    originalErrorMessage: string;
}

// JavaScriptException.ts
class JavaScriptException extends Exception {
    message: string;
    originalError: any;
}
```

To make this work, you have to create your own ErrorListener, to handle incoming exceptions

```ts
// ErrorHandler.ts
import { ErrorListener } from "remob";
// Base class of Error, we have several exception types
import type { Exception } from "remob";

export class ErrorHandler implements ErrorListener {
    onError(exception: Exception): void {
        // Your global error handling logic goes here.
    }
}
```

To use it, you must set it in your application entry point

> You don't need to set it if you use `remob`'s `createApp`

```ts
import { ErrorUtil } from "remob";
// or
import { setupGlobalErrorHandler } from "remob";
import { ErrorHandler } from "./ErrorHandler";

// This will only catch component & action errors
ErrorUtil.setErrorHandler(new ErrorHandler());

// or set it globally to catch all error and unhandled promise rejection
setupGlobalErrorHandler(new ErrorHandler());
```
