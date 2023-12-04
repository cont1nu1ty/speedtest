<template>
    <div>
        <h1>Proactive DDos Defender Speed Test</h1>

        <div>
            <p>{{ now.IpAddress }}</p>
            <p>Ping: {{ now.Ping.toFixed(2) }} ms</p>
            <p>Jitter: {{ now.Jitter.toFixed(2) }} ms</p>
            <p>Download Speed: {{ downloadSpeed.toFixed(2) }} KB/s</p>
            <p>Upload Speed: {{ uploadSpeed.toFixed(2) }} KB/s</p>
        </div>

        <div>
            <button @click="saveCSV">save csv</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";
import {exportCsv} from "@/utils/csv";
import type {csvHeaderINTF} from "@/interfaces/csvHeaderINTF";

interface IState {
    IpAddress: string,
    Ping: number,
    Jitter: number
}

const now = ref({
    IpAddress: "",
    Ping: 0,
    Jitter: 0
})
const downloadSpeed = ref(0);
const uploadSpeed = ref(0);
let timer: number
const networkData = ref<Map<string, string>[]>([])

onMounted(() => {
    timer = setInterval(() => {
        testNetworkStatus();
        testDownloadSpeed();
        testUploadSpeed();
        addNetworkData();
    }, 1000)
})

function testNetworkStatus() {
    const startTime = Date.now()
    fetch("backend/getIP")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch from server!");
            }

            return response.json() as Promise<IIPInformation>
        })
        .then(info => {
            const duration = Math.abs(Date.now() - startTime)
            const jitter = Math.abs(now.value.Ping - duration);
            now.value = {
                IpAddress: info.processedString,
                Ping: duration,
                Jitter: jitter < now.value.Jitter ? jitter * 0.8 + now.value.Jitter * 0.2 :
                    jitter * 0.3 + now.value.Jitter * 0.7
            }
        })
}

function testDownloadSpeed() {
    const startTime = Date.now()
    fetch("backend/garbage?ckSize=2")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch from server!");
            }
            return response.blob()
        })
        .then((blob => {
            // console.log(blob.size)
            downloadSpeed.value = blob.size / 1024 / (Date.now() - startTime) * 1000
        }))
}

function testUploadSpeed() {

    const fileSizeInBytes = 1024 * 1024; // 1MB
    const buffer = new ArrayBuffer(fileSizeInBytes);
    const dataView = new DataView(buffer);

    for (let i = 0; i < fileSizeInBytes; i++) {
        dataView.setUint8(i, i % 256);
    }
    const startTime = Date.now();
    fetch("backend/empty", {
        method: "PUT",
        body: dataView
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch from server!");
            }
        })
        .then(() => {
            uploadSpeed.value = fileSizeInBytes / 1024 / (Date.now() - startTime) * 1000
        })
}

function saveCSV() {
    const columns: csvHeaderINTF[] = [
        {
            title: "time",
            key: "time"
        },
        {
            title: "ping",
            key: "ping"
        },
        {
            title: "jitter",
            key: "jitter"
        },
        {
            title: "download speed",
            key: "download speed"
        },
        {
            title: "upload speed",
            key: "upload speed"
        },
    ]

    exportCsv(columns, networkData.value, "network" + Date.now() + ".csv");
}

function addNetworkData() {
    const data = new Map<string, string>();
    data.set("time", new Date().getTime().toString());
    data.set("ping", now.value.Ping.toString());
    data.set("jitter", now.value.Jitter.toString());
    data.set("download speed", downloadSpeed.value.toString());
    data.set("upload speed", uploadSpeed.value.toString());
    networkData.value.push(data);
    //  console.log(networkData)
}

onUnmounted(() => {
    clearInterval(timer);
})
</script>

