import { getApplicativeMonoid } from 'fp-ts/lib/Applicative'
import { MonoidAll } from 'fp-ts/lib/boolean'
import { concatAll, struct } from 'fp-ts/lib/Monoid'
import {Semigroup} from 'fp-ts/Semigroup'
import { Applicative, getFirstMonoid, getLastMonoid, none, Option, some } from 'fp-ts/lib/Option'

// monoid는 semigroup에서 empty가 추가 된다
// 똑같이 어떤 요소 A의 2개의 인수를 받고 하나의 A요소를 반환하는 것

interface Monoid<A> extends Semigroup<A> {
  readonly empty: A;
}

const monoidSum: Monoid<number> = {
  concat: (x, y) => x + y,
  empty: 0
}

const monoidProduct: Monoid<number> = {
  concat: (x, y) => x * y,
  empty: 1
}

const monoidString: Monoid<string> = {
  concat: (x, y) => x + y,
  empty: ''
}

const monoidAll: Monoid<boolean> = {
  concat: (x, y) => x && y,
  empty: false
}

const monoidAny: Monoid<boolean> = {
  concat: (x, y) => x || y,
  empty: true
}


// 모든 monoid는 semigroup이다.
// 모든 semiGroup은 monoid가 아닐 수 있다 ( empty가 있을수도 없을수도 있다.)
const semigroupSpace: Semigroup<string> = {
  concat: (x, y) => x + ' ' + y
}

type Point = {
  x: number,
  y: number
}

const monoidPoint: Monoid<Point> = struct({
  x: monoidSum,
  y: monoidSum
})

type Vector = {
  from: Point,
  to: Point
}

const monoidVector: Monoid<Vector> = struct({
  from: monoidPoint,
  to: monoidPoint
})

//A요소를 갖는 집합에서 순회하며 concat 함수를 실행

console.log(concatAll(monoidSum)([1, 2, 3, 4, 5]));
console.log(concatAll(monoidProduct)([1, 2, 3, 4, 5]));
console.log(concatAll(monoidString)(['1', 'a,', 'b']));
console.log(concatAll(monoidAll)([true, true, true, monoidAll.empty]));
console.log(concatAll(monoidAny)([true, false, true, MonoidAll.empty]));

const optionMonoid = getApplicativeMonoid(Applicative)(monoidSum)

console.log(optionMonoid.concat(some(1), none)) // none
console.log(optionMonoid.concat(some(1), some(2))) // some(3)
console.log(optionMonoid.concat(some(1), optionMonoid.empty)) // some(1)

// 첫번째 some을 반한한다.
const optionFirstMonoid = getFirstMonoid<number>();

console.log('fistMonoid')
console.log(optionFirstMonoid.concat(some(1), none)); // some(1)
console.log(optionFirstMonoid.concat(some(1), some(2))); // some(1)
console.log(optionFirstMonoid.concat(optionFirstMonoid.empty, some(1)));  // some(1)
console.log(optionFirstMonoid.concat(none, some(2))); // some(2)


// 마지막 some을 반한한다.
const optionLastMonoid = getLastMonoid<number>();

console.log('lastMonoid')
console.log(optionLastMonoid.concat(some(1), none)); // some(1)
console.log(optionLastMonoid.concat(some(1), some(2))); // some(2)
console.log(optionLastMonoid.concat(optionLastMonoid.empty, some(1)));  // some(1)
console.log(optionLastMonoid.concat(none, some(2))); // some(2)



/** VSCode settings */
interface Settings {
  /** Controls the font family */
  fontFamily: Option<string>
  /** Controls the font size in pixels */
  fontSize: Option<number>
  /** Limit the width of the minimap to render at most a certain number of columns. */
  maxColumn: Option<number>
}

const monoidSettings: Monoid<Settings> = struct({
  fontFamily: getLastMonoid<string>(),
  fontSize: getLastMonoid<number>(),
  maxColumn: getLastMonoid<number>()
})

const workspaceSettings: Settings = {
  fontFamily: some('Courier'),
  fontSize: none,
  maxColumn: some(80)
}

const userSettings: Settings = {
  fontFamily: some('Fira Code'),
  fontSize: some(12),
  maxColumn: none
}

/** userSettings overrides workspaceSettings */
console.log(monoidSettings.concat(workspaceSettings, userSettings))
/*
{ fontFamily: some("Fira Code"),
  fontSize: some(12),
  maxColumn: some(80) }
*/
