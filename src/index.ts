import * as dotenv from "dotenv";
import fastify from "fastify"
import {swagger} from "./plugins/swagger";
import {caching} from "./plugins/caching";
import {swaggerUI} from "./plugins/swaggerUI";
import {routing} from "./plugins/routing";
import {redis} from "./plugins/redis";

dotenv.config()

const server = fastify({
    logger: true
})

/*   Plugins   */
caching(server)
swagger(server)
swaggerUI(server)
redis(server)
routing(server)

server.listen({
    host: process.env.HOST || "0.0.0.0",
    port: Number(process.env.PORT) || 1542
}, (err) => {
    if (err) {
        console.error(err)
        process.exit(1)
    }
})
