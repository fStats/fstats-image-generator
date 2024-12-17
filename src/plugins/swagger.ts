import {FastifyInstance} from "fastify";
import fastifySwagger from "@fastify/swagger";
import manifest from "../../package.json";

export const swagger = (server: FastifyInstance) => server.register(fastifySwagger, {
    openapi: {
        openapi: '3.0.0',
        info: {
            title: manifest.name,
            version: manifest.version
        },
        servers: [
            {
                url: 'https://img.fstats.dev',
            }
        ]
    }
})