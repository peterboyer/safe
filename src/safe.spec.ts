import type { Expect, Equal } from "pb.expectequal";
import { safe } from "./safe.js";

import type { Unknown } from "./unknown.js";

it("should handle value", () => {
	const $value = safe((): string => "foo");
	({}) as [Expect<Equal<typeof $value, string | Error>>];
	expect($value).toBe("foo");
});

it("should handle union value", () => {
	const $value = safe(() => "foo" as string | undefined);
	({}) as [Expect<Equal<typeof $value, string | undefined | Error>>];
	expect($value).toBe("foo");
});

it("should handle error", () => {
	const $value = safe(() => {
		throw new TypeError("bar");
	});
	({}) as [Expect<Equal<typeof $value, Promise<void | Error>>>];
	expect($value).toMatchObject(
		new Error(undefined, { cause: new TypeError("bar") }),
	);
});

it("should handle promise value", async () => {
	const $value = await safe(() => (async () => "foo")());
	({}) as [Expect<Equal<typeof $value, string | Error>>];
	expect($value).toBe("foo");
});

it("should handle promise union value", async () => {
	const $value = await safe(() => (async () => "foo" as string | undefined)());
	({}) as [Expect<Equal<typeof $value, string | undefined | Error>>];
	expect($value).toBe("foo");
});

it("should handle promise error", async () => {
	const $value = await safe(() =>
		(async () => {
			throw new TypeError("bar");
		})(),
	);
	({}) as [Expect<Equal<typeof $value, void | Error>>];
	expect($value).toMatchObject(
		new Error(undefined, { cause: new TypeError("bar") }),
	);
});

it("should handle any as unknown", () => {
	const $value = safe(() => JSON.parse(""));
	({}) as [Expect<Equal<typeof $value, Unknown | Error>>];
});

it("should handle void as void", () => {
	const $value = safe(async () => undefined as void);
	({}) as [Expect<Equal<typeof $value, Promise<void | Error>>>];
});
