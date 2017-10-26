import test from "ava";
import map from "map-obj";
import filter from "filter-obj";

import { unthis, unthisAll } from ".";

const arrayResult = {
  toString: "toString",
  toLocaleString: "toLocaleString",
  join: "join",
  pop: "pop",
  push: "push",
  reverse: "reverse",
  shift: "shift",
  unshift: "unshift",
  slice: "slice",
  splice: "splice",
  sort: "sort",
  filter: "filter",
  forEach: "forEach",
  some: "some",
  every: "every",
  map: "map",
  indexOf: "indexOf",
  lastIndexOf: "lastIndexOf",
  reduce: "reduce",
  reduceRight: "reduceRight",
  copyWithin: "copyWithin",
  find: "find",
  findIndex: "findIndex",
  fill: "fill",
  includes: "includes",
  entries: "entries",
  keys: "keys",
  concat: "concat"
};

const obj = {
  nameIt(name) {
    this.name = name;
  },
  surnameIt(surname) {
    this.surname = surname;
  }
};

test("return a function that accept this as last arg", t => {
  const nameIt = unthis(obj.nameIt);
  nameIt("named", obj);
  t.is(obj.name, "named");
});

test("return a function with same name as original", t => {
  const fnName = unthis(obj.nameIt).name;
  t.is(fnName, "nameIt");
});

test("returned function is curried", t => {
  const filter = unthis([].filter);
  const even = n => n % 2 === 0;
  const filterEven = filter(even);
  t.deepEqual(filterEven([1, 2, 3, 4]), [2, 4]);
});

test("unthis all methods of an object", t => {
  const obj = unthisAll(Array.prototype);
  t.deepEqual(map(obj, (k, v) => [k, v.name]), arrayResult);
});

test("exclude some methods with exclude option", t => {
  const obj = unthisAll(Array.prototype, { exclude: ["toString"] });
  t.deepEqual(
    map(obj, (k, v) => [k, v.name]),
    filter(arrayResult, k => k !== "toString")
  );
});

test("include only some methods with include option", t => {
  const obj = unthisAll(Array.prototype, { include: ["toString"] });
  t.deepEqual(map(obj, (k, v) => [k, v.name]), { toString: "toString" });
});

test("throws if argument is not a function", t => {
  const err = t.throws(() => unthis(""));
  t.true(err instanceof TypeError);
  t.is(err.message, "method argument shall be a function");
});
