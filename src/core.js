const T_NULL = Symbol('t_null')
const T_EXPR = Symbol('t_expr')
const T_VARI = Symbol('t_vari')
const T_NUMB = Symbol('t_numb')
const T_STRI = Symbol('t_stri')
const T_BOOL = Symbol('t_bool')

class Tokenizer {
  constructor(raw) {
    let str = raw.replace(/\n/g, ' ').trim()
    let type = T_NULL
    let args = []

    switch (true) {
      case !str.length:
        type = T_NULL
        break
      case /^null$/.test(str):
        type = T_NULL
        break
      case /^\-?(\d+|\d+\.\d*|\d*\.\d+)$/.test(str):
        type = T_NUMB
        break
      case /^(true|false)$/.test(str):
        type = T_BOOL
        break
      case /^[a-zA-Z_\+\-\*/<>=\[\]]+[0-9a-zA-Z_\+\-\*/<>=\[\]]*$/.test(str):
        type = T_VARI
        break
      case /^"(\\"|[^"])*"$/.test(str):
        type = T_STRI
        break
      case /^\(.+\)$/.test(str):
        type = T_EXPR
        let flag = 0, escape = false, remain = ''
        for (let i = 1; i < str.length - 1; ++i) {
          if (escape) {
            escape = false
          } else {
            let ch = str[i]
            switch (ch) {
              case '\\':
                escape = true
                remain += ch
                break
              case '(':
                flag += 2
                remain += ch
                break
              case ')':
                flag -= 2
                remain += ch
                break
              case '\"':
                flag ^= 1
                remain += ch
                break
              case ' ':
              case '\n':
              case '\t':
                if (!flag) {
                  if (remain) {
                    args.push(remain)
                  }
                  remain = ''
                } else {
                  remain += ch
                }
                break
              default:
                remain += ch
            }
          }
        }
        args.push(remain)
        break
    }

    this.str = str
    this.type = type
    this.args = args
  }
}

class Scope {
  constructor(scope = {}, parent = null) {
    this.scope = scope
    this.parent = parent
  }

  eval(token, inherit = true) {
    if (token.constructor != Tokenizer) {
      token = new Tokenizer(token)
    }

    const { type, str, args } = token

    switch (type) {
      case T_NULL:
        return null
      case T_NUMB:
        return Number(str)
      case T_BOOL:
        return str === 'true'
      case T_STRI:
        return str.slice(1, -1)
      case T_VARI:
        let v = this.scope[str]
        if (typeof v === 'undefined') {
          return this.parent.eval(str, false)
        }
        if (typeof v === 'string') {
          if (this.inherit) {
            return this.parent.eval(v, false)
          } else {
            return this.eval(v, false)
          }
        }
        return v
      case T_EXPR:
        return this.eval(args[0]).apply(this, args.slice(1))
    }
  }
}

module.exports = {
  Tokenizer,
  Scope,
  T_NULL,
  T_EXPR,
  T_VARI,
  T_NUMB,
  T_STRI,
  T_BOOL
}

