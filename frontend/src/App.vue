<template>
  <div>
    <h1>Proactive DDos Defender Speed Test</h1>

    <div>
      <p>{{now.IpAddress}}</p>
      <p>Ping: {{now.Ping.toFixed(2)}} ms</p>
      <p>Jitter: {{now.Jitter.toFixed(2)}} ms</p>
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
let timer : number

onMounted(() => {
        timer = setInterval(() => {
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
        }, 1000)
    })

onUnmounted(() => {
  clearInterval(timer);
})
</script>

