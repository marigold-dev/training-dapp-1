import {FL} from './const.js';

export function isFunction(f){
  return typeof f === 'function';
}

export function isThenable(m){
  return m instanceof Promise || m != null && isFunction(m.then);
}

export function isBoolean(f){
  return typeof f === 'boolean';
}

export function isNumber(f){
  return typeof f === 'number';
}

export function isUnsigned(n){
  return (n === Infinity || isNumber(n) && n > 0 && n % 1 === 0);
}

export function isObject(o){
  return o !== null && typeof o === 'object';
}

export function isIterator(i){
  return isObject(i) && isFunction(i.next);
}

export function isArray(x){
  return Array.isArray(x);
}

export function hasMethod(method, x){
  return x != null && isFunction(x[method]);
}

export function isFunctor(x){
  return hasMethod(FL.map, x);
}

export function isAlt(x){
  return isFunctor(x) && hasMethod(FL.alt, x);
}

export function isApply(x){
  return isFunctor(x) && hasMethod(FL.ap, x);
}

export function isBifunctor(x){
  return isFunctor(x) && hasMethod(FL.bimap, x);
}

export function isChain(x){
  return isApply(x) && hasMethod(FL.chain, x);
}
