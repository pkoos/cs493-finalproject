import { Request, Response } from "express";
import { Race } from "../models/race";
import { Stats, StatsType } from "../models/stats";
import * as rh from "../utils/responses-helper";

export async function addRace(req: Request, res: Response) {
    const newStats: Stats = new Stats(req.body.stats);
    newStats.type_id = StatsType.Race;

    const statsId: number = await newStats.insert();

    delete req.body.stats;
    const newRace: Race = new Race(req.body);
    newRace.stats_id = statsId;
    newRace.owner_id = req.loggedInID as number;
    if(!newRace.isValid()) {
        rh.errorInvalidBody(res);
        return;
    }
    const newRaceId: number = await newRace.insert();
    newStats.type_owner_id = newRaceId;
    const isUpdated: boolean = await newStats.update();
    
    rh.successResponse(res, {"race": newRace.responseJson(newStats)});
}
