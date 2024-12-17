import fastifyCaching from "@fastify/caching";
import {FastifyInstance} from "fastify";

export const caching = (server: FastifyInstance) => server.register(fastifyCaching, {
    privacy: fastifyCaching.privacy.PUBLIC,
    expiresIn: 1800,
    serverExpiresIn: 1800
})