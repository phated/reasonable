[@bs.scope "V8Worker2"] [@bs.val] external print : string => unit = "print";

/* Based on https://rosettacode.org/wiki/FizzBuzz#OCaml */
/* let fizzbuzz = (i) =>
  switch (i mod 3, i mod 5) {
  | (0, 0) => "FizzBuzz"
  | (0, _) => "Fizz"
  | (_, 0) => "Buzz"
  | _ => string_of_int(i)
  };

for (i in 1 to 100) {
  print(fizzbuzz(i))
}; */


module Foo = {
  type a = {name: string};
};

let student = [|{Foo.name: "Blaine"}, {Foo.name: "Jake"}, {Foo.name: "Nick"}|];

let a = Belt.Array.map(student, s => s.name);

Belt.Array.forEach(a, print);

/* Js.log(""); */
