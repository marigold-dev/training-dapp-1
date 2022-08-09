import {application1, application, func, future} from './future.js';
import {raise} from './internal/utils.js';

export function done(callback){
  var context1 = application1(done, func, arguments);
  function done$res(x){
    callback(null, x);
  }
  return function done(m){
    application(2, done, future, arguments, context1);
    return m._interpret(raise, callback, done$res);
  };
}
