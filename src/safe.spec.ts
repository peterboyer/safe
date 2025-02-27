import { safe } from "./safe.js";

import type { Expect, Equal } from "pb.expectequal";
import type { Unknown } from "./unknown.js";

type Fallback = typeof Fallback;
const Fallback = { _: "Fallback" } as const;

it("should have complete signature types", () => {
	const value = safe(
		() => "...",
		(cause) => {
			!0 as Expect<Equal<typeof cause, Error>>;
			return Fallback;
		},
	);
	expect(value).toBe("...");
	!0 as Expect<Equal<typeof value, string | Fallback>>;
});

it("should handle value", () => {
	const value = safe(() => "...");
	expect(value).toBe("...");
	!0 as Expect<Equal<typeof value, string | Error>>;
});

it("should handle value (fallback)", () => {
	const value = safe(() => "...", Fallback);
	expect(value).toBe("...");
	!0 as Expect<Equal<typeof value, string | Fallback>>;
});

it("should handle value (fallback fn)", () => {
	const value = safe(
		() => "...",
		() => Fallback,
	);
	expect(value).toBe("...");
	!0 as Expect<Equal<typeof value, string | Fallback>>;
});

it("should handle union", () => {
	const value = safe(() => "..." as string | number | undefined);
	expect(value).toBe("...");
	!0 as Expect<Equal<typeof value, string | number | undefined | Error>>;
});

it("should handle union (fallback)", () => {
	const value = safe(() => "..." as string | number | undefined, Fallback);
	expect(value).toBe("...");
	!0 as Expect<Equal<typeof value, string | number | undefined | Fallback>>;
});

it("should handle union (fallback fn)", () => {
	const value = safe(
		() => "..." as string | number | undefined,
		() => Fallback,
	);
	expect(value).toBe("...");
	!0 as Expect<Equal<typeof value, string | number | undefined | Fallback>>;
});

it("should handle any as Unknown", () => {
	const value = safe(() => "..." as any);
	expect(value).toBe("...");
	!0 as Expect<Equal<typeof value, Unknown | Error>>;
});

it("should handle any as Unknown (fallback)", () => {
	const value = safe(() => "..." as any, Fallback);
	expect(value).toBe("...");
	!0 as Expect<Equal<typeof value, Unknown | Fallback>>;
});

it("should handle any as Unknown (fallback fn)", () => {
	const value = safe(
		() => "..." as any,
		() => Fallback,
	);
	expect(value).toBe("...");
	!0 as Expect<Equal<typeof value, Unknown | Fallback>>;
});

it("should handle unknown as Unknown", () => {
	const value = safe(() => "..." as unknown);
	expect(value).toBe("...");
	!0 as Expect<Equal<typeof value, Unknown | Error>>;
});

it("should handle unknown as Unknown (fallback)", () => {
	const value = safe(() => "..." as unknown, Fallback);
	expect(value).toBe("...");
	!0 as Expect<Equal<typeof value, Unknown | Fallback>>;
});

it("should handle unknown as Unknown (fallback fn)", () => {
	const value = safe(
		() => "..." as unknown,
		() => Fallback,
	);
	expect(value).toBe("...");
	!0 as Expect<Equal<typeof value, Unknown | Fallback>>;
});

it("should handle void as undefined", () => {
	const value = safe(() => {});
	expect(value).toBeUndefined();
	!0 as Expect<Equal<typeof value, undefined | Error>>;
});

it("should handle void as undefined (fallback)", () => {
	const value = safe(() => {}, Fallback);
	expect(value).toBeUndefined();
	!0 as Expect<Equal<typeof value, undefined | Fallback>>;
});

it("should handle void as undefined (fallback fn)", () => {
	const value = safe(
		() => {},
		() => Fallback,
	);
	expect(value).toBeUndefined();
	!0 as Expect<Equal<typeof value, undefined | Fallback>>;
});

describe("error", () => {
	const $throw = (value: unknown) => {
		throw value;
	};

	it("should handle error", () => {
		const value = safe(() => $throw(new Error("...")));
		expect(value).toMatchObject(new Error("..."));
		!0 as Expect<Equal<typeof value, undefined | Error>>;
	});

	it("should handle error (fallback)", () => {
		const value = safe(() => $throw(new Error("...")), Fallback);
		expect(value).toBe(Fallback);
		!0 as Expect<Equal<typeof value, undefined | Fallback>>;
	});

	it("should handle error (fallback fn)", () => {
		const value = safe(() => $throw(new Error("...")), Fallback);
		expect(value).toBe(Fallback);
		!0 as Expect<Equal<typeof value, undefined | Fallback>>;
	});

	it("should handle error if non-Error thrown", () => {
		const value = safe(() => $throw("..."));
		expect(value).toMatchObject(new Error(undefined, { cause: "..." }));
		!0 as Expect<Equal<typeof value, undefined | Error>>;
	});

	it("should handle error if non-Error thrown (fallback)", () => {
		const value = safe(() => $throw("..."), Fallback);
		expect(value).toBe(Fallback);
		!0 as Expect<Equal<typeof value, undefined | Fallback>>;
	});

	it("should handle error if non-Error thrown (fallback fn)", () => {
		const value = safe(
			() => $throw("..."),
			() => Fallback,
		);
		expect(value).toBe(Fallback);
		!0 as Expect<Equal<typeof value, undefined | Fallback>>;
	});
});

