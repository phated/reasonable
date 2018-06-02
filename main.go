package main

import (
	"io/ioutil"
	"log"
	"os"

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
