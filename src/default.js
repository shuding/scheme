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

let define = function (s_a, s_b) {
  let scope = this.scope // side effects
  let a = new Tokenizer(s_a)

  if (a.type === T_VARI) {
    let newScope = Object.assign({}, this.scope, {[a.str]: s_b})
    return new Scope(newScope, this)
  } else if (a.type === T_EXPR) {
    let newScope = Object.assign({}, this.scope)
    newScope[a.args[0]] = function (...args) {
      // let tmp = {}
      // for (let i = 1; i < a.args.length; ++i) {
      //   tmp[a.args[i]] = _this.eval(args[i - 1])
      // }

      let innerScope = Object.assign({}, this.scope)
      // let NewScope = new Scope(innerScope, this)
      for (let i = 1; i < a.args.length; ++i) {
        // console.log(a.args[i], args[i - 1], this.scope)
        innerScope[a.args[i]] = args[i - 1] // this.eval(args[i - 1])
      }
      return (new Scope(innerScope, this)).eval(s_b)
    }
    return new Scope(newScope, this)
  }
}

let lambda = function (s_a, s_b) {
  let scope = Object.assign({}, this.scope)
  let a = new Tokenizer(s_a)

  return function (...args) {
    let innerScope = Object.assign({}, scope, this.scope)
    if (a.type === T_EXPR) {
      for (let i = 0; i < a.args.length; ++i) {
        innerScope[a.args[i]] = args[i]
      }
    } else if (a.type === T_VARI) {
      innerScope[a.str] = args[0]
    }
    return (new Scope(innerScope, this)).eval(s_b)
  }
}

let defaults = {
  define,
  lambda,
  '+': function (a, b) {
    return this.eval(a) + this.eval(b)
  },
  '-': function (a, b) {
    return this.eval(a) - this.eval(b)
  },
  '*': function (a, b) {
    return this.eval(a) * this.eval(b)
  },
  '/': function (a, b) {
    return this.eval(a) / this.eval(b)
  },
  '>': function (a, b) {
    return this.eval(a) > this.eval(b)
  },
  '<': function (a, b) {
    return this.eval(a) < this.eval(b)
  },
  '=': function (a, b) {
    return this.eval(a) === this.eval(b)
  },
  cond: function (...args) {
    for (let i = 0; i < args.length; ++i) {
      let [condition, value] = (new Tokenizer(args[i])).args
      if (this.eval(condition) === true) {
        return this.eval(value)
      }
    }
    return null
  },
  list: function (...args) {
    return [...args.map(arg => this.eval(arg)), null]
  },
  car: function (list) {
    return this.eval(list)[0]
  },
  cdr: function (list) {
    return this.eval(list).slice(1)
  },
  prepend: function (value, list) {
    return [this.eval(value), ...this.eval(list)]
  },
  debug: function (x) {
    console.log(x)
    return this.eval(x)
  }
}

module.exports = {
  rootScope: new Scope(defaults),
  Scope,
  defaults
}
