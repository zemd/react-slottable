import { type TClassValue, clsx } from "./clsx";
import type { ComponentProps, ElementType, ForwardedRef } from "react";
import type {
  TCommonProps,
  TComponentDefProp,
  TSlotComponentType,
  TSlotProps,
  TSlotMap,
  TComponentWithSlotsAndProps,
} from "./types";
import { mergeProps } from "./merge-props";

/**
 * A function that merges class names.
 */
type TMergeFn = (className: string) => string;

/**
 * The default class name merger function.
 */
const merger = (v: string): string => {
  return v;
};

/**
 * A hook that returns a component and its props for a given slot.
 */
export function useSlot<
  TArgThisSlotName extends string,
  TArgComponentType extends ElementType,
  TArgSlotMap extends TSlotMap<TArgThisSlotName>,
  TArgSlotProps extends TSlotProps<
    TArgThisSlotName,
    TArgSlotMap,
    TArgComponentType
  >,
  TResultComponentType extends TSlotComponentType<
    TArgThisSlotName,
    TArgSlotMap,
    TArgComponentType
  >,
  TArgProps extends TCommonProps &
    TComponentDefProp<TResultComponentType> &
    TComponentWithSlotsAndProps<TArgSlotMap, TArgSlotProps> &
    ComponentProps<TResultComponentType> &
    Record<string, unknown>,
  TReturn extends [
    TResultComponentType,
    { className: string } & TArgSlotProps[TArgThisSlotName] &
      ComponentProps<TResultComponentType> &
      Record<string, unknown>,
  ],
>(
  name: TArgThisSlotName,
  params: // root slot must pass a `ref` as a parameter
  (TArgThisSlotName extends "root"
    ? { ref: ForwardedRef<any> }
    : { ref?: ForwardedRef<any> }) & {
    /**
     * The slot's className
     */
    className?: TClassValue;
    /**
     * The slot's default component
     */
    component: TArgComponentType;
    props: TArgProps;
    extraProps?: TCommonProps & ComponentProps<TResultComponentType>;
    classNameMergeFn?: TMergeFn;
  },
): TReturn {
  const {
    className, // base className for the slot
    component: defaultComponent, // default Component type
    ref,
    props: inProps,
    extraProps,
    classNameMergeFn = merger,
  } = params;

  const {
    component: rootComponent,
    slots = { [name]: undefined },
    slotProps: inSlotProps = { [name]: undefined },
    ...other
  } = inProps;

  const slotProps = { [name]: undefined, ...inSlotProps };

  const resolveComponentElement = (): TResultComponentType => {
    if (name === "root" && rootComponent) {
      return rootComponent as unknown as TResultComponentType;
    }

    if (slots[name]) {
      return slots[name] as unknown as TResultComponentType;
    }

    return defaultComponent as unknown as TResultComponentType;
  };

  const componentElement: TResultComponentType = resolveComponentElement();

  const slotClassName = classNameMergeFn(
    clsx(
      className ?? "",
      {
        [inProps.className]: name === "root" && !!inProps.className,
      },
      extraProps?.className ?? false, // TODO: weird warning here
      slotProps[name]?.className,
    ),
  );

  const props = Object.assign(
    // merge function recursively merges Array and Object values,
    // that means ref is being cloned rather then passed by reference
    mergeProps<
      TArgSlotProps[TArgThisSlotName] &
        ComponentProps<TResultComponentType> & { className: string }
    >(
      name === "root" ? other : {},
      extraProps,
      slotProps[name],
      slotClassName ? { className: slotClassName } : {},
    ),
    {
      ref,
    },
  );

  return [componentElement, props] as TReturn;
}
