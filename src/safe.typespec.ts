import { ErrorCase } from "./error-case.js";
import { safe } from "./safe.js";
import { unwrap } from "./unwrap.js";

type Tokens = { accessToken: string };

function getTokens():
	| Tokens
	| undefined
	| ErrorCase<"storage_get" | "json_parse" | "data_parse"> {
	const tokenJson = safe(() => window.localStorage.getItem("key") ?? undefined);
	if (tokenJson instanceof Error) {
		return ErrorCase("storage_get", tokenJson);
	}

	if (!tokenJson) {
		return undefined;
	}

	const tokensUnknown = safe(() => JSON.parse(tokenJson));
	if (tokensUnknown instanceof Error) {
		return ErrorCase("json_parse", tokensUnknown);
	}

	const tokens = safe(() => parse<Tokens>(tokensUnknown));
	if (tokens instanceof Error && Math.random()) {
		return tokens;
	}

	if (tokens instanceof Error) {
		return ErrorCase("data_parse", tokens);
	}

	return tokens;
}

function parse<TValue>(value: unknown): TValue {
	return value as TValue;
}

const tokens = getTokens();
if (tokens instanceof Error) {
	tokens;
} else {
	tokens;
}

const tokensOrUndefined = unwrap(tokens);
void tokensOrUndefined;