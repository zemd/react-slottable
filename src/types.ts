import type {
  PropsWithChildren,
  ComponentProps,
  ComponentPropsWithRef,
  CSSProperties,
  ElementType,
  Ref,
  ReactNode,
  JSX,
} from "react";

/**
 * A minimum required structure for the `TConf` field.
 */
export interface TComponentConfig {
  props: object;
  defaultComponent: ElementType;
}

/**
 * Remove properties `K` from `T`.
 * Distributive for union types.
 */
type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never;

/**
 * Props of the component if `component={Component}` is used.
 */
// prettier-ignore
type TOverridableComponentProps<
  TArgComponentConfig extends TComponentConfig,
  TArgComponentType extends ElementType
> = (
  & TArgComponentConfig["props"]
  & DistributiveOmit<ComponentPropsWithRef<TArgComponentType>, keyof TArgComponentConfig["props"]>
);

/**
 * Props if `component={Component}` is NOT used.
 */
// prettier-ignore
type DefaultComponentProps<TArgComponentConfig extends TComponentConfig> =
  & TArgComponentConfig["props"]
  & DistributiveOmit<ComponentPropsWithRef<TArgComponentConfig['defaultComponent']>, keyof TArgComponentConfig["props"]>;

/**
 * A component whose root component can be controlled via a `component` prop.
 *
 * Adjusts valid props based on the type of `component`.
 */
interface TOverridableComponent<TArgComponentConfig extends TComponentConfig> {
  // if you construct a Component with component prop
  <TArgComponentType extends ElementType>(
    props: {
      /**
       * The component used for the root node.
       * Either a string to use a HTML element or a component.
       */
      component: TArgComponentType;
    } & TOverridableComponentProps<TArgComponentConfig, TArgComponentType>,
  ): JSX.Element | null;
  // if you construct a Component without component prop
  (props: DefaultComponentProps<TArgComponentConfig>): JSX.Element | null;
  propTypes?: any;
}

/**
 * A minimum required structure for the slot inside `useSlot`.
 * Since we are building a single slot in a time we don't need to think
 * about other slots in `slots` map.
 *
 * slots: {
 *   [name]: ElementType
 * }
 *
 * for example,
 * slots: {
 *   startDecoration: "div",
 * }
 */
export type TSlotMap<TArgSlotName extends string> = {
  [SlotName in TArgSlotName]?: ElementType;
}; // == Partial<Record<TName, ElementType>>;

/**
 * Returns the type that comprises possible props for selected ComponentType.
 * For example, if we provide a `component` with value `div`, it will return
 * all props that user can pass into the div element. But if the `component` value
 * does not inherit from ElementType, it uses default component, which is usually `div`.
 */
export type TSlotComponentType<
  TArgComponentName extends string,
  TArgSlotMap extends TSlotMap<TArgComponentName>,
  TArgComponentType extends ElementType,
> = TArgSlotMap[TArgComponentName] extends ElementType
  ? ComponentProps<TArgSlotMap[TArgComponentName]>
  : ComponentProps<TArgComponentType>;

/**
 * A minimum required structure for the `slotProps` field.
 *
 * slotProps: {
 *   [name]: {
 *     ...ComponentProps(slots[name] || DefaultComponentType)
 *   }
 * }
 */
export type TSlotProps<
  TArgComponentName extends string,
  TArgSlotMap extends TSlotMap<TArgComponentName>,
  TArgComponentType extends ElementType,
> = {
  [Name in TArgComponentName]?: TSlotComponentType<
    Name,
    TArgSlotMap,
    TArgComponentType
  >;
};

/**
 * Provides a types for props for components that use slots.
 * There are 2 important props: `slots` and `slotProps`
 */
export interface TComponentWithSlotsAndProps<
  TArgSlotMap extends TSlotMap<string>, // a map of substitutions of components' ElementType
  TArgSlotProps extends TSlotProps<string, TArgSlotMap, ElementType>, // a set of slots' names
> {
  slots?: TArgSlotMap;
  slotProps?: {
    [P in keyof TArgSlotProps]?: TArgSlotProps[P];
  };
}

/**
 * Provides a types of components that can change their root element type.
 * For example, if you want to change Button element type from `button` to `div`
 * you can provide a prop named `component`.
 *
 * for example,
 * <Button component="div" />
 */
export interface TComponentDefProp<
  TComponentType extends ElementType = ElementType,
> {
  component?: TComponentType;
}

/**
 * This actual type that you have to use for your component.
 * It works just like PropsWithChildren.
 * The type overrides `component` prop in your `props` object,
 * with the type you provide here.
 *
 * for example,
 * type TMyButtonProps = PropsWithComponent<"div", { type: "submit" | "button"; component: "button" }>
 *
 * in result you receive:
 * type TMyButtonProps = { type: "submit" | "button"; component: "div" }
 */
