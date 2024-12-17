import fastifySwaggerUI from "@fastify/swagger-ui";
import {FastifyInstance} from "fastify";

export const swaggerUI = (server: FastifyInstance) => server.register(fastifySwaggerUI, {
    routePrefix: '/swagger',
})