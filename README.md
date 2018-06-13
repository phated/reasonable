# reasonable

The ReasonML runtime.

## Status

* Most Reason code will work.
* Accepts a single file or a directory containing `.re` files.
* Native ES imports/exports are used for modules.
* Most of BuckleScript's `stdlib` should work (including Belt!) - though some JS stuff like `Js.log` is still a WIP.
* Shebang support! See the [shebang example](./examples/shebang/Shebang.re).

## Notes

Since `Js.log` isn't implemented yet, you can use `[@bs.scope "V8Worker2"] [@bs.val] external print : string => unit = "print";` to get access to the `print` method in v8worker2.

## Usage

This repo contains a pre-built binary for macOS. You can use it like:

```sh
> ./reasonable examples/fizzbuzz/Fizzbuzz.re
```

Or on a directory of files:

```sh
> ./reasonable examples/dependencies/
```

## Technologies

* Go
* v8worker2
* BuckleScript (self-hosted version)
* Flatbuffers
* Topo.js

## License

MPL 2.0
