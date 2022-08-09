import {application1, future} from './future.js';

export function promise(m){
  application1(promise, future, arguments);
  return new Promise(function promise$computation(res, rej){
    m._interpret(rej, rej, res);
  });
}
