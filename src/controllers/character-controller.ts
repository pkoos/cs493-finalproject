import { Request, Response } from 'express';
import { Character } from '../models/character';
import { CharacterClass } from '../models/character-class';
import { Race } from '../models/race';
import { addCharacterImageToDatabase } from './character-image-controller';
import { errorInvalidBody, errorServer, successResponse } from '../utils/responses-helper';
import { generate_dice_roll } from '../utils/number-generation';
import { requestCharacterDescription } from './async-controller';
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

    requestCharacterDescription(playerCharacter.id);

    if (req.file !== undefined && req.loggedInID !== undefined) {
        await addCharacterImageToDatabase(req.file, playerCharacter.id, req.loggedInID);
    }

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

export async function getPlayerCharacter(req: Request, res: Response) {
    const pc_id: number = parseInt(req.params.id);
    const playerCharacter: Character | undefined = await new Character().findById(pc_id);

    if (playerCharacter === undefined || !playerCharacter.isValid()) {
        console.log(`Invalid character_id passed: ${pc_id}`);
        errorInvalidBody(res);
        return;
    }

    const stats: Stats | undefined = await new Stats().findById(playerCharacter.stats_id);

    if (stats === undefined || !stats.isValid()) {
        console.log(`Invalid stats_id passed: ${playerCharacter.stats_id}`);
        errorServer(res);
        return;
    }

    successResponse(res, {
        "status": "success",
        "character": {
            "id": playerCharacter.id,
            "name": playerCharacter.name,
            "class_id": playerCharacter.class_id,
            "race_id": playerCharacter.race_id,
            "hitpoints": playerCharacter.hitpoints,
            "alignment": playerCharacter.alignment,
            "background": playerCharacter.background,
            ...(stats.toResponseObject())
        }
    });
}

export async function getPlayerCharacters(req: Request, res: Response) {
    const pageId: number = parseInt(req.params.page) || 1;
    res.send(await new Character().getPaginatedList(pageId, 3))
}
