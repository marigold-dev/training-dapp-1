import {error} from './internal/error.js';
import {raise, show} from './internal/utils.js';
import {application1, application, func, future} from './future.js';

export function value(res){
  var context1 = application1(value, func, arguments);
  return function value(m){
    application(2, value, future, arguments, context1);
    function value$rej(x){
      raise(error(
        'Future#value was called on a rejected Future\n' +
        '  Rejection: ' + show(x) + '\n' +
        '  Future: ' + show(m)
      ));
    }
    return m._interpret(raise, value$rej, res);
  };
}
