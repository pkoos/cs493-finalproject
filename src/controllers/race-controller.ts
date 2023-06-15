import { Request, Response } from "express";
import { Race } from "../models/race";
import { Stats, StatsType } from "../models/stats";
import * as rh from "../utils/responses-helper";
import { db } from "..";

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

export async function modifyRace(req: Request, res: Response) {
    console.log(`params id: ${req.params.id}`);

    rh.successResponse(res, {});
}

export async function deleteRace(req: Request, res: Response) {
    const raceToDelete: Race = await new Race().findById(parseInt(req.params.id)) ?? new Race();
    if(!raceToDelete.isValid()) {
        rh.errorNotFound(res, "Race");
        return;
    }

    if(req.loggedInID != raceToDelete.owner_id) {
        rh.errorNoRemove(res, "Race");
        return;
    }
    const statsToDelete: Stats = await new Stats().findById(raceToDelete.stats_id as number) as Stats;

    await statsToDelete.delete();
    await raceToDelete.delete();

    rh.successResponse(res, {
        "message": "Race has been deleted.", 
        "race": raceToDelete.responseJson(statsToDelete),
    });
}

export async function exportRaces(req: Request, res: Response) {
    const [db_results] = await db.query("SELECT * FROM Race");
    const working_results: any[] = db_results as any[];
    const racesCSV: string[] = [];
    racesCSV.push(new Race().csvHeader());
    working_results.forEach((element) => {
        const db_race: Race = new Race(element);
        racesCSV.push(db_race.toCSV());
    })
    rh.successCSV(res, racesCSV.join('\n'));
}