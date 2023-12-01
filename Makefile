all: build

build-frontend:
	make -C frontend

build: build-frontend
	CGO_ENABLED=0 go build -gcflags="all=-N -l" -ldflags="-s -w" -o speedtest bin/main.go

clean:
	make -C frontend clean
	$(RM) speedtest

container: build
	docker build . -t ghcr.io/bupt-narc/speedtest:latest
