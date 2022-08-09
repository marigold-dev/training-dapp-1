import {application, application1, func, future} from './future.js';

export function forkCatch(f){
  var context1 = application1(forkCatch, func, arguments);
  return function forkCatch(g){
    var context2 = application(2, forkCatch, func, arguments, context1);
    return function forkCatch(h){
      var context3 = application(3, forkCatch, func, arguments, context2);
      return function forkCatch(m){
        application(4, forkCatch, future, arguments, context3);
        return m._interpret(f, g, h);
      };
    };
  };
}
