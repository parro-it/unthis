import curry from "curry";

const includeProp = (object, exclude, include) => prop =>
  prop !== "constructor" &&
  typeof object[prop] === "function" &&
  (include === null || include.includes(prop)) &&
  !exclude.includes(prop);

/**
 * Given an object method, unthis return a function that
 * accept all original arguments plus one.
 * It forward all arguments to the method, and uses the
 * last argument as `this` context for it.
 *
 * @param  {Function} method The original method to transform
 * @return {Function} The transformed function
 */
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

/**
 * Given an object, unthisAll apply `unthis` to all its
 * methods, and return an object containing all resulting functions.
 *
 * By default, all object methods are extracted. Otherwise, you can
 * also specify which method to include or exclude.
 *
 * @param  {Object} object The object containing methods to transform.
 * @param  {Array} exclude An array containing name of methods to transform.
 * @param  {Array} include An array containing name of methods to exclude from transform.
 * @return {Object} An object with all transformed methods.
 */
export const unthisAll = (object, { exclude = [], include = null } = {}) =>
  Object.assign(
    ...Object.getOwnPropertyNames(Array.prototype)
      .filter(includeProp(object, exclude, include))
      .map(prop => ({ [prop]: unthis(object[prop]) }))
  );
