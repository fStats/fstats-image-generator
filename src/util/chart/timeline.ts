import "chartjs-adapter-moment";
import {getLineMetric, getProject} from "../../service/api";
import {timeLimit, timeUnit} from "../mode";
import {Color, Modes, Theme} from "../types";
import {nameToColor} from "../decoder/color";
import {mergeData} from "../merge";
import {ChartDataset} from "chart.js";
import {getChart} from "./chart";

export const timelineChart = async (
    projectId: number,
    mode: Modes,
    width: number,
    height: number,
    theme: Theme,
    clientColor?: Color,
    serverColor?: Color,
    mixedColor?: Color
): Promise<Buffer> => {

    const project = await getProject(projectId)

    const serverLineMetric = serverColor || mixedColor ? await getLineMetric(projectId, true, timeLimit(mode)) : []
    const clientLineMetric = clientColor || mixedColor ? await getLineMetric(projectId, false, timeLimit(mode)) : []
    const mixedLineMetric = mixedColor ? mergeData(clientLineMetric, serverLineMetric) : []

    const datasets: ChartDataset<'line'>[] = [];

    serverColor && datasets.push({
        data: serverLineMetric,
        label: "Servers",
        borderColor: nameToColor(serverColor),
        spanGaps: 1000 * 60 * 30,
        borderWidth: 2,
        pointRadius: 0
    });

    clientColor && datasets.push({
        data: clientLineMetric,
        label: "Clients",
        borderColor: nameToColor(clientColor),
        spanGaps: 1000 * 60 * 30,
        borderWidth: 2,
        pointRadius: 0
    });

    mixedColor && datasets.push({
        data: mixedLineMetric,
        label: "Mixed",
        borderColor: nameToColor(mixedColor),
        spanGaps: 1000 * 60 * 30,
        borderWidth: 2,
        pointRadius: 0
    });

    return getChart(width, height, theme).renderToBufferSync({
        type: 'line',
        data: {
            datasets: datasets
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
                    text: project.name,
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
