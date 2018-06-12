[@bs.scope "V8Worker2"] [@bs.val] external print : string => unit = "print";

for (a in 1 to 10) {
  for (b in 1 to 10) {
    let product = a * b;
    print({j|🐙 $a times $b is $product|j})
  }
};
