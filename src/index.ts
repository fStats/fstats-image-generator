import fastify from "fastify"
// @ts-ignore
import manifest from "./../package.json"

const server = fastify()

server.get("/", async (request, reply) => {
    reply.send({
        name: manifest.name,
        version: manifest.version
    })
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