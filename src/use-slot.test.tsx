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
            className: "extra-class",
            "data-testid": "test-div",
          },
        },
      }),
    );

    const Component = result.current;
    const { container } = render(
      <Component className="default-class">Test Content</Component>,
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

  test("should merge extraProps from third argument", () => {
    const CustomDiv = (props: React.HTMLProps<HTMLDivElement>) => (
      <div data-testid="extra-props-div" id="initial-id" {...props} />
    );

    const props = { slotProps: { root: { id: "props-id" } } };

    const { result } = renderHook(() =>
      useSlot("root", props, {
        slot: CustomDiv,
        id: "custom-id",
        "aria-label": "custom-label",
      }),
    );

    const Component = result.current;
    const { container } = render(
      <Component id="default-id">Test Content</Component>,
    );
    const element = container.querySelector(
      "[data-testid='extra-props-div']",
    ) as HTMLElement;

    expect(element).toHaveAttribute("id", "custom-id");
    expect(element).toHaveAttribute("aria-label", "custom-label");
    expect(element).toHaveTextContent("Test Content");
  });
});
