import { safe } from "./safe.js";

import type { Expect, Equal } from "pb.expectequal";
import type { Unknown } from "./unknown.js";

it("should handle value", () => {
	const $value = safe(() => "...");
	expect($value).toBe("...");
	!0 as Expect<Equal<typeof $value, string | Error>>;
});

it("should handle union", () => {
	const $value = safe(() => "..." as string | number | undefined);
	expect($value).toBe("...");
	!0 as Expect<Equal<typeof $value, string | number | undefined | Error>>;
});

it("should handle any as Unknown", () => {
	const $value = safe(() => "..." as any);
	expect($value).toBe("...");
	!0 as Expect<Equal<typeof $value, Unknown | Error>>;
});

it("should handle unknown as Unknown", () => {
	const $value = safe(() => "..." as unknown);
	expect($value).toBe("...");
	!0 as Expect<Equal<typeof $value, Unknown | Error>>;
});

it("should handle void as undefined", () => {
	const $value = safe(() => {});
	expect($value).toBeUndefined();
	!0 as Expect<Equal<typeof $value, undefined | Error>>;
});

it("should handle error", () => {
	const $value = safe(() => {
		throw new Error("...");
	});
	expect($value).toMatchObject(new Error("..."));
	!0 as Expect<Equal<typeof $value, undefined | Error>>;
});

it("should handle error if non-Error thrown", () => {
	const $value = safe(() => {
		throw "...";
	});
	expect($value).toMatchObject(new Error(undefined, { cause: "..." }));
	!0 as Expect<Equal<typeof $value, undefined | Error>>;
});

describe("Promise", () => {
	it("should handle value", async () => {
		const $value = await safe(async () => "...");
		expect($value).toBe("...");
		!0 as Expect<Equal<typeof $value, string | Error>>;
	});

	it("should handle union", async () => {
		const $value = await safe(async () => "..." as string | number | undefined);
		expect($value).toBe("...");
		!0 as Expect<Equal<typeof $value, string | number | undefined | Error>>;
	});

	it("should handle any as Unknown", async () => {
		const $value = await safe(async () => "..." as any);
		expect($value).toBe("...");
		!0 as Expect<Equal<typeof $value, Unknown | Error>>;
	});

	it("should handle unknown as Unknown", async () => {
		const $value = await safe(async () => "..." as unknown);
		expect($value).toBe("...");
		!0 as Expect<Equal<typeof $value, Unknown | Error>>;
	});

	it("should handle void as undefined", async () => {
		const $value = await safe(async () => undefined as void);
		expect($value).toBeUndefined();
		!0 as Expect<Equal<typeof $value, undefined | Error>>;
	});

	it("should handle error", async () => {
		const $value = await safe(async () => {
			throw new Error("...");
		});
		expect($value).toMatchObject(new Error("..."));
		!0 as Expect<Equal<typeof $value, undefined | Error>>;
	});

	it("should handle error if non-Error thrown", async () => {
		const $value = await safe(async () => {
			throw "...";
		});
		expect($value).toMatchObject(new Error(undefined, { cause: "..." }));
		!0 as Expect<Equal<typeof $value, undefined | Error>>;
	});
});
