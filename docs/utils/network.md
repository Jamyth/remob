# Network

`Remob` also handles http request, pre-transform response, and exception handling.

## Type Transform

As Date from response will be in `string` format e.g. `("2020-09-10T16:00:00")`
`remob` will automatically transform these value into `JavaScript Date Object`

## **Usage**

## `NetworkUtil.ajax(Method, Path, PathParam, Request, AxiosConfig?)`

```ts
// type Request will be query when method is GET || OPTION
// and as body when method is POST || PUT

// GET
NetworkUtil.ajax("GET", "/user", {}, {});
// POST
NetworkUtil.ajax("POST", "/user", {}, {});
// PUT
NetworkUtil.ajax("PUT", "/user", {}, {});
// DELETE
NetworkUtil.ajax("DELETE", "/user", {}, {});
```

For Path param, there is a TypeScript Type to help infer the required param;

```ts
// There will be type-hint for you
NetworkUtil.ajax("GET", "/user/:id", { id: number }, {});
```
