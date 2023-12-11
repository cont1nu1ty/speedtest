NPM_BINARY = pnpm
ifeq (, $(shell which pnpm))
	echo "Not found pnpm, using npm instead."
	NPM_BINARY = npm
endif

all: build

build:
	$(NPM_BINARY) install
	$(NPM_BINARY) run build

clean:
	rm -rf dist
