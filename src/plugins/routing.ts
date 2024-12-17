import {FastifyInstance} from "fastify";
import {timelineById} from "../routes/timeline/timeline";

export const routing = (server: FastifyInstance) => server.register(server => {
    timelineById(server)
})