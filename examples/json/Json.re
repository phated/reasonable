/* TODO: This ***sometimes*** crashes and I don't know why (something about malloc) */
[@bs.scope "V8Worker2"] [@bs.val] external print : string => unit = "print";

open Belt;

[@bs.deriving abstract]
type fullName = {
  first: string,
  last: string,
};

[@bs.deriving abstract]
type person = {
  name: fullName,
  age: int,
};

let person1 = person(~name=fullName(~first="Ricky", ~last="Zhang"), ~age=10);

/* encode person1, then decode it */
let json =
  person1
  |. Js.Json.stringifyAny
  |. Option.getExn
  |. Js.Json.parseExn;

let name =
  json
  |. Js.Json.decodeObject
  |. Option.flatMap(p => Js.Dict.get(p, "name"))
  |. Option.flatMap(json => Js.Json.decodeObject(json))
  |. Option.getExn;

let firstName =
  Js.Dict.get(name, "first")
  |. Option.flatMap(json => Js.Json.decodeString(json))
  |. Option.getExn;

let lastName =
  Js.Dict.get(name, "last")
  |. Option.flatMap(json => Js.Json.decodeString(json))
  |. Option.getExn;

print({j|Hello, $firstName $lastName|j});
