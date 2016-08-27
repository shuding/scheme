'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('./core');

var Tokenizer = _require.Tokenizer;
var Scope = _require.Scope;
var T_VARI = _require.T_VARI;
var T_EXPR = _require.T_EXPR;
var T_BOOL = _require.T_BOOL;
var T_NULL = _require.T_NULL;
var T_NUMB = _require.T_NUMB;
var T_STRI = _require.T_STRI;

// let define = function (s_a, s_b, s_c) {
//   let scope = Object.assign({}, this.scope)
//   let a = new Tokenizer(s_a)

//   if (a.type === T_VARI) {
//     scope[a.str] = s_b
//   } else if (a.type === T_EXPR) {
//     scope[a.args[0]] = function (...args) {
//       let innerScope = Object.assign({}, this.scope)
//       for (let i = 1; i < a.args.length; ++i) {
//         innerScope[a.args[i]] = args[i - 1]
//       }
//       return (new Scope(innerScope, this)).eval(s_b)
//     }
//   }
//   return (new Scope(scope, this)).eval(s_c)
// }

var define = function define(s_a, s_b) {
  var scope = this.scope; // side effects
  var a = new Tokenizer(s_a);

  if (a.type === T_VARI) {
    var newScope = Object.assign({}, this.scope, _defineProperty({}, a.str, s_b));
    return new Scope(newScope, this);
  } else if (a.type === T_EXPR) {
    var _newScope = Object.assign({}, this.scope);
    _newScope[a.args[0]] = function () {
      // let tmp = {}
      // for (let i = 1; i < a.args.length; ++i) {
      //   tmp[a.args[i]] = _this.eval(args[i - 1])
      // }

      var innerScope = Object.assign({}, this.scope);
      // let NewScope = new Scope(innerScope, this)
      for (var i = 1; i < a.args.length; ++i) {
        // console.log(a.args[i], args[i - 1], this.scope)
        innerScope[a.args[i]] = arguments.length <= i - 1 + 0 ? undefined : arguments[i - 1 + 0]; // this.eval(args[i - 1])
      }
      return new Scope(innerScope, this).eval(s_b);
    };
    return new Scope(_newScope, this);
  }
};

var lambda = function lambda(s_a, s_b) {
  var scope = Object.assign({}, this.scope);
  var a = new Tokenizer(s_a);

  return function () {
    var innerScope = Object.assign({}, scope, this.scope);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (a.type === T_EXPR) {
      for (var i = 0; i < a.args.length; ++i) {
        innerScope[a.args[i]] = args[i];
      }
    } else if (a.type === T_VARI) {
      innerScope[a.str] = args[0];
    }
    return new Scope(innerScope, this).eval(s_b);
  };
};

var defaults = {
  define: define,
  lambda: lambda,
  '+': function _(a, b) {
    return this.eval(a) + this.eval(b);
  },
  '-': function _(a, b) {
    return this.eval(a) - this.eval(b);
  },
  '*': function _(a, b) {
    return this.eval(a) * this.eval(b);
  },
  '/': function _(a, b) {
    return this.eval(a) / this.eval(b);
  },
  '>': function _(a, b) {
    return this.eval(a) > this.eval(b);
  },
  '<': function _(a, b) {
    return this.eval(a) < this.eval(b);
  },
  '=': function _(a, b) {
    return this.eval(a) === this.eval(b);
  },
  cond: function cond() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    for (var i = 0; i < args.length; ++i) {
      var _args = _slicedToArray(new Tokenizer(args[i]).args, 2);

      var condition = _args[0];
      var value = _args[1];

      if (this.eval(condition) === true) {
        return this.eval(value);
      }
    }
    return null;
  },
  list: function list() {
    var _this = this;

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return [].concat(_toConsumableArray(args.map(function (arg) {
      return _this.eval(arg);
    })), [null]);
  },
  car: function car(list) {
    return this.eval(list)[0];
  },
  cdr: function cdr(list) {
    return this.eval(list).slice(1);
  },
  prepend: function prepend(value, list) {
    return [this.eval(value)].concat(_toConsumableArray(this.eval(list)));
  },
  debug: function debug(x) {
    console.log(x);
    return this.eval(x);
  }
};

module.exports = {
  rootScope: new Scope(defaults),
  Scope: Scope,
  defaults: defaults
};