describe("Promise", () => {
	it("should handle value", async () => {
		const value = await safe(async () => "...");
		expect(value).toBe("...");
		!0 as Expect<Equal<typeof value, string | Error>>;
	});

	it("should handle value (fallback)", async () => {
		const value = await safe(async () => "...", Fallback);
		expect(value).toBe("...");
		!0 as Expect<Equal<typeof value, string | Fallback>>;
	});

	it("should handle value (fallback fn)", async () => {
		const value = await safe(
			async () => "...",
			() => Fallback,
		);
		expect(value).toBe("...");
		!0 as Expect<Equal<typeof value, string | Fallback>>;
	});

	it("should handle union", async () => {
		const value = await safe(async () => "..." as string | number | undefined);
		expect(value).toBe("...");
		!0 as Expect<Equal<typeof value, string | number | undefined | Error>>;
	});

	it("should handle union (fallback)", async () => {
		const value = await safe(
			async () => "..." as string | number | undefined,
			Fallback,
		);
		expect(value).toBe("...");
		!0 as Expect<Equal<typeof value, string | number | undefined | Fallback>>;
	});

	it("should handle union (fallback fn)", async () => {
		const value = await safe(
			async () => "..." as string | number | undefined,
			() => Fallback,
		);
		expect(value).toBe("...");
		!0 as Expect<Equal<typeof value, string | number | undefined | Fallback>>;
	});

	it("should handle any as Unknown", async () => {
		const value = await safe(async () => "..." as any);
		expect(value).toBe("...");
		!0 as Expect<Equal<typeof value, Unknown | Error>>;
	});

	it("should handle any as Unknown (fallback)", async () => {
		const value = await safe(async () => "..." as any, Fallback);
		expect(value).toBe("...");
		!0 as Expect<Equal<typeof value, Unknown | Fallback>>;
	});

	it("should handle any as Unknown (fallback fn)", async () => {
		const value = await safe(
			async () => "..." as any,
			() => Fallback,
		);
		expect(value).toBe("...");
		!0 as Expect<Equal<typeof value, Unknown | Fallback>>;
	});

	it("should handle unknown as Unknown", async () => {
		const value = await safe(async () => "..." as unknown);
		expect(value).toBe("...");
		!0 as Expect<Equal<typeof value, Unknown | Error>>;
	});

	it("should handle unknown as Unknown (fallback)", async () => {
		const value = await safe(async () => "..." as unknown, Fallback);
		expect(value).toBe("...");
		!0 as Expect<Equal<typeof value, Unknown | Fallback>>;
	});

	it("should handle unknown as Unknown (fallback fn)", async () => {
		const value = await safe(
			async () => "..." as unknown,
			() => Fallback,
		);
		expect(value).toBe("...");
		!0 as Expect<Equal<typeof value, Unknown | Fallback>>;
	});

	it("should handle void as undefined", async () => {
		const value = await safe(async () => undefined as void);
		expect(value).toBeUndefined();
		!0 as Expect<Equal<typeof value, undefined | Error>>;
	});

	it("should handle void as undefined (fallback)", async () => {
		const value = await safe(async () => undefined as void, Fallback);
		expect(value).toBeUndefined();
		!0 as Expect<Equal<typeof value, undefined | Fallback>>;
	});

	it("should handle void as undefined (fallback fn)", async () => {
		const value = await safe(
			async () => undefined as void,
			() => Fallback,
		);
		expect(value).toBeUndefined();
		!0 as Expect<Equal<typeof value, undefined | Fallback>>;
	});

	describe("error", () => {
		it("should handle error", async () => {
			const value = await safe(async () => {
				throw new Error("...");
			});
			expect(value).toMatchObject(new Error("..."));
			!0 as Expect<Equal<typeof value, undefined | Error>>;
		});

		it("should handle error (fallback)", async () => {
			const value = await safe(async () => {
				throw new Error("...");
			}, Fallback);
			expect(value).toBe(Fallback);
			!0 as Expect<Equal<typeof value, undefined | Fallback>>;
		});

		it("should handle error (fallback fn)", async () => {
			const value = await safe(
				async () => {
					throw new Error("...");
				},
				() => Fallback,
			);
			expect(value).toBe(Fallback);
			!0 as Expect<Equal<typeof value, undefined | Fallback>>;
		});

		it("should handle error if non-Error thrown", async () => {
			const value = await safe(async () => {
				throw "...";
			});
			expect(value).toMatchObject(new Error(undefined, { cause: "..." }));
			!0 as Expect<Equal<typeof value, undefined | Error>>;
		});

		it("should handle error if non-Error thrown (fallback)", async () => {
			const value = await safe(async () => {
				throw "...";
			}, Fallback);
			expect(value).toBe(Fallback);
			!0 as Expect<Equal<typeof value, undefined | Fallback>>;
		});

		it("should handle error if non-Error thrown (fallback fn)", async () => {
			const value = await safe(
				async () => {
					throw "...";
				},
				() => Fallback,
			);
			expect(value).toBe(Fallback);
			!0 as Expect<Equal<typeof value, undefined | Fallback>>;
		});
	});
});
