var {
  Tokenizer,
  Scope,
  T_VARI,
  T_EXPR,
  T_BOOL,
  T_NULL,
  T_NUMB,
  T_STRI
} = require('./core')

var {
  defaults
} = require('./default')

const rootScope = new Scope(Object.assign(defaults, { /* define */ }))
const t = new Scope({}, rootScope)

if (process && process.argv0 === 'node') {
  process.stdin.on('data', function (str) {
    console.log(t.eval(Buffer(str).toString()))
  })
} else {
  // Browser
}
