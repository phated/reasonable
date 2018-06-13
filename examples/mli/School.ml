external print : string -> unit = "print"[@@bs.scope "V8Worker2"][@@bs.val ]
type profession =
  | Teacher
  | Director
let person1 = Teacher
let getProfession person =
  match person with | Teacher  -> "A teacher" | Director  -> "A director"
let _ = print (getProfession person1)
