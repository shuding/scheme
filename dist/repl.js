'use strict';

var _require = require('./core');

var Tokenizer = _require.Tokenizer;
var Scope = _require.Scope;
var T_VARI = _require.T_VARI;
var T_EXPR = _require.T_EXPR;
var T_BOOL = _require.T_BOOL;
var T_NULL = _require.T_NULL;
var T_NUMB = _require.T_NUMB;
var T_STRI = _require.T_STRI;

var _require2 = require('./default');

var defaults = _require2.defaults;


var rootScope = new Scope(Object.assign(defaults, {/* define */}));

var t = new Scope({}, rootScope);

function repl(str) {
  var res = t.eval(str);
  if (res.constructor === Scope) {
    // define function
    t = res;
    res = '';
  }
  return res.toString();
}

if (process && process.argv0 === 'node') {
  process.stdout.write('> ');
  process.stdin.on('data', function (str) {
    console.log(repl(Buffer(str).toString()));
    process.stdout.write('> ');
  });
} else {
  // Browser
  window.repl = repl;
}