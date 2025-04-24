import {LineMetric, Project, TimelineData} from "./types";
import axios from "axios";
import {decodeLineMetric} from "../util/decoder/line";

const host = process.env.REMOTE_HOST || "https://api.fstats.dev/v3/"

export const getLineMetric = async (projectId: number, serverSide: boolean, from?: number): Promise<TimelineData[]> =>
    await axios.get<LineMetric>(`${host}metrics/${projectId}/line?server_side=${serverSide}${(from !== undefined && from > 0) ? `&from=${from / 1000}` : ""}`)
        .then(value => decodeLineMetric(value.data))
        .catch(reason => {
            throw new Error(reason)
        })

export const getProject = async (projectId: number): Promise<Project> =>
    await axios.get<Project>(`${host}projects/${projectId}`)
        .then(value => value.data)
        .catch(reason => {
            throw new Error(reason)
        })
