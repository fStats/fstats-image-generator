import {TimelineData} from "../service/types";

export function mergeData(clientData: TimelineData[], serverData: TimelineData[]): TimelineData[] {
    const merged: TimelineData[] = [];
    let serverIndex = 0;
    let clientIndex = 0;

    while (serverIndex < serverData.length || clientIndex < clientData.length) {
        const serverPoint = serverData[serverIndex];
        const clientPoint = clientData[clientIndex];

        if (clientIndex >= clientData.length || (serverIndex < serverData.length && serverPoint.x < clientPoint.x)) {
            merged.push(serverPoint);
            serverIndex++;
        } else if (serverIndex >= serverData.length || (clientIndex < clientData.length && serverPoint.x > clientPoint.x)) {
            merged.push(clientPoint);
            clientIndex++;
        } else {
            merged.push({x: serverPoint.x, y: serverPoint.y + clientPoint.y});
            serverIndex++;
            clientIndex++;
        }
    }

    return merged;
}
