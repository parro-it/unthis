import curry from "curry";

const includeProp = (object, exclude, include) => prop =>
  prop !== "constructor" &&
  typeof object[prop] === "function" &&
  (include === null || include.includes(prop)) &&
  !exclude.includes(prop);

export function unthis(method) {
  if (typeof method !== "function") {
    throw new TypeError("method argument shall be a function");
  }

  const fn = (...args) => method.apply(args.slice(-1)[0], args.slice(0, -1));

  const ret = curry.to(method.length + 1, fn);
  Object.defineProperty(ret, "name", {
    value: method.name,
    configurable: true
  });

  return ret;
}

export const unthisAll = (object, { exclude = [], include = null } = {}) =>
  Object.assign(
    ...Object.getOwnPropertyNames(Array.prototype)
      .filter(includeProp(object, exclude, include))
      .map(prop => ({ [prop]: unthis(object[prop]) }))
  );
