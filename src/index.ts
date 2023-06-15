import express, {Express, Request, Response} from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import mysql2, { Pool } from 'mysql2/promise';
import { addUser, getUserDetails, loginUser } from './controllers/user-controller';
import { addCharacterImage, getCharacterImage, getCharacterImageThumbnail } from './controllers/character-image-controller';
import { requireAuthentication } from './utils/auth-helper';
import * as rh from './utils/responses-helper';

import { initializeAsyncController, requestTest, requestCharacterDescription } from './controllers/async-controller';
import { initializeRateLimiting, rateLimit } from './utils/rate-limit-helper';
import { addRace, deleteRace, modifyRace } from './controllers/race-controller';
import { addClass, deleteClass } from './controllers/character-class-controller';
import { generatePlayerCharacter } from './controllers/character-controller';

import multer from 'multer';

const app: Express = express();
const port = process.env.PORT ?? 8000;
const baseApiPath: string = "/api/v1";

const storage: multer.StorageEngine = multer.memoryStorage();
const upload: multer.Multer = multer({ storage: storage });

export const db: Pool =  mysql2.createPool({
    connectionLimit: 10,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST ?? "localhost",
    port: parseInt(process.env.MYSQL_PORT as string) ?? 3306
});


app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(rateLimit);

dotenv.config();

app.use(bodyParser.json());

app.get('/test', (req: Request, res: Response) => {
    console.log("test complete");
    res.status(200).json({"status": "Success!"});
});

const addPlayerCharacterPath: string = `${baseApiPath}/character/add`;
app.post(addPlayerCharacterPath, (req: Request, res: Response) => {
    rh.successResponse(res, {
        "status": "addPlayerCharacterPath"
    });
});

const generatePlayerCharacterPath: string = `${baseApiPath}/character/generate`;
app.post(generatePlayerCharacterPath, requireAuthentication, upload.single("image"), generatePlayerCharacter);

const modifyPlayerCharacterPath: string = `${baseApiPath}/character/modify`;
app.post(modifyPlayerCharacterPath, (req: Request, res: Response) => {
    rh.successResponse(res, {
        "status": "modifyPlayerCharacterPath"
    });
});

const deletePlayerCharacterPath: string = `${baseApiPath}/character/remove`;
app.post(deletePlayerCharacterPath, (req: Request, res: Response) => {
    rh.successResponse(res, {
        "status": "deletePlayerCharacterPath"
    });
});

const generateCharacterDescriptionPath: string = `${baseApiPath}/character/:pc_id/description`;
app.get(generateCharacterDescriptionPath, requestCharacterDescription);


const addRacePath: string = `${baseApiPath}/race/add`;
app.post(addRacePath, requireAuthentication, (req: Request, res: Response) => addRace(req, res));

const modifyRacePath: string = `${baseApiPath}/race/modify/:id`;
app.post(modifyRacePath, requireAuthentication, (req: Request, res: Response) => modifyRace(req, res));

const removeRacePath: string = `${baseApiPath}/race/remove/:id`;
app.post(removeRacePath, requireAuthentication, (req: Request, res: Response) => deleteRace(req, res));

const addCharacterClassPath: string = `${baseApiPath}/class/add`;
app.post(addCharacterClassPath, requireAuthentication,  (req: Request, res: Response) => addClass(req, res));

const modifyCharacterClassPath: string = `${baseApiPath}/class/modify`;
app.post(modifyCharacterClassPath, (req: Request, res: Response) => {
    rh.successResponse(res, {
        "status": "modifyCharacterClassPath"
    });
});

const removeCharacterClassPath: string = `${baseApiPath}/class/remove/:id`;
app.post(removeCharacterClassPath, requireAuthentication, (req: Request, res: Response) => deleteClass(req, res));

const addCharacterImagePath: string = `${baseApiPath}/image/add`;
app.post(addCharacterImagePath, requireAuthentication, upload.single("characterImage"), addCharacterImage);

const modifyCharacterImagePath: string = `${baseApiPath}/image/modify`;
app.post(modifyCharacterImagePath, (req: Request, res: Response) => {
    rh.successResponse(res, {
        "status": "modifyCharacterImagePath"
    });
});

const removeCharacterImagePath: string = `${baseApiPath}/image/remove`;
app.post(removeCharacterImagePath, (req: Request, res: Response) => {
    rh.successResponse(res, {
        "status": "removeCharacterImagePath"
    });
});

const getCharacterImagePath: string = `${baseApiPath}/image/:id`;
app.get(getCharacterImagePath, getCharacterImage);

const getCharacterThumbnailPath: string = `${baseApiPath}/thumbnail/:id`;
app.get(getCharacterThumbnailPath, getCharacterImageThumbnail);

const addEquipmentPath: string = `${baseApiPath}/equipment/add`;
app.post(addEquipmentPath, (req: Request, res: Response) => {
    rh.successResponse(res, {
        "status": "addEquipmentPath"
    });
});

