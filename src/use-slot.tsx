import { useMemo } from "react";
import type { Prettify } from "./types";

// eslint-disable-next-line react-refresh/only-export-components
const SlotFragment: React.FC<React.PropsWithChildren<{ [x: string]: any }>> = ({
  children,
}) => {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
SlotFragment.displayName = "@zemd/react-slottable/SlotFragment";

type SlotOptions<T extends React.ElementType> = {
  slot?: T;
};

type SlotsProps<T extends Record<string, React.ElementType>> = {
  slots?: T;
};

type SlotPropsProps<T extends Record<string, any>> = {
  slotProps?: Partial<T>;
};

/**
 * A hook that returns a component for a given slot.
 */
export function useSlot<
  ArgSlotType extends React.ElementType,
  ArgSlotOptions extends SlotOptions<ArgSlotType>,
  ReturnComponent extends ArgSlotOptions extends SlotOptions<infer T>
    ? T
    : React.ElementType,
  ArgSlotsKeys extends Record<string, React.ElementType>,
>(
  name: keyof ArgSlotsKeys,
  props: Prettify<
    SlotsProps<ArgSlotsKeys> & SlotPropsProps<Record<keyof ArgSlotsKeys, any>> // & { [k: string]: any }
  >,
  options: ArgSlotOptions = {} as ArgSlotOptions,
): ReturnComponent {
  const { slots, slotProps } = props;

  const Slot = useMemo(() => {
    return (slots?.[name] ?? options.slot ?? SlotFragment) as ReturnComponent;
  }, [name, slots, options.slot]);

  return useMemo<ReturnComponent>(() => {
    const WrappedComponent: React.FC<React.ComponentProps<ReturnComponent>> = (
      wrappedProps,
    ) => {
      const mergedProps: React.ComponentProps<ReturnComponent> = {
        ...slotProps?.[name],
        ...wrappedProps,
      };
      return <Slot {...mergedProps} />;
    };
    return WrappedComponent as ReturnComponent;
  }, [Slot, name, slotProps]);
}
