import { Express, Request, Response } from 'express';

import { CharacterImage } from '../models/character-image';
import { requestImageThumbnail } from './async-controller';
import { errorServer, errorInvalidBody, successResponse, errorUnauthorizedUser } from '../utils/responses-helper';
import { Character } from '../models/character';

export async function addCharacterImageToDatabase(file: Express.Multer.File, pc_id: number, owner_id: number): Promise<number> {
    try {
        const image: CharacterImage = new CharacterImage({
            owner_id: owner_id,
            pc_id: pc_id,
            image_name: file.originalname,
            content_type: file.mimetype,
            image_data: file.buffer,
            thumbnail_data: null
        });

        // send it to the database
        const img_id: number = await image.insert();
        requestImageThumbnail(img_id);
        return img_id;
    } catch (err) {
        console.log(err);
        return -1;
    }
}

export async function addCharacterImage(req: Request, res: Response): Promise<void> {
    if (req.file === undefined) {
        errorInvalidBody(res);
        return;
    }

    if (req.body["pc_id"] === undefined || req.body["pc_id"] < 0) {
        errorInvalidBody(res);
        return;
    }

    const playerCharacter: Character | undefined = await new Character().findById(req.body["pc_id"]);
    if (playerCharacter === undefined || !playerCharacter.isValid()) {
        console.log(`Invalid character id for addCharacterImage: ${req.body["pc_id"]}`);
        errorInvalidBody(res);
        return;
    }

    if (playerCharacter.owner_id !== req.loggedInID) {
        errorUnauthorizedUser(res, "add character image to a character they do not own.");
        return;
    }

    const img_id: number = await addCharacterImageToDatabase(req.file, req.body["pc_id"], req.loggedInID);
    if (img_id === -1) {
        errorServer(res);
    } else {
        successResponse(res, { status: "success", image_id: img_id });
    }
}

export async function getCharacterImage(req: Request, res: Response): Promise<void> {
    const image_id: number = parseInt(req.params.id);
    const image: CharacterImage | undefined = await new CharacterImage().findById(image_id);
    if (image === undefined) {
        console.log(`Invalid image id for getCharacterImage: ${image_id}`);
        errorInvalidBody(res);
        return;
    }
    if (!image.isValid()) {
        console.log(image);
        errorInvalidBody(res);
        return;
    }

    res.setHeader('Content-Type', image.content_type);
    res.status(200).send(image.image_data);
}

export async function getCharacterImageThumbnail(req: Request, res: Response): Promise<void> {
    const image_id: number = parseInt(req.params.id);
    const image: CharacterImage | undefined = await new CharacterImage().findById(image_id);
    if (image === undefined || !image.isValid()) {
        console.log(image);
        errorInvalidBody(res);
        return;
    }

    res.setHeader('Content-Type', image.content_type);
    res.status(200).send(image.thumbnail_data);
}
