

import * as Caml_queue from "./caml_queue.js";
import * as Caml_hash_primitive from "./caml_hash_primitive.js";
import * as Caml_builtin_exceptions from "./caml_builtin_exceptions.js";

function caml_hash(count, _, seed, obj) {
  var hash = seed;
  if (typeof obj === "number") {
    var u = obj | 0;
    hash = Caml_hash_primitive.caml_hash_mix_int(hash, (u + u | 0) + 1 | 0);
    return Caml_hash_primitive.caml_hash_final_mix(hash);
  } else if (typeof obj === "string") {
    hash = Caml_hash_primitive.caml_hash_mix_string(hash, obj);
    return Caml_hash_primitive.caml_hash_final_mix(hash);
  } else {
    var queue = /* record */[
      /* length */0,
      /* tail : None */0
    ];
    var num = count;
    Caml_queue.push(obj, queue);
    num = num - 1 | 0;
    while(queue[/* length */0] !== 0 && num > 0) {
      var obj$1 = Caml_queue.unsafe_pop(queue);
      if (typeof obj$1 === "number") {
        var u$1 = obj$1 | 0;
        hash = Caml_hash_primitive.caml_hash_mix_int(hash, (u$1 + u$1 | 0) + 1 | 0);
        num = num - 1 | 0;
      } else if (typeof obj$1 === "string") {
        hash = Caml_hash_primitive.caml_hash_mix_string(hash, obj$1);
        num = num - 1 | 0;
      } else if (typeof obj$1 !== "boolean") {
        if (typeof obj$1 !== "undefined") {
          if (typeof obj$1 === "symbol") {
            throw [
                  Caml_builtin_exceptions.assert_failure,
                  [
                    "caml_hash.ml",
                    72,
                    8
                  ]
                ];
          } else if (typeof obj$1 !== "function") {
            var size = obj$1.length;
            if (size !== undefined) {
              var obj_tag = obj$1.tag | 0;
              var tag = (size << 10) | obj_tag;
              if (tag === 248) {
                hash = Caml_hash_primitive.caml_hash_mix_int(hash, obj$1[1]);
              } else {
                hash = Caml_hash_primitive.caml_hash_mix_int(hash, tag);
                var v = size - 1 | 0;
                var block = v < num ? v : num;
                for(var i = 0; i <= block; ++i){
                  Caml_queue.push(obj$1[i], queue);
                }
              }
            }
            
          }
          
        }
        
      }
      
    };
    return Caml_hash_primitive.caml_hash_final_mix(hash);
  }
}

export {
  caml_hash ,
  
}
/* No side effect */
