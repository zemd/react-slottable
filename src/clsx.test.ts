/* eslint tailwindcss/no-custom-classname: off */

import { describe, expect, test } from "vitest";
import { clsx } from "./clsx";

const getTrue = (): boolean => {
  return true;
};

const getNum = (num = 0): number => {
  return num;
};

describe("Compatibility suite with classnames", () => {
  test("(compat) keeps object keys with truthy values", () => {
    const out = clsx({ a: true, b: false, c: 0, d: null, e: undefined, f: 1 });
    expect(out).toBe("a f");
  });

  test("(compat) joins arrays of class names and ignore falsy values", () => {
    const out = clsx("a", 0, null, undefined, true, 1, "b");
    expect(out).toBe("a 1 b");
  });

  test("(compat) supports heterogenous arguments", () => {
    expect(clsx({ a: true }, "b", 0)).toBe("a b");
  });

  test("(compat) should be trimmed", () => {
    expect(clsx("", "b", {}, "")).toBe("b");
  });

  test("(compat) returns an empty string for an empty configuration", () => {
    expect(clsx({})).toBe("");
  });

  test("(compat) supports an array of class names", () => {
    expect(clsx(["a", "b"])).toBe("a b");
  });

  test("(compat) joins array arguments with string arguments", () => {
    expect(clsx(["a", "b"], "c")).toBe("a b c");
    expect(clsx("c", ["a", "b"])).toBe("c a b");
  });

  test("(compat) handles multiple array arguments", () => {
    expect(clsx(["a", "b"], ["c", "d"])).toBe("a b c d");
  });

  test("(compat) handles arrays that include falsy and true values", () => {
    expect(clsx(["a", 0, null, undefined, false, true, "b"])).toBe("a b");
  });

  test("(compat) handles arrays that include arrays", () => {
    expect(clsx(["a", ["b", "c"]])).toBe("a b c");
  });

  test("(compat) handles arrays that include objects", () => {
    expect(clsx(["a", { b: true, c: false }])).toBe("a b");
  });

  test("(compat) handles deep array recursion", () => {
    expect(clsx(["a", ["b", ["c", { d: true }]]])).toBe("a b c d");
  });

  test("(compat) handles arrays that are empty", () => {
    expect(clsx("a", [])).toBe("a");
  });

  test("(compat) handles nested arrays that have empty nested arrays", () => {
    expect(clsx("a", [[]])).toBe("a");
  });

  test("(compat) handles all types of truthy and falsy property values as expected", () => {
    const out = clsx({
      // falsy:
      null: null,
      emptyString: "",
      noNumber: Number.NaN,
      zero: 0,
      negativeZero: -0,
      false: false,
      undefined: undefined,

      // truthy (literally anything else):
      nonEmptyString: "foobar",
      whitespace: " ",
      function: Object.prototype.toString, // eslint-disable-line @typescript-eslint/unbound-method
      emptyObject: {},
      nonEmptyObject: { a: 1, b: 2 },
      emptyList: [],
      nonEmptyList: [1, 2, 3],
      greaterZero: 1,
    });

    expect(out).toBe(
      "nonEmptyString whitespace function emptyObject nonEmptyObject emptyList nonEmptyList greaterZero",
    );
  });
});

describe("Compatibility suite with clsx", () => {
  test("strings", () => {
    expect(clsx("")).toBe("");
    expect(clsx("foo")).toBe("foo");
    expect(clsx(getTrue() && "foo")).toBe("foo");
    expect(clsx(!getTrue() && "foo")).toBe("");
  });

  test("strings (variadic)", () => {
    expect(clsx("")).toBe("");
    expect(clsx("foo", "bar")).toBe("foo bar");
    expect(clsx(getTrue() && "foo", !getTrue() && "bar", "baz")).toBe(
      "foo baz",
    );
    expect(clsx(!getTrue() && "foo", "bar", "baz", "")).toBe("bar baz");
  });

  test("numbers", () => {
    expect(clsx(1)).toBe("1");
    expect(clsx(12)).toBe("12");
    expect(clsx(0.1)).toBe("0.1");
    expect(clsx(0)).toBe("");

    expect(clsx(Number.POSITIVE_INFINITY)).toBe("Infinity");
    expect(clsx(Number.NaN)).toBe("");
  });

  test("numbers (variadic)", () => {
    expect(clsx(0, 1)).toBe("1");
    expect(clsx(1, 2)).toBe("1 2");
  });

  test("objects", () => {
    expect(clsx({})).toBe("");
    expect(clsx({ foo: true })).toBe("foo");
    expect(clsx({ foo: true, bar: false })).toBe("foo");
    expect(clsx({ foo: "hiya", bar: 1 })).toBe("foo bar");
    expect(clsx({ foo: 1, bar: 0, baz: 1 })).toBe("foo baz");
    expect(clsx({ "-foo": 1, "--bar": 1 })).toBe("-foo --bar");
  });

  test("objects (variadic)", () => {
    expect(clsx({}, {})).toBe("");
    expect(clsx({ foo: 1 }, { bar: 2 })).toBe("foo bar");
    expect(clsx({ foo: 1 }, null, { baz: 1, bat: 0 })).toBe("foo baz");
    expect(
      clsx(
        { foo: 1 },
        {},
        {},
        { bar: "a" },
        { baz: null, bat: Number.POSITIVE_INFINITY },
      ),
    ).toBe("foo bar bat");
  });

  test("arrays", () => {
    expect(clsx([])).toBe("");
    expect(clsx(["foo"])).toBe("foo");
    expect(clsx(["foo", "bar"])).toBe("foo bar");
    expect(clsx(["foo", getNum(0) && "bar", getNum(1) && "baz"])).toBe(
      "foo baz",
    );
  });

  test("arrays (nested)", () => {
    expect(clsx([[[]]])).toBe("");
    expect(clsx([[["foo"]]])).toBe("foo");
    expect(clsx([true, [["foo"]]])).toBe("foo");
    expect(clsx(["foo", ["bar", ["", [["baz"]]]]])).toBe("foo bar baz");
  });

  test("arrays (variadic)", () => {
    expect(clsx([], [])).toBe("");
    expect(clsx(["foo"], ["bar"])).toBe("foo bar");
    expect(clsx(["foo"], null, ["baz", ""], true, "", [])).toBe("foo baz");
  });

  test("arrays (no `push` escape)", () => {
    expect(clsx({ push: 1 })).toBe("push");
    expect(clsx({ pop: true })).toBe("pop");
    expect(clsx({ push: true })).toBe("push");
    expect(clsx("hello", { world: 1, push: true })).toBe("hello world push");
  });

  test("functions", () => {
    const foo = (): void => {
      return;
    };
    expect(clsx(foo, "hello")).toBe("hello");
    expect(clsx(foo, "hello", clsx)).toBe("hello");
    expect(clsx(foo, "hello", [[clsx], "world"])).toBe("hello world");
  });
});
