# reasonable
ReasonML runtime built on Golang with v8worker2

## Status

Basic Reason code will work. Native ES imports/exports are used for modules.

You can use `[@bs.scope "V8Worker2"] [@bs.val] external print : string => unit = "print";` to get access to the `print` method in v8worker2.

## Usage

This repo contains a pre-built binary for macOS. You can use it like:

```sh
> ./reasonable examples/fizzbuzz/Fizzbuzz.re
```

Or on a directory of files:

```sh
> ./reasonable examples/dependencies/
```

## License

MPL 2.0
