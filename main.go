package main

import (
	"io/ioutil"
	"log"

	"github.com/ry/v8worker2"
)

func LoadModuleByFilename(worker *v8worker2.Worker, filename string) error {
	module, moduleErr := ioutil.ReadFile(filename)
	if moduleErr != nil {
		return moduleErr
	}

	return worker.LoadModule(filename, string(module))
}

func LoadReasonFile(worker *v8worker2.Worker, filename string) error {
	code, codeErr := ioutil.ReadFile(filename)
	if codeErr != nil {
		return codeErr
	}

	return worker.SendBytes(code)
}

func main() {
	log.Println(v8worker2.Version())
	// args := v8worker2.SetFlags([]string{"hello", "--harmony", "--use-strict", "--es-staging"})
	// log.Println(args)
	var worker *v8worker2.Worker
	worker = v8worker2.New(func(msg []byte) []byte {
		// log.Println(msg)
		if worker != nil {
			err := worker.LoadModule("dummy.js", string(msg))
			if err != nil {
				log.Println(err)
				return nil
			}
		}
		return nil
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

	if err := LoadReasonFile(worker, "example.re"); err != nil {
		log.Println("huh", err)
		return
	}
}
