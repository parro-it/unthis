const unthis = require("unthis").unthis;

const match = unthis(String.prototype.match);
const matchFinalS = match(/s$/);

console.log(matchFinalS("words") !== null); // --> true
console.log(matchFinalS("lollo") !== null); // --> false
