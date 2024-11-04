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
