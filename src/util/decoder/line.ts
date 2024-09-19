import {LineMetric, TimelineData} from "../../service/types";

export function decodeLineMetric(data: LineMetric | undefined): TimelineData[] {
    if (data === undefined) return []

    let prevTimestamp = 0;
    let prevCount = 0;

    return data.timestamps.map((deltaTimestamp, index) => {
        prevTimestamp += deltaTimestamp;
        prevCount += data.counts[index];
        return {x: prevTimestamp * 1000, y: prevCount};
    });
}