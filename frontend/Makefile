NPM_BINARY = pnpm
ifeq (, $(shell which pnpm))
	
	NPM_BINARY = npm
endif

all: build

build:
	$(NPM_BINARY) install
	$(NPM_BINARY) run build-only

clean:
	rm -rf dist
