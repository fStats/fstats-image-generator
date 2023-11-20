import {Timeline} from "./types";
import axios from "axios";

const host = "https://api.fstats.dev/v2/"

export const getTimeline = async (projectId: number): Promise<Timeline> => {
    try {
        return await axios.get<Timeline>(`${host}metrics/${projectId}/timeline`).then(value => value.data)
    } catch (error: any) {
        throw new Error(error)
    }
}