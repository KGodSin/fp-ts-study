import { Functor1 } from 'fp-ts/lib/Functor'


//순수 프로그램을 아래와 같은 시그니처를 가진 함수라고 한다
// (a: A) => B


//효과적인 프로그램을 아래왁 같은 시그니처를 가진 함수라고 부른다.
// (a: A) => F<B>
// 즉 유형 A를 입력받아 효과 F와 함께 B라는 결과를 생성하는 것이다.

/**
 * 
 * Type constructor	Effect (interpretation)
 * Array<A>	a non deterministic computation 함수형 프로그래밍에서 배열은 비결정적 리스트이다.
 * Option<A>	a computation that may fail
 * Option은 실패할 수 있는 계산이다.
 * Task<A>	an asynchronous computation
 * Task는 비동기적인 계산ㅇ다.
 */



function compose<A, B, C>(g: (b: B) => C, f: (a: A) => B): (a: A) => C {
  return a => g(f(a))
}




// 위의 (a:A) => F<B> 를 할수 있는 방법은 타입스크립트로 아래와 같이 구현 할 수 있다.
// 
function lift<B, C>(g: (b: B) => C): (fb: Array<B>) => Array<C> {
  return fb => fb.map(g)
}

const numberToString = lift<number, string>((b) => String(b));

console.log(numberToString([1,2,3,4]))


/**
 * fp-ts를 통해서 실제로 사용하는 Response의 구현은 다음과 같다.
 */
export const URI = 'Response';

export type URI = typeof URI

console.log(typeof URI);
export interface Response<A> {
  url: string
  status: number
  headers: Record<string, string>
  body: A
}

// URItoKind를 통해서 'Response'의 타입은 Response 라는걸 정의
declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    Response: Response<A>
  }
}

function map<A, B>(fa: Response<A>, f: (a: A) => B): Response<B> {
  return {...fa, body: f(fa.body)}
}

export const functorResponse: Functor1<URI> = {
  URI,
  map
}

const a = functorResponse.map(
  {
    url: '/',
    body: {
      b: 10
    },
    headers: {
    },
    status:200
  },
  (b) => b.b
)

console.log(a);