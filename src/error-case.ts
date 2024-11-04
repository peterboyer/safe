/**
 * @description
 * An enhanced `Error` type that can define a `tag` to use as a discriminated
 * union.
 *
 * @example
 * ```ts
 * async function fetchName(): Promise<string | ErrorCase<"network">> {}
 * const name = await fetchName();
 * if (name instanceof Error) {
 *   if (name.tag === "network") { ... }
 *   return name;
 * }
 * ```
 */
export type ErrorCase<TKey = undefined> = Error & { tag?: TKey | undefined };
export function ErrorCase<TTag>(tag: TTag, cause?: unknown): ErrorCase<TTag> {
	return Object.assign(new Error(undefined, { cause }), { tag });
}
