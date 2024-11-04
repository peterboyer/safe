/**
 * @description
 * A branded-type that represents the `unknown` type and can be used in a union
 * without absorbing all other union member types.
 *
 * @example
 * ```ts
 * type $ = unknown | Error;
 * //   ^ unknown
 * type $ = Unknown | Error;
 * //   ^ Unknown | Error
 * ```
 */
export type Unknown = void & { $: never };
