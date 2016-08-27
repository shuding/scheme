// a simple browserify

const fs = require('fs')
const path = require('path')

const core = fs.readFileSync(path.resolve('./dist/core.js'))
const defa = fs.readFileSync(path.resolve('./dist/default.js'))
const repl = fs.readFileSync(path.resolve('./dist/repl.js'))

let output =
`;(function () {
  var _module = {},
      _require = function (x) { return _module[x].exports },
      process = {}

${
  [['./core', core], ['./default', defa], ['./repl', repl]]
    .map(([name, content]) =>
      `;(function (require, module) {
        ${content}
      })(_require, _module['${name}'] = {})`)
    .join('')
}

})()
`
  .split('\n')
  .filter(line =>
    line && !/^ *\/\//.test(line)
  )
  .map(line =>
    line
      .replace(/\/\/.+/, '')
      .replace(/^ */, '')
  )
  .join('')

fs.writeFileSync(path.resolve('./scheme.browser.js'), output)
