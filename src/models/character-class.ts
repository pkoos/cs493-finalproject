import { DatabaseModel } from "./database-model";

export class CharacterClass extends DatabaseModel<CharacterClass> {
    id: number = -1;
    name: string = "";
    bonus_stats: number[] = [];
    description: string = "";
    hit_die: number = -1;

    tableName = "Character_Class";
    public constructor(init?: Partial<CharacterClass>) {
        super();
        Object.assign(this, init);
    }

    isValid(): boolean {
        const valid: boolean = 
            this.name != undefined && this.name != "" &&
            this.bonus_stats != undefined && this.bonus_stats.length != 0 &&
            this.description != undefined && this.description != "" &&
            this.hit_die != undefined && this.hit_die != -1;
        return valid;
    }

    fromDatabase(data: any[]): CharacterClass {
        const db_class: any = data[0];
        const charClass: CharacterClass = new CharacterClass({
            id: db_class.id,
            name: db_class.name,
            bonus_stats: db_class.bonus_stats,
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
        return [this.name, this.bonus_stats, this.description, this.hit_die];
    }

    insertString(): string {
        return `(name, bonus_stats, description, hit_die) VALUES(?, ?, ?, ?)`;
    }

    updateString(): string {
        return `name=?, bonus_stats=?, description=?, hit_die=?`;
    }
}
