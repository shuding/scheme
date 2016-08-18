const assert = v => {
  if (!v) {
    throw new Error('Test failed.')
  }
}

const { Scope, rootScope } = require('../src/default')

let t = new Scope({}, rootScope)

assert(t.eval(`42`) === 42)

assert(t.eval(`"hello, world"`) === 'hello, world')

assert(t.eval(`true`) === true)

assert(t.eval(`
(+ 1 (* 2 (- 3 (/ 4 2))))
`) === 3)

// square
assert(t.eval(`
(define (square x)
        (* x x)
        (square (square 3)))
`) === 81)

assert(t.eval(`
(define x
        42
        x)
`) === 42)

// not
assert(t.eval(`
(define (not x)
        (cond (x false)
              (true true))
        (not true))
`) === false)

// factorial
assert(t.eval(`
(define (if x a b)
        (cond (x a)
              (true b))
        (define (fact n)
                (if (= 0 n)
                    1
                    (* n (fact (- n 1))))
                (fact 5)))
`) === 120)

// length
assert(t.eval(`
(define (length x)
        (cond ((= null (car x)) 0)
              (true (+ 1 (length (cdr x)))))
        (length (list 1 2 3)))
`) === 3)

// find y in x
assert(t.eval(`
(define (find x y)
        (cond ((= null (car x)) false)
              ((= y (car x)) true)
              (true (find (cdr x) y)))
        (find (list 1 2 3) 4))
`) === false)

// find y in x
assert(t.eval(`
(define (find x y)
        (cond ((= null (car x)) false)
              ((= y (car x)) true)
              (true (find (cdr x) y)))
        (find (list 1 2 3) 3))
`) === true)

// filter
assert(t.eval(`
(define (filter x y)
        (cond ((= null (car x)) (list))
              ((y (car x)) (prepend (car x) (filter (cdr x) y)))
              (true (filter (cdr x) y)))
        (define (op x)
                (> x 1)
                (filter (list 1 2 3 4 5) op)))
`).toString() === '2,3,4,5,')

// sum
assert(t.eval(`
(define (sum x)
        (cond ((= null (car x)) 0)
              (true (+ (car x) (sum (cdr x)))))
        (sum (list 1 2 3)))
`) === 6)

// pi
// t.eval(`(define (pi a b) (cond ((> a b) 0) (true (+ (/ 8 (* a (+ a 2))) (pi (+ 4 a) b)))) (pi 1 1000))`)

// index
assert(t.eval(`
(define ([] x i)
        (cond ((= i 0) (car x))
              (true ([] (cdr x) (- i 1))))
        ([] (list 1 2 3) 2))
`) === 3)

console.log('All tests passed.')
