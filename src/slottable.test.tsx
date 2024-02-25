import { slottable } from "./slottable";
import { render } from "@testing-library/react";
import type { TSlottablePropsFactory } from "./types";
import { describe, test, expect } from "vitest";

describe("slottable", () => {
  test("should render children in specific slots", () => {
    const Component = slottable<"div", TSlottablePropsFactory<object>>(
      ({ children }) => {
        return <div>{children}</div>;
      }
    );
    const { getByText } = render(
      <Component>
        <div data-testid="test-child">Test child</div>
      </Component>
    );
    expect(typeof Component).toBe("object"); // slottable returns Exotic component
    expect(getByText("Test child")).toBeInTheDocument();
  });

  test("should have a display name if provided", () => {
    const Component = slottable<"div", TSlottablePropsFactory<object>>(
      ({ children }) => {
        return <div>{children}</div>;
      },
      "TestComponent"
    );
    expect(Component.displayName).toBe("TestComponent");
  });

  test("should accept undefined as a valid value for className prop", () => {
    const Component = slottable<"div", TSlottablePropsFactory<object>>(
      ({ children }) => {
        return <div>{children}</div>;
      }
    );
    const { getByText } = render(
      <Component className={undefined}>
        <div data-testid="test-child">Test child</div>
      </Component>
    );
    expect(typeof Component).toBe("object"); // slottable returns Exotic component
    expect(getByText("Test child")).toBeInTheDocument();
  });

  test("should accept null as a valid value for className prop", () => {
    const Component = slottable<"div", TSlottablePropsFactory<object>>(
      ({ children }) => {
        return <div>{children}</div>;
      }
    );
    const { getByText } = render(
      <Component className={null}>
        <div data-testid="test-child">Test child</div>
      </Component>
    );
    expect(typeof Component).toBe("object"); // slottable returns Exotic component
    expect(getByText("Test child")).toBeInTheDocument();
  });
});
