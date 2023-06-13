import { DatabaseModel } from './database-model';
import { Equipment } from './equipment'

export class Character extends DatabaseModel<Character> {
    id: number = -1;
    owner_id: number = -1;
    name: string = "";
    class_id: number = -1;
    race_id: number = -1;
    hitpoints: number = -1;
    raw_stats: number[] = [];
    mod_stats: number[] = [];
    background: string = "";
    alignment: string = "";
    description: string = "";
    inventory: Equipment[] = [];

    tableName = "Player_Character";
    public constructor(init?: Partial<Character>) {
        super();
        Object.assign(this, init);
    }

    isValid(): boolean {
        const valid: boolean = 
            this.owner_id != undefined && this.owner_id != -1 &&
            this.name != undefined && this.name != "" &&
            this.class_id != undefined && this.class_id != -1 &&
            this.race_id != undefined && this.race_id != -1 &&
            this.hitpoints != undefined && this.hitpoints != -1 &&
            this.raw_stats != undefined && this.raw_stats.length != 0 &&
            this.mod_stats != undefined && this.mod_stats.length != 0 &&
            this.background != undefined && this.background != "" &&
            this.alignment != undefined && this.alignment != "" &&
            this.inventory != undefined && this.inventory.length != 0;
            
        return valid;
    }
    
    fromDatabase(data: any[]): Character {
        const db_data: any = data[0];
        this.id = db_data.id;
        this.owner_id = db_data.owner_id;
        this.class_id = db_data.class_id;
        this.race_id = db_data.race_id;
        this.hitpoints = db_data.hitpoints;
        this.raw_stats = db_data.raw_stats;
        this.mod_stats = db_data.mod_stats;
        this.background = db_data.background;
        this.alignment = db_data.alignment;
        this.description = db_data.description;
        this.inventory = db_data.inventory;

        return this;
    }

    insertParams(): any[] {
        return [
            this.owner_id, this.name, this.class_id, this.race_id, this.hitpoints, this.raw_stats, 
            this.mod_stats, this.background, this.alignment, this.description
        ];
    }

    insertString(): string {
        return `(owner_id, class_id, race_id, hitpoints, raw_stats, mod_stats, background, alignment, inventory, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    }

    updateString(): string {
        return `owner_id=?, class_id=?, race_id=?, hitpoints=?, raw_stats=?,
            mod_stats=?, background=?, alignment=?, description=?, inventory=?`
    }
}