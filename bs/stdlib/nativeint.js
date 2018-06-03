

import * as Caml_format from "./caml_format.js";
import * as Caml_primitive from "./caml_primitive.js";

function succ(n) {
  return n + 1;
}

function pred(n) {
  return n - 1;
}

function abs(n) {
  if (n >= 0) {
    return n;
  } else {
    return -n;
  }
}

function lognot(n) {
  return n ^ -1;
}

function to_string(n) {
  return Caml_format.caml_nativeint_format("%d", n);
}

var compare = Caml_primitive.caml_nativeint_compare;

var zero = 0;

var one = 1;

var minus_one = -1;

var size = 54;

var max_int = 9007199254740991;

var min_int = -9007199254740991;

export {
  zero ,
  one ,
  minus_one ,
  succ ,
  pred ,
  abs ,
  size ,
  max_int ,
  min_int ,
  lognot ,
  to_string ,
  compare ,
  
}
/* No side effect */
