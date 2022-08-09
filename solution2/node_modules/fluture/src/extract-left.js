import {application1, future} from './future.js';

export function extractLeft(m){
  application1(extractLeft, future, arguments);
  return m.extractLeft();
}
