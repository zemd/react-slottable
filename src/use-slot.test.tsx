import { render, renderHook } from "@testing-library/react";
import { useSlot } from "./use-slot";
import { describe, test, expect } from "vitest";

describe("useSlot", () => {
  test("should return a function", () => {
    const ref = { current: "rootElement" };
    const { result } = renderHook(() => {
      return useSlot("root", {
        ref,
        component: "div" as React.ElementType,
        props: {},
      });
    });
    const [Component] = result.current;

    expect(Component).toBe("div");
    expect(typeof Component).toBe("string");
  });

  test("should return a component with the correct props", () => {
    const ref = { current: "rootElement" };
    const { result } = renderHook<
      [any, Record<string, any>],
      Record<string, any>
    >(() => {
      return useSlot("root", {
        ref,
        component: "div" as React.ElementType,
        props: { id: "test" },
      });
    });
    const [Component, componentProps] = result.current;
    const { container } = render(<Component {...componentProps} />);

    expect(Component).toBe("div");
    expect(container.firstChild).toHaveAttribute("id", "test");
  });

  test("should merge classNames correctly", () => {
    const ref = { current: "rootElement" };
    const { result } = renderHook<
      [any, Record<string, any>],
      Record<string, any>
    >(() => {
      return useSlot("root", {
        ref,
        component: "div" as React.ElementType,
        props: {},
        className: "test-class",
        classNameMergeFn: (className) => {
          return `${className} merged-class`;
        },
      });
    });
    const [Component, componentProps] = result.current;
    const { container } = render(<Component {...componentProps} />);

    expect(container.firstChild).toHaveClass("test-class");
    expect(container.firstChild).toHaveClass("merged-class");
  });

  test("returned function passes extra props", () => {
    const ref = { current: "rootElement" };
    const { result } = renderHook<
      [any, Record<string, any>],
      Record<string, any>
    >(() => {
      return useSlot("root", {
        ref,
        component: "div" as React.ElementType,
        props: {},
        extraProps: { "data-test": "test" },
      });
    });
    const [Component, componentProps] = result.current;
    const { container } = render(<Component {...componentProps} />);

    expect(container.firstChild).toHaveAttribute("data-test", "test");
  });
});
