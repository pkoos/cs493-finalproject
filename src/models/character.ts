import { DatabaseModel } from './database-model';

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
}