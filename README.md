# safe

## Installation

```shell
npm install pb.safe
```

## Requirements

- `typescript@>=5.0.0`
- `tsconfig.json > "compilerOptions" > { "strict": true }`

## Quickstart

### `safe`

Use `safe` to execute a given `callback` function and return either its result
value or any `Error` that it may have thrown.


```ts
import { safe } from "pb.safe";

const value = safe(() => 0 / 0);
//    ^ number | Error

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

  const valueUnknown = safe(() => JSON.parse(valueJson));
  if (valueUnknown instanceof Error) {
    return valueUnknown;
  }

  const value = safe(() => parseValueOrThrow(valueUnknown));
  if (value instanceof Error) {
    return value;
  }

  return value;
};
```

</details>

---

### `unwrap`

Use `unwrap` in cases where you either want a value or `undefined` if `Error`.


```ts
import { unwrap } from "pb.safe";

const value = safe(() => 0 / 0);
//    ^ number | Error

const valueOrUndefined = unwrap(value);
//    ^ number | undefined
```


---

### `ErrorADT<TType>`

Use `ErrorADT` to define `Error` objects with a typed "type" property
instead of sub-classing `Error`. The "type" can be used for handling different
`Error` cases.

<details><summary>(<strong>Example</strong>) Request/Response to return a User record from a database.</summary>

```ts
import { ErrorADT } from "pb.safe";

type User = { id: string; name: string };
type AuthContext = { isAdmin: boolean };

function getUser(
  id: string,
  authContext: AuthContext,
): User | ErrorADT<"NotFound" | "NotAllowed" | undefined> {
  if (!authContext.isAdmin) {
    return ErrorADT("NotAllowed");
  }

  const user = safe(() => queryUserFromDatabase(id));
  if (user instanceof Error) {
    return user;
  }

  if (!user) {
    return ErrorADT("NotFound");
  }

  return user;
}

export function onRequest(
  params: { id: string },
  authContext: AuthContext,
): Response {
  const user = getUser(params.id, authContext);
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
