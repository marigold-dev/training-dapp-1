import show from 'sanctuary-show';
import type from 'sanctuary-type-identifiers';
import {Future, isFuture} from '../index.js';
import {strictEqual, deepStrictEqual} from 'assert';

const states = ['pending', 'crashed', 'rejected', 'resolved'];

export const equality = a => b => {
  strictEqual(show(a), show(b));
  deepStrictEqual(a, b);
  return true;
};

export const future = x => {
  equality(isFuture(x))(true);
  equality(type(x))(Future['@@type']);
  return true;
};

export function makeEquivalence (equals){
  return function equivalence (ma){
    return function (mb){
      let astate = 0, bstate = 0, val;
      return new Promise(function (pass, fail){
        future(ma);
        future(mb);

        function twice (m, x, s1, s2){
          fail(new Error(
            'A Future ' + states[s2] + ' after already having ' + states[s1] + '.\n' +
            '  First: Future({ <' + states[s1] + '> ' + show(val) + ' })\n' +
            '  Second: Future({ <' + states[s1] + '> ' + show(x) + ' })\n' +
            '  Future: ' + m.toString()
          ));
        }

        function assertInnerEqual (a, b){
          if(astate === bstate){
            if(isFuture(a) && isFuture(b)){
              equivalence(a)(b).then(pass, fail);
              return;
            }
            try {
              equals(a)(b);
              pass(true);
            } catch (e){
              inequivalent('The inner values are not equal: ' + e.message);
            }
          }else{
            inequivalent(
              'One Future ' + states[astate] + ', and the other Future ' + states[bstate]
            );
          }
          function inequivalent (message){
            fail(new Error(
              '\n    ' + ma.toString() +
              ' :: Future({ <' + states[astate] + '> ' + show(a) + ' })' +
              '\n    is not equivalent to:\n    ' + mb.toString() +
              ' :: Future({ <' + states[bstate] + '> ' + show(b) + ' })\n\n' +
              message
            ));
          }
        }

        ma._interpret(function (x){
          if(astate > 0) twice(ma, x, astate, 1);
          else {
            astate = 1;
            if(bstate > 0) assertInnerEqual(x, val);
            else val = x;
          }
        }, function (x){
          if(astate > 0) twice(ma, x, astate, 2);
          else {
            astate = 2;
            if(bstate > 0) assertInnerEqual(x, val);
            else val = x;
          }
        }, function (x){
          if(astate > 0) twice(ma, x, astate, 3);
          else {
            astate = 3;
            if(bstate > 0) assertInnerEqual(x, val);
            else val = x;
          }
        });

        mb._interpret(function (x){
          if(bstate > 0) twice(mb, x, bstate, 1);
          else {
            bstate = 1;
            if(astate > 0) assertInnerEqual(val, x);
            else val = x;
          }
        }, function (x){
          if(bstate > 0) twice(mb, x, bstate, 2);
          else {
            bstate = 2;
            if(astate > 0) assertInnerEqual(val, x);
            else val = x;
          }
        }, function (x){
          if(bstate > 0) twice(mb, x, bstate, 3);
          else {
            bstate = 3;
            if(astate > 0) assertInnerEqual(val, x);
            else val = x;
          }
        });
      });
    };
  };
}

export const equivalence = makeEquivalence(equality);
