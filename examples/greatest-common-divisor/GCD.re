[@bs.scope "V8Worker2"] [@bs.val] external print : int => unit = "print";

/* Based on https://rosettacode.org/wiki/Greatest_common_divisor#OCaml */
let rec gcd = (a, b) =>
  switch (a mod b) {
  | 0 => b
  | r => gcd(b, r)
  };

print(gcd(27, 9));
