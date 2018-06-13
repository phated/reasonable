external print : string -> unit = "print"[@@bs.scope "V8Worker2"][@@bs.val ]
let fizzbuzz i =
  match ((i mod 3), (i mod 5)) with
  | (0,0) -> "FizzBuzz"
  | (0,_) -> "Fizz"
  | (_,0) -> "Buzz"
  | _ -> string_of_int i
let _ = for i = 1 to 100 do print (fizzbuzz i) done
