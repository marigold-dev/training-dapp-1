import {invalidArgumentOf} from './internal/error.js';
import {application1} from './future.js';
import {isParallel} from './par.js';

var parallel = {pred: isParallel, error: invalidArgumentOf('be a ConcurrentFuture')};

export function seq(par){
  application1(seq, parallel, arguments);
  return par.sequential;
}
