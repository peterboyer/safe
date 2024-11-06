import { branch, type Equal, type Expect } from "pb.expectequal";
import { safe } from "./safe.js";
import { unwrap } from "./unwrap.js";
import { ErrorADT } from "./error-variant.js";

function getProfile():
	| Profile
	| undefined
	| ErrorADT<"Storage" | "Malformed" | "Invalid" | undefined> {
	const tokenJson = safe(() => window.localStorage.getItem("key") ?? undefined);
	if (tokenJson instanceof Error) {
		return ErrorADT("Storage", tokenJson);
	}

	if (!tokenJson) {
		return undefined;
	}

	const tokensUnknown = safe(() => JSON.parse(tokenJson));
	if (tokensUnknown instanceof Error) {
		return ErrorADT("Malformed", tokensUnknown);
	}

	const tokens = safe(() => parse<Profile>(tokensUnknown));
	if (tokens instanceof Error && branch()) {
		return tokens;
	}

	if (tokens instanceof Error) {
		return ErrorADT("Invalid", tokens);
	}

	return tokens;
}

type Profile = { name: string };

function parse<TValue>(value: unknown): TValue {
	return value as TValue;
}

//

const tokens = getProfile();
const tokensOrUndefined = unwrap(tokens);

!0 as Expect<Equal<typeof tokensOrUndefined, Profile | undefined>>;

if (tokens instanceof Error) {
	!0 as Expect<
		Equal<
			typeof tokens,
			ErrorADT<"Storage" | "Malformed" | "Invalid" | undefined>
		>
	>;
} else {
	!0 as Expect<Equal<typeof tokens, Profile | undefined>>;
}
