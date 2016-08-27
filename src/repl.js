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

let t = new Scope({}, rootScope)

function repl(str) {
  let res = t.eval(str)
  if (res.constructor === Scope) {
    // define function
    t = res
    res = ''
  }
  return res.toString()
}

if (process && process.argv0 === 'node') {
  process.stdout.write('> ')
  process.stdin.on('data', function (str) {
    console.log(repl(Buffer(str).toString()))
    process.stdout.write('> ')
  })
} else {
  // Browser
  window.repl = repl
}
