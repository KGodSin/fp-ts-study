import * as B from 'fp-ts/lib/boolean'
import * as F from 'fp-ts/lib/function'
import * as N from 'fp-ts/number'
import * as Semi from "fp-ts/Semigroup"
import * as AP from 'fp-ts/Apply'
import * as O from 'fp-ts/Option'
import * as ORD from 'fp-ts/Ord'
import * as S from 'fp-ts/string'
import * as A from 'fp-ts/Array'

interface Semigroup<A> {
  concat: (s: A, y: A) => A;
}


const semigroupProduct: Semigroup<number> = {
  concat: (x, y) => x * y
}

const semigroupSum: Semigroup<number> = {
  concat: (x, y) => x + y
}

const semigroupString: Semigroup<string> = {
  concat: (x, y) => x + y
}

function getFirstSemigroup<A = never>(): Semigroup<A> {
  return { concat: (x, y) => x }
}

function getLastSemigroup<A = never>(): Semigroup<A> {
  return { concat: (x,y) => y }
}


function getArraySemigroup<A = never>(): Semigroup<Array<A>> {
  return { concat: (x, y) => x.concat(y) }
}

function of<A>(a: A): Array<A> {
  return [a]
}

const semigroupMin: Semigroup<number> = Semi.min(N.Ord);
const semigroupMax: Semigroup<number> = Semi.max(N.Ord);


console.log(semigroupMin.concat(2, 1));
console.log(semigroupMax.concat(2, 1));


type Point = {
  x: number,
  y: number
}

const semigroupPoint: Semigroup<Point> = {
  concat: (p1, p2) => ({
    x: N.SemigroupSum.concat(p1.x, p2.x),
    y: N.SemigroupSum.concat(p1.y, p2.y)
  })
}

const semigroupPoint2: Semigroup<Point> = Semi.struct({
  x: N.SemigroupSum,
  y: N.SemigroupSum
})

console.log(semigroupPoint.concat({
  x: 1,
  y: 1
}, {
  x: 2,
  y: 2
}))

console.log(semigroupPoint2.concat({
  x: 1,
  y: 1
}, {
  x: 2,
  y: 2
}))

type Vector = {
  from: Point,
  to: Point
}

const semigroupVector: Semigroup<Vector> = Semi.struct({
  from: semigroupPoint2,
  to: semigroupPoint2
})

const semigroupPredicate: Semigroup<(p: Point) => boolean> = F.getSemigroup(B.SemigroupAll)<Point>()

const isPositiveX = (p: Point): boolean => p.x >= 0;
const isPositiveY = (p: Point): boolean => p.y >= 0;

const isPositiveXY = semigroupPredicate.concat(isPositiveX, isPositiveY);

console.log(isPositiveXY({ x: 1, y: 1 }));
console.log(isPositiveXY({ x: 1, y: -1 }));
console.log(isPositiveXY({ x: -1, y: 1 }));
console.log(isPositiveXY({ x: -1, y: -1 }));

const OptionsSum = O.getApplySemigroup(N.SemigroupSum);

console.log(OptionsSum.concat(O.some(1), O.some(2)))

interface Customer {
  name: string,
  favoriteThings: Array<string>,
  registeredAt: number,
  lastUpdatedAt: number,
  hasMadePurchase: boolean
}

const semigroupCustomer: Semigroup<Customer> = Semi.struct({
  name: Semi.max(ORD.contramap((name: string) => name.length)(N.Ord)),
  favoriteThings: A.getMonoid<string>(),
  registeredAt: Semi.min(N.Ord),
  lastUpdatedAt: Semi.max(N.Ord),
  hasMadePurchase: B.SemigroupAny
})

console.log(
  semigroupCustomer.concat({
    name: 'Giulio',
    favoriteThings: ['math', 'climbing'],
    registeredAt: new Date(2018, 1, 20).getTime(),
    lastUpdatedAt: new Date(2018, 2, 18).getTime(),
    hasMadePurchase: false
  },
  {
    name: 'Giulio Canti',
    favoriteThings: ['functional programming'],
    registeredAt: new Date(2018, 1, 22).getTime(),
    lastUpdatedAt: new Date(2018, 2, 9).getTime(),
    hasMadePurchase: true
  })
)