import { findVars, replaceVars } from "./interpolation";

describe("findVars", () => {
  const TEST_CASES = {
    $foo: ["foo"],
    "$first.second": ["first.second"],
    "$foo $bar": ["foo", "bar"],
    "$foo and $bar": ["foo", "bar"],
    "the $foo or $bar u want": ["foo", "bar"],
    "the $foo and $bar.baz.": ["foo", "bar.baz"]
  };

  Object.entries(TEST_CASES).forEach(([input, output]) => {
    test(input, () => {
      // expect(findVars("$foo")).toEqual(["foo"]);
      expect(findVars(input)).toEqual(output);
    });
  });
});

describe("replaceVars", () => {
  const TEST_CASES = [
    ["hello, $world", { world: "there" }, "hello, there"],
    ["$foo $bar", { foo: "one", bar: "two" }, "one two"]
  ];

  TEST_CASES.forEach(([str, vars, output]: [string, any, string]) => {
    test(`${str} ${JSON.stringify(vars)}`, () => {
      expect(replaceVars(str, vars)).toEqual(output);
    });
  });
});
