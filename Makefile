build:
	go generate
	go build -o reasonable main.go

run:
	go generate
	go run main.go examples/fizzbuzz/

flatbuffers: messages.fbs
	flatc --go --js --es6-js-export messages.fbs
	mv messages_generated.js runtime/

examples:
	for directory in examples/*/; do \
		echo "Running example: $$directory"; \
		./reasonable "$$directory"; \
	done

.PHONY: build run examples
