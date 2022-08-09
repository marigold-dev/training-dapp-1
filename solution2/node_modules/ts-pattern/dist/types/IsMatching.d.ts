import { Primitives, IsPlainObject, IsUnion } from './helpers';
export declare type IsMatching<a, p> = true extends IsUnion<a> | IsUnion<p> ? true extends (p extends any ? (a extends any ? IsMatching<a, p> : never) : never) ? true : false : unknown extends p ? true : p extends Primitives ? p extends a ? true : false : [p, a] extends [readonly any[], readonly any[]] ? [p, a] extends [
    readonly [infer p1, infer p2, infer p3, infer p4, infer p5],
    readonly [infer a1, infer a2, infer a3, infer a4, infer a5]
] ? [
    IsMatching<a1, p1>,
    IsMatching<a2, p2>,
    IsMatching<a3, p3>,
    IsMatching<a4, p4>,
    IsMatching<a5, p5>
] extends [true, true, true, true, true] ? true : false : [p, a] extends [
    readonly [infer p1, infer p2, infer p3, infer p4],
    readonly [infer a1, infer a2, infer a3, infer a4]
] ? [
    IsMatching<a1, p1>,
    IsMatching<a2, p2>,
    IsMatching<a3, p3>,
    IsMatching<a4, p4>
] extends [true, true, true, true] ? true : false : [p, a] extends [
    readonly [infer p1, infer p2, infer p3],
    readonly [infer a1, infer a2, infer a3]
] ? [IsMatching<a1, p1>, IsMatching<a2, p2>, IsMatching<a3, p3>] extends [
    true,
    true,
    true
] ? true : false : [p, a] extends [
    readonly [infer p1, infer p2],
    readonly [infer a1, infer a2]
] ? [IsMatching<a1, p1>, IsMatching<a2, p2>] extends [true, true] ? true : false : [p, a] extends [readonly [infer p1], readonly [infer a1]] ? IsMatching<a1, p1> : p extends a ? true : false : IsPlainObject<p> extends true ? true extends (a extends any ? [keyof p & keyof a] extends [never] ? false : {
    [k in keyof p & keyof a]: IsMatching<a[k], p[k]>;
}[keyof p & keyof a] extends true ? true : false : never) ? true : false : p extends a ? true : false;
