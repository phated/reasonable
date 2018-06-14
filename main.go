//go:generate go run generate.go

package main

import (
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"

	flatbuffers "github.com/google/flatbuffers/go"
	"github.com/phated/reasonable/message"
	"github.com/phated/reasonable/module"
	"github.com/phated/reasonable/runtime"
	"github.com/ry/v8worker2"
)

func OpenAsset(filename string) (string, error) {
	file, fileErr := runtime.Assets.Open(filename)
	if fileErr != nil {
		return "", fileErr
	}

	contents, contentsErr := ioutil.ReadAll(file)
	if contentsErr != nil {
		return "", contentsErr
	}

	return string(contents), nil
}

func LoadModuleByFilename(worker *v8worker2.Worker, filename string, resolve v8worker2.ModuleResolverCallback) error {
	module, moduleErr := OpenAsset(filename)
	if moduleErr != nil {
		return moduleErr
	}

	return worker.LoadModule(filename, module, resolve)
}

func CompileCode(worker *v8worker2.Worker) error {
	builder := flatbuffers.NewBuilder(0)
	message.MessageStart(builder)
	message.MessageAddType(builder, message.MessageTypeCompile)
	msg := message.MessageEnd(builder)
	builder.Finish(msg)
	out := builder.FinishedBytes()
	return worker.SendBytes(out)
}

func RegisterModule(worker *v8worker2.Worker, mod module.Module) error {
	builder := flatbuffers.NewBuilder(0)
	name := builder.CreateString(mod.GetIdentifier())
	data := builder.CreateByteString(mod.GetContents())
	message.MessageStart(builder)
	message.MessageAddType(builder, message.MessageTypeRegisterModule)
	message.MessageAddFileType(builder, mod.GetFileType())
	message.MessageAddName(builder, name)
	message.MessageAddData(builder, data)
	msg := message.MessageEnd(builder)
	builder.Finish(msg)
	out := builder.FinishedBytes()
	return worker.SendBytes(out)
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

	var resolveModule v8worker2.ModuleResolverCallback
	var worker *v8worker2.Worker

	resolveModule = func(moduleName, referrerName string) int {
		if strings.HasPrefix(moduleName, "stdlib/") == true {
			module, moduleErr := OpenAsset(moduleName)
			if moduleErr != nil {
				return 1
			}

			if err := worker.LoadModule(moduleName, module, resolveModule); err != nil {
				return 1
			}
		}

		return 0
	}

	worker = v8worker2.New(func(data []byte) []byte {
		if worker == nil {
			return nil
		}

		msg := message.GetRootAsMessage(data, 0)
		msgType := msg.Type()
		code := msg.Data()

		switch msgType {
		case message.MessageTypeRun:
			err := worker.LoadModule("main.js", string(code), resolveModule)
			if err != nil {
				log.Println(err)
				return nil
			}
		default:
			log.Println("Unknown message type:", msgType)
		}

		return nil
	})

	// BuckleScript compiler and Refmt
	if err := LoadModuleByFilename(worker, "compiler.js", failModuleResolver); err != nil {
		log.Println(err)
		return
	}
	if err := LoadModuleByFilename(worker, "refmt.js", failModuleResolver); err != nil {
		log.Println(err)
		return
	}

	// FlatBuffer stuff
	if err := LoadModuleByFilename(worker, "flatbuffers.js", failModuleResolver); err != nil {
		log.Println(err)
		return
	}
	if err := LoadModuleByFilename(worker, "messages_generated.js", failModuleResolver); err != nil {
		log.Println(err)
		return
	}

	if err := LoadModuleByFilename(worker, "utils.js", failModuleResolver); err != nil {
		log.Println(err)
		return
	}

	if err := LoadModuleByFilename(worker, "topo.js", failModuleResolver); err != nil {
		log.Println(err)
		return
	}

	if err := LoadModuleByFilename(worker, "run.js", resolveModule); err != nil {
		log.Println(err)
		return
	}

	if len(paths) == 1 {
		path := paths[0]

		info, err := os.Stat(path)
		if err != nil {
			log.Println(err)
			return
		}

		if info.IsDir() == true {
			reMatches, reErr := filepath.Glob(filepath.Join(path, "*.re"))

			if reErr != nil {
				log.Println(reErr)
				return
			}

			mlMatches, mlErr := filepath.Glob(filepath.Join(path, "*.ml"))
			if mlErr != nil {
				log.Println(mlErr)
				return
			}

			paths = append(reMatches, mlMatches...)
		}
	}

	for _, path := range paths {
		mod := module.NewFromFilepath(path)
		if err := mod.Load(); err != nil {
			log.Println(err)
			return
		}

		RegisterModule(worker, mod)
	}

	if err := CompileCode(worker); err != nil {
		log.Println(err)
		return
	}
}
