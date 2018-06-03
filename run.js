import { ab2str, str2ab } from 'utils.js';
import { compiler } from 'compiler.js';
import { refmt } from 'refmt.js';

var global = {};
compiler(global);

V8Worker2.recv(function(bytes) {
  var reason = ab2str(bytes);
  // V8Worker2.print(reason);
  var ocaml = refmt.printML(refmt.parseRE(reason));
  var res = global.ocaml.compile_super_errors(ocaml);
  if (res.js_code) {
    V8Worker2.send(str2ab(res.js_code));
  } else {
    V8Worker2.print(res.js_error_msg);
  }
  // V8Worker2.print(res.js_code);
});
