import test from "ava";
import unthis from ".";

test("exports a function", t => {
  t.is(typeof unthis, "function");
});
