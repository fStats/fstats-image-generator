import * as dotenv from "dotenv";
import fastify from "fastify"
import {swagger} from "./plugins/swagger";
import {caching} from "./plugins/caching";
import {swaggerUI} from "./plugins/swaggerUI";
import {routing} from "./plugins/routing";

dotenv.config()

const server = fastify({
    logger: true
})

/*   Plugins   */
caching(server)
swagger(server)
swaggerUI(server)
routing(server)

server.listen({
    port: Number(process.env.PORT) || 1542,
    host: process.env.HOST || "0.0.0.0"
}, (err) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
})
