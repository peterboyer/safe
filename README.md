# safe

## Installation

```shell
npm install pb.safe
```

## Requirements

- `typescript@>=5.0.0`
- `tsconfig.json > "compilerOptions" > { "strict": true }`

```ts
import { safe } from "pb.safe";

type Value = { id: string };

function getValue(): Value | undefined | Error {
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
}
```



```ts
import { unwrap } from "pb.safe";

const value = getValue();
//    ^ Value | undefined | Error

const valueOrUndefined = unwrap(value);
//    ^ Value | undefined
```



```ts
import { ErrorVariant } from "pb.safe";

type User = { id: string; name: string };
type AuthContext = { isAdmin: boolean };

function getUser(
  id: string,
  authContext: AuthContext,
): User | ErrorVariant<"notfound" | "notallowed" | undefined> {
  if (!authContext.isAdmin) {
    return ErrorVariant("notallowed");
  }

  const user = safe(() => queryUserFromDatabase(id));
  if (user instanceof Error) {
    return user;
  }

  if (!user) {
    return ErrorVariant("notfound");
  }

  return user;
}

export function GETuser(
  params: { id: string },
  authContext: AuthContext,
): Response {
  const user = getUser(params.id, authContext);
  if (user instanceof Error) {
    if (user.tag === "notallowed") {
      return Response.json({ error: "NotAllowed" }, { status: 403 });
    } else if (user.tag === "notfound") {
      return Response.json({ error: "NotFound" }, { status: 404 });
    }
    console.error(user);
    return Response.json({ error: "InternalServerError" }, { status: 500 });
  }
  return Response.json({ ...user });
}
```

