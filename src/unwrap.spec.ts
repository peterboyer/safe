import { unwrap } from "./unwrap.js";

import type { Expect, Equal } from "pb.expectequal";
import type { Unknown } from "./unknown.js";

it("should handle value", () => {
	const result = unwrap("..." as string | Error);
	expect(result).toBe("...");
	!0 as Expect<Equal<typeof result, string | undefined>>;
});

it("should handle union", () => {
	const result = unwrap("..." as string | number | Error);
	expect(result).toBe("...");
	!0 as Expect<Equal<typeof result, string | number | undefined>>;
});

it("should handle any as Unknown", () => {
	const result = unwrap("..." as any);
	expect(result).toBe("...");
	!0 as Expect<Equal<typeof result, Unknown | undefined>>;
});

it("should handle unknown as Unknown", () => {
	const result = unwrap("..." as unknown);
	expect(result).toBe("...");
	!0 as Expect<Equal<typeof result, Unknown | undefined>>;
});

it("should handle void as undefined", () => {
	const result = unwrap(undefined as void | Error);
	expect(result).toBeUndefined();
	!0 as Expect<Equal<typeof result, undefined>>;
});

it("should return undefined if error", () => {
	const result = unwrap(new Error());
	expect(result).toBeUndefined();
	!0 as Expect<Equal<typeof result, undefined>>;
});

describe("Promise", () => {
	it("should handle value", async () => {
		const result = await unwrap(Promise.resolve("..." as string | Error));
		expect(result).toBe("...");
		!0 as Expect<Equal<typeof result, string | undefined>>;
	});

	it("should handle union", async () => {
		const result = await unwrap(
			Promise.resolve("..." as string | number | Error),
		);
		expect(result).toBe("...");
		!0 as Expect<Equal<typeof result, string | number | undefined>>;
	});

	it("should handle any as Unknown", async () => {
		const result = await unwrap(Promise.resolve("..." as any));
		expect(result).toBe("...");
		!0 as Expect<Equal<typeof result, Unknown | undefined>>;
	});

	it("should handle unknown as Unknown", async () => {
		const result = await unwrap(Promise.resolve("..." as unknown));
		expect(result).toBe("...");
		!0 as Expect<Equal<typeof result, Unknown | undefined>>;
	});

	it("should handle void as undefined", async () => {
		const result = await unwrap(Promise.resolve(undefined as void));
		expect(result).toBeUndefined();
		!0 as Expect<Equal<typeof result, undefined>>;
	});

	it("should return undefined if error", async () => {
		const result = await unwrap(Promise.resolve(new Error()));
		expect(result).toBeUndefined();
		!0 as Expect<Equal<typeof result, undefined>>;
	});
});
