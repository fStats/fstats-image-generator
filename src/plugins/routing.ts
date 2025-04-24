import {FastifyInstance} from "fastify";
import {timelineById} from "../routes/v2/timeline";
import {deprecatedTimelineById} from "../routes/deprecatedTimeline";

export const routing = (server: FastifyInstance) => server.register(server => {
    deprecatedTimelineById(server)
    server.register(async (v2) => {
        timelineById(v2)
    }, {prefix: "v2"})
})
