// +build ignore

package main

import (
	"log"
	"net/http"

	"github.com/shurcooL/vfsgen"
)

func main() {
	var fs http.FileSystem = http.Dir("runtime")

	err := vfsgen.Generate(fs, vfsgen.Options{
		Filename:     "runtime/static_contents.go",
		PackageName:  "runtime",
		VariableName: "Assets",
	})
	if err != nil {
		log.Fatalln(err)
	}
}
