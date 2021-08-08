import { getText } from "./strings.helper";

it("returns correct value for key", () => {
  const val = getText("pageHeader");
  expect(val).toStrictEqual("TimeLogger");
});

it("returns default text for non existatn key", () => {
  const val = getText("adkjflkdj");
  expect(val).toStrictEqual("text not found");
});
