var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
function Promise(fn) {
  this.value = null;
  this.state = PENDING;
  this.deferd = [];
  //将fn的参数绑定resolve和reject
  setTimeout(fn.bind(this,this.resolve.bind(this),this.reject.bind(this)));
}

Promise.prototype = {
  constructor: Promise,
  then: function(onFulfilled) {
    var o = {
      onFulfilled: onFulfilled,
      promise: new Promise(function() {})
    }
    if(this.state === PENDING) {
      this.deferd.push(o);
    }
    if(this.state === FULFILLED) {
      this.excute();
    }
    return o.promise;
  },
  resolve: function(newValue) {
    this.value = newValue;
    this.state = FULFILLED;
    this.excute();
  },
  reject: function(err) {
    //异步执行完成，对异步的结果进行处理
    this.value = err;
    this.state = REJECTED;
  },
  all: function() {
    
  },
  race: function() {
    
  },
  catch: function(onRejected) {
    
  },
  finally: function() {
    
  },
  excute: function() {
    var that = this;
    this.deferd.forEach(function(item,index) {
      that.handler(that.deferd[index]);
    });
  },
  handler: function(o) {
    var obj = '';
    if(typeof o.onFulfilled !== 'function') {
      return;
    }else {
      obj = o.onFulfilled(this.value);
      if(typeof obj === 'object' && obj.constructor === Promise) {
        obj.deferd = o.promise.deferd;
      }else {
        obj = this;
        obj.deferd = o.promise.deferd;
        this.excute();
      }
    }
  }
}
