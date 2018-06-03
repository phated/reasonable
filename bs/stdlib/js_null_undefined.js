


function bind(x, f) {
  if (x == null) {
    return x;
  } else {
    return f(x);
  }
}

function iter(x, f) {
  if (x == null) {
    return /* () */0;
  } else {
    return f(x);
  }
}

function fromOption(x) {
  if (x) {
    return x[0];
  } else {
    return undefined;
  }
}

var from_opt = fromOption;

export {
  bind ,
  iter ,
  fromOption ,
  from_opt ,
  
}
/* No side effect */
