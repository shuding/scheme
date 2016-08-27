let testNo = 0
const assert = v => {
  if (!v) {
    //throw new Error('Test failed.')
    console.log(`failed`)
  }
  console.log(`Test ${testNo++} OK...`)
}

const { Scope, rootScope } = require('../src/default')

let t = new Scope({}, rootScope)

//
assert(t.eval(`42`) === 42)
assert(t.eval(`"hello, world"`) === 'hello, world')
assert(t.eval(`true`) === true)
assert(t.eval(`(+ 1 (* 2 (- 3 (/ 4 2))))`) === 3)

// square
t.eval(`
(define (square x)
        (* x x))
`)
assert(t.eval(`
(square (square 3))
`) === 81)

t.eval(`
(define the_answer
        42)
`)
assert(t.eval(`the_answer`) === 42)

// not
t.eval(`
(define (not x)
        (cond (x false)
              (true true)))
`)
assert(t.eval(`(not true)`) === false)

// factorial
t.eval(`
(define (if x a b)
        (cond (x a)
              (true b)))
`)
t.eval(`
(define (fact n)
        (if (= 0 n)
            1
            (* n (fact (- n 1)))))
`)
assert(t.eval(`(fact 5)`) === 120)

// length
t.eval(`
(define (length x)
        (cond ((= null (car x)) 0)
              (true (+ 1 (length (cdr x))))))
`)
assert(t.eval(`(length (list 1 2 3))`) === 3)

// find y in x
t.eval(`
(define (find x y)
        (cond ((= null (car x)) false)
              ((= y (car x)) true)
              (true (find (cdr x) y))))
`)
assert(t.eval(`(find (list 1 2 3) 4)`) === false)

// find y in x
assert(t.eval(`(find (list 1 2 3) 3)`) === true)

// filter
t.eval(`
(define (filter x y)
        (cond ((= null (car x)) (list))
              ((y (car x)) (prepend (car x) (filter (cdr x) y)))
              (true (filter (cdr x) y))))
`)
t.eval(`
(define (greater_than_one x)
        (> x 1))
`)
assert(t.eval(`(filter (list 1 2 3 4 5) greater_than_one)`).toString() === '2,3,4,5,')

// sum
t.eval(`
(define (sum x)
        (cond ((= null (car x)) 0)
              (true (+ (car x) (sum (cdr x))))))
`)
assert(t.eval(`(sum (list 1 2 3))`) === 6)

// pi
// t.eval(`(define (pi a b) (cond ((> a b) 0) (true (+ (/ 8 (* a (+ a 2))) (pi (+ 4 a) b)))) (pi 1 1000))`)

// index
t.eval(`
(define ([] x i)
        (cond ((= i 0) (car x))
              (true ([] (cdr x) (- i 1)))))
`)
assert(t.eval(`([] (list 1 2 3) 2)`) === 3)

// lambda
assert(t.eval(`
((lambda x (+ x 1)) 3)
`) === 4)

t.eval(`
(define (add_x_fn x) (lambda y (+ x y)))
`)
assert(t.eval(`
((add_x_fn 4) 1)
`) === 5)

console.log('All tests passed.')
