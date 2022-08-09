/**
 * @module
 * @private
 * @internal
 */
import { SelectionType } from '../types/FindSelected';
import { Pattern, Matcher, MatcherType } from '../types/Pattern';
export declare const isObject: (value: unknown) => value is Object;
export declare const isMatcher: (x: unknown) => x is Matcher<unknown, unknown, MatcherType, SelectionType, unknown>;
export declare const matchPattern: (pattern: Pattern<any>, value: any, select: (key: string, value: unknown) => void) => boolean;
export declare const getSelectionKeys: (pattern: Pattern<any>) => string[];
export declare const flatMap: <a, b>(xs: a[], f: (v: a) => b[]) => b[];
