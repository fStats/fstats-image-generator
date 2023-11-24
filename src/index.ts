import * as dotenv from "dotenv";
import fastify from "fastify"
import manifest from "./../package.json"
import {timelineChart} from "./chart/timeline";
import {Format, Modes, Theme} from "./util/types";
import fastifyCaching from "@fastify/caching";
import svg2img from "svg2img";

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
    reply.type("application/json").send(JSON.stringify({
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
            theme: "dark | light",
            format: "svg | png"
        }
    }, null, 2))
})

server.get<{
    Querystring: {
        mode: Modes,
        width: number,
        height: number,
        theme: Theme,
        format: Format
    }
    Params: {
        id: number
    }
}>("/timeline/:id", async (request, reply) => {
    const id = Number(request.params.id)
    if (!Number.isInteger(id)) throw new Error("Invalid id")

    const {mode, width, height, theme, format} = request.query
    const imageFormat = format

    await timelineChart(id, mode, Number(width || 800), Number(height || 300), theme || "dark").then(svgBuffer => {
        console.log(svgBuffer)
        if (format === "png") {
            svg2img(svgBuffer.toString(), (error, buffer) => {
                if (error) throw new Error("Can't generate png." + error)
                return reply.type("image/png").send(buffer)
            });
        }
        return reply.type("image/svg+xml").send(svgBuffer)
    })
})

server.listen({
    port: Number(process.env.PORT) || 1540,
    host: process.env.HOST || "0.0.0.0"
}, (err, address) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening at ${address}`)
})