const modifyEquipmentPath: string = `${baseApiPath}/equipment/modify`;
app.post(modifyEquipmentPath, (req: Request, res: Response) => {
    rh.successResponse(res, {
        "status": "modifyEquipmentPath"
    });
});

const removeEquipmentPath: string = `${baseApiPath}/equipment/remove`;
app.post(removeEquipmentPath, (req: Request, res: Response) => {
    rh.successResponse(res, {
        "status": "removeCharacterClassPath"
    });
});

const addUserPath: string = `${baseApiPath}/user/add`;
app.post(addUserPath, (req: Request, res: Response) => addUser(req, res));

const loginUserPath: string = `${baseApiPath}/user/login`;
app.post(loginUserPath, (req: Request, res: Response) => loginUser(req, res));

const userDetailsPath: string = `${baseApiPath}/users/:id`;
app.get(userDetailsPath, requireAuthentication, (req: Request, res: Response) => getUserDetails(req, res));

// FIXME this needs to be removed prior to release
app.get('/test/async/:message', (req: Request, res: Response) => {
    requestTest(req.params.message);
    res.status(200).json({"status": "Success!"});
});


async function initializeDatabase() {
    const freshStart: boolean = JSON.parse(process.env.FRESH_START as string) ?? false;

    if(freshStart) {
        console.log(`Dropping existing database tables`);
        const freshStartTables: string =
            `DROP TABLE IF EXISTS User, Player_Character, Race, Stats, Character_Class,
                Character_Image, Equipment_Type, Equipment`;
        await db.query(freshStartTables);
    }


    const createUserTable: string =
    `CREATE TABLE IF NOT EXISTS User(
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(60) NOT NULL,
        type VARCHAR(10) NOT NULL)`;
    await db.query(createUserTable);

    const createPlayerCharacterTable: string =
    `CREATE TABLE IF NOT EXISTS Player_Character(
        id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        owner_id MEDIUMINT UNSIGNED NOT NULL,
        class_id MEDIUMINT UNSIGNED NOT NULL,
        race_id MEDIUMINT UNSIGNED NOT NULL,
        stats_id MEDIUMINT NOT NULL,
        name VARCHAR(255) NOT NULL,
        hitpoints INT NOT NULL,
        background TEXT,
        alignment VARCHAR(64) NOT NULL)`;
    await db.query(createPlayerCharacterTable);


    const createRaceTable: string =
    `CREATE TABLE IF NOT EXISTS Race(
        id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        owner_id MEDIUMINT UNSIGNED NOT NULL,
        stats_id MEDIUMINT UNSIGNED NOT NULL,
        name VARCHAR(64) NOT NULL,
        description VARCHAR(1024) NOT NULL)`;
    await db.query(createRaceTable);


    const createStatsTable: string =
    `CREATE TABLE IF NOT EXISTS Stats(
        id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        type_id MEDIUMINT NOT NULL,
        type_owner_id MEDIUMINT,
        strength INT NOT NULL,
        dexterity INT NOT NULL,
        constitution INT NOT NULL,
        intelligence INT NOT NULL,
        wisdom INT NOT NULL,
        charisma INT NOT NULL)`;
    await db.query(createStatsTable);

    const createCharacterClassTable: string =
    `CREATE TABLE IF NOT EXISTS Character_Class(
        id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        owner_id MEDIUMINT UNSIGNED NOT NULL,
        name VARCHAR(64) NOT NULL,
        stats_id MEDIUMINT NOT NULL,
        description VARCHAR(1024) NOT NULL,
        hit_die INT NOT NULL)`;
    await db.query(createCharacterClassTable);

    const createCharacterImageTable: string =
    `CREATE TABLE IF NOT EXISTS Character_Image(
        id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        owner_id MEDIUMINT UNSIGNED NOT NULL,
        pc_id MEDIUMINT UNSIGNED NOT NULL,
        image_name VARCHAR(64) NOT NULL,
        content_type VARCHAR(16) NOT NULL,
        image_data MEDIUMBLOB,
        thumbnail_data MEDIUMBLOB)`;
    await db.query(createCharacterImageTable);


    const createEquipmentTypeTable: string =
    `CREATE TABLE IF NOT EXISTS Equipment_Type(
        id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(64) NOT NULL)`;
    await db.query(createEquipmentTypeTable);

    const createEquipmentTable: string =
    `CREATE TABLE IF NOT EXISTS Equipment(
        id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        owner_id MEDIUMINT UNSIGNED NOT NULL,
        name VARCHAR(64) NOT NULL,
        type MEDIUMINT NOT NULL,
        description VARCHAR(1024) NOT NULL,
        cost INT UNSIGNED NOT NULL)`;
    await db.query(createEquipmentTable);

    console.log(`Database Initialization complete`)
}

async function initializeAPI() {
    await initializeDatabase();
    await initializeAsyncController();
    await initializeRateLimiting();

    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}.`);
    });
}

initializeAPI();
