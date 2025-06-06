import React, {
  type ComponentProps,
  type ElementType,
  type FC,
  type PropsWithChildren,
} from "react";
import type { Prettify } from "./types";

// eslint-disable-next-line react-refresh/only-export-components
const SlotFragment: FC<PropsWithChildren<{ [x: string]: any }>> = ({
  children,
}) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
SlotFragment.displayName = "@zemd/react-slottable/SlotFragment";

type SlotOptions<T extends ElementType> = {
  slot?: T;
};

type SlotsProps<T extends Record<string, ElementType>> = {
  slots?: T;
};

type SlotPropsProps<T extends Record<string, any>> = {
  slotProps?: Partial<T>;
};

/**
 * A hook that returns a component for a given slot.
 */
export function useSlot<
  ArgSlotType extends ElementType,
  ArgExtraProps extends Partial<ComponentProps<ArgSlotType>>,
  ArgSlotOptions extends SlotOptions<ArgSlotType> & ArgExtraProps,
  ReturnComponent extends ArgSlotOptions extends SlotOptions<infer T>
    ? T
    : ElementType,
  ArgSlotsKeys extends Record<string, ElementType>,
>(
  name: keyof ArgSlotsKeys,
  props: Prettify<
    SlotsProps<ArgSlotsKeys> & SlotPropsProps<Record<keyof ArgSlotsKeys, any>> // & { [k: string]: any }
  >,
  { slot, ...extraProps }: ArgSlotOptions = {} as ArgSlotOptions,
): ReturnComponent {
  const { slots, slotProps } = props;

  const Slot = React.useMemo(() => {
    return (slots?.[name] ?? slot ?? SlotFragment) as ReturnComponent;
  }, [name, slots, slot]);

  return React.useMemo<ReturnComponent>(() => {
    const WrappedComponent: FC<ComponentProps<ReturnComponent>> = (
      wrappedProps,
    ) => {
      const mergedProps: ComponentProps<ReturnComponent> = {
        ...wrappedProps,
        ...slotProps?.[name],
        ...extraProps,
      };
      return <Slot {...mergedProps} />;
    };
    return WrappedComponent as ReturnComponent;
  }, [Slot, name, slotProps, extraProps]);
}
