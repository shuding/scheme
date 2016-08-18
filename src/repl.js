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

let define = function (s_a, s_b) {
  let scope = this.scope // side effects
  let a = new Tokenizer(s_a)

  if (a.type === T_VARI) {
    scope[a.str] = s_b
  } else if (a.type === T_EXPR) {
    scope[a.args[0]] = function (...args) {
      let innerScope = Object.assign({}, this.scope)
      for (let i = 1; i < a.args.length; ++i) {
        innerScope[a.args[i]] = args[i - 1]
      }
      return (new Scope(innerScope, this)).eval(s_b)
    }
  }
}

const rootScope = new Scope(Object.assign(defaults, { define }))
const t = new Scope({}, rootScope)

if (process && process.argv0 === 'node') {
  process.stdin.on('data', function (str) {
    console.log(t.eval(Buffer(str).toString()))
  })
} else {
  // Browser
}
