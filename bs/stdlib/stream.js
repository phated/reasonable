

import * as List from "./list.js";
import * as Block from "./block.js";
import * as Curry from "./curry.js";
import * as Caml_bytes from "./caml_bytes.js";
import * as Pervasives from "./pervasives.js";
import * as Caml_string from "./caml_string.js";
import * as Caml_exceptions from "./caml_exceptions.js";
import * as CamlinternalLazy from "./camlinternalLazy.js";
import * as Caml_builtin_exceptions from "./caml_builtin_exceptions.js";

var Failure = Caml_exceptions.create("Stream.Failure");

var $$Error = Caml_exceptions.create("Stream.Error");

function fill_buff(b) {
  b[/* len */2] = Pervasives.input(b[/* ic */0], b[/* buff */1], 0, b[/* buff */1].length);
  b[/* ind */3] = 0;
  return /* () */0;
}

function get_data(count, _d) {
  while(true) {
    var d = _d;
    if (typeof d === "number") {
      return d;
    } else {
      switch (d.tag | 0) {
        case 0 : 
            return d;
        case 1 : 
            var d2 = d[1];
            var match = get_data(count, d[0]);
            if (typeof match === "number") {
              _d = d2;
              continue ;
            } else if (match.tag) {
              throw [
                    Caml_builtin_exceptions.assert_failure,
                    [
                      "stream.ml",
                      53,
                      12
                    ]
                  ];
            } else {
              return /* Scons */Block.__(0, [
                        match[0],
                        /* Sapp */Block.__(1, [
                            match[1],
                            d2
                          ])
                      ]);
            }
        case 2 : 
            var f = d[0];
            var tag = f.tag | 0;
            _d = tag === 250 ? f[0] : (
                tag === 246 ? CamlinternalLazy.force_lazy_block(f) : f
              );
            continue ;
        case 3 : 
            var g = d[0];
            var match$1 = g[/* curr */0];
            if (match$1) {
              var match$2 = match$1[0];
              if (match$2) {
                g[/* curr */0] = /* None */0;
                return /* Scons */Block.__(0, [
                          match$2[0],
                          d
                        ]);
              } else {
                return /* Sempty */0;
              }
            } else {
              var match$3 = Curry._1(g[/* func */1], count);
              if (match$3) {
                return /* Scons */Block.__(0, [
                          match$3[0],
                          d
                        ]);
              } else {
                g[/* curr */0] = /* Some */[/* None */0];
                return /* Sempty */0;
              }
            }
        case 4 : 
            var b = d[0];
            if (b[/* ind */3] >= b[/* len */2]) {
              fill_buff(b);
            }
            if (b[/* len */2] === 0) {
              return /* Sempty */0;
            } else {
              var r = b[/* buff */1][b[/* ind */3]];
              b[/* ind */3] = b[/* ind */3] + 1 | 0;
              return /* Scons */Block.__(0, [
                        r,
                        d
                      ]);
            }
        
      }
    }
  };
}

function peek(s) {
  while(true) {
    var match = s[/* data */1];
    if (typeof match === "number") {
      return /* None */0;
    } else {
      switch (match.tag | 0) {
        case 0 : 
            return /* Some */[match[0]];
        case 1 : 
            var d = get_data(s[/* count */0], s[/* data */1]);
            if (typeof d === "number") {
              return /* None */0;
            } else if (d.tag) {
              throw [
                    Caml_builtin_exceptions.assert_failure,
                    [
                      "stream.ml",
                      82,
                      12
                    ]
                  ];
            } else {
              s[1] = d;
              return /* Some */[d[0]];
            }
        case 2 : 
            var f = match[0];
            var tag = f.tag | 0;
            s[1] = tag === 250 ? f[0] : (
                tag === 246 ? CamlinternalLazy.force_lazy_block(f) : f
              );
            continue ;
        case 3 : 
            var g = match[0];
            var match$1 = g[/* curr */0];
            if (match$1) {
              return match$1[0];
            } else {
              var x = Curry._1(g[/* func */1], s[/* count */0]);
              g[/* curr */0] = /* Some */[x];
              return x;
            }
        case 4 : 
            var b = match[0];
            if (b[/* ind */3] >= b[/* len */2]) {
              fill_buff(b);
            }
            if (b[/* len */2] === 0) {
              s[1] = /* Sempty */0;
              return /* None */0;
            } else {
              return /* Some */[b[/* buff */1][b[/* ind */3]]];
            }
        
      }
    }
  };
}

function junk(s) {
  while(true) {
    var match = s[/* data */1];
    var exit = 0;
    if (typeof match === "number") {
      exit = 1;
    } else {
      switch (match.tag | 0) {
        case 0 : 
            s[0] = s[/* count */0] + 1 | 0;
            s[1] = match[1];
            return /* () */0;
        case 3 : 
            var g = match[0];
            var match$1 = g[/* curr */0];
            if (match$1) {
              s[0] = s[/* count */0] + 1 | 0;
              g[/* curr */0] = /* None */0;
              return /* () */0;
            } else {
              exit = 1;
            }
            break;
        case 4 : 
            var b = match[0];
            s[0] = s[/* count */0] + 1 | 0;
            b[/* ind */3] = b[/* ind */3] + 1 | 0;
            return /* () */0;
        default:
          exit = 1;
      }
    }
    if (exit === 1) {
      var match$2 = peek(s);
      if (match$2) {
        continue ;
      } else {
        return /* () */0;
      }
    }
    
  };
}

