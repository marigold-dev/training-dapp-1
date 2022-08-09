/**
 * Symbols used internally within ts-pattern to construct and discriminate
 * Guard, Not, and Select, and AnonymousSelect patterns
 *
 * Symbols have the advantage of not appearing in auto-complete suggestions in
 * user defined patterns, and eliminate the risk of property
 * overlap between ts-pattern internals and user defined patterns.
 *
 * These symbols have to be visible to tsc for type inference to work, but
 * users should not import them
 * @module
 * @private
 * @internal
 */
export declare const toExclude: unique symbol;
export declare type toExclude = typeof toExclude;
export declare const matcher: unique symbol;
export declare type matcher = typeof matcher;
export declare const unset: unique symbol;
export declare type unset = typeof unset;
export declare const anonymousSelectKey = "@ts-pattern/anonymous-select-key";
export declare type anonymousSelectKey = typeof anonymousSelectKey;
