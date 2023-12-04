<template>
    <div>
        <h1>Proactive DDos Defender Speed Test</h1>

        <div>
            <p>{{ now.IpAddress }}</p>
            <p>Ping: {{ now.Ping.toFixed(2) }} ms</p>
            <p>Jitter: {{ now.Jitter.toFixed(2) }} ms</p>
            <p>Download Speed: {{ downloadSpeed.toFixed(2) }} kb/s</p>
            <p>Upload Speed: </p>
        </div>

        <div>

        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, ref} from "vue";

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
let timer: number
let timer2: number

onMounted(() => {
    timer = setInterval(() => {
        testNetworkStatus();
    }, 1000)

    timer2 = setInterval(() => {
        testDownloadSpeed();
    },3000)
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
    console.log(startTime)
    fetch("backend/garbage")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch from server!");
            }
            console.log(response)
            return Promise.resolve();
        })
        .then(() => {
            downloadSpeed.value = 1024 / (Date.now() - startTime) * 1000;
            console.log(downloadSpeed)
        })
}

onUnmounted(() => {
    clearInterval(timer);
    clearInterval(timer2);
})
</script>

