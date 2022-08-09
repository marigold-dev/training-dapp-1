import {raise} from './internal/utils.js';
import {application, application1, func, future} from './future.js';

export function fork(f){
  var context1 = application1(fork, func, arguments);
  return function fork(g){
    var context2 = application(2, fork, func, arguments, context1);
    return function fork(m){
      application(3, fork, future, arguments, context2);
      return m._interpret(raise, f, g);
    };
  };
}
