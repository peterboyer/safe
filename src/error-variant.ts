/**
 * @description
 * An enhanced `Error` type that can define a `tag` to use as a discriminated
 * union.
 *
 * @example
 * ```ts
 * async function fetchName(): Promise<string | ErrorVariant<"network">> {}
 * const name = await fetchName();
 * if (name instanceof Error) {
 *   if (name.tag === "network") { ... }
 *   return name;
 * }
 * ```
 */
export type ErrorVariant<TTag = undefined> = Error & { tag?: TTag | undefined };

export function ErrorVariant<TTag>(
	tag: TTag,
	cause?: unknown,
): ErrorVariant<TTag> {
	return Object.assign(new Error(undefined, { cause }), { tag });
}
