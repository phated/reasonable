[@bs.scope "V8Worker2"] [@bs.val] external print : int => unit = "print";

/* Based on https://rosettacode.org/wiki/Factorial#Recursive_50 */
let rec factorial = (n) =>
  n <= 0
  ? 1
  : n * factorial(n - 1);

print(factorial(6));
