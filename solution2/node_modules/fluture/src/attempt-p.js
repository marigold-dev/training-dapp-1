import {encaseP} from './encase-p.js';

export function attemptP(_){
  return encaseP.apply(this, arguments)(undefined);
}
