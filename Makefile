# TODO: It'd be nice to not have to run this each time
assets:
	rm runtime/static_contents.go || true
	go generate

build: assets
	go build -o reasonable main.go

run: assets
	go run main.go $(example)

flatbuffers: messages.fbs
	flatc --go --js --es6-js-export messages.fbs
	mv messages_generated.js runtime/

examples:
	for directory in examples/*/; do \
		echo "Running example: $$directory"; \
		./reasonable "$$directory"; \
	done

.PHONY: build run examples
