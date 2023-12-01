FROM gcr.io/distroless/static:nonroot

WORKDIR /
COPY ./speedtest /speedtest

ENTRYPOINT ["/speedtest"]
