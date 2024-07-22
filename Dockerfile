FROM vcs.bupt-narc.cn/mtd/netutils

WORKDIR /
COPY ./speedtest /speedtest

ENTRYPOINT ["/speedtest"]