export type PropsWithComponent<
  TComponentType extends ElementType,
  TProps = unknown,
> = TComponentDefProp<TComponentType> & Omit<TProps, "component">;

/**
 * Common props for components that usually all components have.
 */
export interface TCommonProps {
  className?: string | undefined | null;
  style?: CSSProperties;
  ref?: Ref<any>;
}

/**
 * All slots can receive additional props values, either from inside component implementation,
 * or from user space by providing `slotProps` prop.
 *
 * Here we calculate the types for each prop that can be used inside `slotProps` object.
 */
export type TSlotProp<
  TArgComponentType extends ElementType,
  TArgExtraProps = unknown,
> = TArgExtraProps & // a list of a custom props which are not related to the ComponentType but you want to define them explicitly
  TComponentDefProp<TArgComponentType> & // NOTE: we don't have to use PropsWithComponent here, since we override ExtraProps with these value, and we want to be as simple as possible
  ComponentPropsWithRef<TArgComponentType> & // pass all standard Component's props + ref + component, for example, if you are building 'ul' slot, you want to be able to provide all props that 'ul' component accepts
  Record<string, unknown>; // additional props that are not included into ComponentType

/**
 * I think this name fits better than `OverridableComponent`. But this a matter of taste.
 * Anyway TSlottable encapsulates the OverridableComponent implementation, that allows to
 * replace it in future. But at the moment, it is one of the best available implementations.
 *
 * `TSlottable` as a `OverridableComponent` represents a functional component, that might accept
 * `component` prop. For easier manipulations with types, it requires configuration object
 * `TConf`. the TConf is includes `props` object and `defaultComponent`.
 *
 * Additionally the `gin-ui` extends the default OverridableComponent type by
 * requiring providing `displayName` and provided `TStaticProps`.
 *
 * for example,
 * TSlottable<
 *  { props: { className: "flex", component?: ElementType }, defaultComponent: "div" },
 *  { ListItem: typeof ListItem }
 * >
 *
 * This will create a new component that can describe components that
 * - can change it's root element.
 * - in case if component is not used `defaultComponent` will be used as type hint
 * - the component can provide a nested static sub-component, that can be used as, for example, <List.ListItem/>
 * - the component requires mandatory `displayName` field to exist
 */
// prettier-ignore
export type TSlottable<
  TArgComponentConf extends TComponentConfig, // OverridableTypeMap defines 2 required fields: `props` and `defaultComponent`
  TArgStaticProps // any possible additional props that you want to see in static fields of the component
> = 
 & TOverridableComponent<TArgComponentConf> 
 & { displayName: string; } 
 & TArgStaticProps;

/**
 * This is a TConf factory to create TSlottableConf,
 * which is used in TSlottable
 */
export interface TSlottableConfigFactory<
  TArgProps,
  TArgComponentType extends ElementType,
> {
  props: TArgProps;
  defaultComponent: TArgComponentType;
}

/**
 * More concrete type, for making it easy to create components with less boilerplate code
 */
export type TSlottableFactory<
  TArgProps extends object = object,
  TArgComponentType extends ElementType = ElementType,
  TArgStaticProps = object,
> = TSlottable<
  TSlottableConfigFactory<TArgProps, TArgComponentType>,
  TArgStaticProps
>;

type TObjectSlotDef = { [K in string]: ElementType };
type TMaybeSlotDef = string | TObjectSlotDef;

/**
 * type TMyButtonProps = TSlottablePropsFactory<{ hello: string }, "slot1" | "slot2">
 * type TMyButtonProps = TSlottablePropsFactory<{ hello: string }, { slot1: ElementType; slot2: Button }>
 */
// prettier-ignore
export type TSlottablePropsFactory<
  TArgProps,
  TArgSlotDef extends TMaybeSlotDef = TObjectSlotDef
> = PropsWithChildren<
  {
    // ↓ adds `slots` and `slotProps` props into the component props object
    slots?: {
      [K in TArgSlotDef extends string
        ? TArgSlotDef
        : keyof TArgSlotDef]?: TArgSlotDef extends TObjectSlotDef ? TArgSlotDef[K] : ElementType;
    };
    // ↓ `slotProps`
    slotProps?: {
      [K in TArgSlotDef extends string
        ? TArgSlotDef
        : keyof TArgSlotDef]?: TArgSlotDef extends TObjectSlotDef
        ? ComponentProps<TArgSlotDef[K]>
        : ComponentProps<ElementType>;
    };
  } 
  & Omit<TCommonProps, "ref"> 
  & TArgProps 
  & { component?: ElementType } 
  & Partial<
    Record<TArgSlotDef extends string ? TArgSlotDef : keyof TArgSlotDef, ReactNode>
  >
>;
