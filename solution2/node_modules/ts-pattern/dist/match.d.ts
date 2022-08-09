import { Match } from './types/Match';
import * as symbols from './internals/symbols';
/**
 * `match` creates a **pattern matching expression**.
 *
 * Use `.with(pattern, handler)` to pattern match on the input.
 *
 * Use `.exhaustive()` or `.otherwise(() => defaultValue)` to end the expression and get the result.
 *
 * [Read `match` documentation on GitHub](https://github.com/gvergnaud/ts-pattern#match)
 *
 * @example
 *  declare let input: "A" | "B";
 *
 *  return match(input)
 *    .with("A", () => "It's a A!")
 *    .with("B", () => "It's a B!")
 *    .exhaustive();
 *
 */
export declare const match: <input, output = typeof symbols.unset>(value: input) => Match<input, output, [], never>;
