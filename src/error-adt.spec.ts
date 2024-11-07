import type { Equal, Expect } from "pb.expectequal";
import { ErrorADT } from "./error-adt.js";

it("should return a tagged ErrorADT", () => {
	const error = ErrorADT("foo");
	expect(error.type).toBe("foo");
	expect(error).toMatchObject(new Error());
	!0 as Expect<Equal<typeof error.type, "foo">>;
	!0 as Expect<Equal<typeof error, ErrorADT<"foo">>>;
});

it("should return a tagged ErrorADT with cause", () => {
	const error = ErrorADT("foo", new Error("bar"));
	expect(error.type).toBe("foo");
	expect(error).toMatchObject(
		new Error(undefined, { cause: new Error("bar") }),
	);
	!0 as Expect<Equal<typeof error.type, "foo">>;
	!0 as Expect<Equal<typeof error, ErrorADT<"foo">>>;
});

it("should return a tagged ErrorADT with possible any Error", () => {
	const error = ErrorADT<"foo" | undefined>("foo", new Error("bar"));
	expect(error.type).toBe("foo");
	expect(error).toMatchObject(
		new Error(undefined, { cause: new Error("bar") }),
	);
	!0 as Expect<Equal<typeof error.type, "foo" | undefined>>;
	!0 as Expect<Equal<typeof error, ErrorADT<"foo" | undefined>>>;
	if (error.type) {
		!0 as Expect<Equal<typeof error.type, "foo">>;
	}
});
