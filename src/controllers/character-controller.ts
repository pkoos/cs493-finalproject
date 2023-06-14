import { Request, Response } from 'express';
import { Character } from '../models/character';
import { CharacterClass } from '../models/character-class';
import { Race } from '../models/race';
import { errorInvalidBody, successResponse } from '../utils/responses-helper';
import { generate_dice_roll } from '../utils/number-generation';
import { Stats, StatsType } from '../models/stats';

export async function generatePlayerCharacter(req: Request, res: Response) {
    const race: Race | undefined = await new Race().findById(req.body.race_id);

    if (race === undefined || !race.isValid()) {
        console.log(`Invalid race_id passed: ${req.body.race_id}`);
        errorInvalidBody(res);
        return;
    }

    const characterClass: CharacterClass | undefined = await new CharacterClass().findById(req.body.class_id);
    if (characterClass === undefined || !characterClass.isValid()) {
        console.log(`Invalid class_id passed: ${req.body.class_id}`);
        errorInvalidBody(res);
        return;
    }

    const hitpoints = generate_dice_roll(characterClass.hit_die, req.body.num_hit_die ?? 1);

    const raw_stats: Stats = new Stats({
        type_id: StatsType.Character,
        strength: 8 + generate_dice_roll(10),
        dexterity: 8 + generate_dice_roll(10),
        constitution: 8 + generate_dice_roll(10),
        intelligence: 8 + generate_dice_roll(10),
        wisdom: 8 + generate_dice_roll(10),
        charisma: 8 + generate_dice_roll(10),
    });

    const stats_id: number = await raw_stats.insert();

    const playerCharacter: Character = new Character({
        owner_id: req.loggedInID,
        name: req.body.name,
        class_id: req.body.class_id,
        race_id: req.body.race_id,
        hitpoints: hitpoints,
        stats_id: stats_id,
        background: "-- GETTING GENERATED --",
        alignment: req.body.alignment,
    });

    const character_id: number = await playerCharacter.insert();

    successResponse(res, {
        "status": "success",
        "character": {
            "id": character_id,
            "name": playerCharacter.name,
            "class": characterClass.name,
            "race": race.name,
            "hitpoints": hitpoints,
            "stats": {
                "strength": raw_stats.strength,
                "dexterity": raw_stats.dexterity,
                "constitution": raw_stats.constitution,
                "intelligence": raw_stats.intelligence,
                "wisdom": raw_stats.wisdom,
                "charisma": raw_stats.charisma,
            },
            alignment: playerCharacter.alignment
        }
    });
}
