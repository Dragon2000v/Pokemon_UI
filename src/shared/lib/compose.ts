type Fn<T> = (arg: T) => T;

export function compose<T>(...fns: Fn<T>[]) {
  return (x: T) => fns.reduceRight((v, f) => f(v), x);
}
