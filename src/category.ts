

/**
 * 카테고리 정의 1
 * objects 는 개체의 모음이다.
 * morphisms는 객체 사이의 형태 모음이다.
 * 
 * f: A -> B 라고 쓰고  f는 A에서 B로의 형태 = morphisms
 * 
 */

/**
 * 카테고리 정의 2
 * 
 * f: A -> B 및 g: B -> C 두가지 형태가 있을때
 * 세번쨰 형태인 g ∘ f : A -> C 인 세번째형태가 있다.
 * 
 * 프로그래밍으로서의 정의
 * objects 는 타입
 * morphisms은 함수
 * ∘는 함수의 합성
 *  */


function f(s: string): number {
  return s.length
}

function g(n: number): boolean {
  return n > 2
}

// h = g ∘ f
function h(s: string): boolean {
  return g(f(s))
}

function compose<A, B, C>(g: (b: B) => C, f: (a: A) => B): (a: A) => C {
  return a => g(f(a))
}
