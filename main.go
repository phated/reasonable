package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/gobuffalo/packr"
	"github.com/ry/v8worker2"
)

var box packr.Box

func LoadModuleByFilename(worker *v8worker2.Worker, filename string, resolve v8worker2.ModuleResolverCallback) error {
	module, moduleErr := box.MustString(filename)
	if moduleErr != nil {
		return moduleErr
	}

	return worker.LoadModule(filename, module, resolve)
}

func ReadAndWrapReason(path string) (string, error) {
	code, codeErr := ioutil.ReadFile(path)
	if codeErr != nil {
		return "", codeErr
	}

	_, filename := filepath.Split(path)
	ext := filepath.Ext(filename)

	moduleID := strings.Title(strings.TrimSuffix(filename, ext))

	moduleWrapper := `
module %s = {
	%s
};
	`

	return fmt.Sprintf(moduleWrapper, moduleID, code), nil
}

func LoadReasonFile(worker *v8worker2.Worker, code []byte) error {
	return worker.SendBytes(code)
}

func init() {
	box = packr.NewBox("./bs")
}

// This can be used when you know there are no deps and you want it to fail.
func failModuleResolver(_, _ string) int {
	return 1
}

func main() {
	if len(os.Args) == 1 {
		log.Println("Need a Reason script to run. Try `reasonable *.re`")
		return
	}

	paths := os.Args[1:]
	// log.Println(paths)

	var resolveModule v8worker2.ModuleResolverCallback
	var worker *v8worker2.Worker

	resolveModule = func(moduleName, referrerName string) int {
		if strings.HasPrefix(moduleName, "stdlib/") == true {
			code, codeErr := box.MustString(moduleName)
			if codeErr != nil {
				return 1
			}

			if err := worker.LoadModule(moduleName, code, resolveModule); err != nil {
				return 1
			}
		}

		return 0
	}

	worker = v8worker2.New(func(msg []byte) []byte {
		if worker != nil {
			err := worker.LoadModule("main.js", string(msg), resolveModule)
			if err != nil {
				log.Println(err)
				return nil
			}
		}
		return nil
	})

	// if err := LoadModuleByFilename(worker, "compiler.js", failModuleResolver); err != nil {
	if err := LoadModuleByFilename(worker, "playground-refmt.js", failModuleResolver); err != nil {
		log.Println(err)
		return
	}

	if err := LoadModuleByFilename(worker, "refmt.js", failModuleResolver); err != nil {
		log.Println(err)
		return
	}

	if err := LoadModuleByFilename(worker, "utils.js", failModuleResolver); err != nil {
		log.Println(err)
		return
	}

	if err := LoadModuleByFilename(worker, "run.js", resolveModule); err != nil {
		log.Println(err)
		return
	}

	combinedModules := ""
	for _, path := range paths {
		module, err := ReadAndWrapReason(path)
		if err != nil {
			log.Println(err)
			return
		}
		// log.Println(module)
		combinedModules += module
	}
	log.Println(combinedModules)
	if err := LoadReasonFile(worker, []byte(combinedModules)); err != nil {
		log.Println(err)
		return
	}
}
