/*!
# safe

## Installation

```shell
npm install pb.safe
```

## Requirements

- `typescript@>=5.0.0`
- `tsconfig.json > "compilerOptions" > { "strict": true }`
!*/
//>
import { safe } from "pb.safe";

type Value = { id: string };
const parseValueOrThrow = (_value: unknown): Value => ({}) as Value; //-

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
//<

//>
import { unwrap } from "pb.safe";

const value = getValue();
//    ^ Value | undefined | Error

const valueOrUndefined = unwrap(value);
//    ^ Value | undefined
void valueOrUndefined; //-
//<

//>
import { ErrorVariant } from "pb.safe";

type User = { id: string; name: string };
type AuthContext = { isAdmin: boolean };
const queryUserFromDatabase = (_id: string): User | undefined => ({}) as User; //-

function getUser(
	id: string,
	authContext: AuthContext,
): User | ErrorVariant<"NotFound" | "NotAllowed" | undefined> {
	if (!authContext.isAdmin) {
		return ErrorVariant("NotAllowed");
	}

	const user = safe(() => queryUserFromDatabase(id));
	if (user instanceof Error) {
		return user;
	}

	if (!user) {
		return ErrorVariant("NotFound");
	}

	return user;
}

export function onRequest(
	params: { id: string },
	authContext: AuthContext,
): Response {
	const user = getUser(params.id, authContext);
	if (user instanceof Error) {
		if (user.tag === "NotAllowed") {
			return Response.json({ error: user.tag }, { status: 403 });
		} else if (user.tag === "NotFound") {
			return Response.json({ error: user.tag }, { status: 404 });
		}
		console.error(user);
		return Response.json({ error: "InternalServerError" }, { status: 500 });
	}
	return Response.json({ ...user });
}
//<
