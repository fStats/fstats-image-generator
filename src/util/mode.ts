import {Modes} from "./types";
import {TimeUnit} from "chart.js";

export const timeLimit = (mode: Modes): number | undefined => {
    const currentTime = Date.now();

    switch (mode) {
        case "week":
            return currentTime - 7 * 24 * 60 * 60 * 1000;
        case "month":
            return currentTime - 30 * 24 * 60 * 60 * 1000;
        case "quarter":
            return currentTime - 3 * 30 * 24 * 60 * 60 * 1000;
        case "all":
            return undefined;
    }
};

export const timeUnit = (mode: Modes): TimeUnit | undefined => {
    switch (mode) {
        case "week":
            return "day"
        case "month":
            return "day"
        case "quarter":
            return "quarter"
        case "all":
            return undefined;
    }
}