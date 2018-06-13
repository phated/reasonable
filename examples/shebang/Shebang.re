#!/usr/bin/env reasonable

[@bs.scope "V8Worker2"] [@bs.val] external print : string => unit = "print";

print("Hello Executable!")
