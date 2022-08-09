import {noop} from './internal/utils.js';
import {createInterpreter, application1, future} from './future.js';

export var Cold = 0;
export var Pending = 1;
export var Crashed = 2;
export var Rejected = 3;
export var Resolved = 4;

export function Queued(rec, rej, res){
  this[Crashed] = rec;
  this[Rejected] = rej;
  this[Resolved] = res;
}

export var Cache = createInterpreter(1, 'cache', function Cache$interpret(rec, rej, res){
  var cancel = noop;

  switch(this._state){
    /* c8 ignore next 4 */
    case Pending: cancel = this._addToQueue(rec, rej, res); break;
    case Crashed: rec(this._value); break;
    case Rejected: rej(this._value); break;
    case Resolved: res(this._value); break;
    default:
      this._queue = [];
      cancel = this._addToQueue(rec, rej, res);
      this.run();
  }

  return cancel;
});

Cache.prototype._cancel = noop;
Cache.prototype._queue = null;
Cache.prototype._queued = 0;
Cache.prototype._value = undefined;
Cache.prototype._state = Cold;

Cache.prototype.extractLeft = function Cache$extractLeft(){
  return this._state === Rejected ? [this._value] : [];
};

Cache.prototype.extractRight = function Cache$extractRight(){
  return this._state === Resolved ? [this._value] : [];
};

Cache.prototype._addToQueue = function Cache$addToQueue(rec, rej, res){
  var _this = this;
  if(_this._state > Pending) return noop;
  var i = _this._queue.push(new Queued(rec, rej, res)) - 1;
  _this._queued = _this._queued + 1;

  return function Cache$removeFromQueue(){
    if(_this._state > Pending) return;
    _this._queue[i] = undefined;
    _this._queued = _this._queued - 1;
    if(_this._queued === 0) _this.reset();
  };
};

Cache.prototype._drainQueue = function Cache$drainQueue(){
  if(this._state <= Pending) return;
  if(this._queued === 0) return;
  var queue = this._queue;
  var length = queue.length;
  var state = this._state;
  var value = this._value;

  for(var i = 0; i < length; i++){
    queue[i] && queue[i][state](value);
    queue[i] = undefined;
  }

  this._queue = undefined;
  this._queued = 0;
};

Cache.prototype.crash = function Cache$crash(error){
  if(this._state > Pending) return;
  this._value = error;
  this._state = Crashed;
  this._drainQueue();
};

Cache.prototype.reject = function Cache$reject(reason){
  if(this._state > Pending) return;
  this._value = reason;
  this._state = Rejected;
  this._drainQueue();
};

Cache.prototype.resolve = function Cache$resolve(value){
  if(this._state > Pending) return;
  this._value = value;
  this._state = Resolved;
  this._drainQueue();
};

Cache.prototype.run = function Cache$run(){
  var _this = this;
  if(_this._state > Cold) return;
  _this._state = Pending;
  _this._cancel = _this.$1._interpret(
    function Cache$fork$rec(x){ _this.crash(x) },
    function Cache$fork$rej(x){ _this.reject(x) },
    function Cache$fork$res(x){ _this.resolve(x) }
  );
};

Cache.prototype.reset = function Cache$reset(){
  if(this._state === Cold) return;
  if(this._state === Pending) this._cancel();
  this._cancel = noop;
  this._queue = [];
  this._queued = 0;
  this._value = undefined;
  this._state = Cold;
};

export function cache(m){
  return new Cache(application1(cache, future, arguments), m);
}
