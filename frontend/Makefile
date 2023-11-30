NPM_BINARY = npm
ifeq (, $(which pnpm))
	NPM_BINARY := pnpm
endif

build:
	$(NPM_BINARY) run build

all: build
