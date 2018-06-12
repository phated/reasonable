[@bs.scope "V8Worker2"] [@bs.val] external print : float => unit = "print";

/* Based on https://rosettacode.org/wiki/Random_numbers#OCaml */
let pi = 4. *. atan(1.);

let random_gaussian = () =>
  1. +. sqrt((-2.) *. log(Random.float(1.))) *. cos(2. *. pi *. Random.float(1.));

Belt.Array.makeBy(42, (_) => random_gaussian()) |. Belt.Array.forEach(print);
