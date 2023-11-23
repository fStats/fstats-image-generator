import {LineMetric} from "./types";
import axios from "axios";

const host = "https://api.fstats.dev/v2/"

export const getLineMetric = async (projectId: number): Promise<LineMetric> =>
    await axios.get<LineMetric>(`${host}metrics/${projectId}/line`)
        .then(value => value.data)
        .catch(reason => {
            throw new Error(reason)
        })