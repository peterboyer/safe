# safe

## Installation

```shell
npm install pb.safe
```

## Requirements

- `typescript@>=5.0.0`
- `tsconfig.json > "compilerOptions" > { "strict": true }`

# API

- [`safe`](#safecallback-fallback)
- [`ErrorADT`](#erroradt)

### `safe(callback, fallback?)`

> `@description`
>
> Executes the given `callback` within a try/catch.
> - Returns thrown `Error` values as-is if it is an `instanceof` `Error`,
> - Returns thrown non-`Error` values as the `cause` of a new `Error` value.
> - Otherwise returns the result value as-is.
>
> If the return type of the `callback` is `unknown`, then the placeholder
> `Unknown` type is used instead to allow for a return type union containing
> `Error`.
>
> If a `fallback` value is given it will be used if the `callback` throws.
> If the `fallback` value is a function, it will be treated as a callback,
> receiving the thrown error value as an argument, and its return value used.


```ts
import { safe } from "pb.safe";

const value = safe(() => 0 / 0);
//    ^ number | Error

void function (): string | Error {
  // handle error
  if (value instanceof Error) {
    return value;
    //     ^ Error
  }

  // continue
  return value.toString();
  //     ^ number
};
```



```ts
const value = safe(() => 0 / 0, undefined);
//    ^ number | undefined
```



```ts
const value = safe(() => 0 / 0, (error) => error.name);
//    ^ number | string
```


`Promise` return values are also supported.


```ts
const value = safe(() => fetch("https://example.com/api/endpoint.json"));
//    ^ Promise<Response | Error>
```


<details><summary>(<strong>Example</strong>) Real-world example.</summary>


```ts
type Value = { id: string };

void function getValue(): Value | undefined | Error {
  const valueJson = window.localStorage.getItem("key");
  if (!valueJson) {
    return undefined;
  }

  const value = safe(() => parseValueOrThrow(JSON.parse(valueJson)));
  if (value instanceof Error) {
    return value;
    //     ^ Error
  }

  return value;
  //     ^ Value
};
```

</details>

<div align=right><a href=#api>Back to top ⤴</a></div>

### `ErrorADT`

- type `ErrorADT<TType>`
- value `ErrorADT(type, cause?)`

Use `ErrorADT` to define `Error` objects with a typed "type" property
instead of sub-classing `Error`. The "type" can be used for handling different
`Error` cases.

> `@description`
>
> Returns an extended `Error` type with an added `type` property to use as a
> discriminated union. If `undefined` is used as member of the `TType`
> parameter, then the `type` property becomes optional. This allows untyped
> `Error`s to be returned alongside `ErrorADT`s.


```ts
function getStoredValue(): string | undefined | ErrorADT<"Storage"> {
  const response = safe(() => window.localStorage.getItem("key"));
  if (response instanceof Error) {
    return ErrorADT("Storage", response);
  }
  return response ?? undefined;
}

const value = getStoredValue();
//    ^ string | undefined | ErrorADT<"Storage">
if (value instanceof Error) {
  //^ Error<"Storage">
  if (value.type === "Storage") {
    //      ^ "Storage"
  }
}
```


<details><summary>(<strong>Example</strong>) Request/Response to return a User record from a database.</summary>

```ts
import { ErrorADT } from "pb.safe";

type User = { id: string; name: string };
type AuthContext = { isAdmin: boolean };
//prettier-ignore

async function getUser(
  id: string,
  authContext: AuthContext,
): Promise<User | ErrorADT<"NotFound" | "NotAllowed" | undefined>> {
  if (!authContext.isAdmin) {
    return ErrorADT("NotAllowed");
  }

  const user = await safe(() => queryUserFromDatabase(id));
  if (user instanceof Error) {
    return user;
  }

  if (!user) {
    return ErrorADT("NotFound");
  }

  return user;
}

export async function onRequest(
  params: { id: string },
  authContext: AuthContext,
): Promise<Response> {
  const user = await getUser(params.id, authContext);
  if (user instanceof Error) {
    if (user.type === "NotAllowed") {
      return Response.json({ error: user.type }, { status: 403 });
    } else if (user.type === "NotFound") {
      return Response.json({ error: user.type }, { status: 404 });
    }
    console.error(user);
    return Response.json({ error: "InternalServerError" }, { status: 500 });
  }
  return Response.json({ ...user });
}
```

</details>

<div align=right><a href=#api>Back to top ⤴</a></div>
