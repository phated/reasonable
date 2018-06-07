import { ab2str, str2ab } from 'utils.js';
import { compiler } from 'playground-refmt.js';
// import { refmt } from 'refmt.js';

const globalEval = eval;

const global = globalEval("this");
compiler(global);

V8Worker2.recv(function(bytes) {
  var reason = ab2str(bytes);
  // V8Worker2.print(Object.keys(refmt));
  // var ocaml = refmt.printML(refmt.parseRE(reason));
  var deps = global.ocaml.reason_list_dependencies(reason);
  V8Worker2.print(deps);
  var res = global.ocaml.reason_compile_super_errors(reason);
  // V8Worker2.print(global.ocaml.list_dependencies(reason))
  if (res.js_code) {
    V8Worker2.send(str2ab(res.js_code));
  } else {
    V8Worker2.print(res.js_error_msg);
  }
});
