import { render, renderHook } from "@testing-library/react";
import { useSlot } from "./use-slot";
import { describe, test, expect } from "vitest";

describe("useSlot", () => {
  test("should return a component", () => {
    const { result } = renderHook(() =>
      useSlot("root", {
        slots: {
          root: "div",
        },
      }),
    );

    expect(typeof result.current).toBe("function");
  });

  test("should render default SlotFragment when no slot is provided", () => {
    const { result } = renderHook(() => useSlot("root", {}));
    const Component = result.current;
    const { container } = render(<Component>Test Content</Component>);

    expect(container).toHaveTextContent("Test Content");
  });

  test("should use provided slot component", () => {
    const CustomDiv = (props: React.HTMLProps<HTMLDivElement>) => (
      <div data-testid="custom-div" {...props} />
    );

    const { result } = renderHook(() =>
      useSlot("root", {
        slots: {
          root: CustomDiv,
        },
      }),
    );

    const Component = result.current;
    const { container } = render(<Component>Test Content</Component>);

    expect(container.querySelector("[data-testid='custom-div']")).toBeTruthy();
  });

  test("should merge slot props correctly", () => {
    const { result } = renderHook(() =>
      useSlot("root", {
        slots: {
          root: "div",
        },
        slotProps: {
          root: {
            className: "default-class",
            "data-testid": "test-div",
          },
        },
      }),
    );

    const Component = result.current;
    const { container } = render(
      <Component className="extra-class">Test Content</Component>,
    );

    const element = container.firstChild as HTMLElement;
    expect(element).toHaveClass("extra-class");
    expect(element).toHaveAttribute("data-testid", "test-div");
  });

  test("should use slot from options if slots prop is not provided", () => {
    const CustomDiv = (props: React.HTMLProps<HTMLDivElement>) => (
      <div data-testid="option-div" {...props} />
    );

    const { result } = renderHook(() =>
      useSlot(
        "root",
        {},
        {
          slot: CustomDiv,
        },
      ),
    );

    const Component = result.current;
    const { container } = render(<Component>Test Content</Component>);

    expect(container.querySelector("[data-testid='option-div']")).toBeTruthy();
  });
});
