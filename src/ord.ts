import {Eq} from 'fp-ts/Eq'
import { fromCompare,contramap, reverse } from 'fp-ts/lib/Ord';

type Ordering = -1 | 0 | 1;

interface Ord<A> extends Eq<A> {
  readonly compare: (x: A, y: A) => Ordering
}

// 순수 ord 제작
const ordNumber: Ord<number> = {
  equals: (x, y) => x === y,
  compare: (x,y) => (x < y ? -1: x > y ? 1 : 0)
}

// fromCompare을 이용한  ord
const ordNumber2: Ord<number> = fromCompare((x, y) => (x < y ? -1 : x > y ? 1 : 0));

function min<A>(O: Ord<A>): (x: A, y: A) => A {
  return (x,y) => (O.compare(x,y) === 1 ? y : x)
}



type User = {
  name: string,
  age: number
}

// fromCompare을 이용한 객체 ord
const byAge: Ord<User> = fromCompare((x, y) => ordNumber.compare(x.age, y.age))

// contramap을 이용한 객체 ord
const byAge2: Ord<User> = contramap((u: User) => u.age)(ordNumber);


function max<A>(O: Ord<A>): (x: A, y: A) => A {
  //Ord 정렬값을 뒤집은
  //ex 1 = -1 , 0 = 0 , -1 = 1 로
  return min(reverse(O))
}
const getYounger = min(byAge)
const getOlder = max(byAge)

console.log(min(ordNumber)(20, 30));
console.log(getYounger({
  age: 10,
  name: "asd"
}, {
  age: 20,
  name: "tt"
}))
console.log(getOlder({
  age: 10,
  name:"aa"
}, {
  age: 20,
  name:"bb"
}))