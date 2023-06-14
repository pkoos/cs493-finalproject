import { Stats } from "./stats";
import { DatabaseModel } from "./database-model";

export class CharacterClass extends DatabaseModel<CharacterClass> {
    id: number = -1;
    owner_id: number = -1;
    name: string = "";
    stats_id?: number = -1;
    description: string = "";
    hit_die: number = -1;

    tableName?: string = "Character_Class";
    public constructor(init?: Partial<CharacterClass>) {
        super();
        Object.assign(this, init);
    }

    isValid(): boolean {
        const valid: boolean = 
            this.name != undefined && this.name != "" &&
            this.owner_id != undefined && this.owner_id != -1 &&
            this.stats_id != undefined && this.stats_id != 1 &&
            this.description != undefined && this.description != "" &&
            this.hit_die != undefined && this.hit_die != -1;
        return valid;
    }

    fromDatabase(data: any[]): CharacterClass {
        const db_class: any = data[0];
        const charClass: CharacterClass = new CharacterClass({
            id: db_class.id,
            owner_id: db_class.owner_id,
            name: db_class.name,
            stats_id: db_class.stats_id,
            description: db_class.description,
            hit_die: db_class.hit_die
        });
        
        return charClass;
    }

    updateParams(): any[] {
        const params: any[] = this.insertParams();
        params.push(this.id);

        return params;
    }

    insertParams(): any[] {
        return [this.owner_id, this.name, this.stats_id, this.description, this.hit_die];
    }

    insertString(): string {
        return `(owner_id, name, stats_id, description, hit_die) VALUES(?, ?, ?, ?, ?)`;
    }

    updateString(): string {
        return `owner_id=?, name=?, stats_id=?, description=?, hit_die=?`;
    }

    responseJson(stats: Stats) {
        delete this.stats_id;
        delete this.tableName;

        Object.assign(this, stats.toResponseObject());
        return this;
    }
}
