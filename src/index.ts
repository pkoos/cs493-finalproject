import express, {Express, Request, Response} from 'express';
import bodyParser from 'body-parser';
import mysql2, { Pool } from 'mysql2/promise';

const app: Express = express();
const port = process.env.PORT ?? 8000;

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

app.get('/test', (req: Request, res: Response) => {
    console.log("test complete");
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


app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}.`);
});


initializeDatabase();