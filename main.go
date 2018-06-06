package main

import (
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/gobuffalo/packr"
	"github.com/ry/v8worker2"
)

var box packr.Box

func LoadModuleByFilename(worker *v8worker2.Worker, filename string) error {
	module, moduleErr := box.MustString(filename)
	if moduleErr != nil {
		return moduleErr
	}

	return worker.LoadModule(filename, module)
}

func LoadReasonFile(worker *v8worker2.Worker, filename string) error {
	code, codeErr := ioutil.ReadFile(filename)
	if codeErr != nil {
		return codeErr
	}

	return worker.SendBytes(code)
}

func init() {
	box = packr.NewBox("./bs")
}

func main() {
	if len(os.Args) == 1 {
		log.Println("Need a Reason script to run. Try `reasonable example.re`")
		return
	}

	reasonFilename := os.Args[1]

	var worker *v8worker2.Worker
	worker = v8worker2.New(func(msg []byte) []byte {
		if worker != nil {
			err := worker.LoadModule("dummy.js", string(msg))
			if err != nil {
				log.Println(err)
				return nil
			}
		}
		return nil
	})

	moduleNames := make(map[string]string)

	worker.SetModuleResolver(func(moduleName, referrerName string) int {
		if _, exists := moduleNames[moduleName]; exists {
			return 0
		}

		var modulePath string
		if filepath.IsAbs(moduleName) {
			modulePath = filepath.Clean(moduleName)
		} else {
			referrerDir := filepath.Dir(moduleNames[referrerName])
			modulePath = filepath.Join(referrerDir, moduleName)
		}
		moduleNames[moduleName] = modulePath

		if strings.HasPrefix(modulePath, "stdlib/") == true {
			code, codeErr := box.MustString(modulePath)
			if codeErr != nil {
				return 1
			}

			if err := worker.LoadModule(moduleName, code); err != nil {
				return 1
			}
		} else {
			if err := LoadReasonFile(worker, modulePath); err != nil {
				return 1
			}
		}

		return 0
	})

	if err := LoadModuleByFilename(worker, "compiler.js"); err != nil {
		log.Println(err)
		return
	}

	if err := LoadModuleByFilename(worker, "refmt.js"); err != nil {
		log.Println(err)
		return
	}

	if err := LoadModuleByFilename(worker, "utils.js"); err != nil {
		log.Println(err)
		return
	}

	if err := LoadModuleByFilename(worker, "run.js"); err != nil {
		log.Println(err)
		return
	}

	if err := LoadReasonFile(worker, reasonFilename); err != nil {
		log.Println(err)
		return
	}
}
