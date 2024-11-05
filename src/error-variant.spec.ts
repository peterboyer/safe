import type { Equal, Expect } from "pb.expectequal";
import { ErrorVariant } from "./error-variant.js";

it("should return a tagged ErrorVariant", () => {
	const error = ErrorVariant("foo");
	expect(error.tag).toBe("foo");
	expect(error).toMatchObject(new Error());
	!0 as Expect<Equal<typeof error.tag, "foo">>;
	!0 as Expect<Equal<typeof error, ErrorVariant<"foo">>>;
});

it("should return a tagged ErrorVariant with cause", () => {
	const error = ErrorVariant("foo", new Error("bar"));
	expect(error.tag).toBe("foo");
	expect(error).toMatchObject(
		new Error(undefined, { cause: new Error("bar") }),
	);
	!0 as Expect<Equal<typeof error.tag, "foo">>;
	!0 as Expect<Equal<typeof error, ErrorVariant<"foo">>>;
});

it("should return a tagged ErrorVariant with possible any Error", () => {
	const error = ErrorVariant<"foo" | undefined>("foo", new Error("bar"));
	expect(error.tag).toBe("foo");
	expect(error).toMatchObject(
		new Error(undefined, { cause: new Error("bar") }),
	);
	!0 as Expect<Equal<typeof error.tag, "foo" | undefined>>;
	!0 as Expect<Equal<typeof error, ErrorVariant<"foo" | undefined>>>;
	if (error.tag) {
		!0 as Expect<Equal<typeof error.tag, "foo">>;
	}
});
