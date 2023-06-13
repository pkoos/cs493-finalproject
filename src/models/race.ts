import { DatabaseModel } from "./database-model";

export class Race extends DatabaseModel<Race> {
    id: number = -1;
    name: string = "";
    bonus_stats: number[] = [];
    description: string = "";

    tableName: string = "Race";
    public constructor(init?: Partial<Race>) {
        super();
        Object.assign(this, init);
    }

    isValid(): boolean {
        const valid:boolean = this.name != undefined && this.name != "" &&
        this.bonus_stats != undefined && this.bonus_stats.length != 0 &&
        this.description != undefined && this.description != "";

        return valid;
    }

    fromDatabase(data: any[]): Race {
        const db_race: any = data[0];

        const race: Race = new Race({
            id: db_race.id,
            name: db_race.name,
            bonus_stats: db_race.bonus_stats,
            description: db_race.description
        });
        return race;
    }

    insertParams(): any[] {
        return [this.name, this.bonus_stats, this.description];
    }

    insertString(): string {
        return `(name, bonus_stats, description) VALUES(?, ?, ?)`;
    }

    updateString(): string {
        return `name=?, bonus_stats=?, description=?`;
    }
}