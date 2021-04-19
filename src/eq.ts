import * as EQ from 'fp-ts/Eq'
import * as A from 'fp-ts/Array'
import * as F from 'fp-ts/function'

interface Eq<A> {
  readonly equals: (x: A, y: A ) => boolean
}

const eqNumber: Eq<number> = {
  equals: (x,y) => x === y
}

function elem<A>(E: Eq<A>): (a: A, as: Array<A>) => boolean{
  return (a: A, as: Array<A>) => as.some(item => E.equals(a,item))
}

type Point = {
  x: number,
  y: number
}

const eqPoint: Eq<Point> = {
  equals: (p1, p2) => p1 === p2 || (p1.x === p2.x && p2.x === p2.y)
}

type Vector = {
  from: Point,
  to: Point
}

const eqVector: Eq<Vector> = EQ.struct({
  from: eqPoint,
  to: eqPoint
});

const eqArrayOfPoints: Eq<Array<Point>> = A.getEq(eqPoint);


const p1: Point = {
  x: 20,
  y: 20
}
const p2: Point = {
  x: 30,
  y: 30
}

const p3: Point = {
  x: 20,
  y: 30
}


console.log(elem(eqNumber)(1, [1, 2, 3, 4]))
console.log(elem(eqPoint)({
  x: 20,
  y: 20
}, [p1,p2,p3]))

console.log(
  eqArrayOfPoints.equals([p1,p2,p3],[p1,p2,p3])
)
