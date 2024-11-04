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
				? value.catch((cause) => new Error(undefined, { cause }))
				: value
		) as any;
	} catch (cause) {
		return new Error(undefined, { cause }) as any;
	}
}

type SafeReturn<TValue> = 0 extends 1 & TValue
	? Unknown | Error
	: [TValue] extends [Promise<unknown>]
		? Promise<SafeValue<Awaited<TValue>> | Error>
		: SafeValue<TValue> | Error;

type SafeValue<TValue> = [TValue] extends [never]
	? void // if `never`
	: unknown extends TValue
		? Unknown // if `unknown`
		: TValue;
