import * as dotenv from "dotenv";
import fastify from "fastify"
import manifest from "./../package.json"
import {timelineChart} from "./chart/timeline";
import {Modes, Theme} from "./util/types";
import fastifyCaching from "@fastify/caching";

dotenv.config()

const server = fastify({
    logger: true
})

server.register(
    fastifyCaching,
    {
        privacy: fastifyCaching.privacy.PUBLIC,
        expiresIn: 1800,
        serverExpiresIn: 1800
    }
)

server.get("/", async (_, reply) => {
    reply.send({
        service: {
            name: manifest.name,
            version: manifest.version
        },
        route: "/timeline/:id",
        params: {
            "id": "integer"
        },
        query: {
            mode: "week | month | quarter | all",
            width: "integer",
            height: "integer",
            theme: "dark | light"
        }
    })
})

server.get<{
    Querystring: {
        mode: Modes,
        width: number,
        height: number,
        theme: Theme
    }
    Params: {
        id: number
    }
}>("/timeline/:id", async (request, reply) => {
    const id = Number(request.params.id)
    if (!Number.isInteger(id)) throw new Error('Invalid id')

    const {mode, width, height, theme} = request.query

    await reply.header("Content-Type", "image/svg+xml")
        .send(await timelineChart(id, mode, Number(width || 800), Number(height || 300), theme || "dark"))
})

server.listen({
    port: Number(process.env.PORT),
    host: process.env.HOST
}, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})