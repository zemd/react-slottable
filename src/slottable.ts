import {
  type ForwardRefRenderFunction,
  forwardRef,
  type ElementType,
} from "react";
import type { TSlottableFactory } from "./types";

/**
 * Creates a slottable component that can be used to render children in specific slots.
 */
export function slottable<
  TArgComponentType extends ElementType,
  TArgProps extends Record<string, unknown> = Record<string, unknown>,
  TArgRefInstance = unknown,
  TArgStaticProps = object,
  TReturns extends TSlottableFactory<
    TArgProps,
    TArgComponentType,
    TArgStaticProps
  > = TSlottableFactory<TArgProps, TArgComponentType, TArgStaticProps>,
>(
  render: ForwardRefRenderFunction<TArgRefInstance, TArgProps>,
  displayName?: string,
): TReturns {
  const Component: TReturns = forwardRef<TArgRefInstance, TArgProps>(
    render,
  ) as unknown as TReturns;
  Component.displayName =
    displayName ?? `@zemd/react-slottable/${render.name || "UnknownComponent"}`;
  return Component;
}
