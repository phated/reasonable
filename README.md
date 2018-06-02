# reasonable
ReasonML runtime built on Golang with v8worker2

## Status

Basic Reason code will work but `[@bs.config no_export];` is required currently.

You can use `[@bs.scope "V8Worker2"] [@bs.val] external print : string => unit = "print";` to get access to the `print` method in v8worker2.

## Usage

This repo contains a pre-built binary for macOS. You can use it like:

```sh
> ./reasonable example.re
```

## License

MPL 2.0
