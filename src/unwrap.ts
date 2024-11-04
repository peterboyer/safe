/**
 * @description
 * - Returns `undefined` if the given `value` is an Error.
 * - Otherwise returns the given `value` as is.
 *
 * @example
 * ```ts
 * const value = safe(() => JSON.stringify({ ... }));
 * //    ^ string | Error
 * const value = unwrap(safe(() => JSON.stringify({ ... })));
 * //    ^ string
 * ```
 */
export function unwrap<TValue>(
	value: TValue,
): Exclude<TValue, Error> | undefined {
	return (value instanceof Error ? undefined : value) as any;
}
