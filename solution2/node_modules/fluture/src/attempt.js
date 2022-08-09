import {encase} from './encase.js';

export function attempt(_){
  return encase.apply(this, arguments)(undefined);
}
