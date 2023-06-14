import { Express, Request, Response } from 'express';

import { CharacterImage } from '../models/character-image';
import { errorServer, errorInvalidBody, successResponse } from '../utils/responses-helper';

export async function addCharacterImage(req: Request, res: Response): Promise<void> {
    if (req.file === undefined) {
        errorInvalidBody(res);
        return;
    }

    if (req.body["pc_id"] === undefined) {
        errorInvalidBody(res);
        return;
    }

    // create an image object
    const file: Express.Multer.File = req.file;
    try {
        const image: CharacterImage = new CharacterImage({
            owner_id: 0,
            pc_id: req.body["pc_id"],
            image_name: file.originalname,
            content_type: file.mimetype,
            image_data: file.buffer,
            thumbnail_data: null
        });

        // send it to the database
        const img_id: number = await image.insert();

        successResponse(res, { status: "success", image_id: img_id });

    } catch (err) {
        console.log(err);
        errorServer(res);
        return;
    }
}

export async function getCharacterImage(req: Request, res: Response): Promise<void> {
    const image_id: number = parseInt(req.params.id);
    const image: CharacterImage = await new CharacterImage().findById(image_id);
    if (!image.isValid()) {
        console.log(image);
        errorInvalidBody(res);
        return;
    }

    res.setHeader('Content-Type', image.content_type);
    res.status(200).send(image.image_data);
}

