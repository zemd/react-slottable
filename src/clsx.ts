/**
 * Represents a class value that can be used in the `clsx` function.
 */
export type TClassValue =
  | TClassArray
  | TClassMap
  | string
  | number
  | boolean
  | null
  | undefined;

/**
 * Represents an array of class values that can be used in the `clsx` function.
 */
type TClassArray = TClassValue[];

/**
 * Represents a map of class values that can be used in the `clsx` function.
 */
type TClassMap = Record<string, unknown>;

/**
 * Concatenates two strings with a space separator if both are truthy.
 *
 * @param a - The first string to concatenate.
 * @param b - The second string to concatenate.
 * @returns The concatenated string.
 */
const concat = (a: unknown, b: unknown): string => {
  return [a, b].filter(Boolean).join(" ");
};

/**
 * Casts a class value to a string that can be used in the `clsx` function.
 *
 * @param input - The class value to cast.
 * @returns The string representation of the class value.
 */
const castValue = (input: TClassValue): string => {
  if (typeof input === "string" || typeof input === "number") {
    return `${input}`;
  }
  if (Array.isArray(input)) {
    return clsx(...input);
  }
  if (typeof input === "object") {
    let res = "";
    for (let className in input) {
      if (input[className]) {
        res = concat(res, clsx(className));
      }
    }
    return res;
  }
  return "";
};

/**
 * Returns a string of concatenated class names.
 *
 * @param inputs - The class values to concatenate.
 * @returns The concatenated string of class names.
 */
export const clsx = (...inputs: TClassValue[]): string => {
  return inputs.reduce<string>((acc, input) => {
    if (input) {
      const value: string = castValue(input);
      return concat(acc, value);
    }
    return acc;
  }, "");
};
