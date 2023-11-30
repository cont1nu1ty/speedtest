build:
	make -C frontend
	go build -o speedtest bin/main.go


all: build
