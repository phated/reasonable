[@bs.scope "V8Worker2"] [@bs.val] external print : string => unit = "print";

type profession = Teacher | Director;

let person1 = Teacher;
let getProfession = (person) =>
  switch (person) {
  | Teacher => "A teacher"
  | Director => "A director"
  };

print(getProfession(person1));
