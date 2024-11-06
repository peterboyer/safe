import type { Unknown } from "./unknown.js";

/**
 * @description
 * - Returns `undefined` if the given `value` is an `instanceof` `Error`.
 * - Otherwise returns the given `value` as is.
 *
 * @example
 * ```ts
 * const value = safe(() => JSON.stringify({ ... }));
 * //    ^ string | Error
 * const value = unwrap(safe(() => JSON.stringify({ ... })));
 * //    ^ string | undefined
 * const value = unwrap(safe(async () => JSON.stringify({ ... })));
 * //    ^ Promise<string | undefined>
 * ```
 */
export function unwrap<TValue>(value: TValue): UnwrapReturn<TValue> {
	if (value instanceof Promise) {
		return value.then((value) =>
			value instanceof Error ? undefined : value,
		) as any;
	}
	return (value instanceof Error ? undefined : value) as any;
}

type UnwrapReturn<TValue> = 0 extends 1 & TValue
	? Unknown | undefined // if `any`
	: unknown extends TValue
		? Unknown | undefined // if `unknown`
		: [TValue] extends [never]
			? undefined // if `never`
			: TValue extends void
				? undefined // if `void`
				: TValue extends Promise<unknown>
					? Promise<
							| (0 extends 1 & Awaited<TValue>
									? Unknown // if `any`
									: unknown extends Awaited<TValue>
										? Unknown // if `unknown`
										: [Awaited<TValue>] extends [never]
											? undefined // if `never`
											: Awaited<TValue> extends void
												? undefined // if `void`
												: Exclude<Awaited<TValue>, Error>)
							| undefined
						>
					: Exclude<TValue, Error> | undefined;
