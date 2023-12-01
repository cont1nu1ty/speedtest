NPM_BINARY = npm
ifeq (, $(which pnpm))
	NPM_BINARY = pnpm
endif

all: build

build:
	$(NPM_BINARY) install
	$(NPM_BINARY) run build

clean:
	rm -rf dist
