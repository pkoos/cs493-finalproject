import express, {Express, Request, Response} from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import mysql2, { Pool } from 'mysql2/promise';
import { addUser, getUserDetails, loginUser } from './controllers/user-controller';
import { requireAuthentication } from './utils/auth-helper';
import * as rh from './utils/responses-helper';

import { initializeAsyncController, requestTest } from './controllers/async-controller';
import { initializeRateLimiting } from './utils/rate-limit-helper';

const app: Express = express();
const port = process.env.PORT ?? 8000;
const baseApiPath: string = "/api/v1";


export const db: Pool =  mysql2.createPool({
    connectionLimit: 10,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST ?? "localhost",
    port: 3306
});

app.use(bodyParser.urlencoded({
    extended: true
}));

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


const addRacePath: string = `${baseApiPath}/race/add`;
app.post(addRacePath, (req: Request, res: Response) => {
    rh.successResponse(res, {
        "status": "addRacePath"
    });
});

const modifyRacePath: string = `${baseApiPath}/race/modify`;
app.post(modifyRacePath, (req: Request, res: Response) => {
    rh.successResponse(res, {
        "status": "modifyRacePath"
    });
});

const removeRacePath: string = `${baseApiPath}/race/remove`;
app.post(removeRacePath, (req: Request, res: Response) => {
    rh.successResponse(res, {
        "status": "removeRacePath"
    });
});

const addCharacterClassPath: string = `${baseApiPath}/class/add`;
app.post(addCharacterClassPath, (req: Request, res: Response) => {
    rh.successResponse(res, {
        "status": "addCharacterClassPath"
    });
});

const modifyCharacterClassPath: string = `${baseApiPath}/class/modify`;
app.post(modifyCharacterClassPath, (req: Request, res: Response) => {
    rh.successResponse(res, {
        "status": "modifyCharacterClassPath"
    });
});

const removeCharacterClassPath: string = `${baseApiPath}/class/remove`;
app.post(removeCharacterClassPath, (req: Request, res: Response) => {
    rh.successResponse(res, {
        "status": "removeCharacterClassPath"
    });
});

const addCharacterImagePath: string = `${baseApiPath}/image/add`;
app.post(addCharacterImagePath, (req: Request, res: Response) => {
    rh.successResponse(res, {
        "status": "addCharacterImagePath"
    });
});

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
    const createUserTable: string =
    `CREATE TABLE IF NOT EXISTS User(
        id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(60) NOT NULL,
        type VARCHAR(10) NOT NULL)`;

    const createPlayerCharacterTable: string =
    `CREATE TABLE IF NOT EXISTS Player_Character(
        id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        owner_id MEDIUMINT UNSIGNED NOT NULL,
        name VARCHAR(255) NOT NULL,
        class_id MEDIUMINT UNSIGNED NOT NULL,
        race_id MEDIUMINT UNSIGNED NOT NULL,
        hitpoints INT NOT NULL,
        background VARCHAR(1024),
        alignment VARCHAR(64) NOT NULL,
        image_id MEDIUMINT UNSIGNED NOT NULL)`;

    const createRaceTable: string =
    `CREATE TABLE IF NOT EXISTS Race(
        id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        owner_id MEDIUMINT UNSIGNED NOT NULL,
        name VARCHAR(64) NOT NULL,
        description VARCHAR(1024) NOT NULL)`;

    const createStatTable: string =
    `CREATE TABLE IF NOT EXISTS Stat(
        id MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(16) NOT NULL,
        value INT NOT NULL)`;

    const createCharacterClassTable: string =
    `CREATE TABLE IF NOT EXISTS Character_Class(
        ID MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        owner_id MEDIUMINT UNSIGNED NOT NULL,
        name VARCHAR(64) NOT NULL,
        description VARCHAR(1024) NOT NULL,
        hit_die INT NOT NULL)`;

    const createCharacterImageTable: string =
    `CREATE TABLE IF NOT EXISTS Character_Image(
        ID MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        owner_id MEDIUMINT UNSIGNED NOT NULL,
        pc_id MEDIUMINT UNSIGNED NOT NULL,
        image_name VARCHAR(64) NOT NULL,
        content_type VARCHAR(16) NOT NULL,
        image_data MEDIUMBLOB,
        thumbnail_data MEDIUMBLOB)`;

    const createEquipmentTypeTable: string =
    `CREATE TABLE IF NOT EXISTS Equipment_Type(
        ID MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(64) NOT NULL)`;

    const createEquipmentTable: string =
    `CREATE TABLE IF NOT EXISTS Equipment(
        ID MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        owner_id MEDIUMINT UNSIGNED NOT NULL,
        name VARCHAR(64) NOT NULL,
        type MEDIUMINT NOT NULL,
        description VARCHAR(1024) NOT NULL,
        cost INT UNSIGNED NOT NULL)`;

    await db.query(createUserTable);
    await db.query(createPlayerCharacterTable);
    await db.query(createRaceTable);
    await db.query(createStatTable);
    await db.query(createCharacterClassTable);
    await db.query(createCharacterImageTable);
    await db.query(createEquipmentTypeTable);
    await db.query(createEquipmentTable);
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
