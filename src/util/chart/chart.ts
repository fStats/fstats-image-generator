import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import {Theme} from "../types";

const instances = new Map<string, ChartJSNodeCanvas>();

export function getChart(width: number, height: number, theme: Theme) {
    const key = `${width}:${height}:${theme}`;

    let instance = instances.get(key);

    if (!instance) {
        instance = new ChartJSNodeCanvas({
            width,
            height,
            backgroundColour: theme === "dark" ? "rgb(30, 30, 30)" : "rgb(255, 255, 255)",
            type: "svg",
        });

        instances.set(key, instance);
    }

    return instance;
}