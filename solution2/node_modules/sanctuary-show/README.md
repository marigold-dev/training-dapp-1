# sanctuary-show

Haskell has a `show` function which can be applied to a compatible value to
produce a descriptive string representation of that value. The idea is that
the string representation should, if possible, be an expression which would
produce the original value if evaluated.

This library provides a similar [`show`](#show) function.

In general, this property should hold: `eval (show (x)) = x`. In some cases
parens are necessary to ensure correct interpretation (`{}`, for example,
is an empty block rather than an empty object in some contexts). Thus the
property is more accurately stated `eval ('(' + show (x) + ')') = x`.

One can make values of a custom type compatible with [`show`](#show) by
defining a `@@show` method. For example:

```javascript
//# Maybe#@@show :: Maybe a ~> () -> String
//.
//. ```javascript
//. > show (Nothing)
//. 'Nothing'
//.
//. > show (Just (['foo', 'bar', 'baz']))
//. 'Just (["foo", "bar", "baz"])'
//. ```
Maybe.prototype['@@show'] = function() {
  return this.isNothing ? 'Nothing' : 'Just (' + show (this.value) + ')';
};
```

### <a name="show" href="https://github.com/sanctuary-js/sanctuary-show/blob/v2.0.0/index.js#L68">`show :: Showable a => a -⁠> String`</a>

Returns a useful string representation of the given value.

Dispatches to the value's `@@show` method if present.

Where practical, `show (eval ('(' + show (x) + ')')) = show (x)`.

```javascript
> show (null)
'null'

> show (undefined)
'undefined'

> show (true)
'true'

> show (new Boolean (false))
'new Boolean (false)'

> show (-0)
'-0'

> show (NaN)
'NaN'

> show (new Number (Infinity))
'new Number (Infinity)'

> show ('foo\n"bar"\nbaz\n')
'"foo\\n\\"bar\\"\\nbaz\\n"'

> show (new String (''))
'new String ("")'

> show (['foo', 'bar', 'baz'])
'["foo", "bar", "baz"]'

> show ([[[[[0]]]]])
'[[[[[0]]]]]'

> show ({x: [1, 2], y: [3, 4], z: [5, 6]})
'{"x": [1, 2], "y": [3, 4], "z": [5, 6]}'
```
