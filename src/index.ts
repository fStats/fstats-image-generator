import fastify from "fastify"
// @ts-ignore
import manifest from "./../package.json"
import {timelineChart} from "./chart/timeline";

const server = fastify({
    logger: true
})

server.get("/", async (request, reply) => {
    return reply.header("Content-Type", "image/svg+xml").send(await timelineChart(32))
})

server.get("/test", async (request, reply) => {
    return reply.header("Content-Type", "text/html").send(`<img src="http://0.0.0.0:8080/" alt="test"/>`)
})

server.listen({
    port: 8080
}, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})