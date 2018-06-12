[@bs.scope "V8Worker2"] [@bs.val] external print : string => unit = "print";

let student = [|{Student.name: "Blaine"}, {Student.name: "Jake"}, {Student.name: "Nick"}|];

let a = Belt.Array.map(student, s => s.name);

Belt.Array.forEach(a, print);
