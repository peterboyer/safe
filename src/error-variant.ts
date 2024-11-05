/**
 * @description
 * Returns an extended `Error` type with a `tag` to use as a discriminated
 * union. If `undefined` is used as member of the `TTag` type parameter, then
 * the added `tag` property becomes optional. This allows for untagged `Error`s
 * to be returned alongside `ErrorVariant`s.
 *
 * @example
 * ```ts
 * async function fetchName(): Promise<
 *   | string
 *   | ErrorVariant<"network" | undefined>
 * > {}
 * const name = await fetchName();
 * if (name instanceof Error) {
 *   // special case on tagged error variant
 *   if (name.tag === "network") { ... }
 *   // forward untagged error
 *   return name;
 * }
 * ```
 */
export type ErrorVariant<TTag = undefined> = Error &
	(TTag extends undefined ? { tag?: undefined } : { tag: TTag });

export function ErrorVariant<const TTag>(
	tag: TTag,
	cause?: unknown,
): ErrorVariant<TTag> {
	return Object.assign(new Error(undefined, { cause }), { tag }) as any;
}
