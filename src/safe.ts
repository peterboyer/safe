import type { Unknown } from "./unknown.js";

/**
 * @since 1.0.0
 *
 * @description
 * Executes the given `callback` within a try/catch.
 * - Returns thrown `Error` values as-is if it is an `instanceof` `Error`,
 * - Returns thrown non-`Error` values as the `cause` of a new `Error` value.
 * - Otherwise returns the result value as-is.
 *
 * If the return type of the `callback` is `unknown`, then the placeholder
 * `Unknown` type is used instead to allow for a return type union containing
 * `Error`.
 *
 * @description
 * If a `fallback` value is given it will be used if the `callback` throws.
 * If the `fallback` value is a function, it will be treated as a callback,
 * receiving the thrown error value as an argument, and its return value used.
 */
export function safe<TValue, TFallback = never>(
	...args: [
		callback: () => TValue,
		fallback?: TFallback | ((cause: Error) => TFallback),
	]
): SafeReturn<TValue, TFallback> {
	try {
		const value = args[0]();
		if (value instanceof Promise) {
			return value.catch((cause) => $catch(args, cause)) as any;
		}
		return value as any;
	} catch (cause) {
		return $catch(args, cause);
	}
}

function wrap(cause: unknown): Error {
	return cause instanceof Error ? cause : new Error(undefined, { cause });
}

function $catch(args: any[], cause: unknown) {
	if (args.length === 2) {
		const fallback = args[1];
		return typeof fallback === "function"
			? (fallback as Function)(wrap(cause))
			: fallback;
	}
	return wrap(cause);
}

type SafeReturn<TValue, TFallback> =
	| (0 extends 1 & TValue
			? Unknown // if `any`
			: unknown extends TValue
				? Unknown // if `unknown`
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
														: Awaited<TValue>)
									| InferFallbackValue<TFallback>
								>
							: TValue)
	| InferFallbackValue<TFallback>;

type InferFallbackValue<TFallback> = [TFallback] extends [never]
	? Error
	: TFallback extends (...args: any[]) => any
		? ReturnType<TFallback>
		: TFallback;
