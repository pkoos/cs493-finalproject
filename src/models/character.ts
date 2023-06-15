import { DatabaseModel } from './database-model';
import { Stats } from './stats';
import { db } from "..";

export class Character extends DatabaseModel<Character> {
    id: number = -1;
    owner_id: number = -1;
    class_id: number = -1;
    race_id: number = -1;
    name: string = "";
    hitpoints: number = -1;
    stats_id: number = -1;
    background: string = "";
    alignment: string = "";

    tableName = "Player_Character";
    public constructor(init?: Partial<Character>) {
        super();
        Object.assign(this, init);
    }

    isValid(): boolean {
        const valid: boolean =
            this.owner_id != undefined && this.owner_id != -1 &&
            this.class_id != undefined && this.class_id != -1 &&
            this.race_id != undefined && this.race_id != -1 &&
            this.stats_id != undefined && this.stats_id != -1 &&
            this.name != undefined && this.name != "" &&
            this.hitpoints != undefined && this.hitpoints != -1 &&
            this.background != undefined && this.background != "" &&
            this.alignment != undefined && this.alignment != "";
        return valid;
    }

    fromDatabase(data: any[]): Character {
        const db_data: any = data[0];
        this.id = db_data.id;
        this.owner_id = db_data.owner_id;
        this.class_id = db_data.class_id;
        this.race_id = db_data.race_id;
        this.stats_id = db_data.stats_id;
        this.name = db_data.name;
        this.hitpoints = db_data.hitpoints;
        this.background = db_data.background;
        this.alignment = db_data.alignment;

        return this;
    }

    insertParams(): any[] {
        return [
            this.owner_id, this.name, this.class_id, this.race_id, this.hitpoints, this.stats_id,
            this.background, this.alignment
        ];
    }

    insertString(): string {
        return `(owner_id, name, class_id, race_id, hitpoints, stats_id, background, alignment)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    }

    updateString(): string {
        return `owner_id=?, name=?, class_id=?, race_id=?, hitpoints=?, stats_id=?,
            background=?, alignment=?`
    }

    async getPaginatedList(page: number, itemsPerPage: number) {
        let countString: string = `SELECT COUNT(*) AS count FROM ${this.tableName}`;
        let [count_results] = await db.query(countString);
        const max_page: number = Math.ceil((count_results as any)[0].count / itemsPerPage);
        page = page > max_page ? max_page : page;
        page = page < 1 ? 1 : page;

        const stats: Stats = new Stats();

        const queryString: string = `SELECT ${this.tableName}.id, name, class_id, race_id, hitpoints, background, alignment, strength, dexterity, constitution, intelligence, wisdom, charisma FROM ${this.tableName}, ${stats.tableName} WHERE ${this.tableName}.stats_id = ${stats.tableName}.id ORDER BY ${this.tableName}.id LIMIT ? OFFSET ?`;
        const offset: number = itemsPerPage * (page - 1);

        let [rawResults]: any[] = await db.query(queryString, [itemsPerPage, offset]);

        const results = rawResults.map((result: any) => { return {
            id: result.id,
            owner_id: result.owner_id,
            name: result.name,
            class_id: result.class_id,
            race_id: result.race_id,
            hitpoints: result.hitpoints,
            stats_id: result.stats_id,
            background: result.background,
            alignment: result.alignment,
            stats: {
                strength: result.strength,
                dexterity: result.dexterity,
                constitution: result.constitution,
                intelligence: result.intelligence,
                wisdom: result.wisdom,
                charisma: result.charisma
            }
        }});

        return {
            "current_page": page,
            "last_page": max_page,
            "page_size": itemsPerPage,
            "characters": results
        }
    }
}