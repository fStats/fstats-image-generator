import {ChartJSNodeCanvas} from "chartjs-node-canvas";
import "chartjs-adapter-moment";
import {getLineMetric} from "../service/api";
import {timeLimit, timeUnit} from "../util/mode";
import {Modes, Theme} from "../util/types";

export const timelineChart = async (projectId: number, mode: Modes, width: number, height: number, theme: Theme): Promise<Buffer> => {

    const lineMetric = await getLineMetric(projectId)

    return new ChartJSNodeCanvas({
        width: width,
        height: height,
        backgroundColour: theme === "dark" ? "rgb(30, 30, 30)" : "rgb(255, 255, 255)",
        type: "svg",
        plugins: {
            globalVariableLegacy: ["chartjs-adapter-moment"]
        }
    }).renderToBufferSync({
        type: 'line',
        data: {
            datasets: [
                {
                    data: Object.entries(lineMetric.metric_line).map(value => ({
                        x: new Date(value[0]).valueOf(),
                        y: value[1]
                    })),
                    label: "Server count",
                    borderColor: theme === "dark" ? "rgb(231, 76, 60)" : "rgb(52, 152, 219)",
                    spanGaps: 1000 * 60 * 30,
                    borderWidth: 2,
                    pointRadius: 0
                }
            ]
        },
        options: {
            scales: {
                x: {
                    type: "time",
                    min: timeLimit(mode),
                    max: Date.now(),
                    time: {
                        unit: timeUnit(mode)
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: lineMetric.project.name,
                    font: {
                        size: 20,
                        style: "normal"
                    }
                },
                legend: {
                    position: "bottom",
                    labels: {
                        usePointStyle: true,
                        pointStyle: "line",
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    }, "image/svg+xml")
}