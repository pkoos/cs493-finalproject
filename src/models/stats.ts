import { DatabaseModel } from "./database-model";

export class Stats extends DatabaseModel<Stats> {

    id: number = -1;
    type_id: number = -1;
    type_owner_id?: number = -1;
    strength: number = -1;
    dexterity: number = -1;
    constitution: number = -1;
    intelligence: number = -1;
    wisdom: number = -1;
    charisma: number = -1;

    public constructor(init?: Partial<Stats>) {
        super();
        Object.assign(this, init);
    }
    tableName: string = "Stats";

    isValid(): boolean {
        const valid: boolean =
            this.id != undefined && this.id != -1 &&
            this.type_id != undefined && this.type_id != -1 &&
            this.strength != undefined && this.strength != -1 &&
            this.dexterity != undefined && this.dexterity != -1 &&
            this.constitution != undefined && this.constitution != -1 &&
            this.intelligence != undefined && this.intelligence != -1 &&
            this.wisdom != undefined && this.wisdom != -1 &&
            this.charisma != undefined && this.charisma != -1;
        
        return valid;
    }

    fromDatabase(data: any[]): Stats {
        const db_data: any = data[0];
        const stats: Stats = new Stats({
            id: db_data.id,
            type_id: db_data.type_id,
            type_owner_id: db_data.type_owner_id,
            strength: db_data.strength,
            dexterity: db_data.dexterity,
            constitution: db_data.constitution,
            intelligence: db_data.intelligence,
            wisdom: db_data.wisdom,
            charisma: db_data.charisma
        });
        
        return stats;
    }

    insertParams(): any[] {
        return [this.type_id, this.type_owner_id, this.strength, this.dexterity, this.constitution, this.intelligence, this.wisdom, this.charisma];
    }

    insertString(): string {
        return `(type_id, type_owner_id, strength, dexterity, constitution, intelligence, wisdom, charisma)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
    }

    updateString(): string {
        return `type_id=?, type_owner_id=?, strength=?, dexterity=?, constitution=?, intelligence=?, wisdom=?, charisma=?`;
    }

    toResponseObject() {
        return {
            stats: {
                strength: this.strength,
                dexterity: this.dexterity,
                constitution: this.constitution,
                intelligence: this.intelligence,
                wisdom: this.wisdom,
                charisma: this.charisma
            }
            
        }
    }

}

export enum StatsType {
    Character = 1,
    Race,
    Class
}