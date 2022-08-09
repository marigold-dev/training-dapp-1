import {isObject, isBoolean} from './predicates.js';

export function Next(x){
  return {done: false, value: x};
}

export function Done(x){
  return {done: true, value: x};
}

export function isIteration(x){
  return isObject(x) && isBoolean(x.done);
}
