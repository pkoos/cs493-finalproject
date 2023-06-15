import { Request, Response } from "express";
import { Stats, StatsType } from "../models/stats";
import { CharacterClass } from "../models/character-class";
import * as rh from "../utils/responses-helper";

export async function addClass(req: Request, res: Response) {
    const newStats: Stats = new Stats(req.body.stats);
    newStats.type_id = StatsType.Class;

    const statsId: number = await newStats.insert();

    delete req.body.stats;
    const newClass: CharacterClass = new CharacterClass(req.body);
    newClass.stats_id = statsId;
    newClass.owner_id = req.loggedInID as number;
    if(!newClass.isValid()) {
        rh.errorInvalidBody(res);
        return;
    }

    const newClassId: number = await newClass.insert();
    newStats.type_owner_id = newClassId;
    if(!newStats.update()) {
        console.log(`addClass -> new stats did not update correctly`);
        rh.genericErrorResponse(res, 500, "db update failed");
        return;
    }

    rh.successResponse(res, {"class": newClass.responseJson(newStats)});
}

export async function modifyClass(req: Request, res: Response) {

}

export async function deleteClass(req: Request, res: Response) {
    const classToDelete: CharacterClass = await new CharacterClass().findById(parseInt(req.params.id)) ?? new CharacterClass();
    if(!classToDelete.isValid()) {
        rh.errorNotFound(res, "Character_Class");
        return;
    }

    if(req.loggedInID != classToDelete.owner_id) {
        rh.errorNoRemove(res, "Character_Class");
        return;
    }
    const statsToDelete: Stats = await new Stats().findById(classToDelete.stats_id as number) as Stats;

    await statsToDelete.delete();
    await classToDelete.delete();

    rh.successResponse(res, {
        "message": "Class has been deleted.",
        "class": classToDelete.responseJson(statsToDelete),
    });
}