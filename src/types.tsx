import type { ComponentProps, ElementType } from "react";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * A helper type that allows to define proper slot props.
 *
 * Usage:
 * ```ts
 * type ButtonProps = PropsWithSlots<
 *   React.PropsWithChildren<{ name: string }>,
 *   ["startDecorator", "endDecorator"]
 * >;
 * const Button: React.FC<ButtonProps> = (props) => {
 *   const SlotStartDecorator = useSlot("startDecorator", props);
 *   const SlotEndDecorator = useSlot("endDecorator", props);
 *
 *   return (
 *     <button>
 *       <SlotStartDecorator />
 *       {props.children}
 *       <SlotEndDecorator />
 *     </button>
 *   );
 * };
 * ```
 */
export type PropsWithSlots<
  ArgProps = {},
  ArgSlots extends string[] = [],
> = ArgProps &
  (ArgSlots["length"] extends 0
    ? {}
    : {
        slots?: {
          [K in ArgSlots[number]]?: ElementType;
        };
        slotProps?: {
          [K in ArgSlots[number]]?: ComponentProps<ElementType>;
        };
      });
