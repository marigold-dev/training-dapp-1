export {default as show} from 'sanctuary-show';

/* c8 ignore next */
var setImmediate = typeof setImmediate === 'undefined' ? setImmediateFallback : setImmediate;

export function noop(){}
export function moop(){ return this }
export function call(f, x){ return f(x) }

export function setImmediateFallback(f, x){
  return setTimeout(f, 0, x);
}

export function raise(x){
  setImmediate(function rethrowErrorDelayedToEscapePromiseCatch(){
    throw x;
  });
}
