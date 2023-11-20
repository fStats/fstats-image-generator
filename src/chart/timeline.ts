import {ChartJSNodeCanvas} from "chartjs-node-canvas";
import "chartjs-adapter-moment";
import {getTimeline} from "../api";

export const timelineChart = async (projectId: number): Promise<Buffer> => {

    const data = await getTimeline(projectId)

    const list = Object.entries(data).map((value) => ({
        x: new Date(value[0]).valueOf(),
        y: value[1]
    }))

    return new ChartJSNodeCanvas({
        width: 800,
        height: 300,
        backgroundColour: 'rgb(30, 30, 30)',
        type: 'svg',
        plugins: {
            globalVariableLegacy: ['chartjs-adapter-moment'],
        }
    }).renderToBufferSync({
        type: 'line',
        data: {
            datasets: [
                {
                    data: list,
                    label: "Server count",
                    borderColor: "rgb(231, 76, 60)",
                    // backgroundColor: 'rgba(231, 76, 60, 0.6)',
                    spanGaps: 1000 * 60 * 30,
                    borderWidth: 2,
                    fill: 'origin',
                    pointRadius: 0
                }
            ],
        },
        options: {
            scales: {
                x: {
                    type: "time",
                    time: {
                        unit: "day"
                    },
                    grid: {
                        display: false,
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 6,
                        callback: function (_, label: number) {
                            return label
                        },
                    },
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: "Mod name",
                    font: {
                        size: 20,
                        style: 'normal',
                    },
                    color: '#444',
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'line',
                        font: {
                            size: 12,
                        }
                    }
                }
            }
        }
    }, "image/svg+xml")
}