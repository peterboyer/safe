import { branch, type Equal, type Expect } from "pb.expectequal";
import { safe } from "./safe.js";
import { unwrap } from "./unwrap.js";
import { ErrorVariant } from "./error-variant.js";

const tokens = getTokens();

if (tokens instanceof Error) {
	!0 as Expect<
		Equal<
			typeof tokens,
			ErrorVariant<"storage_get" | "json_parse" | "data_parse" | undefined>
		>
	>;
	if ("tag" in tokens) {
		!0 as Expect<
			Equal<
				typeof tokens.tag,
				"storage_get" | "json_parse" | "data_parse" | undefined
			>
		>;
	}
} else {
	!0 as Expect<Equal<typeof tokens, Tokens | undefined>>;
}

//

const tokensOrUndefined = unwrap(tokens);
!0 as Expect<Equal<typeof tokensOrUndefined, Tokens | undefined>>;

//

type Tokens = { accessToken: string };

function getTokens():
	| Tokens
	| undefined
	| ErrorVariant<"storage_get" | "json_parse" | "data_parse" | undefined> {
	const tokenJson = safe(() => window.localStorage.getItem("key") ?? undefined);
	if (tokenJson instanceof Error) {
		return ErrorVariant("storage_get", tokenJson);
	}

	if (!tokenJson) {
		return undefined;
	}

	const tokensUnknown = safe(() => JSON.parse(tokenJson));
	if (tokensUnknown instanceof Error) {
		return ErrorVariant("json_parse", tokensUnknown);
	}

	const tokens = safe(() => parse<Tokens>(tokensUnknown));
	if (tokens instanceof Error && branch()) {
		return tokens;
	}

	if (tokens instanceof Error) {
		return ErrorVariant("data_parse", tokens);
	}

	return tokens;
}

function parse<TValue>(value: unknown): TValue {
	return value as TValue;
}
