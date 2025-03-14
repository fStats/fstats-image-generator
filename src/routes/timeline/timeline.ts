import {FastifyInstance} from "fastify";
import {Format, Modes, Theme} from "../../util/types";
import {timelineChart} from "../../util/chart/timeline";
import {Resvg} from "@resvg/resvg-js";

export const timelineById = (server: FastifyInstance) => server.get<{
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
}>("/timeline/:id", {
    schema: {
        tags: ["metric"],
        params: {
            type: "object",
            properties: {
                id: {
                    type: "integer",
                    description: "Project id"
                }
            }
        },
        querystring: {
            type: "object",
            properties: {
                mode: {
                    type: "string",
                    enum: ["week", "month", "quarter", "all"],
                    default: "week"
                },
                width: {
                    type: "integer",
                    default: 800
                },
                height: {
                    type: "integer",
                    default: 300
                },
                theme: {
                    type: "string",
                    enum: ["dark", "light"],
                    default: "dark"
                },
                format: {
                    type: "string",
                    enum: ["svg", "png"],
                    default: "svg"
                }
            }
        },
        response: {
            200: {
                description: "OK",
                content: {
                    "image/svg+xml": {
                        schema: {
                            type: "string",
                            format: "binary"
                        }
                    },
                    "image/png": {
                        schema: {
                            type: "string",
                            format: "binary"
                        }
                    }
                }
            }
        }
    }
}, async (request, reply) => {
    const id = Number(request.params.id)
    if (!Number.isInteger(id)) throw new Error("Invalid id")
    const {mode, width, height, theme, format} = request.query

    await timelineChart(id, mode, Number(width || 800), Number(height || 300), theme || "dark")
        .then(svgBuffer => format === "png"
            ? reply.type("image/png").send(new Resvg(svgBuffer).render().asPng())
            : reply.type("image/svg+xml").send(svgBuffer))
})
