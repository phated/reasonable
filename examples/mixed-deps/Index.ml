external print : string -> unit = "print"[@@bs.scope "V8Worker2"][@@bs.val ]
let student =
  [|{ Student.name = "Blaine" };
  { Student.name = "Jake" };
  { Student.name = "Nick" }|]
let a = Belt.Array.map student (fun s  -> s.name)
let _ = Belt.Array.forEach a print