function nget(n, s) {
  if (n <= 0) {
    return /* tuple */[
            /* [] */0,
            s[/* data */1],
            0
          ];
  } else {
    var match = peek(s);
    if (match) {
      var a = match[0];
      junk(s);
      var match$1 = nget(n - 1 | 0, s);
      return /* tuple */[
              /* :: */[
                a,
                match$1[0]
              ],
              /* Scons */Block.__(0, [
                  a,
                  match$1[1]
                ]),
              match$1[2] + 1 | 0
            ];
    } else {
      return /* tuple */[
              /* [] */0,
              s[/* data */1],
              0
            ];
    }
  }
}

function npeek(n, s) {
  var match = nget(n, s);
  s[0] = s[/* count */0] - match[2] | 0;
  s[1] = match[1];
  return match[0];
}

function next(s) {
  var match = peek(s);
  if (match) {
    junk(s);
    return match[0];
  } else {
    throw Failure;
  }
}

function empty(s) {
  var match = peek(s);
  if (match) {
    throw Failure;
  } else {
    return /* () */0;
  }
}

function iter(f, strm) {
  var _param = /* () */0;
  while(true) {
    var match = peek(strm);
    if (match) {
      junk(strm);
      Curry._1(f, match[0]);
      _param = /* () */0;
      continue ;
    } else {
      return /* () */0;
    }
  };
}

function from(f) {
  return /* record */[
          /* count */0,
          /* data : Sgen */Block.__(3, [/* record */[
                /* curr : None */0,
                /* func */f
              ]])
        ];
}

function of_list(l) {
  return /* record */[
          /* count */0,
          /* data */List.fold_right((function (x, l) {
                  return /* Scons */Block.__(0, [
                            x,
                            l
                          ]);
                }), l, /* Sempty */0)
        ];
}

function of_string(s) {
  var count = [0];
  return from((function () {
                var c = count[0];
                if (c < s.length) {
                  count[0] = count[0] + 1 | 0;
                  return /* Some */[Caml_string.get(s, c)];
                } else {
                  return /* None */0;
                }
              }));
}

function of_bytes(s) {
  var count = [0];
  return from((function () {
                var c = count[0];
                if (c < s.length) {
                  count[0] = count[0] + 1 | 0;
                  return /* Some */[Caml_bytes.get(s, c)];
                } else {
                  return /* None */0;
                }
              }));
}

function of_channel(ic) {
  return /* record */[
          /* count */0,
          /* data : Sbuffio */Block.__(4, [/* record */[
                /* ic */ic,
                /* buff */Caml_string.caml_create_string(4096),
                /* len */0,
                /* ind */0
              ]])
        ];
}

function iapp(i, s) {
  return /* record */[
          /* count */0,
          /* data : Sapp */Block.__(1, [
              i[/* data */1],
              s[/* data */1]
            ])
        ];
}

function icons(i, s) {
  return /* record */[
          /* count */0,
          /* data : Scons */Block.__(0, [
              i,
              s[/* data */1]
            ])
        ];
}

function ising(i) {
  return /* record */[
          /* count */0,
          /* data : Scons */Block.__(0, [
              i,
              /* Sempty */0
            ])
        ];
}

function lapp(f, s) {
  return /* record */[
          /* count */0,
          /* data : Slazy */Block.__(2, [Block.__(246, [(function () {
                      return /* Sapp */Block.__(1, [
                                Curry._1(f, /* () */0)[/* data */1],
                                s[/* data */1]
                              ]);
                    })])])
        ];
}

function lcons(f, s) {
  return /* record */[
          /* count */0,
          /* data : Slazy */Block.__(2, [Block.__(246, [(function () {
                      return /* Scons */Block.__(0, [
                                Curry._1(f, /* () */0),
                                s[/* data */1]
                              ]);
                    })])])
        ];
}

function lsing(f) {
  return /* record */[
          /* count */0,
          /* data : Slazy */Block.__(2, [Block.__(246, [(function () {
                      return /* Scons */Block.__(0, [
                                Curry._1(f, /* () */0),
                                /* Sempty */0
                              ]);
                    })])])
        ];
}

function slazy(f) {
  return /* record */[
          /* count */0,
          /* data : Slazy */Block.__(2, [Block.__(246, [(function () {
                      return Curry._1(f, /* () */0)[/* data */1];
                    })])])
        ];
}

function dump_data(f, param) {
  if (typeof param === "number") {
    return Pervasives.print_string("Sempty");
  } else {
    switch (param.tag | 0) {
      case 0 : 
          Pervasives.print_string("Scons (");
          Curry._1(f, param[0]);
          Pervasives.print_string(", ");
          dump_data(f, param[1]);
          return Pervasives.print_string(")");
      case 1 : 
          Pervasives.print_string("Sapp (");
          dump_data(f, param[0]);
          Pervasives.print_string(", ");
          dump_data(f, param[1]);
          return Pervasives.print_string(")");
      case 2 : 
          return Pervasives.print_string("Slazy");
      case 3 : 
          return Pervasives.print_string("Sgen");
      case 4 : 
          return Pervasives.print_string("Sbuffio");
      
    }
  }
}

function dump(f, s) {
  Pervasives.print_string("{count = ");
  Pervasives.print_int(s[/* count */0]);
  Pervasives.print_string("; data = ");
  dump_data(f, s[/* data */1]);
  Pervasives.print_string("}");
  return Pervasives.print_newline(/* () */0);
}

function count(prim) {
  return prim[0];
}

var sempty = /* record */[
  /* count */0,
  /* data : Sempty */0
];

export {
  Failure ,
  $$Error ,
  from ,
  of_list ,
  of_string ,
  of_bytes ,
  of_channel ,
  iter ,
  next ,
  empty ,
  peek ,
  junk ,
  count ,
  npeek ,
  iapp ,
  icons ,
  ising ,
  lapp ,
  lcons ,
  lsing ,
  sempty ,
  slazy ,
  dump ,
  
}
/* No side effect */
