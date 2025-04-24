import {FastifyInstance} from "fastify";
import {Color, Format, Modes, Theme} from "../../util/types";
import {timelineChart} from "../../util/chart/timeline";
import {Resvg} from "@resvg/resvg-js";

export const timelineById = (server: FastifyInstance) => server.get<{
    Querystring: {
        mode: Modes,
        width: number,
        height: number,
        theme: Theme,
        format: Format,
        server_color: Color,
        client_color: Color,
        mixed_color: Color,
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
                },
                server_color: {
                    type: "string",
                    enum: ["alizarin", "carrot", "sun-flower", "emerald", "turquoise", "peter-river", "amethyst"]
                },
                client_color: {
                    type: "string",
                    enum: ["alizarin", "carrot", "sun-flower", "emerald", "turquoise", "peter-river", "amethyst"]
                },
                mixed_color: {
                    type: "string",
                    enum: ["alizarin", "carrot", "sun-flower", "emerald", "turquoise", "peter-river", "amethyst"]
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
            },
            500: {
                description: "Internal Server Error",
            }
        }
    }
}, async (request, reply) => {
    const id = Number(request.params.id)
    if (!Number.isInteger(id) || id <= 0) return reply.status(400).send({error: "Invalid id"});

    const {
        mode = "week",
        width = 800,
        height = 300,
        theme = "dark",
        format = "svg",
        server_color,
        client_color,
        mixed_color
    } = request.query;

    const cacheKey = `timeline:${id}:${mode}:${width}:${height}:${server_color}:${client_color}:${mixed_color}:${theme}:${format}`;

    try {
        const cachedImage = await server.redis.getBuffer(cacheKey);

        if (cachedImage) {
            server.log.info(`Cache hit for key: ${cacheKey}`);
            return reply.type(format === "png" ? "image/png" : "image/svg+xml").send(cachedImage);
        }

        server.log.info(`Cache miss for key: ${cacheKey}`);

        const svgBuffer = await timelineChart(id, mode, width, height, theme, client_color, server_color, mixed_color);
        const resultBuffer: Buffer = format === "png" ? Buffer.from(new Resvg(svgBuffer).render().asPng()) : svgBuffer;

        reply.type(format === "png" ? "image/png" : "image/svg+xml");

        await server.redis.set(cacheKey, resultBuffer, "EX", 1800);

        return reply.send(resultBuffer);
    } catch (error) {
        server.log.error(error);
        return reply.status(500).send({error: "Internal Server Error"});
    }
})
