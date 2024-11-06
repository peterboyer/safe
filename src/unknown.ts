/**
 * @description
 * A branded-type that represents the `unknown` type and that can be used in a
 * union without absorbing all other union member types.
 *
 * @example
 * ```ts
 * type $ = unknown | Error;
 * //   ^ unknown (absorbs Error)
 * type $ = Unknown | Error;
 * //   ^ Unknown | Error (distinct from Error)
 * ```
 */
export type Unknown = void & { $: never };
