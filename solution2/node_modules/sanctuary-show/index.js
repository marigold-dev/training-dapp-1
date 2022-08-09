//. # sanctuary-show
//.
//. Haskell has a `show` function which can be applied to a compatible value to
//. produce a descriptive string representation of that value. The idea is that
//. the string representation should, if possible, be an expression which would
//. produce the original value if evaluated.
//.
//. This library provides a similar [`show`](#show) function.
//.
//. In general, this property should hold: `eval (show (x)) = x`. In some cases
//. parens are necessary to ensure correct interpretation (`{}`, for example,
//. is an empty block rather than an empty object in some contexts). Thus the
//. property is more accurately stated `eval ('(' + show (x) + ')') = x`.
//.
//. One can make values of a custom type compatible with [`show`](#show) by
//. defining a `@@show` method. For example:
//.
//. ```javascript
//. //# Maybe#@@show :: Maybe a ~> () -> String
//. //.
//. //. ```javascript
//. //. > show (Nothing)
//. //. 'Nothing'
//. //.
//. //. > show (Just (['foo', 'bar', 'baz']))
//. //. 'Just (["foo", "bar", "baz"])'
//. //. ```
//. Maybe.prototype['@@show'] = function() {
//.   return this.isNothing ? 'Nothing' : 'Just (' + show (this.value) + ')';
//. };
//. ```

(function(f) {

  'use strict';

  /* istanbul ignore else */
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = f ();
  } else if (typeof define === 'function' && define.amd != null) {
    define ([], f);
  } else {
    self.sanctuaryShow = f ();
  }

} (function() {

  'use strict';

  //  $$show :: String
  var $$show = '@@show';

  //  seen :: Array Any
  var seen = [];

  //  entry :: Object -> String -> String
  function entry(o) {
    return function(k) {
      return show (k) + ': ' + show (o[k]);
    };
  }

  //  sortedKeys :: Object -> Array String
  function sortedKeys(o) {
    return (Object.keys (o)).sort ();
  }

  //# show :: Showable a => a -> String
  //.
  //. Returns a useful string representation of the given value.
  //.
  //. Dispatches to the value's `@@show` method if present.
  //.
  //. Where practical, `show (eval ('(' + show (x) + ')')) = show (x)`.
  //.
  //. ```javascript
  //. > show (null)
  //. 'null'
  //.
  //. > show (undefined)
  //. 'undefined'
  //.
  //. > show (true)
  //. 'true'
  //.
  //. > show (new Boolean (false))
  //. 'new Boolean (false)'
  //.
  //. > show (-0)
  //. '-0'
  //.
  //. > show (NaN)
  //. 'NaN'
  //.
  //. > show (new Number (Infinity))
  //. 'new Number (Infinity)'
  //.
  //. > show ('foo\n"bar"\nbaz\n')
  //. '"foo\\n\\"bar\\"\\nbaz\\n"'
  //.
  //. > show (new String (''))
  //. 'new String ("")'
  //.
  //. > show (['foo', 'bar', 'baz'])
  //. '["foo", "bar", "baz"]'
  //.
  //. > show ([[[[[0]]]]])
  //. '[[[[[0]]]]]'
  //.
  //. > show ({x: [1, 2], y: [3, 4], z: [5, 6]})
  //. '{"x": [1, 2], "y": [3, 4], "z": [5, 6]}'
  //. ```
  function show(x) {
    if (seen.indexOf (x) >= 0) return '<Circular>';

    switch (Object.prototype.toString.call (x)) {

      case '[object Boolean]':
        return typeof x === 'object' ?
          'new Boolean (' + show (x.valueOf ()) + ')' :
          x.toString ();

      case '[object Number]':
        return typeof x === 'object' ?
          'new Number (' + show (x.valueOf ()) + ')' :
          1 / x === -Infinity ? '-0' : x.toString (10);

      case '[object String]':
        return typeof x === 'object' ?
          'new String (' + show (x.valueOf ()) + ')' :
          JSON.stringify (x);

      case '[object Date]':
        return 'new Date (' +
               show (isNaN (x.valueOf ()) ? NaN : x.toISOString ()) +
               ')';

      case '[object Error]':
        return 'new ' + x.name + ' (' + show (x.message) + ')';

      case '[object Arguments]':
        return 'function () { return arguments; } (' +
               (Array.prototype.map.call (x, show)).join (', ') +
               ')';

      case '[object Array]':
        seen.push (x);
        try {
          return '[' + ((x.map (show)).concat (
            sortedKeys (x)
            .filter (function(k) { return !(/^\d+$/.test (k)); })
            .map (entry (x))
          )).join (', ') + ']';
        } finally {
          seen.pop ();
        }

      case '[object Object]':
        seen.push (x);
        try {
          return (
            $$show in x &&
            (x.constructor == null || x.constructor.prototype !== x) ?
              x[$$show] () :
              '{' + ((sortedKeys (x)).map (entry (x))).join (', ') + '}'
          );
        } finally {
          seen.pop ();
        }

      case '[object Set]':
        seen.push (x);
        try {
          return 'new Set (' + show (Array.from (x.values ())) + ')';
        } finally {
          seen.pop ();
        }

      case '[object Map]':
        seen.push (x);
        try {
          return 'new Map (' + show (Array.from (x.entries ())) + ')';
        } finally {
          seen.pop ();
        }

      default:
        return String (x);

    }
  }

  return show;

}));
