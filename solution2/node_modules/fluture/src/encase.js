import {noop} from './internal/utils.js';
import {createInterpreter, application1, application, func, any} from './future.js';

export var Encase = createInterpreter(2, 'encase', function Encase$interpret(rec, rej, res){
  var fn = this.$1, r;
  try{ r = fn(this.$2) }catch(e){ rej(e); return noop }
  res(r);
  return noop;
});

export function encase(f){
  var context1 = application1(encase, func, arguments);
  return function encase(x){
    var context2 = application(2, encase, any, arguments, context1);
    return new Encase(context2, f, x);
  };
}
