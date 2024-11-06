/**
 * @description
 * Returns an extended `Error` type with an added `type` property to use as a
 * discriminated union. If `undefined` is used as member of the `TType`
 * parameter, then the `type` property becomes optional. This allows untyped
 * `Error`s to be returned alongside `ErrorADT`s.
 *
 * @example
 * ```ts
 * async function fetchName(): Promise<
 *   | string
 *   | ErrorADT<"Network" | undefined>
 * > {}
 * const name = await fetchName();
 * if (name instanceof Error) {
 *   // special case on error type
 *   if (name.type === "Network") { ... }
 *   // forward untyped error
 *   return name;
 * }
 * ```
 */
export type ErrorADT<TType extends string | undefined> = Error &
	(TType extends undefined ? { type?: undefined } : { type: TType });

export function ErrorADT<const TType extends string | undefined>(
	type: Exclude<TType, undefined>,
	cause?: unknown,
): ErrorADT<TType> {
	return Object.assign(new Error(undefined, { cause }), { type }) as any;
}
