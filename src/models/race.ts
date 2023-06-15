import { Stats } from "./stats";
import { CsvGeneration, DatabaseModel } from "./database-model";

export class Race extends DatabaseModel<Race> implements CsvGeneration {
    id: number = -1;
    owner_id: number = -1;
    stats_id?: number = -1;
    name: string = "";
    description: string = "";

    tableName?: string = "Race";
    public constructor(init?: Partial<Race>) {
        super();
        Object.assign(this, init);
    }

    csvHeader(): string {
        return `id,owner_id,stats_id,name,description`;
    }
    toCSV(): string {
        return `${this.id},${this.owner_id},${this.stats_id},"${this.name}","${this.description}"`;
    }

    isValid(): boolean {
        const valid:boolean = 
            this.owner_id != undefined && this.owner_id != -1 &&
            this.stats_id != undefined && this.stats_id != -1 &&
            this.name != undefined && this.name != "" &&
            this.description != undefined && this.description != "";

        return valid;
    }

    fromDatabase(data: any[]): Race {
        const db_race: any = data[0];

        const race: Race = new Race({
            id: db_race.id,
            owner_id: db_race.owner_id,
            name: db_race.name,
            stats_id: db_race.stats_id,
            description: db_race.description
        });
        return race;
    }

    insertParams(): any[] {
        return [this.owner_id, this.stats_id, this.name, this.description];
    }

    insertString(): string {
        return `(owner_id, stats_id, name, description) VALUES(?, ?, ?, ?)`;
    }

    updateString(): string {
        return `owner_id, stats_id, name=?, description=?`;
    }

    responseJson(stats: Stats): Race {
        delete this.stats_id;
        delete this.tableName;
        
        Object.assign(this, stats.toResponseObject());
        return this;
    }
}