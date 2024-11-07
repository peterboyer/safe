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

/*!
# API

- [`safe`](#safecallback)
- [`unwrap`](#unwrapvalue)
- [`ErrorADT`](#erroradt)
!*/

/*!
### `safe(callback)`

Use `safe` to execute a given `callback` function and return either its result
value or any `Error` that it may have thrown. If a non-`Error` is thrown, a new
`Error` will instantiated with the thrown value as its `cause`.

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
!*/

//>
import { safe } from "pb.safe";

const value_ = safe(() => 0 / 0);
//    ^ number | Error
void value_; //-

void function (): string | Error {
	// handle error
	if (value_ instanceof Error) {
		return value_;
		//     ^ Error
	}

	// continue
	return value_.toString();
	//     ^ number
};
//<

/*!
`Promise` return values are also supported.
!*/

//>
const value__ = safe(() => fetch("https://example.com/api/endpoint.json"));
//    ^ Promise<Response | Error>
void value__; //-
//<

//>>> Real-world example.

//>
type Value = { id: string };
const parseValueOrThrow = (_value: unknown): Value => ({}) as Value; //-

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
//<
//<<<

//hr

/*!
### `unwrap(value)`

Use `unwrap` in cases where you either want a value or `undefined` if `Error`.

> `@description`
>
> - Returns `undefined` if the given `value` is an `instanceof` `Error`.
> - Otherwise returns the given `value` as is.
!*/

//>
import { unwrap } from "pb.safe";

const value = safe(() => 0 / 0);
//    ^ number | Error

const valueOrUndefined = unwrap(value);
//    ^ number | undefined
void valueOrUndefined; //-
//<

//hr

/*!
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
!*/

//>
function getStoredValue(): string | undefined | ErrorADT<"Storage"> {
	const response = safe(() => window.localStorage.getItem("key"));
	if (response instanceof Error) {
		return ErrorADT("Storage", response);
	}
	return response ?? undefined;
}

const value___ = getStoredValue();
//    ^ string | undefined | ErrorADT<"Storage">
if (value___ instanceof Error) {
	//^ Error<"Storage">
	if (value___.type === "Storage") {
		//      ^ "Storage"
	}
}
//<

//>>> Request/Response to return a User record from a database.
//>
import { ErrorADT } from "pb.safe";

type User = { id: string; name: string };
type AuthContext = { isAdmin: boolean };
//prettier-ignore
const queryUserFromDatabase = async (_id: string): Promise<User | undefined> => ({}) as User; //-

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
//<
//<<<
