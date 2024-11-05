import type { Unknown } from "./unknown.js";

/**
 * @description
 * Executes the given `callback` within a try/catch.
 * - Returns an `Error` with the thrown value as its `cause`.
 * - Otherwise returns the `callback`'s return value.
 *
 * If the return type of the `callback` is `unknown`, then the placeholder
 * `Unknown` type is used instead to allow for a return type union containing
 * `Error`.
 */
export function safe<TValue>(callback: () => TValue): SafeReturn<TValue> {
	try {
		const value = callback();
		return (
			value instanceof Promise
				? value.catch((cause) =>
						cause instanceof Error ? cause : new Error(undefined, { cause }),
					)
				: value
		) as any;
	} catch (cause) {
		return cause instanceof Error
			? cause
			: (new Error(undefined, { cause }) as any);
	}
}

type SafeReturn<TValue> = 0 extends 1 & TValue
	? Unknown | Error // if `any`
	: unknown extends TValue
		? Unknown | Error // if `unknown`
		: [TValue] extends [never]
			? undefined | Error // if `never`
			: TValue extends void
				? undefined | Error // if `void`
				: TValue extends Promise<unknown>
					? Promise<
							| (0 extends 1 & Awaited<TValue>
									? Unknown // if `any`
									: unknown extends Awaited<TValue>
										? Unknown // if `unknown`
										: [Awaited<TValue>] extends [never]
											? undefined // if `never`
											: Awaited<TValue> extends void
												? undefined | Error // if `void`
												: Awaited<TValue>)
							| Error
						>
					: TValue | Error;
