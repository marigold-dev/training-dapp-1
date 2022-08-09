import {wrapException, typeError} from './internal/error.js';
import {isThenable} from './internal/predicates.js';
import {noop, show} from './internal/utils.js';
import {createInterpreter, application1, application, func, any} from './future.js';

function invalidPromise(p, f, a){
  return typeError(
    'encaseP() expects the function it\'s given to return a Promise/Thenable'
    + '\n  Actual: ' + show(p) + '\n  From calling: ' + show(f)
    + '\n  With: ' + show(a)
  );
}

export var EncaseP = createInterpreter(2, 'encaseP', function EncaseP$interpret(rec, rej, res){
  var open = true, fn = this.$1, arg = this.$2, p;
  try{
    p = fn(arg);
  }catch(e){
    rec(wrapException(e, this));
    return noop;
  }
  if(!isThenable(p)){
    rec(wrapException(invalidPromise(p, fn, arg), this));
    return noop;
  }
  p.then(function EncaseP$res(x){
    if(open){
      open = false;
      res(x);
    }
  }, function EncaseP$rej(x){
    if(open){
      open = false;
      rej(x);
    }
  });
  return function EncaseP$cancel(){ open = false };
});

export function encaseP(f){
  var context1 = application1(encaseP, func, arguments);
  return function encaseP(x){
    var context2 = application(2, encaseP, any, arguments, context1);
    return new EncaseP(context2, f, x);
  };
}
