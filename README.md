# scheme

A toy Scheme interpreter implemented with JavaScript ES6.

## Usage

NodeJS >= 6

Run test: `node test/test.js`  
Run repl: `node src/repl.js`

## REPL demo

### Basic, define, functions
```scheme
2                                   ; -> 2
"hello, world"                      ; -> hello, world
true                                ; -> true
(+ 1 (* 2 (- 3 (/ 4 2))))           ; -> 3

(define the_answer 42)
the_answer                          ; -> 42

(define (square x)
        (* x x))
(square (square 3))                 ; -> 81

(define (not x)
        (cond (x false)
              (true true)))
(not true)                          ; -> false
```

### Recursive
```scheme
(define (if x a b)
        (cond (x a)
              (true b)))

(define (fact n)
        (if (= 0 n)
            1
            (* n (fact (- n 1)))))

(fact 5)                            ; -> 120
```

### List
```scheme
(define (length x)
        (cond ((= null (car x)) 0)
              (true (+ 1 (length (cdr x))))))
(length (list 1 2 3))                        ; -> 3
```

Filter
```scheme
(define (filter x y)
        (cond ((= null (car x)) (list))
              ((y (car x)) (prepend (car x) (filter (cdr x) y)))
              (true (filter (cdr x) y))))

(define (greater_than_one x)
        (> x 1))

(filter (list 1 2 3 4 5) greater_than_one)   ; -> 2,3,4,5,
```

Index
```scheme
(define (index x i)
        (cond ((= i 0) (car x))
              (true (index (cdr x) (- i 1)))))
(index (list 1 2 3) 2)                       ; -> 3
```

### Lambda
```scheme
((lambda x (+ x 1)) 3)             ; -> 4

(define (add_x_fn x) (lambda y (+ x y)))
(define add_10_fn (add_x_fn 10))
(add_10_fn 1)                      ; -> 11
```

## JS lib

```javascript
const { Scope, rootScope } = require('./src/default')

let t = new Scope({}, rootScope)

t.eval(`(+ 1 (* 2 (- 3 (/ 4 2))))`)
```

Immutable (inhertance)
```javascript
const { Scope, rootScope } = require('./src/default')

let t = new Scope({}, rootScope), p

t = t.eval(`(define test 1)`)
p = t.eval(`(define test 2)`)

t.eval(`test`) // => 1
p.eval(`test`) // => 2
```

Defaults
```javascript
const { Scope, rootScope } = require('./src/default')
let t = new Scope({ x: 2 }, rootScope)

t.eval(`(+ x 1)`) // => 3
```

## Acknowledgement
No dependencies, built for learning SICP & writing exercises in the book. 

## License

MIT License

Copyright (c) 2016 Shu Ding

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
