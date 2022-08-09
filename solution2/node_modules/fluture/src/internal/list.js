export function List(head, tail){
  this.head = head;
  this.tail = tail;
}

List.prototype.toJSON = function(){
  return toArray(this);
};

export var nil = new List(null, null);
nil.tail = nil;

export function isNil(list){
  return list.tail === list;
}

// cons :: (a, List a) -> List a
//      -- O(1) append operation
export function cons(head, tail){
  return new List(head, tail);
}

// reverse :: List a -> List a
//         -- O(n) list reversal
export function reverse(xs){
  var ys = nil, tail = xs;
  while(!isNil(tail)){
    ys = cons(tail.head, ys);
    tail = tail.tail;
  }
  return ys;
}

// cat :: (List a, List a) -> List a
//     -- O(n) list concatenation
export function cat(xs, ys){
  var zs = ys, tail = reverse(xs);
  while(!isNil(tail)){
    zs = cons(tail.head, zs);
    tail = tail.tail;
  }
  return zs;
}

// toArray :: List a -> Array a
//         -- O(n) list to Array
export function toArray(xs){
  var tail = xs, arr = [];
  while(!isNil(tail)){
    arr.push(tail.head);
    tail = tail.tail;
  }
  return arr;
}
