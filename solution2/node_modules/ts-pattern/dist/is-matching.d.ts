import { Pattern } from './types/Pattern';
import { MatchedValue } from './types/Match';
import * as P from './patterns';
/**
 * `isMatching` takes pattern and returns a **type guard** function, cheching if a value matches this pattern.
 *
 * [Read `isMatching` documentation on GitHub](https://github.com/gvergnaud/ts-pattern#ismatching)
 *
 * @example
 *  const hasName = isMatching({ name: P.string })
 *
 *  declare let input: unknown
 *
 *  if (hasName(input)) {
 *    // `input` inferred as { name: string }
 *    return input.name
 *  }
 */
export declare function isMatching<p extends Pattern<any>>(pattern: p): (value: any) => value is MatchedValue<any, P.infer<p>>;
/**
 * `isMatching` takes pattern and a value and checks if the value matches this pattern.
 *
 * [Read `isMatching` documentation on GitHub](https://github.com/gvergnaud/ts-pattern#ismatching)
 *
 * @example
 *  declare let input: unknown
 *
 *  if (isMatching({ name: P.string }, input)) {
 *    // `input` inferred as { name: string }
 *    return input.name
 *  }
 */
export declare function isMatching<p extends Pattern<any>>(pattern: p, value: any): value is MatchedValue<any, P.infer<p>>;
