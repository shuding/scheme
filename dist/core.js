'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var T_NULL = Symbol('t_null');
var T_EXPR = Symbol('t_expr');
var T_VARI = Symbol('t_vari');
var T_NUMB = Symbol('t_numb');
var T_STRI = Symbol('t_stri');
var T_BOOL = Symbol('t_bool');

var Tokenizer = function Tokenizer(raw) {
  _classCallCheck(this, Tokenizer);

  var str = raw.replace(/\n/g, ' ').trim();
  var type = T_NULL;
  var args = [];

  switch (true) {
    case !str.length:
      type = T_NULL;
      break;
    case /^null$/.test(str):
      type = T_NULL;
      break;
    case /^\-?(\d+|\d+\.\d*|\d*\.\d+)$/.test(str):
      type = T_NUMB;
      break;
    case /^(true|false)$/.test(str):
      type = T_BOOL;
      break;
    case /^[a-zA-Z_\+\-\*/<>=\[\]]+[0-9a-zA-Z_\+\-\*/<>=\[\]]*$/.test(str):
      type = T_VARI;
      break;
    case /^"(\\"|[^"])*"$/.test(str):
      type = T_STRI;
      break;
    case /^\(.+\)$/.test(str):
      type = T_EXPR;
      var flag = 0,
          _escape = false,
          remain = '';
      for (var i = 1; i < str.length - 1; ++i) {
        if (_escape) {
          _escape = false;
        } else {
          var ch = str[i];
          switch (ch) {
            case '\\':
              _escape = true;
              remain += ch;
              break;
            case '(':
              flag += 2;
              remain += ch;
              break;
            case ')':
              flag -= 2;
              remain += ch;
              break;
            case '\"':
              flag ^= 1;
              remain += ch;
              break;
            case ' ':
            case '\n':
            case '\t':
              if (!flag) {
                if (remain) {
                  args.push(remain);
                }
                remain = '';
              } else {
                remain += ch;
              }
              break;
            default:
              remain += ch;
          }
        }
      }
      args.push(remain);
      break;
  }

  this.str = str;
  this.type = type;
  this.args = args;
};

var Scope = function () {
  function Scope() {
    var scope = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var parent = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    _classCallCheck(this, Scope);

    this.scope = scope;
    this.parent = parent;
  }

  _createClass(Scope, [{
    key: 'eval',
    value: function _eval(token) {
      if (token.constructor != Tokenizer) {
        token = new Tokenizer(token);
      }

      var _token = token;
      var type = _token.type;
      var str = _token.str;
      var args = _token.args;


      switch (type) {
        case T_NULL:
          return null;
        case T_NUMB:
          return Number(str);
        case T_BOOL:
          return str === 'true';
        case T_STRI:
          return str.slice(1, -1);
        case T_VARI:
          var v = this.scope[str];
          // console.log(str, v, this.scope)
          if (typeof v === 'undefined') {
            return this.parent.eval(str);
          }
          if (typeof v === 'string') {
            if (this.parent) {
              return this.parent.eval(v);
            }
            return this.eval(v);
          }
          return v;
        case T_EXPR:
          var fnToken = new Tokenizer(args[0]);
          if (fnToken.type === T_VARI) {
            var fn = this.scope[args[0]];
            if (typeof fn === 'undefined') {
              return this.parent.eval(args[0]).apply(this, args.slice(1));
            }
          }
          return this.eval(args[0]).apply(this, args.slice(1));
      }
    }
  }]);

  return Scope;
}();

module.exports = {
  Tokenizer: Tokenizer,
  Scope: Scope,
  T_NULL: T_NULL,
  T_EXPR: T_EXPR,
  T_VARI: T_VARI,
  T_NUMB: T_NUMB,
  T_STRI: T_STRI,
  T_BOOL: T_BOOL
};