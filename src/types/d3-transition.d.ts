import type { BaseType, ValueFn } from 'd3-selection';

declare module 'd3-selection' {
  interface TransitionLike<GElement extends BaseType, Datum> {
    duration(milliseconds: number): this;
    attr(
      name: string,
      value:
        | string
        | number
        | boolean
        | null
        | ValueFn<GElement, Datum, string | number | boolean | null>,
    ): this;
    remove(): this;
  }

  interface Selection<GElement extends BaseType, Datum, PElement extends BaseType, PDatum> {
    transition(name?: string): TransitionLike<GElement, Datum>;
  }
}
